import { Directive, ElementRef, HostListener, AfterViewInit, Renderer2 } from '@angular/core';

/**
 * Fixed header directive
 */
@Directive({
  selector: '[stFixedHeader]'
})
export class FixedHeaderDirective implements AfterViewInit {

  /**
   * Fixed header constructor
   * @param el Element injector
   * @param renderer Renderer injector
   */
  constructor(public el: ElementRef, private renderer: Renderer2) { }

  /**
   * ngAfterViewInit
   */
  ngAfterViewInit() {
    this.el.nativeElement.classList.add('border-gray');
  }

  /**
   * Host listener for scroll
   * @param $event scroll event
   */
  @HostListener('scroll', ['$event'])
  onScroll($event) {
      const ele = $event.srcElement;
      [].forEach.call(ele.querySelectorAll('thead th'), th => {
        th.style.transform = `translateY(${ele.scrollTop - 1}px)`;
      });
      // this.renderer.setStyle(this.el.nativeElement.querySelector('thead'), 'transform', `translateY(${ele.scrollTop}px)`);
  }

}
