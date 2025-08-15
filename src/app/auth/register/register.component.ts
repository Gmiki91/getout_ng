import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { slideDown } from '../../utils/animation.utils';
import { StateService } from '../../services/state.service';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-register',
    imports: [
        MatCardModule,
        MatFormFieldModule,
        FormsModule,
        MatInputModule,
        MatButtonModule,
    ],
    templateUrl: './register.component.html',
    styleUrl: '../auth.component.scss',
    animations: [slideDown]
})
export class RegisterComponent {
  stateService = inject(StateService);
  authService = inject(AuthService);
  snackBar= inject(MatSnackBar);
  passwordMismatch = false;
  password = '';
  password2 = '';

  onSubmit(form: NgForm) {
    if (form.invalid) {
      console.error('Form is invalid');
      return;
    }
    
    const { username, email, password, password2, elo } = form.value;

    if (password !== password2) {
      console.error('Passwords do not match');
      return;
    }
    const eloValue = elo || 0;
    this.authService.register(username, email, password, eloValue).subscribe({
      next: (response) => {
        console.log('Registration successful', response);
        this.snackBar.open('Registration successful! Please check your email to confirm your account.');
        this.stateService.closeRegister();
      },
      error: (error) => {
        console.error('Registration failed', error);
        this.snackBar.open(`Registration failed: ${error.error.message}`,undefined,{duration:3000,verticalPosition:'top'});
      },
    });
  }
}
