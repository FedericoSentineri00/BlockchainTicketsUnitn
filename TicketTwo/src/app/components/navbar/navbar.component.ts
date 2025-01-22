import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  currentStatus : string = ""

  constructor(private router: Router) {
    this.currentStatus = "dashboard"
  }

  login() {
    
  }

  updateView(newStatus : string) {
    if (newStatus != this.currentStatus) {
      this.currentStatus = newStatus;

      switch(newStatus) {
        case 'dashboard' : this.router.navigate(['/dashboard']); break;
        case 'event' : this.router.navigate(['/event']); break;
        case 'personal' : this.router.navigate(['/dashboard']); break;
        default: this.router.navigate(['/dashboard']); break;
      }
    }
  }
}
