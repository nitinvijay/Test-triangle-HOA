// tslint:disable-next-line:import-blacklist
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { FormArray, AbstractControl, FormGroup } from '@angular/forms';


/**
 * Class for common utility
 */
export class CommonUtility {

  /**
   * Marks form group untouched
   * @param FormControls
   */
  static markFormGroupUntouched (FormControls: { [key: string]: AbstractControl } | AbstractControl[]): void {

    const markFormGroupUntouchedRecursive = (controls: { [key: string]: AbstractControl } | AbstractControl[]): void => {
      [].forEach.call(Object.keys(controls).map(key => controls[key]), (c, controlKey) => {
        if (c instanceof FormGroup || c instanceof FormArray) {
          markFormGroupUntouchedRecursive(c.controls);
        } else {
          c.markAsUntouched();
        }
      });
    };
    markFormGroupUntouchedRecursive(FormControls);
  }
  /**
   * Repeats common utility
   * @param chr
   * @param count
   * @returns
   */
  static repeat (chr: string, count: number) {
    let str = '';
    for (let x = 0; x < count; x++) {
      str += chr;
    }
    return str;
  }
  /**
   * Pads l
   * @param val
   * @param width
   * @param pad
   * @returns l
   */
  static padL(val: string, width: number, pad: string): string {
    if (!width || width < 1 || !val || val.length < 1) {
      return val;
    }
    if (!pad) {
      pad = ' ';
    }
    const length = width - val.length;
    if (length < 1) {
      return val.substr(0, width);
    }

    return (CommonUtility.repeat(pad, length) + val).substr(0, width);
  }
  /**
   * Pads r
   * @param val
   * @param width
   * @param pad
   * @returns r
   */
  static padR(val: string, width: number, pad: string): string {
    if (!width || width < 1 || !val || val.length < 1) {
      return val;
    }
    if (!pad) {
      pad = ' ';
    }
    const length = width - val.length;
    if (length < 1) {
      return val.substr(0, width);
    }
    return (val + CommonUtility.repeat(pad, length)).substr(0, width);
  }
  /**
   * Formats common utility
   * @param frmt
   * @param args
   * @returns format
   */
  static format (frmt, args): string {
    for (let x = 0; x < args.length; x++) {
        frmt = frmt.replace('{' + x + '}', args[x + 1]);
    }
    return frmt;
  }
  /**
   * Formats date
   * @param date
   * @param format
   * @param [noneLabel]
   * @returns
   */
  static _formatDate(date: Date, format: string, noneLabel: string = 'none'): string {
    if (!date || date === null || date.toString() === '0001-01-01T00:00:00') {
      return noneLabel;
    }
    if (typeof date === 'string') {
      date = new Date(date);
    }
    if (!format) {
      format = 'MM/dd/yyyy';
    }
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    format = format.replace('MM', CommonUtility.padL(month.toString(), 2, '0'));

    if (format.indexOf('yyyy') > -1) {
      format = format.replace('yyyy', year.toString());
    } else if (format.indexOf('yy') > -1) {
      format = format.replace('yy', year.toString().substr(2, 2));
    }
    format = format.replace('dd', CommonUtility.padL(date.getDate().toString(), 2, '0'));
    let hours = date.getHours();
    if (format.indexOf('t') > -1) {
      if (hours > 11) {
        format = format.replace('t', 'pm');
      } else {
        format = format.replace('t', 'am');
      }
    }
    if (format.indexOf('HH') > -1) {
      format = format.replace('HH', CommonUtility.padL(hours.toString(), 2, '0'));
    }
    if (format.indexOf('hh') > -1) {
      if (hours > 12) {
        hours = hours - 12;
      }
      if (hours === 0) {
        hours = 12;
      }
      format = format.replace('hh', CommonUtility.padL(hours.toString(), 2, '0'));
    }
    if (format.indexOf('mm') > -1) {
      format = format.replace('mm', CommonUtility.padL(date.getMinutes().toString(), 2, '0'));
    }
    if (format.indexOf('ss') > -1) {
      format = format.replace('ss', CommonUtility.padL(date.getSeconds().toString(), 2, '0'));
    }
    return format;
  }
  /**
   * Trims object properties
   * @param objectToTrim
   * @returns object properties
   */
  static trimObjectProperties(objectToTrim): any {
    for (const key in objectToTrim) {
      if (
        objectToTrim[key] &&
        objectToTrim[key].constructor &&
        objectToTrim[key].constructor == Object
      ) {
        this.trimObjectProperties(objectToTrim[key]);
      } else if (objectToTrim[key] && objectToTrim[key].trim) {
        objectToTrim[key] = objectToTrim[key].trim();
      }
    }
    return objectToTrim;
  }
  /**
   * Trims replacer
   * @param key
   * @param value
   * @returns
   */
  static trimReplacer(key, value) {
    function trim(text) {
      const rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
      text = text == null ? '' : (text + '').replace(rtrim, '');
      return text;
    }
    return typeof this[key] === 'string' ? trim(value) : value;
  }
  /**
   * To return full current date time as string
   */
  static getCurrentDateTime() {
    const now = new Date();
    const year = '' + now.getFullYear();
    let month = '' + (now.getMonth() + 1);
    if (month.length === 1) {
      month = '0' + month;
    }
    let day = '' + now.getDate();
    if (day.length === 1) {
      day = '0' + day;
    }
    let hour = '' + now.getHours();
    if (hour.length === 1) {
      hour = '0' + hour;
    }
    let minute = '' + now.getMinutes();
    if (minute.length === 1) {
      minute = '0' + minute;
    }
    let second = '' + now.getSeconds();
    if (second.length === 1) {
      second = '0' + second;
    }
    let millisecond = '' + now.getMilliseconds();
    if (millisecond.length === 1) {
      millisecond = '0' + millisecond;
    }
    return year + month + day + hour + minute + second + millisecond;
  }
  // To format date input
  static formatDate(date: Date): Date {
    if (date) {
      date = date instanceof Date ? date : new Date(date);
      return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
        date.getMilliseconds()
      );
    }
    return new Date();
  }

  /**
   * Determines whether empty is
   * @param val
   * @returns true if empty
   */
  public static isEmpty(val: any): boolean {
    return val === undefined || val == null || val.length <= 0 ? true : false;
  }

  /**
   * Determines whether obj emppty is
   * @param val
   * @returns true if obj emppty
   */
  public static _isObjEmpty(val: any): boolean {
    return (
      !val ||
      val == null ||
      val.length <= 0 ||
      (Object.keys(val).length === 0 && val.constructor === Object)
    );
  }
}
