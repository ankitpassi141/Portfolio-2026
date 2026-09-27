# Constellations Page — Reference

`constellations.html` is one page with two versions, picked with the
**V1 / V2** switch in the bottom-left corner (top-left, under the back pill,
on narrow screens). The choice lives in the URL — `?v=1` for V1, nothing for
V2 (the default) — and switching reloads the page, so only one version ever
runs. The Experiments page's **Constellations** node (entry in
[js/experiments-data.js](../js/experiments-data.js)) opens V2.

- **V1** — the original particle field, exactly as first shipped: a million
  particles, click to gather them into a shape, a black-hole cursor,
  self-forming clusters / constellations / star rivers, shooting stars,
  right-drag orbit, and Rotation speed / Cursor radius sliders.
- **V2** — a spacecraft you fly through a glowing green particle tube.
  Most of this doc is about V2.

The page has its own dark palette and IBM Plex Mono (plus Share Tech Mono
for the odometer) — like `css/experiments.css`, it doesn't use
`css/tokens.css`.

## What V2 does

- **The field**: ~490k particles (243k on small screens), each wandering
  on its own path, fill a cube centred on the spacecraft. The cube wraps on
  every axis, so the field never runs out however far you fly.
- **Spacecraft**: sits just below the middle of the screen with a chase
  camera locked behind it. Desktop: **↑** fly, **↓** brake/reverse,
  **← →** turn (WASD works too), **Shift** boost; a key hint shows until the
  first key press. Touch screens: an on-screen arrow pad plus a **⇧** boost
  button. Turning eases in and out (`TURN_EASE`) rather than snapping.
- **Flight mode** toggle (bottom centre): **Manual** is the above.
  **Auto-cruise** follows the tube on its own, working up gradually to max
  speed (`AUTO_RAMP_SECONDS`). The tube is hidden and its walls don't
  count: ←/→ take over and can steer right off the course, and after
  `AUTO_RESUME_SECONDS` (3s) with no ←/→ the autopilot takes back over and
  flies onto the course again (if you've strayed far, the course is relaid
  ahead of you). Pressing ↑ or ↓ switches back to Manual. Switching either
  way keeps the current speed.
- **Speed** (Manual): ↑ flies at the cruise speed. It starts at `BASE_SPEED`
  (~860 km/h); every waypoint flown through the middle of the tube adds 10%
  (`LOOP_SPEEDUP`) up to `SPEED_CAP` (~2,160 km/h). Past the cap the speed
  holds and the tube narrows 4% per waypoint (`LOOP_SHRINK`) down to
  `LOOP_MIN_RADIUS` (1.05 — still ~1.8x the craft's half-wingspan). Any hit
  resets the speed to cruise and the tube to full width.
- **Shift boost** (both modes): the speed eases up to `BOOST` (1.6x) while
  held — past the cap — and back down when released.
- **Speed readout**: a rolling digital odometer (km/h, 1 world unit = 50 m)
  — bottom-right on desktop, top-right on phones. It pulses on each waypoint
  and shakes red on a hit. The sound toggle sits top-right.
- **The course**: invisible waypoints laid one after another along a gently
  curving path at the craft's height, 4 ahead at a time, drawn as a flowing
  tube of green light (8 twisting strands plus faint rings) through them.
  Through the middle at a waypoint speeds you up; clipping the wall there
  counts as a hit (Manual only; the tube is hidden in Auto-cruise). It restarts ahead of the craft if it strays
  or turns around. `LOOP_COLOR` #39ff14 is reserved for the tube: nothing
  else in the scene uses it. (In the code waypoints are still called
  "loops" — they used to be drawn as rings.)
- **Nothing else on the route**: obstacles are only placed at least
  `ROUTE_CLEARANCE` + their own size away from the route, and any obstacle
  already on a newly laid stretch of route quietly dissolves.
- **Obstacles**: shapes keep forming on their own (up to 5, a new one
  every 2.5–5s) — spheres/ellipsoids, tori, boxes, torus knots, spirals,
  rings, helices, octahedra, small constellations and star rivers, in
  sky/orchid/amber, each with a random size, uneven stretch and proportions.
  Hitting one makes it explode, rattles the craft for ~2.6s and resets the
  speed; the craft keeps flying.
- **Background**: large distant spiral galaxies (`GALAXY_SCALE` 4.5x) and
  two enormous, slowly flowing galaxy rivers (`RIVER_SCALE` 2.5x) arcing
  high across the sky — each new one builds up star by star over
  `LANDMARK_REVEAL` seconds instead of popping in; a faint starfield;
  shooting stars (at most 3, every 4–12s). No green in the background.
- **Sound** (synthesised with Web Audio, no files): a rocket rumble that
  swells with thrust and speed, and a blast on every hit. It starts on the
  first key press / tap (browser rule); the speaker button mutes it,
  remembered in `localStorage` (`constellations-sound`).

## Files

- [constellations.html](../constellations.html) — markup for both versions.
  A tiny inline script in `<head>` sets `<html class="v1">` or `"v2"` from
  `?v=` before first paint; elements marked `.v1-only` / `.v2-only` show
  only in their version. Loads Three.js r128 from cdnjs, the page script and
  the shared cookie consent.
- [css/constellations.css](../css/constellations.css) — styles for both
  (V1-only rules are grouped at the end).
- [js/constellations.js](../js/constellations.js) — both versions:
  `runV1()` (the original, unchanged) and `runV2()` (the spacecraft); only
  the chosen one runs. Each has its tuning knobs grouped at its top (V2:
  particle count, cruise speed, waypoint speed-up, speed cap, auto ramp,
  auto-resume delay, boost, tube narrowing, turn easing, streaks, wake, course spacing/count, route
  clearance, obstacle size and pacing, explosion strength, camera framing,
  galaxy/river sizes and build-up, meteor pacing). Append `?n=768` (etc.)
  to change the particle count (particles = n²).

## How it works

Particle physics runs on the GPU: positions and velocities live in float
render targets and are updated each frame by two full-screen shader passes
(velocity, then position). In V2 the position texture's `w` channel holds
which obstacle cluster a particle belongs to; cluster shapes are procedural
(computed in the shader from a shape type + the cluster's seed), and each
cluster's rotation matrix also carries its uneven stretch.

The course, galaxies and rivers are ordinary Three.js objects. The tube is
rebuilt on the CPU (a Catmull-Rom curve through the waypoints) whenever the
course changes. Scoring checks whether the segment the craft moved this
frame crosses a waypoint's plane, and how far from its centre — so it works
at any speed. Obstacle collisions also test the whole swept segment.

To keep float precision fine on long flights, once the craft is 400 units
from the origin the whole V2 world is shifted back by that offset in a
single frame (`rebaseWorld`).

Needs WebGL with float (or half-float) render targets; otherwise the page
shows a fallback message.
