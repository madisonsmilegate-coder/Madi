/* assets/tweaks.jsx — Tweaks config + mount */
/* globals React, ReactDOM, TweaksPanel */

const TWEAKS = [
  {
    key:   '--accent',
    type:  'color',
    label: 'Accent Color',
    value: '#00d4e8',
  },
  {
    key:   '--bg',
    type:  'color',
    label: 'Background',
    value: '#080a0d',
  },
  {
    key:   '--surface',
    type:  'color',
    label: 'Surface',
    value: '#0e1116',
  },
  {
    key:   'grid-opacity',
    type:  'range',
    label: 'Grid Opacity',
    value: 5,
    min:   0,
    max:   20,
    unit:  '%',
  },
  {
    key:     '--ff-head',
    type:    'select',
    label:   'Heading Font',
    value:   "'Chakra Petch', sans-serif",
    options: [
      { value: "'Chakra Petch', sans-serif", label: 'Chakra Petch' },
      { value: "'IBM Plex Mono', monospace", label: 'IBM Plex Mono' },
      { value: "'IBM Plex Sans', sans-serif", label: 'IBM Plex Sans' },
    ],
  },
];

let tweakState = TWEAKS.map(t => ({ ...t }));

function applyTweak(key, value) {
  tweakState = tweakState.map(t => t.key === key ? { ...t, value } : t);

  if (key.startsWith('--')) {
    document.documentElement.style.setProperty(key, value);
  } else if (key === 'grid-opacity') {
    const opacity = value / 100;
    document.querySelectorAll('.scene-grid').forEach(el => {
      el.style.opacity = opacity * 5;  // 0–100% maps to 0–0.5 visual
    });
  }

  renderTweaks();
}

function renderTweaks() {
  ReactDOM.render(
    React.createElement(TweaksPanel, { config: tweakState, onChange: applyTweak }),
    document.getElementById('tweaks-root')
  );
}

renderTweaks();
