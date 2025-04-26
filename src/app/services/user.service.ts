import { inject, Injectable, signal} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import {Visitor} from '../models/user.model';
import { MockUser } from '../utils/mock.factory';
import { BehaviorSubject, firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private _user = signal<Visitor>(MockUser);
  private _loading = signal(true);
  url = environment.url + 'users';
  user = this._user.asReadonly();
  loading = this._loading.asReadonly(); 
  isAuthenticated$=new BehaviorSubject<boolean>(false);


  async initialize(): Promise<void> {
    try {
      if (localStorage.getItem('authToken')) {
        await this.initializeUser();
      } else {
        await this.initializeGuest();
      }
    } finally {
      this._loading.set(false); // always stop loading, even on errors
    }
  }

  private async initializeUser(): Promise<void> {
    const token = localStorage.getItem('authToken');
    if(!token) return Promise.resolve();

    try {
      const user = await firstValueFrom(
        this.http.get<Visitor>(`${this.url}/me`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
        }));
      this.setUser(user);
      this.isAuthenticated$.next(true);
      localStorage.removeItem('uuid');
    } catch (error) {
      console.error('Error initializing user:', error);
      this.logout();
      alert("You have been logged out.");
    }
  }

  private async initializeGuest(): Promise<void> {
    const uid = localStorage.getItem('uuid') || '0';
    try {
      const user = await firstValueFrom(this.http.get<Visitor>(`${this.url}/check/${uid}`));
      this.setUser(user);
      this.isAuthenticated$.next(false);
      localStorage.setItem('uuid', String(user.id));
    } catch (error) {
      console.error('Error initializing guest user:', error);
    }
  }

  readNotifications(){
    this.http.put<Visitor>(`${this.url}/clearNotifications/${this.user().id}`,{}).subscribe(user=>this.setUser(user));
  }

  setUser(user: Visitor): void {
      this._user.set(user);
  }

  async logout(): Promise<void> {
    localStorage.removeItem('authToken');
    await this.initializeGuest();
    this.isAuthenticated$.next(false)
  }
}
