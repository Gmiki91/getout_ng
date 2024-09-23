import { Component, inject, input, output } from '@angular/core';
import { Event, LatLng } from '../models/event.model';
import { EventComponent } from './event/event.component';
import { EventDetailsComponent } from './event-details/event-details.component';
import { MatButtonModule } from '@angular/material/button';
import { MapService } from '../services/map.service';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [EventComponent, EventDetailsComponent, MatButtonModule],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.scss',
})
export class EventListComponent {
  private mapService = inject(MapService);
  events = input.required<Event[]>();
  openDetails = output<Event>();
  currentPosition = this.mapService.currentPosition;

  onFindMarker(eventPosition: LatLng): void {
    this.mapService.setMarkerPosition(eventPosition);
  }

  onDetails(event: Event): void {
    this.openDetails.emit(event);
  }
}
