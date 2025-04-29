import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  private _showSideBar = signal<boolean>(true);
  private _showFilter = signal<boolean>(false);
  private _showLogin = signal<boolean>(false);
  private _showRegister = signal<boolean>(false);
  private _showVisitorPage = signal<boolean>(false);
  private _showEventForm = signal<boolean>(false);
  private _showEventDetails = signal<boolean>(false);
  private _showUserSettings = signal<boolean>(false);
  private _isEventUpdating = signal<boolean>(false);
  showSideBar = this._showSideBar.asReadonly();
  showFilter = this._showFilter.asReadonly();
  showLogin = this._showLogin.asReadonly();
  showRegister = this._showRegister.asReadonly();
  showVisitorPage = this._showVisitorPage.asReadonly();
  showEventForm = this._showEventForm.asReadonly();
  showEventDetails = this._showEventDetails.asReadonly();
  showUserSettings = this._showUserSettings.asReadonly();
  isEventUpdating = this._isEventUpdating.asReadonly();
  toggleSideBar() {
    this._showSideBar.set(!this.showSideBar());
  }

  toggleFilter() {
    this._showFilter.set(!this.showFilter());
  }

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
}
