import { Component, output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';

import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-location-info',
    imports: [MatIcon, MatIconButton],
    templateUrl: './location-info.component.html',
    styleUrl: './location-info.component.scss'
})
export class LocationInfoComponent {
  close = output();

closeDialog(e:MouseEvent){
  e.stopPropagation();
  this.close.emit();
}
closeDialogNot(e:MouseEvent){
  e.stopPropagation();
}

}

