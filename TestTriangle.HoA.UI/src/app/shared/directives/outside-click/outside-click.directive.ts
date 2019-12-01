
import { fromEvent as observableFromEvent, Observable, Subscription } from 'rxjs';

import { tap, delay } from 'rxjs/operators';
import { Directive, OnInit, OnDestroy, Output, EventEmitter, ElementRef, Input } from '@angular/core';

/**
 * Outside click directive
 */
@Directive({
  selector: '[stOutsideClick]'
})

export class OutsideClickDirective implements OnInit, OnDestroy {
  /**
   * Listening outside click flag
   */
  private listening: boolean;

  /**
   * Global outside click flag
   */
  private globalClick: Subscription;
  //private attachTapListener: boolean;

  /**
   * Outside click detect flag
   */
  // tslint:disable-next-line:no-output-rename
  // tslint:disable-next-line:no-input-rename
  @Input('enableClickDetect') enableClickDetect: boolean;

  /**
   * Continous detect outside click
   */
  // tslint:disable-next-line:no-input-rename
  @Input('continueEnableClickDetect') continueEnableClickDetect: boolean = false;

  /**
   * Outside click emitter
   */
  // tslint:disable-next-line:no-output-rename
  @Output('onOutsideClick') outsideClick: EventEmitter<Object>;

  /**
   * Outside click directive
   * @param _elRef Element
   */
  constructor(private _elRef: ElementRef) {
    //this.attachTapListener = true;
    this.listening = false;
    this.outsideClick = new EventEmitter();
  }

  /**
   * ngOninit
   */
  ngOnInit() {
    this.globalClick = observableFromEvent(document, 'click').pipe(
      delay(1),
      tap(() => {
        if (this.enableClickDetect || this.continueEnableClickDetect) {
          this.listening = true;
        }
      })).subscribe((event: MouseEvent) => {
        this.onGlobalClick(event);
      });
  }

  /**
   * ngOnDestroy
   */
  ngOnDestroy() {
    this.globalClick.unsubscribe();
  }

  /**
   * Method to handle outside click event
   * @param event Mouse event
   */
  onGlobalClick(event: MouseEvent) {
    if (event instanceof MouseEvent && this.listening === true) {
      if (this.isDescendant(this._elRef.nativeElement, event.target) === true) {
        // this.outsideClick.emit({
        //   target: (event.target || null),
        //   value: false
        // });
      } else {
        this.listening = false;
        this.outsideClick.emit(true);
      }
    }
  }

  /**
   * Method to check is element Descendant
   * @param parent Parent element
   * @param child Child element
   */
  private isDescendant(parent, child) {
    let node = child;
    while (node !== null) {
      if (node === parent) {
        this.enableClickDetect = true;
        this.listening = true;
        return true;
      } else {
        node = node.parentNode;
      }
    }
    this.enableClickDetect = false;
    this.listening = false;
    return false;
  }
}
