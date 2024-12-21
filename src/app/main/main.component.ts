import { Component,OnInit,inject, Inject, PLATFORM_ID  } from '@angular/core';
import { MapComponent } from '../map/map.component';
import { EventSidebarComponent } from '../event-sidebar/event-sidebar.component';
import { EventFormComponent } from '../modals/event-form/event-form.component';
import { EventDetailsComponent } from '../modals/event-details/event-details.component';
import { FilterComponent } from '../filter/filter.component';
import { EventModifyComponent } from '../modals/event-modify/event-modify.component';
import { isPlatformBrowser } from '@angular/common';
import { dumbParent } from '../utils/utils';
import { UserService } from '../services/user.service';
import { EventsService } from '../services/events.service';
import { StateService } from '../services/state.service';
import { LoginComponent } from '../auth/login/login.component';
import { RegisterComponent } from '../auth/register/register.component';
@Component({
  selector: 'app-main',
  standalone: true,
  imports: [ MapComponent,
      EventSidebarComponent,
      EventFormComponent,
      EventDetailsComponent,
      EventModifyComponent,
      FilterComponent,
      LoginComponent,
      RegisterComponent
    ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  animations: [dumbParent]
})
export class MainComponent implements OnInit {
  updateEvent = false;
  userService = inject(UserService);
  eventService = inject(EventsService);
  stateService = inject(StateService);
  isEventDetailsOpen = this.eventService.isEventDetailsOpen;
  isFormOpen = this.eventService.isEventFormOpen;
  isEventUpdating = this.eventService.isEventUpdating;
  areEventsLoaded = this.eventService.areEventsLoaded;
  showSideBar = this.stateService.showSideBar;
  showFilter = this.stateService.showFilter;
  showLogin = this.stateService.showLogin;
  showRegister = this.stateService.showRegister;
  showMap = false;
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  async ngOnInit(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      await this.userService.initializeUser();
      this.showMap = true;
    }
  }
}