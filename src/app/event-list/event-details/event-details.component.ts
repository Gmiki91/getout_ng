import { Component,input,output } from '@angular/core';
import { Event } from '../../models/event.model';
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
  joined=input.required<boolean>();
  participation = output<boolean>();
  removeEvent = output();
  closeDialog = output();

  onJoin():void{
    this.participation.emit(true);
  }
  
  onLeave():void{
    this.participation.emit(false);
  }

  onRemoveEvent():void{
    this.removeEvent.emit();
  }

  onCloseDialog():void{
    this.closeDialog.emit();
  }
}
