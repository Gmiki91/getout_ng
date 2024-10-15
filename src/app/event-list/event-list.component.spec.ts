import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventListComponent } from './event-list.component';
import { Event } from '../models/event.model';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Event 1',
    time: new Date().toISOString(),
    location: 'Location 1',
    participants: [],
    max: 10,
    latLng: {
      lat: 0,
      lng: 0,
    },
    distance: 1200,
    min: 2,
    info: 'Info 1',
    ownerId: '1',
    komments: [],
  },
  {
    id: '2',
    title: 'Event 2',
    time: new Date().toISOString(),
    location: 'Location 2',
    participants: [],
    max: 20,
    latLng: {
      lat: 1,
      lng: 1,
    },
    distance: 1500,
    min: 5,
    info: 'Info 2',
    ownerId: '2',
    komments: [],
  },
];

describe('EventListComponent with Jest', () => {
  let fixture: ComponentFixture<EventListComponent>;
  let component: EventListComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventListComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(EventListComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('events', mockEvents); // Pass mock events as input
    fixture.detectChanges(); // Trigger initial data binding
  });

  // Test Input Binding
  it('should display the list of events passed as @Input', () => {
    // Query DOM for event titles
    const eventElements: DebugElement[] = fixture.debugElement.queryAll(
      By.css('app-event')
    );
    expect(eventElements.length).toBe(2); // Expect two events to be rendered

    // Verify that event titles are displayed
    const firstEventTitle = eventElements[0].nativeElement.textContent;
    const secondEventTitle = eventElements[1].nativeElement.textContent;
    expect(firstEventTitle).toContain('Event 1');
    expect(secondEventTitle).toContain('Event 2');
  });

  // Test Output Event Emission
  it('should emit the selected event when clicked', () => {
    // Spy on the output event emitter
    jest.spyOn(component.openDetails, 'emit');

    // Simulate click on the first event
    const firstEvent = fixture.debugElement.query(By.css('app-event'));
    firstEvent.triggerEventHandler('click', null); // Simulate click event

    // Check that the output event was emitted with the correct event
    expect(component.openDetails.emit).toHaveBeenCalledWith(mockEvents[0]);
  });
});
