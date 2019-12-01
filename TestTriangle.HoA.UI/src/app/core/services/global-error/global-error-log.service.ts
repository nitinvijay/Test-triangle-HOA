import { Injectable } from '@angular/core';
import { GlobalToasterService } from '../../components/global-toaster/global-toaster.service';
import { GlobalToasterType } from '../../components/global-toaster/global-toaster.model';

/**
 * Global error log service
 */
@Injectable({
  providedIn: 'root'
})
export class GlobalErrorLogService {

  /**
   * Constructor
   */
  constructor(private toastService: GlobalToasterService) { }

  /**
   * Method to log error
   * @param errorMsg error message
   */
  logError(errorMsg: string) {
    this.toastService.displayToastMessage(errorMsg, GlobalToasterType.danger);
  }

  /**
   * Method to log server errors
   * @param errors server error
   */
  logServerErrors(errors: string[]) {
    this.toastService.displayToastMessage(errors.join(';'), GlobalToasterType.danger);
  }
}
