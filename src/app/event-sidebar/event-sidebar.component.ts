import { Component, inject } from '@angular/core';
import { EventFormComponent } from '../event-list/event-form/event-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { EventsService } from '../services/events.service';
import { EventListComponent } from '../event-list/event-list.component';
import { Event } from '../models/event.model';
import { EventDetailsComponent } from '../event-list/event-details/event-details.component';

@Component({
  selector: 'app-event-sidebar',
  standalone: true,
  imports: [
    EventFormComponent,
    MatFormFieldModule,
    EventListComponent,
    EventDetailsComponent,
  ],
  templateUrl: './event-sidebar.component.html',
  styleUrl: './event-sidebar.component.scss',
})
export class EventSidebarComponent {
  private eventsService = inject(EventsService);
  joinedEvents = this.eventsService.yourEvents;
  otherEvents = this.eventsService.otherEvents;
  selectedEvent = this.eventsService.selectedEvent;
  openForm = false;

  onCreateEvent() {
    this.openForm = true;
  }
  onCloseForm() {
    this.openForm = false;
  }
  onOpenDetails(event: Event): void {
    this.eventsService.selectEvent(event);
  }
  onCloseDetails(): void {
    this.eventsService.selectEvent({} as Event);
  }

  onChangeParticipation(join: boolean, eventId: string) {
    if (join) {
      this.eventsService.joinEvent(eventId);
    } else {
      this.eventsService.leaveEvent(eventId);
    }
    this.onCloseDetails();
  }

  onDeleteEvent(eventId: string, ownerId: string) {
    this.eventsService.deleteEvent(eventId, ownerId);
    this.onCloseDetails();
  }

  isUserJoined(id: string): boolean {
    return this.joinedEvents().some((e) => e.id == id);
  }
}
