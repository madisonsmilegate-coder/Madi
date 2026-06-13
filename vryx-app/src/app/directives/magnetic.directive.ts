import { Directive, ElementRef, inject, afterNextRender } from '@angular/core';
import { MotionService } from '../services/motion.service';

/** Magnetic pull: element drifts toward the cursor within its bounds, springs back on leave. */
@Directive({ selector: '[appMagnetic]' })
export class MagneticDirective {
  private el = inject(ElementRef<HTMLElement>);
  private motion = inject(MotionService);

  constructor() {
    afterNextRender(() => {
      if (this.motion.reduced || !this.motion.finePointer) return;
      const node = this.el.nativeElement;
      node.style.transition = 'transform .35s cubic-bezier(.34,1.56,.64,1)';
      node.addEventListener('mousemove', (e: MouseEvent) => {
        const r = node.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        node.style.transform = `translate(${dx * 0.25}px, ${dy * 0.25}px)`;
      });
      node.addEventListener('mouseleave', () => {
        node.style.transform = 'translate(0,0)';
      });
    });
  }
}
