import { Component,input} from '@angular/core';
import { Event } from '../../models/event.model';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-event',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './event.component.html',
  styleUrl: './event.component.scss',
})
export class EventComponent {
  event=input.required<Event>();
}
