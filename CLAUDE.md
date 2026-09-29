# Angela Ceremonies

Persoonlijke website voor **Angela Bhagole-Mangre**, trouwambtenaar (BABS) en ceremoniespreker in Rotterdam, werkzaam door heel Nederland. Herbouw van de oude Lovable/React-site naar Astro: zelfde gedachtegang, maar verfijnder, persoonlijker en met echte fotografie.

- **Live:** https://angelaceremonies.com
- **Repo:** https://github.com/ruudkruidhof-web/angela-ceremonies-v2
- **Hosting:** Vercel (statische output)

## Stack & commando's

Astro 5 (static), geen UI-framework, vanilla JS. Beelden via `astro:assets` (AVIF/WebP, responsive).

```bash
npm install
npm run dev      # lokale dev op http://localhost:4321
npm run build    # productie-build naar dist/
npm run preview  # dist/ lokaal serveren
```

## Projectstructuur

```
src/
  content/            # ALLE bewerkbare content als data (CMS-klaar)
    site.json         # globale config: nav, contactgegevens, social
    home.json         # homepage-teksten
    reviews.json      # 18 reviews (uitgelicht:true = in homepage-showcase)
    seo-paginas.json  # de 5 SEO-landingspagina's (data voor [slug].astro)
    teksten/<pagina>.json   # per-pagina teksten (trouwen, coaching, ...)
  components/         # Nav, Footer, PageHero, CtaSection
  layouts/Base.astro  # head/SEO, ClientRouter, nav/footer, cookie, scripts
  pages/             # één .astro per route; [slug].astro genereert de SEO-pagina's
  styles/global.css   # design-tokens + gedeelde "content-kit" classes
  assets/            # bronafbeeldingen (worden door Astro geoptimaliseerd)
public/              # favicon, robots.txt, llms.txt, og/
```

## Content & CMS

Alles wat de klant kan wijzigen staat als **JSON in `src/content/`**; templates renderen daar alléén uit. Tekst nooit hardcoden in een `.astro`. Herhalende items (reviews, SEO-pagina's) = één array-bestand. Losse paginatekst = één object-bestand per pagina onder `teksten/`.

De CMS-preview-brug staat in `Base.astro` (`cms-denhaag.vercel.app/preview-bridge.js`).

## Design

- **Type:** Playfair Display (display) + Mulish (body), zelf-gehost via `@font-face` in `global.css`.
- **Kleur:** warm crème/champagne, gedempt antiekgoud, warmbruin/ink. Tokens als CSS-variabelen in `:root`.
- **Heroes (`PageHero.astro`):** drie modi: `image` (full-bleed sfeerbeeld, `tint="warm"|"cool"`), `portrait` (Angela naast de titel, voor persoonlijke pagina's), of crème-editorial (geen beeld). Zet `darkHero` op `Base` bij een donkere beeld-hero; anders staat de nav meteen solid.
- **Fotografie:** echte foto's. Angela's eigen portretten (`angela-warm`, `angela-candid`, `angela-werk`, `angela-bureau`, `angela-toga`) op de persoonlijke pagina's; haar Instagram-beelden via `foto()` uit `src/lib/fotos.ts`. Geen AI-stock.
- **Animatie:** GSAP (ScrollTrigger, SplitText) voor reveals (`.reveal`, `.reveal-rule`, `[data-img-reveal]`, `[data-parallax]`), hero-entree en het trouwboek; CSS voor `.ph-en`. Alles respecteert `prefers-reduced-motion`.
- **Paginaovergangen:** Astro View Transitions (`<ClientRouter>`).

## Conventies & valkuilen

- **Nooit em-dashes** in code/copy/commits.
- **Scoped CSS raakt geen child-componenten.** Stijl beelden in `<Image>` via de wrapper met `:global(img)`. Zet `aspect-ratio` op de wrapper, niet op de `<img>`.
- **Selectors met een class op `<html>`/`<body>`** (zoals `.js`) in een scoped `<style>` moeten `:global(...)` gebruiken, anders worden ze meegescoped en matchen ze niet.
- **Scripts en View Transitions:** init-logica MOET in een functie die op `astro:page-load` draait (vuurt bij eerste load én na elke transition). Window-listeners opruimen met een `AbortController` per page-load, anders leaken ze per navigatie. Zie `Base.astro`, `Nav.astro`, `index.astro`, `contact.astro`.
- **Reveals achter `html.js`:** een inline head-script zet de `js`-class; zonder JS is alle content gewoon zichtbaar.
- **Pexels/foto's met EXIF** laten sharp 500 geven (lege hero in dev). EXIF strippen: `sips -s format jpeg <file> --out <file>`.

## SEO & analytics

Per pagina: meta + Open Graph + JSON-LD (Service / Person / Review / FAQPage). `@astrojs/sitemap` genereert de sitemap; `robots.txt` en `llms.txt` staan in `public/`. Cookie-consent in `Base.astro` laadt Google Analytics pas ná akkoord, naast cookieloze Vercel Web Analytics.

## Stand van zaken (29 september 2026)

**Live (29 september 2026, commit `12b9a7d` op `main`):** de volledige Instagram-update, dus Angela's eigen beeld in de hele site, de filmische hero, het trouwboek en de feedbackrondes hieronder. Vercel-project `angela-ceremonies-v2`. Deze map is de bron van waarheid; de mappen in `~/Case studies/angela-ceremonies*` zijn alleen ontwerpstudies. DNS staat bij Wix (A `@` en `www` naar `76.76.21.21`, SPF `-all`, DMARC `p=reject`); Wix kan geen CAA en geen DNSSEC. `HANDOFF.md` is verouderd (stand juni), deze file is leidend.

**Wat de Instagram-update bevat:**
- Alle 37 beelden van @angela_ceremonies in de hoogste resolutie die Instagram levert staan in `../02 Beeld/instagram-2026-09-29/origineel` (met `instagram.json`: bijschriften, datums). Opgeknapt met `opknappen.py` (OpenCV EDSR-superresolutie, lichte CLAHE, zachte verscherping), naar de site gezet met `naar-site.py` in `src/assets/instagram/`.
- Beeldkeuze is content: `src/content/fotos.json` (alt, fotograaf, `watermerk`) en per pagina een `beeld: { bron, focus }` in de JSON. `src/lib/fotos.ts` levert `foto(sleutel)`. Fotocredits staan niet meer op de site; de fotograafdata blijft in `fotos.json` voor de rechten.
- Homepage: hero is een filmische montage (`../02 Beeld/hero-wereldmuseum-2026-09-29/`, `montage.py` + `shots.json`, `afronden.py`). Daarna statement, "Hi, ik ben Angela", de donkere cijferband (tellers plus een marquee die op scrollsnelheid reageert, `home.cijfers` en `home.marquee`), het trouwboek, diensten en de rest.
- Trouwboek: hoogte afgeleid van de viewport via een container query op `.tb-stage` (`--tb-h: calc(100cqh - kop - onderschrift)`), dus altijd in één scherm op desktop (gemeten 1024x768 tot 1920x1080). Elke kaart heeft plaats, titel en tekst, teller "01 / 07" en voortgangsbalk (ook bij swipen op mobiel).
- Hover door de hele site: knoppen vullen van onder (`::before`, `--fill`/`--fill-fg` per variant, in donkere secties per sectie overschreven), tekstlinks tekenen hun onderstreping, beelden zoomen en kleuren warm (`scale` en `filter` op de `img`, globaal in `global.css`), kaarten tillen (`translate`), primaire CTA's zijn magnetisch op `pointer: fine` (`initMagnetic` in `Base.astro`).
- GSAP: titelmasker en scroll-fade in de hero, woord-voor-woord statement (SplitText), tellers, clip-path-onthulling voor elk `[data-img-reveal]`, `[data-parallax]`, parallax op paginaheroes (schaal 1.08). Alles via `gsap.matchMedia` met reduced-motion.
- Paginaheroes: `darkHero` op elke pagina met een beeldhero (transparante navigatie), beeldhero op desktop `clamp(560px, 76vh, 820px)` hoog, focus per pagina afgesteld.

**Juridisch nog open (Ruud zette bewust live zonder):** toestemming van de fotografen (Merel Shoot It, KAT Films, FoR Fotografia) en van de stellen die herkenbaar of bij naam in beeld zijn (Devika & Shivam, Leonardo & Evelien), liefst via Angela. Vraag KAT Films om versies zonder watermerk. De namen "Merel Shoot It" en "FoR Fotografia" zijn afgeleid van hun Instagram-handle en watermerk.

**Lessen:**
- De Higgsfield/ByteDance-opschaler is generatief en verandert gezichten (Angela werd een ander persoon). Voor echte mensen alleen getrouwe opschaling (EDSR via `opencv-contrib`).
- Kling beweegt de camera tenzij je expliciet "locked-off, no zoom, pan or tilt" vraagt; zonder dat zwaait een heen-en-terug-loop. Meet beweging in een stilstaand hoekje van het beeld, niet alleen gemiddeld.
- Gezichten liever niet door AI laten animeren: Ken Burns over de echte foto houdt ze exact.
- Een echte stel-foto naast de review van een ánder stel suggereert dat zij die review schreven. Bij reviews alleen beelden van Angela zelf of zonder herkenbaar stel.
- Kling met hetzelfde begin- en eindbeeld beweegt nauwelijks; geen ffmpeg of Homebrew op deze Mac (gebruik `../02 Beeld/venv` met imageio-ffmpeg); Playwright-Chromium speelt geen H.264, video-QA via de Playwright-MCP.
- Brede posters met `object-fit: cover` hebben een `sizes` nodig die de echte weergavebreedte geeft (`max(100vw, 178vh)` bij 16:9).

**Feedback Ruud 29 september 2026:** alle punten afgerond (credits weg, rustiger reviewbeelden, formulier in één viewport, cijferband, trouwboek, hover-interacties, heroes nagelopen).

**Livegangcheck 29 september 2026** (rapporten in `../06 Livegang/livegang-voor-2026-09-29.md` en `livegang-na-2026-09-29.md`). Gerepareerd: SEO-titels binnen 60 tekens, horizontale scroll op contact, tikvlakken 44px, menu met Escape en scrollslot, CMS-brug alleen in een iframe, cookiebalk niet meer over de heroknop, CSP afgedwongen. Nog open, wachtend op Ruud:
1. Formuliertest: formulier staat aan met ontvanger Angela maar is nooit getest.
2. Klantaccount: site hangt aan Ruuds account; Angela heeft al een account (kamangre@hotmail.com, voor Enjoy the Breeze).
3. Astro 7 en sharp 0.35 (npm audit critical en high, alleen via major).
4. LCP homepage 4,1 s mobiel: de herovideo telt als LCP en vloeit pas in na `load`.
5. Vercel Web Analytics staat uit; CAA en DNSSEC kunnen niet bij Wix; Search Console-sitemap niet ingezien.

**Lessen uit de livegangcheck:**
- GSAP laat inline `translate: none` en `transform` achter op alles wat het animeert, waardoor CSS-hover op `.reveal`-elementen nooit werkte. De reveal ruimt nu op (`toonDefinitief` in `Base.astro`, class `is-shown`).
- Een `<input>` heeft een intrinsieke minimumbreedte; in een grid naast elkaar altijd `minmax(0, 1fr)` en `min-width: 0`.
- De Astro-dev-server pakt wijzigingen in JSON en scoped CSS niet altijd op; bij twijfel schoon herstarten voor je meet.
- Turnstile geeft fout 110200 op localhost en previews; alleen op angelaceremonies.com te testen.

## Openstaande TODO's (vóór echt productie-compleet)

- Nog één Pexels-sfeerbeeld (`ring-exchange.jpg`, geloften vernieuwen op `/trouwen`) en de Curaçao-beelden op `/trouwlocatie`; vervangen zodra er eigen beeld is. De kostenpagina heeft sinds 29 september Angela in het Wereldmuseum.
