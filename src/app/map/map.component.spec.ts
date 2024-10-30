import { TestBed, ComponentFixture } from '@angular/core/testing';
import { of } from 'rxjs';
import { MapComponent } from './map.component';
import { MapService } from '../services/map.service';
import { EventsService } from '../services/events.service';
import { computed } from '@angular/core';
describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;
  let mockMapService: Partial<MapService>;
  let mockEventService: Partial<EventsService>;
  let mockMap: jest.Mocked<L.Map>;

  const createComputedSignal = (value: boolean) => computed(() => value);
  beforeEach(() => {
    mockMapService = {
      setMap: jest.fn(),
      addMarker: jest.fn(),
      flyTo: jest.fn(),
      convertLatLngToAddress: jest.fn(),
      setMarkerLayer: jest.fn(),
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
    } as unknown as jest.Mocked<L.Map>;
    
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

  describe('ngOnDestroy', () => {
    it('should complete unsubscribe$ on destroy', () => {
      const unsubscribeCompleteSpy = jest.spyOn(component.unsubscribe$, 'complete');

      component.ngOnDestroy();

      expect(unsubscribeCompleteSpy).toHaveBeenCalled();
    });
  });

  describe('createEventPopUp', () => {
    it('should not open popup if event form is already open', () => {
      mockEventService.isEventFormOpen = createComputedSignal(true);
  
      const position = {lat:0, lng:0};
      component.createEventPopUp(position, mockMap);
  
      // Verify popup does not open if form is already open
      expect(mockMapService.convertLatLngToAddress).toHaveBeenCalledWith(position);
      expect(mockMap.openPopup).not.toHaveBeenCalled();
    });
  });
});


