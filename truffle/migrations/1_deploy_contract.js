const OrganizerManager = artifacts.require("Organizer_manager");
const TicketNFT = artifacts.require("Ticket_NFT");
const Marketplace = artifacts.require("Marketplace"); 


module.exports = async function(deployer) {
  
  //organization account
  const organizations = [
    { address: "0x5c94Cfe39Fe071515a79A97b2042f922396DB61D", name: "Sony" },
    { address: "0xAEa09F373DeA7ebF23113e74A35AB721C790dA0F", name: "Universal" }
  ];

  await deployer.deploy(OrganizerManager);
  const organizerManager = await OrganizerManager.deployed();

  //create organizations
  for (const org of organizations) {
    await organizerManager.create_organization(org.name, org.address);
    console.log(`Organization created: ${org.name}, organizer address: ${org.address}`);
  }

  //create organizations
  await deployer.deploy(Marketplace);
};
