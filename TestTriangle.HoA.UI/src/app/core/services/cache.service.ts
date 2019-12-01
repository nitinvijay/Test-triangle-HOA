import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse } from '@angular/common/http';
import {
  MAX_CACHE_AGE,
  IHttpCacheEntry,
  HttpCache,
  IHttpCacheEntryValue
} from '../../shared/models/cache.model';
import { SessionStorageService } from './session-storage.service';

/**
 * Service to handle http caching
 */
@Injectable({
  providedIn: 'root'
})
export class HttpCacheService implements HttpCache {

  /**
   * Constructor
   * @param sessionService Session service
   */
  constructor(private sessionService: SessionStorageService) {}

  /**
   * To store cached response
   */
  private cachedData = new Map<string, IHttpCacheEntryValue>();

  /**
   * Method to get cache Http Response if available
   * @param request Http Request
   */
  get(request: HttpRequest<any>): HttpResponse<any> | null {
    const entry: IHttpCacheEntryValue = this.cachedData.get(
      request.urlWithParams
    );
    const value: IHttpCacheEntry = entry
      ? entry[this.sessionService.getCurrentCulture]
      : null;
    if (!entry || !value) {
      return null;
    }

    const isExpired = Date.now() - value.entryTime > MAX_CACHE_AGE;
    // return isExpired ? null : entry.response;
    return value.response;
  }

  /**
   * Method to add response in Http Caching
   * @param request Http Request
   * @param response Http Response
   */
  put(request: HttpRequest<any>, response: HttpResponse<any>): void {
    const entry: IHttpCacheEntry = {
      url: request.urlWithParams,
      response: response,
      entryTime: Date.now()
    };
    const existRecord: IHttpCacheEntryValue = this.cachedData.get(
      request.urlWithParams
    );
    const locale = this.sessionService.getCurrentCulture;
    if (existRecord) {
      existRecord[locale] = entry;
    } else {
      this.cachedData.set(request.urlWithParams, { [locale]: entry });
    }
  }

  /**
   * Method to clear cache
   */
  clearCache() {
    this.cachedData.clear();
  }

  // private deleteExpiredCache() {
  //     this.cacheMap.forEach(entry => {
  //         if ((Date.now() - entry.entryTime) > MAX_CACHE_AGE) {
  //             this.cacheMap.delete(<IHttpCacheEntryKey>{url: entry.url, locale: this.sessionService.getCurrentCulture});
  //         }
  //     });
  // }
}
