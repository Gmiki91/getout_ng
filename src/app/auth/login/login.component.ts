import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { StateService } from '../../services/state.service';
import { slideDown } from '../../utils/utils';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatCardModule,MatFormFieldModule,FormsModule,MatInputModule,MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: '../auth.component.scss',
  animations:[slideDown]
})
export class LoginComponent {
  stateService = inject(StateService);
  authService = inject(AuthService);
  onSubmit(form:NgForm){
    if (form.valid) {
      const { email, password } = form.value;
      this.authService.login(email, password).subscribe({
        next: (response) => {
          console.log('Login successful', response);
          this.closeDialog();
        },
        error: (error) => {
          console.error('Login failed', error);
        }
      });
    } else {
      console.error('Form is invalid');
    }
  }
   
  closeDialog(): void {
    this.stateService.toggleLogin();
  }

}