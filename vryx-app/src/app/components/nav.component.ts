import { Component, HostListener, signal, ChangeDetectionStrategy } from '@angular/core';
import { MagneticDirective } from '../directives/magnetic.directive';

@Component({
  selector: 'vryx-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MagneticDirective],
  template: `
    <header class="nav" [class.stuck]="stuck()">
      <a class="logo" href="#top" (click)="logoClick()" aria-label="VRYX OS home">
        <span [class.spin]="spinning()">VRYX OS</span>
      </a>
      <nav class="links" aria-label="Primary">
        <a href="#story">How It Works</a>
        <a href="#features">Features</a>
        <a href="#pricing">Pricing</a>
        <a href="#faq">FAQ</a>
      </nav>
      <a class="cta" href="#contact" appMagnetic>Request Demo</a>
    </header>
  `,
  styles: [`
    .nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 600;
      display: flex; align-items: center; justify-content: space-between;
      padding: 22px 56px; border-bottom: 1px solid transparent;
      transition: background .4s, border-color .4s, padding .3s;
    }
    .nav.stuck {
      background: rgba(6,8,12,.88); backdrop-filter: blur(20px);
      border-color: var(--line); padding: 14px 56px;
    }
    .logo { font-family: var(--dis); font-size: 14px; font-weight: 900; color: var(--cyan); letter-spacing: .06em; }
    .logo span { display: inline-block; }
    /* easter egg: triple-click the logo */
    .logo span.spin { animation: logoSpin 1s cubic-bezier(.34,1.56,.64,1); }
    @keyframes logoSpin {
      0% { transform: rotate(0) scale(1); }
      50% { transform: rotate(360deg) scale(1.4); color: var(--violet); }
      100% { transform: rotate(720deg) scale(1); }
    }
    .links { display: flex; gap: 36px; }
    .links a {
      font-family: var(--mono); font-size: 12px; letter-spacing: .1em;
      text-transform: uppercase; color: var(--fog); transition: color .2s;
    }
    .links a:hover { color: var(--white); }
    .cta {
      font-family: var(--mono); font-size: 11px; letter-spacing: .1em;
      text-transform: uppercase; color: var(--void); background: var(--cyan);
      padding: 10px 24px; display: inline-block;
    }
    @media (max-width: 780px) {
      .nav { padding: 16px 20px; } .nav.stuck { padding: 12px 20px; }
      .links { display: none; }
    }
  `],
})
export class NavComponent {
  readonly stuck = signal(false);
  readonly spinning = signal(false);
  private clicks = 0;
  private clickTimer: ReturnType<typeof setTimeout> | undefined;

  @HostListener('window:scroll')
  onScroll() { this.stuck.set(window.scrollY > 60); }

  logoClick() {
    clearTimeout(this.clickTimer);
    if (++this.clicks >= 3) {
      this.clicks = 0;
      this.spinning.set(true);
      setTimeout(() => this.spinning.set(false), 1100);
    }
    this.clickTimer = setTimeout(() => (this.clicks = 0), 600);
  }
}
