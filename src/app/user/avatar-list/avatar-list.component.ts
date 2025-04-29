import { Component,output,signal } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-avatar-list',
  standalone: true,
  imports: [],
  templateUrl: './avatar-list.component.html',
  styleUrl: './avatar-list.component.scss'
})
export class AvatarListComponent {
  url = environment.avatarUrl;
  avatars = Array.from({ length: environment.avatarListSize }, (_, i) => i + 1);
  avatarSelected = output<number>();
  selectedAvatar = signal<number | null>(null);
  
  onAvatarClick(index: number): void {
    this.avatarSelected.emit(index);
    this.selectedAvatar.set(index);
  }

  isSelected(index: number): boolean {
    return this.selectedAvatar() === index;
  }
}
