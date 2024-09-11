import { Component,input,inject} from '@angular/core';
import { Event } from '../../models/event.model';
import { DatePipe } from '@angular/common';
import { EventsService } from '../../services/events.service';
import { UserEventService } from '../../services/userEvent.service';
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
  userEventService =inject(UserEventService)

  remove(){
    this.eventsService.removeEvent(this.event().id);
  }

  join(){
    this.userEventService.joinEvent(this.event().id);
  }
}
