import { inject, Injectable, signal, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import User from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  url = environment.url + 'users';
  user = signal<User>({ name: '???', id: '0' });
  uid: string;
  private http = inject(HttpClient);

  constructor( @Inject(PLATFORM_ID) private _platformId: Object){
      this.uid = this._platformId==='browser' ? localStorage.getItem('uuid')! : '0';
  }

  checkUser(): void {
      this.http
        .get<{ id: string; name: string }>(`${this.url}/check/${this.uid}`)
        .subscribe({
          next: (user) => {this.setUser(user)},
          error: (error) => console.log(error),
          complete: () => console.log('Http request completed'),
        });
  }

  private setUser(user: User): void {
    if (user && this._platformId==='browser') {
      this.user.set(user);
      localStorage.setItem('uuid', String(user.id));
    } else {
      console.log('Something went horrible wrong!');
    }
  }
}
