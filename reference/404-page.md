# 404 page

`404.html` at the repo root — GitHub Pages automatically serves this
for any unmatched path on the custom domain, no extra configuration
needed.

## What it is

The same "Infinite Fold" drag-to-pan 3D card engine as
gaming-gallery.html (see `css/gallery.css` and the original
`js/gallery.js`), but:

- **Combined deck** — both `images/gallery/` (via
  `js/gallery-manifest.js`) and `images/gaming/` (via
  `js/gaming-manifest.js` + `js/gaming-data.js` for captions) feed into
  one shuffled `FRAMES` array in `js/404.js`, instead of just one folder.
- **Auto-drift** — when nobody's touched it for ~900ms, the grid drifts
  on its own in a slowly-wandering direction (changes heading gradually
  every ~4.5s, never an instant flip). A drag or flick takes over
  immediately and pauses drift until it's idle again. See the
  `applyDrift()` / `lastInteraction` logic in `js/404.js` — pinch-zoom
  and momentum panning are otherwise the unmodified original engine.
  gaming-gallery.html's `js/gallery.js` later got this same drift added
  too (see reference/gaming-exploration.md) — identical mechanism, still
  a separate copy, not shared.
- **No lightbox** — the original engine's tap-to-open zoomed photo view
  (`.fold-focus`, `openFocus()`/`closeFocus()` and everything under
  them) was stripped out entirely: no markup, no JS, no `state.focusIdx`.
  Cards are drag/drift-only here, purely decorative — clicking one does
  nothing. gaming-gallery.html's own `js/gallery.js` still has it; the
  two files aren't shared, so a lightbox change there doesn't need to
  (and shouldn't) come here.
- **404 overlay** — the "404" / subtext / "Let me take you back" block
  (`css/404.css`, `.fold-404`) sits on top with `pointer-events: none`
  except on the button itself, so dragging still works everywhere,
  including visually behind the text.

## If you change the drag engine

`js/404.js` is a copy of `js/gallery.js` with the above three changes
layered in, not a shared/imported module — if you fix a bug or tweak
the physics in one, check whether the other needs the same fix.

## A CSS specificity gotcha already hit once

`css/gallery.css` has `.fold-root a { color: #F2F0EC; }`, which is
higher-specificity than a lone `.fold-404__btn` class rule. The button
is styled as `a.fold-404__btn` (not `.fold-404__btn`) specifically to
outrank it — dropping back to a plain class selector will silently make
the button's text invisible (white text on a near-white pill) even
though nothing else looks wrong.
