import {
  Directive,
  ElementRef,
  Renderer2,
  HostListener,
  Host,
} from '@angular/core';

@Directive({
  selector: '[appHighlight]',
})
export class HighlightDirective {
  constructor(private el: ElementRef, private rendeerer: Renderer2) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.rendeerer.addClass(this.el.nativeElement, 'highlight');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.rendeerer.removeClass(this.el.nativeElement, 'highlight');
  }
}
