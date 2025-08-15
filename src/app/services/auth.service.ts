import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap,map, catchError, finalize } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User, Visitor } from '../models/user.model';
import { UserService } from './user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url = environment.url + 'auth';
  private http = inject(HttpClient);
  private userService = inject(UserService);
  private snackBar = inject(MatSnackBar);
  private _loading = signal(true);
  loading = this._loading.asReadonly(); 
  isAuthenticated$=new BehaviorSubject<boolean>(false);

  async initialize(): Promise<void> {
    try {
      if (this.getAccessToken()) {
        await this.initializeUser();
      } else {
        await this.userService.initializeGuest();
        this.isAuthenticated$.next(false);
      }
    } finally {
      this._loading.set(false); // always stop loading, even on errors
    }
  }

  private async initializeUser(): Promise<void> {
    const token = this.getAccessToken();
    if(!token) return Promise.resolve();

    try {
      const response = await firstValueFrom(this.http.get<{user:Visitor, token:string}>(`${this.url}/me`));
      this.userService.setUser(response.user);
      this.isAuthenticated$.next(true);
      localStorage.removeItem('uuid');
    } catch (error) {
      console.error('Error initializing user:', error);
      this.logout();
      this.snackBar.open("You have been logged out.");
    }
  }

  
  
  login(username: string,password: string): Observable<{ status: boolean; token: string,user:User }> {
    this._loading.set(true)
    return this.http.post<{ status: boolean; token: string,user:User }>(`${this.url}/login`, {username,password})
       .pipe(
        tap(response => this.handleAuthSuccess(response.token, response.user)),
        catchError(err => {
          this._loading.set(false);
          return throwError(() => err);
        })
       )
  }

  register(username: string,email: string,password: string, elo:number): Observable<string> {
    this._loading.set(true)
    return this.http.post<string>(`${this.url}/register`, {username,password,email,elo})
    .pipe(finalize(() => this._loading.set(false)));
}

  confirmEmail(token: string): Observable<string> {
    return this.http.get<string>(`${this.url}/confirm-email?token=${token}`)
  }

  private handleAuthSuccess( token: string, user: User ) {
  if (token) {
    this.setAccessToken(token);
    this.userService.setUser(user);
    this.isAuthenticated$.next(true);
  }
  this._loading.set(false);
}

  refreshToken(): Observable<string> {
    return this.http.post<{ status: boolean; token: string,user:User }>(`${this.url}/refresh-token`,{})
    .pipe(
      tap(res => this.setAccessToken(res.token)),
      map(res => res.token)
    );
  }

  changePassword(password: string): Observable<{ status: boolean }> {
    return this.http.post<{ status: boolean }>(`${this.url}/change-password`,  {password})
  }

  setAccessToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  getAccessToken(): string | null {
   return localStorage.getItem('authToken');
  }

  async logout(): Promise<void> {
    localStorage.removeItem('authToken');
    await this.userService.initializeGuest();
    this.isAuthenticated$.next(false)
  }

}
