import { Component } from '@angular/core';
import { Event } from './event.model';
@Component({
  selector: 'app-event',
  standalone: true,
  imports: [],
  templateUrl: './event.component.html',
  styleUrl: './event.component.scss',
})
export class EventComponent {
  event: Event = {
    title: 'Hógolyózás',
    location: 'Budapest',
    date: 1000,
    joined: 5,
  };
}
