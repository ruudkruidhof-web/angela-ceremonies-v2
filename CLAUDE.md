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

## Openstaande TODO's (vóór echt productie-compleet)

- **Google Analytics ID** invullen: `GA_ID` in het `<script>` van `Base.astro`.
- **Dashboard-meetscript** plakken in de `<head>` van `Base.astro` (placeholder-comment staat er). Bron: Sites-pagina van app.haagsebrandmerk.nl.
- **Contactformulier:** werkt nu via een `mailto`-fallback (opent mailclient) en is gemarkeerd met `data-hb-lead` voor de dashboard-leadtracker. Eventueel koppelen aan een form-endpoint.
- Pexels-sfeerbeelden zijn tijdelijk tot de echte fotoshoot; vervangbaar in `src/assets` + `src/content`.
