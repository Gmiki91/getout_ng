import { Component, inject,OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EventListComponent } from './event-list/event-list.component';
import { HeaderComponent } from './header/header.component';
import { MapComponent } from './map/map.component';
import { UserService } from './services/user.service';
import { FilterBarComponent } from "./filter-bar/filter-bar.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    EventListComponent,
    EventListComponent,
    HeaderComponent,
    MapComponent,
    FilterBarComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'getout_ng';
  userService = inject(UserService);

  ngOnInit() {
    this.userService.checkUser();
  }
}
