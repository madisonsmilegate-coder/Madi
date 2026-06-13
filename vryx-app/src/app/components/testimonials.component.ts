import {
  Component, ChangeDetectionStrategy, signal, afterNextRender, inject, ElementRef,
} from '@angular/core';
import { RevealDirective } from '../directives/reveal.directive';

@Component({
  selector: 'vryx-testimonials',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective],
  template: `
    <section class="testi">
      <div class="wrap">
        <div class="eyebrow" appReveal>Customer Stories</div>
        <h2 class="sec-h" appReveal style="margin-bottom:48px">Teams that chose less noise</h2>
      </div>
      <div class="viewport" data-cursor="drag" #vp
        (mousedown)="down($event.clientX)" (touchstart)="down($event.touches[0].clientX)"
        tabindex="0" role="region" aria-label="Customer testimonials carousel"
        (keydown.arrowright)="go(idx() + 1)" (keydown.arrowleft)="go(idx() - 1)">
        <div class="track" #track [style.transform]="'translateX(' + offset() + 'px)'" [class.dragging]="dragging">
          @for (t of items; track t.name) {
            <figure class="card">
              <div class="stars" aria-hidden="true">★★★★★</div>
              <blockquote class="quote">"{{ t.quote }}"</blockquote>
              <figcaption class="author">
                <span class="avatar" aria-hidden="true">{{ t.emoji }}</span>
                <span class="who"><b>{{ t.name }}</b><i>{{ t.title }}</i></span>
              </figcaption>
            </figure>
          }
        </div>
      </div>
      <div class="dots">
        @for (t of items; track $index) {
          <button class="dot" [class.active]="idx() === $index" (click)="go($index)"
            [attr.aria-label]="'Go to testimonial ' + ($index + 1)"></button>
        }
      </div>
    </section>
  `,
  styles: [`
    .testi { padding: 110px 0; position: relative; z-index: 1; }
    .viewport { overflow: hidden; }
    .track { display: flex; gap: 24px; padding: 0 56px; width: max-content; transition: transform .45s cubic-bezier(.22,.61,.36,1); user-select: none; }
    .track.dragging { transition: none; }
    @media (max-width: 680px) { .track { padding: 0 20px; } }
    .card { flex-shrink: 0; width: 420px; background: rgba(15,21,32,.7); border: 1px solid var(--line); padding: 40px; }
    @media (max-width: 500px) { .card { width: 280px; padding: 28px; } }
    .stars { color: var(--amber); font-size: 14px; margin-bottom: 20px; letter-spacing: 2px; }
    .quote { font-size: 16px; line-height: 1.7; margin-bottom: 28px; font-style: italic; }
    .author { display: flex; align-items: center; gap: 14px; }
    .avatar { width: 44px; height: 44px; border-radius: 50%; background: var(--edge); display: flex; align-items: center; justify-content: center; font-size: 18px; }
    .who { display: flex; flex-direction: column; gap: 2px; }
    .who b { font-weight: 600; font-size: 14px; }
    .who i { font-family: var(--mono); font-size: 11px; color: var(--fog); font-style: normal; letter-spacing: .06em; }
    .dots { display: flex; justify-content: center; gap: 8px; margin-top: 32px; }
    .dot { width: 24px; height: 3px; background: var(--line); border: none; transition: background .3s, width .35s cubic-bezier(.34,1.56,.64,1); }
    .dot.active { background: var(--cyan); width: 40px; }
  `],
})
export class TestimonialsComponent {
  readonly idx = signal(0);
  readonly offset = signal(0);
  dragging = false;
  private startX = 0;
  private dx = 0;
  private cardW = 444;
  private el = inject(ElementRef<HTMLElement>);

  readonly items = [
    { emoji: '👨‍💼', name: 'Rafael Santos', title: 'CTO, FinEdge Philippines',
      quote: 'We reduced our IT support overhead by 71% in the first month. Our team now works on actual product — not the same password reset tickets over and over.' },
    { emoji: '👩‍💼', name: 'Ana Reyes', title: 'Head of People Ops, Growthly',
      quote: 'VRYX OS onboards new employees from day one without anyone lifting a finger. Our People team calls it a superpower.' },
    { emoji: '👨‍💻', name: 'Marco Lim', title: 'VP Operations, Mobius Commerce',
      quote: 'We were drowning in procurement requests. VRYX now handles 88% end-to-end. Finance spends their time on strategy, not paperwork.' },
    { emoji: '👩‍🔬', name: 'Diane Ocampo', title: 'Director of IT, MedCore PH',
      quote: 'The escalation routing alone was worth it. Urgent issues reach the right person in under 3 minutes with full context. MTTR down 4x.' },
    { emoji: '🧑‍💼', name: 'Josh Villanueva', title: 'CEO, Stackworks SEA',
      quote: 'Onboarded in 3 days, first ROI in week one. The product genuinely does what it says — rarely true of enterprise software.' },
  ];

  constructor() {
    afterNextRender(() => {
      const card = this.el.nativeElement.querySelector('.card') as HTMLElement;
      if (card) this.cardW = card.offsetWidth + 24;
      window.addEventListener('mousemove', (e) => this.move(e.clientX), { passive: true });
      window.addEventListener('mouseup', () => this.up());
      window.addEventListener('touchmove', (e) => this.move(e.touches[0].clientX), { passive: true });
      window.addEventListener('touchend', () => this.up());
      setInterval(() => { if (!this.dragging) this.go((this.idx() + 1) % this.items.length); }, 5000);
    });
  }

  down(x: number) { this.dragging = true; this.startX = x; }
  move(x: number) {
    if (!this.dragging) return;
    this.dx = x - this.startX;
    this.offset.set(-this.idx() * this.cardW + this.dx);
  }
  up() {
    if (!this.dragging) return;
    this.dragging = false;
    if (Math.abs(this.dx) > 80) this.go(this.dx < 0 ? this.idx() + 1 : this.idx() - 1);
    else this.go(this.idx());
    this.dx = 0;
  }
  go(i: number) {
    const n = Math.max(0, Math.min(i, this.items.length - 1));
    this.idx.set(n);
    this.offset.set(-n * this.cardW);
  }
}
