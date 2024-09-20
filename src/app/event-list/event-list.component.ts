import { Component, inject } from '@angular/core';
import { Event } from '../models/event.model';
import { EventComponent } from './event/event.component';
import { EventFormComponent } from './event-form/event-form.component';
import { EventsService } from '../services/events.service';
import { EventDetailsComponent } from './event-details/event-details.component';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MapService } from '../services/map.service';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [EventComponent, EventFormComponent, EventDetailsComponent,MatButtonModule,MatFormFieldModule],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.scss'
})
export class EventListComponent {
  private eventsService = inject(EventsService);
  private mapService = inject(MapService)
  openForm = false;
  selectedEvent: Event | null = null
  joinedEvents = this.eventsService.yourEvents;
  otherEvents = this.eventsService.otherEvents;
  currentPosition = this.mapService.currentPosition;
  
  onCreateEvent() {
    this.openForm = true;
  }
  onCloseForm() {
    this.openForm = false;
  }
  onDetails(event: Event): void {
    this.selectedEvent = event;
  }
  onCloseDetails(): void {
    this.selectedEvent = null; 
  }
  onJoinEvent(eventId:string) {
      this.eventsService.joinEvent(eventId);
      this.onCloseDetails();
  }
  onLeaveEvent(eventId:string){
      this.eventsService.leaveEvent(eventId);
      this.onCloseDetails();
  }

  onDeleteEvent(eventId:string) {
    this.eventsService.deleteEvent(eventId);
    this.onCloseDetails();
  }
}
