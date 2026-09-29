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

**Live:** V3.1 met de kas-hero op https://angelaceremonies.com (branch `main`, Vercel-project `angela-ceremonies-v2`). Deze map is de bron van waarheid; de mappen in `~/Case studies/angela-ceremonies*` zijn alleen ontwerpstudies. DNS staat bij Wix (A `@` en `www` naar `76.76.21.21`, SPF `-all`, DMARC `p=reject`); Wix kan geen CAA.

**Branch `instagram-fotos` (preview, nog niet op productie):** Angela's eigen Instagram-beelden in de hele site.
- Alle 37 beelden van @angela_ceremonies in de hoogste resolutie die Instagram levert staan in `../02 Beeld/instagram-2026-09-29/origineel` (met `instagram.json`: bijschriften, datums). Opgeknapt met `opknappen.py` (OpenCV EDSR-superresolutie, lichte CLAHE, zachte verscherping), naar de site gezet met `naar-site.py` in `src/assets/instagram/`.
- Beeldkeuze is content: `src/content/fotos.json` (alt, fotograaf, `watermerk`) en per pagina een `beeld: { bron, focus }` in de JSON. `src/lib/fotos.ts` levert `foto(sleutel)`. Credit per foto via `Credit.astro`, behalve bij een zichtbaar watermerk; alle fotografen staan in de footer.
- Homepage: hero is een filmische montage (`../02 Beeld/hero-wereldmuseum-2026-09-29/`, `montage.py` + `shots.json`, `afronden.py`): een Kling-shot met vaste camera van de Wereldmuseum-foto, daarna Ken Burns over echte foto's, één grading, overvloeiers, naadloze loop. Nieuw horizontaal "trouwboek" (GSAP-pin op desktop, swipe op mobiel). Over mij kreeg "Achter de schermen".
- GSAP: titelmasker en scroll-fade in de hero, woord-voor-woord statement (SplitText), tellers, clip-path-onthulling voor elk `[data-img-reveal]`, `[data-parallax]`, parallax op paginaheroes. Alles via `gsap.matchMedia` met reduced-motion.

**Voor productie nodig (juridisch):** toestemming van de fotografen (Merel Shoot It, KAT Films, FoR Fotografia) en van de stellen die herkenbaar of bij naam in beeld zijn (Devika & Shivam, Leonardo & Evelien), liefst via Angela. Vraag KAT Films om versies zonder watermerk. De namen "Merel Shoot It" en "FoR Fotografia" zijn afgeleid van hun Instagram-handle en watermerk.

**Lessen:**
- De Higgsfield/ByteDance-opschaler is generatief en verandert gezichten (Angela werd een ander persoon). Voor echte mensen alleen getrouwe opschaling (EDSR via `opencv-contrib`).
- Kling beweegt de camera tenzij je expliciet "locked-off, no zoom, pan or tilt" vraagt; zonder dat zwaait een heen-en-terug-loop. Meet beweging in een stilstaand hoekje van het beeld, niet alleen gemiddeld.
- Gezichten liever niet door AI laten animeren: Ken Burns over de echte foto houdt ze exact.
- Een echte stel-foto naast de review van een ánder stel suggereert dat zij die review schreven. Bij reviews alleen beelden van Angela zelf of zonder herkenbaar stel.
- Kling met hetzelfde begin- en eindbeeld beweegt nauwelijks; geen ffmpeg of Homebrew op deze Mac (gebruik `../02 Beeld/venv` met imageio-ffmpeg); Playwright-Chromium speelt geen H.264, video-QA via de Playwright-MCP.
- Brede posters met `object-fit: cover` hebben een `sizes` nodig die de echte weergavebreedte geeft (`max(100vw, 178vh)` bij 16:9).

**Feedback Ruud 29 september 2026, gedaan:** alle fotocredits weg (hero, overlays, footer; fotograafdata blijft in `fotos.json` voor de rechten), reviews Claire & Theo en Reza & Elaha met sfeerbeeld zonder mensen, tarieven-hero Zichtenburg, Den Haag-hero Zichtenburg-bruidspaar, Over mij-bio nu Angela lachend achter de lessenaar, Contact uit het menu, alle kennismakingsknoppen (ook coaching, die een mailtje opende) naar `/contact#formulier`, formulier compacter en past in één viewport (gemeten 1440x900, 1280x720, 390x700), pagina scrollt zelf naar het formulier.

**Feedback Ruud, nog te doen (in deze volgorde):**
1. Cijfers (490+, 2018, heel NL) direct onder "Hi, ik ben Angela" en opnieuw ontwerpen met karakter; nu te standaard. Idee: donkere band met grote gouden italic cijfers, tellers, en een marquee van diensten/plaatsen die op scrollsnelheid reageert.
2. Trouwboek moet altijd volledig in één viewport passen (ook 1280x720 en 1366x768; onderschriften vielen weg) en professioneler: elke kaart een titel en tekst, teller "01 / 07", strakkere uitlijning. Hoogte afleiden van `100svh` min kop en onderschrift.
3. Hover-interacties door de hele site: knoppen met vulling, links met tekenende onderstreping, beelden zoom plus warme gloed, kaarten tillen, magnetische CTA's (alleen `pointer: fine`).
4. Alle paginaheroes en uitsneden nalopen op rare zooms (Ruud noemde tarieven; trouwen vindt hij heel goed).

**Daarna: livegang (opdracht Ruud).** Alles naar productie, met de volledige `/pre-livegang`-check over de hele site: formulier echt verzonden en zichtbaar in het dashboard, security-baseline, klantaccount voor Angela in het dashboard, SEO per pagina (titels, descriptions, canonicals, JSON-LD, sitemap, robots, llms.txt, Search Console), en een complete mobile-first-ronde op 390 breed. Let op: Ruud weet dat toestemming van fotografen en stellen nog niet binnen is en besluit zelf om live te gaan.

**Ook nog open:** klantaccount voor Angela, formuliertest (bewust uitgesteld), Search Console-sitemap, cookiebalk op mobiel valt over de hero-knop.

## Openstaande TODO's (vóór echt productie-compleet)

- Nog één Pexels-sfeerbeeld (`ring-exchange.jpg`, geloften vernieuwen en kostenpagina) en de Curaçao-beelden op `/trouwlocatie`; vervangen zodra er eigen beeld is.
