import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Static } from '../../utils/Static';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  constructor(private router: Router) {
    
  }

  items = [ {first : "02/04/2000", second: "ciaomodno123456789"}, {first : "ciao2", second: "ciao2"}, {first : "ciao3", second: "ciao3"}, {first : "ciao3", second: "ciao3"} , {first : "ciao3", second: "ciao3"}, {first : "ciao3", second: "ciao3"}, {first : "ciao3", second: "ciao3"}]

  //Function call after the component is initialized
  ngAfterViewInit() : void {
  }

  openEvent() {

    Static.source = '/dashboard'
    this.router.navigate(['/details'])
  }


}
