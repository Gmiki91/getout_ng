import { Component,input,inject} from '@angular/core';
import { Event } from '../../models/event.model';
import { TimeTextPipe } from '../../pipes/time-until.pipe';
import {MatIcon} from '@angular/material/icon';
import { DistanceFormatPipe } from '../../pipes/distance-format.pipe';
import { MapService } from '../../services/map.service';
import {MatTooltip} from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [TimeTextPipe,MatIcon,MatCardModule,MatTooltip,DistanceFormatPipe,DatePipe],
  templateUrl: './event.component.html',
  styleUrl: './event.component.scss',
})
export class EventComponent {
  private mapService = inject(MapService);
  event=input.required<Event>();
  uuid;

  constructor(){
    this.uuid = localStorage.getItem('uuid') || '0';  
  }

  onFindMarker(e:MouseEvent):void{
    e.stopPropagation();
    this.mapService.setMarkerPosition(this.event().latLng);
  }
}
