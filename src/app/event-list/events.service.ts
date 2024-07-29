import { Injectable } from '@angular/core';
import { NewEventData, Event } from './event/event.model';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  events: Event[] = [];

  addEvent(event: NewEventData): void {
    const submitableEvent: Event = {
      id: '' + new Date().getTime(),
      joined: 0,
      ...event,
    };
    this.events.unshift(submitableEvent);
  }

  getEvents(): Event[] {
    return this.events;
  }
}
