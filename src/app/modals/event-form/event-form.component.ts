import {
  Component,
  DestroyRef,
  inject,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatButton,MatIconButton } from '@angular/material/button';
import { EventsService } from '../../services/events.service';
import { MapService } from '../../services/map.service';
import { MatCardModule } from '@angular/material/card';
import { slideDown } from '../../utils/utils';
import { MatIcon } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { Recurrence } from '../../models/event.model';
import { LocationInfoComponent } from "../location-info/location-info.component";
import { LocationFieldComponent } from "../form-fields/location-field.component";
import { TimeFieldComponent } from '../form-fields/time-field/time-field.component';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [
    FormsModule,
    MatFormField,
    MatInputModule,
    MatButton,
    MatIconButton,
    MatLabel,
    MatError,
    MatCardModule,
    MatIcon,
    MatRadioModule,
    MatCheckboxModule,
    LocationInfoComponent,
    LocationFieldComponent,
    TimeFieldComponent
],
  templateUrl: './event-form.component.html',
  styleUrl: '../event-form.component.scss',
  animations: [slideDown],
})
export class EventFormComponent{
  @ViewChild(TimeFieldComponent)
  timeField! :TimeFieldComponent;
  locationSelectMode = false;
  showOSMInfo = false;
  minPeople = 2;
  repeats =false
  destroyRef = inject(DestroyRef);
  eventsService: EventsService = inject(EventsService);
  mapService: MapService = inject(MapService);
  markerAddress = this.mapService.markerAddress; // stores address selected from the map
  markerPosition = this.mapService.markerPosition; // stores address selected from the map


  onClose() {
    this.locationSelectMode ? this.locationSelectMode=false : this.eventsService.toggleEventForm();
  }

  toggleOSMInfo(){
    this.showOSMInfo=!this.showOSMInfo;
  }

  toggleLocationSelect() {
    this.locationSelectMode = !this.locationSelectMode;
  }
  onSubmit(form: NgForm) {
    if (form.valid && this.markerAddress() && this.markerPosition()) {
      const { title,min, max, info, recurring } = form.form.value;
      const time = this.timeField.getStartTime();
      const endTime = this.timeField.isEndTime ? this.timeField.getEndTime() : undefined;
      const location = this.markerAddress();
      const latLng = this.markerPosition();
      this.mapService.removeTemporaryMarker();
      let finalRecurring = this.checkDuration(this.timeField.durationInDays, recurring);
      const sub = this.eventsService
        .addEvent({
          title: title,
          location: location,
          latLng: latLng,
          time: time,
          endTime: endTime || time,
          min: min,
          max: max,
          info: info,
          recurring: finalRecurring
        })
        .subscribe({
          next: (event) => {
            this.mapService.addMarker(event);
            this.onClose();
          },
          error: (error) => {
            console.error('Error adding event:', error);
          },
        });
        this.destroyRef.onDestroy(()=>sub.unsubscribe());
    } else if (!form.valid) {
      alert('Form is invalid');
    } else if (this.mapService.markerAddress() == '') {
      alert('Select an address from the map');
    }
  }


  private checkDuration(durationInDays: number, recurring: Recurrence): Recurrence {
    if (
      (durationInDays > 1 && recurring == 'daily') ||
      (durationInDays > 7 && recurring == 'weekly') ||
      (durationInDays > 28 && recurring == 'monthly') || !recurring
    ) {
      return 'never';
    }
    return recurring;
  }
}
