import { Component, inject, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { MainComponent } from './main/main.component';
import { isPlatformBrowser } from '@angular/common';
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
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  async ngOnInit(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      if (!!localStorage.getItem('authToken')) {
        await this.userService.initializeUser();
      } else {
        await this.userService.initializeGuest();
      }
      this.loading = false;
    }
  }
}
