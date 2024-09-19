import {
  AfterViewInit,
  Component,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
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
export class MapComponent implements OnInit, AfterViewInit {
  @ViewChild('map')
  map!: GoogleMap;
  distanceService;
  mapOptions: google.maps.MapOptions={maxZoom:18};
  markerOptions: google.maps.MarkerOptions = { draggable: false };
  markerPositions: google.maps.LatLngLiteral[] = [];
  zoom = this._mapService.zoom;
  possibleMarkerPosition = this._mapService.latLng;
  currentPosition?:google.maps.LatLngLiteral;

  constructor(private _mapService: MapService) {
    this.distanceService =  new google.maps.DistanceMatrixService();
  }

  ngOnInit(): void {
    navigator.geolocation.getCurrentPosition((position) => {
      const latlng = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }
      this.currentPosition  =latlng;
      this._mapService.setLatLng(latlng);
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
      this._mapService.setLatLng(latlng);
      this._mapService.convertLatLngToAddress(event.latLng);
      this.distanceService.getDistanceMatrix({origins:[this.currentPosition!],destinations:[latlng],travelMode:google.maps.TravelMode.WALKING})
      .then((result=>console.log(result.rows[0].elements[0].distance)))
    }
  }

  onMarkerClick(event: MapMarker) {
    console.log(event.getPosition());
  }
}