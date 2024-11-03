import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilterComponent } from './filter.component';
import { By } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { EventsService } from '../services/events.service';
describe('FilterComponent', () => {
  let component: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;
  let eventsService: EventsService;
  let mockEventsService: jest.Mocked<EventsService>;

  describe('unit tests', () => {
    beforeEach(async () => {
      mockEventsService = {
        sortByDistance: jest.fn(),
        sortByTime: jest.fn(),
        hideFullEvents: jest.fn(),
      } as unknown as jest.Mocked<EventsService>;

      await TestBed.configureTestingModule({
        imports: [FilterComponent],
        providers: [
          { provide: EventsService, useValue: mockEventsService },
          provideHttpClient(),
          provideHttpClientTesting(),
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(FilterComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
    describe('sortByDistance', () => {
      // TODO: find out how to test mat-menu-module
      xit('should call sortByDistance when button is clicked', () => {
        const sortByButton = fixture.debugElement.query(By.css('button.sort-by-btn'));
        sortByButton.triggerEventHandler('click', null);
        fixture.detectChanges();

        const button = fixture.debugElement.query(
          By.css('button.distance-btn')
        );
        button.triggerEventHandler('click');
        expect(mockEventsService.sortByDistance).toHaveBeenCalledWith(true);
      });

      it('should toggle ascendingDistance', () => {
        component.ascendingDistance = true;
        component.sortByDistance();

        expect(component.ascendingDistance).toBe(false);
      });

      it('should toggle ascendingDistance correctly when called multiple times', () => {
        component.ascendingDistance = true;

        component.sortByDistance();
        expect(component.ascendingDistance).toBe(false);

        component.sortByDistance();
        expect(component.ascendingDistance).toBe(true);
      });
    });

    describe('sortByTime', () => {
        // TODO: find out how to test mat-menu-module
      xit('should call sortByTime when button is clicked', () => {
        const sortByButton = fixture.debugElement.query(By.css('button.sort-by-btn'));
        sortByButton.triggerEventHandler('click', null);
        fixture.detectChanges();
        
        const button = fixture.debugElement.query(By.css('button.time-btn'));
        button.triggerEventHandler('click');
        expect(mockEventsService.sortByTime).toHaveBeenCalledWith(false);
      });

      it('should toggle ascendingTime', () => {
        component.ascendingTime = true;
        component.sortByTime();

        expect(component.ascendingTime).toBe(false);
      });

      it('should toggle ascendingTime correctly when called multiple times', () => {
        component.ascendingTime = true;

        component.sortByTime();
        expect(component.ascendingTime).toBe(false);

        component.sortByTime();
        expect(component.ascendingTime).toBe(true);
      });
    });

    describe('toggleFullEvents', () => {
      it('should call hideFullEvent when button is clicked', () => {
        const toggle = fixture.debugElement.query(By.css('mat-slide-toggle'));
        toggle.triggerEventHandler('change');
        expect(mockEventsService.hideFullEvents).toHaveBeenCalled();
      });

      it('should toggle hideFullEvents property', () => {
        component.toggleFullEvents();
        expect(component.hideFullEvents()).toBe(true);
        component.toggleFullEvents();
        expect(component.hideFullEvents()).toBe(false);
      });
    });
  });
  describe('integration tests', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [FilterComponent],
        providers: [
          EventsService,
          provideHttpClient(),
          provideHttpClientTesting(),
        ],
      }).compileComponents();

      eventsService = TestBed.inject(EventsService);
      fixture = TestBed.createComponent(FilterComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should call sortByDistance', () => {
      const sortByDistanceSpy = jest.spyOn(eventsService, 'sortByDistance');
      component.sortByDistance();
      expect(sortByDistanceSpy).toHaveBeenCalledWith(true);
    });

    it('should call sortByTime', () => {
      const sortByTimeSpy = jest.spyOn(eventsService, 'sortByTime');
      component.sortByTime();
      expect(sortByTimeSpy).toHaveBeenCalledWith(false); //time is the default sort
    });

    it('should call hideFullEvents', () => {
      const hideFullEventsSpy = jest.spyOn(eventsService, 'hideFullEvents');
      component.toggleFullEvents();
      expect(hideFullEventsSpy).toHaveBeenCalled();
    });
  });
});
