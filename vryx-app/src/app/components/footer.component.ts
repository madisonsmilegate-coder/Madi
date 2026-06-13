import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'vryx-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="footer">
      <div class="wrap row">
        <span class="copy">© 2026 VRYX Technologies, Inc.</span>
        <nav class="links" aria-label="Footer">
          <a href="#">Privacy</a><a href="#">Terms</a><a href="#">Security</a>
          <a href="#">Status</a><a href="#">Docs</a><a href="#">Blog</a>
        </nav>
        <span class="status">All systems operational</span>
      </div>
    </footer>
  `,
  styles: [`
    .footer { border-top: 1px solid var(--line); padding: 40px 0; background: rgba(10,14,22,.7); position: relative; z-index: 1; }
    .row { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px; }
    .copy, .links a { font-family: var(--mono); font-size: 11px; color: var(--mist); letter-spacing: .08em; }
    .links { display: flex; gap: 28px; flex-wrap: wrap; }
    .links a { text-transform: uppercase; transition: color .2s; }
    .links a:hover { color: var(--cyan); }
    .status { font-family: var(--mono); font-size: 11px; color: var(--green); letter-spacing: .08em; display: flex; align-items: center; gap: 6px; }
    .status::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: var(--green); animation: pulse 1.6s ease-in-out infinite; }
    @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:.35; } }
  `],
})
export class FooterComponent {}
