import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url = environment.url + 'auth';
  private http = inject(HttpClient);

  login(username: string,password: string): Observable<{ status: boolean; token: string }> {
    return this.http.post<{ status: boolean; token: string }>(`${this.url}/login`, {username,password})
      .pipe(tap(response => {
          if (response.token) {
            localStorage.setItem('authToken', response.token);
          }
        }));
  }

  logout(): void {
    localStorage.removeItem('authToken');
  }

  register(name: string,password: string,email: string): Observable<{ status: boolean; token: string }> {
    return this.http.post<{ status: boolean; token: string }>(`${this.url}/register`, {name,password,email})
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
