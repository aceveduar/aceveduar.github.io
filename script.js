
/* =========================================================
   🌟 WOW Portfolio — Single-file, Vanilla JS/CSS/HTML
   - Efecto typing
   - Partículas Canvas
   - IntersectionObserver (scroll reveal + barras progreso)
   - Navbar: blur, hamburguesa, smooth scroll (CSS)
   - Modo oscuro/claro con toggle (oscuro por defecto)
   - Cursor personalizado
   - Loader inicial
   - Proyectos generados dinámicamente (10)
   - Animación “staggered” en proyectos
   - Validación de formulario en tiempo real
   ========================================================= */

/* -----------------------------
   Loader
------------------------------*/
const loader = document.getElementById('loader');
window.addEventListener('load', ()=> {
  setTimeout(()=> loader.style.display='none', 400);
});

/* -----------------------------
   Cursor personalizado
------------------------------*/
const cursor = document.getElementById('cursor');
window.addEventListener('pointermove', e=>{
  cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
});

/* -----------------------------
   Typing Effect (Hero)
------------------------------*/
const typingEl = document.getElementById('typing');
const nameSequence = ["Eduardo Acevedo", "Aceveduar", "Lalo"]; // → Cambia el orden o elige uno
let ti=0, char=0, erasing=false, pause=0;
function typingLoop(){
  const word = nameSequence[ti % nameSequence.length];
  if(!erasing){
    typingEl.textContent = word.slice(0, ++char);
    if(char === word.length){ erasing = true; pause = 18; }
  }else{
    if(pause-- <= 0){
      typingEl.textContent = word.slice(0, --char);
      if(char === 0){ erasing = false; ti++; }
    }
  }
  setTimeout(typingLoop, erasing ? 60 : 90);
}
typingLoop();

/* -----------------------------
   Navbar: hamburguesa + blur
------------------------------*/
const hamb = document.getElementById('hamb');
const mobile = document.getElementById('mobile');
hamb.addEventListener('click', ()=>{
  const open = mobile.style.display === 'block';
  mobile.style.display = open ? 'none' : 'block';
  hamb.querySelector('span').style.transform = open ? '' : 'rotate(90deg)';
});
mobile.querySelectorAll('a').forEach(a=> a.addEventListener('click', ()=> mobile.style.display='none'));

/* -----------------------------
   Botón CTA glow (ratón)
------------------------------*/
document.querySelectorAll('.btn').forEach(btn=>{
  btn.addEventListener('pointermove', e=>{
    const r = btn.getBoundingClientRect();
    btn.style.setProperty('--x', (e.clientX - r.left) + 'px');
    btn.style.setProperty('--y', (e.clientY - r.top) + 'px');
  });
});

/* -----------------------------
   Dark / Light Mode
------------------------------*/
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;
const savedTheme = localStorage.getItem('theme');
if(savedTheme === 'light') root.classList.add('light');
themeToggle.addEventListener('click', ()=>{
  root.classList.toggle('light');
  localStorage.setItem('theme', root.classList.contains('light') ? 'light' : 'dark');
});

/* -----------------------------
   Partículas Canvas (network)
------------------------------*/
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d', { alpha:true });
let W=innerWidth, H=innerHeight;
let points = [], mouse = {x:-9999,y:-9999};
function resize(){ W=canvas.width=innerWidth; H=canvas.height=innerHeight; }
window.addEventListener('resize', resize); resize();

const COUNT = Math.min(120, Math.floor((W*H)/12000));
for(let i=0;i<COUNT;i++){
  points.push({
    x: Math.random()*W, y: Math.random()*H,
    vx: (Math.random()*2-1)*.35, vy:(Math.random()*2-1)*.35,
    r: Math.random()*1.8+0.6
  });
}
window.addEventListener('pointermove', e=> (mouse.x=e.clientX, mouse.y=e.clientY));
function step(){
  ctx.clearRect(0,0,W,H);
  for(const p of points){
    p.x += p.vx; p.y += p.vy;
    if(p.x<0||p.x>W) p.vx*=-1;
    if(p.y<0||p.y>H) p.vy*=-1;
    // atracción ligera al mouse
    const dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx*dx+dy*dy;
    if(d2 < 150*150){
      p.vx += -dx*0.00003; p.vy += -dy*0.00003;
    }
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fillStyle = 'rgba(57,255,20,.8)';
    ctx.fill();

    // líneas cercanas
    for(const q of points){
      const ddx=p.x-q.x, ddy=p.y-q.y, dist2=ddx*ddx+ddy*ddy;
      if(dist2< 120*120){
        const alpha = 1 - Math.sqrt(dist2)/120;
        ctx.strokeStyle = `rgba(0, 230, 255, ${alpha*.25})`;
        ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y); ctx.stroke();
      }
    }
  }
  requestAnimationFrame(step);
}
step();

/* -----------------------------
   Scroll Reveal + Progress Bars
------------------------------*/
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('in-view');
      // animar children stagger
      if(e.target.classList.contains('stagger')){
        [...e.target.children].forEach((el, i)=>{
          requestAnimationFrame(()=> {
            el.style.transitionDelay = (i*70)+'ms';
            el.style.opacity = 1; el.style.transform='none';
          });
        });
      }
      // barras de skill
      e.target.querySelectorAll('.bar span').forEach(span=>{
        const level = +span.dataset.level || 70;
        requestAnimationFrame(()=> span.style.width = level+'%');
      });
      observer.unobserve(e.target);
    }
  });
},{ threshold:.15 });

document.querySelectorAll('.invisible, .stagger').forEach(el=> observer.observe(el));

/* -----------------------------
   Generar 10 Proyectos
------------------------------*/
const projectsEl = document.getElementById('projects');
const techs = [
  ['React','Node','Postgres'],
  ['Web Components','Node','MongoDB'],
  ['TS','Express','Redis'],
  ['HTML','CSS','JS'],
  ['GraphQL','Node','Docker'],
  ['Canvas','WebSocket','Vite'],
  ['SSR','REST','CI/CD'],
  ['Auth','Stripe','Postgres'],
  ['Workers','Cache','CDN'],
  ['Maps','Geocoding','PWA']
];

function svgPlaceholder(title){
  const g1 = '%2300ff88', g2 = '%2300b3ff';
  return `data:image/svg+xml;utf8,
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 500'>
    <defs>
      <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0%' stop-color='${g1}'/>
        <stop offset='100%' stop-color='${g2}'/>
      </linearGradient>
    </defs>
    <rect width='800' height='500' fill='%230b1116'/>
    <circle cx='130' cy='110' r='90' fill='url(%23g)' opacity='.7'/>
    <rect x='520' y='70' width='200' height='200' rx='24' fill='url(%23g)' opacity='.35'/>
    <text x='50%' y='86%' text-anchor='middle' fill='%23a8ffce' font-size='28' font-family='monospace'>${title}</text>
  </svg>`;
}

for(let i=1;i<=10;i++){
  const t = techs[(i-1)%techs.length];
  const card = document.createElement('article');
  card.className='card invisible';
  card.innerHTML = `
    <div class="thumb">
      <img alt="Proyecto ${i}" src="${svgPlaceholder('Proyecto '+i)}">
    </div>
    <div class="content">
      <h3 style="margin:6px 0 6px">Proyecto ${i}</h3>
      <p class="muted" style="margin:0 0 10px">Aplicación moderna con enfoque en rendimiento y DX. Arquitectura limpia y componentes reutilizables.</p>
      <div class="tech">
        ${t.map(x=>`<span class="pill">${x}</span>`).join('')}
      </div>
      <div class="actions">
        <a class="btn small neon" href="#" role="button">Ver Demo<span class="glow"></span></a>
        <a class="btn small" href="#" role="button">Ver Código</a>
      </div>
    </div>
  `;
  projectsEl.appendChild(card);
  observer.observe(card);
}

/* -----------------------------
   Back to Top
------------------------------*/
const toTop = document.getElementById('toTop');
window.addEventListener('scroll', ()=>{
  if(scrollY > 600) toTop.classList.add('show'); else toTop.classList.remove('show');
});

/* -----------------------------
   Validación en tiempo real
------------------------------*/
const form = document.getElementById('form');
const fields = {
  name: { el: document.getElementById('name'), msg: document.getElementById('msg-name'), test: v=> v.trim().length>=2, error:'Ingresa al menos 2 caracteres.' },
  email:{ el: document.getElementById('email'), msg: document.getElementById('msg-email'), test: v=> /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), error:'Ingresa un email válido.' },
  message:{ el: document.getElementById('message'), msg: document.getElementById('msg-message'), test: v=> v.trim().length>=10, error:'Cuéntame un poco más (≥ 10 caracteres).' }
};
for(const k in fields){
  const f = fields[k];
  const handler = ()=>{
    const ok = f.test(f.el.value);
    f.el.classList.toggle('error', !ok);
    f.msg.textContent = ok ? '' : f.error;
  };
  f.el.addEventListener('input', handler);
  f.el.addEventListener('blur', handler);
}
const statusEl = document.getElementById('form-status');
form.addEventListener('submit', e=>{
  e.preventDefault();
  // Validación final
  let ok = true;
  for(const k in fields){
    const f = fields[k];
    if(!f.test(f.el.value)){ ok=false; f.el.classList.add('error'); f.msg.textContent=f.error; }
  }
  if(!ok){ statusEl.textContent = 'Por favor, corrige los campos resaltados.'; return; }

  // Simulación de envío (fetch a tu endpoint)
  statusEl.textContent = 'Enviando…';
  setTimeout(()=>{
    statusEl.textContent = '¡Gracias! Mensaje enviado correctamente.';
    form.reset();
  }, 800);
});

/* -----------------------------
   Accesibilidad menor
------------------------------*/
document.getElementById('ctaProjects').addEventListener('keydown', e=>{
  if(e.key==='Enter' || e.key===' ') e.currentTarget.click();
});
