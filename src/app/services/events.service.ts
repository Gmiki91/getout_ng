import { Injectable, signal,inject } from '@angular/core';
import { NewEventData, Event } from '../models/event.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EventsService {
  private url = environment.url + 'events';
  private bridgeUrl = environment.url + 'user-events'
  private isLocalStorageAvailable = typeof localStorage !== 'undefined';
   private _allEvents = signal<Event[]>([]);
  private _yourEvents = signal<Event[]>([]);
  private _otherEvents = signal<Event[]>([]);
  allEvents = this._allEvents.asReadonly();
  yourEvents = this._yourEvents.asReadonly();
  otherEvents = this._otherEvents.asReadonly();
  private userId = localStorage.getItem("uuid");
  private http = inject(HttpClient);

  addEvent(event: NewEventData): Observable<Event> {
    if (this.userId)
      event = { ownerId: this.userId, ...event };
    return this.http
      .post<Event>(`${this.bridgeUrl}`, event)
      .pipe(tap((event) => {
        this._yourEvents.update(events=> [event,...events]);
        this._allEvents.update(events=> [event,...events]);
      }));
  }

  getEvents(): void {
    this.http.get<{ joinedEvents: Event[], otherEvents: Event[] }>(`${this.url}/user/${this.userId}`).subscribe((response) => {
      this._allEvents.set(response.joinedEvents.concat(response.otherEvents));
      this._yourEvents.set(response.joinedEvents);
      this._otherEvents.set(response.otherEvents);
    })
  }

  deleteEvent(eventId: string): void {
    this.http.delete(`${this.url}/${eventId}`).subscribe(() => {
      const updatedEvents = this._yourEvents().filter((event) => event.id != eventId);
      this._yourEvents.set(updatedEvents);
    });
  }

  joinEvent(eventId: string): void {
    this.http.post<Event>(`${this.bridgeUrl}/${this.userId}/join/${eventId}`, null,).subscribe(event => {
      if (event) {
        this._yourEvents.update(events => [...events, event]);
        this._otherEvents.update(events => events.filter(e => e.id !== event.id));
      }
    });
  }

  leaveEvent(eventId: string): void {
    this.http.delete<Event>(`${this.bridgeUrl}/${eventId}/participants/${this.userId}`).subscribe(event => {
      if (event) {
        this._otherEvents.update(events => [...events, event]);
        this._yourEvents.update(events => events.filter(e => e.id !== event.id));
      }
    });
  }
}
