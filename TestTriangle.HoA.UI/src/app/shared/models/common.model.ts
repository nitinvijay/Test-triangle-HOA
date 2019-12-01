
/**
 * To handle base response
 */
export interface BaseResponse<T> {
  data: Array<T>;
  errors: any[];
  totalCount: number;
  success: boolean;
  _additionalData: string;
}
/**
 * Dropdown model
 */
export class DropdownModel {
  display: string;
  value: string;
}

/**
 * Button type
 */
export enum ButtonType {
  Ok = 1,
  Cancel
}

export interface BreadCrumb {
  label: string;
  url: string;
  disabled: boolean;
}

