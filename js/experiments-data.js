// Editable content for experiments.html — the "Experiments" page. Edit the
// title/subtitle and the `projects` list here; js/experiments.js reads
// this file and builds the page + canvas scene from it.
//
// Each project becomes one of the glowing nodes on the canvas — clicking
// it opens a small info card with `name`, `desc`, and `link`. There's no
// photo here; a project is represented purely by its position and motion
// on the canvas, not an image.
window.EXPERIMENTS = {
  title: "EXPERIMENTS",
  subtitle: "Cluster of micro-projects that is solving one problems at a time!",
  backHref: "index.html",

  // Replace these with the real experiments — name, one-line description,
  // and where clicking "Open →" should go (an external URL, or a relative
  // path to another page on this site). Add or remove entries freely.
  projects: [
    { name: "UX Mind", desc: "Formulate your entire design research plan in just one click.", link: "https://uxmind.figma.site/" },
    { name: "FootySplit", desc: "Split your squad & make your team on the go.", link: "https://footysplit.vercel.app/" },
    { name: "Fuellogger", desc: "Easiest way to log your refule and keep track of your expenses.", link: "https://fuel-logger.vercel.app/" },
    { name: "Easy Breathe", desc: "Want to regulare your breathing. Follow this small guide to learn how to control your breathe.", link: "https://easybreathe.vercel.app/" },
    { name: "Idea Canvas", desc: "Easiest way to collate ideas into an ever-expanding grid.", link: "https://idea-canvas.vercel.app/" },
    { name: "The Impossible Quiz", desc: "Want to answer a quiz where no answer is ever correct... or is it?", link: "https://absurd-quiz.vercel.app/" },
{ name: "Conspiracy Theory Geneator", desc: "Interested in creating or exploring weird conspiracy theory about...anything?", link: "https://conspiracy-theory.vercel.app/" },
{ name: "Pantone Style Guide", desc: "Want to stay updated on Pantone color of the year system? Look no further!", link: "https://www.figma.com/community/file/1420436283908108428" },
{ name: "Sticky Figures", desc: "A small game that lets you place any stick figures anywhere on the canvas.", link: "https://sticky-figures.vercel.app/" }

  ],

  // Visual tuning, carried over from the original design's defaults.
  // Safe to leave alone — see reference/experiments-page.md for what each
  // one does.
  ambientNodeCount: 100,
  motionSpeed: 2,
  nodeSizeScale: 1.35,

  // Forces reduced motion on regardless of the visitor's OS setting.
  // Leave false — js/experiments.js already respects
  // `prefers-reduced-motion: reduce` automatically.
  reduceMotion: false
};
