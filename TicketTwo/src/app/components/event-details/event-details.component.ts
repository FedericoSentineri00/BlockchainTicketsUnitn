import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Static } from '../../utils/Static';
import { TicketNFTService } from '../../services/Ticket_NFT/ticket-nft.service';
import { MarketplaceService } from '../../services/Marketplace/marketplace.service';
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
  sectors: { name: string, availableTickets: number, ticketIds: number[] }[] = [];
  selected_sector : string = ""

  constructor(private router: Router, 
    private ticketNFTService: TicketNFTService,
    private marketplaceService: MarketplaceService
  ) {
    this.updateDivs();
    this.getEventInfo();
  }



  updateDivs() {
    this.array = Array(this.buy_ticket_count).fill({first: '', second: '', third: ''}); // Crea un array con 'n' elementi
  }

  back() {
    this.router.navigate([Static.source]);
  }

  async getEventInfo(): Promise<void> {

    try {
        const allEventDetails = await this.ticketNFTService.getEventInfo(Static.id, Static.NFTaddress);
        console.log("All details to buy:", allEventDetails)
        this.event_name = allEventDetails.event.name;
        this.event_date = allEventDetails.event.time.toLocaleDateString();
        this.available_tickets = allEventDetails.event.totAvailableSeats;

        this.sectors = allEventDetails.sectors.map(sectorData => ({
          name: sectorData.sector.name,
          availableTickets: sectorData.returnedTickets.length,
          ticketIds: sectorData.returnedTickets
        }));
    } catch (error) {
        console.error('Error fetching all event details:', error);
    }
  }


  async confirmBuy(): Promise<void> {
    if (!this.selected_sector) {
      console.log('Seleziona un settore prima di confermare.');
      return;
    }
    
    const selectedSectorDetails = this.sectors.find(sector => sector.name === this.selected_sector);
    if (!selectedSectorDetails) {
      console.log('Settore selezionato non valido.');
      return;
    }

    console.log('Ticket IDs:', selectedSectorDetails.ticketIds);
  
    try {
      const firstTicketId = selectedSectorDetails.ticketIds[0];
      
      await this.marketplaceService.buyTicket(firstTicketId, this.array[0]?.first, this.array[0]?.second);
  
      console.log(`Acquisto confermato per il settore: ${selectedSectorDetails.name}`);
    } catch (error) {
      console.error('Errore durante l’acquisto:', error);
    }
  }

}
