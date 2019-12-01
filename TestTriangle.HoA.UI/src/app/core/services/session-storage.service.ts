import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * Session storage service
 */
@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {
  /**
   * Default culture for application
   */
  defaultCulture = 'en-US';
  /**
   * Constructor
   */
  constructor() {
    const culture = this.getCurrentCulture;
    if (!culture) {
      this.setCurrentCulture = this.defaultCulture;
    }
  }

  /**
   * Current culture
   */
  currentCulture = new Subject<string>();

  /**
   * Method to get current culture
   */
  get getCurrentCulture() {
    return sessionStorage.getItem('currentCulture');
  }

  /**
   * Method to set current culture at browser
   */
  set setCurrentCulture(value) {
    sessionStorage.setItem('currentCulture', value);
    this.currentCulture.next(value);
  }

  /**
   * Method to clean session storage
   */
  clearSessionStorage() {
    sessionStorage.clear();
  }
}
