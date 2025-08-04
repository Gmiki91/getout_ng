import { Component,inject,output} from '@angular/core';
import { Event } from '../models/event.model';
import { TimeTextPipe } from '../pipes/time-text.pipe';
import {MatIcon} from '@angular/material/icon';
import { DistanceFormatPipe } from '../pipes/distance-format.pipe';
import { MapService } from '../services/map.service';
import {MatTooltip} from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { DatePipe } from '@angular/common';
import { UserService } from '../services/user.service';
import { EventsService } from '../services/events.service';

@Component({
    selector: 'app-event',
    imports: [TimeTextPipe, MatIcon, MatCardModule, MatTooltip, DistanceFormatPipe, DatePipe],
    templateUrl: './event.component.html',
    styleUrl: './event.component.scss'
})
export class EventComponent {
  private mapService = inject(MapService);
  private userService = inject(UserService);
  private eventsService = inject(EventsService);
  events = this.eventsService.events;
  openDetails = output<Event>();
  user;

  constructor(){
    this.user = this.userService.user;  
  }

  onFindMarker(e:MouseEvent,event:Event):void{
    e.stopPropagation();
    this.mapService.flyTo(event.latLng);
  }
}
