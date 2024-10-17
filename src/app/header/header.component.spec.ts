import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { UserService } from '../services/user.service';
import { EventsService } from '../services/events.service';
import { By } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let userService: UserService;
  let eventsService: EventsService;
  let mockUserService: jest.Mocked<UserService>;
  let mockEventsService: jest.Mocked<EventsService>;

  describe('Unit tests', () => {
    beforeEach(async () => {
      mockUserService = {
        user: jest.fn().mockReturnValue({ name: 'Lekvár' }),
      } as unknown as jest.Mocked<UserService>;
      mockEventsService = {
        sortByDistance: jest.fn(),
        sortByTime: jest.fn(),
        hideFullEvents: jest.fn(),
      } as unknown as jest.Mocked<EventsService>;

      await TestBed.configureTestingModule({
        imports: [HeaderComponent],
        providers: [
          { provide: UserService, useValue: mockUserService },
          { provide: EventsService, useValue: mockEventsService },
          provideHttpClient(),
          provideHttpClientTesting(),
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(HeaderComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should display the username', () => {
      const usernameElement = fixture.debugElement.query(
        By.css('.username')
      ).nativeElement;
      expect(usernameElement.textContent).toContain('Lekvár');
    });

    describe('sortByDistance', () => {
      it('should call sortByDistance when button is clicked', () => {
        const button = fixture.debugElement.query(
          By.css('button.distance-btn')
        );
        button.triggerEventHandler('click');
        expect(mockEventsService.sortByDistance).toHaveBeenCalledWith(true);
      });

      it('should toggle ascendingDistance and update distanceIcon and timeIcon', () => {
        component.ascendingDistance = true;
        component.sortByDistance();

        expect(component.ascendingDistance).toBe(false);
        expect(component.distanceIcon).toBe('expand_more');
        expect(component.timeIcon).toBe('unfold_more');
      });

      it('should toggle ascendingDistance correctly when called multiple times', () => {
        component.ascendingDistance = true;

        component.sortByDistance();
        expect(component.ascendingDistance).toBe(false);
        expect(component.distanceIcon).toBe('expand_more');

        component.sortByDistance();
        expect(component.ascendingDistance).toBe(true);
        expect(component.distanceIcon).toBe('expand_less');
      });
    });

    describe('sortByTime', () => {
      it('should call sortByTime when button is clicked', () => {
        const button = fixture.debugElement.query(By.css('button.time-btn'));
        button.triggerEventHandler('click');
        expect(mockEventsService.sortByTime).toHaveBeenCalledWith(false);
      });

      it('should toggle ascendingTime and update distanceIcon and timeIcon', () => {
        component.ascendingTime = true;
        component.sortByTime();

        expect(component.ascendingTime).toBe(false);
        expect(component.timeIcon).toBe('expand_more');
        expect(component.distanceIcon).toBe('unfold_more');
      });

      it('should toggle ascendingTime correctly when called multiple times', () => {
        component.ascendingTime = true;

        component.sortByTime();
        expect(component.ascendingTime).toBe(false);
        expect(component.timeIcon).toBe('expand_more');

        component.sortByTime();
        expect(component.ascendingTime).toBe(true);
        expect(component.timeIcon).toBe('expand_less');
      });
    });

    describe('toggleFullEvents', () => {
      it('should call hideFullEvent when button is clicked', () => {
        const button = fixture.debugElement.query(By.css('.checkbox'));
        button.triggerEventHandler('change');
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
        imports: [HeaderComponent],
        providers: [
          UserService,
          EventsService,
          provideHttpClient(),
          provideHttpClientTesting(),
        ],
      }).compileComponents();

      eventsService = TestBed.inject(EventsService);
      userService = TestBed.inject(UserService);
      fixture = TestBed.createComponent(HeaderComponent);
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
