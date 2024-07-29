import { Component,OnInit } from '@angular/core';
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
  openForm=false;
  events:Event[] = [];

  constructor(private eventsService:EventsService){}
  ngOnInit(): void {
      this.events = this.eventsService.getEvents();
  }
  onCreateEvent(){
    this.openForm=true;
  }
  onCloseForm(){
    this.openForm=false;
  }
}
