/* Enuma Elish — Last Train. Storefront behaviour (vanilla JS, no deps). */
(function () {
  'use strict';
  var EE = window.EE || {};
  var TX = EE.t || {};
  function t(k, fb) { return TX[k] || fb; }
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function ease(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function lr(a, b, t) { return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), w: lerp(a.w, b.w, t), h: lerp(a.h, b.h, t) }; }
  function cover(iw, ih, R, ay) { var s = Math.max(R.w / iw, R.h / ih); var w = iw * s, h = ih * s; return { x: R.x + (R.w - w) / 2, y: R.y + (R.h - h) * ay, w: w, h: h }; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  /* ---------- money ---------- */
  function money(cents) {
    var fmt = EE.moneyFormat || '€{{amount}}';
    var n = (cents || 0) / 100;
    function d(num, places, th, dec) { var p = num.toFixed(places).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, th); return p.join(dec); }
    return fmt.replace(/\{\{\s*(\w+)\s*\}\}/, function (_, k) {
      switch (k) {
        case 'amount_no_decimals': return d(n, 0, ',', '.');
        case 'amount_with_comma_separator': return d(n, 2, '.', ',');
        case 'amount_no_decimals_with_comma_separator': return d(n, 0, '.', ',');
        case 'amount_with_apostrophe_separator': return d(n, 2, "'", '.');
        default: return n % 1 === 0 ? d(n, 0, ',', '.') : d(n, 2, ',', '.');
      }
    });
  }

  var root = $('#ee-root');
  if (root) root.setAttribute('data-js', '1');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* ---------- product data (emitted per section, fetched on demand otherwise) ---------- */
  var products = {};
  function collect(rootEl) {
    $$('script[data-ee-product]', rootEl).forEach(function (el) {
      try { var p = JSON.parse(el.textContent); if (!products[p.id]) products[p.id] = p; } catch (e) { /* malformed block: skip */ }
    });
  }
  collect(document);
  var dataBox = $('#ee-data'), pending = {};
  function ensureProduct(id, handle) {
    if (products[id] || !handle || !dataBox) return Promise.resolve(products[id]);
    if (pending[handle]) return pending[handle];
    return Promise.resolve(products[id] || null);   /* static demo: every product is already on the page */
    var url = '';
    pending[handle] = fetch(url, { headers: { Accept: 'text/html' } })
      .then(function (r) { return r.ok ? r.text() : ''; })
      .then(function (html) {
        if (!html) return null;
        var box = document.createElement('div'); box.innerHTML = html; // same-origin Shopify section markup
        dataBox.appendChild(box); collect(box); return products[id];
      })
      .catch(function () { return null; });
    return pending[handle];
  }
  function garment(id) { var t = document.querySelector('template[data-g="' + id + '"]'); return t ? t.innerHTML : ''; }
  function photo(id) { var t = document.querySelector('template[data-gf="' + id + '"]'); return t ? t.innerHTML : ''; }

  /* ---------- dialogs: focus trap + restore ---------- */
  var FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])';
  var trapStack = [];
  function trapOpen(el) {
    trapStack.push({ el: el, back: document.activeElement });
    var first = $$(FOCUSABLE, el).filter(function (n) { return n.offsetParent !== null; })[0];
    (el.querySelector('.close') || first || el).focus({ preventScroll: true });
  }
  function trapClose(el) {
    for (var i = trapStack.length - 1; i >= 0; i--) {
      if (trapStack[i].el === el) {
        var back = trapStack[i].back; trapStack.splice(i, 1);
        if (back && back.focus && document.contains(back)) back.focus({ preventScroll: true });
        return;
      }
    }
  }
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab' || !trapStack.length) return;
    var el = trapStack[trapStack.length - 1].el;
    var list = $$(FOCUSABLE, el).filter(function (n) { return n.offsetParent !== null; });
    if (!list.length) { e.preventDefault(); return; }
    var first = list[0], last = list[list.length - 1];
    if (e.shiftKey && (document.activeElement === first || !el.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && (document.activeElement === last || !el.contains(document.activeElement))) { e.preventDefault(); first.focus(); }
  });

  /* ---------- scroll lock ---------- */
  var locks = 0;
  function lock(on) { locks = Math.max(0, locks + (on ? 1 : -1)); document.documentElement.style.overflow = locks ? 'hidden' : ''; }

  /* ---------- reveal ---------- */
  // Clip-path reveals (.rvx) are fully clipped before they reveal, and Chrome counts a target's own
  // clip-path as invisible, so those are watched through their parent and the flag set on the child.
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { (e.target.__rv || e.target).setAttribute('data-in', '1'); io.unobserve(e.target); } });
  }, { threshold: 0.08 }) : null;
  $$('[data-rv]').forEach(function (el) {
    if (!io) { el.setAttribute('data-in', '1'); return; }
    if (el.classList.contains('rvx') && el.parentElement) { el.parentElement.__rv = el; io.observe(el.parentElement); }
    else io.observe(el);
  });
  var pars = $$('[data-par]');
  var sts = $$('[data-st]');
  var stEl = $('#ee-st');
  var nav = $('#ee-nav');

  /* ---------- hero (scroll-scrubbed train) ---------- */
  var hero = $('[data-hero]');
  var H = hero && {
    el: hero, stage: $('[data-stage]', hero), cv: $('[data-cv]', hero), int: $('[data-int]', hero),
    wl: $('[data-wl]', hero), wr: $('[data-wr]', hero), board: $('[data-board]', hero),
    cd: $('[data-cd]', hero), cdl: $('[data-cdl]', hero), prog: $('[data-prog]', hero), tag: $('[data-tag]', hero)
  };
  // Phones / data-saver: every second frame (12 fps of footage) — still dense enough to scrub smoothly.
  var conn = navigator.connection || {};
  var STEP = (window.innerWidth < 700 || conn.saveData) ? 2 : 1;
  var framesEl = $('script[data-ee-frames]');
  var FR = [];
  try { FR = JSON.parse(framesEl ? framesEl.textContent : '[]'); } catch (e) { FR = []; }
  FR = FR.filter(function (_, i) { return i % STEP === 0; });
  var img = [], sp = 0, lastDraw = '', dirty = true;
  if (H && FR.length) {
    var N = FR.length, order = [], seen = {};
    var push = function (i) { if (i >= 0 && i < N && !seen[i]) { seen[i] = 1; order.push(i); } };
    // coarse-to-fine: a usable sequence arrives first, gaps fill in after
    push(0); push(N - 1);
    for (var s = 32; s >= 1; s = Math.floor(s / 2)) { for (var i = 0; i < N; i += s) push(i); if (s === 1) break; }
    var k = 0;
    var ready = function (idx, im) { img[idx] = im; dirty = true; next(); };
    var next = function () {
      if (k >= order.length) return;
      var idx = order[k++]; var im = new Image(); im.decoding = 'async';
      im.onload = function () {
        // decode off the main thread before first paint so drawing never stalls on decode
        if (im.decode) im.decode().then(function () { ready(idx, im); }, function () { ready(idx, im); });
        else ready(idx, im);
      };
      im.onerror = next; im.src = FR[idx];
    };
    next(); // first frame right away
    var startRest = function () { for (var c = 0; c < 5; c++) next(); };
    if (document.readyState === 'complete') startRest(); else window.addEventListener('load', startRest, { once: true });
  }
  function near(i) { for (var d = 0; d < FR.length; d++) { if (img[i - d]) return img[i - d]; if (img[i + d]) return img[i + d]; } return null; }

  var cvW = 0, cvH = 0;
  function sizeCanvas() {
    if (!H || !H.cv) return;
    cvW = H.cv.clientWidth; cvH = H.cv.clientHeight;
    var dpr = Math.min(window.devicePixelRatio || 1, 1.25); // source frames are 540–720px wide; more pixels only cost fill-rate
    var bw = Math.round(cvW * dpr), bh = Math.round(cvH * dpr);
    if (H.cv.width !== bw || H.cv.height !== bh) { H.cv.width = bw; H.cv.height = bh; }
    H.dpr = dpr; dirty = true;
  }

  function drawHero() {
    var cv = H.cv; if (!cv || !cvW || !cvH) return;
    var W = cvW, Hh = cvH;
    var s = sp, N = FR.length;
    var fq = clamp(s / 0.8, 0, 1);
    var i = Math.round(fq * (N - 1));
    var e = ease(clamp((s - 0.04) / 0.52, 0, 1));
    var d = ease(clamp((s - 0.83) / 0.15, 0, 1));
    var a = near(i);
    var key = (a ? a.src : '') + '|' + e.toFixed(4) + '|' + d.toFixed(4);
    if (key !== lastDraw || dirty) {
      lastDraw = key;
      var ctx = cv.getContext('2d');
      ctx.setTransform(H.dpr, 0, 0, H.dpr, 0, 0);
      ctx.clearRect(0, 0, W, Hh); // transparent: the "doors open" interior sits underneath
      ctx.imageSmoothingQuality = 'high';
      var mob = W < 700;
      var ph = Hh * (mob ? 0.56 : 0.7); var pw = mob ? Math.min(W * 0.7, ph * 0.6) : Math.min(W * 0.3, ph * 0.64);
      var P = { x: (W - pw) / 2, y: Hh * (mob ? 0.5 : 0.53) - ph / 2, w: pw, h: ph };
      var F = { x: 0, y: 0, w: W, h: Hh };
      var R = lr(P, F, e);
      if (a) {
        var iw = a.naturalWidth, ihh = a.naturalHeight;
        var I = lr(cover(iw, ihh, P, 0.5), cover(iw, ihh, F, 0.6), e);
        var paint = function () {
          ctx.drawImage(a, I.x, I.y, I.w, I.h);
          if (e > 0) { ctx.fillStyle = 'rgba(13,14,12,' + (0.22 * e).toFixed(3) + ')'; ctx.fillRect(0, 0, W, Hh); }
        };
        if (d <= 0.0005) {
          ctx.save(); ctx.beginPath(); ctx.rect(R.x, R.y, R.w, R.h); ctx.clip(); paint(); ctx.restore();
        } else {
          // doors part: the frame splits down the middle and slides away
          var off = d * W * 0.52;
          ctx.save(); ctx.beginPath(); ctx.rect(-off, 0, W / 2, Hh); ctx.clip(); ctx.translate(-off, 0); paint(); ctx.fillStyle = '#060706'; ctx.fillRect(W / 2 - 7, 0, 7, Hh); ctx.restore();
          ctx.save(); ctx.beginPath(); ctx.rect(W / 2 + off, 0, W / 2, Hh); ctx.clip(); ctx.translate(off, 0); paint(); ctx.fillStyle = '#060706'; ctx.fillRect(W / 2, 0, 7, Hh); ctx.restore();
        }
      }
      if (e < 0.999) {
        var al = (1 - e).toFixed(3), g = 10;
        ctx.strokeStyle = 'rgba(242,183,5,' + al + ')'; ctx.lineWidth = 2;
        var x0 = R.x - g, y0 = R.y - g, x1 = R.x + R.w + g, y1 = R.y + R.h + g, L = 22;
        ctx.beginPath(); ctx.moveTo(x0, y0 + L); ctx.lineTo(x0, y0); ctx.lineTo(x0 + L, y0); ctx.moveTo(x1 - L, y0); ctx.lineTo(x1, y0); ctx.lineTo(x1, y0 + L); ctx.moveTo(x1, y1 - L); ctx.lineTo(x1, y1); ctx.lineTo(x1 - L, y1); ctx.moveTo(x0 + L, y1); ctx.lineTo(x0, y1); ctx.lineTo(x0, y1 - L); ctx.stroke();
      }
      dirty = false;
    }
    // DOM overlays (compositor-only properties)
    var wo = Math.max(0, 1 - e * 1.7);
    if (H.wl) { H.wl.style.transform = 'translate3d(' + (-e * 34).toFixed(2) + 'vw,0,0)'; H.wl.style.opacity = wo; }
    if (H.wr) { H.wr.style.transform = 'translate3d(' + (e * 34).toFixed(2) + 'vw,0,0)'; H.wr.style.opacity = wo; }
    if (H.int) { H.int.style.opacity = d.toFixed(3); H.int.style.transform = 'scale(' + (0.94 + 0.06 * d).toFixed(4) + ')'; }
    if (H.board) H.board.style.opacity = (1 - d).toFixed(3);
    if (H.tag) H.tag.style.opacity = Math.max(0, 1 - s * 7).toFixed(3);
    if (H.prog) H.prog.style.transform = 'scaleY(' + s.toFixed(4) + ')';
    if (H.cd && H.cdl) {
      var sec = Math.round((1 - fq) * 120);
      var txt = '0' + Math.floor(sec / 60) + ':' + ('0' + (sec % 60)).slice(-2);
      if (H.cd.textContent !== txt) H.cd.textContent = txt;
      var lb = fq >= 0.999 ? t('arrived', 'ARRIVED') : t('arriving', 'ARRIVING');
      if (H.cdl.textContent !== lb) H.cdl.textContent = lb;
    }
  }

  /* ---------- rail ---------- */
  var RS = $('[data-rail]'), RST = $('[data-rail-stage]'), TR = $('[data-track]'), RB = $('[data-rbar]');
  var rp = 0, railH = -1, railOver = 0, railSh = 0;
  function measureRail() {
    if (!RS || !RST || !TR) return;
    if (window.innerWidth >= 900) {
      railSh = RST.clientHeight; railOver = Math.max(0, TR.scrollWidth - RST.clientWidth);
      var want = Math.round(railSh + railOver * 1.1);
      if (railH !== want) { RS.style.height = want + 'px'; railH = want; }
    } else if (railH !== 0) { RS.style.height = ''; TR.style.transform = ''; railH = 0; }
  }

  /* ---------- layout cache (re-measured on resize / load, not every frame) ---------- */
  var docTop = function (el) { var r = el.getBoundingClientRect(); return r.top + window.pageYOffset; };
  var L = { heroTop: 0, heroH: 0, stageH: 0, railTop: 0, pars: [], sts: [] };
  function measure() {
    sizeCanvas(); measureRail();
    if (H) { L.heroTop = docTop(H.el); L.heroH = H.el.offsetHeight; L.stageH = H.stage.clientHeight; }
    if (RS) L.railTop = docTop(RS);
    L.pars = pars.map(function (el) { var p = el.parentElement; return { el: el, top: docTop(p), h: p.offsetHeight, f: parseFloat(el.getAttribute('data-par')) || 0 }; });
    L.sts = sts.map(function (el) { return { el: el, top: docTop(el) }; });
  }
  var mT = 0; function remeasure() { clearTimeout(mT); mT = setTimeout(measure, 120); }
  window.addEventListener('resize', remeasure);
  window.addEventListener('load', measure);
  if ('ResizeObserver' in window) new ResizeObserver(remeasure).observe(document.body);
  measure();

  /* ---------- main loop ---------- */
  var stName = '', lastT = performance.now();
  function tick(now) {
    requestAnimationFrame(tick);
    var dt = Math.min(64, now - lastT); lastT = now;
    // time-based ease: ~95% caught up in ~0.25s regardless of refresh rate
    var kk = reduce ? 1 : 1 - Math.exp(-dt / 85);
    var y = window.pageYOffset, ih = window.innerHeight, vw = window.innerWidth;
    // READ phase is just pageYOffset — everything else comes from the cache
    if (H && H.stage) {
      var top = L.heroTop - y;
      var p = clamp(-top / Math.max(1, L.heroH - L.stageH), 0, 1);
      sp += (p - sp) * kk; if (Math.abs(p - sp) < 0.0002) sp = p;
      if (top + L.heroH > 0 && top < ih) drawHero();
      if (nav) { var solid = top + L.heroH < 90 ? '1' : '0'; if (nav.getAttribute('data-solid') !== solid) nav.setAttribute('data-solid', solid); }
    }
    if (RS && TR && vw >= 900 && railH > 0) {
      var rpp = clamp(-(L.railTop - y) / Math.max(1, railH - railSh), 0, 1);
      rp += (rpp - rp) * kk; if (Math.abs(rpp - rp) < 0.0002) rp = rpp;
      TR.style.transform = 'translate3d(' + (-rp * railOver).toFixed(1) + 'px,0,0)';
      if (RB) RB.style.transform = 'scaleX(' + rp.toFixed(4) + ')';
    }
    if (!reduce) {
      for (var i = 0; i < L.pars.length; i++) {
        var o = L.pars[i]; var bt = o.top - y;
        if (bt + o.h < -300 || bt > ih + 300) continue;
        o.el.style.transform = 'translate3d(0,' + ((bt + o.h / 2 - ih / 2) * o.f).toFixed(1) + 'px,0)';
      }
    }
    if (L.sts.length && stEl) {
      var cur = L.sts[0];
      for (var j = 0; j < L.sts.length; j++) { if (L.sts[j].top - y < ih * 0.45) cur = L.sts[j]; }
      var v = cur ? cur.el.getAttribute('data-st') : '';
      if (v !== stName) { stName = v; stEl.textContent = v.split('|').join(' · '); }
    }
  }
  requestAnimationFrame(tick);

  /* ---------- rail: turn the garment nearest the centre on touch screens ---------- */
  var slotsEl = $('.slots');
  if (slotsEl && 'IntersectionObserver' in window && window.matchMedia('(hover: none)').matches) {
    var tio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { e.target.classList.toggle('turn', e.intersectionRatio > 0.6); });
    }, { root: window.innerWidth < 900 ? slotsEl : null, threshold: [0, 0.6, 1] });
    $$('.slot', slotsEl).forEach(function (s) { tio.observe(s); });
  }

  /* ---------- cart (Shopify AJAX API) ---------- */
  var drawer = $('#ee-drawer'), scrim = $('#ee-scrim'), linesEl = $('#ee-lines'), dfoot = $('#ee-dfoot'), toastEl = $('#ee-toast');
  var cartState = null, toastT = 0;
  function setCount(n) {
    $$('[data-cart-count]').forEach(function (el) {
      el.textContent = n;
      if (el.classList.contains('cnt')) { el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop'); }
    });
  }
  function renderCart(c) {
    var missing = c.items.filter(function (l) { return !products[l.product_id] && l.handle; });
    if (missing.length) Promise.all(missing.map(function (l) { return ensureProduct(l.product_id, l.handle); }))
      .then(function () { if (cartState === c) drawCart(c); });
    drawCart(c);
  }
  function drawCart(c) {
    cartState = c; setCount(c.item_count);
    $$('[data-cart-total]').forEach(function (el) { el.textContent = money(c.total_price); });
    if (!linesEl) return;
    if (!c.items.length) {
      linesEl.innerHTML = '<div style="padding:56px 0;display:flex;flex-direction:column;gap:16px"><span style="font-size:28px;font-weight:900;letter-spacing:-.03em">' + esc(t('emptyTitle', 'The platform is empty.')) + '</span><span class="muted" style="font-size:15px">' + esc(t('emptyText', '')) + '</span><a class="btn btn-y" href="' + esc((EE.routes.root || '/').replace(/\/?$/, '/')) + '#shop" data-cart-close style="align-self:flex-start">' + esc(t('backToRail', 'BACK TO THE RAIL')) + '</a></div>';
      dfoot.hidden = true; return;
    }
    dfoot.hidden = false;
    linesEl.innerHTML = c.items.map(function (l) {
      var g = photo(l.product_id) || garment(l.product_id) || (l.image ? '<img class="g-img" src="' + esc(l.image) + '" alt="">' : '');
      var size = l.variant_title ? esc(t('size', 'SIZE')) + ' ' + esc(l.variant_title) + ' · ' : '';
      var code = products[l.product_id] && products[l.product_id].code ? esc(products[l.product_id].code) + ' · ' : '';
      return '<div class="line"><div class="th">' + g + '</div><div style="display:flex;flex-direction:column;gap:8px">' +
        '<div style="display:flex;justify-content:space-between;gap:12px"><b style="font-size:15px">' + esc(l.product_title) + '</b><span class="price">' + money(l.final_line_price) + '</span></div>' +
        '<span class="mono muted" style="font-size:10.5px">' + code + size + money(l.final_price) + '</span>' +
        '<div style="display:flex;align-items:center;justify-content:space-between"><div class="qty">' +
        '<button data-q="' + esc(l.key) + '" data-d="-1" aria-label="' + esc(t('dec', 'Decrease quantity')) + '"><svg width="12" height="2" viewBox="0 0 12 2" aria-hidden="true"><path d="M0 1h12" stroke="currentColor" stroke-width="2"/></svg></button>' +
        '<span>' + l.quantity + '</span>' +
        '<button data-q="' + esc(l.key) + '" data-d="1" aria-label="' + esc(t('inc', 'Increase quantity')) + '"><svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M0 6h12M6 0v12" stroke="currentColor" stroke-width="2"/></svg></button></div>' +
        '<button class="rm" data-q="' + esc(l.key) + '" data-rm="1">' + esc(t('remove', 'REMOVE')) + '</button></div></div></div>';
    }).join('');
  }
  /* static demo: no store behind this page, so the bag lives in this browser only (localStorage) */
  var BAG = 'ee-lt-bag';
  function bagRead() { try { return JSON.parse(localStorage.getItem(BAG)) || []; } catch (e) { return []; } }
  function bagWrite(b) { try { localStorage.setItem(BAG, JSON.stringify(b)); } catch (e) {} }
  function bagCart() {
    var items = bagRead().map(function (l) {
      var p = products[l.pid] || {}, v = (p.variants || []).filter(function (x) { return x.id === l.vid; })[0] || {};
      return { key: String(l.vid), product_id: l.pid, variant_id: l.vid, product_title: p.name || '', variant_title: v.size || '', quantity: l.q,
        final_price: v.price || 0, final_line_price: (v.price || 0) * l.q, handle: p.handle, image: null };
    }).filter(function (l) { return l.product_title; });
    return { items: items, item_count: items.reduce(function (s, l) { return s + l.quantity; }, 0), total_price: items.reduce(function (s, l) { return s + l.final_line_price; }, 0) };
  }
  function pidOf(vid) { return Math.floor(Number(vid) / 100); }
  function fetchCart() { return Promise.resolve(bagCart()).then(renderCart); }
  function addToCart(id, qty, label) {
    var b = bagRead(), vid = Number(id), l = b.filter(function (x) { return x.vid === vid; })[0];
    if (l) l.q += qty || 1; else b.push({ vid: vid, pid: pidOf(vid), q: qty || 1 });
    bagWrite(b);
    return fetchCart().then(function () { if (label) toast(t('cartAdded', 'ADDED') + ' · ' + label); });
  }
  function changeLine(key, qty) {
    var b = bagRead().map(function (l) { if (String(l.vid) === String(key)) l.q = qty; return l; }).filter(function (l) { return l.q > 0; });
    bagWrite(b); return fetchCart();
  }
  function openCart() {
    if (!drawer) return false;
    closeOverlay(true); hideToast(); closeMenu();
    if (drawer.hidden) { drawer.hidden = false; scrim.hidden = false; lock(true); trapOpen(drawer); }
    if (!cartState) fetchCart();
    return true;
  }
  function closeCart() { if (drawer && !drawer.hidden) { drawer.hidden = true; scrim.hidden = true; lock(false); trapClose(drawer); } }
  function toast(msg) {
    if (!toastEl) return;
    $('[data-toast]', toastEl).textContent = msg; toastEl.hidden = false;
    toastEl.style.animation = 'none'; void toastEl.offsetWidth; toastEl.style.animation = '';
    clearTimeout(toastT); toastT = setTimeout(hideToast, 2600);
  }
  function hideToast() { if (toastEl) toastEl.hidden = true; }
  if (linesEl) linesEl.addEventListener('click', function (e) {
    var b = e.target.closest('[data-q]'); if (!b) return;
    var key = b.getAttribute('data-q'); var line = cartState && cartState.items.filter(function (l) { return l.key === key; })[0]; if (!line) return;
    var q = b.hasAttribute('data-rm') ? 0 : line.quantity + Number(b.getAttribute('data-d'));
    changeLine(key, Math.max(0, q));
  });

  /* ---------- product overlay ---------- */
  var ov = $('#ee-ov'), cur = null, sel = null, addedT = 0;
  function f(name) { return $('[data-f="' + name + '"]', ov); }
  function setAddLabel(txt) { f('add').textContent = txt; }
  function openOverlay(id) {
    var p = products[id]; if (!p || !ov) return false;
    cur = p; sel = null;
    var avail = p.variants.filter(function (v) { return v.available; });
    if (p.variants.length === 1) sel = p.variants[0].id;
    f('jp').textContent = p.jp || '';
    f('g').innerHTML = photo(p.id) || garment(p.id) || (p.image ? '<img class="g-img" src="' + esc(p.image) + '" alt="">' : '');
    f('codeline').textContent = [p.code, p.cat, 'ΑΠΟΒΑΘΡΑ 1'].filter(Boolean).join(' · ');
    f('kicker').textContent = [p.code, 'DROP 01', '終電'].filter(Boolean).join(' · ');
    f('name').textContent = p.name;
    f('sub').innerHTML = [esc(p.gr), p.jp ? '<span class="jp">' + esc(p.jp) + '</span>' : ''].filter(Boolean).join(' · ');
    f('price').textContent = money(p.price);
    f('desc').textContent = p.desc || '';
    f('link').setAttribute('href', p.url);
    var sz = f('sizes');
    sz.parentNode.style.display = p.variants.length > 1 ? '' : 'none';
    sz.style.gridTemplateColumns = 'repeat(' + Math.min(6, p.variants.length) + ',minmax(0,1fr))';
    sz.innerHTML = p.variants.map(function (v) { return '<button class="osz" data-v="' + v.id + '" aria-pressed="false"' + (v.available ? '' : ' disabled style="opacity:.35"') + '>' + esc(v.size) + '</button>'; }).join('');
    f('err').hidden = true;
    var sp = [[t('fabric', 'FABRIC'), p.fabric], [t('fit', 'FIT'), p.fit], [t('colour', 'COLOUR'), p.colour], [t('ships', 'SHIPS'), t('shipsValue', '')]].filter(function (x) { return x[1]; });
    f('specs').innerHTML = sp.map(function (x) { return '<dt>' + esc(x[0]) + '</dt><dd>' + esc(x[1]) + '</dd>'; }).join('');
    setAddLabel(avail.length ? t('addToCart', 'ADD TO CART') + ' — ' + money(p.price) : t('soldOut', 'SOLD OUT'));
    f('add').disabled = !avail.length;
    ov.setAttribute('aria-label', p.name);
    ov.hidden = false; lock(true); closeMenu();
    // restart entrance animations
    $$('.ov-g, .ov-jp, .ov-panel, .ov-bg img', ov).concat([ov]).forEach(function (el) { el.style.animation = 'none'; void el.offsetWidth; el.style.animation = ''; });
    trapOpen(ov);
    return true;
  }
  function closeOverlay() { if (ov && !ov.hidden) { ov.hidden = true; lock(false); trapClose(ov); } }
  if (ov) {
    f('sizes').addEventListener('click', function (e) {
      var b = e.target.closest('[data-v]'); if (!b || b.disabled) return;
      sel = b.getAttribute('data-v');
      $$('[data-v]', f('sizes')).forEach(function (x) { var on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-pressed', on); });
      f('err').hidden = true;
    });
    f('add').addEventListener('click', function () {
      if (!cur) return;
      if (!sel) { f('err').hidden = false; return; }
      var btn = f('add'); btn.setAttribute('aria-busy', 'true');
      addToCart(sel, 1).then(function () {
        btn.removeAttribute('aria-busy');
        setAddLabel(t('added', 'ADDED'));
        clearTimeout(addedT); addedT = setTimeout(function () { if (cur) setAddLabel(t('addToCart', 'ADD TO CART') + ' — ' + money(cur.price)); }, 1800);
      });
    });
  }

  /* ---------- grid filters ---------- */
  var grid = $('[data-grid]');
  $$('[data-filter]').forEach(function (chip) {
    chip.addEventListener('click', function () {
      var cat = chip.getAttribute('data-filter'); var n = 0;
      $$('[data-filter]').forEach(function (c) { var on = c === chip; c.classList.toggle('on', on); c.setAttribute('aria-pressed', on); });
      $$('.card', grid).forEach(function (card, i) {
        var show = cat === 'ALL' || card.getAttribute('data-cat') === cat;
        card.hidden = !show; if (show) n++;
        card.classList.toggle('feat', cat === 'ALL' && i === 0);
        if (show) { card.style.animation = 'none'; void card.offsetWidth; card.style.animation = ''; }
      });
      var tile = $('[data-tile]', grid); if (tile) tile.hidden = cat !== 'ALL';
      var cnt = $('[data-grid-count]'); if (cnt) cnt.textContent = n;
    });
  });

  /* ---------- mobile menu ---------- */
  var menuB = $('#ee-menub'), mmenu = $('#ee-mmenu');
  function closeMenu() { if (mmenu && !mmenu.hidden) { mmenu.hidden = true; menuB.setAttribute('aria-expanded', 'false'); } }
  if (menuB) menuB.addEventListener('click', function () { var open = mmenu.hidden; mmenu.hidden = !open; menuB.setAttribute('aria-expanded', String(open)); });
  if (mmenu) mmenu.addEventListener('click', function (e) { if (e.target.closest('a')) closeMenu(); });

  /* ---------- product page form ---------- */
  var pdp = $('form[data-pdp]');
  if (pdp) {
    var idIn = $('[data-pdp-id]', pdp), errEl = $('[data-pdp-err]', pdp), addB = $('[data-pdp-add]', pdp);
    $$('.osz', pdp).forEach(function (b) {
      b.addEventListener('click', function () {
        idIn.value = b.getAttribute('data-v');
        $$('.osz', pdp).forEach(function (x) { var on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-pressed', on); });
        if (errEl) errEl.hidden = true;
      });
    });
    pdp.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!idIn.value) { if (errEl) errEl.hidden = false; return; }
      var orig = addB.textContent; addB.setAttribute('aria-busy', 'true');
      addToCart(idIn.value, 1).then(function () {
        addB.removeAttribute('aria-busy'); addB.textContent = t('added', 'ADDED');
        setTimeout(function () { addB.textContent = orig; }, 1800);
      });
    });
  }

  /* ---------- delegated clicks ---------- */
  document.addEventListener('click', function (e) {
    var t = e.target;
    var o = t.closest('[data-open]');
    if (o && !e.metaKey && !e.ctrlKey && openOverlay(o.getAttribute('data-open'))) { e.preventDefault(); return; }
    var qa = t.closest('[data-add]');
    if (qa) { e.preventDefault(); addToCart(qa.getAttribute('data-add'), 1, qa.getAttribute('data-label')); return; }
    if (t.closest('[data-cart-open]')) { if (openCart()) e.preventDefault(); return; }
    if (t.closest('[data-cart-close]')) { closeCart(); return; }
    if (t.closest('[data-ov-close]')) { closeOverlay(); return; }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeOverlay(); closeCart(); closeMenu(); } });

  // Sync count on bfcache restore
  window.addEventListener('pageshow', function (e) { if (e.persisted) fetchCart(); });
})();

/* static demo: checkout and the newsletter send nothing */
document.addEventListener('submit', function (e) {
  var f = e.target; if (!f || f.tagName !== 'FORM') return;
  e.preventDefault();
  var msg = f.id === 'ee-news' ? 'CONCEPT DEMO · NOTHING WAS SENT' : 'CONCEPT DEMO · NO CHECKOUT, NOTHING IS SOLD';
  var tt = document.getElementById('ee-toast'), s = tt && tt.querySelector('[data-toast]');
  if (s) { s.textContent = msg; tt.hidden = false; clearTimeout(tt.__t); tt.__t = setTimeout(function () { tt.hidden = true; }, 3200); }
});
