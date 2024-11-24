import { Injectable, signal, inject } from '@angular/core';
import { NewEventData, Event, LatLng } from '../models/event.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, tap } from 'rxjs';
import { calculateDistance } from '../utils/utils';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class EventsService {
  private url = environment.url + 'events';
  private bridgeUrl = environment.url + 'user-events';
  private _http = inject(HttpClient);
  private _yourEvents = signal<Event[]>([]);
  private _otherEvents = signal<Event[]>([]);
  private _selectedEvent = signal<Event>({} as Event);
  private _isEventFormOpen = signal<boolean>(false);
  private _areEventsLoaded = signal<boolean>(false);
  private _hiddenEvents: Event[] = [];
  private _currentPosition = signal<LatLng>({ lat: 0, lng: 0 });
  private _userService = inject(UserService);
  private _user = this._userService.user;
  currentPosition = this._currentPosition.asReadonly();
  yourEvents = this._yourEvents.asReadonly();
  otherEvents = this._otherEvents.asReadonly();
  selectedEvent = this._selectedEvent.asReadonly();
  isEventFormOpen = this._isEventFormOpen.asReadonly();
  areEventsLoaded = this._areEventsLoaded.asReadonly();

  //save the sorted events for the events list, returns unsorted for the map markers
  getEvents(): Observable<{ joinedEvents: Event[]; otherEvents: Event[] }> {
    return this._http
      .get<{ joinedEvents: Event[]; otherEvents: Event[] }>(
        `${this.url}/user/${this._user().id}`
      )
      .pipe(
        tap((result) => {
          this.setEvents(result.joinedEvents, result.otherEvents);
          this._areEventsLoaded.set(true);
        })
      );
  }

  setEvents(joinedEvents: Event[], otherEvents: Event[]): void {
    const updatedOtherEvents = this.updateDistanceOfEvents(otherEvents);
    const updatedYourEvents = this.updateDistanceOfEvents(joinedEvents);

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

  deleteEvent(eventId: string, ownerId: string): void {
    if (this._user().id === ownerId) {
      this._http.delete(`${this.bridgeUrl}/events/${eventId}`).subscribe(() => {
        //update both lists
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
  joinEvent(eventId: string,distance:number): void {
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
  leaveEvent(eventId: string,distance:number): void {
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
     //close eventform if open
     if(this._isEventFormOpen()){this._isEventFormOpen.set(false)}
  }

  selectEventById(eventId: string): void {
    const events = this._yourEvents().concat(this._otherEvents());
    const event = events.find(event => event.id === eventId);
    if(event){
      this.selectEvent(event);
    }else{
      console.log('event not found')
    }
    //close eventform if open
    if(this._isEventFormOpen()){this._isEventFormOpen.set(false)}
  }

  
  // create new event form
  toggleEventForm():void{
    this._isEventFormOpen.set(!this._isEventFormOpen())
    //close event details if open
    if(this._selectedEvent().id){this._selectedEvent.set({}as Event);}
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

  isUserJoined(id: string): boolean {
    return this.yourEvents().some((e) => e.id == id);
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
