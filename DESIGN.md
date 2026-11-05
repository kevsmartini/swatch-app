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
  ink-press: "#3D342E"
  ink-3: "#73665A"
  field: "#FFFDF8"
  alert: "#8E2A20"
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
  label-card:
    fontFamily: "Figtree, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.25
  input:
    fontFamily: "Figtree, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
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
  button-toggle:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.hint}"
    rounded: "{rounded.none}"
    padding: "0 16px 0 12px"
    height: "44px"
  button-solid:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.stock}"
    typography: "{typography.hint}"
    rounded: "{rounded.none}"
    padding: "0 18px"
    height: "44px"
  button-solid-hover:
    backgroundColor: "{colors.ink-press}"
  button-small:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.hint}"
    rounded: "{rounded.none}"
    padding: "0 14px"
  link:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.hint}"
  link-armed:
    textColor: "{colors.alert}"
  switch-track:
    backgroundColor: "transparent"
    rounded: "{rounded.none}"
    width: "40px"
    height: "22px"
  switch-track-on:
    backgroundColor: "{colors.ink}"
  switch-thumb:
    backgroundColor: "{colors.ink}"
    rounded: "{rounded.none}"
    size: "16px"
  switch-thumb-on:
    backgroundColor: "{colors.stock}"
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
  band-picker:
    height: "40px"
    typography: "{typography.shade-number}"
  text-field:
    backgroundColor: "{colors.field}"
    textColor: "{colors.ink}"
    typography: "{typography.input}"
    rounded: "{rounded.none}"
    padding: "0 12px"
    height: "44px"
  checkbox:
    backgroundColor: "{colors.field}"
    rounded: "{rounded.none}"
    size: "20px"
  checkbox-checked:
    backgroundColor: "{colors.ink}"
  form-error:
    textColor: "{colors.alert}"
    typography: "{typography.hint}"
  adder-toggle:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.title}"
    height: "52px"
  form-panel:
    backgroundColor: "{colors.stock}"
    rounded: "{rounded.none}"
    padding: "16px clamp(14px, 4vw, 20px) 18px"
  empty-state:
    backgroundColor: "{colors.stock}"
    rounded: "{rounded.none}"
    padding: "18px clamp(14px, 4vw, 20px) 16px"
  card-stock:
    backgroundColor: "{colors.stock}"
    rounded: "{rounded.none}"
    padding: "20px clamp(14px, 4vw, 24px)"
  classic-row:
    backgroundColor: "{colors.stock}"
    rounded: "{rounded.none}"
    padding: "12px clamp(12px, 3.5vw, 18px) 12px 12px"
  classic-row-hover:
    backgroundColor: "#FCFAF5"
  classic-remove:
    backgroundColor: "{colors.stock}"
    textColor: "{colors.ink-2}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 10px"
  classic-remove-armed:
    backgroundColor: "{colors.stock}"
    textColor: "{colors.alert}"
---

# Design System: Swatch

## Overview

**Creative North Star: "The Mercer's Shade Card"**

Swatch is printed, not rendered. The screen is a sheet of bone card stock with lighter card panels laid on it, printed in one sepia ink, with a single gilt reserved for the owner's classics and a rust reserved for errors and destructive confirmations. Every garment colour is a flat, square-cornered band with its shade number (Nº 01 to 18 for the base card, 19 and up for the owner's own colours) printed in small tabular figures on the band itself, filed by family the way a thread card is. Choosing a colour pulls its companions into matching strips; the colour field is the control, and nothing around it is allowed to tint, shade or frame it.

Density is that of a reference card: tight 4px gutters between bands, generous 40px breathing between blocks, hierarchy carried by type scale alone (a large Gloock serif against small Figtree UI text) rather than by weight, colour or chrome. State is a printed mark inside the cell, never a lift or glow: a ring for the selected band, a ✓ stroke for owned colours, a ★ in gilt for a classic, an ink frame round the whole card while the wardrobe is being marked. Motion is mechanical and short: an underline that draws, strips that slide 6px into place, and a real vertical-axis flip when top and bottom trade places on the figure.

The world rejects the category default of round colour dots on white cards with drop shadows and a bottom sheet.

**Key Characteristics:**
- Bone ground, lighter stock panels, one sepia ink, one gilt, one rust for errors.
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

### Tertiary
- **Rust Alert** (alert): errors and destructive confirmations only, always as text or line, never as a fill: the form error message, the border and inset line of an invalid text field, and an armed two-tap confirm (Quitar / Eliminar) in its second state.

### Neutral
- **Bone Card** (ground): the page, the sticky masthead, the theme colour of the installed app.
- **Light Card Stock** (stock): the panels that carry content: the stage, the shade card, the classic rows. Also the light ink printed on dark bands.
- **Pressed Ink** (ink-press): the hover fill of the solid ink button, a step lighter than ink so the press reads on an already-filled surface.
- **Faded Ink** (ink-2): secondary text, hints, family labels, unselected tabs, the "why" note on each group.
- **Example Ink** (ink-3): placeholder example text inside text fields ("Teja"), and nothing else; it sits under a printed label, never in place of one.
- **Field White** (field): the ground of text fields, selects and unchecked checkboxes, a shade whiter than stock so a writable area reads as blank paper.
- **Hairline Rule** (rule): dividers under the masthead and group headings, the 60-30-10 frame, and the inset filete on pale bands.
- **Strong Hairline** (rule-strong): the stroke around garment shapes on the silhouette, the border of text fields, selects and unchecked checkboxes, the outline of the Quitar button at rest, and the border of a disabled button.
- **Mannequin** (mannequin) and **Mannequin Shadow** (mannequin-2): the figure's body and shoes, and the empty fallback fill of a band; mannequin-2 also tints the scrollbar thumb.

The 18 garment colours (Azul marino, Camel, Burdeos and the rest) and the owner's own added colours live in `scripts.js` as content data, not as design tokens. They are never used for chrome.

### Named Rules
**The Colour Is Content Rule.** Garment colours appear only inside bands, strips, the silhouette and the 60-30-10 bar. The chrome is ground, stock, field, ink and rule, with rust for errors; nothing else.

**The One Gilt Rule.** Gilt marks the owner's own classics and nothing else. If it is not a classic, it is printed in ink.

**The Printed-On Ink Rule.** Text on a band is set in whichever of ink or stock has the higher contrast against that band, computed per colour (the `--on` value). Never pick band text colour by hand.

**The Rust Is Words Rule.** Rust is printed as text and line only (error copy, an invalid field's border, an armed confirm's text and border). It never fills a surface, and it means "something is wrong or about to be deleted", nothing else.

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
- **Label** (Figtree 400 or 600, 0.8125rem, 1.25): band names, Arriba/Abajo bands, group notes, form field labels (600), the Quitar button.
- **Card label** (Figtree, 0.75rem, 1.25): band names inside the shade card (with two lines reserved on phones) and the family labels at 600.
- **Input** (Figtree 400, 1rem): text typed into text fields and selects. Never smaller: 1rem is what stops iOS zooming into the field.
- **Shade number** (Figtree 500, 0.6875rem, 1, tabular): the Nº printed in the bottom-left of a band; the same size names the small bands of the combination picker.

The filter empty state's title uses Gloock 400 at 1.25rem/1.2, the numeral size.

### Named Rules
**The Scale Not Weight Rule.** Hierarchy comes from the jump between serif display sizes and small sans labels. Serif text is always weight 400; sans never goes above 600.

**The Tabular Figures Rule.** Every number is tabular (set on body), so shade numbers and ordinals align like a printed index.

## Layout

Mobile-first single column. Page inset is fluid (clamp 16px to 28px) and shared by masthead and main. The masthead is sticky on bone with a hairline under it: wordmark left on the baseline, text tabs right.

Below 900px (on screens taller than 560px) the stage is sticky under the masthead in a compact form: the figure at 76–104px wide, no "con …" line (the Arriba/Abajo bands already name the pair), and Lo tengo / Invertir side by side in two equal columns. A ground-coloured mat (a zero-offset spread in --ground, never a visible shadow) hides content scrolling past its sides and underneath, so the owner always sees the outfit while browsing the card. From 900px the stage becomes the sticky left column. The Combinar panel stacks the stage card, then a workbench of blocks 40px apart (suggestions, the shade card with the free-colour row, the 60-30-10 note). Inside the stage the figure takes about a third (minmax 104px, 34%) beside the name column. Suggestion strips are auto-fill grids of bands at least 76px wide, with 4px between columns and 12px between rows. The shade card is one row per family: five equal band columns, with the family label spanning the row on phones and becoming a 5.5rem leading column from 560px. Band names reserve two lines on phones so every row stays the same height. A family row only prints when it has members; the "Otros" row, last, holds the owner's own colours that fit no family.

Block headings that carry a control (the "Solo lo que tengo" switch, "Marcar mi armario") split title left and control right, bottom-aligned, wrapping beneath on narrow screens. Each adder sits under its block behind a hairline: a 52px disclosure row, then the form as a stock panel with 14px between fields. The combination picker is an auto-fill grid of small bands at least 52px wide, 4px apart.

From 900px, main caps at 1180px centred; Combinar becomes two columns (stage 320 to 400px, then the workbench, 48px gap) and the stage turns sticky (top 92px), centred, with the figure up to 200px wide. Mis clásicos caps at 720px.

**The Band Gap Rule.** Bands that belong together sit 4px apart, never more; space larger than that means a different group.

## Elevation & Depth

Flat. Depth is paper laid on paper: lighter stock panels on the bone ground, with no drop shadow anywhere. The only `box-shadow` values in the system are inset printed lines inside a cell, which are marks, not elevation.

### Shadow Vocabulary
- **Pale filete** (`box-shadow: inset 0 0 0 1px var(--rule)`): on bands, Arriba/Abajo bands, classic bands, the colour input and the 60-30-10 bar, whenever a pale swatch would disappear into the stock.
- **Selected ring** (`box-shadow: inset 0 0 0 3px var(--c), inset 0 0 0 4.5px var(--on)`): the selected band. A 1.5px ring in the band's own contrasting ink, inset 3px from the edge.
- **Armario frame** (`box-shadow: inset 0 0 0 1.5px var(--ink)`): the whole shade card while the wardrobe is being marked.
- **Switch track** (`box-shadow: inset 0 0 0 1px var(--ink)`): the outline of the square switch track.
- **Error line** (`box-shadow: inset 0 0 0 1px var(--alert)`): doubles the rust border of an invalid text field to 2px.

### Named Rules
**The Printed Mark Rule.** Depth and state are printed inside the cell (inset hairline, inset ring, stroke mark), never cast outside it. If it lifts, glows or casts, it is not this world.

## Shapes

Every surface is rectangular with zero radius: bands, panels, buttons, the switch's track and thumb, text fields, selects and checkboxes (their native appearance is removed), the colour input's swatch (its native rounding is reset to 0). Borders are 1px sepia hairlines used as rules (under the masthead, under group headings, above the 60-30-10 note) or as the outline of the single button. The only curves belong to the figure: the silhouette's head, hands and shoes, and the drawn ★, ✓, plus and select-chevron marks, all SVG (inline, or a data URI inside a form control).

**The Square Card Rule.** Radius is 0 everywhere in the interface. A round swatch is the category default this world refuses.

## Components

### Buttons
Printed and plain: an outline in ink that fills solid on touch.
- **Shape:** square corners (0px), 1px ink border, 44px minimum height.
- **Outline (Invertir):** transparent, ink text at 0.875rem/500, 8px gap to an 18px stroked SVG icon (1.5px, round caps), padding 0 16px 0 12px.
- **Hover / Active / Focus:** fills ink with stock text over 160ms; presses down 1px; focus is a 2px ink outline offset 3px.
- **Disabled:** rule-strong border, ink-2 text, no fill, no press.
- **Owned toggle (Lo tengo):** the outline button with a printed box in place of an icon: an empty 15px hairline square (1.25px stroke). Pressed (aria-pressed true) prints an ink ✓ inside the square (2.25px stroke) and sets the label at 600. It never turns into a block of ink; the state is the mark.
- **Solid (form submit):** ink fill, stock text, padding 0 18px; hover lifts to ink-press. One per form, for the action that writes.
- **Small (Marcar mi armario):** the outline button with tighter padding (0 14px), used beside a block title and in the empty state. It keeps the 44px floor. In armario mode its label becomes "Hecho".
- **Text link:** ink 0.875rem/500 with a 1px underline offset 3px that thickens to 2px on hover; quiet variant in ink-2 at 0.8125rem. Used for Cancelar, Guardar como clásico, Añadir este color, Ver todas las sugerencias.

### Two-Tap Confirm
Destructive actions (Quitar a classic, Eliminar a colour) ask twice, in place, with no dialog. The first tap arms the control: its text and border turn rust and its words change ("Confirmar", "Toca otra vez para eliminarlo"); there is no fill. A second tap within 3.5s executes; otherwise it disarms. The Quitar button is a stock-backed 0.8125rem/500 control (44px tall) with a 12px stroked cross, rule-strong border and ink-2 text at rest, ink on hover.

### Switch (Solo lo que tengo)
A square role=switch: a 40 by 22px track outlined in 1px ink with a 16px square ink thumb inset 3px. On, the track fills ink and the thumb turns stock and slides 18px right (220ms). Label in Figtree 500 at 0.875rem beside it, 10px gap, 44px tall.

### Tabs (Navigation)
- **Style:** bare text tabs in the masthead, Figtree 500 at 0.9375rem, ink-2 at rest, 44px tall.
- **Selected / Hover:** ink text; selected draws a 1.5px ink underline that scales in from the centre over 240ms.

### Colour Band (Signature Component)
The atom of the card. A button whose whole surface is the colour.
- **Field:** a flat block of the garment colour, 56px tall in strips, 52px in the shade card, 72px for classics. No radius, no border; the pale filete only when luminance is high.
- **Shade number:** printed bottom-left (6px, 4px) in the band's contrasting ink, 0.6875rem tabular.
- **Name:** under the field, 0.8125rem ink (0.75rem in the card); underlines on hover.
- **Selected:** the inset ring, the number nudges inward to clear it, and the name goes 600.
- **Owned:** a 12px stroked ✓ (2px) top-right in the band's ink, in every context where the band appears.
- **Custom colours:** the owner's own colours are bands like any other, filed in their family or in "Otros", with fixed shade numbers from 19 up that never renumber when others are added or removed.

### Armario Mode (Marcar mi armario)
The shade card becomes a checklist of the wardrobe. The card is framed in a 1.5px ink inset line; tapping a band toggles ownership instead of choosing it. Owned bands carry a larger ✓ (16px, 2.5px stroke) and no ring: in this mode the ring is suppressed (pale bands keep their filete) and the shade number returns to its resting place, because the ring means "chosen" and the ✓ means "owned".

**The Ring Means Chosen Rule.** The inset ring is only ever "this one is selected"; ownership is only ever the ✓. Never let one stand for the other.

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
A full-width stock button: a Gloock ordinal in ink-2 in a 2.25rem column, then the pair (or up to four colours) as equal flex bands 48px tall with 4px between, the name in Figtree 500 below, and an ink-2 note for group classics. Hover warms the stock a step lighter (#FCFAF5) over 160ms. The owner's own classics carry the Quitar two-tap confirm bottom-right.

### Filter Empty State
When "Solo lo que tengo" leaves nothing to suggest: a stock panel with a Gloock 1.25rem title saying what is missing, an ink-2 0.875rem line (max 44ch) saying what to do, and the way out as actions: the small outline button "Marcar mi armario" when nothing is owned yet, and the "Ver todas las sugerencias" link that turns the filter off.

### Adder (Disclosure and Form)
- **Disclosure:** a full-width 52px row under a hairline, Figtree 600 at 0.9375rem, led by an 18px stroked plus that turns 45deg into a cross over 240ms when open.
- **Form panel:** a stock panel, fields 14px apart; actions are the solid button then a Cancelar link.
- **Order of the colour form:** the colour swatch beside the name field, the error, the family select, the two checkboxes, the actions.

### Inputs / Fields
- **Colour picker:** the native colour input sized as a band (76 by 52px, 76 by 44px in the form), square, with the pale filete; its label sits below in Figtree 600 at 0.8125rem, and the nearest-colour result sits beside it.
- **Text field and select:** field-white ground, 1px rule-strong border, square, 44px tall, padding 0 12px, ink text at 1rem, placeholder in ink-3, native appearance removed; the select carries a drawn ink chevron. Label above in Figtree 600 at 0.8125rem, optional parts in ink-2 at 400.
- **Focus:** the border turns ink and the 2px ink outline sits flush (offset 0).
- **Error:** the field gets aria-invalid, a rust border doubled by an inset rust line, and the message prints directly beneath it in rust at 0.875rem/500, announced as an alert. An empty error takes no space.
- **Checkbox:** a 20px square with native appearance removed, rule-strong border on field white; checked fills ink with a stock ✓ drawn in SVG. Label in Figtree 0.9375rem, 10px gap; focus outline offset 2px.

### Band Picker (new combination)
The whole card offered as small bands (40px fields, names at 0.6875rem) in an auto-fill grid, 2 to 4 to choose; a chosen band shows the selected ring. Under it a preview strip prints the chosen colours as equal flex bands 40px tall with 4px between (the classic row's bands, shorter), hidden until something is chosen, followed by an ink-2 summary line naming the chosen colours.

### Silhouette
An inline SVG figure in mannequin tones whose top and bottom garments are hard halves filled with the chosen colours, each stroked in rule-strong. Fills cross-fade over 320ms. Invertir closes both garments on their vertical axis (scaleX to 0, 180ms ease-in) and reopens them swapped (260ms ease-out).

## Do's and Don'ts

### Do:
- **Do** print every colour as a flat, square band with its shade number on it, and always set its name next to it.
- **Do** compute band ink per colour (ink or stock, whichever contrasts more) and add the inset 1px rule filete when a swatch is pale.
- **Do** show state as a mark inside the cell: the inset ring for selected, a stroked ✓ for owned, a gilt ★ for a classic.
- **Do** confirm destructive actions with a second tap on the same control, armed in rust text and border for 3.5s.
- **Do** print a form error directly under its field, in rust, with the field marked aria-invalid.
- **Do** set text typed into fields at 1rem.
- **Do** give the owner's own colours the next fixed shade number (19 and up) and file them in a family or "Otros".
- **Do** keep bands in a group 4px apart and separate blocks by 40px.
- **Do** keep touch targets at least 44px tall.
- **Do** honour reduced motion: every transition and animation collapses to 1ms.

### Don't:
- **Don't** round any corner of the interface (radius 0px everywhere).
- **Don't** cast drop shadows or lift surfaces; inset printed lines are the only shadow syntax.
- **Don't** use gilt for anything but the owner's classics, or rust for anything but errors and armed confirms; rust never fills.
- **Don't** put garment colours into chrome (backgrounds, borders, text).
- **Don't** show ownership with the ring or selection with the ✓.
- **Don't** set a serif in anything but weight 400, or use emoji or font glyphs for marks; ★, ✓ and icons are drawn SVG.
