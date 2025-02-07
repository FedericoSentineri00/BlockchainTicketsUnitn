const OrganizerManager = artifacts.require("Organizer_manager");
const TicketNFT = artifacts.require("Ticket_NFT");
const Marketplace = artifacts.require("Marketplace"); 


module.exports = async function(deployer) {
  
  //organization account
  const organizations = [
    { address: "0xBd4c95037Af089237722e5302F6cAE9B91565956", name: "Sony" },
    { address: "0xe0c25ff0D073304634033081b7d4b9d40a165F8f", name: "Universal" }
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
