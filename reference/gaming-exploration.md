# Photo Pages — Reference

Two pages, two folders, two interaction styles. The HTML filenames match
what each page actually shows; the JS/CSS implementation files underneath
are still named after the interaction style they were originally built
with, not the content — see the table.

| Nav label | Page (file) | Interaction | Implementation | Folder | Manifest data |
|---|---|---|---|---|---|
| Photo gallery | `photo-gallery.html` | Cursor-trail wall | `js/gaming.js` + `css/gaming.css` | `images/gallery/` | `js/gallery-manifest.js` |
| Gaming & Exploration | `gaming-gallery.html` | "Infinite Fold" drag-to-pan | `js/gallery.js` + `css/gallery.css` | `images/gaming/` | `js/gaming-manifest.js` + `js/gaming-data.js` |

In short: `photo-gallery.html` loads `js/gaming.js` (the cursor-trail
logic) and shows photography. `gaming-gallery.html` loads `js/gallery.js`
(the Infinite Fold logic) and shows game screenshots. If you're hunting
for a page's code, use the table — the HTML filename won't lead you there
directly.

## Photo gallery (`photo-gallery.html`)

Move your pointer across the page and photo chips spawn under it, fading
out on their own after a few seconds. Purely decorative — clicking a chip
does nothing, and cards show the photo only — no title, caption, or other
text on them. Brutalist yellow canvas, Anton + Space Mono — a separate
visual system from the rest of the site, carried over from a Claude
Design handoff.

To add a photo: drop it into [images/gallery/](../images/gallery/), then
run `scripts/build-gallery-manifest.ps1` (or double-click
`scripts/update-gallery.bat`) to regenerate
[js/gallery-manifest.js](../js/gallery-manifest.js). That's it — no
caption step, since nothing on this page displays one.

[js/gaming.js](../js/gaming.js) reads `window.GALLERY_PHOTOS` and drives
the whole page. With no photos in `images/gallery/`, it shows a plain "no
photos yet" message instead of the interactive canvas.

(`js/gallery-data.js` / `window.GALLERY_CAPTIONS` still exists on disk
from when this page showed a title/tech bar on each card, but nothing
loads it anymore — it's not wired into `photo-gallery.html`. Safe to
ignore, or delete, unless a caption bar comes back.)

## Gaming & Exploration (`gaming-gallery.html`)

Drag in any direction to pan an infinitely-recycled 3D grid of screenshots;
click a card to focus it full-size. Full-viewport dark canvas — also a
separate visual system, not driven by `css/tokens.css`.

To add a photo: drop it into [images/gaming/](../images/gaming/), then run
`scripts/build-gaming-manifest.ps1` (or double-click
`scripts/update-gaming.bat`) to regenerate
[js/gaming-manifest.js](../js/gaming-manifest.js). Caption it (optional) in
[js/gaming-data.js](../js/gaming-data.js), keyed by filename — same
`{title, place, tech}` shape as above.

Screenshots dropped into this folder are typically full game-resolution
(often several MB, sometimes 10MB+) — run
`scripts/compress-gaming-images.ps1` **before** the manifest step to
downscale everything to a 1800px max edge and re-encode as JPEG (quality
80). It normalizes every filename to lowercase `.jpg` in the process, and
applies any EXIF rotation first (a few files in here have turned out to be
real photos, not screenshots). This is a lossy, in-place, one-way
operation — it overwrites the originals — so only run it on files you're
fine losing full resolution on. `update-gaming.bat` only runs the manifest
step; compression is separate since it's destructive.

[js/gallery.js](../js/gallery.js) reads `window.GAMING_PHOTOS` +
`window.GAMING_CAPTIONS` and drives the whole page.

## A note on the crossed naming

Nothing here is named after what it currently shows — everything is named
after what it originally was:

- **HTML files** (`photo-gallery.html`, `gaming-gallery.html`) — named
  after **content** (what the visitor sees).
- **JS/CSS implementation files** (`gaming.js`/`gaming.css`,
  `gallery.js`/`gallery.css`) — named after **interaction style** (the
  cursor-trail wall vs. Infinite Fold), not content.
- **Data files** (`gallery-data.js`/`gallery-manifest.js`,
  `gaming-data.js`/`gaming-manifest.js`) — named after the **image
  folder** they describe (`images/gallery/`, `images/gaming/`), not
  content or the page that currently displays them.

Three different naming schemes, three different axes. If you're adding a
third page like this, decide up front which axis its files are named
after, and don't assume any two files sharing "gallery" or "gaming" in
their name are related to the same thing.
