/* ADF cube: six real faces, CSS 3D, orientation kept as a quaternion so drag, inertia and snapping are exact.
   States: rest (logo forward) -> tour (hover) -> rest; drag / pick -> pinned until reset. One animation at a time. */
(function () {
  var d = document, root = d.documentElement;
  var stage = d.getElementById('cube-stage'), cube = d.getElementById('cube'), list = d.getElementById('cube-svc'), reset = d.getElementById('cube-reset');
  if (!stage || !cube || !list) return;
  var items = [].slice.call(list.children), faces = [].slice.call(cube.querySelectorAll('.cb-face'));
  var descs = [].slice.call(d.querySelectorAll('#cube-descs p'));   /* [0] is the hint shown at rest */
  var still = matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* ---- quaternions [x,y,z,w]; same axis convention as CSS rotateX/rotateY ---- */
  function axis(x, y, z, deg) { var a = deg * Math.PI / 360, s = Math.sin(a); return [x * s, y * s, z * s, Math.cos(a)]; }
  function mul(a, b) { return [a[3]*b[0]+a[0]*b[3]+a[1]*b[2]-a[2]*b[1], a[3]*b[1]-a[0]*b[2]+a[1]*b[3]+a[2]*b[0], a[3]*b[2]+a[0]*b[1]-a[1]*b[0]+a[2]*b[3], a[3]*b[3]-a[0]*b[0]-a[1]*b[1]-a[2]*b[2]]; }
  function norm(q) { var l = Math.hypot(q[0], q[1], q[2], q[3]); return [q[0]/l, q[1]/l, q[2]/l, q[3]/l]; }
  function dot(a, b) { return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]+a[3]*b[3]; }
  function slerp(a, b, t) { var c = dot(a, b); if (c < 0) { b = [-b[0], -b[1], -b[2], -b[3]]; c = -c; }
    if (c > .9995) return norm([a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t, a[2]+(b[2]-a[2])*t, a[3]+(b[3]-a[3])*t]);
    var th = Math.acos(c), s = Math.sin(th), p = Math.sin((1-t)*th)/s, r = Math.sin(t*th)/s;
    return [a[0]*p+b[0]*r, a[1]*p+b[1]*r, a[2]*p+b[2]*r, a[3]*p+b[3]*r]; }
  function rot(q, v) { var x=q[0],y=q[1],z=q[2],w=q[3], tx=2*(y*v[2]-z*v[1]), ty=2*(z*v[0]-x*v[2]), tz=2*(x*v[1]-y*v[0]);
    return [v[0]+w*tx+y*tz-z*ty, v[1]+w*ty+z*tx-x*tz, v[2]+w*tz+x*ty-y*tx]; }
  function css(q) { var x=q[0],y=q[1],z=q[2],w=q[3];
    return 'matrix3d(' + [1-2*(y*y+z*z), 2*(x*y+z*w), 2*(x*z-y*w), 0, 2*(x*y-z*w), 1-2*(x*x+z*z), 2*(y*z+x*w), 0, 2*(x*z+y*w), 2*(y*z-x*w), 1-2*(x*x+y*y), 0, 0,0,0,1].map(function (n) { return n.toFixed(5); }) + ')'; }

  /* face i sits at FACE[i] in the stylesheet; turning the cube by the inverse brings it forward and upright */
  var FACE = [axis(0,1,0,0), axis(0,1,0,90), axis(0,1,0,180), axis(0,1,0,-90), axis(1,0,0,90), axis(1,0,0,-90)];
  var NORMAL = FACE.map(function (f) { return rot(f, [0, 0, 1]); });
  var TILT = mul(axis(1,0,0,-14), axis(0,1,0,-24));           /* never dead flat: two more faces always show */
  var TARGET = FACE.map(function (f) { return mul(TILT, [-f[0], -f[1], -f[2], f[3]]); });
  var LIGHT = (function (v) { var l = Math.hypot(v[0], v[1], v[2]); return [v[0]/l, v[1]/l, v[2]/l]; })([.45, -.6, .66]); /* above right, towards viewer */

  var q = TILT, mode = 'rest', active = -1, raf = 0, timer = 0, tween = null, vel = [0, 0], last = 0;

  function nearest() { var best = 0, bz = -2; NORMAL.forEach(function (n, i) { var z = rot(q, n)[2]; if (z > bz) { bz = z; best = i; } }); return best; }
  /* WebGL when available (cube-gl.js, ?nogl turns it off); otherwise the CSS cube below is the renderer */
  /* started when the browser is idle, so the first screen is not blocked; cube-gl.js adds .is-gl once its faces are painted */
  var plate = 1, gl3 = null;
  /* page-open intro, "the dimensional fold" (one timeline, ms from its start, plays once).
     The six faces hang apart around the cube's place, half-clear and turned 90 deg about their own normals, while a tesseract
     (4D hypercube) wireframe turns in the XW and ZW planes around them. Opposite faces travel as pairs on curved paths (an
     orbit about the cube's centre that closes as they come in), flip the last 90 deg just before contact and lock with a
     small magnetic snap and recoil: top and bottom first, then the two sides, then front and back (LOCK). Every lock sends
     one thin ring out in the plane of that face. As the last pair locks the cage flattens onto the cube's twelve edges and
     fades, one rim light crosses the cube, the light pool fades in and the logo plate pops (POP ms), then holds 5 s.
     The view starts a little further back and turned, and eases to rest. It waits while the tab is hidden and is simply
     there under reduced motion. For inspection: ?fold=slow plays it at quarter speed, ?cage=0 hides the cage. */
  var FLY = 1000, WAVE0 = [0, 420, 880], LOCK = WAVE0[2] + FLY, POP = 750, END = LOCK + 80 + POP;
  var SLOW = /[?&]fold=slow/.test(location.search) ? .25 : 1;
  var introAt = 0, introDone = still, doneAt = 0, hidAt = 0, pop = still ? 1 : 0, pa = still ? 1 : 0, lt = -1, I = null;   /* lt: logo-light sweep 0..1, -1 = off */
  var lite = matchMedia('(pointer:coarse)').matches && ((navigator.deviceMemory || 8) <= 4 || (navigator.hardwareConcurrency || 8) <= 4);
  /* per face: its wave, the axis and angle of its approach orbit (deg), and how far out it starts (cube = 1) */
  var WAVE = [2, 1, 2, 1, 0, 0], ORB = [[1,0,0, 12], [0,1,0, -24], [1,0,0, 12], [0,1,0, -24], [0,0,1, 40], [0,0,1, 40]], DIST = [.6, .62, .6, .62, .5, .5];
  var FM = [], FO = [], FA = new Float32Array(6), FG = new Float32Array(6), FR = new Float32Array(6), CG = { a: 0, b: 0, flat: 1, k: 1, al: 0 };
  faces.forEach(function () { FM.push(new Float32Array(9)); FO.push(new Float32Array(3)); });   /* where each face is while it folds in: 3x3 turn + offset */
  var IO = { fold: { m: FM, o: FO, a: FA, g: FG, r: FR, cage: lite || /[?&]cage=0/.test(location.search) ? null : CG }, zoom: 1, yaw: 0, pitch: 0, sweep: -1 };
  var BASE = ['', 'rotateY(90deg) ', 'rotateY(180deg) ', 'rotateY(-90deg) ', 'rotateX(90deg) ', 'rotateX(-90deg) '];   /* the faces' own turns in the stylesheet */
  function clamp(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function sweep(x) { x = clamp(x); return x * x * (3 - 2 * x); }
  function eio(x) { x = clamp(x); return x < .5 ? 4*x*x*x : 1 - Math.pow(-2*x + 2, 3) / 2; }
  function easeBack(t) { var c = 1.6; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); }   /* small overshoot */
  function qm(a, m) { var x = a[0], y = a[1], z = a[2], w = a[3];   /* quaternion -> 3x3, same layout as css() and the shader's uR */
    m[0] = 1-2*(y*y+z*z); m[1] = 2*(x*y+z*w); m[2] = 2*(x*z-y*w); m[3] = 2*(x*y-z*w); m[4] = 1-2*(x*x+z*z); m[5] = 2*(y*z+x*w); m[6] = 2*(x*z+y*w); m[7] = 2*(y*z-x*w); m[8] = 1-2*(x*x+y*y); }
  function introTick(now) {
    if (!introAt || introDone) return false;
    var t = (now - introAt) * SLOW;
    for (var i = 0; i < 6; i++) {
      var st = WAVE0[WAVE[i]], x = (t - st) / FLY, tc = t - st - FLY, p, rec = 0;
      if (x < 0) p = -.07 * (st - t) / st;                                  /* waiting for its wave: a slow drift inwards */
      else if (x < .86) p = .94 * eio(x / .86);                             /* the approach */
      else if (x < 1) p = .94 + .06 * Math.pow((x - .86) / .14, 2);         /* the last 6% closes fast, like a magnet */
      else { p = 1; if (tc < 420) rec = .028 * Math.abs(Math.sin(Math.PI * tc / 140)) * Math.exp(-tc / 95); }   /* locked: micro-recoil, outwards only */
      var k = 1 - p, o = ORB[i], n = NORMAL[i], Qo = axis(o[0], o[1], o[2], o[3] * k);
      qm(mul(Qo, axis(n[0], n[1], n[2], (i % 2 ? -90 : 90) * (1 - eio((x - .5) / .34)))), FM[i]);   /* orbit, and the 90 deg flip that ends just before contact */
      var c = rot(Qo, n), far = k * DIST[i] + rec;
      FO[i][0] = c[0] * far; FO[i][1] = c[1] * far; FO[i][2] = c[2] * far;
      FA[i] = clamp((t - 70 * WAVE[i]) / 360) * (.45 + .55 * sweep((x - .4) / .42));
      FG[i] = x < 1 ? .5 * clamp(t / 300) * (1 - .5 * clamp(p)) : .8 * Math.exp(-tc / 210);
      FR[i] = !lite && tc >= 0 && tc < 560 ? tc / 560 : -1;
    }
    var T = clamp(t / LOCK), dec = Math.pow(1 - T, 1.6), e = eio(T);       /* the cage turns fast at first and slows into alignment */
    CG.a = -2.6 * dec; CG.b = -1.7 * dec; CG.flat = 1 - sweep((T - .55) / .45); CG.k = .72 + .28 * sweep((T - .5) / .5);
    CG.al = clamp(t / 350) * (t < LOCK ? .5 + .25 * sweep((T - .85) / .15) : .75 * clamp(1 - (t - LOCK) / 520));
    IO.zoom = .78 + .22 * e; IO.yaw = -10 * (1 - e); IO.pitch = 3 * (1 - e); IO.sweep = t > LOCK && t < LOCK + 700 ? (t - LOCK) / 700 : -1;
    I = IO;
    var u = clamp((t - LOCK - 80) / POP);
    pop = .55 + .45 * easeBack(u); pa = Math.min(1, u / .45);
    if (t >= LOCK && !stage.classList.contains('is-lock')) stage.classList.add('is-lock');
    if (t >= END) { introDone = true; doneAt = now; I = null; stage.classList.add('is-ready'); faces.forEach(function (f) { f.style.transform = ''; }); markLater(); }
    return !introDone;
  }
  function startIntro() {
    if (introAt) return;
    if (d.hidden) { hidAt = -1; return; }                        /* opened in a background tab: play it when the tab is shown */
    if (!seen) { waitView = true; return; }                      /* below the fold (phones): play it when the cube scrolls in */
    introAt = performance.now(); stage.classList.add('is-in');
    holdUntil = introAt + (LOCK + 80) / SLOW + 5000;            /* the logo stays 5 s after it appears, then the cycle starts */
    if (still) { stage.classList.add('is-ready', 'is-lock'); paint(); return; }
    introTick(introAt); paint();
    if (!raf) { last = introAt; raf = requestAnimationFrame(frame); }
  }
  d.addEventListener('visibilitychange', function () {         /* the timeline waits while the tab is hidden */
    var now = performance.now();
    if (d.hidden) { if (introAt && !introDone) hidAt = now; }
    else if (hidAt === -1) { hidAt = 0; startIntro(); }
    else if (hidAt) { introAt += now - hidAt; holdUntil += now - hidAt; hidAt = 0; }
  });
  /* after the intro: at rest a very slow drift; with a mouse over the cube it leans a few degrees toward it and a soft
     second highlight follows the cursor across the faces (WebGL, not on weak phones) */
  var ptr = [0, 0], ptrS = [0, 0], pOn = 0, pOnS = 0, drifts = !still && !lite;
  function spun() {
    if (I) return mul(mul(axis(0,1,0, I.yaw), axis(1,0,0, I.pitch)), q);   /* the intro's camera: turned a little, easing to rest */
    if (!drifts || !introDone || !gl3) return q;
    var s = (performance.now() - doneAt) / 1000, u = clamp(s / 3), k = plate * plate * u * u * (3 - 2 * u);   /* drift starts at zero and eases in, so nothing jumps when the intro hands over */
    ptrS[0] += (ptr[0] - ptrS[0]) * .08; ptrS[1] += (ptr[1] - ptrS[1]) * .08; pOnS += (pOn - pOnS) * .08;
    return mul(mul(axis(0,1,0, k * 2.2 * Math.sin(s * .33) + 4 * ptrS[0]), axis(1,0,0, k * 1.4 * Math.sin(s * .27 + 1) - 3 * ptrS[1])), q);
  }
  stage.addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse' || down) return;
    var r = stage.getBoundingClientRect(); ptr = [(e.clientX - r.left) / r.width * 2 - 1, (e.clientY - r.top) / r.height * 2 - 1]; pOn = 1; wake();
  });
  stage.addEventListener('pointerleave', function () { ptr = [0, 0]; pOn = 0; });
  stage.addEventListener('pointerdown', function () { ptr = [0, 0]; pOn = 0; });
  function opts() {
    var o = { plate: plate, pa: pa, pop: pop, lt: still ? -1 : lt, lp: [ptrS[0], ptrS[1], drifts ? pOnS : 0] };
    if (I) for (var k in I) o[k] = I[k];
    return o;
  }
  function startGL() {
    if (!window.ADFCubeGL || /nogl/.test(location.search)) return;
    gl3 = window.ADFCubeGL(stage, cube, faces, FACE, rot, function () { gl3 = null; stage.classList.remove('is-gl'); paint(); });
  }
  if (lite) stage.classList.add('is-lite');
  function paint() {
    /* shadow width = the cube's on-screen width: |x| extent of the rotated unit axes (1 face-on, ~1.41 on an edge) */
    var x = q[0], y = q[1], z = q[2], w = q[3];
    stage.style.setProperty('--shw', (Math.abs(1-2*(y*y+z*z)) + Math.abs(2*(x*y-z*w)) + Math.abs(2*(x*z+y*w))).toFixed(3));
    if (gl3 && pOn) wake();
    var r = spun();
    if (gl3) { gl3.draw(r, opts()); if (stage.classList.contains('is-gl')) return; }   /* keep the CSS cube moving until WebGL is ready */
    var zm = I ? I.zoom.toFixed(4) : '';
    cube.style.setProperty('--m', css(r) + (I ? ' scale3d(' + zm + ',' + zm + ',' + zm + ')' : ''));
    cube.style.setProperty('--pop', pop.toFixed(3)); cube.style.setProperty('--pa', pa.toFixed(3));
    var cs = cube.offsetWidth;
    faces.forEach(function (f, i) {                              /* CSS cube: the same fold, without the cage, the rings and the rim light */
      var n = rot(r, NORMAL[i]), s = f.style;
      if (I) { var m = FM[i], o = FO[i];
        s.transform = 'matrix3d(' + [m[0], m[1], m[2], 0, m[3], m[4], m[5], 0, m[6], m[7], m[8], 0, o[0] * cs, o[1] * cs, o[2] * cs, 1].map(function (v) { return v.toFixed(4); }) + ') ' + BASE[i] + 'translateZ(var(--h))'; }
      s.setProperty('--fa', (I ? FA[i] : 1).toFixed(3));
      s.setProperty('--lit', Math.max(0, n[0]*LIGHT[0] + n[1]*LIGHT[1] + n[2]*LIGHT[2]).toFixed(3));
    });
  }
  /* the WebGL cube is redrawn (about 30 fps) only while something on it moves: the cursor light settling, or the soft light that
     crosses the logo once every 11-17 s (about 1.4 s long, only while the logo is showing). Otherwise it draws once and stops.
     Nothing runs off screen, in a background tab or under reduced motion. */
  var aliveRaf = 0, aliveLast = 0, markAt = 0, markT = 0;
  function markLater() {
    clearTimeout(markT); if (still || !gl3) return;
    markT = setTimeout(function () { if (inView && !d.hidden && plate > .5) { markAt = performance.now(); wake(); } else markLater(); }, 11000 + Math.random() * 6000);
  }
  function alive(now) {
    aliveRaf = 0;
    if (!gl3 || still || !inView || d.hidden) return;
    if (markAt) { lt = (now - markAt) / 1400; if (lt >= 1 || plate < .5) { lt = -1; markAt = 0; markLater(); } }
    if (!markAt && !pOn && pOnS < .01) { if (!raf) gl3.draw(spun(), opts()); return; }   /* settled: one last draw, then stop */
    if (now - aliveLast > 32 && stage.classList.contains('is-gl') && !raf) { aliveLast = now; gl3.draw(spun(), opts()); }
    aliveRaf = requestAnimationFrame(alive);
  }
  function wake() { if (!aliveRaf && !still) aliveRaf = requestAnimationFrame(alive); }
  function show(i) {                                            /* sync the list with the face in front */
    if (i === active) return; active = i;
    descs.forEach(function (p, k) { p.classList.toggle('is-on', k === i + 1); });
    items.forEach(function (li, k) { li.classList.toggle('is-on', k === i); li.firstElementChild.setAttribute('aria-pressed', k === i && mode === 'pinned'); });
  }
  function setMode(m) { mode = m; cube.classList.toggle('is-open', m !== 'rest'); reset.hidden = m !== 'pinned';
    if (gl3) { if (still) plate = m === 'rest' ? 1 : 0; else if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); } }   /* the GL plate is animated here, not by CSS */
    items.forEach(function (li, k) { li.firstElementChild.setAttribute('aria-pressed', k === active && m === 'pinned'); }); }
  function stop() { cancelAnimationFrame(raf); clearTimeout(timer); raf = 0; tween = null; }

  function frame(now) {
    var real = Math.min(400, now - last), dt = Math.min(40, real); last = now; raf = 0;
    var goal = mode === 'rest' ? 1 : 0, moving = gl3 && Math.abs(goal - plate) > .004;
    plate = moving ? plate + (goal - plate) * (1 - Math.exp(-real / 150)) : (gl3 ? goal : plate);
    var intro = introTick(now);
    if (tween) {
      var t = Math.min(1, (now - tween.t0) / tween.ms), e = t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2;   /* ease in and out */
      q = slerp(tween.from, tween.to, e);
      if (t === 1) { var done = tween.done; tween = null; if (done) done(); }
    } else if (mode === 'coast') {
      q = norm(mul(axis(0,1,0, vel[0]*dt), mul(axis(1,0,0, vel[1]*dt), q)));
      var k = Math.exp(-dt / 320); vel[0] *= k; vel[1] *= k; show(nearest());
      if (Math.hypot(vel[0], vel[1]) < .02) { pin(nearest()); if (!hovering) resume(3000); return; }   /* a touch flick has no later 'leave' */
    }
    paint();
    if (tween || mode === 'coast' || moving || intro) raf = requestAnimationFrame(frame);
  }
  function go(to, done) {
    stop();
    if (still) { q = to; paint(); if (done) done(); return; }
    var ang = 2 * Math.acos(Math.min(1, Math.abs(dot(q, to))));
    tween = { from: q, to: to, t0: performance.now(), ms: 520 + 620 * ang / Math.PI, done: done };
    last = tween.t0; raf = requestAnimationFrame(frame);
  }

  /* user actions announce the new description; the automatic cycle stays silent for screen readers */
  var descBox = d.getElementById('cube-descs'), autoTimer = 0, hovering = false, focused = false, inView = true, listPin = false;
  var r0 = stage.getBoundingClientRect(), seen = (Math.min(r0.bottom, innerHeight) - Math.max(r0.top, 0)) / r0.height >= .4, waitView = false;
  function speak(on) { if (descBox) descBox.setAttribute('aria-live', on ? 'polite' : 'off'); }
  function pin(i, fromList) { clearTimeout(autoTimer); listPin = !!fromList; speak(true); setMode('pinned'); show(i); setMode('pinned'); go(TARGET[i]); }
  function rest() { stop(); clearTimeout(autoTimer); listPin = false; setMode('rest'); show(-1); go(TILT); autoLater(3000); }

  /* ---- automatic cycle: 01 -> 06 every 3 s, then back to 01. Paused while the cube is hovered or focused, dragged,
     off screen or in a background tab, and while a service picked from the list is shown; off under reduced motion ---- */
  var fineHover = matchMedia('(hover:hover)').matches;   /* the cube can slide in under a still mouse without an 'enter' event */
  function canAuto() { return !still && introAt && !hovering && !(fineHover && stage.matches(':hover')) && !focused && !down && inView && !d.hidden && !listPin && mode !== 'drag' && mode !== 'coast'; }
  var holdUntil = 5000;                                         /* performance.now() counts from page open: the logo holds until 5 s, whatever resumes the cycle first */
  function autoLater(ms) { clearTimeout(autoTimer); if (!still) autoTimer = setTimeout(autoStep, Math.max(ms, holdUntil - performance.now())); }
  function autoStep() {
    if (performance.now() < holdUntil - 20) { autoLater(0); return; }   /* the hold may have grown since this timer was set */
    if (!canAuto()) return;                                     /* resumed by the event that ends the pause */
    var next = mode === 'rest' ? 0 : (active + 1) % 6;
    speak(false); setMode('tour'); show(next); go(TARGET[next]);
    autoLater(3000);
  }
  function resume(ms) { if (canAuto() && (mode === 'tour' || mode === 'pinned' || mode === 'rest')) { if (mode === 'pinned') setMode('tour'); autoLater(ms); } }

  /* ---- hover pauses on the face in front; leaving resumes ---- */
  stage.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') { hovering = true; clearTimeout(autoTimer); } });
  stage.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') hovering = false; resume(1500); });
  var wrap = stage.parentNode;                                  /* keyboard users pause it by focusing the service buttons */
  wrap.addEventListener('focusin', function () { focused = true; clearTimeout(autoTimer); });
  wrap.addEventListener('focusout', function (e) { if (!wrap.contains(e.relatedTarget)) { focused = false; resume(1500); } });
  if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { inView = es[0].isIntersecting; if (inView) { resume(1500); wake(); } else clearTimeout(autoTimer);
    if (es[0].intersectionRatio >= .4) { seen = true; if (waitView) { waitView = false; startIntro(); } } }, { threshold: [0, .4] }).observe(stage);
  else seen = true;
  d.addEventListener('visibilitychange', function () { if (d.hidden) clearTimeout(autoTimer); else { resume(1500); wake(); } });

  /* ---- drag (mouse and touch) with inertia; a plain click or tap steps to the next face ---- */
  var px = 0, py = 0, pt = 0, moved = 0, down = false;
  stage.addEventListener('pointerdown', function (e) {
    if (e.button) return; down = true; moved = 0; px = e.clientX; py = e.clientY; pt = e.timeStamp; vel = [0, 0];
    try { stage.setPointerCapture(e.pointerId); } catch (x) {}
  });
  stage.addEventListener('pointermove', function (e) {
    if (!down) return;
    var dx = e.clientX - px, dy = e.clientY - py, dt = Math.max(1, e.timeStamp - pt); px = e.clientX; py = e.clientY; pt = e.timeStamp;
    moved += Math.abs(dx) + Math.abs(dy); if (moved < 6) return;
    if (mode !== 'drag') { stop(); clearTimeout(autoTimer); listPin = false; speak(true); setMode('drag'); stage.classList.add('is-drag'); }
    var s = 220 / stage.clientWidth;                             /* degrees per pixel, same feel at every size */
    q = norm(mul(axis(0,1,0, dx*s), mul(axis(1,0,0, -dy*s), q)));
    vel = [vel[0]*.6 + dx*s/dt*.4, vel[1]*.6 - dy*s/dt*.4]; show(nearest()); paint();
  });
  function up() {
    if (!down) return; down = false; stage.classList.remove('is-drag');
    if (mode === 'drag') {
      var sp = Math.hypot(vel[0], vel[1]); if (sp > .6) { vel[0] *= .6 / sp; vel[1] *= .6 / sp; }   /* cap the spin */
      if (still || sp < .02) pin(nearest()); else { mode = 'coast'; last = performance.now(); raf = requestAnimationFrame(frame); }
    } else if (moved < 6) pin(mode === 'tour' ? active : (active + 1) % 6);
  }
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (t) { stage.addEventListener(t, up); });

  /* ---- the list is the accessible control: real buttons, keyboard included ---- */
  items.forEach(function (li, i) { li.firstElementChild.addEventListener('click', function () { pin(i, true); }); });
  reset.addEventListener('click', rest);
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && mode === 'pinned') rest(); });

  paint();
  /* right after the first paint: WebGL (or the CSS cube without it) and the intro start together */
  requestAnimationFrame(function () { setTimeout(function () { startGL(); startIntro(); }, 0); });
  autoLater(0);

  /* ---- docked navigation cube (wide screens, after the hero): it turns a quarter at a time to the section being read,
     a click on a face goes there, and a concept face opens into its demo (the image grows to the full window first) ---- */
  var nq = d.getElementById('navcube');
  if (nq && 'IntersectionObserver' in window) {
    var nc = nq.firstElementChild, nf = [].slice.call(nc.children), PATH = [4, 0, 1, 5, 3, 2], nk = 0, nQ = TARGET[PATH[0]], nFrom, nTo, nT0 = 0, nRaf = 0;
    var NMAP = { studio: 0, services: 0, 'work-olivane': 1, 'work-arclines': 2, 'work-enuma': 2, process: 3, pricing: 4, about: 5, faq: 5, contact: 5 };
    var nPaint = function (r) {
      nc.style.setProperty('--m', css(r));
      nf.forEach(function (f) { var n = rot(r, NORMAL[+f.getAttribute('data-f')]); f.style.setProperty('--lit', Math.max(0, n[0]*LIGHT[0] + n[1]*LIGHT[1] + n[2]*LIGHT[2]).toFixed(3)); });
    };
    var nTick = function (now) {
      var t = Math.min(1, (now - nT0) / 700), e = t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2;
      nQ = slerp(nFrom, nTo, e); nPaint(nQ); nRaf = t < 1 ? requestAnimationFrame(nTick) : 0;
    };
    var nGo = function (k) {
      if (k === nk || k == null) return; nk = k; nTo = TARGET[PATH[k]];
      if (still || !nq.classList.contains('is-on')) { cancelAnimationFrame(nRaf); nRaf = 0; nQ = nTo; nPaint(nQ); return; }
      nFrom = nQ; nT0 = performance.now(); if (!nRaf) nRaf = requestAnimationFrame(nTick);
    };
    nPaint(nQ);
    var nio = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) nGo(NMAP[e.target.id]); }); }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(NMAP).forEach(function (id) { var el = d.getElementById(id); if (el) nio.observe(el); });
    var hero = d.querySelector('.hero');
    if (hero) new IntersectionObserver(function (es) { nq.classList.toggle('is-on', !es[0].isIntersecting && es[0].boundingClientRect.top < 0); }).observe(hero);
    nf.forEach(function (a) {
      if (!a.classList.contains('nq-p')) return;
      a.addEventListener('click', function (e) {
        if (e.button || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || still) return;
        e.preventDefault();
        var r = a.getBoundingClientRect(), x = d.createElement('div');
        x.className = 'nq-x'; x.style.backgroundImage = 'url(' + a.querySelector('img').currentSrc + ')';
        x.style.clipPath = 'inset(' + [r.top, innerWidth - r.right, innerHeight - r.bottom, r.left].map(function (v) { return Math.max(0, v).toFixed(0) + 'px'; }).join(' ') + ')';
        d.body.appendChild(x); x.getBoundingClientRect(); x.classList.add('go');
        setTimeout(function () { location.href = a.href; }, 650);
      });
    });
    addEventListener('pageshow', function () { [].forEach.call(d.querySelectorAll('.nq-x'), function (x) { x.remove(); }); });   /* back from the demo */
  }

  /* ---- self-check: open with ?selftest. Every target must bring its own face to the front, upright. ---- */
  if (/selftest/.test(location.search)) {
    var inv = [-TILT[0], -TILT[1], -TILT[2], TILT[3]], bad = [];
    TARGET.forEach(function (t, i) { var r = mul(inv, t), n = rot(r, NORMAL[i]), u = rot(mul(r, FACE[i]), [0, 1, 0]);
      if (Math.abs(n[2] - 1) > 1e-6 || Math.abs(u[1] - 1) > 1e-6) bad.push(i); });
    q = TARGET[3]; if (nearest() !== 3) bad.push('nearest'); q = TILT;
    d.title = bad.length ? 'SELFTEST FAIL ' + bad : 'SELFTEST OK'; console.log(d.title);
  }
})();
