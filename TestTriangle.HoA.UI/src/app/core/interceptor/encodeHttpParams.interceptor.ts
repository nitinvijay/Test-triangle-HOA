import {
  HttpInterceptor,
  HttpRequest,
  HttpEvent,
  HttpHandler,
  HttpParams,
  HttpParameterCodec
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Http Encoding Interceptor
 */
@Injectable()
export class EncodeHttpParamsInterceptor implements HttpInterceptor {
  /**
   * Method to intercept the request
   * @param req Request
   * @param next handler
   */
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const params = new HttpParams({
      encoder: new CustomEncoder(),
      fromString: req.params.toString()
    });
    return next.handle(req.clone({ params }));
  }
}

/**
 * Custom encoder class
 */
class CustomEncoder implements HttpParameterCodec {
  /**
   * Method to encode key
   * @param key key for encoding
   */
  encodeKey(key: string): string {
    return encodeURIComponent(key);
  }

  /**
   * Method to encode value
   * @param value key for encoding
   */
  encodeValue(value: string): string {
    return encodeURIComponent(value);
  }

  /**
   * Method to decode key
   * @param key key for decoding
   */
  decodeKey(key: string): string {
    return decodeURIComponent(key);
  }

  /**
   * Method to decode value
   * @param value value for decoding
   */
  decodeValue(value: string): string {
    return decodeURIComponent(value);
  }
}
