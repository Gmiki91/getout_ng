import { trigger, transition, style, animate, query, animateChild } from '@angular/animations';
/**
 *  Spherical Law of Cosines uses trigonometric identities and can be used to calculate distance
 * @param lat1 latitude of location#1
 * @param lng1 longitude of location#1
 * @param lat2 latitude of location#2
 * @param lng2 longitude of location#2
 * @return distance in meters
 */
export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371;
  const p1 = (lat1 * Math.PI) / 180;
  const p2 = (lat2 * Math.PI) / 180;
  const deltaP = p2 - p1;
  const deltaLon = lng2 - lng1;
  const deltaLambda = (deltaLon * Math.PI) / 180;
  const a =
    Math.sin(deltaP / 2) * Math.sin(deltaP / 2) +
    Math.cos(p1) *
      Math.cos(p2) *
      Math.sin(deltaLambda / 2) *
      Math.sin(deltaLambda / 2);
  const d = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * R;
  return Math.round(d * 100) * 10;
};

export const slideDown = trigger('slideDown', [
  transition(':enter', [
    style({ transform: 'translateY(-100%)'}), // Initial state
    animate('0.5s ease-out', style({ transform: 'translateY(0)'})), // Final state
  ]),
  transition(':leave', [
    style({ transform: 'translateY(0)'}), // Initial state
    animate(
      '0.25s ease-in',
      style({ transform: 'translateY(-100%)'})
    ), 
  ]),
]);

export const dumbParent=trigger('dumbParent', [
    transition('* => void', [
      query('@*', [animateChild()], {optional: true})
    ]),
  ]);
