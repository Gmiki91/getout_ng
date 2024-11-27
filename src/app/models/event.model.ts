import { Komment } from './komment.model';
import User from './user.model';
export type Recurrence = 'never' | 'daily' | 'weekly' | 'monthly';
export type LatLng = {
  lat: number;
  lng: number;
};
export type Event = {
  id: string;
  title: string;
  location: string;
  latLng: LatLng;
  distance: number;
  time: string;
  endTime: string;
  participants: User[];
  min: number;
  max: number;
  info: string;
  ownerId: string;
  komments: Komment[];
  recurring: Recurrence
};

export type NewEventData = {
  title: string;
  location: string;
  latLng: { lat: number; lng: number };
  time: string;
  endTime: string;
  min: number;
  max?: number;
  info?: string;
  ownerId?: string;
  recurring: Recurrence
};
