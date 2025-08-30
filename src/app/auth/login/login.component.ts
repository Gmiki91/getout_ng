import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { StateService } from '../../services/state.service';
import { slideDown } from '../../utils/animation.utils';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpStatusCode } from '@angular/common/http';

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
  snackBar = inject(MatSnackBar);
  showConfirmBtn=false;
  forgotPassword=false;
  tempEmail = ''

  onSubmit(form:NgForm){
    if (form.valid) {
      if(!this.forgotPassword){
        this.login(form.value.email, form.value.password);
      }else{
        this.requestPasswordReset(form.value.email);
      }
    } else {
      console.error('Form is invalid');
    }
  }

  login(email:string, password:string){
    this.authService.login(email, password).subscribe({
      next: (response) => {
        console.log('Login successful', response);
        this.stateService.closeLogin();
      },
      error: (error) => {
        console.error('Login failed', error);
        if(error.status===HttpStatusCode.Forbidden){
          this.showConfirmBtn=true;
          this.tempEmail=email;
        }
        this.snackBar.open(`Login failed: ${error.error.message}`,undefined,{duration:3000,verticalPosition:'top'});
      }
    });
  }

  requestPasswordReset(email:string){
    this.authService.requestPasswordReset(email);
    this.forgotPassword=false;
  }

  onForgotPassword(){
    this.forgotPassword = true;
  }

  onResendConfirmation(){
    this.authService.resendEmailConfirmation(this.tempEmail);
  }

}
