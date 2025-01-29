import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
<<<<<<< HEAD
=======
import { FormsModule } from '@angular/forms'; 
>>>>>>> 220d4c2ec2084abc804326e0c3ac103c26b8671b

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
<<<<<<< HEAD
=======
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { EventComponent } from './components/event/event.component';
import { EventDetailsComponent } from './components/event-details/event-details.component';
>>>>>>> 220d4c2ec2084abc804326e0c3ac103c26b8671b

@NgModule({
  declarations: [
    AppComponent,
<<<<<<< HEAD
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
=======
    HomeComponent,
    DashboardComponent,
    NavbarComponent,
    EventComponent,
    EventDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
>>>>>>> 220d4c2ec2084abc804326e0c3ac103c26b8671b
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
