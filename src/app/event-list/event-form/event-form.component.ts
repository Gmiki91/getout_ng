import { Component, output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { EventsService } from '../events.service';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.scss',
})
export class EventFormComponent {
  closing = output<boolean>();
  minPeople = 2;
  constructor(private eventsService: EventsService) {}

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
