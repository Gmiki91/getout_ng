import { Component, DestroyRef, OnDestroy, OnInit, inject } from '@angular/core';
import { MapService } from '../services/map.service';
import { EventsService } from '../services/events.service';
import mapboxgl, { GeolocateControl, LngLat, Map } from 'mapbox-gl';
import { environment } from '../../environments/environment';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { StateService } from '../services/state.service';
import { AuthService } from '../services/auth.service';
import { distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ThemeService } from '../services/theme.service';
import { LatLng } from '../models/event.model';

// Define the layout for marker symbols
// This layout is used for individual events marked with pawns
const markerSymbolLayout: mapboxgl.SymbolLayerSpecification['layout'] = {
  'icon-image': 'pawn-marker',
  'icon-anchor': 'bottom',
  'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
  'text-size': 14,
  'text-offset': [0, 0.25],
  'text-anchor': 'top',
};

// This layout is used for clusters of events, where the icon changes based on the number of markers in the cluster
const clusterSymbolLayout: mapboxgl.SymbolLayerSpecification['layout'] = {
  'icon-image': [
    'step',
    ['get', 'point_count'],
    'pawn-marker',
    3, 'knight-marker',
    4, 'bishop-marker',
    5, 'rook-marker',
    9, 'queen-marker',
    10, 'king-marker',
  ],
  'text-field': '{point_count} events',
  'icon-anchor': 'bottom',
  'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
  'text-size': 14,
  'text-offset': [0, 0.25],
  'text-anchor': 'top',
};

@Component({
  selector: 'app-map',
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, OnDestroy {
  private mapService = inject(MapService);
  private eventService = inject(EventsService);
  private stateService = inject(StateService);
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  private themeService = inject(ThemeService);
  showSearchButton = false;

  //Get current location
  ngOnInit(): void {
    let param: LatLng = { lat: 0, lng: 0 };
    let zoom = 15;
    if(this.mapService.viewport){
      param = this.mapService.viewport;
      zoom  = this.mapService.zoom || 15;
      this.eventService.setCurrentPosition(param);
      this.initMap(zoom,param);
    }else{
      navigator.geolocation.getCurrentPosition(
        (position) => {
           param = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          } as LatLng;
          this.eventService.setCurrentPosition(param);
          this.initMap(zoom,param);
        },
        (err) => {
          // alert(`ERROR(${err.code}): ${err.message}`);
          this.initMap(zoom);
        }
      );
    }
  }

  ngOnDestroy(): void {
      this.mapService.resetMap();
  }

  initMap(zoom:number,coords?: LatLng): void {
    const map = new mapboxgl.Map({
      accessToken: environment.mapbox.accessToken,
      container: 'map',
      style: `mapbox://styles/mapbox/${this.themeService.currentTheme()}-v11`,
      center: coords
        ? { lat: coords.lat, lon: coords.lng }
        : { lat: 0, lon: 0 },
      zoom: zoom,
    });
    map.on('error', e => alert("An error occurred while initializing the map, please try again later."));
    this.addControls(map);
    this.addListeners(map);
    this.mapService.setMap(map);
    this.applyMapViewportFilter();
  }

  addControls(map: Map) {
    const geoLocateControl = this.initGeoLocateControl();
    const geocoder = this.initGeocoder();
    map.addControl(geocoder, 'bottom-right');
    map.addControl(geoLocateControl, 'bottom-right');
    map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
  }

  initGeoLocateControl(): GeolocateControl {
    return new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
      showUserHeading: true,
    }).on('geolocate', (e) => {
      const param = {
        lat: e.coords.latitude,
        lng: e.coords.longitude,
      };
      this.eventService.setCurrentPosition(param);
      this.eventService.updateDistances();
    });
  }

  initGeocoder(): MapboxGeocoder {
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
      this.mapService.setPosition(location.place_name, latLng);
    });
  }

  initMarkers(): void {
   const sub =  this.authService.isAuthenticated$.pipe(
      distinctUntilChanged(), // if the authentication state changes upon login/logout, refresh the event list groups 
      switchMap(() => this.eventService.getEvents())
    ).subscribe(events => {
      events.forEach((event) => {
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

    map.on('load', async () => {
      const theme = this.themeService.currentTheme();
      try {
        await Promise.all([
          this.loadMapImage(map, 'pawn-marker', `/${theme}/pawn.png`),
          this.loadMapImage(map, 'knight-marker', `/${theme}/knight.png`),
          this.loadMapImage(map, 'bishop-marker', `/${theme}/bishop.png`),
          this.loadMapImage(map, 'rook-marker', `/${theme}/rook.png`),
          this.loadMapImage(map, 'queen-marker', `/${theme}/queen.png`),
          this.loadMapImage(map, 'king-marker', `/${theme}/king.png`),
        ]);
        this.addGeoJsonSource(map);
        this.addSymbolLayer(map);
        this.initMarkers();
      } catch (error) {
        alert('Failed to load marker images!');
      }
    });

    map.on('moveend', () => {
      this.showSearchButton = true;
    });
  }

  loadMapImage(map: mapboxgl.Map, name: string, url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      map.loadImage(url, (error, image) => {
        if (error || !image) return reject(error);
        // @ts-ignore
        map.addImage(name, image);
        resolve();
      });
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
      // clusterProperties: {
      //   markerCount: ['+', 1],
      // },
    });
    const source = map.getSource('event-markers') as mapboxgl.GeoJSONSource;
    this.mapService.setGeoJSONSource(source); // Set the GeoJSON source in MapService
  }

  addSymbolLayer(map: Map) {
    map.addLayer({
      id: 'markers',
      type: 'symbol',
      source: 'event-markers',
      filter: ['!', ['has', 'point_count']],
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
        'icon-allow-overlap': true,
        'text-allow-overlap': true,
        'text-field': '{point_count}',
        ...clusterSymbolLayout,
      },
    });
  }

  applyMapViewportFilter(): void {
    const currentBounds = this.mapService.getMap()?.getBounds();
    if (currentBounds) {
      const ne = currentBounds.getNorthEast();
      const sw = currentBounds.getSouthWest();
      this.eventService.setViewportBounds(sw, ne);
      this.showSearchButton = false;
    }
  }

  createEventPopup(map: Map, lngLat: LngLat) {
    //dont show 'create event' popup when we are already creating event or an event is selected
    if (
      !this.stateService.showEventForm() &&
      !this.stateService.showEventDetails() &&
      !this.stateService.isEventUpdating()
    ) {
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
        this.stateService.toggleEventForm();
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
      popupContent.style.background = 'linear-gradient( #000000,#b3b3b3 99%)';
      popupContent.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';

      // Trigger the fade-in after a short delay (to allow rendering)
      setTimeout(() => {
        popupContent.style.transition = 'opacity 0.5s ease-in-out';
        popupContent.style.opacity = '1';
      }, 100);
    }
  }
}
