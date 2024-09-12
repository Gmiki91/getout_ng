import { Injectable, signal } from '@angular/core';
import { NewEventData, Event } from '../models/event.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EventsService {
  private url = environment.url + 'events';
  private bridgeUrl = environment.url + 'user-events'
  private isLocalStorageAvailable = typeof localStorage !== 'undefined';
  // private events = signal<Event[]>([]);
  private _yourEvents = signal<Event[]>([]);
  private _otherEvents = signal<Event[]>([]);
  // allEvents = this.events.asReadonly();
  yourEvents = this._yourEvents.asReadonly();
  otherEvents = this._otherEvents.asReadonly();
  private userId = localStorage.getItem("uuid");
  constructor(private http: HttpClient, private router: Router) { }

  addEvent(event: NewEventData): Observable<Event> {
    return this.http
      .post<Event>(`${this.url}`, event)
      .pipe(tap((event) => {
        this._yourEvents.update((events) => [...events, event]);
      }
      ));
  }

  getEvents(): void {
    this.http.get<{ joinedEvents: Event[], otherEvents: Event[] }>(`${this.url}/user/${this.userId}`).subscribe((response) => {
      this._yourEvents.set(response.joinedEvents);
      this._otherEvents.set(response.otherEvents);
    })
  }

  joinEvent(eventId: string): void {
    this.http.post<Event>(`${this.bridgeUrl}/join/${this.userId}/${eventId}`, null,).subscribe((joinedEvent) => {
      console.log("joined event ", eventId);
      this._yourEvents.update(events => [...events, joinedEvent]);
      this._otherEvents.update(events => events.filter(event => event.id !== eventId));
    });
  }

  leaveEvent(eventId: string): void { }

  deleteEvent(id: string): void {
    this.http.delete(`${this.url}/${id}`).subscribe(() => {
      const updatedEvents = this._yourEvents().filter((event) => event.id != id);
      this._yourEvents.set(updatedEvents);
    });
  }
}
