# QR City page

`qr-city.html` is a single self-contained page (CSS, markup and JS inline, plus three.js r128 from cdnjs and legacy OrbitControls from jsdelivr). Type a web address and get a standard, scannable QR code; drag it and it rises into an orbitable 3D city (dark modules = buildings, light = roads, with traffic, parks, smoke, day/night). Linked from the Experiments page (`js/experiments-data.js`).

Built from `qr-city.zip` (source project: `src/template.html` + `src/qr-core.js`, inlined by its `build.py`). The page here is that `dist/index.html` wrapped with the site head (favicon, SEO, JSON-LD, cookie consent) and a "back to Experiments" link. To update the app, rebuild the zip project and re-wrap its `dist/index.html` the same way rather than hand-editing the app code here.

URL params: `?url=...`, `?embed=1` (hides all chrome incl. the back link), `?time=22`.

SEO: `seo-data.json` entry (uses the default share image; add `images/qr-city/og.jpg` at 1200x630 and an `image` field for its own card), sitemap entry.

## Textures and lighting (open source)
CC0 assets from [Poly Haven](https://polyhaven.com) live in `images/qr-city/` (credits in `LICENSE.txt`): 1k diffuse + normal maps for brick (`red_brick_03`), stone (`stone_wall_03`), plaster (`beige_wall_001`), road (`asphalt_02`) and sidewalk (`concrete_pavement_02`), and a 1k HDRI (`kloofendal_48d_partly_cloudy_puresky`) used as `scene.environment` for ambient light and reflections (car paint, glass, windows).
- Loaded at runtime by `loadOpenAssets()` in `qr-city.html`. Diffuse maps are desaturated and brightness-normalised first so the per-building vertex tint still colours them.
- The old procedural canvas textures and gradient sky dome stay as the instant fallback, and are all that is used on `file://` (loading images there taints the canvas).
- Cars have no texture: Poly Haven has no car-paint set, so the clear-coat paint just reflects the HDRI.
- The page needs the extra `RGBELoader.js` script (three r128 examples, jsdelivr).
