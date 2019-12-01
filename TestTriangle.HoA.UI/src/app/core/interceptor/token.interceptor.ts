import { throwError as observableThrowError, Observable } from 'rxjs';

import { tap } from 'rxjs/operators';
import { Injectable, Injector } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { GlobalErrorLogService } from '../services/global-error/global-error-log.service';
import { SessionService } from '../services/session.service';
import { AdalService } from 'adal-angular4';

/**
 * Token interceptor
 */
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  /**
   * Adal Service to get Token
   */
  adal: AdalService

  /**
   * Constructor
   * @param injector Injector
   */
  constructor(private injector: Injector) {
    this.adal = this.injector.get(AdalService);
    // Date.prototype.toJSON = function() {
    //   //  console.log('Date : ' + this.getTime());
    //   //  console.log(this);
    //   const date: any = new Date(
    //     this.getTime() - this.getTimezoneOffset() * 60000
    //   );
    //   const a = date.toUTCString().split(' ');
    //   const returnDate =
    //     a[3] +
    //     '-' +
    //     ((new Array(3).join('0') + (date.getMonth() + 1)).slice(-2).slice(-3) +
    //       '-' +
    //       a[1] +
    //       'T' +
    //       a[4] +
    //       '.' +
    //       (date / 1 + 'Z').slice(-4));
    //   //  console.log(returnDate);
    //   //  console.log('');
    //   return returnDate;
    // };
  }

  /**
   * Method to intercept the request
   * @param req Request
   * @param next handler
   */
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.adal.userInfo.token;
    const loggingService = this.injector.get(GlobalErrorLogService);
    const sessionService = this.injector.get(SessionService);

    // const timezone =  new Date().toTimeString();
    // const tzstr = timezone.split('(');
    // const timezoneid = tzstr[1].toString().replace(')', '');

    const timezoneOffset = new Date().getTimezoneOffset().toString();

    request = request.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`,
        'User-Time-Zone': timezoneOffset,
        'access-control-allow-origin': '*'
      },
      withCredentials: true
    });

    return next.handle(request).pipe(
      tap(
        (res: HttpEvent<any>) => {
          if (res instanceof HttpResponse) {
            if (res instanceof Object) {
              if (res.status === 200) {
                sessionService.startTimer();
              }
              if (res.body) {
                //if (res.body.success === false) {
                  //loggingService.logServerErrors(res.body.errors);
                //}
              }
            }
          }
        },
        error => {
          return observableThrowError(error);
        }
      )
    );
  }
}
