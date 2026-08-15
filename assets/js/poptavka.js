/* Agentura Marco — poptavkovy modal s balonkovym odhalenim.
   Zachyti kliknuti na odkazy mirici na index.html#kontakt a misto presmerovani
   otevre formular primo na dane podstrance. */
(function () {
  'use strict';

  var MAIL = 'agenturamarco@seznam.cz';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- styly ---------- */
  var css = ''
    + '@property --pqAng{syntax:"<angle>";initial-value:0deg;inherits:false}'
    + '.pq-veil{position:fixed;inset:0;z-index:11000;display:none;align-items:center;justify-content:center;padding:20px}'
    + '.pq-veil.on{display:flex}'
    + '.pq-veil::before{content:"";position:absolute;inset:0;background:rgba(28,14,54,.6);backdrop-filter:blur(14px) saturate(120%);-webkit-backdrop-filter:blur(14px) saturate(120%);opacity:0;transition:opacity .35s}'
    + '.pq-veil.show::before{opacity:1}'
    /* karta v tmavem tonu kontaktni sekce z indexu */
    + '.pq-shell{position:relative;z-index:2;isolation:isolate;width:min(560px,100%);overflow:visible;'
    + 'background:linear-gradient(170deg,#3B2470 0%,#33205F 52%,#241546 100%);'
    + 'border:3px solid rgba(178,132,255,.6);border-radius:26px;color:#fff;'
    + 'box-shadow:0 26px 60px rgba(12,10,32,.5);'
    + 'transform:translateY(26px) scale(.94);opacity:0;'
    + 'transition:transform .42s cubic-bezier(.2,1.2,.3,1),opacity .32s,box-shadow .32s,border-color .32s}'
    + '.pq-veil.show .pq-shell{transform:none;opacity:1}'
    + '.pq-veil.show .pq-shell:hover{transform:scale(1.025);border-color:rgba(198,160,255,.9);'
    + 'box-shadow:0 30px 70px rgba(12,10,32,.55),0 0 30px rgba(155,106,255,.55),0 0 70px rgba(124,77,255,.4)}'
    + '.pq-card{position:relative;max-height:84vh;overflow-y:auto;overflow-x:hidden;padding:40px 34px 32px;border-radius:23px;'
    + 'scrollbar-width:thin;scrollbar-color:rgba(178,132,255,.6) transparent}'
    + '.pq-card::-webkit-scrollbar{width:8px}'
    + '.pq-card::-webkit-scrollbar-thumb{background:rgba(178,132,255,.55);border-radius:8px}'
    /* obihajici trpytiva kontura — stejny princip jako u balicku START/PLUS/MAX */
    + '.pq-shell::after{content:"";position:absolute;inset:-4px;z-index:-1;border-radius:30px;padding:4px;pointer-events:none;'
    + 'background:conic-gradient(from var(--pqAng),transparent 0 58%,#C9A6FF 70%,#FFFFFF 78%,#8B5CD6 86%,transparent 96% 100%);'
    + 'filter:drop-shadow(0 0 6px rgba(155,106,255,.7));transition:filter .32s;'
    + 'animation:pqSpin 3.4s linear infinite;'
    + '-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;'
    + 'mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);mask-composite:exclude}'
    + '.pq-shell:hover::after{animation-duration:1.6s;filter:drop-shadow(0 0 14px rgba(178,132,255,.95)) drop-shadow(0 0 26px rgba(124,77,255,.6))}'
    + '@keyframes pqSpin{to{--pqAng:360deg}}'
    + '.pq-card h4{font-family:"Baloo 2",system-ui,sans-serif;font-weight:800;font-size:1.5rem;margin:0 0 8px;color:#fff;text-shadow:0 0 16px rgba(255,255,255,.32),0 2px 6px rgba(0,0,0,.4)}'
    + '.pq-card p.pq-sub{color:#D6C8F2;font-weight:600;font-size:.98rem;margin:0 0 24px}'
    /* pole prevzata 1:1 z .field v indexu */
    + '.pq-card .field{margin-bottom:14px}'
    + '.pq-card .field input,.pq-card .field textarea{width:100%;background:rgba(255,255,255,.1);border:1.5px solid rgba(255,255,255,.28);border-radius:14px;padding:14px 16px;font-family:"Nunito",system-ui,sans-serif;font-size:16px;font-weight:600;color:#fff;min-height:44px;transition:box-shadow .15s,border-color .15s,background .15s}'
    + '.pq-card .field input::placeholder,.pq-card .field textarea::placeholder{color:rgba(224,232,248,.72)}'
    + '.pq-card .field input:hover,.pq-card .field textarea:hover{background:rgba(255,255,255,.14);border-color:rgba(178,132,255,.55)}'
    + '.pq-card .field input:focus,.pq-card .field textarea:focus{outline:2px solid #C9A6FF;outline-offset:1px;border-color:rgba(201,166,255,.85);background:rgba(255,255,255,.16);box-shadow:0 0 18px rgba(155,106,255,.45)}'
    + '.pq-card .field textarea{resize:vertical;min-height:120px}'
    + '.pq-send{width:100%;display:flex;align-items:center;justify-content:center;gap:8px;min-height:52px;margin-top:6px;cursor:pointer;border:0;border-radius:16px;'
    + 'font-family:"Baloo 2",system-ui,sans-serif;font-weight:800;font-size:1.05rem;color:#231A05;'
    + 'background-color:#EFAE1C;background-image:linear-gradient(180deg,#FFD24A 0%,#F0AE1A 55%,#D9930A 100%);'
    + 'filter:saturate(1.2) brightness(1.08) drop-shadow(0 10px 18px rgba(232,163,16,.36));'
    + 'animation:pqLevitate 3.6s ease-in-out infinite;will-change:transform}'
    + '@keyframes pqLevitate{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}'
    + '.pq-send:hover{animation:none;filter:saturate(1.2) brightness(1.12) drop-shadow(0 14px 26px rgba(255,198,26,.55))}'
    + '.pq-cart{margin:0 0 20px}'
    + '.pq-cart h5{margin:0 0 10px;font-family:"Baloo 2",system-ui,sans-serif;font-weight:800;font-size:1rem;color:#fff}'
    + '.pq-ci{display:flex;align-items:center;gap:12px;padding:9px 10px;margin-bottom:8px;border-radius:14px;'
    + 'background:rgba(255,255,255,.08);border:1.5px solid rgba(178,132,255,.3)}'
    + '.pq-ci .th{width:46px;height:46px;flex:0 0 auto;border-radius:11px;background:rgba(255,255,255,.12);display:grid;place-items:center;overflow:hidden}'
    + '.pq-ci .th img{width:100%;height:100%;object-fit:contain}'
    + '.pq-ci .th span{font-family:"Baloo 2",system-ui,sans-serif;font-weight:900;color:#FFD23F}'
    + '.pq-ci .nm{flex:1;min-width:0;font-weight:800;font-size:.95rem}'
    + '.pq-ci button{width:32px;height:32px;flex:0 0 auto;border:0;border-radius:50%;cursor:pointer;'
    + 'background:rgba(255,255,255,.12);color:#fff;font-size:1.1rem;line-height:1;transition:background .16s,transform .16s}'
    + '.pq-ci button:hover{background:#DA3B4B;transform:rotate(90deg)}'
    + '.pq-ci button:focus-visible{outline:3px solid #C9A6FF;outline-offset:2px}'
    + '.pq-cart .none{color:#D6C8F2;font-weight:600;font-size:.9rem;line-height:1.5}'
    + '.pq-alt{margin:14px 0 0;text-align:center;font-size:.9rem;color:#D6C8F2;font-weight:600}'
    + '.pq-alt a{color:#C9A6FF}'
    + '.pq-x{position:absolute;z-index:5;top:12px;right:14px;width:42px;height:42px;border:0;border-radius:50%;cursor:pointer;'
    + 'background:rgba(255,255,255,.12);color:#fff;font-size:1.5rem;line-height:1;font-weight:700}'
    + '.pq-x:hover{background:rgba(255,255,255,.2)}'
    + '.pq-x:focus-visible{outline:3px solid #C9A6FF;outline-offset:2px}'
    /* balonky */
    + '.pq-balls{position:fixed;inset:0;z-index:11500;pointer-events:none;overflow:hidden;display:none}'
    + '.pq-balls.on{display:block}'
    + '.pq-ball{position:absolute;left:var(--x);bottom:-30vh;width:var(--s);height:calc(var(--s) * 1.18);'
    + 'animation:pqUp var(--d) cubic-bezier(.42,.05,.28,1) var(--dl) forwards;will-change:transform}'
    + '.pq-ball .bd{width:100%;height:100%;border-radius:50% 50% 48% 52% / 56% 56% 44% 44%;position:relative;'
    + 'background:radial-gradient(circle at 32% 26%,rgba(255,255,255,.9) 0%,rgba(255,255,255,.28) 18%,var(--c) 46%,var(--cd) 100%);'
    + 'box-shadow:inset -8px -14px 22px rgba(0,0,0,.14);animation:pqSway var(--sw) ease-in-out infinite alternate}'
    + '.pq-ball .bd::before{content:"";position:absolute;left:50%;bottom:-9px;transform:translateX(-50%) rotate(45deg);width:14px;height:14px;background:var(--cd);border-radius:3px}'
    + '.pq-ball .bd::after{content:"";position:absolute;left:50%;top:calc(100% + 6px);transform:translateX(-50%);width:2px;height:9vh;background:linear-gradient(rgba(255,255,255,.75),rgba(255,255,255,0));border-radius:2px}'
    + '@keyframes pqUp{from{transform:translateY(0)}to{transform:translateY(-165vh)}}'
    + '@keyframes pqSway{from{transform:rotate(-6deg) translateX(-6px)}to{transform:rotate(6deg) translateX(6px)}}'
    + '@media (prefers-reduced-motion:reduce){.pq-balls{display:none !important}'
    + '.pq-shell{transition:none;transform:none;opacity:1}.pq-shell::after{animation:none}'
    + '.pq-veil.show .pq-shell:hover{transform:none}'
    + '.pq-send{animation:none}.pq-veil::before{transition:none}}';

  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  /* ---------- markup ---------- */
  var veil = document.createElement('div');
  veil.className = 'pq-veil';
  veil.setAttribute('role', 'dialog');
  veil.setAttribute('aria-modal', 'true');
  veil.setAttribute('aria-labelledby', 'pqTitle');
  veil.innerHTML =
    '<div class="pq-shell">'
    + '<button class="pq-x" type="button" aria-label="Zavřít">&times;</button>'
    + '<div class="pq-card">'
    + '<h4 id="pqTitle">Nezávazná poptávka</h4>'
    + '<p class="pq-sub">Řekněte nám o akci a my se ozveme s cenou na míru.</p>'
    + '<div class="pq-cart" id="pqCart"></div>'
    + '<div class="field"><input type="text" id="pqName" placeholder="Vaše jméno" autocomplete="name"></div>'
    + '<div class="field"><input type="tel" id="pqCon" placeholder="Telefon nebo e-mail" autocomplete="tel"></div>'
    + '<div class="field"><textarea id="pqMsg" placeholder="Datum, místo a co si představujete…"></textarea></div>'
    + '<button class="pq-send" type="button">Odeslat poptávku</button>'
    + '<p class="pq-alt">Nebo rovnou <a href="mailto:' + MAIL + '">' + MAIL + '</a></p>'
    + '</div></div>';

  var balls = document.createElement('div');
  balls.className = 'pq-balls';
  balls.setAttribute('aria-hidden', 'true');

  document.addEventListener('DOMContentLoaded', function () {
    document.body.appendChild(veil);
    document.body.appendChild(balls);
  });

  /* ---------- balonky ---------- */
  var COLORS = [
    ['#F5B324', '#c8890f'], ['#1B3A63', '#0f2440'], ['#6B4FA0', '#4a3277'],
    ['#DA3B4B', '#a92434'], ['#4CAF7D', '#2f7d56'], ['#38B6FF', '#1d7fc0']
  ];

  function launch() {
    if (reduce) return;
    balls.classList.add('on');
    var n = Math.min(16, Math.max(10, Math.round(window.innerWidth / 110)));
    for (var i = 0; i < n; i++) {
      var b = document.createElement('div');
      b.className = 'pq-ball';
      var c = COLORS[i % COLORS.length];
      b.style.setProperty('--x', ((i + Math.random() * .8) / n * 100) + '%');
      b.style.setProperty('--s', (56 + Math.random() * 84).toFixed(0) + 'px');
      b.style.setProperty('--d', (1.5 + Math.random() * .9).toFixed(2) + 's');
      b.style.setProperty('--dl', (Math.random() * .4).toFixed(2) + 's');
      b.style.setProperty('--sw', (1.1 + Math.random() * .9).toFixed(2) + 's');
      b.style.setProperty('--c', c[0]);
      b.style.setProperty('--cd', c[1]);
      b.innerHTML = '<div class="bd"></div>';
      balls.appendChild(b);
    }
    setTimeout(function () { balls.classList.remove('on'); balls.innerHTML = ''; }, 3200);
  }

  /* ---------- vypis kosiku ---------- */
  function cartItems() {
    return (window.AMCart && window.AMCart.items) ? window.AMCart.items() : [];
  }

  function renderCart() {
    var box = document.getElementById('pqCart');
    if (!box) return;
    var items = cartItems();
    if (!items.length) {
      box.innerHTML = '<p class="none">Košík je prázdný — napište nám rovnou do zprávy, o co máte zájem.</p>';
      return;
    }
    box.innerHTML = '<h5>Vybrané služby</h5>' + items.map(function (it) {
      var th = it.img
        ? '<span class="th"><img src="' + it.img + '" alt=""></span>'
        : '<span class="th"><span>' + (it.badge || '?') + '</span></span>';
      return '<div class="pq-ci">' + th
        + '<span class="nm">' + it.name + '</span>'
        + '<button type="button" data-rm="' + it.id + '" aria-label="Odebrat ' + it.name + '">&times;</button>'
        + '</div>';
    }).join('');
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('.pq-ci button[data-rm]') : null;
    if (!b) return;
    if (window.AMCart) window.AMCart.remove(b.getAttribute('data-rm'));
    renderCart();
  });

  /* ---------- otevreni / zavreni ---------- */
  var lastFocus = null;

  function pageName() {
    var h1 = document.querySelector('h1');
    var t = h1 ? h1.textContent.trim() : document.title;
    return t.replace(/\s+/g, ' ').slice(0, 60);
  }

  function open(e) {
    if (e) e.preventDefault();
    lastFocus = document.activeElement;
    renderCart();
    veil.classList.add('on');
    document.body.style.overflow = 'hidden';
    launch();
    requestAnimationFrame(function () { veil.classList.add('show'); });
    setTimeout(function () {
      var f = document.getElementById('pqName');
      if (f) f.focus();
    }, 260);
  }

  function close() {
    veil.classList.remove('show');
    document.body.style.overflow = '';
    setTimeout(function () { veil.classList.remove('on'); }, 320);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  veil.addEventListener('click', function (e) {
    if (e.target === veil || e.target.classList.contains('pq-x')) close();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && veil.classList.contains('on')) close();
  });

  /* odeslani: predvyplneny e-mail (bez backendu jinak posta nikam nedojde) */
  veil.addEventListener('click', function (e) {
    if (!e.target.classList.contains('pq-send')) return;
    var v = function (id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; };
    var picked = cartItems().map(function (i) { return i.name; });
    var body = 'Sluzby z kosiku: ' + (picked.length ? picked.join(', ') : '(nevybrano)') + '\n'
      + 'Stranka: ' + pageName() + '\n'
      + 'Jmeno: ' + v('pqName') + '\n'
      + 'Kontakt: ' + v('pqCon') + '\n\n'
      + v('pqMsg');
    window.location.href = 'mailto:' + MAIL
      + '?subject=' + encodeURIComponent('Poptávka — ' + (picked.length ? picked.join(' + ') : pageName()))
      + '&body=' + encodeURIComponent(body);
  });

  window.AMPoptavka = { open: function () { open(); }, close: close };

  /* zachyceni CTA odkazu smerujicich na kontakt */
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[href*="#kontakt"]') : null;
    if (!a) return;
    /* na strance, ktera kontaktni sekci sama obsahuje (index), necháme normalni scroll */
    if (document.getElementById('kontakt')) return;
    open(e);
  });
})();
