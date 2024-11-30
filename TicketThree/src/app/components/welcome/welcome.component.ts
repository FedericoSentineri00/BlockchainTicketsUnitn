import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth_service/auth.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent {
  username: string = '';
  password: string = '';
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  //esegue il login e manda alla home
  login() {
    this.authService.login(this.username, this.password).subscribe(
      (response) => {
        console.log("Token salvato");
        localStorage.setItem('authToken', response.token);
        console.log("Vai alla home");
        this.router.navigate(['/home']);
      },
      (error) => {
        
        this.errorMessage = error.error.message;
      }
    );
  }
}