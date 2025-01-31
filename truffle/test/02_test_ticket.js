const OrganizerManager = artifacts.require("Organizer_manager");
const TicketNFT = artifacts.require("Ticket_NFT");

contract("Ticket_NFT", (accounts) => {
  const [admin, organizer, user1, user2] = accounts;

  let organizerManager;
  let ticketNFTAddress;
  let ticketNFT;

  describe("Deployment and Setup", () => {
    before(async () => {
      // deploy contratto OrganizerManager
      organizerManager = await OrganizerManager.new({ from: admin });

      // creazione di un'organizzazione e recupero Ticket_NFT
      await organizerManager.create_organization("Test Organization", organizer, { from: admin });
      ticketNFTAddress = await organizerManager.getTicketNFT(organizer);

      // collegamento Ticket_NFT per i test
      ticketNFT = await TicketNFT.at(ticketNFTAddress);
    });
    // controlla che l'adress passato durante la creazione contratto sia admin e che organizzatore
    it("Should deploy OrganizerManager and set roles correctly", async () => {
      
      const adminRoleHash = web3.utils.keccak256("ADMIN_ROLE");
      const hasAdminRole = await ticketNFT.hasRole(adminRoleHash, organizer);

      const organizerRoleHash = web3.utils.keccak256("ORGANIZER_ROLE");
      const hasOrganizerRole = await ticketNFT.hasRole(organizerRoleHash, organizer);
      
      assert.isTrue(hasAdminRole, "Admin role not assigned correctly");
      assert.isTrue(hasOrganizerRole, "Organizer role not assigned correctly");
    });
    // crea un organizzazione da parte di un admin non autorizzato e dovrebbe fallire
    it("Should not allow unauthorized users to create organizations", async () => {
      try {
        await organizerManager.create_organization("Unauthorized Org", user1, { from: user1 });
        assert.fail("Unauthorized user was able to create an organization");
      } catch (err) {
        assert.include(err.message, "revert", "Error message does not contain revert");
      }
    });
  });

  describe("Event Management", () => {
    //crea un evento e recupera i dettagli, controlla che siano quelli di input
    it("Should create an event and retrieve details", async () => {
      await ticketNFT.createEvent("Concert 2025", Math.floor(Date.now() / 1000), { from: organizer });

      const event = await ticketNFT.getEvent(1);
      assert.equal(event.name, "Concert 2025", "Event name is incorrect");
      assert.equal(event.id, 1, "Event ID is incorrect");
    });
    // crea un evento da parte di un user non organizzatore e deve fallire
    it("Should not allow unauthorized users to create events", async () => {
      try {
        await ticketNFT.createEvent("Unauthorized Event", Math.floor(Date.now() / 1000), { from: user1 });
        assert.fail("Unauthorized user was able to create an event");
      } catch (err) {
        assert.include(err.message, "revert", "Error message does not contain revert");
      }
    });
  });


  describe("Sector Management", () => {
    //crea un settore e recupera i dettagli, controlla che siano quelli di input
    it("Should create a sector within an event", async () => {
      await ticketNFT.createSector(1, "VIP", 100, 10, { from: organizer });

      const sector = await ticketNFT.getSector(1, 1);
      assert.equal(sector.name, "VIP", "Sector name is incorrect");
      assert.equal(sector.totalSeats, 100, "Total seats are incorrect");
    });
    //crea un settore in un evento che non esiste e fallisce
    it("Should not allow creating sectors in non-existent events", async () => {
      try {
        await ticketNFT.createSector(999, "Nonexistent", 100, 10, { from: organizer });
        assert.fail("Sector created for non-existent event");
      } catch (err) {
        assert.include(err.message, "revert", "Error message does not contain revert");
      }
    });
  });

  
  describe("Ticket Management", () => {
    // crea un ticket, cambia lo stato a owned e gli assegna il posto e controlla che non sia vuoto 
    it("Should mint tickets and assign seats", async () => {
      await ticketNFT.createTicket(1, 1, web3.utils.toWei("1", "ether"), { from: organizer });

      const ticket = await ticketNFT.getTicket(1);
      assert.equal(ticket.eventId, 1, "Event ID is incorrect");
      assert.equal(ticket.sectorId, 1, "Sector ID is incorrect");

      // aggiorna lo stato del biglietto a owned
      await ticketNFT.updateTicketStatus(1, 1, { from: organizer });
      const ticketIds = [1];
      const seatAssignment = ["A1"];
      await ticketNFT.assignSeats(ticketIds, seatAssignment, { from: organizer });

      const updatedTicket = await ticketNFT.getTicket(1);
      assert.isNotEmpty(updatedTicket.seat, "Seat was not assigned to the ticket");
    });
    // crea un ticket da parte di un non organizzatore e deve fallire
    it("Should not allow unauthorized users to mint tickets", async () => {
      try {
        await ticketNFT.createTicket(1, 1, web3.utils.toWei("1", "ether"), { from: user1 });
        assert.fail("Unauthorized user was able to mint a ticket");
      } catch (err) {
        assert.include(err.message, "revert", "Error message does not contain revert");
      }
    });
  });

  //stesso utente si mette in stesso gruppo--------------------------------------------
  describe("Group Management", () => {
    // crea un gruppo, poi un crea un altro biglietto e lo aggiunge al gruppo
    it("Should create groups and manage tickets within the group", async () => {
      await ticketNFT.createGroup(1, { from: organizer });

      const groupTickets = await ticketNFT.getGroupTickets(1);

      assert.include(groupTickets.map((t) => t.toNumber()), 1, "Group does not contain the ticket");

      // Add a new ticket to the group
      await ticketNFT.createTicket(1, 1, web3.utils.toWei("1", "ether"), { from: organizer });
      await ticketNFT.updateTicketStatus(2, 1, { from: organizer });
      await ticketNFT.addParticipant(1, 2, { from: organizer });

      const updatedGroupTickets = await ticketNFT.getGroupTickets(1);
      assert.include(updatedGroupTickets.map((t) => t.toNumber()), 2, "Ticket was not added to the group");
    });
    //una persona non proprietaria del biglietto tenta di creare un gruppo ma fallisce
    it("Should not allow unauthorized users to create or modify groups", async () => {
      try {
        await ticketNFT.createGroup(1, { from: user1 });
        assert.fail("Unauthorized user was able to create a group");
      } catch (err) {
        assert.include(err.message, "revert", "Error message does not contain revert");
      }

      try {
        await ticketNFT.addParticipant(1, 1, { from: user1 });
        assert.fail("Unauthorized user was able to add a participant");
      } catch (err) {
        assert.include(err.message, "revert", "Error message does not contain revert");
      }
    });
  });

  
  describe("Ticket Expiration", () => {
    // mette tutti i ticket dell'evento 1 a expired e controlla lo stato del ticket
    it("Should expire tickets after an event", async () => {
      await ticketNFT.expireTickets(1, { from: organizer });

      const ticket = await ticketNFT.getTicket(1);
      assert.equal(ticket.status, 3, "Ticket status was not updated to Expired");
    });
    // mette tutti i ticket dell'evento 1 a expired, ma fallisce in quanto 
    // chiamato da un non organizzatore
    it("Should not allow unauthorized users to expire tickets", async () => {
      try {
        await ticketNFT.expireTickets(1, { from: user1 });
        assert.fail("Unauthorized user was able to expire tickets");
      } catch (err) {
        assert.include(err.message, "revert", "Error message does not contain revert");
      }
    });
  });

  
  describe("Edge Cases", () => {
    // crea un ticket con costo 0 e fallisce
    it("Should handle edge cases for ticket creation with cost 0", async () => {
      try {
        await ticketNFT.createTicket(1, 1, 0, { from: organizer });
        assert.fail("Allowed creation of ticket with price 0");
      } catch (err) {
        assert.include(err.message, "revert", "Error message does not contain revert");
      }
    });
  });
}); 
