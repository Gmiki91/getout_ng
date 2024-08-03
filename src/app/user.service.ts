import { Injectable } from '@angular/core';
import { nouns,adjectives } from './words';

@Injectable({providedIn: 'root'})
export class UserService {
  private userKey = 'username';

 private generateUsername(): string {
    let adjective = adjectives[Math.floor(Math.random() * 200)];
    adjective = adjective.charAt(0).toUpperCase() + adjective.slice(1);
    let noun = nouns[Math.floor(Math.random() * 200)];
    noun = noun.charAt(0).toUpperCase() + noun.slice(1);
    return `${adjective} ${noun}`;
  }

  getUsername(): string {
    let username = localStorage.getItem(this.userKey);
    if (!username) {
      username = this.generateUsername();
      localStorage.setItem(this.userKey, username);
    }
    return username;
  }
}
