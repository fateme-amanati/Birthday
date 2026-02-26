const bubbleLayer = document.getElementById('bubbleLayer');
const soundBtn = document.getElementById('soundBtn');
const soundDot = document.getElementById('soundDot');
const restartBtn = document.getElementById('restartBtn');
const diveBtn = document.getElementById('diveBtn');

const whaleTap = document.getElementById('whaleTap');
const cakeTap = document.getElementById('cakeTap');
const sprinkle = document.getElementById('sprinkle');
const dinoTap = document.getElementById('dinoTap');
const dinoBreath = document.getElementById('dinoBreath');
const sparkleLayer = document.getElementById('sparkleLayer');

let soundOn = false;
let whaleTapCount = 0;
let audioCtx = null;

function beep(type='bubble'){
  if(!soundOn) return;
  try{
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = 'sine';
    const now = audioCtx.currentTime;
    const base = type==='bubble' ? 420 : 260;
    o.frequency.setValueAtTime(base, now);
    o.frequency.exponentialRampToValueAtTime(base*1.6, now+0.06);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.12, now+0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, now+0.12);
    o.connect(g); g.connect(audioCtx.destination);
    o.start(now); o.stop(now+0.14);
  }catch(e){}
}

function setSound(on){
  soundOn = on;
  soundDot.classList.toggle('on', soundOn);
  if(soundOn) beep('soft');
}
soundBtn.addEventListener('click', ()=> setSound(!soundOn));

restartBtn.addEventListener('click', ()=>{
  window.scrollTo({top:0, behavior:'smooth'});
  whaleTapCount = 0;
  pulseSparkles(false);
});

function spawnBubble(x,y, count=1, spread=26){
  for(let i=0;i<count;i++){
    const b = document.createElement('div');
    b.className = 'bubble';
    const dx = (Math.random()*2-1) * spread;
    const dy = 120 + Math.random()*180;
    const dur = 900 + Math.random()*900;
    const size = 10 + Math.random()*16;
    b.style.left = (x - size/2) + 'px';
    b.style.top = (y - size/2) + 'px';
    b.style.width = size+'px';
    b.style.height = size+'px';
    b.style.setProperty('--dx', dx+'px');
    b.style.setProperty('--dy', dy+'px');
    b.style.setProperty('--dur', dur+'ms');
    bubbleLayer.appendChild(b);
    setTimeout(()=> b.remove(), dur+60);
  }
  beep('bubble');
}

window.addEventListener('pointerdown', (e)=>{
  const t = e.target;
  if(t && (t.closest('.chip') || t.closest('.cta') || t.closest('.nextBtn'))) return;
  spawnBubble(e.clientX, e.clientY, 2, 18);
});

// entry line-by-line
document.querySelectorAll('.entry .line').forEach(line=>{
  const d = Number(line.dataset.delay || 0);
  setTimeout(()=> line.classList.add('show'), d);
});

// dive button
diveBtn.addEventListener('click', ()=>{
  const r = diveBtn.getBoundingClientRect();
  spawnBubble(r.left + r.width/2, r.top + r.height/2, 8, 54);
  document.body.animate([
    { transform:'scale(1)', filter:'brightness(1)' },
    { transform:'scale(1.02)', filter:'brightness(1.03)' },
    { transform:'scale(1)', filter:'brightness(1)' }
  ], { duration: 700, easing:'cubic-bezier(.2,.8,.2,1)' });
  setTimeout(()=> document.getElementById('sea').scrollIntoView({behavior:'smooth'}), 260);
});

// next buttons
document.querySelectorAll('.nextBtn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const next = btn.getAttribute('data-next');
    const el = document.querySelector(next);
    if(el) el.scrollIntoView({behavior:'smooth'});
  });
});

// whale easter egg
whaleTap.addEventListener('click', (e)=>{
  whaleTapCount++;
  spawnBubble(e.clientX, e.clientY, 5, 40);
  if(whaleTapCount >= 3){
    whaleTapCount = 0;
    showToast("I’m really glad I get to celebrate you.");
    pulseSparkles(true);
  }
});

// cake sprinkle
cakeTap.addEventListener('click', (e)=>{
  spawnBubble(e.clientX, e.clientY, 4, 36);
  sprinkle.classList.remove('on');
  void sprinkle.offsetWidth;
  sprinkle.classList.add('on');
});

// dino breath
dinoTap.addEventListener('click', (e)=>{
  spawnBubble(e.clientX, e.clientY, 3, 34);
  dinoTap.animate([
    { transform:'translateY(0) rotate(0deg)' },
    { transform:'translateY(-12px) rotate(-5deg)' },
    { transform:'translateY(0) rotate(0deg)' }
  ], { duration: 520, easing:'cubic-bezier(.2,.8,.2,1)' });
  dinoBreath.classList.remove('on');
  void dinoBreath.offsetWidth;
  dinoBreath.classList.add('on');
});

// reveal on scroll
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries)=>{
  entries.forEach(en=>{
    if(en.isIntersecting) en.target.classList.add('on');
  });
},{ threshold: 0.25 });
revealEls.forEach(el=> io.observe(el));

// parallax waves
const waveLayers = document.querySelectorAll('.waves');
window.addEventListener('scroll', ()=>{
  const y = window.scrollY;
  waveLayers.forEach((w,i)=>{
    const k = (i+1) * 0.035;
    w.style.transform = `translateY(${y*k}px)`;
  });
}, { passive:true });

function pulseSparkles(on){
  if(!sparkleLayer) return;
  if(!on){ sparkleLayer.innerHTML = ''; return; }
  const n = 22;
  sparkleLayer.innerHTML = '';
  for(let i=0;i<n;i++){
    const s = document.createElement('div');
    s.style.position='absolute';
    s.style.left = (10 + Math.random()*80) + '%';
    s.style.top = (25 + Math.random()*55) + '%';
    s.style.width = (2 + Math.random()*4) + 'px';
    s.style.height = s.style.width;
    s.style.borderRadius='99px';
    s.style.background = Math.random() < .4 ? 'rgba(255,111,145,.9)' : 'rgba(200,240,255,.9)';
    s.style.boxShadow = '0 0 18px rgba(255,255,255,.35)';
    const dur = 1200 + Math.random()*1500;
    s.animate([
      { transform:'scale(.2)', opacity:0 },
      { transform:'scale(1)', opacity:1, offset:.25 },
      { transform:'scale(.1)', opacity:0 }
    ], { duration: dur, iterations: Infinity, delay: Math.random()*600 });
    sparkleLayer.appendChild(s);
  }
}

// final tap
document.getElementById('final').addEventListener('pointerdown', (e)=>{
  spawnBubble(e.clientX, e.clientY, 6, 55);
  pulseSparkles(true);
});

let toastEl = null;
function showToast(text){
  if(toastEl) toastEl.remove();
  toastEl = document.createElement('div');
  toastEl.textContent = text;
  Object.assign(toastEl.style, {
    position:'fixed', left:'50%', bottom:'90px', transform:'translateX(-50%)',
    background:'rgba(255,255,255,.12)', border:'1px solid rgba(255,255,255,.18)',
    padding:'12px 14px', borderRadius:'16px', color:'rgba(245,247,250,.92)',
    backdropFilter:'blur(10px)', maxWidth:'86vw', textAlign:'center', zIndex:90
  });
  document.body.appendChild(toastEl);
  toastEl.animate([{opacity:0, transform:'translateX(-50%) translateY(8px)'},{opacity:1, transform:'translateX(-50%) translateY(0)'}], {duration:260});
  setTimeout(()=>{
    if(!toastEl) return;
    toastEl.animate([{opacity:1},{opacity:0}], {duration:280}).onfinish = ()=> toastEl?.remove();
    toastEl = null;
  }, 2200);
}
