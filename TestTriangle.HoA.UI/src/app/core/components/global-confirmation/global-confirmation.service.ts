import { Injectable, TemplateRef } from '@angular/core';
import { Subject } from 'rxjs';
import { IConfirmEmit, IResolveEmit } from './global-confirmation.model';

/**
 * Global Confirmation service
 */
@Injectable({
  providedIn: 'root'
})
export class GlobalConfirmationService {
  /**
   * Add to confirmaton subject
   */
  public addToConfirmation: Subject<IConfirmEmit>;

  /**
   * Constructor
   */
  constructor() {
    this.addToConfirmation = new Subject<IConfirmEmit>();
  }

  /**
   * Method to show confirmation Message
   * @param msg Message to show
   * @param title Popup title
   * @param dynamicId Dynamic Id
   * @param ok Ok button text
   * @param cancel Cancel button text
   */
  showConfirmationMsg(
    msg: string,
    title: string,
    dynamicId: string = '',
    ok: string = 'Ok',
    cancel: string = 'Cancel'
  ): Subject<IResolveEmit> {
    const resolveEmit = new Subject<IResolveEmit>();

    const objConfirmEmit: IConfirmEmit = {
      close: false,
      title: title,
      message: `${msg} - ${dynamicId}`,
      ok: ok,
      cancel: cancel,
      dynamicId: dynamicId,
      resolveConfirm: resolveEmit
    };
    this.addToConfirmation.next(objConfirmEmit);
    return resolveEmit;
  }

/**
 * Method to show confirmation message with dynamic component
 * @param title Message popup title
 * @param ok Message OK button text
 * @param cancel Message cancel button text
 * @param dynamicComponent Dynamic component
 */
  showConfirmationMsgWithDynamicComponent(
    title: string,
    ok: string = 'Ok',
    cancel: string = 'Cancel',
    dynamicComponent: any
  ): Subject<IResolveEmit>[] {
    const resolveEmit = new Subject<IResolveEmit>();
    const resolveCancel = new Subject<IResolveEmit>();
    const objConfirmEmit: IConfirmEmit = {
      close: false,
      title: title,
      message: '',
      resolveConfirm: resolveEmit,
      resolveCancel: resolveCancel,
      ok: ok,
      cancel: cancel,
      dynamicComponent: dynamicComponent
    };
    this.addToConfirmation.next(objConfirmEmit);
    return [resolveEmit, resolveCancel];
  }

/**
 * Method to show confirmation message with dynamic component
 * @param title Message popup title
 * @param ok Message OK button text
 * @param cancel Message cancel button text
 * @param dynamicComponent Dynamic component
 * @param isWideCss isWideCss flag, default is false
 */
  showMsgWithDynamicComponent(
    title: string,
    ok: string = 'Ok',
    cancel: string = 'Cancel',
    dynamicComponent: any,
    isWideCss: boolean = false
  ): Subject<IResolveEmit> {
    const resolveEmit = new Subject<IResolveEmit>();
    const objConfirmEmit: IConfirmEmit = {
      close: false,
      title: title,
      message: '',
      resolveConfirm: resolveEmit,
      resolveCancel: resolveEmit,
      ok: ok,
      cancel: cancel,
      isWideCss: isWideCss,
      dynamicComponent: dynamicComponent
    };
    this.addToConfirmation.next(objConfirmEmit);
    return resolveEmit;
  }

 /**
  * Method to show confirmation message with dynamic template
  * @param title Message popup title
  * @param template Template
  * @param ok Message OK button text
  * @param cancel Message cancel button text
  * @param isLarge isLarge flag, default is false
  */
  showConfirmationMsgWithTemplate(
    title: string,
    template: TemplateRef<any>,
    ok: string = 'Ok',
    cancel: string = 'Cancel',
    isLarge: boolean = false
  ): Subject<IResolveEmit> {
    const resolveEmit = new Subject<IResolveEmit>();
    // const resolveEmit = new Subject<IResolveEmit>();
    const objConfirmEmit: IConfirmEmit = {
      close: false,
      title: title,
      ok: ok,
      cancel: cancel,
      template: template,
      isWideCss: true,
      isLargeCss: isLarge,
      resolveConfirm: resolveEmit,
      resolveCancel: resolveEmit
    };
    this.addToConfirmation.next(objConfirmEmit);
    return resolveEmit;
  }

  /**
   * Method to format string with given value
   * @param value input string
   * @param args arguments
   */
  private transformString(value: any, ...args): any {
    return value.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] !== undefined ? args[number] : match;
    });
  }
}
