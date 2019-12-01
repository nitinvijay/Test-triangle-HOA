import { Component, AfterViewInit, ElementRef, ChangeDetectorRef, Input } from '@angular/core';

/**
 * Overlay component
 */
@Component({
  selector: 'app-overlay',
  template: `<div *ngIf='isOpen || applyOverlay'
  [ngClass] ="{'modal-div' : applyOverlay,
  'overlay-opacity': isLookupBackground,
  'overlay-show': !isLookupBackground}"
  [style.background-color]="isDisableBackground ? 'gray' : ''"
   role='modal' >
  <div class='overlay-body' *ngIf = 'isOpen' >
      <img class="loader-img loader-gif" />
      <ng-content></ng-content>
  </div>
</div>`,
  styles: ['']
})
// [style.top]='this.topPixel'
//    [style.left]='this.leftPixel'
//    [style.height]='this.heightPixel'
//    [style.width]='this.widthPixel'
export class OverlayComponent implements AfterViewInit {

  /**
   * Height pixel of overlay component
   */
  heightPixel: string;
  /**
   * Height  of overlay component
   */
  private _height: Number = 0;
  /**
   * Gets height
   */
  get height(): Number {
    return this._height;
  }
  /**
   * Sets height
   */
  set height(val: Number) {
    this._height = val;
    this.heightPixel = val + 'px';
  }

  /**
   * Width pixel of overlay component
   */
  widthPixel: string;
  /**
   * Width  of overlay component
   */
  private _width: Number = 0;
  /**
   * Gets width
   */
  get width(): Number {
    return this._width;
  }
  /**
   * Sets width
   */
  set width(val: Number) {
    this._width = val;
    this.widthPixel = val + 'px';
  }

  /**
   * Top pixel of overlay component
   */
  topPixel: string;
  /**
   * Top  of overlay component
   */
  private _top: Number = -100000;
  /**
   * Gets top
   */
  get top(): Number {
    return this._top;
  }
  /**
   * Sets top
   */
  set top(val: Number) {
    this._top = val;
    this.topPixel = val + 'px';
  }

  /**
   * Left pixel of overlay component
   */
  leftPixel: string;
  /**
   * Left  of overlay component
   */
  private _left: Number = -100000;
  /**
   * Gets left
   */
  get left(): Number {
    return this._left;
  }
  /**
   * Sets left
   */
  set left(val: Number) {
    this._left = val;
    this.leftPixel = val + 'px';
  }

  /**
   * hostElement  of overlay component
   */
  @Input()
  hostElement: HTMLElement;
  /**
   * isOpen  of overlay component
   */
  @Input()
  isOpen: boolean;


  /**
   * isLookupBackground  of overlay component
   */
  @Input()
  isLookupBackground: boolean = false;
  /**
   * applyOverlay  of overlay component
   */
  @Input()
  applyOverlay: boolean = false;
  /**
   * isDisableBackground  of overlay component
   */
  @Input() isDisableBackground: boolean = true;
  /**
   * Creates an instance of overlay component.
   * @param element
   * @param cdr
   */
  constructor(private element: ElementRef,
    private cdr: ChangeDetectorRef) {
  }
  /**
   * after view init
   */
  ngAfterViewInit(): void {
    // this.setPosition(true);
    // this.cdr.detectChanges();
  }

  /**
   * Sets position
   * @param show
   */
  setPosition(show: boolean): void {
    if (show) {
      const positions = this.position(this.hostElement);
      this.left = positions.left;
      this.top = positions.top;
      this.height = positions.height;
      this.width = positions.width;
    } else {
      this.top = this.left = -100000;
      this.width = this.height = 0;
    }
  }
  /**
   * Offsets overlay component
   * @param nativeEl
   * @returns offset
   */
  private offset(nativeEl: any): { width: number, height: number, top: number, left: number } {
    const boundingClientRect = nativeEl.getBoundingClientRect();
    return {
      width: boundingClientRect.width || nativeEl.offsetWidth,
      height: boundingClientRect.height || nativeEl.offsetHeight,
      top: boundingClientRect.top + (window.pageYOffset || window.document.documentElement.scrollTop),
      left: boundingClientRect.left + (window.pageXOffset || window.document.documentElement.scrollLeft)
    };
  }

  /**
   * Positions overlay component
   * @param nativeEl
   * @returns position
   */
  private position(nativeEl: HTMLElement): { width: number, height: number, top: number, left: number } {
    let offsetParentBCR = { top: 0, left: 0 };
    const elBCR = this.offset(nativeEl);
    const offsetParentEl = this.parentOffsetEl(nativeEl);
    if (offsetParentEl !== window.document) {
      offsetParentBCR = this.offset(offsetParentEl);
      offsetParentBCR.top += offsetParentEl.clientTop - offsetParentEl.scrollTop;
      offsetParentBCR.left += offsetParentEl.clientLeft - offsetParentEl.scrollLeft;
    }

    const boundingClientRect = nativeEl.getBoundingClientRect();
    return {
      width: boundingClientRect.width || nativeEl.offsetWidth,
      height: boundingClientRect.height || nativeEl.offsetHeight,
      top: elBCR.top - offsetParentBCR.top,
      left: elBCR.left - offsetParentBCR.left
    };
  }

  /**
   * Determines whether static positioned is
   * @param nativeEl
   * @returns true if static positioned
   */
  private isStaticPositioned(nativeEl: HTMLElement): boolean {
    return (this.getStyle(nativeEl, 'position') || 'static') === 'static';
  }
  /**
   * Gets style
   * @param nativeEl
   * @param cssProp
   * @returns style
   */
  private getStyle(nativeEl: HTMLElement, cssProp: string): string {
    if ((nativeEl as any).currentStyle) {
      return (nativeEl as any).currentStyle[cssProp];
    }
    if (window.getComputedStyle) {
      return (window.getComputedStyle(nativeEl) as any)[cssProp];
    }

    // finally try and get inline style
    return (nativeEl.style as any)[cssProp];
  }

  /**
   * Parents offset el
   * @param nativeEl
   * @returns offset el
   */
  private parentOffsetEl(nativeEl: HTMLElement): any {
    let offsetParent: any = nativeEl.offsetParent || window.document;
    while (offsetParent && offsetParent !== window.document && this.isStaticPositioned(offsetParent)) {
      offsetParent = offsetParent.offsetParent;
    }
    return offsetParent || window.document;
  }



}
