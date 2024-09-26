import { Injectable, signal, inject } from '@angular/core';
import { NewEventData, Event, LatLng } from '../models/event.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, tap, map } from 'rxjs';
import { DistanceCalculator } from '../utils/distance-calculator';
import { MapService } from './map.service';

@Injectable({ providedIn: 'root' })
export class EventsService {
  private url = environment.url + 'events';
  private bridgeUrl = environment.url + 'user-events';
  private userId = localStorage.getItem('uuid');
  private http = inject(HttpClient);
  private _mapService = inject(MapService);
  private isLocalStorageAvailable = typeof localStorage !== 'undefined';
  private _allEvents = signal<Event[]>([]); 
  private _yourEvents = signal<Event[]>([]);
  private _otherEvents = signal<Event[]>([]);
  private _selectedEvent = signal<Event>({} as Event);
  private _hiddenEvents: Event[] = [];

  allEvents = this._allEvents.asReadonly(); //used by the map component
  yourEvents = this._yourEvents.asReadonly();
  otherEvents = this._otherEvents.asReadonly();
  selectedEvent = this._selectedEvent.asReadonly();

  addEvent(event: NewEventData): Observable<Event> {
    if (this.userId) event = { ownerId: this.userId, ...event };
    return this.http.post<Event>(`${this.bridgeUrl}`, event).pipe(
      tap((event) => {
        event.distance = this.addDistance(event.latLng);
        this._yourEvents.update((events) => [event, ...events]);
        this._allEvents.update((events) => [event, ...events]);
      })
    );
  }

  getEvents(): Observable<void> {
    return this.http
      .get<{ joinedEvents: Event[]; otherEvents: Event[] }>(
        `${this.url}/user/${this.userId}`
      )
      .pipe(
        tap((response) => {
          this._allEvents.set(
            response.joinedEvents.concat(response.otherEvents)
          );
          this._yourEvents.set(response.joinedEvents);
          this._otherEvents.set(response.otherEvents);
        }),
        map(() => void 0)
      );
  }

  deleteEvent(eventId: string, ownerId: string): void {
    if (this.userId === ownerId) {
      this.http.delete(`${this.bridgeUrl}/events/${eventId}`).subscribe(() => {
        this._otherEvents.update((events) =>
          events.filter((e) => e.id !== eventId)
        );
        this._yourEvents.update((events) =>
          events.filter((e) => e.id !== eventId)
        );
        this._allEvents.update((events) =>
          events.filter((e) => e.id !== eventId)
        );
      });
    } else {
      alert("You can only delete events you've created");
    }
  }

  joinEvent(eventId: string): void {
    this.http
      .post<Event>(`${this.bridgeUrl}/${this.userId}/join/${eventId}`, null)
      .subscribe((event) => {
        if (event) {
          this._yourEvents.update((events) => [...events, event]);
          this._otherEvents.update((events) =>
            events.filter((e) => e.id !== event.id)
          );
        }
      });
  }

  leaveEvent(eventId: string): void {
    this.http
      .delete<Event>(`${this.bridgeUrl}/${eventId}/participants/${this.userId}`)
      .subscribe((event) => {
        if (event) {
          this._otherEvents.update((events) => [...events, event]);
          this._yourEvents.update((events) =>
            events.filter((e) => e.id !== event.id)
          );
        }
      });
  }

  selectEvent(event: Event): void {
    this._selectedEvent.set(event);
  }

  updateDistances() {
    const updatedOtherEvents = this.updateDistanceOfEvents(this._otherEvents());
    const updatedYourEvents = this.updateDistanceOfEvents(this._yourEvents());

    this._otherEvents.set(updatedOtherEvents);
    this._yourEvents.set(updatedYourEvents);
  }
  // FILTER METHODS
  sortByDistance(ascending: boolean): void {
    const funk = ascending
      ? (a: Event, b: Event) => a.distance - b.distance
      : (a: Event, b: Event) => b.distance - a.distance;
    this._otherEvents.update((events) => {
      return events.sort(funk);
    });
    this._yourEvents.update((events) => {
      return events.sort(funk);
    });
  }

  sortByTime(ascending: boolean): void {
    const funk = ascending
      ? (a: Event, b: Event) =>
          new Date(a.time).getTime() - new Date(b.time).getTime()
      : (a: Event, b: Event) =>
          new Date(b.time).getTime() - new Date(a.time).getTime();
    this._otherEvents.update((events) => {
      return events.sort(funk);
    });
    this._yourEvents.update((events) => {
      return events.sort(funk);
    });
  }

  hideFullEvents(hide: boolean): void {
    if (hide) {
      this._hiddenEvents = this._otherEvents().slice();
      this._otherEvents.update((events) =>
        events.filter((e) => e.max > e.participants.length)
      );
    } else {
      this._otherEvents.set(this._hiddenEvents);
    }
  }

  // PRIVATE METHODS
  private updateDistanceOfEvents(events: Event[]): Event[] {
    return events.map((event) => {
      event.distance = this.addDistance(event.latLng);
      return event;
    });
  }

  private addDistance(latLng: LatLng): number {
    const currentPosition = this._mapService.currentPosition();
    const distance = DistanceCalculator.calculateDistance(
      currentPosition.lat,
      currentPosition.lng,
      latLng.lat,
      latLng.lng
    );
    return distance;
  }
}
