import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Static } from '../../utils/Static';
import { TicketNFTService } from '../../services/Ticket_NFT/ticket-nft.service';
import { SecotrDetails } from '../../classes/SectorDetails';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.css'
})
export class EventDetailsComponent {

  event_name : string = "Nome di prova";
  event_date : string = "01/01/2000";
  event_details : string = "Questi sono i dettagli dell'evento e tante altre cose che ci stanno vicino" ;
  available_tickets : number = 1;

  is_group_buy : boolean = false;
  buy_ticket_count : number = 1;

  array: {first: string, second: string, third : string}[] = [];
  sectors : { name: string, availableTickets: number }[] = [];
  selected_sector : string = ""

  price = 0;

  constructor(private router: Router, private ticketNFTService: TicketNFTService) {
    this.updateDivs();
    this.getEventInfo();
  }



  updateDivs() {
    this.array = Array(this.buy_ticket_count).fill(""); // Crea un array con 'n' elementi
  }

  back() {
    this.router.navigate([Static.source]);
  }

  async getEventInfo(): Promise<void> {

    try {
        const allEventDetails = await this.ticketNFTService.getEventInfo(Static.id);
        console.log("All details to buy:", allEventDetails)
        this.event_name = allEventDetails.event.name;
        this.event_date = allEventDetails.event.time.toLocaleDateString();
        this.available_tickets = allEventDetails.event.totAvailableSeats;

        this.sectors = allEventDetails.sectors.map(sectorData => ({
          name: sectorData.sector.name,
          availableTickets: sectorData.availableTicketIds.length
        }));
    } catch (error) {
        console.error('Error fetching all event details:', error);
    }
  }


  async confirmBuy(): Promise<void>{

  }

}
