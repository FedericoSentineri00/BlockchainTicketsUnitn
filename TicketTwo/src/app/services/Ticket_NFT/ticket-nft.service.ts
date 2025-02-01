import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { ConnectionService } from '../Connection/connection.service';
import { FactoryService } from '../Factory/factory.service';
import { EventDetails } from '../../classes/EventDetail';
import { SecotrDetails } from '../../classes/SectorDetails';


const contract_ticket_ABI = [{}];

@Injectable({
  providedIn: 'root'
})
export class TicketNFTService {
	
  	private contract: ethers.Contract | undefined;
	private contract_ticket_Address: string = '';

  	constructor(private connection: ConnectionService, private factoryService: FactoryService) { 
		this.initializeContract();
  }

  private async initializeContract(): Promise<void> {
    try {
      const organizerAddress = await this.connection.getSignerAddress();
      this.contract_ticket_Address = await this.factoryService.getOrganizerNFT(organizerAddress);
      this.contract = new ethers.Contract(this.contract_ticket_Address, contract_ticket_ABI, this.connection.getProvider());
      console.log(`Contract initialized with address: ${this.contract_ticket_Address}`);
    } catch (error) {
      console.error('Error initializing contract:', error);
    }
  }

  getContractAddress(): string {
	return this.contract_ticket_Address; // Return the contract address
	}


	
	async getOrganizerNFT(): Promise<String> {
		const organizerAddress=await this.connection.getSignerAddress();
		const nftAddress = await this.factoryService.getOrganizerNFT(organizerAddress);
		console.log(`NFT Address for organizer ${organizerAddress}:`, nftAddress);
		return nftAddress
	}




  // ----- MANAGEMENT EVENTS -----

  //Function for the creation of a new event
  async createEvent(name: string, time: Date): Promise<number> {
		if(!this.contract){
			throw new Error('Contract not initialized');
		}

		const tx = await this.contract['createEvent'](name, time.getTime() / 1000);
		const receipt = await tx.wait();
	
		const eventId = receipt.logs[0].args[0].toString();
		console.log(`Evento creato con ID: ${eventId}`);
		return parseInt(eventId);
	}

  //Function for retreive an event based on its id
  async getEventDetails(eventId: number): Promise<EventDetails> {
	if(!this.contract){
		throw new Error('Contract not initialized');
	}
		const details = await this.contract['getEventDetails'](eventId);  
		return new EventDetails(
			details[0], 
      details[1].toString(),
			new Date(details[2] * 1000),       
			details[3],
      details[4]
    );
	}

	async getAllEventsDetails(): Promise<EventDetails[]> {
		if(!this.contract){
			throw new Error('Contract not initialized');
		}
		const details = await this.contract['getAllEventsDetails'](); 
	
		const events: EventDetails[] = [];
	
		for (let i = 0; i < details[0].length; i++) {
			const event = new EventDetails(
				details[0][i],                               
				details[1][i].toString(),                     
				new Date(details[2][i].toNumber() * 1000),    
				details[3][i],                                
				details[4][i]                                 
			);
			events.push(event);
		}
	
		return events;
	}
	

  // ----- MANAGEMENT SECTORS -----

  //Function for the creation of a new sector
  async createSector(eventId: number, name: string, lines : number , seat_x_lines : number): Promise<void> {
	if(!this.contract){
		throw new Error('Contract not initialized');
	}
		const tx = await this.contract['createSector'](eventId, name, lines*seat_x_lines, seat_x_lines);
		await tx.wait();
		console.log(`Settore creato per l'evento ${eventId}: ${name}`);
	}

  //Funtion to ge the details of a specific sector by its id in a event
  async getSectorDetails(eventId: number, sectorId:number): Promise<SecotrDetails> {
	if(!this.contract){
		throw new Error('Contract not initialized');
	}
		const details = await this.contract['getSectorDetails'](eventId, sectorId);  
		return new SecotrDetails(
			details[0],         
			details[1].toString(),
			details[2],       
			details[3],
      details[4],
      details[5]
    );
	}

}
