# Open Water page

`open-water.html` + `css/open-water.css` + `js/open-water.js`. A real-time WebGL ocean with floating
physics bodies, linked from the Experiments page (`js/experiments-data.js`). Ported from the standalone
`open-water` project (one inline IIFE, three.js r128 + cannon.js 0.6.2, no build step). Both libraries
load from cdnjs, pinned.

## What's on screen
- **Top-left:** back to Experiments, then the title and a one-line controls hint.
- **Top-right:** Top view (also `T`) and Controls (opens the panel; closed by default under 760 px).
- **Panel:** readout (Beaufort, Hs, body count, fps), sliders, presets (Sea state: Calm / Swell / Storm;
  Light: Noon / Golden / Dusk), Float (Crate, Buoy, Boat, Clear), Pause, Sound.
- Controls: drag to look, WASD move, Q/E dive and rise, Shift sprint, tap the water to splash, arrow keys
  drive the newest boat. Sound is synthesised (Web Audio, no files) and starts on the first click.
- Embed mode (`?embed=1`, see `js/embed-guard.js`) hides all the chrome, leaving only the ocean.

## Map of `js/open-water.js`
Section comments are greppable: `grep -n "/\* ---------- " js/open-water.js`.
1. **state**: sliders, the 12 Gerstner wave tables `WL/WS/WOFF`, `SUN_AZ`.
2. **water simulation** (`SIM_*`, `simStep`, `simKick`, `simHAt`, `packSim`): linear shallow-water solver
   on a 192×192 staggered grid of 0.5 m cells (96 m centred on the origin), packed into a float
   `DataTexture` (R height, G/B slope, A foam). Sponge layer at the edge absorbs waves.
3. **GLSL**: Gerstner vertex sum with Jacobian foam; fragment does fbm normals, Fresnel, procedural sky,
   a ray-marched sandy seabed with caustics, foam and fog. `finish()` = ACES + gamma + dither.
4. **splash layer**: all on the GPU. Ambient crest spray, tap bursts, object-impact crown/jet/mist.
5. **scene**: camera-centred polar water mesh (480×720, or 320×480 on small screens), sky dome, particles.
6. **parameters / controls UI**: `applyWaves`, `applySun`, `CFG` (**the `camH` entry must stay last**,
   code indexes `CFG[CFG.length-1]`), presets `SEA` and `LIGHT`.
7. **floating bodies** (cannon): `DEFS`, `applyHydro` (multi-probe buoyancy, drag, slamming, slope force,
   boat thrust), `paintBody` (pressure patches, hull cavity and foam written into the sim),
   `stepPhysics` (fixed 1/120 s substeps). `surfaceAt(x,z,t)` is the single CPU source of truth for
   water height and mirrors the vertex shader.
8. **sound**, **keyboard**, **loop**, the `?debug` hook, start.

## Checking it
Open `open-water.html?debug` for `window.__ow`. Quick smoke test in the console:
`__ow.pause(true)`, click Crate/Buoy/Boat, `__ow.adv(840)`, then each body's `y` should be within ~1 m
of `__ow.surfaceAt(x, z, __ow.simT)` and roughly upright. `__ow.simKick(0,0,-0.4,0.8,1); __ow.adv(30)`
should leave `max |simH|` above 0.02. A shader compile failure shows in the red `#diag` box after
4 frames; keep that.

## Gotchas
- GLSL must stay valid on all GPUs: no `smoothstep(a,b,x)` with `a>=b`, no `pow()` of a negative base,
  declare every uniform each stage uses (a missing one once blanked the whole water).
- `U` is shared by water, sky and body materials; `SU` shares the same value objects for particles.
  Add new shared uniforms to `U` before `SU` is built.
- Float textures use `NearestFilter` + manual bilinear in GLSL (linear filtering of floats isn't guaranteed).
- `[hidden]{display:none!important}` in the CSS is required (`#fail{display:grid}` would override it).
- Forces on cannon bodies must be applied every substep (cannon clears them each step).
- Bodies must not spawn overlapping; `addBody` rejects positions too close to others.
- Resolution drops automatically (`pr`) if fps stays under 32.

## Honest limits
This is a stylised, linear model, not a fluid engine. No breaking waves, no Kelvin wake, no true
fluid-body coupling (hulls write a pressure patch and an impact cavity). The ripple sim only covers
96 m; beyond it only the Gerstner swell exists. Spray is flat sprites. No body shadows or reflections.

## Not built yet (from the original project's roadmap)
Live marine data from Open-Meteo (swell / wind waves / wind / cloud for a chosen coordinate, default
Goa) with a forecast scrubber and an offline fallback to the sliders. Build it as an isolated
`fetchConditions(lat, lon)` module; the wave tables would need to become data-driven (period → wavelength).
