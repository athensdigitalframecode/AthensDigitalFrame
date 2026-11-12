/* ENUMA ELISH portfolio demo. No dependencies, no network calls.
   Cart lives in localStorage; checkout and forms are demo-only. */
(() => {
  const D = window.EE_DATA;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const money = (n) => '€' + (Math.round(n * 100) / 100).toFixed(2).replace(/\.00$/, '');
  const up = (s) => String(s).toUpperCase();
  const byHandle = (h) => D.products.find((p) => p.handle === h);
  const url = { product: (p) => `product.html?p=${encodeURIComponent(p.handle)}`, shop: (c) => `shop.html${c ? '?c=' + c : ''}` };
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const LANG = (() => {
    const q = new URLSearchParams(location.search).get('lang');
    try {
      if (q === 'el' || q === 'en') { localStorage.setItem('enuma-lang', q); return q; }
      return localStorage.getItem('enuma-lang') === 'el' ? 'el' : 'en';
    } catch (_) { return q === 'el' ? 'el' : 'en'; }
  })();
  const EL = window.EE_EL || {};
  /* T: translate a known string, then fill {placeholders} */
  const T = (s, v) => { let o = (LANG === 'el' && EL[s]) || s; if (v) o = o.replace(/\{(\w+)\}/g, (_, k) => v[k]); return o; };
  const L = (p, f) => (LANG === 'el' && p.el && p.el[f]) || p[f];
  const ctitle = (c) => (LANG === 'el' && c.el) || c.title;
  const ADF = LANG === 'el' ? 'https://athensdigitalframe.vercel.app/' : 'https://athensdigitalframe.vercel.app/en/';
  document.documentElement.lang = LANG;

  /* static text in the HTML and in rendered templates is translated by exact match */
  function translate(root) {
    if (LANG !== 'el') return;
    const fix = (str) => { const t = str.trim(); return t && EL[t] ? str.replace(t, EL[t]) : null; };
    if (root.nodeType === 3) { const r = fix(root.nodeValue); if (r !== null) root.nodeValue = r; return; }
    if (root.nodeType !== 1) return;
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let n; const nodes = [];
    while ((n = w.nextNode())) nodes.push(n);
    nodes.forEach((t) => { const r = fix(t.nodeValue); if (r !== null) t.nodeValue = r; });
    [root, ...root.querySelectorAll('[aria-label],[placeholder],[alt]')].forEach((e) => ['aria-label', 'placeholder', 'alt'].forEach((a) => {
      const v = e.getAttribute && e.getAttribute(a);
      if (v && EL[v.trim()]) e.setAttribute(a, EL[v.trim()]);
    }));
  }

  const icon = (name, size = 20) => {
    const p = {
      search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21"/>',
      bag: '<path d="M5 8h14l-1 13H6L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
      menu: '<path d="M3 7h18M3 12h18M3 17h18"/>',
      close: '<path d="M5 5l14 14M19 5 5 19"/>',
      plus: '<path d="M12 4v16M4 12h16"/>',
      minus: '<path d="M4 12h16"/>',
      right: '<path d="M4 12h15M13 6l6 6-6 6"/>',
      left: '<path d="M20 12H5M11 6l-6 6 6 6"/>'
    }[name];
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="square" aria-hidden="true">${p}</svg>`;
  };

  /* image or a labelled slot until the real photo is added */
  function pic(img, { cls = 'ph', alt = '', eager = false, sizes = '' } = {}) {
    if (img && img.src) {
      return `<img class="${cls}" src="${esc(img.src)}" alt="${esc(alt || img.alt || '')}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"${sizes ? ` sizes="${sizes}"` : ''}>`;
    }
    return `<div class="slot" role="img" aria-label="${esc(alt || img?.alt || img?.label || 'Image')}"><span aria-hidden="true">${esc(img?.label || 'Photo')}</span></div>`;
  }

  /* ---------- stock ---------- */
  const available = (p, color, size) => !p.soldOut.includes(`${color}/${size}`);
  const anyAvailable = (p) => p.colors.some((c) => p.sizes.some((s) => available(p, c, s)));

  /* ---------- storage-safe cart ---------- */
  const KEY = 'ee-demo-cart';
  const Cart = {
    items: (() => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (_) { return []; } })(),
    save() { try { localStorage.setItem(KEY, JSON.stringify(this.items)); } catch (_) { /* private mode: cart stays in memory */ } },
    count() { return this.items.reduce((n, i) => n + i.qty, 0); },
    total() { return this.items.reduce((n, i) => { const p = byHandle(i.handle); return n + (p ? p.price * i.qty : 0); }, 0); },
    add(handle, color, size) {
      const p = byHandle(handle);
      if (!p || !available(p, color, size)) throw new Error(T('That size just sold out. Pick another.'));
      const line = this.items.find((i) => i.handle === handle && i.color === color && i.size === size);
      if (line) line.qty = Math.min(line.qty + 1, 10); else this.items.push({ handle, color, size, qty: 1 });
      this.save(); renderCart(); openCart();
    },
    set(index, qty) {
      if (qty <= 0) this.items.splice(index, 1); else this.items[index].qty = Math.min(qty, 10);
      this.save(); renderCart();
    }
  };

  /* ---------- overlays with focus trap ---------- */
  const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';
  let layer = null;
  function openLayer(el, { focus, onClose } = {}) {
    if (layer && layer.el !== el) closeLayer(false);
    const returnTo = document.activeElement;
    el.hidden = false;
    document.documentElement.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); closeLayer(); return; }
      if (e.key !== 'Tab') return;
      const items = $$(FOCUSABLE, el).filter((n) => n.offsetParent !== null);
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    el.addEventListener('keydown', onKey);
    layer = { el, returnTo, onKey, onClose };
    requestAnimationFrame(() => (focus || $(FOCUSABLE, el) || el).focus());
  }
  function closeLayer(restore = true) {
    if (!layer) return;
    const { el, returnTo, onKey, onClose } = layer;
    el.hidden = true;
    el.removeEventListener('keydown', onKey);
    document.documentElement.style.overflow = '';
    layer = null;
    if (onClose) onClose();
    if (restore && returnTo && returnTo.focus) returnTo.focus();
  }

  /* ---------- shared chrome ---------- */
  const tickerItems = ['DROP 01 «NO SIGNAL» — NOW LIVE', '<span class="jp">東京 → ΑΘΗΝΑ</span>', 'FREE EU SHIPPING OVER €120', '<span class="jp">圏外 / 規則なし</span>', 'NOT MADE TO FIT IN', '14-DAY RETURNS'];
  function langHref() {
    const q = new URLSearchParams(location.search); q.set('lang', LANG === 'el' ? 'en' : 'el');
    return '?' + q.toString() + location.hash;
  }
  function chromeTop() {
    const group = tickerItems.map((t) => `<span>${t}</span>`).join('');
    return `
<a class="concept-bar" href="${ADF}" target="_blank" rel="noopener">CONCEPT PROJECT BY ATHENS DIGITAL FRAME<span class="hide-m"> · FICTIONAL BRAND, DEMO CHECKOUT</span> ↗</a>
<div class="ticker" data-mq>
  <div class="mq-track"><div class="ticker__group">${group}</div><div class="ticker__group" aria-hidden="true">${group}</div></div>
  <button type="button" class="mq-pause" data-mq-toggle aria-pressed="false">PAUSE</button>
</div>
<div class="section-header"><header class="site-header">
  <nav class="site-header__bar pad" aria-label="Main">
    <a href="./" class="logo" aria-label="ENUMA ELISH, home"><span class="d logo__text">ENUMA ELISH</span><span class="jp logo__jp hide-m">エヌマ・エリシュ</span></a>
    <ul class="navl hide-m" role="list">
      <li><a href="shop.html">SHOP</a></li>
      <li><a href="./#collections">COLLECTIONS</a></li>
      <li><a href="./#world">OUR WORLD</a></li>
      <li><a href="info.html#contact">CONTACT</a></li>
    </ul>
    <div class="site-header__icons">
      <a class="lang" href="${esc(langHref())}" data-lang="${LANG === 'el' ? 'en' : 'el'}" hreflang="${LANG === 'el' ? 'en' : 'el'}" aria-label="${LANG === 'el' ? 'Switch to English' : 'Αλλαγή στα ελληνικά'}">${LANG === 'el' ? 'EN' : 'EL'}</a>
      <button type="button" class="ib" data-search-open aria-label="Search">${icon('search')}</button>
      <button type="button" class="ib bag-btn" data-cart-open aria-label="Open bag, 0 items">${icon('bag', 21)}<span class="bag-btn__count" data-cart-count>0</span></button>
      <button type="button" class="ib show-m" data-menu-open aria-label="Open menu" aria-expanded="false">${icon('menu', 22)}</button>
    </div>
  </nav>
</header></div>

<div class="menu-overlay ovl" id="MobileMenu" role="dialog" aria-modal="true" aria-label="Menu" hidden>
  <div class="menu-overlay__head"><span class="d">ENUMA ELISH</span><button class="ib" type="button" data-menu-close aria-label="Close menu">${icon('close', 24)}</button></div>
  <nav class="menu-overlay__nav" aria-label="Mobile">
    <a href="shop.html" class="d ml">SHOP</a><a href="./#collections" class="d ml" data-menu-close>COLLECTIONS</a>
    <a href="./#world" class="d ml" data-menu-close>OUR WORLD</a><a href="info.html#contact" class="d ml">CONTACT</a>
  </nav>
  <div class="menu-overlay__foot"><span class="jp">東京 / ΑΘΗΝΑ</span><span>INSTAGRAM — TIKTOK</span></div>
</div>

<div class="search-overlay ovl" id="SearchOverlay" role="dialog" aria-modal="true" aria-labelledby="SearchTitle" hidden>
  <div class="search-overlay__inner pad">
    <div class="search-overlay__head"><span id="SearchTitle">SEARCH <span class="jp">検索</span></span>
      <button class="ib" type="button" data-search-close aria-label="Close search">${icon('close', 22)}</button></div>
    <form role="search" data-search-form>
      <label for="SearchInput" class="visually-hidden">Search products</label>
      <input id="SearchInput" class="search-overlay__input d" type="search" placeholder="TYPE TO SEARCH" autocomplete="off" data-search-input>
    </form>
    <div class="search-overlay__results" data-search-results aria-live="polite"></div>
  </div>
</div>`;
  }

  function chromeBottom() {
    return `
<footer class="site-footer" id="contact">
  <div class="site-footer__inner pad">
    <div class="grid12 two">
      <div class="site-footer__news">
        <h2 class="d site-footer__heading">JOIN THE UNDERGROUND</h2>
        <p class="muted-2">Drop alerts before anyone else. No spam, only signal.</p>
        <form class="newsletter" data-demo-form="newsletter" novalidate>
          <label for="NewsEmail" class="visually-hidden">Email address</label>
          <input id="NewsEmail" class="inp newsletter__input" type="email" name="email" required autocomplete="email" placeholder="YOUR EMAIL">
          <button type="submit" class="btn btn-red newsletter__btn">SUBSCRIBE</button>
          <p class="consent">By subscribing you agree to receive drop emails. Unsubscribe any time. See the <a href="info.html#privacy">privacy notice</a>.</p>
          <p class="form-msg" role="status" data-form-msg hidden></p>
        </form>
      </div>
      <div class="site-footer__links">
        <div class="site-footer__col"><span class="site-footer__label">SHOP</span>
          <a href="shop.html?c=new">NEW ARRIVALS</a><a href="shop.html?c=hoodies">HOODIES</a><a href="shop.html?c=tees">T-SHIRTS</a><a href="shop.html?c=bottoms">BOTTOMS</a></div>
        <div class="site-footer__col"><span class="site-footer__label">HELP</span>
          <a href="info.html#shipping">SHIPPING</a><a href="info.html#returns">RETURNS</a><a href="info.html#sizing">SIZE GUIDE</a><a href="info.html#contact">CONTACT</a><a href="info.html#privacy">PRIVACY</a></div>
      </div>
    </div>
    <div class="d site-footer__wordmark" aria-hidden="true">ENUMA ELISH</div>
    <p class="site-footer__concept">Concept project by <a href="${ADF}" target="_blank" rel="noopener">Athens Digital Frame</a>. ENUMA ELISH is a fictional brand: products, prices, stock and policies are samples, and the visuals are illustrations drawn for this concept. The bag works, but checkout and forms are demo-only and send nothing.</p>
    <div class="site-footer__bottom"><span>© 2026 ENUMA ELISH (FICTIONAL)</span><span class="jp">東京 / ΑΘΗΝΑ</span><span>MADE AFTER 2 AM</span></div>
  </div>
</footer>

<div class="drawer-root" id="CartDrawer" hidden>
  <button class="drawer-scrim ovl" type="button" data-cart-close aria-label="Close bag" tabindex="-1"></button>
  <aside class="drawer" role="dialog" aria-modal="true" aria-labelledby="CartTitle" tabindex="-1" data-drawer></aside>
</div>

<div class="notice" id="DemoNotice" role="dialog" aria-modal="true" aria-labelledby="NoticeTitle" hidden>
  <button class="notice__scrim" type="button" data-notice-close aria-label="Close" tabindex="-1"></button>
  <div class="notice__box">
    <h2 id="NoticeTitle">DEMO CHECKOUT</h2>
    <p>This is a concept project by Athens Digital Frame, so no order is placed and no payment is taken. On a live store this button opens the secure Shopify checkout with card, Apple Pay, Google Pay and PayPal.</p>
    <p><a href="${ADF}" target="_blank" rel="noopener">Want a shop like this? Talk to Athens Digital Frame ↗</a></p>
    <button type="button" class="btn btn-dark" data-notice-close>BACK TO THE BAG</button>
  </div>
</div>`;
  }

  /* ---------- cart drawer ---------- */
  function renderCart() {
    const n = Cart.count();
    $$('[data-cart-count]').forEach((el) => (el.textContent = n));
    $$('[data-cart-open]').forEach((el) => el.setAttribute('aria-label', T(n === 1 ? 'Open bag, {n} item' : 'Open bag, {n} items', { n })));
    const panel = $('[data-drawer]');
    if (!panel) return;
    const total = Cart.total();
    const left = Math.max(0, D.freeShipping - total);
    const pct = Math.min(100, (total / D.freeShipping) * 100);
    const head = `<div class="drawer__head"><h2 class="d drawer__title" id="CartTitle">${T('YOUR BAG ({n})', { n })} <span class="jp">バッグ</span></h2>
      <button class="ib" type="button" data-cart-close aria-label="Close bag">${icon('close', 22)}</button></div>`;
    if (!Cart.items.length) {
      panel.innerHTML = head + `<div class="drawer__body"><div class="drawer__empty"><p class="d">YOUR BAG IS EMPTY.<br><span class="t-red">THE STREETS ARE WAITING.</span></p>
        <a href="shop.html" class="btn btn-dark">SHOP DROP 01</a></div></div>`;
      return;
    }
    const lines = Cart.items.map((it, i) => {
      const p = byHandle(it.handle);
      if (!p) return '';
      return `<li class="line">
        <a class="line__img" href="${url.product(p)}" tabindex="-1" aria-hidden="true">${pic(p.images[0], { alt: '' })}</a>
        <div class="line__info">
          <div class="line__top"><a href="${url.product(p)}" class="d line__name">${esc(p.name)}</a><span class="line__price">${money(p.price * it.qty)}</span></div>
          <span class="line__meta">${esc(T(up(it.color)))} / ${esc(it.size)}</span>
          <div class="line__actions">
            <div class="qty">
              <button class="ib" type="button" data-qty="${i}" data-to="${it.qty - 1}" aria-label="${T('Decrease quantity of {x}', { x: esc(p.name) })}">${icon('minus', 14)}</button>
              <span class="qty__n" aria-live="polite">${it.qty}</span>
              <button class="ib" type="button" data-qty="${i}" data-to="${it.qty + 1}" aria-label="${T('Increase quantity of {x}', { x: esc(p.name) })}" ${it.qty >= 10 ? 'disabled' : ''}>${icon('plus', 14)}</button>
            </div>
            <button class="link-btn" type="button" data-qty="${i}" data-to="0">REMOVE</button>
          </div>
        </div></li>`;
    }).join('');
    panel.innerHTML = head + `
      <div class="ship-meter" role="status">
        <span>${left > 0 ? T('You’re {x} away from free EU shipping.', { x: `<b>${money(left)}</b>` }) : `<b>${T('Free EU shipping unlocked.')}</b>`}</span>
        <div class="ship-meter__bar" aria-hidden="true"><i style="width:${pct}%"></i></div>
      </div>
      <div class="drawer__body"><ul class="drawer__lines" role="list">${lines}</ul></div>
      <div class="drawer__foot">
        <div class="drawer__row"><span>SUBTOTAL</span><span>${money(total)}</span></div>
        <span class="drawer__note">Taxes included. Shipping calculated at checkout. 14-day returns.</span>
        <button type="button" class="btn btn-red btn-xl" data-checkout>${T('CHECKOUT — {x}', { x: money(total) })}</button>
        <span class="drawer__demo">Demo store: checkout places no order.</span>
        <button type="button" class="link-btn link-btn--center" data-cart-close>CONTINUE SHOPPING</button>
      </div>`;
  }
  const openCart = () => openLayer($('#CartDrawer'), { focus: $('[data-drawer]') });

  /* ---------- search ---------- */
  function searchResults(q) {
    const t = q.trim().toLowerCase();
    if (!t) return '';
    const hits = D.products.filter((p) => [p.name, p.jp, p.code, ...p.colors, ...p.collections].join(' ').toLowerCase().includes(t));
    if (!hits.length) return `<p class="sr-empty">NO SIGNAL. TRY ANOTHER WORD, LIKE “HOODIE” OR “BLACK”.</p>`;
    return hits.map((p) => `<a class="sr-item" href="${url.product(p)}"><span class="d">${esc(up(p.name))}</span><span class="sr-item__price">${money(p.price)}</span></a>`).join('');
  }

  /* ---------- product card ---------- */
  function card(p, { cls = 'cu', badge = '', sizes = '', quick = true } = {}) {
    const color = p.colors.find((c) => p.sizes.some((s) => available(p, c, s))) || p.colors[0];
    const out = !anyAvailable(p);
    const sw = p.colors.length > 1 ? p.colors.map((c) => `<button type="button" class="sw" data-card-color="${esc(c)}" aria-pressed="${c === color}" aria-label="${esc(T(c))}"><span style="--sw:${D.colors[c]}"></span></button>`).join('') : `<span class="sw" aria-hidden="true"><span style="--sw:${D.colors[color]}"></span></span>`;
    return `<article class="card ${cls}" data-card="${esc(p.handle)}" data-color="${esc(color)}" data-collections="${p.collections.join(' ')}">
      <a href="${url.product(p)}" class="media zoom" aria-label="${esc(p.name)}">
        ${pic(p.images[0], { cls: 'media__main ph', alt: `${p.name}, ${T(color)}`, sizes })}
        ${p.images[1] && p.images[1].src ? pic(p.images[1], { cls: 'look ph', alt: '' }) : ''}
        <span class="tag tag--tl">${esc(p.code)}</span>
        <span class="jp tag tag--v">${esc(p.jp)}</span>
        ${out ? '<span class="tag tag--bl tag--red">SOLD OUT</span>' : badge ? `<span class="tag tag--bl tag--red">${esc(badge)}</span>` : ''}
      </a>
      <div class="card__row"><a href="${url.product(p)}" class="d card__name">${esc(p.name)}</a><span class="card__price">${money(p.price)}</span></div>
      ${quick ? `<div class="card__row card__row--c">
        <div class="swatches" role="group" aria-label="Colour">${sw}<span class="card__color" data-card-color-name>${esc(T(up(color)))}</span></div>
        ${out ? '' : `<button type="button" class="qa" data-qa-open aria-expanded="false">+ QUICK ADD</button>`}
      </div>
      <div class="qa-panel ovl" data-qa-panel hidden>
        <span class="qa-panel__label">SELECT SIZE</span>
        ${p.sizes.map((s) => `<button type="button" class="sz" data-qa-size="${esc(s)}">${esc(s)}</button>`).join('')}
        <button type="button" class="ib" data-qa-close aria-label="Close quick add">${icon('close', 18)}</button>
      </div>
      <p class="card__err" role="alert" data-card-err hidden></p>` : ''}
    </article>`;
  }
  function syncCard(cardEl) {
    const p = byHandle(cardEl.dataset.card);
    const color = cardEl.dataset.color;
    $$('[data-qa-size]', cardEl).forEach((b) => {
      const ok = available(p, color, b.dataset.qaSize);
      b.disabled = !ok;
      b.setAttribute('aria-label', T('Add size {s} in {c} to bag', { s: b.dataset.qaSize, c: T(color) }) + (ok ? '' : T(', sold out')));
    });
  }

  /* ---------- grids ---------- */
  function sortList(list, mode) {
    const l = list.slice();
    if (mode === 'low') l.sort((a, b) => a.price - b.price);
    if (mode === 'high') l.sort((a, b) => b.price - a.price);
    return l;
  }

  function initHome() {
    const grid = $('[data-drop-grid]');
    if (!grid) return;
    const items = D.products.filter((p) => p.collections.includes('new')).concat(D.products.filter((p) => !p.collections.includes('new')));
    grid.innerHTML = items.slice(0, 5).map((p, i) => card(p, {
      cls: 'c' + i, badge: i === 0 ? 'LOOK 01' : '',
      sizes: i === 0 ? '(min-width: 901px) 58vw, 100vw' : '(min-width: 901px) 40vw, (min-width: 561px) 50vw, 100vw'
    })).join('');
    const chips = $('[data-filters]');
    chips.innerHTML = [['all', 'ALL'], ['hoodies', 'HOODIES'], ['tees', 'TEES'], ['bottoms', 'BOTTOMS'], ['accessories', 'ACCESSORIES']]
      .map(([id, l], i) => `<button type="button" class="chip" data-filter="${id}" aria-pressed="${i === 0}">${l}</button>`).join('');
    chips.addEventListener('click', (e) => {
      const chip = e.target.closest('[data-filter]');
      if (!chip) return;
      const id = chip.dataset.filter;
      $$('[data-filter]', chips).forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
      let shown = 0;
      $$('[data-card]', grid).forEach((c) => {
        const hit = id === 'all' || c.dataset.collections.split(' ').includes(id);
        c.classList.toggle('is-hidden', !hit);
        if (hit) shown++;
      });
      grid.classList.toggle('is-filtered', id !== 'all');
      grid.hidden = shown === 0;
      $('[data-drop-empty]').hidden = shown > 0;
    });
    $('[data-filter-reset]').addEventListener('click', () => $('[data-filter="all"]', chips).click());

    const rows = $('[data-cols]');
    rows.innerHTML = D.collections.map((c, i) => {
      const n = D.products.filter((p) => p.collections.includes(c.id)).length;
      const count = c.soon || T(n === 1 ? '{n} PIECE' : '{n} PIECES', { n: String(n).padStart(2, '0') });
      const inner = `<span class="muted">${String(i + 1).padStart(2, '0')}</span>
        <span class="row__t"><span class="d">${esc(up(ctitle(c)))}</span><span class="jp muted">${esc(c.jp)}</span></span>
        <span class="muted row__count">${count}</span>`;
      return c.soon ? `<div class="row row--soon" aria-label="${esc(T('{x}, coming with Drop 02', { x: ctitle(c) }))}">${inner}</div>` : `<a href="${url.shop(c.id)}" class="row">${inner}</a>`;
    }).join('');
  }

  function initShop() {
    const grid = $('[data-shop-grid]');
    if (!grid) return;
    const params = new URLSearchParams(location.search);
    let current = params.get('c') || 'all';
    let sort = params.get('sort') || 'featured';
    const chips = $('[data-shop-filters]');
    const opts = [{ id: 'all', title: 'All', el: 'Όλα' }].concat(D.collections.filter((c) => !c.soon));
    if (!opts.some((o) => o.id === current)) current = 'all';
    chips.innerHTML = opts.map((o) => `<button type="button" class="chip" data-c="${o.id}" aria-pressed="${o.id === current}">${esc(up(ctitle(o)))}</button>`).join('');
    const sel = $('[data-sort]');
    sel.value = sort;
    function draw() {
      const meta = D.collections.find((c) => c.id === current);
      const list = sortList(current === 'all' ? D.products : D.products.filter((p) => p.collections.includes(current)), sort);
      const title = meta ? ctitle(meta) : T('All products');
      $('[data-shop-title]').textContent = up(title);
      $('[data-shop-crumb]').textContent = up(title);
      $('[data-shop-count]').textContent = T(list.length === 1 ? '{n} PIECE' : '{n} PIECES', { n: list.length });
      document.title = T('{x} | ENUMA ELISH (concept)', { x: meta ? ctitle(meta) : T('Shop all') });
      grid.innerHTML = list.map((p) => card(p, { sizes: '(min-width: 901px) 31vw, (min-width: 561px) 50vw, 100vw' })).join('');
      const q = new URLSearchParams();
      if (current !== 'all') q.set('c', current);
      if (sort !== 'featured') q.set('sort', sort);
      history.replaceState(null, '', location.pathname + (q.toString() ? '?' + q : ''));
    }
    chips.addEventListener('click', (e) => {
      const c = e.target.closest('[data-c]');
      if (!c) return;
      current = c.dataset.c;
      $$('[data-c]', chips).forEach((b) => b.setAttribute('aria-pressed', String(b === c)));
      draw();
    });
    sel.addEventListener('change', () => { sort = sel.value; draw(); });
    draw();
  }

  /* ---------- product page ---------- */
  function initProduct() {
    const root = $('[data-pdp]');
    if (!root) return;
    const p = byHandle(new URLSearchParams(location.search).get('p'));
    if (!p) {
      root.innerHTML = `<div class="notfound"><p class="eyebrow">404 · <span class="jp">圏外</span></p><h1 class="d">NO SIGNAL.</h1>
        <p class="muted-2">That piece doesn't exist, or it's from a drop that's gone.</p><a class="btn btn-red btn-lg" href="shop.html">SHOP DROP 01</a></div>`;
      document.title = T('{x} | ENUMA ELISH (concept)', { x: T('Not found') });
      return;
    }
    document.title = `${p.name} | ENUMA ELISH (concept)`;
    $('meta[name="description"]').setAttribute('content', `${p.name}: ${L(p, 'desc')}`);
    const guide = D.guides[p.guide];
    let color = p.colors.find((c) => p.sizes.some((s) => available(p, c, s))) || p.colors[0];
    let size = null;
    const imgs = p.images;
    const cat = D.collections.find((c) => p.collections.includes(c.id) && c.id !== 'new') || D.collections[0];

    root.innerHTML = `
<nav class="crumbs" aria-label="Breadcrumb"><a href="shop.html">SHOP</a><span aria-hidden="true">/</span><a href="${url.shop(cat.id)}">${esc(up(ctitle(cat)))}</a><span aria-hidden="true">/</span><span class="t-white" aria-current="page">${esc(up(p.name))}</span></nav>
<div class="pdp">
  <div class="pdp-g">
    <div class="gal hide-m">
      <div class="gal__thumbs">${imgs.map((im, i) => `<button type="button" class="thumb" data-thumb="${i}" aria-label="${T('Show image {n}', { n: i + 1 })}" aria-pressed="${i === 0}">${pic(im, { alt: '' })}</button>`).join('')}</div>
      <div class="gal__main">
        ${imgs.map((im, i) => `<div class="slide${i === 0 ? ' is-on' : ''}" data-slide="${i}" ${i ? 'aria-hidden="true"' : ''}>${pic(im, { alt: T('{x}, image {n}', { x: p.name, n: i + 1 }), eager: i === 0 })}</div>`).join('')}
        <span class="gal__label" data-gal-label>1 / ${imgs.length}</span>
        ${imgs.length > 1 ? `<div class="gal__nav"><button type="button" class="ib ib--dark" data-prev aria-label="Previous image">${icon('left', 18)}</button><button type="button" class="ib ib--dark" data-next aria-label="Next image">${icon('right', 18)}</button></div>` : ''}
      </div>
    </div>
    <div class="gal-m show-m">
      <div class="swipe" tabindex="0" aria-label="Product images, swipe to browse">${imgs.map((im, i) => `<div class="swipe__item">${pic(im, { alt: T('{x}, image {n}', { x: p.name, n: i + 1 }), eager: i === 0 })}<span class="swipe__n">${i + 1} / ${imgs.length}</span></div>`).join('')}</div>
      ${imgs.length > 1 ? '<span class="swipe__hint">SWIPE →</span>' : ''}
    </div>
  </div>
  <div class="pdp-i"><div class="pdp-sticky">
    <div class="pdp-i__head">
      <span class="eyebrow">${esc(p.code)} · DROP 01 «NO SIGNAL»</span>
      <h1 class="d pdp__title">${esc(p.name)}</h1>
      <div class="pdp__sub"><span class="jp">${esc(p.jp)}</span><span class="pdp__price">${money(p.price)}</span></div>
      <span class="pdp__ship-note">Taxes included. Free EU shipping over ${money(D.freeShipping)}.</span>
    </div>
    <form class="pdp-form" data-pdp-form novalidate>
      <fieldset class="opt opt--line">
        <legend class="eyebrow">COLOUR — <span class="t-white" data-color-label>${esc(T(up(color)))}</span></legend>
        <div class="opt__swatches">${p.colors.map((c) => `<label class="sq"><input type="radio" class="visually-hidden" name="color" value="${esc(c)}" ${c === color ? 'checked' : ''}><span class="sq__fill" style="--sw:${D.colors[c]}"></span><span class="visually-hidden">${esc(T(c))}</span></label>`).join('')}</div>
      </fieldset>
      <fieldset class="opt" id="sizes">
        <div class="opt__top"><legend class="eyebrow">SIZE — <span class="t-white" data-size-label>SELECT</span></legend>
          <button type="button" class="link-btn" data-guide-toggle aria-expanded="false" aria-controls="guide">SIZE GUIDE</button></div>
        <div class="opt__sizes" data-size-grid>${p.sizes.map((s) => `<label class="szb"><input type="radio" class="visually-hidden" name="size" value="${esc(s)}"><span>${esc(s)}</span></label>`).join('')}</div>
        <span class="pdp__err" role="alert" data-size-err hidden>PICK A SIZE FIRST.</span>
        <span class="pdp__note">${esc(L(p, 'fit'))}</span>
        <span class="pdp__model">${esc(L(p, 'model'))}</span>
        <div class="guide ovl" id="guide" hidden><table><caption>${esc(up(guide.caption))}</caption>
          <thead><tr>${guide.head.map((h) => `<th scope="col">${esc(up(h))}</th>`).join('')}</tr></thead>
          <tbody>${guide.rows.map((r) => `<tr><th scope="row">${r[0]}</th>${r.slice(1).map((v) => `<td>${v}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
      </fieldset>
      <button type="submit" class="btn btn-red btn-xxl" data-add>SELECT A SIZE</button>
      <p class="pay">SECURE CHECKOUT · CARD · APPLE PAY · GOOGLE PAY · PAYPAL</p>
    </form>
    <ul class="trust" role="list">
      <li>Ships from Athens in 1–2 business days</li>
      <li>Free EU shipping over ${money(D.freeShipping)}</li>
      <li>14-day returns, unworn with tags attached</li>
    </ul>
    <div class="rte pdp__desc"><p>${esc(L(p, 'desc'))}</p></div>
    <div class="acc">
      <details open><summary>FABRIC &amp; FIT<span class="pl" aria-hidden="true">${icon('plus', 16)}</span></summary><div class="rte acc__body"><ul>${L(p, 'fabric').map((f) => `<li>${esc(f)}</li>`).join('')}</ul></div></details>
      <details><summary>SHIPPING &amp; RETURNS<span class="pl" aria-hidden="true">${icon('plus', 16)}</span></summary><div class="rte acc__body"><p>Ships from Athens within 1–2 business days. EU delivery in 2–5 business days; free over ${money(D.freeShipping)}, otherwise €6. You have 14 days from delivery to return unworn items with tags attached. <a href="info.html#returns">Full returns policy</a>.</p></div></details>
      <details><summary>CARE<span class="pl" aria-hidden="true">${icon('plus', 16)}</span></summary><div class="rte acc__body"><p>${esc(L(p, 'care'))}</p></div></details>
    </div>
  </div></div>
</div>
<div class="sticky-atc show-m" data-sticky>
  <div class="sticky-atc__info"><span class="d sticky-atc__name">${esc(p.name)}</span><span class="sticky-atc__meta" data-sticky-meta></span></div>
  <button type="button" class="btn btn-red sticky-atc__btn" data-sticky-add>SELECT SIZE</button>
</div>`;

    const form = $('[data-pdp-form]', root);
    const addBtn = $('[data-add]', root);
    const sticky = $('[data-sticky-add]', root);
    const err = $('[data-size-err]', root);

    function update() {
      $$('input[name=size]', form).forEach((r) => r.closest('label').classList.toggle('is-unavailable', !available(p, color, r.value)));
      $$('input[name=color]', form).forEach((r) => r.closest('label').classList.toggle('is-unavailable', !p.sizes.some((s) => available(p, r.value, s))));
      $('[data-color-label]', root).textContent = T(up(color));
      $('[data-size-label]', root).textContent = size || T('SELECT');
      let label, disabled = false;
      if (!size) label = T('SELECT A SIZE');
      else if (!available(p, color, size)) { label = T('SOLD OUT'); disabled = true; }
      else label = T('ADD TO BAG — {x}', { x: money(p.price) });
      addBtn.textContent = label;
      addBtn.disabled = disabled;
      sticky.textContent = !size ? T('SELECT SIZE') : disabled ? T('SOLD OUT') : T('ADD TO BAG');
      sticky.disabled = disabled;
      sticky.classList.toggle('is-select', !size);
      $('[data-sticky-meta]', root).textContent = [money(p.price), T(up(color)), size || T('NO SIZE')].join(' · ');
    }
    function flagSize() {
      err.hidden = false;
      const g = $('[data-size-grid]', root);
      g.classList.remove('shake'); void g.offsetWidth; g.classList.add('shake');
      $('#sizes').scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'center' });
      $('input[name=size]', form).focus({ preventScroll: true });
    }
    function submit() {
      if (!size) { flagSize(); return; }
      try { Cart.add(p.handle, color, size); } catch (e) { err.textContent = e.message; err.hidden = false; }
    }
    form.addEventListener('change', (e) => {
      if (e.target.name === 'color') { color = e.target.value; if (size && !available(p, color, size)) { /* keep choice, show sold out */ } }
      if (e.target.name === 'size') { size = e.target.value; err.hidden = true; err.textContent = T('PICK A SIZE FIRST.'); }
      update();
    });
    form.addEventListener('submit', (e) => { e.preventDefault(); submit(); });
    sticky.addEventListener('click', submit);
    const gBtn = $('[data-guide-toggle]', root);
    gBtn.addEventListener('click', () => { const g = $('#guide'); g.hidden = !g.hidden; gBtn.setAttribute('aria-expanded', String(!g.hidden)); });

    const slides = $$('[data-slide]', root), thumbs = $$('[data-thumb]', root);
    let gi = 0;
    const show = (i) => {
      gi = (i + slides.length) % slides.length;
      slides.forEach((s, n) => { s.classList.toggle('is-on', n === gi); if (n === gi) s.removeAttribute('aria-hidden'); else s.setAttribute('aria-hidden', 'true'); });
      thumbs.forEach((t, n) => t.setAttribute('aria-pressed', String(n === gi)));
      $('[data-gal-label]', root).textContent = `${gi + 1} / ${slides.length}`;
    };
    thumbs.forEach((t) => t.addEventListener('click', () => show(Number(t.dataset.thumb))));
    const prev = $('[data-prev]', root), next = $('[data-next]', root);
    if (prev) prev.addEventListener('click', () => show(gi - 1));
    if (next) next.addEventListener('click', () => show(gi + 1));
    update();

    const rel = $('[data-related]');
    if (rel) {
      const others = D.products.filter((x) => x !== p).sort((a, b) => (b.guide !== p.guide) - (a.guide !== p.guide)).slice(0, 4);
      rel.innerHTML = others.map((x) => card(x, { cls: 'rel-card', quick: false, sizes: '(min-width: 901px) 25vw, 50vw' })).join('');
    }
  }

  /* ---------- info page ---------- */
  function initInfo() {
    const box = $('[data-guides]');
    if (!box) return;
    box.innerHTML = Object.values(D.guides).map((g, i) => `<div class="guide"><table><caption>${['TOPS: HOODIES & CREWNECKS', 'T-SHIRTS', 'BOTTOMS'][i]} · ${esc(up(g.caption))}</caption>
      <thead><tr>${g.head.map((h) => `<th scope="col">${esc(up(h))}</th>`).join('')}</tr></thead>
      <tbody>${g.rows.map((r) => `<tr><th scope="row">${r[0]}</th>${r.slice(1).map((v) => `<td>${v}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`).join('');
  }

  /* ---------- demo forms ---------- */
  function initForms() {
    $$('[data-demo-form]').forEach((f) => f.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = $('[data-form-msg]', f);
      const email = $('input[type=email]', f);
      const bad = $$('[required]', f).find((el) => !el.value.trim() || (el.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value)));
      $$('[aria-invalid]', f).forEach((el) => el.removeAttribute('aria-invalid'));
      if (bad) {
        bad.setAttribute('aria-invalid', 'true');
        msg.className = 'form-msg form-msg--err';
        msg.textContent = T(bad.type === 'email' ? 'Enter a valid email address.' : 'Fill in this field.');
        msg.hidden = false; bad.focus(); return;
      }
      msg.className = 'form-msg form-msg--ok';
      msg.textContent = T(f.dataset.demoForm === 'newsletter'
        ? 'YOU’RE IN. 地下へようこそ。 (Demo: nothing was sent or stored.)'
        : 'Message ready. (Demo: this concept store sends nothing. A live store would deliver it to the brand’s inbox.)');
      msg.hidden = false;
      f.reset();
      if (email) email.blur();
    }));
  }

  /* ---------- global events ---------- */
  document.addEventListener('click', (e) => {
    const t = e.target;
    if (t.closest('[data-cart-open]')) { openCart(); return; }
    if (t.closest('[data-cart-close]')) { closeLayer(); return; }
    const q = t.closest('[data-qty]');
    if (q) {
      const i = Number(q.dataset.qty);
      Cart.set(i, Number(q.dataset.to));
      const again = $(`[data-qty="${Math.min(i, Cart.items.length - 1)}"]`) || $('[data-drawer]');
      again.focus();
      return;
    }
    if (t.closest('[data-checkout]')) { openLayer($('#DemoNotice'), { onClose: () => openLayer($('#CartDrawer'), { focus: $('[data-checkout]') || $('[data-drawer]') }) }); return; }
    if (t.closest('[data-notice-close]')) { closeLayer(false); return; }
    const mo = t.closest('[data-menu-open]');
    if (mo) { mo.setAttribute('aria-expanded', 'true'); openLayer($('#MobileMenu'), { onClose: () => mo.setAttribute('aria-expanded', 'false') }); return; }
    if (t.closest('[data-menu-close]')) { closeLayer(!t.closest('a')); return; }
    if (t.closest('[data-search-open]')) {
      const ov = $('#SearchOverlay'), input = $('[data-search-input]');
      openLayer(ov, { focus: input, onClose: () => { input.value = ''; $('[data-search-results]').innerHTML = ''; } });
      return;
    }
    if (t.closest('[data-search-close]')) { closeLayer(); return; }
    const mq = t.closest('[data-mq-toggle]');
    if (mq) { const on = mq.getAttribute('aria-pressed') !== 'true'; mq.setAttribute('aria-pressed', String(on)); mq.textContent = T(on ? 'PLAY' : 'PAUSE'); $$('.ticker, .city-mq').forEach((m) => m.classList.toggle('is-paused', on)); return; }

    const sw = t.closest('[data-card-color]');
    if (sw) {
      const c = sw.closest('[data-card]');
      c.dataset.color = sw.dataset.cardColor;
      $$('[data-card-color]', c).forEach((b) => b.setAttribute('aria-pressed', String(b === sw)));
      $('[data-card-color-name]', c).textContent = T(up(sw.dataset.cardColor));
      syncCard(c);
      return;
    }
    const qo = t.closest('[data-qa-open]');
    if (qo) {
      const c = qo.closest('[data-card]');
      $$('[data-qa-panel]').forEach((pn) => { pn.hidden = true; });
      $$('[data-qa-open]').forEach((b) => { b.hidden = false; b.setAttribute('aria-expanded', 'false'); });
      syncCard(c);
      $('[data-qa-panel]', c).hidden = false;
      qo.hidden = true; qo.setAttribute('aria-expanded', 'true');
      const first = $('[data-qa-size]:not(:disabled)', c);
      if (first) first.focus();
      return;
    }
    const qc = t.closest('[data-qa-close]');
    if (qc) {
      const c = qc.closest('[data-card]');
      $('[data-qa-panel]', c).hidden = true;
      const o = $('[data-qa-open]', c); o.hidden = false; o.setAttribute('aria-expanded', 'false'); o.focus();
      return;
    }
    const qs = t.closest('[data-qa-size]');
    if (qs) {
      const c = qs.closest('[data-card]');
      const errEl = $('[data-card-err]', c);
      try {
        Cart.add(c.dataset.card, c.dataset.color, qs.dataset.qaSize);
        errEl.hidden = true;
        $('[data-qa-panel]', c).hidden = true;
        const o = $('[data-qa-open]', c); o.hidden = false; o.setAttribute('aria-expanded', 'false');
      } catch (er) { errEl.textContent = er.message; errEl.hidden = false; }
    }
  });

  document.addEventListener('input', (e) => {
    if (e.target.matches('[data-search-input]')) $('[data-search-results]').innerHTML = searchResults(e.target.value);
  });
  document.addEventListener('submit', (e) => {
    if (e.target.matches('[data-search-form]')) {
      e.preventDefault();
      const first = $('[data-search-results] a');
      if (first) location.href = first.getAttribute('href');
    }
  });

  /* ---------- boot ---------- */
  const top = $('#chrome-top'), bottom = $('#chrome-bottom');
  if (top) top.outerHTML = chromeTop();
  if (bottom) bottom.outerHTML = chromeBottom();
  if (LANG === 'el') {
    translate(document.body);
    document.title = T(document.title);
    new MutationObserver((ms) => ms.forEach((m) => m.addedNodes.forEach(translate))).observe(document.body, { childList: true, subtree: true });
  }
  if (new URLSearchParams(location.search).has('lang')) {
    const u = new URL(location.href); u.searchParams.delete('lang'); history.replaceState(null, '', u.pathname + u.search + u.hash);
  }
  renderCart();
  initHome(); initShop(); initProduct(); initInfo(); initForms();
  $$('[data-hero-img], [data-media]').forEach((el) => {
    const m = D.media[el.dataset.media || 'hero'];
    el.innerHTML = pic(m, { cls: el.dataset.cls || 'ph', eager: el.hasAttribute('data-eager'), alt: (LANG === 'el' && m.altEl) || m.alt }) + el.innerHTML;
  });
  window.addEventListener('storage', (e) => { if (e.key === KEY) { try { Cart.items = JSON.parse(e.newValue) || []; } catch (_) { Cart.items = []; } renderCart(); } });
})();
