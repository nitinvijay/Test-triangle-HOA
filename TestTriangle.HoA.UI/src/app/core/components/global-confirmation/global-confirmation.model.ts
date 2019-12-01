import { ButtonType } from '../../../shared/models/common.model';

/**
 * Global Confirmation interface
 */
export interface IConfirmEmit {
  close?: boolean;
  message?: string;
  title?: string;
  ok?: string;
  cancel?: string;
  resolveConfirm?: any;
  resolveCancel?: any;
  dynamicId?: any;
  dynamicComponent?: any;
  template?: any;
  isWideCss?: boolean;
  isLargeCss?: boolean;
}

/**
 * Global confirmation resolve interface
 */
export interface IResolveEmit {
  resolved?: boolean;
  type?: ButtonType;
}
