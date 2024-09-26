import { Component, signal, inject, computed } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { EventsService } from '../services/events.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [MatCheckboxModule, MatButtonModule],
  templateUrl: './filter-bar.component.html',
  styleUrl: './filter-bar.component.scss',
})
export class FilterBarComponent {
  hideFullEvents = signal<boolean>(false);
  ascendingDistance = true;
  ascendingTime = true;
  eventService = inject(EventsService);
  userService = inject(UserService);
  username = computed(()=>this.userService.user().name);

  sortByDistance(): void {
    this.eventService.sortByDistance(this.ascendingDistance);
    this.ascendingDistance = !this.ascendingDistance;
  }

  sortByTime(): void {
    this.eventService.sortByTime(this.ascendingTime);
    this.ascendingTime = !this.ascendingTime;
  }

  toggleFullEvents(): void {
    this.hideFullEvents.set(!this.hideFullEvents());
    this.eventService.hideFullEvents(this.hideFullEvents());
  }
}
