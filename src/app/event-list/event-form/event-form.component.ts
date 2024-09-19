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
import { debounceTime, distinctUntilChanged, fromEvent, Subject, takeUntil } from 'rxjs';
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
  autocompleteService: google.maps.places.AutocompleteService;
  autocomplete?: google.maps.places.Autocomplete;
  address = this.mapService.address;
  exactMatch?:string;
  closestMatch?:string;
  bounds?:google.maps.LatLngBoundsLiteral;
  unsubscribe$ = new Subject<void>();

  constructor(
    private eventsService: EventsService,
    private mapService: MapService
  ) {
    this.autocompleteService = new google.maps.places.AutocompleteService();
  }

  ngAfterViewInit(): void {
    this.initAutocomplete();
    this.subscribeToBoundsChange();
    this.listenToLocationChanges();
  }

  onClose() {
    this.closing.emit(true);
  }
  onSubmit(form: NgForm) {
    if (form.valid) {
      const { title, location, date, hour, minute, min, max,info } = form.form.value;
      const myLocation = this.exactMatch || this.closestMatch || location
      const time = new Date(date);
      time.setHours(hour);
      time.setMinutes(minute);
      const dateTime = time.toISOString();
      this.eventsService
        .addEvent({
          title: title,
          location: myLocation,
          latLng:this.mapService.latLng(),
          time: dateTime,
          min: min,
          max: max,
          info:info
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
      const place = this.autocomplete!.getPlace();
      this.exactMatch = place.formatted_address;
      const address = this.locationField.nativeElement.value; 
      this.mapService.setAddress(address);
      this.mapService.convertAddressToLatLng(address);
    });
  }

  private listenToLocationChanges():void{
    fromEvent(this.locationField.nativeElement, 'input')
    .pipe(
      debounceTime(1000), // Wait for 1000ms pause in typing
      distinctUntilChanged(), // Only call when the value changes
      takeUntil(this.unsubscribe$) // Cleanup when component is destroyed
    )
    .subscribe(() => {
      const inputValue = this.locationField.nativeElement.value;
      if (inputValue) {
        this.getPredictions(inputValue);
      }
    });
  }

  getPredictions(input: string) {
    const request = {
      input: input,
      bounds: this.bounds
    };

    this.autocompleteService.getPlacePredictions(request, (predictions, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
        const closestMatch = predictions[0]; // Assuming the first prediction is the closest
        this.closestMatch=closestMatch.description;
      }});
    }

  private subscribeToBoundsChange() {
    this.mapService.bounds$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((bounds) => {
        this.autocomplete?.setBounds(bounds);
        this.bounds=bounds;
      });
  }
  
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
