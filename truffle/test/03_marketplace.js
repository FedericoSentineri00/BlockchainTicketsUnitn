const TicketNFT = artifacts.require("Ticket_NFT");
const Marketplace2 = artifacts.require("Marketplace2");
const OrganizerManager = artifacts.require("Organizer_manager");

contract("Marketplace", (accounts) => {
  const [admin, organizer, seller, buyer, unauthorized] = accounts;

  let ticketNFT;
  let marketplace;

  describe("Deployment and Setup", () => {
    before(async () => {
      // Deploy Ticket_NFT e Marketplace
      organizerManager = await OrganizerManager.new({ from: admin });
    
      // creazione di un'organizzazione e recupero Ticket_NFT
      await organizerManager.create_organization("Test Organization", organizer, { from: admin });
      ticketNFTAddress = await organizerManager.getTicketNFT(organizer);

      // collegamento Ticket_NFT per i test
      ticketNFT = await TicketNFT.at(ticketNFTAddress);
      marketplace = await Marketplace2.new({ from: admin });
      console.log("Contract marketplace",marketplace.address);
      // Crea un evento, settore e biglietto per i test
      await ticketNFT.createEvent("Test Event", Math.floor(Date.now() / 1000), { from: organizer });
      await ticketNFT.createSector(1, "General Admission", 100, 10, { from: organizer });
      await ticketNFT.createTicket(1, 1, web3.utils.toWei("1", "ether"), { from: organizer });
      // Assegna il biglietto al venditore
      await ticketNFT.updateTicketStatus(1, 1, { from: organizer });

    });

    it("Should deploy Marketplace and set roles correctly", async () => {
      assert.isTrue(!!marketplace.address, "Marketplace contract was not deployed");
    });
  });


  
  describe("Listing Tickets for Sale", () => {
    // Lista un biglietto in vendita
    it("Should allow a ticket owner to list a ticket for sale", async () => {
      await ticketNFT.addOrganizer(marketplace.address, { from: organizer });
      await marketplace.sellTicket(ticketNFT.address, 1, { from: organizer });

      const listing = await marketplace.listings(1);
      assert.equal(listing.ticketId, 1, "Ticket ID is incorrect");
      assert.equal(listing.price, web3.utils.toWei("1", "ether"), "Price is incorrect");
      assert.equal(listing.seller, organizer, "Seller address is incorrect");

      // Verifica lo stato del ticket
      const ticket = await ticketNFT.getTicket(1);
      assert.equal(ticket.status, 0, "Ticket status was not updated to Available");
    });

    // Un utente non proprietario prova a mettere in vendita un biglietto
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
    // Compra un biglietto messo in vendita
    it("Should allow a user to purchase a listed ticket", async () => {
      const sellerBalanceWei = await web3.eth.getBalance(organizer);
      const readableBalance = web3.utils.fromWei(sellerBalanceWei, 'ether');
      console.log("Seller's balance in Ether:", readableBalance);

      const tx=await marketplace.buyTicket(1, "eddie", "veronese", { from: buyer, value: web3.utils.toWei("2", "ether") });
      console.log("Transaction logs:", tx.logs);
      //const listing = await marketplace.listings(1);
      //assert.equal(listing.status, 1, "Listing status was not updated to Sold");

      // Verifica che il biglietto sia stato trasferito
      const ticketBalance = await ticketNFT.balanceOf(buyer, 1);
      assert.equal(ticketBalance.toNumber(), 1, "Ticket was not transferred to buyer");

      // Verifica che il venditore abbia ricevuto il pagamento
      const finalBalance = web3.utils.toBN(await web3.eth.getBalance(seller));
      assert.equal(finalBalance.sub(initialBalance).toString(), web3.utils.toWei("2", "ether"), "Seller did not receive payment");
    });

    // Prova ad acquistare un biglietto con un importo insufficiente
    it("Should not allow purchase with insufficient payment", async () => {
      try {
        await marketplace.buyTicket(1, "eddie", "veronese", { from: buyer, value: web3.utils.toWei("1", "ether") });
        assert.fail("Purchase succeeded with insufficient payment");
      } catch (err) {
        assert.include(err.message, "revert", "Error message does not contain revert");
      }
    });
  });
  /*
  describe("Removing Listings", () => {
    before(async () => {
      // Lista nuovamente il biglietto per questo test
      await ticketNFT.safeTransferFrom(buyer, seller, 1, 1, "0x0", { from: buyer });
      await marketplace.sellTicket(ticketNFT.address, 1, web3.utils.toWei("2", "ether"), { from: seller });
    });

    // Rimuovi una vendita da parte del venditore
    it("Should allow the seller to remove their listing", async () => {
      await marketplace.cancelListing(1, { from: seller });

      const listing = await marketplace.listings(1);
      assert.equal(listing.status, 2, "Listing status was not updated to Canceled");

      // Verifica che lo stato del biglietto sia stato aggiornato
      const ticket = await ticketNFT.getTicket(1);
      assert.equal(ticket.status, 1, "Ticket status was not updated to Owned");
    });

    // Un utente non autorizzato tenta di rimuovere una vendita
    it("Should not allow unauthorized users to remove a listing", async () => {
      try {
        await marketplace.cancelListing(1, { from: unauthorized });
        assert.fail("Unauthorized user was able to remove a listing");
      } catch (err) {
        assert.include(err.message, "revert", "Error message does not contain revert");
      }
    });
  });

  describe("Edge Cases", () => {
    // Prova a mettere in vendita un biglietto già venduto
    it("Should not allow listing a sold ticket", async () => {
      await ticketNFT.safeTransferFrom(seller, buyer, 1, 1, "0x0", { from: seller });

      try {
        await marketplace.sellTicket(ticketNFT.address, 1, web3.utils.toWei("2", "ether"), { from: seller });
        assert.fail("Allowed listing of a sold ticket");
      } catch (err) {
        assert.include(err.message, "revert", "Error message does not contain revert");
      }
    });
  });
  */
});
