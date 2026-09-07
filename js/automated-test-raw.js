// Renders the private /raw companion page. Reads window.CASE_STUDY_RAW
// (see js/automated-test-raw-data.js).
(() => {
  "use strict";

  const DATA = window.CASE_STUDY_RAW;
  if (!DATA) return;

  function byId(id) { return document.getElementById(id); }
  function text(id, value) {
    const el = byId(id);
    if (el && value != null) el.textContent = value;
  }

  document.title = DATA.pageTitle;
  byId("csrBack").setAttribute("href", DATA.backHref);
  text("csrBackLabel", DATA.backLabel);
  text("csrEyebrow", DATA.eyebrow);
  text("csrTitle", DATA.title);

  const wrap = byId("csrSections");
  (DATA.sections || []).forEach((sec) => {
    const section = document.createElement("div");
    section.className = "cs-raw-section";
    const h3 = document.createElement("h3");
    h3.className = "cs-h3";
    h3.textContent = sec.h3;
    section.appendChild(h3);
    (sec.paras || []).forEach((p) => {
      const para = document.createElement("p");
      para.className = "cs-p";
      para.textContent = p;
      section.appendChild(para);
    });
    wrap.appendChild(section);
  });
})();
