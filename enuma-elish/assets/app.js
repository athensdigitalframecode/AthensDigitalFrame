/**
 * Enuma Elish concept store: static demo of the Shopify theme.
 * Dialogs, cart drawer (localStorage), product variants, shop filters, search,
 * rail tap-to-flip, newsletter and demo checkout. Pages work without JS.
 */
(() => {
  const D = window.ENUMA;
  const root = document.body.dataset.root || '';
  const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const money = (c) => '€' + (c % 100 === 0 ? (c / 100).toLocaleString('en-IE') : (c / 100).toLocaleString('en-IE', { minimumFractionDigits: 2 }));
  const byHandle = (h) => D.products.find((p) => p.handle === h);

  /* ---------- garment drawing (mirrors the theme's garment-placeholder snippet) ---------- */
  function garment(i, side, colour, cls = '', label = '') {
    const [shape, detail, accent, back] = D.garments[i % 8];
    const pal = D.colours[colour];
    const a11y = label ? `role="img" aria-label="${esc(label)}"` : 'aria-hidden="true"';
    let inner;
    if (side === 'back') {
      const [f, s, d] = pal.b;
      const y = i === 2 || i === 6 ? 150 : 156;
      inner = `<path d="${shape}" fill="${f}" stroke="${s}" stroke-width="1.5" stroke-linejoin="round"/><path d="${back}" fill="none" stroke="${d}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><text x="120" y="${y}" text-anchor="middle" fill="#E5383B" font-size="22" font-family="'Noto Sans JP', sans-serif" font-weight="500" letter-spacing="2">混沌</text><path d="M104 ${y + 12}H136" stroke="#E5383B" stroke-width="1" opacity=".7"/>`;
    } else {
      const [f, s, d] = pal.f;
      const ac = colour === 'Vermilion' ? '#EDEBE6' : '#E5383B';
      const fill = D.accentFilled.includes(i) ? ac : 'none';
      inner = `<path d="${shape}" fill="${f}" stroke="${s}" stroke-width="1.5" stroke-linejoin="round"/><path d="${detail}" fill="none" stroke="${d}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="${accent}" fill="${fill}" stroke="${ac}" stroke-width="2" stroke-linecap="round"/>`;
    }
    return `<svg class="garment ${cls}" viewBox="0 0 240 300" width="240" height="300" xmlns="http://www.w3.org/2000/svg" ${a11y} focusable="false">${inner}</svg>`;
  }
  const ICON = {
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
  };
  const icon = (n) => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICON[n]}</svg>`;

  /* ---------- dialogs (from the theme's dialog.js) ---------- */
  function openDialog(dialog, opener = document.activeElement) {
    if (!dialog || dialog.open) return;
    dialog.openerElement = opener;
    dialog.showModal();
    requestAnimationFrame(() => requestAnimationFrame(() => (dialog.dataset.state = 'open')));
    dialog.dispatchEvent(new CustomEvent('dialog:open'));
  }
  function closeDialog(dialog) {
    if (!dialog || !dialog.open || dialog.dataset.state === 'closing') return;
    dialog.dataset.state = 'closing';
    setTimeout(() => {
      dialog.close();
      delete dialog.dataset.state;
      const o = dialog.openerElement;
      if (o && document.contains(o)) o.focus({ preventScroll: true });
    }, reducedMotion() ? 0 : 320);
  }
  document.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-dialog-open]');
    if (opener) {
      const d = document.getElementById(opener.dataset.dialogOpen);
      if (d) {
        e.preventDefault();
        openDialog(d, opener);
      }
      return;
    }
    const closer = e.target.closest('[data-dialog-close]');
    if (closer) return closeDialog(closer.closest('dialog'));
    if (e.target instanceof HTMLDialogElement && e.target.open) closeDialog(e.target);
  });
  document.addEventListener('cancel', (e) => {
    if (e.target instanceof HTMLDialogElement) {
      e.preventDefault();
      closeDialog(e.target);
    }
  }, true);

  /* ---------- cart ---------- */
  const KEY = 'enuma-cart';
  const load = () => {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
  };
  let cart = load();
  const save = () => {
    try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch { /* private mode: cart lives for this page */ }
  };
  const lineKey = (l) => `${l.handle}|${l.colour}|${l.size}`;
  const count = () => cart.reduce((n, l) => n + l.qty, 0);
  const total = () => cart.reduce((n, l) => n + byHandle(l.handle).price * l.qty, 0);
  const drawer = () => document.getElementById('CartDrawer');

  function renderCart(focusKey) {
    const inner = $('[data-cart-inner]');
    if (!inner) return;
    const n = count();
    const t = total();
    let html = `<div class="drawer__head"><h2 class="label" id="CartDrawerTitle">Cart <span class="muted">(${n})</span> <span class="jp" lang="ja">カート</span></h2>
      <button class="icon-btn" type="button" data-dialog-close data-focus-key="close" aria-label="Close">${icon('close')}</button></div>`;
    if (n === 0) {
      html += `<div class="cart-drawer__empty"><span class="empty__kanji" lang="ja" aria-hidden="true">空</span><p class="display">Your cart is empty.</p><a class="btn" href="${root}shop.html">Continue shopping</a></div>`;
    } else {
      const remaining = D.freeShipping - t;
      const progress = Math.min(100, Math.floor((t / D.freeShipping) * 100));
      html += `<div class="ship-bar"><p class="ship-bar__text">${remaining > 0 ? `<strong>${money(remaining)}</strong> away from free shipping` : 'Free shipping unlocked.'}</p>
        <div class="ship-bar__track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress}" aria-label="Progress to free shipping"><span style="--progress: ${progress}%;"></span></div></div>`;
      html += '<ul class="cart-lines" role="list">';
      cart.forEach((l) => {
        const p = byHandle(l.handle);
        const k = esc(lineKey(l));
        html += `<li class="cart-line"><a class="cart-line__media" href="${root}products/${p.handle}.html" tabindex="-1" aria-hidden="true">${garment(p.garment, 'front', l.colour)}</a>
          <div class="cart-line__info"><div class="cart-line__top"><a class="cart-line__title" href="${root}products/${p.handle}.html">${esc(p.title)}</a><span class="cart-line__price">${money(p.price * l.qty)}</span></div>
          <p class="cart-line__meta muted">${esc(l.colour)} / ${esc(l.size)}</p>
          <div class="cart-line__actions"><div class="stepper" role="group" aria-label="Quantity for ${esc(p.title)}">
            <button type="button" class="stepper__btn" data-line="${k}" data-delta="-1" data-focus-key="minus-${k}" aria-label="Decrease quantity for ${esc(p.title)}">${icon('minus')}</button>
            <span class="stepper__input" aria-live="polite">${l.qty}</span>
            <button type="button" class="stepper__btn" data-line="${k}" data-delta="1" data-focus-key="plus-${k}" aria-label="Increase quantity for ${esc(p.title)}"${l.qty >= 5 ? ' disabled' : ''}>${icon('plus')}</button></div>
            <button type="button" class="cart-line__remove" data-line="${k}" data-remove data-focus-key="close" aria-label="Remove ${esc(p.title)}">Remove</button></div></div></li>`;
      });
      html += `</ul><div class="cart-drawer__foot">
        <p class="cart-drawer__row cart-drawer__subtotal"><span class="label">Subtotal</span><span>${money(t)} EUR</span></p>
        <p class="cart-drawer__taxes muted">EU duties and VAT included. Shipping calculated at checkout.</p>
        <button class="btn btn--block" type="button" data-checkout>Checkout</button>
        <p class="cart-drawer__trust muted">Secure checkout · 14-day returns · Ships from Tokyo</p></div>`;
    }
    inner.innerHTML = html;
    $$('[data-cart-count]').forEach((el) => {
      const changed = el.textContent !== String(n);
      el.textContent = n;
      el.hidden = n === 0;
      if (changed && n > 0) {
        el.classList.remove('is-bumped');
        void el.offsetWidth;
        el.classList.add('is-bumped');
      }
    });
    $$('[data-cart-label]').forEach((el) => (el.textContent = `Cart (${n})`));
    if (focusKey) (inner.querySelector(`[data-focus-key="${CSS.escape(focusKey)}"]`) || inner.querySelector('[data-dialog-close]'))?.focus({ preventScroll: true });
  }

  function addToCart(handle, colour, size, qty) {
    const existing = cart.find((l) => lineKey(l) === `${handle}|${colour}|${size}`);
    if (existing) existing.qty = Math.min(5, existing.qty + qty);
    else cart.push({ handle, colour, size, qty: Math.min(5, qty) });
    save();
    renderCart();
  }

  document.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-cart-open]');
    if (opener) {
      e.preventDefault();
      return openDialog(drawer(), opener);
    }
    const btn = e.target.closest('[data-line]');
    if (btn) {
      const l = cart.find((x) => lineKey(x) === btn.dataset.line);
      if (!l) return;
      if (btn.hasAttribute('data-remove')) l.qty = 0;
      else l.qty = Math.max(0, Math.min(5, l.qty + Number(btn.dataset.delta)));
      const focus = l.qty === 0 ? 'close' : btn.dataset.focusKey;
      cart = cart.filter((x) => x.qty > 0);
      save();
      return renderCart(focus);
    }
    if (e.target.closest('[data-checkout], [data-express]')) {
      const express = e.target.closest('[data-express]');
      if (express) {
        const form = $('[data-product-form]');
        if (form && !addFromForm(form, false)) return;
      }
      if (drawer().open) closeDialog(drawer());
      setTimeout(() => openDialog(document.getElementById('DemoCheckout')), drawer().open ? 340 : 0);
    }
  });
  window.addEventListener('storage', (e) => {
    if (e.key === KEY) {
      cart = load();
      renderCart();
    }
  });
  renderCart();

  /* ---------- product page ---------- */
  function addFromForm(form, open = true) {
    const pdp = form.closest('[data-product]');
    const data = JSON.parse(pdp.dataset.product);
    const colour = form.querySelector('[name="Colour"]:checked')?.value;
    const size = form.querySelector('[name="Size"]:checked')?.value;
    const err = form.querySelector('[data-form-error]');
    if (!size || (data.soldOut[colour] || []).includes(size)) {
      err.textContent = 'Choose a size that is in stock.';
      err.hidden = false;
      return false;
    }
    err.hidden = true;
    const qty = Math.max(1, Math.min(5, parseInt(form.querySelector('[data-qty-input]').value, 10) || 1));
    addToCart(data.handle, colour, size, qty);
    if (open) openDialog(drawer(), form.querySelector('[data-add-button]'));
    return true;
  }

  function initProduct(pdp) {
    const data = JSON.parse(pdp.dataset.product);
    const p = byHandle(data.handle);
    const form = $('[data-product-form]', pdp);
    const addBtn = $('[data-add-button]', form);
    const express = $('[data-express]', form);

    function update() {
      const colour = form.querySelector('[name="Colour"]:checked').value;
      const sold = data.soldOut[colour] || [];
      $$('[name="Size"]', form).forEach((input) => {
        const out = sold.includes(input.value);
        input.toggleAttribute('data-unavailable', out);
        input.nextElementSibling.querySelector('[data-size-status]').textContent = out ? ' (sold out)' : '';
      });
      let size = form.querySelector('[name="Size"]:checked');
      if (!size || sold.includes(size.value)) {
        const first = $$('[name="Size"]', form).find((i) => !sold.includes(i.value));
        if (first) first.checked = true;
        size = first || size;
      }
      const ok = size && !sold.includes(size.value);
      $('[data-selected="Colour"]', form).textContent = colour;
      $('[data-selected="Size"]', form).textContent = size ? size.value : '—';
      addBtn.disabled = !ok;
      express.disabled = !ok;
      $('[data-add-label]', addBtn).textContent = ok ? 'Add to cart' : 'Sold out';
      const views = [garment(p.garment, 'front', colour, '', `${p.title}, ${colour}, front`), garment(p.garment, 'back', colour, '', `${p.title}, ${colour}, back`)];
      $$('.pdp__slide', pdp).forEach((s, i) => (s.innerHTML = views[i]));
      $$('.pdp__thumb', pdp).forEach((t, i) => (t.innerHTML = garment(p.garment, i ? 'back' : 'front', colour)));
    }
    form.addEventListener('change', (e) => {
      if (e.target.name === 'Colour' || e.target.name === 'Size') update();
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      addFromForm(form);
    });
    form.addEventListener('click', (e) => {
      const step = e.target.closest('[data-qty-step]');
      if (!step) return;
      const input = $('[data-qty-input]', form);
      input.value = Math.max(1, Math.min(5, (parseInt(input.value, 10) || 1) + Number(step.dataset.qtyStep)));
    });

    // gallery
    const track = $('[data-gallery-track]', pdp);
    const thumbs = $$('[data-thumb]', pdp);
    thumbs.forEach((t) => t.addEventListener('click', () => {
      const slide = document.getElementById(t.dataset.thumb);
      track.scrollTo({ left: slide.offsetLeft - track.offsetLeft, behavior: reducedMotion() ? 'auto' : 'smooth' });
    }));
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const i = $$('.pdp__slide', pdp).indexOf(en.target);
      thumbs.forEach((t, j) => t.setAttribute('aria-current', String(i === j)));
      $('[data-gallery-index]', pdp).textContent = String(i + 1).padStart(2, '0');
    }), { root: track, threshold: 0.6 });
    $$('.pdp__slide', pdp).forEach((s) => io.observe(s));

    // size guide link + unit toggle
    $('[data-open-details]', pdp)?.addEventListener('click', () => ($('#SizeGuide').open = true));
    pdp.addEventListener('click', (e) => {
      const u = e.target.closest('[data-unit]');
      if (!u) return;
      $$('[data-unit]', pdp).forEach((b) => b.setAttribute('aria-pressed', String(b === u)));
      $$('.size-table td', pdp).forEach((td) => (td.textContent = td.dataset[u.dataset.unit]));
    });
    update();
  }
  $$('[data-product]').forEach(initProduct);

  /* ---------- shop filters & sort (URL-synced) ---------- */
  function initShop(shop) {
    const form = $('[data-shop-form]', shop);
    const list = $('.product-grid', shop);
    const items = $$('li', list);
    const titles = { '': 'All pieces', tops: 'Tops', outerwear: 'Outerwear', bottoms: 'Bottoms' };

    function readUrl() {
      const q = new URLSearchParams(location.search);
      return { type: q.get('type') || '', sort: q.get('sort') || 'featured', sizes: q.getAll('size'), instock: q.get('instock') === '1', q: (q.get('q') || '').toLowerCase() };
    }
    function writeUrl(s, push) {
      const q = new URLSearchParams();
      if (s.type) q.set('type', s.type);
      if (s.sort !== 'featured') q.set('sort', s.sort);
      s.sizes.forEach((v) => q.append('size', v));
      if (s.instock) q.set('instock', '1');
      if (s.q) q.set('q', s.q);
      const url = location.pathname + (q.toString() ? `?${q}` : '');
      history[push ? 'pushState' : 'replaceState']({}, '', url);
    }
    function apply(s) {
      form.sort.value = s.sort;
      $$('[name="size"]', form).forEach((c) => (c.checked = s.sizes.includes(c.value)));
      form.instock.checked = s.instock;
      $$('[data-type-pill]', shop).forEach((a) => (a.dataset.typePill === s.type ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')));
      let shown = 0;
      items.forEach((li) => {
        const d = li.dataset;
        const ok = (!s.type || d.type === s.type)
          && (!s.instock || d.available === 'true')
          && (!s.sizes.length || s.sizes.some((z) => d.sizes.split(' ').includes(z)))
          && (!s.q || d.title.includes(s.q) || d.type.includes(s.q));
        li.hidden = !ok;
        if (ok) shown++;
      });
      const key = { featured: (li) => +li.dataset.order, newest: (li) => +li.dataset.new, 'price-asc': (li) => +li.dataset.price, 'price-desc': (li) => -li.dataset.price }[s.sort];
      items.slice().sort((a, b) => key(a) - key(b)).forEach((li) => list.appendChild(li));
      $('[data-shop-title]', shop).textContent = s.q ? `Results for “${s.q}”` : titles[s.type] || 'All pieces';
      $('[data-shop-count]', shop).textContent = `${shown} ${shown === 1 ? 'piece' : 'pieces'}`;
      $('[data-shop-empty]', shop).hidden = shown > 0;
      const active = s.sizes.length + (s.instock ? 1 : 0);
      const badge = $('[data-filter-badge]', shop);
      badge.textContent = active;
      badge.hidden = active === 0;
      document.title = `${s.q ? 'Search' : titles[s.type] || 'Shop all'} — Enuma Elish`;
    }
    const state = () => ({ ...readUrl(), sort: form.sort.value, sizes: $$('[name="size"]:checked', form).map((c) => c.value), instock: form.instock.checked });

    form.addEventListener('change', () => {
      const s = state();
      writeUrl(s, false);
      apply(s);
    });
    shop.addEventListener('click', (e) => {
      const pill = e.target.closest('[data-type-pill]');
      if (pill) {
        e.preventDefault();
        const s = { ...state(), type: pill.dataset.typePill, q: '' };
        writeUrl(s, true);
        apply(s);
        return;
      }
      if (e.target.closest('[data-filter-clear]')) {
        const s = { type: '', sort: 'featured', sizes: [], instock: false, q: '' };
        writeUrl(s, true);
        apply(s);
        return;
      }
      const toggle = e.target.closest('[data-facets-toggle]');
      if (toggle) {
        const open = toggle.getAttribute('aria-expanded') !== 'true';
        toggle.setAttribute('aria-expanded', String(open));
        $('[data-facets-panel]', shop).classList.toggle('is-open', open);
      }
    });
    window.addEventListener('popstate', () => apply(readUrl()));
    apply(readUrl());
  }
  $$('[data-shop]').forEach(initShop);

  /* ---------- predictive search ---------- */
  const searchForm = $('[data-search]');
  if (searchForm) {
    const out = $('[data-search-results]');
    const input = searchForm.q;
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-expanded', 'false');
    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      if (!q) {
        out.innerHTML = '';
        input.setAttribute('aria-expanded', 'false');
        return;
      }
      const hits = D.products.filter((p) => p.title.toLowerCase().includes(q) || p.type.toLowerCase().includes(q));
      input.setAttribute('aria-expanded', 'true');
      out.innerHTML = hits.length
        ? `<ul class="search-hits" role="list">${hits.map((p) => `<li><a href="${root}products/${p.handle}.html"><span class="search-hits__img">${garment(p.garment, 'front', p.colours[0])}</span><span>${esc(p.title)}<span class="muted">${esc(p.type)} · ${money(p.price)}</span></span></a></li>`).join('')}</ul>
           <a class="link predictive__all" href="${root}shop.html?q=${encodeURIComponent(q)}">All results for “${esc(q)}”</a>`
        : `<p class="muted">Nothing found for “${esc(q)}”. Try “hoodie” or “outerwear”.</p>`;
    });
    document.getElementById('SearchModal')?.addEventListener('dialog:open', () => setTimeout(() => input.focus(), 50));
  }

  /* ---------- rail: first tap flips on touch, second opens ---------- */
  $$('[data-rail]').forEach((rail) => {
    let pointer = 'mouse';
    rail.addEventListener('pointerdown', (e) => (pointer = e.pointerType));
    rail.addEventListener('click', (e) => {
      const item = e.target.closest('.rail__item');
      if (!item || pointer !== 'touch' || item.classList.contains('is-flipped')) return;
      e.preventDefault();
      $$('.is-flipped', rail).forEach((el) => el.classList.remove('is-flipped'));
      item.classList.add('is-flipped');
      rail.classList.add('has-flipped');
    });
    document.addEventListener('click', (e) => {
      if (!rail.contains(e.target)) $$('.is-flipped', rail).forEach((el) => el.classList.remove('is-flipped'));
    });
  });

  /* ---------- newsletter (demo) ---------- */
  $$('[data-newsletter]').forEach((form) => form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.email;
    const msg = $('[data-newsletter-msg]', form);
    const ok = input.checkValidity() && input.value.includes('.');
    input.setAttribute('aria-invalid', String(!ok));
    msg.className = `form-message ${ok ? 'form-message--success' : 'form-message--error'}`;
    msg.textContent = ok ? "You're on the list. We'll be in touch before the next drop. (Demo: nothing was stored.)" : 'Enter a valid email address.';
    if (ok) form.reset();
  }));
})();
