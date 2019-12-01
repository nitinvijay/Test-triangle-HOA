import { Directive, ComponentRef, ViewContainerRef, ComponentFactoryResolver, Input,
  HostListener, AfterViewChecked, OnInit, OnChanges } from '@angular/core';
import { OverlayComponent } from './overlay.component';


/**
 * Overlay Directive
 */
@Directive({
  selector: '[overlay]'
})
export class OverlayDirective implements AfterViewChecked, OnInit, OnChanges {

  /**
   * Overlay  of overlay directive
   */
  private overlay: ComponentRef<OverlayComponent>;
  /**
   * Visible  of overlay directive
   */
  private visible: boolean;
  /**
   * El  of overlay directive
   */
  private el: any;

/**
 * toChildElement  of overlay directive
 */
@Input('toChildElement')
  toChildElement: boolean;

   /**
   * isLookupBackground  of overlay component
   */
  @Input()
  isLookupBackground: boolean = false;

/**
 * isOpen  of overlay directive
 */
@Input('isOpen')
  isOpen: boolean;
  /**
   * applyOverlay  of overlay directive
   */
  @Input('applyOverlay')
  applyOverlay: boolean;

  /**
   * isDisableBackground  of overlay directive
   */
  @Input()
  isDisableBackground: boolean = true;

/**
 * Creates an instance of overlay directive.
 * @param viewContainerRef
 * @param resolver
 */
constructor(private viewContainerRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver) {
  }
  /**
   * on init
   */
  ngOnInit() {
    const factory = this.resolver.resolveComponentFactory(OverlayComponent);
    this.overlay = this.viewContainerRef.createComponent(factory);
    const nativeEl = this.viewContainerRef.element.nativeElement;
    this.el = this.toChildElement && nativeEl.childElementCount > 0
    ? nativeEl.children[0]
    :  nativeEl;
    this.overlay.instance.hostElement = this.el;
    this.overlay.instance.isOpen = this.isOpen;
    this.overlay.instance.applyOverlay = this.applyOverlay;
    this.overlay.instance.isDisableBackground = this.isDisableBackground;
    this.overlay.instance.isLookupBackground = this.isLookupBackground;
    this.el.classList.add('loader-parent');
    if (this.el.firstChild) {
      this.el.insertBefore(this.overlay.location.nativeElement, this.el.firstChild);
    } else {
      this.el.appendChild(this.overlay.location.nativeElement);
    }
    //setInterval(() => this.detectChanges(), 0);
  }
/**
 * on changes
 */
ngOnChanges() {
    if (this.overlay) {
      this.overlay.instance.isOpen = this.isOpen;
      this.overlay.instance.applyOverlay = this.applyOverlay;
      this.overlay.instance.isDisableBackground = this.isDisableBackground;
      this.overlay.instance.isLookupBackground = this.isLookupBackground;
    }
  }
  /**
   * after view checked
   */
  ngAfterViewChecked() {

  }
  /**
   * Detects changes
   */
  detectChanges() {
    if (this.overlay) {
      if (this.el.getBoundingClientRect().height !== this.overlay.instance.height
      || this.el.getBoundingClientRect().width !== this.overlay.instance.width ) {
        this.resizeCallback();
      }
    }
  }
  // @HostListener('window:resize')
  // @HostListener('document:resize')
  /**
   * Resizes callback
   */
  resizeCallback() {
    this.overlay.instance.setPosition(true);
  }
}
