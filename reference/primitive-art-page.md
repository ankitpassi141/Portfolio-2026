# Primitive page

`primitive-art.html` + `css/primitive-art.css` + `js/primitive-art.js` + `js/primitive-art-core.js` +
`js/primitive-art-3d.js`. Rebuilds an uploaded image from 50–300 translucent shapes
(triangles, rotated rectangles, rotated ellipses, closed cubic Bézier shapes) by greedy
hill-climbing, then exports the result as SVG or PNG, and lets you orbit the shapes as layers
in 3D. Linked from the Experiments page
(`js/experiments-data.js`).

Ported from a Vite + React + TypeScript prototype (`primitive-art.zip`) to plain JS with no build
step, like the rest of the site. The algorithm is unchanged line for line; only the UI moved from
React to DOM code.

## Files
- `js/primitive-art-core.js` — shape params, random / mutate, polygonise, scanline rasteriser,
  `toPathD`, `buildSvg`, and the `Optimizer` class. **No DOM**: the page calls `primitiveCore(self)` and
  the worker re-runs the same function from its source. Exposes `self.PrimitiveCore`.
- **Worker**: `workerMain` in `primitive-art.js`, started from a Blob of `primitiveCore` + `workerMain` source
  (not a separate `.js` URL — Chrome blocks `new Worker(url)` on `file://`, so the page also works
  opened straight from disk). Posts `init` / `shape` / `done`; stopping = terminating it.
- `js/primitive-art-3d.js` — the finished shapes as separate layers in 3D (`window.PrimitiveLayers`).
  Loads three.js r128 from jsDelivr the first time it's needed (same build as Valley Drive). Each
  shape is its own mesh: triangles, rectangles, ellipses and simple Béziers as `ShapeGeometry`;
  self-crossing Béziers are painted (non-zero fill) into a small texture instead. The background is
  the bottom layer, drawn front-face only so from behind the shapes float. Layers are clipped to the
  image rect (world-space clipping planes; the camera orbits, the stack never rotates). Painter's
  order by `renderOrder`, flipped when the camera is behind the stack. Renders on demand only.
- `js/primitive-art.js` — UI: image input (click or drop), settings, playback queue (rAF), progress bar,
  SVG export, and the procedural dusk sample loaded on open. Nothing generates on its own: the
  Generated card shows a centred **Generate** button (`#frameGo`) until a run starts, on load and
  after every upload.
- Controls: Shapes, Opacity, Detail, Playback. Shape types are fixed to all four and the working
  image to 128 px (longest side). **Detail** (1–10) sets both search knobs at once: candidates =
  50 × level, mutations = 20 × level, so level 1 is the original 50 / 20 default.
- **3D layers.** When a run finishes (or is stopped with shapes placed), the 3D view
  replaces the 2D canvas in the card (`.frame.has-layers` hides the canvas, so orbiting never
  shows the flat result behind the layers; it comes back while the lightbox is open). Flat at
  rest (layer depth 0), so it looks identical.
  Right-drag orbits and fans the layers out (to the Layer depth value, 0.8 × the image's long side
  at 1); scroll zooms; double-click resets. A hint chip shows until the first interaction (on touch
  screens it points to the 3D view button instead, since inline touch is left for page scrolling).
  Any new run or new image disposes it (`dropLayers`). No WebGL or no network for
  three.js: the 2D result simply stays, with no 3D view button.
- **Lightbox** ("3D view" button at the right of the Generated heading): the same viewer moved into
  a full-screen overlay (`#lightbox`) with Layer depth (0–2), Reset view and Close. There, plain
  left-drag or one finger orbits and pinch zooms. Esc, the close button or a click on the dim
  backdrop closes it; focus returns to the button.
- **Portrait images** (taller than wide) put Original and Generated side by side (`.result.side`),
  sized so both fit the viewport height; landscape images stack.
- Shapes SVG export names each shape `id="layer-N"`, so design tools import them as layers.
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

## Checking a change
- On the sample at 150 shapes, Detail 1 (50 / 20): RMS error ≈ 3–4%, compute well under 1 s.
  A change to the optimizer that raises that is a regression unless intended.
- SVG export should contain one `<path>` per shape. PNG export redraws the same shapes (same
  `toPathD` paths) on a fresh canvas, 2048 px on the longest side (`PNG_LONG_SIDE`).
- Works opened from disk (`file://`) as well as served over http.

## Share image
`images/primitive-art/og.jpg` (1200 × 630): the page itself in dark mode after a 300-shape,
Detail 4 run of the sample, captured with headless Chrome.
