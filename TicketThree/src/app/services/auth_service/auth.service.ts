import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000'; // backend

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  // chima login backend e salva cookie
  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password }, { withCredentials: true });
  }

  // rimuove il cookie dal backend (ancora da implementare in front)
  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true });
  }

  // controlla se cookie salvato è valido
  isAuthenticated(): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/protected`, { withCredentials: true });
  }
}
