// Power-BI Tool teaser renderer. Reads window.CASE_STUDY (see
// js/power-bi-data.js) and fills in the condensed public page. The
// full write-up is a separate page/script — see
// js/power-bi-raw.js and reference/power-bi-case-study.md.
(() => {
  "use strict";

  const DATA = window.CASE_STUDY;
  if (!DATA) return;

  // Relative to this page's own location (study/power-bi.html, one
  // level below the site root) — a site-root-absolute path would 404
  // when the site is opened via file:// instead of a real web server.
  const PHOTO_DIR = "../images/power-bi/";

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
  const descMeta = byId("pbPageDescription");
  if (descMeta) descMeta.setAttribute("content", DATA.pageDescription);
  const backEl = byId("pbBack");
  backEl.setAttribute("href", DATA.backHref);
  text("pbBack", DATA.backLabel);
  text("pbRoleTag", DATA.roleTag);

  // --- Hero ------------------------------------------------------
  text("pbHeroTitle", DATA.hero.title);
  text("pbHeroIntro", DATA.hero.intro);

  // --- Figure ------------------------------------------------------
  const figureImg = byId("pbFigureImg");
  if (DATA.figure.photo) figureImg.src = PHOTO_DIR + encodeURIComponent(DATA.figure.photo);
  figureImg.alt = DATA.figure.alt || "";
  text("pbFigureCaption", DATA.figure.caption);

  // --- Strip ------------------------------------------------------
  const stripEl = byId("pbStrip");
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

  // --- Caveat ------------------------------------------------------
  text("pbCaveat", DATA.caveat);

  // --- CTA ------------------------------------------------------
  text("pbCtaHeading", DATA.cta.heading);
  text("pbCtaIntro", DATA.cta.intro);
  const ctaLinksEl = byId("pbCtaLinks");
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
  text("pbFootNote", DATA.footNote);
})();
