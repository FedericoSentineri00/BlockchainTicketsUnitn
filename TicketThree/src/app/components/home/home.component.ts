import { Component } from '@angular/core';
import { ContractService } from '../../services/tickets_service/ticket_contract.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  contractAddress!: string; 
  currentAccount: string | undefined; 
  eventDetails: any = null;
  sectorDetails: any = null;
  ticketDetails: any = null;
  activeTab: string = 'ownerFunctions';

  constructor(private contractService: ContractService) {
    this.connect();
    this.contractAddress = this.contractService.getContractAddress(); 
    console.log('Contract Address:', this.contractAddress); 
  }
  
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  //ognuna delle seguenti funzioni chiama contract_service che esegue la funzione in BC

  //connette al wallet metamask (chiamata quando pagina è costruita)
  async connect() {
    await this.contractService.connect();
    this.currentAccount = await this.contractService.getSignerAddress(); 
    console.log('Connected to MetaMask account:', this.currentAccount);
  }

  async addOrganizer(): Promise<void> {
    const organizerAddress = (document.getElementById("organizerAddress") as HTMLInputElement).value;
    if (organizerAddress) {
      await this.contractService.createOrganizer(organizerAddress);
      console.log(`Organizer added: ${organizerAddress}`);
    }
  }

  async removeOrganizer(): Promise<void> {
    const organizerAddress = (document.getElementById("organizerAddressToRemove") as HTMLInputElement).value;
    if (organizerAddress) {
      await this.contractService.removeOrganizer(organizerAddress);
      console.log(`Organizer removed: ${organizerAddress}`);
    }
  }

  async createEvent(): Promise<void> {
    const eventName = (document.getElementById("eventName") as HTMLInputElement).value;
    const eventDate = parseInt((document.getElementById("eventDate") as HTMLInputElement).value);
    if (eventName && eventDate) {
      const eventId = await this.contractService.createEvent(eventName, eventDate);
      console.log('Event created:', { eventName, eventDate, eventId });
    }
  }


  async createSector(): Promise<void> {
    const eventId = parseInt((document.getElementById("eventIdForSector") as HTMLInputElement).value);
    const sectorName = (document.getElementById("sectorName") as HTMLInputElement).value;
    const totalSeats = parseInt((document.getElementById("totalSeats") as HTMLInputElement).value);
    if (eventId && sectorName && totalSeats) {
      const sectorId = await this.contractService.createSector(eventId, sectorName, totalSeats);
      console.log('Sector created:', { eventId, sectorName, totalSeats, sectorId });
    }
  }

  async createTicket(): Promise<void> {
    const eventId = parseInt((document.getElementById("eventIdForTicket") as HTMLInputElement).value);
    const sectorId = parseInt((document.getElementById("sectorIdForTicket") as HTMLInputElement).value);
    const ticketPrice = parseFloat((document.getElementById("ticketPrice") as HTMLInputElement).value);
    if (eventId && sectorId && ticketPrice) {
      const ticketId = await this.contractService.createTicket(eventId, sectorId, ticketPrice);
      console.log('Ticket created:', { eventId, sectorId, ticketPrice, ticketId });
    }
  }

  async buyTicket(): Promise<void> {
    const ticketId = (document.getElementById("ticketIdToBuy") as HTMLInputElement).value;
    const ticketPrice = parseFloat((document.getElementById("ticketPriceToPay") as HTMLInputElement).value);
    if (ticketId && ticketPrice) {
      await this.contractService.buyTicket(ticketId, ticketPrice.toString());
      console.log(`Ticket bought: ${ticketId}`);
    }
  }

  async sellTicket(): Promise<void> {
    const ticketId = (document.getElementById("ticketIdToSell") as HTMLInputElement).value;
    if (ticketId) {
      await this.contractService.sellTicket(ticketId);
      console.log(`Ticket set for sale: ${ticketId}`);
    }
  }

  
  async retrieveEvent(): Promise<void> {
    const eventId = parseInt((document.getElementById("retrieveEventId") as HTMLInputElement).value);
    if (eventId) {
      try{
        const eventDetails = await this.contractService.getEventDetails(eventId);
        this.eventDetails=eventDetails;
      } catch (error){
        console.error('Error fetching event details:', error);
      }
        
    }
  }
 
  async retrieveSector(): Promise<void> {
    const eventId = parseInt((document.getElementById("retrieveEventIdForSector") as HTMLInputElement).value);
    const sectorId = parseInt((document.getElementById("retrieveSectorId") as HTMLInputElement).value);
    if (eventId && sectorId) {
      try {
        const sectorDetails = await this.contractService.getSectorDetails(eventId, sectorId);
        this.sectorDetails = sectorDetails;  
      } catch (error) {
        console.error('Error fetching sector details:', error);
      }
    }
  }

  async retrieveTicket(): Promise<void> {
    const ticketId = (document.getElementById("retrieveTicketId") as HTMLInputElement).value;
    if (ticketId) {
      try {
        const ticketDetails = await this.contractService.getTicketDetails(ticketId);
        this.ticketDetails = ticketDetails; 
      } catch (error) {
        console.error('Error fetching ticket details:', error);
      }
    }
  }


  async createGroup(): Promise<void> {
    const ticketId = (document.getElementById("retrieveTicketIdforGroup") as HTMLInputElement).value;
    if (ticketId) {
      const groupId = await this.contractService.createGroup(ticketId);
      console.log('Event created:', { groupId });
    }
  }

  async addParticipant(): Promise<void> {
    const ticketId = (document.getElementById("retrieveTicketIdforAdd") as HTMLInputElement).value;
    const groupId = parseInt((document.getElementById("groupIdforAdd") as HTMLInputElement).value);
    if (ticketId && groupId) {
      await this.contractService.addParticipant(ticketId,groupId);
      console.log('Participant added to', { groupId });
    }
  }

  async removeParticipant(): Promise<void> {
    const ticketId = (document.getElementById("retrieveTicketIdforRemove") as HTMLInputElement).value;
    const groupId = parseInt((document.getElementById("groupIdforRemove") as HTMLInputElement).value);
    if (ticketId && groupId) {
      await this.contractService.removeParticipant(ticketId,groupId);
      console.log('Participant removed from', { groupId });
    }
  }
  
}
