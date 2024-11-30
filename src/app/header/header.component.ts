import { Component, computed, inject, output } from '@angular/core';
import { UserService } from '../services/user.service';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { EventsService } from '../services/events.service';
import { MatTooltip } from '@angular/material/tooltip';
import { take } from 'rxjs';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { TimeTextPipe } from '../pipes/time-text.pipe';

@Component({
  selector: 'app-header',
  imports: [
    MatIcon,
    MatButtonModule,
    MatTooltip,
    MatMenuModule,
    MatBadgeModule,
    TimeTextPipe,
  ],
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  userService = inject(UserService);
  eventService = inject(EventsService);
  user = this.userService.user;
  unseenNotifications = computed(() =>this.user().notifications.filter(notification => !notification.read).length);
  toggleSideBar = output();
  toggleFilter = output();

  onToggleSideBar(): void {
    this.toggleSideBar.emit();
  }
  onToggleFilter(): void {
    this.toggleFilter.emit();
  }
  onToggleEventForm(): void {
    this.eventService.toggleEventForm();
  }
  onToggleEventDetails(eventId: string): void {
    this.eventService.selectEventById(eventId);
  }
  onRefresh(): void {
    this.eventService.getEvents().pipe(take(1)).subscribe();
  }
  menuOpened(): void {
    if (this.user().notifications.length > 0) {
      this.userService.readNotifications();
    }
  }
}
