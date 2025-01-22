import { Component } from '@angular/core';

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

  constructor() {

  }

}
