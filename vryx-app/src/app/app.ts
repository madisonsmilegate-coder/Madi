import { Component, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { BackdropComponent } from './components/backdrop.component';
import { CursorComponent } from './components/cursor.component';
import { NavComponent } from './components/nav.component';
import { HeroComponent } from './components/hero.component';
import { MarqueeComponent } from './components/marquee.component';
import { StoryComponent } from './components/story.component';
import { FeaturesComponent } from './components/features.component';
import { PricingComponent } from './components/pricing.component';
import { TestimonialsComponent } from './components/testimonials.component';
import { FaqComponent } from './components/faq.component';
import { CtaComponent } from './components/cta.component';
import { FooterComponent } from './components/footer.component';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BackdropComponent, CursorComponent, NavComponent, HeroComponent,
    MarqueeComponent, StoryComponent, FeaturesComponent, PricingComponent,
    TestimonialsComponent, FaqComponent, CtaComponent, FooterComponent,
  ],
  template: `
    <vryx-backdrop />
    <vryx-cursor />
    <vryx-nav />
    <main>
      <vryx-hero />
      <vryx-marquee />
      <vryx-story />
      <vryx-features />
      <vryx-pricing />
      <vryx-testimonials />
      <vryx-faq />
      <vryx-cta />
    </main>
    <vryx-footer />
  `,
})
export class App {
  // Konami code easter egg: flips the accent to hot pink "overdrive" mode
  private konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  private pos = 0;

  @HostListener('window:keydown', ['$event'])
  onKey(e: KeyboardEvent) {
    this.pos = e.key === this.konami[this.pos] ? this.pos + 1 : 0;
    if (this.pos === this.konami.length) {
      this.pos = 0;
      const r = document.documentElement.style;
      const flipped = getComputedStyle(document.documentElement).getPropertyValue('--cyan').trim() === '#FF2ED1';
      r.setProperty('--cyan', flipped ? '#00F0FF' : '#FF2ED1');
      r.setProperty('--cyan-g', flipped ? 'rgba(0,240,255,.3)' : 'rgba(255,46,209,.35)');
      r.setProperty('--cyan-d', flipped ? 'rgba(0,240,255,.1)' : 'rgba(255,46,209,.12)');
    }
  }
}
