
const OrganizerManager = artifacts.require("Organizer_manager");
const TicketNFT = artifacts.require("Ticket_NFT");
const { BN, expectRevert } = require("@openzeppelin/test-helpers");
const assert = require("assert");

contract("Organizer_manager", (accounts) => {
    
    const [admin, organizer1, organizer2, nonAdmin] = accounts;

    let organizerManager;

    beforeEach(async () => {
        // deploy the contract before each test
        organizerManager = await OrganizerManager.new({ from: admin });
    });
    
    describe("Access Control", () => {
        // Crea una nuova oraganizzazioen con da parte di un admin e controlla
        // che l'address non sia zero
        it("Should allow only admin to create an organization", async () => {
            const name = "Organization 1";

            await organizerManager.create_organization(name, organizer1, { from: admin });

            const nftAddress = await organizerManager.getTicketNFT(organizer1);
            assert.notStrictEqual(nftAddress, "0x0000000000000000000000000000000000000000", "NFT address should not be zero address");
        });
        // Crea una nuova oraganizzazioen con da parte di un admin -> deve fallire e ritorna revert 
        it("Should revert when non-admin tries to create an organization", async () => {
            const name = "Organization 1";

            await expectRevert(
                organizerManager.create_organization(name, organizer1, { from: nonAdmin }),
                "revert"
            );
        });
    });

    describe("Create Organization", () => {
        // crea un'organizzazione e controlla che l'address non sia 0 e che sia stata creata con id 0
        it("should create an organization and store NFT correctly", async () => {
            const name = "Org 1";

            await organizerManager.create_organization(name, organizer1, { from: admin });

            const nftAddress = await organizerManager.getTicketNFT(organizer1);
            assert.notStrictEqual(nftAddress, "0x0000000000000000000000000000000000000000", "NFT address should not be zero address");

            const orgAddress = await organizerManager.getOrganizationAddress(0);
            assert.strictEqual(orgAddress, organizer1, "Organizer address should match the stored address");
        });
        //creo due organizzazioni e controllo che l'id venga incrementato prendendo le organizzazioni
        // corrispondenti e controllando che siano corrette
        it("should increment nextNFTId after each organization creation", async () => {
            const name1 = "Org 1";
            const name2 = "Org 2";

            await organizerManager.create_organization(name1, organizer1, { from: admin });
            await organizerManager.create_organization(name2, organizer2, { from: admin });

            const org1Address = await organizerManager.getOrganizationAddress(0);
            const org2Address = await organizerManager.getOrganizationAddress(1);

            assert.strictEqual(org1Address, organizer1, "First organization should match the first organizer");
            assert.strictEqual(org2Address, organizer2, "Second organization should match the second organizer");
        });
        //creo due organizzazioni con lo stesso adress e controllo che la seconda restituisca revert
        it("should revert if an organization is created for the same address twice", async () => {
            const name = "Org 1";

            await organizerManager.create_organization(name, organizer1, { from: admin });

            await expectRevert(
                organizerManager.create_organization(name, organizer1, { from: admin }),
                "revert"
            );
        });
    });

    describe("Getter Functions", () => {
        // creo un'organizzazione e chiamo getTicketNFT per ottenere address dell'nft, non deve essere 0
        it("should return the correct TicketNFT address for an organizer", async () => {
            const name = "Org 1";

            await organizerManager.create_organization(name, organizer1, { from: admin });

            const nftAddress = await organizerManager.getTicketNFT(organizer1);
            assert.notStrictEqual(nftAddress, "0x0000000000000000000000000000000000000000", "NFT address should not be zero address");
        });
        // creo un'organizzazione e chiamo getOrganizationAddress, l'address 
        //deve essere quello originario
        it("should return the correct organizer address for a given ID", async () => {
            const name = "Org 1";

            await organizerManager.create_organization(name, organizer1, { from: admin });

            const orgAddress = await organizerManager.getOrganizationAddress(0);
            assert.strictEqual(orgAddress, organizer1, "Organization address for ID 0 should match organizer1");
        });
        // chiamo getOrganizationAddress e getTicketNFT su organizzazioni non esistenti
        // e resituisce revert
        it("should return address(0) for non-existent IDs or organizers", async () => {
            const invalidOrgAddress = await organizerManager.getOrganizationAddress(99);
            assert.strictEqual(invalidOrgAddress, "0x0000000000000000000000000000000000000000", "Non-existent ID should return address(0)");

            const invalidNftAddress = await organizerManager.getTicketNFT(organizer2);
            assert.strictEqual(invalidNftAddress, "0x0000000000000000000000000000000000000000", "Non-existent organizer should return address(0)");
        });
    });
    
    describe("Integration with Ticket_NFT", () => {
        //creo un'organizzazione e controllo che i dati siano giusti chiamando la funzione 
        //ticket details da ticket nft
        it("should create a Ticket_NFT contract with correct parameters", async () => {
            const name = "Org 1";

            await organizerManager.create_organization(name, organizer1, { from: admin });

            const nftAddress = await organizerManager.getTicketNFT(organizer1);
            const nftContract = await TicketNFT.at(nftAddress);
            const contractName = await nftContract.organization_name();
            //console.log("name: ", contractName);

            assert.strictEqual(contractName, name, "NFT name should match the organization name");
            
        });
    });
    
    describe("Edge Cases", () => {
        //creo molte organizzazioni e controllo che ognuna venga creata con il giusto 
        //organizzatore prendendo i dati dal ticket nft
        it("should handle a large number of organizations", async () => {
            for (let i = 0; i < 10; i++) {
                const name = `Org ${i}`;
                const organizer = accounts[i % accounts.length];
                //console.log("Organizer original", organizer);

                await organizerManager.create_organization(name, organizer, { from: admin });

                const nftAddress = await organizerManager.getTicketNFT(organizer);
                const nftContract = await TicketNFT.at(nftAddress);
                const contractName = await nftContract.organization_name();
                //console.log("name: ", contractName);
                //console.log("Organizer taken", result[1]);
                assert.strictEqual(contractName, name, `Organizer for ID ${i} should match the expected organizer`);
            }
        });
        //crea un'organizzazione passando address 0 e deve restituire revert
        it("should revert when creating an organization with address(0)", async () => {
            const name = "Invalid Org";

            await expectRevert(
                organizerManager.create_organization(name, "0x0000000000000000000000000000000000000000", { from: admin }),
                "revert"
            );
        });
        
    });
    
}); 
