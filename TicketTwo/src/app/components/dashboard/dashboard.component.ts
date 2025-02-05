import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Static } from '../../utils/Static';
import { EventDetails } from '../../classes/EventDetail';
import { ConnectionService } from '../../services/Connection/connection.service';
import { TicketNFTService } from '../../services/Ticket_NFT/ticket-nft.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  currentAccount: string | undefined; // Property for the current account

  constructor(private router: Router, private connectionService: ConnectionService, private ticketNFTService: TicketNFTService) {
    this.connect();
    this.retrieveAllEventDetails()
  }

  async connect() {
    await this.connectionService.connect();
    this.currentAccount = await this.connectionService.getSignerAddress(); // Get signer address
    console.log('Connected to MetaMask account:', this.currentAccount);
  }

  items = [ {first : "02/04/2000", second: "ciaomodno123456789"}, {first : "ciao2", second: "ciao2"}, {first : "ciao3", second: "ciao3"}, {first : "ciao3", second: "ciao3"} , {first : "ciao3", second: "ciao3"}, {first : "ciao3", second: "ciao3"}, {first : "ciao3", second: "ciao3"}]
  events : EventDetails[] = [new EventDetails(0,"ciao",new Date(1 * 1000), 0,0)]

  //Formatter for the date
  formatter = new Intl.DateTimeFormat("it-IT", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "UTC",
  });  


  
  //Function call after the component is initialized
  ngAfterViewInit() : void {
    
  }

  openEvent() {

    Static.source = '/dashboard'
    this.router.navigate(['/details'])
  }



  async retrieveAllEventDetails(): Promise<void> {

    try {
        const allEventDetails = await this.ticketNFTService.getAllEventsDetails();
        this.events = allEventDetails; 
    } catch (error) {
        console.error('Error fetching all event details:', error);
    }
}




 
}
