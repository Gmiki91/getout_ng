import { Component, input, output } from '@angular/core';
import { Event } from '../models/event.model';
import { EventComponent } from './event/event.component';
import { EventDetailsComponent } from './event-details/event-details.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [EventComponent, EventDetailsComponent, MatButtonModule],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.scss',
})
export class EventListComponent {
  events = input.required<Event[]>();
  openDetails = output<Event>();

  onDetails(event: Event): void {
    this.openDetails.emit(event);
  }
}
