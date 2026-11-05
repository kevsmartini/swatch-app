# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Static HTML, CSS and vanilla JS (no frameworks, no backend). Separate files: index.html, styles.css, scripts.js, manifest.json, service-worker.js. Installable PWA, offline-capable, hosted on GitHub Pages. Persistence in localStorage, always wrapped in try/catch.

## Users

One person: the owner. Personal tool, written in second person ("tu armario", "tus clásicos"). Primary scene: at home, getting dressed, holding one garment and deciding what goes with it.

## Product Purpose

Pick the colour of a garment and see which colours go with it, drawn from the owner's own rules first (their classic pairings), then from neutrals, tone-on-tone, complementary and analogous colours. Later: restrict to what is already in the wardrobe.

## Positioning

It is not a generic colour-wheel tool. Suggestions are ranked by the owner's personal classics first; colour theory only fills in after.

## Operating Context

- Used on a phone, at home, one garment in hand.
- The preview silhouette (top + bottom painted) is the protagonist: it answers "how will this look on me".
- Palette of 18 named clothing colours with hex values (see scripts.js data), each flagged neutral or not, grouped into six families.
- 15 personal classic pairings, the last one a group (beis, crema, marfil, piedra among themselves).

## Capabilities and Constraints

- Phase 1 (MVP): palette grid → grouped suggestions; free colour picker mapped to nearest palette colour (RGB distance); SVG silhouette preview with swap and ★ when it is a classic; "Mis clásicos" tab that loads a pair into the preview; 60-30-10 rule note.
- Phase 2: "Lo tengo" per colour with ✓ in the grid; "Solo lo que tengo" filter; user-added classics and colours.
- Phase 3: pick colour from a photo (canvas pixel read); saved named outfits; occasion (trabajo, casual, salir) and season filters.
- Suggestion order is fixed: classics → neutrals by luminance contrast → same family → complementary (±55°, non-neutrals only) → analogous (10°–60°, non-neutrals only).
- Spanish only. Mobile-first.

## Brand Commitments

- Name: Swatch.
- Brief-pinned aesthetic: editorial and warm; bone background, light cards, serif for headings, sans for body text.

## Evidence on Hand

The palette and the classic pairings in the brief are the real content. No other assets exist; no imagery is required.

## Product Principles

1. The colour itself is the content: nothing in the chrome (backgrounds, borders, shadows) may distort how a swatch reads.
2. The owner's rules outrank theory, visibly.
3. Show, don't explain: the answer should be legible as colour without reading paragraphs.
4. Nothing hidden: every function is reachable by a visible control, no gesture-only features.
5. It must not look like a generic template app.

## Accessibility & Inclusion

Colour names always accompany swatches (never colour alone). Touch targets sized for one-handed phone use.
