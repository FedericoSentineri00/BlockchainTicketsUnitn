const TicketNFT = artifacts.require("Ticket_NFT");
const Marketplace = artifacts.require("Marketplace");
const OrganizerManager = artifacts.require("Organizer_manager");

contract("Marketplace", (accounts) => {
  const [admin, organizer, seller, buyer, unauthorized] = accounts;

  let ticketNFT;
  let marketplace;

  describe("Deployment and Setup", () => {
    before(async () => {

      // Crea organizzazione, ticket nft e marketplace
      organizerManager = await OrganizerManager.new({ from: admin });
      await organizerManager.create_organization("Test Organization", organizer, { from: admin });
      ticketNFTAddress = await organizerManager.getTicketNFT(organizer);


      ticketNFT = await TicketNFT.at(ticketNFTAddress);
      marketplace = await Marketplace.new({ from: admin });
      console.log("Contract marketplace",marketplace.address);
      // Crea un biglietto per i test
      await ticketNFT.createEvent("Test Event", Math.floor(Date.now() / 1000), { from: organizer });
      await ticketNFT.createSector(1, "General Admission", 100, 10, { from: organizer });
      await ticketNFT.createTicket(1, 1, web3.utils.toWei("1", "ether"), { from: organizer });
      // Cambia stato ticket per poterlo mettere in vendita
      await ticketNFT.updateTicketStatus(1, 1, { from: organizer });

    });

    it("Should deploy Marketplace and set roles correctly", async () => {
      assert.isTrue(!!marketplace.address, "Marketplace contract was not deployed");
    });
  });


  
  describe("Listing Tickets for Sale", () => {
    // Metti un biglietto in vendita e controlla il suo stato
    it("Should allow a ticket owner to list a ticket for sale", async () => {
      await ticketNFT.addOrganizer(marketplace.address, { from: organizer });
      await marketplace.sellTicket(ticketNFT.address, 1, { from: organizer });

      const listing = await marketplace.listings(1);
      assert.equal(listing.ticketId, 1, "Ticket ID is incorrect");
      assert.equal(listing.price, web3.utils.toWei("1", "ether"), "Price is incorrect");
      assert.equal(listing.seller, organizer, "Seller address is incorrect");

      const ticket = await ticketNFT.getTicket(1);
      assert.equal(ticket.status, 0, "Ticket status was not updated to Available");
    });

    // Un utente non proprietario prova a mettere in vendita un biglietto e fallisce
    it("Should not allow non-owners to list tickets for sale", async () => {
      try {
        await marketplace.sellTicket(ticketNFT.address, 1, { from: unauthorized });
        assert.fail("Unauthorized user was able to list a ticket for sale");
      } catch (err) {
        assert.include(err.message, "revert", "Error message does not contain revert");
      }
    });
  });

  
  describe("Purchasing Tickets", () => {
    // Prova ad acquistare un biglietto con un importo insufficiente e fallisce
    it("Should not allow purchase with insufficient payment", async () => {
      try {
        await marketplace.buyTicket(1, "eddie", "veronese", { from: buyer, value: web3.utils.toWei("0.9", "ether") });
        assert.fail("Purchase succeeded with insufficient payment");
      } catch (err) {
        assert.include(err.message, "revert", "Error message does not contain revert");
      }
    });


    // Un utente buyer compra un biglietto messo in vendita da organizer e controlla lo status 
    it("Should allow a user to purchase a listed ticket", async () => {
    
      const sellerBalanceWei = await web3.eth.getBalance(organizer);
      const readableBalanceseller = web3.utils.fromWei(sellerBalanceWei, 'ether');
      console.log("Seller's balance in Ether:", readableBalanceseller);

      const buyerBalanceWei = await web3.eth.getBalance(buyer);
      const readableBalancebuyer = web3.utils.fromWei(buyerBalanceWei, 'ether');
      console.log("Buyer's balance in Ether:", readableBalancebuyer);
      
      await ticketNFT.setApprovalForAll(marketplace.address, true, { from: organizer });
      await ticketNFT.setApprovalForAll(buyer, true, { from: organizer });
      console.log("Permission set");
      
      await marketplace.buyTicket(1, "eddie", "veronese", { from: buyer, value: web3.utils.toWei("1", "ether") });
      console.log("Buy function ok");

      const listing = await marketplace.listings(1);
      assert.equal(listing.status, 1, "Listing status was not updated to Sold");
      console.log("Assert equal ok");

      // controlla se il buyer ha il biglietto
      const ticketBalance = await ticketNFT.balanceOf(buyer, 1);
      assert.equal(ticketBalance.toNumber(), 1, "Ticket was not transferred to buyer");


      // stampa tutti i balance
      const finalBalance = web3.utils.toBN(await web3.eth.getBalance(organizer));

      const sellerBalanceWeiafter = await web3.eth.getBalance(organizer);
      const readableBalanceafter = web3.utils.fromWei(sellerBalanceWeiafter, 'ether');
      console.log("Seller's balance in Ether after:", readableBalanceafter);

      const buyerBalanceWeiafter = await web3.eth.getBalance(buyer);
      const readableBalancebuyerafter = web3.utils.fromWei(buyerBalanceWeiafter, 'ether');
      console.log("Buyer's balance in Ether:", readableBalancebuyerafter);
      
      
    });
    
    
  });
  
  describe("Removing Listings", () => {
    before(async () => {

      await ticketNFT.createTicket(1, 1, web3.utils.toWei("1", "ether"), { from: organizer });
      await ticketNFT.updateTicketStatus(2, 1, { from: organizer });
      await marketplace.sellTicket(ticketNFT.address, 2, { from: organizer });
      console.log("Created new ticket");
    });

    // Un utente non autorizzato rimuove un biglietto messo in vendita e deve fallire
    it("Should not allow unauthorized users to remove a listing", async () => {
      try {
        await marketplace.removeFromSell(2, { from: unauthorized });
        assert.fail("Unauthorized user was able to remove a listing");
      } catch (err) {
        assert.include(err.message, "revert", "Error message does not contain revert");
      }
    });

    // Rimuovo un biglietto messo in vendita e si deve aggiornare il suo stato
    it("Should allow the seller to remove their listing", async () => {
      await marketplace.removeFromSell(2, { from: organizer });

      const listing = await marketplace.listings(2);
      assert.equal(listing.status, 1, "Listing status was not updated");

      // Verifica che lo stato del biglietto sia stato aggiornato
      const ticket = await ticketNFT.getTicket(2);
      assert.equal(ticket.status, 1, "Ticket status was not updated to Owned");
    });
    
    
  });
  
  describe("Edge Cases", () => {
    // Mette in vendita un biglietto, lo compra e poi prova a rimetterlo in vendita, deve fallire
    it("Should not allow listing a sold ticket", async () => {
      await marketplace.sellTicket(ticketNFT.address, 2, { from: organizer });
      await marketplace.buyTicket(3, "eddie", "veronese", { from: buyer, value: web3.utils.toWei("1", "ether") });
      try {
        await marketplace.sellTicket(ticketNFT.address, 2, { from: organizer });
        assert.fail("Allowed listing of a sold ticket");
      } catch (err) {
        assert.include(err.message, "revert", "Error message does not contain revert");
      }
    });
  });
  
});
