import { Injectable, signal } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class MapService {
  private geocoder = new google.maps.Geocoder();
  private _address = signal<string>('');
  private _latLng = signal<google.maps.LatLngLiteral>({ lat: 0, lng: 0 });
  address = this._address.asReadonly();
  latLng = this._latLng.asReadonly();

  public setLatLng(latLng: google.maps.LatLngLiteral): void {
    this._latLng.set(latLng);
  }

  public setAddress(address: string): void {
    this._address.set(address);
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
