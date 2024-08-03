import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  userService = inject(UserService);
  username = ''
  ngOnInit(): void {
      this.username = this.userService.getUsername();
  }
}
