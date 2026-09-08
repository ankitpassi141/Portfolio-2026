# Assessment Generator Case Study — Reference

The "AI-powered Assessment Generator" project ("The Blueprint
Generator" — an AI workflow that cut assessment creation time
dramatically) is split across two pages that look nothing alike, on
purpose — same split as `power-bi`, see
[power-bi-case-study.md](power-bi-case-study.md) for the general
reasoning:

- **`study/automated-test.html`** — a condensed public **teaser**: a
  hook headline, one screenshot, a 3-item summary strip, a 4-stat
  metrics row, an honesty line about what data doesn't exist yet, and a
  CTA to email/message for the full write-up. Its own bespoke visual
  system (Fraunces + IBM Plex Sans/Mono, a sage-green accent), carried
  over verbatim from an HTML design handoff — see
  [css/automated-test.css](../css/automated-test.css).
- **`study/automated-test/raw/index.html`** — the full write-up (every
  section, every table, all 19 photos), unlinked and `noindex`. Keeps
  the original editorial visual system instead (Oswald + Inter + Azeret
  Mono, warm paper background) — see
  [css/automated-test-raw.css](../css/automated-test-raw.css).

The teaser doesn't link to `/raw` at all — its CTA points to email/
LinkedIn instead, matching the "private and unlinked" pattern used
elsewhere on this site.

**Confidential numbers still live on `/raw` only.** The full write-up's
data file states the real baseline figures (the pre-redesign numbers
are a former employer's confidential data); the teaser only shows the
post-redesign metrics, which is safe to share. If you ever add a new
number to the teaser, check first whether it's safe to share.

**Linked from the Work Gallery.** `js/case-studies-data.js`'s
`"one-plan"` entry ("Assessment Generator") points to
`study/automated-test.html` — clicking that card on the Home page (or
the All Case Studies page) opens the teaser directly, no iframe
wrapper.

## Files

| File | Purpose |
|---|---|
| `study/automated-test.html` | Public teaser page |
| `study/automated-test/raw/index.html` | Private full write-up, `noindex` |
| `js/automated-test-data.js` | Teaser text (`window.CASE_STUDY`) |
| `js/automated-test.js` | Teaser renderer |
| `js/automated-test-raw-data.js` | Full write-up text/photo slots (`window.CASE_STUDY_RAW`) |
| `js/automated-test-raw.js` | Full write-up renderer (`csr`-prefixed ids) |
| `css/automated-test.css` | Teaser only — self-contained, its own `:root` tokens |
| `css/automated-test-raw.css` | Raw page only — the original editorial system |
| `images/automated-test/` | Shared photo folder for both pages |

## To edit the teaser (public page)

Edit [js/automated-test-data.js](../js/automated-test-data.js) directly
— `hero.title`/`hero.intro`, `figure` (photo/alt/caption), `strip` (an
array of `{label, text}`, the 3-column summary), `metrics` (an array of
`{num, label}`, the 4-column stat row), `caveat`, and `cta` (`heading`,
`intro`, `links` — an array of `{label, href, primary, external}`).
`js/automated-test.js` reads this and builds the whole page — no HTML
editing needed.

**To change the accent color**, edit `--accent` at the top of
`css/automated-test.css` — that's the only value that needs to change.
The translucent variants (`--accent-12`, `--accent-30`, used for things
like the caveat's left border) derive from it automatically via CSS
relative-color syntax (`rgb(from var(--accent) r g b / 0.3)`), so they
can never drift out of sync with a color you changed by hand. Same
mechanism in `css/power-bi.css`.

## To edit the full write-up (raw page)

Edit [js/automated-test-raw-data.js](../js/automated-test-raw-data.js)
— `overview`, `research` (`firstImpression`, `methods`,
`problemQuantified`, `projectGoals`, `summary`), `solutionFinding`
(`exploration`, `ideation` with Path A/B, `review`, `proposal`,
`summary`), `solution` (`intro`, `decisions`, `steps`,
`figmaEmbedUrl`), `results` (`validation`, `impact`, `quotes`), and
`conclusion`. Tables are `tableHeaders`/`tableRows` array pairs.

**To bold part of a string** (either page), wrap it in `**double
asterisks**` — both `js/automated-test.js` and
`js/automated-test-raw.js` convert `**word**` into a real
`<strong>word</strong>` via a `renderRich()`/`richNodes()` helper near
the top of each file — same convention as every other case study on
this site.

## To add photos

[images/automated-test/](../images/automated-test/) holds photos for
**both** pages — the teaser uses exactly one (reused from the raw
page's own hero, not a separate file):

| Slot | Filename | Used by |
|---|---|---|
| Teaser figure | `hero.webp` | Public teaser (`figure.photo`) |
| Hero | `hero.webp` | Raw page too (same file) |
| Path A wireframes | `path-a-wireframe-1.webp` … `-4.webp` (3 is `.png`) | Raw page only |
| Path B wireframes | `path-b-wireframe-1.webp` … `-7.avif` (7 images, not 5) | Raw page only |
| Step 1/2/3 visuals | `three-step-<n>-image-<n>.webp` | Raw page only |

Every photo slot on the raw page is a CSS `background-image` on top of
a flat placeholder color — a missing file just leaves that color
showing. The teaser's one photo is a real `<img>` (`width:100%;
height:auto`), matching its reference design. Raw-page photos open in a
fullscreen lightbox on click (top-right × to close); the teaser doesn't
have a lightbox — it wasn't part of the reference design.

## The Figma prototype embed

Raw page only. The "Blueprint Generator: The Three-Step Flow" section
ends with a placeholder box reading "Figma prototype embed" unless
`solution.figmaEmbedUrl` is set to a Figma **Share → Embed** URL.

## How it works

- [js/automated-test.js](../js/automated-test.js) reads
  `window.CASE_STUDY` and builds the teaser page.
- [js/automated-test-raw.js](../js/automated-test-raw.js) reads
  `window.CASE_STUDY_RAW` and builds the full write-up.
- The two pages load completely different stylesheets and don't share
  class names in practice, even though both happen to use a `cs-`
  prefix for their own unrelated classes on the raw side vs. plain
  (`.hero`/`.strip`/`.cta`/etc.) classes on the teaser side. Don't
  assume a class in one applies to the other.
