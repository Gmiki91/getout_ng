import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventsService } from '../services/events.service';
import { MapService } from '../services/map.service';
import { EventSidebarComponent } from './event-sidebar.component';
import { Event } from '../models/event.model';
import { EventListComponent } from '../event-list/event-list.component';
import { By } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { createMockEvent } from '../utils/mock.factory';
describe('Event-sidebar', () => {
  let component: EventSidebarComponent;
  let fixture: ComponentFixture<EventSidebarComponent>;
  let mapService: MapService;
  let eventsService: EventsService;
  let mockMapService: jest.Mocked<MapService>;
  let mockEventsService: jest.Mocked<EventsService>;

  const mockEvent:Event = createMockEvent();

  describe('Unit tests', () => {
    beforeEach(async () => {
      mockMapService = {
        flyTo: jest.fn(),
        highlightMarker:jest.fn()
      } as unknown as jest.Mocked<MapService>;
      mockEventsService = {
        toggleEventForm: jest.fn(),
        selectEvent: jest.fn(),
        yourEvents: jest.fn().mockReturnValue([]),
        otherEvents: jest.fn(),
      } as unknown as jest.Mocked<EventsService>;

      await TestBed.configureTestingModule({
        imports: [EventSidebarComponent, EventListComponent],
        providers: [
          { provide: MapService, useValue: mockMapService },
          { provide: EventsService, useValue: mockEventsService },
          provideHttpClient(),
          provideHttpClientTesting(),
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(EventSidebarComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should render component', () => {
      expect(component).toBeTruthy();
    });

    it('should call mapService.flyTo when OpenDetails is emitted', () => {
      const eventComp = fixture.debugElement.query(By.css('app-event-list'));
      eventComp.triggerEventHandler('openDetails', mockEvent);

      expect(mockMapService.flyTo).toHaveBeenCalledWith(mockEvent.latLng);
    });

    it('should call eventsService.selectEvent when OpenDetails is emitted', () => {
      const eventComp = fixture.debugElement.query(By.css('app-event-list'));
      eventComp.triggerEventHandler('openDetails', mockEvent);

      expect(mockEventsService.selectEvent).toHaveBeenCalledWith(mockEvent);
    });

    it('should call eventsService.toggleEventForm when the add new event button is clicked', () => {
      const button = fixture.debugElement.query(
        By.css('button.new-event-btn')
      );
      button.triggerEventHandler('click');

      expect(mockEventsService.toggleEventForm).toHaveBeenCalled();
    });
  });

  describe('Integration tests',()=>{
    beforeEach(async() => {
      await TestBed.configureTestingModule({
        imports: [EventSidebarComponent, EventListComponent],
        providers: [
          MapService, 
          EventsService,
          provideHttpClient(),
          provideHttpClientTesting(),
        ], 
      }).compileComponents();

      fixture=TestBed.createComponent(EventSidebarComponent);
      component = fixture.componentInstance;
      mapService = TestBed.inject(MapService);
      eventsService = TestBed.inject(EventsService);
      fixture.detectChanges();
    });

    it('should call mapService.flyTo and eventsService.selectEvent when OpenDetails is emitted', () => {
      const flyToSpy = jest.spyOn(mapService,'flyTo');
      const selectEventSpy = jest.spyOn(eventsService,'selectEvent');
      const eventComp = fixture.debugElement.query(By.css('app-event-list'));
      eventComp.triggerEventHandler('openDetails', mockEvent);

      expect(flyToSpy).toHaveBeenCalledWith(mockEvent.latLng);
      expect(selectEventSpy).toHaveBeenCalledWith(mockEvent);
    });

    it('should call eventsService.toggleEventForm when the add new event button is clicked', () => {
      const toggleEventFormSpy = jest.spyOn(eventsService,'toggleEventForm');
      const eventComp = fixture.debugElement.query(
        By.css('button.new-event-btn')
      );
      eventComp.triggerEventHandler('click');

      expect(toggleEventFormSpy).toHaveBeenCalled();
    });
  });
});
