// contract.service.ts
import { Injectable } from '@angular/core';
import { Contract, ethers } from 'ethers';

const contractABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_ticketId",
				"type": "uint256"
			}
		],
		"name": "buyTicket",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_Time",
				"type": "uint256"
			}
		],
		"name": "createEvent",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_organizer",
				"type": "address"
			}
		],
		"name": "createOrganizer",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_eventId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_totalSeats",
				"type": "uint256"
			}
		],
		"name": "createSector",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_eventId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_sectorId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_originalPrice",
				"type": "uint256"
			}
		],
		"name": "createTicket",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_organizer",
				"type": "address"
			}
		],
		"name": "removeOrganizer",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_ticketId",
				"type": "uint256"
			}
		],
		"name": "sellTicket",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "eventCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "events",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "Time",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "organizer",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "sectorCount",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "fee",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_eventId",
				"type": "uint256"
			}
		],
		"name": "getEventDetails",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "Time",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "organizer",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "sectorCount",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_eventId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_sectorId",
				"type": "uint256"
			}
		],
		"name": "getSectorDetails",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "totalSeats",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "availableSeats",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_ticketId",
				"type": "uint256"
			}
		],
		"name": "getTicketDetails",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "eventId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "sectorId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "enum TicketReselling.TicketStatus",
				"name": "status",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "originalPrice",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "organizers",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "platformOwner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "ticketCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "tickets",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "eventId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "sectorId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "enum TicketReselling.TicketStatus",
				"name": "status",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "originalPrice",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
const contractAddress = '0x2763620c1aFF7Bffb7A0360Caf81740Bb804aE3d';
// https://sepolia.etherscan.io/address/0x2763620c1aff7bffb7a0360caf81740bb804ae3d

@Injectable({
  providedIn: 'root'
})

@Injectable({
    providedIn: 'root'
  })
  export class ContractService {
    private provider: ethers.BrowserProvider;
    private signer: Promise<ethers.JsonRpcSigner> | undefined;
    private contract: ethers.Contract;
  
    constructor() {
      // Initialize ethers provider and contract
      this.provider = new ethers.BrowserProvider((window as any).ethereum);
      this.contract = new ethers.Contract(contractAddress, contractABI, this.provider);

    // Listen for account changes
    (window as any).ethereum.on('accountsChanged', async (accounts: string[]) => {
      console.log('Account changed:', accounts[0]); // Log the new account
      await this.connect(); // Reconnect to the new account
    });
    }
  
    async connect() {
      // Request account access from MetaMask
      await this.provider.send("eth_requestAccounts", []);
      this.signer = this.provider.getSigner();
      this.contract = this.contract.connect(await this.signer) as Contract;
    }

	async getSignerAddress(): Promise<string> {
		if (!this.signer) {
		  throw new Error('Signer is not connected.'); // Gestisci l'errore
		}
		return (await this.signer).getAddress(); // Ottieni l'indirizzo del firmatario
	}
	
	getContractAddress(): string {
		return contractAddress; // Return the contract address
	}



	async createOrganizer(organizerAddress: string): Promise<void> {
		const tx = await this.contract['createOrganizer'](organizerAddress);
		await tx.wait();
		console.log(`Organizzatore creato: ${organizerAddress}`);
	}

	async removeOrganizer(organizerAddress: string): Promise<void> {
		const tx = await this.contract['removeOrganizer'](organizerAddress);
		await tx.wait();
		console.log(`Organizzatore rimosso: ${organizerAddress}`);
	}


	async createEvent(name: string, time: number): Promise<number> {
		const tx = await this.contract['createEvent'](name, time);
		const receipt = await tx.wait();
	
		const eventId = receipt.logs[0].args[0].toString();
		console.log(`Evento creato con ID: ${eventId}`);
		return parseInt(eventId);
	}


	async createSector(eventId: number, name: string, totalSeats: number): Promise<void> {
		const tx = await this.contract['createSector'](eventId, name, totalSeats);
		await tx.wait();
		console.log(`Settore creato per l'evento ${eventId}: ${name}`);
	}
	

	async createTicket(eventId: number, sectorId: number, originalPrice: number): Promise<void> {
		const tx = await this.contract['createTicket'](eventId, sectorId, originalPrice);
		await tx.wait();
		console.log(`Biglietto creato per l'evento ${eventId}, settore ${sectorId}`);
	}
  
	async buyTicket(ticketId: number, price: string): Promise<void> {
		const tx = await this.contract['buyTicket'](ticketId, { value: ethers.parseEther(price) });
		await tx.wait();
		console.log(`Biglietto acquistato con ID: ${ticketId}`);
	}
	
	  // Funzione per vendere un biglietto
	async sellTicket(ticketId: number): Promise<void> {
		const tx = await this.contract['sellTicket'](ticketId);
		await tx.wait();
		console.log(`Biglietto messo in vendita con ID: ${ticketId}`);
	}

	
	async getEventDetails(eventId: number): Promise<{ id: number, name: string, time: number, organizer: string, sectorCount: number }> {
		const details = await this.contract['getEventDetails'](eventId);  
		return {
			id: details[0].toString(),         
			name: details[1],
			time: details[2].toString(),       
			organizer: details[3],
			sectorCount: details[4].toString() 
		};
	}

	


	async getSectorDetails(eventId: number, sectorId:number): Promise<{ id: number, name: string, totalSeats: number, availableSeats: string}> {
		const details = await this.contract['getSectorDetails'](eventId, sectorId);  
		return {
			id: details[0].toString(),         
			name: details[1],
			totalSeats: details[2].toString(),       
			availableSeats: details[3].toString(),
		};
	}


	async getTicketDetails(ticketId: number): Promise<{ id: number, eventId: number, sectorId: number, owner: string, status: TicketStatus, originalPrice: number }> {
		const details = await this.contract['getTicketDetails'](ticketId);  
		return {
			id: details[0].toString(),
			eventId: details[1].toString(),
			sectorId: details[2].toString(),
			owner: details[3].toString(),
			status: details[4].toString(),
			originalPrice: details[5].toString(),
		};
	}

	  
  }

  enum TicketStatus { Available, Owned, Validated, Expired } 
  