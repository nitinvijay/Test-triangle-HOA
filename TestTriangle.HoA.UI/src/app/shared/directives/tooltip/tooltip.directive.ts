import {
  Directive, HostListener, ComponentRef, ViewContainerRef, Input, ComponentFactoryResolver,
  ComponentFactory
} from '@angular/core';
import { TooltipComponent } from './tooltip.component';

/**
 * Tooltip directive
 */
@Directive({
  selector: '[tooltip]'
})
export class TooltipDirective  {

  /**
   * tooltip variable
   */
  private tooltip: ComponentRef<TooltipComponent>;
  /**
   * tooltip visible flag
   */
  private visible: boolean;

  /**
   * Tooltip contructor
   * @param viewContainerRef View container injector
   * @param resolver resolver injector
   */
  constructor(private viewContainerRef: ViewContainerRef,
              private resolver: ComponentFactoryResolver) {
  }

  /**
   * Tooltip input
   */
  @Input('tooltip')
  content: string | TooltipComponent;

  /**
   * Tooltip disable flag
   */
  @Input()
  tooltipDisabled: boolean;

  /**
   * Tooltip animation flag
   */
  @Input()
  tooltipAnimation: Boolean = true;

  /**
   * Override sideoverlay tooltip left 0
   */
  @Input()
  isSideOverlayTooltipNoLeft: boolean = false;

  /**
   * Tooltip placement
   */
  @Input()
  tooltipPlacement: 'top'|'bottom'|'left'|'right' = 'bottom';

  /**
   * Hostlistener of focusin/mouseenter
   */
  @HostListener('focusin')
  @HostListener('mouseenter')
  show(): void {
      if (this.tooltipDisabled || this.visible) {
          return;
        }
      this.visible = true;
      if (typeof this.content === 'string') {
          const factory = this.resolver.resolveComponentFactory(TooltipComponent);
          if (!this.visible) {
              return;
            }

          this.tooltip = this.viewContainerRef.createComponent(factory);
          this.tooltip.instance.hostElement = this.viewContainerRef.element.nativeElement;
          this.tooltip.instance.isSideOverlayTooltipNoLeft = this.isSideOverlayTooltipNoLeft;
          this.tooltip.instance.content = this.content as string;
          this.tooltip.instance.placement = this.tooltipPlacement;
          this.tooltip.instance.animation = this.tooltipAnimation;
      } else {
          const tooltip = this.content as TooltipComponent;
          tooltip.hostElement = this.viewContainerRef.element.nativeElement;
          tooltip.placement = this.tooltipPlacement;
          tooltip.animation = this.tooltipAnimation;
          tooltip.show();
      }
  }

  /**
   * Hostlistener of focusout/mouseleave
   */
  @HostListener('focusout')
  @HostListener('mouseleave')
  hide(): void {
      if (!this.visible) {
          return;
        }

      this.visible = false;
      if (this.tooltip) {
          this.tooltip.destroy();
        }
      if (this.content instanceof TooltipComponent) {
          (this.content as TooltipComponent).hide();
        }
  }

}
