import { Component, DestroyRef, inject, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { AvatarListComponent } from '../avatar-list/avatar-list.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-user-settings',
    imports: [
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    AvatarListComponent
],
    templateUrl: './user-settings.component.html',
    styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent {
  userService = inject(UserService);
  authService = inject(AuthService);
  destroyRef = inject(DestroyRef);
  snackBar = inject(MatSnackBar);
  password = '';
  confirmPassword = '';
  elo = this.userService.user().elo

  //Temporary avatar index and URL to display in the UI without backend call
  temporaryAvatarIndex = signal<number>(0);
  temporaryAvatar = signal<string>(this.userService.user().avatarUrl);

  changeElo() {
    this.userService.changeElo(this.elo);
  }

  changeAvatar(index: number) {
    this.temporaryAvatarIndex.set(index);
    this.temporaryAvatar.set(
      this.userService.user().avatarUrl.replace(/\/\d+\.png$/, `/${index}.png`)
    );
  }
  confirmAvatarChange() {
    this.userService.changeAvatar(this.temporaryAvatarIndex());
  }

  canSubmitPassword() {
    return this.password.length >= 4 && this.password === this.confirmPassword;
  }

  changePassword() {
    if (!this.canSubmitPassword()) return;
    const subscription = this.authService
      .changePassword(this.password)
      .subscribe({
        next: () => {
          this.snackBar.open('Password changed successfully');
          this.password = '';
          this.confirmPassword = '';
        },
        error: (error) => {
          this.snackBar.open(`Error: ${error}`,undefined,{duration:3000,verticalPosition:'top'});
        },
      });
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
