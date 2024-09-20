import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class MapService {
  private geocoder = new google.maps.Geocoder();
  private _markerAddress = signal<string>('');
  private _markerPosition = signal<google.maps.LatLngLiteral>({ lat: 0, lng: 0 });
  private _currentPosition = signal<google.maps.LatLngLiteral>({ lat: 0, lng: 0 });
  private _zoom = signal<number>(14);
  private _bounds = new BehaviorSubject<google.maps.LatLngBoundsLiteral | undefined>(undefined);


  markerAddress = this._markerAddress.asReadonly();
  markerPosition = this._markerPosition.asReadonly();
  currentPosition = this._currentPosition.asReadonly();
  zoom = this._zoom.asReadonly();
  bounds$ = this._bounds.asObservable();

  public setCurrentPosition(latLng: google.maps.LatLngLiteral): void {
    this._currentPosition.set(latLng);
    this.updateBounds(latLng);
  }

  public setMarkerPosition(latLng: google.maps.LatLngLiteral): void {
    this._markerPosition.set(latLng);
  }

  public setAddress(address: string): void {
    this._markerAddress.set(address);
  }

  public setZoom(zoom: number): void {
    this._zoom.set(zoom);
  }

  public updateBounds(center: google.maps.LatLngLiteral): void {
    const zoom = this._zoom();
    let kmAdjustment: number;
    if (zoom >= 16) {
      kmAdjustment = 0.5; // Approx. 1 km at high zoom levels
    } else if (zoom >= 14) {
      kmAdjustment = 1.0; // Approx. 2 km
    } else if (zoom >= 12) {
      kmAdjustment = 2.0; // Approx. 4 km
    } else {
      kmAdjustment = 5.0; // Approx. 10 km
    }

    // Convert km to degrees (approx. 1 degree = 111 km)
    const latLngDelta = kmAdjustment / 111;

    const bounds = {
      north: center.lat + latLngDelta,
      south: center.lat - latLngDelta,
      east: center.lng + latLngDelta,
      west: center.lng - latLngDelta,
    };
    this._bounds.next(bounds);
  }

  public convertLatLngToAddress(latlng: google.maps.LatLng): void {
    this.geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        this._markerAddress.set(results[0].formatted_address);
      } else {
        console.log('Geocoding failed: ' + status);
      }
    });
  }

  public convertAddressToLatLng(address: string): void {
    this.geocoder.geocode({ address }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const lat = results[0].geometry.location.lat();
        const lng = results[0].geometry.location.lng();
        this._markerPosition.set({ lat, lng });
      } else {
        console.log('Geocoding failed: ' + status);
      }
    });
  }
}
