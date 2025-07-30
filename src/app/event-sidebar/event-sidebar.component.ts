import { Component, inject } from '@angular/core';
import { MatLabel } from '@angular/material/form-field';
import { EventsService } from '../services/events.service';
import { MapService } from '../services/map.service';
import { Event } from '../models/event.model';
import { EventListComponent } from '../event-list/event-list.component';
import { FilterComponent } from '../filter/filter.component';
import { StateService } from '../services/state.service';
import { NgxSkeletonLoaderComponent } from "ngx-skeleton-loader";

@Component({
  selector: 'app-event-sidebar',
  imports: [FilterComponent, MatLabel, EventListComponent, FilterComponent, NgxSkeletonLoaderComponent],
  templateUrl: './event-sidebar.component.html',
  styleUrl: './event-sidebar.component.scss',
})
export class EventSidebarComponent {
  private eventsService = inject(EventsService);
  private mapService = inject(MapService);
  private stateService = inject(StateService);
  joinedEvents = this.eventsService.yourEvents;
  otherEvents = this.eventsService.otherEvents;
  selectedEvent = this.eventsService.selectedEvent;
  showEvents = this.stateService.areEventsLoaded;
  onOpenDetails(event: Event): void {
    this.mapService.flyTo(event.latLng);
    this.mapService.highlightMarker(event.id);
    this.eventsService.selectEvent(event);
  }
}
