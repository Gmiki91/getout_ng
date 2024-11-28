import { Component, inject, output } from '@angular/core';
import { UserService } from '../services/user.service';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { EventsService } from '../services/events.service';
import { MatTooltip } from '@angular/material/tooltip';
import { take } from 'rxjs';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-header',
  imports:[MatIcon,MatButtonModule,MatTooltip,MatMenuModule],
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  userService = inject(UserService);
  eventService = inject(EventsService);
  user = this.userService.user;
  toggleSideBar=output();
  toggleFilter=output();

  onToggleSideBar():void{
    this.toggleSideBar.emit()
  }
  onToggleFilter():void{
    this.toggleFilter.emit();
  }
  onToggleEventForm(): void {
    this.eventService.toggleEventForm();
  }
  onRefresh():void{
    this.eventService.getEvents().pipe(take(1)).subscribe();
  }
}
