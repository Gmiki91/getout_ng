import {
  trigger,
  transition,
  style,
  animate,
  query,
  animateChild,
} from '@angular/animations';
export const slideDown = trigger('slideDown', [
  transition(':enter', [
    style({ transform: 'translateY(-100%)' }), // Initial state
    animate('0.3s ease-out', style({ transform: 'translateY(0)' })), // Final state
  ]),
  transition(':leave', [
    style({ transform: 'translateY(0)' }), // Initial state
    animate('0.3s ease-in', style({ transform: 'translateY(-100%)' })),
  ]),
]);

export const dumbParent = trigger('dumbParent', [
  transition('* => void', [query('@*', [animateChild()], { optional: true })]),
]);
