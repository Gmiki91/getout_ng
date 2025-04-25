import { Component, inject, input} from '@angular/core';
import { MapComponent } from '../map/map.component';
import { EventSidebarComponent } from '../event-sidebar/event-sidebar.component';
import { EventFormComponent } from '../modals/event-form/event-form.component';
import { EventDetailsComponent } from '../modals/event-details/event-details.component';
import { FilterComponent } from '../filter/filter.component';
import { EventModifyComponent } from '../modals/event-modify/event-modify.component';
import { dumbParent } from '../utils/utils';
import { EventsService } from '../services/events.service';
import { StateService } from '../services/state.service';
import { LoginComponent } from '../auth/login/login.component';
import { RegisterComponent } from '../auth/register/register.component';
import { DialogComponent } from "../modals/dialog/dialog.component";
@Component({
  selector: 'app-main',
  standalone: true,
  imports: [MapComponent,
    EventSidebarComponent,
    EventFormComponent,
    EventDetailsComponent,
    EventModifyComponent,
    FilterComponent,
    LoginComponent,
    RegisterComponent, DialogComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  animations: [dumbParent]
})
export class MainComponent{
  showMap = input<boolean>(); 
  events = inject(EventsService);
  state = inject(StateService);
  loadingUser = true;
}
