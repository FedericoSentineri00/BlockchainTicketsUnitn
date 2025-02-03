import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FactoryService } from '../../services/Factory/factory.service';
import { ConnectionService } from '../../services/Connection/connection.service';
import { TicketNFTService } from '../../services/Ticket_NFT/ticket-nft.service';

@Component({
  selector: 'app-new-event',
  templateUrl: './new-event.component.html',
  styleUrl: './new-event.component.css'
})
export class NewEventComponent {

  name : string = ""
  date: Date = new Date();
  details: string = ""

  sectorCount : number = 1

  array : string[] = [""]  //Necessary to mantain the count on the divs for the sectors
  sectorNames : string[] = [""]
  sectorLines : number[] = [1]
  sectorSeats : number[] = [1]
  sectorPrices : number[] = [1]

  constructor(private router : Router, 
    private ticketNFTService: TicketNFTService) {

  }

  back() {
    this.router.navigate(['/personal']);
  }

  updateDivs() {
    this.array = Array(this.sectorCount).fill("");
    this.sectorNames = this.sectorNames.slice(0,this.sectorCount);
    this.sectorLines = this.sectorLines.slice(0,this.sectorCount);
    this.sectorSeats = this.sectorSeats.slice(0,this.sectorCount);
    this.sectorPrices = this.sectorPrices.slice(0,this.sectorCount);
  }

  async confirm() {
    const eventId=await this.createEvent();

    if (eventId){
      for (let i = 0; i < this.sectorCount; i++){
        const sectorName = this.sectorNames[i];
        const sectorLines = this.sectorLines[i];
        const sectorSeats = this.sectorSeats[i];
        const sectorPrice=this.sectorPrices[i];
  
        const sectorId=await this.createSector(eventId, sectorName, sectorLines, sectorSeats);
        if (typeof sectorId !== 'number') {
          console.error("Errore: sectorId not valid");
          continue;
      }
        console.log("Ecco i sector id",sectorId);

        for (let j = 0; j < sectorLines * sectorSeats; j++) {
          const ticketId = await this.ticketNFTService.createTicket(eventId, sectorId, sectorPrice);
          console.log(`Creato biglietto con ID: ${ticketId}`);
      }
      }
    }

    console.log("Finish");
    
  }

  
  

  async createEvent(): Promise<number | void> {

    if(this.name && this.date){
      try{

        const eventDate = new Date(this.date);
        const timestamp = Math.floor(eventDate.getTime() / 1000);

        const event_id= await this.ticketNFTService.createEvent(this.name, timestamp)
        console.log(`Event created`);
        return event_id
      }catch (error) {
        console.error("Error during event creation: ", error);
      }
    }
  }
  
  async createSector(eventId: number, name: string, lines: number, seatsPerLine: number): Promise<number | void> {
    try{
      const sectorID=await this.ticketNFTService.createSector(eventId, name, lines, seatsPerLine)
      console.log(`Sector created`);
      return sectorID;
    }catch (error) {
      console.error("Error during sector creation: ", error);
    }
  }


  async createTicket(eventId: number, sectorId: number, price: number): Promise<number | void> {
    try{
      const ticketID=await this.ticketNFTService.createTicket(eventId, sectorId, price)
      console.log(`Ticket created`);
      return ticketID;
    }catch (error) {
      console.error("Error during ticket creation: ", error);
    }
  }




  }


  




