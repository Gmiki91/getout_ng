import { Component, inject } from '@angular/core';
import { MatLabel } from '@angular/material/form-field';
import { EventsService } from '../services/events.service';
import { MapService } from '../services/map.service';
import { Event } from '../models/event.model';
import { EventListComponent } from '../event-list/event-list.component';
import { slideDown } from '../utils/utils';

@Component({
  selector: 'app-event-sidebar',
  standalone: true,
  imports: [
    MatLabel,
    EventListComponent,
  ],
  templateUrl: './event-sidebar.component.html',
  styleUrl: './event-sidebar.component.scss',
  animations:[slideDown]
})
export class EventSidebarComponent {
  private eventsService = inject(EventsService);
  private mapService = inject(MapService);
  joinedEvents = this.eventsService.yourEvents;
  otherEvents = this.eventsService.otherEvents;
  selectedEvent = this.eventsService.selectedEvent;


  onOpenDetails(event: Event): void {
    this.mapService.flyTo(event.latLng);
    this.mapService.highlightMarker(event.id);
    this.eventsService.selectEvent(event);
  }
}
