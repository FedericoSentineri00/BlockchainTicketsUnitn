import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { ConnectionService } from '../Connection/connection.service';
import { EventDetails } from '../../classes/EventDetail';
import { SecotrDetails } from '../../classes/SectorDetails';


const contractABI = [{}];
const contractAddress = '0x9ADF81F1E7a62E199Ab456E39Be4E9615dE1065a';

@Injectable({
  providedIn: 'root'
})
export class TicketNFTService {

  private contract: ethers.Contract;

  constructor(private connection: ConnectionService) { 

    this.contract = new ethers.Contract(contractAddress, contractABI, connection.getProvider() );
  }

  // ----- MANAGEMENT EVENTS -----

  //Function for the creation of a new event
  async createEvent(name: string, time: Date): Promise<number> {
		const tx = await this.contract['createEvent'](name, time.getTime() / 1000);
		const receipt = await tx.wait();
	
		const eventId = receipt.logs[0].args[0].toString();
		console.log(`Evento creato con ID: ${eventId}`);
		return parseInt(eventId);
	}

  //Function for retreive an event based on its id
  async getEventDetails(eventId: number): Promise<EventDetails> {
		const details = await this.contract['getEventDetails'](eventId);  
		return new EventDetails(
			details[0], 
      details[1].toString(),
			new Date(details[2] * 1000),       
			details[3],
      details[4]
    );
	}

  // ----- MANAGEMENT SECTORS -----

  //Function for the creation of a new sector
  async createSector(eventId: number, name: string, lines : number , seat_x_lines : number): Promise<void> {
		const tx = await this.contract['createSector'](eventId, name, lines*seat_x_lines, seat_x_lines);
		await tx.wait();
		console.log(`Settore creato per l'evento ${eventId}: ${name}`);
	}

  //Funtion to ge the details of a specific sector by its id in a event
  async getSectorDetails(eventId: number, sectorId:number): Promise<SecotrDetails> {
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
