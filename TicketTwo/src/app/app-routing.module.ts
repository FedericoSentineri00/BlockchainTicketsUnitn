import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EventComponent } from './components/event/event.component';
import { EventDetailsComponent } from './components/event-details/event-details.component';
import { PersonalViewComponent } from './components/personal-view/personal-view.component';
import { NewEventComponent } from './components/new-event/new-event.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'event', component: EventComponent},
  { path: 'details', component: EventDetailsComponent},
  { path: 'personal', component: PersonalViewComponent},
  { path: 'new', component: NewEventComponent},
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
