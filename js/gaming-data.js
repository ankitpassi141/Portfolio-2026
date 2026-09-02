// Optional captions for the Gaming & Exploration page (gaming-gallery.html)
// — "Infinite Fold".
//
// Photos themselves are NOT edited here. Drop a file into images/gaming/,
// run scripts/build-gaming-manifest.ps1 (or double-click
// scripts/update-gaming.bat), and it shows up automatically — no data-file
// editing required. That script regenerates js/gaming-manifest.js, which
// js/gallery.js (loaded by gaming-gallery.html) reads to know what's in the
// folder.
//
// To caption a photo, add an entry here keyed by its filename exactly as it
// appears in images/gaming/ — title is the shot's name, place is the
// game/world it's from, tech is the flavor line on the right (camera-style,
// e.g. "f/2.0 · 1/250" or a platform/mode). Uncaptioned photos still show —
// they just display with the default placeholder text.
window.GAMING_CAPTIONS = {};
