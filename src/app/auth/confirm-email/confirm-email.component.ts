import { Component, OnInit,inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  message = '';
ngOnInit() {
  const token = this.route.snapshot.queryParamMap.get('token');
  if (token) {
    this.authService.confirmEmail(token).subscribe({
      next: () => this.message = "Email confirmed!",
      error: () => this.message = "Invalid or expired token."
    });
  }
}
}
