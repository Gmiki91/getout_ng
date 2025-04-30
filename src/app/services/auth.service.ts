import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url = environment.url + 'auth';
  private http = inject(HttpClient);
  private userService = inject(UserService);

  login(username: string,password: string): Observable<{ status: boolean; token: string,user:User }> {
    return this.http.post<{ status: boolean; token: string,user:User }>(`${this.url}/login`, {username,password})
      .pipe(tap(response => {
          if (response.token) {
            localStorage.setItem('authToken', response.token);
            this.userService.isAuthenticated$.next(true); 
            this.userService.setUser(response.user);
          }
        }));
  }

  register(username: string,email: string,password: string, elo:number): Observable<{ status: boolean; token: string,user:User }> {
    return this.http.post<{ status: boolean; token: string,user:User }>(`${this.url}/register`, {username,password,email,elo})
      .pipe(tap(response => {
          if (response.token) {
            localStorage.setItem('authToken', response.token);
            this.userService.isAuthenticated$.next(true); 
            this.userService.setUser(response.user);
          }
        }));
  }

  changePassword(password: string): Observable<{ status: boolean }> {
    return this.http.post<{ status: boolean }>(`${this.url}/change-password`,  {password})
  }

}
