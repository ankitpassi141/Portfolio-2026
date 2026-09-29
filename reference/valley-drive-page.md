# Valley Drive page

`valley-drive.html` + `css/valley-drive.css` + `js/valley-drive.js`. An endless low-poly driving toy,
linked from the Experiments page (`js/experiments-data.js`). Started from a single-file prototype
(three.js r128 + simplex-noise 2.4 from jsDelivr, no build step). New random map on every load.

## What's on screen
- **Top-left:** back to Experiments (arrow icon). **Top-right:** hide the controls (eye-slash, or `H`;
  only that button stays, faded), music (the portfolio's `audio/background-music.mp3`, quietly,
  resuming from the site player's `bgm-time`), scene sound. Both on/off choices are remembered.
- **Bottom bar:** [time of day] [HUD 536 × 100: distance · speed with arcs · drive mode] [weather].
  On phones the two tiles move under the top-right buttons and the HUD takes the full width.
- All UI is borderless glass: tint `--glass-a` (temporary slider at the top while it's being picked),
  blur, rim highlights. On Chromium each piece also refracts what's behind it — an SVG
  `feDisplacementMap` built per element (bends the backdrop near the rounded edges), used as its
  `backdrop-filter`. Other browsers get the plain blur.
- Sound and music start on load where the browser allows it (e.g. arriving by a click from
  Experiments); otherwise on the first key press, click or tap.

## Driving
- Starts on **auto-drive**. Drive keys take over; `M`, clicking the mode, or ↑ / ↓ while it's focused
  switch back. On auto-drive, **Space** boosts (flat out, ignoring hazards and traffic ahead — it still steers)
  and **Ctrl** brakes without taking over.
- Ctrl brakes (stops, never reverses), Space boosts, `R` back to the road, scroll / `+` `−` zoom.
- **Touch screens (mobile) only** — `(pointer: coarse)` in the CSS, `MOBILE` in the JS: the HUD is
  80 px tall and the car is always on auto-drive (no manual mode). ◀ / ▶ sit at the middle of each
  edge and steer by hand while held (auto-drive takes the wheel back on release); Brake and Boost
  sit just above the HUD. Pinch to zoom. With the controls hidden, only Brake and Boost stay
  (moved to the bottom edge); the arrows go too.

## World
- Low-poly terrain: 64 m chunks, 30 segments, one colour per triangle. Dirt trails wind across the
  hills (zero-lines of two noise fields, gated by a third so they come and go; gentle ground only);
  they're looks only — auto-drive follows the road. Trees (200 attempts per chunk) keep off them.
- Rocks: sparse scattered stones (14 tries per chunk, 5 resting boulders) and only rarely one on
  the road itself (a stone in ~1 chunk in 10, a boulder in ~1 in 10). Most rocks arrive as
  **rockfalls**: every 7–18 s (`ROCKFALL_EVERY`) one breaks loose 15–29 m up a steep slope beside the
  road 40–110 m ahead (with a rumble) and rolls down. Guardrails catch it (`railCatch`: it loses most
  of its roll, clangs, and settles against the rail); the odd one gets through an opening onto the
  road. In a 10-minute test, 33 of the 40 that settled were caught by rails and 6 reached the road.
  Rails also start with a few stones already piled against them wherever a slope rises behind.
- **Guardrails** along about 60% of the road, both sides — everywhere it bends (curvature >
  `RAIL_CURVE`), not on the near-straight stretches, and not where the bank beside the road is
  already higher than the rail. Styled on a highway W-beam: double-ridged rail (`GEOS.wbeam`) on
  I-beam posts (`GEOS.ibeam`) every 2 m, set 0.24 m back on spacer blocks, red reflectors that glow
  brighter at night, and a flared fishtail wherever a run ends. Every 40 m (`RAIL_CELL`) each side
  leaves an opening of 8–14 m so you can still turn off-road; shorter holes are bridged and there
  are no stub runs under three posts. `railAt(z, side)` is a pure function of road position, so
  runs carry on across chunk seams (cached per chunk build). Rails are solid for every vehicle:
  pushed back out, head-on hits scrub speed and swing the vehicle round to glance along the rail
  (with a crunch). Faster traffic is held to bend speed + 7 m/s so it doesn't run wide into them.
- Road hazards: boulders, stones, and logs across half the road. Logs become bodies when hit: they
  slide, spin, roll downhill and hop, and a hard hit (> ~32 km/h) snaps them in two.
- Auto-drive steers for the clear line past the nearest hazards (across-the-road coordinates +
  cross-track term), slows while threading past, and creeps through a boulder rather than a log.
- **Traffic:** another car (random colour), a motorbike with a rider, or a tractor puffing smoke (all
  with headlights at night: one spotlight per traffic slot, made at load so the light count never
  changes) — at most three at a time but never crowded: nothing new spawns while two are already
  within 70 m of the player, spawns keep 60 m apart, the wait grows as the road fills (5.5–16.5 s, up to
  2.5× that), and there's never more than one tractor. Each is spawned either oncoming (~190 m up the road) or from behind
  (~80 m back, faster, so it overtakes). Tractors are too slow to catch up, so they're met ahead
  instead and the player overtakes them. Every vehicle (the player's included) runs through the same
  code: `moveVehicle` (physics), `collideProps` (trees, stones, logs, boulders), `autoInputs`
  (auto-drive, with `v.dir` = which way along the road it drives). With traffic about everyone keeps
  left (India) and overtakes on the right; a vehicle coming the other way claims the road it'll
  cover in the next 2 s, one going the same way is a soft block to wait behind, and one closing in
  from behind is held clear of. Vehicles bump each other as capsules (mass-shared overlap +
  impulse, crunch sound). Each honks once or twice as it comes past the player, often again
  alongside. Engine voices are per vehicle (car saw, buzzy bike, chugging diesel tractor), fading
  with distance, panned and Doppler-shifted.
- Every vehicle's rear wheels leave tyre tracks that fade out over 2.5 s (a ribbon per wheel; traffic borrows
  a slot of the shared pool while it's around), and kick up dust (spray in snow); puddles throw water spray
  with a splash sound.

## Time, weather, sky
- Time toggle: Auto (five phases of 90–120 s: early morning, morning, afternoon, evening, night) or a
  fixed Early morning / Day / Afternoon / Evening / Night the clock glides to.
- Weather toggle: Auto (each phase rolls rain / thunderstorm / snow / dry, plus fog, cloud and
  wind, easing over about a minute) or Rain / Snow / Clear / Overcast presets.
- Snow settles (patchy first, then everywhere). Once the snow is over it clears with an ease-out and is
  gone 12 s later, leaving sky-tinted glossy puddles that swell and dry within the same 12 s; rain
  puddles also dry 12 s after the rain stops. Random wind gusts every 7–25 s with a whoosh.
- Clouds: 22 low-poly clusters of four kinds (heaps, long flat sheets, tall towers, scattered wisps)
  with random size (0.5–1.6×), height (75–135 m) and drift speed; about 5 are out on a clear day,
  15 when it's overcast. They always cast shadows across the ground; the clouds themselves fade in
  once you zoom out, and the car's red silhouette shows through any cloud in front of it (clouds
  mark the stencil buffer; the silhouette draws after them, on top, only where they did).
- Fireflies at night whenever there's no rain or thunder.
- Headlights (the player's and traffic's) only come on at night, once the sun is well below the horizon.

## Sound
Web Audio, all synthesised: engine, wind + gust whooshes, rain + drops, thunder, puddle splashes,
log thuds and cracks, traffic engines, horns and crashes. Music gets priority: while it's playing,
all sound effects are ducked (master 0.85 → 0.4) and the music comes up a little (0.16 → 0.26).

## SEO & sharing
The page's title, description and social card come from `seo-data.json` (see
[seo-metadata.md](seo-metadata.md) for the workflow; run `scripts/sync-seo-meta.ps1` after edits).
Current values, ready to paste anywhere else:

| Field | Value |
|---|---|
| URL | `https://ankitpassi.in/valley-drive.html` |
| Title | V a l l e y D r i v e (page `<title>`, og:title and twitter:title; the structured data keeps the plain name "Valley Drive") |
| Description | Endless drive among the hills. Share the road with honking cars, bikes and a smoky tractor, and watch the weather and the day turn to night. |
| Social banner (og:image / twitter:image) | [images/valley-drive/og.jpg](../images/valley-drive/og.jpg) → `https://ankitpassi.in/images/valley-drive/og.jpg` (1200 × 630 JPG) |
| og:type / twitter:card | `website` / `summary_large_image` |
| Canonical | `<link rel="canonical" href="https://ankitpassi.in/valley-drive.html">` (hand-written in the page head) |
| Structured data | JSON-LD `VideoGame` block in the page head: name, URL, description, banner image, genre (Driving, Sandbox), web-browser platform, free to play, author Ankit Passi. If the description changes, update it here too. |
| Sitemap | listed in [sitemap.xml](../sitemap.xml) (monthly, priority 0.5) |

The banner shows two real frames of the same spot, split diagonally through the car: a clear
afternoon on the left and the same road after a snowfall on the right, with "Valley Drive" and "Zen drive among the valley." in Manrope bottom-left over a soft shade. It
was made with headless Chrome at 1200 × 630 from a throwaway copy of the page: the UI hidden, the
car pinned in place, one frame grabbed from the canvas, the weather switched and left to settle,
the second frame grabbed, then both composited with CSS (`clip-path`) and screenshotted. The car
always sits at the centre of the frame, so the split goes through the middle, on any map. The
current banner uses map seed `VALLEY` (the capture set the seed from a `?seed=` parameter,
temporarily), weather snapped to clear, then 35 s of driving before the car was pinned. To redo
it, repeat that (or swap in any 1200 × 630 JPG at the same path — nothing else needs to change).
