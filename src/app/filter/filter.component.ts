import { Component, signal, inject } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { EventsService } from '../services/events.service';
import { MatDivider } from '@angular/material/divider';
import {MatMenuModule} from '@angular/material/menu';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [MatButton,MatCheckbox,MatIcon, MatDivider,MatMenuModule, MatSlideToggleModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss'
})
export class FilterComponent {
  hideFullEvents = signal<boolean>(false);
  //time ascending is the default sort by from the backend, so the first click has to change the direction
  ascendingTime = false; 
  ascendingDistance = true;
  eventService = inject(EventsService);
  sort:'Time' | 'Distance' = 'Time';
  
  sortByDistance(): void {
    this.eventService.sortByDistance(this.ascendingDistance);
    this.ascendingDistance = !this.ascendingDistance;
    this.sort = "Distance"
  }

  sortByTime(): void {
    this.eventService.sortByTime(this.ascendingTime);
    this.ascendingTime = !this.ascendingTime;
      this.sort = "Time"
  }

  toggleFullEvents(): void {
    this.hideFullEvents.set(!this.hideFullEvents());
    this.eventService.hideFullEvents(this.hideFullEvents());
  }
}
