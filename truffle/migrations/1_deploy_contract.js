const OrganizerManager = artifacts.require("Organizer_manager");
const TicketNFT = artifacts.require("Ticket_NFT");
const Marketplace = artifacts.require("Marketplace"); 


module.exports = async function(deployer) {
  
  //organization account
  const organizations = [
    { address: "0xe216C3783E1C6a57E6dd11bB6c23e33b54B08e5e", name: "Sony" },
    { address: "0xb9668E5c98e1aedF432BB195F15558D303554ab3", name: "Universal" }
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
