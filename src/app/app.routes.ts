import { Routes } from '@angular/router';
import { ConfirmEmailComponent } from './auth/confirm-email/confirm-email.component';
import { MainComponent } from './main/main.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';

export const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'confirm-email', component: ConfirmEmailComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: '**', redirectTo: '' }
];