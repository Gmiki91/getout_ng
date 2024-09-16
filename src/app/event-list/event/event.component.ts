import { Component,input} from '@angular/core';
import { Event } from '../../models/event.model';
import { TimeUntilPipe } from '../../time-until.pipe';
import {MatCardModule} from '@angular/material/card';
@Component({
  selector: 'app-event',
  standalone: true,
  imports: [TimeUntilPipe,MatCardModule],
  templateUrl: './event.component.html',
  styleUrl: './event.component.scss',
})
export class EventComponent {
  event=input.required<Event>();
}
