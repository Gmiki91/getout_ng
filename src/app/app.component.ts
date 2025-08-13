import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { RouterOutlet } from '@angular/router';
@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
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
