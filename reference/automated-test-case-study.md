# Assessment Generator Case Study — Reference

`study/automated-test.html` is a standalone, long-form case study page —
the "AI-powered Assessment Generator" project (90-minute assessment
creation cut to 5 minutes). Deliberately its own visual system (editorial
Oswald/Inter/Azeret Mono, warm paper background, hard-edged bordered
tables), not driven by `css/tokens.css` — carried over from a Claude
Design handoff.

This is the first case study built under `study/` — see "The `study/`
pattern" below for how to set up the next one the same way.

**Linked from the Work Gallery.** `js/case-studies-data.js`'s
`"one-plan"` entry ("Assessment Generator") points here
(`study/automated-test.html`) — clicking that card on the Home page (or
the All Case Studies page) opens this page directly, no iframe wrapper,
since it's a local page and not an external link. See
[case-studies.md](case-studies.md) for how that local-vs-external
linking split works.

## The `study/` pattern

Each case study is a flat `.html` file directly inside `study/`, with a
same-named subfolder holding just its private `raw/` companion:

```
study/
  automated-test.html          → /study/automated-test.html        (public, polished)
  automated-test/
    raw/index.html              → /study/automated-test/raw/         (private, unlinked)
```

(The URLs above are shown as site-root paths just to describe *where*
each page ends up — see "Path convention" below for why the pages
themselves don't actually link to each other with a leading `/`.)

A file (`automated-test.html`) and a folder (`automated-test/`) can
share the same name in one directory — they're different things to the
filesystem and to the web server — so this is deliberate, not a typo.

- **`study/<slug>.html`** is the public write-up — what the case study's
  card should eventually link to.
- **`study/<slug>/raw/index.html`** is a private companion, reachable
  only by typing/knowing that `/raw` URL — never linked from anywhere on
  the site, and carries a `<meta name="robots" content="noindex,
  nofollow">` tag so it won't turn up in search results either. It's
  meant for the more candid version of the write-up: process notes,
  rejected directions, internal detail that doesn't belong in the public
  case study. Content lives in
  [js/automated-test-raw-data.js](../js/automated-test-raw-data.js) —
  free-form `sections` (heading + paragraphs each), edit/add/remove
  however you want.

**To build the next case study**, copy this one's files and rename the
`automated-test` part throughout: `study/<new-slug>.html`,
`study/<new-slug>/raw/index.html`, `js/<new-slug>-data.js`,
`js/<new-slug>.js`, `js/<new-slug>-raw-data.js`,
`js/<new-slug>-raw.js`, and `images/<new-slug>/`. `css/automated-test.css`
is generic enough to reuse as-is for any case study (including its
`.cs-private-badge`/`.cs-raw-section` styles for the raw page) — no need
to copy it, just link to it from the new pages too, or copy it if you
want that case study to look different.

**Path convention**: every asset reference (CSS, JS, images, the back
link) uses a **relative path**, computed against that specific page's
own nesting depth — same as the rest of the site. A leading `/`
(site-root-absolute) was tried first and reverted: it only resolves
correctly when the site is served over a real web server (GitHub Pages,
a local dev server); opened directly via `file://` (double-clicking
`index.html`), a leading `/` resolves to the machine's drive root
instead of the portfolio folder, breaking every link. Relative paths
work identically either way.

Depths to get right for the next case study:

| File | Depth | To reach site root | To reach the polished page |
|---|---|---|---|
| `study/<slug>.html` | 1 | `../` | — (it *is* the polished page) |
| `study/<slug>/raw/index.html` | 3 | `../../../` | `../../<slug>.html` |

So `study/automated-test.html` links to its CSS as
`../css/automated-test.css` and back to Home as `../index.html`; its raw
companion at `study/automated-test/raw/index.html` links to that same
CSS as `../../../css/automated-test.css` and back to the polished page
as `../../automated-test.html`. Also remember: `backHref` (and, on the
raw page, its own `backHref`) is set from the **data file**, not just the
HTML's placeholder `href` — the render script overwrites the HTML value
on load, so both need updating to the same relative path or the fix
only half-lands.

## To edit the text

Everything on the public page lives in
[js/automated-test-data.js](../js/automated-test-data.js). Open it and
edit the strings directly; [js/automated-test.js](../js/automated-test.js)
reads that file and builds the whole page from it, so no HTML editing is
needed for a text change.

The structure mirrors the page's own sections — overview, research,
finding the solution, the solution, results, conclusion — each as its own
object in `window.CASE_STUDY`. Tables are `tableHeaders`/`tableRows`
array pairs; add or remove a row by adding/removing an array from
`tableRows` (each row's items must line up with `tableHeaders`, in
order).

## To add photos

There are **19 photos**, all filled and inside
[images/automated-test/](../images/automated-test/) — mixed formats
(`.webp`/`.png`/`.avif`) since that's what was dropped in for each:

| Slot | Filename | Where it shows |
|---|---|---|
| Hero | `hero.webp` | Large 16:9 image under the title |
| Path A wireframes | `path-a-wireframe-1.webp` … `path-a-wireframe-4.webp` (3 is `.png`) | "Path A: The In-line Assistant" scrollable strip |
| Path B wireframes | `path-b-wireframe-1.webp` … `path-b-wireframe-7.avif` (7 images, not 5 — this path got extra ones; 7 is `.avif`, the rest `.webp`) | "Path B: The Generator" scrollable strip |
| Step 1 visuals | `three-step-1-image-1.webp`, `three-step-1-image-2.webp` | "Step 1: Provide Input" |
| Step 2 visuals | `three-step-2-image-1.webp` … `three-step-2-image-3.webp` | "Step 2: Generate Blueprint" |
| Step 3 visuals | `three-step-3-image-1.webp`, `three-step-3-image-2.webp` | "Step 3: Seamless Handoff" |

Drop a file in with the exact name above and refresh — no manifest
script, no build step. Filenames are set in
`js/automated-test-data.js` (`heroPhoto` and each `photos` array), so
you can rename or reassign a slot there if you want a different
filename — order in each `photos` array is the order the strip shows
them in.

**Until a photo exists**, that slot shows a plain neutral placeholder
box (`--paper-raised`, matching the design's own empty-state look) instead
of a broken-image icon, so the page never looks broken while you're still
collecting screenshots. This site doesn't have an image-compression
script for this page yet — reuse
[scripts/compress-about-images.ps1](../scripts/compress-about-images.ps1)
if screenshots come in oversized (point `$InputPath`/output at this
folder instead of `images/about/`).

## The Figma prototype embed

The "Blueprint Generator: The Three-Step Flow" section ends with a
placeholder box reading "Figma prototype embed" — that's what the
original design showed too (a placeholder, not a real embed). Set
`solution.figmaEmbedUrl` in the data file to a Figma **Share → Embed**
URL to show the real prototype there instead of the placeholder text;
leave it empty (`""`) to keep the placeholder.

## How it works

- [js/automated-test.js](../js/automated-test.js) reads `window.CASE_STUDY`
  and builds every section of the public page. No scroll-reveal
  animation on this page (unlike About/Experiments) — the design didn't
  call for one.
- [js/automated-test-raw.js](../js/automated-test-raw.js) does the same
  for the raw page, reading `window.CASE_STUDY_RAW`.
- Each photo slot is a CSS `background-image` set on top of the
  element's own flat placeholder background-color — a missing file just
  leaves that color showing, same graceful-fallback pattern as
  `images/about/`.
- [css/automated-test.css](../css/automated-test.css) is shared by both
  the public and raw page, and is entirely self-contained — it does not
  use the site's shared `css/tokens.css`, on purpose.
- The three-column/two-column grids (overview, path comparison, proposal
  cards, three-step flow, learnings table) all collapse to a single
  column below 820px, matching every other page's mobile pattern on this
  site.
