import {
  Component,
  ElementRef,
  inject,
  output,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormField,  } from '@angular/material/form-field';
import { MapService } from '../../services/map.service';
import {  MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-location-field',
  standalone: true,
  imports: [MatCardModule, MatFormField, FormsModule, MatInputModule],
  template: `
    <mat-form-field appearance="outline">
      <mat-label for="location">location</mat-label>
      <input
        readonly
        #locationInput
        matInput
        required
        [ngModel]="markerAddress()"
        #location="ngModel"
        name="location"
        (click)="toggleLocationSelect()"
      />
      @if( location.invalid && (location.dirty || location.touched)){
      <mat-error>Invalid address</mat-error>}
    </mat-form-field>
  `,
  styles: `
       mat-form-field{width:100%}
       `,
})
export class LocationFieldComponent {
  @ViewChild('locationInput')
  location!: ElementRef;
  locationSelect = output();
  mapService: MapService = inject(MapService);
  markerAddress = this.mapService.markerAddress;

  toggleLocationSelect() {
    this.locationSelect.emit();
  }
}
