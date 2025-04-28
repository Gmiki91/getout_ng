import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-user-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent {
  userService = inject(UserService);
  authService = inject(AuthService);

  password = '';
  confirmPassword = '';

  changeAvatar() {
    this.userService.changeAvatar(1);
  }

  canSubmitPassword() {
    return this.password.length >= 6 && this.password === this.confirmPassword;
  }

  changePassword() {
    // if (!this.canSubmitPassword()) return;
    // this.authService.changePassword(this.password).subscribe({
    //   next: () => {
    //     alert('Password changed successfully');
    //     this.password = '';
    //     this.confirmPassword = '';
    //   },
    //   error: (error) => {
    //     console.error('Error changing password:', error);
    //   }
    // });
  }
}