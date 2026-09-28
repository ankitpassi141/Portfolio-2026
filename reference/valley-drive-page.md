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
  switch back. On auto-drive, **Shift** boosts and **Space** brakes without taking over.
- Space brakes (stops, never reverses), Shift boosts, `R` back to the road, scroll / `+` `−` zoom.
- **Touch screens (mobile) only** — `(pointer: coarse)` in the CSS, `MOBILE` in the JS: the HUD is
  80 px tall and the car is always on auto-drive (no manual mode). ◀ / ▶ sit at the middle of each
  edge and steer by hand while held (auto-drive takes the wheel back on release); Brake and Boost
  sit just above the HUD. Pinch to zoom.

## World
- Low-poly terrain: 64 m chunks, 30 segments, one colour per triangle. Dirt trails wind across the
  hills (zero-lines of two noise fields, gated by a third so they come and go; gentle ground only);
  they're looks only — auto-drive follows the road. Trees (200 attempts per chunk) keep off them.
- Road hazards: boulders, stones, and logs across half the road. Logs become bodies when hit: they
  slide, spin, roll downhill and hop, and a hard hit (> ~32 km/h) snaps them in two.
- Auto-drive steers for the clear line past the nearest hazards (across-the-road coordinates +
  cross-track term), slows while threading past, and creeps through a boulder rather than a log.
- Rear wheels leave fading tyre tracks and kick up dust (spray in snow); puddles throw water spray
  with a splash sound.

## Time, weather, sky
- Time toggle: Auto (five phases of 90–120 s: early morning, morning, afternoon, evening, night) or a
  fixed Early morning / Day / Afternoon / Evening / Night the clock glides to.
- Weather toggle: Auto (each phase rolls rain / thunderstorm / snow / dry, plus fog, cloud and
  wind, easing over about a minute) or Rain / Snow / Clear / Overcast presets.
- Snow settles (patchy first, then everywhere) and melts once the sun is up (or in rain), leaving
  sky-tinted glossy puddles that dry slowly. Random wind gusts every 7–25 s with a whoosh.
- Clouds: low-poly clusters drifting high up with the wind (more when cloudy). They always cast
  shadows across the ground; the clouds themselves fade in once you zoom out.
- Fireflies at night whenever there's no rain or thunder.

## Sound
Web Audio, all synthesised: engine, wind + gust whooshes, rain + drops, thunder, puddle splashes,
log thuds and cracks.
