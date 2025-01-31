import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Static } from '../../utils/Static';
import { EventDetails } from '../../classes/EventDetail';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

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

  constructor(private router: Router) {
    this.getEvents()
  }

  
  //Function call after the component is initialized
  ngAfterViewInit() : void {
    
  }

  openEvent() {

    Static.source = '/dashboard'
    this.router.navigate(['/details'])
  }

  getEvents(){
    //TODO: Aggiungere chiamata per ottenere gli eventi

    //this.events.push(new EventDetails(1, "ciao2", new Date(1234567890 * 1000),0));
  }
 
}
