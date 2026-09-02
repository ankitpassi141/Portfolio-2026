// One entry per case-study card in the Work Gallery (Home page + the All
// Case Studies page). Paste a real URL in `url` and that card's click opens
// case-study.html?id=<this-key> on THIS site — a single shared template
// page (see js/case-study.js) that embeds your URL in an iframe, so the
// visitor's address bar stays on this site instead of jumping straight to
// the external one. See reference/case-studies.md.
//
// Leave `url` as "#" to keep showing the built-in in-page write-up instead
// (its content lives in the CASES object in js/case-sheet.js) until you
// have a real link to send people to.
window.CASE_STUDIES = {
  "one-plan": {
    title: "Assessment Generator",
    url: "https://ankitpassi.in/automated-test" // TODO: paste the real case-study link, e.g. https://yoursite.com/case-studies/one-plan
  },
  "ib-engine": {
    title: "Power-BI Tool",
    url: "https://ankitpassi.in/power-bi" // TODO: paste the real case-study link
  },
  "migration": {
    title: "Assessment Centers",
    url: "https://ankitpassi.in/smartadc" // TODO: paste the real case-study link
  }
};
