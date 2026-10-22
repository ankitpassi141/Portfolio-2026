# FootSal page

`footsal.html` + `css/footsal.css` + `js/footsal.js`. A turn-based, secret-planning football game in a
live three.js stadium, linked from the Experiments page (`js/experiments-data.js`). Ported from the
standalone prototype (`footsal.zip`, one inline script). three.js r128 from cdnjs; `RGBELoader`,
`GLTFLoader` and `SkeletonUtils` from `three@0.128.0/examples/js` on jsDelivr, pinned. No build step.

## Rules
From the prototype's CLAUDE.md: 5 or 7 a side, first to 3, four turns per attack (attacker positions,
defender positions, attacker plan, defender plan), fuzzy possible-location circles, offside start rule
(first carrier can't start in the box), one defender in the D, strike meter with a sweet zone at 0.62,
no chance percentage shown, CPU only ever sees fuzzy positions. Pass speed `len/.95+.25` s, shot speed
`len/(1.15+1.4*power)+.2` s, receive hold 0.9 s, `KO` 1300 ms.

### Defender orders and live defending (replaces static defenders)
Static defenders made the shortest chain to the best shooter always right. Now a long chain can pull
defenders out of shape but gives them time to close in; keep that trade-off when tuning.
- **Orders** (`S.orders`, reset every attack by `defaultOrders`): keeper `keep` always; outfield `zone`
  (default), `press` or `mark` (with `k`, the attacker index). In the defender's plan turn: drag to move
  (unchanged), tap (no drag) to open the order bar `#orders`. Mark then needs a tap within `ZR*1.1` of a
  circle centre, otherwise it cancels. Undo walks back the last order or move (`S.acts`). Chips (GK,
  HOLD, PRESS, MARK n) and dashed marker links show in that turn and in the replay only.
- **`simulate()`** runs the whole play at 60 steps/s before it's shown and records `o.track` (~30/s).
  Speeds `SPEED` (press .14, mark .13, zone .10, keep .12 units/s), `REACT` .28 s before anyone moves
  and before a kicked pass is "known", 25% speed during the receiver's hold. Targets in `orderTarget`:
  keeper tracks the ball along the line, press chases the ball, mark sits `MARK_GAP` goal-side of the
  attacker, zone goes to the nearest point of the known pass (or 15% toward the ball), leashed to
  `ZONE_R` .10 of the kickoff spot. First defender within `PASS_R` .036 of a moving ball intercepts, within
  `TACKLE_R` .034 of a held ball tackles. Unwinnable: first 6% of any leg, last 15% of a pass, a shot
  after 45%. The keeper can't intercept a shot.
- **`settleShot()`** judges the shot when it's struck: `pGoal × strike × keeper × pressure`, clamped
  .03–.95. Keeper factor from distance to the ideal x, pressure .7 if an outfield defender is within .07,
  1.15 if none within .14. Adds one reason to the result text.
- **CPU defence** (`botOrders`, fuzzy circles only): marks the circle(s) nearest goal (1 in 5s, 2 in 7s)
  with the nearest free defender, presses the deepest circle 75% of the time, the rest hold. Kickoff moves
  still come from `botPlanD`.
- **Result text** names the order ("pressed and…", "tracked #k and…", "held their zone and…") with
  headlines Intercepted, Tackled or Blocked; cut-ins INTERCEPTED!, TACKLED!, BLOCKED!.
- **Built but off** (owner approval needed): attacker runs after passing (`RUN_V` 0, set .15; `RUN_D`
  .15) and long passes going astray (`MISPLACE_ON` false; `MIS_SAFE` .3, `MIS_SLOPE` 1.6, up to 60%; ends
  the attack as "Misplaced").
- Clocks are set on the Single player setup card (Positions clock, Plan clock), not in Settings.
  Settings order: Camera during gameplay, Quality, then an Audio section (sound effects, crowd, music)
  and Haptics.
- Tuning: both clocks default to 20 s (raised from 10 s because orders, especially Mark's three taps,
  were tight). Saved settings keep a player's own choice. Levers by
  impact: `SPEED.press`, `REACT`, `PASS_R`/`TACKLE_R`, `ZONE_R`; raise `REACT` before lowering speeds.

## Assets (all fall back to the procedural prototype if they fail)
| What | File(s) | Source, licence |
|---|---|---|
| Sky + IBL | `images/footsal/blouberg_sunrise_2_1k.hdr` | Poly Haven, CC0 (replaces the old base64 `sky.js`) |
| Stands, roofs, apron | `images/footsal/{concrete_floor_02,corrugated_iron_02,rubberized_track}_*` | Poly Haven, CC0 |
| Turf detail | `images/footsal/leafy_grass_detail_512.jpg` | Poly Haven Leafy Grass, greyscale; overlaid on the canvas mowing stripes |
| Players | `models/footsal/character-*.glb` | Kenney Mini Characters, CC0 |
| Kicks, traps, steps | `audio/footsal/{kick,trap,step,post}-*.mp3` | Kenney Impact Sounds, CC0 |
| Crowd | `audio/footsal/crowd-*.mp3` | Gregor Quendel, **CC BY 4.0** (credited on the in-game Credits screen) |
| Music | `audio/footsal/music.mp3` | "Diamond Race", iamoneabe, CC0 (first 96 s) |

Each asset folder has a `LICENSE.txt`. Whistle, horn, net, tick, tap and the "ooh" stay synthesised.

## How the new bits work
- **Loading:** one `THREE.LoadingManager` (`LM`) drives the splash progress bar. The game is playable
  before it finishes; materials keep flat colours until their maps arrive.
- **Team kits:** `kitTexture()` repaints the shirt cells of Kenney's 512×512 colour atlas (32×128 px
  cells). Shirt cells = cells used by vertices skinned mostly to `torso`, never by `leg*` or `head`.
  One template per model per team; clones share its material.
- **Animations:** `ANIM` maps game states to clip names (`idle`, `sprint`, `attack-kick-right`, `jump`,
  `fall` while dragged, `emote-yes`/`emote-no` on the result). `setAnim()` cross-fades; `place()` in
  `syncWorld` decides the state each frame.
- **Ball:** truncated-icosahedron pattern painted per pixel from the Voronoi cells of the icosahedron's
  12 vertices (pentagons) and 20 face centres (hexagons).
- **Audio:** samples decode after "Tap to enter" (`audioInit`). `crowd-bed` and `crowd-chant` loop and
  follow `excite`; the synthetic beds drop to 35% once the recording is in. Music has its own slider
  (`SET.music`, default 45) and ducks during a match (`musicTick`).
- **VFX:** kick dust, shot comet trail, confetti, goal shockwave ring (`ring`), fireworks over the pitch
  (`fireworks`, `sparks`), crowd camera flashes, floodlight beams that only show in the orbit camera.

## Anime layer
- **Look:** every mesh uses `MeshToonMaterial` with a three-step ramp (`GRAD`); `std()` builds them and
  drops options toon materials don't have. The HDRI is no longer the background: `skyDome` repaints it
  as a flat anime gradient with two-tone cel clouds (low-saturation parts of the HDRI).
- **Composite pass (`POST`):** the scene renders to a linear target, then one shader does ink outlines
  (Laplacian of 1/z from the depth texture), ACES rescaled so white stays white, a saturation and
  contrast push, the black-and-white impact frame, radial speed lines centred on the ball and a white
  flash. Driven by `FX` (`impactUntil`, `speed`, `flash`, `punch`). There is no setting for it; it is
  always on. If the pass can't be built, the scene renders directly.
- **VFX:** `burst()` starbursts at every touch, `updateTrail()` ribbon behind the ball, `auraOn()` cel
  flames round the striker, goal light `pillar`, camera punch-in and roll in `updateCam`.
- **Cut-ins:** `cutIn(key, {c, sub, t})` builds a DOM splash in `#cut` from `CUTS` (title, katakana,
  size `small`/`big`/`huge`, `sad` for misses, sound). Fired for attack/defend/plan starts, plans
  locked, kickoff, every pass, shot or perfect strike, sweet spot, goal, blocked, intercepted, wide,
  too hard, too soft, no plan, offside, victory and defeat. Styles live under "anime cut-ins" in
  `css/footsal.css`; they never take input.
- **Sound:** `SFX.anime.*` stingers (swish, whoosh, "dodon" double hit, rising charge, bell shing,
  chime sparkle, sad horn). Bells and glass are Kenney Impact Sounds (`shing`, `clang`, `glass`).
- **Type:** Bangers for display, Dela Gothic One for the katakana (both OFL, Google Fonts).
- **Buttons:** same look as the cut-ins (Bangers, -8° slant, 3px ink border, hard offset shadow,
  halftone on primary and selected segments). Pressing pushes the button into its shadow. Undo is
  hidden (not just invisible) while setting positions, so Done takes the full row.
- **Wording:** players never see "phase". HUD titles and the stopwatch label say Attack or Defence;
  the turn banners are ATTACK! and DEFENCE!. Settings call the clocks Positions clock and Plan clock.
- Live voice commentary was tried and removed at the owner's request.

## Graphics quality
Settings → Graphics quality: Standard (default), High, Ultra-high (`SET.quality`, presets in `QUALITY`).

| | Standard | High | Ultra-high |
|---|---|---|---|
| Canvas pixel ratio cap | 2 | 2.5 | 3 |
| Composite supersampling | 1.5–2× | 2–2.5× | 2.5–3× |
| Sun shadow map | 2048 | 4096 | 8192 (capped by the GPU) |
| Stand/apron/roof maps (diffuse / normal) | 1k / 1k (shipped) | 2k / 2k | 4k / 2k |
| Sky HDRI | 1k (shipped) | 2k | 2k |
| Turf canvas | 1024×1536 | 1.5× | 2× |
| Pitch overlay canvas | 560 | 700 | 840 |

- Standard is exactly what ships in `images/footsal/`. High and Ultra-high stream the bigger Poly Haven
  files from `dl.polyhaven.org` (CC0, CORS `*`): about 24 MB and 55 MB. Nothing new is committed.
- `applyQuality()` switches live: resolution, shadows, turf and overlay at once; maps and sky swap in
  as they download (`loadPBR`, `loadSky`, progress in `#qstat`). A failed download keeps the current
  maps; choosing Standard swaps the shipped 1k files back in. `fetchImg` shares one download per file.
- Testing offline: `?debug&cdn=/some-local-mirror/` points the downloads at a local copy laid out like
  the CDN (`Textures/jpg/2k/<id>/<id>_diff_2k.jpg`, `HDRIs/hdr/2k/<id>_2k.hdr`). The in-app browser pane
  doesn't let page requests reach `dl.polyhaven.org`, so the real CDN path was only checked with curl.

## Checking it
Open `footsal.html?debug` for `window.__fs` (`S` is a live getter). `__fs.effectsFor({type:'goal'},
new THREE.Vector3(0,.2,-15))` fires the whole goal celebration; `__fs.cutIn('blocked',{c:'#3a73d6'})` shows a single cut-in. To
inspect a cut-in frame, pause its animations with `el.getAnimations({subtree:true})` and set
`currentTime` (a hidden tab freezes CSS animations). `__fs.T3[0][0].userData.acts` is set
once the GLB players replaced the fallback. `Object.keys(__fs.AU.buf)` lists decoded samples.

## Not done (from the prototype's production list)
Vite/ES modules and a newer three.js, unit tests for the rules, PWA/offline caching.
