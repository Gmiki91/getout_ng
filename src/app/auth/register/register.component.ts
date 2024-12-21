import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { slideDown } from '../../utils/utils';
import { StateService } from '../../services/state.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MatCardModule,MatFormFieldModule,FormsModule,MatInputModule,MatButtonModule],
  templateUrl: './register.component.html',
  styleUrl: '../auth.component.scss',
  animations:[slideDown]
})
export class RegisterComponent {
  stateService = inject(StateService);
  authService = inject(AuthService);
  passwordMismatch = false;
  password = '';
  password2 = '';

  onSubmit(form:NgForm){
    if (form.valid) {
      const { name,email, password, password2 } = form.value;
      if (password !== password2) return;
      
      this.authService.register(name,email, password).subscribe({
        next: (response) => {
          console.log('Registration successful', response);
          this.closeDialog();
        },
        error: (error) => {
          console.error('Registration failed', error);
        }
      });
    } else {
      console.error('Form is invalid');
    }
  }
  closeDialog(): void {
    this.stateService.toggleRegister();
  }
}
