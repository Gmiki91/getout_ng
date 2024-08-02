import { Injectable, signal } from '@angular/core';
import { NewEventData, Event } from './event/event.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EventsService {
  private events = signal<Event[]>([]);
  url = environment.url + 'events';
  allEvents = this.events.asReadonly();

  constructor(private http: HttpClient, private router: Router) {}

  addEvent(event: NewEventData): Observable<Event> {
    return this.http
      .post<Event>(`${this.url}`, event)
      .pipe(tap((event) => this.events.update((events) => [...events, event])));
  }

  getEvents():void {
    this.http.get<any>(`${this.url}`).subscribe((response) => {
      this.events.set(response._embedded.events);
    });
  }

  remove(id: number):void {
    this.http.delete(`${this.url}/${id}`).subscribe((result) => {
      const updatedEvents = this.events().filter((event) => event.id != id);
      this.events.set(updatedEvents);
    });
  }
}
