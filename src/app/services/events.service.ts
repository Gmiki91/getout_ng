import { Injectable, signal } from '@angular/core';
import { NewEventData, Event } from '../models/event.model';
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

  constructor(private http: HttpClient, private router: Router) { }

  addEvent(event: NewEventData): Observable<Event> {
    return this.http
      .post<Event>(`${this.url}`, event)
      .pipe(tap((event) => {
        this._yourEvents.update((events) => [...events, event]);
        this.events.update((events) => [...events, event]);
      }
      ));
  }

  getEvents(): void {
    const id = localStorage.getItem("uuid")
    this.http.get<{ joinedEvents: Event[], otherEvents: Event[] }>(`${this.url}/${id}`).subscribe((response) => {
      console.log(response)
      this._yourEvents.set(response.joinedEvents);
      this._otherEvents.set(response.otherEvents);
    })
  }

  removeEvent(id: string): void {
    this.http.delete(`${this.url}/${id}`).subscribe((result) => {
      const updatedEvents = this.events().filter((event) => event.id != id);
      this.events.set(updatedEvents);
    });
  }
}
