import { Component, computed, inject, input } from '@angular/core';
import { UserService } from '../services/user.service';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { EventsService } from '../services/events.service';
import { MatTooltip } from '@angular/material/tooltip';
import { take } from 'rxjs';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { TimeTextPipe } from '../pipes/time-text.pipe';
import { StateService } from '../services/state.service';
import { MyNotification } from '../models/my-notification.model';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-header',
  imports: [
    MatIcon,
    MatButtonModule,
    MatTooltip,
    MatMenuModule,
    MatBadgeModule,
    MatProgressSpinnerModule,
    TimeTextPipe
  ],
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  loading = input<boolean>();
  userService = inject(UserService);
  eventService = inject(EventsService);
  stateService = inject(StateService);
  user = this.userService.user;
  unseenNotifications = computed(() =>this.user().notifications.filter((notification:MyNotification) => !notification.read).length);
  isSpinning = false;

  onToggleSideBar(): void {
    this.stateService.toggleSideBar();
  }
  onToggleFilter(): void {
    this.stateService.toggleFilter();
  }
  onToggleEventForm(): void {
    this.eventService.toggleEventForm();
  }
  onToggleRegister():void{
    this.stateService.toggleRegister()
  }
  onToggleLogin():void{
    this.stateService.toggleLogin()
  }
  onToggleEventDetails(eventId: string): void {
    if(eventId!='0'){ // for event deletion notification, eventId is set for 0
      this.eventService.selectEventById(eventId);
    }
  }
  onRefresh(): void {
    this.eventService.getEvents().pipe(take(1)).subscribe(()=>{
      this.isSpinning = true;
      setTimeout(() => {
        this.isSpinning = false;
      }, 250);
    });
  }
  menuClosed(): void {
    if (this.user().notifications.length > 0 && this.unseenNotifications()>0) {
      this.userService.readNotifications();
    }
  }
}
