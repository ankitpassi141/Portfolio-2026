// Renders the single case-study template page (case-study.html). Reads the
// ?id= query string, looks up its URL in window.CASE_STUDIES (see
// js/case-studies-data.js) and points the iframe at it — every case study
// reuses this one page/file, only the query string and embedded URL change.
(() => {
  "use strict";

  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  const entry = id && window.CASE_STUDIES ? window.CASE_STUDIES[id] : null;
  const url = entry && entry.url && entry.url !== "#" ? entry.url : null;

  const frame = document.getElementById("caseFrame");
  const empty = document.getElementById("caseEmpty");
  const crumbTitle = document.getElementById("caseCrumbTitle");

  if (url) {
    frame.src = url;
    if (entry.title) {
      crumbTitle.textContent = entry.title;
      document.title = entry.title + " — Ankit Passi";
    }
  } else {
    frame.hidden = true;
    empty.hidden = false;
  }
})();
