# Portfolio Hero — Build Spec ("Marked-up Poster")

A reusable brief for handing to a build or design AI. Two parts: a **copy-paste prompt** for a quick generate, and a **reference sheet** with exact tokens if the tool supports precise input. The design intent at the top is a guardrail — keep it, it's what stops the AI from over-decorating.

---

## 0. Design intent (keep this — it's the guardrail)

The hero is **a printed type poster that a designer has marked up by hand.** One disciplined base (giant type on ivory paper), and the "handmade / DIY" feeling shows up only as *material on a few objects* — not as a second competing layout.

**The one rule that governs everything:** restraint, then a *minimal* hand intrusion. At rest the hero reads clean and type-led; the hand only surfaces on close look or interaction. Do **not** add more scraps, more accent colours, or more decoration "to make it pop." The whole effect depends on how little is layered on top.

---

## 1. Copy-paste prompt

```
Build a single, full-width hero section for a senior product designer's portfolio.

CONCEPT: a printed type poster that has been marked up by hand. Clean and
type-led at rest; the "handmade" feeling comes only from a few objects layered
on top, never from a second layout. Keep it restrained.

FRAMING:
- The entire hero is one sheet of torn ivory paper, mounted on a dark board.
- Torn/deckle edges (NOT rounded corners). Single soft drop shadow.
- The sheet is held by exactly TWO pieces of translucent tape: one at the
  top-left corner, one at the bottom-right corner, each rotated ~40 degrees.
- Subtle paper grain on the sheet; subtle grain on the dark board behind it.
- Aspect ratio ~16:9.4 on desktop, ~3:4 on mobile.

TYPE (see type spec below): one condensed display face (Anton) for the giant
headline, one neutral grotesque (Archivo) for everything else. Two families only.

CONTENT:
- Kicker: "Ankit Passi — Senior Product Designer" (uppercase, wide tracking,
  small, with a small solid accent dot before it).
- Headline: "I make complex software feel obvious." — huge, uppercase,
  edge-to-edge, tight leading.
- Sub/bio: "Seven years turning tangled enterprise tools into interfaces
  people don't have to fight against."

HAND-DRAWN MARKER LAYER (single accent colour, vermilion):
- An underline under the word "complex".
- A hand-drawn circle around the word "obvious".
- Marks should look drawn (slightly rough/irregular), and draw themselves in
  on load (stroke reveal), staggered.

TWO DRAGGABLE SCRAPS (and only two):
1. A small taped paper label reading "Open to senior IC roles" (accent on
   "senior IC"). Held by a small tape strip. Peels slightly at a corner on
   hover. Draggable; STAYS where dropped, like a real sticker.
2. A small index card titled "Jump to a case study" with 3 rows:
   "01 Reporting IA — Power BI", "02 Portfolio planning flow",
   "03 Design tokens & theme". Index-card styling: ivory, a thin accent rule
   near the top, dashed row separators, a small paperclip at the top. Rows
   highlight (fill accent, white text) on hover. Each row links to a case
   study. This card is the SINGLE entry point into the work. Draggable; stays
   where dropped.

INTERACTIONS:
- A faint marker trail follows the cursor across the hero and fades out.
- On load: type is present, marker marks draw in, the two scraps settle in
  from a slightly scattered/rotated position.

CONSTRAINTS:
- One accent colour only (vermilion). No second accent.
- Exactly two scraps + two marker marks. Do not add more.
- Never show real client names anywhere — keep all labels generic.
- Respect prefers-reduced-motion: skip the draw-in and settle, show final state.
- The torn paper, tape and marker are placeholders for REAL scanned assets;
  make the procedural versions as organic as possible but assume they'll be
  swapped for scans.
```

---

## 2. Colour tokens

| Token | Value | Use |
|---|---|---|
| Ink | `#161310` | Headline, kicker, primary text |
| Ink (muted) | `#3c372f` | Bio / body text |
| Ink (row) | `#2c2822` | Index-card rows |
| Paper | `#f4f1e9` | The torn sheet (ivory) |
| Paper (scrap) | `#fbfaf6` | Label + index card |
| Board | `#14110d` | Dark mounting board behind the sheet |
| Accent (vermilion) | `#ff4423` | Marker, cursor trail, dot, hover fill, row numerals — **only accent** |
| Tape | `rgba(223,208,163,.46)` | Tape strips (translucent warm) |

---

## 3. Typography (the important part)

**Two families, no more.** One single-weight condensed display face carries all the size and impact; one neutral grotesque handles every functional role across a few weights.

### Faces
- **Display:** `Anton` (Google Fonts) — single weight (400), a condensed grotesque. Fallbacks: `Archivo Black, Impact, sans-serif`. Alternatives if you dislike Anton: `Oswald 600/700`, `Anton SC`, `Druk`/`Druk Condensed` (paid).
- **Text / UI:** `Archivo` (Google Fonts), weights 500 / 600 / 700 / 800. Fallbacks: `Inter, "Helvetica Neue", system-ui, sans-serif`.
- **Optional hand face:** only needed if any annotation becomes *real text* rather than a drawn SVG stroke. If so, use `Permanent Marker` (loud) or `Caveat` (casual). In the current design the marker marks are drawn strokes, so no third font is loaded.

### Role-by-role scale

| Role | Face / weight | Size | Line-height | Tracking | Transform | Colour |
|---|---|---|---|---|---|---|
| Headline | Anton 400 | `clamp(29px, 7.4vw, 88px)` | `0.9` | `-0.008em` | UPPERCASE | Ink |
| Kicker (name/role) | Archivo 800 | `12px` | 1 | `0.16em` | UPPERCASE | Ink |
| Bio / sub | Archivo 500 | `13px` | `1.5` | normal | none | Ink muted |
| Label scrap | Archivo 700 | `12px` | 1.2 | `0.06em` | UPPERCASE | Ink (accent word vermilion) |
| Index-card title | Archivo 800 | `11px` | 1.2 | `0.13em` | UPPERCASE | Ink |
| Index-card row | Archivo 600 | `13px` | 1.3 | normal | none | Ink row |
| Row numeral (01/02/03) | Anton 400 | `14px` | 1 | normal | none | Vermilion |

### Type rules
- Headline `max-width` ~`15ch` so it wraps to 3–4 punchy lines, not one long line.
- Bio `max-width` ~`32ch`.
- The size jump between the headline and *everything else* should be large and deliberate — the whole hierarchy is "one giant thing, then small functional things." No mid-size type.
- Never letter-space the headline (Anton is already tight); only the small uppercase labels get wide tracking.

---

## 4. Layout & framing

- **Sheet:** ivory (`#f4f1e9`), torn edges via an SVG turbulence mask (roughly: `feTurbulence baseFrequency 0.007 0.013`, `feDisplacementMap scale ~24`). **No border-radius.**
- **Shadow:** `drop-shadow(0 26px 42px rgba(0,0,0,.6))` on the sheet's wrapper (so the shadow follows the torn edge, not a rectangle).
- **Board:** `#14110d` with faint monochrome grain (`fractalNoise`, opacity ~0.05).
- **Tape:** two strips, ~`104×27px`, `rgba(223,208,163,.46)`, faint inset border, one at **top-left** rotated `-40deg`, one at **bottom-right** rotated `-40deg` (mirror as needed). Note: two diagonal corners read *casually stuck*; if you want *deliberately mounted*, move both tapes to the top edge instead.
- **Padding inside sheet:** ~`6% 6.5%`.
- **Scrap placement at rest:** label top-right; index card bottom-right; headline block left/centre.

---

## 5. Motion (timings)

- **Marker draw-in:** stroke-reveal, `0.75s cubic-bezier(.6,0,.3,1)`. Underline first, circle `+0.5s`.
- **Scrap settle:** from `translate(~scattered, -60px) rotate(±30deg) scale(.8) opacity 0` → rest (`rotate(±3–4deg) scale(1) opacity 1`), `0.8s cubic-bezier(.2,.9,.25,1)`, stagger `~0.09s` per scrap.
- **Cursor trail:** canvas line, vermilion at `~0.45` alpha, width `~7px` tapering, alpha decays `×0.93` per frame.
- **Drag:** scale to `1.05` and raise z while dragging; on drop the scrap **stays** (`0.25s ease`).
- **Hover peel:** corner fold grows (e.g. `18px → 28px`), `0.18s`.
- **Reduced motion:** disable draw-in and settle; render final state directly.

---

## 6. Guardrails / do-nots

- **No real client names, ever** (e.g. never render "Unilever"). All case-study labels stay generic — this is a hard confidentiality rule, not a style choice.
- **Exactly two scraps + two marker marks.** Adding a third scrap or a second accent colour breaks the design.
- **One entry point:** the index card is the only route into the work; don't reintroduce a separate "see all work" button (it was removed as redundant).
- **Swap procedural textures for real scans** (torn paper, tape, ink) before production — at large sizes the generated versions read slightly synthetic.
- **The frame must not outshine the work.** This hero sets a tactile expectation; whatever sits below the fold has to hold up to it, or the hero over-promises.

---

## 7. Placeholder content (sanitised)

- Kicker: `Ankit Passi — Senior Product Designer`
- Headline: `I make complex software feel obvious.`
- Bio: `Seven years turning tangled enterprise tools into interfaces people don't have to fight against.`
- Label: `Open to senior IC roles`
- Case studies: `01 Reporting IA — Power BI` · `02 Portfolio planning flow` · `03 Design tokens & theme`
