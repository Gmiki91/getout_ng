import {
  Component,
  ElementRef,
  inject,
  ViewChild,
  OnInit,
  signal,
} from '@angular/core';
import { Event } from '../../models/event.model';
import { DatePipe } from '@angular/common';
import { MatButton, MatIconButton } from '@angular/material/button';
import { KommentService } from '../../services/comment.service';
import { NewKommentData } from '../../models/komment.model';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatFormField } from '@angular/material/form-field';
import { MatList, MatListItem } from '@angular/material/list';
import { MatInput } from '@angular/material/input';
import { TimeTextPipe } from '../../pipes/time-text.pipe';
import { MatCardModule } from '@angular/material/card';
import { EventsService } from '../../services/events.service';
import { MapService } from '../../services/map.service';
import { UserService } from '../../services/user.service';
import User from '../../models/user.model';
import { slideDown } from '../../utils/utils';
import { MatIcon } from '@angular/material/icon';
import { MockUser } from '../../utils/mock.factory';
import { MatTooltip } from '@angular/material/tooltip';
import { LocationInfoComponent } from '../location-info/location-info.component';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [
    LocationInfoComponent,
    DatePipe,
    TextFieldModule,
    MatButton,
    MatCardModule,
    MatFormField,
    MatList,
    MatInput,
    MatButton,
    MatListItem,
    TimeTextPipe,
    MatIconButton,
    MatIcon,
    MatTooltip
  ],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.scss',
  animations:[slideDown] 
})
export class EventDetailsComponent implements OnInit {
  @ViewChild('komment')
  kommentRef!: ElementRef;
  kommentService = inject(KommentService);
  eventService = inject(EventsService);
  mapService = inject(MapService);
  userService = inject(UserService);
  event = this.eventService.selectedEvent;
  joined = this.eventService.isUserJoined(this.event().id);
  komments = this.kommentService.comments;
  showCommentBtn = false;
  showLocationInfo = false;
  user= signal<User>(MockUser);

  ngOnInit(): void {
    this.user = this.userService.user;
    this.kommentService.getKomments(this.event().id);
  }

  onJoin(): void {
    if(this.event().max>this.event().participants.length || this.event().max==0)
    this.eventService.joinEvent(this.event().id,this.event().distance);
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
    this.mapService.unhighlightMarker(this.event().id);
    this.eventService.selectEvent({} as Event);
  }

  onAddKomment(e: MouseEvent): void {
    e.stopPropagation(); //prevent blur effect
    if (this.kommentRef.nativeElement.value.trim().length > 0) {
      const komment: NewKommentData = {
        text: this.kommentRef.nativeElement.value,
        timestamp: new Date().toISOString(),
        eventId: this.event().id,
        userId: this.user().id,
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

  toggleLocationPopup(){
    this.showLocationInfo=!this.showLocationInfo;
  }

}
