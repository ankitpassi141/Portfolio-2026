# Constellations Page — Reference

[constellations.html](../constellations.html) is one page with two versions,
picked with the **V1 / V2** switch — bottom-left on desktop, top-left
(under the back button) on narrow screens and phones. The choice lives in
the URL: nothing for **V1 (the default)**, `?v=2` for V2 — and switching
reloads the page, so only one version ever runs. The Experiments page's
**Constellations** node (entry in [js/experiments-data.js](../js/experiments-data.js))
opens V1. The old `constellations-v2.html` (from while V2 had its own page)
just redirects to `constellations.html?v=2`.

- **V1** — the original particle field, exactly as first shipped: a million
  particles, click to gather them into a shape, a black-hole cursor,
  self-forming clusters / constellations / star rivers, shooting stars,
  right-drag orbit, and Rotation speed / Cursor radius sliders.
- **V2** — a spacecraft you fly anywhere in 3D, free roaming or taking the
  Challenge through a swirling particle wormhole. Most of this doc is about
  V2.

The page has its own dark palette and IBM Plex Mono (plus Share Tech Mono
for the odometer) — like `css/experiments.css`, it doesn't use
`css/tokens.css`.

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
  intuitive. **Space** brakes, down to a stop (`BRAKE_RATE`). Let go before
  it stops and it picks the speed back up; brake right down to 0 and it
  starts over from rest — pulling away gently (at most `RESTART_ACCEL`,
  0 → cruise in ~2s) at cruise speed, then ramping up as usual. **Shift**
  boosts. A key hint shows until the first key press. Touch screens
  (`body.touch`): they start cruising and have no arrow pad. **Tilt to
  steer** in full 3D: tip the phone left / right to turn, and tip its top
  toward / away from you to climb / dive. Both ease in past a dead zone
  (turn: `TILT_DEADZONE` 5°, full at `TILT_FULL` 35°; climb/dive:
  `PITCH_DEADZONE` 6°, full at `PITCH_FULL` 30°) and level off gently — a
  smoothstep — at 0.7 of the full rate (`TILT_MAX_TURN`, `PITCH_MAX`), so
  steep tilts don't whip the craft round. Both come from the direction of
  gravity in screen coordinates (worked out from the orientation angles),
  so portrait and landscape behave the same and nothing jumps as the phone
  passes upright; side-to-side is measured against whichever of flat /
  upright the phone is nearer, so a 20° tip reads as 20° however steeply
  it's held. Climb/dive is measured from however you're holding the phone —
  calibrated from the first 8 readings, re-centred on rotation or returning
  to the tab, and drifting slowly with you while it's held near the middle.
  Tapping/dragging on the left / right half of the screen also turns (a
  touch overrides tilt; dragging across the middle switches sides).
  **Motion permission**:
  Android just sends the data. iOS needs the visitor to allow it, and a page
  can only ask from inside a tap (no way round that). So the page listens
  from the start (if Safari already allowed the site, tilt just works), saves
  `constellations-tilt` = granted in `localStorage` once motion data
  arrives, quietly re-confirms it on later visits without a tap, and only
  asks — once — on the first tap if there's still no data. Hold the
  **Boost** button, right of the Challenge? button in one bottom-centre bar
  (`.flightbar`); **in landscape** Challenge? moves bottom-left and Boost
  bottom-right (the bar lets taps through between them), and the first tap
  in landscape asks for **fullscreen** to hide the browser's tabs and
  toolbars (Android; iPhone Safari doesn't allow pages to go fullscreen —
  only Add to Home Screen does). All the widgets are a notch smaller on
  phones. A "Tilt to steer · tap left / right to turn" hint shows until the first
  touch. Turning and pitching ease in and out (`TURN_EASE`) rather than
  snapping.
- **Cruising vs Challenge** (the **Challenge?** button, bottom centre).
  Everyone starts **cruising**: the tube is hidden, its walls don't count,
  and the speed keeps ramping up (`AUTO_RAMP_RATE`, ~65 km/h a second, **no
  limit**). On desktop the autopilot follows the course (turning and
  pitching, in 3D) whenever you're not steering: any arrow key takes over
  and can steer right off it, and after `AUTO_RESUME_SECONDS` (3s) with no
  steering it flies back onto the course. On touch screens cruising doesn't
  follow the path — steering (tilt / taps) is entirely the player's.
  **Challenge?** switches to a **Challenge** (the button lights violet and
  reads **Free Roam?**, which switches back): the tube shows, there's no
  autopilot, you fly it yourself. Every waypoint flown through inside the
  tube adds 10% (`LOOP_SPEEDUP`) — **no limit**. The tube's wall is just
  light: **no collision** — flying out through it only ends the distance
  run. Hitting a shape still resets the speed to `BASE_SPEED` (~860 km/h).
  Switching either way keeps the current speed. Space brakes in both.
- **Challenge distance**: a counter under the speed (only during a
  Challenge, and bigger than the speed readout) shows how many metres
  you've flown with the craft's centre inside the tube — measured against
  the tube's actual curve (its centre line + radius sampled every 0.5 units
  when it's rebuilt, `tubeSamples`) — and your **Best**. The count drops
  back to 0 (with a red shake) the moment you leave the tube or hit a
  shape. Best is saved in `localStorage` (`constellations-best`).
- **Shift boost** (both modes): the speed eases up to `BOOST` (1.6x) while
  held and back down when released.
- **Speed readout**: a small rolling digital odometer (km/h, 1 world unit =
  50 m), top centre, with the Challenge counter under it. It pulses on each
  waypoint and shakes red on a hit. The back button (top-left) is just an
  arrow; the sound toggle sits top-right.
- **The course**: invisible waypoints laid one after another along a path
  that bends gently any way round — left, right, up, down — never more than
  `COURSE_MAX_BEND` off its own overall heading (which drifts slowly,
  `COURSE_DRIFT`, so it meanders but never doubles back), 4 ahead at a time.
  It's drawn as a **wormhole of light**: up to `TUBE_MAX_PARTICLES`
  (80k; 32k on small screens) particles at `TUBE_DENSITY` per unit, each a
  short streak mostly along the tube (twisted a little round it), swirling
  round the centre line in blue / violet / magenta / cyan with bright pulses
  racing along. Three kinds: the wall (bunched into `TUBE_ARMS` spiral
  arms), soft wisps further out (a nebula haze), and bright sparks inside.
  Positions (centre point + parallel-transport frame + angle + radius) are
  built on the CPU when the course changes; the swirl, colour and streaks
  are done in the shader. The course **stays put however you fly around
  it** — turn away, turn back, fly alongside; waypoints only retire once the
  craft is past them along the course. It's only re-laid (ahead of the
  craft, aligned with where it points) once the craft is **outside** the
  tube and more than `COURSE_FAR` (10 units = 500 m) from its centre line —
  measured against the tube's actual curve, not the straight lines between
  waypoints (at speed the curve bows several units off them). While you're
  inside it the course just keeps extending ahead. (In the code waypoints are
  still called "loops" — they used to be drawn as rings.)
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
  shooting stars (at most 3, every 4–12s).
- **Sound** (synthesised with Web Audio, no files): a rocket rumble that
  swells with thrust and speed, and a blast on every hit. It tries to start
  as soon as the page loads; browsers only allow that for sites the visitor
  has already engaged with (Chrome's media-engagement score, etc.), so if
  it's held back the speaker button pulses amber and the first key press /
  tap / click anywhere starts it. The speaker button mutes it, remembered in
  `localStorage` (`constellations-sound`).

## Files

- [constellations.html](../constellations.html) — markup for both versions.
  A tiny inline script in `<head>` sets `<html class="v1">` (default) or
  `"v2"` (`?v=2`) before first paint; elements marked `.v1-only` /
  `.v2-only` show only in their version (the back link carries both labels:
  "← Experiments" in V1, just "←" in V2). Loads Three.js r128 from cdnjs,
  the page script and the shared cookie consent.
- [constellations-v2.html](../constellations-v2.html) — redirect only
  (`noindex`), to `constellations.html?v=2`.
- [css/constellations.css](../css/constellations.css) — styles for both
  (V2 layout overrides are grouped in an `html.v2` block, V1-only rules at
  the end).
- [js/constellations.js](../js/constellations.js) — both versions:
  `runV1()` (the original, unchanged) and `runV2()` (the spacecraft); only
  the chosen one runs. V2's tuning knobs are grouped at the top of
  `runV2()` (particle count, cruise speed, waypoint speed-up, cruising
  ramp, pitch rate, auto-level, brake and restart, auto-resume delay,
  course re-lay distance, boost, turn easing, streaks, wake, course
  spacing/count, route clearance, obstacle size and pacing, explosion
  strength, camera framing, galaxy/river sizes and build-up, meteor pacing;
  tube density and tilt settings sit with their code). Append `?n=768`
  (etc.) to change the particle count (particles = n²).

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
