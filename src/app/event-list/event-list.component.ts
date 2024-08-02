import { Component,OnInit,inject } from '@angular/core';
import { EventComponent } from './event/event.component';
import { EventFormComponent } from './event-form/event-form.component';
import { EventsService } from './events.service';
import { Event } from './event/event.model';
@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [EventComponent,EventFormComponent],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.scss'
})
export class EventListComponent implements OnInit {
  private eventsService=inject(EventsService);
  openForm=false;
  events = this.eventsService.allEvents;

  ngOnInit(): void {
      this.eventsService.getEvents();
  }
  onCreateEvent(){
    this.openForm=true;
  }
  onCloseForm(){
    this.openForm=false;
  }
}
