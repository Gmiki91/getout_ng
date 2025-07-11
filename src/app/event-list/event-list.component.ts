import { Component, input, output } from '@angular/core';
import { Event } from '../models/event.model';
import { EventComponent } from './event/event.component';

@Component({
    selector: 'app-event-list',
    imports: [EventComponent],
    templateUrl: './event-list.component.html',
    styleUrl: './event-list.component.scss'
})
export class EventListComponent {
  events = input.required<Event[]>();
  openDetails = output<Event>();

  onDetails(event: Event): void {
    this.openDetails.emit(event);
  }
}
