import {
  Component, ChangeDetectionStrategy, afterNextRender, inject, ElementRef,
} from '@angular/core';
import { MagneticDirective } from '../directives/magnetic.directive';
import { MotionService } from '../services/motion.service';

/**
 * Kinetic typography hero: per-letter spring entrance (blur-to-sharp, slight
 * rotation), animated gradient texture masked inside the display word, and
 * the brand centerpiece: drag-to-resolve ticket interaction.
 */
@Component({
  selector: 'vryx-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MagneticDirective],
  template: `
    <section class="hero" id="top">
      <div class="inner">
        <div class="badge"><span class="pulse"></span>Now in General Availability</div>

        <h1 class="h1" aria-label="Your company runs itself">
          <span class="line" aria-hidden="true">
            @for (ch of line1; track $index) {
              <span class="ch" [style.--i]="$index">{{ ch === ' ' ? ' ' : ch }}</span>
            }
          </span>
          <span class="line masked" aria-hidden="true">
            @for (ch of line2; track $index) {
              <span class="ch" [style.--i]="$index + line1.length">{{ ch === ' ' ? ' ' : ch }}</span>
            }
          </span>
        </h1>

        <p class="sub">VRYX OS is the AI layer that resolves support tickets, procurement,
        and operations problems automatically — before your customers ever feel them.</p>

        <div class="ctas">
          <a class="btn-p" href="#contact" appMagnetic>Start Free Trial</a>
          <a class="btn-g" href="#story" appMagnetic>See How It Works</a>
        </div>

        <!-- ── CENTERPIECE: drag the ticket onto the core to watch VRYX resolve it ── -->
        <div class="playground" data-cursor="drag">
          <p class="pg-hint" id="pgHint">Drag a ticket into the core — watch VRYX resolve it.</p>
          <div class="pg-stage">
            <div class="tickets">
              @for (t of tickets; track t.id) {
                <button class="ticket" [class.gone]="t.resolved"
                  draggable="true"
                  (dragstart)="dragId = t.id"
                  (click)="resolve(t.id)"
                  [attr.aria-label]="'Resolve ticket: ' + t.label">
                  <span class="tk-id">#{{ t.id }}</span>{{ t.label }}
                </button>
              }
            </div>
            <div class="core" [class.feeding]="feeding"
              (dragover)="$event.preventDefault()"
              (drop)="onDrop($event)">
              <div class="core-ring r1"></div>
              <div class="core-ring r2"></div>
              <div class="core-dot"></div>
              <span class="core-label">{{ coreLabel }}</span>
            </div>
            <div class="resolved-list" aria-live="polite">
              @for (r of resolvedLog; track r) {
                <div class="rl-item">✓ {{ r }}</div>
              }
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero { min-height: 100vh; display: flex; align-items: center; padding: 140px 56px 80px; position: relative; z-index: 1; }
    @media (max-width: 680px) { .hero { padding: 110px 20px 60px; } }
    .inner { max-width: 1120px; margin: 0 auto; width: 100%; }
    .badge {
      display: inline-flex; align-items: center; gap: 8px;
      font-family: var(--mono); font-size: 11px; letter-spacing: .14em; text-transform: uppercase;
      color: var(--cyan); border: 1px solid var(--cyan-g); padding: 7px 16px; margin-bottom: 36px;
    }
    .pulse { width: 6px; height: 6px; border-radius: 50%; background: var(--cyan); animation: pulse 1.6s ease-in-out infinite; }
    @keyframes pulse { 0%,100% { opacity:1; transform:scale(1);} 50% { opacity:.35; transform:scale(.6);} }

    /* ── kinetic type ── */
    .h1 { font-family: var(--dis); font-size: clamp(40px, 7.5vw, 96px); font-weight: 900; line-height: .98; letter-spacing: -.03em; margin-bottom: 28px; }
    .line { display: block; white-space: nowrap; }
    .ch {
      display: inline-block;
      opacity: 0;
      transform: translateY(.6em) rotate(6deg);
      filter: blur(8px);
      animation: chIn .7s cubic-bezier(.34,1.56,.64,1) forwards;
      animation-delay: calc(var(--i) * 38ms + 150ms);
      will-change: transform, opacity, filter;
    }
    @keyframes chIn {
      to { opacity: 1; transform: none; filter: blur(0); }
    }
    /* text masking: animated gradient texture inside the letterforms */
    .masked .ch {
      background: linear-gradient(120deg, var(--cyan), var(--violet), var(--green), var(--cyan));
      background-size: 300% 100%;
      -webkit-background-clip: text; background-clip: text;
      color: transparent;
      animation: chIn .7s cubic-bezier(.34,1.56,.64,1) forwards,
                 maskFlow 9s cubic-bezier(.45,.05,.55,.95) infinite;
      animation-delay: calc(var(--i) * 38ms + 150ms), 0s;
    }
    @keyframes maskFlow { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }

    .sub { color: var(--fog); font-size: 18px; line-height: 1.65; max-width: 520px; margin-bottom: 40px; }
    .ctas { display: flex; flex-wrap: wrap; gap: 14px; margin-bottom: 72px; }
    .btn-p {
      font-family: var(--mono); font-size: 12px; letter-spacing: .1em; text-transform: uppercase;
      background: var(--cyan); color: var(--void); font-weight: 500; padding: 16px 38px; display: inline-block;
    }
    .btn-p:hover { box-shadow: 0 0 36px var(--cyan-g); }
    .btn-g {
      font-family: var(--mono); font-size: 12px; letter-spacing: .1em; text-transform: uppercase;
      color: var(--white); padding: 16px 38px; border: 1px solid var(--line); display: inline-block;
    }
    .btn-g:hover { border-color: var(--cyan); color: var(--cyan); }

    /* ── centerpiece playground ── */
    .playground { border: 1px solid var(--line); background: rgba(15,21,32,.6); backdrop-filter: blur(8px); padding: 28px; }
    .pg-hint { font-family: var(--mono); font-size: 11px; letter-spacing: .1em; text-transform: uppercase; color: var(--mist); margin-bottom: 24px; }
    .pg-stage { display: grid; grid-template-columns: 1fr auto 1fr; gap: 32px; align-items: center; }
    @media (max-width: 800px) { .pg-stage { grid-template-columns: 1fr; justify-items: center; } }
    .tickets { display: flex; flex-direction: column; gap: 10px; }
    .ticket {
      font-family: var(--mono); font-size: 12px; color: var(--off); text-align: left;
      background: var(--panel); border: 1px solid var(--line); padding: 12px 16px;
      transition: transform .35s cubic-bezier(.34,1.56,.64,1), opacity .4s, border-color .2s;
    }
    .ticket:hover { border-color: var(--cyan); transform: translateX(6px); }
    .ticket.gone { opacity: 0; transform: translateX(80px) scale(.8); pointer-events: none; }
    .tk-id { color: var(--cyan); margin-right: 10px; }
    .core { position: relative; width: 160px; height: 160px; display: flex; align-items: center; justify-content: center; }
    .core-dot {
      width: 44px; height: 44px; border-radius: 50%;
      background: radial-gradient(circle, var(--cyan), var(--violet));
      box-shadow: 0 0 40px var(--cyan-g);
      transition: transform .4s cubic-bezier(.34,1.56,.64,1);
    }
    .core.feeding .core-dot { transform: scale(1.5); }
    .core-ring { position: absolute; inset: 0; border-radius: 50%; border: 1px solid var(--cyan-g); animation: ringSpin 7s cubic-bezier(.45,.05,.55,.95) infinite; }
    .core-ring.r2 { inset: 22px; animation-duration: 5s; animation-direction: reverse; border-color: var(--violet-d); border-top-color: var(--violet); }
    .core-ring.r1 { border-top-color: var(--cyan); }
    @keyframes ringSpin { to { transform: rotate(360deg); } }
    .core-label {
      position: absolute; bottom: -28px; left: 50%; transform: translateX(-50%);
      font-family: var(--mono); font-size: 10px; letter-spacing: .12em; text-transform: uppercase;
      color: var(--cyan); white-space: nowrap;
    }
    .resolved-list { display: flex; flex-direction: column; gap: 8px; min-height: 120px; }
    .rl-item {
      font-family: var(--mono); font-size: 12px; color: var(--green);
      animation: rlIn .5s cubic-bezier(.34,1.56,.64,1);
    }
    @keyframes rlIn { from { opacity: 0; transform: translateY(10px) scale(.9); } }
    @media (prefers-reduced-motion: reduce) {
      .ch { opacity: 1; transform: none; filter: none; animation: none; }
      .masked .ch { color: transparent; }
    }
  `],
})
export class HeroComponent {
  readonly line1 = 'Your company'.split('');
  readonly line2 = 'runs itself.'.split('');

  tickets = [
    { id: 4821, label: 'Password reset — Ana C.', resolved: false },
    { id: 4822, label: 'VPN access request', resolved: false },
    { id: 4823, label: 'Invoice mismatch — PO 7823', resolved: false },
  ];
  resolvedLog: string[] = [];
  coreLabel = 'VRYX CORE';
  feeding = false;
  dragId = 0;

  private el = inject(ElementRef<HTMLElement>);
  private motion = inject(MotionService);

  constructor() {
    afterNextRender(() => {
      // subtle parallax: hero content drifts against scroll (depth layering)
      if (this.motion.reduced) return;
      const inner = this.el.nativeElement.querySelector('.inner') as HTMLElement;
      window.addEventListener('scroll', () => {
        const y = Math.min(window.scrollY, 800);
        inner.style.transform = `translateY(${y * 0.12}px)`;
        inner.style.opacity = String(1 - y / 1100);
      }, { passive: true });
    });
  }

  onDrop(e: DragEvent) {
    e.preventDefault();
    if (this.dragId) this.resolve(this.dragId);
  }

  resolve(id: number) {
    const t = this.tickets.find((t) => t.id === id);
    if (!t || t.resolved) return;
    this.feeding = true;
    this.coreLabel = 'RESOLVING…';
    t.resolved = true;
    setTimeout(() => {
      this.resolvedLog = [...this.resolvedLog, `#${t.id} resolved in ${(Math.random() * 2 + 0.8).toFixed(1)}s`];
      this.feeding = false;
      this.coreLabel = 'VRYX CORE';
      if (this.tickets.every((t) => t.resolved)) {
        setTimeout(() => {
          this.tickets = this.tickets.map((t) => ({ ...t, resolved: false }));
          this.resolvedLog = [];
        }, 3500);
      }
    }, 900);
  }
}
