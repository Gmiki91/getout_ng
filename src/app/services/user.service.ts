import { inject, Injectable, signal, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import User from '../models/user.model';
import { MockUser } from '../utils/mock.factory';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class UserService {
  url = environment.url + 'users';
  user = signal<User>(MockUser);
  private http = inject(HttpClient);

  constructor( @Inject(PLATFORM_ID) private platformId: Object){}

  initializeUser(): Promise<void> {
    return new Promise((resolve) => {
      if (isPlatformBrowser(this.platformId)) {
        const uid = localStorage.getItem('uuid') || '0';
        this.http.get<User>(`${this.url}/check/${uid}`).subscribe({
          next: (user) => {
            this.setUser(user);
            localStorage.setItem('uuid', user.id);
            resolve();
          },
          error: (error) => {
            console.error('Error initializing user:', error);
            alert(error.error.message + ". Try reloading or deleting the cache.");
            resolve();
          },
        });
      } else {
        resolve(); // Resolve immediately for non-browser platforms
      }
    });
  }

  readNotifications(){
    this.http.put<User>(`${this.url}/clearNotifications/${this.user().id}`,{}).subscribe(user=>this.setUser(user));
  }

  private setUser(user: User): void {
    if (user && isPlatformBrowser(this.platformId)) {
      this.user.set(user);
      localStorage.setItem('uuid', String(user.id));
    } else {
      console.log('Something went horrible wrong! Is this in the browser?',isPlatformBrowser(this.platformId));
    }
  }
}
