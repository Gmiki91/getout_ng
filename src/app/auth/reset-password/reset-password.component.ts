import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService } from '../../services/auth.service';
import { MatInputModule } from '@angular/material/input';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-reset-password',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatButton,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: '../auth.component.scss',
})
export class ResetPasswordComponent {
  route = inject(ActivatedRoute);
  router = inject(Router);
  authService = inject(AuthService);
  password = '';
  password2 = '';
  message = '';
  countdown = 5;
  isTokenValid = false;

  onSubmit() {
    if (this.password !== this.password2) {
      this.message = 'Passwords do not match!';
      return;
    }
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.authService.resetPassword(token, this.password).subscribe({
        next: () => {
          this.message = 'Password changed!';
          this.startCountdown();
        },
        error: () => (this.message = 'Invalid or expired token!'),
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
