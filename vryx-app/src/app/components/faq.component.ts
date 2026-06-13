import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RevealDirective } from '../directives/reveal.directive';

@Component({
  selector: 'vryx-faq',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective],
  template: `
    <section class="faq" id="faq">
      <div class="wrap">
        <div class="eyebrow" appReveal>FAQ</div>
        <h2 class="sec-h" appReveal style="margin-bottom:48px">Common questions</h2>
        <div class="list" appReveal>
          @for (f of faqs; track f.q; let i = $index) {
            <div class="item">
              <button class="q" [class.open]="open() === i"
                [attr.aria-expanded]="open() === i"
                (click)="open.set(open() === i ? -1 : i)">
                <span>{{ f.q }}</span><span class="icon" aria-hidden="true">+</span>
              </button>
              <div class="a" [style.grid-template-rows]="open() === i ? '1fr' : '0fr'">
                <div class="a-clip"><p class="a-text">{{ f.a }}</p></div>
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .faq { padding: 110px 0; position: relative; z-index: 1; }
    .list { max-width: 720px; }
    .item { border-bottom: 1px solid var(--line); }
    .q {
      width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 16px;
      padding: 24px 0; background: none; border: none; color: var(--white);
      font-size: 17px; font-weight: 500; text-align: left; transition: color .2s;
    }
    .q:hover, .q.open { color: var(--cyan); }
    .icon {
      width: 24px; height: 24px; flex-shrink: 0; border: 1px solid var(--line); border-radius: 50%;
      display: flex; align-items: center; justify-content: center; font-size: 14px; color: var(--fog);
      transition: transform .35s cubic-bezier(.34,1.56,.64,1), border-color .2s;
    }
    .q.open .icon { transform: rotate(45deg); border-color: var(--cyan); color: var(--cyan); }
    /* buttery height animation via grid-template-rows */
    .a { display: grid; transition: grid-template-rows .45s cubic-bezier(.22,.61,.36,1); }
    .a-clip { overflow: hidden; }
    .a-text { padding-bottom: 24px; color: var(--fog); font-size: 16px; line-height: 1.7; }
  `],
})
export class FaqComponent {
  readonly open = signal(-1);
  readonly faqs = [
    { q: 'How quickly can we get VRYX OS running?', a: 'Most teams are fully live within 3 business days. Our onboarding team handles integrations, data migration, and initial workflow configuration — no code required on your side.' },
    { q: "What happens when VRYX can't resolve something?", a: 'Unresolvable requests are escalated to the right human with full context pre-loaded — the original request, what VRYX tried, relevant docs, and the recommended next step.' },
    { q: 'Is our company data used to train your models?', a: 'Never. Your data is used exclusively to run VRYX OS for your organization. We are SOC 2 Type II certified and GDPR compliant; Enterprise customers get fully isolated infrastructure.' },
    { q: 'Which tools does VRYX OS integrate with?', a: '240+ native integrations including Jira, Zendesk, ServiceNow, Okta, Azure AD, Slack, Teams, Google Workspace, HubSpot, Salesforce, SAP, and all major cloud providers, plus custom webhooks.' },
    { q: 'Do we need a dedicated IT team to manage VRYX?', a: 'No. VRYX OS self-monitors and self-improves. An admin dashboard lets non-technical operators adjust rules, add workflows, and review analytics without engineering.' },
    { q: "What's the contract and cancellation policy?", a: 'Starter and Growth are month-to-month — cancel any time. Annual plans get 20% off. All plans include a 14-day free trial with no credit card required.' },
  ];
}
