import { Component,input,inject} from '@angular/core';
import { Event } from './event.model';
import { DatePipe } from '@angular/common';
import { EventsService } from '../events.service';
@Component({
  selector: 'app-event',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './event.component.html',
  styleUrl: './event.component.scss',
})
export class EventComponent {
  event=input.required<Event>();
  eventsService = inject(EventsService);

  remove(){
    this.eventsService.removeEvent(this.event().id);
  }

  join(){
    this.eventsService.joinEvent(this.event().id);
  }
}
