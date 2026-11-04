# QR City page

`qr-city.html` is a single self-contained page (CSS, markup and JS inline, plus three.js r128 from cdnjs and legacy OrbitControls from jsdelivr). Type a web address and get a standard, scannable QR code; drag it and it rises into an orbitable 3D city (dark modules = buildings, light = roads, with traffic, parks, smoke, day/night). Linked from the Experiments page (`js/experiments-data.js`).

Built from `qr-city.zip` (source project: `src/template.html` + `src/qr-core.js`, inlined by its `build.py`). The page here is that `dist/index.html` wrapped with the site head (favicon, SEO, JSON-LD, cookie consent) and a "back to Experiments" link. To update the app, rebuild the zip project and re-wrap its `dist/index.html` the same way rather than hand-editing the app code here.

URL params: `?url=...`, `?embed=1` (hides all chrome incl. the back link), `?time=22`.

SEO: `seo-data.json` entry with its own share image `images/qr-city/og-v3.jpg` (1200x630, the HUD-styled card: night city render, QR CITY title, tagline, 2D/3D pill; `og-v2.jpg` is the previous one; `images/qr-city/square.jpg` is the text-free 1080x1080 version used as the homepage Lab tile thumbnail), sitemap entry.

## Textures and lighting (open source)
CC0 assets from [Poly Haven](https://polyhaven.com) and [ambientCG](https://ambientcg.com/view?id=DayEnvironmentHDRI101) live in `images/qr-city/` (credits in `LICENSE.txt`): 1k diffuse + normal maps for brick (`red_brick_03`), stone (`stone_wall_03`), plaster (`beige_wall_001`), road (`asphalt_02`) and sidewalk (`concrete_pavement_02`), and a 1k HDRI, ambientCG `DayEnvironmentHDRI101` (EXR, loaded with three`s `EXRLoader`), used as `scene.environment` for ambient light and reflections (car paint, glass, windows).
- Loaded at runtime by `loadOpenAssets()` in `qr-city.html`. Diffuse maps are desaturated and brightness-normalised first so the per-building vertex tint still colours them.
- The old procedural canvas textures and gradient sky dome stay as the instant fallback, and are all that is used on `file://` (loading images there taints the canvas).
- Cars have no texture: Poly Haven has no car-paint set, so the clear-coat paint just reflects the HDRI.
- The page needs the extra `RGBELoader.js` script (three r128 examples, jsdelivr).

## Sound
`AUDIO` in `qr-city.html`: all synthesised with Web Audio, no audio files. Starts on the first pointer/key event (autoplay rules), silent in the flat scan view and fades in as the city rises (louder when zoomed in). Traffic rumble scaled by live car count, car horns (when a car is stuck, plus random ones, panned to the car's screen position), steam/pipe hiss from chimneys, soft smoke puffs, a distant siren every 40-90 s, birds by day, crickets at night. The speaker stamp next to the address field mutes it (remembered in localStorage key `qrc-sound`); `?embed=1` is silent by default and has no button. Sound pauses when the tab is hidden.

## Road edge
Roads run flush to the plinth edge and down its side. Each road/sidewalk slab is offset along its own slope normal (not straight up), and the drop segment sits just outside the plinth face (`Pm[vM]`/`Pm[vX]` at 0.512/0.514), so the asphalt stays on the visible face instead of sinking into the sidewalk.
## Day/night HDRI, windows and traffic
- **HDRI:** `belvedere_1k.hdr` (Poly Haven, daytime city view) is `scene.environment` by day, ambientCG `DayEnvironmentHDRI101` by night; swapped at dusk/dawn in `pickEnvironment()`. Needs both RGBELoader and EXRLoader.
- **Facade shader** (`facade()` / `FAC_GLSL` in `qr-city.html`): glass layer with strong reflection in front of an interior-mapped room (floor `laminate_floor_02`, walls `beige_wall_001`, back-wall sofa/picture, ceiling lamp). Used on the glass towers (3 x 2 cells per wall UV unit) and the small window planes. By day about a third of windows are see-through, the rest reflect; at night roughly 17% of tower windows and up to ~50% of small-building windows are lit (`uLitGlass` / `uLitPane`, set in `applyTime`). The old flat glow quads are retired.
- **Traffic** (`moveCars`): IDM car-following (accel 0.5, comfortable brake 1.0, hard limit 3.0 cells/s2, 0.9 s headway), stop line at a claimed junction, speed eased down for turns, cars follow a Bezier arc through the corner (`turnCurve`) instead of pivoting, left-hand lanes. 45 s soak test: no overlaps, no NaNs, no stuck cars.

## HUD UI (Option 3C, replaces the paper theme)
Spec: `ui_implementation_specification.md` (QR City Option 3C). Dark tactical HUD over a full-screen canvas: Space Grotesk + JetBrains Mono, Font Awesome 6.5.2 icons (cdnjs), blueprint grid + scanlines, corner reticles, lateral coordinate markers.
- **Header:** brand (cube icon, live beacon, "PROCEDURAL VOXEL BLUEPRINT", small "? EXPERIMENTS" back link), centre telemetry pill with live `AZ / EL` from the camera and the mode hint, right-hand `SYS.LOC` + `MATRIX: NxN MODULES`.
- **Set URL panel** (bottom-left): the city rebuilds only on BUILD / Enter (no longer live while typing); status badge `READY / SYNCED` ? `REBUILDING...`, toast on success.
- **Dock** (bottom-right): OPEN, SOUND/MUTED (mutes city + UI sounds), CODE (embed modal, Esc/backdrop closes, focus trapped), 3D CITY ? 2D QR.
- **Modes:** `setMode('3d'|'2d')` tweens the camera over 1.1 s (cubic in-out). 3D = azimuth 45�, elevation 35�, orbit/zoom, can't be dragged flat (`MIN_PHI_3D`). 2D = exactly overhead, controls locked, buildings flattened, light quiet-zone plate (`built.quiet`, N+8) so the code scans on the dark page. The page opens on the flat code and rises into 3D after 0.7 s; `?view=2d` stays flat.
- **Embeds** (`?embed=1`): HUD hidden, old drag-to-raise + snap-to-top behaviour and `?view=3d` auto-orbit unchanged.
- Plinth is now dark navy with cyan edge lines; UI sounds (`AUDIO.ui`: click, build, swoop, error) bypass the city mix.

## three.js r187 (ES modules)
The page loads three.js **0.187.0** from jsdelivr through an import map (`three`, `three/addons/`); the app is one `<script type="module">` that imports `OrbitControls`, `HDRLoader` (replaces the deprecated `RGBELoader`) and `EXRLoader`. The QR encoder stays a classic script (global `QRC`). Migration notes, so the look matches the r128 version:
- `THREE.ColorManagement.enabled = false`: hex colours keep their r128 meaning; the `L()` helper still converts sRGB hex to linear itself.
- Light intensities × PI (`LIGHT_UNITS`): r155+ uses physical light units (legacy mode was removed in r165).
- Image-based diffuse light is PI× stronger since r151 (`getIBLIrradiance`); `ShaderChunk.envmap_physical_pars_fragment` is patched to take that factor back out. Reflections are unchanged.
- `outputEncoding`/`texture.encoding` → `outputColorSpace`/`texture.colorSpace`; `PCFSoftShadowMap` (removed) → `PCFShadowMap` + `shadow.radius = 3`; HDR/EXR loaded as `HalfFloatType`.
- The facade shader's `vColor` is a `vec4` now; the injection points (`#include <common>`, `<uv_vertex>`, `<emissivemap_fragment>`) are unchanged.
## Diorama auto-rotate
In 3D mode the city turns slowly on its own (`stepSpin`, `SPIN_SPEED` 0.6 = one turn per 100 s). It starts right after the intro, stops instantly on any drag/zoom (OrbitControls `start`), and eases back in once the scene has been idle for 3 s (`SPIN_IDLE`). Off in 2D mode, during mode tweens and with reduced motion; embeds keep their own `?view=3d` orbit. `controls.update(dt)` now gets the frame time so the speed is frame-rate independent.


## Weather (Summer / Winter / Rain)
Three-way pill (`#wxPicker`, native radios) between the URL panel and the dock; above the dock under 1180 px, full width on phones. `?weather=winter|rain` starts in that weather (embeds too). Code: `WX`, `weatherize()`, `stepWeather()`, `setWeather()` in `qr-city.html`.
- **Blending:** `WX.rain` / `WX.snow` ease to 0..1 and drive light, reflections, street lamps, lit windows, particles, traffic speed and sound. `WX.cover` is the settled snow: it builds slowly and melts faster.
- **Surfaces:** `weatherize(mat, cover, wet)` patches the shader after `normal_fragment_maps`: snow settles on upward faces, rain darkens and turns flat ground glossy.
- **Thunderstorms:** in rain, every 20-45 s (first one 5-9 s after switching) a storm brings 2-4 bolts on the 14 tallest buildings (`built.tall`), heavier rain, wind and delayed thunder. The `.wx-flash` layer lights the sky. Reduced motion hides the bolt and softens the flash. Each strike is 2 flashes, well under the 3-per-second photosensitivity limit.
- **Sound** (all synthesised): `bed.rain` + `drip()`, `bed.wind`, `bed.cicada`, `thunder()`. These run in `bed.wx`, beside the city mix, so they stay audible zoomed out (0.35 + 0.65 * sqrt(near)). Snow also muffles the city; crickets and birds only sing in summer.
- **2D QR is untouched:** decals are unlit basic materials, and particles, bolts and the flash fade out with the city. Verified with jsQR in rain.

`pickEnvironment()` sets `material.envMap` on every PBR material (registered in `PBR`) instead of `scene.environment`, because three ignores `material.envMapIntensity` for a scene-wide environment. Keep it that way: the day/night and weather reflection levels depend on it.

### Wet surfaces and rooftop rain
- `weatherize()` also carries a world position (`vWxPos`). Flat surfaces get standing water (`wxPool`, fbm noise) and ripple rings (`wxRipple`, only when the camera is close, otherwise they shimmer). Walls get thin run-off streaks moving downwards (`wxRun`). Glass panes get rivulets in the facade shader (`wxSheet`) that bend the view into the room.
- Real water reflects about 4% looking down, too little to read at this scale, so wet areas add an explicit sky sheen (`uWxSky`, follows time of day and lightning). Keep the wall share of it small: more turns brick blue.
- `splashFx`: droplets thrown up where rain lands, on roofs and streets (`dropSpot`).
- Sound: `roofTap()` is one drop on a roof, placed in 3D at a nearby roof (`nearRoof`), mostly a dull tick with a metallic ping about a quarter of the time. `bed.roof` is the massed patter underneath and swells as you zoom in.
