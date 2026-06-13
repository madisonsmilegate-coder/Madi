import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RevealDirective } from '../directives/reveal.directive';
import { MagneticDirective } from '../directives/magnetic.directive';

@Component({
  selector: 'vryx-pricing',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective, MagneticDirective],
  template: `
    <section class="price" id="pricing">
      <div class="wrap">
        <div class="eyebrow" appReveal>Pricing</div>
        <h2 class="sec-h" appReveal>Start free. Scale forever.</h2>
        <div class="toggle-row" appReveal>
          <span>Monthly</span>
          <button class="track" [class.on]="yearly()" (click)="flip()"
            role="switch" [attr.aria-checked]="yearly()" aria-label="Toggle yearly pricing"></button>
          <span class="lbl">Yearly</span>
          <span class="save">Save 20%</span>
        </div>
        <div class="grid" appReveal>
          @for (p of plans; track p.name) {
            <article class="card" [class.feat]="p.featured">
              @if (p.featured) { <div class="pip">Most Popular</div> }
              <div class="plan">{{ p.name }}</div>
              <div class="amount">
                @if (p.monthly) {
                  <span class="cur">$</span><span class="val" [class.flash]="flashing()">{{ yearly() ? p.yearlyP : p.monthly }}</span>
                } @else {
                  <span class="custom">Custom</span>
                }
              </div>
              <div class="period">{{ p.period }}</div>
              <p class="desc">{{ p.desc }}</p>
              <ul class="feats">
                @for (f of p.features; track f) { <li>{{ f }}</li> }
              </ul>
              <button class="buy" appMagnetic>{{ p.cta }}</button>
            </article>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .price { padding: 110px 0; position: relative; z-index: 1; }
    .toggle-row { display: flex; align-items: center; gap: 16px; margin-bottom: 56px; font-family: var(--mono); font-size: 13px; color: var(--fog); }
    .track {
      width: 52px; height: 28px; border-radius: 14px; border: 1px solid var(--line);
      background: var(--panel); position: relative; transition: background .3s, border-color .3s;
    }
    .track::after {
      content: ''; position: absolute; top: 4px; left: 4px; width: 18px; height: 18px;
      border-radius: 50%; background: var(--fog);
      transition: transform .35s cubic-bezier(.34,1.56,.64,1), background .3s;
    }
    .track.on { background: var(--cyan-d); border-color: var(--cyan); }
    .track.on::after { transform: translateX(24px); background: var(--cyan); }
    .lbl { color: var(--white); }
    .save { font-size: 10px; letter-spacing: .1em; color: var(--void); background: var(--green); padding: 3px 10px; text-transform: uppercase; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; }
    @media (max-width: 800px) { .grid { grid-template-columns: 1fr; } }
    .card { background: rgba(15,21,32,.7); border: 1px solid var(--line); padding: 44px 40px; position: relative; transition: transform .3s cubic-bezier(.34,1.56,.64,1), border-color .25s; }
    .card:hover { transform: translateY(-4px); }
    .card.feat { border-color: var(--cyan); background: rgba(0,240,255,.04); }
    .pip { position: absolute; top: 0; left: 50%; transform: translateX(-50%); font-family: var(--mono); font-size: 9px; letter-spacing: .14em; text-transform: uppercase; background: var(--cyan); color: var(--void); padding: 5px 18px; }
    .plan { font-family: var(--mono); font-size: 11px; letter-spacing: .14em; text-transform: uppercase; color: var(--fog); margin-bottom: 20px; }
    .amount { font-family: var(--dis); font-size: 56px; font-weight: 900; letter-spacing: -.04em; line-height: 1; margin-bottom: 6px; display: flex; align-items: flex-start; gap: 4px; }
    .cur { font-size: 24px; margin-top: 8px; color: var(--fog); }
    .val.flash { animation: flash .45s cubic-bezier(.34,1.56,.64,1); }
    @keyframes flash { 30% { transform: translateY(-8px) scale(1.06); color: var(--cyan); } }
    .custom { font-size: 32px; margin-top: 12px; color: var(--fog); }
    .period { font-family: var(--mono); font-size: 12px; color: var(--fog); margin-bottom: 28px; }
    .desc { color: var(--fog); font-size: 15px; line-height: 1.6; margin-bottom: 32px; }
    .feats { list-style: none; margin-bottom: 40px; display: flex; flex-direction: column; gap: 12px; }
    .feats li { font-size: 14px; color: var(--fog); display: flex; align-items: center; gap: 10px; font-family: var(--mono); }
    .feats li::before { content: '✓'; color: var(--cyan); font-weight: 700; }
    .buy { width: 100%; font-family: var(--mono); font-size: 12px; letter-spacing: .1em; text-transform: uppercase; padding: 14px; border: 1px solid var(--line); background: transparent; color: var(--white); transition: border-color .2s, color .2s; }
    .buy:hover { border-color: var(--cyan); color: var(--cyan); }
    .card.feat .buy { background: var(--cyan); color: var(--void); border-color: transparent; }
  `],
})
export class PricingComponent {
  readonly yearly = signal(false);
  readonly flashing = signal(false);

  readonly plans = [
    { name: 'Starter', monthly: 49, yearlyP: 39, period: 'per seat / month', featured: false, cta: 'Get Started Free',
      desc: 'For small teams starting their automation journey. All the essentials to replace Tier-1 ops work.',
      features: ['Up to 500 tickets/month', '3 workflow automations', 'Email & Slack integration', 'Standard analytics', 'Community support'] },
    { name: 'Growth', monthly: 149, yearlyP: 119, period: 'per seat / month', featured: true, cta: 'Start 14-Day Trial',
      desc: 'For scaling companies that want to eliminate ops overhead and focus teams on high-value work.',
      features: ['Unlimited tickets', 'Unlimited workflows', '240+ integrations', 'AI anomaly detection', 'Advanced analytics', 'Priority support (4h SLA)'] },
    { name: 'Enterprise', monthly: 0, yearlyP: 0, period: 'volume pricing available', featured: false, cta: 'Talk to Sales',
      desc: 'For large organizations that need custom models, compliance controls, and dedicated infrastructure.',
      features: ['Everything in Growth', 'Custom AI fine-tuning', 'SOC 2 Type II + HIPAA', 'Dedicated infrastructure', 'White-glove onboarding', '24/7 dedicated support'] },
  ];

  flip() {
    this.yearly.update((v) => !v);
    this.flashing.set(true);
    setTimeout(() => this.flashing.set(false), 500);
  }
}
