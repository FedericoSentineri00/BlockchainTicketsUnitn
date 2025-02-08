import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConnectionService } from '../../services/Connection/connection.service';
import { TicketNFTService } from '../../services/Ticket_NFT/ticket-nft.service';
import { MarketplaceService } from '../../services/Marketplace/marketplace.service';
import { EventDetails } from '../../classes/EventDetail';
import { TicketDetails, TicketStatus } from '../../classes/TicketDetails';
import { SecotrDetails } from '../../classes/SectorDetails';

@Component({
  selector: 'app-personal-view',
  templateUrl: './personal-view.component.html',
  styleUrl: './personal-view.component.css'
})
export class PersonalViewComponent {
  
  currentAccount: string | undefined;

  addAddress :string = ""
  removeAddress :string = ""

  ticketAddress : string = ""

  validationData : {id : string, name : string, surname : string} = {id: "", name : "", surname : ""}

  tickets : TicketDetails[] = []
  showGroupManagement : number = -1;
  showValidation : number = -1;

  isOrganizer : boolean = true;
  isAdmin : boolean = true;

  constructor(private router : Router, 
    private connectionService: ConnectionService, 
    private ticketNFTService: TicketNFTService,
    private marketPlaceService: MarketplaceService) {
    this.connect();
    this.getMyTickets();
    this.getMyEvents();
  }

  formatter = new Intl.DateTimeFormat("it-IT", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "UTC",
  });  

  events : EventDetails[] = [new EventDetails(1,"ciao",new Date(1),1,1,"")]


  async connect() {
    await this.connectionService.connect();
    this.currentAccount = await this.connectionService.getSignerAddress(); // Get signer address
    console.log('Connected to MetaMask account:', this.currentAccount);
  }

  async addOrganizer(): Promise<void>{
    try {
        await this.ticketNFTService.addOrganizer(this.addAddress);
    } catch (error) {
        console.error('Error fetching organizer address:', error);
    }
  }

  async removeOrganizer(): Promise<void> {
    try {
        await this.ticketNFTService.removeOrganizer(this.removeAddress);
    } catch (error) {
        console.error('Error fetching organizer address:', error);
    }
  }

  createEvent() {
    this.router.navigate(['/new']);
  }

  async getMyEvents(): Promise<void> {

    try {
      const myEvents = await this.ticketNFTService.getMyEvents();
      this.events = myEvents; 
    } catch (error) {
      console.error('Error fetching my events details:', error);
    }
  }

  async getMyTickets(): Promise<void> {

    try {
      const myTickets = await this.ticketNFTService.getMyTickets();
      this.tickets = myTickets; 
    } catch (error) {
      console.error('Error fetching my tickets details:', error);
    }
  }

  async assignSeats(index : number) {

    let ticket_ids : number[] = []
    let seats : string[] = []

    let response = await this.ticketNFTService.getEventInfo(this.events[index].id, this.events[index].address, false);

    let sectors = response.sectors

    sectors.forEach(async (element, index, sectors) => {
      let sector = element.sector;
      let tempSeats = await this.assignSectorSeats(sector.totalSeats / sector.seatsXLines, sector.seatsXLines, sector.ticketIds, sector.groupIds)

      for(let i = 0; i < tempSeats.length; i++) {
        ticket_ids.push(sector.ticketIds[i])
        seats.push(tempSeats[i])
      }
    });

    await this.ticketNFTService.assignSeats(this.events[index].address,ticket_ids, seats)

  }

  async assignSectorSeats(nRow : number, nColumns : number, tickets_ids : number[], group_ids : number []) {
  
    const seatLabels: string[] = [];
  
    // Generazione dinamica delle lettere (A-Z)
    const rowLabels = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)); // "A" to "Z"
  
    // Creazione dinamica dei posti
    for (let row = 0; row < nRow; row++) {
      let rowSeats: string[] = [];
  
      for (let col = 1; col <= nColumns; col++) {
        rowSeats.push(`${col}${rowLabels[row]}`);
      }
  
      // Se la riga è dispari, invertire l'ordine dei posti
      if (row % 2 === 1) {
        rowSeats.reverse();
      }
  
      seatLabels.push(...rowSeats);
    }
  
    // Raggruppamento dei biglietti per gruppo
    let groupedSeats: Map<number, number[]> = new Map();
  
    for (let i = 0; i < tickets_ids.length; i++) {
      const group = group_ids[i];
      if (!groupedSeats.has(group)) {
        groupedSeats.set(group, []);
      }
      groupedSeats.get(group)?.push(tickets_ids[i]);
    }
  
    // Assegnazione dei posti con alert per ogni ticket
    let seatIndex = 0;
  
    // Iteriamo sui gruppi, assegniamo i posti tenendo conto della vicinanza
    for (const [groupId, ticketList] of groupedSeats.entries()) {
      // Per ogni gruppo, assegniamo i posti uno alla volta
      for (let ticket of ticketList) {
        if (seatIndex < seatLabels.length) {
          const assignedSeat = seatLabels[seatIndex];
          seatIndex++;
          // Mostra l'alert per il ticket e il posto assegnato
          alert(`Ticket ID: ${ticket}, Assigned Seat: ${assignedSeat}`);
        } else {
          console.log("Warning: Not enough seats for all tickets!");
          break;
        }
      }
    }

    return seatLabels
  }

  async sellTicket(index: number) {
    const id=this.tickets[index].id
    
    try {
      await this.marketPlaceService.sellTicket(id);
      this.tickets[index].status=TicketStatus.Available
    } catch (error) {
      console.error('Error selling ticket', error);
    }
    
  }

  removeSell(index: number) {
    this.tickets[index].status = TicketStatus.Owned
  }

  manageGroup(index : number) {
    this.showGroupManagement = index;
  }

  hideManageGroup() {
    this.showGroupManagement = -1;
  }

  showValidationPage(index : number) {
    this.showValidation = index
  }

  hideValidationPage() {
    this.showValidation = -1
  }

  async verifyTicket(index : number) {

    try {

      await this.ticketNFTService.validateTicket(Number(this.validationData.id), this.validationData.name, this.validationData.surname, this.events[index].address)

      this.validationData.id = ""
      this.validationData.name = ""
      this.validationData.surname = ""

    } catch (error) {
      console.error('Error in group validation:', error);
    }
  }

  async createGroup(index : number) {

    try {
      //console.log("Index:",index);
      //console.log("index id",this.tickets[index].id)
      this.tickets[index].groupId = await this.ticketNFTService.addGroup(this.tickets[index].id);
    } catch (error) {
      console.error('Error creating new group:', error);
    }
  }

  async removeFromGroup(index : number) {

    try {
      console.log("Index:",index);
      console.log("index id",this.tickets[index].id)
      await this.ticketNFTService.removeFromGroup(this.tickets[index].groupId, this.tickets[index].id);
    } catch (error) {
      console.error('Error removing from group:', error);
    }

    this.tickets[index].groupId = 0
  }

  async addToGroup(index :number) {
    try {
      await this.ticketNFTService.removeFromGroup(this.tickets[index].groupId, Number(this.ticketAddress));
    } catch (error) {
      console.error('Error adding person to group:', error);
    }
  }

  async expireTickets(index : number) {

    try {
      console.log(this.events[index].address)
      await this.ticketNFTService.expireTickets(this.events[index].id, this.events[index].address);

    } catch(error) {
      console.error('Error expiring tickets', error);

    }

  }

}



