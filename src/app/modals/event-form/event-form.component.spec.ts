import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventsService } from '../../services/events.service';
import { MapService } from '../../services/map.service';
import { EventFormComponent } from './event-form.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TIMES } from '../../time';
import { of } from 'rxjs';
import { createMockEvent } from '../../utils/mock.factory';
import { By } from '@angular/platform-browser';

let fixture: ComponentFixture<EventFormComponent>;
let component: EventFormComponent;
let mockEventsService: jest.Mocked<EventsService>;
let mockMapService: jest.Mocked<MapService>;

const mockEvent = createMockEvent();
describe('Event-form', () => {
  mockMapService = {
    markerAddress: jest.fn().mockReturnValue('Becő utca 6'),
    markerPosition: jest.fn().mockReturnValue({ lat: 10, lng: 10 }),
    addMarker: jest.fn(),
  } as unknown as jest.Mocked<MapService>;
  mockEventsService = {
    addEvent: jest.fn().mockReturnValue(of(mockEvent)),
    toggleEventForm: jest.fn(),
  } as unknown as jest.Mocked<EventsService>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        EventFormComponent,
        MatInputModule,
        FormsModule,
        NoopAnimationsModule,
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: EventsService, useValue: mockEventsService },
        { provide: MapService, useValue: mockMapService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EventFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });
  it('should not submit form when invalid', () => {
    const invalidForm = {
      valid: false,
      form: { value: {} },
    } as NgForm;

    component.onSubmit(invalidForm);

    expect(mockEventsService.addEvent).not.toHaveBeenCalled();
  });
  it('should submit form when valid', () => {
    const validForm = {
      valid: true,
      form: {
        value: {
          title: 'Test Event',
          date: '2024-10-20',
          min: 5,
          max: 10,
          info: 'Some info',
        },
      },
    } as NgForm;

    component.onSubmit(validForm);

    expect(mockEventsService.addEvent).toHaveBeenCalled();
    expect(mockMapService.addMarker).toHaveBeenCalled();
  });

  it('should close event form when cancel button is clicked', () => {
    const button = fixture.debugElement.query(By.css('.cancel-btn'));
    button.triggerEventHandler('click');
    expect(mockEventsService.toggleEventForm).toHaveBeenCalled();
  });

});
