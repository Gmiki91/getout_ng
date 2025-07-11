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
    imports: [MatCardModule, MatFormFieldModule, FormsModule, MatInputModule, MatButtonModule],
    templateUrl: './login.component.html',
    styleUrl: '../auth.component.scss',
    animations: [slideDown]
})
export class LoginComponent {
  stateService = inject(StateService);
  authService = inject(AuthService);
  onSubmit(form:NgForm){
    if (form.valid) {
      const { name, password } = form.value;
      this.authService.login(name, password).subscribe({
        next: (response) => {
          console.log('Login successful', response);
          this.stateService.closeLogin();
        },
        error: (error) => {
          console.error('Login failed', error);
          alert('Username or password is incorrect');
        }
      });
    } else {
      console.error('Form is invalid');
    }
  }

}
