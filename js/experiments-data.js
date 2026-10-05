// Editable content for experiments.html â€” the "Experiments" page. Edit the
// title/subtitle and the `projects` list here; js/experiments.js reads
// this file and builds the page + canvas scene from it.
//
// Each project becomes one of the glowing nodes on the canvas â€” clicking
// it opens a small info card with `name`, `desc`, and `link`. The card's
// banner is the project's own share image (og:image): pages on this site
// supply theirs automatically; for an external link that has one, set it
// as the optional `image` field. Without either, the card shows a live
// screenshot of the link (see reference/experiments-page.md).
window.EXPERIMENTS = {
  title: "EXPERIMENTS",
  // "\n" forces a real line break at that point (see the xSubtitle wiring
  // in js/experiments.js) rather than leaving where it wraps up to the
  // browser's own text flow.
  subtitle: "Start by clicking a STAR and explore this cluster of micro-projects that are solving one problem at a time!",
  backHref: "index.html",

  // Replace these with the real experiments â€” name, one-line description,
  // and where clicking "Open â†’" should go (an external URL, or a relative
  // path to another page on this site). Add or remove entries freely.
  projects: [
    { name: "UX Mind", desc: "Formulate your entire design research plan in just one click.", link: "https://uxmind.figma.site/" },
    { name: "FootySplit", desc: "Split your squad & make your team on the go.", link: "https://footysplit.vercel.app/" },
    { name: "Fuellogger", desc: "Easiest way to log your refule and keep track of your expenses.", link: "https://fuel-logger.vercel.app/" },
    { name: "Easy Breathe", desc: "Want to regulare your breathing. Follow this small guide to learn how to control your breathe.", link: "https://easybreathe.vercel.app/" },
    { name: "Idea Canvas", desc: "Easiest way to collate ideas into an ever-expanding grid.", link: "https://idea-canvas.vercel.app/" },
    { name: "The Impossible Quiz", desc: "Want to answer a quiz where no answer is ever correct... or is it?", link: "https://absurd-quiz.vercel.app/" },
{ name: "Conspiracy Theory Geneator", desc: "Interested in creating or exploring weird conspiracy theory about...anything?", link: "https://conspiracy-theory.vercel.app/" },
{ name: "Pantone Style Guide", desc: "Want to stay updated on Pantone color of the year system? Look no further!", link: "https://www.figma.com/community/file/1420436283908108428", image: "https://s3-alpha.figma.com/hub/file/6702774208/b7a2c8ad-0e0d-4ce9-a70c-33841cb53396-cover.png" },
{ name: "Sticky Figures", desc: "A small game that lets you place any stick figures anywhere on the canvas.", link: "https://sticky-figures.vercel.app/" },
{ name: "Constellations", desc: "A million particles that drift, gather into shapes and constellations on their own, and orbit your black-hole cursor.", link: "constellations.html", image: "images/constellations/og-v2.jpg" },
{ name: "Valley Drive", desc: "An endless low-poly valley road. Drive a little red SUV through procedural mountains, knock over trees and watch day turn to night.", link: "valley-drive.html" },
{ name: "Primitive", desc: "Rebuild any image from a few hundred translucent shapes, then orbit them as layers in 3D and export it as SVG or PNG.", link: "primitive-art.html" },
{ name: "QR City", desc: "Type a web address and get a scannable QR code. Drag it and it rises into a 3D city of buildings, roads and traffic.", link: "qr-city.html", image: "images/qr-city/og.jpg" }

  ],

  // Visual tuning, carried over from the original design's defaults.
  // Safe to leave alone â€” see reference/experiments-page.md for what each
  // one does.
  ambientNodeCount: 100,
  motionSpeed: 2,
  nodeSizeScale: 1.35,

  // How often a clickable project node's halo ring fires (see
  // js/experiments.js) â€” a multiplier on its random per-node rate.
  // 1 = every ~7-16s per node; 2 = twice as often; 0.5 = half as often.
  // Each node still fires on its own random, unsynced schedule.
  twinkleFrequency: 1,

  // Forces reduced motion on regardless of the visitor's OS setting.
  // Leave false â€” js/experiments.js already respects
  // `prefers-reduced-motion: reduce` automatically.
  reduceMotion: false
};
