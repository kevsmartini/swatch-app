---
name: Swatch
description: A mercer's shade card for pairing the colours of your own clothes.
colors:
  ground: "#EEE7DA"
  stock: "#F8F4EC"
  ink: "#2A2420"
  ink-2: "#6B5D50"
  rule: "rgba(42, 36, 32, 0.16)"
  rule-strong: "rgba(42, 36, 32, 0.32)"
  gilt: "#7A5C17"
  mannequin: "#DDD3C3"
  mannequin-2: "#B9AC98"
typography:
  display:
    fontFamily: "Gloock, Iowan Old Style, Georgia, serif"
    fontSize: "clamp(2.125rem, 10vw, 3.25rem)"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: "-0.02em"
  wordmark:
    fontFamily: "Gloock, Iowan Old Style, Georgia, serif"
    fontSize: "1.75rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Gloock, Iowan Old Style, Georgia, serif"
    fontSize: "1.5rem"
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: "-0.005em"
  numeral:
    fontFamily: "Gloock, Iowan Old Style, Georgia, serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1
  title:
    fontFamily: "Figtree, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 600
    lineHeight: 1.5
  body:
    fontFamily: "Figtree, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
    fontFeature: "tnum"
  hint:
    fontFamily: "Figtree, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Figtree, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.25
  shade-number:
    fontFamily: "Figtree, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 500
    lineHeight: 1
    fontFeature: "tnum"
rounded:
  none: "0px"
spacing:
  band-gap: "4px"
  xs: "6px"
  sm: "8px"
  md: "12px"
  lg: "14px"
  xl: "16px"
  section: "40px"
  page: "clamp(16px, 4.5vw, 28px)"
components:
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.hint}"
    rounded: "{rounded.none}"
    padding: "0 16px 0 12px"
    height: "44px"
  button-outline-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.stock}"
  tab:
    backgroundColor: "transparent"
    textColor: "{colors.ink-2}"
    typography: "{typography.title}"
    padding: "0 10px"
    height: "44px"
  tab-selected:
    textColor: "{colors.ink}"
  band:
    rounded: "{rounded.none}"
    height: "56px"
    typography: "{typography.label}"
  band-carta:
    height: "52px"
  band-classic:
    height: "72px"
  tab-band:
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "9px 10px 8px"
  card-stock:
    backgroundColor: "{colors.stock}"
    rounded: "{rounded.none}"
    padding: "20px clamp(14px, 4vw, 24px)"
  classic-row:
    backgroundColor: "{colors.stock}"
    rounded: "{rounded.none}"
    padding: "12px clamp(12px, 3.5vw, 18px) 12px 12px"
---

# Design System: Swatch

## Overview

**Creative North Star: "The Mercer's Shade Card"**

Swatch is printed, not rendered. The screen is a sheet of bone card stock with lighter card panels laid on it, printed in one sepia ink, with a single gilt reserved for the owner's classics. Every garment colour is a flat, square-cornered band with its shade number (Nº 01 to 18) printed in small tabular figures on the band itself, filed by family the way a thread card is. Choosing a colour pulls its companions into matching strips; the colour field is the control, and nothing around it is allowed to tint, shade or frame it.

Density is that of a reference card: tight 4px gutters between bands, generous 40px breathing between blocks, hierarchy carried by type scale alone (a large Gloock serif against small Figtree UI text) rather than by weight, colour or chrome. State is a printed mark inside the cell, never a lift or glow: a ring for the selected band, a ✓ stroke for owned colours, a ★ in gilt for a classic. Motion is mechanical and short: an underline that draws, strips that slide 6px into place, and a real vertical-axis flip when top and bottom trade places on the figure.

The world rejects the category default of round colour dots on white cards with drop shadows and a bottom sheet.

**Key Characteristics:**
- Bone ground, lighter stock panels, one sepia ink, one gilt.
- Flat bands, zero radius, no drop shadows; inset hairlines only where a pale swatch would vanish.
- Shade numbers printed on the band in the band's own contrasting ink.
- Serif display for names and headings, sans for everything operable.
- State drawn as printed marks inside the cell.

## Colors

A warm, low-chroma paper-and-ink palette whose only job is to stay out of the way of the garment colours.

### Primary
- **Sepia Printing Ink** (ink): all primary text, hairline rules, the outline button, the tab underline, the selected ring on pale bands, the focus outline. Also the inverted fill of the button on hover.

### Secondary
- **Printed Gilt** (gilt): reserved for the owner's classics only: the ★ mark, the "Tus clásicos" group title, and the "Uno de tus clásicos" verdict.

### Neutral
- **Bone Card** (ground): the page, the sticky masthead, the theme colour of the installed app.
- **Light Card Stock** (stock): the panels that carry content: the stage, the shade card, the classic rows. Also the light ink printed on dark bands.
- **Faded Ink** (ink-2): secondary text, hints, family labels, unselected tabs, the "why" note on each group.
- **Hairline Rule** (rule): dividers under the masthead and group headings, the 60-30-10 frame, and the inset filete on pale bands.
- **Strong Hairline** (rule-strong): the stroke around garment shapes on the silhouette.
- **Mannequin** (mannequin) and **Mannequin Shadow** (mannequin-2): the figure's body and shoes, and the empty fallback fill of a band; mannequin-2 also tints the scrollbar thumb.

The 18 garment colours (Azul marino, Camel, Burdeos and the rest) live in `scripts.js` as content data, not as design tokens. They are never used for chrome.

### Named Rules
**The Colour Is Content Rule.** Garment colours appear only inside bands, strips, the silhouette and the 60-30-10 bar. The chrome is ground, stock, ink and rule; nothing else.

**The One Gilt Rule.** Gilt marks the owner's own classics and nothing else. If it is not a classic, it is printed in ink.

**The Printed-On Ink Rule.** Text on a band is set in whichever of ink or stock has the higher contrast against that band, computed per colour (the `--on` value). Never pick band text colour by hand.

## Typography

**Display Font:** Gloock (with Iowan Old Style, Georgia, serif)
**Body Font:** Figtree, variable 400 to 600 (with system-ui, -apple-system, Segoe UI, sans-serif)

**Character:** A high-contrast bookish serif for names, as if letterpressed on the card's title strip, against a plain humanist sans for every label and control. Both are self-hosted Latin subsets.

### Hierarchy
- **Display** (Gloock 400, clamp 2.125rem to 3.25rem, 0.98, -0.02em, balanced wrap): the chosen colour's name on the stage. One per screen.
- **Wordmark** (Gloock 400, 1.75rem, 1): "Swatch" in the masthead.
- **Headline** (Gloock 400, 1.5rem, 1.15): block titles such as "La carta", "Mis clásicos", "La regla 60-30-10".
- **Numeral** (Gloock 400, 1.25rem): the ordinal of each classic row.
- **Title** (Figtree 600, 0.9375rem): suggestion group titles; Figtree 500 at the same size for tabs and classic names.
- **Body** (Figtree 400, 15px, 1.5, tabular figures): running text, max 60ch.
- **Hint** (Figtree 400, 0.875rem, ink-2): the line under each block title, the stage verdict, the free-colour result (max 34ch).
- **Label** (Figtree 400 or 600, 0.8125rem, 1.25): band names, Arriba/Abajo bands, group notes; 0.75rem inside the shade card.
- **Shade number** (Figtree 500, 0.6875rem, 1, tabular): the Nº printed in the bottom-left of a band.

### Named Rules
**The Scale Not Weight Rule.** Hierarchy comes from the jump between serif display sizes and small sans labels. Serif text is always weight 400; sans never goes above 600.

**The Tabular Figures Rule.** Every number is tabular (set on body), so shade numbers and ordinals align like a printed index.

## Layout

Mobile-first single column. Page inset is fluid (clamp 16px to 28px) and shared by masthead and main. The masthead is sticky on bone with a hairline under it: wordmark left on the baseline, text tabs right.

The Combinar panel stacks the stage card, then a workbench of blocks 40px apart (suggestions, the shade card with the free-colour row, the 60-30-10 note). Inside the stage the figure takes about a third (minmax 104px, 34%) beside the name column. Suggestion strips are auto-fill grids of bands at least 76px wide, with 4px between columns and 12px between rows. The shade card is one row per family: five equal band columns, with the family label spanning the row on phones and becoming a 5.5rem leading column from 560px. Band names reserve two lines on phones so every row stays the same height.

From 900px, main caps at 1180px centred; Combinar becomes two columns (stage 320 to 400px, then the workbench, 48px gap) and the stage turns sticky (top 92px), centred, with the figure up to 200px wide. Mis clásicos caps at 720px.

**The Band Gap Rule.** Bands that belong together sit 4px apart, never more; space larger than that means a different group.

## Elevation & Depth

Flat. Depth is paper laid on paper: lighter stock panels on the bone ground, with no drop shadow anywhere. The only `box-shadow` values in the system are inset printed lines inside a cell, which are marks, not elevation.

### Shadow Vocabulary
- **Pale filete** (`box-shadow: inset 0 0 0 1px var(--rule)`): on bands, Arriba/Abajo bands, classic bands, the colour input and the 60-30-10 bar, whenever a pale swatch would disappear into the stock.
- **Selected ring** (`box-shadow: inset 0 0 0 3px var(--c), inset 0 0 0 4.5px var(--on)`): the selected band. A 1.5px ring in the band's own contrasting ink, inset 3px from the edge.

### Named Rules
**The Printed Mark Rule.** Depth and state are printed inside the cell (inset hairline, inset ring, stroke mark), never cast outside it. If it lifts, glows or casts, it is not this world.

## Shapes

Every surface is rectangular with zero radius: bands, panels, buttons, the colour input's swatch (its native rounding is reset to 0). Borders are 1px sepia hairlines used as rules (under the masthead, under group headings, above the 60-30-10 note) or as the outline of the single button. The only curves belong to the figure: the silhouette's head, hands and shoes, and the drawn ★ and ✓ marks, all inline SVG.

**The Square Card Rule.** Radius is 0 everywhere in the interface. A round swatch is the category default this world refuses.

## Components

### Buttons
Printed and plain: an outline in ink that fills solid on touch.
- **Shape:** square corners (0px), 1px ink border, 44px minimum height.
- **Outline (Invertir):** transparent, ink text at 0.875rem/500, 8px gap to an 18px stroked SVG icon (1.5px, round caps), padding 0 16px 0 12px.
- **Hover / Active / Focus:** fills ink with stock text over 160ms; presses down 1px; focus is a 2px ink outline offset 3px.

### Tabs (Navigation)
- **Style:** bare text tabs in the masthead, Figtree 500 at 0.9375rem, ink-2 at rest, 44px tall.
- **Selected / Hover:** ink text; selected draws a 1.5px ink underline that scales in from the centre over 240ms.

### Colour Band (Signature Component)
The atom of the card. A button whose whole surface is the colour.
- **Field:** a flat block of the garment colour, 56px tall in strips, 52px in the shade card, 72px for classics. No radius, no border; the pale filete only when luminance is high.
- **Shade number:** printed bottom-left (6px, 4px) in the band's contrasting ink, 0.6875rem tabular.
- **Name:** under the field, 0.8125rem ink (0.75rem in the card); underlines on hover.
- **Selected:** the inset ring, the number nudges inward to clear it, and the name goes 600.
- **Owned (phase 2):** a 12px stroked ✓ top-right in the band's ink.

### Arriba / Abajo Bands
Two full-width bands under the stage name showing the current top and bottom garment, each filled with its colour: position label left (400), "Nº 03 · Azul marino" right (600), 0.8125rem. Background and ink cross-fade over 320ms.

### Cards / Containers
- **Corner Style:** square (0px).
- **Background:** stock on ground.
- **Shadow Strategy:** none (see Elevation & Depth).
- **Border:** none.
- **Internal Padding:** stage 20px by clamp(14px, 4vw, 24px), 28px on wide screens; shade card 16px by clamp(12px, 3.5vw, 20px).

### Suggestion Group
A title in Figtree 600 (gilt with a ★ for classics) and an optional right-aligned ink-2 "why" note, over a hairline rule, then a strip of bands. Strips enter by sliding 6px from the left with a 30ms stagger, capped at 120ms.

### Classic Row
A full-width stock button: a Gloock ordinal in ink-2 in a 2.25rem column, then the pair as equal flex bands 48px tall with 4px between, the name in Figtree 500 below, and an ink-2 note for group classics.

### Inputs / Fields
- **Colour picker:** the native colour input sized as a band (76 by 52px), square, with the pale filete; its label sits below in Figtree 600 at 0.8125rem, and the nearest-colour result sits beside it.

### Silhouette
An inline SVG figure in mannequin tones whose top and bottom garments are hard halves filled with the chosen colours, each stroked in rule-strong. Fills cross-fade over 320ms. Invertir closes both garments on their vertical axis (scaleX to 0, 180ms ease-in) and reopens them swapped (260ms ease-out).

## Do's and Don'ts

### Do:
- **Do** print every colour as a flat, square band with its shade number on it, and always set its name next to it.
- **Do** compute band ink per colour (ink or stock, whichever contrasts more) and add the inset 1px rule filete when a swatch is pale.
- **Do** show state as a mark inside the cell: the inset ring for selected, a stroked ✓ for owned, a gilt ★ for a classic.
- **Do** keep bands in a group 4px apart and separate blocks by 40px.
- **Do** keep touch targets at least 44px tall.
- **Do** honour reduced motion: every transition and animation collapses to 1ms.

### Don't:
- **Don't** round any corner of the interface (radius 0px everywhere).
- **Don't** cast drop shadows or lift surfaces; inset printed lines are the only shadow syntax.
- **Don't** use gilt for anything but the owner's classics.
- **Don't** put garment colours into chrome (backgrounds, borders, text).
- **Don't** set a serif in anything but weight 400, or use emoji or font glyphs for marks; ★, ✓ and icons are inline SVG.
