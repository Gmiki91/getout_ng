import { Component, inject, Inject, OnInit } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { MainComponent } from './main/main.component';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, MainComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'Sign sign';
  userService = inject(UserService);
  loading = true;

  async ngOnInit(): Promise<void> {
      if (!!localStorage.getItem('authToken')) {
        await this.userService.initializeUser();
      } else {
        await this.userService.initializeGuest();
      }
      this.loading = false;
  }
}
