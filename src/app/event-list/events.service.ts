import { Injectable, signal, computed } from '@angular/core';
import { NewEventData, Event } from './event/event.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EventsService {
  url = environment.url + 'events';
  private isLocalStorageAvailable = typeof localStorage !== 'undefined';
  private events = signal<Event[]>([]);
  private _yourEvents = signal<Event[]>([]);
  private _otherEvents = signal<Event[]>([]);
  allEvents = this.events.asReadonly();
  yourEvents = this._yourEvents.asReadonly();
  otherEvents = this._otherEvents.asReadonly();

  constructor(private http: HttpClient, private router: Router) {}

  addEvent(event: NewEventData): Observable<Event> {
    return this.http
      .post<Event>(`${this.url}`, event)
      .pipe(tap((event) => this._yourEvents.update((events) => [...events, event])));
  }

  getEvents(): void {
    this.http.get<any>(`${this.url}`).subscribe((response) => {
      const events = response._embedded.events;
      this.events.set(events);
      if(events[0])
      this.filterEvents(events);
    });
  }

  removeEvent(id: number): void {
    this.http.delete(`${this.url}/${id}`).subscribe((result) => {
      const updatedEvents = this.events().filter((event) => event.id != id);
      this.events.set(updatedEvents);
    });
  }

  joinEvent(id:number):void{
    
  }

  private filterEvents(events: Event[]): void {
    let currentUser = "???"
    if(this.isLocalStorageAvailable)
     currentUser = localStorage.getItem('username')||"???";
    // const yourEvents = events.filter((event) =>
    //    event.joined.filter((name) => name == currentUser)
    // );
    // this._yourEvents.set(yourEvents);
    // const otherEvents = events.filter((event) =>
    //   event.joined.filter((name) => name != currentUser)
    // );
    // this._otherEvents.set(otherEvents);
  }
}
