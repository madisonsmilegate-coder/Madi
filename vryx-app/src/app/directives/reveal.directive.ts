import { Directive, ElementRef, inject, afterNextRender } from '@angular/core';
import { MotionService } from '../services/motion.service';

/** Adds .will-r below the fold and reveals with a clip-wipe when scrolled into view. */
@Directive({ selector: '[appReveal]' })
export class RevealDirective {
  private el = inject(ElementRef<HTMLElement>);
  private motion = inject(MotionService);

  constructor() {
    afterNextRender(() => {
      const node = this.el.nativeElement;
      if (this.motion.reduced) return;
      // progressive enhancement: only hide things below the fold
      if (node.getBoundingClientRect().top <= window.innerHeight) return;
      node.classList.add('will-r');
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            node.classList.add('in');
            io.disconnect();
          }
        },
        { threshold: 0.12 }
      );
      io.observe(node);
    });
  }
}
