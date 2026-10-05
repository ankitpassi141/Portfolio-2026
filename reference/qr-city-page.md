# QR City page

`qr-city.html` is a single self-contained page (CSS, markup and JS inline, plus three.js r128 from cdnjs and legacy OrbitControls from jsdelivr). Type a web address and get a standard, scannable QR code; drag it and it rises into an orbitable 3D city (dark modules = buildings, light = roads, with traffic, parks, smoke, day/night). Linked from the Experiments page (`js/experiments-data.js`).

Built from `qr-city.zip` (source project: `src/template.html` + `src/qr-core.js`, inlined by its `build.py`). The page here is that `dist/index.html` wrapped with the site head (favicon, SEO, JSON-LD, cookie consent) and a "back to Experiments" link. To update the app, rebuild the zip project and re-wrap its `dist/index.html` the same way rather than hand-editing the app code here.

URL params: `?url=...`, `?embed=1` (hides all chrome incl. the back link), `?time=22`.

SEO: `seo-data.json` entry (uses the default share image; add `images/qr-city/og.jpg` at 1200x630 and an `image` field for its own card), sitemap entry.
