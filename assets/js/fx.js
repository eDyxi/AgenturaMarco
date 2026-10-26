/* AGENTURA MARCO – fx.js (sdílené pro všechny stránky): smooth scroll, reveal, kometa za kurzorem, úvodní scénka s dinem, pin služeb */
(function () {
  var RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var FINE = matchMedia("(hover:hover) and (pointer:fine)").matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- úvodní scénka: dino vykoukne zespodu → rozhlédne se → 3× ťukne drápem (první praskliny) → úsměv a mrknutí →
     nápřah a úder (praskliny přes celou obrazovku) → střepy odpadnou → karta T-Rexe s ROAR! → po 1,5 s balónky odhalí stránku.
     Plynulost: pohyblivé části jsou samostatné vrstvy (jen transform/opacity), bod úderu, praskliny i textury střepů se
     předpočítají během úsměvu (po 1 střepu na snímek), v okamžiku úderu a rozpadu se už jen přepínají třídy. ---------- */
  function dino(done) {
    var el = $(".dino-intro");
    if (!el || !document.documentElement.classList.contains("dino")) { if (el) el.remove(); return done(); }
    var stage = $(".di-stage", el), crack = $(".di-crack", el), shards = $(".di-shards", el), box = $(".di-balloons", el), card = $(".di-card", el);
    var H = document.documentElement, M = innerWidth < 700, phase = 0, timers = [], fin = false, CR = [], plan = null;
    try { sessionStorage.setItem("am-dino", "1"); } catch (e) {}
    var COLS = [["#FFD23F", "#FFE98A"], ["#38B6FF", "#9EDCFF"], ["#9B7BE0", "#CDB8F5"], ["#43C463", "#A6EBB6"], ["#FF9F1C", "#FFD08A"]];
    var EV = ["pointerdown", "wheel", "touchmove", "keydown"];
    function at(t, f) { timers.push(setTimeout(f, t)); }
    function cls(c) { el.classList.add(c); }
    function finish() { if (!fin) { fin = true; H.classList.add("dino-free"); done(); } }
    function cleanup(ms) {
      EV.forEach(function (e) { removeEventListener(e, skip); });
      setTimeout(function () { el.remove(); H.classList.remove("dino", "dino-free"); }, ms);
    }
    /* klik kamkoli = přeskočit; po odhalení vede klik na kartu na trex.html */
    function skip(e) {
      if (phase >= 4 && e && ((e.target && e.target.closest && e.target.closest(".di-card")) || e.key === "Tab" || e.key === "Enter")) return;
      timers.forEach(clearTimeout); timers = []; phase = 9;
      cls("skip"); finish(); cleanup(360);
    }
    EV.forEach(function (e) { addEventListener(e, skip, { passive: true }); });
    if (card.querySelector("img").decode) card.querySelector("img").decode().catch(function () {});

    var f1 = function (p) { return p[0].toFixed(1) + " " + p[1].toFixed(1); };
    function rel(r) { var s = stage.getBoundingClientRect(); return [r[0] - s.left, r[1] - s.top]; }
    function tip() { var s = $(".dn-tip", el).getBoundingClientRect(); return rel([s.left + s.width / 2, s.top + s.height / 2]); }
    /* dávka prasklin = vlastní svg (tmavá + světlá čára), vystřelí od bodu o (transform-origin); malé svg sm je 240×240 kolem bodu */
    function draw(d, o, delay, dur, sm) {
      CR.push([d, sm]);
      var ox = sm ? 120 : o[0], oy = sm ? 120 : o[1], pos = sm ? "left:" + (o[0] - 120).toFixed(1) + "px;top:" + (o[1] - 120).toFixed(1) + "px;" : "";
      if (sm) d = d.replace(/(-?[\d.]+) (-?[\d.]+)/g, function (m, x, y) { return (+x - o[0] + 120).toFixed(1) + " " + (+y - o[1] + 120).toFixed(1); });
      return '<svg class="' + (sm ? "sm" : "") + '" style="' + pos + "transform-origin:" + ox.toFixed(1) + "px " + oy.toFixed(1) + "px;--d:" + delay + "s;--t:" + dur + 's"><path class="k1" d="' + d + '"/><path class="k2" d="' + d + '"/></svg>';
    }
    function dot(c, p) { return '<i class="' + c + '" style="left:' + p[0].toFixed(1) + "px;top:" + p[1].toFixed(1) + 'px"></i>'; }
    var SH = { sh1: [[0, 0], [-4, 3], [4, -3], [-2, 2], [0, 0]], sh2: [[0, 0], [-11, 7], [10, -8], [-7, 6], [6, -4], [-3, 2], [0, 0]] };
    function shakeIt(c) { stage.animate(SH[c].map(function (q) { return { transform: "translate(" + q[0] + "px," + q[1] + "px)" }; }), { duration: c === "sh1" ? 200 : 360, easing: "linear" }); }

    /* ťuknutí: kroužek; 2. a 3. ťuknutí nakřupne sklo (krátké paprsky) + mini shake */
    function tap(k) {
      var p = tip(), h = dot("tick", p);
      if (k < 1) return crack.insertAdjacentHTML("beforeend", h);
      var n = k === 1 ? 5 : 4, d = "", a0 = Math.random() * 6.28;
      for (var i = 0; i < n; i++) {
        var a = a0 + (i / n) * 6.283 + (Math.random() - .5) * .5, b = a + (Math.random() - .5) * .5;
        var r1 = (k === 1 ? 14 : 24) + Math.random() * 12, r2 = r1 + (k === 1 ? 24 : 42) + Math.random() * 30;
        d += "M" + f1(p) + " L" + f1([p[0] + Math.cos(a) * r1, p[1] + Math.sin(a) * r1]) + " L" + f1([p[0] + Math.cos(b) * r2, p[1] + Math.sin(b) * r2]) + " ";
      }
      crack.insertAdjacentHTML("beforeend", h + draw(d, p, 0, .18, true)); shakeIt("sh1");
    }

    /* bod úderu = špička drápu v koncové póze úderu (stejná matice jako @keyframes dnPunch: origin 78,6 % 100 %,
       translate(−1,9 %, −4 %) rotate(−8°) scale(1.42)), spočítaná z boxu ruky → praskliny i střepy jdou připravit předem */
    function punchTip() {
      var r = $(".di-bob", el).getBoundingClientRect(), w = r.width, h = r.height, ox = .786 * w, oy = h, px = 360 / 420 * w - ox, py = 140 / 400 * h - oy;
      var a = -8 * Math.PI / 180, s = 1.42, x = ox - .019 * w + s * (px * Math.cos(a) - py * Math.sin(a)), y = oy - .04 * h + s * (px * Math.sin(a) + py * Math.cos(a));
      return rel([r.left + x, r.top + y]);
    }
    /* plán úderu: paprsky až za okraj (pro střepy), čáry jen k okraji obrazovky (+40 px), 2 prstence, odbočky */
    function prepare() {
      if (phase > 2 || plan) return;
      var p = punchTip(), x = p[0], y = p[1], W = stage.offsetWidth, Hh = stage.offsetHeight, R = Math.hypot(W, Hh) * 1.5, n = M ? 5 : 7, a0 = Math.random() * 6.28, rays = [];
      for (var i = 0; i < n; i++) {
        var a = a0 + (i / n) * 6.283 + (Math.random() - .5) * .3;
        var j = function (r, s) { var b = a + (Math.random() - .5) * s; return [x + Math.cos(b) * r, y + Math.sin(b) * r]; };
        rays.push([j(70 + Math.random() * 50, .2), j((M ? 170 : 230) + Math.random() * 110, .14), j(R, 0)]);
      }
      var d = "", ring = "", br = "";
      rays.forEach(function (q, i) {
        var nx = rays[(i + 1) % n], dx = q[2][0] - q[1][0], dy = q[2][1] - q[1][1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
        var t = Math.max(0, Math.min(ux > 0 ? (W + 40 - q[1][0]) / ux : ux < 0 ? (-40 - q[1][0]) / ux : 1e9, uy > 0 ? (Hh + 40 - q[1][1]) / uy : uy < 0 ? (-40 - q[1][1]) / uy : 1e9));
        d += "M" + f1(p) + " L" + f1(q[0]) + " L" + f1(q[1]) + " L" + f1([q[1][0] + ux * t, q[1][1] + uy * t]) + " ";
        ring += "M" + f1(q[0]) + " L" + f1(nx[0]) + " M" + f1(q[1]) + " L" + f1(nx[1]) + " ";
        var s = 120 + Math.random() * 160, sx = q[1][0] + ux * s, sy = q[1][1] + uy * s, ba = (i % 2 ? .6 : -.6), bl = 50 + Math.random() * 70;
        br += "M" + f1([sx, sy]) + " L" + f1([sx + (ux * Math.cos(ba) - uy * Math.sin(ba)) * bl, sy + (ux * Math.sin(ba) + uy * Math.cos(ba)) * bl]) + " ";
      });
      plan = { p: p, rays: rays, W: W, Hh: Hh, html: draw(d, p, 0, .3) + draw(ring, p, .06, .22) + draw(br, p, .12, .22) + dot("flash", p), todo: [] };
      var src = cracksOn(base && base[3] === W && base[4] === Hh ? base : glass(W, Hh));
      rays.forEach(function (q, i) { var nx = rays[(i + 1) % n]; [[[x, y], q[1], nx[1]], [q[1], q[2], nx[2], nx[1]]].forEach(function (pg) { plan.todo.push(function () { shard(pg, src); }); }); });
      (function step() { if (phase > 3 || !plan.todo.length) return; plan.todo.shift()(); requestAnimationFrame(step); })();
    }
    /* sklo (tma, odlesky, vinětace, parapet) do canvasu stejnými gradienty jako CSS – kreslí se hned na začátku, kdy je scéna
       statická (první 2D canvas = kompilace shaderů); praskliny se domalují v prepare() */
    var base = null;
    function glass(W, Hh) {
      var dpr = Math.min(2, devicePixelRatio || 1), cv = document.createElement("canvas"), g = cv.getContext("2d"), gr;
      cv.width = Math.round(W * dpr); cv.height = Math.round(Hh * dpr); g.scale(dpr, dpr);
      gr = g.createLinearGradient(0, 0, 0, Hh); gr.addColorStop(0, "rgba(13,15,36,.9)"); gr.addColorStop(1, "rgba(24,19,56,.94)"); g.fillStyle = gr; g.fillRect(0, 0, W, Hh);
      function ell(cx, cy, rx, ry, stops) { g.save(); g.translate(cx, cy); g.scale(rx, ry); var r = g.createRadialGradient(0, 0, 0, 0, 0, 1); stops.forEach(function (st) { r.addColorStop(st[0], st[1]); }); g.fillStyle = r; g.fillRect(-cx / rx, -cy / ry, W / rx, Hh / ry); g.restore(); }
      ell(W / 2, Hh, W * .58, Hh * .52, [[0, "rgba(122,86,196,.5)"], [.72, "rgba(122,86,196,0)"]]);
      var a = 112 * Math.PI / 180, ux = Math.sin(a), uy = -Math.cos(a), L = Math.abs(W * ux) + Math.abs(Hh * uy);
      gr = g.createLinearGradient(W / 2 - ux * L / 2, Hh / 2 - uy * L / 2, W / 2 + ux * L / 2, Hh / 2 + uy * L / 2);
      [[.16, 0], [.21, .07], [.29, .02], [.33, 0], [.57, 0], [.60, .05], [.66, 0]].forEach(function (st) { gr.addColorStop(st[0], "rgba(255,255,255," + st[1] + ")"); });
      g.fillStyle = gr; g.fillRect(0, 0, W, Hh);
      ell(W / 2, Hh / 2, W * .75, Hh * .7, [[.55, "rgba(0,0,0,0)"], [1, "rgba(0,0,0,.45)"]]);
      gr = g.createLinearGradient(0, Hh, 0, Hh * .87); gr.addColorStop(0, "rgba(8,9,24,.85)"); gr.addColorStop(1, "rgba(8,9,24,0)"); g.fillStyle = gr; g.fillRect(0, Hh * .87, W, Hh * .13);
      return [cv, dpr, g, W, Hh];
    }
    function cracksOn(b) {
      var g = b[2]; g.lineCap = g.lineJoin = "round";
      CR.forEach(function (c) { var p = new Path2D(c[0]);
        g.strokeStyle = "rgba(10,12,30,.85)"; g.lineWidth = c[1] ? 2 : 2.6; g.stroke(p);
        g.save(); g.translate(1.5, 1.5); g.strokeStyle = "rgba(255,255,255,.92)"; g.lineWidth = c[1] ? 1.1 : 1.3; g.stroke(p); g.restore(); });
      return b;
    }
    /* střep = malý canvas o velikosti bboxu polygonu (výřez přes clip), stojí neviditelně (opacity .001 → už rastrovaný) */
    function shard(pg, src) {
      var W = plan.W, Hh = plan.Hh, x = plan.p[0], y = plan.p[1], dpr = src[1], bx = 1e9, by = 1e9, ex = -1e9, ey = -1e9;
      pg.forEach(function (p) { bx = Math.min(bx, p[0]); by = Math.min(by, p[1]); ex = Math.max(ex, p[0]); ey = Math.max(ey, p[1]); });
      bx = Math.max(0, Math.floor(bx)); by = Math.max(0, Math.floor(by)); ex = Math.min(W, Math.ceil(ex)); ey = Math.min(Hh, Math.ceil(ey));
      if (ex - bx < 2 || ey - by < 2) return;
      var cx = (bx + ex) / 2, cy = (by + ey) / 2, dist = Math.hypot(cx - x, cy - y), dx = (cx - x) / (dist || 1), dy = (cy - y) / (dist || 1);
      var cv = document.createElement("canvas"), g = cv.getContext("2d"), w = ex - bx, h = ey - by;
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); cv.className = "di-shard";
      g.scale(dpr, dpr); g.beginPath(); pg.forEach(function (p, k) { g[k ? "lineTo" : "moveTo"](p[0] - bx, p[1] - by); }); g.closePath(); g.clip();
      g.drawImage(src[0], bx * dpr, by * dpr, w * dpr, h * dpr, 0, 0, w, h);
      g.strokeStyle = "rgba(255,255,255,.35)"; g.lineWidth = 1.2; g.stroke();          /* světlá hrana střepu */
      cv.style.cssText = "left:" + bx + "px;top:" + by + "px;width:" + w + "px;height:" + h + "px;--px:" + (dx * 8).toFixed(1) + "px;--py:" + (dy * 8).toFixed(1) +
        "px;--tx:" + (dx * 70 + (Math.random() - .5) * 90).toFixed(0) + "px;--ty:" + (Hh * (.95 + Math.random() * .4)).toFixed(0) + "px;--r:" + ((Math.random() - .5) * 140).toFixed(0) +
        "deg;--d:" + (Math.min(.26, dist / 3200) + Math.random() * .08).toFixed(2) + "s;--t:" + (.9 + Math.random() * .3).toFixed(2) + "s";
      shards.appendChild(cv);
    }
    /* úder: připravené praskliny + záblesk, velký shake */
    function impact() {
      if (phase > 2) return; prepare(); phase = 3;
      crack.insertAdjacentHTML("beforeend", plan.html); shakeIt("sh2");
    }
    function shatter() {
      if (phase !== 3) return;
      while (plan.todo.length) plan.todo.shift()();
      phase = 4; cls("shatter");
      at(80, function () { cls("reveal"); card.tabIndex = 0; });
      at(1500, function () { shards.innerHTML = ""; });
      at(1580, function () {                      /* karta ~1,5 s → balónky (už vložené) odhalí stránku */
        phase = 5; cls("out"); at(1500, finish); cleanup(2300);
      });
    }
    function balloons() {
      var m = M ? 9 : 14, bl = "";
      for (var i = 0; i < m; i++) {
        var c = COLS[i % COLS.length], w = (M ? 56 : 80) + Math.random() * (M ? 40 : 70);
        bl += '<i class="di-bl" style="--x:' + ((i / m) * 104 - 4 + Math.random() * 5).toFixed(1) + "%;--w:" + w.toFixed(0) + "px;--c:" + c[0] + ";--c2:" + c[1] +
          ";--d:" + (Math.random() * .35).toFixed(2) + "s;--t:" + (1.5 + Math.random() * .5).toFixed(2) + "s;--r:" + (Math.random() * 16 - 8).toFixed(1) + 'deg"></i>';
      }
      box.innerHTML = bl;
    }
    function run() {
      cls("go"); phase = 1;
      at(720, function () { cls("look"); });
      at(1000, function () { cls("arm"); });
      at(1450, function () { cls("taps"); phase = 2; });
      [90, 290, 490].forEach(function (o, k) { at(1450 + o, function () { tap(k); }); });
      at(2100, function () { cls("smile"); });
      at(2160, prepare);
      at(2520, function () { cls("wind"); });
      at(2740, function () { cls("punch"); });
      at(2880, impact);
      at(3140, shatter);
    }
    /* načítání stránky dělá první vteřinu dlouhé snímky → překryv je vidět hned, pohyb začne, až 8 snímků po sobě stihne < 25 ms (max 1,8 s) */
    var ok = 0, last = 0, t0 = performance.now(), ran = false;
    requestAnimationFrame(function () { base = glass(stage.offsetWidth, stage.offsetHeight); balloons(); });
    (function wait(t) {
      if (ran || phase === 9) return;
      ok = last && t - last < 25 ? ok + 1 : 0; last = t;
      if (ok >= 8 || t - t0 > 1800) { ran = true; run(); } else requestAnimationFrame(wait);
    })(0);
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

  /* ---------- kometa za kurzorem: měkká zlato-modro-fialová stuha + konfety při kliku ---------- */
  function trail() {
    if (RM || !FINE) return;
    var c = document.createElement("canvas"); c.className = "am-trail"; c.setAttribute("aria-hidden", "true"); document.body.appendChild(c);
    var x = c.getContext("2d"), dpr = 1, W = 0, H = 0, N = 22, P = [], B = [], raf = 0, mx = 0, my = 0, live = false, still = 0, spin = 0;
    var COL = ["#FFD23F", "#60BEFF", "#9B7BE0", "#F5B324", "#43C463"];
    function size() { dpr = Math.min(devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight; c.width = W * dpr; c.height = H * dpr; c.style.width = W + "px"; c.style.height = H + "px"; x.setTransform(dpr, 0, 0, dpr, 0, 0); }
    size(); addEventListener("resize", size);
    function kick() { if (!raf) raf = requestAnimationFrame(step); }
    addEventListener("pointermove", function (e) {
      if (e.pointerType && e.pointerType !== "mouse") return;
      mx = e.clientX; my = e.clientY; still = 0;
      if (!live) { P = []; for (var i = 0; i < N; i++) P.push({ x: mx, y: my }); live = true; }
      kick();
    }, { passive: true });
    document.addEventListener("mouseleave", function () { live = false; });
    addEventListener("pointerdown", function (e) {
      if (e.pointerType && e.pointerType !== "mouse") return;
      for (var i = 0; i < 12; i++) { var a = (i / 12) * Math.PI * 2 + Math.random() * .4, v = 2.2 + Math.random() * 2.6;
        B.push({ x: e.clientX, y: e.clientY, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 1.2, r: 2.6 + Math.random() * 2.6, t: 0, c: COL[i % COL.length], s: i % 3 === 0, rot: Math.random() * 6 }); }
      kick();
    }, { passive: true });
    function star(px, py, r, rot) { x.beginPath(); for (var i = 0; i < 8; i++) { var rr = i % 2 ? r * .42 : r, an = rot + i * Math.PI / 4; x.lineTo(px + Math.cos(an) * rr, py + Math.sin(an) * rr); } x.closePath(); x.fill(); }
    function ribbon(scale, alpha) {
      var L = [], R = [], i, p, q, nx, ny, d, w;
      for (i = 0; i < N; i++) {
        p = P[Math.max(0, i - 1)]; q = P[Math.min(N - 1, i + 1)];
        nx = -(q.y - p.y); ny = q.x - p.x; d = Math.hypot(nx, ny) || 1; nx /= d; ny /= d;
        w = (1 - i / N) * 7 * scale + .4;
        L.push([P[i].x + nx * w, P[i].y + ny * w]); R.push([P[i].x - nx * w, P[i].y - ny * w]);
      }
      var g = x.createLinearGradient(P[0].x, P[0].y, P[N - 1].x, P[N - 1].y);
      g.addColorStop(0, "rgba(255,226,120," + alpha + ")"); g.addColorStop(.38, "rgba(96,190,255," + alpha * .85 + ")");
      g.addColorStop(.75, "rgba(155,123,224," + alpha * .55 + ")"); g.addColorStop(1, "rgba(155,123,224,0)");
      x.fillStyle = g; x.beginPath(); x.moveTo(L[0][0], L[0][1]);
      for (i = 1; i < N; i++) x.lineTo(L[i][0], L[i][1]);
      for (i = N - 1; i >= 0; i--) x.lineTo(R[i][0], R[i][1]);
      x.closePath(); x.fill();
    }
    function step() {
      x.clearRect(0, 0, W, H); raf = 0;
      var moving = false, len = 0, i;
      if (P.length) {
        P[0].x += (mx - P[0].x) * .55; P[0].y += (my - P[0].y) * .55;
        for (i = 1; i < N; i++) { P[i].x += (P[i - 1].x - P[i].x) * .38; P[i].y += (P[i - 1].y - P[i].y) * .38; len += Math.hypot(P[i].x - P[i - 1].x, P[i].y - P[i - 1].y); }
        moving = len > .6;
        if (moving && live) {
          ribbon(2.4, .16); ribbon(1, .9);                                   /* měkká záře + jádro */
          spin += .08; x.fillStyle = "rgba(255,240,190," + Math.min(1, len / 40) + ")"; star(P[0].x, P[0].y, 5.5, spin);
        }
      }
      B = B.filter(function (b) { return (b.t += 1 / 42) < 1; });
      B.forEach(function (b) { b.vy += .14; b.vx *= .97; b.x += b.vx; b.y += b.vy; x.globalAlpha = 1 - b.t; x.fillStyle = b.c;
        if (b.s) star(b.x, b.y, b.r * 1.4, b.rot + b.t * 4); else { x.beginPath(); x.arc(b.x, b.y, b.r * (1 - b.t * .4), 0, 7); x.fill(); } });
      x.globalAlpha = 1;
      if ((moving && live) || B.length || ++still < 3) raf = requestAnimationFrame(step);
    }
    document.addEventListener("visibilitychange", function () { if (document.hidden && raf) { cancelAnimationFrame(raf); raf = 0; x.clearRect(0, 0, W, H); } });
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
  /* ---------- hlava T-Rexe: natáčí se při scrollu (karta na indexu), hover = kouknutí ---------- */
  function heads() {
    var H = [].slice.call(document.querySelectorAll("[data-headscroll]")); if (!H.length || RM) return;
    var hov = H.map(function () { return 0; }), raf = 0;
    function set() { raf = 0; var vh = innerHeight;
      H.forEach(function (h, i) { var r = h.getBoundingClientRect(), p = (r.top + r.height / 2 - vh / 2) / vh;
        h.style.transform = "rotate(" + (Math.max(-9, Math.min(4, p * 16)) + hov[i]).toFixed(2) + "deg)"; }); }
    function q() { if (!raf) raf = requestAnimationFrame(set); }
    H.forEach(function (h, i) { var card = h.closest("a,article,.best") || h;
      card.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") { hov[i] = -7; q(); } });
      card.addEventListener("pointerleave", function () { hov[i] = 0; q(); }); });
    addEventListener("scroll", q, { passive: true }); addEventListener("resize", q); q();
  }
  function start() { smooth(); heads(); trail(); if (document.body.getAttribute("data-fx") === "scroll") return; reveal(); services(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { dino(start); });
  else dino(start);
})();
