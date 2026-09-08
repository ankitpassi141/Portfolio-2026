# Power-BI Tool Case Study — Reference

The "Power-BI Tool" project (redesigning a Power BI reporting
platform's information architecture, KPI system, and design system for
the Sales and Finance teams at a global FMCG company) is split across
two pages that now look nothing alike on purpose:

- **`study/power-bi.html`** — a condensed public **teaser**: a hook
  headline, one screenshot, a 3-item summary strip, an honesty line
  about what data doesn't exist, and a CTA to email/message for the
  full write-up. Its own bespoke visual system (Fraunces + IBM Plex
  Sans/Mono, sage-green accent, a faint dashboard-grid backdrop),
  carried over verbatim from an HTML design handoff — see
  [css/power-bi.css](../css/power-bi.css).
- **`study/power-bi/raw/index.html`** — the full write-up (every
  section, both tables, all 7 photos), unlinked and `noindex`. Uses the
  site's own homepage visual system instead (Archivo + Azeret Mono,
  `css/tokens.css`) — see [css/power-bi-raw.css](../css/power-bi-raw.css).

This is a different split than `automated-test`/`smartadc`, where the
public and raw pages share one theme and differ only in redacted
numbers. Here there's nothing confidential to redact — the public page
is deliberately a *teaser*, not a condensed version of the same
content, and doesn't link to `/raw` at all (the CTA points to email/
LinkedIn instead, matching the private-and-unlinked pattern used
elsewhere on this site — see
[automated-test-case-study.md](automated-test-case-study.md) for that
general `study/` folder pattern).

**Linked from the Work Gallery.** `js/case-studies-data.js`'s
`"ib-engine"` entry ("Power-BI Tool") points to `study/power-bi.html` —
clicking that card on the Home page (or the All Case Studies page)
opens the teaser directly, no iframe wrapper.

## Files

| File | Purpose |
|---|---|
| `study/power-bi.html` | Public teaser page |
| `study/power-bi/raw/index.html` | Private full write-up, `noindex` |
| `js/power-bi-data.js` | Teaser text (`window.CASE_STUDY`) |
| `js/power-bi.js` | Teaser renderer |
| `js/power-bi-raw-data.js` | Full write-up text/photo slots (`window.CASE_STUDY_RAW`) |
| `js/power-bi-raw.js` | Full write-up renderer (`pbr`-prefixed ids) |
| `css/power-bi.css` | Teaser only — self-contained, its own `:root` tokens |
| `css/power-bi-raw.css` | Raw page only — built on `css/tokens.css` |
| `images/power-bi/` | Shared photo folder for both pages |

## To edit the teaser (public page)

Edit [js/power-bi-data.js](../js/power-bi-data.js) directly —
`hero.title`/`hero.intro`, `figure` (photo/alt/caption), `strip` (an
array of `{label, text}`, rendered as the 3-column summary),  `caveat`,
and `cta` (`heading`, `intro`, `links` — an array of `{label, href,
primary, external}`). `js/power-bi.js` reads this and builds the whole
page — no HTML editing needed.

## To edit the full write-up (raw page)

Edit [js/power-bi-raw-data.js](../js/power-bi-raw-data.js) — same
section-by-section shape as `automated-test`/`smartadc`'s data files
(`overview`, `gettingStarted`, `problemUnderstanding`, `conflicts`,
`results`, `conclusion`). Tables are `tableHeaders`/`tableRows` array
pairs.

**To bold part of a string** (either page), wrap it in `**double
asterisks**` — both `js/power-bi.js` and `js/power-bi-raw.js` convert
`**word**` into a real `<strong>word</strong>` via a `renderRich()`
helper near the top of each file — same convention as every other case
study on this site.

## To add photos

[images/power-bi/](../images/power-bi/) holds photos for **both**
pages — the teaser uses exactly one (reused from the raw page's own
"Rebuilding the Structure" section, not a separate file):

| Slot | Filename | Used by |
|---|---|---|
| Teaser figure | `rebuilding-1.webp` | Public teaser (`figure.photo`) |
| Hero | `hero-1.png` | Raw page only |
| Getting Started | `the-project-1.webp` | Raw page only |
| Problem & Understanding | `the-problem-up-close-1.webp` | Raw page only |
| Rebuilding the Structure | `rebuilding-1.webp`, `rebuilding-2.webp` | Raw page only |
| Design System | `design-system-1.webp` | Raw page only |
| Conflicts | `disagreement-1.webp` | Raw page only |

Every photo slot on **both** pages is a real `<img>` (`width:100%;
height:auto`), not a background-image div — the browser derives each
box's height from that specific image's own aspect ratio, so nothing
gets force-cropped. Filenames are set in `js/power-bi-data.js`
(`figure.photo`) and `js/power-bi-raw-data.js` (`heroPhoto` and each
`photo`/`photos` field). The raw page's photos open in a fullscreen
lightbox on click (top-right × to close); the teaser doesn't have a
lightbox — it wasn't part of the reference design.

## How it works

- [js/power-bi.js](../js/power-bi.js) reads `window.CASE_STUDY` and
  builds the teaser page.
- [js/power-bi-raw.js](../js/power-bi-raw.js) reads
  `window.CASE_STUDY_RAW` and builds the full write-up.
- The two pages load completely different stylesheets and don't share
  any class names in practice, even though both happen to use a `pb-`
  prefix for their own unrelated classes — `css/power-bi.css`'s
  `.hero`/`.strip`/`.cta`/etc. vs `css/power-bi-raw.css`'s
  `.pb-section`/`.pb-table`/etc. Don't assume a class in one applies to
  the other.
