import { Component, inject } from '@angular/core';
import { StateService } from '../../services/state.service';
import { slideDown } from '../../utils/utils';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
  animations:[slideDown]
})
export class DialogComponent {
  stateService = inject(StateService);

  closeDialog(): void {
    this.stateService.closeAuth()
  }
}
