# Constellations Page — Reference

[constellations.html](../constellations.html) is one page with two versions,
picked with the **V1 / V2** switch in the **info menu** (the ⓘ button, top-right).
The choice lives in
the URL: nothing for **V1 (the default)**, `?v=2` for V2 — and switching
reloads the page, so only one version ever runs. The Experiments page's
**Constellations** node (entry in [js/experiments-data.js](../js/experiments-data.js))
opens V1. **V2 has its own shareable URL, `constellations-v2.html`**: link
previews read a page's raw HTML (no JavaScript), and `?v=2` serves the same
HTML as V1, so that page carries V2's own title and description
("Constellation Surfer") and preview image ([images/constellations/og-v2.jpg](../images/constellations/og-v2.jpg),
1200×630, a frame from the real scene: the Silver Surfer rider banking through the streaking
field, a spiral galaxy behind), both from `seo-data.json` — and sends visitors
straight on to `constellations.html?v=2`. Share that URL for V2. The same image
is the Constellations card's banner on the Experiments page (`image` in
[js/experiments-data.js](../js/experiments-data.js)).

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
- **The rider**: the craft you fly is a custom glTF model —
  [models/silver_surfer.glb](../models/silver_surfer.glb) ("Silver Surfer" by
  alexlashko on Sketchfab, **CC BY 4.0** -- credited in the info menu). Three.js's `GLTFLoader` is loaded from
  jsdelivr only on V2. Nothing shows until the model is ready -- the built-in craft (and its glow
  and trail) stays hidden while it loads, and only appears if the model can't load (so it never
  flashes up first). The board is scaled to `MODEL_LENGTH` and turned so
  its nose leads; the bank, nose lean and crash rattle all apply to it. One
  wide streak trails off the board's tail -- `STREAK_EMITTERS` (9) emitters
  side by side across `STREAK_WIDTH` of it, each sitting on the board's rounded tail
  edge (read from the model's vertices, `boardTailEdge`) so it leaves along the
  board's curve; softer at the edges, each point drawn
  bigger and scattered a little so they merge into one smooth band, and pulled
  back toward the centre line as it ages (`STREAK_CONVERGE`) so it tapers to a
  point at its far end -- with a soft
  engine glow behind. **Chrome reflections**: a small cube camera at the rider
  re-renders the real scene around it — particles, streaks, the wormhole,
  galaxies — over a made-up nebula sky every `REFLECT_EVERY` frames
  (`REFLECT_SIZE` 128px a face; 64px every 6 frames on small screens), used as
  the model's reflection map, glossed up (`RIDER_GLOSS`) so particles read as
  specks in the silver.
- **Speed feel**: the faster the rider goes, the more it shows -- a fine, fast
  vibration (a few high frequencies mixed, `SPEED_BUZZ`) and a motion-blur smear:
  `SPEED_GHOSTS` (3) faint, cool-violet copies of the rider trailing just behind
  it in its own frame (so they follow its bank and lean), fading one after another,
  spreading from `GHOST_GAP` 0.05 to 0.3 apart and brightening (`GHOST_OPACITY`)
  with speed. Both are near nothing at cruise and full at `MAX_SPEED`
  (`speedFeel`). From behind the smear reads as a soft shimmer at the rider's
  edges; from the side (orbit) as a clear trail.
- **Zoom**: scroll (mouse wheel / trackpad) or pinch with two fingers moves
  the chase camera in / out (`camZoom`, 0.55–2.6x the default distance,
  eased, remembered in `localStorage` as `constellations-zoom`). While two
  fingers are down, tap-steering pauses.
- **Orbit**: right-drag with the mouse, or drag two fingers together on a touch
  screen, swings the camera round the rider (`orbitYaw` / `orbitPitch`, yaw all
  the way round, pitch up to `ORBIT_PITCH_MAX`); it aims more at the rider while
  orbited, and eases back behind it about a second after letting go
  (`ORBIT_RETURN`). The right-click menu is off on the V2 canvas.
- **Spacecraft**: flies in full 3D and **always flies forward** — no key
  needed to move. It sits just below the middle of the screen with a chase
  camera that follows its orientation on every axis (easing after it), so
  climbs, dives and full loops all work. Desktop: **← →** turn, **↑** nose
  up / **↓** nose down (`CRAFT_TURN`, `CRAFT_PITCH`; WASD works too) — hold
  ↑ and it loops right round. Steering is in the craft's own frame; when not
  pitching it gently rolls back upright (`AUTO_LEVEL`) so left/right stay
  intuitive. **Ctrl** brakes, down to a stop (Ctrl + arrows still steer; Ctrl + letters are left to the browser) (`BRAKE_RATE`). Let go before
  it stops and it picks the speed back up; brake right down to 0 and it
  starts over from rest — pulling away gently (at most `RESTART_ACCEL`,
  0 → cruise in ~2s) at cruise speed, then ramping up as usual. **Space**
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
  asks — once — on the first tap if there's still no data. Phones get
  hold-to-use **Brake** (= Ctrl, red) and **Boost** (= Space) buttons either side of Challenge? in one bottom-centre bar
  (`.flightbar`: Brake · Challenge? · Boost); **in landscape** Brake moves bottom-left, Boost
  bottom-right (the bar lets taps through between them) and Challenge? to the middle of the right edge, and the first tap
  in landscape asks for **fullscreen** to hide the browser's tabs and
  toolbars (Android; iPhone Safari doesn't allow pages to go fullscreen —
  only Add to Home Screen does). All the widgets are a notch smaller on
  phones. A "Tilt to steer · tap left / right to turn" hint shows until the first
  touch. Turning and pitching ease in and out (`TURN_EASE`) rather than
  snapping.
- **Cruising vs Challenge** (the **Challenge?** button, bottom centre).
  Everyone starts **cruising**: the tube is hidden, its walls don't count,
  and the speed keeps ramping up (`AUTO_RAMP_RATE`, ~65 km/h a second, up to
  **`MAX_SPEED` 5,000 km/h**). On desktop the autopilot follows the course (turning and
  pitching, in 3D) whenever you're not steering: any arrow key takes over
  and can steer right off it, and after `AUTO_RESUME_SECONDS` (3s) with no
  steering it flies back onto the course. On touch screens cruising doesn't
  follow the path — steering (tilt / taps) is entirely the player's.
  **Challenge?** switches to a **Challenge** (the button lights violet and
  reads **Free Roam?**, which switches back): the tube shows, there's no
  autopilot, you fly it yourself. Every waypoint flown through inside the
  tube adds 10% (`LOOP_SPEEDUP`) — up to the same 5,000 km/h cap. The tube's wall is just
  light: **no collision** — flying out through it only ends the distance
  run. Hitting a shape still resets the speed to `BASE_SPEED` (~860 km/h).
  Switching either way keeps the current speed. Ctrl brakes in both.
- **Challenge distance**: a counter under the speed (only during a
  Challenge, and bigger than the speed readout) shows how many metres
  you've flown with the craft's centre inside the tube — measured against
  the tube's actual curve (its centre line + radius sampled every 0.5 units
  when it's rebuilt, `tubeSamples`) — and your **Best**. The count drops
  back to 0 (with a red shake) the moment you leave the tube or hit a
  shape. Best is saved in `localStorage` (`constellations-best`).
- **Space boost** (both modes): the speed eases up to `BOOST` (1.6x) — but never past `MAX_SPEED` — while
  held and back down when released.
- **Speed readout**: a small rolling digital odometer (km/h, 1 world unit =
  50 m), top centre, with the Challenge counter under it. It pulses on each
  waypoint and shakes red on a hit. The back button (top-left) is just an
  arrow. Top-right (both versions): an **eye** button that hides the whole UI
  (or press **H**) -- everything goes but the eye, which fades until hovered; on
  phones in V2 Brake and Boost stay, so you can still fly -- and an **ⓘ info**
  button whose menu holds the V1 / V2 switch, Sound on / off (V2) and the rider
  model's credit (V2). It closes on a click elsewhere or Escape.
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
  it's held back the info button (and the Sound switch in its menu) pulses amber and the first key press /
  tap / click anywhere starts it. The Sound switch in the info menu mutes it, remembered in
  `localStorage` (`constellations-sound`).

## Files

- [constellations.html](../constellations.html) — markup for both versions.
  A tiny inline script in `<head>` sets `<html class="v1">` (default) or
  `"v2"` (`?v=2`) before first paint; elements marked `.v1-only` /
  `.v2-only` show only in their version (the back link carries both labels:
  "← Experiments" in V1, just "←" in V2). Loads Three.js r128 from cdnjs,
  the page script and the shared cookie consent.
- [constellations-v2.html](../constellations-v2.html) — V2's shareable URL:
  its own SEO block (title, description, image) for link previews, then
  a script redirect to `constellations.html?v=2`.
- [models/silver_surfer.glb](../models/silver_surfer.glb) — the V2 rider model (glTF binary, ~15k triangles, 2.1 MB).
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
