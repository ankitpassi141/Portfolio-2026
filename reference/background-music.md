# Background Music — Reference

A single track plays site-wide, with a small toggle icon in the header of
every page. This is a multi-page site (not an SPA), so audio can't
literally survive a real page navigation — instead, every page starts the
same track fresh and resumes it from wherever it last stopped, in the
same play/paused state, via `localStorage`. In practice this feels
continuous: same track, same position, same play state, page after page.

## The icon

Split from Google's Material Symbols `motion_play` / `motion_photos_paused`
glyphs (Apache License 2.0) into three separate pieces, so the ring can
spin independently of the center glyph:

| Piece | File | Shown |
|---|---|---|
| Ring + dot | [images/icons/audio/ring.svg](../images/icons/audio/ring.svg) | Always — spins while playing, static while paused |
| Play glyph | [images/icons/audio/play.svg](../images/icons/audio/play.svg) | Centered, while **playing** |
| Pause glyph | [images/icons/audio/pause.svg](../images/icons/audio/pause.svg) | Centered, while **paused** |

Paused (the default, first-ever-visit state): static ring, play glyph
showing — the icon you'd press to start it. Click to play: the ring
starts spinning (only the ring — the glyph never moves) and the glyph
swaps to pause. Click again: playback stops, the ring stops, the glyph
swaps back to play.

To swap the look entirely, replace any of the three SVGs (same filename)
— each is drawn via `mask-image` in
[css/background-music.css](../css/background-music.css), so any
single-color/flat SVG works and it renders in whatever color the
surrounding header text already is (see "Placement" below) — no separate
icon theming to maintain.

## To add the track

Drop an MP3 at **`audio/background-music.mp3`** — that's the only file
this looks for, no manifest step. Until that file exists, every page
quietly shows no toggle at all (same "nothing broken, just not there yet"
convention as the photo galleries) — drop the file in, refresh, and the
icon appears. Pick a track that loops cleanly (it loops), and keep the
file a reasonably compressed MP3 — it's requested fresh on every page load.

## Placement

Inline in the header of every page that has one — a `<span id="bgmSlot">`
sits somewhere in that page's own top bar (see the table below), and
[js/background-music.js](../js/background-music.js) builds the icon
inside it. It's colored via `currentColor`, so it automatically matches
whatever that header's ambient text color already is — no per-page
palette work needed, unlike the Contact popup (see
[social-icons.md](social-icons.md)), which does need per-page colors
because it has its own background/border.

Three pages have **no** header row — Experiments, Gaming & Exploration,
and Photo Gallery are full-viewport canvases with just a floating
back-link in a corner, nothing resembling a top bar. Those don't get a
`#bgmSlot`, so the script falls back to building a floating bottom-right
dark pill instead (`.bgm-toggle--floating` in
[css/background-music.css](../css/background-music.css)). Experiments
overrides that to bottom-left in
[css/experiments.css](../css/experiments.css), since that page already
has its own on-screen clock in the bottom-right corner.

| Page | Slot lives in |
|---|---|
| Home, Case Studies, Side Projects | `.topbar__meta` / `.subtopbar__meta` |
| About | `.obar` |
| Case Study (iframe template) | `.case-page__bar` |
| Design System | `.ds-header__meta` |
| SmartADC / Assessment Generator / Power-BI (teaser) | `header .wrap` |
| …and their `/raw` pages | `.sa-topbar` / `.cs-topbar` / `.pb-topbar` |
| Experiments, Gaming & Exploration, Photo Gallery | *(none — floating fallback)* |

To add this to a new page: add a `<span id="bgmSlot" class="bgm-slot"></span>`
somewhere in its header (wrap it with any adjacent element in a small flex
group if the header uses `justify-content: space-between` with exactly
two children already — see how the teaser pages' `.header-right` wrapper
does this, to avoid a third item breaking that layout), then load
`css/background-music.css` and `js/background-music.js` (that page's own
relative path depth, same convention as every other per-depth asset here).
A page with no natural header can skip the slot entirely and will get the
floating fallback automatically.

## How it works

- [js/background-music.js](../js/background-music.js) creates the
  `<audio>` element and the toggle button — there's no static button
  markup, only the empty `#bgmSlot` span; the button itself is built in
  JS and appended into it (or to `<body>` for the floating fallback), the
  same way the case-study lightboxes are.
- **Real pause/play**, not muting — clicking actually calls
  `audio.pause()`/`audio.play()`. Default state on a first-ever visit is
  paused (nothing autoplays before a real click).
- **Next page load**: the script tries to resume both the saved playback
  position and the saved play state. Resuming position always works.
  Resuming *playback* automatically (with no click on the new page) is an
  autoplay-with-sound attempt outside a fresh gesture — most browsers
  allow it once you've genuinely interacted with audio on the same site
  before (Chrome's "Media Engagement Index," for example), but if a
  browser blocks it, `play()` just rejects and the icon honestly shows
  "paused" rather than pretending otherwise.
- **Position persistence**: `currentTime` is written to `localStorage`
  once a second, plus on tab-hide and page-unload.
- The button's own `play`/`pause` event listeners (not the click handler
  directly) are what update the icon and `localStorage` — so the icon
  always reflects what the `<audio>` element actually did, including the
  case where an autoplay attempt above gets silently blocked.
