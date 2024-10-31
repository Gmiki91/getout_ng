import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventComponent } from './event.component';
import { MapService } from '../../services/map.service';
import { Event } from '../../models/event.model';
import { TimeTextPipe } from '../../pipes/time-text.pipe';
import { DistanceFormatPipe } from '../../pipes/distance-format.pipe';
import { By } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { createMockEvent } from '../../utils/mock.factory';

const mockEvent: Event = createMockEvent();

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
        providers: [{ provide: MapService, useValue: mockMapService }, provideHttpClient(),provideHttpClientTesting()], 
      }).compileComponents();

      fixture = TestBed.createComponent(EventComponent);
      component = fixture.componentInstance;
      fixture.componentRef.setInput('event', mockEvent);
      fixture.detectChanges();
    });

    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should retrieve uuid', () => {
      expect(component.user().id).toBe('0'); // Since no 'uuid' is set, the fallback value is '0'
    });

    it('should call mapService.flyTo with the event location on marker click', () => {
      const marker = fixture.debugElement.query(
        By.css('mat-icon.find-marker-icon')
      );
      marker.triggerEventHandler('click', new MouseEvent('click'));

      expect(mockMapService.flyTo).toHaveBeenCalledWith(mockEvent.latLng);
    });

  it('should display the correct event title', () => {
    const eventTitle = fixture.debugElement.query(
      By.css('mat-card-title')
    ).nativeElement;
    expect(eventTitle.textContent).toContain(mockEvent.title);
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
      mapService = TestBed.inject(MapService); // Use real MapService
      fixture.detectChanges();
    });


    it('should call mapService.flyTo with the event location on marker click', () => {
      const flyToSpy = jest.spyOn(mapService, 'flyTo');
      const markerIcon = fixture.debugElement.query(
        By.css('mat-icon.find-marker-icon')
      );
      markerIcon.triggerEventHandler('click',new MouseEvent('click'));
      expect(flyToSpy).toHaveBeenCalledWith(mockEvent.latLng);
    });

  });
});
