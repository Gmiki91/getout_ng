import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { EventsService } from '../../services/events.service';
import { MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { slideDown } from '../../utils/utils';
import { LocationFieldComponent } from '../form-fields/location-field.component';
import { TimeFieldComponent } from '../form-fields/time-field/time-field.component';
import { UpdateEventData } from '../../models/event.model';
import { MapService } from '../../services/map.service';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StateService } from '../../services/state.service';
@Component({
  selector: 'app-event-modify',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatLabel,
    MatInputModule,
    MatButton,
    LocationFieldComponent,
    MatCheckbox,
    TimeFieldComponent,
    MatRadioModule,
  ],
  providers: [MatSnackBar],
  templateUrl: './event-modify.component.html',
  styleUrl: '../event-form.component.scss',
  animations: [slideDown],
})
export class EventModifyComponent implements OnInit {
  @ViewChild(TimeFieldComponent)
  timeField!: TimeFieldComponent;
  eventService = inject(EventsService);
  mapService: MapService = inject(MapService);
  stateService = inject(StateService);
  fb = inject(FormBuilder);
  locationSelectMode = false;
  durationInDays = 0;
  myEvent = this.eventService.selectedEvent();
  isRepeating = this.myEvent.recurring != 'never';
  form!: FormGroup;
  destroyRef = inject(DestroyRef);
  snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.form = this.fb.group({
      title: [this.myEvent.title, [Validators.required]],
      location: [this.myEvent.location, [Validators.required]],
      info: [this.myEvent.info],
      min: [this.myEvent.min, [Validators.required, Validators.min(2)]],
      max: [this.myEvent.max],
      recurring: [this.myEvent.recurring],
    });
  }

  updateDurationInDays(value: number) {
    this.durationInDays = value;
  }
  toggleLocationSelect(): void {
    this.locationSelectMode = !this.locationSelectMode;
  }
  onClose(): void {
    this.stateService.toggleUpdateEvent();
  }

  onUpdate(): void {
    if (this.form.valid) {
      const currentValues = this.form.value;
      const changedValues = this.getChangedValues(this.myEvent, currentValues);

      if (Object.keys(changedValues).length === 0) {
        console.log('No changes detected');
        return;
      }

      changedValues.id = this.myEvent.id;
      const sub = this.eventService.updateEvent(changedValues).subscribe(() => {
        this.onClose();
        this.snackBar.open('updated ' + this.myEvent.title, undefined, {
          duration: 3000,
        });
      });
      this.destroyRef.onDestroy(() => sub.unsubscribe());
    }
  }

  getChangedValues(initial: any, current: any): UpdateEventData {
    const changes: any = {};
    for (const key of Object.keys(current)) {
      if (current[key] !== initial[key]) {
        changes[key] = current[key];
      }
    }

    const location = this.mapService.markerAddress();
    const latLng = this.mapService.markerPosition();
    if (location !== this.myEvent.location && latLng != this.myEvent.latLng) {
      changes['location'] = location;
      changes['latLng'] = latLng;
    }

    const starts = this.timeField.getStartTime();
    if (starts !== this.myEvent.time) changes['time'] = starts;

    const ends = this.timeField.getEndTime();
    if (ends !== '' && ends !== this.myEvent.endTime) {
      changes['endTime'] = ends;
    }

    return changes;
  }
}
