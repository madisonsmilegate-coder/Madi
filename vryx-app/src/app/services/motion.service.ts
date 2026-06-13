import { Injectable, signal } from '@angular/core';

/** Shared motion state: cursor position, scroll progress, reduced-motion flag. */
@Injectable({ providedIn: 'root' })
export class MotionService {
  readonly reduced =
    typeof matchMedia !== 'undefined' &&
    matchMedia('(prefers-reduced-motion: reduce)').matches;

  readonly finePointer =
    typeof matchMedia !== 'undefined' && matchMedia('(pointer: fine)').matches;

  /** raw cursor position (px) */
  mouseX = 0;
  mouseY = 0;

  /** 0..1 page scroll progress */
  readonly progress = signal(0);

  /** label of the cursor ("", "view", "drag") — set by hover targets */
  readonly cursorLabel = signal('');
  readonly cursorHover = signal(false);

  constructor() {
    if (typeof window === 'undefined') return;
    window.addEventListener(
      'mousemove',
      (e) => {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
      },
      { passive: true }
    );
    window.addEventListener(
      'scroll',
      () => {
        const d = document.documentElement;
        this.progress.set(d.scrollTop / (d.scrollHeight - d.clientHeight || 1));
      },
      { passive: true }
    );
  }
}
