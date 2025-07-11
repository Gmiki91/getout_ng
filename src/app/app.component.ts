import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { MainComponent } from './main/main.component';
import { AuthService } from './services/auth.service';

@Component({
    selector: 'app-root',
    imports: [HeaderComponent, MainComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'Sign sign';
  authService = inject(AuthService);

   ngOnInit():void {
    this.authService.initialize();
  }
}
