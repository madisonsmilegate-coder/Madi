/* tweaks-panel.jsx — Floating design tweaks panel (React island) */
/* globals React */

const { useState } = React;

function TweaksPanel({ config, onChange }) {
  const [open, setOpen] = useState(false);

  const panelStyle = {
    position: 'fixed', bottom: 24, right: 24, zIndex: 999,
    fontFamily: "'IBM Plex Mono', monospace",
  };
  const cardStyle = {
    marginBottom: 8,
    background: '#0e1116',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 4,
    width: 264,
    overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(0,0,0,0.65)',
  };
  const barStyle = {
    padding: '10px 14px',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    fontSize: 10, color: '#556070', letterSpacing: '0.12em',
  };
  const bodyStyle = {
    padding: '14px 14px',
    display: 'flex', flexDirection: 'column', gap: 18,
    maxHeight: 420, overflowY: 'auto',
  };
  const triggerStyle = {
    display: 'flex', alignItems: 'center', gap: 8,
    background: '#0e1116',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 3, padding: '8px 14px',
    cursor: 'pointer', color: '#d8dce4',
    fontSize: 11, letterSpacing: '0.08em',
    fontFamily: "'IBM Plex Mono', monospace",
    transition: 'border-color 0.2s',
  };

  return (
    <div style={panelStyle}>
      {open && (
        <div style={cardStyle}>
          <div style={barStyle}>// TWEAKS</div>
          <div style={bodyStyle}>
            {config.map(item => (
              <TweakControl key={item.key} item={item} onChange={onChange} />
            ))}
          </div>
        </div>
      )}
      <button
        style={triggerStyle}
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close tweaks panel' : 'Open tweaks panel'}
      >
        <span style={{ fontSize: 14 }}>{open ? '✕' : '⚙'}</span>
        {open ? 'CLOSE' : 'TWEAKS'}
      </button>
    </div>
  );
}

function TweakControl({ item, onChange }) {
  const labelStyle = {
    display: 'block', fontSize: 10, color: '#556070',
    letterSpacing: '0.08em', marginBottom: 6,
  };
  const valueStyle = { fontSize: 11, color: '#d8dce4' };

  if (item.type === 'color') {
    return (
      <div>
        <label style={labelStyle}>{item.label.toUpperCase()}</label>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <input
            type="color"
            value={item.value}
            onChange={e => onChange(item.key, e.target.value)}
            style={{
              width: 32, height: 28, border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 2, cursor: 'pointer', background: 'none', padding: 2,
            }}
          />
          <span style={valueStyle}>{item.value}</span>
        </div>
      </div>
    );
  }

  if (item.type === 'select') {
    return (
      <div>
        <label style={labelStyle}>{item.label.toUpperCase()}</label>
        <select
          value={item.value}
          onChange={e => onChange(item.key, e.target.value)}
          style={{
            background: '#141920', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 2, color: '#d8dce4', fontSize: 11,
            padding: '6px 10px', width: '100%',
            fontFamily: "'IBM Plex Mono', monospace", cursor: 'pointer',
          }}
        >
          {item.options.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
    );
  }

  if (item.type === 'range') {
    return (
      <div>
        <label style={labelStyle}>
          {item.label.toUpperCase()}&nbsp;
          <span style={valueStyle}>{item.value}{item.unit || ''}</span>
        </label>
        <input
          type="range"
          min={item.min} max={item.max} step={item.step || 1}
          value={item.value}
          onChange={e => onChange(item.key, Number(e.target.value))}
          style={{ width: '100%', accentColor: '#00d4e8' }}
        />
      </div>
    );
  }

  return null;
}
