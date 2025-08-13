import { Component, OnInit,inject } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-confirm-email',
  imports: [],
  templateUrl: './confirm-email.component.html',
  styleUrl: './confirm-email.component.scss'
})
export class ConfirmEmailComponent implements OnInit {
  authService = inject(AuthService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  message = 'Invalid or expired token.';
   countdown = 5;
   isTokenValid = false;
ngOnInit() {
  const token = this.route.snapshot.queryParamMap.get('token');
  if (token) {
    this.authService.confirmEmail(token).subscribe({
      next: () => {
        this.message = "Email confirmed!";
        this.startCountdown();},
      error: () => this.message = "Invalid or expired token!",

    });
  }
}
  startCountdown() {
    this.isTokenValid = true;
    const interval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(interval);
        this.isTokenValid = false;
        this.router.navigate(['/']);
      }
    }, 1000);
  }
}
