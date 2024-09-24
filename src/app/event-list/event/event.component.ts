import { Component,input,inject} from '@angular/core';
import { Event } from '../../models/event.model';
import { TimeUntilPipe } from '../../pipes/time-until.pipe';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import { DistanceFormatPipe } from '../../pipes/distance-format.pipe';
import { MapService } from '../../services/map.service';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [TimeUntilPipe,MatCardModule,MatIconModule,DistanceFormatPipe],
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
