import { Component, computed, inject } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  userService = inject(UserService);
  username = computed(()=>this.userService.user().name);
}
