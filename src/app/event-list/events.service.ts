import { Injectable } from '@angular/core';
import { NewEventData, Event } from './event/event.model';
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import {  Observable,map } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class EventsService {
  events: Event[] = [];
  url = environment.url + 'events';
  constructor(private http: HttpClient, private router: Router) { }

  addEvent(event: NewEventData): void {
    this.http.post<{ status: string }>(`${this.url}`, event).subscribe(result => {
        console.log(result);
  })
}

  getEvents(): Observable<Event[]> {
    return this.http.get<any>(`${this.url}`).pipe(
      map(response => response._embedded.events));
  }
}
