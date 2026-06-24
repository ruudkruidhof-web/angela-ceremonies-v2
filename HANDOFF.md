# Handoff, Angela Ceremonies (stand: einde sessie)

Korte overdracht zodat we de volgende sessie direct verder kunnen op **V3**.

## Versies (elke branch krijgt automatisch een Vercel-preview)

| Branch | Wat | Live |
| --- | --- | --- |
| `main` | V1, originele herbouw (productie) | https://angela-ceremonies-v2.vercel.app |
| `redesign-personal` | V2, Angela centraal, persoonlijker | preview per branch |
| `redesign-v3` | **V3, Charlotte de Moel-designtaal (HIER verder)** | https://angela-ceremonies-v2-nyeigfjms-ruudkruidhof-8096s-projects.vercel.app |

Productiedomein `angelaceremonies.com` is NIET gekoppeld (draait nog de oude site). Promoten = bewuste DNS-stap, pas op seintje.

## Wat V3 nu heeft (alleen de homepage)

Charlotte's designtaal vertaald naar ons crème/goud-palet:
- Full-bleed emotionele paar-hero (couple-hero.jpg) met lichte Playfair + gouden italic-accent + sterren-rating.
- "Zelf-geschreven" gevoel: lichte serif met italic accentwoorden en **vette nadruk** midden in zinnen, via `set:html` + de `.rich`-class.
- Foto-forward splits; een `.overlap`-panel (ink-bruin) dat over een foto valt; een visuele testimonial; edge-to-edge `.gallery-bleed`; video-sectie (placeholder); script-handtekening "Angela" (`--font-script` = Sacramento); sitewide WhatsApp-knop (in `Base.astro`).
- Echte warme Pexels paar-foto's (EXIF gestript!) + `PlaceholderImage` voor de shots die nog geschoten worden.

## V3.1, de volgende stap (door gebruiker gevraagd)

Concept-content staat al klaar in **`docs/home-v3.1-draft.json`** (kopieer naar `src/content/home.json` zodra `index.astro` is bijgewerkt). Doel:

1. **Meer Charlotte-beats op de homepage toevoegen:**
   - `vision`: "Warmte en oprechtheid, geen clichés" (zoals Charlotte's "liefde vieren met humor"), als overlap-panel.
   - `craft`: "Jullie verhaal vertellen, dat is mijn ding" + knop **Werkwijze & tarieven** (teaser, niet de volledige stappen).
   - `coaching` als volwaardige sectie (= Charlotte's "uitvaartspreker"-tweede-aanbod-beat).
   - "Hi, ik ben Angela" (over-teaser) blijft, met script-handtekening.
2. **Reviews anders, want nu dubbel** (carousel + losse testimonial eruit):
   - Vervang door **verdeelde review+foto-blokken** door de pagina heen, afwisselend review-links/foto-rechts.
   - **De foto mag groot en aanwezig zijn** (geen half-bedekkend panel meer). Tekst mag groot italic blijven.
   - Foto's: `couple-joy.jpg`, `couple-elegant.jpg` (nieuw, staat al in src/assets), `couple-beach.jpg`. Placeholders alleen voor Angela-specifieke shots.
   - Voorgestelde sectie-volgorde: hero, statement, video, review-blok A (foto links), vision (overlap), craft (split + werkwijze/tarieven-knop), Hi-ik-ben-Angela, diensten, review-blok B (foto rechts), coaching, momenten-galerij, cijfers, CTA.
   - Nog te bouwen in `index.astro`: een `.review-row` (grote foto + sterren + grote italic-quote + naam, afwisselend van kant).
3. **Daarna**: de V3-designtaal doortrekken naar de andere pagina's (over-mij, trouwen, werkwijze, ervaringen met foto's, FAQ).

## Nog nodig van Angela/gebruiker
- Echte **Google-reviewlink** (voor echte badge i.p.v. "18 lieve woorden").
- Eventueel een korte **introvideo** (voor de video-sectie).
- Echte **trouwfoto's** (Angela in actie, bruidsparen met Angela) voor de placeholders en review-blokken.

## Technische valkuilen (belangrijk)
- **Preview-MCP (Claude_Preview) toont de full-bleed hero grijs** (composit geen negatieve-z-index beeldlaag onder een scrim). Het beeld is correct. Verifieer met **Playwright**: `node /tmp/charlotte-study/shoot-ours.mjs` screenshot onze eigen localhost en rendert wél goed. (Charlotte-analyse + screenshots staan in `/tmp/charlotte-study/`.)
- **Pexels-foto's met EXIF** laten sharp/_image 500 geven (grijze/lege hero in dev). Altijd EXIF strippen: `sips -s format jpeg <f> --out <f>`.
- Astro scoped CSS raakt geen child-component-elementen: styl `<Image>` via wrapper + `:global(img)`. Class op `<html>` (zoals `.js`) in scoped style → `:global(.js) ...`.
- Cookiebar staat linksonder (niet gecentreerd) zodat de Astro dev-toolbar 'm niet overlapt; init bindt op first-load + na elke View Transition.

## Componenten & content
- `Base.astro` (head/SEO, ClientRouter, Nav/Footer, WhatsApp-float, cookie, fonts), `Nav.astro` (`forceSolid` op crème-pagina's via Base-prop `darkHero`), `PageHero.astro` (portrait/image/cream-modi), `CtaSection.astro`, `PlaceholderImage.astro`.
- Alle content als JSON in `src/content/` (CMS-klaar). Reviews: `reviews.json` (18 stuks). SEO-pagina's: `seo-paginas.json` + `[slug].astro`.

## TODO's voor productie (uit CLAUDE.md)
GA-ID invullen, dashboard-meetscript in `Base.astro` plakken, contactformulier eventueel aan een endpoint koppelen.
