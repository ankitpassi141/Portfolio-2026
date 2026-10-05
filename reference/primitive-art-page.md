# Primitive page

`primitive-art.html` + `css/primitive-art.css` + `js/primitive-art.js` + `js/primitive-art-core.js`. Rebuilds an uploaded image from 50–300 translucent shapes
(triangles, rotated rectangles, rotated ellipses, closed cubic Bézier shapes) by greedy
hill-climbing, or (Single line mode) draws it as one continuous, unbroken line, then exports
the result as SVG or PNG. Linked from the Experiments page
(`js/experiments-data.js`).

Ported from a Vite + React + TypeScript prototype (`primitive-art.zip`) to plain JS with no build
step, like the rest of the site. The algorithm is unchanged line for line; only the UI moved from
React to DOM code.

## Files
- `js/primitive-art-core.js` — shape params, random / mutate, polygonise, scanline rasteriser,
  `toPathD`, `buildSvg`, the `Optimizer` class, and single line mode (`singleLine`, `lineCtrl`,
  `lineWidth`, `linePathD`, `buildLineSvg`). **No DOM**: the page calls `primitiveCore(self)` and
  the worker re-runs the same function from its source. Exposes `self.PrimitiveCore`.
- **Worker**: `workerMain` in `primitive-art.js`, started from a Blob of `primitiveCore` + `workerMain` source
  (not a separate `.js` URL — Chrome blocks `new Worker(url)` on `file://`, so the page also works
  opened straight from disk). Shapes: posts `init` / `shape` / `done`. Line: posts `progress` /
  `line` / `done`. Stopping = terminating it.
- `js/primitive-art.js` — UI: image input (click or drop), settings, playback queue (rAF), progress bar,
  SVG export, and the procedural dusk sample that auto-runs on load.
- **Mode** (Shapes / Single line) sits above the settings fieldset so it stays usable mid-run;
  switching stops any run and starts the new mode straight away.
- Shapes controls: Shapes, Opacity, Detail. Shape types are fixed to all four and the working
  image to 128 px (longest side). **Detail** (1–10) sets both search knobs at once: candidates =
  50 × level, mutations = 20 × level, so level 1 is the original 50 / 20 default.
- Line controls: **Line detail** (4,000–20,000 dots, default 12,000) and **Line colour** (five
  swatches + a custom picker). Light colours draw on a dark background (`NIGHT`) with ink following
  brightness; dark colours on paper (`PAPER`) with ink following darkness. A colour change that
  stays on the same light/dark side just recolours the drawn line; one that flips it re-plans.
- Playback (both modes) only changes how fast the drawing appears, never the result.
- Stage: two glass cards, "Original" above and "Generated" below, each with its heading sitting on
  the backdrop just above the card (with a pulsing **Live** badge beside "Generated"
  while a run is going), then the progress bar. No captions or stats. The column's width is picked
  so both cards fit the viewport height at the image's aspect ratio (`--ar`, set by JS).
- **Look: liquid glass, minimal.** Dark only. A blurred, enlarged copy of the current image
  (`#ambient`) plus three soft primitives fill a fixed `.backdrop`; the panel and both cards are
  borderless `.glass` (tint, blur, rim highlights). On Chromium each `.glass` also refracts the
  backdrop near its rounded edges: an SVG `feDisplacementMap` built per element and used as its
  `backdrop-filter`, the same code as Valley Drive. Other browsers get the plain blur. Font: Manrope.
  `body` has no background on purpose: it would paint over the backdrop.
- Bump the `?v=` on both script tags in `primitive-art.html` when either file changes.

## How it works
- **Downscale**: image drawn to an offscreen canvas, longest side 128 px (aspect kept).
- **Background**: canvas starts as the image's mean RGB.
- **Per shape**: N random candidates → keep the one with the biggest drop in squared RGB error →
  M mutations of it, keeping strict improvements → commit. Defaults 50 / 20.
- **Colour**: error-optimal colour at alpha `a` over the current canvas is
  `(mean(target) − (1−a)·mean(current)) / a`, clamped 0–255. Never plain mean(target).
- **Rasterising**: non-zero winding, pixel-centre sampling, to match SVG / canvas fill.
- **Rendering**: canvas preview and SVG export both use `toPathD`, so the export is exactly what
  you watched. The worker computes far faster than anyone can watch, so shapes go through a
  playback queue (Slow ≈ 12/s, Normal ≈ 60/s, Instant).

### Single line mode (`singleLine` in the core)
"TSP art": the shading comes from how tightly one line loops.
1. **Tone**: luminance at 320 px (`LINE_RES`), stretched 1st–99th percentile, blended 60% with
   histogram equalisation (`equalize`) so mostly-dark photos still separate. Ink density =
   tone^3.2 (`gamma`) + 0.01 (`floor`, which keeps a little line in white areas).
2. **Dots**: rejection-sample N dots by that density, then 14 rounds of weighted Lloyd relaxation
   (each dot moves to the density-weighted centroid of the pixels nearest to it).
3. **Route**: Hilbert-curve order, then 2-opt over each dot's 8 nearest neighbours with a work
   queue (3 s time budget; usually done in well under 0.5 s). 2-opt also removes self-crossings.
4. **Draw**: Catmull-Rom → cubic Béziers (`lineCtrl`), shared by canvas, SVG and PNG. Line width =
   0.6 × mean dot spacing (`lineWidth`), so overall darkness doesn't change with Line detail.

Tuned on the dusk sample and a portrait. A lower gamma or a thinner line washes everything out to
an even mid-grey texture.

## Checking a change
- On the sample at 150 shapes, Detail 1 (50 / 20): RMS error ≈ 3–4%, compute well under 1 s.
  A change to the optimizer that raises that is a regression unless intended.
- SVG export should contain one `<path>` per shape. PNG export redraws the same shapes (same
  `toPathD` paths) on a fresh canvas, 2048 px on the longest side (`PNG_LONG_SIDE`).
- A single line SVG must hold exactly one `<path>` with one `M` (one unbroken line), and only the
  drawn part if the run was stopped.
- Works opened from disk (`file://`) as well as served over http.

## Share image
`images/primitive-art/og.jpg` (1200 × 630): the page itself in dark mode after a 300-shape,
Detail 4 run of the sample, captured with headless Chrome.
