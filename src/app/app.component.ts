import { Component, inject,OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { MapComponent } from './map/map.component';
import { UserService } from './services/user.service';
import { EventSidebarComponent } from "./event-sidebar/event-sidebar.component";
import { EventsService } from './services/events.service';
import { EventFormComponent } from './modals/event-form/event-form.component';
import { EventDetailsComponent } from './modals/event-details/event-details.component';
import { FilterComponent } from './filter/filter.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    MapComponent,
    EventSidebarComponent,
    EventFormComponent,
    EventDetailsComponent,
    FilterComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'getout_ng';
  userService = inject(UserService);
  eventService=inject(EventsService);
  selectedEvent = this.eventService.selectedEvent;
  isFormOpen = this.eventService.isEventFormOpen;
  showMap=false;
  showSideBar=true;
  constructor( @Inject(PLATFORM_ID) private _platformId: Object) {}
  ngOnInit(): void {  
    this.userService.checkUser();
    if (this._platformId === 'browser') {
    this.showMap=true;
    }
  }
  toggleSideBar():void{
    this.showSideBar = !this.showSideBar;
    console.log(this.showSideBar);
  }
}
