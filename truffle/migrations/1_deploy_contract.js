const OrganizerManager = artifacts.require("Organizer_manager");
const TicketNFT = artifacts.require("Ticket_NFT");
const Marketplace = artifacts.require("Marketplace"); 


module.exports = async function(deployer) {
  
  //organization account
  const organizations = [
    { address: "0x18e096328D09C5FfAC5EB78508fa1D3dbac4e592", name: "Sony" },
    { address: "0xC7E9074f61a87D5A5e56229bF85B6fC201E8222b", name: "Universal" }
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
