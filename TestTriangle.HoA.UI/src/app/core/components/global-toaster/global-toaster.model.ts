/**
 * Global Toaster type
 */
export enum GlobalToasterType {
  info = 'info',
  success = 'success',
  warning = 'warning',
  danger = 'danger'
}

/**
 * Global Toaster model
 */
export class GlobalToaster {
  message: string;
  messageType: GlobalToasterType;
  msgDisplayTimeout: number;
  navigationLink: string;
  navigationLinkText: string;
  navigationData: { [k: string]: any };
  additionalData: any;
  Template: any;
}
