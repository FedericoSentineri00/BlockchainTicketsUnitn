import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-event',
  templateUrl: './new-event.component.html',
  styleUrl: './new-event.component.css'
})
export class NewEventComponent {

  name : string = ""
  date : string = ""
  details: string = ""

  sectorCount : number = 1

  array : string[] = [""]  //Necessary to mantain the count on the divs for the sectors
  sectorNames : string[] = [""]
  sectorLines : number[] = [1]
  sectorSeats : number[] = [1]
  sectorPrices : number[] = [1]

  constructor(private router : Router) {

  }

  back() {
    this.router.navigate(['/personal']);
  }

  updateDivs() {
    this.array = Array(this.sectorCount).fill("");
    this.sectorNames = this.sectorNames.slice(0,this.sectorCount);
    this.sectorLines = this.sectorLines.slice(0,this.sectorCount);
    this.sectorSeats = this.sectorSeats.slice(0,this.sectorCount);
    this.sectorPrices = this.sectorPrices.slice(0,this.sectorCount);
  }

  confirm() {
    //TODO: Richiamare funzioni per generare l'evento, i settori e i tickets
  }
  

}
