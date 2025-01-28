import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Static } from '../../utils/Static';

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
  sectors : string[] = ["ciao", "ciao", "ciao"];
  selected_sector : string = ""

  price = 0;

  constructor(private router: Router) {
    this.updateDivs();
  }

  updateDivs() {
    this.array = Array(this.buy_ticket_count).fill(""); // Crea un array con 'n' elementi
  }

  back() {
    this.router.navigate([Static.source]);
  }

}
