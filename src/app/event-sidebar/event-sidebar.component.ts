import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatLabel } from '@angular/material/form-field';
import { EventsService } from '../services/events.service';
import { MapService } from '../services/map.service';
import { Event } from '../models/event.model';
import { EventListComponent } from '../event-list/event-list.component';

@Component({
  selector: 'app-event-sidebar',
  standalone: true,
  imports: [
    MatButton,
    MatDivider,
    MatLabel,
    EventListComponent,
  ],
  templateUrl: './event-sidebar.component.html',
  styleUrl: './event-sidebar.component.scss',
})
export class EventSidebarComponent {
  private eventsService = inject(EventsService);
  private mapService = inject(MapService);
  joinedEvents = this.eventsService.yourEvents;
  otherEvents = this.eventsService.otherEvents;
  selectedEvent = this.eventsService.selectedEvent;

  onToggleEventForm() {
    this.eventsService.toggleEventForm()
  }

  onOpenDetails(event: Event): void {
    this.mapService.flyTo(event.latLng);
    this.eventsService.selectEvent(event);
  }

}
