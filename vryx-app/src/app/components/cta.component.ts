import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RevealDirective } from '../directives/reveal.directive';
import { MagneticDirective } from '../directives/magnetic.directive';

@Component({
  selector: 'vryx-cta',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective, MagneticDirective],
  template: `
    <section class="cta" id="contact">
      <div class="orb" aria-hidden="true"></div>
      <div class="wrap inner">
        <div class="eyebrow center" appReveal>Get Started</div>
        <h2 class="sec-h big" appReveal>Ready to give your team<br>their time back?</h2>
        <p class="sec-sub center" appReveal>Start your free trial — no credit card, no setup fees, live in 3 days.</p>
        <form class="form" appReveal (submit)="$event.preventDefault()">
          <label class="sr-only" for="email">Work email</label>
          <input class="input" id="email" type="email" placeholder="your@company.com" required />
          <button class="sub" type="submit" appMagnetic>Request Demo</button>
        </form>
        <p class="note" appReveal>No credit card required · 14-day free trial · Cancel any time</p>
      </div>
    </section>
  `,
  styles: [`
    .cta { padding: 150px 0; text-align: center; position: relative; overflow: hidden; z-index: 1; }
    .orb {
      position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
      width: 900px; height: 900px; border-radius: 50%; pointer-events: none;
      background: radial-gradient(circle, rgba(0,240,255,.07) 0%, transparent 65%);
    }
    .inner { position: relative; z-index: 1; }
    .center { justify-content: center; margin-left: auto; margin-right: auto; text-align: center; }
    .big { font-size: clamp(36px, 6vw, 80px); }
    .form { display: flex; gap: 12px; max-width: 480px; margin: 40px auto 0; flex-wrap: wrap; justify-content: center; }
    .input {
      flex: 1; min-width: 240px; background: rgba(15,21,32,.8); border: 1px solid var(--line);
      color: var(--white); font-family: var(--mono); font-size: 13px; padding: 16px 20px; outline: none;
      transition: border-color .2s;
    }
    .input::placeholder { color: var(--mist); }
    .input:focus { border-color: var(--cyan); }
    .sub {
      font-family: var(--mono); font-size: 12px; letter-spacing: .1em; text-transform: uppercase;
      background: var(--cyan); color: var(--void); border: none; padding: 16px 32px;
    }
    .sub:hover { box-shadow: 0 0 28px var(--cyan-g); }
    .note { font-family: var(--mono); font-size: 11px; color: var(--mist); margin-top: 16px; letter-spacing: .06em; }
    .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
  `],
})
export class CtaComponent {}
