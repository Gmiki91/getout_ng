import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { MapService } from '../services/map.service';
import { EventsService } from '../services/events.service';
import mapboxgl, { GeolocateControl, LngLat, Map } from 'mapbox-gl';
import { environment } from '../../environments/environment';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

const markerSymbolLayout: mapboxgl.SymbolLayerSpecification['layout'] = {
  'icon-image': 'custom-marker',
  'icon-anchor': 'bottom',
  'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
  'text-size': 14,
  'text-offset': [0, 0.25],
  'text-anchor': 'top',
};

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  private mapService = inject(MapService);
  private eventService = inject(EventsService);
  private destroyRef = inject(DestroyRef);
  viewbox = '';

  //Get current location
  ngOnInit(): void {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const param = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        // set bounds for the autofill search
        this.viewbox = `${position.coords.longitude - 0.05},${
          position.coords.latitude + 0.05
        },${position.coords.longitude + 0.05},${
          position.coords.latitude - 0.05
        }`;
        this.eventService.setCurrentPosition(param);
        // update location field in create event form
        this.mapService.convertLatLngToAddress(param);
        this.initMap(position.coords);
      },
      (err) => {
        // alert(`ERROR(${err.code}): ${err.message}`);
        this.initMap();
      }
    );
  }

  initMap(coords?: GeolocationCoordinates): void {
    const map = new mapboxgl.Map({
      accessToken: environment.mapbox.accessToken,
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: coords
        ? { lat: coords.latitude, lon: coords.longitude }
        : { lat: 0, lon: 0 },
      zoom: 13,
    });
    this.addControls(map);
    this.addListeners(map);
    this.mapService.setMap(map);
  }

  addControls(map: Map) {
    const geoLocateControl = this.initGeoLocateControl();
    const geocoder = this.initGeocoder(map);
    map.addControl(geocoder);
    map.addControl(geoLocateControl);
    map.addControl(new mapboxgl.NavigationControl());
  }

  initGeoLocateControl(): GeolocateControl {
    return new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
    });
  }

  initGeocoder(map: Map): MapboxGeocoder {
    return new MapboxGeocoder({
      accessToken: environment.mapbox.accessToken,
      collapsed: true,
      marker: false,
      mapboxgl: mapboxgl as any,
    }).on('result', (event) => {
      const location = event.result;
      const latLng = {
        lng: location.geometry.coordinates[0],
        lat: location.geometry.coordinates[1],
      } as LngLat;
      this.createEventPopup(map, latLng);
      this.mapService.addTemporaryMarker(latLng);
      this.mapService.setSearchResult(location.place_name, latLng);
    });
  }

  initMarkers(): void {
    const sub = this.eventService.getEvents().subscribe((events) => {
      const allEvents = events.joinedEvents.concat(events.otherEvents);
      allEvents.forEach((event) => {
        this.mapService.addMarker(event);
      });
    });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  addListeners(map: Map) {
    map.on('click', (e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ['markers', 'clusters'],
      });
      //Map clicked
      if (features.length === 0) {
        this.mapService.addTemporaryMarker(e.lngLat);
        this.mapService.convertLatLngToAddress(e.lngLat);
        this.createEventPopup(map, e.lngLat);
      }
      //Marker clicked
      else if (features.length === 1) {
        const id: string = features![0].properties!['id'];
        if (id) {
          this.eventService.selectEventById(id);
        } else {
          // Temporary marker selected, remove the previous marker if any
          this.mapService.removeTemporaryMarker();
        }
      }
      //Cluster clicked (cluster click propagates to the marker as well, thats why length is 2)
      else if (features.length === 2) {
        map.flyTo({ center: e.lngLat, zoom: 16 });
      }
    });

    // change cursor to pointer when hovering over a marker
    map.on('mouseenter', 'markers', (e) => {
      map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'markers', () => {
      map.getCanvas().style.cursor = '';
    });

    //right click
    map.on('contextmenu', (e) => {
      document.getElementsByClassName('popup_w_btn')[0]?.remove();
      this.mapService.removeTemporaryMarker();
    });

    map.on('load', () => {
      map.loadImage(
        'https://getoutimages.blob.core.windows.net/symbol1/location-mark.png',
        (error, image) => {
          if (error) throw error;
          //@ts-ignore
          map.addImage('custom-marker', image);
        }
      );
      this.addGeoJsonSource(map);
      this.addSymbolLayer(map);
      this.initMarkers();
    });
  }

  addGeoJsonSource(map: Map): void {
    const geojsonData: GeoJSON.GeoJSON = {
      type: 'FeatureCollection',
      features: [],
    };
    map.addSource('event-markers', {
      type: 'geojson',
      data: geojsonData,
      cluster: true, // Enable clustering
      clusterRadius: 50, // Radius of each cluster when zoomed out
      clusterMaxZoom: 14,
      clusterProperties: {
        markerCount: ['+', 1],
      },
    });
    const source = map.getSource('event-markers') as mapboxgl.GeoJSONSource;
    this.mapService.setGeoJSONSource(source); // Set the GeoJSON source in MapService
  }

  addSymbolLayer(map: Map) {
    map.addLayer({
      id: 'markers',
      type: 'symbol',
      source: 'event-markers',
      layout: {
        'icon-allow-overlap': true,
        'text-allow-overlap': true,
        'text-field': ['get', 'title'],
        ...markerSymbolLayout,
      },
    });
    map.addLayer({
      id: 'clusters',
      type: 'symbol',
      source: 'event-markers',
      filter: ['has', 'point_count'], // Only for clusters
      layout: {
        'text-field': '{markerCount} events',
        ...markerSymbolLayout,
      },
    });
  }

  createEventPopup(map: Map, lngLat: LngLat) {
    if (!this.eventService.isEventFormOpen()) {
      //dont show 'create event' popup when we are already creating event

      //remove previous popup
      document.getElementsByClassName('popup_w_btn')[0]?.remove();
      const popup = new mapboxgl.Popup({
        closeButton: false,
        className: 'popup_w_btn',
      })
        .setLngLat(lngLat)
        .setOffset(-50)
        .setHTML(
          `<span style="font-weight: bold; font-size:16px; cursor:pointer; color:white" id='popupBtn'">Create event</span>`
        )
        .addTo(map);

      this.stylePopup(popup);

      document.getElementById('popupBtn')!.addEventListener('click', () => {
        this.eventService.toggleEventForm();
        document.getElementsByClassName('popup_w_btn')[0].remove();
      });
    }
  }
  stylePopup(popup: mapboxgl.Popup): void {
    const popupContent = popup
      .getElement()!
      .querySelector('.mapboxgl-popup-content') as HTMLElement;
    const popupTip = popup
      .getElement()!
      .querySelector('.mapboxgl-popup-tip') as HTMLElement;
    if (popupContent && popupTip) {
      popupContent.style.animation = 'bounce-in 0.5s ease';
      popupTip.style.display = 'none';
      popupContent.style.borderRadius = '16px';
      popupContent.style.opacity = '0';
      popupContent.style.background =
        'linear-gradient(135deg, rgb(207, 36, 75,0.9), rgba(232, 61, 88,0.9))';
      popupContent.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';

      // Trigger the fade-in after a short delay (to allow rendering)
      setTimeout(() => {
        popupContent.style.transition = 'opacity 0.5s ease-in-out';
        popupContent.style.opacity = '1';
      }, 100);
    }
  }
}
