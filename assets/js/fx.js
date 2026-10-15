/* AGENTURA MARCO – fx.js (sdílené pro všechny stránky): smooth scroll, reveal, jiskřičky, úvodní dinosaurus, pin služeb */
(function () {
  var RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var FINE = matchMedia("(hover:hover) and (pointer:fine)").matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- úvodní dinosaurus ---------- */
  function dino(done) {
    var el = $(".dino-intro");
    if (!el || !document.documentElement.classList.contains("dino")) return done();
    var shake = $(".di-shake", el), dn = $(".di-dino", el), finished = false, timers = [];
    function end() {
      if (finished) return; finished = true;
      timers.forEach(clearTimeout);
      el.classList.add("out");
      setTimeout(function () { el.remove(); document.documentElement.classList.remove("dino"); done(); }, 520);
      ["pointerdown", "wheel", "touchstart", "keydown"].forEach(function (e) { removeEventListener(e, end); });
    }
    ["pointerdown", "wheel", "touchstart", "keydown"].forEach(function (e) { addEventListener(e, end, { passive: true }); });
    try { sessionStorage.setItem("am-dino", "1"); } catch (e) {}
    function stomp() {
      shake.classList.remove("on"); void shake.offsetWidth; shake.classList.add("on");
      var r = dn.getBoundingClientRect(), sr = shake.getBoundingClientRect();
      var fx = r.left + r.width * 0.5 - sr.left, fy = r.top + r.height * 0.88 - sr.top;
      for (var i = 0; i < 6; i++) {
        var d = document.createElement("i"); d.className = "di-dust";
        var a = (i / 5) * Math.PI, s = 18 + Math.random() * 20;
        d.style.cssText = "left:" + (fx - s / 2 + (i - 2.5) * 10) + "px;top:" + (fy - s / 2) + "px;--s:" + s + "px;--dx:" + Math.round(Math.cos(a) * -70) + "px;--dy:" + Math.round(-14 - Math.sin(a) * 36) + "px";
        shake.appendChild(d); setTimeout(d.remove.bind(d), 700);
      }
      var b = document.createElement("div"); b.className = "di-bum"; b.setAttribute("aria-hidden", "true");
      b.innerHTML = '<svg viewBox="0 0 100 100"><path d="M50 4 58 22 78 12 74 34 96 38 80 52 94 70 72 70 72 92 56 80 44 96 38 76 16 86 22 64 4 56 22 44 10 26 32 28 34 6Z" fill="#FFD23F" stroke="#1B3A63" stroke-width="3" stroke-linejoin="round"/></svg><b>BUM!</b>';
      b.style.left = fx + "px"; b.style.top = fy + "px"; shake.appendChild(b); setTimeout(b.remove.bind(b), 760);
    }
    requestAnimationFrame(function () {
      el.classList.add("go");
      [900, 1700, 2500].forEach(function (t) { timers.push(setTimeout(stomp, t)); });
      timers.push(setTimeout(end, 3500));
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
