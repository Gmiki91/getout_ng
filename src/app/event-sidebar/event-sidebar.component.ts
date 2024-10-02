import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatLabel } from '@angular/material/form-field';
import { EventsService } from '../services/events.service';
import { MapService } from '../services/map.service';
import { Event } from '../models/event.model';
import { EventFormComponent } from '../event-list/event-form/event-form.component';
import { EventListComponent } from '../event-list/event-list.component';
import { EventDetailsComponent } from '../event-list/event-details/event-details.component';

@Component({
  selector: 'app-event-sidebar',
  standalone: true,
  imports: [
    MatButton,
    MatDivider,
    MatLabel,
    EventFormComponent,
    EventListComponent,
    EventDetailsComponent,
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
  openForm = this.eventsService.isEventFormOpen;

  onToggleEventForm() {
    this.eventsService.toggleEventForm()
  }

  onOpenDetails(event: Event): void {
    this.mapService.flyTo(event.latLng);
    this.eventsService.selectEvent(event);
  }
  onCloseDetails(): void {
    this.eventsService.selectEvent({} as Event);
  }

  onChangeParticipation(join: boolean, eventId: string,distance:number) {
    if (join) {
      this.eventsService.joinEvent(eventId,distance);
    } else {
      this.eventsService.leaveEvent(eventId,distance);
    }
    this.onCloseDetails();
  }

  onDeleteEvent(eventId: string, ownerId: string) {
    this.eventsService.deleteEvent(eventId, ownerId);
    this.mapService.removeMarker(eventId);
    this.onCloseDetails();
  }

  isUserJoined(id: string): boolean {
    return this.joinedEvents().some((e) => e.id == id);
  }
}
