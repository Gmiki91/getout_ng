import { Injectable, signal, inject } from '@angular/core';
import { NewEventData, Event, LatLng, UpdateEventData } from '../models/event.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { calculateDistance } from '../utils/utils';
import { UserService } from './user.service';
import { MapService } from './map.service';
import { StateService } from './state.service';

@Injectable({ providedIn: 'root' })
export class EventsService {
  private url = environment.url + 'events';
  private bridgeUrl = environment.url + 'user-events';
  private _http = inject(HttpClient);
  private _mapService = inject(MapService)
  private _userService = inject(UserService);
  private _stateService = inject(StateService);

  private _yourEvents = signal<Event[]>([]);
  private _otherEvents = signal<Event[]>([]);
  private _selectedEvent = signal<Event>({} as Event);
  private _currentPosition = signal<LatLng>({ lat: 0, lng: 0 });
  private _user = this._userService.user;
  private _unfilteredOtherEvents: Event[] = [];
  private _unfilteredYourEvents: Event[] = [];
  currentPosition = this._currentPosition.asReadonly();
  yourEvents = this._yourEvents.asReadonly();
  otherEvents = this._otherEvents.asReadonly();
  selectedEvent = this._selectedEvent.asReadonly();

  //save the sorted events for the events list, returns unsorted for the map markers
  getEvents(): Observable<{ joinedEvents: Event[]; otherEvents: Event[] }> {
    return this._http
      .get<{ joinedEvents: Event[]; otherEvents: Event[] }>(
        `${this.url}/user/${this._user().id}`
      )
      .pipe(
        catchError((error) => {
          alert('An error occurred while fetching events, please try again!');
          return throwError(()=>new Error("An error occurred while fetching events: " + error.message));
        }),
        tap((result) => {
          this.setEvents(result.joinedEvents, result.otherEvents);
          this._stateService.eventsLoaded(true);
        })
      );
  }

  setEvents(joinedEvents: Event[], otherEvents: Event[]): void {
    const updatedOtherEvents = this.updateDistanceOfEvents(otherEvents);
    const updatedYourEvents = this.updateDistanceOfEvents(joinedEvents);

    this._unfilteredOtherEvents = updatedOtherEvents;
    this._unfilteredYourEvents = updatedYourEvents;
    this._otherEvents.set(updatedOtherEvents);
    this._yourEvents.set(updatedYourEvents);
  }

  addEvent(event: NewEventData): Observable<Event> {
    if (this._user().id) event = { ownerId: this._user().id, ...event };
    return this._http.post<Event>(`${this.bridgeUrl}`, event).pipe(
      tap((event) => {
        event.distance = this.addDistance(event.latLng);
        this._yourEvents.update((events) => [event, ...events]);
      })
    );
  }

  updateEvent(event:UpdateEventData):Observable<Event>{
    return this._http.patch<Event>(`${this.url}/${event.id}`,event).pipe(tap(event=>this.updateList(event)));
  }

 private updateList(event: UpdateEventData): void {
    const isUserJoined = this._yourEvents().some(yourEvent => yourEvent.id === event.id);
    const eventsList = isUserJoined ? this._yourEvents() : this._otherEvents();
    const eventToUpdate = eventsList.find(existingEvent => existingEvent.id === event.id);
  
    if (eventToUpdate) {
      // Merge the event with the new data
      const updatedEvent = { ...eventToUpdate, ...event };
      // If a new location (latLng) is provided, calculate the distance
      if (event.latLng) {
        updatedEvent.distance = this.addDistance(event.latLng);
        this._mapService.removeMarkerById(updatedEvent.id);
        this._mapService.addMarker(updatedEvent);
      }
  
      // Update the corresponding event list
      if (isUserJoined) {
        this._yourEvents.set(this._yourEvents().filter(yourEvent=>yourEvent.id !==event.id));
        this._yourEvents.update((events) => [updatedEvent, ...events]);
      } else {
        this._otherEvents.set(this._otherEvents().filter(otherEvent=>otherEvent.id !==event.id));
        this._otherEvents.update((events) => [updatedEvent, ...events]);
      }
    }
  }
  

  deleteEvent(eventId: string, ownerId: string): void {
    if (this._user().id === ownerId) {
      this._http.delete(`${this.bridgeUrl}/events/${eventId}`).subscribe(() => {
        this._unfilteredYourEvents = this._unfilteredYourEvents.filter((e) => e.id !== eventId);
        this._unfilteredOtherEvents = this._unfilteredOtherEvents.filter((e) => e.id !== eventId);
        this._otherEvents.update((events) =>
          events.filter((e) => e.id !== eventId)
        );
        this._yourEvents.update((events) =>
          events.filter((e) => e.id !== eventId)
        );
      });
    } else {
      // alert("You can only delete events you've created");
    }
  }

  // distance param needed because it is not included in database
  joinEvent(eventId: string, distance: number): void {
    this._http
      .post<Event>(`${this.bridgeUrl}/${this._user().id}/join/${eventId}`, null)
      .subscribe((event) => {
        if (event) {
          event.distance = distance;
          this._yourEvents.update((events) => [...events, event]);
          this._otherEvents.update((events) =>
            events.filter((e) => e.id !== event.id)
          );
        }
      });
  }

  // distance param needed because it is not included in database
  leaveEvent(eventId: string, distance: number): void {
    this._http
      .delete<Event>(`${this.bridgeUrl}/${eventId}/participants/${this._user().id}`)
      .subscribe((event) => {
        if (event) {
          event.distance = distance;
          this._otherEvents.update((events) => [...events, event]);
          this._yourEvents.update((events) =>
            events.filter((e) => e.id !== event.id)
          );
        }
      });
  }

  // the selected event for the details tab
  selectEvent(event: Event): void {
    this._selectedEvent.set(event);
    this._mapService.removeTemporaryMarker();
    this._mapService.setPosition(event.location,event.latLng);
    this._stateService.toggleEventDetails();
  }

  selectEventById(eventId: string): void {
    const events = this._yourEvents().concat(this._otherEvents());
    const event = events.find(event => event.id === eventId);
    if(event){
      this.selectEvent(event);
    }else{
      console.log('event not found')
    }
  }

  //for distance calculation and autofill proximity
  setCurrentPosition(position:LatLng){
    this._currentPosition.set(position);
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

  applyFilters(hide: boolean, distance: number): void {
    this._otherEvents.set(
      this._unfilteredOtherEvents.filter((event) => {
        const passesFullFilter = !hide || (event.max == 0 || event.max > event.participants.length);
        const passesDistanceFilter = event.distance <= distance * 1000;
         if(!passesDistanceFilter || !passesFullFilter) this._mapService.removeMarkerById(event.id);
         if(passesDistanceFilter && passesFullFilter) this._mapService.addMarker(event);
        return passesFullFilter && passesDistanceFilter;
      })
    );

    this._yourEvents.set(
      this._unfilteredYourEvents.filter(event=>{
        const passesDistanceFilter = event.distance <= distance * 1000;
        if(!passesDistanceFilter) this._mapService.removeMarkerById(event.id);
        else this._mapService.addMarker(event);
        return passesDistanceFilter;
      })
    );
  }

  isUserJoined(id: string): boolean {
    return this.yourEvents().some((e) => e.id == id);
  }

  updateDistances():void{
    this.updateDistanceOfEvents(this._otherEvents());
    this.updateDistanceOfEvents(this._yourEvents());
  }

  private updateDistanceOfEvents(events: Event[]): Event[] {
    return events.map((event) => {
      event.distance = this.addDistance(event.latLng);
      return event;
    });
  }

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
