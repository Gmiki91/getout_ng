import { Component, inject, computed, output } from '@angular/core';
import { UserService } from '../services/user.service';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-header',
  imports:[MatIcon,MatButtonModule],
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  userService = inject(UserService);
  username = computed(()=>this.userService.user().name);
  toggleSideBar=output();

  onToggleSideBar():void{
    this.toggleSideBar.emit()
  }
}
