import {
  AfterViewInit,
  Component,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  inject
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { GoogleMap, MapMarker, } from '@angular/google-maps';
import { MapService } from '../services/map.service';
import { EventsService } from '../services/events.service';
import { Event } from '../models/event.model';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [GoogleMap, MapMarker],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, AfterViewInit {
  @ViewChild('map')
  map!: GoogleMap;
  private _mapService = inject(MapService);
  private _eventService = inject(EventsService);
  mapOptions: google.maps.MapOptions = { };
  currentPosition;
  currentPin;
  selectedPosition;
  selectedPin;
  events;
  eventPin;
  zoom;

  constructor() {
    this.selectedPosition = this._mapService.markerPosition;
    this.currentPosition = this._mapService.currentPosition;
    this.events = this._eventService.allEvents;
    this.currentPin = this.pinSymbol('#ff0505', '#690000');
    this.selectedPin = this.pinSymbol('#fcdb03', '#6b5d02');
    this.eventPin = this.pinSymbol('#33db04', '#228B22');
    this.zoom = this._mapService.zoom;
  }
 
  ngOnInit(): void {
    navigator.geolocation.getCurrentPosition((position) => {
      const latlng = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      this._mapService.setCurrentPosition(latlng);
      this._mapService.setMarkerPosition(latlng);
      this.initMapOptions();
    });
  }

  ngAfterViewInit(): void {
    google.maps.event.addListener(this.map.googleMap!, 'zoom_changed', () => {
      const currentZoom = this.map.googleMap!.getZoom();
      if (currentZoom) this._mapService.setZoom(currentZoom);
    });
  }

  onMapClick(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      const latlng = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      this._mapService.setMarkerPosition(latlng);
      this._mapService.convertLatLngToAddress(event.latLng);
    }
  }

  onMarkerClick(event: Event) {
    this._eventService.selectEvent(event);
  }

  private pinSymbol(fill: string, border: string) {
    return {
      path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
      fillColor: fill,
      fillOpacity: 1,
      strokeColor: border,
      strokeWeight: 3,
      scale: 1.1,
    };
  }

  private initMapOptions():void{
  this.mapOptions=  {
    maxZoom: 18,
    styles: [
      {
        featureType: 'poi', // Hide all POIs (points of interest)
        elementType: 'all',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'transit', // Hide all transit stations
        elementType: 'all',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'road', // Hide road labels
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      },
    ],
  };

}
}
