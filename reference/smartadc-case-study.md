# SmartADC Case Study — Reference

`study/smartadc.html` is a standalone, long-form case study page — the
"SmartADC" project (redesigning a virtual Assessment & Development
Center configuration workflow for HR & Ops teams). Its own visual
system: the same neubrutalist skin as `photo-gallery.html`
(`css/gaming.css`) — hard black borders, offset drop shadows, bright
yellow canvas, Anton + Space Mono — carried over into
[css/smartadc.css](../css/smartadc.css) and adapted from a full-viewport
canvas into a scrolling page. Not driven by `css/tokens.css`.

Built the same way as the first case study under `study/` — see
[automated-test-case-study.md](automated-test-case-study.md) for the
general pattern this follows (folder layout, the public/raw split, path
conventions). This file only calls out what's specific to SmartADC.

**Confidential numbers live on the `/raw` page, not here.** The public
page's "Quantifying the Baseline Problem" and "Quantified Impact and
ROI" tables omit the baseline sample size and pre-redesign figures
(a former employer's confidential data) — the full numbers-included
version lives on the private, unlinked `study/smartadc/raw/` page (edit
in [js/smartadc-raw-data.js](../js/smartadc-raw-data.js)).

**Linked from the Work Gallery.** `js/case-studies-data.js`'s
`"migration"` entry ("Assessment Centers") points here
(`study/smartadc.html`) — clicking that card on the Home page (or the
All Case Studies page) opens this page directly, no iframe wrapper.

## Files

| File | Purpose |
|---|---|
| `study/smartadc.html` | Public page — polished, no baseline numbers |
| `study/smartadc/raw/index.html` | Private page — full numbers, `noindex` |
| `js/smartadc-data.js` | Public page text/photo slots (`window.CASE_STUDY`) |
| `js/smartadc.js` | Public page renderer |
| `js/smartadc-raw-data.js` | Raw page text/photo slots (`window.CASE_STUDY_RAW`) |
| `js/smartadc-raw.js` | Raw page renderer (1:1 mirror of `js/smartadc.js`, `sar` ids instead of `sa`) |
| `css/smartadc.css` | Shared by both pages |
| `images/smartadc/` | Photo slots — empty until photos are dropped in |

## To edit the text

Everything on the public page lives in
[js/smartadc-data.js](../js/smartadc-data.js) — edit the strings
directly; [js/smartadc.js](../js/smartadc.js) reads that file and builds
the whole page, no HTML editing needed. The raw page works the same way
via `js/smartadc-raw-data.js` / `js/smartadc-raw.js`.

Tables are `tableHeaders`/`tableRows` array pairs; add or remove a row by
adding/removing an array from `tableRows` (each row's items must line up
with `tableHeaders`, in order).

**To bold part of a string**, wrap it in `**double asterisks**` —
e.g. `"HR can now launch **almost two ADCs** in the time it took to
launch one."` — anywhere in a paragraph, table cell, or heading field.
Both `js/smartadc.js` and `js/smartadc-raw.js` convert `**word**` into a
real `<strong>word</strong>` when they build the page (see `renderRich()`
near the top of each file); it doesn't understand any other Markdown
(no italics, links, etc.), just that one pattern.

## To add photos

[images/smartadc/](../images/smartadc/) holds every photo for both
pages — drop a file in with the exact name below and refresh, no
manifest script or build step needed. Filmstrip images render at 336px
wide (280px + 20%, bumped up from the initial build per feedback); the
hero image is unaffected — it's always full-width.

| Slot | Filename | Where it shows | Public | Raw |
|---|---|---|---|---|
| Hero | `hero-1.webp` | Large 16:9 image under the title | ✓ | ✓ |
| Concept exploration | `concept-exploration-1.jpg`, `concept-exploration-2.webp` … `-6.webp` (6 images, note #1 is `.jpg`) | "Concept Exploration and Definition" filmstrip — paper sketches → low-fi → hi-fi progression | ✓ | ✓ |
| Design rationale | `high-fidelity-1.webp` … `-6.webp` (6 images) | "High-Fidelity Design and Rationale" filmstrip — final screens | ✓ | ✓ |
| Qualitative research | `qualitative-research-1.webp` (1 image) | A single supporting image right after the "Discovery & Qualitative Research" table | — | ✓ |
| Prioritization | `priortisation-1.webp` … `-5.webp` (5 images — yes, "priortisation," matching the file names) | A filmstrip right after the "Strategic Prioritization" table | — | ✓ |

The last two slots are **raw-page only** — the source raw write-up had
supporting images here that the condensed public version doesn't show;
that's a genuine content difference, not an oversight, matching the
"raw has more supporting detail" pattern used elsewhere on this page.

Filenames are set in `js/smartadc-data.js` / `js/smartadc-raw-data.js`
(`heroPhoto`, each `photos` array, and — raw only —
`research.discovery.photo` / `research.prioritization.photos`) — rename
or reassign a slot there if you want different filenames; order in each
`photos` array is the order the filmstrip shows them in. Until a photo
exists, that slot shows a plain paper-colored placeholder box instead of
a broken-image icon.

The original Framer source used a paginated 6-image carousel for the
concept-exploration/design-rationale slots; this site renders them as a
horizontally scrolling strip instead (same pattern as
`automated-test`'s Path A/B strips) so every image is reachable without
JS pagination.

## The product walkthrough video

The Results section ends with a placeholder box reading "Product
walkthrough video" (the original Framer page embedded a YouTube video in
the same spot). Set `results.videoEmbedUrl` in the data file to a
YouTube embed URL (`https://www.youtube.com/embed/<id>`) to show the
real video instead; leave it `""` to keep the placeholder.

## How it works

- [js/smartadc.js](../js/smartadc.js) reads `window.CASE_STUDY` and
  builds every section of the public page.
- [js/smartadc-raw.js](../js/smartadc-raw.js) does the same for the raw
  page, reading `window.CASE_STUDY_RAW`.
- Each photo slot is a CSS `background-image` set on top of the
  element's own flat placeholder background-color — a missing file just
  leaves that color showing.
- [css/smartadc.css](../css/smartadc.css) is shared by both pages and is
  entirely self-contained.
