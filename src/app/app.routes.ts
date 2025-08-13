import { Routes } from '@angular/router';
import { ConfirmEmailComponent } from './auth/confirm-email/confirm-email.component';
import { MainComponent } from './main/main.component';

export const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'confirm-email', component: ConfirmEmailComponent },
  { path: '**', redirectTo: '' }
];