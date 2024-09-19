import {
  AfterViewInit,
  Component,
  output,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { EventsService } from '../../services/events.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MapService } from '../../services/map.service';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.scss',
})
export class EventFormComponent implements AfterViewInit, OnDestroy {
  @ViewChild('locationField')
  locationField!: ElementRef;
  closing = output<boolean>();
  minPeople = 2;
  autocomplete: google.maps.places.Autocomplete | undefined;
  address = this.mapService.address;
  unsubscribe$ = new Subject<void>();

  constructor(
    private eventsService: EventsService,
    private mapService: MapService
  ) {}

  ngAfterViewInit(): void {
    this.initAutocomplete();
    this.subscribeToBoundsChange();
  }

  onClose() {
    this.closing.emit(true);
  }
  onSubmit(form: NgForm) {
    if (form.valid) {
      const { title, location, date, hour, minute, min, max } = form.form.value;
      const time = new Date(date);
      time.setHours(hour);
      time.setMinutes(minute);
      const dateTime = time.toISOString();
      this.eventsService
        .addEvent({
          title: title,
          location: location,
          time: dateTime,
          min: min,
          max: max,
        })
        .subscribe({
          next: () => {
            this.onClose();
          },
          error: (error) => {
            console.error('Error adding event:', error);
          },
        });
    }
  }
  
  private initAutocomplete():void{
    this.autocomplete = new google.maps.places.Autocomplete(
      this.locationField.nativeElement
    );
    this.autocomplete.addListener('place_changed', () => {
      const address = this.locationField.nativeElement.value;
      this.mapService.setAddress(address);
      this.mapService.convertAddressToLatLng(address);
    });
  }

  private subscribeToBoundsChange() {
    this.mapService.bounds$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((bounds) => {
        this.autocomplete?.setBounds(bounds);
      });
  }
  
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
