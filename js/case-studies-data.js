// One entry per case-study card in the Work Gallery (Home page + the All
// Case Studies page). Paste a real URL in `url` and that card's click
// opens it:
//   - an external URL (http/https, e.g. a Framer link) opens on
//     case-study.html?id=<this-key> — a single shared template page (see
//     js/case-study.js) that embeds it in an iframe, so the visitor's
//     address bar stays on this site instead of jumping straight to the
//     external one.
//   - a local path (e.g. "study/<slug>.html", a native case study built
//     on this site — see reference/automated-test-case-study.md) opens
//     directly, no iframe wrapper — it's already on this site, and the
//     page has its own "Back to Home" header, so wrapping it in
//     case-study.html's would just double it up. No leading "/" — that
//     resolves to the drive root under file://, breaking the link when
//     the site's opened by double-clicking index.html instead of being
//     served.
// See js/case-sheet.js's wireCaseLinks()/externalCaseUrl() for exactly
// how that split is decided, and reference/case-studies.md.
//
// Leave `url` as "#" to keep showing the built-in in-page write-up instead
// (its content lives in the CASES object in js/case-sheet.js) until you
// have a real link to send people to.
window.CASE_STUDIES = {
  "one-plan": {
    title: "Assessment Generator",
    url: "study/automated-test.html" // native page on this site — see reference/automated-test-case-study.md
  },
  "ib-engine": {
    title: "Power-BI Tool",
    url: "https://ankitpassi.framer.ai/power-bi" // TODO: paste the real case-study link
  },
  "migration": {
    title: "Assessment Centers",
    url: "https://ankitpassi.framer.ai/smartadc" // TODO: paste the real case-study link
  }
};
