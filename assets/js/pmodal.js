/* Agentura Marco — rozklik karty do 3D modalu (sdílené: index, ozvučení, hrady, motokáry, hry).
   Spouštěč: prvek s [data-pm]. Obsah bere z data-pm-* atributů, jinak z karty (h3, p, cena, ul, štítek, img).
   Náklon sleduje kurzor v celém okně hned od otevření (ne jen při najetí na kartu), max ±10°,
   jen pro myš a bez reduced-motion; na touchi karta stojí. Zavření ×, Esc, klik vedle. */
(function () {
  'use strict';
  var els = document.querySelectorAll('[data-pm]');
  if (!els.length) return;
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FINE = matchMedia('(hover:hover) and (pointer:fine)').matches;

  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function bigSrc(img) {
    var ss = img.getAttribute('srcset');
    if (ss) { var parts = ss.split(',').map(function (p) { return p.trim().split(/\s+/); }); parts.sort(function (a, b) { return parseInt(b[1]) - parseInt(a[1]); }); return parts[0][0]; }
    return img.getAttribute('src');
  }
  function data(el) {
    var d = el.dataset, q = function (s) { return el.querySelector(s); };
    var gal = d.gal ? d.gal.split(',') : [].map.call(el.querySelectorAll('img'), bigSrc).filter(function (u) { return u && !/\.svg$/.test(u); });
    var p = null; [].some.call(el.querySelectorAll('p'), function (x) { if (!x.closest('ul')) { p = x; return true; } });
    var priceEl = q('.pprice,.fprice,.dn-price,.mprice');
    var list = d.pmList ? d.pmList.split('|').map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') : (q('ul') ? q('ul').innerHTML : '');
    if (!list) { var ex = el.closest('[data-pm-extra]'); if (ex) list = ex.getAttribute('data-pm-extra').split('|').map(function (x) { return '<li>' + esc(x) + '</li>'; }).join(''); }
    var badgeEl = q('.pbadge,.btag,.ftag');
    return {
      title: d.pmTitle || (q('h3') ? q('h3').textContent : (d.kkName || '')),
      desc: d.pmDesc || (p ? p.textContent : ''),
      price: d.pmPrice || (priceEl ? priceEl.innerHTML : ''),
      list: list, badge: d.pmBadge || (badgeEl ? badgeEl.textContent : ''), gal: gal,
      id: d.kkItem || '', name: d.kkName || '', img: d.kkImg || gal[0] || ''
    };
  }

  var pm = document.createElement('div');
  pm.className = 'pm'; pm.hidden = true;
  pm.setAttribute('role', 'dialog'); pm.setAttribute('aria-modal', 'true'); pm.setAttribute('aria-labelledby', 'pmTitle'); pm.setAttribute('data-lenis-prevent', '');
  pm.innerHTML = '<div class="pm-back"></div><div class="pm-stage"><article class="pm-card"><span class="pm-glare" aria-hidden="true"></span>'
    + '<button class="pm-x" type="button" aria-label="Zavřít">×</button>'
    + '<div class="pm-gal"><div class="pm-track"></div><button class="pm-nav pm-prev" type="button" aria-label="Předchozí fotka">‹</button><button class="pm-nav pm-next" type="button" aria-label="Další fotka">›</button><div class="pm-dots"></div></div>'
    + '<div class="pm-info"><span class="pm-badge" hidden></span><h3 id="pmTitle"></h3><p class="pm-desc"></p><div class="pm-price"></div><ul></ul><button class="pm-cta" type="button">Nezávazná poptávka</button></div>'
    + '</article></div>';
  document.body.appendChild(pm);
  var card = pm.querySelector('.pm-card'), track = pm.querySelector('.pm-track'), dots = pm.querySelector('.pm-dots'), glare = pm.querySelector('.pm-glare');
  var idx = 0, n = 0, cur = null, last = null;

  function go(i) {
    if (!n) return; idx = (i + n) % n;
    track.style.transform = 'translateX(' + (-idx * 100) + '%)';
    [].forEach.call(dots.children, function (b, j) { b.classList.toggle('on', j === idx); b.setAttribute('aria-current', j === idx ? 'true' : 'false'); });
  }
  function open(el) {
    cur = data(el); last = document.activeElement;
    n = cur.gal.length; idx = 0;
    track.innerHTML = cur.gal.map(function (u, i) { return '<img src="' + esc(u) + '" alt="' + esc(cur.title) + ' – fotka ' + (i + 1) + '" loading="' + (i ? 'lazy' : 'eager') + '" decoding="async" draggable="false">'; }).join('');
    dots.innerHTML = n > 1 ? cur.gal.map(function (u, i) { return '<button type="button" aria-label="Fotka ' + (i + 1) + '"></button>'; }).join('') : '';
    pm.querySelector('.pm-prev').hidden = pm.querySelector('.pm-next').hidden = n < 2;
    var bd = pm.querySelector('.pm-badge'); bd.hidden = !cur.badge; bd.textContent = cur.badge;
    pm.querySelector('#pmTitle').textContent = cur.title;
    var ds = pm.querySelector('.pm-desc'); ds.textContent = cur.desc; ds.hidden = !cur.desc;
    var pr = pm.querySelector('.pm-price'); pr.innerHTML = cur.price; pr.hidden = !cur.price;
    var ul = pm.querySelector('.pm-info ul'); ul.innerHTML = cur.list; ul.hidden = !cur.list;
    go(0); pm.hidden = false; document.body.style.overflow = 'hidden';
    requestAnimationFrame(function () { requestAnimationFrame(function () { pm.classList.add('show'); }); });
    pm.querySelector('.pm-x').focus();
  }
  function close() {
    if (pm.hidden) return;
    pm.classList.remove('show'); stopTilt(); document.body.style.overflow = '';
    setTimeout(function () { pm.hidden = true; }, RM ? 0 : 260);
    if (last && last.focus) last.focus();
  }
  [].forEach.call(els, function (el) {
    if (!/^(BUTTON|A)$/.test(el.tagName)) { el.setAttribute('tabindex', el.getAttribute('tabindex') || '0'); el.setAttribute('role', 'button'); }
    el.setAttribute('aria-haspopup', 'dialog');
    el.addEventListener('click', function (e) { var t = e.target.closest('button,a'); if (t && t !== el) return; e.preventDefault(); open(el); });
    el.addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && e.target === el) { e.preventDefault(); open(el); } });
  });
  pm.querySelector('.pm-back').addEventListener('click', close);
  pm.querySelector('.pm-x').addEventListener('click', close);
  pm.querySelector('.pm-prev').addEventListener('click', function () { go(idx - 1); });
  pm.querySelector('.pm-next').addEventListener('click', function () { go(idx + 1); });
  dots.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) go([].indexOf.call(dots.children, b)); });
  document.addEventListener('keydown', function (e) {
    if (pm.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') go(idx - 1);
    else if (e.key === 'ArrowRight') go(idx + 1);
    else if (e.key === 'Tab') {
      var f = [].filter.call(pm.querySelectorAll('button'), function (b) { return !b.hidden && b.offsetParent; });
      if (!f.length) return; var a = f[0], z = f[f.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    }
  });
  /* swipe v galerii */
  var gal = pm.querySelector('.pm-gal'), sx = null, sy = 0;
  gal.addEventListener('pointerdown', function (e) { if (e.pointerType === 'mouse') return; sx = e.clientX; sy = e.clientY; });
  gal.addEventListener('pointerup', function (e) { if (sx === null) return; var dx = e.clientX - sx, dy = e.clientY - sy; sx = null; if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) go(idx + (dx < 0 ? 1 : -1)); });
  gal.addEventListener('pointercancel', function () { sx = null; });
  /* CTA: přidá položku do košíku poptávky a otevře poptávkový formulář */
  pm.querySelector('.pm-cta').addEventListener('click', function () {
    var c = cur; close();
    if (c && c.id && window.AMCart) {
      var has = window.AMCart.items().some(function (i) { return i.id === c.id; });
      if (!has) window.AMCart.add(c.id, { name: c.name || c.title, img: c.img });
    }
    setTimeout(function () { if (window.AMPoptavka) window.AMPoptavka.open(); else location.href = 'index.html#kontakt'; }, RM ? 0 : 280);
  });

  /* 3D náklon: sleduje kurzor v celém okně, plynulý lerp v rAF, malá jemná záře */
  var tx = 0, ty = 0, rx = 0, ry = 0, gx = 0, gy = 0, raf = 0, on = false;
  function loop() {
    rx += (tx - rx) * 0.14; ry += (ty - ry) * 0.14;
    card.style.transform = 'rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg) scale(1)';
    glare.style.transform = 'translate(' + gx.toFixed(0) + 'px,' + gy.toFixed(0) + 'px)';
    raf = (on || Math.abs(tx - rx) > 0.05 || Math.abs(ty - ry) > 0.05) ? requestAnimationFrame(loop) : 0;
  }
  function move(e) {
    if (pm.hidden || e.pointerType !== 'mouse') return;
    var r = card.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    var nx = Math.max(-1, Math.min(1, (e.clientX - cx) / (innerWidth / 2)));
    var ny = Math.max(-1, Math.min(1, (e.clientY - cy) / (innerHeight / 2)));
    ty = nx * 10; tx = -ny * 10;
    gx = e.clientX - r.left; gy = e.clientY - r.top;
    if (!on) { on = true; card.classList.add('tilting'); }
    if (!raf) raf = requestAnimationFrame(loop);
  }
  function stopTilt() {
    on = false; tx = ty = rx = ry = 0; card.classList.remove('tilting');
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
    card.style.transform = ''; glare.style.transform = '';
  }
  if (FINE && !RM) window.addEventListener('pointermove', move, { passive: true });
  window.AMPM = { open: open, close: close };
})();
