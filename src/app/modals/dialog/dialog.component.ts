import { Component, inject, output } from '@angular/core';
import { StateService } from '../../services/state.service';
import { slideDown } from '../../utils/utils';

@Component({
    selector: 'app-dialog',
    imports: [],
    templateUrl: './dialog.component.html',
    styleUrl: './dialog.component.scss',
    animations: [slideDown]
})
export class DialogComponent {
  stateService = inject(StateService);
  onClose = output();

  closeDialog(): void {
    this.onClose.emit();
  }
}
