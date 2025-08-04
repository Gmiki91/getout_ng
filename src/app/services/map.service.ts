import { Injectable, signal, inject } from '@angular/core';
import { Event, LatLng } from '../models/event.model';
import {  Map as MyMap } from 'mapbox-gl';
import { NominatimService } from './nominatim.service';

@Injectable({ providedIn: 'root' })
export class MapService {
  private nominatimService = inject(NominatimService);
  private mapSource: mapboxgl.GeoJSONSource | undefined;
  private map: MyMap | undefined;
  private markerMapData: Map<string, GeoJSON.Feature> = new Map();
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

  // legacy function for validating the address in the event creator form (input is now read only for the address)
  convertAddressToLatLng(address: string): void {
    this.nominatimService.addressLookup(address).subscribe((results) => {
      if (results && results[0]) {
        this._markerAddress.set(results[0].displayName);
        this._markerPosition.set(results[0].latLng);
      }
    });
  }

  setPosition(address:string, location:LatLng){
    this._markerAddress.set(address);
    this._markerPosition.set(location);
  }
  
  setGeoJSONSource(source: mapboxgl.GeoJSONSource): void {
    this.mapSource = source;
  }

  setMap(map: MyMap) {
    this.map = map;
  }

  getMap(): MyMap | undefined {
    return this.map;
  }

  flyTo(position: LatLng) {
    if (this.map) {
      this.map.flyTo({center:position, zoom:16});
    }
  }

  addMarker(event: Event): void {
    const coordinates: [number, number] = [event.latLng.lng, event.latLng.lat];
    const properties = {
      id: event.id,
      title: event.title
    };
    this.addFeatureToSource(coordinates, properties);
  }
  
  addTemporaryMarker(latLng: LatLng): void {
    this.removeTemporaryMarker();
    const coordinates: [number, number] = [latLng.lng, latLng.lat];
    const properties = { id: 'temporary' };
    this.addFeatureToSource(coordinates, properties);
  }
  
  removeTemporaryMarker(): void {
    const popup = document.getElementsByClassName('mapboxgl-popup');
    if ( popup.length ) {
      popup[0].remove();
    }  
    this.removeMarkerById('temporary');
  }

  removeMarkerById(id: string): void {
    if (this.mapSource && this.markerMapData.has(id)) {
        const data = this.mapSource._data as GeoJSON.FeatureCollection;
        data.features = data.features.filter(
            (feature: GeoJSON.Feature) => feature.properties?.['id'] !== id
        );
        this.mapSource.setData(data);
        this.markerMapData.delete(id);
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

  addFeatureToSource(coordinates: [number, number], properties: Record<string, any>): void {
    if (this.mapSource && !this.markerMapData.has(properties['id'])) {
      const data = this.mapSource._data as GeoJSON.FeatureCollection;
      const newMarker: GeoJSON.Feature = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates,
        },
        properties,
      };
      data.features.push(newMarker);
      this.mapSource.setData(data);
      this.markerMapData.set(properties['id'],newMarker);
    }
  }
}
