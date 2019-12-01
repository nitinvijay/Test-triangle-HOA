import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';


@Injectable({
  providedIn: 'root'
})

/**
 * Router Service
 */
export class RouterService {
  private _previousUrl: string;
  private _currentUrl: string;
  constructor(private router: Router) {
    this._currentUrl = this.router.url;
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this._previousUrl = this.currentUrl;
        this._currentUrl = event.url;
      }
    });
  }
  get previousUrl() {
    return this._previousUrl;
  }
  get currentUrl() {
    return this._currentUrl;
  }

}
