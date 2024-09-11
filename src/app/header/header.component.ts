import { Component, computed, inject, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { EventsService } from '../services/events.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit  {
  userService = inject(UserService);
  eventService = inject(EventsService);
  username = computed(()=>this.userService.user().name);

  ngOnInit(): void {
    this.eventService.getEvents();
  }
}
