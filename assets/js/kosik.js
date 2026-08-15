/* Agentura Marco — kosik poptavky.
   Zakaznik si sklada sluzby do kosiku, misto platby odchazi poptavka.
   Vystavuje window.AMCart pro poptavkovy modal (poptavka.js). */
(function () {
  'use strict';

  var KEY = 'am_kosik_v1';

  /* ---------- katalog ---------- */
  var CATALOG = {
    'megahrady.html':           { id: 'hrady',      name: 'Skákací hrady',        img: 'assets/icons/hrad.webp' },
    'ozvuceni.html':            { id: 'ozvuceni',   name: 'Ozvučení a DJ',        img: 'assets/icons/dj.webp' },
    'penova-party.html':        { id: 'pena',       name: 'Pěnová párty',         img: 'assets/icons/pena.webp' },
    'malovani-na-oblicej.html': { id: 'malovani',   name: 'Malování na obličej',  img: 'assets/icons/malovani.webp' },
    'maskoti.html':             { id: 'maskoti',    name: 'Maskoti',              img: 'assets/icons/pooh.webp' },
    'fotokoutek.html':          { id: 'fotokoutek', name: 'Fotokoutek',           img: 'assets/icons/fotokoutek.webp' },
    'avengers.html':            { id: 'hrdinove',   name: 'Superhrdinové',        img: 'assets/icons/hulk.webp' },
    'balicek-start.html':       { id: 'b-start',    name: 'Balíček START',        img: '', badge: 'S' },
    'balicek-plus.html':        { id: 'b-plus',     name: 'Balíček PLUS',         img: '', badge: 'P' },
    'balicek-max.html':         { id: 'b-max',      name: 'Balíček MAX',          img: '', badge: 'M' }
  };

  function byId(id) {
    for (var k in CATALOG) if (CATALOG[k].id === id) return CATALOG[k];
    return null;
  }

  /* ---------- uloziste ---------- */
  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch (e) { return []; }
  }
  function save(list) {
    try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {}
    fire();
  }

  var subs = [];
  function fire() {
    var items = getItems();
    subs.forEach(function (fn) { try { fn(items); } catch (e) {} });
    paint();
  }

  function getItems() {
    return load().map(function (id) {
      var c = byId(id);
      return c ? { id: id, name: c.name, img: c.img || '', badge: c.badge || '' } : null;
    }).filter(Boolean);
  }

  function add(id) {
    var l = load();
    if (l.indexOf(id) === -1) { l.push(id); save(l); return true; }
    return false;
  }
  function remove(id) {
    var l = load().filter(function (x) { return x !== id; });
    save(l);
  }
  function clear() { save([]); }

  /* ---------- styly ---------- */
  var css = ''
    + '.kk-fab{position:fixed;right:22px;bottom:22px;z-index:10800;display:none;align-items:center;gap:10px;'
    + 'padding:14px 20px 14px 16px;border:0;border-radius:999px;cursor:pointer;font-family:"Baloo 2",system-ui,sans-serif;'
    + 'font-weight:900;font-size:1rem;color:#fff;background:linear-gradient(140deg,#6B4FA0,#4A2E86);'
    + 'box-shadow:0 12px 30px rgba(74,46,134,.45),0 0 0 1px rgba(255,255,255,.14) inset;'
    + 'transition:transform .22s cubic-bezier(.34,1.4,.5,1),box-shadow .22s}'
    + '.kk-fab.on{display:flex}'
    + '.kk-fab:hover{transform:translateY(-4px) scale(1.04);box-shadow:0 18px 40px rgba(74,46,134,.55),0 0 26px rgba(155,106,255,.5)}'
    + '.kk-fab .n{min-width:26px;height:26px;display:grid;place-items:center;border-radius:50%;background:#FFD23F;color:#231A05;font-size:.9rem}'
    + '.kk-fab.pop{animation:kkPop .45s cubic-bezier(.34,1.5,.5,1)}'
    + '@keyframes kkPop{0%{transform:scale(1)}45%{transform:scale(1.16)}100%{transform:scale(1)}}'

    + '.kk-scrim{position:fixed;inset:0;z-index:10850;background:rgba(24,12,48,.5);backdrop-filter:blur(6px);'
    + '-webkit-backdrop-filter:blur(6px);opacity:0;pointer-events:none;transition:opacity .3s}'
    + '.kk-scrim.on{opacity:1;pointer-events:auto}'

    + '.kk-panel{position:fixed;top:0;right:0;bottom:0;z-index:10900;width:min(390px,92vw);display:flex;flex-direction:column;'
    + 'background:linear-gradient(170deg,#3B2470 0%,#2E1B57 55%,#211340 100%);color:#fff;'
    + 'border-left:2px solid rgba(178,132,255,.45);box-shadow:-24px 0 60px rgba(12,10,32,.5);'
    + 'transform:translateX(102%);transition:transform .42s cubic-bezier(.3,1.05,.35,1);'
    + 'padding-bottom:env(safe-area-inset-bottom)}'
    + '.kk-panel.on{transform:none}'
    + '.kk-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:24px 22px 14px}'
    + '.kk-head h3{margin:0;font-family:"Baloo 2",system-ui,sans-serif;font-weight:900;font-size:1.35rem;line-height:1.15}'
    + '.kk-head p{margin:4px 0 0;font-size:.86rem;color:#D6C8F2;font-weight:600}'
    + '.kk-x{width:42px;height:42px;flex:0 0 auto;border:0;border-radius:50%;cursor:pointer;background:rgba(255,255,255,.12);color:#fff;font-size:1.5rem;line-height:1}'
    + '.kk-x:hover{background:rgba(255,255,255,.2)}'
    + '.kk-x:focus-visible{outline:3px solid #C9A6FF;outline-offset:2px}'

    + '.kk-list{flex:1;overflow-y:auto;padding:8px 18px 4px;scrollbar-width:thin;scrollbar-color:rgba(178,132,255,.6) transparent}'
    + '.kk-list::-webkit-scrollbar{width:8px}'
    + '.kk-list::-webkit-scrollbar-thumb{background:rgba(178,132,255,.55);border-radius:8px}'
    + '.kk-it{display:flex;align-items:center;gap:14px;padding:12px;margin-bottom:10px;border-radius:18px;'
    + 'background:rgba(255,255,255,.07);border:1.5px solid rgba(178,132,255,.28);'
    + 'animation:kkIn .34s cubic-bezier(.34,1.3,.5,1)}'
    + '@keyframes kkIn{from{opacity:0;transform:translateX(18px)}to{opacity:1;transform:none}}'
    + '.kk-it.out{animation:kkOut .26s ease forwards}'
    + '@keyframes kkOut{to{opacity:0;transform:translateX(26px);height:0;margin:0;padding:0;border-width:0}}'
    + '.kk-th{width:58px;height:58px;flex:0 0 auto;border-radius:14px;background:rgba(255,255,255,.12);'
    + 'display:grid;place-items:center;overflow:hidden}'
    + '.kk-th img{width:100%;height:100%;object-fit:contain}'
    + '.kk-th span{font-family:"Baloo 2",system-ui,sans-serif;font-weight:900;font-size:1.4rem;color:#FFD23F}'
    + '.kk-nm{flex:1;min-width:0;font-weight:800;font-size:1rem;line-height:1.25}'
    + '.kk-rm{width:34px;height:34px;flex:0 0 auto;border:0;border-radius:50%;cursor:pointer;'
    + 'background:rgba(255,255,255,.12);color:#fff;font-size:1.15rem;line-height:1;transition:background .16s,transform .16s}'
    + '.kk-rm:hover{background:#DA3B4B;transform:rotate(90deg)}'
    + '.kk-rm:focus-visible{outline:3px solid #C9A6FF;outline-offset:2px}'
    + '.kk-empty{padding:40px 22px;text-align:center;color:#D6C8F2;font-weight:600;line-height:1.6}'

    + '.kk-foot{padding:16px 18px 20px;border-top:1.5px solid rgba(178,132,255,.28)}'
    + '.kk-go{width:100%;min-height:54px;border:0;border-radius:16px;cursor:pointer;'
    + 'font-family:"Baloo 2",system-ui,sans-serif;font-weight:900;font-size:1.06rem;color:#231A05;'
    + 'background-image:linear-gradient(180deg,#FFD24A 0%,#F0AE1A 55%,#D9930A 100%);'
    + 'filter:drop-shadow(0 10px 18px rgba(232,163,16,.36));transition:transform .18s,filter .18s}'
    + '.kk-go:hover{transform:translateY(-2px);filter:drop-shadow(0 14px 26px rgba(255,198,26,.55))}'
    + '.kk-go[disabled]{opacity:.45;cursor:not-allowed;transform:none}'
    + '.kk-clr{display:block;width:100%;margin-top:10px;background:none;border:0;cursor:pointer;color:#D6C8F2;font:inherit;font-size:.86rem;font-weight:700}'
    + '.kk-clr:hover{color:#fff;text-decoration:underline}'

    /* tlacitko pridani */
    + '.kk-add{display:inline-flex;align-items:center;justify-content:center;gap:9px;min-height:52px;padding:0 26px;'
    + 'border:0;border-radius:16px;cursor:pointer;font-family:"Baloo 2",system-ui,sans-serif;font-weight:900;font-size:1.02rem;'
    + 'color:#fff;background:linear-gradient(140deg,#6B4FA0,#4A2E86);'
    + 'box-shadow:0 10px 22px rgba(74,46,134,.38);transition:transform .18s,box-shadow .18s}'
    + '.kk-add:hover{transform:translateY(-3px);box-shadow:0 16px 32px rgba(74,46,134,.5),0 0 22px rgba(155,106,255,.45)}'
    + '.kk-add.in{background:linear-gradient(140deg,#3E8E63,#2C6B49)}'
    /* mala plus znacka na dlazdicich v indexu */
    + '.kk-mini{position:absolute;top:10px;right:10px;z-index:6;width:38px;height:38px;border:0;border-radius:50%;cursor:pointer;'
    + 'background:rgba(107,79,160,.94);color:#fff;font-size:1.3rem;line-height:1;font-weight:700;'
    + 'box-shadow:0 6px 14px rgba(43,30,82,.3);transition:transform .18s,background .18s;opacity:0}'
    + '.tile:hover .kk-mini,.best:hover .kk-mini,.kk-mini:focus-visible{opacity:1}'
    + '.kk-mini:hover{transform:scale(1.14);background:#4A2E86}'
    + '.kk-mini.in{background:#3E8E63;opacity:1}'
    + '.kk-inline{margin:0 0 20px}'
    + '.kk-inline h5{margin:0 0 10px;font-family:"Baloo 2",system-ui,sans-serif;font-weight:800;font-size:1rem;color:#fff}'
    + '.kk-inline .none{color:#C3D0E8;font-weight:600;font-size:.9rem;line-height:1.5;margin:0}'
    + '.kk-inline .kk-it{margin-bottom:8px;padding:9px 10px;border-radius:14px}'
    + '.kk-inline .kk-th{width:46px;height:46px;border-radius:11px}'
    + '.kk-inline .kk-nm{font-size:.95rem}'
    + '@media (max-width:760px){.kk-mini{opacity:1}.kk-fab{right:14px;bottom:14px}}'
    + '@media (prefers-reduced-motion:reduce){.kk-fab,.kk-panel,.kk-it,.kk-add,.kk-mini,.kk-go{transition:none;animation:none}}';

  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  /* ---------- prvky ---------- */
  var fab, scrim, panel, listEl, goBtn;

  function build() {
    fab = document.createElement('button');
    fab.type = 'button';
    fab.className = 'kk-fab';
    fab.setAttribute('aria-label', 'Otevřít košík poptávky');
    fab.innerHTML = '<span class="n">0</span><span>Poptávka</span>';
    fab.addEventListener('click', openPanel);

    scrim = document.createElement('div');
    scrim.className = 'kk-scrim';
    scrim.addEventListener('click', closePanel);

    panel = document.createElement('aside');
    panel.className = 'kk-panel';
    panel.setAttribute('aria-label', 'Košík poptávky');
    panel.innerHTML =
      '<div class="kk-head"><div>'
      + '<h3>Vaše poptávka</h3>'
      + '<p>Vyberte služby, cenu doladíme podle akce.</p>'
      + '</div><button class="kk-x" type="button" aria-label="Zavřít košík">&times;</button></div>'
      + '<div class="kk-list"></div>'
      + '<div class="kk-foot">'
      + '<button class="kk-go" type="button">Odeslat poptávku</button>'
      + '<button class="kk-clr" type="button">Vysypat košík</button>'
      + '</div>';

    document.body.appendChild(fab);
    document.body.appendChild(scrim);
    document.body.appendChild(panel);

    listEl = panel.querySelector('.kk-list');
    goBtn = panel.querySelector('.kk-go');

    panel.querySelector('.kk-x').addEventListener('click', closePanel);
    panel.querySelector('.kk-clr').addEventListener('click', function () { clear(); });
    goBtn.addEventListener('click', function () {
      closePanel();
      var opener = document.querySelector('a[href*="#kontakt"]');
      if (window.AMPoptavka && window.AMPoptavka.open) window.AMPoptavka.open();
      else if (opener) opener.click();
    });

    listEl.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('.kk-rm') : null;
      if (!b) return;
      var row = b.closest('.kk-it');
      var id = b.getAttribute('data-id');
      if (row) { row.classList.add('out'); setTimeout(function () { remove(id); }, 240); }
      else remove(id);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel.classList.contains('on')) closePanel();
    });
  }

  function openPanel() {
    scrim.classList.add('on');
    panel.classList.add('on');
    document.body.style.overflow = 'hidden';
    var x = panel.querySelector('.kk-x');
    if (x) x.focus();
  }
  function closePanel() {
    scrim.classList.remove('on');
    panel.classList.remove('on');
    document.body.style.overflow = '';
  }

  /* ---------- vykresleni ---------- */
  function thumb(it) {
    return it.img
      ? '<span class="kk-th"><img src="' + it.img + '" alt="" loading="lazy"></span>'
      : '<span class="kk-th"><span>' + (it.badge || '?') + '</span></span>';
  }

  function paint() {
    var items = getItems();
    if (!fab) return;
    fab.querySelector('.n').textContent = items.length;
    fab.classList.toggle('on', items.length > 0);

    if (!items.length) {
      listEl.innerHTML = '<div class="kk-empty">Košík je zatím prázdný.<br>Přidejte službu tlačítkem <strong>Přidat do poptávky</strong>.</div>';
      goBtn.disabled = true;
    } else {
      listEl.innerHTML = items.map(function (it) {
        return '<div class="kk-it">' + thumb(it)
          + '<span class="kk-nm">' + it.name + '</span>'
          + '<button class="kk-rm" type="button" data-id="' + it.id + '" aria-label="Odebrat ' + it.name + '">&times;</button>'
          + '</div>';
      }).join('');
      goBtn.disabled = false;
    }
    syncButtons();
    paintInline();
  }

  function syncButtons() {
    var ids = load();
    document.querySelectorAll('[data-kk-add]').forEach(function (b) {
      var inCart = ids.indexOf(b.getAttribute('data-kk-add')) !== -1;
      b.classList.toggle('in', inCart);
      if (b.classList.contains('kk-add')) b.textContent = inCart ? '✓ V poptávce' : '＋ Přidat do poptávky';
      else b.setAttribute('aria-label', inCart ? 'Odebrat z poptávky' : 'Přidat do poptávky');
    });
  }

  function bump() {
    if (!fab) return;
    fab.classList.remove('pop');
    void fab.offsetWidth;
    fab.classList.add('pop');
  }

  /* ---------- napojeni tlacitek ---------- */
  function currentPage() {
    var f = location.pathname.split('/').pop() || 'index.html';
    return CATALOG[f] ? f : null;
  }

  function injectMain() {
    var page = currentPage();
    if (!page) return;
    var cta = document.querySelector('a.btn[href*="#kontakt"]');
    if (!cta || !cta.parentNode) return;
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'kk-add';
    b.setAttribute('data-kk-add', CATALOG[page].id);
    b.textContent = '＋ Přidat do poptávky';
    b.addEventListener('click', function () {
      var id = CATALOG[page].id;
      if (load().indexOf(id) !== -1) { remove(id); return; }
      add(id); bump(); openPanel();
    });
    cta.parentNode.insertBefore(b, cta);
  }

  function injectMini() {
    document.querySelectorAll('a.tile[href], a.best[href]').forEach(function (a) {
      var f = (a.getAttribute('href') || '').split('/').pop();
      var c = CATALOG[f];
      if (!c) return;
      if (getComputedStyle(a).position === 'static') a.style.position = 'relative';
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'kk-mini';
      b.setAttribute('data-kk-add', c.id);
      b.textContent = '＋';
      b.addEventListener('click', function (e) {
        e.preventDefault(); e.stopPropagation();
        if (load().indexOf(c.id) !== -1) { remove(c.id); return; }
        add(c.id); bump();
      });
      a.appendChild(b);
    });
  }

  /* ---------- verejne API ---------- */
  window.AMCart = {
    items: getItems,
    add: add,
    remove: remove,
    clear: clear,
    open: openPanel,
    close: closePanel,
    subscribe: function (fn) { subs.push(fn); }
  };

  /* ---------- kontaktni sekce v indexu ---------- */
  var MAIL = 'agenturamarco@seznam.cz';
  var inlineBox = null;

  function enhanceInline() {
    var wrap = document.querySelector('.contact-right');
    if (!wrap) return;
    var afterEl = wrap.querySelector('p');
    inlineBox = document.createElement('div');
    inlineBox.className = 'kk-inline';
    if (afterEl && afterEl.parentNode) afterEl.parentNode.insertBefore(inlineBox, afterEl.nextSibling);
    else wrap.insertBefore(inlineBox, wrap.firstChild);

    var btn = wrap.querySelector('.btn');
    if (btn) {
      btn.removeAttribute('onclick');
      btn.addEventListener('click', function () {
        var ins = wrap.querySelectorAll('.field input, .field textarea');
        var val = function (i) { return ins[i] ? ins[i].value.trim() : ''; };
        var picked = getItems().map(function (x) { return x.name; });
        var body = 'Sluzby z kosiku: ' + (picked.length ? picked.join(', ') : '(nevybrano)') + '\n'
          + 'Jmeno: ' + val(0) + '\n'
          + 'Kontakt: ' + val(1) + '\n\n'
          + val(2);
        window.location.href = 'mailto:' + MAIL
          + '?subject=' + encodeURIComponent('Poptávka — ' + (picked.length ? picked.join(' + ') : 'web'))
          + '&body=' + encodeURIComponent(body);
      });
    }

    inlineBox.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('.kk-rm') : null;
      if (b) remove(b.getAttribute('data-id'));
    });
  }

  function paintInline() {
    if (!inlineBox) return;
    var items = getItems();
    if (!items.length) {
      inlineBox.innerHTML = '<p class="none">Zatím jste nic nevybrali — napište nám rovnou do zprávy, o co máte zájem.</p>';
      return;
    }
    inlineBox.innerHTML = '<h5>Vybrané služby</h5>' + items.map(function (it) {
      return '<div class="kk-it">' + thumb(it)
        + '<span class="kk-nm">' + it.name + '</span>'
        + '<button class="kk-rm" type="button" data-id="' + it.id + '" aria-label="Odebrat ' + it.name + '">&times;</button>'
        + '</div>';
    }).join('');
  }

  document.addEventListener('DOMContentLoaded', function () {
    build();
    injectMain();
    injectMini();
    enhanceInline();
    paint();
  });

  window.addEventListener('storage', function (e) { if (e.key === KEY) paint(); });
})();
