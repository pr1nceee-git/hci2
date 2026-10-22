(() => {
'use strict';

/* ================= EDIT ME ================= */
const PROFILE = {
  name: 'Prince P. Cardines',
  email: 'you@example.com',
  facebook: 'https://facebook.com/',
  instagram: 'https://instagram.com/'
};
/* =========================================== */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- bind profile ---------- */
$$('[data-name]').forEach(el => el.textContent = PROFILE.name);
$$('[data-email]').forEach(el => el.href = 'mailto:' + PROFILE.email);
$$('[data-email-text]').forEach(el => el.textContent = PROFILE.email);
$$('[data-facebook]').forEach(el => el.href = PROFILE.facebook);
$$('[data-instagram]').forEach(el => el.href = PROFILE.instagram);
document.title = PROFILE.name + ' · Barber';
const TITLE = document.title;
document.addEventListener('visibilitychange', () => {
  document.title = document.hidden ? 'Come back! Your fade isn\'t done ✂️' : TITLE;
});

/* ---------- toast ---------- */
let toastTimer;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
}

/* ---------- typing effect ---------- */
(() => {
  const roles = ['Fade Specialist', 'Basketball Lover', 'Trail Explorer', 'Scissor Artist', 'Adventure Seeker'];
  const el = $('#typed');
  let ri = 0, ci = 0, del = false;
  (function type() {
    const w = roles[ri];
    el.textContent = w.slice(0, ci);
    if (!del && ci < w.length) { ci++; setTimeout(type, 70); }
    else if (!del) { del = true; setTimeout(type, 1300); }
    else if (ci > 0) { ci--; setTimeout(type, 35); }
    else { del = false; ri = (ri + 1) % roles.length; setTimeout(type, 250); }
  })();
})();

/* ---------- counters ---------- */
$$('[data-count]').forEach(el => {
  const end = +el.dataset.count, suf = el.dataset.suffix || '', dur = 1800, t0 = performance.now();
  (function tick(t) {
    const p = clamp((t - t0) / dur, 0, 1);
    el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suf;
    if (p < 1) requestAnimationFrame(tick);
  })(t0);
});

/* ---------- reveal on scroll + progress bar ---------- */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: 0.15 });
$$('.reveal').forEach(el => io.observe(el));

const progressBar = $('#progressBar');
function onScroll() {
  const h = document.documentElement.scrollHeight - innerHeight;
  progressBar.style.width = (h > 0 ? scrollY / h * 100 : 0) + '%';
}
addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- flip cards (touch / keyboard) ---------- */
$$('.flip').forEach(c => {
  c.addEventListener('click', () => c.classList.toggle('flipped'));
  c.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); c.classList.toggle('flipped'); }
  });
});

/* ---------- photo: fallback avatar + 3D tilt ---------- */
(() => {
  const photo = $('#photo');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2a3a66"/><stop offset="1" stop-color="#e63946"/></linearGradient></defs>
  <rect width="400" height="500" fill="url(#g)"/>
  <path d="M40 500 Q60 360 200 350 Q340 360 360 500Z" fill="#141b33"/>
  <rect x="165" y="290" width="70" height="80" rx="20" fill="#c98f6c"/>
  <ellipse cx="200" cy="215" rx="88" ry="105" fill="#e0ac8b"/>
  <path d="M108 200 Q100 100 200 95 Q300 100 292 200 Q270 140 200 138 Q130 140 108 200Z" fill="#1a1a1f"/>
  <circle cx="168" cy="215" r="9" fill="#2b1b12"/><circle cx="232" cy="215" r="9" fill="#2b1b12"/>
  <path d="M160 268 Q200 300 240 268" fill="none" stroke="#7a2f2f" stroke-width="7" stroke-linecap="round"/>
  <text x="200" y="470" text-anchor="middle" font-family="Impact,sans-serif" font-size="34" fill="#fff" letter-spacing="3">ADD photo.jpg</text></svg>`;
  photo.addEventListener('error', () => { photo.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg); }, { once: true });
  if (photo.complete && !photo.naturalWidth) photo.dispatchEvent(new Event('error'));

  const card = $('#photoCard');
  card.addEventListener('pointermove', e => {
    if (reduceMotion) return;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(700px) rotateY(${x * 18}deg) rotateX(${-y * 18}deg) scale(1.03)`;
  });
  card.addEventListener('pointerleave', () => { card.style.transform = ''; });
})();

/* ================= NEW FEATURES ================= */

/* ---------- confetti ---------- */
const confettiCv = document.createElement('canvas');
confettiCv.className = 'confetti';
confettiCv.setAttribute('aria-hidden', 'true');
document.body.appendChild(confettiCv);
let confettiToken = 0;
function confetti() {
  if (reduceMotion) return;
  const c = confettiCv, x = c.getContext('2d'), token = ++confettiToken;
  c.width = innerWidth; c.height = innerHeight;
  const cols = ['#e63946', '#ffffff', '#2f6fe0', '#f4c95d'];
  const ps = Array.from({ length: 150 }, () => ({
    x: Math.random() * c.width, y: -20 - Math.random() * c.height * 0.5,
    vx: (Math.random() - 0.5) * 3, vy: 2 + Math.random() * 4,
    s: 5 + Math.random() * 7, a: Math.random() * 6.28, va: (Math.random() - 0.5) * 0.3,
    col: cols[(Math.random() * cols.length) | 0]
  }));
  const t0 = performance.now();
  (function step(t) {
    if (token !== confettiToken) return;
    x.clearRect(0, 0, c.width, c.height);
    for (const p of ps) {
      p.x += p.vx; p.y += p.vy; p.a += p.va;
      x.save(); x.translate(p.x, p.y); x.rotate(p.a);
      x.fillStyle = p.col; x.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
      x.restore();
    }
    if (t - t0 < 4200) requestAnimationFrame(step);
    else x.clearRect(0, 0, c.width, c.height);
  })(t0);
}

/* ---------- theme toggle (dark / light) ---------- */
(() => {
  const btn = $('#themeBtn');
  function apply(t) {
    document.documentElement.setAttribute('data-theme', t);
    btn.textContent = t === 'light' ? '☀️' : '🌙';
    btn.setAttribute('aria-pressed', String(t === 'light'));
  }
  let cur = document.documentElement.getAttribute('data-theme') || 'dark';
  apply(cur);
  btn.addEventListener('click', () => {
    cur = cur === 'dark' ? 'light' : 'dark';
    apply(cur);
    try { localStorage.setItem('hc1-theme', cur); } catch (e) { /* storage unavailable */ }
  });
})();

/* ---------- welcome strip ---------- */
(() => {
  const w = $('#welcome');
  $('#welcomeClose').addEventListener('click', () => w.classList.add('hide'));
})();

/* ---------- 45-second countdown badge ---------- */
(() => {
  const box = $('#timer'), num = $('#timerText'), TOTAL = 45, t0 = performance.now();
  const iv = setInterval(() => {
    const left = Math.max(0, TOTAL - Math.floor((performance.now() - t0) / 1000));
    num.textContent = left;
    box.style.setProperty('--p', (left / TOTAL * 100) + '%');
    box.classList.toggle('low', left <= 10);
    if (left === 0) {
      clearInterval(iv);
      box.classList.add('done');
      box.textContent = '🎉 45s! Thank you!';
      confetti();
      toast('🎉 45 seconds! Thanks for staying, keep exploring!');
    }
  }, 250);
})();

/* ---------- secret: click the barber pole ---------- */
$$('.pole').forEach(p => {
  const go = () => {
    p.classList.add('fast');
    confetti();
    toast('🤫 You found the secret barber pole! Fresh cuts for everyone.');
    setTimeout(() => p.classList.remove('fast'), 3000);
  };
  p.setAttribute('role', 'button'); p.setAttribute('tabindex', '0'); p.setAttribute('aria-label', 'Barber pole');
  p.addEventListener('click', go);
  p.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
});

/* ---------- before / after slider ---------- */
(() => {
  const wrap = $('#ba'); if (!wrap) return;
  const range = $('#baRange'), imgB = $('#baBefore'), imgA = $('#baAfter');
  const head = (cut) => {
    const hair = cut
      ? `<path d="M140 100 Q145 55 200 52 Q255 55 260 100 Q240 78 200 76 Q160 78 140 100Z" fill="#1a1a1f"/>
         <path d="M138 125 Q132 100 142 100 L150 140 Q140 138 138 125Z" fill="#555560" opacity=".55"/>
         <path d="M262 125 Q268 100 258 100 L250 140 Q260 138 262 125Z" fill="#555560" opacity=".55"/>`
      : `<ellipse cx="124" cy="104" rx="24" ry="38" fill="#1a1a1f"/><ellipse cx="276" cy="104" rx="24" ry="38" fill="#1a1a1f"/>
         <path d="M128 120 Q108 20 200 18 Q292 20 272 120 Q264 70 200 66 Q136 70 128 120Z" fill="#1a1a1f"/>
         <path d="M150 40 L142 8 L170 30 L184 2 L200 28 L222 4 L228 32 L258 12 L250 44Z" fill="#1a1a1f"/>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
      <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1b2140"/><stop offset="1" stop-color="#3a2a52"/></linearGradient></defs>
      <rect width="400" height="300" fill="url(#g)"/>
      <path d="M60 300 Q80 232 200 226 Q320 232 340 300Z" fill="#2a3a66"/>
      <rect x="170" y="190" width="60" height="50" rx="14" fill="#c98f6c"/>
      <ellipse cx="200" cy="135" rx="62" ry="76" fill="#e0ac8b"/>
      ${hair}
      <circle cx="178" cy="136" r="6" fill="#2b1b12"/><circle cx="222" cy="136" r="6" fill="#2b1b12"/>
      <path d="M180 170 Q200 188 220 170" fill="none" stroke="#7a2f2f" stroke-width="5" stroke-linecap="round"/>
    </svg>`;
  };
  const fb = (img, cut) => {
    const swap = () => { img.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(head(cut)); };
    img.addEventListener('error', swap, { once: true });
    if (img.complete && !img.naturalWidth) swap();
  };
  fb(imgB, false); fb(imgA, true);
  const set = v => wrap.style.setProperty('--pos', v + '%');
  range.addEventListener('input', () => set(range.value));
  set(50);
  /* a little demo swipe the first time it scrolls into view */
  let played = false;
  new IntersectionObserver((es, ob) => {
    if (!es[0].isIntersecting || played) return;
    played = true; ob.disconnect();
    if (reduceMotion) return;
    const t0 = performance.now();
    (function a(t) {
      const p = clamp((t - t0) / 1800, 0, 1);
      const v = 50 + Math.sin(p * Math.PI * 2) * 38 * (1 - p * 0.2);
      range.value = v; set(v);
      if (p < 1) requestAnimationFrame(a); else { range.value = 50; set(50); }
    })(t0);
  }, { threshold: 0.5 }).observe(wrap);
})();

/* ---------- face shape quiz ---------- */
(() => {
  const box = $('#quiz'); if (!box) return;
  const QS = [
    { q: 'How would you describe your jawline?', a: [['Soft and rounded', 'round'], ['Strong and angular', 'square'], ['Narrow, tapering to the chin', 'oval']] },
    { q: 'Your face is…', a: [['About as wide as it is long', 'round'], ['Straight sides, wide jaw', 'square'], ['Noticeably longer than wide', 'oval']] },
    { q: 'Your forehead is…', a: [['Broad and flat', 'square'], ['Medium with a curved hairline', 'round'], ['Narrow to medium', 'oval']] }
  ];
  const RES = {
    round: ['🌕 Round face', 'Go for height on top: a quiff, pompadour or high fade adds length and sharpens your look.'],
    square: ['🟫 Square face', 'Strong jaw! Try a textured crop, buzz cut or classic side part to show it off.'],
    oval: ['🥚 Oval face', 'Lucky you, almost anything works. Try a mid fade with a textured fringe or a slick back.']
  };
  let i = 0, score;
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text) n.textContent = text; return n; };
  function render() {
    box.textContent = '';
    if (i >= QS.length) {
      const top = Object.keys(score).sort((a, b) => score[b] - score[a])[0];
      box.append(el('div', 'q-step', 'Your result'), el('h4', 'q-res', RES[top][0]), el('p', 'q-text', RES[top][1]));
      const again = el('button', 'q-btn', '↻ Try again');
      again.addEventListener('click', start);
      box.append(again);
      confetti();
      return;
    }
    box.append(el('div', 'q-step', `Question ${i + 1} of ${QS.length}`), el('h4', 'q-q', QS[i].q));
    const bar = el('div', 'q-bar'); const fill = el('i'); fill.style.width = (i / QS.length * 100) + '%'; bar.append(fill); box.append(bar);
    QS[i].a.forEach(([label, key]) => {
      const b = el('button', 'q-btn', label);
      b.addEventListener('click', () => { score[key]++; i++; render(); });
      box.append(b);
    });
  }
  function start() { i = 0; score = { round: 0, square: 0, oval: 0 }; render(); }
  start();
})();

/* ---------- guess my fact ---------- */
(() => {
  const box = $('#guess'); if (!box) return;
  const btns = $$('.g-btn', box), out = $('#guessOut'), again = $('#guessAgain');
  let done = false;
  btns.forEach(b => b.addEventListener('click', () => {
    if (done) return; done = true;
    btns.forEach(x => x.classList.add(x.dataset.lie ? 'lie' : 'truth'));
    if (b.dataset.lie) { out.textContent = '🎯 Correct! That one is the lie.'; confetti(); }
    else out.textContent = '😅 Nope, that one is true! The lie is highlighted.';
    again.hidden = false;
  }));
  again.addEventListener('click', () => {
    done = false; out.textContent = 'Pick the one you think is the LIE.'; again.hidden = true;
    btns.forEach(x => x.classList.remove('lie', 'truth'));
  });
})();

/* ---------- mountain-climb scroll tracker ---------- */
(() => {
  const box = $('#climb'); if (!box) return;
  const trail = $('#climbTrail'), done = $('#climbDone'), hiker = $('#climbHiker');
  const alt = $('#climbAlt'), lab = $('#climbLabel');
  const len = trail.getTotalLength();
  done.setAttribute('d', trail.getAttribute('d'));
  const MAX = 2954; // metres (a nod to Mt. Apo)
  const STAGES = [[0, '⛺ Base camp'], [12, '🥾 Trail head'], [30, '🌲 Forest trail'], [50, '🪨 Rocky ridge'],
                  [70, '☁️ Above the clouds'], [88, '❄️ Almost there'], [97, '🚩 Summit!']];
  let summited = false;
  function update() {
    const h = document.documentElement.scrollHeight - innerHeight;
    const p = h > 0 ? clamp(scrollY / h, 0, 1) : 0;
    const pt = trail.getPointAtLength(len * p);
    hiker.setAttribute('x', pt.x); hiker.setAttribute('y', pt.y + 4);
    done.style.strokeDasharray = (len * p) + ' ' + len;
    alt.textContent = Math.round(p * MAX).toLocaleString('en-US') + ' m';
    let st = STAGES[0][1];
    for (const [t, name] of STAGES) if (p * 100 >= t) st = name;
    lab.textContent = st;
    box.classList.toggle('show', scrollY > 260);
    if (p >= 0.97 && !summited) { summited = true; confetti(); toast('🚩 Summit reached! You scrolled the whole mountain!'); }
    if (p < 0.85) summited = false;
  }
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
  update();
})();

/* ---------- basketball questions (trivia before hobbies) ---------- */
(() => {
  const box = $('#trivia'); if (!box) return;
  const QS = [
    { t: '🏀 Basketball', q: 'How many points is a shot from behind the three-point line worth?', a: ['2 points', '3 points', '4 points'], c: 1, why: 'Three points. That is why it is called a "three-pointer".' },
    { t: '🏀 Basketball', q: 'How high is a standard basketball rim?', a: ['8 feet', '10 feet', '12 feet'], c: 1, why: '10 feet (about 3.05 m) in the NBA and most competitive leagues.' },
    { t: '🏀 Basketball', q: 'How many players from one team are on the court at the same time?', a: ['4', '5', '6'], c: 1, why: 'Five per team, so ten players on the court in total.' },
    { t: '⛰️ Hiking', q: 'What should you do before starting a hike?', a: ['Check the weather and tell someone your route', 'Leave your water at home to travel light', 'Wear brand-new shoes for the first time'], c: 0, why: 'Weather can change fast, and someone should know where you are.' },
    { t: '⛰️ Hiking', q: 'What does "Leave No Trace" mean?', a: ['Take your trash with you and respect nature', 'Only hike at night', 'Mark trees with paint to find your way'], c: 0, why: 'Pack out what you pack in, and leave the trail as you found it.' },
    { t: '⛰️ Hiking', q: 'What is the highest mountain in the Philippines?', a: ['Mt. Pulag', 'Mt. Apo', 'Mt. Mayon'], c: 1, why: 'Mt. Apo in Mindanao stands at about 2,954 m.' }
  ];
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
  let i = 0, score = 0;
  function shuffle(arr) { const a = arr.slice(); for (let k = a.length - 1; k > 0; k--) { const j = (Math.random() * (k + 1)) | 0; [a[k], a[j]] = [a[j], a[k]]; } return a; }
  function render() {
    box.textContent = '';
    if (i >= QS.length) {
      const msg = score === QS.length ? '🏆 Perfect! You are ready for the court AND the trail.'
        : score >= 4 ? '🔥 Great job! You know your hoops and your hikes.'
        : '😄 Nice try! Scroll down, my hobbies might teach you a thing or two.';
      box.append(el('div', 'q-step', 'Your score'), el('h4', 'q-res', `${score} / ${QS.length}`), el('p', 'q-text', msg));
      const row = el('div', 't-row');
      const again = el('button', 'q-btn', '↻ Try again');
      again.addEventListener('click', () => { i = 0; score = 0; render(); });
      const go = el('a', 'q-btn', 'See my hobbies ↓'); go.href = '#hobbies';
      row.append(again, go); box.append(row);
      if (score >= 4) confetti();
      return;
    }
    const Q = QS[i];
    box.append(el('div', 'q-step', `${Q.t} · Question ${i + 1} of ${QS.length}`), el('h4', 'q-q', Q.q));
    const bar = el('div', 'q-bar'); const fill = el('i'); fill.style.width = (i / QS.length * 100) + '%'; bar.append(fill); box.append(bar);
    const why = el('p', 't-why'); why.hidden = true;
    const opts = shuffle(Q.a.map((text, idx) => ({ text, ok: idx === Q.c })));
    const btns = [];
    opts.forEach(o => {
      const b = el('button', 'q-btn', o.text);
      b.addEventListener('click', () => {
        btns.forEach(x => { x.disabled = true; });
        btns.forEach((x, k) => { if (opts[k].ok) x.classList.add('right'); });
        if (o.ok) score++; else b.classList.add('wrong');
        why.textContent = (o.ok ? '✅ Correct! ' : '❌ Not quite. ') + Q.why; why.hidden = false;
        const next = el('button', 't-next', i === QS.length - 1 ? 'See my score →' : 'Next question →');
        next.addEventListener('click', () => { i++; render(); });
        box.append(next); next.focus({ preventScroll: true });
      });
      btns.push(b); box.append(b);
    });
    box.append(why);
  }
  render();
})();

/* ---------- basketball shooting game ---------- */
(() => {
  const cv = $('#court'); if (!cv) return;
  const ctx = cv.getContext('2d');
  const hudS = $('#hScore'), hudK = $('#hStreak'), hudN = $('#hShots'), hudB = $('#hBest');
  let W = 0, H = 0, K = 1, G = 1100, R = 15, floorY = 0, maxPull = 100;
  const KV = 12;                                   // launch speed per pixel of pull-back
  const hoop = { x: 0, y: 0, r: 36 };
  const start = { x: 0, y: 0 };
  const ball = { x: 0, y: 0, vx: 0, vy: 0, a: 0, state: 'idle' };
  let score = 0, streak = 0, shots = 0, best = 0;
  let scored = false, touched = false, moveHoop = false;
  let tLaunch = 0, tScore = 0, floorT = 0, tDone = 0, netT = 0, visible = true, hover = false, floaters = [], clock = 0;
  try { best = parseInt(localStorage.getItem('hc1-hoops-best') || '0', 10) || 0; } catch (e) { /* storage unavailable */ }

  function hud() { hudS.textContent = score; hudK.textContent = streak; hudN.textContent = shots; hudB.textContent = best; }
  function placeHoop(random) {
    hoop.x = W * (random ? 0.64 + Math.random() * 0.18 : 0.78);
    hoop.y = H * (random ? 0.28 + Math.random() * 0.17 : 0.36);
  }
  function resetBall() {
    ball.x = start.x; ball.y = start.y; ball.vx = ball.vy = 0; ball.a = 0; ball.state = 'idle';
    if (moveHoop) { placeHoop(true); moveHoop = false; }
  }
  function layout() {
    K = clamp(W / 720, 0.55, 1.15);
    G = 1100 * K; R = 15 * K; maxPull = 100 * K; floorY = H - 48 * K;
    hoop.r = 36 * K;
    start.x = W * 0.2; start.y = floorY - R - 70 * K;
  }
  function resize() {
    const r = cv.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = r.width; H = r.height;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    layout(); placeHoop(false); resetBall();
  }
  new ResizeObserver(resize).observe(cv);
  resize(); hud();
  new IntersectionObserver(es => { visible = es[0].isIntersecting; }).observe(cv);

  /* ----- input: drag the ball back, release to shoot ----- */
  const ptr = e => { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  cv.addEventListener('pointerdown', e => {
    if (ball.state !== 'idle') return;
    const p = ptr(e);
    if (Math.hypot(p.x - ball.x, p.y - ball.y) > R * 3.2) return;
    ball.state = 'drag'; cv.setPointerCapture(e.pointerId); cv.style.cursor = 'grabbing'; moveBall(p);
  });
  function moveBall(p) {
    let dx = p.x - start.x, dy = p.y - start.y;
    const d = Math.hypot(dx, dy);
    if (d > maxPull) { dx *= maxPull / d; dy *= maxPull / d; }
    ball.x = Math.max(R, start.x + dx);
    ball.y = Math.min(floorY - R, start.y + dy);
  }
  cv.addEventListener('pointermove', e => {
    const p = ptr(e);
    if (ball.state === 'drag') moveBall(p);
    else hover = ball.state === 'idle' && Math.hypot(p.x - ball.x, p.y - ball.y) <= R * 3.2;
    if (ball.state !== 'drag') cv.style.cursor = hover ? 'grab' : 'default';
  });
  function release() {
    if (ball.state !== 'drag') return;
    cv.style.cursor = hover ? 'grab' : 'default';
    const px = start.x - ball.x, py = start.y - ball.y;
    if (Math.hypot(px, py) < 12 * K) { resetBall(); return; }       // tiny pull = cancel
    ball.vx = px * KV; ball.vy = py * KV;
    ball.state = 'fly'; shots++; hud();
    scored = false; touched = false; tLaunch = 0; floorT = 0;
  }
  cv.addEventListener('pointerup', release);
  cv.addEventListener('pointercancel', release);
  cv.addEventListener('pointerleave', () => { hover = false; });
  $('#hReset').addEventListener('click', () => { score = streak = shots = 0; moveHoop = true; resetBall(); hud(); toast('🏀 Fresh game! Good luck!'); });

  function say(txt, col) { floaters.push({ t: 0, x: hoop.x, y: hoop.y - 70 * K, txt, col }); }

  /* ----- physics ----- */
  function physics(h) {
    const py = ball.y;
    ball.vy += G * h; ball.x += ball.vx * h; ball.y += ball.vy * h; ball.a += ball.vx * h / R;
    if (scored && ball.y < hoop.y + 70 * K) ball.vx *= 1 - 5 * h;      // net slows the ball
    /* walls */
    if (ball.x < R) { ball.x = R; ball.vx = Math.abs(ball.vx) * 0.6; }
    if (ball.x > W - R) { ball.x = W - R; ball.vx = -Math.abs(ball.vx) * 0.6; }
    /* backboard */
    const bx = hoop.x + hoop.r + 7 * K, top = hoop.y - 85 * K, bot = hoop.y + 14 * K;
    if (ball.vx > 0 && ball.x + R > bx && ball.x - R < bx + 8 * K && ball.y > top && ball.y < bot) {
      ball.x = bx - R; ball.vx = -ball.vx * 0.55; touched = true;
    }
    /* rim ends */
    for (const sx of [-1, 1]) {
      const cx = hoop.x + sx * hoop.r, cy = hoop.y, rr = R + 4 * K;
      const dx = ball.x - cx, dy = ball.y - cy, d = Math.hypot(dx, dy);
      if (d < rr && d > 0) {
        const nx = dx / d, ny = dy / d;
        ball.x = cx + nx * rr; ball.y = cy + ny * rr;
        const vn = ball.vx * nx + ball.vy * ny;
        if (vn < 0) { ball.vx -= 1.55 * vn * nx; ball.vy -= 1.55 * vn * ny; touched = true; }
      }
    }
    /* basket! (must pass downward through the rim line) */
    if (!scored && py < hoop.y && ball.y >= hoop.y && ball.vy > 0 && Math.abs(ball.x - hoop.x) < hoop.r - 2 * K) {
      scored = true; tScore = tLaunch; netT = 0.7;
      const pts = touched ? 2 : 3;
      score += pts; streak++;
      if (score > best) { best = score; try { localStorage.setItem('hc1-hoops-best', String(best)); } catch (e) { /* ignore */ } }
      say(touched ? `Nice! +${pts}` : `SWISH! +${pts}`, '#f4c95d');
      if (streak === 3) toast('🔥 3 in a row!');
      if (streak === 5) { toast('🔥🔥 5 in a row! On fire!'); confetti(); }
      hud();
    }
    /* floor */
    if (ball.y + R > floorY) {
      ball.y = floorY - R;
      if (ball.vy > 150 * K) ball.vy = -ball.vy * 0.55; else ball.vy = 0;
      ball.vx *= 1 - 2 * h;
      floorT += h * 0 + 0;
    }
  }
  function finishShot() {
    ball.state = 'done'; tDone = 0.55;
    if (scored) moveHoop = true;
    else { streak = 0; say('Miss', '#ff6b75'); hud(); }
  }
  function step(dt) {
    netT = Math.max(0, netT - dt);
    floaters = floaters.filter(f => (f.t += dt) < 1.2);
    if (ball.state === 'fly') {
      const n = 4, h = dt / n;
      for (let i = 0; i < n; i++) physics(h);
      tLaunch += dt;
      if (ball.y >= floorY - R - 0.5) floorT += dt;
      if (tLaunch > 5 || floorT > 1.0 || (scored && tLaunch - tScore > 1.3)) finishShot();
    } else if (ball.state === 'done') {
      tDone -= dt; if (tDone <= 0) resetBall();
    }
  }

  /* ----- drawing ----- */
  function drawCourt() {
    let g = ctx.createLinearGradient(0, 0, 0, floorY);
    g.addColorStop(0, '#171c36'); g.addColorStop(1, '#2b3560');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, floorY);
    g = ctx.createLinearGradient(0, floorY, 0, H);
    g.addColorStop(0, '#cf8d45'); g.addColorStop(1, '#8c5a2b');
    ctx.fillStyle = g; ctx.fillRect(0, floorY, W, H - floorY);
    ctx.strokeStyle = 'rgba(0,0,0,.12)'; ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x < W; x += 44 * K) { ctx.moveTo(x, floorY); ctx.lineTo(x - 18 * K, H); }
    ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,.75)'; ctx.fillRect(0, floorY, W, 2.5 * K);
    ctx.fillStyle = 'rgba(255,255,255,.22)';
    ctx.font = `800 ${16 * K}px Inter, system-ui, sans-serif`; ctx.textAlign = 'center';
    ctx.fillText(PROFILE.name.toUpperCase(), W * 0.5, floorY + (H - floorY) * 0.68);
  }
  function drawHoop() {
    const bx = hoop.x + hoop.r + 7 * K;
    ctx.strokeStyle = '#3a4268'; ctx.lineWidth = 7 * K; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(bx + 22 * K, hoop.y - 60 * K); ctx.lineTo(bx + 22 * K, floorY); ctx.stroke();
    ctx.lineWidth = 5 * K; ctx.beginPath(); ctx.moveTo(bx + 8 * K, hoop.y - 60 * K); ctx.lineTo(bx + 22 * K, hoop.y - 60 * K); ctx.stroke();
    ctx.fillStyle = '#f1f4fb'; ctx.fillRect(bx, hoop.y - 85 * K, 8 * K, 99 * K);
    ctx.fillStyle = '#e63946'; ctx.fillRect(bx, hoop.y - 85 * K, 8 * K, 8 * K);
    ctx.strokeStyle = '#ff6b2c'; ctx.lineWidth = 4 * K;
    ctx.beginPath(); ctx.moveTo(hoop.x + hoop.r, hoop.y); ctx.lineTo(bx, hoop.y); ctx.stroke();
    ctx.lineWidth = 5 * K; ctx.beginPath(); ctx.moveTo(hoop.x - hoop.r, hoop.y); ctx.lineTo(hoop.x + hoop.r, hoop.y); ctx.stroke();
  }
  function drawNet() {
    const amp = (netT / 0.7) * 7 * K * Math.sin((0.7 - netT) * 28);
    const top = [], bot = [];
    for (let i = 0; i <= 5; i++) {
      top.push([hoop.x - hoop.r + i * (2 * hoop.r / 5), hoop.y]);
      bot.push([hoop.x - hoop.r * 0.55 + i * (1.1 * hoop.r / 5) + amp, hoop.y + 44 * K]);
    }
    ctx.strokeStyle = 'rgba(255,255,255,.85)'; ctx.lineWidth = 1.4 * K; ctx.lineCap = 'butt';
    ctx.beginPath();
    for (let i = 0; i <= 5; i++) {
      ctx.moveTo(top[i][0], top[i][1]); ctx.lineTo(bot[i][0], bot[i][1]);
      if (i < 5) { ctx.moveTo(top[i][0], top[i][1]); ctx.lineTo(bot[i + 1][0], bot[i + 1][1]); ctx.moveTo(top[i + 1][0], top[i + 1][1]); ctx.lineTo(bot[i][0], bot[i][1]); }
    }
    ctx.stroke();
  }
  function drawStand() {
    ctx.fillStyle = 'rgba(0,0,0,.28)';
    ctx.beginPath(); ctx.ellipse(start.x, floorY + 8 * K, 30 * K, 6 * K, 0, 0, 6.283); ctx.fill();
    ctx.strokeStyle = '#4a5580'; ctx.lineWidth = 6 * K; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(start.x, start.y + R + 6 * K); ctx.lineTo(start.x, floorY + 4 * K); ctx.stroke();
    ctx.fillStyle = '#4a5580'; ctx.fillRect(start.x - 15 * K, start.y + R, 30 * K, 6 * K);
  }
  function drawAim() {
    ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 3 * K; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(start.x - 15 * K, start.y + R); ctx.lineTo(ball.x, ball.y);
    ctx.moveTo(start.x + 15 * K, start.y + R); ctx.lineTo(ball.x, ball.y);
    ctx.stroke();
    const vx = (start.x - ball.x) * KV, vy = (start.y - ball.y) * KV;   // short dotted preview of the shot
    for (let i = 1; i <= 10; i++) {
      const t = i * 0.05;
      const x = ball.x + vx * t, y = ball.y + vy * t + 0.5 * G * t * t;
      ctx.fillStyle = `rgba(244,201,93,${1 - i * 0.08})`;
      ctx.beginPath(); ctx.arc(x, y, (4 - i * 0.2) * K, 0, 6.283); ctx.fill();
    }
  }
  function drawBall() {
    ctx.save(); ctx.translate(ball.x, ball.y); ctx.rotate(ball.a);
    const g = ctx.createRadialGradient(-R * 0.35, -R * 0.35, R * 0.1, 0, 0, R);
    g.addColorStop(0, '#ffa857'); g.addColorStop(1, '#d9661c');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, R, 0, 6.283); ctx.fill();
    ctx.strokeStyle = '#2a1608'; ctx.lineWidth = 1.6 * K;
    ctx.beginPath(); ctx.arc(0, 0, R, 0, 6.283);
    ctx.moveTo(-R, 0); ctx.lineTo(R, 0); ctx.moveTo(0, -R); ctx.lineTo(0, R);
    ctx.moveTo(-R * 0.72, -R * 0.7); ctx.quadraticCurveTo(-R * 0.1, 0, -R * 0.72, R * 0.7);
    ctx.moveTo(R * 0.72, -R * 0.7); ctx.quadraticCurveTo(R * 0.1, 0, R * 0.72, R * 0.7);
    ctx.stroke(); ctx.restore();
  }
  function drawText() {
    ctx.textAlign = 'center';
    for (const f of floaters) {
      ctx.globalAlpha = 1 - f.t / 1.2; ctx.fillStyle = f.col;
      ctx.font = `800 ${24 * K}px Inter, system-ui, sans-serif`;
      ctx.fillText(f.txt, f.x, f.y - f.t * 40 * K);
    }
    ctx.globalAlpha = 1;
    if (shots === 0 && ball.state !== 'fly') {
      ctx.fillStyle = '#f4c95d'; ctx.font = `800 ${15 * K + 2}px Inter, system-ui, sans-serif`;
      ctx.fillText('Drag the ball back, then release!', W * 0.5, 34 * K + Math.sin(clock * 3) * 4);
      ctx.strokeStyle = `rgba(244,201,93,${0.35 + 0.3 * Math.sin(clock * 4)})`; ctx.lineWidth = 3 * K;
      ctx.beginPath(); ctx.arc(start.x, start.y, R * 2 + Math.sin(clock * 4) * 3 * K, 0, 6.283); ctx.stroke();
    }
  }

  let last = 0;
  function frame(t) {
    requestAnimationFrame(frame);
    const dt = Math.min(0.033, (t - last) / 1000 || 0.016); last = t;
    if (!visible) return;
    clock += dt; step(dt);
    ctx.clearRect(0, 0, W, H);
    drawCourt(); drawStand(); drawHoop();
    if (ball.state === 'drag') drawAim();
    drawBall(); drawNet(); drawText();
  }
  requestAnimationFrame(frame);
})();

/* =====================================================================
   INTERACTIVE 3D HEAD  (pure canvas, hand-rolled 3D projection)
   ===================================================================== */
(() => {
const canvas = $('#head');
const ctx = canvas.getContext('2d');
const stage = $('#stage');
const hintEl = $('#hint');
const meterFill = $('#meterFill');
const meterText = $('#meterText');
const chip = $('#challengeChip');

/* ----- view state ----- */
let W = 0, H = 0, S = 100, cx = 0, cy = 0, DPR = 1;
const F = 7;                       // camera distance (perspective)
let cs = 1, sn = 0, cpi = 1, spi = 0;   // cached trig of rotation
let rx = 0, ry = 0, rz = 0;        // rotation output
let px = 0, py = 0, pk = 1;        // projection output

function resize() {
  const r = canvas.getBoundingClientRect();
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  W = r.width; H = r.height;
  canvas.width = Math.round(W * DPR);
  canvas.height = Math.round(H * DPR);
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  S = Math.min(W * 0.27, H * 0.22);
  cx = W / 2; cy = H * 0.5;
}
new ResizeObserver(resize).observe(canvas);
resize();

/* yaw about Y, then pitch about X */
function R(x, y, z) {
  const x1 = x * cs + z * sn, z1 = -x * sn + z * cs;
  rx = x1; ry = y * cpi - z1 * spi; rz = y * spi + z1 * cpi;
}
function P() {
  pk = F / (F - rz);
  px = cx + rx * S * pk;
  py = cy - ry * S * pk;
}

/* ----- head geometry (egg-shaped ellipsoid with a tapered jaw) ----- */
const RX = 0.92, RY = 1.22, RZ = 1.0;
const v3 = [0, 0, 0], n3 = [0, 0, 0];
function taper(ph) { const s = Math.sin(ph); return s < 0 ? 1 - 0.32 * Math.pow(-s, 1.3) : 1; }
function surf(th, ph, o) {
  const t = taper(ph), c = Math.cos(ph);
  o[0] = RX * t * c * Math.sin(th); o[1] = RY * Math.sin(ph); o[2] = RZ * t * c * Math.cos(th);
  return o;
}
function nrm(th, ph, o) {
  const c = Math.cos(ph);
  const x = c * Math.sin(th) / RX, y = Math.sin(ph) / RY, z = c * Math.cos(th) / RZ;
  const l = Math.hypot(x, y, z) || 1;
  o[0] = x / l; o[1] = y / l; o[2] = z / l;
  return o;
}
/* project a point on the head surface (optionally pushed outward) */
function proj(th, ph, push, o) {
  surf(th, ph, v3); nrm(th, ph, n3);
  R(v3[0] + n3[0] * push, v3[1] + n3[1] * push, v3[2] + n3[2] * push); P();
  o.x = px; o.y = py; o.k = pk; o.z = rz;
  R(n3[0], n3[1], n3[2]); o.nz = rz;
  return o;
}
const A = { x: 0, y: 0, k: 1, z: 0, nz: 0 }, B = { x: 0, y: 0, k: 1, z: 0, nz: 0 }, C = { x: 0, y: 0, k: 1, z: 0, nz: 0 };

const LAT = 22, LON = 36, quads = [];
for (let i = 0; i < LAT; i++) {
  const p0 = -Math.PI / 2 + Math.PI * i / LAT, p1 = -Math.PI / 2 + Math.PI * (i + 1) / LAT;
  for (let j = 0; j < LON; j++) {
    const t0 = -Math.PI + 2 * Math.PI * j / LON, t1 = -Math.PI + 2 * Math.PI * (j + 1) / LON;
    const v = new Float32Array(12);
    surf(t0, p0, v3); v.set(v3, 0); surf(t1, p0, v3); v.set(v3, 3);
    surf(t1, p1, v3); v.set(v3, 6); surf(t0, p1, v3); v.set(v3, 9);
    quads.push({ v, n: nrm((t0 + t1) / 2, (p0 + p1) / 2, [0, 0, 0]) });
  }
}
const SKIN = [226, 172, 138];
const LX = -0.42, LY = 0.55, LZ = 0.72;

/* ----- hair ----- */
const RAZOR = 0.015;
const strands = [];
let scr = new Float32Array(0), cnt = new Uint8Array(0);
let sumL0 = 1, sumMin = 0;
let style = 'messy', guard = 0.09, hairCols = [], hairBack = '#000', browCol = '#000';

function hex2rgb(h) { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
function setHairColor(hex) {
  const c = hex2rgb(hex);
  const mul = f => `rgb(${c.map(v => Math.round(v * f)).join(',')})`;
  const mix = a => `rgb(${c.map(v => Math.round(v + (255 - v) * a)).join(',')})`;
  hairCols = [mul(0.78), mul(1), mix(0.2)];
  hairBack = mul(0.5);
  browCol = mul(0.7);
}
setHairColor('#1a1a1f');

function inZone(th, ph) {
  const a = Math.abs(th);
  if (ph > 0.55) return true;                              // scalp above hairline
  if (a > 1.35 && a < 1.8 && ph > -0.32 && ph < 0.32) return false; // keep ears free
  if (a > 1.1 && ph > -0.45) return true;                  // sides + back
  if (a > 0.95 && ph > -0.25 && ph < 0.6) return true;     // sideburns
  return false;
}

function buildHair(st) {
  style = st;
  strands.length = 0;
  const N = st === 'afro' ? 3400 : 3000;
  let tries = 0;
  while (strands.length < N && tries < N * 30) {
    tries++;
    const th = (Math.random() * 2 - 1) * Math.PI, ph = Math.asin(Math.random() * 2 - 1);
    if (!inZone(th, ph)) continue;
    surf(th, ph, v3); nrm(th, ph, n3);
    let dx = n3[0], dy = n3[1], dz = n3[2], L, gk, jit;
    if (st === 'mohawk') {
      const strip = Math.abs(v3[0]) < 0.26 && ph > 0.1;
      if (strip) { L = 0.62 + Math.random() * 0.25; dx *= 0.2; dy = dy * 0.4 + 1.3; dz = dz * 0.3 + (v3[2] > 0 ? 0.3 : -0.3); gk = 0.03; jit = 0.08; }
      else { L = 0.04 + Math.random() * 0.04; gk = 0.2; jit = 0.1; }
    } else if (st === 'afro') {
      L = 0.5 + Math.random() * 0.26; gk = 0.03; jit = 0.5;
    } else {
      L = 0.4 + Math.random() * 0.36; gk = 0.26 + Math.random() * 0.16; jit = 0.2;
      if (ph > 0.55 && Math.abs(th) < 0.8) { dz += 0.35; dy += 0.25; }
    }
    let l = Math.hypot(dx, dy, dz) || 1; dx /= l; dy /= l; dz /= l;
    const pts = new Float32Array(21);
    let x = v3[0] * 0.985, y = v3[1] * 0.985, z = v3[2] * 0.985;
    pts[0] = x; pts[1] = y; pts[2] = z;
    const seg = L / 6;
    for (let k = 1; k <= 6; k++) {
      dx += (Math.random() - 0.5) * jit;
      dy += (Math.random() - 0.5) * jit - gk * (0.3 + k / 6);
      dz += (Math.random() - 0.5) * jit;
      l = Math.hypot(dx, dy, dz) || 1; dx /= l; dy /= l; dz /= l;
      x += dx * seg; y += dy * seg; z += dz * seg;
      pts[k * 3] = x; pts[k * 3 + 1] = y; pts[k * 3 + 2] = z;
    }
    strands.push({ p: pts, L0: L, len: L, seg, nx: n3[0], ny: n3[1], nz: n3[2], shade: (Math.random() * 3) | 0, front: 1 });
  }
  sumL0 = 0; sumMin = 0;
  for (const s of strands) { sumL0 += s.L0; sumMin += Math.min(s.L0, RAZOR); }
  scr = new Float32Array(strands.length * 14);
  cnt = new Uint8Array(strands.length);
  growing = false; lastPct = -1; milestones = {};
}

/* ----- interaction state ----- */
let mode = 'cut', drag = null, cutting = false, mouseIn = false;
let mx = 0, my = 0, pmx = 0, pmy = 0;
let yawUser = 0, pitchUser = 0, swayAmt = 1, lastActive = -9999, spin = null;
let growing = false, lastPct = -1, milestones = {}, challenge = null, started = false;
let cutR = 30;

/* ----- sound (clipper buzz) ----- */
let ac = null, osc = null, gain = null, muted = false;
function buzzOn() {
  if (muted) return;
  try {
    if (!ac) {
      ac = new (window.AudioContext || window.webkitAudioContext)();
      osc = ac.createOscillator(); osc.type = 'sawtooth'; osc.frequency.value = 96;
      const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 650;
      gain = ac.createGain(); gain.gain.value = 0;
      osc.connect(lp); lp.connect(gain); gain.connect(ac.destination); osc.start();
    }
    if (ac.state === 'suspended') ac.resume();
    gain.gain.setTargetAtTime(0.045, ac.currentTime, 0.03);
  } catch (e) { /* audio not available */ }
}
function buzzOff() { if (gain && ac) gain.gain.setTargetAtTime(0, ac.currentTime, 0.06); }

/* ----- pointer handling ----- */
function updateMouse(e) {
  const r = canvas.getBoundingClientRect();
  mx = e.clientX - r.left; my = e.clientY - r.top;
}
canvas.addEventListener('contextmenu', e => e.preventDefault());
canvas.addEventListener('pointerdown', e => {
  canvas.setPointerCapture(e.pointerId);
  updateMouse(e); pmx = mx; pmy = my; mouseIn = true;
  lastActive = performance.now();
  const wantRotate = mode === 'rotate' || e.button === 2 || e.shiftKey;
  if (wantRotate) { drag = 'rotate'; canvas.classList.remove('cut'); canvas.style.cursor = 'grabbing'; }
  else {
    drag = 'cut'; cutting = true; growing = false; buzzOn();
    if (!started) { started = true; hintEl.classList.add('gone'); stage.classList.add('touched'); }
  }
  canvas.focus({ preventScroll: true });
});
canvas.addEventListener('pointermove', e => {
  const ox = mx, oy = my;
  updateMouse(e); mouseIn = true; lastActive = performance.now();
  if (drag === 'rotate') {
    yawUser += (mx - ox) * 0.011;
    pitchUser = clamp(pitchUser + (my - oy) * 0.006, -0.5, 0.5);
  }
});
function endDrag(e) {
  drag = null; cutting = false; buzzOff();
  canvas.style.cursor = '';
  if (mode === 'cut') canvas.classList.add('cut');
  if (e && e.pointerType === 'touch') mouseIn = false;
}
canvas.addEventListener('pointerup', endDrag);
canvas.addEventListener('pointercancel', endDrag);
canvas.addEventListener('pointerleave', () => { if (!drag) mouseIn = false; });
canvas.addEventListener('keydown', e => {
  const k = e.key;
  if (k === 'ArrowLeft') yawUser -= 0.15;
  else if (k === 'ArrowRight') yawUser += 0.15;
  else if (k === 'ArrowUp') pitchUser = clamp(pitchUser - 0.08, -0.5, 0.5);
  else if (k === 'ArrowDown') pitchUser = clamp(pitchUser + 0.08, -0.5, 0.5);
  else return;
  e.preventDefault(); lastActive = performance.now();
});

/* ----- toolbar ----- */
function selectGroup(attr, fn) {
  $$(`[data-${attr}]`, $('.toolbar')).forEach(b => b.addEventListener('click', () => {
    $$(`[data-${attr}]`, b.parentElement).forEach(x => x.classList.remove('on'));
    b.classList.add('on');
    fn(b.dataset[attr]);
  }));
}
selectGroup('mode', v => {
  mode = v;
  canvas.classList.toggle('cut', v === 'cut');
  toast(v === 'cut' ? '✂️ Cut mode: drag over the hair' : '🖐 Rotate mode: drag to turn the head');
});
selectGroup('guard', v => { guard = parseFloat(v); });
selectGroup('style', v => { buildHair(v); toast('New style: ' + v[0].toUpperCase() + v.slice(1)); });
selectGroup('color', v => setHairColor(v));
$('#spinBtn').addEventListener('click', () => { spin = { t0: performance.now(), from: yawUser }; lastActive = performance.now(); });
$('#regrow').addEventListener('click', () => { growing = true; milestones = {}; toast('🌱 Hair is growing back…'); });
$('#challengeBtn').addEventListener('click', () => {
  buildHair(style);
  challenge = { t0: performance.now(), dur: 30000, goal: 80 };
  chip.hidden = false;
  toast('GO! Remove 80% of the hair in 30 seconds ✂️');
});
const soundBtn = $('#soundBtn');
soundBtn.addEventListener('click', () => {
  muted = !muted; soundBtn.textContent = muted ? '🔇' : '🔊'; soundBtn.setAttribute('aria-pressed', String(!muted));
  if (muted) buzzOff();
});

/* ----- hair simulation (project, cut, count) ----- */
let sumLen = 0;
function computeStrand(i) {
  const s = strands[i], p = s.p, o = i * 14, seg = s.seg;
  let nFull = Math.floor(s.len / seg + 1e-6); if (nFull > 6) nFull = 6;
  let c = 0;
  for (let k = 0; k <= nFull; k++) {
    R(p[k * 3], p[k * 3 + 1], p[k * 3 + 2]); P();
    scr[o + c * 2] = px; scr[o + c * 2 + 1] = py; c++;
  }
  const frac = s.len - nFull * seg;
  if (nFull < 6 && frac > 1e-4) {
    const a = nFull * 3, b = a + 3, f = frac / seg;
    R(p[a] + (p[b] - p[a]) * f, p[a + 1] + (p[b + 1] - p[a + 1]) * f, p[a + 2] + (p[b + 2] - p[a + 2]) * f); P();
    scr[o + c * 2] = px; scr[o + c * 2 + 1] = py; c++;
  }
  if (c < 2) { scr[o + 2] = scr[o] + 0.5; scr[o + 3] = scr[o + 1] + 1; c = 2; }
  cnt[i] = c;
}

function segDist2(x, y, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay, l2 = dx * dx + dy * dy;
  let t = l2 ? ((x - ax) * dx + (y - ay) * dy) / l2 : 0;
  t = t < 0 ? 0 : t > 1 ? 1 : t;
  const qx = ax + dx * t - x, qy = ay + dy * t - y;
  return qx * qx + qy * qy;
}

const parts = [];
function spawn(x, y, len) {
  if (parts.length > 320 || Math.random() > 0.45) return;
  parts.push({ x, y, vx: (Math.random() - 0.5) * 90, vy: -30 - Math.random() * 50,
    a: Math.random() * 6.28, va: (Math.random() - 0.5) * 9, l: Math.max(5, len * S * 0.9), life: 0 });
}

function prepareHair() {
  const doCut = cutting && drag === 'cut';
  const R2 = cutR * cutR;
  let allFull = true;
  sumLen = 0;
  for (let i = 0; i < strands.length; i++) {
    const s = strands[i];
    if (growing) {
      if (s.len < s.L0 - 0.002) { s.len = Math.min(s.L0, s.len + (s.L0 - s.len) * 0.09 + 0.003); allFull = false; }
      else s.len = s.L0;
    }
    R(s.nx, s.ny, s.nz);
    const nz = rz; s.front = nz >= 0 ? 1 : 0;
    computeStrand(i);
    if (doCut && nz > -0.25 && s.len > guard + 0.003) {
      const o = i * 14, c = cnt[i];
      for (let k = 0; k < c; k++) {
        if (segDist2(scr[o + k * 2], scr[o + k * 2 + 1], pmx, pmy, mx, my) <= R2) {
          const tl = Math.min(k * s.seg, s.len);
          const nl = Math.max(guard, tl);
          if (nl < s.len - 0.004) {
            spawn(scr[o + k * 2], scr[o + k * 2 + 1], s.len - nl);
            s.len = nl;
            computeStrand(i);
          }
          break;
        }
      }
    }
    sumLen += s.len;
  }
  if (growing && allFull) growing = false;
  pmx = mx; pmy = my;
}

function hairPass(front) {
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.lineWidth = Math.max(1.1, S * 0.011);
  if (!front) {
    ctx.strokeStyle = hairBack; ctx.beginPath();
    for (let i = 0; i < strands.length; i++) {
      if (strands[i].front) continue;
      const o = i * 14, c = cnt[i];
      ctx.moveTo(scr[o], scr[o + 1]);
      for (let k = 1; k < c; k++) ctx.lineTo(scr[o + k * 2], scr[o + k * 2 + 1]);
    }
    ctx.stroke();
    return;
  }
  for (let g = 0; g < 3; g++) {
    ctx.strokeStyle = hairCols[g]; ctx.beginPath();
    for (let i = 0; i < strands.length; i++) {
      const s = strands[i];
      if (!s.front || s.shade !== g) continue;
      const o = i * 14, c = cnt[i];
      ctx.moveTo(scr[o], scr[o + 1]);
      for (let k = 1; k < c; k++) ctx.lineTo(scr[o + k * 2], scr[o + k * 2 + 1]);
    }
    ctx.stroke();
  }
}

function drawParticles(dt) {
  if (!parts.length) return;
  ctx.lineWidth = Math.max(1.1, S * 0.011); ctx.lineCap = 'round';
  ctx.strokeStyle = hairCols[1]; ctx.beginPath();
  for (let i = parts.length - 1; i >= 0; i--) {
    const p = parts[i];
    p.vy += 520 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.a += p.va * dt; p.life += dt;
    if (p.y > H + 20 || p.life > 3) { parts.splice(i, 1); continue; }
    const dx = Math.cos(p.a) * p.l / 2, dy = Math.sin(p.a) * p.l / 2;
    ctx.moveTo(p.x - dx, p.y - dy); ctx.lineTo(p.x + dx, p.y + dy);
  }
  ctx.stroke();
}

/* ----- drawing the body, head and face ----- */
function drawBody() {
  const nw = 0.36 * S;
  let g = ctx.createLinearGradient(0, cy + 0.7 * S, 0, cy + 1.6 * S);
  g.addColorStop(0, '#8f5d43'); g.addColorStop(1, '#d39a78');
  ctx.fillStyle = g; ctx.fillRect(cx - nw, cy + 0.7 * S, nw * 2, 0.95 * S);
  const top = cy + 1.42 * S;
  g = ctx.createLinearGradient(0, top, 0, H);
  g.addColorStop(0, '#2a3a66'); g.addColorStop(1, '#141b33');
  ctx.fillStyle = g; ctx.beginPath();
  ctx.moveTo(cx - 0.62 * S, top);
  ctx.quadraticCurveTo(cx - 1.5 * S, top + 0.15 * S, cx - 2.6 * S, H + 20);
  ctx.lineTo(cx + 2.6 * S, H + 20);
  ctx.quadraticCurveTo(cx + 1.5 * S, top + 0.15 * S, cx + 0.62 * S, top);
  ctx.quadraticCurveTo(cx, top + 0.38 * S, cx - 0.62 * S, top);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,.75)'; ctx.lineWidth = Math.max(2, S * 0.03);
  ctx.beginPath(); ctx.moveTo(cx - 0.62 * S, top); ctx.quadraticCurveTo(cx, top + 0.38 * S, cx + 0.62 * S, top); ctx.stroke();
}

function drawHead() {
  ctx.lineWidth = 1; ctx.lineJoin = 'round';
  for (let i = 0; i < quads.length; i++) {
    const q = quads[i];
    R(q.n[0], q.n[1], q.n[2]);
    if (rz <= 0) continue;
    const sh = 0.42 + 0.58 * Math.max(0, rx * LX + ry * LY + rz * LZ);
    const col = `rgb(${(SKIN[0] * sh) | 0},${(SKIN[1] * sh) | 0},${(SKIN[2] * sh) | 0})`;
    ctx.fillStyle = col; ctx.strokeStyle = col;
    ctx.beginPath();
    for (let k = 0; k < 4; k++) {
      R(q.v[k * 3], q.v[k * 3 + 1], q.v[k * 3 + 2]); P();
      if (k) ctx.lineTo(px, py); else ctx.moveTo(px, py);
    }
    ctx.closePath(); ctx.fill(); ctx.stroke();
  }
}

function drawEars(front) {
  for (const sg of [-1, 1]) {
    R(sg, 0, 0); const nzE = rz;
    if ((nzE > 0) !== front) continue;
    R(sg * RX * 0.99, 0.02, -0.08); P();
    const ex = px, ey = py, k = pk;
    const w = S * k * (0.07 + 0.12 * Math.abs(nzE)), h = S * k * 0.38;
    const sh = 0.55 + 0.4 * Math.max(0, nzE);
    ctx.fillStyle = `rgb(${(SKIN[0] * sh) | 0},${(SKIN[1] * sh) | 0},${(SKIN[2] * sh) | 0})`;
    ctx.beginPath(); ctx.ellipse(ex, ey, w, h, 0, 0, 6.283); ctx.fill();
    if (nzE > 0.25) {
      ctx.fillStyle = 'rgba(120,55,40,.35)';
      ctx.beginPath(); ctx.ellipse(ex, ey, w * 0.55, h * 0.6, 0, 0, 6.283); ctx.fill();
    }
  }
}

function drawFace(time) {
  ctx.lineCap = 'round';
  /* cheeks */
  ctx.fillStyle = 'rgba(255,110,110,.16)';
  for (const sg of [-1, 1]) {
    proj(sg * 0.62, -0.12, 0, A);
    if (A.nz > 0.1) { ctx.beginPath(); ctx.ellipse(A.x, A.y, 0.13 * S * A.k * A.nz, 0.08 * S * A.k, 0, 0, 6.283); ctx.fill(); }
  }
  /* nose */
  proj(0, -0.1, 0.2, A); proj(0, 0.18, 0.02, B);
  if (A.nz > -0.1) {
    const vis = clamp(A.nz + 0.1, 0, 1);
    ctx.strokeStyle = 'rgba(255,232,215,.28)'; ctx.lineWidth = 0.13 * S * A.k;
    ctx.beginPath(); ctx.moveTo(B.x, B.y); ctx.lineTo(A.x, A.y); ctx.stroke();
    ctx.fillStyle = 'rgba(120,60,40,.2)';
    ctx.beginPath(); ctx.ellipse(A.x, A.y + 0.02 * S, 0.13 * S * A.k * (0.5 + 0.5 * vis), 0.1 * S * A.k, 0, 0, 6.283); ctx.fill();
    ctx.fillStyle = 'rgba(255,238,225,.28)';
    ctx.beginPath(); ctx.ellipse(A.x - 0.02 * S, A.y - 0.02 * S, 0.07 * S * A.k * vis, 0.05 * S * A.k, 0, 0, 6.283); ctx.fill();
    ctx.fillStyle = 'rgba(60,25,20,.55)';
    for (const sg of [-1, 1]) {
      ctx.beginPath(); ctx.ellipse(A.x + sg * 0.055 * S * A.k * vis, A.y + 0.05 * S * A.k, 0.022 * S * A.k, 0.014 * S * A.k, 0, 0, 6.283); ctx.fill();
    }
  }
  /* eyes */
  const blink = (time % 3800) < 130;
  for (const sg of [-1, 1]) {
    proj(sg * 0.42, 0.12, 0, A);
    if (A.nz < 0.12) continue;
    const ew = 0.15 * S * A.k * Math.max(0.35, A.nz), eh = 0.085 * S * A.k;
    if (blink) {
      ctx.strokeStyle = '#3a2418'; ctx.lineWidth = 0.03 * S * A.k;
      ctx.beginPath(); ctx.moveTo(A.x - ew, A.y); ctx.lineTo(A.x + ew, A.y); ctx.stroke();
      continue;
    }
    ctx.fillStyle = '#f6f2ee';
    ctx.beginPath(); ctx.ellipse(A.x, A.y, ew, eh, 0, 0, 6.283); ctx.fill();
    let lx = 0, ly = 0;
    if (mouseIn) { lx = clamp((mx - A.x) / (S * 1.6), -1, 1); ly = clamp((my - A.y) / (S * 1.6), -1, 1); }
    const ix = A.x + lx * ew * 0.45, iy = A.y + ly * eh * 0.4;
    ctx.fillStyle = '#2b1b12';
    ctx.beginPath(); ctx.ellipse(ix, iy, 0.052 * S * A.k * Math.max(0.5, A.nz), 0.058 * S * A.k, 0, 0, 6.283); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(ix - 0.015 * S * A.k, iy - 0.02 * S * A.k, 0.014 * S * A.k, 0, 6.283); ctx.fill();
  }
  /* eyebrows */
  ctx.strokeStyle = browCol; ctx.lineWidth = 0.05 * S;
  for (const sg of [-1, 1]) {
    proj(sg * 0.2, 0.3, 0.04, A); proj(sg * 0.64, 0.36, 0.04, B);
    if (A.nz > 0.05 && B.nz > 0.05) { ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.stroke(); }
  }
  /* mouth (grins while cutting) */
  proj(0, -0.46, 0.02, C);
  if (C.nz > 0.1) {
    const up = [], grin = cutting && drag === 'cut';
    for (let t = -1; t <= 1.01; t += 0.5) {
      const o = { x: 0, y: 0, k: 1, z: 0, nz: 0 };
      proj(t * 0.3, -0.46 + 0.06 * t * t, 0.02, o); up.push(o);
    }
    if (grin) {
      const lo = [];
      for (let t = 1; t >= -1.01; t -= 0.5) {
        const o = { x: 0, y: 0, k: 1, z: 0, nz: 0 };
        proj(t * 0.3, -0.46 + 0.06 * t * t - 0.075 * (1 - t * t), 0.02, o); lo.push(o);
      }
      ctx.fillStyle = '#5a1a1a'; ctx.beginPath(); ctx.moveTo(up[0].x, up[0].y);
      up.forEach(p => ctx.lineTo(p.x, p.y)); lo.forEach(p => ctx.lineTo(p.x, p.y)); ctx.closePath(); ctx.fill();
    }
    ctx.strokeStyle = '#7a2f2f'; ctx.lineWidth = 0.035 * S * C.k;
    ctx.beginPath(); ctx.moveTo(up[0].x, up[0].y); up.forEach(p => ctx.lineTo(p.x, p.y)); ctx.stroke();
  }
}

function drawCursor() {
  if (!mouseIn || mode !== 'cut' || drag === 'rotate') return;
  ctx.save();
  ctx.lineWidth = 2; ctx.setLineDash([5, 5]);
  ctx.strokeStyle = cutting ? 'rgba(244,201,93,.95)' : 'rgba(255,255,255,.7)';
  ctx.beginPath(); ctx.arc(mx, my, cutR, 0, 6.283); ctx.stroke();
  ctx.setLineDash([]);
  ctx.translate(mx, my); ctx.rotate(-0.4);
  if (cutting) ctx.translate((Math.random() - 0.5) * 2.6, (Math.random() - 0.5) * 2.6);
  const w = 30;
  ctx.fillStyle = '#cfd5df'; ctx.fillRect(-w / 2, -12, w, 12);
  ctx.fillStyle = '#2b2f3a';
  for (let i = -w / 2 + 2; i < w / 2 - 1; i += 5) ctx.fillRect(i, -4, 2.5, 4);
  const g = ctx.createLinearGradient(-w / 2, 0, w / 2, 0);
  g.addColorStop(0, '#b8222d'); g.addColorStop(0.5, '#ff5964'); g.addColorStop(1, '#b8222d');
  ctx.fillStyle = g; ctx.fillRect(-w / 2, -86, w, 74);
  ctx.fillStyle = '#fff'; ctx.fillRect(-3, -70, 6, 30);
  ctx.restore();
}

/* ----- HUD, milestones, challenge ----- */
const MILES = [[25, '✂️ Nice start! A quarter gone.'], [50, '🔥 Halfway there — looking sharp!'],
  [75, '😮 Almost bald… commitment!'], [100, '💈 Fresh as a baby! Hit Regrow to go again.']];
function updateHud(now) {
  const denom = Math.max(1e-6, sumL0 - sumMin);
  const prog = clamp((sumL0 - sumLen) / denom, 0, 1);
  const pct = Math.round(prog * 100);
  if (pct !== lastPct) {
    lastPct = pct;
    meterFill.style.width = pct + '%'; meterText.textContent = pct + '%';
    if (pct < 10) milestones = {};
    if (!challenge) for (const [m, msg] of MILES) if (pct >= m && !milestones[m]) { milestones[m] = true; toast(msg); if (m === 100) confetti(); }
  }
  if (challenge) {
    const rem = challenge.dur - (now - challenge.t0);
    if (pct >= challenge.goal) {
      toast(`🏆 ${((now - challenge.t0) / 1000).toFixed(1)}s — master barber!`); confetti();
      challenge = null; chip.hidden = true;
    } else if (rem <= 0) {
      toast(`⏰ Time's up! You reached ${pct}%. Try again!`);
      challenge = null; chip.hidden = true;
    } else chip.textContent = `⏱ ${(rem / 1000).toFixed(1)}s · goal 80% (${pct}%)`;
  }
}

/* ----- main loop ----- */
let last = 0;
function frame(time) {
  requestAnimationFrame(frame);
  const dt = Math.min(0.05, (time - last) / 1000 || 0.016); last = time;
  ctx.clearRect(0, 0, W, H);
  cutR = Math.max(26, S * 0.26);

  const idle = time - lastActive > 1800 && !drag;
  swayAmt += ((idle && !reduceMotion ? 1 : 0) - swayAmt) * 0.04;
  if (spin) {
    const p = clamp((time - spin.t0) / 1300, 0, 1);
    yawUser = spin.from + Math.PI * 2 * (1 - Math.pow(1 - p, 3));
    if (p >= 1) spin = null;
  }
  const yaw = yawUser + Math.sin(time * 0.0007) * 0.3 * swayAmt;
  const pitch = pitchUser + Math.sin(time * 0.0005) * 0.04 * swayAmt;
  cs = Math.cos(yaw); sn = Math.sin(yaw); cpi = Math.cos(pitch); spi = Math.sin(pitch);

  drawBody();
  prepareHair();
  hairPass(false);
  drawEars(false);
  drawHead();
  drawEars(true);
  drawFace(time);
  hairPass(true);
  drawParticles(dt);
  drawCursor();
  updateHud(time);
}

buildHair('messy');
requestAnimationFrame(frame);
})();

})();
