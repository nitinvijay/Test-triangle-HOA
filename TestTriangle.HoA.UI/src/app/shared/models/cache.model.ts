import { HttpRequest, HttpResponse } from '@angular/common/http';

/**
 * Abstract Class for Http Response Caching
 */
export abstract class HttpCache {
    abstract get(req: HttpRequest<any>): HttpResponse<any> | null;
    abstract put(req: HttpRequest<any>, res: HttpResponse<any>): void;
}

/**
 * Interface to cache HTTP response
 */
export interface IHttpCacheEntry {
    url: string;
    response: HttpResponse<any>;
    entryTime: number;
}

/**
 * Cache maximum age
 */
export const MAX_CACHE_AGE = 20000; // in milliseconds

/**
 * Interface to store locale and Http Response
 */
export interface IHttpCacheEntryValue {
  [key: string]: IHttpCacheEntry;
}
