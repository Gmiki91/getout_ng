import { Component, signal, inject, computed } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatButton } from '@angular/material/button';
import { EventsService } from '../services/events.service';
import { UserService } from '../services/user.service';
import { MatIcon } from '@angular/material/icon';

/*
// expand less : ↑
// unfold more : filter not selected, default icon 
// expand more : ↓
*/
type IconText =  'expand_less'|'unfold_more'|'expand_more';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatButton,MatCheckbox,MatIcon],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  hideFullEvents = signal<boolean>(false);
  //time ascending is the default sort by from the backend, so the first click has to change the direction
  ascendingTime = false; 
  timeIcon:IconText = 'expand_more';
  ascendingDistance = true;
  distanceIcon :IconText = 'unfold_more';
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
