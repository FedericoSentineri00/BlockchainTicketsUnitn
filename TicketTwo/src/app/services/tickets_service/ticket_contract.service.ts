// contract.service.ts
import { Injectable } from '@angular/core';
import { Contract, ethers } from 'ethers';

const contractABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "organizer",
				"type": "address"
			}
		],
		"name": "OrganizerAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "organizer",
				"type": "address"
			}
		],
		"name": "OrganizerRemoved",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "eventName",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "eventDate",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address payable",
				"name": "oldOwner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address payable",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "TicketBought",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "eventName",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "eventDate",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address payable",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "TicketCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "isForSale",
				"type": "bool"
			}
		],
		"name": "TicketForSale",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_organizer",
				"type": "address"
			}
		],
		"name": "addOrganizer",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
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
				"name": "_eventName",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_eventDate",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_price",
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
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "getTicketDetails",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
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
		"name": "owner",
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
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "removeFromSale",
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
				"name": "_id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_price",
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
				"internalType": "string",
				"name": "eventName",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "eventDate",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"internalType": "address payable",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "isForSale",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
const contractAddress = '0x790c80fee43f19b98e51de3f4525ff3c6f8c0713';


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
  
    async createTicket(eventName: string, eventDate: number, price: number): Promise<number> {

		const tx = await this.contract['createTicket'](eventName, eventDate, price);
	
		const receipt = await tx.wait(); 

		if (receipt.logs.length > 0) {

			const iface = new ethers.Interface(contractABI);

			const decodedLog = iface.parseLog(receipt.logs[0]);

			if (decodedLog  && decodedLog.name === 'TicketCreated') {
				const ticketId = decodedLog.args[0]; 
				const eventName = decodedLog.args[1]; 
				const eventDate = decodedLog.args[2]; 
				const price = decodedLog.args[3]; 
				const owner = decodedLog.args[4]; 

				console.log('Ticket ID:', ticketId.toString()); 
				console.log('Event Name:', eventName);
				console.log('Event Date:', eventDate.toString());
				console.log('Price:', price.toString());
				console.log('Owner:', owner);

				return ticketId;
			} else {
				console.error("Event is not ticketcreated");
			}
		} else {
			console.error("Receipt log not found");
		}
	
		throw new Error("Impossible to found ticketcreated event.");
	}
  
    async buyTicket(ticketId: number): Promise<void> {
        const tx = await this.contract['buyTicket'](ticketId, { value: ethers.parseEther("1.0") }); // Sostituisci con il prezzo reale
        await tx.wait(); // Aspetta che la transazione venga completata
      }
    
      // Funzione per ottenere i dettagli di un biglietto
      async getTicketDetails(ticketId: number): Promise<{ id: number, eventName: string, eventDate: number, price: number, owner: string, isForSale: boolean }> {
        const details = await this.contract['getTicketDetails'](ticketId);
        return {
          id: details[0].toString(),
          eventName: details[1],
          eventDate: details[2].toString(),
          price: details[3].toString(),
          owner: details[4],
          isForSale: details[5],
        };
      }
    

      async getTicketCount(): Promise<number> {
        const count = await this.contract['ticketCount']();
        return count;
      }
    

      async addOrganizer(organizerAddress: string): Promise<void> {
        const tx = await this.contract['addOrganizer'](organizerAddress);
        await tx.wait(); 
      }
    

      async removeOrganizer(organizerAddress: string): Promise<void> {
        const tx = await this.contract['removeOrganizer'](organizerAddress);
        await tx.wait(); 
      }
    

      async isOrganizer(organizerAddress: string): Promise<boolean> {
        return await this.contract['organizers'](organizerAddress);
      }
    

      async removeFromSale(ticketId: number): Promise<void> {
        const tx = await this.contract['removeFromSale'](ticketId);
        await tx.wait(); 
      }
    

      async sellTicket(ticketId: number, price: number): Promise<void> {
        const tx = await this.contract['sellTicket'](ticketId, price);
        await tx.wait(); 
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
  }
  