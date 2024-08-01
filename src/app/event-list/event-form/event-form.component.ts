import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventsService } from '../events.service';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.scss'
})

export class EventFormComponent {
  title=signal('');
  location=signal('');
  date=signal('');
  hour=signal(0);
  minute=signal(0);
  min=signal(0);
  max=signal(0);
  closing=output<boolean>();

  constructor(private eventsService: EventsService ){}

  onClose(){
    this.closing.emit(true)
  }
  onSubmit(){
    const time  = new Date(this.date());
    time.setHours(this.hour());
    time.setMinutes(this.minute());
    const dateTime = time.getTime();
    this.eventsService.addEvent({
      title:this.title(),
      location:this.location(),
      time:dateTime,
      min:this.min(),
      max:this.max()
    })
    this.onClose();
  }
}
