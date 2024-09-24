import { Component,ElementRef,inject,input,output, ViewChild,OnInit } from '@angular/core';
import { Event } from '../../models/event.model';
import { DatePipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { KommentService } from '../../services/comment.service';
import { NewKommentData } from '../../models/komment.model';
import { TextFieldModule } from '@angular/cdk/text-field';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [DatePipe,MatButton,TextFieldModule],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.scss'
})

export class EventDetailsComponent implements OnInit {
  @ViewChild('komment')
  kommentRef!: ElementRef;
  event=input.required<Event>();
  joined=input.required<boolean>();
  participation = output<boolean>();
  deleteEvent = output();
  closeDialog = output();
  kommentService = inject(KommentService)
  komments = this.kommentService.comments;
  userId = "";

  ngOnInit(): void {
    this.userId=localStorage.getItem('uuid')!;
      this.kommentService.getKomments(this.event().id);
  }
  onJoin():void{
    this.participation.emit(true);
  }
  
  onLeave():void{
    this.participation.emit(false);
  }

  onDelete():void{
    this.deleteEvent.emit();
  }

  onCloseDialog():void{
    this.closeDialog.emit();
  }
  onAddKomment():void{
    const komment:NewKommentData = {
      text:this.kommentRef.nativeElement.value,
      timestamp:new Date().toISOString(),
      eventId:this.event().id,
      userId:this.userId
    }
     this.kommentService.addKomment(komment);
  }
}
