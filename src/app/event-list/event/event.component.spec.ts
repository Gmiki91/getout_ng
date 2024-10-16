import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventComponent } from './event.component';
import { MapService } from '../../services/map.service';
import { Event } from '../../models/event.model';
import { TimeTextPipe } from '../../pipes/time-text.pipe';
import { DistanceFormatPipe } from '../../pipes/distance-format.pipe';
import { By } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

const mockEvent: Event = {
  id: '1',
  title: 'Test Event',
  time: new Date().toISOString(),
  latLng: { lat: 40.7128, lng: -74.006 },
  location: 'New York',
  participants: [],
  max: 100,
  distance: 150,
  min: 2,
  info: 'test info',
  ownerId: '1',
  komments: [],
};

describe('EventComponent', () => {
  let component: EventComponent;
  let fixture: ComponentFixture<EventComponent>;
  let mapService: MapService;
  let mockMapService: jest.Mocked<MapService>;

  describe('Unit tests', () => {
    beforeEach(async () => {
      mockMapService = {
        flyTo: jest.fn(), 
      } as unknown as jest.Mocked<MapService>;
      await TestBed.configureTestingModule({
        imports: [EventComponent, TimeTextPipe, DistanceFormatPipe], 
        providers: [{ provide: MapService, useValue: mockMapService }], 
      }).compileComponents();

      fixture = TestBed.createComponent(EventComponent);
      component = fixture.componentInstance;
      fixture.componentRef.setInput('event', mockEvent);
      fixture.detectChanges();
    });

    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should retrieve uuid from localStorage', () => {
      expect(component.uuid).toBe('0'); // Since no 'uuid' is set, the fallback value is '0'
    });

    it('should call mapService.flyTo with the event location on marker click', () => {
      const marker = fixture.debugElement.query(
        By.css('mat-icon.find-marker-icon')
      );
      marker.triggerEventHandler('click', new MouseEvent('click'));

      expect(mockMapService.flyTo).toHaveBeenCalledWith(mockEvent.latLng);
    });

    it('should bind event input and display event title', () => {
      const eventTitle = fixture.debugElement.query(
        By.css('mat-card-title')
      ).nativeElement;
      expect(eventTitle.textContent).toContain('Test Event');
    });
  });

  describe('Integration Tests', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [EventComponent, TimeTextPipe, DistanceFormatPipe],
        providers: [
          MapService, // Use the real MapService for integration tests
          provideHttpClient(),
          provideHttpClientTesting(),
        ], 
      }).compileComponents();

      fixture = TestBed.createComponent(EventComponent);
      component = fixture.componentInstance;
      fixture.componentRef.setInput('event', mockEvent);
      fixture.detectChanges();

      mapService = TestBed.inject(MapService); // Use real MapService
    });

    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should call mapService.flyTo with the event location on marker click', () => {
      const flyToSpy = jest.spyOn(mapService, 'flyTo');
      const markerIcon = fixture.debugElement.query(
        By.css('mat-icon.find-marker-icon')
      );
      markerIcon.triggerEventHandler('click', new MouseEvent('click'));

      expect(flyToSpy).toHaveBeenCalledWith(mockEvent.latLng);
    });

    it('should display the correct event title', () => {
      const eventTitle = fixture.debugElement.query(
        By.css('mat-card-title')
      ).nativeElement;
      expect(eventTitle.textContent).toContain(mockEvent.title);
    });

    it('should correctly format the time using the TimeTextPipe for future event', () => {
      mockEvent.time = new Date(Date.now() + 1000 * 60 * 30).toISOString();
      fixture.componentRef.setInput('event', mockEvent);
      fixture.detectChanges();
      const timeTextElement = fixture.debugElement.query(
        By.css('.event-info .info-item')
      ).nativeElement;
      expect(timeTextElement.textContent).toContain('minutes left'); // Check pipe formatting for time which was set 30 minutes in the future;
    });
    it('should correctly format the time using the TimeTextPipe for past event', () => {
      mockEvent.time = new Date(Date.now() - 1000 * 60 * 30).toISOString();
      fixture.componentRef.setInput('event', mockEvent);
      fixture.detectChanges();
      const timeTextElement = fixture.debugElement.query(
        By.css('.event-info .info-item')
      ).nativeElement;
      expect(timeTextElement.textContent).toContain('Started at'); // Check pipe formatting for time which was set 30 minutes in the past;
    });
  });
});
