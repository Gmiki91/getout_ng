import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  private _showLogin = signal<boolean>(false);
  private _showRegister = signal<boolean>(false);
  private _showVisitorPage = signal<boolean>(false);
  private _showEventForm = signal<boolean>(false);
  private _showEventDetails = signal<boolean>(false);
  private _showUserSettings = signal<boolean>(false);
  private _isEventUpdating = signal<boolean>(false);
  private _areEventsLoaded = signal<boolean>(false);
  showLogin = this._showLogin.asReadonly();
  showRegister = this._showRegister.asReadonly();
  showVisitorPage = this._showVisitorPage.asReadonly();
  showEventForm = this._showEventForm.asReadonly();
  showEventDetails = this._showEventDetails.asReadonly();
  showUserSettings = this._showUserSettings.asReadonly();
  isEventUpdating = this._isEventUpdating.asReadonly();
  areEventsLoaded = this._areEventsLoaded.asReadonly();

  // Filters
  private _hideFull = signal<boolean>(false);
  private _maxDistance = signal<number>(10);
  private _sortType = signal<'Time' | 'Distance'>('Time');
  private _sortDirection = signal<'asc' | 'desc'>('asc');
  hidefull = this._hideFull.asReadonly();
  maxDistance = this._maxDistance.asReadonly();
  sortType = this._sortType.asReadonly();
  sortDirection = this._sortDirection.asReadonly();

  eventsLoaded(option:boolean): void {
      this._areEventsLoaded.set(option);
  };

  toggleLogin() {
    if (this.showRegister()) this._showRegister.set(false);
    this._showLogin.set(!this.showLogin());
  }

  closeLogin() {
    this._showLogin.set(false);
  }

  toggleRegister() {
    if (this.showLogin()) this._showLogin.set(false);
    this._showRegister.set(!this.showRegister());
  }

  closeRegister() {
    this._showRegister.set(false);
  }

  toggleVisitorPage() {
    this._showVisitorPage.set(false);
  }

  toggleEventDetails(): void {
    this._showEventDetails.set(!this._showEventDetails());
    //close eventform if open
    if (this._showEventForm()) {
      this._showEventForm.set(false);
    }
    //close updateform if open
    if (this._isEventUpdating()) {
      this._isEventUpdating.set(false);
    }
  }

  // create new event form
  toggleEventForm(): void {
    this._showEventForm.set(!this._showEventForm());
    //close event details if open
    this._showEventDetails.set(false);
    //close updateform if open
    this._isEventUpdating.set(false);
  }

  toggleUpdateEvent(): void {
    this._isEventUpdating.set(!this._isEventUpdating());
    //close event details if open
    this._showEventDetails.set(false);
    //close eventform if open
    this._showEventForm.set(false);
  }

  toggleUserSettings(): void {
    this._showUserSettings.set(!this._showUserSettings());
  }

  closeUserSettings(): void {
    this._showUserSettings.set(false);
  }

  // Filters
  changeSortType(value:'Time'|'Distance'): void {
      this._sortType.set(value);
   }

  toggleSortDirection(): void {
    if (this._sortDirection() === 'asc') {
      this._sortDirection.set('desc');
    } else {
      this._sortDirection.set('asc');
    }
  }
  toggleFullEvents(): void {
    this._hideFull.set(!this._hideFull());
  }
  setMaxDistance(value: number): void {
    this._maxDistance.set(value);
  }
}
