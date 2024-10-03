import {
  Component,
  ElementRef,
  inject,
  input,
  output,
  ViewChild,
  OnInit,
} from '@angular/core';
import { Event } from '../../models/event.model';
import { DatePipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { KommentService } from '../../services/comment.service';
import { NewKommentData } from '../../models/komment.model';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatDivider } from '@angular/material/divider';
import { MatFormField } from '@angular/material/form-field';
import { MatList, MatListItem } from '@angular/material/list';
import { MatInput } from '@angular/material/input';
import { TimeTextPipe } from '../../pipes/time-until.pipe';
import { MatCardModule } from '@angular/material/card';
import {CdkDrag} from '@angular/cdk/drag-drop'
import { EventsService } from '../../services/events.service';
import { MapService } from '../../services/map.service';
@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [
    DatePipe,
    MatButton,
    TextFieldModule,
    MatCardModule,
    MatDivider,
    MatFormField,
    MatList,
    MatInput,
    MatListItem,
    TimeTextPipe,
    CdkDrag
  ],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.scss',
})
export class EventDetailsComponent implements OnInit {
  @ViewChild('komment')
  kommentRef!: ElementRef;
  kommentService = inject(KommentService);
  eventService = inject(EventsService);
  mapService = inject(MapService);
  event = this.eventService.selectedEvent;
  joined = this.eventService.isUserJoined(this.event().id);
  komments = this.kommentService.comments;
  showCommentBtn = false;
  userId = '';

  ngOnInit(): void {
    this.userId = localStorage.getItem('uuid')!;
    this.kommentService.getKomments(this.event().id);
  }

  onJoin(): void {
    this.eventService.joinEvent(this.event().id,this.event().distance);
    this.closeDialog();
  }

  onLeave(): void {
    this.eventService.leaveEvent(this.event().id,this.event().distance);
    this.closeDialog();
  }

  onDelete(): void {
    this.eventService.deleteEvent(this.event().id, this.event().ownerId);
    this.mapService.removeMarker(this.event().id);
    this.closeDialog();
  }

  closeDialog(): void {
    this.eventService.selectEvent({} as Event);
  }

  onAddKomment(e: MouseEvent): void {
    e.stopPropagation(); //prevent blur effect
    if (this.kommentRef.nativeElement.value.trim().length > 0) {
      const komment: NewKommentData = {
        text: this.kommentRef.nativeElement.value,
        timestamp: new Date().toISOString(),
        eventId: this.event().id,
        userId: this.userId,
      };
      this.kommentService.addKomment(komment);
      this.kommentRef.nativeElement.value='';
      this.showCommentBtn = false;
    }
  }

  onShowCommentBtn(inFocus: boolean) {
    if (this.kommentRef.nativeElement.value.trim().length <= 0) {
        this.showCommentBtn = inFocus;
    }
  }

}
