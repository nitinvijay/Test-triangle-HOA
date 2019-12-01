import { share } from 'rxjs/operators';
import { Injectable, TemplateRef } from '@angular/core';
import { Observable, Observer, Subject } from 'rxjs';
import { GlobalToaster, GlobalToasterType } from './global-toaster.model';
import { Config } from '../../config/app-config';

/**
 * Global toaster service
 */
@Injectable({
  providedIn: 'root'
})
export class GlobalToasterService {
  /**
   * Add to global toaster notifier
   */
  public addToToast: Observable<GlobalToaster>;

  /**
   * Private add to global toaster notifier
   */
  private addtoToast: Observer<GlobalToaster>;

  /**
   * Global toaster close event emitter
   */
  public closeEvent: Subject<string> = new Subject<string>();

  /**
   * Constructor
   */
  constructor() {
    this.addToToast = new Observable<GlobalToaster>(observer => {
      this.addtoToast = observer;
    }).pipe(share());
  }

  /**
   * Method to display toast message
   * @param msg Message
   * @param msgType Message type
   * @param msgDisplayTimeout Message display timeout
   */
  displayToastMessage(
    msg: string,
    msgType: GlobalToasterType = GlobalToasterType.info,
    msgDisplayTimeout: number = Config.toastMsgDisplayTimeOut
  ) {
    if (
      msgType === GlobalToasterType.danger &&
      msgDisplayTimeout === Config.toastMsgDisplayTimeOut
    ) {
      msgDisplayTimeout = Config.toastMaxTimeOut;
    }
    this.displayMessage(msg, msgType, msgDisplayTimeout);
  }


  /**
   * Global toaster type close emitter
   * @param toasterType global toaster type
   */
  emitCloseEvent(toasterType: GlobalToasterType) {
    this.closeEvent.next(toasterType);
  }

  /**
   * Method to display global toaster message
   * @param msg message
   * @param msgType message type
   * @param msgDisplayTimeout message display timeout
   * @param navigationLink message navigation link
   * @param navigationLinkText message navigation link text
   * @param navigationData message navigation data
   * @param additionalData message additional data
   * @param template message template
   */
  private displayMessage(
    msg: string,
    msgType: GlobalToasterType,
    msgDisplayTimeout: number,
    navigationLink: string = '',
    navigationLinkText: string = '',
    navigationData: any = {},
    additionalData: any = {},
    template: any = {},
  ) {
    const toast = new GlobalToaster();
    toast.message = msg;
    toast.messageType = msgType;
    toast.navigationLink = navigationLink;
    toast.navigationLinkText = navigationLinkText;
    toast.msgDisplayTimeout = msgDisplayTimeout;
    toast.navigationData = navigationData;
    toast.additionalData = additionalData;
    toast.Template = template;
    this.addtoToast.next(toast);
  }
}
