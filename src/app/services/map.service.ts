import { Injectable, signal, inject } from '@angular/core';
import { Event, LatLng } from '../models/event.model';
import * as L from 'leaflet';
import { NominatimService } from './nominatim.service';

@Injectable({ providedIn: 'root' })
export class MapService {
  private nominatimService = inject(NominatimService);
  private markerLayer: L.GeoJSON | undefined;
  private map: L.Map | undefined;
  private _markerAddress = signal<string>('');
  private _markerPosition = signal<LatLng>({} as LatLng);
  markerAddress = this._markerAddress.asReadonly();
  markerPosition = this._markerPosition.asReadonly();
  markerIdTracker: { [key: string]: number } = {};

  convertLatLngToAddress(latlng: LatLng): void {
    this.nominatimService.reverseLookup(latlng).subscribe((result) => {
      if (result) {
        this._markerAddress.set(result.displayName);
        this._markerPosition.set(latlng);
      } else {
        console.log('Geocoding failed');
      }
    });
  }

  convertAddressToLatLng(address: string): void {
    this.nominatimService.addressLookup(address).subscribe((results) => {
      if (results && results[0]) {
        this._markerAddress.set(results[0].displayName);
        this._markerPosition.set(results[0].latLng);
      }
    });
  }

  setMarkerLayer(markerLayer: L.GeoJSON): void {
    this.markerLayer = markerLayer;
  }

  setMap(map: L.Map) {
    this.map = map;
  }

  flyTo(position: LatLng) {
    if (this.map) {
      this.map.flyTo(position, 16);
    }
  }

  addMarker(event: Event): void {
    if (this.markerLayer) {
      const newMarker: GeoJSON.Feature = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [event.latLng.lng, event.latLng.lat],
        },
        properties: {
          id: event.id,
          title: event.title,
        },
      };
      this.markerLayer.addData(newMarker);
    }
  }

  removeMarker(eventId: string): void {
    if (this.markerLayer) {
      const layerId = this.markerIdTracker[eventId]; // Get the Leaflet layer ID from the feature ID
      if (layerId) {
        const layer = this.markerLayer.getLayer(layerId);
        if (layer) {
          this.markerLayer.removeLayer(layer); // Remove the layer from the map
        }
      }
    }
  }
}
