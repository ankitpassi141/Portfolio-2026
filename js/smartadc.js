// SmartADC teaser renderer. Reads window.CASE_STUDY (see
// js/smartadc-data.js) and fills in the condensed public page. The
// full write-up is a separate page/script — see js/smartadc-raw.js and
// reference/smartadc-case-study.md.
(() => {
  "use strict";

  const DATA = window.CASE_STUDY;
  if (!DATA) return;

  // Relative to this page's own location (study/smartadc.html, one
  // level below the site root) — a site-root-absolute path would 404
  // when the site is opened via file:// instead of a real web server.
  const PHOTO_DIR = "../images/smartadc/";

  // Turns **word** into <strong>word</strong> — write **bold** in any
  // data-file string to bold that part of it. Builds real nodes via
  // createElement/createTextNode rather than innerHTML, so it can't be
  // tricked into running markup as HTML.
  function renderRich(el, value) {
    el.textContent = "";
    if (value == null) return;
    const parts = String(value).split(/\*\*(.+?)\*\*/g);
    parts.forEach((part, i) => {
      if (!part) return;
      if (i % 2 === 1) {
        const strong = document.createElement("strong");
        strong.textContent = part;
        el.appendChild(strong);
      } else {
        el.appendChild(document.createTextNode(part));
      }
    });
  }

  function text(id, value) {
    const el = document.getElementById(id);
    if (el && value != null) renderRich(el, value);
  }

  function byId(id) { return document.getElementById(id); }

  // --- Head / nav -------------------------------------------------
  document.title = DATA.pageTitle;
  const descMeta = byId("saPageDescription");
  if (descMeta) descMeta.setAttribute("content", DATA.pageDescription);
  const backEl = byId("saBack");
  backEl.setAttribute("href", DATA.backHref);
  text("saBack", DATA.backLabel);
  text("saRoleTag", DATA.roleTag);

  // --- Hero ------------------------------------------------------
  text("saHeroTitle", DATA.hero.title);
  text("saHeroIntro", DATA.hero.intro);
  if (DATA.hero.liveTagLabel) {
    text("saLiveTagPrefix", DATA.hero.liveTagPrefix);
    const liveLink = byId("saLiveTagLink");
    liveLink.textContent = DATA.hero.liveTagLabel;
    liveLink.setAttribute("href", DATA.hero.liveTagHref);
  } else {
    byId("saLiveTag").remove();
  }

  // --- Figure ------------------------------------------------------
  const figureImg = byId("saFigureImg");
  if (DATA.figure.photo) figureImg.src = PHOTO_DIR + encodeURIComponent(DATA.figure.photo);
  figureImg.alt = DATA.figure.alt || "";
  text("saFigureCaption", DATA.figure.caption);

  // --- Strip ------------------------------------------------------
  const stripEl = byId("saStrip");
  DATA.strip.forEach((item) => {
    const div = document.createElement("div");
    const k = document.createElement("p");
    k.className = "k";
    renderRich(k, item.label);
    const p = document.createElement("p");
    renderRich(p, item.text);
    div.append(k, p);
    stripEl.appendChild(div);
  });

  // --- Metrics ------------------------------------------------------
  const metricsEl = byId("saMetrics");
  DATA.metrics.forEach((m) => {
    const div = document.createElement("div");
    const num = document.createElement("p");
    num.className = "num";
    renderRich(num, m.num);
    const lbl = document.createElement("p");
    lbl.className = "lbl";
    renderRich(lbl, m.label);
    div.append(num, lbl);
    metricsEl.appendChild(div);
  });

  // --- Caveat ------------------------------------------------------
  text("saCaveat", DATA.caveat);

  // --- CTA ------------------------------------------------------
  text("saCtaHeading", DATA.cta.heading);
  text("saCtaIntro", DATA.cta.intro);
  const ctaLinksEl = byId("saCtaLinks");
  DATA.cta.links.forEach((link) => {
    const a = document.createElement("a");
    if (link.primary) a.className = "primary";
    a.href = link.href;
    a.textContent = link.label;
    if (link.external) {
      a.target = "_blank";
      a.rel = "noopener";
    }
    ctaLinksEl.appendChild(a);
  });

  // --- Footer ------------------------------------------------------
  text("saFootNote", DATA.footNote);
})();
