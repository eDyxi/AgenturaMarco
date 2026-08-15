/* Agentura Marco — poptavkovy modal s balonkovym odhalenim.
   Zachyti kliknuti na odkazy mirici na index.html#kontakt a misto presmerovani
   otevre formular primo na dane podstrance. */
(function () {
  'use strict';

  var MAIL = 'agenturamarco@seznam.cz';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- styly ---------- */
  var css = ''
    + '.pq-veil{position:fixed;inset:0;z-index:11000;display:none;align-items:center;justify-content:center;padding:20px}'
    + '.pq-veil.on{display:flex}'
    + '.pq-veil::before{content:"";position:absolute;inset:0;background:rgba(20,14,42,.55);backdrop-filter:blur(14px) saturate(120%);-webkit-backdrop-filter:blur(14px) saturate(120%);opacity:0;transition:opacity .35s}'
    + '.pq-veil.show::before{opacity:1}'
    + '.pq-card{position:relative;z-index:2;width:min(560px,100%);max-height:88vh;overflow:auto;'
    + 'background:linear-gradient(180deg,#fff 0%,#FDFCFF 55%,#EFEBF7 100%);'
    + 'border:3px solid #8B5CD6;border-radius:26px;padding:30px 26px 26px;'
    + 'box-shadow:0 26px 60px rgba(27,26,64,.34);'
    + 'transform:translateY(26px) scale(.94);opacity:0;transition:transform .42s cubic-bezier(.2,1.2,.3,1),opacity .32s}'
    + '.pq-veil.show .pq-card{transform:none;opacity:1}'
    + '.pq-card h3{font-family:"Baloo 2",system-ui,sans-serif;font-weight:900;font-size:1.6rem;color:#1E2A44;margin:0 0 6px;line-height:1.15}'
    + '.pq-card p.pq-sub{margin:0 0 18px;color:#31507C;font-weight:700;font-size:.98rem;line-height:1.5}'
    + '.pq-what{display:inline-block;margin:0 0 16px;padding:6px 14px;border-radius:999px;background:#F3ECFF;color:#5B3E9E;font-weight:800;font-size:.82rem}'
    + '.pq-f{margin-bottom:12px}'
    + '.pq-f input,.pq-f textarea{width:100%;font:inherit;font-size:16px;padding:13px 14px;border:2px solid #DCD3F0;border-radius:14px;background:#fff;color:#1E2A44;min-height:48px}'
    + '.pq-f textarea{min-height:104px;resize:vertical}'
    + '.pq-f input:focus,.pq-f textarea:focus{outline:3px solid #FFD23F;outline-offset:1px;border-color:#8B5CD6}'
    + '.pq-send{width:100%;min-height:52px;font:inherit;font-family:"Baloo 2",system-ui,sans-serif;font-weight:900;font-size:1.05rem;cursor:pointer;'
    + 'border:0;border-radius:16px;color:#231A05;background:linear-gradient(180deg,#FFD23F,#F5B324);box-shadow:0 6px 0 #C8890F;'
    + 'transition:transform .16s,box-shadow .16s}'
    + '.pq-send:hover{transform:translateY(-2px);box-shadow:0 8px 0 #C8890F}'
    + '.pq-send:active{transform:translateY(3px);box-shadow:0 3px 0 #C8890F}'
    + '.pq-alt{margin:14px 0 0;text-align:center;font-size:.9rem;color:#31507C;font-weight:700}'
    + '.pq-alt a{color:#6B4FA0}'
    + '.pq-x{position:absolute;top:10px;right:12px;width:42px;height:42px;border:0;border-radius:50%;cursor:pointer;'
    + 'background:#F3ECFF;color:#5B3E9E;font-size:1.5rem;line-height:1;font-weight:700}'
    + '.pq-x:hover{background:#E4D8FB}'
    + '.pq-x:focus-visible{outline:3px solid #FFD23F;outline-offset:2px}'
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
    + '.pq-card{transition:none;transform:none;opacity:1}.pq-veil::before{transition:none}}';

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
    '<div class="pq-card">'
    + '<button class="pq-x" type="button" aria-label="Zavřít">&times;</button>'
    + '<h3 id="pqTitle">Nezávazná poptávka</h3>'
    + '<p class="pq-sub">Řekněte nám o akci a my se ozveme s cenou na míru.</p>'
    + '<span class="pq-what" id="pqWhat"></span>'
    + '<div class="pq-f"><input type="text" id="pqName" placeholder="Vaše jméno" autocomplete="name"></div>'
    + '<div class="pq-f"><input type="text" id="pqCon" placeholder="Telefon nebo e-mail" autocomplete="tel"></div>'
    + '<div class="pq-f"><textarea id="pqMsg" placeholder="Datum, místo a co si představujete…"></textarea></div>'
    + '<button class="pq-send" type="button">Odeslat poptávku</button>'
    + '<p class="pq-alt">Nebo rovnou <a href="mailto:' + MAIL + '">' + MAIL + '</a></p>'
    + '</div>';

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
    var what = document.getElementById('pqWhat');
    if (what) what.textContent = pageName();
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
    var body = 'Sluzba: ' + pageName() + '\n'
      + 'Jmeno: ' + v('pqName') + '\n'
      + 'Kontakt: ' + v('pqCon') + '\n\n'
      + v('pqMsg');
    window.location.href = 'mailto:' + MAIL
      + '?subject=' + encodeURIComponent('Poptávka — ' + pageName())
      + '&body=' + encodeURIComponent(body);
  });

  /* zachyceni CTA odkazu smerujicich na kontakt */
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[href*="#kontakt"]') : null;
    if (!a) return;
    open(e);
  });
})();
