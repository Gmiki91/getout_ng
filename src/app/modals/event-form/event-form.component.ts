import {
  AfterViewInit,
  Component,
  ViewChild,
  ElementRef,
  OnDestroy,
  inject,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButton } from '@angular/material/button';
import { Subject, takeUntil } from 'rxjs';
import { provideNativeDateAdapter } from '@angular/material/core';
import { DecimalPipe } from '@angular/common';
import {CdkDrag} from '@angular/cdk/drag-drop'
import { LatLng } from '../../models/event.model';
import { EventsService } from '../../services/events.service';
import { MapService } from '../../services/map.service';
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
    DecimalPipe,
    CdkDrag
  ],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.scss',
})
export class EventFormComponent implements AfterViewInit, OnDestroy {
  @ViewChild('locationInput')
  location!: ElementRef;
  minPeople = 2;
  locationResult?: string; //checks if the address input gives geocoded result
  positionResult?: LatLng; //checks if the address input gives geocoded result
  minDate = new Date(); // min date is today
  unsubscribe$ = new Subject<void>();
  private eventsService: EventsService = inject(EventsService);
  private mapService: MapService = inject(MapService);
  markerAddress = this.mapService.markerAddress; // stores address selected from the map
  markerPosition = this.mapService.markerPosition; // stores address selected from the map

  ngAfterViewInit(): void {
    const autocomplete = new google.maps.places.Autocomplete(
      this.location.nativeElement
    );
    const center = this.eventsService.currentPosition();
    autocomplete.setBounds({
      north: center.lat + 0.5,
      south: center.lat - 0.5,
      east: center.lng + 0.5,
      west: center.lng + 0.5,
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onBlur() {
    const input = this.location.nativeElement.value;
    if (input.trim() != '') {
      this.mapService.convertAddressToLatLng(input).then(
        (result) => {
          this.mapService.flyTo(result.position);
          this.locationResult = result.address;
          this.positionResult = result.position;
        },
        () => {
          alert('Location not recognized, try selecting it from the map.');
        }
      );
    }
  }
  onClose() {
    this.eventsService.toggleEventForm();
  }

  onSubmit(form: NgForm) {
    if (form.valid && (this.markerAddress() && this.markerPosition()) || (this.locationResult && this.positionResult)) {
      const { title, date, hour, minute, min, max, info } = form.form.value;
      const time = new Date(date);
      time.setHours(hour);
      time.setMinutes(minute);
      const dateTime = time.toISOString();
      this.eventsService
        .addEvent({
          title: title,
          location: this.locationResult || this.markerAddress(), //either we got the correct address from the autofill or from map click
          latLng: this.positionResult || this.markerPosition(),
          time: dateTime,
          min: min,
          max: max | min, //max can not be lower than min. If it is 0, min will be set
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
