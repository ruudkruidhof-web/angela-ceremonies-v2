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
- **Fotografie:** echte foto's. Angela's eigen portretten (`angela-warm`, `angela-candid`, `angela-werk`, `angela-bureau`, `angela-toga`) op de persoonlijke pagina's; sfeerbeelden voor ceremonie-pagina's. Geen AI-stock.
- **Animatie:** scroll-reveals (`.reveal` / `.reveal-rule`, IntersectionObserver), hero-entree (`.ph-en`), subtiele parallax, reviews-carousel. Alles respecteert `prefers-reduced-motion`.
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

## Stand van zaken (28 september 2026)

**Live:** V3.1 (Charlotte de Moel-richting) plus de filmische hero draait op https://angelaceremonies.com via Vercel-project `angela-ceremonies-v2`, gedeployd vanaf `main` in deze map. Deze map is de bron van waarheid; de mappen in `~/Case studies/angela-ceremonies*` zijn alleen ontwerpstudies. DNS staat bij Wix (A `@` en `www` naar `76.76.21.21`, SPF `-all`, DMARC `p=reject`); Wix kan geen CAA.

**Achtergrond:** op 22 september 2026 claimde een vreemde GitHub Pages-repo het domein (DNS wees naar GitHub zonder verificatie) en zette er gokspam op. Hersteld; livegangrapport in `../06 Livegang/`.

**Al geregeld:** formulier naar het HB-endpoint met Turnstile (sitesleutel `hbf_0dfe80a4dd0ed935d4bdb9b5`, ontvanger Angela), meetscript met sessieopname (dashboard-site `c2da14c3-0d2f-469f-8e94-3568589de154`, voorlopig onder Ruuds account), GA `G-E9VJ29ZFM5` na consent, privacyverklaring, `/hindoestaanse-bruidsbeurs`, security-headers en `security.txt`, lettertypen zelf gehost.

**Hero:** ontwerp en plan in `docs/superpowers/`. Poster is het eerste frame van een 4K-clip (Higgsfield, Kling 3.0), video als naadloze loop (vooruit en daarna achteruit) in `public/video/`, eigen staande uitsnede voor mobiel. Bronbeelden in `../02 Beeld/hero-film-2026-09-23/`.

**Lessen:**
- Kling met hetzelfde begin- en eindbeeld beweegt nauwelijks. Geef alleen een beginbeeld en maak de loop zelf met ffmpeg (`split`, `reverse`, `concat`).
- Meet beweging en scherpte, kijk niet alleen: gemiddeld pixelverschil tussen frames, en een schermafdruk op `scale: device`.
- Geen ffmpeg of Homebrew op deze Mac: gebruik `pip install imageio-ffmpeg` in een venv (levert x264, VP9, AV1).
- De Chromium van Playwright speelt geen H.264. Video-QA via de Playwright-MCP (echte Chrome).
- Brede posters met `object-fit: cover` hebben een `sizes` nodig die de echte weergavebreedte geeft (`max(100vw, 252vh)`), anders kiest de browser een te kleine versie.

**Volgende sessie:** Instagram-foto's van Angela verwerken (rechten van fotografen en portretrecht van stellen eerst regelen, liefst originelen van Angela zelf) en de beste hero kiezen op basis van haar eigen beeld. Ook open: klantaccount voor Angela, formuliertest (bewust uitgesteld), Search Console-sitemap, cookiebalk op mobiel valt over de hero-knop.

## Openstaande TODO's (vóór echt productie-compleet)

- Pexels-sfeerbeelden zijn tijdelijk tot de echte fotoshoot; vervangbaar in `src/assets` + `src/content`.
