import { Component, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { GoogleMap, MapMarker } from '@angular/google-maps';
import { MapService } from '../services/map.service';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [GoogleMap, MapMarker],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  zoom = 14;
  markerOptions: google.maps.MarkerOptions = { draggable: false };
  markerPositions: google.maps.LatLngLiteral[] = [];
  possibleMarkerPosition= this._mapService.latLng;

  constructor(private _mapService: MapService) {}

  ngOnInit(): void {
    navigator.geolocation.getCurrentPosition((position) => {
      this._mapService.setLatLng({lat:position.coords.latitude,lng:position.coords.longitude})
    });
  }

  onMapClick(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      this._mapService.setLatLng({lat:event.latLng.lat(),lng:event.latLng.lng()})
      this._mapService.convertLatLngToAddress(event.latLng);
    }
  }

  onMarkerClick(event: MapMarker) {
    console.log(event.getPosition());
  }
}