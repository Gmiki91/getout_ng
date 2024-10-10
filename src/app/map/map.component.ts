import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MapService } from '../services/map.service';
import { EventsService } from '../services/events.service';
import * as L from 'leaflet';
import { Feature, Geometry } from 'geojson';
import { Subject, takeUntil } from 'rxjs';
import Geocoder from 'leaflet-control-geocoder';
import { LatLng } from '../models/event.model';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, OnDestroy {
  private mapService = inject(MapService);
  private eventService = inject(EventsService);
  unsubscribe$ = new Subject<void>();
  popup = L.popup();
  viewbox = '' 

  //Get current location 
  ngOnInit(): void {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const param = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        // set bounds for the autofill search
        this.viewbox = `${position.coords.longitude - 0.05},${position.coords.latitude + 0.05},${position.coords.longitude+ 0.05},${position.coords.latitude - 0.05}`
        this.eventService.setCurrentPosition(param);
        // update location field in create event form
        this.mapService.convertLatLngToAddress(param);
        this.initMap(position.coords);
      },
      (err) => {
        alert(`ERROR(${err.code}): ${err.message}`);
        this.initMap();
      }
    );
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  initMap(coords?: GeolocationCoordinates): void {
    //Create map
    const map = L.map('map').setView([coords!.latitude, coords!.longitude], 13);
    //Add tile
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    this.addListeners(map);
    if(coords){
      this.addCurrentLocationIcon(map,coords);
    }
   

    this.mapService.setMap(map);
    this.addGeocoder(map);
    this.addMarkerLayer(map);
    this.initMarkers();
  }

  addGeocoder(map: L.Map): void {
    const geocodeControl = new Geocoder({  
      geocoder: Geocoder.nominatim(),
      geocodingQueryParams: {
        viewbox: this.viewbox,
        bounded: 1 // Limit results to the viewbox
      },
      defaultMarkGeocode: false
    }).addTo(map);
    geocodeControl.on('markgeocode',  (e:any)=> {
      this.mapService.flyTo(e.geocode.center);
      this.createEventPopUp(e.geocode.center,map);
      });
  }

  addMarkerLayer(map: L.Map): void {
    // to keep track of markers
    const mapIdObj: { [key: string]: number } = {}; 
    const featureCollection: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    };
    const markerLayer = L.geoJSON(featureCollection, {
      onEachFeature: (feature, layer) => {
        // record the ID of the feature/marker so it can be searched/deleted
        mapIdObj[feature.properties.id] = L.stamp(layer); 
        // marker hover and click events
        this.addMouseEvents(feature, layer, map);
      },
    }).addTo(map);
    this.mapService.setMarkerLayer(markerLayer); 
    this.mapService.markerIdTracker = mapIdObj;
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

  addListeners(map: L.Map) {
    // Create evemt Popup when clicking on the map
    map.on('click', (e:L.LeafletMouseEvent) => this.createEventPopUp(e.latlng,map));

    // right click
    map.on('contextmenu',  ()  => this.popup.remove());

  }

  createEventPopUp(position:LatLng,map:L.Map):void{
    this.mapService.convertLatLngToAddress(position);
    if (!this.eventService.isEventFormOpen()) {
      // dont show 'create event' popup when we are already creating event
      const popupContent = document.createElement('div');
      popupContent.innerHTML = `<p style="cursor:pointer" id="popupBtn">Create event</p>`;
      this.popup.setLatLng(position).setContent(popupContent).openOn(map);

      popupContent.addEventListener('click', () => {
        this.eventService.toggleEventForm();
        this.popup.remove();
      });
    }
  }

  addMouseEvents(
    feature: Feature<Geometry, any>,
    layer: L.Layer,
    map: L.Map
  ): void {
    const tooltip = new L.Tooltip();
    layer.on('mouseover', (e) => {
      tooltip
        .setLatLng(e.latlng)
        .setContent(feature.properties.title)
        .addTo(map);
    });
    layer.on('mouseout', () => {
      map.removeLayer(tooltip);
    });
    layer.on('click', () => {
      const id = feature.properties.id;
      this.eventService.selectEventById(id);
    });
  }

  addCurrentLocationIcon(map:L.Map,coords:GeolocationCoordinates):void{
    const greenIcon = new L.Icon({
      iconUrl:
        'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
      shadowUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
    L.marker([coords!.latitude, coords!.longitude], { icon: greenIcon })
      .addTo(map)
      .bindTooltip('Current location');
  }
}
