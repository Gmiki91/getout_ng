import { DOCUMENT } from '@angular/common';
import { Component, computed, DestroyRef, inject, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { EventsService } from '../services/events.service';
import { MatTooltip } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { TimeTextPipe } from '../pipes/time-text.pipe';
import { StateService } from '../services/state.service';
import { MyNotification } from '../models/my-notification.model';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';
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
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  destroyRef = inject(DestroyRef);
  userService = inject(UserService);
  eventService = inject(EventsService);
  stateService = inject(StateService);
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  document = inject(DOCUMENT);
  user = this.userService.user;
  loading = this.authService.loading;
  unseenNotifications = computed(() =>this.user().notifications.filter((notification:MyNotification) => !notification.read).length);
  isSpinning = false;
  isAuthenticated = false;
  userNameTooltip = computed(() => {
    const user = this.user();
    return 'email' in user ? user.name :  'a  '+ user.name;
  });

  ngOnInit(): void {
    const sub = this.authService.isAuthenticated$.subscribe((isAuthenticated) => {
      this.isAuthenticated = isAuthenticated;
    });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  // onToggleSideBar(): void {
  //   this.stateService.toggleSideBar();
  // }
  // onToggleFilter(): void {
  //   this.stateService.toggleFilter();
  // }
  onToggleEventForm(): void {
    this.stateService.toggleEventForm();
  }
  onToggleRegister():void{
    this.stateService.toggleRegister()
  }
  onToggleLogin():void{
    this.stateService.toggleLogin()
  }
  onToggleEventDetails(eventId: string): void {
    if(eventId!=null){ // for event deletion notification, eventId is set for null
      this.eventService.selectEventById(eventId);
    }
  }
  onLogOut():void{
    this.authService.logout();
    this.stateService.closeUserSettings()
  }
  menuClosed(): void {
    if (this.user().notifications.length > 0 && this.unseenNotifications()>0) {
      this.userService.readNotifications();
    }
  }
}
