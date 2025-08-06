import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { EventsService } from '../services/events.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import { MatSliderModule } from '@angular/material/slider';
import { StateService } from '../services/state.service';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-filter',
  imports: [
    MatIcon,
    MatButtonModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatInputModule,
    MatTooltip,
    FormsModule,
    MatSliderModule,
  ],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss',
})
export class FilterComponent {
  eventService = inject(EventsService);
  stateService = inject(StateService);
  sortType = this.stateService.sortType;
  sortDirection = this.stateService.sortDirection;
  maxDistance = 10;
  formatLabel(value: number): string {
    return `${value}km`;
  }

  sortByDistance(): void {
    if (this.sortType() === 'Time')
      this.stateService.changeSortType('Distance');
  }

  sortByTime(): void {
    if (this.sortType() === 'Distance')
      this.stateService.changeSortType('Time');
  }

  toggleSortDirection(): void {
    this.stateService.toggleSortDirection();
  }

  toggleFullEvents(): void {
    this.stateService.toggleFullEvents();
  }

  // toggleDistance(): void {
  //   this.distanceToggle = !this.distanceToggle;
  //   this.maxDistance = this.distanceToggle ? (this.maxDistance === 41000 ? 10 : this.maxDistance) : 41000;
  // }

  updateDistance(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.maxDistance = +value;
  }
}
