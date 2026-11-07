/* =========================================================
   Arclines Freight — scroll choreography
   Vanilla JS. One rAF loop; every pinned scene is a pure function of scroll progress.
   ========================================================= */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const seg = (p, a, b) => clamp((p - a) / (b - a));
  const ease = t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  /* keyframe track: [[p,v],...] eased between knots */
  const T = (p, pts, lin) => {
    if (p <= pts[0][0]) return pts[0][1];
    for (let i = 1; i < pts.length; i++) {
      if (p <= pts[i][0]) {
        const [p0, v0] = pts[i - 1], [p1, v1] = pts[i];
        const k = (p - p0) / (p1 - p0);
        return lerp(v0, v1, lin ? k : ease(k));
      }
    }
    return pts[pts.length - 1][1];
  };
  const root = document.documentElement;
  const params = new URLSearchParams(location.search);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const noMotion = reduced || params.has('still');

  /* ---------- inject art ---------- */
  $('#aStacker').innerHTML = ART.stacker;
  $('#aTruck').innerHTML = ART.truck;
  $('#aTopdown').innerHTML = ART.truckTop;
  $('#bTruck').innerHTML = ART.truckTop;
  $('#bShip').innerHTML = ART.ship();
  $$('[data-ic]').forEach(el => (el.innerHTML = ART.icons[el.dataset.ic] || ''));
  $('#logos').innerHTML = ART.logos.map(([n, t]) => `<div class="lg lg--${t}"><span>${n}</span></div>`).join('');
  const boom = $('#boom');

  /* flat colour layer that closes the cloud transition (matches next section) */
  const bFlat = document.createElement('div');
  bFlat.style.cssText = 'position:absolute;inset:0;background:#dfe8f9;opacity:0;pointer-events:none;z-index:2';
  $('#bClouds').after(bFlat);

  /* ---------- photographic assets: used when present, vector art stays as fallback ---------- */
  const ASSETS = [
    ['#aTruck', 'assets/truck.webp', 'contain'],
    ['#aTopdown', 'assets/truck-top.webp', 'contain'],
    ['#bTruck', 'assets/truck-top.webp', 'contain'],
    ['#bShip', 'assets/ship-top.webp', 'contain'],
    ['.stats__img', 'assets/stats-road.jpg', 'cover'],
    ['.foot-img', 'assets/footer-warehouse.jpg', 'cover']
  ];
  /* reach stacker: 3 photo layers (body / cylinder / boom) so the boom can really lift */
  const STK = { W: 1060, H: 789, P: [148, 438], S: [895, 320], A: [342, 298], B: [535, 622], k: 41.5 / 789, L0: 74 };
  const stk = { boom: null, cyl: null };
  (() => {
    const host = $('#aStacker'); if (!host) return;
    const names = ['body', 'boom', 'cyl'], imgs = names.map(n => { const i = new Image(); i.decoding = 'async'; i.className = 'stk'; i.alt = ''; i.src = `assets/stacker-${n}.webp`; return i; });
    Promise.all(imgs.map(i => i.decode().catch(() => { throw 0; }))).then(() => {
      host.innerHTML = ''; imgs.forEach(i => host.appendChild(i));
      imgs[2].style.transformOrigin = `${STK.B[0] / STK.W * 100}% ${STK.B[1] / STK.H * 100}%`;
      imgs[1].style.transformOrigin = `${STK.P[0] / STK.W * 100}% ${STK.P[1] / STK.H * 100}%`;
      stk.boom = imgs[1]; stk.cyl = imgs[2];
    }).catch(() => {});
  })();
  const rotPt = (pt, deg) => { const a = deg * Math.PI / 180, c = Math.cos(a), sn = Math.sin(a), dx = pt[0] - STK.P[0], dy = pt[1] - STK.P[1]; return [STK.P[0] + dx * c - dy * sn, STK.P[1] + dx * sn + dy * c]; };

  ASSETS.forEach(([sel, src, fit]) => {
    const host = $(sel); if (!host) return;
    const im = new Image(); im.decoding = 'async';
    im.onload = () => {
      im.className = 'photo' + (fit === 'cover' ? ' photo--cover' : ''); im.alt = '';
      host.innerHTML = ''; host.appendChild(im);
      if (sel === '.foot-img') host.style.background = 'none';
    };
    im.src = src;   // 404 = silently keep vector art
  });
  [1, 2, 3].forEach(i => {
    const im = new Image();
    im.onload = () => root.style.setProperty('--ins' + i, `url(assets/insight-${i}.jpg)`);
    im.src = `assets/insight-${i}.jpg`;
  });

  /* "Trusted" backdrop: crisp cartographic contour lines (tileable noise, constant 1px line width via gradient normalisation) */
  (() => {
    const N = 1536, c = document.createElement('canvas'); c.width = c.height = N;
    const cx = c.getContext('2d'), id = cx.createImageData(N, N);
    let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const oct = [[3, .55], [6, .3], [12, .15]].map(([g, a]) => ({ g, a, v: Array.from({ length: g * g }, rnd) }));
    const sm = t => t * t * (3 - 2 * t);
    const field = new Float32Array(N * N);
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      let n = 0;
      for (const o of oct) { const fx = x / N * o.g, fy = y / N * o.g, x0 = Math.floor(fx), y0 = Math.floor(fy), tx = sm(fx - x0), ty = sm(fy - y0), g = o.g,
        at = (i, j) => o.v[(j % g) * g + (i % g)];
        n += o.a * ((at(x0, y0) * (1 - tx) + at(x0 + 1, y0) * tx) * (1 - ty) + (at(x0, y0 + 1) * (1 - tx) + at(x0 + 1, y0 + 1) * tx) * ty); }
      field[y * N + x] = n * 22;                                              // 1 unit = one contour interval
    }
    const f = (x, y) => field[((y + N) % N) * N + ((x + N) % N)];
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      const v = f(x, y), gx = (f(x + 1, y) - f(x - 1, y)) / 2, gy = (f(x, y + 1) - f(x, y - 1)) / 2, g = Math.hypot(gx, gy) + 1e-6;
      const lvl = Math.round(v), major = lvl % 5 === 0, w = major ? 1.9 : 1.15;       // line width in px
      const d = Math.abs(v - lvl) / g;                                                  // distance to the contour, in px
      const a = Math.max(0, Math.min(1, (w / 2 + .5) - d)) * (major ? .5 : .26), i = (y * N + x) * 4;
      id.data[i] = 70; id.data[i + 1] = 104; id.data[i + 2] = 196; id.data[i + 3] = Math.round(a * 255);
    }
    cx.putImageData(id, 0, 0);
    root.style.setProperty('--contour', `url(${c.toDataURL('image/png')})`);
  })();

  const snap = str => str.replace(/(-?\d*\.?\d+(?:e-?\d+)?)px/g, (m, n) => Math.round(+n) + 'px');   // whole-pixel translates keep text crisp

  /* top-down truck route, sampled evenly by arc length (rebuilt only on resize) */
  let _tp = null;
  function truckPath(W, H, mob) {
    const key = W + 'x' + H + mob;
    if (_tp && _tp.key === key) return _tp;
    const pts = [], push = (x, y) => pts.push([x, y]);
    const x0 = W * (mob ? .4 : .3), y0 = H * (mob ? .52 : .42);
    const x1 = W * (mob ? .6 : .51), y1 = H * (mob ? .5 : .40);
    for (let i = 0; i <= 60; i++) {                          // cubic with horizontal tangents at both ends
      const t = i / 60, h = t * t * (3 - 2 * t), m = (x1 - x0) * .55;
      const bx = (1 - t) ** 3 * x0 + 3 * (1 - t) ** 2 * t * (x0 + m) + 3 * (1 - t) * t * t * (x1 - m) + t ** 3 * x1;
      push(bx, y0 + (y1 - y0) * h);
    }
    if (mob) { for (let i = 1; i <= 40; i++) push(x1 + (W * 1.3 - x1) * i / 40, y1); }
    else {
      const R = W * .055;
      for (let i = 1; i <= 50; i++) { const th = i / 50 * Math.PI / 2; push(x1 + R * Math.sin(th), y1 + R * (1 - Math.cos(th))); }
      const xe = x1 + R, ye = y1 + R;
      for (let i = 1; i <= 80; i++) push(xe, ye + (H * 1.2 - ye) * i / 80);
    }
    const cum = [0]; for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    const n = 400, x = [], y = [], a = [];
    for (let k = 0, j = 0; k < n; k++) {
      const d = cum[cum.length - 1] * k / (n - 1);
      while (j < cum.length - 2 && cum[j + 1] < d) j++;
      const f = (d - cum[j]) / ((cum[j + 1] - cum[j]) || 1);
      x.push(lerp(pts[j][0], pts[j + 1][0], f)); y.push(lerp(pts[j][1], pts[j + 1][1], f));
      a.push(Math.atan2(pts[j + 1][1] - pts[j][1], pts[j + 1][0] - pts[j][0]) * 180 / Math.PI);
    }
    return (_tp = { key, n, x, y, a });
  }

  /* ---------- word splitting (colour reveal) ---------- */
  const splits = $$('[data-split]').map(el => {
    const lines = el.textContent.trim().split('|');
    el.innerHTML = lines.map(l => l.trim().split(/\s+/).map(w => `<span class="w">${w}</span>`).join(' ')).join('<br>');
    return { el, spans: $$('.w', el) };
  });
  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const mixHex = (a, b, k) => { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], k))).join(',')})`; };
  function reveal(sp, t, from, to) {
    const n = sp.spans.length;
    sp.spans.forEach((s, i) => { s.style.color = mixHex(from, to, clamp(t * (n + 2) - i)); });
  }
  const statsSplit = splits.find(s => s.el.id === 'statsTitle');
  const relSplit = splits.find(s => s.el.id === 'relTitle');

  /* ---------- footer offices ---------- */
  const offices = [
    { a: '12 Example Street, Port Melbourne<br>VIC 3207, Australia', e: 'hello@example.com', p: '+61 3 0000 0000', h: 'Monday – Friday<br>8:00 am – 6:00 pm AEST', r: 'Australia / New Zealand / Hong Kong / China' },
    { a: '1 Sample Quay, #08-00<br>Singapore 000000', e: 'sg@example.com', p: '+65 0000 0000', h: 'Monday – Friday<br>9:00 am – 6:00 pm SGT', r: 'Singapore / Malaysia / Indonesia / Vietnam' }
  ];
  const officeEl = $('#office');
  const showOffice = i => {
    const o = offices[i];
    officeEl.innerHTML = `<div><p><small>Head office</small>${o.a}</p><p><small>Coverage</small>${o.r}</p></div><div><p><small>Email</small><a href="mailto:${o.e}">${o.e}</a></p><p><small>Phone</small><a href="tel:${o.p.replace(/[^+\d]/g, '')}">${o.p}</a></p><p><small>Hours</small>${o.h}</p></div>`;
  };
  showOffice(0);
  $$('#offTabs button').forEach(b => b.addEventListener('click', () => {
    $$('#offTabs button').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); });
    showOffice(+b.dataset.o);
  }));

  /* ---------- FAQ accordion ---------- */
  $$('#faqList li').forEach(li => li.firstElementChild.addEventListener('click', () => {
    const was = li.classList.contains('open');
    $$('#faqList li').forEach(x => x.classList.remove('open'));
    if (!was) li.classList.add('open');
  }));

  /* ---------- insights hover thumb ---------- */
  const thumb = $('#insThumb'); thumb.dataset.i = 1;
  $$('#insList li').forEach(li => {
    li.addEventListener('mouseenter', () => { thumb.dataset.i = li.dataset.img; });
    li.firstElementChild.addEventListener('click', e => {
      const was = li.classList.contains('open');
      $$('#insList li').forEach(x => { x.classList.remove('open'); x.firstElementChild.setAttribute('aria-expanded', 'false'); });
      if (!was) { li.classList.add('open'); e.currentTarget.setAttribute('aria-expanded', 'true'); thumb.dataset.i = li.dataset.img; }
    });
  });

  /* ---------- quote form (front-end only: validates, no data is sent) ---------- */
  const qf = $('#quoteForm'), qm = $('#quoteMsg');
  qf.addEventListener('submit', e => {
    e.preventDefault();
    let bad = null;
    qf.querySelectorAll('[required]').forEach(f => {
      const ok = f.value.trim() && (f.type !== 'email' || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.value.trim()));
      f.closest('label').classList.toggle('err', !ok);
      f.setAttribute('aria-invalid', !ok);
      if (!ok && !bad) bad = f;
    });
    qm.classList.toggle('bad', !!bad);
    if (bad) { qm.textContent = 'Please complete the highlighted fields.'; bad.focus(); return; }
    qm.textContent = 'Thank you. This is a concept site, so nothing was sent, but a real build would reply the same business day.';
    qf.reset();
  });
  qf.addEventListener('input', e => { const l = e.target.closest('label'); if (l) l.classList.remove('err'); });

  /* ---------- reveal on view ---------- */
  $$('.ins-list li,.faq-list li,.tm,.foot-col,.cta .pill,.faq-head').forEach((el, i) => el.classList.add('rv'));
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .12 });
  $$('.rv').forEach(el => io.observe(el));
  const lgIO = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) {
      const i = $$('.lg').indexOf(e.target);
      e.target.style.transitionDelay = ((i % 5) * 70 + Math.floor(i / 5) * 90) + 'ms';
      e.target.classList.add('in'); lgIO.unobserve(e.target);
    }
  }), { threshold: .2 });
  $$('.lg').forEach(el => lgIO.observe(el));

  /* ---------- measurements ---------- */
  let W, H, U, Wu;
  const sc = {};
  let secs = [], footTop = 0, svMax = 0;
  const ABS = el => el.getBoundingClientRect().top + scrollY;
  function measure() {
    W = innerWidth; H = innerHeight; U = Math.min(H / 100, W * .0056); Wu = W / U;
    root.style.setProperty('--u', U + 'px');
    [['S', '#stats'], ['A', '#sceneA'], ['B', '#sceneB'], ['T', '#trusted']].forEach(([k, s]) => {
      const el = $(s); sc[k] = { el, top: ABS(el), h: el.offsetHeight };
    });
    secs = $$('section[data-label],footer[data-label]').map(el => ({ el, top: ABS(el), label: el.dataset.label }));
    secs.push({ el: null, top: sc.B.top, label: 'Why Arclines' });
    secs.sort((a, b) => a.top - b.top);
    footTop = ABS($('#contact'));
    svMax = Math.max(0, $('#svTrack').scrollWidth - W);
    sizeCanvas(globe); sizeCanvas(ocean);
  }

  /* =========================================================
     GLOBE
     ========================================================= */
  const globe = { cv: $('#globe') }; globe.ctx = globe.cv.getContext('2d');
  const ocean = { cv: $('#ocean') }; ocean.ctx = ocean.cv.getContext('2d');
  function sizeCanvas(o) {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    o.w = o.cv.clientWidth; o.h = o.cv.clientHeight;
    o.cv.width = Math.round(o.w * dpr); o.cv.height = Math.round(o.h * dpr);
    o.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  const cities = [['Sydney', -33.9, 151.2], ['Singapore', 1.3, 103.8], ['Shanghai', 31.2, 121.5], ['Tokyo', 35.7, 139.7], ['Hong Kong', 22.3, 114.2], ['Auckland', -36.8, 174.8], ['Mumbai', 19.1, 72.9], ['Dubai', 25.2, 55.3], ['Melbourne', -37.8, 145], ['Perth', -32, 115.9], ['Manila', 14.6, 121]];
  const arcs = [[0, 1], [1, 2], [2, 3], [0, 5], [4, 6], [1, 7], [8, 4], [9, 1], [10, 3]];
  const TILT = -.38;
  function vec(lat, lon, rot) {
    const la = lat * Math.PI / 180, lo = (lon + rot) * Math.PI / 180;
    const x = Math.cos(la) * Math.sin(lo), y0 = -Math.sin(la), z0 = Math.cos(la) * Math.cos(lo);
    const y = y0 * Math.cos(TILT) - z0 * Math.sin(TILT), z = y0 * Math.sin(TILT) + z0 * Math.cos(TILT);
    return [x, y, z];
  }
  const mouse = { x: .5, y: .5, sx: .5, sy: .5 };
  addEventListener('pointermove', e => { mouse.x = e.clientX / innerWidth; mouse.y = e.clientY / innerHeight; });

  function drawGlobe(t, c) {
    const { ctx, w, h } = globe;
    mouse.sx += (mouse.x - mouse.sx) * .05; mouse.sy += (mouse.y - mouse.sy) * .05;
    ctx.clearRect(0, 0, w, h);
    const R = Math.max(w * .335, Math.min(h * .62, 330));
    const cx = w * (w < 820 ? .78 : .95) + (mouse.sx - .5) * -26;
    const cy = h * (w < 820 ? .34 : .575) - c * .06 + (mouse.sy - .5) * -18;
    const rot = t * 2.6 + c * .035 + 30;
    const zoom = 1 + clamp(c / H) * .12;
    const r = R * zoom;

    // sphere body
    const body = ctx.createRadialGradient(cx - r * .3, cy - r * .2, r * .1, cx, cy, r);
    body.addColorStop(0, '#05060f'); body.addColorStop(1, '#010103');
    ctx.fillStyle = body; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.fill();

    // rim colours: orange at the top, dark to the left, blue along the lower left
    const mk = () => {
      const cg = ctx.createConicGradient(-Math.PI / 2, cx, cy);
      cg.addColorStop(0, 'rgba(255,128,70,1)');
      cg.addColorStop(.05, 'rgba(255,92,52,.95)');
      cg.addColorStop(.12, 'rgba(255,70,40,.2)');
      cg.addColorStop(.25, 'rgba(60,40,60,0)');
      cg.addColorStop(.40, 'rgba(20,40,160,.15)');
      cg.addColorStop(.50, 'rgba(34,66,255,.95)');
      cg.addColorStop(.60, 'rgba(34,66,255,1)');
      cg.addColorStop(.70, 'rgba(40,70,255,.55)');
      cg.addColorStop(.78, 'rgba(60,70,150,.1)');
      cg.addColorStop(.86, 'rgba(255,92,52,.0)');
      cg.addColorStop(.93, 'rgba(255,92,52,.7)');
      cg.addColorStop(1, 'rgba(255,128,70,1)');
      return cg;
    };
    ctx.save();
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.clip();
    ctx.strokeStyle = mk(); ctx.lineWidth = r * .2; ctx.globalAlpha = .5;
    ctx.beginPath(); ctx.arc(cx, cy, r - r * .05, 0, 7); ctx.stroke();
    ctx.lineWidth = r * .06; ctx.globalAlpha = .55; ctx.beginPath(); ctx.arc(cx, cy, r - r * .015, 0, 7); ctx.stroke();

    // grid
    ctx.globalAlpha = 1; ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(120,140,230,.17)';
    for (let i = 0; i < 12; i++) {
      ctx.beginPath(); let pen = false;
      for (let la = -90; la <= 90; la += 5) {
        const [x, y, z] = vec(la, i * 30, rot);
        if (z > 0) { const px = cx + x * r, py = cy + y * r; pen ? ctx.lineTo(px, py) : ctx.moveTo(px, py); pen = true; } else pen = false;
      }
      ctx.stroke();
    }
    for (let la = -60; la <= 60; la += 20) {
      ctx.beginPath(); let pen = false;
      for (let lo = 0; lo <= 360; lo += 5) {
        const [x, y, z] = vec(la, lo, rot);
        if (z > 0) { const px = cx + x * r, py = cy + y * r; pen ? ctx.lineTo(px, py) : ctx.moveTo(px, py); pen = true; } else pen = false;
      }
      ctx.stroke();
    }
    ctx.restore();

    // crisp rim
    ctx.strokeStyle = mk(); ctx.lineWidth = 3; ctx.shadowColor = 'rgba(60,90,255,.9)'; ctx.shadowBlur = 24;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.stroke();
    ctx.shadowBlur = 0; ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(255,255,255,.35)';
    ctx.beginPath(); ctx.arc(cx, cy, r + 5, Math.PI * 1.1, Math.PI * 1.55); ctx.stroke();

    // arcs
    ctx.save(); ctx.lineWidth = 1.2; ctx.setLineDash([7, 9]); ctx.lineDashOffset = -t * 26;
    arcs.forEach(([a, b], k) => {
      const A = vec(cities[a][1], cities[a][2], rot), B = vec(cities[b][1], cities[b][2], rot);
      ctx.beginPath(); let pen = false;
      for (let s = 0; s <= 1.0001; s += .02) {
        let x = lerp(A[0], B[0], s), y = lerp(A[1], B[1], s), z = lerp(A[2], B[2], s);
        const L = Math.hypot(x, y, z) || 1, lift = 1 + .5 * Math.sin(Math.PI * s) * (.4 + (k % 3) * .25);
        x = x / L * lift; y = y / L * lift; z = z / L * lift;
        if (z > -.15) { const px = cx + x * r, py = cy + y * r; pen ? ctx.lineTo(px, py) : ctx.moveTo(px, py); pen = true; } else pen = false;
      }
      ctx.strokeStyle = k % 2 ? 'rgba(255,120,80,.75)' : 'rgba(255,170,130,.55)'; ctx.stroke();
    });
    ctx.restore();

    // nodes + labels
    ctx.font = '600 9px "Tomorrow","Inter",sans-serif'; ctx.textBaseline = 'middle';
    cities.forEach(([n, la, lo]) => {
      const [x, y, z] = vec(la, lo, rot);
      if (z < .08) return;
      const px = cx + x * r, py = cy + y * r, a = clamp((z - .08) * 3);
      ctx.fillStyle = `rgba(255,255,255,${a})`; ctx.beginPath(); ctx.arc(px, py, 2.1, 0, 7); ctx.fill();
      ctx.strokeStyle = `rgba(255,255,255,${a * .35})`; ctx.beginPath(); ctx.arc(px, py, 6 + Math.sin(t * 2 + la) * 1.5, 0, 7); ctx.stroke();
      ctx.fillStyle = `rgba(200,210,235,${a * .8})`; ctx.fillText(n.toUpperCase(), px + 9, py);
    });
  }

  /* =========================================================
     OCEAN
     ========================================================= */
  const lights = Array.from({ length: 260 }, (_, i) => {
    const s = (i * 9301 + 49297) % 233280 / 233280, s2 = (i * 7919 + 1237) % 104729 / 104729;
    return { x: s, y: Math.pow(s2, .6), a: .25 + ((i * 31) % 10) / 20, r: .6 + ((i * 17) % 10) / 7 };
  });
  /* marbled water texture (tileable ridge noise) */
  const waterTex = (() => {
    const N = 256, c = document.createElement('canvas'); c.width = c.height = N;
    const cx = c.getContext('2d'), id = cx.createImageData(N, N);
    let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const oct = [[8, .55], [16, .3], [32, .15]].map(([g, a]) => ({ g, a, v: Array.from({ length: g * g }, rnd) }));
    const sm = t => t * t * (3 - 2 * t);
    const val = (o, x, y) => { const fx = x / N * o.g, fy = y / N * o.g, x0 = Math.floor(fx), y0 = Math.floor(fy), tx = sm(fx - x0), ty = sm(fy - y0), g = o.g, at = (i, j) => o.v[((j % g) * g) + (i % g)];
      return (at(x0, y0) * (1 - tx) + at(x0 + 1, y0) * tx) * (1 - ty) + (at(x0, y0 + 1) * (1 - tx) + at(x0 + 1, y0 + 1) * tx) * ty; };
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      let n = 0; oct.forEach(o => (n += val(o, x, y) * o.a));
      const r = Math.max(0, 1 - Math.abs(n - .5) / .028), i = (y * N + x) * 4;
      id.data[i] = 160; id.data[i + 1] = 205; id.data[i + 2] = 255; id.data[i + 3] = Math.round(r * r * 135);
    }
    cx.putImageData(id, 0, 0); return c;
  })();
  function drawOcean(t) {
    const { ctx, w, h } = ocean;
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#020a30'); g.addColorStop(.5, '#07217f'); g.addColorStop(1, '#0a36c6');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 9; i++) {
      const x = (((i * .37 + .08) % 1) + Math.sin(t * .13 + i) * .05) * w;
      const y = (((i * .53 + .1) % 1) + Math.cos(t * .11 + i * 2) * .04) * h;
      const r = h * (.34 + .08 * Math.sin(t * .2 + i));
      const rg = ctx.createRadialGradient(x, y, 0, x, y, r);
      const lite = i % 3 === 0;
      rg.addColorStop(0, lite ? 'rgba(120,170,255,.26)' : 'rgba(26,86,255,.30)'); rg.addColorStop(1, 'rgba(10,40,200,0)');
      ctx.fillStyle = rg; ctx.fillRect(0, 0, w, h);
    }
    [[1.5, .20, 0, 26], [2.4, .12, 15, 44]].forEach(([sc2, al, ph, sp]) => {
      const S = 256 * sc2, ox = (t * sp * .35 + ph * 9) % S, oy = (t * sp) % S;
      ctx.globalAlpha = al; ctx.globalCompositeOperation = 'screen';
      for (let x = -ox; x < w; x += S) for (let y = -S + oy; y < h; y += S) ctx.drawImage(waterTex, x, y, S, S);
    });
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
    ctx.fillStyle = '#9fc2ff';
    lights.forEach(l => {
      ctx.globalAlpha = l.a * (.5 + .5 * Math.sin(t * 1.4 + l.x * 40)) * (.35 + l.y * .75);
      ctx.beginPath(); ctx.arc(l.x * w, h * (.3 + l.y * .7), l.r, 0, 7); ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  /* =========================================================
     SCENE A  — reach stacker → truck → services
     ========================================================= */
  const el = {
    stacker: $('#aStacker'), stack: $('#aStack'), truck: $('#aTruck'), cont: $('#aCont'), cam: $('#aCam'),
    dark: $('#aDark'), bot: $('#aBot'), ghost: $('#aGhost'), topdown: $('#aTopdown'), track: $('#svTrack'),
    contEnd: $('.f-end', $('#aCont')), contSide: $('.f-side', $('#aCont')), spreader: $('.spreader', $('#aCont')),
    svTitle: $('#svTitle')
  };
  function updA(c) {
    const A = sc.A, p = clamp((c - A.top) / (A.h - H)), u = U;
    const truckLeft = T(p, [[.38, 192], [.5, 78], [.7, 88], [.88, 112]]);
    const th = T(p, [[.15, -18.8], [.3, -31.8]]);
    const tip = rotPt(STK.S, th), tipX = STK.L0 + tip[0] * STK.k, tipY = 51.5 + tip[1] * STK.k;
    const contCx = p < .3 ? tipX : p < .5 ? T(p, [[.3, tipX], [.5, 117]]) : truckLeft + 39;
    const contTop = p < .3 ? tipY : T(p, [[.3, tipY], [.5, 30], [.58, 64.5]]);
    const contW = T(p, [[.3, 14], [.5, 78]]);
    const contH = T(p, [[.3, 17], [.5, 19]]);
    const rise = Math.pow(1 - seg(p, 0, .08), 3) * 45;     // vehicles are already rolling in as the scene pins

    const mobA = W <= 820;
    const zA = mobA ? 1.55 : 1.8;                       // opening camera is zoomed in (reel: boom + container fill the frame)
    const s = T(p, [[.3, zA], [.5, 1.05], [.7, .75]]) * (mobA ? T(p, [[.3, 1], [.5, 1.3], [.7, 1]]) : 1);
    const sxF = T(p, [[.3, mobA ? .5 : .74], [.5, .5], [.7, .30], [.88, .33]]);
    const fx = p < .5 ? contCx : truckLeft + 39;
    const tx = sxF * Wu * u - fx * u * s;
    const G0 = mobA ? H * .74 : H * 1.0, Gf = mobA ? H * .46 : H * .57;
    const Gy = T(p, [[.3, G0], [.5, G0], [.7, Gf]]);
    const ty = Gy - 93 * u * s;
    el.cam.style.transform = `translate3d(${tx}px,${ty}px,0) scale(${s})`;

    // stacker + stack
    const sx = T(p, [[.3, 0], [.48, -58]]) * u;
    el.stacker.style.transform = `translate3d(${STK.L0 * u + sx}px,${51.5 * u + rise * u}px,0)`;
    el.stacker.style.opacity = 1 - seg(p, .44, .5);
    el.stack.style.transform = `translate3d(0,${rise * u}px,0)`;
    el.stack.style.opacity = 1 - seg(p, .38, .5);
    if (stk.boom) {
      stk.boom.style.transform = `rotate(${th}deg)`;
      const a0 = Math.atan2(STK.A[1] - STK.B[1], STK.A[0] - STK.B[0]), A1 = rotPt(STK.A, th), a1 = Math.atan2(A1[1] - STK.B[1], A1[0] - STK.B[0]);
      stk.cyl.style.transform = `rotate(${(a1 - a0) * 180 / Math.PI}deg)`;
    } else if (boom) boom.style.transform = `rotate(${T(p, [[.15, 0], [.3, -13]])}deg)`;

    // container (end view → side view as the "camera orbits")
    const k = seg(contW, 14, 34);
    el.cont.style.width = contW * u + 'px'; el.cont.style.height = contH * u + 'px';
    const flat0 = ease(seg(p, .88, .95));
    el.cont.style.transform = `translate3d(${(contCx - contW / 2) * u}px,${(contTop + rise) * u}px,0) scaleY(${1 - .88 * flat0})`;
    el.cont.style.opacity = 1 - seg(p, .9, .96);
    el.contEnd.style.opacity = 1 - k; el.contSide.style.opacity = k;
    el.spreader.style.opacity = seg(p, .3, .36) * (1 - seg(p, .58, .68));

    // truck
    const flat = ease(seg(p, .88, .95));
    el.truck.style.transform = `translate3d(${truckLeft * u}px,${63 * u}px,0) scaleY(${1 - .88 * flat})`;
    el.truck.style.opacity = 1 - seg(p, .9, .96);

    // services panel
    const top = T(p, [[.52, H], [.7, Gf], [.9, Gf], [1, H * .1]]);
    el.dark.style.clipPath = `inset(${top}px 0 0 0)`;
    el.track.style.transform = snap(`translate3d(${-ease(seg(p, .66, .9)) * svMax}px,0,0)`);
    el.svTitle.style.opacity = seg(p, .6, .68);
    el.ghost.style.opacity = seg(p, .56, .68) * (1 - seg(p, .88, .95));
    el.ghost.style.transform = snap(`translate3d(${lerp(.15 * W, -.62 * W, seg(p, .55, .92))}px,0,0)`);
    el.bot.style.transform = snap(`translateY(${T(p, [[.9, H], [1, H * .84]])}px)`);
    const tdS = 2.6;
    el.topdown.style.opacity = seg(p, .9, .97);
    el.topdown.style.transform = `translate3d(${W * (mobA ? .4 : .3) - 44.2 * u}px,${H * (mobA ? .52 : .42) - 9.75 * u}px,0) scale(${tdS / 2.6})`;
  }

  /* =========================================================
     SCENE B — road → reliability → ocean → clouds
     ========================================================= */
  const b = {
    TL: $('#pnTL'), L: $('#pnL'), R: $('#pnR'), truck: $('#bTruck'), ship: $('#bShip'), tag: $('#bTag'),
    clouds: $('#bClouds'), cloudI: $$('#bClouds i'), feat: $('#featList'), rel: $('#relTitle'), co: $$('.co'),
    oceanCv: $('#ocean')
  };
  const coTop = [42, 42, 80, 80, 122];
  function place(elm, x, y, w, h, tl, tr, br, bl) {
    const s = elm.style;
    s.left = x + '%'; s.top = y + '%'; s.width = w + '%'; s.height = h + '%';
    s.borderRadius = `${tl}vw ${tr}vw ${br}vw ${bl}vw`;
  }
  function updB(c) {
    const B = sc.B, p = clamp((c - B.top) / (B.h - H)), u = U;
    const mob = W <= 820;

    // panel shapes
    const exit = ease(seg(p, .53, .62));
    const tlY = p < .1 ? T(p, [[0, -12], [.05, 0]]) : T(p, [[.1, 0], [.24, -24]]) - exit * 100;
    place(b.TL, 0, tlY, 100, T(p, [[.05, 10], [.1, 18]]), 0, 0, T(p, [[.05, 0], [.1, 2.5]]), T(p, [[.05, 0], [.1, 2.5]]));
    // L
    const Lx = 0, Ly = T(p, [[0, 84], [.1, mob ? 50 : 50], [.24, 0]]) - exit * 115;
    const Lw = mob ? T(p, [[0, 100], [.1, 100], [.24, 100]]) : T(p, [[0, 100], [.1, 47], [.24, 47]]);
    const Lh = mob ? T(p, [[0, 60], [.24, 47]]) : T(p, [[0, 60], [.1, 60], [.24, 100]]);
    const Lr = T(p, [[0, 3], [.1, 12], [.24, 2]]);
    place(b.L, Lx, Ly, Lw, Lh, mob ? Lr : 0, Lr, T(p, [[.1, 0], [.24, 2]]), 0);
    // R
    const Rx = mob ? T(p, [[0, 100], [.24, 3]]) : T(p, [[0, 100], [.1, 70], [.24, 63]]);
    const Ry = (mob ? T(p, [[0, 100], [.1, 100], [.24, 52]]) : T(p, [[0, 100], [.1, 62], [.24, 4]])) - exit * 115;
    const Rw = mob ? 94 : T(p, [[0, 30], [.1, 30], [.24, 36.5]]);
    const Rh = mob ? 46 : T(p, [[0, 50], [.1, 40], [.24, 92]]);
    const Rr = T(p, [[.1, 2], [.24, 2]]);
    place(b.R, Rx, Ry, Rw, Rh, Rr, Rr, Rr, Rr);

    // titles & features
    b.rel.style.transform = snap(`translate3d(0,${(1 - ease(seg(p, .1, .24))) * H * .48}px,0)`);
    reveal(relSplit, seg(p, .2, .3), '#b3b8c6', '#0b0c10');
    b.feat.style.transform = snap(`translate3d(0,${T(p, [[.26, 0], [.5, -1.07 * H]], true)}px,0)`);

    // truck (top-down)
    // path = Catmull-Rom spline (% of viewport); heading follows the tangent, so the turn is a real arc
    // path: leaves the scene-A hand-off point heading right, eases onto a straight lane, then one clockwise arc into the gap between the panels
    const tp = truckPath(W, H, mob);
    const tk = clamp(p / (mob ? .12 : .42)), sp = tk * .85 + ease(tk) * .15;                  // near-constant speed, soft start
    const q = sp * (tp.n - 1), qi = Math.min(tp.n - 2, Math.floor(q)), qf = q - qi;
    const tcx = lerp(tp.x[qi], tp.x[qi + 1], qf), tcy = lerp(tp.y[qi], tp.y[qi + 1], qf);
    const a0 = tp.a[qi], a1 = tp.a[qi + 1], trot = a0 + (a1 - a0) * qf;
    const tsc = lerp(2.6, mob ? 1.25 : .95, ease(clamp(p / .14)));
    b.truck.style.transform = `translate3d(${tcx - 44.2 * u}px,${tcy - 9.75 * u}px,0) rotate(${trot}deg) scale(${tsc / 2.6})`;
    b.truck.style.opacity = mob ? 1 - seg(p, .2, .24) : 1 - seg(p, .52, .6);

    // ocean + ship
    const oAlpha = seg(p, .5, .58) * (1 - seg(p, .965, 1));
    b.oceanCv.style.opacity = oAlpha;
    const z = T(p, [[.52, 5.2], [.68, 1.15], [.78, 1.15], [.84, 1], [.92, .78], [1, .4]]) * (mob ? 1.7 : 1);
    const yp = T(p, [[.52, 50], [.68, 76], [.78, 76], [.84, 58], [.92, 50], [1, 60]]);
    b.ship.style.opacity = seg(p, .535, .58) * (1 - seg(p, .96, .995));
    b.ship.style.transform = `translate3d(-50%,${yp / 100 * H - 23 * u}px,0) scale(${z})`;

    // tagline
    const tin = seg(p, .66, .72), tout = seg(p, .76, .8);
    b.tag.style.opacity = tin * (1 - tout);
    b.tag.style.transform = snap(`translate3d(0,${(1 - tin) * 30 - tout * 26}px,0)`);

    // call-outs
    const wy = T(p, [[.8, 0], [.88, -.63 * H], [.94, -H]]);
    const cin = seg(p, .79, .84);
    b.co.forEach((cEl, i) => {
      const yc = coTop[i] / 100 * H + wy;
      const o = cin * clamp((yc - .04 * H) / (.12 * H)) * clamp((H * .98 - yc) / (.14 * H));
      cEl.style.opacity = o;
      cEl.style.transform = `translate3d(0,${Math.round(wy - cEl.offsetHeight / 2)}px,0)`;
    });

    // clouds
    const co = seg(p, .88, .97);
    b.clouds.style.opacity = co;
    const cs = 1 + seg(p, .88, 1) * 1.4;
    b.cloudI.forEach((e, i) => { e.style.transform = `scale(${cs}) translate(${(i % 2 ? 1 : -1) * seg(p, .88, 1) * 6}%,0)`; });
    bFlat.style.opacity = seg(p, .96, 1);
  }

  /* =========================================================
     STATS + TRUSTED
     ========================================================= */
  const st = { img: $('.stats__img'), title: $('#statsTitle'), right: $('#statsRight') };
  function updS(c) {
    const S = sc.S, p = clamp((c - S.top) / (S.h - H));
    const mob = W <= 820;
    st.img.style.transform = snap(`translate3d(0,${lerp(H * .42, -H * .3, ease(seg(p, 0, .75)))}px,0)`);
    if (mob) {
      st.title.style.transform = snap(`translate3d(0,${lerp(H * .5, H * .07, ease(seg(p, 0, .2)))}px,0)`);
      st.right.style.transform = snap(`translate3d(0,${lerp(H * .62, -(st.right.offsetHeight - H * .5), seg(p, 0, 1))}px,0)`);
    } else {
      st.title.style.transform = snap(`translate3d(0,${lerp(H * .66, H * .36, seg(p, 0, .6))}px,0)`);
      st.right.style.transform = snap(`translate3d(0,${lerp(H * .06, -(st.right.offsetHeight - H * .62), seg(p, 0, 1))}px,0)`);
    }
    reveal(statsSplit, seg(p, .12, .7), '#a8adbb', '#0b0c10');
  }
  const tr = { plane: $('#trPlane'), cloud: $('#trCloud') };
  function updT(c) {
    const Tt = sc.T, pp = clamp((c - (Tt.top - .3 * H)) / (1.7 * H));
    tr.plane.style.backgroundPosition = `${lerp(0, -90, pp)}px ${lerp(0, -380, pp)}px, 0 0, 0 0`;
    tr.cloud.style.opacity = 1 - seg(pp, 0, .45);
  }

  /* =========================================================
     FIXED UI + MAIN LOOP
     ========================================================= */
  const label = $('#secLabel'), labelSpan = $('span', label), ring = $('#scRing');
  let lastLabel = null;
  function updUI(c) {
    document.body.classList.toggle('past-hero', c > H * .5);
    document.body.classList.toggle('in-foot', c + H * .55 > footTop);
    let cur = secs[0];
    secs.forEach(s => { if (s.top <= c + H * .5) cur = s; });
    const txt = c > H * .6 ? cur.label : '';
    if (txt !== lastLabel) { lastLabel = txt; if (txt) labelSpan.textContent = txt; label.classList.toggle('on', !!txt); }
    const max = document.documentElement.scrollHeight - H;
    ring.style.strokeDashoffset = 94.25 * (1 - clamp(c / max));
  }

  let target = scrollY, cur = target, g = 0, t0 = performance.now(), lastG = -1, lastT = 0, lastGlobe = 0, lastOcean = 0;
  function frame(now) {
    const t = (now - t0) / 1000;
    const dt = Math.min(.1, Math.max(.001, t - lastT)); lastT = t;
    target = scrollY;
    const d = target - cur;
    cur += noMotion ? d : d * (1 - Math.exp(-dt * 6.4));
    if (Math.abs(d) < .1) cur = target;
    const gt = noMotion ? 0 : clamp(Math.abs(d) / H * 6.5);
    g += (gt - g) * (1 - Math.exp(-dt * 14));
    const gq = Math.round(g * 40) / 40;


    const c = cur;
    if (c < H * 1.4 && now - lastGlobe > 20) { lastGlobe = now; drawGlobe(t, c); }
    updS(c);
    if (c > sc.A.top - H && c < sc.A.top + sc.A.h) updA(c);
    if (c > sc.B.top - H && c < sc.B.top + sc.B.h) {
      updB(c);
      if (parseFloat(b.oceanCv.style.opacity) > .001 && now - lastOcean > 30) { lastOcean = now; drawOcean(t); }
    }
    if (c > sc.T.top - 1.2 * H && c < sc.T.top + sc.T.h) updT(c);
    updUI(c);
    requestAnimationFrame(frame);
  }

  /* ---------- navigation ---------- */
  const anchors = () => ({
    about: sc.S.top - H * .1,
    services: sc.A.top + (sc.A.h - H) * .74,
    industries: sc.T.top - H * .2,
    insights: ABS($('#insights')),
    careers: ABS($('#faq')),
    contact: footTop,
    quote: footTop
  });
  const go = k => scrollTo({ top: anchors()[k], behavior: noMotion ? 'auto' : 'smooth' });
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-go]');
    if (a) { e.preventDefault(); document.body.classList.remove('menu-open'); go(a.dataset.go); return; }
    const top = e.target.closest('a[href="#top"]');
    if (top) { e.preventDefault(); scrollTo({ top: 0, behavior: 'smooth' }); }
  });
  $('#scInd').addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
  $('#menuBtn').addEventListener('click', () => {
    const o = document.body.classList.toggle('menu-open');
    $('#menuBtn').setAttribute('aria-expanded', o);
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') document.body.classList.remove('menu-open'); });

  /* ---------- boot ---------- */
  let rt;
  addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(measure, 120); });
  function boot() {
    measure();
    const jump = params.get('scene');
    if (jump && sc[jump]) scrollTo(0, sc[jump].top + parseFloat(params.get('p') || 0) * (sc[jump].h - H));
    else if (params.has('y')) scrollTo(0, parseFloat(params.get('y')) * (document.documentElement.scrollHeight - H));
    cur = target = scrollY;
    document.body.classList.add('loaded');
    requestAnimationFrame(frame);
  }
  const ready = document.fonts && document.fonts.ready ? Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 900))]) : Promise.resolve();
  ready.then(() => { boot(); setTimeout(measure, 600); });
  addEventListener('load', () => measure());
})();
