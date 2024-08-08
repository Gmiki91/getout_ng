import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { environment } from '../environments/environment';
import User from './user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  url = environment.url + 'users';
  user = signal<User>({name:'???', id:'0'});
  private http = inject(HttpClient);
  // cookieService = inject(SsrCookieService);

  checkUser(): void {
    // if (isPlatformBrowser(this.platformId)) {
      //this.cookieService.get('uid') || '0';
      const uid = localStorage.getItem('uuid')||'0';
      this.http
        .get<{ id: string; name: string }>(`${this.url}/check/${uid}`)
        .subscribe((user) => {
          if (user) {
            this.user.set(user);
            //this.cookieService.set('uid', user.id);
            localStorage.setItem('uuid',user.id);
          } else {
            console.log('Something went horrible wrong!');
          }
        });
    }
}
