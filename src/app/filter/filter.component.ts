import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { EventsService } from '../services/events.service';
import {MatMenuModule} from '@angular/material/menu';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSliderModule} from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { slideDown } from '../utils/utils';
@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [MatIcon,MatMenuModule, MatSlideToggleModule,MatSliderModule,FormsModule],
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
  hideFullEvents = false
  
  
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
    this.eventService.applyFilters(this.hideFullEvents,this.maxDistance);
  }

  onSliderDragEnd():void{
   this.eventService.applyFilters(this.hideFullEvents,this.maxDistance)
  }
}
