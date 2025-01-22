import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EventComponent } from './components/event/event.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'event', component: EventComponent},
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
