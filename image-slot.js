/* image-slot — drag-and-drop / click-to-upload image placeholder */
class ImageSlot extends HTMLElement {
  connectedCallback() {
    const fit         = this.getAttribute('fit')         || 'cover';
    const radius      = this.getAttribute('radius')      || '0';
    const placeholder = this.getAttribute('placeholder') || 'Drop image here';

    this.style.cssText = `
      display:block; width:100%; height:100%;
      position:relative; overflow:hidden;
      border-radius:${radius}px;
    `;

    const inner = document.createElement('div');
    inner.style.cssText = `
      width:100%; height:100%; min-height:180px;
      display:flex; flex-direction:column; align-items:center; justify-content:center;
      gap:10px; padding:20px; text-align:center;
      border:1.5px dashed rgba(255,255,255,0.08);
      background:var(--surface-2,#141920);
      font-family:var(--ff-mono,'IBM Plex Mono',monospace);
      font-size:0.6875rem; color:var(--muted,#556070);
      cursor:pointer; transition:border-color 0.2s, background 0.2s;
      border-radius:${radius}px; box-sizing:border-box;
    `;
    inner.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="1.5" style="opacity:.4;flex-shrink:0">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <polyline points="21 15 16 10 5 21"/>
      </svg>
      <span style="opacity:.5;line-height:1.5">${placeholder}</span>
    `;

    this.appendChild(inner);

    // Drag-and-drop
    inner.addEventListener('dragover', e => {
      e.preventDefault();
      inner.style.borderColor = 'var(--accent,#00d4e8)';
      inner.style.background  = 'var(--accent-dim,rgba(0,212,232,0.06))';
    });
    inner.addEventListener('dragleave', () => {
      inner.style.borderColor = 'rgba(255,255,255,0.08)';
      inner.style.background  = 'var(--surface-2,#141920)';
    });
    inner.addEventListener('drop', e => {
      e.preventDefault();
      inner.style.borderColor = 'rgba(255,255,255,0.08)';
      inner.style.background  = 'var(--surface-2,#141920)';
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) this._load(file, fit, radius);
    });

    // Click to pick file
    inner.addEventListener('click', () => {
      const pick = document.createElement('input');
      pick.type = 'file';
      pick.accept = 'image/*';
      pick.onchange = () => {
        if (pick.files[0]) this._load(pick.files[0], fit, radius);
      };
      pick.click();
    });
  }

  _load(file, fit, radius) {
    const url = URL.createObjectURL(file);
    this.innerHTML = '';
    const img = document.createElement('img');
    img.src = url;
    img.alt = '';
    img.style.cssText = `
      width:100%; height:100%; display:block;
      object-fit:${fit}; border-radius:${radius}px;
    `;
    this.appendChild(img);
  }
}

customElements.define('image-slot', ImageSlot);
