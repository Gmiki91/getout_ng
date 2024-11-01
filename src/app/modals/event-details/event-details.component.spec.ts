import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventDetailsComponent } from './event-details.component';
import { EventsService } from '../../services/events.service';
import { MapService } from '../../services/map.service';
import { KommentService } from '../../services/comment.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { createMockEvent } from '../../utils/mock.factory';
import { Event } from '../../models/event.model';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('EventDetailsComponent', () => {
  let fixture: ComponentFixture<EventDetailsComponent>;
  let component: EventDetailsComponent;
  let mapService: MapService;
  let eventsService: EventsService;
  let mockKommentService: jest.Mocked<KommentService>;
  let mockEventsService: jest.Mocked<EventsService>;
  let mockMapService: jest.Mocked<MapService>;

  const mockEvent: Event = createMockEvent();

  describe('Unit tests', () => {
    beforeEach(async () => {
      mockEventsService = {
        isUserJoined: jest.fn(),
        selectedEvent: jest.fn().mockReturnValue(mockEvent),
        joinEvent: jest.fn(),
        leaveEvent: jest.fn(),
        deleteEvent: jest.fn(),
        selectEvent: jest.fn(),
      } as unknown as jest.Mocked<EventsService>;
      mockKommentService = {
        comments: jest.fn(),
        getKomments: jest.fn(),
        addKomment: jest.fn(),
      } as unknown as jest.Mocked<KommentService>;
      mockMapService = {
        removeMarker: jest.fn(),
        unhighlightMarker: jest.fn(),
      } as unknown as jest.Mocked<MapService>;

      await TestBed.configureTestingModule({
        imports: [
          EventDetailsComponent,
          MatInputModule,
          FormsModule,
          NoopAnimationsModule,
        ],
        providers: [
          { provide: EventsService, useValue: mockEventsService },
          { provide: KommentService, useValue: mockKommentService },
          { provide: MapService, useValue: mockMapService },
          provideHttpClient(),
          provideHttpClientTesting(),
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(EventDetailsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should call getKomments on init', () => {
      expect(mockKommentService.getKomments).toHaveBeenCalled();
    });
    it('should call joinEvent on button click', () => {
      component.joined = false;

      fixture.detectChanges();
      const button = fixture.debugElement.query(By.css('.join-btn'));
      expect(button).toBeTruthy();
      button.triggerEventHandler('click');
      expect(mockEventsService.joinEvent).toHaveBeenCalledWith(
        component.event().id,
        component.event().distance
      );
    });
    it('should call leaveEvent on button click', () => {
      component.joined = true;

      fixture.detectChanges();

      const button = fixture.debugElement.query(By.css('.leave-btn'));
      expect(button).toBeTruthy();
      button.triggerEventHandler('click');
      expect(mockEventsService.leaveEvent).toHaveBeenCalledWith(
        component.event().id,
        component.event().distance
      );
    });

    it('should call deleteEvent and removemarker on button click', () => {
      component.user().id = '1'; //same as event.ownerId

      fixture.detectChanges();

      const button = fixture.debugElement.query(By.css('.delete-btn'));
      expect(button).toBeTruthy();
      button.triggerEventHandler('click');
      expect(mockEventsService.deleteEvent).toHaveBeenCalledWith(
        component.event().id,
        component.event().ownerId
      );
      expect(mockMapService.removeMarker).toHaveBeenCalledWith(
        component.event().id
      );
    });
    it('should erase selectedEvent on closeDialog', () => {
      component.closeDialog();
      expect(mockEventsService.selectEvent).toHaveBeenCalledWith({});
    });
    it('should show comment button if the comment area is in focus', () => {
      const commentArea = fixture.debugElement.query(
        By.css('.comment-area')
      ).nativeElement;
      commentArea.focus();

      fixture.detectChanges();
      const commentBtn = fixture.debugElement.query(By.css('.comment-btn'));
      expect(commentBtn).toBeTruthy();
    });
    it('should add comment on button click when there is text in the comment area', () => {
      const commentArea = fixture.debugElement.query(
        By.css('.comment-area')
      ).nativeElement;
      commentArea.focus();
      commentArea.innerHTML = 'Komment';
      fixture.detectChanges();
      const commentBtn = fixture.debugElement.query(By.css('.comment-btn'));
      commentBtn.triggerEventHandler('click', new MouseEvent('click'));
      expect(mockKommentService.addKomment).toHaveBeenCalled();
      expect(component.kommentRef.nativeElement.value).toBe('');
      expect(component.showCommentBtn).toBe(false);
    });
    it('should not add comment when there is no text in the comment area', () => {
      const commentArea = fixture.debugElement.query(
        By.css('.comment-area')
      ).nativeElement;
      commentArea.focus();
      commentArea.innerHTML = '';
      fixture.detectChanges();
      const commentBtn = fixture.debugElement.query(By.css('.comment-btn'));
      commentBtn.triggerEventHandler('click', new MouseEvent('click'));
      expect(mockKommentService.addKomment).not.toHaveBeenCalled();
    });
  });

  describe('Integration tests', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [
          EventDetailsComponent,
          MatInputModule,
          FormsModule,
          NoopAnimationsModule,
        ],
        providers: [
          EventsService,
          MapService,
          KommentService,
          provideHttpClient(),
          provideHttpClientTesting(),
        ],
      }).compileComponents();

      mapService = TestBed.inject(MapService);
      eventsService = TestBed.inject(EventsService);
      fixture = TestBed.createComponent(EventDetailsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('uses Event Service', () => {
      const joinEventSpy = jest.spyOn(eventsService, 'joinEvent');
      component.onJoin();
      expect(joinEventSpy).toHaveBeenCalled();
    });
    it('uses Komment Service', () => {
      expect(component.komments).toBeTruthy();
    });
    it('uses Map Service', () => {
      const deleteSpy = jest.spyOn(mapService, 'removeMarker');
      component.onDelete();
      expect(deleteSpy).toHaveBeenCalled();
    });
  });
});
