import { TestBed, ComponentFixture } from '@angular/core/testing';
import { of } from 'rxjs';
import { MapComponent } from './map.component';
import { MapService } from '../services/map.service';
import { EventsService } from '../services/events.service';
import {Map} from 'mapbox-gl';
describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;
  let mockMapService: Partial<MapService>;
  let mockEventService: Partial<EventsService>;
  let mockMap: jest.Mocked<Map>;

  beforeEach(() => {
    mockMapService = {
      setMap: jest.fn(),
      addMarker: jest.fn(),
      flyTo: jest.fn(),
      convertLatLngToAddress: jest.fn(),
      markerIdTracker: {}
    };

    mockEventService = {
      setCurrentPosition: jest.fn(),
      getEvents: jest.fn().mockReturnValue(of({ joinedEvents: [], otherEvents: [] })),
      isEventFormOpen: jest.fn().mockReturnValue(false),
      toggleEventForm: jest.fn(),
      selectEventById: jest.fn()
    }as unknown as jest.Mocked<EventsService>;

    mockMap = {
      openPopup: jest.fn(),
      remove: jest.fn(),
    } as unknown as jest.Mocked<Map>;
    
    TestBed.configureTestingModule({
      imports: [MapComponent],
      providers: [
        { provide: MapService, useValue: mockMapService },
        { provide: EventsService, useValue: mockEventService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // describe('ngOnDestroy', () => {
  //   it('should complete unsubscribe$ on destroy', () => {
  //     const unsubscribeCompleteSpy = jest.spyOn(component.unsubscribe$, 'complete');

  //     component.ngOnDestroy();

  //     expect(unsubscribeCompleteSpy).toHaveBeenCalled();
  //   });
  // });

});


