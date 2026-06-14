/* ---------- keyboard geometry ---------- */
const U=58, GAP=6, PAD=34, MARGIN=26;
const contentW=18.25*U-GAP, contentH=6.5*U-GAP;
const caseW=contentW+2*PAD, caseH=contentH+2*PAD;
const vbW=caseW+2*MARGIN, vbH=caseH+2*MARGIN;
const oX=MARGIN+PAD, oY=MARGIN+PAD;

/* ---------- key map ---------- */
const keys=[];
const K=(x,y,w,k,l)=>keys.push({x,y,w,k,l});
const W='white',G='green',D='gold';

K(0,0,1,D,['s','Esc']);
['F1','F2','F3','F4'].forEach((f,i)=>K(2+i,0,1,W,['s',f]));
['F5','F6','F7','F8'].forEach((f,i)=>K(6.5+i,0,1,G,['s',f]));
['F9','F10','F11','F12'].forEach((f,i)=>K(11+i,0,1,W,['s',f]));
K(15.25,0,1,G,['tl','Print']); K(16.25,0,1,G,['tl2','Scroll','Lock']); K(17.25,0,1,G,['tl','Pause']);

const yn=1.5;
[['~','`'],['!','1'],['@','2'],['#','3'],['$','4'],['%','5'],['^','6'],['&','7'],['*','8'],['(','9'],[')','0'],['_','-'],['+','=']]
  .forEach((d,i)=>K(i,yn,1,W,['d',d[0],d[1]]));
K(13,yn,2,G,['tr','Backspace','←']);
K(15.25,yn,1,G,['tl','Insert']); K(16.25,yn,1,G,['tl','Home']); K(17.25,yn,1,G,['tl','PgUp']);

const yq=2.5;
K(0,yq,1.5,G,['tab']);
'QWERTYUIOP'.split('').forEach((c,i)=>K(1.5+i,yq,1,W,['c',c]));
K(11.5,yq,1,W,['d','{','[']); K(12.5,yq,1,W,['d','}',']']); K(13.5,yq,1.5,W,['d','|','\\']);
K(15.25,yq,1,G,['tl','Delete']); K(16.25,yq,1,G,['tl','End']); K(17.25,yq,1,G,['tl','PgDn']);

const yh=3.5;
K(0,yh,1.75,G,['tl','Caps Lock']);
'ASDFGHJKL'.split('').forEach((c,i)=>K(1.75+i,yh,1,W,['c',c]));
K(10.75,yh,1,W,['d',':',';']); K(11.75,yh,1,W,['d','"',"'"]);
K(12.75,yh,2.25,D,['enter']);

const ya=4.5;
K(0,ya,2.25,G,['shift']);
'ZXCVBNM'.split('').forEach((c,i)=>K(2.25+i,ya,1,W,['c',c]));
K(9.25,ya,1,W,['d','<',',']); K(10.25,ya,1,W,['d','>','.']); K(11.25,ya,1,W,['d','?','/']);
K(12.25,ya,2.75,G,['shift']);
K(16.25,ya,1,G,['a','↑']);

const yb=5.5;
K(0,yb,1.25,G,['tl','Control']); K(1.25,yb,1.25,G,['tl','Super']); K(2.5,yb,1.25,G,['tl','Alt']);
K(3.75,yb,7.5,W,['blank']);
K(11.25,yb,1.25,G,['tl','Alt']); K(12.5,yb,1.25,G,['tl','Fn']); K(13.75,yb,1.25,G,['tl','Control']);
K(15.25,yb,1,G,['a','←']); K(16.25,yb,1,G,['a','↓']); K(17.25,yb,1,G,['a','→']);

/* ---------- color helpers ---------- */
function toRgb(h){h=h.replace('#','');if(h.length===3)h=h.split('').map(c=>c+c).join('');return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)];}
function toHex(r){return '#'+r.map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join('');}
function mix(hex,t,a){const c=toRgb(hex);return toHex([0,1,2].map(i=>c[i]+(t[i]-c[i])*a));}
const lighten=(h,a)=>mix(h,[255,255,255],a);
const darken =(h,a)=>mix(h,[0,0,0],a);

function hexToHsl(hex){
  const [r,g,b]=toRgb(hex).map(v=>v/255);
  const max=Math.max(r,g,b), min=Math.min(r,g,b), d=max-min;
  let h=0; const l=(max+min)/2;
  const s=d===0?0:d/(1-Math.abs(2*l-1));
  if(d!==0){
    if(max===r) h=((g-b)/d)%6;
    else if(max===g) h=(b-r)/d+2;
    else h=(r-g)/d+4;
    h*=60; if(h<0) h+=360;
  }
  return [h, s*100, l*100];
}
function hslToHex(h,s,l){
  h=((h%360)+360)%360; s/=100; l/=100;
  const c=(1-Math.abs(2*l-1))*s, x=c*(1-Math.abs((h/60)%2-1)), m=l-c/2;
  let r=0,g=0,b=0;
  if(h<60){r=c;g=x;} else if(h<120){r=x;g=c;} else if(h<180){g=c;b=x;}
  else if(h<240){g=x;b=c;} else if(h<300){r=x;b=c;} else {r=c;b=x;}
  return toHex([(r+m)*255,(g+m)*255,(b+m)*255]);
}

/* ---------- legend rendering ---------- */
const TXT={white:'#243a5e',green:'#eef0e8',gold:'#2b2b2b'};
const SKIRT={white:'#d6d2c6',green:'#123026',gold:'#a8893f'};
const FILL={white:'url(#gWhite)',green:'url(#gGreen)',gold:'url(#gGold)'};
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

function keysSVG(){
  let p='';
  for(const {x,y,w,k,l} of keys){
    const kx=oX+x*U, ky=oY+y*U, kw=w*U-GAP, kh=U-GAP;
    const tsx=kx+3, tsy=ky+2, tsw=kw-6, tsh=kh-9;
    p+=`<rect x="${kx.toFixed(1)}" y="${ky.toFixed(1)}" width="${kw.toFixed(1)}" height="${kh.toFixed(1)}" rx="7" fill="${SKIRT[k]}"/>`;
    p+=`<rect x="${tsx.toFixed(1)}" y="${tsy.toFixed(1)}" width="${tsw.toFixed(1)}" height="${tsh.toFixed(1)}" rx="6" fill="${FILL[k]}"/>`;
    const cx=tsx+tsw/2, cy=tsy+tsh/2, col=TXT[k], t=l[0];
    const T=(x,y,s,sz,extra='')=>`<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" fill="${col}" font-size="${sz}" ${extra}>${esc(s)}</text>`;
    if(t==='c') p+=T(cx,cy,l[1],21,'font-weight="500" text-anchor="middle" dominant-baseline="central"');
    else if(t==='s') p+=T(cx,cy,l[1],14,'font-weight="500" text-anchor="middle" dominant-baseline="central"');
    else if(t==='d'){p+=T(cx,tsy+tsh*0.34,l[1],15,'text-anchor="middle" dominant-baseline="central"');p+=T(cx,tsy+tsh*0.72,l[2],15,'text-anchor="middle" dominant-baseline="central"');}
    else if(t==='tl') p+=T(kx+11,ky+19,l[1],12.5,'font-weight="500" text-anchor="start"');
    else if(t==='tl2'){p+=T(kx+11,ky+18,l[1],12.5,'font-weight="500" text-anchor="start"');p+=T(kx+11,ky+32,l[2],12.5,'font-weight="500" text-anchor="start"');}
    else if(t==='tr') p+=T(kx+kw-12,cy,l[2]+'  '+l[1],12.5,'font-weight="500" text-anchor="end" dominant-baseline="central"');
    else if(t==='tab'){p+=T(kx+11,ky+19,'Tab',12.5,'font-weight="500" text-anchor="start"');p+=T(kx+11,ky+kh-13,'↹',15,'text-anchor="start"');}
    else if(t==='enter') p+=T(cx,cy,'↵  Enter',13,'font-weight="500" text-anchor="middle" dominant-baseline="central"');
    else if(t==='shift') p+=T(kx+11,cy,'⇧  Shift',13,'font-weight="500" text-anchor="start" dominant-baseline="central"');
    else if(t==='a') p+=T(cx,cy,l[1],19,'text-anchor="middle" dominant-baseline="central"');
  }
  return p;
}

function buildSVG(base){
  const top=lighten(base,0.07), bot=darken(base,0.11), inner=lighten(base,0.24), logo=lighten(base,0.40);
  const lx=oX+17.6*U, ly=oY+3.0*U;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${vbW.toFixed(1)} ${vbH.toFixed(1)}" font-family="Inter, 'Helvetica Neue', Arial, sans-serif">
  <defs>
    <linearGradient id="gWhite" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f8f6f1"/><stop offset="1" stop-color="#ebe8de"/></linearGradient>
    <linearGradient id="gGreen" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#275e50"/><stop offset="1" stop-color="#1b463a"/></linearGradient>
    <linearGradient id="gGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dab873"/><stop offset="1" stop-color="#c5a253"/></linearGradient>
    <linearGradient id="gCase" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bot}"/></linearGradient>
    <filter id="caseShadow" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="10" stdDeviation="16" flood-color="#000000" flood-opacity="0.28"/></filter>
  </defs>
  <rect x="${MARGIN}" y="${MARGIN}" width="${caseW.toFixed(1)}" height="${caseH.toFixed(1)}" rx="22" fill="url(#gCase)" filter="url(#caseShadow)"/>
  <rect x="${(MARGIN+1.2).toFixed(1)}" y="${(MARGIN+1.2).toFixed(1)}" width="${(caseW-2.4).toFixed(1)}" height="${(caseH-2.4).toFixed(1)}" rx="21" fill="none" stroke="${inner}" stroke-width="1" opacity="0.7"/>
  <g opacity="0.6"><circle cx="${lx.toFixed(1)}" cy="${ly.toFixed(1)}" r="9" fill="none" stroke="${logo}" stroke-width="1.6"/><path d="M ${(lx-4).toFixed(1)} ${ly.toFixed(1)} a 4 4 0 0 1 8 0" fill="none" stroke="${logo}" stroke-width="1.6"/></g>
  ${keysSVG()}
</svg>`;
}

/* ---------- wiring ---------- */
const stage=document.getElementById('stage');
const preview=document.getElementById('preview');
const hex=document.getElementById('hex');
const hueR=document.getElementById('hueR'), hueN=document.getElementById('hueN');
const satR=document.getElementById('satR'), satN=document.getElementById('satN');
const ligR=document.getElementById('ligR'), ligN=document.getElementById('ligN');
const swatchesEl=document.getElementById('swatches');
const mySwatchesEl=document.getElementById('myswatches');
const myEmptyEl=document.getElementById('myempty');
const saveBtn=document.getElementById('save');

const presets=[
  ['Sort','#1b1b1d'],
  ['Grafitt','#3b3b3f'],
  ['RAL 6005','#114232'],
  ['Mørkgrønn','#1f4a43'],
  ['Dyp grønn','#2a5a50'],
  ['Salvie','#346152'],
  ['Petrol','#3c6967'],
  ['Lys salvie','#5b8a77'],
  ['Fra bildet','#4d7c6f'],
  ['Hvit','#ecebe4'],
];

let current='#4d7c6f';
let H=0,S=0,L=0;            // HSL er kilden ved finjustering – unngår avrundingsdrift
const isHex=v=>/^#?[0-9a-fA-F]{6}$/.test(v);
const norm=v=>(v.startsWith('#')?v:'#'+v).toUpperCase();

function paintTracks(){
  hueR.style.background=`linear-gradient(to right,hsl(0,${S}%,${L}%),hsl(60,${S}%,${L}%),hsl(120,${S}%,${L}%),hsl(180,${S}%,${L}%),hsl(240,${S}%,${L}%),hsl(300,${S}%,${L}%),hsl(360,${S}%,${L}%))`;
  satR.style.background=`linear-gradient(to right,hsl(${H},0%,${L}%),hsl(${H},100%,${L}%))`;
  ligR.style.background=`linear-gradient(to right,#000,hsl(${H},${S}%,50%),#fff)`;
}
function syncSliders(){
  hueR.value=hueN.value=Math.round(H);
  satR.value=satN.value=Math.round(S);
  ligR.value=ligN.value=Math.round(L);
  paintTracks();
}

// fromSlider=true: behold H/S/L slik brukeren satte dem (ingen ny avledning fra hex)
function render(v, fromSlider){
  current=v;
  stage.innerHTML=buildSVG(v);
  hex.value=norm(v);
  preview.style.background=v;
  if(fromSlider){ paintTracks(); }
  else { [H,S,L]=hexToHsl(v); syncSliders(); }
  [...swatchesEl.children, ...mySwatchesEl.children].forEach(b=>b.setAttribute('aria-pressed', String(b.dataset.hex.toLowerCase()===v.toLowerCase())));
}

const chan={hue:0,sat:1,lig:2};
function setChannel(name,val){
  const lim=name==='hue'?360:100;
  val=Math.max(0,Math.min(lim,Math.round(Number(val)||0)));
  const a=[H,S,L]; a[chan[name]]=val; [H,S,L]=a;
  if(name==='hue'){hueR.value=hueN.value=val;}
  else if(name==='sat'){satR.value=satN.value=val;}
  else {ligR.value=ligN.value=val;}
  render(hslToHex(H,S,L), true);
}
[['hue',hueR,hueN],['sat',satR,satN],['lig',ligR,ligN]].forEach(([name,r,n])=>{
  r.addEventListener('input',e=>setChannel(name,e.target.value));
  n.addEventListener('input',e=>setChannel(name,e.target.value));
});
document.querySelectorAll('.step').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const name=btn.dataset.for, cur=[H,S,L][chan[name]];
    setChannel(name, cur+Number(btn.dataset.d));
  });
});

presets.forEach(([name,val])=>{
  const b=document.createElement('button');
  b.className='sw'; b.type='button'; b.dataset.hex=val;
  b.setAttribute('aria-pressed','false');
  b.innerHTML=`<span class="chip" style="background:${val}"></span><small>${name}</small>`;
  b.addEventListener('click',()=>render(val));
  swatchesEl.appendChild(b);
});

/* ---------- saved colors (localStorage) ---------- */
const STORE_KEY='kbd-custom-colors';
const loadSaved=()=>{ try{ return JSON.parse(localStorage.getItem(STORE_KEY))||[]; }catch{ return []; } };
const persist=list=>{ try{ localStorage.setItem(STORE_KEY, JSON.stringify(list)); }catch{} };
let saved=loadSaved();

function renderSaved(){
  mySwatchesEl.innerHTML='';
  myEmptyEl.style.display=saved.length?'none':'';
  saved.forEach(val=>{
    const b=document.createElement('button');
    b.className='sw'; b.type='button'; b.dataset.hex=val;
    b.setAttribute('aria-pressed', String(val.toLowerCase()===current.toLowerCase()));
    b.innerHTML=`<span class="chip" style="background:${val}"></span><small>${norm(val)}</small>`
      +`<button class="del" type="button" aria-label="Slett farge ${norm(val)}" title="Slett">×</button>`;
    b.addEventListener('click',()=>render(val));
    b.querySelector('.del').addEventListener('click',e=>{
      e.stopPropagation();
      saved=saved.filter(c=>c.toLowerCase()!==val.toLowerCase());
      persist(saved); renderSaved();
    });
    mySwatchesEl.appendChild(b);
  });
}

saveBtn.addEventListener('click',()=>{
  const v=norm(current);
  if(saved.some(c=>c.toLowerCase()===v.toLowerCase())) return;
  saved.push(v); persist(saved); renderSaved();
});

renderSaved();

hex.addEventListener('input',e=>{ if(isHex(e.target.value)) render(norm(e.target.value)); });

document.getElementById('dl').addEventListener('click',()=>{
  const blob=new Blob([buildSVG(current)],{type:'image/svg+xml'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url; a.download='tastatur.svg'; a.click();
  URL.revokeObjectURL(url);
});

render(current);
