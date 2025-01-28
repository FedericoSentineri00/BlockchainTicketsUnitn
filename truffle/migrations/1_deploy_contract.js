const OrganizerManager = artifacts.require("Organizer_manager");
const TicketNFT = artifacts.require("Ticket_NFT");
const Marketplace2 = artifacts.require("Marketplace2"); 


module.exports = async function(deployer) {
  await deployer.deploy(OrganizerManager);
  const organizerManager = await OrganizerManager.deployed();

  await deployer.deploy(TicketNFT, "MyOrganization", organizerManager.address);
  const ticketNFT = await TicketNFT.deployed();

  await deployer.deploy(Marketplace2);
};
