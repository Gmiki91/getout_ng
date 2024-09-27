import { Component, signal, inject, computed } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatButton } from '@angular/material/button';
import { EventsService } from '../services/events.service';
import { UserService } from '../services/user.service';
import { MatIcon } from '@angular/material/icon';

type IconText = 'expand_more'| 'expand_less'|'unfold_more' ;

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [MatCheckbox, MatButton, MatIcon],
  templateUrl: './filter-bar.component.html',
  styleUrl: './filter-bar.component.scss',
})
export class FilterBarComponent {
  hideFullEvents = signal<boolean>(false);
  ascendingDistance = true;
  ascendingTime = true;
  distanceIcon :IconText = 'unfold_more';
  timeIcon:IconText = 'unfold_more';
  eventService = inject(EventsService);
  userService = inject(UserService);
  username = computed(()=>this.userService.user().name);

  sortByDistance(): void {
    this.eventService.sortByDistance(this.ascendingDistance);
    this.distanceIcon = this.ascendingDistance ? 'expand_more' : 'expand_less';
    this.timeIcon = 'unfold_more';
    this.ascendingDistance = !this.ascendingDistance;
  }

  sortByTime(): void {
    this.eventService.sortByTime(this.ascendingTime);
    this.timeIcon = this.ascendingTime ? 'expand_more' : 'expand_less';
    this.distanceIcon = 'unfold_more';
    this.ascendingTime = !this.ascendingTime;
  }

  toggleFullEvents(): void {
    this.hideFullEvents.set(!this.hideFullEvents());
    this.eventService.hideFullEvents(this.hideFullEvents());
  }
}
