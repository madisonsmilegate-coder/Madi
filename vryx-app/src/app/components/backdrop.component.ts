import {
  Component, ElementRef, ViewChild, inject, afterNextRender,
  ChangeDetectionStrategy, DestroyRef,
} from '@angular/core';
import { MotionService } from '../services/motion.service';

/**
 * Generative canvas particle field. Particles drift slowly and are gently
 * repelled by the cursor. Color mood shifts with scroll progress
 * (cyan at top → violet mid-page → green at the bottom).
 */
@Component({
  selector: 'vryx-backdrop',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<canvas #cv aria-hidden="true"></canvas>`,
  styles: [`
    :host { position: fixed; inset: 0; z-index: 0; pointer-events: none; display: block; }
    canvas { width: 100%; height: 100%; display: block; opacity: .55; }
  `],
})
export class BackdropComponent {
  @ViewChild('cv') cv!: ElementRef<HTMLCanvasElement>;
  private motion = inject(MotionService);
  private destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => this.start());
  }

  private start() {
    const canvas = this.cv.nativeElement;
    const ctx = canvas.getContext('2d')!;
    let w = 0, h = 0, raf = 0;
    const DPR = Math.min(devicePixelRatio || 1, 2);

    const resize = () => {
      w = innerWidth; h = innerHeight;
      canvas.width = w * DPR; canvas.height = h * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const COUNT = this.motion.reduced ? 0 : Math.min(90, Math.floor(w / 16));
    const pts = Array.from({ length: COUNT }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25,
      r: Math.random() * 1.6 + .4,
    }));

    // scroll-driven mood palette stops
    const moods = [
      [0, 240, 255],   // cyan — hero
      [123, 92, 250],  // violet — mid
      [0, 232, 122],   // green — bottom
    ];
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      const p = this.motion.progress();
      const seg = Math.min(p * (moods.length - 1), moods.length - 1.001);
      const i = Math.floor(seg), t = seg - i;
      const c = moods[i].map((v, k) => Math.round(lerp(v, moods[i + 1][k], t)));

      // also push mood into body background (deep, very dark version)
      document.documentElement.style.setProperty('--mood-r', String(6 + c[0] * 0.012));
      document.documentElement.style.setProperty('--mood-g', String(8 + c[1] * 0.012));
      document.documentElement.style.setProperty('--mood-b', String(12 + c[2] * 0.012));

      const mx = this.motion.mouseX, my = this.motion.mouseY;
      for (const pt of pts) {
        // cursor repulsion (subtle)
        const dx = pt.x - mx, dy = pt.y - my;
        const d2 = dx * dx + dy * dy;
        if (d2 < 22500) { // 150px radius
          const d = Math.sqrt(d2) || 1;
          pt.vx += (dx / d) * 0.06;
          pt.vy += (dy / d) * 0.06;
        }
        pt.vx *= 0.985; pt.vy *= 0.985;
        pt.x += pt.vx; pt.y += pt.vy;
        if (pt.x < 0) pt.x = w; if (pt.x > w) pt.x = 0;
        if (pt.y < 0) pt.y = h; if (pt.y > h) pt.y = 0;

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},.5)`;
        ctx.fill();
      }
      // connective lines for nearby particles
      ctx.strokeStyle = `rgba(${c[0]},${c[1]},${c[2]},.08)`;
      for (let a = 0; a < pts.length; a++) {
        for (let b = a + 1; b < pts.length; b++) {
          const dx = pts[a].x - pts[b].x, dy = pts[a].y - pts[b].y;
          if (dx * dx + dy * dy < 12100) { // 110px
            ctx.beginPath();
            ctx.moveTo(pts[a].x, pts[a].y);
            ctx.lineTo(pts[b].x, pts[b].y);
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };
    if (!this.motion.reduced) raf = requestAnimationFrame(tick);
    this.destroyRef.onDestroy(() => cancelAnimationFrame(raf));
  }
}
