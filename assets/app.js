/* CrossOverseer — app.js */
(function () {
  'use strict';

  // ── Nav scroll state ────────────────────────────────────
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  // ── Mobile burger ───────────────────────────────────────
  const burger   = document.querySelector('.burger');
  const navLinks = document.querySelector('.nav-links');
  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      burger.setAttribute('aria-expanded', navLinks.classList.contains('open'));
    });
    // Close on link click
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  // ── Hero custom cursor ──────────────────────────────────
  const cursor = document.querySelector('.hero-cursor');
  const hero   = document.querySelector('.hero');
  if (cursor && hero) {
    hero.addEventListener('mousemove', e => {
      const r = hero.getBoundingClientRect();
      cursor.style.left = (e.clientX - r.left) + 'px';
      cursor.style.top  = (e.clientY - r.top)  + 'px';
    }, { passive: true });
    hero.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
    });
    hero.addEventListener('mouseenter', () => {
      cursor.style.opacity = '1';
    });
  }

  // ── Scroll reveal ───────────────────────────────────────
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('[data-reveal]').forEach(el => {
    revealObserver.observe(el);
  });

  // ── Trailer modal ───────────────────────────────────────
  const modal     = document.getElementById('trailer');
  const openBtns  = document.querySelectorAll('[data-open-trailer]');
  const closeBtns = document.querySelectorAll('.modal-close, .modal-bg');

  function openModal() {
    if (!modal) return;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    modal.querySelector('.modal-close').focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  openBtns.forEach(b => b.addEventListener('click', openModal));
  closeBtns.forEach(b => b.addEventListener('click', closeModal));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  // ── Newsletter form ─────────────────────────────────────
  const form = document.querySelector('.news-form');
  const note = document.querySelector('.news-note');
  if (form && note) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const input = form.querySelector('input');
      const val   = (input.value || '').trim();
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

      if (!valid) {
        note.textContent = '// invalid address — try again';
        note.style.color = '#ff4757';
        input.focus();
        return;
      }

      note.textContent = '// dispatch confirmed — welcome, operator';
      note.style.color = 'var(--accent)';
      input.value = '';
      input.blur();
    });
  }

  // ── Ticker animation stagger ────────────────────────────
  // Already handled via CSS nth-child delays; no JS needed.

  // ── Parallax horizon on scroll ──────────────────────────
  const horizon = document.querySelector('.hero .scene-horizon');
  if (horizon) {
    window.addEventListener('scroll', () => {
      const pct = Math.min(window.scrollY / window.innerHeight, 1);
      horizon.style.bottom = (28 + pct * 12) + '%';
    }, { passive: true });
  }
})();
