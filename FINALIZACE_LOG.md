# FINALIZACE_LOG – Agentura Marco

Mírný upgrade (ne redesign). Tokeny rozložení: `../_layout-system.md`. Sdílená vrstva: `assets/css/finale.css` + `assets/js/fx.js` (načítané na všech stránkách po inline stylu).

| datum | co | proč | skóre |
|---|---|---|---|
| 2026-10-15 | Sdílená vrstva: tokeny (sekce `clamp(72px,9vw,144px)`, wrap 1200, eyebrow 12 / nadpis→text 20 / text→CTA 32, jeden gap), jednotný hover (jen transform), fonty lokálně místo Google Fonts, `<main>` landmark, tečky karuselů 24 px | audit 416 odchylek → 0 (9 stránek × 3 šířky), a11y | 6 → 8 |
| 2026-10-15 | Úvodní dinosaurus (SVG ve stylu webu, 3 dupnutí se zatřesením, prach a BUM!, 1× za session, přeskočitelný, reduced-motion = bez intra, pojistka 4,6 s) | zadání a) | 8 |
| 2026-10-15 | Lenis smooth scroll, reveal sekcí (0,7 s), jiskřičky za kurzorem (jen myš), pinovaná sekce služeb (3×3 dlaždice + panel služby, oběma směry) | zadání b) | 8 |
| 2026-10-15 | Nové podstránky `motokary.html`, `hry.html` (komiksové hero, fialové karty, Rychlá fakta, galerie, CTA), data ze starého webu a ceníku; dinosauří motokáry = [OVĚŘIT U MIRKA]; ikony v3 + produktové ilustrace z Blenderu; v menu, patičce i dlaždicích (3×3) | zadání c) | 8 |
| 2026-10-15 | Kontrast AA nadpisů na světlém pozadí podstránek (navy), emoji pryč z tlačítek, oprava fotky T-Rexe v balíčku MAX (byla tam fotka Avengers), robots.txt, sitemap.xml, 404 | kvalita | 8 |
