import {
  AfterViewInit,
  Component,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  inject
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { GoogleMap, MapMarker } from '@angular/google-maps';
import { MapService } from '../services/map.service';
import { EventsService } from '../services/events.service';

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
  private _mapService = inject(MapService)
  private _eventService = inject(EventsService)
  mapOptions: google.maps.MapOptions={maxZoom:18};
  markerOptions: google.maps.MarkerOptions = { draggable: false };
  markerPositions: google.maps.LatLngLiteral[] = [];
  currentPosition;
  events;
  markerPosition;
  zoom;

  constructor() {
    this.markerPosition = this._mapService.markerPosition;
    this.currentPosition = this._mapService.currentPosition;
    this.zoom = this._mapService.zoom;
    this.events = this._eventService.allEvents;
  }

  ngOnInit(): void {
    navigator.geolocation.getCurrentPosition((position) => {
      const latlng = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }
      this._mapService.setCurrentPosition(latlng);
      this._mapService.setMarkerPosition(latlng);
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
      }
      this._mapService.setMarkerPosition(latlng);
      this._mapService.convertLatLngToAddress(event.latLng);
      
    }
  }

  onMarkerClick(eventId: string) {
    this._eventService.selectEvent(eventId)
  }
}