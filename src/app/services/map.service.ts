import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class MapService {
  private geocoder = new google.maps.Geocoder();
  private _address = signal<string>('');
  private _latLng = signal<google.maps.LatLngLiteral>({ lat: 0, lng: 0 });
  private _zoom = signal<number>(14);
  private _bounds = new BehaviorSubject<google.maps.LatLngBoundsLiteral|undefined>(undefined);

  address = this._address.asReadonly();
  latLng = this._latLng.asReadonly();
  zoom = this._zoom.asReadonly();
  bounds$ = this._bounds.asObservable();

  public setLatLng(latLng: google.maps.LatLngLiteral): void {
    this._latLng.set(latLng);
    this.updateBounds(latLng);
  }

  public setAddress(address: string): void {
    this._address.set(address);
  }

  public setZoom(zoom: number): void {
    this._zoom.set(zoom);
  }

  public updateBounds(center:google.maps.LatLngLiteral):void {
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

    const bounds= {
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
        this._address.set(results[0].formatted_address);
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
        this._latLng.set({ lat, lng });
      } else {
        console.log('Geocoding failed: ' + status);
      }
    });
  }
}
