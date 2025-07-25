import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { StateService } from '../services/state.service';
import {  MatIconButton } from '@angular/material/button';
@Component({
  selector: 'app-floating-action-btn',
  imports: [MatIcon, MatTooltip, MatIconButton],
  template: `<button
    matTooltip="Create new event"
    matTooltipShowDelay="1000"
    class="fab"
    mat-icon-button
    (click)="onToggleEventForm()"
  >
    <mat-icon>add_circle</mat-icon>
  </button>`,
  styleUrl: './floating-action-btn.component.scss',
})
export class FloatingActionBtnComponent {
  stateService = inject(StateService);
  onToggleEventForm(): void {
    this.stateService.toggleEventForm();
  }
}
