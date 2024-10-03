import { Injectable, signal } from '@angular/core';
import { Event, LatLng } from '../models/event.model';
import { LngLat, Map } from 'mapbox-gl';

@Injectable({ providedIn: 'root' })
export class MapService {
  private geocoder = new google.maps.Geocoder();
  private mapSource: mapboxgl.GeoJSONSource | undefined;
  private map: Map | undefined;
  private _markerAddress = signal<string>('');
  private _markerPosition = signal<LatLng>({}as LatLng);
  markerAddress = this._markerAddress.asReadonly();
  markerPosition = this._markerPosition.asReadonly();

  convertLatLngToAddress(latlng: LngLat): void {
    this.geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        this._markerAddress.set(results[0].formatted_address);
        this._markerPosition.set(latlng);
      } else {
        console.log('Geocoding failed: ' + status);
      }
    });
  }

  // to validate the address in the event creator form
  convertAddressToLatLng(address: string): Promise<{ address: string; position: LatLng }> {
    return new Promise((resolve, reject) => {
      this.geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const lat = results[0].geometry.location.lat();
          const lng = results[0].geometry.location.lng();
          const result = {
            address: results[0].formatted_address,
            position: { lat, lng },
          };
          resolve(result);
        } else {
          reject(`Geocoding failed: ${status}`);
        }
      });
    });
  }

  setGeoJSONSource(source: mapboxgl.GeoJSONSource): void {
    this.mapSource = source;
  }

  setMap(map: Map) {
    this.map = map;
  }

  flyTo(position: LatLng) {
    if (this.map) {
      this.map.flyTo({ center: position, zoom:14 });
    }
  }

  addMarker(event: Event): void {
    if (this.mapSource) {
      const data = this.mapSource._data as GeoJSON.FeatureCollection;
      const newMarker: GeoJSON.GeoJSON = {
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
      data.features.push(newMarker);
      this.mapSource.setData(data);
    }
  }

  removeMarker(eventId: string): void {
    if (this.mapSource) {
      const data = this.mapSource._data as GeoJSON.FeatureCollection;
      const updatedFeatures = data.features.filter(
        (feature) => feature.properties?.['id'] !== eventId
      );
      this.mapSource.setData({
        ...data,
        features: updatedFeatures,
      });
    }
  }
}
