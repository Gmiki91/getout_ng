import { Injectable, signal, inject,computed } from '@angular/core';
import { NewEventData, Event, LatLng } from '../models/event.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { UserService } from './user.service';
import { MapService } from './map.service';
import { StateService } from './state.service';
import { filterAndSortEvents } from '../utils/event-processing.utils';
import { calculateDistance } from '../utils/distance.utils';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class EventsService {
  private url = environment.url + 'events';
  private bridgeUrl = environment.url + 'user-events';
  private _http = inject(HttpClient);
  private _mapService = inject(MapService);
  private _userService = inject(UserService);
  private _stateService = inject(StateService);

  private _events = signal<Event[]>([]);
  private _selectedEvent = signal<Event>({} as Event);
  private _currentPosition = signal<LatLng>({ lat: 0, lng: 0 });
  private _viewportBounds = signal<[LatLng, LatLng]>([{lat:0,lng:0},{lat:0,lng:0}]);
  private _user = this._userService.user;
  currentPosition = this._currentPosition.asReadonly();
  selectedEvent = this._selectedEvent.asReadonly();
  snackBar = inject(MatSnackBar);
  eventCount = computed(()=>this._events().length);
  events = filterAndSortEvents(
    this._events,
    this._stateService,
    this._mapService,
    this._viewportBounds
  );

  getEvents(): Observable< Event[]> {
    return this._http.get<Event[]>(`${this.url}/user/${this._user().id}`)
      .pipe(catchError((error) => {
          this.snackBar.open('An error occurred while fetching events, please try again!',undefined,{duration:3000,verticalPosition:'top'});
          return throwError(()=>new Error("An error occurred while fetching events: " + error.message));
        }),
        tap((result) => {
          this.setEvents(result);
          this._stateService.eventsLoaded(true);
        })
      );
  }

  addEvent(event: NewEventData): Observable<Event> {
    if (this._user().id) event = { ownerId: this._user().id, ...event };
    return this._http.post<Event>(`${this.bridgeUrl}`, event).pipe(
      tap((event) => {
        event.distance = this.addDistance(event.latLng);
        this._events.update((events) => [event, ...events]);
      })
    );
  }

  // updateEvent(event: UpdateEventData): Observable<Event> {
  //   return this._http
  //     .patch<Event>(`${this.url}/${event.id}`, event)
  //     .pipe(tap((event) => this.updateList(event)));
  // }

  deleteEvent(eventId: string, ownerId: string): void {
    if (this._user().id === ownerId) {
      this._http.delete(`${this.bridgeUrl}/events/${eventId}`).subscribe(() => {
        this._events.update(events =>events.filter((e) => e.id !== eventId));
      });
    } else {
      // alert("You can only delete events you've created");
    }
  }

  joinEvent(eventId: string,distance:number): void {
    this._http
      .post<Event>(`${this.bridgeUrl}/${this._user().id}/join/${eventId}`, null)
      .subscribe(updatedEvent=>{
        updatedEvent.distance = distance;
        this._events.update(events =>  events.map(e => e.id === updatedEvent.id ? updatedEvent : e))
        this._selectedEvent.set(updatedEvent);
      })
  }

  leaveEvent(eventId: string,distance:number): void {
    this._http
      .delete<Event>(`${this.bridgeUrl}/${eventId}/participants/${this._user().id}`)
      .subscribe(updatedEvent=>{
        updatedEvent.distance = distance;
        this._events.update(events =>
          events.map(e => e.id === updatedEvent.id ? updatedEvent : e))
        });
  }

  // the selected event for the details tab
  selectEvent(event: Event): void {
    this._selectedEvent.set(event);
    this._mapService.removeTemporaryMarker();
    this._mapService.setPosition(event.location, event.latLng);
    this._stateService.toggleEventDetails();
  }

  selectEventById(eventId: string): void {
    const event = this._events().find((event) => event.id === eventId);
    if (event) {
      this.selectEvent(event);
    } else {
      console.log('event not found');
    }
  }

  //for distance calculation and autofill proximity
  setCurrentPosition(position: LatLng) {
    this._currentPosition.set(position);
  }

  updateDistances(): Event[] {
      return this._events().map((event) => {
        event.distance = this.addDistance(event.latLng);
        return event;
    });
  }

  setViewportBounds(sw: mapboxgl.LngLat, ne: mapboxgl.LngLat) {
    this._viewportBounds.set([sw, ne]);
  }

  private setEvents(events:Event[]): void {
    this._events.set(events);
    this.updateDistances();
  }

  // private updateList(event: UpdateEventData): void {
  //   const isUserJoined = this._yourEvents().some(
  //     (yourEvent) => yourEvent.id === event.id
  //   );
  //   const eventsList = isUserJoined ? this._yourEvents() : this._otherEvents();
  //   const eventToUpdate = eventsList.find(
  //     (existingEvent) => existingEvent.id === event.id
  //   );

  //   if (eventToUpdate) {
  //     // Merge the event with the new data
  //     const updatedEvent = { ...eventToUpdate, ...event };
  //     // If a new location (latLng) is provided, calculate the distance
  //     if (event.latLng) {
  //       updatedEvent.distance = this.addDistance(event.latLng);
  //       this._mapService.removeMarkerById(updatedEvent.id);
  //       this._mapService.addMarker(updatedEvent);
  //     }

  //     // Update the corresponding event list
  //     if (isUserJoined) {
  //       this._yourEvents.set(
  //         this._yourEvents().filter((yourEvent) => yourEvent.id !== event.id)
  //       );
  //       this._yourEvents.update((events) => [updatedEvent, ...events]);
  //     } else {
  //       this._otherEvents.set(
  //         this._otherEvents().filter((otherEvent) => otherEvent.id !== event.id)
  //       );
  //       this._otherEvents.update((events) => [updatedEvent, ...events]);
  //     }
  //   }
  // }

  private addDistance(latLng: LatLng): number {
    const currentPosition = this.currentPosition();
    const distance = calculateDistance(
      currentPosition.lat,
      currentPosition.lng,
      latLng.lat,
      latLng.lng
    );
    return distance;
  }
}
