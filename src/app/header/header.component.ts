import { Component, inject, computed, output } from '@angular/core';
import { UserService } from '../services/user.service';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { EventsService } from '../services/events.service';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-header',
  imports:[MatIcon,MatButtonModule,MatTooltip],
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  userService = inject(UserService);
  eventService = inject(EventsService);
  username = computed(()=>this.userService.user().name);
  toggleSideBar=output();
  toggleFilter=output();

  onToggleSideBar():void{
    this.toggleSideBar.emit()
  }
  onToggleFilter():void{
    this.toggleFilter.emit();
  }
  onToggleEventForm(): void {
    this.eventService.toggleEventForm()
  }
}
