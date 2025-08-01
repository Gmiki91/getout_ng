
import { Signal, computed } from '@angular/core';
import { Event } from '../models/event.model';
import { MapService } from '../services/map.service';
import { StateService } from '../services/state.service';

const sortEvents = (
  events: Event[],
  sortType: 'Time' | 'Distance',
  direction: 'asc' | 'desc'
): Event[] => {
  return [...events].sort((a, b) => {
    let compareVal = 0;

    if (sortType === 'Time') {
      compareVal = new Date(a.time).getTime() - new Date(b.time).getTime();
    } else if (sortType === 'Distance') {
      compareVal = a.distance - b.distance;
    }

    return direction === 'asc' ? compareVal : -compareVal;
  });
};

const filterEvents = (
  events: Event[],
  options: { hideFull: boolean; maxDistance: number },
  mapService?: MapService
): Event[] => {
  return events.filter((event) => {
    const notFull =
      !options.hideFull ||
      event.max === 0 ||
      event.participants.length < event.max;
    const withinDistance = event.distance <= options.maxDistance;
    const visible = notFull && withinDistance;
    if (mapService) {
      if (visible) mapService.addMarker(event);
      else mapService.removeMarkerById(event.id);
    }
    return visible;
  });
};

export const filterAndSortEvents = (
  eventsSignal: Signal<Event[]>,
  stateService: StateService,
  mapService: MapService
): Signal<Event[]> => {
  return computed(() => {
    const events = eventsSignal();
    const sortType = stateService.sortType();
    const direction = stateService.sortDirection();
    const hideFull = stateService.hidefull();
    const maxDistance = stateService.maxDistance() * 1000;

    const filtered = filterEvents(events,{ hideFull, maxDistance },mapService);
    const sorted = sortEvents(filtered, sortType, direction);
    return sorted;
  });
};
