import { Injectable, signal, inject } from '@angular/core';
import { Event, LatLng } from '../models/event.model';
import {  Map } from 'mapbox-gl';
import { NominatimService } from './nominatim.service';

@Injectable({ providedIn: 'root' })
export class MapService {
  private nominatimService = inject(NominatimService);
  private mapSource: mapboxgl.GeoJSONSource | undefined;
  private map: Map | undefined;
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

  // legacy function for validating the address in the event creator form
  convertAddressToLatLng(address: string): void {
    this.nominatimService.addressLookup(address).subscribe((results) => {
      if (results && results[0]) {
        this._markerAddress.set(results[0].displayName);
        this._markerPosition.set(results[0].latLng);
      }
    });
  }

  setSearchResult(address:string, location:LatLng){
    this._markerAddress.set(address);
    this._markerPosition.set(location);
  }
  
  setGeoJSONSource(source: mapboxgl.GeoJSONSource): void {
    this.mapSource = source;
  }

  setMap(map: Map) {
    this.map = map;
  }

  flyTo(position: LatLng) {
    if (this.map) {
      this.map.flyTo({center:position, zoom:16});
    }
  }

  addMarker(event: Event): void {
    if (this.mapSource) {
      const data = this.mapSource._data as GeoJSON.FeatureCollection;
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

  highlightMarker(eventId: string): void {
    // const layer = this.findMarker(eventId);
    // if (layer) {
    //   layer.setIcon(RedIcon);
    // }
  }

  unhighlightMarker(eventId: string): void {
    // console.log(eventId);
    //   const layer = this.findMarker(eventId);
    //   if(layer){
    //     layer.setIcon(BlueIcon);
    //   }
  }

}
