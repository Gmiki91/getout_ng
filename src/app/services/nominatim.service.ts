import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LatLng } from '../models/event.model';
const DEFAULT_VIEW_BOX: string =
  'viewbox=-25.0000%2C70.0000%2C50.0000%2C40.0000';
const BASE_NOMINATIM_URL: string = 'nominatim.openstreetmap.org';
type NominatimResponse = {
  latLng: LatLng;
  displayName: string;
};
@Injectable({ providedIn: 'root' })
export class NominatimService {
  private http = inject(HttpClient);

  addressLookup(address: string): Observable<NominatimResponse[]> {
    return this.http
      .get<any[]>(
        `https://${BASE_NOMINATIM_URL}/search?format=json&q=${address}&${DEFAULT_VIEW_BOX}`
      )
      .pipe(
        map((data: any[]) => data.map((item: any) => this.createResponse(item)))
      );
  }

  reverseLookup(lngLat: LatLng): Observable<NominatimResponse> {
    return this.http
      .get<any>(
        `https://${BASE_NOMINATIM_URL}/reverse?format=json&lat=${lngLat.lat}&lon=${lngLat.lng}&${DEFAULT_VIEW_BOX}`
      )
      .pipe(
        map((item: any) =>this.createResponse(item)));
      
  }

  createResponse(item: any): NominatimResponse {
    const {country,city,house_number,road, postcode} = item.address;
    return {
      latLng: { lat: item.lat, lng: item.lon },
      displayName: `${city|| ''} ${city? ',': ''} ${road|| ''} ${house_number || ''}${road || house_number ? ',':''} ${postcode|| ''}${postcode?',':''} ${country|| ''}`,
    };
  }
}
