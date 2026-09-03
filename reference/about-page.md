# About Page ("Off the Clock") — Reference

`about.html` is the personal/off-duty page — hobbies, side projects, a
small bit of who you are. Deliberately no employer names, job titles, or
career narrative, and a completely separate visual system (warm serif +
mono, `#EFE6D9`/`#B7461D`/`#E06A2E`) from the rest of the site — carried
over from a Claude Design handoff.

## To edit the text

Everything on the page — the browser tab title, the section headings, the
hero belief/mission lines, the bio, the quick facts, all the hobby cards,
the Q&A pairs, the tag cloud, the footer — lives in one place:
[js/about-data.js](../js/about-data.js). Open it and edit the strings
directly; [js/about.js](../js/about.js) reads that file and builds the
whole page from it, so no HTML editing is needed for a text change.

| Field | Where it shows |
|---|---|
| `pageTitle` | Browser tab title |
| `pageDescription` | Search/share preview description (not visible on the page itself) |
| `bioKicker` | Small label above the bio paragraph (default "About me") |
| `hobbiesHeading` | Heading above the hobby cards |
| `tagsLabel` | Small label above the tag cloud (default "Also true") |

## To add photos

There are 13 named photo slots, all inside [images/about/](../images/about/):

| Slot | Filename | Where it shows |
|---|---|---|
| Hero portrait | `hero-portrait.jpg` | Large photo, left of the hero |
| Thumbnail 1–4 | `thumb-1.jpg` … `thumb-4.jpg` | 2×2 grid, right of the hero — unlabeled by design |
| Hobby 1 | `hobby-1-photography.jpg` | "Virtual photography" card |
| Hobby 2 | `hobby-2-pc-building.jpg` | "PC building" card |
| Hobby 3 | `hobby-3-handmade.jpg` | "DIY" card |
| Hobby 4 | `hobby-4-wall-painting.jpg` | "Wall painting" card |
| Hobby 5 | `hobby-6-football.jpg` | "Football" card |
| Hobby 6 | `hobby-7-running.jpg` | "Running" card |
| Hobby 7 | `hobby-8-reading.jpg` | "Currently reading" card |
| Hobby 8 | `hobby-5-harmonica.jpg` | "Harmonica" card (also has a hover video — see below) |

Drop a file in with the exact name above and refresh — no manifest
script, no build step. Filenames (and which hobby maps to which photo)
are set in [js/about-data.js](../js/about-data.js), one `photo:` field
per item, so you can rename or reassign a slot there if you want a
different filename.

**Until a photo exists**, that slot shows a solid color gradient instead
(the same colors the original mockup used as its placeholder) — a real
CSS background, not a broken-image icon, so the page never looks broken
while you're still collecting photos. Each item's `gradient:` field in
`js/about-data.js` controls that fallback color if you want to change it.

Phone photos are usually full camera resolution (and sometimes HEIC) —
run `scripts/compress-about-images.ps1` after adding new ones. It
downscales to a 1600px max edge, re-encodes as JPEG (quality 80), applies
any EXIF rotation first, and converts anything else (`.png`, `.heic`,
`.heif`) to `.jpg` in the process — so drop a photo in under any of those
extensions and the script normalizes it to match the filenames above.
Lossy and in-place, like `compress-gaming-images.ps1`.

## To add a hover video to a hobby card

The Harmonica card plays a video instead of just showing its photo, and
the card lifts slightly while hovered:

- **Desktop / anywhere with real hover** — the video plays on hover,
  right in the card, with sound (not muted).
- **Touch devices (phones/tablets — no real hover)** — tapping the card
  instead opens a fullscreen lightbox that autoplays the same clip with
  sound and normal video controls, since a tap is a genuine user gesture
  there and sound is reliable in a way hover-without-a-mouse isn't.
  Closing the lightbox (× button, Escape, or tapping outside the video)
  stops playback.

This is automatic for any hobby with a `video` field — the device check
(`hover: none` / `pointer: coarse`) lives in `about.js`, not per-card.
[images/about/hobby-5-harmonica.mp4](../images/about/) already exists,
so the Harmonica card just works — no other changes needed.

To add this to a *different* hobby card: drop the raw clip anywhere (any
format ffmpeg reads — `.mov`, `.mp4`, whatever your phone exports), then
run:

```
scripts/compress-video.ps1 -InputPath "path\to\clip.mov" -Slug "hobby-6-football"
```

That writes both `images/about/hobby-6-football.mp4` (compressed with
audio kept, trimmed to 30s by default — pass `-Duration 45` etc. to change
it) and `images/about/hobby-6-football.jpg` (a poster frame — grabbed from
frame 0 of the *output* video, not the source, so it's pixel-identical to
what the video shows the instant it starts playing and there's no visible
crop jump when hover swaps photo for video) — matching whatever slug you
pass. Add
`video: "hobby-6-football.mp4"` to that hobby's entry in
`js/about-data.js` (its `photo:` field should already point at the
matching `.jpg`) and that's the only thing that turns a plain photo card
into a hover-video one. Leave `video` out and a card behaves exactly like
the others.

A video-enabled card shows the video itself directly (no separate photo
layered underneath it) — its `photo` becomes the video's `poster`, the
still frame shown before it's played, so the card looks identical to a
plain photo card until it's hovered/tapped. If the file is missing or
fails to load, the poster just keeps showing — nothing breaks. Requires
ffmpeg on `PATH` (installed via `winget install Gyan.FFmpeg`).

Plays with sound, not muted — browsers vary on whether hovering counts as
enough of a "user gesture" to allow audio autoplay, so it may play silent
on the first hover in some browsers even though the file has an audio
track. That's a browser policy, not a bug here. On the lightbox (tap, not
hover) sound is reliable, since a tap always counts as a user gesture.

The video fills the tile with `object-fit: cover`, same as a plain
photo's `.fb` layer — no separate crop/inset treatment for video cards,
so it looks and sizes exactly like every other card.

## How it works

- [js/about.js](../js/about.js) reads `window.ABOUT` and builds every
  section of the page, then wires up the scroll-reveal animation
  (`IntersectionObserver`, adds an `in` class as each element enters the
  viewport — see `.reveal` in `css/about.css`).
- Each photo slot is two CSS background layers — the real photo on top,
  its fallback gradient underneath — so a missing file just lets the
  gradient show through instead of a broken image.
- [css/about.css](../css/about.css) is entirely self-contained — it does
  not use the site's `css/tokens.css` design tokens, on purpose (see the
  file's own header comment).
- Hero thumbnails are intentionally unlabeled and independent of the
  hobby cards below (different `photo`/`gradient` fields) — that's a
  locked design decision from the original spec, not an oversight.
