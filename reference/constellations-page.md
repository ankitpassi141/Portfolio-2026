# Constellations Page — Reference

`constellations.html` is a full-screen WebGL particle experiment, linked
from the Experiments page as the **Constellations** node (entry in
[js/experiments-data.js](../js/experiments-data.js)). It's a standalone
page with its own dark palette and IBM Plex Mono — like
`css/experiments.css`, it does not use `css/tokens.css`.

## What it does

- ~1M particles (262k on small screens) fill a 3D cube the camera stays
  inside, each wandering on its own path.
- **Click** empty space → the ~20k particles nearest the click gather into
  a random shape there, leaving a drained pocket. Click again → it
  disperses.
- **Clusters form on their own**: up to 3 at a time — solid shapes, small
  constellations (stars joined by dotted links) and star rivers — of one
  colour, at random visible spots. They hold for 6–18s, then drift apart.
  Clicking one disperses it immediately.
- **Cursor = black hole**: a gentle, slow vortex. Roughly half the
  particles it reaches spiral in and are swallowed (they re-emerge
  elsewhere, fading in); the rest circle and drift back out.
- **Right-drag** orbits, **scroll** zooms (two-finger drag / pinch on touch).
- Occasional **shooting stars** cross the screen (at most 3 at once).
- Two sliders: **Rotation speed** (default 0.3×) and **Cursor radius**
  (default 150px, 0 turns the black hole off).

## Files

- [constellations.html](../constellations.html) — markup, loads Three.js
  r128 from cdnjs, then the page script and the shared cookie consent.
- [css/constellations.css](../css/constellations.css) — page styles.
- [js/constellations.js](../js/constellations.js) — everything else.
  Tuning knobs (particle count, speeds, black-hole pull/swirl, cluster
  pacing, meteor cap) are grouped at the top of `runConstellations()`.
  Append `?n=512` (etc.) to the URL to change the particle count
  (particles = n²).

## How it works

Particle physics runs on the GPU: positions and velocities live in float
render targets and are updated each frame by two full-screen shader passes
(velocity, then position). The position texture's `w` channel holds which
self-forming cluster a particle belongs to; cluster shapes are procedural
(computed in the shader), so they need no CPU work. The clicked shape does
one GPU → CPU readback per click (~90ms at 1M particles) to find the
nearest particles. Needs WebGL with float (or half-float) render targets;
otherwise the page shows a fallback message.
