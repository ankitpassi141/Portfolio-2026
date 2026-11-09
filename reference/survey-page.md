# City Pulse Survey page

`survey.html` — split screen: a spinnable 3D planet of cities and traffic on the left, a one-question-at-a-time survey on the right. Stacks (globe on top, 54vh) below 860px. Not yet linked from Experiments, the sitemap or `seo-data.json`.

## Files
- `css/survey.css` — layout, globe controls, form styles. Light/dark tokens on `:root`.
- `js/survey.js` — glue: wires form events to the globe.
- `js/survey-globe.js` — the planet. `createGlobe(container, { onCityClick })` returns `{ flyTo, zoom, reset, setSpin, setTraffic, celebrate, setActiveCity }`.
- `js/survey-form.js` — `STEPS` (plain data: `choice`, `multi`, `range`, `rating`, `text`) and `initSurvey({ onChange, onStep, onSubmit })`.

## Libraries (import map, jsdelivr)
three.js 0.187 (+ `OrbitControls`, `CSS2DRenderer`, `BufferGeometryUtils` addons), `simplex-noise` 4.0.3 (continents), GSAP 3.12.5 (camera flights).

## Globe
- Planet radius `R = 10`, seeded (`mulberry32(1103)`), so the map is the same every load.
- `CITIES`: lat/lon, even `grid` size (centre lines meet the highways), `tall` (skyline height), roof `palette`. `HIGHWAYS` lists city pairs; each leaves from the middle of the grid side facing the other city.
- `terrain(n)`: noise + a city mask that forces flat land under each city. Roads sit at `max(terrain, R) + 0.004`, so highways bridge water.
- Traffic: up to `MAX_CARS` instanced cars (body + head/tail lights), right-hand lanes, U-turn at road ends. `setTraffic(1..10)` changes the visible count.
- Sun light is parented to the camera so the side you look at is always lit. Clouds fade out as you zoom in. Auto-spin resumes 4 s after you let go (off with reduced motion).
- `HOME_DIST` is refit on resize so the whole planet fits the narrower axis.

## Survey hooks
- Traffic step: flies close over Harbor City; the slider changes car density live.
- Place step: each option flies to its city; tapping a city label answers the question.
- Submit: camera returns home with a fast spin.

## Collecting responses
`ENDPOINT` at the top of `js/survey-form.js` is empty, so answers are only shown on the thank-you card and logged to the console. Set it to any URL that takes a JSON POST (Formspree, Google Apps Script, etc.).
