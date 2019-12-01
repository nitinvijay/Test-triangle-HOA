import { Injectable, ErrorHandler, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { GlobalErrorLogService } from './global-error-log.service';

/**
 * Global error handler
 */
@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandler implements ErrorHandler {
  /**
   * login URL variable
   */
  loginUrl: string = '';

  /**
   * unauthorized URL
   */
  unauthorizedUrl: string = '/unauthorized';

  /**
   * Constructor
   * @param injector Injector
   */
  constructor(private injector: Injector) {}

  /**
   * Method to handle error
   * @param error error
   */
  handleError(error: Error | HttpErrorResponse): void {
    const loggingService = this.injector.get(GlobalErrorLogService);

    const router = this.injector.get(Router);

    if (error instanceof HttpErrorResponse) {
      if (!navigator.onLine) {
        loggingService.logError('The application server is offline.');
      } else if (
        error.error !== undefined &&
        error.error.indexOf !== undefined &&
        error.error.indexOf('Please login again.') === 0
      ) {
        window.location.href = this.loginUrl;
      } else if (
        error.status === 401 ||
        (error.message !== undefined &&
          error.message.indexOf !== undefined &&
          error.message.indexOf('Http failure during parsing') === 0)
      ) {
        router.navigateByUrl(this.unauthorizedUrl);
      } else {
        const errorMsg = `${error.status.toString()} with ${
          error.statusText
        } with following error ${error.message}`;
        loggingService.logError('messages.errorMessages.genericErrorMessage');
      }
    } else {
    }
  }
}
