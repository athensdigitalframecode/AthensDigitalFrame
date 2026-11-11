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
  var TOUR = [0, 1, 4, 2, 5, 3];                               /* Y turn, then X/Z, so the route is never one axis */

  var q = TILT, mode = 'rest', active = -1, raf = 0, timer = 0, tween = null, vel = [0, 0], last = 0;

  function nearest() { var best = 0, bz = -2; NORMAL.forEach(function (n, i) { var z = rot(q, n)[2]; if (z > bz) { bz = z; best = i; } }); return best; }
  /* WebGL when available (cube-gl.js, ?nogl turns it off); otherwise the CSS cube below is the renderer */
  /* started when the browser is idle, so the first screen is not blocked; cube-gl.js adds .is-gl once its faces are painted */
  var plate = 1, gl3 = null;
  function startGL() {
    if (!window.ADFCubeGL || /nogl/.test(location.search)) return;
    gl3 = window.ADFCubeGL(stage, cube, faces, FACE, rot, function () { gl3 = null; stage.classList.remove('is-gl'); paint(); });
    if (gl3) paint();
  }
  (window.requestIdleCallback || function (f) { setTimeout(f, 300); })(startGL, { timeout: 2000 });
  function paint() {
    /* shadow width = the cube's on-screen width: |x| extent of the rotated unit axes (1 face-on, ~1.41 on an edge) */
    var x = q[0], y = q[1], z = q[2], w = q[3];
    stage.style.setProperty('--shw', (Math.abs(1-2*(y*y+z*z)) + Math.abs(2*(x*y-z*w)) + Math.abs(2*(x*z+y*w))).toFixed(3));
    if (gl3) { gl3.draw(q, plate); if (stage.classList.contains('is-gl')) return; }   /* keep the CSS cube moving until WebGL is ready */
    cube.style.setProperty('--m', css(q));
    faces.forEach(function (f, i) { var n = rot(q, NORMAL[i]); f.style.setProperty('--lit', Math.max(0, n[0]*LIGHT[0] + n[1]*LIGHT[1] + n[2]*LIGHT[2]).toFixed(3)); });
  }
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
    if (tween) {
      var t = Math.min(1, (now - tween.t0) / tween.ms), e = t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2;   /* ease in and out */
      q = slerp(tween.from, tween.to, e);
      if (t === 1) { var done = tween.done; tween = null; if (done) done(); }
    } else if (mode === 'coast') {
      q = norm(mul(axis(0,1,0, vel[0]*dt), mul(axis(1,0,0, vel[1]*dt), q)));
      var k = Math.exp(-dt / 320); vel[0] *= k; vel[1] *= k; show(nearest());
      if (Math.hypot(vel[0], vel[1]) < .02) { pin(nearest()); return; }
    }
    paint();
    if (tween || mode === 'coast' || moving) raf = requestAnimationFrame(frame);
  }
  function go(to, done) {
    stop();
    if (still) { q = to; paint(); if (done) done(); return; }
    var ang = 2 * Math.acos(Math.min(1, Math.abs(dot(q, to))));
    tween = { from: q, to: to, t0: performance.now(), ms: 520 + 620 * ang / Math.PI, done: done };
    last = tween.t0; raf = requestAnimationFrame(frame);
  }

  function pin(i) { setMode('pinned'); show(i); setMode('pinned'); go(TARGET[i]); }
  function rest() { stop(); setMode('rest'); show(-1); go(TILT); }
  function tour(step) {
    if (mode !== 'tour') return;
    var i = TOUR[step % TOUR.length]; show(i);
    go(TARGET[i], function () { timer = setTimeout(function () { tour(step + 1); }, 1500); });   /* pause on each face */
  }

  /* ---- hover: come alive, then return to the logo unless something is pinned ---- */
  stage.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse' && mode === 'rest' && !still) { stop(); setMode('tour'); tour(0); } });
  stage.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse' && mode === 'tour') rest(); });

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
    if (mode !== 'drag') { stop(); setMode('drag'); stage.classList.add('is-drag'); }
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
  items.forEach(function (li, i) { li.firstElementChild.addEventListener('click', function () { pin(i); }); });
  reset.addEventListener('click', rest);
  /* Capabilities section: pin the face, then bring the cube into view */
  [].forEach.call(d.querySelectorAll('[data-face]'), function (b) { b.addEventListener('click', function () {
    pin(+b.getAttribute('data-face')); stage.scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'center' }); }); });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && mode === 'pinned') rest(); });

  paint();

  /* ---- self-check: open with ?selftest. Every target must bring its own face to the front, upright. ---- */
  if (/selftest/.test(location.search)) {
    var inv = [-TILT[0], -TILT[1], -TILT[2], TILT[3]], bad = [];
    TARGET.forEach(function (t, i) { var r = mul(inv, t), n = rot(r, NORMAL[i]), u = rot(mul(r, FACE[i]), [0, 1, 0]);
      if (Math.abs(n[2] - 1) > 1e-6 || Math.abs(u[1] - 1) > 1e-6) bad.push(i); });
    q = TARGET[3]; if (nearest() !== 3) bad.push('nearest'); q = TILT;
    d.title = bad.length ? 'SELFTEST FAIL ' + bad : 'SELFTEST OK'; console.log(d.title);
  }
})();
