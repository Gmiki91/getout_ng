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
import {MatSelectModule} from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButton } from '@angular/material/button';
import { Subject, takeUntil } from 'rxjs';
import { provideNativeDateAdapter } from '@angular/material/core';
import { DecimalPipe } from '@angular/common';
import {CdkDrag} from '@angular/cdk/drag-drop'
import { EventsService } from '../../services/events.service';
import { MapService } from '../../services/map.service';
import {TIMES} from '../../time'
@Component({
  selector: 'app-event-form',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    FormsModule,
    MatFormField,
    MatInputModule,
    MatButton,
    MatLabel,
    MatError,
    MatDatepickerModule,
    MatSelectModule,
    DecimalPipe,
    CdkDrag
  ],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.scss',
})
export class EventFormComponent implements OnInit, OnDestroy {
  @ViewChild('locationInput')
  location!: ElementRef;
  times = TIMES;
  selectedTime='';
  minPeople = 2;
  minDate = new Date(); // min date is today
  unsubscribe$ = new Subject<void>();
  private eventsService: EventsService = inject(EventsService);
  private mapService: MapService = inject(MapService);
  markerAddress = this.mapService.markerAddress; // stores address selected from the map
  markerPosition = this.mapService.markerPosition; // stores address selected from the map

  //Set up the default selected time ~ 30 minutes ahead of now
  ngOnInit():void{
    const hour = new Date().getHours();
    if(hour === 23){
      this.minDate.setDate(new Date().getDate()+1) //tomorrow
      this.selectedTime = TIMES[0];
    }else{
      this.selectedTime = hour ===0 ? TIMES[1] : TIMES[hour*2+1];
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onClose() {
    this.eventsService.toggleEventForm();
  }

  onSubmit(form: NgForm) {
    if (form.valid && (this.markerAddress() && this.markerPosition())) {
      const { title, date, min, max, info } = form.form.value;
      const time = new Date(date);
      const hour = +this.selectedTime.substring(0,2);
      const minute = +this.selectedTime.substring(3);
      time.setHours(hour);
      time.setMinutes(minute)
      time.setSeconds(0);
      const dateTime = time.toISOString();
      this.eventsService
        .addEvent({
          title: title,
          location:  this.markerAddress(), //correct address from map click
          latLng:  this.markerPosition(),
          time: dateTime,
          min: min,
          max: max || min, //max can not be lower than min. If it is 0, min will be set
          info: info,
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
    }
  }
}
