import { Component, inject,OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { MapComponent } from './map/map.component';
import { UserService } from './services/user.service';
import { EventSidebarComponent } from "./event-sidebar/event-sidebar.component";
import { EventsService } from './services/events.service';
import { EventFormComponent } from './modals/event-form/event-form.component';
import { EventDetailsComponent } from './modals/event-details/event-details.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    MapComponent,
    EventSidebarComponent,
    EventFormComponent,
    EventDetailsComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'getout_ng';
  userService = inject(UserService);
  eventService=inject(EventsService)
  selectedEvent = this.eventService.selectedEvent;
  isFormOpen = this.eventService.isEventFormOpen;

  ngOnInit() {
    this.userService.checkUser();
  }
}
