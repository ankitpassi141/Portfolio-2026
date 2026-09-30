# Constellations Page — Reference

[constellations.html](../constellations.html) is one page with two versions,
and no version switch as such: V1's **Call Surfer** button (bottom centre) brings in
V2, and V2's **Back to Freeroam** button (top-left, next to the back arrow) returns
to V1. The version lives in the URL: nothing for **V1 (the default)**, `?v=2` for
V2. Both run on **one shared particle engine** (see "One engine, two modes"
below), so switching either way happens on the spot, with no reload and no
change of scene: the same particles stay where they are, and only the logic,
camera and UI on top of them change. The
Experiments page's
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
  right-drag orbit (rotation speed 0.3x and cursor radius 150px, fixed — the
  sliders that set them are gone).
- **Call Surfer** (V1, bottom centre): V2 takes over the same particles on the
  spot (`callSurfer`). The first call builds V2 (`runV2(core, {handoff})`, with no
  loading screen; V1 keeps running until the rider model is ready); later calls
  reuse it. V2's camera starts exactly where V1's was, and the field's centre
  glides from V1's centre to the rider over `FIELD_BLEND_TIME` (1.8s), while the
  rider flies in from behind and above the camera into its chase position
  (`INTRO_FROM`, `INTRO_TIME` 1.8s, easing out). V2 always starts cruising. Its
  controls appear, the URL becomes `?v=2` (so a reload stays there) and the tab
  title switches. V1 prefetches the model and the glTF loader a moment after it
  starts, so the first call is quick.
- **Back to Freeroam** (V2, top-left): V1 resumes from exactly where V2 ended.
  Over `OUTRO_TIME` (0.9s) the rider shoots off ahead, the camera glides to a
  stop (speed eases to 0, so the speed-widened field of view and the streaks
  settle too), and V2's own scenery fades out (`sceneryFade`: galaxies and
  rivers un-build through their reveal, and the trail and loop rings fade). Then
  V1 takes the particles back where they are, with the field re-centred on the
  rider's last position. V1's camera starts on V2's exact view (position, aim,
  roll and field of view) and eases into its own orbit framing over
  `HANDOFF_EASE` (2.2s). A Challenge in progress ends. On the next Call Surfer,
  V2's galaxies and rivers build up again. V1 is built on first use if the page
  was opened on `?v=2`. The URL loses `?v=2` and the title switches back.
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
  jsdelivr only on V2. A plain dark **loading screen** (`#loader`) covers the page until the
  model is in place and a couple of frames have drawn with it, then fades (`revealScene`; it also
  lifts if the model can't load, or after `LOADER_MAX_WAIT` 20s at most) -- so the scene and the
  rider appear together. Nothing shows until the model is ready -- the built-in craft (and its glow
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
  Everyone starts **cruising**: the course is hidden and doesn't count,
  and the speed keeps ramping up (`AUTO_RAMP_RATE`, ~65 km/h a second, up to
  **`MAX_SPEED` 5,000 km/h**). On desktop the autopilot follows the course (turning and
  pitching, in 3D) whenever you're not steering: any arrow key takes over
  and can steer right off it, and after `AUTO_RESUME_SECONDS` (3s) with no
  steering it flies back onto the course. On touch screens cruising doesn't
  follow the path — steering (tilt / taps) is entirely the player's.
  **Challenge?** switches to a **Challenge** (the button lights violet and
  reads **Free Roam?**, which switches back): **loops** show at the course's
  waypoints, there's no autopilot, you fly them yourself. Every loop flown
  through adds 10% (`LOOP_SPEEDUP`) — up to the same 5,000 km/h cap. The loops
  are just light: **no collision**. Hitting a shape still resets the speed to
  `BASE_SPEED` (~860 km/h). Switching either way keeps the current speed.
  Ctrl brakes in both.
- **The loops** (`makeRing`): a ring of particles at every waypoint — one
  shared unit ring of `RING_POINTS` (1,600; 900 on small screens), most on
  the rim and some sparks just outside it — turned to face the course and
  scaled to the loop's radius (`LOOP_RADIUS` 2.64 -- also what counts as through), swirling round with bright pulses chasing
  round, in the wormhole's blue / violet / magenta / cyan. They fade in as
  they're laid (`RING_FADE_IN`); one flown through flares outward as it
  fades, a missed one just fades.
- **Loop count**: a counter under the speed (only during a Challenge, and
  bigger than the speed readout) shows how many loops you've flown through
  **in a row**, and your **Best**. Missing a loop — crossing its plane
  outside the ring, flying past it, or straying so far the course is re-laid
  — or hitting a shape ends the run: the count drops back to 0 (with a red
  shake). Best is saved in `localStorage` (`constellations-best-loops`).
- **Space boost** (both modes): the speed eases up to `BOOST` (1.6x) — but never past `MAX_SPEED` — while
  held and back down when released.
- **Speed readout**: a small rolling digital odometer (km/h, 1 world unit =
  50 m), top centre, with the Challenge counter under it. It pulses on each
  waypoint and shakes red on a hit. The back button (top-left) is just an
  arrow, with **Back to Freeroam** (to V1) next to it -- just "Freeroam" on narrow
  phones. Top-right: an **eye** button (both versions) that hides the whole UI
  (or press **H**) -- everything goes but the eye, which fades until hovered; on
  phones in V2 Brake and Boost stay, so you can still fly -- and, in V2, an
  **ⓘ info** button whose menu holds Sound on / off and the rider model's credit.
  It closes on a click elsewhere or Escape.
- **The course**: invisible waypoints laid one after another along a path
  that bends gently any way round — left, right, up, down — never more than
  `COURSE_MAX_BEND` off its own overall heading (which drifts slowly,
  `COURSE_DRIFT`, so it meanders but never doubles back), 4 ahead at a time.
  A Challenge draws a loop at each waypoint (above). The course's tube -- a **wormhole of
  light** -- is no longer drawn (`TUBE_SHOW` false; only its centre line is worked out, for
  the re-lay rule below), but the code is still there: up to `TUBE_MAX_PARTICLES`
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
  `createCore()` (the shared engine), `runV1(core)` (the particle field) and
  `runV2(core, opts)` (the rider), switched by `switchMode()`. V2's tuning knobs are grouped at the top of
  `runV2()` (particle count, cruise speed, waypoint speed-up, cruising
  ramp, pitch rate, auto-level, brake and restart, auto-resume delay,
  course re-lay distance, boost, turn easing, streaks, wake, course
  spacing/count, route clearance, obstacle size and pacing, explosion
  strength, camera framing, galaxy/river sizes and build-up, meteor pacing;
  tube density and tilt settings sit with their code). Append `?n=768`
  (etc.) to change the particle texture size (V1 draws n² particles).

## One engine, two modes

`createCore()` owns everything the two versions share: the renderer and
canvas, the particle textures (position, velocity and the per-particle seed:
speed, colour pick, size), the simulation quad, the clock and `flowTime`, and
the one `requestAnimationFrame` loop. V1 and V2 are modes on top of it. Each
has its own scene, camera, shaders, input and UI, and returns
`{frame, activate(from), deactivate(), pose()}`. The core calls `frame` on
whichever mode is active (`core.active`). Every event listener is registered
through the mode's `on()` wrapper, which ignores events while that mode is
inactive.

`switchMode(to, from)` takes `from.pose()` (camera position, rotation and the
field centre), deactivates `from`, activates `to` with that pose, and updates
the `<html>` class, the tab title and the URL (`history.replaceState`).
`core.resetParticles(shift)` moves the field by `shift` and clears the `w`
channels (the cluster slot, and the formed/dispersing amount), so neither mode
inherits the other's shapes. Both modes use the same `FIELD_HALF` and colour
pick, so the particles look the same in both.

**Particle budget.** The textures are sized for V1: 1024² (about 1M particles)
on desktop and 512² on phones. Flying costs more per particle, so V2 runs only
the first `FLIGHT_PARTICLES` of them: 490k on desktop and 160k on phones. It
does this by simulating a band of rows (render-target scissor) and drawing
the same range (`geometry.setDrawRange(0, core.drawCount())`). On a switch, the
row count eases to the new target (`core.rows` → `core.rowsTarget`) over about
a second, so the density change is not a pop.

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
