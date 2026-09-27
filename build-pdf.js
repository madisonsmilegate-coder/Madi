const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const fs=require('fs'), {execSync}=require('child_process');
const DOCX='/home/user/Madi/Ha-Long-Bay-Advertisement.docx';
const FD='/home/user/artifexsoftware/urw-base35-fonts/fonts/';
const b64=p=>fs.readFileSync(p).toString('base64');

// Pull the text straight out of the .docx so the PDF cannot drift from the
// Word file: same source, one rendering.
const xml=execSync(`unzip -p ${DOCX} word/document.xml`).toString();
const paras=[...xml.matchAll(/<w:p\b[^>]*>([\s\S]*?)<\/w:p>/g)]
  .map(m=>[...m[1].matchAll(/<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>/g)].map(t=>t[1]).join(''))
  .filter(t=>t.trim());
const esc=t=>t.replace(/&/g,'&amp;').replace(/</g,'&lt;');

const name=paras[0], teacher=paras[1], title=paras[2];
const mid=paras.slice(3,-1), cap=paras[paras.length-1];
const [nm,grade]=name.split(/(?=Grade and section:)/);

const bodyHtml=mid.map(t=>t.startsWith('[')
  ? `<p class="tag">${esc(t)}</p>`
  : `<p class="body">${esc(t)}</p>`).join('\n');

const html=`<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Bookman;font-weight:400;font-style:normal;
  src:url(data:font/ttf;base64,${b64(FD+'URWBookman-Light.ttf')}) format('truetype')}
@font-face{font-family:Bookman;font-weight:700;font-style:normal;
  src:url(data:font/ttf;base64,${b64(FD+'URWBookman-Demi.ttf')}) format('truetype')}
@font-face{font-family:Bookman;font-weight:400;font-style:italic;
  src:url(data:font/ttf;base64,${b64(FD+'URWBookman-LightItalic.ttf')}) format('truetype')}
@page{size:8.5in 13in;margin:1in}
html,body{margin:0;padding:0}
body{font:12pt/1.0 Bookman,serif;color:#000;-webkit-print-color-adjust:exact}
p{margin:0}
.hdr{margin-bottom:2pt}
.hdr .g{display:inline-block;margin-left:0}
.hdr .pad{display:inline-block;width:3.25in}
.teach{margin-bottom:13pt}
.pic{text-align:center;margin-bottom:9pt}
.pic img{width:4.896in;display:inline-block}
h1{font-size:14pt;font-weight:700;text-align:center;margin:0 0 15pt;line-height:1.15}
.tag{font-weight:700;margin:6pt 0 3pt}
.body{margin:0 0 9pt;text-align:left}
.cap{text-align:center;margin-top:11pt}
.cap i{font-style:italic}
.cap a{color:#1155CC;text-decoration:underline}
</style></head><body>
<p class="hdr"><span class="pad">${esc(nm.trim())}</span>${esc(grade.trim())}</p>
<p class="teach">${esc(teacher)}</p>
<div class="pic"><img src="data:image/png;base64,${b64('/home/user/Madi/halong-bay-photo.png')}"></div>
<h1>${esc(title)}</h1>
${bodyHtml}
<p class="cap">Paradise Vietnam. (n.d.). <i>Ha Long Bay Images.</i>
  <a href="https://www.paradisevietnam.com/en/halong-bay-images">https://www.paradisevietnam.com/en/halong-bay-images</a></p>
</body></html>`;

(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
  const p=await b.newPage();
  await p.setContent(html,{waitUntil:'load'});
  await p.evaluate(()=>document.fonts.ready);
  // what actually fits: 13in page less 1in margins top and bottom
  const m=await p.evaluate(async()=>{
    await document.fonts.load('12pt Bookman'); await document.fonts.load('700 12pt Bookman');
    document.body.style.width='6.5in';
    window.__rows=[...document.body.children].map(el=>({
      k:el.className||el.tagName,
      h:+el.getBoundingClientRect().height.toFixed(1),
      t:(el.textContent||'').trim().slice(0,30)}));
    return {rows:window.__rows, h:document.body.getBoundingClientRect().height,
            avail:11*96,
            probe:(()=>{const e=document.createElement('span');
              e.style.cssText='font:12pt Bookman;white-space:nowrap;position:absolute';
              e.textContent='Ha Long Bay is a UNESCO World Heritage Site, its limestone karsts shaped';
              document.body.appendChild(e);const w=e.getBoundingClientRect().width;e.remove();return w;})()};
  });
  for(const r of m.rows) console.log('  %s px  %s  %s',
      String(r.h).padStart(7), r.k.padEnd(6), r.t);
  console.log('content height : %s px  (%s pt)',m.h.toFixed(0),(m.h*0.75).toFixed(0));
  console.log('available      : %s px  (%s pt)',m.avail,(m.avail*0.75).toFixed(0));
  console.log('overflow       : %s px  (%s lines)',(m.h-m.avail).toFixed(0),((m.h-m.avail)/20).toFixed(1));
  console.log('Bookman probe  : %s px  (DejaVu was 617.4, Liberation 490.3)',m.probe.toFixed(1));
  for(const pct of [5,10,15,20]){
    const st=await p.evaluate(async q=>{
      document.body.style.letterSpacing=(q/100*6.6)+'pt';   // ~6.6pt avg advance
      const h=document.body.getBoundingClientRect().height;
      document.body.style.letterSpacing='';
      return h;
    },pct);
    console.log('  +%s%% wider glyphs -> %s px %s',String(pct).padStart(2),
                st.toFixed(0), st<=1056?'FITS':'OVERFLOWS');
  }
  await p.pdf({path:'/home/user/Madi/Ha-Long-Bay-Advertisement.pdf',
               width:'8.5in',height:'13in',printBackground:true,
               margin:{top:'1in',right:'1in',bottom:'1in',left:'1in'}});
  await b.close();
  console.log('pdf written');
})();
