import { Event } from "../models/event.model";
import User from "../models/user.model";
const defaultMockEvent: Event = {
    id: '1',
    title: 'Event 1',
    time: new Date().toISOString(),
    endTime: new Date().toISOString(),
    recurring:'never',
    latLng: { lat: 40.7128, lng: -74.006 },
    location: 'New York',
    participants: [],
    max: 100,
    distance: 150,
    min: 2,
    info: 'test info',
    ownerId: '1',
    komments: []
  };

export function createMockEvent(overrides: Partial<Event> = {}): Event {
    return {
     ...defaultMockEvent,
      ...overrides
    };
  }

export const MockUser: User={
  id: "1",
  name: "???",
  avatarUrl: "https://getoutimages.blob.core.windows.net/avatars/1.png"
}