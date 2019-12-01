import { AbstractControl, FormGroup, FormControl } from '@angular/forms';

/**
 * Cast item
 */
// @dynamic
export class CastItem extends Object {
  /**
   * Casts as
   * @template T
   * @param doc
   * @param proto
   * @returns as
   */
  static castAs<T extends CastItem>(doc: T, proto: typeof CastItem): T {
    if (doc instanceof proto) {
      return doc;
    }
    const d: T = Object.create(proto.prototype);
    Object.assign(d, doc);
    d.init();
    return d;
  }
  /**
   * Casts as any
   * @param doc
   * @param prototype
   * @returns as any
   */
  static castAsAny(doc: any, prototype: Object): any {
    const d: any = Object.create(prototype);
    Object.assign(d, doc);
    d.init();
    return d;
  }
  /**
   * Casts all as any
   * @param docs
   * @param proto
   * @returns all as any
   */
  static castAllAsAny(docs: any[], proto: Object): any[] {
    return docs.map(d => CastItem.castAsAny(d, proto));
  }
  /**
   * Casts all as
   * @template T
   * @param docs
   * @param proto
   * @returns all as
   */
  static castAllAs<T extends CastItem>(docs: T[], proto: typeof CastItem): T[] {
    return docs.map(d => CastItem.castAs(d, proto));
  }
  /**
   * Inits cast item
   */
  init() {}
}


/**
 * Extension for form group
 */
export class FormGroupExtension {
  /**
   * To mark all control of form as touched
   * @param formGroup form group
   */
  public static MarkFormGroupAsTouched(formGroup: FormGroup) {
    for (const field in formGroup.controls) {
        if (formGroup.controls.hasOwnProperty(field)) {
          formGroup.get(field).markAsTouched();
        }
      }
  }
  /**
   * Marks form group as untouched
   * @param formGroup
   */
  public static MarkFormGroupAsUntouched(formGroup: FormGroup) {
    for (const field in formGroup.controls) {
        if (formGroup.controls.hasOwnProperty(field)) {
          formGroup.get(field).markAsUntouched();
        }
      }
  }

/**
 * To Validate form input value. returns true if valid otherwise false.
 * @param formControl Form Control
 */
  public static Validate(formControl: AbstractControl): boolean {
    if (formControl !== undefined && formControl.invalid && formControl.touched) {
      return false;
    }
    return true;
  }
}

/**
 * Class for Form Validation
 */
export class CommonValidator {

  /**
   * To validate white spaces in form control
   * @param control form control
   */
  public static ValidateWhitespaces(control: FormControl) {
    const value: string = control.value;
    return value.trim() === '' ? { validWhitespace: true } : null;
  }

}
