import {
  Component,
  Input,
  AfterViewInit,
  ElementRef,
  ChangeDetectorRef
} from '@angular/core';

/**
 * Tooltip component
 */
@Component({
  selector: 'tooltip-Content',
  template: `
    <div
      class="show Zindex tooltip position-{{ cssPlacementClass }}"
      [style.top]="this.topPixel"
      [style.left]="this.leftPixel"
      [class.in]="isIn"
      [ngClass]="{ sideovertooltipnoleft: this.isSideOverlayTooltipNoLeft }"
      role="tooltip"
    >
      <div class="tooltip-body" style="max-width:400px;">
        <ng-content></ng-content>
        <div [innerHTML]="content"></div>
      </div>
    </div>
  `,
  styles: [
    '.show { position:absolute; visibility:visible; z-index:99999 !important; }'
  ]
})
export class TooltipComponent implements AfterViewInit {
  /**
   * Host element
   */
  @Input()
  hostElement: HTMLElement;

  /**
   * content
   */
  @Input()
  content: string;

  /**
   * Override sideoverlay tooltip left 0
   */
  @Input()
  isSideOverlayTooltipNoLeft: boolean = false;

  /**
   * Css placement class
   */
  cssPlacementClass: 'top' | 'bottom' | 'left' | 'right' = 'top';
  /**
   * Placement  of sttooltip component
   */
  private _placement: 'top' | 'bottom' | 'left' | 'right' = 'bottom';

  /**
   * Placement set
   */
  @Input()
  set placement(val: 'top' | 'bottom' | 'left' | 'right') {
    this._placement = val ? val : 'bottom';
    switch (this._placement) {
      case 'left':
        this.cssPlacementClass = 'right';
        break;
      case 'right':
        this.cssPlacementClass = 'left';
        break;
      default:
        this.cssPlacementClass = this._placement;
        break;
    }
  }

  /**
   * Placement getter
   */
  get placement() {
    return this._placement;
  }

  /**
   * Tooltip animation flag
   */
  @Input()
  animation: Boolean = true;

  /**
   * Tooltip top pixel
   */
  topPixel: string;
  /**
   * Top  of sttooltip component
   */
  private _top: Number = -100000;
  /**
   * Tooltip top getter
   */
  get top(): Number {
    return this._top;
  }

  /**
   * Tooltip top setter
   */
  set top(val: Number) {
    this._top = val;
    this.topPixel = val + 'px';
  }

  /**
   * left pixel
   */
  leftPixel: string;
  /**
   * Left  of sttooltip component
   */
  private _left: Number = -100000;

  /**
   * tooltip left
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
  //top: Number = -100000;
  //left: Number = -100000;
  /**
   * IsIn flag
   */
  isIn: Boolean = false;
  /**
   * Isfade flag
   */
  isFade: Boolean = false;
  /**
   * Tooltip component constructor
   * @param element element injector
   * @param cdr Change detector injector
   */
  constructor(private element: ElementRef, private cdr: ChangeDetectorRef) {}

  /**
   * after view init
   */
  ngAfterViewInit(): void {
    this.show();
    this.cdr.detectChanges();
  }

  /**
   * Method to show tooltip
   */
  show(): void {
    if (!this.hostElement) {
      return;
    }
    const hasSideOverlayParent = this.hasSideOverlayParent(this.hostElement);
    const p = this.positionElements(
      this.hostElement,
      this.element.nativeElement.children[0],
      this.placement
    );
    this.top = p.top;
    this.left = p.left;
    this.isIn = true;
    if (hasSideOverlayParent) {
      const tooltipPosition = this.position(
        this.element.nativeElement.children[0]
      );
      if (p.left < 0 && p.left < -Math.abs(tooltipPosition.left)) {
        this.left = p.left + tooltipPosition.left;
      }
    }
    if (this.animation) {
      this.isFade = true;
    }
  }

  /**
   * Method to hide tooltip
   */
  hide(): void {
    this.top = -100000;
    this.left = -100000;
    this.isIn = true;
    if (this.animation) {
      this.isFade = false;
    }
  }

  /**
   * Positions elements
   * @param hostEl
   * @param targetEl
   * @param positionStr
   * @param [appendToBody]
   * @returns elements
   */
  private positionElements(
    hostEl: HTMLElement,
    targetEl: HTMLElement,
    positionStr: string,
    appendToBody: boolean = false
  ): { top: number; left: number } {
    const positionStrParts = positionStr.split('-');
    const pos0 = positionStrParts[0];
    const pos1 = positionStrParts[1] || 'center';
    const hostElPos = appendToBody
      ? this.offset(hostEl)
      : this.position(hostEl);
    const targetElWidth = targetEl.offsetWidth;
    const targetElHeight = targetEl.offsetHeight;
    const shiftWidth: any = {
      center: function(): number {
        return hostElPos.left + hostElPos.width / 2 - targetElWidth / 2;
      },
      left: function(): number {
        return hostElPos.left;
      },
      right: function(): number {
        return hostElPos.left + hostElPos.width;
      }
    };

    const shiftHeight: any = {
      center: function(): number {
        return hostElPos.top + hostElPos.height / 2 - targetElHeight / 2;
      },
      top: function(): number {
        return hostElPos.top;
      },
      bottom: function(): number {
        return hostElPos.top + hostElPos.height;
      }
    };

    let targetElPos: { top: number; left: number };
    switch (pos0) {
      case 'right':
        targetElPos = {
          top: shiftHeight[pos1](),
          left: shiftWidth[pos0]()
        };
        break;

      case 'left':
        targetElPos = {
          top: shiftHeight[pos1](),
          left: hostElPos.left - targetElWidth
        };
        break;

      case 'bottom':
        targetElPos = {
          top: shiftHeight[pos0](),
          left: shiftWidth[pos1]()
        };
        break;

      default:
        targetElPos = {
          top: hostElPos.top - targetElHeight,
          left: shiftWidth[pos1]()
        };
        break;
    }

    return targetElPos;
  }

  /**
   * Positions sttooltip component
   * @param nativeEl
   * @returns position
   */
  private position(
    nativeEl: HTMLElement
  ): { width: number; height: number; top: number; left: number } {
    let offsetParentBCR = { top: 0, left: 0 };
    const elBCR = this.offset(nativeEl);
    const offsetParentEl = this.parentOffsetEl(nativeEl);
    if (offsetParentEl !== window.document) {
      offsetParentBCR = this.offset(offsetParentEl);
      offsetParentBCR.top +=
        offsetParentEl.clientTop - offsetParentEl.scrollTop;
      offsetParentBCR.left +=
        offsetParentEl.clientLeft - offsetParentEl.scrollLeft;
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
   * Determines whether side overlay parent has
   * @param el
   * @returns
   */
  private hasSideOverlayParent(el) {
    while (el) {
      if (el.classList.contains('side-overlay')) {
        return true;
      }
      el = el.offsetParent;
    }
    return false;
  }

  /**
   * Gets offset
   * @param el
   * @returns offset
   */
  private getOffset(el): any {
    let _x = 0;
    let _y = 0;
    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
      _x += el.offsetLeft - el.scrollLeft;
      _y += el.offsetTop - el.scrollTop;
      el = el.offsetParent;
    }
    return { top: _y, left: _x };
  }

  /**
   * Offsets sttooltip component
   * @param nativeEl
   * @returns offset
   */
  private offset(
    nativeEl: any
  ): { width: number; height: number; top: number; left: number } {
    const boundingClientRect = nativeEl.getBoundingClientRect();
    return {
      width: boundingClientRect.width || nativeEl.offsetWidth,
      height: boundingClientRect.height || nativeEl.offsetHeight,
      top:
        boundingClientRect.top +
        (window.pageYOffset || window.document.documentElement.scrollTop),
      left:
        boundingClientRect.left +
        (window.pageXOffset || window.document.documentElement.scrollLeft)
    };
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
   * Determines whether static positioned is
   * @param nativeEl
   * @returns true if static positioned
   */
  private isStaticPositioned(nativeEl: HTMLElement): boolean {
    return (this.getStyle(nativeEl, 'position') || 'static') === 'static';
  }

  /**
   * Parents offset el
   * @param nativeEl
   * @returns offset el
   */
  private parentOffsetEl(nativeEl: HTMLElement): any {
    let offsetParent: any = nativeEl.offsetParent || window.document;
    while (
      offsetParent &&
      offsetParent !== window.document &&
      this.isStaticPositioned(offsetParent)
    ) {
      offsetParent = offsetParent.offsetParent;
    }
    return offsetParent || window.document;
  }
}
