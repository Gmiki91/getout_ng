import { Component, inject, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { MapComponent } from './map/map.component';
import { UserService } from './services/user.service';
import { EventSidebarComponent } from './event-sidebar/event-sidebar.component';
import { EventsService } from './services/events.service';
import { EventFormComponent } from './modals/event-form/event-form.component';
import { EventDetailsComponent } from './modals/event-details/event-details.component';
import { FilterComponent } from './filter/filter.component';
import { dumbParent } from './utils/utils';
import { isPlatformBrowser } from '@angular/common';
import { EventModifyComponent } from './modals/event-modify/event-modify.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    MapComponent,
    EventSidebarComponent,
    EventFormComponent,
    EventDetailsComponent,
    EventModifyComponent,
    FilterComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [dumbParent],
})
export class AppComponent implements OnInit {
  title = 'getout_ng';
  userService = inject(UserService);
  eventService = inject(EventsService);
  isEventDetailsOpen = this.eventService.isEventDetailsOpen;
  isFormOpen = this.eventService.isEventFormOpen;
  isEventUpdating = this.eventService.isEventUpdating;
  areEventsLoaded = this.eventService.areEventsLoaded;
  showMap = false;
  showFilter = false;
  showSideBar = true;
  updateEvent = false;
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  async ngOnInit(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      await this.userService.initializeUser();
      this.showMap = true;
    }
  }
  toggleSideBar(): void {
    this.showSideBar = !this.showSideBar;
  }
  toggleFilter(): void {
    this.showFilter = !this.showFilter;
  }
}
