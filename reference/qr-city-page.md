# QR City page

`qr-city.html` is a single self-contained page (CSS, markup and JS inline, plus three.js r128 from cdnjs and legacy OrbitControls from jsdelivr). Type a web address and get a standard, scannable QR code; drag it and it rises into an orbitable 3D city (dark modules = buildings, light = roads, with traffic, parks, smoke, day/night). Linked from the Experiments page (`js/experiments-data.js`).

Built from `qr-city.zip` (source project: `src/template.html` + `src/qr-core.js`, inlined by its `build.py`). The page here is that `dist/index.html` wrapped with the site head (favicon, SEO, JSON-LD, cookie consent) and a "back to Experiments" link. To update the app, rebuild the zip project and re-wrap its `dist/index.html` the same way rather than hand-editing the app code here.

URL params: `?url=...`, `?embed=1` (hides all chrome incl. the back link), `?time=22`.

SEO: `seo-data.json` entry with its own share image `images/qr-city/og-v2.jpg` (1200x630, a 3D render of the city with title and tagline; `images/qr-city/square.jpg` is the text-free 1080x1080 version used as the homepage Lab tile thumbnail), sitemap entry.

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
