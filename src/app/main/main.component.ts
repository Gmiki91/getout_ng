import { Component, effect, inject } from '@angular/core';
import { MapComponent } from '../map/map.component';
import { EventSidebarComponent } from '../event-sidebar/event-sidebar.component';
import { EventFormComponent } from '../modals/event-form/event-form.component';
import { EventDetailsComponent } from '../modals/event-details/event-details.component';
import { EventModifyComponent } from '../modals/event-modify/event-modify.component';
import { dumbParent } from '../utils/animation.utils';
import { StateService } from '../services/state.service';
import { LoginComponent } from '../auth/login/login.component';
import { RegisterComponent } from '../auth/register/register.component';
import { DialogComponent } from '../modals/dialog/dialog.component';
import { UserSettingsComponent } from '../user/user-settings/user-settings.component';
import { HeaderComponent } from '../header/header.component';
import { FloatingActionBtnComponent } from '../floating-action-btn/floating-action-btn.component';
import { ThemeService } from '../services/theme.service';
@Component({
  selector: 'app-main',
  imports: [
    MapComponent,
    HeaderComponent,
    EventSidebarComponent,
    EventFormComponent,
    EventDetailsComponent,
    EventModifyComponent,
    LoginComponent,
    RegisterComponent,
    DialogComponent,
    UserSettingsComponent,
    FloatingActionBtnComponent,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  animations: [dumbParent],
})
export class MainComponent {
  state = inject(StateService);
  theme = inject(ThemeService);
  showMap = true;
  constructor() {
    effect(() => {
      const theme = this.theme.currentTheme();
      this.rebuildMap();
    });
  }

  rebuildMap() {
    this.showMap = false;
    setTimeout(() => {
      this.showMap = true;
    });
  }
}
