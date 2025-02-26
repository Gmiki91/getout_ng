import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url = environment.url + 'auth';
  private http = inject(HttpClient);

  login(username: string,password: string): Observable<{ status: boolean; token: string,user:User }> {
    return this.http.post<{ status: boolean; token: string,user:User }>(`${this.url}/login`, {username,password})
      .pipe(tap(response => {
          if (response.token) {
            localStorage.setItem('authToken', response.token);
          }
        }));
  }

  logout(): void {
    localStorage.removeItem('authToken');
  }

  register(username: string,email: string,password: string): Observable<{ status: boolean; token: string,user:User }> {
    return this.http.post<{ status: boolean; token: string,user:User }>(`${this.url}/register`, {username,password,email})
      .pipe(tap(response => {
          if (response.token) {
            localStorage.setItem('authToken', response.token);
          }
        }));
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }
}
