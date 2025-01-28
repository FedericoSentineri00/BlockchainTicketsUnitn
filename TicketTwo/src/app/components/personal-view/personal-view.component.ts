import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-personal-view',
  templateUrl: './personal-view.component.html',
  styleUrl: './personal-view.component.css'
})
export class PersonalViewComponent {

  addAddress :string = ""
  removeAddress :string = ""

  tickets : string[] = []
  events : string[] = ["test","test2"]


  isOrganizer : boolean = true;
  isAdmin : boolean = true;

  constructor(private router : Router) {

  }

  addOrganizer() {
    console.log(this.addAddress);
  }

  removeOrganizer() {
    console.log(this.removeAddress);
  }

  createEvent() {
    this.router.navigate(['/new']);
  }
}
