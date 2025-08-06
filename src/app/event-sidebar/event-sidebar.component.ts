import { Component, inject } from '@angular/core';
import { EventsService } from '../services/events.service';
import { MapService } from '../services/map.service';
import { Event } from '../models/event.model';
import { FilterComponent } from '../filter/filter.component';
import { StateService } from '../services/state.service';
import { NgxSkeletonLoaderComponent } from "ngx-skeleton-loader";
import { EventComponent } from '../event/event.component';

@Component({
  selector: 'app-event-sidebar',
  imports: [FilterComponent,  EventComponent, FilterComponent, NgxSkeletonLoaderComponent],
  templateUrl: './event-sidebar.component.html',
  styleUrl: './event-sidebar.component.scss',
})
export class EventSidebarComponent {
  private eventsService = inject(EventsService);
  private mapService = inject(MapService);
  private stateService = inject(StateService);
  events = this.eventsService.events;
  selectedEvent = this.eventsService.selectedEvent;
  showEvents = this.stateService.areEventsLoaded;
  onOpenDetails(event: Event): void {
    this.mapService.flyTo(event.latLng);
    this.mapService.highlightMarker(event.id);
    this.eventsService.selectEvent(event);
  }
}
