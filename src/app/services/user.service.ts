import { inject, Injectable, signal} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import {Visitor} from '../models/user.model';
import { MockUser } from '../utils/mock.factory';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  url = environment.url + 'users';
  private http = inject(HttpClient);
  private _user = signal<Visitor>(MockUser);
  user = this._user.asReadonly();
  
  async initializeGuest(): Promise<void> {
      const uid = localStorage.getItem('uuid') || '0';
      try {
        const user = await firstValueFrom(this.http.get<Visitor>(`${this.url}/check/${uid}`));
        this.setUser(user);
        localStorage.setItem('uuid', String(user.id));
      } catch (error) {
        console.error('Error initializing guest user:', error);
      }
    }
    
  readNotifications(){
    //TODO: remove the user id, it should not be needed with interceptor
    this.http.put<Visitor>(`${this.url}/clearNotifications/${this.user().id}`,{}).subscribe(user=>this.setUser(user));
  }

  setUser(user: Visitor): void {
      this._user.set(user);
  }

  changeAvatar(newAvatarIndex: number): void {
    const userId = this.user()?.id;
    if (!userId) return;
  
    this.http.put<Visitor>(`${this.url}/changeAvatar/${newAvatarIndex}`,{})
      .subscribe({
        next: (updatedUser) => this.setUser(updatedUser),
        error: (error) => console.error('Failed to change avatar:', error)
      });
  }
  changeElo(newElo: number): void {
    const userId = this.user()?.id;
    if (!userId) return;
  
    this.http.put<Visitor>(`${this.url}/changeElo/${newElo}`,{})
      .subscribe({
        next: (updatedUser) => this.setUser(updatedUser),
        error: (error) => console.error('Failed to change elo:', error)
      });
  }
}
