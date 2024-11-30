import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth_service/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    // controlla se è autenticato chiamando isAuthenticated
    return this.authService.isAuthenticated().toPromise().then((isAuthenticated) => {
      if (isAuthenticated) {
        return true; 
      } else {
        this.router.navigate(['/']); // rimanda a /
        return false;
      }
    });
  }
}