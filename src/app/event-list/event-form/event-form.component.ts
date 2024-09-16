import { AfterViewInit, Component, output, ViewChild,ElementRef } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { EventsService } from '../../services/events.service';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [FormsModule,MatFormFieldModule,MatInputModule,MatButtonModule],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.scss',
})
export class EventFormComponent implements AfterViewInit {
  closing = output<boolean>();
  minPeople = 2;
  autocomplete: google.maps.places.Autocomplete | undefined;
  @ViewChild('locationField')
  locationField!: ElementRef;
  constructor(private eventsService: EventsService) {}

  ngAfterViewInit(): void {
    this.autocomplete = new google.maps.places.Autocomplete(
      this.locationField.nativeElement
    );
  }
  onClose() {
    this.closing.emit(true);
  }
  onSubmit(form: NgForm) {
    if (form.valid) {
      const {title,location,date,hour,minute,min,max} = form.form.value
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
          max: max
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
}
