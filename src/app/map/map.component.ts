import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MapService } from '../services/map.service';
import { EventsService } from '../services/events.service';
import mapboxgl, { GeolocateControl, LngLat, Map, MapMouseEvent } from 'mapbox-gl';
import { Subject, takeUntil } from 'rxjs';
import { environment } from '../../environments/environment';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-map',
  standalone: true,
  imports: [MatIconModule,MatButtonModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, OnDestroy {
  private mapService = inject(MapService);
  private eventService = inject(EventsService);
  unsubscribe$ = new Subject<void>();
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
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  initMap(coords?: GeolocationCoordinates): void {
    const map = new mapboxgl.Map({
      accessToken: environment.mapbox.accessToken,
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
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

  initGeocoder(map:Map): MapboxGeocoder {
    return new MapboxGeocoder({
      accessToken: environment.mapbox.accessToken,
      collapsed:true,
      marker:false,
      mapboxgl: mapboxgl as any,
    }).on('result', (event) => {
      const location = event.result;
      const latLng = {lng: location.geometry.coordinates[0],lat: location.geometry.coordinates[1]} as LngLat;
      this.createEventPopup(map,latLng);
      this.mapService.addTemporaryMarker(latLng);
      this.mapService.setSearchResult(location.place_name,latLng);
    });
  }

  initMarkers(): void {
    this.eventService
      .getEvents()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((events) => {
        const allEvents = events.joinedEvents.concat(events.otherEvents);
        allEvents.forEach((event) => {
          this.mapService.addMarker(event);
        });
      });
  }

  onToggleEventForm():void{
      this.eventService.toggleEventForm()
  }
  addListeners(map: Map) {
    let markerClicked = false;
    let popup: mapboxgl.Popup;
    map.on('click', 'markers', (e: MapMouseEvent) => {
      const id: string = e.features![0].properties!['id'];
      markerClicked = true;
      if(id){
        this.eventService.selectEventById(id);
      }else{
        //temporary marker selected, remove previous marker if any
        this.mapService.removeTemporaryMarker();
      }
        setTimeout(() => {
          markerClicked = false;
        }, 1);
    });

    map.on('click', (e) => {
      setTimeout(() => {
        //timeout so markerClicked flag can set if the other click event has been called
        if (!markerClicked) {
          this.mapService.addTemporaryMarker(e.lngLat);
          // if true, there was no event selected -> the mouse is not on a marker
          this.mapService.convertLatLngToAddress(e.lngLat);
         this.createEventPopup(map,e.lngLat);
        }
      }, 0);
    });

    // change cursor to pointer when hovering over a marker
    map.on('mouseenter', 'markers', (e) => {
      map.getCanvas().style.cursor = 'pointer';
      const title = e.features![0].properties!['title'];
      let text = title;
      let offset = 10;
      if (!title) {
        text = this.mapService.markerAddress();
        offset = 60;
      }
      let coordinates = (e.features![0].geometry as GeoJSON.Point).coordinates;
      popup = new mapboxgl.Popup({ closeButton: false, className: 'popup' })
        .setLngLat({ lng: coordinates[0], lat: coordinates[1] })
        .setOffset(offset)
        .setText(text)
        .addTo(map);
    });

    map.on('mouseleave', 'markers', () => {
      popup.remove();
      map.getCanvas().style.cursor = '';
    });

    //right click
    map.on('contextmenu', (e) => {
      document.getElementsByClassName('popup_w_btn')[0]?.remove();
      this.mapService.removeTemporaryMarker();
    });

    map.on('load', () => {
      this.addGeoJsonSource(map);
      this.addClusterLayer(map);
      this.addClusterCountLayer(map); // Add a label for clusters showing the number of points in the cluster
      this.addPointLayer(map); // Add layer for individual points
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
      clusterMaxZoom: 14, // Max zoom level to cluster points
    });
    const source = map.getSource('event-markers') as mapboxgl.GeoJSONSource;
    this.mapService.setGeoJSONSource(source); // Set the GeoJSON source in MapService
  }

  addPointLayer(map: Map) {
    map.addLayer({
      id: 'markers',
      type: 'circle',
      source: 'event-markers',
      filter: ['!', ['has', 'point_count']],
      paint: {
        // Dynamic color based on a feature property or gradient
        'circle-color': [
          'interpolate',
          ['linear'],
          ['get', 'eventType'],
          1,
          'red', // Example: Event type 1 = red
          2,
          'orange', 
          3,
          '#3357ff', 
        ],
        // Circle size dynamically based on zoom level
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          2.5,
          2.5,
          5,
          6, 
          7.5,
          10, 
        ],
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff', 
        'circle-opacity': 0.8,
      },
    });
  }

  addClusterLayer(map: Map): void {
    map.addLayer({
      id: 'clusters',
      type: 'circle',
      source: 'event-markers',
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': [
          'step',
          ['get', 'point_count'],
          'red',
          100,
          '#f1f075',
          750,
          '#f28cb1',
        ],
        'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40],
      },
    });
  }

  addClusterCountLayer(map: Map): void {
    map.addLayer({
      id: 'cluster-count',
      type: 'symbol',
      source: 'event-markers',
      filter: ['has', 'point_count'],
      layout: {
        'text-field': '{point_count_abbreviated}',
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 12,
      },
    });
  }

  createEventPopup(map:Map, lngLat:LngLat){
    if (!this.eventService.isEventFormOpen()) {
      //dont show 'create event' popup when we are already creating event

      //remove previous popup
      document.getElementsByClassName('popup_w_btn')[0]?.remove();
     let popup = new mapboxgl.Popup({
        closeButton: false,
        className: 'popup_w_btn',
      })
        .setLngLat(lngLat)
        .setOffset(10)
        .setHTML(`<button style="background-color: rgb(48, 204, 212,0.8); font-weight: bold; border-radius: 8px;  border-width: thin; cursor:pointer" id='popupBtn'">Create event</button>`)
        .addTo(map);
      document
        .getElementById('popupBtn')!
        .addEventListener('click', () => {
          this.eventService.toggleEventForm();
          document.getElementsByClassName('popup_w_btn')[0].remove();
        });
    }
  }
}
