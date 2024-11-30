import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
  { path: '', component: WelcomeComponent }, // pagina con login
  { path: 'home', component: HomeComponent,  canActivate: [AuthGuard]  }, //pagina protetta dal login
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
