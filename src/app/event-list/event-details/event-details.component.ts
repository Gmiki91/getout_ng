import { Component,input,output } from '@angular/core';
import { Event } from '../event/event.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.scss'
})

export class EventDetailsComponent {
  event=input.required<Event>();
  closeDialog = output();

  join():void{
  }

  closePopup():void{
    this.closeDialog.emit();
  }
}
