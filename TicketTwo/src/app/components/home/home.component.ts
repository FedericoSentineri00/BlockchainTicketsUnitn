import { Component } from '@angular/core';
import { ContractService } from '../../services/tickets_service/ticket_contract.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  contractAddress!: string; // Optional chaining
  currentAccount: string | undefined; // Property for the current account

  constructor(private contractService: ContractService) {
    this.connect();
    this.contractAddress = this.contractService.getContractAddress(); // Get contract address
    console.log('Contract Address:', this.contractAddress); // Print the contract address
  }

  async connect() {
    await this.contractService.connect();
    this.currentAccount = await this.contractService.getSignerAddress(); // Get signer address
    console.log('Connected to MetaMask account:', this.currentAccount);
  }

  async addOrganizer(): Promise<void> {
    const organizerAddress = (document.getElementById("organizerAddress") as HTMLInputElement).value;
    if (organizerAddress) {
      await this.contractService.addOrganizer(organizerAddress);
      console.log(`Organizer added: ${organizerAddress}`);
    }
  }

  async createTicket(): Promise<void> {
    const eventName = (document.getElementById("eventName") as HTMLInputElement).value;
    const eventDate = parseInt((document.getElementById("eventDate") as HTMLInputElement).value);
    const ticketPrice = parseInt((document.getElementById("ticketPrice") as HTMLInputElement).value);
    if (eventName && eventDate && ticketPrice) {
      const ticketId = await this.contractService.createTicket(eventName, eventDate, ticketPrice);
      console.log('Ticket created:', { eventName, eventDate, ticketPrice, ticketId });
    }
  }

  async buyTicket(): Promise<void> {
    const ticketId = parseInt((document.getElementById("ticketId") as HTMLInputElement).value);
    if (ticketId) {
      await this.contractService.buyTicket(ticketId);
      console.log(`Ticket bought: ${ticketId}`);
    }
  }

  async retrieveTicket(): Promise<void> {
    const ticketId = parseInt((document.getElementById("retrieveTicketId") as HTMLInputElement).value);
    if (ticketId) {
        try {
            const ticketDetails = await this.contractService.getTicketDetails(ticketId);
            (document.getElementById("ticketDetails") as HTMLHeadingElement).innerText = JSON.stringify(ticketDetails, null, 2); // Formatta per una migliore leggibilità
            console.log(`Ticket details:`, ticketDetails);
        } catch (error) {
            console.error("Errore nel recupero dei dettagli del biglietto:", error);
            (document.getElementById("ticketDetails") as HTMLHeadingElement).innerText = "Errore nel recupero dei dettagli del biglietto.";
        }
    } else {
        console.error("ID del biglietto non valido.");
        (document.getElementById("ticketDetails") as HTMLHeadingElement).innerText = "ID del biglietto non valido.";
    }
}
}
