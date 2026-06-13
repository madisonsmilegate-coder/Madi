import {
  Component, ChangeDetectionStrategy, signal, afterNextRender, inject, ElementRef,
} from '@angular/core';
import { RevealDirective } from '../directives/reveal.directive';
import { MotionService } from '../services/motion.service';

/**
 * Sticky scroll storytelling + scroll-linked text effects: as each step
 * crosses the viewport center its key phrase fills with color.
 */
@Component({
  selector: 'vryx-story',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective],
  template: `
    <section class="story" id="story">
      <div class="grid">
        <div class="steps">
          <div class="eyebrow" appReveal>How It Works</div>
          <h2 class="sec-h" appReveal>From chaos to calm,<br>autonomously.</h2>

          @for (s of steps; track s.num; let i = $index) {
            <article class="step" [class.active]="active() === i">
              <div class="num">{{ s.num }} — {{ s.tag }}</div>
              <h3 class="sh"><span class="fill" [class.lit]="active() === i">{{ s.title }}</span></h3>
              <p class="sp">{{ s.body }}</p>
            </article>
          }
        </div>

        <div class="visual">
          @for (s of steps; track s.num; let i = $index) {
            <div class="panel" [class.active]="active() === i">
              <div class="big" [style.color]="s.color">{{ s.metric }}</div>
              <div class="unit">{{ s.unit }}</div>
              <div class="bars">
                @for (b of s.bars; track b.label) {
                  <div class="bar-row">
                    <span class="bl">{{ b.label }}</span>
                    <div class="bt"><div class="bf" [style.width]="active() === i ? b.pct + '%' : '0%'" [style.background]="s.color"></div></div>
                    <span class="bv">{{ b.pct }}%</span>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .story { padding: 120px 0; position: relative; z-index: 1; }
    .grid { max-width: 1120px; margin: 0 auto; padding: 0 56px; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; }
    @media (max-width: 900px) { .grid { grid-template-columns: 1fr; gap: 40px; padding: 0 20px; } }
    .step { padding: 44px 0; border-bottom: 1px solid var(--line); opacity: .35; transition: opacity .5s cubic-bezier(.22,.61,.36,1); }
    .step:last-child { border-bottom: none; }
    .step.active { opacity: 1; }
    .num { font-family: var(--mono); font-size: 11px; color: var(--cyan); letter-spacing: .15em; text-transform: uppercase; margin-bottom: 16px; }
    .sh { font-family: var(--dis); font-size: clamp(18px, 2.5vw, 26px); font-weight: 700; margin-bottom: 12px; letter-spacing: -.01em; }
    /* scroll-linked text fill */
    .fill {
      background: linear-gradient(90deg, var(--cyan) 50%, var(--white) 50%);
      background-size: 200% 100%; background-position: 100% 0;
      -webkit-background-clip: text; background-clip: text; color: transparent;
      transition: background-position .9s cubic-bezier(.22,.61,.36,1);
    }
    .fill.lit { background-position: 0 0; }
    .sp { color: var(--fog); font-size: 16px; line-height: 1.65; max-width: 420px; }
    .visual { position: sticky; top: 16vh; height: 520px; background: rgba(15,21,32,.7); backdrop-filter: blur(8px); border: 1px solid var(--line); overflow: hidden; }
    @media (max-width: 900px) { .visual { position: relative; top: auto; height: 340px; } }
    .panel {
      position: absolute; inset: 0; padding: 48px; display: flex; flex-direction: column; justify-content: center;
      opacity: 0; transform: translateY(18px) scale(.98);
      transition: opacity .5s cubic-bezier(.22,.61,.36,1), transform .55s cubic-bezier(.34,1.56,.64,1);
      pointer-events: none;
    }
    .panel.active { opacity: 1; transform: none; }
    .big { font-family: var(--dis); font-size: 76px; font-weight: 900; letter-spacing: -.04em; line-height: 1; text-align: center; }
    .unit { font-family: var(--mono); font-size: 12px; color: var(--mist); letter-spacing: .1em; text-transform: uppercase; text-align: center; margin: 10px 0 36px; }
    .bars { display: flex; flex-direction: column; gap: 12px; }
    .bar-row { display: flex; align-items: center; gap: 12px; font-family: var(--mono); font-size: 11px; color: var(--fog); }
    .bl { width: 80px; }
    .bt { flex: 1; height: 4px; background: var(--edge); border-radius: 2px; overflow: hidden; }
    .bf { height: 100%; border-radius: 2px; transition: width 1s cubic-bezier(.22,.61,.36,1) .15s; }
    .bv { width: 36px; text-align: right; color: var(--cyan); font-size: 10px; }
  `],
})
export class StoryComponent {
  readonly active = signal(0);
  private el = inject(ElementRef<HTMLElement>);
  private motion = inject(MotionService);

  readonly steps = [
    { num: '01', tag: 'Ingestion', title: 'Every request, automatically captured', color: 'var(--cyan)',
      body: 'VRYX OS monitors email, Slack, your helpdesk, and custom webhooks 24/7. Every request is classified, prioritized, and queued in milliseconds.',
      metric: '1,247', unit: 'Requests ingested this week',
      bars: [{ label: 'Email', pct: 72 }, { label: 'Slack', pct: 18 }, { label: 'API', pct: 10 }] },
    { num: '02', tag: 'AI Resolution', title: 'The AI resolves 94% without humans', color: 'var(--green)',
      body: 'Our reasoning engine diagnoses the problem, retrieves context from your knowledge base, executes the fix, and replies — automatically.',
      metric: '94%', unit: 'Fully auto-resolved',
      bars: [{ label: 'Tier 1', pct: 99 }, { label: 'Tier 2', pct: 88 }, { label: 'Tier 3', pct: 61 }] },
    { num: '03', tag: 'Smart Escalation', title: 'The rest reach the right person instantly', color: 'var(--amber)',
      body: 'Complex issues route to the right specialist with full context pre-loaded. No more "explain your problem again."',
      metric: '2.4m', unit: 'Average escalation routing time',
      bars: [{ label: 'P1 Critical', pct: 95 }, { label: 'P2 High', pct: 75 }, { label: 'P3 Medium', pct: 50 }] },
    { num: '04', tag: 'Continuous Learning', title: 'Gets smarter with every interaction', color: 'var(--violet)',
      body: 'VRYX learns your company’s patterns and edge cases. Resolution rates improve week over week with zero manual training.',
      metric: '+12%', unit: 'Resolution improvement / month',
      bars: [{ label: 'Week 1', pct: 72 }, { label: 'Week 4', pct: 82 }, { label: 'Week 8', pct: 94 }] },
  ];

  constructor() {
    afterNextRender(() => {
      const stepEls = Array.from(this.el.nativeElement.querySelectorAll('.step')) as HTMLElement[];
      const update = () => {
        let best = 0;
        stepEls.forEach((s, i) => {
          const r = s.getBoundingClientRect();
          if (r.top < innerHeight * 0.55 && r.bottom > 0) best = i;
        });
        if (best !== this.active()) this.active.set(best);
      };
      window.addEventListener('scroll', update, { passive: true });
      update();
      if (this.motion.reduced) this.active.set(0);
    });
  }
}
