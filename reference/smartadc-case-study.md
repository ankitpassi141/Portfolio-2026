# SmartADC Case Study — Reference

The "SmartADC" project (redesigning a virtual Assessment & Development
Center configuration workflow for HR & Ops teams) is split across two
pages that look nothing alike, on purpose — same split as
`power-bi`/`automated-test`, see
[power-bi-case-study.md](power-bi-case-study.md) for the general
reasoning:

- **`study/smartadc.html`** — a condensed public **teaser**: a hook
  headline, a "Shipped · live at mettl.com/smartadc" tag, one
  screenshot, a 3-item summary strip, a 4-stat metrics row, an honesty
  line about where the numbers come from, and a CTA to email/message
  for the full write-up. Its own bespoke visual system (Fraunces + IBM
  Plex Sans/Mono, a sage-green accent), carried over verbatim from an
  HTML design handoff — see [css/smartadc.css](../css/smartadc.css).
- **`study/smartadc/raw/index.html`** — the full write-up (every
  section, both tables, all photos), unlinked and `noindex`. Keeps the
  original neubrutalist visual system instead (Anton + Space Mono,
  grid-lined cream canvas, hard black borders) — see
  [css/smartadc-raw.css](../css/smartadc-raw.css).

The teaser doesn't link to `/raw` at all — its CTA points to email/
LinkedIn instead, matching the "private and unlinked" pattern used
elsewhere on this site.

**Confidential/unshipped-adoption numbers still live on `/raw` only.**
The teaser's metrics are the validated post-redesign figures (safe to
share); the raw page has the full baseline/pre-redesign detail. If you
ever add a new number to the teaser, check first whether it's safe to
share.

**Linked from the Work Gallery.** `js/case-studies-data.js`'s
`"migration"` entry ("Assessment Centers") points to
`study/smartadc.html` — clicking that card on the Home page (or the All
Case Studies page) opens the teaser directly, no iframe wrapper.

## Files

| File | Purpose |
|---|---|
| `study/smartadc.html` | Public teaser page |
| `study/smartadc/raw/index.html` | Private full write-up, `noindex` |
| `js/smartadc-data.js` | Teaser text (`window.CASE_STUDY`) |
| `js/smartadc.js` | Teaser renderer |
| `js/smartadc-raw-data.js` | Full write-up text/photo slots (`window.CASE_STUDY_RAW`) |
| `js/smartadc-raw.js` | Full write-up renderer (`sar`-prefixed ids) |
| `css/smartadc.css` | Teaser only — self-contained, its own `:root` tokens |
| `css/smartadc-raw.css` | Raw page only — the original neubrutalist system |
| `images/smartadc/` | Shared photo folder for both pages |

## To edit the teaser (public page)

Edit [js/smartadc-data.js](../js/smartadc-data.js) directly — `hero`
(`title`/`intro`/`liveTagPrefix`/`liveTagLabel`/`liveTagHref` — leave
`liveTagLabel` empty to drop the "Shipped · live at" tag entirely),
`figure` (photo/alt/caption), `strip` (an array of `{label, text}`, the
3-column summary), `metrics` (an array of `{num, label}`, the 4-column
stat row), `caveat`, and `cta` (`heading`, `intro`, `links` — an array
of `{label, href, primary, external}`). `js/smartadc.js` reads this and
builds the whole page — no HTML editing needed.

**To change the accent color**, edit `--accent` at the top of
`css/smartadc.css` — that's the only value that needs to change. The
translucent variants (`--accent-12`, `--accent-30`, used for things
like the caveat's left border) derive from it automatically via CSS
relative-color syntax (`rgb(from var(--accent) r g b / 0.3)`), so they
can never drift out of sync with a color you changed by hand. Same
mechanism in `css/power-bi.css` and `css/automated-test.css`.

## To edit the full write-up (raw page)

Edit [js/smartadc-raw-data.js](../js/smartadc-raw-data.js) — same
section-by-section shape as the other two case studies' raw data files
(`overview`, `research`, `solutionFinding`, `conflicts`/`results`,
`conclusion`). Tables are `tableHeaders`/`tableRows` array pairs.

**To bold part of a string** (either page), wrap it in `**double
asterisks**` — both `js/smartadc.js` and `js/smartadc-raw.js` convert
`**word**` into a real `<strong>word</strong>` via a `renderRich()`
helper near the top of each file — same convention as every other case
study on this site.

## To add photos

[images/smartadc/](../images/smartadc/) holds photos for **both**
pages — the teaser uses exactly one (reused from the raw page's own
hero, not a separate file):

| Slot | Filename | Used by |
|---|---|---|
| Teaser figure | `hero-1.webp` | Public teaser (`figure.photo`) |
| Hero | `hero-1.webp` | Raw page too (same file) |
| Concept exploration | `concept-exploration-1.jpg`, `-2.webp` … `-6.webp` | Raw page only |
| Design rationale | `high-fidelity-1.webp` … `-6.webp` | Raw page only |
| Qualitative research | `qualitative-research-1.webp` | Raw page only |
| Prioritization | `priortisation-1.webp` … `-5.webp` | Raw page only |

Every raw-page photo slot is a CSS `background-image` on top of a flat
placeholder color, at 336px wide (280px + 20%) for filmstrip images —
a missing file just leaves the placeholder color showing. The teaser's
one photo is a real `<img>` (`width:100%; height:auto`), matching its
reference design. Raw-page photos open in a fullscreen lightbox on
click (top-right × to close); the teaser doesn't have a lightbox — it
wasn't part of the reference design.

## The product walkthrough video

Raw page only. Set `results.videoEmbedUrl` in
`js/smartadc-raw-data.js` to a YouTube embed URL
(`https://www.youtube.com/embed/<id>`) to show the real video instead
of the placeholder box.

## How it works

- [js/smartadc.js](../js/smartadc.js) reads `window.CASE_STUDY` and
  builds the teaser page.
- [js/smartadc-raw.js](../js/smartadc-raw.js) reads
  `window.CASE_STUDY_RAW` and builds the full write-up.
- The two pages load completely different stylesheets and don't share
  class names in practice, even though both happen to use an `sa-`
  prefix for their own unrelated classes on the raw side vs. plain
  (`.hero`/`.strip`/`.cta`/etc.) classes on the teaser side. Don't
  assume a class in one applies to the other.
