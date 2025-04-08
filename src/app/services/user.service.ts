import { inject, Injectable, signal} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import {Visitor} from '../models/user.model';
import { MockUser } from '../utils/mock.factory';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private _user = signal<Visitor>(MockUser);
  url = environment.url + 'users';
  user = this._user.asReadonly();
  isAuthenticated$=new BehaviorSubject<boolean>(false);

  initializeUser(): Promise<void> {
    return new Promise((resolve) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          this.http.get<Visitor>(`${this.url}/me`,{
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
          }).subscribe({
            next: (user) => {
              this.setUser(user);
              this.isAuthenticated$.next(true);
              localStorage.removeItem('uuid');
              resolve();
            },
            error: (error) => {
              console.error('Error initializing user:', error);
              this.logout();
              alert("You have been logged out.");
              resolve();
            },
          });
        } else {
          resolve(); // Resolve immediately if no token is found
        }
    }
  );
  }

  initializeGuest(): Promise<void> {
    return new Promise((resolve) => {
        const uid = localStorage.getItem('uuid') || '0';
        this.http.get<Visitor>(`${this.url}/check/${uid}`).subscribe({
          next: (user) => {
            this.setUser(user);
            localStorage.setItem('uuid', String(user.id));
            resolve();
          },
          error: (error) => {
            console.error('Error initializing user:', error);
            alert(error.error.message + ". Try reloading the page or deleting the cache.");
            resolve();
          },
        });
    });
  }

  readNotifications(){
    this.http.put<Visitor>(`${this.url}/clearNotifications/${this.user().id}`,{}).subscribe(user=>this.setUser(user));
  }

  setUser(user: Visitor): void {
      this._user.set(user);
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.initializeGuest().then(() =>  this.isAuthenticated$.next(false));
  }
}
