# Hero als filmopening

23 september 2026. Goedgekeurd door Ruud in de sessie van die dag (richting C uit drie).

## Waarom

De huidige hero is veilig en inwisselbaar: een stockstel onder een donkere laag, een gecentreerde
serif-kop en een gouden knop die op de foto wegvalt. De navigatieknop is alleen een lijn, op mobiel
ontbreekt hij, en de scroll-indicator staat tegen de knop aan. De sterrenregel is te klein en te
licht om te lezen.

## Richting

De hero opent als een film: een stil, bewegend ceremoniemoment over het hele scherm, de titel als
filmtitel linksonder en een aftiteling rechtsonder. Referentie voor structuur en ritme: Ethan W
Photography uit de inspiratiebibliotheek (`20260917-ethanwong-photography-6505`). Kleur, typografie
en tekst blijven van Angela Ceremonies (Playfair Display, Mulish, crème en goud).

## Opbouw

Desktop:

- Hero vult `100svh` (minimaal 640px). Achtergrond is een stille videoloop met de still als poster.
- Filmkorrel als subtiele laag erover. Geen donkere laag over het hele beeld; alleen een verloop
  linksonder achter de tekst, en een lichte strook bovenaan achter de navigatie.
- Linksonder: titel "Jullie liefde," met daaronder *in mijn woorden* in cursief goud, tot ongeveer
  7,5rem. Eén korte zin eronder, dan de knop.
- Rechtsonder: aftiteling in kapitalen, rechts uitgelijnd, vier regels: ROTTERDAM, SINDS 2018,
  490+ STELLEN, en ★ 5,0 · 18 LIEVE WOORDEN als link naar `/lieve-woorden`.
- Opening: twee zwarte filmbalken boven en onder schuiven bij het laden open (ongeveer 0,9s), daarna
  komen titel en aftiteling binnen. Onder `prefers-reduced-motion` staat alles direct op zijn plek en
  zijn er geen balken.
- De scroll-indicator vervalt.

Mobiel (onder 720px):

- Video staand bijgesneden op het focuspunt van het moment (`object-position` uit de content).
- Aftiteling wordt één regel boven de titel. Titel onderaan, knop over de volle breedte.

## Knoppen

- Hero-knop: massief crème met donkere tekst, 56px hoog, pijl erachter; hover naar goud.
- Navigatieknop "Plan een kennismaking": gevuld in plaats van een lijn. Crème met donkere tekst op
  de transparante balk, donker met crème tekst op de vaste balk.
- Mobiel: compacte knop "Kennismaken" naast het menu, zichtbaar in de balk.
- Eis: alle tekst in de hero en de knoppen halen minimaal 4,5:1 contrast, gemeten tegen het
  donkerste en het lichtste punt van het beeld achter die tekst.

## Beeld en video

- Drie tot vier brede 21:9-stills, gegenereerd met Higgsfield Soul 2.0 voor deze plek, met ruimte
  linksonder voor de titel. Ruud kiest er één.
- Van die still een loop van 5 tot 8 seconden met subtiele beweging (sluier, blaadjes, licht), via
  Higgsfield image-to-video.
- Levering: MP4 (H.264) en WebM, samen onder 2,5 MB voor desktop, een kleinere staande versie voor
  mobiel. `muted autoplay loop playsinline`, `preload="none"` tot de poster staat.
- De poster (AVIF/WebP via `astro:assets`) is het LCP-element, niet de video.
- Geen video bij `prefers-reduced-motion: reduce` of `navigator.connection.saveData`; dan blijft de
  still staan. De video pauzeert als de hero uit beeld is (IntersectionObserver).
- Het is een sfeerbeeld. Het staat nergens naast een echte review of naam.

## Content

In `src/content/home.json` onder `hero`: titel, accent, zin, knop, poster, video (desktop en
mobiel), focuspunt, alt-tekst en de aftiteling als lijst. De sterrenregel komt uit de bestaande
velden `rating` en `ratingHref`. Niets hardcoded in de template.

## Controle

- Playwright op 1440, 390 en 430 breed: geen horizontale scroll, knop in beeld zonder scrollen,
  aftiteling leesbaar, menu en compacte knop werken.
- Contrast gemeten met computed styles plus pixelsampling op het beeld.
- LCP is de poster; de video start pas daarna.
- Eerst op branch `hero-film` met Vercel-preview. Pas na akkoord van Ruud naar `main`.
