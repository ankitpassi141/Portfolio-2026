# Experiments Page — Reference

`experiments.html` is a full-viewport dark canvas "constellation" —
project nodes drift and gently orbit, react to cursor parallax, connect
with glowing lines to a moving hub point, and can be dragged around;
clicking a project node opens a small info card with a live screenshot
of that project's own link. The color phase (day/evening/night) is
always auto-detected from the real current hour — no manual switch. A
live clock sits in the corner. Carried over from a Claude Design
handoff — deliberately its own visual system (`#05050a` near-black,
Anton/Poppins/Azeret Mono), not driven by `css/tokens.css`.

It replaces the old "Side projects & Experimentation" drawer entry
(which pointed at `https://ankitpassi.in/ai`) and the `side-projects.html`
page — that file is still on disk, just no longer linked from the drawer.

## To edit the text and projects

Everything editable lives in [js/experiments-data.js](../js/experiments-data.js):

- `title` / `subtitle` — the big wordmark and the line under it
- `backHref` — where the "← Back" pill goes (`index.html` by default)
- `projects` — the list of experiments. Each one becomes a glowing node
  on the canvas; clicking it opens the info card. Add, remove, or edit
  entries freely:
  ```js
  { name: "UX Mind", desc: "One line about it.", link: "https://..." }
  ```
  `link` can be an external URL or a relative path to another page on
  this site. Clicking "Open →" always opens it in a new tab.

  There's no photo field per project — the card's thumbnail is a live
  screenshot of `link` itself (via [Microlink](https://microlink.io)'s
  free screenshot API, no key needed), fetched fresh each time the card
  opens. If `link` isn't a real `http(s)` URL, or the screenshot fails
  to load, the thumbnail area just shows a plain gradient instead of a
  broken-image icon — same graceful-fallback pattern as everywhere else
  on the site.

## Visual tuning

Also in `js/experiments-data.js`, carried over from the original
design's own defaults:

| Field | What it does |
|---|---|
| `ambientNodeCount` | How many purely decorative (non-project) drifting dots fill out the scene |
| `motionSpeed` | How fast nodes wander/orbit |
| `nodeSizeScale` | Size multiplier for project nodes specifically (ambient dots are unaffected) |
| `reduceMotion` | Force-disables drift/twinkle animation regardless of the visitor's OS setting |

`reduceMotion` doesn't need to be turned on manually for accessibility —
[js/experiments.js](../js/experiments.js) already checks
`prefers-reduced-motion: reduce` on its own and disables motion
automatically for anyone with that OS setting on. The data field is only
there to force it on for everyone, if you ever wanted that.

## How it works

- [js/experiments.js](../js/experiments.js) reads `window.EXPERIMENTS`,
  wires up the static text/back-link, then runs one
  `requestAnimationFrame` loop that owns all the canvas drawing and
  physics (node wandering, cursor parallax, collision, hover glow
  trails, drag-and-release). This is a direct port of the original
  Claude Design canvas prototype's math — not a reinterpretation — so
  it stays pixel-faithful to the design.
- [css/experiments.css](../css/experiments.css) is entirely
  self-contained, same as `css/about.css` — it does not use the site's
  shared `css/tokens.css`, on purpose.
- The day/evening/night color phase is always auto-detected from the
  real current hour — there's no manual override in the UI.
- Dragging a node and releasing it lets it spring back toward its
  orbit; nodes gently push off each other on overlap (simple collision,
  not a physics engine).
