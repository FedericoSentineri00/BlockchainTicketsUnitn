import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConnectionService } from '../../services/Connection/connection.service';
import { TicketNFTService } from '../../services/Ticket_NFT/ticket-nft.service';
import { EventDetails } from '../../classes/EventDetail';
import { TicketDetails } from '../../classes/TicketDetails';

@Component({
  selector: 'app-personal-view',
  templateUrl: './personal-view.component.html',
  styleUrl: './personal-view.component.css'
})
export class PersonalViewComponent {
  
  currentAccount: string | undefined;

  addAddress :string = ""
  removeAddress :string = ""

  tickets : TicketDetails[] = []

  isOrganizer : boolean = true;
  isAdmin : boolean = true;

  constructor(private router : Router, private connectionService: ConnectionService, private ticketNFTService: TicketNFTService) {
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

  events : EventDetails[] = [new EventDetails(0,"ciao",new Date(1 * 1000), 0,0)]


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



  assignSeats() {
    let nRow: number = 10; // Numero di righe (modificabile)
    let nColumns: number = 5; // Numero di colonne (modificabile)
    let tickets: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // Lista dei biglietti
    let groupsId: number[] = [4, 0, 1, 1, 4, 0, 1, 2, 3, 0]; // Gruppi associati ai biglietti
  
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
  
    for (let i = 0; i < tickets.length; i++) {
      const group = groupsId[i];
      if (!groupedSeats.has(group)) {
        groupedSeats.set(group, []);
      }
      groupedSeats.get(group)?.push(tickets[i]);
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
  }
}



