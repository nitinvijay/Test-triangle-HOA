import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  TemplateRef
} from '@angular/core';
import { GlobalToasterType, GlobalToaster } from './global-toaster.model';
import { GlobalToasterService } from './global-toaster.service';
import { Router } from '@angular/router';
import { ButtonType } from '../../../shared/models/common.model';
import { GlobalConfirmationService } from '../global-confirmation/global-confirmation.service';
import { IResolveEmit } from '../global-confirmation/global-confirmation.model';

/**
 * Global Toaster Component
 */
@Component({
  selector: 'app-global-toaster',
  templateUrl: './global-toaster.component.html',
  styleUrls: ['./global-toaster.component.scss']
})
export class GlobalToasterComponent implements OnInit, OnDestroy {

  /**
   * Transaction popup
   */
  transactionPopup: TemplateRef<any>; // @ViewChild('transactionPopup', { static: false })
  /**
   * return file code
   */
  returnFileCode: string;

  /***
   * show toast message flag
   */
  showToastMessage = false;

  /**
   * Toaster message
   */
  toasterMessage: string;


  /**
   * Toaster type
   */
  toastContext = GlobalToasterType.info;

  /**
   * Add Subscriber
   */
  private addToastSubScriber: any;

  /**
   * remove subscriber
   */
  private removeFromToastSubScriber: any;

  /**
   * Constructor
   * @param toastService Global toaster service
   * @param confirmationService Global confirmation service
   * @param router Router
   */
  constructor(
    public toastService: GlobalToasterService,
    private confirmationService: GlobalConfirmationService,
    private router: Router
  ) {}

/**
 * Register subscribe for getting toaster information
 */
  private registerSubScribers() {
    this.addToastSubScriber = this.toastService.addToToast.subscribe(
      (toast: GlobalToaster) => {
        this.toasterMessage = toast.message;
        this.toastContext = toast.messageType;
        this.showToastMessage = true;
        this.transactionPopup = toast.Template;
        this.hideToastMessage(toast.msgDisplayTimeout);
      }
    );
  }
  /**
   * Method to emit close event of toaster
   */
  logCloseEvent() {
    this.toastService.emitCloseEvent(this.toastContext);
  }

  /**
   * Method to hide toast message
   * @param msgDisplayTimeout Message display timeout
   */
  hideToastMessage(msgDisplayTimeout: number) {
    if (msgDisplayTimeout > 0) {
      setTimeout(() => {
        this.showToastMessage = false;
      }, msgDisplayTimeout);
    }
  }

  /**
   * ngOnInit
   */
  ngOnInit() {
    this.registerSubScribers();
  }

  /**
   * ngOnDestroy
   */
  ngOnDestroy(): void {
    if (this.addToastSubScriber) {
      this.addToastSubScriber.unsubscribe();
    }
  }
}
