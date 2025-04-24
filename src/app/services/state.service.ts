import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  private _showSideBar = signal<boolean>(true);
  private _showFilter = signal<boolean>(false);
  private _showLogin = signal<boolean>(false);
  private _showRegister = signal<boolean>(false);
  
  showSideBar = this._showSideBar.asReadonly()
  showFilter = this._showFilter.asReadonly();
  showLogin = this._showLogin.asReadonly();
  showRegister = this._showRegister.asReadonly();
  
  toggleSideBar() {
    this._showSideBar.set(!this.showSideBar());
  }

  toggleFilter() {
    this._showFilter.set(!this.showFilter());
  }

  toggleLogin(){
    if(this.showRegister())
    this._showRegister.set(false);
    this._showLogin.set(!this.showLogin());
  }

  closeLogin(){
    this._showLogin.set(false);
  }

  toggleRegister(){
    if(this.showLogin())
    this._showLogin.set(false);
    this._showRegister.set(!this.showRegister());
  }

  closeRegister(){
    this._showRegister.set(false);
  }
  
  closeAuth() {
    if(this.showLogin())
      this._showLogin.set(false);
    if(this.showRegister())
      this._showRegister.set(false);
  }


}
