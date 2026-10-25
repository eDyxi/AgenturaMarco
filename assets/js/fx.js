/* AGENTURA MARCO – fx.js (sdílené pro všechny stránky): smooth scroll, reveal, jiskřičky, úvodní dinosaurus, pin služeb */
(function () {
  var RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var FINE = matchMedia("(hover:hover) and (pointer:fine)").matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- úvodní intro: dino přijde → bouchne čumákem do obrazovky → sklo praskne → střepy odpadnou → balónky ---------- */
  function dino(done) {
    var el = $(".dino-intro");
    if (!el || !document.documentElement.classList.contains("dino")) { if (el) el.remove(); return done(); }
    var stage = $(".di-stage", el), shake = $(".di-shake", el), crack = $(".di-crack", el), box = $(".di-balloons", el);
    var phase = 0, timers = [], P = null, rays = [], H = document.documentElement, NS = "http://www.w3.org/2000/svg";
    try { sessionStorage.setItem("am-dino", "1"); } catch (e) {}
    var COLS = [["#FFD23F", "#FFE98A"], ["#38B6FF", "#9EDCFF"], ["#9B7BE0", "#CDB8F5"], ["#43C463", "#A6EBB6"], ["#FF9F1C", "#FFD08A"]];
    var EV = ["pointerdown", "wheel", "touchmove", "keydown"];
    function at(t, f) { timers.push(setTimeout(f, t)); }
    /* přeskočení: před nárazem praskne sklo hned (v místě kliku), po nárazu rovnou odpadnou střepy */
    function skip(e) {
      if (phase >= 3) return;
      timers.forEach(clearTimeout); timers = [];
      if (phase < 2) { var r = stage.getBoundingClientRect(); impact(e && e.clientX != null ? e.clientX - r.left : r.width / 2, e && e.clientY != null ? e.clientY - r.top : r.height / 2); at(240, shatter); }
      else shatter();
    }
    EV.forEach(function (e) { addEventListener(e, skip, { passive: true }); });

    /* náraz: praskliny od bodu (paprsky + 2 prstence), záblesk, BONK!, mini shake */
    function impact(x, y) {
      if (phase >= 2) return; phase = 2; P = [x, y];
      var W = stage.offsetWidth, Hh = stage.offsetHeight, R = Math.hypot(W, Hh) * 1.6, n = innerWidth < 700 ? 8 : 10, a0 = Math.random() * 6.28;
      rays = [];
      for (var i = 0; i < n; i++) {
        var a = a0 + (i / n) * 6.283 + (Math.random() - .5) * .35, r1 = 60 + Math.random() * 50, r2 = 190 + Math.random() * 120;
        var j = function (r, s) { var b = a + (Math.random() - .5) * s; return [x + Math.cos(b) * r, y + Math.sin(b) * r]; };
        rays.push([j(r1, .22), j(r2, .16), j(R, 0)]);
      }
      var d = "", ring = "", f = function (p) { return p[0].toFixed(1) + " " + p[1].toFixed(1); };
      rays.forEach(function (q, i) {
        var nx = rays[(i + 1) % n], far = [x + (q[2][0] - x) * (.35 + Math.random() * .3), y + (q[2][1] - y) * (.35 + Math.random() * .3)];
        d += "M" + x.toFixed(1) + " " + y.toFixed(1) + " L" + f(q[0]) + " L" + f(q[1]) + " L" + f(far) + " ";
        ring += "M" + f(q[0]) + " L" + f(nx[0]) + " M" + f(q[1]) + " L" + f(nx[1]) + " ";
      });
      var html = '<circle class="flash" cx="' + x + '" cy="' + y + '" r="34"/>';
      [["k1", d, 0], ["k2", d, 0], ["k1", ring, .12], ["k2", ring, .12]].forEach(function (k) { html += '<path class="' + k[0] + '" pathLength="1" style="--d:' + k[2] + 's" d="' + k[1] + '"/>'; });
      crack.innerHTML = html;
      shake.classList.remove("on"); void shake.offsetWidth; shake.classList.add("on");
      var b = document.createElement("div"); b.className = "di-bum";
      b.innerHTML = '<svg viewBox="0 0 100 100"><path d="M50 4 58 22 78 12 74 34 96 38 80 52 94 70 72 70 72 92 56 80 44 96 38 76 16 86 22 64 4 56 22 44 10 26 32 28 34 6Z" fill="#FFD23F" stroke="#1B3A63" stroke-width="3" stroke-linejoin="round"/></svg><b>BONK!</b>';
      b.style.left = x + "px"; b.style.top = y + "px"; shake.appendChild(b);
      el.classList.add("dizzy");
    }
    /* střepy: zmrazit scénu, naklonovat ji do polygonů podle prasklin a nechat je spadnout */
    function shatter() {
      if (phase >= 3) return; phase = 3;
      EV.forEach(function (e) { removeEventListener(e, skip); });
      $$("*", stage).forEach(function (n) {
        var cs = getComputedStyle(n);
        if (cs.animationName !== "none") { n.style.transform = cs.transform === "none" ? "" : cs.transform; n.style.animation = "none"; }
      });
      $$(".di-bum", stage).forEach(function (b) { b.remove(); });
      $$("path,circle", crack).forEach(function (p) { p.style.animation = "none"; p.style.strokeDashoffset = "0"; if (p.classList.contains("flash")) p.remove(); });
      var n = rays.length, x = P[0], y = P[1], polys = [], f = function (p) { return p[0].toFixed(1) + "px " + p[1].toFixed(1) + "px"; };
      rays.forEach(function (q, i) {
        var nx = rays[(i + 1) % n];
        polys.push([[x, y], q[0], nx[0]], [q[0], q[1], nx[1], nx[0]], [q[1], q[2], nx[2], nx[1]]);
      });
      var Hh = stage.offsetHeight, frag = document.createDocumentFragment();
      polys.forEach(function (pg) {
        var cx = 0, cy = 0; pg.forEach(function (p) { cx += p[0]; cy += p[1]; }); cx /= pg.length; cy /= pg.length;
        var dist = Math.hypot(cx - x, cy - y), dx = (cx - x) / (dist || 1), dy = (cy - y) / (dist || 1);
        var s = stage.cloneNode(true); s.className = "di-shard"; s.removeAttribute("style");
        s.style.clipPath = "polygon(" + pg.map(f).join(",") + ")";
        s.style.cssText += ";--px:" + (dx * 7).toFixed(1) + "px;--py:" + (dy * 7).toFixed(1) + "px;--tx:" + (dx * 60 + (Math.random() - .5) * 80).toFixed(0) + "px;--ty:" + (Hh * (.9 + Math.random() * .4)).toFixed(0) +
          "px;--r:" + ((Math.random() - .5) * 70).toFixed(0) + "deg;--d:" + (Math.min(.35, dist / 2600) + Math.random() * .12).toFixed(2) + "s;--t:" + (.8 + Math.random() * .3).toFixed(2) + "s";
        frag.appendChild(s);
      });
      el.insertBefore(frag, box);
      el.classList.add("shatter", "clear"); H.classList.add("dino-free"); done();
      var m = innerWidth < 700 ? 9 : 14, bl = "";
      for (var i = 0; i < m; i++) {
        var c = COLS[i % COLS.length], w = (innerWidth < 700 ? 56 : 80) + Math.random() * (innerWidth < 700 ? 40 : 70);
        bl += '<i class="di-bl" style="--x:' + ((i / m) * 104 - 4 + Math.random() * 5).toFixed(1) + "%;--w:" + w.toFixed(0) + "px;--c:" + c[0] + ";--c2:" + c[1] +
          ";--d:" + (.25 + Math.random() * .5).toFixed(2) + "s;--t:" + (1.6 + Math.random() * .6).toFixed(2) + "s;--r:" + (Math.random() * 16 - 8).toFixed(1) + 'deg"></i>';
      }
      box.innerHTML = bl;
      setTimeout(function () { el.remove(); H.classList.remove("dino", "dino-free"); }, 3300);
    }
    requestAnimationFrame(function () {
      el.classList.add("go"); phase = 1;
      at(1240, function () { el.classList.add("look"); });
      at(1600, function () { el.classList.add("bonk"); });
      at(1930, function () {                      /* vrchol výpadu = náraz čumákem do skla */
        var s = $(".dn-snout", el).getBoundingClientRect(), r = stage.getBoundingClientRect();
        impact(s.left + s.width / 2 - r.left, s.top + s.height / 2 - r.top);
      });
      at(2800, shatter);
    });
  }

  /* ---------- smooth scroll (Lenis) ---------- */
  var lenis = null;
  function smooth() {
    if (RM || !window.Lenis || !FINE) return;
    lenis = new Lenis({
      lerp: 0.085, wheelMultiplier: 1, smoothWheel: true, syncTouch: false,
      /* modaly (poptávka, košík) a vnořené scrollovací boxy scrollují nativně */
      prevent: function (n) { return !!(n && n.closest && n.closest(".pq-card,.kk-list,[data-lenis-prevent]")); }
    });
    window.lenis = lenis;
    (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(performance.now());
    /* když modal zamkne body (overflow:hidden), zastav i Lenis */
    new MutationObserver(function () {
      if (document.body.style.overflow === "hidden") lenis.stop(); else lenis.start();
    }).observe(document.body, { attributes: true, attributeFilter: ["style"] });
    document.addEventListener("click", function (e) {
      var a = e.target.closest('a[href^="#"]'); if (!a) return;
      var id = a.getAttribute("href").slice(1), t = id && document.getElementById(id);
      if (t) { e.preventDefault(); lenis.scrollTo(t, { offset: -20, duration: 1.1 }); }
    });
  }

  /* ---------- reveal sekcí ---------- */
  function reveal() {
    if (RM || !("IntersectionObserver" in window)) return;
    var els = $$("main > section:not(.hero):not(.page-hero) > .wrap > .center, .fleet-head, .page-cta .wrap > *, .extra");
    var vh = innerHeight;
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { rootMargin: "0px 0px -8% 0px" });
    els.forEach(function (el) {
      if (el.getBoundingClientRect().top < vh * 0.92) return; /* co je vidět hned, se neschovává */
      var sib = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
      el.style.setProperty("--d", Math.min(sib % 4, 3) * 0.07 + "s");
      el.classList.add("rv"); io.observe(el);
    });
  }

  /* ---------- jiskřičky za kurzorem ---------- */
  function trail() {
    if (RM || !FINE) return;
    var c = document.createElement("canvas"); c.className = "am-trail"; c.setAttribute("aria-hidden", "true"); document.body.appendChild(c);
    var x = c.getContext("2d"), P = [], raf = 0, dpr = Math.min(devicePixelRatio || 1, 2), last = 0;
    var COL = ["#FFD23F", "#60BEFF", "#9B7BE0", "#F5B324"];
    function size() { c.width = innerWidth * dpr; c.height = innerHeight * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0); }
    size(); addEventListener("resize", size);
    addEventListener("pointermove", function (e) {
      var now = performance.now(); if (now - last < 28) return; last = now;
      P.push({ x: e.clientX, y: e.clientY, vx: (Math.random() - 0.5) * 0.6, vy: Math.random() * 0.5 + 0.2, r: 3 + Math.random() * 3.5, t: 0, c: COL[(Math.random() * COL.length) | 0], a: Math.random() * 6 });
      if (P.length > 40) P.shift();
      if (!raf) raf = requestAnimationFrame(step);
    }, { passive: true });
    function star(px, py, r, rot) {
      x.beginPath();
      for (var i = 0; i < 8; i++) { var rr = i % 2 ? r * 0.38 : r, an = rot + (i * Math.PI) / 4; x.lineTo(px + Math.cos(an) * rr, py + Math.sin(an) * rr); }
      x.closePath(); x.fill();
    }
    function step() {
      x.clearRect(0, 0, innerWidth, innerHeight);
      P = P.filter(function (p) { return (p.t += 1 / 36) < 1; });
      P.forEach(function (p) { p.x += p.vx; p.y += p.vy; x.globalAlpha = (1 - p.t) * 0.9; x.fillStyle = p.c; star(p.x, p.y, p.r * (1 - p.t * 0.5), p.a + p.t * 2); });
      x.globalAlpha = 1;
      raf = P.length ? requestAnimationFrame(step) : 0;
      if (!raf) x.clearRect(0, 0, innerWidth, innerHeight);
    }
  }

  /* ---------- služby: pinovaná scéna (index) ---------- */
  function services() {
    var sec = $(".svc"); if (!sec) return;
    var tiles = $$(".tiles-row .tile", sec), panels = $$(".svc-panel", sec), dots = $$(".svc-dots i", sec), cur = -1;
    var mq = matchMedia("(min-width:1024px) and (min-height:760px)");
    function set(i) {
      if (i === cur) return; cur = i;
      tiles.forEach(function (t, k) { t.classList.toggle("on", k === i); });
      panels.forEach(function (p, k) { p.classList.toggle("on", k === i); p.setAttribute("aria-hidden", k === i ? "false" : "true"); p.tabIndex = k === i ? 0 : -1; });
      dots.forEach(function (d, k) { d.classList.toggle("on", k === i); });
    }
    function upd() {
      if (!mq.matches) return;
      var r = sec.getBoundingClientRect(), span = sec.offsetHeight - innerHeight;
      var p = Math.min(1, Math.max(0, -r.top / (span || 1)));
      set(Math.min(panels.length - 1, Math.floor(p * panels.length)));
    }
    tiles.forEach(function (t, k) {
      t.addEventListener("mouseenter", function () { if (mq.matches) set(k); });
      t.addEventListener("focus", function () { if (mq.matches) set(k); });
    });
    set(0); upd();
    addEventListener("scroll", upd, { passive: true }); addEventListener("resize", upd);
  }

  /* index: data-fx="scroll" = jen plynulý scroll, zbytek stránky beze změny */
  function start() { smooth(); if (document.body.getAttribute("data-fx") === "scroll") return; reveal(); trail(); services(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { dino(start); });
  else dino(start);
})();
