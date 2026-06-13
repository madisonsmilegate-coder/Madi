import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RevealDirective } from '../directives/reveal.directive';

@Component({
  selector: 'vryx-features',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective],
  template: `
    <section class="feat" id="features">
      <div class="wrap">
        <div class="eyebrow" appReveal>Product Capabilities</div>
        <h2 class="sec-h" appReveal>Built for every layer<br>of your company</h2>
        <div class="tabs" role="tablist" appReveal>
          @for (t of tabs; track t.key) {
            <button class="tab" role="tab"
              [class.active]="active() === t.key"
              [attr.aria-selected]="active() === t.key"
              (click)="active.set(t.key)">{{ t.label }}</button>
          }
        </div>
        <div class="cards" appReveal>
          @for (c of cards(); track c.name) {
            <article class="card">
              <div class="icon" aria-hidden="true">{{ c.icon }}</div>
              <h3 class="name">{{ c.name }}</h3>
              <p class="desc">{{ c.desc }}</p>
            </article>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .feat { padding: 110px 0; position: relative; z-index: 1; }
    .tabs { display: flex; gap: 2px; margin-bottom: 40px; flex-wrap: wrap; }
    .tab {
      font-family: var(--mono); font-size: 11px; letter-spacing: .1em; text-transform: uppercase;
      padding: 12px 28px; border: 1px solid var(--line); background: transparent;
      color: var(--fog); transition: all .25s cubic-bezier(.22,.61,.36,1);
    }
    .tab.active, .tab:hover { background: var(--cyan-d); border-color: var(--cyan); color: var(--cyan); }
    .cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; }
    @media (max-width: 720px) { .cards { grid-template-columns: 1fr; } }
    .card {
      background: rgba(15,21,32,.7); border: 1px solid var(--line); padding: 36px 32px;
      transition: border-color .25s, background .25s, transform .3s cubic-bezier(.34,1.56,.64,1);
      animation: cardIn .45s cubic-bezier(.34,1.56,.64,1) both;
    }
    .card:nth-child(2) { animation-delay: 70ms; }
    .card:nth-child(3) { animation-delay: 140ms; }
    @keyframes cardIn { from { opacity: 0; transform: translateY(18px) scale(.97); } }
    .card:hover { border-color: var(--cyan); background: var(--cyan-d); transform: translateY(-4px); }
    .icon { font-size: 30px; margin-bottom: 20px; }
    .name { font-family: var(--dis); font-size: 17px; font-weight: 700; margin-bottom: 10px; letter-spacing: -.01em; }
    .desc { color: var(--fog); font-size: 15px; line-height: 1.65; }
  `],
})
export class FeaturesComponent {
  readonly tabs = [
    { key: 'ops', label: 'Operations' },
    { key: 'it', label: 'IT & Support' },
    { key: 'hr', label: 'HR & People' },
    { key: 'fin', label: 'Finance' },
  ];
  readonly active = signal('ops');

  private data: Record<string, { icon: string; name: string; desc: string }[]> = {
    ops: [
      { icon: '⚡', name: 'Workflow Automation', desc: 'Auto-trigger multi-step workflows across your stack based on request type, priority, and rules you define once.' },
      { icon: '🗺️', name: 'Process Mapping', desc: 'AI learns your actual workflows from historical data — no manual mapping. Continuously refines as patterns evolve.' },
      { icon: '📊', name: 'Ops Intelligence', desc: 'Real-time dashboards showing bottlenecks, anomalies, and opportunities. Weekly ops health reports in your inbox.' },
    ],
    it: [
      { icon: '🛡️', name: 'Auto Ticket Resolution', desc: 'Tier-1 and most Tier-2 tickets resolved autonomously. Password resets, access grants, software issues — handled.' },
      { icon: '🔍', name: 'Anomaly Detection', desc: 'Monitors systems for degradation and security events. Raises incidents before users report them, with root-cause analysis.' },
      { icon: '🔗', name: '240+ Integrations', desc: 'Native connectors to Jira, Zendesk, ServiceNow, Okta, AWS, and 235 more. Two-way sync, no data silos.' },
    ],
    hr: [
      { icon: '🧑‍💼', name: 'Onboarding Automation', desc: 'New hire provisioning, equipment requests, system access, and first-week checklists — automated from offer acceptance.' },
      { icon: '📋', name: 'Policy Q&A', desc: 'Employees get instant, accurate answers to HR policy questions from your own documentation. No more ticket backlog.' },
      { icon: '🔄', name: 'Offboarding Workflows', desc: 'Secure, compliant offboarding in minutes. Revokes access, archives assets, and generates audit-ready documentation.' },
    ],
    fin: [
      { icon: '🧾', name: 'Invoice Processing', desc: 'Extract, validate, and route invoices automatically. Flags discrepancies and policy violations before approvers see them.' },
      { icon: '💳', name: 'Spend Intelligence', desc: 'AI categorizes and analyzes company spend in real time, surfacing savings opportunities and anomalous transactions.' },
      { icon: '✅', name: 'Approval Automation', desc: 'Smart approval routing by policy, amount, and context. Routine approvals auto-approved; exceptions get human eyes.' },
    ],
  };

  cards() { return this.data[this.active()]; }
}
