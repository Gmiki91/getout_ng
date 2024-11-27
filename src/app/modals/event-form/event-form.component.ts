import {
  Component,
  ViewChild,
  ElementRef,
  OnDestroy,
  inject,
  OnInit,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButton,MatIconButton } from '@angular/material/button';
import { Subject, takeUntil } from 'rxjs';
import { provideNativeDateAdapter } from '@angular/material/core';
import { EventsService } from '../../services/events.service';
import { MapService } from '../../services/map.service';
import { TIMES } from '../../time';
import { MatCardModule } from '@angular/material/card';
import { slideDown } from '../../utils/utils';
import { MatIcon } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { Recurrence } from '../../models/event.model';

@Component({
  selector: 'app-event-form',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    FormsModule,
    MatFormField,
    MatInputModule,
    MatButton,
    MatIconButton,
    MatLabel,
    MatError,
    MatDatepickerModule,
    MatSelectModule,
    MatCardModule,
    MatIcon,
    MatRadioModule,
  ],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.scss',
  animations: [slideDown],
})
export class EventFormComponent implements OnInit, OnDestroy {
  @ViewChild('locationInput')
  location!: ElementRef;
  locationSelectMode = false;
  minPeople = 2;
  times = TIMES;
  endTimes: string[] = [];
  selectedTime = '';
  selectedEndTime = '';
  isEndTime = false;
  minDate = new Date(); // min date is today
  startDate = new Date();
  endingDate = new Date();
  durationInDays = 0;
  unsubscribe$ = new Subject<void>();
  private eventsService: EventsService = inject(EventsService);
  private mapService: MapService = inject(MapService);
  markerAddress = this.mapService.markerAddress; // stores address selected from the map
  markerPosition = this.mapService.markerPosition; // stores address selected from the map

  //Set up the default selected time ~ 30 minutes ahead of now
  ngOnInit(): void {
    const hour = new Date().getHours();
    if (hour === 23) {
      this.minDate.setDate(new Date().getDate() + 1); //tomorrow
      this.selectedTime = TIMES[0];
      this.selectedEndTime = TIMES[1];
    } else {
      this.selectedTime = hour === 0 ? TIMES[1] : TIMES[hour * 2 + 1];
      this.selectedEndTime = hour === 0 ? TIMES[2] : TIMES[hour * 2 + 2];
    }
    this.checkEndTimeHours();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onClose() {
    this.eventsService.toggleEventForm();
  }

  toogleEndTime() {
    this.isEndTime = !this.isEndTime;
  }

  checkEndTimeHours() {
    if (this.endingDate?.toDateString() === this.startDate?.toDateString()) {
      this.endTimes = this.times.filter((time) => time > this.selectedTime);
      this.selectedEndTime = this.endTimes[0] || '00:00';
    } else {
      this.endTimes = [...this.times];
    }
    this.updateDuration();
  }

  updateDuration() {
    // endingDate is set to startDate, but if we change startDate, it is possible the endDate is earlier
    // (onSubmit gets the endDate from the form, so its fine)
    // if thats the case, endDate was not initilaized, so duration is still less than 1 day
    if (this.startDate.getTime() >= this.endingDate.getTime()) {
      this.durationInDays = 0;
    } else {
      const start = new Date(
        this.initTime(this.startDate, this.selectedTime)
      ).getTime();
      const end = new Date(
        this.initTime(this.endingDate, this.selectedEndTime)
      ).getTime();
      const diffInMs = end - start;
      this.durationInDays = diffInMs / 1000 / 60 / 60 / 24;
    }
  }

  toggleLocationSelect() {
    this.locationSelectMode = !this.locationSelectMode;
  }
  onSubmit(form: NgForm) {
    if (form.valid && this.markerAddress() && this.markerPosition()) {
      const { title, date, endDate, min, max, info, recurring } =
        form.form.value;
      const time = this.initTime(date, this.selectedTime);
      const endTime = endDate
        ? this.initTime(endDate, this.selectedEndTime)
        : undefined;
      const location = this.markerAddress();
      const latLng = this.markerPosition();
      this.mapService.removeTemporaryMarker();
      let finalRecurring = this.checkDuration(this.durationInDays, recurring);
      this.eventsService
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
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (event) => {
            this.mapService.addMarker(event);
            this.onClose();
          },
          error: (error) => {
            console.error('Error adding event:', error);
          },
        });
    } else if (!form.valid) {
      alert('Form is invalid');
    } else if (this.mapService.markerAddress() == '') {
      alert('Select an address from the map');
    }
  }
  private initTime(date: Date, time: string) {
    const result = new Date(date);
    const hour = +time.substring(0, 2);
    const minute = +time.substring(3);
    result.setHours(hour);
    result.setMinutes(minute);
    result.setSeconds(0);
    return result.toISOString();
  }

  private checkDuration(durationInDays: number, recurring: Recurrence): Recurrence {
    if (
      (durationInDays > 1 && recurring == 'daily') ||
      (durationInDays > 7 && recurring == 'weekly') ||
      (durationInDays > 28 && recurring == 'monthly')
    ) {
      return 'never';
    }
    return recurring;
  }
}
