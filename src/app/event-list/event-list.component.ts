import { Component,inject } from '@angular/core';
import { EventComponent } from './event/event.component';
import { EventFormComponent } from './event-form/event-form.component';
import { EventsService } from '../services/events.service';
import { EventDetailsComponent } from './event-details/event-details.component';
@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [EventComponent,EventFormComponent,EventDetailsComponent],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.scss'
})
export class EventListComponent{
  private eventsService=inject(EventsService);
  openForm=false;
  openDetails=false;
  joinedEvents = this.eventsService.yourEvents;
  otherEvents = this.eventsService.otherEvents;

  onCreateEvent(){
    this.openForm=true;
  }
  onCloseForm(){
    this.openForm=false;
  }
  onDetails(){
    this.openDetails=!this.openDetails;
  }
}
