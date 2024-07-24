import { Component } from '@angular/core';
import { EventComponent } from './event/event.component';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [EventComponent],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.scss'
})
export class EventListComponent {

}
