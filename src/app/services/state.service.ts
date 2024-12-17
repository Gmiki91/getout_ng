import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  private _showSideBar = signal<boolean>(true);
  private _showFilter = signal<boolean>(false);
  
  showSideBar = this._showSideBar.asReadonly()
  showFilter = this._showFilter.asReadonly();
  
  toggleSideBar() {
    this._showSideBar.set(!this.showSideBar());
  }

  toggleFilter() {
    this._showFilter.set(!this.showFilter());
  }
}
