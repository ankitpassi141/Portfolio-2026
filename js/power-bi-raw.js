// Power-BI Tool raw case study renderer — a 1:1 mirror of
// js/power-bi.js's rendering logic, reading window.CASE_STUDY_RAW (see
// js/power-bi-raw-data.js) instead of window.CASE_STUDY. See
// reference/power-bi-case-study.md.
(() => {
  "use strict";

  const DATA = window.CASE_STUDY_RAW;
  if (!DATA) return;

  // study/power-bi/raw/index.html is three levels below the site root.
  const PHOTO_DIR = "../../../images/power-bi/";

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

  let lightboxEl = null;
  function getLightbox() {
    if (lightboxEl) return lightboxEl;
    lightboxEl = document.createElement("div");
    lightboxEl.className = "pb-lightbox";
    const img = document.createElement("img");
    img.className = "pb-lightbox__img";
    img.alt = "";
    const close = document.createElement("button");
    close.type = "button";
    close.className = "pb-lightbox__close";
    close.setAttribute("aria-label", "Close");
    close.textContent = "×";
    close.addEventListener("click", closeLightbox);
    lightboxEl.addEventListener("click", (e) => { if (e.target === lightboxEl) closeLightbox(); });
    lightboxEl.append(img, close);
    document.body.appendChild(lightboxEl);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeLightbox();
    });
    return lightboxEl;
  }
  function openLightbox(src) {
    const lb = getLightbox();
    lb.querySelector(".pb-lightbox__img").src = src;
    lb.classList.add("is-open");
  }
  function closeLightbox() {
    if (lightboxEl) lightboxEl.classList.remove("is-open");
  }

  // Every photo slot is a real <img>, not a background-image div —
  // width:100% + height:auto (see css/power-bi.css) lets the browser
  // derive the box's height from the image's own aspect ratio instead
  // of cropping it into a fixed one.
  function paintPhoto(el, filename) {
    if (!filename || !el) return;
    const src = PHOTO_DIR + encodeURIComponent(filename);
    el.src = src;
    el.classList.add("has-photo");
    el.addEventListener("click", () => openLightbox(src));
  }

  function makeParas(container, paras) {
    (paras || []).forEach((p) => {
      const el = document.createElement("p");
      el.className = "pb-p";
      renderRich(el, p);
      container.appendChild(el);
    });
  }

  function makeTable(container, headers, rows, statCol) {
    const table = document.createElement("table");
    table.className = "pb-table";
    const thead = document.createElement("tr");
    headers.forEach((h) => {
      const th = document.createElement("th");
      renderRich(th, h);
      thead.appendChild(th);
    });
    table.appendChild(thead);
    rows.forEach((row) => {
      const tr = document.createElement("tr");
      row.forEach((cell, i) => {
        const td = document.createElement("td");
        renderRich(td, cell);
        if (i === statCol) td.classList.add("pb-stat");
        tr.appendChild(td);
      });
      table.appendChild(tr);
    });
    container.appendChild(table);
  }

  function makeList(container, items) {
    const ul = document.createElement("ul");
    ul.className = "pb-list";
    (items || []).forEach((item) => {
      const li = document.createElement("li");
      renderRich(li, item);
      ul.appendChild(li);
    });
    container.appendChild(ul);
  }

  function makeResultRows(container, rows) {
    (rows || []).forEach((row) => {
      const wrap = document.createElement("div");
      wrap.className = "pb-result";
      const h4 = document.createElement("div");
      h4.className = "pb-h4";
      h4.textContent = row.title;
      const p = document.createElement("p");
      p.className = "pb-p";
      renderRich(p, row.text);
      wrap.append(h4, p);
      container.appendChild(wrap);
    });
  }

  function byId(id) { return document.getElementById(id); }

  // --- Head / hero -------------------------------------------------
  document.title = DATA.pageTitle;
  const descMeta = byId("pbrPageDescription");
  if (descMeta) descMeta.setAttribute("content", DATA.pageDescription);
  byId("pbrBack").setAttribute("href", DATA.backHref);

  text("pbrEyebrow", DATA.eyebrow);
  text("pbrTitle", DATA.title);
  paintPhoto(byId("pbrHero"), DATA.heroPhoto);

  // --- Overview ------------------------------------------------------
  text("pbrOverviewHeading", DATA.overview.heading);
  const overviewEl = byId("pbrOverview");
  DATA.overview.items.forEach((item) => {
    const div = document.createElement("div");
    div.className = "pb-overview__item";
    const label = document.createElement("div");
    label.className = "pb-label";
    label.textContent = item.label;
    const value = document.createElement("div");
    value.className = "pb-p";
    renderRich(value, item.value);
    div.append(label, value);
    overviewEl.appendChild(div);
  });

  // --- Getting Started -------------------------------------------------
  const gs = DATA.gettingStarted;
  text("pbrGettingStartedHeading", gs.heading);
  text("pbrProjectH3", gs.project.h3);
  makeParas(byId("pbrProjectParas"), gs.project.paras);
  paintPhoto(byId("pbrProjectPhoto"), gs.project.photo);

  text("pbrMyRoleH3", gs.myRole.h3);
  makeParas(byId("pbrMyRoleParas"), gs.myRole.paras);

  // --- Problem & Understanding -----------------------------------------
  const pu = DATA.problemUnderstanding;
  text("pbrProblemHeading", pu.heading);
  text("pbrProblemCloseH3", pu.problemUpClose.h3);
  makeParas(byId("pbrProblemCloseParas"), pu.problemUpClose.paras);
  paintPhoto(byId("pbrProblemClosePhoto"), pu.problemUpClose.photo);

  text("pbrRebuildingH3", pu.rebuilding.h3);
  makeParas(byId("pbrRebuildingParas"), pu.rebuilding.paras);
  const rebuildingPhotosEl = byId("pbrRebuildingPhotos");
  (pu.rebuilding.photos || []).forEach((photo) => {
    const slot = document.createElement("img");
    slot.className = "pb-photo";
    slot.alt = "";
    paintPhoto(slot, photo);
    rebuildingPhotosEl.appendChild(slot);
  });

  text("pbrDesignSystemH3", pu.designSystem.h3);
  makeTable(byId("pbrDesignSystemTable"), pu.designSystem.tableHeaders, pu.designSystem.tableRows);
  paintPhoto(byId("pbrDesignSystemPhoto"), pu.designSystem.photo);

  // --- The Conflicts -----------------------------------------------------
  const cf = DATA.conflicts;
  text("pbrConflictsHeading", cf.heading);
  text("pbrConflictsH3", cf.h3);
  text("pbrConflictsIntro", cf.intro);
  makeTable(byId("pbrConflictsTable"), cf.tableHeaders, cf.tableRows);
  paintPhoto(byId("pbrConflictsPhoto"), cf.photo);

  const pd = cf.progressiveDisclosure;
  text("pbrProgressiveH3", pd.h3);
  text("pbrProgressiveDiscoveryLabel", pd.discoveryLabel);
  text("pbrProgressiveDiscoveryText", pd.discoveryText);
  text("pbrProgressiveSolutionIntro", pd.solutionIntro);
  makeList(byId("pbrProgressiveList"), pd.items);

  // --- Results ---------------------------------------------------------
  const res = DATA.results;
  text("pbrResultsHeading", res.heading);
  text("pbrResultsH3", res.h3);
  makeResultRows(byId("pbrResultsRows"), res.rows);

  // --- Conclusion ------------------------------------------------------
  const c = DATA.conclusion;
  text("pbrConclusionHeading", c.heading);
  text("pbrConclusionH3", c.h3);
  makeParas(byId("pbrConclusionParas"), c.paras);

  // --- Footer ------------------------------------------------------
  text("pbrFootBack", DATA.footer.backLabel);
  byId("pbrFootBack").setAttribute("href", DATA.backHref);
  text("pbrFootSocials", DATA.footer.socialsLabel);
})();
