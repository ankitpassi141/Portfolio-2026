# Constellations Page — Reference

For now Constellations is **two separate pages** (they were one page with a
V1 / V2 switch; they'll be merged back once V2 is ready):

- **V1 — [constellations.html](../constellations.html)**, the default and
  the one the Experiments page's **Constellations** node opens (entry in
  [js/experiments-data.js](../js/experiments-data.js)). The original
  particle field, exactly as first shipped: a million particles, click to
  gather them into a shape, a black-hole cursor, self-forming clusters /
  constellations / star rivers, shooting stars, right-drag orbit, and
  Rotation speed / Cursor radius sliders.
- **V2 — [constellations-v2.html](../constellations-v2.html)**, work in
  progress: a spacecraft you fly anywhere in 3D through a glowing green
  particle tube. Not linked from anywhere, not in `seo-data.json`, and
  marked `<meta name="robots" content="noindex">`. Most of this doc is
  about V2.

The pages have their own dark palette and IBM Plex Mono (plus Share Tech
Mono for the odometer) — like `css/experiments.css`, they don't use
`css/tokens.css`.

**To merge them back:** one HTML page with both versions' markup and an
inline `<head>` script setting `<html class="v1|v2">` from the URL (e.g.
`?v=`), a V1 / V2 switch (its `.corner` / `.seg` styles are still in the
CSS), and one script that runs `runV1()` or `runV2()` by that class — see
commit 5b252b1 for exactly how it was done.

## What V2 does

- **The field**: ~490k particles (243k on small screens), each wandering
  on its own path, fill a cube centred on the spacecraft. The cube wraps on
  every axis, so the field never runs out however far you fly.
- **Spacecraft**: flies in full 3D and **always flies forward** — no key
  needed to move. It sits just below the middle of the screen with a chase
  camera that follows its orientation on every axis (easing after it), so
  climbs, dives and full loops all work. Desktop: **← →** turn, **↑** nose
  up / **↓** nose down (`CRAFT_TURN`, `CRAFT_PITCH`; WASD works too) — hold
  ↑ and it loops right round. Steering is in the craft's own frame; when not
  pitching it gently rolls back upright (`AUTO_LEVEL`) so left/right stay
  intuitive. **Space** brakes, down to a stop (`BRAKE_RATE`); let go and it
  picks back up to cruise speed. **Shift** boosts. A key hint shows until
  the first key press. Touch screens (`body.touch`): they start in
  **Auto-cruise**, have no arrow pad, and steer left/right only (they can't
  pitch, so for them the course stays level at the craft's height). Steer by
  **tilting the phone** left/right (proportional: nothing inside
  `TILT_DEADZONE` 5°, full turn at `TILT_FULL` 25°; portrait uses `gamma`,
  landscape `beta`) or by tapping/dragging on the left / right half of the
  screen (a touch overrides tilt; dragging across the middle switches
  sides). iOS only gives motion data after permission, which is asked on the
  first tap. Hold the **Boost** button, right of the flight-mode toggle in
  one bottom-centre bar (`.flightbar`). A "Tilt or tap left / right to
  steer" hint shows until the first touch. Turning and pitching ease in and
  out (`TURN_EASE`) rather than snapping.
- **Flight mode** toggle (bottom centre): **Manual** is the above.
  **Auto-cruise** follows the tube on its own (turning and pitching, in
  3D), working up gradually to max speed (`AUTO_RAMP_SECONDS`). The tube is
  hidden and its walls don't count: any arrow key takes over and can steer
  right off the course, and after `AUTO_RESUME_SECONDS` (3s) with no
  steering the autopilot takes back over and flies onto the course again
  (if you've strayed far, the course is relaid ahead of you). Space still
  brakes. Switching either way keeps the current speed. **On touch screens
  Auto-cruise doesn't follow the path** — it only ramps up the speed;
  steering (tilt / taps) is entirely the player's. Path following is
  desktop-only.
- **Speed** (Manual): the craft flies at the cruise speed. It starts at `BASE_SPEED`
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
- **The course**: invisible waypoints laid one after another along a path
  that bends gently any way round — left, right, up, down — never more than
  `COURSE_MAX_BEND` off where the craft points, 4 ahead at a time, drawn as
  a flowing tube of green light (8 twisting strands plus faint rings,
  framed by parallel transport so it never pinches when it runs vertical).
  Through the middle at a waypoint speeds you up; clipping the wall there
  counts as a hit (Manual only; the tube is hidden in Auto-cruise). It
  restarts ahead of the craft if it strays or turns around, and in Manual
  also once it's been more than `COURSE_IN_VIEW` off the nose for
  `COURSE_OFF_GRACE` (1.5s). `LOOP_COLOR` #39ff14 is reserved for the tube: nothing
  else in the scene uses it. (In the code waypoints are still called
  "loops" — they used to be drawn as rings.)
- **Nothing else on the route**: obstacles are only placed at least
  `ROUTE_CLEARANCE` + their own size away from the route, and any obstacle
  already on a newly laid stretch of route quietly dissolves.
- **Obstacles**: shapes keep forming on their own just ahead, off to any
  side of the flight path — beside, above or below (up to 5, a new one
  every 2.5–5s) — spheres/ellipsoids, tori, boxes, torus knots, spirals,
  rings, helices, octahedra, small constellations and star rivers, in
  sky/orchid/amber, each with a random size, uneven stretch and proportions.
  Hitting one makes it explode, rattles the craft for ~2.6s and resets the
  speed; the craft keeps flying.
- **Background**: large distant spiral galaxies (`GALAXY_SCALE` 4.5x) and
  two enormous, slowly flowing galaxy rivers (`RIVER_SCALE` 2.5x) arcing
  across the sky far off to one side — placed in 3D around the way the craft
  points — each new one builds up star by star over
  `LANDMARK_REVEAL` seconds instead of popping in; a faint starfield;
  shooting stars (at most 3, every 4–12s). No green in the background.
- **Sound** (synthesised with Web Audio, no files): a rocket rumble that
  swells with thrust and speed, and a blast on every hit. It starts on the
  first key press / tap (browser rule); the speaker button mutes it,
  remembered in `localStorage` (`constellations-sound`).

## Files

- [constellations.html](../constellations.html) — V1 markup
  (`<html class="v1">`). Loads Three.js r128 from cdnjs, the V1 script and
  the shared cookie consent.
- [constellations-v2.html](../constellations-v2.html) — V2 markup
  (`<html class="v2">`, `noindex`). Loads Three.js, the V2 script and the
  cookie consent.
- [css/constellations.css](../css/constellations.css) — shared by both
  pages; `.v1-only` / `.v2-only` elements show only in their version (V1-only
  rules are grouped at the end).
- [js/constellations.js](../js/constellations.js) — V1: `runV1()`, the
  original, unchanged.
- [js/constellations-v2.js](../js/constellations-v2.js) — V2: `runV2()`,
  the spacecraft. Its tuning knobs are grouped at the top of `runV2()`
  (particle count, cruise speed, waypoint speed-up, speed cap, auto ramp,
  pitch rate, auto-level, brake, auto-resume delay, boost, tube narrowing,
  turn easing, streaks, wake, course spacing/count, route clearance,
  obstacle size and pacing, explosion strength, camera framing,
  galaxy/river sizes and build-up, meteor pacing). Append `?n=768` (etc.)
  to either page to change the particle count (particles = n²).

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
