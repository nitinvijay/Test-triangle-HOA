import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpHandler
} from '@angular/common/http';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpCacheService } from '../services/cache.service';
import { URLs } from '../config/urls';

/**
 * Http Response cache interceptor
 */
@Injectable()
export class HttpCachingInterceptor implements HttpInterceptor {
  /**
   * List of urls to cache
   */
  cacheUrls: Array<string> = [
    URLs.common.getCountries,
    URLs.common.getStatus
  ];

  /**
   * Constructor
   * @param cache Http cache service
   */
  constructor(private cache: HttpCacheService) {}

  /**
   * Method to intercept the request
   * @param req Request
   * @param next handler
   */
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRequestCachable(req)) {
      return next.handle(req);
    }
    const cachedResponse = this.cache.get(req);
    if (cachedResponse !== null) {
      return of(cachedResponse);
    }
    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          this.cache.put(req, event);
        }
      })
    );
  }

  /**
   * Method to check is request cacheable
   * @param req Request
   */
  private isRequestCachable(req: HttpRequest<any>) {
    return (
      req.method === 'GET' &&
      this.cacheUrls.findIndex(e => req.url.indexOf(e) > -1) > -1
    );
  }
}
