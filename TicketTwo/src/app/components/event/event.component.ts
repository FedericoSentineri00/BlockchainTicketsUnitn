import { Component } from '@angular/core';
import { EventDetails } from '../../classes/EventDetail';
import { TicketNFTService } from '../../services/Ticket_NFT/ticket-nft.service';
import { Router } from '@angular/router';
import { Static } from '../../utils/Static';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrl: './event.component.css'
})
export class EventComponent {

  minFilter : string = ""
  maxFilter : string = ""
  minDateFilter : string = ""
  maxDateFilter : string = ""

  name : string = ""

  events : EventDetails[] = []
  
  filtered : EventDetails[] = []

  constructor(
    private router : Router,
    private ticketNFTService: TicketNFTService
  ) {
    this.retrieveAllEventDetails();
    this.filtered = this.events
  }

  updateEvents() {
    this.filtered = []

    //Filter on name
    if(this.name != "") {

      this.events.forEach((element, index, events) => {
        if(element.name.includes(this.name)) {
          this.filtered.push(element);          
        }
      });
      
    } else {
      this.filtered = this.events
    }

    //Filter on date
    let temp : EventDetails[] = []

    let minDate = new Date(this.minDateFilter);
    let maxDate = new Date(this.maxDateFilter);
    
    if(minDate.getTime() == Date.now() || this.minDateFilter == "")
      minDate.setTime(0)
    if(maxDate.getTime() == Date.now() || this.maxDateFilter == "")
      maxDate.setTime( Date.now() * 1000)

    if(minDate.getTime() < maxDate.getTime()){
      
      this.filtered.forEach((item, index, items) => {

        if (item.time.getTime() > minDate.getTime() && item.time.getTime() < maxDate.getTime())
          temp.push(item)
      });

      this.filtered = temp
    }
  }

  openEvent(index : number) {
  
      Static.source = '/event'
      Static.id =  this.filtered[index].id;
      this.router.navigate(['/details'])
    }
  

  async retrieveAllEventDetails(): Promise<void> {

    try {
        const allEventDetails = await this.ticketNFTService.getAllEventsDetails();
        this.events = allEventDetails; 
        this.updateEvents();
    } catch (error) {
        console.error('Error fetching all event details:', error);
    }
  }
  
}
