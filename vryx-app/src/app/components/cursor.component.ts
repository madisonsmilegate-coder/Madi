import {
  Component, ElementRef, ViewChild, inject, afterNextRender,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MotionService } from '../services/motion.service';

/** Morphing custom cursor: dot + lagged ring; expands over links, shows labels ("view"/"drag"). */
@Component({
  selector: 'vryx-cursor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div #dot class="dot" aria-hidden="true"></div>
    <div #ring class="ring" aria-hidden="true"><span #label class="label"></span></div>
  `,
  styles: [`
    .dot, .ring {
      position: fixed; top: 0; left: 0; pointer-events: none; z-index: 9999;
      border-radius: 50%; transform: translate(-50%,-50%);
    }
    .dot { width: 5px; height: 5px; background: var(--cyan); }
    .ring {
      width: 32px; height: 32px; border: 1px solid var(--cyan-g);
      display: flex; align-items: center; justify-content: center;
      transition: width .25s cubic-bezier(.34,1.56,.64,1),
                  height .25s cubic-bezier(.34,1.56,.64,1),
                  border-color .2s, background .2s;
    }
    :host-context(body.cursor-hover) .ring {
      width: 52px; height: 52px; border-color: var(--cyan);
    }
    :host-context(body.cursor-label) .ring {
      width: 72px; height: 72px; background: var(--cyan); border-color: var(--cyan);
    }
    .label {
      font-family: var(--mono); font-size: 10px; letter-spacing: .12em;
      text-transform: uppercase; color: var(--void); opacity: 0; transition: opacity .2s;
    }
    :host-context(body.cursor-label) .label { opacity: 1; }
  `],
})
export class CursorComponent {
  @ViewChild('dot') dot!: ElementRef<HTMLElement>;
  @ViewChild('ring') ring!: ElementRef<HTMLElement>;
  @ViewChild('label') label!: ElementRef<HTMLElement>;
  private motion = inject(MotionService);

  constructor() {
    afterNextRender(() => {
      if (!this.motion.finePointer) return;
      document.body.classList.add('custom-cursor');
      const dot = this.dot.nativeElement;
      const ring = this.ring.nativeElement;
      const label = this.label.nativeElement;
      let rx = 0, ry = 0;
      const loop = () => {
        rx += (this.motion.mouseX - rx) * 0.12;
        ry += (this.motion.mouseY - ry) * 0.12;
        dot.style.left = this.motion.mouseX + 'px';
        dot.style.top = this.motion.mouseY + 'px';
        ring.style.left = rx + 'px';
        ring.style.top = ry + 'px';
        requestAnimationFrame(loop);
      };
      loop();

      // contextual morphing via event delegation
      document.addEventListener('mouseover', (e) => {
        const t = e.target as HTMLElement;
        const labelled = t.closest<HTMLElement>('[data-cursor]');
        const interactive = t.closest('a,button');
        document.body.classList.toggle('cursor-label', !!labelled);
        document.body.classList.toggle('cursor-hover', !labelled && !!interactive);
        if (labelled) label.textContent = labelled.dataset['cursor'] ?? '';
      });
    });
  }
}
