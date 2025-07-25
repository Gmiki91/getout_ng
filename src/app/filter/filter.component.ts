import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { EventsService } from '../services/events.service';
import {MatMenuModule} from '@angular/material/menu';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { slideDown } from '../utils/utils';
import { MatInputModule } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import {MatSliderModule} from '@angular/material/slider';
@Component({
    selector: 'app-filter',
    imports: [MatIcon, MatMenuModule, MatSlideToggleModule, MatInputModule,MatTooltip, FormsModule,MatSliderModule ],
    templateUrl: './filter.component.html',
    styleUrl: './filter.component.scss',
    animations: [slideDown]
})
export class FilterComponent {
  //time ascending is the default sort by from the backend, so the first click has to change the direction
  ascendingTime = false; 
  ascendingDistance = true;
  eventService = inject(EventsService);
  sort:'Time' | 'Distance' = 'Time';
  maxDistance = 10;
  hideFullEvents = false;
  distanceToggle=false;
  formatLabel(value: number): string {
    return `${value}km`;
  }
  
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
    this.hideFullEvents = !this.hideFullEvents;
    this.applyFilters();
  }

  toggleDistance(): void {
    this.distanceToggle = !this.distanceToggle;
    this.maxDistance = this.distanceToggle ? (this.maxDistance === 41000 ? 10 : this.maxDistance) : 41000;
    this.applyFilters();
  }
  
  updateDistance(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.maxDistance = +value;
    this.applyFilters();
  }
  
  applyFilters(): void {
    this.eventService.applyFilters(this.hideFullEvents, this.maxDistance);
  }
}
