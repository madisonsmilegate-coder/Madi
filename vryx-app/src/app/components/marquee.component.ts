import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'vryx-marquee',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="strip" aria-hidden="true">
      <div class="track">
        @for (l of doubled; track $index) {
          <span class="item">{{ l }}</span><span class="sep">·</span>
        }
      </div>
    </div>
  `,
  styles: [`
    .strip { padding: 20px 0; border-block: 1px solid var(--line); background: rgba(10,14,22,.7); overflow: hidden; position: relative; z-index: 1; }
    .track { display: flex; width: max-content; animation: tick 38s cubic-bezier(.0,.0,1,1) infinite; }
    .strip:hover .track { animation-play-state: paused; }
    .item { font-family: var(--mono); font-size: 12px; letter-spacing: .12em; text-transform: uppercase; color: var(--mist); padding: 0 44px; white-space: nowrap; transition: color .2s; }
    .item:hover { color: var(--cyan); }
    .sep { color: var(--line); }
    @keyframes tick { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  `],
})
export class MarqueeComponent {
  private logos = ['Jira','Slack','Zendesk','Salesforce','ServiceNow','Okta','AWS','Azure','Google Workspace','HubSpot','SAP','Notion','PagerDuty','Datadog'];
  readonly doubled = [...this.logos, ...this.logos];
}
