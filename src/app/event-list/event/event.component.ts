import { Component,input,output,AfterViewInit} from '@angular/core';
import { Event } from '../../models/event.model';
import { TimeUntilPipe } from '../../time-until.pipe';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [TimeUntilPipe,MatCardModule,MatIconModule],
  templateUrl: './event.component.html',
  styleUrl: './event.component.scss',
})
export class EventComponent implements AfterViewInit {
  event=input.required<Event>();
  currentPosition=input.required<google.maps.LatLngLiteral>();
  findMarker = output()
  distanceService;
  distance="0";
  uuid;

  constructor(){
    this.uuid = localStorage.getItem('uuid') || '0';  
    this.distanceService =  new google.maps.DistanceMatrixService();
  }

  ngAfterViewInit():void{
    this.distanceService.getDistanceMatrix({origins:[this.currentPosition()],destinations:[this.event().latLng],travelMode:google.maps.TravelMode.WALKING})
      .then((result=>this.distance = result.rows[0].elements[0].distance.text))
  }

  onFindMarker(e:MouseEvent):void{
    e.stopPropagation();
    this.findMarker.emit();
  }
}
