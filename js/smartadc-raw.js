// SmartADC raw case study renderer — a 1:1 mirror of js/smartadc.js's
// rendering logic, reading window.CASE_STUDY_RAW (see
// js/smartadc-raw-data.js) instead of window.CASE_STUDY. See
// reference/smartadc-case-study.md.
(() => {
  "use strict";

  const DATA = window.CASE_STUDY_RAW;
  if (!DATA) return;

  // study/smartadc/raw/index.html is three levels below the site root.
  const PHOTO_DIR = "../../../images/smartadc/";

  // Renders a string into `el`, turning **word** into <strong>word</strong>
  // — write **bold** in any data-file string (paragraphs, table cells,
  // etc.) to bold that part of it. Uses createElement/appendChild rather
  // than innerHTML, so it can't be tricked into running markup as HTML.
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

  // Fullscreen click-to-enlarge overlay, shared by every photo slot on
  // the page — built lazily on first use, then reused. Closes on the
  // × button, a click on the dimmed backdrop, or Escape.
  let lightboxEl = null;
  function getLightbox() {
    if (lightboxEl) return lightboxEl;
    lightboxEl = document.createElement("div");
    lightboxEl.className = "sa-lightbox";
    const img = document.createElement("img");
    img.className = "sa-lightbox__img";
    img.alt = "";
    const close = document.createElement("button");
    close.type = "button";
    close.className = "sa-lightbox__close";
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
    lb.querySelector(".sa-lightbox__img").src = src;
    lb.classList.add("is-open");
  }
  function closeLightbox() {
    if (lightboxEl) lightboxEl.classList.remove("is-open");
  }

  function paintPhoto(el, filename) {
    if (!filename) return;
    const src = PHOTO_DIR + encodeURIComponent(filename);
    el.style.backgroundImage = 'url("' + src + '")';
    el.classList.add("has-photo");
    el.addEventListener("click", () => openLightbox(src));
  }

  // For a real <img> element (e.g. .sa-photo) rather than a
  // background-image div — lets the browser size the element from the
  // image's own natural aspect ratio instead of a fixed CSS one.
  function setImgSrc(el, filename) {
    if (!filename) return;
    el.src = PHOTO_DIR + encodeURIComponent(filename);
    el.classList.add("has-photo");
    el.addEventListener("click", () => openLightbox(el.src));
  }

  function makeParas(container, paras) {
    (paras || []).forEach((p) => {
      const el = document.createElement("p");
      el.className = "sa-p";
      renderRich(el, p);
      container.appendChild(el);
    });
  }

  function makeTable(container, headers, rows, statCol) {
    const table = document.createElement("table");
    table.className = "sa-table";
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
        if (i === statCol) td.classList.add("sa-stat");
        tr.appendChild(td);
      });
      table.appendChild(tr);
    });
    container.appendChild(table);
  }

  function makeStrip(container, photos) {
    (photos || []).forEach((photo) => {
      const slot = document.createElement("div");
      slot.className = "sa-strip__photo";
      paintPhoto(slot, photo);
      container.appendChild(slot);
    });
  }

  function byId(id) { return document.getElementById(id); }

  // --- Head / hero -------------------------------------------------
  document.title = DATA.pageTitle;
  const descMeta = byId("sarPageDescription");
  if (descMeta) descMeta.setAttribute("content", DATA.pageDescription);
  byId("sarBack").setAttribute("href", DATA.backHref);

  text("sarEyebrow", DATA.eyebrow);
  text("sarTitle", DATA.title);
  text("sarDek", DATA.dek);
  paintPhoto(byId("sarHero"), DATA.heroPhoto);

  // --- Overview ------------------------------------------------------
  text("sarOverviewHeading", DATA.overview.heading);
  const overviewEl = byId("sarOverview");
  DATA.overview.items.forEach((item) => {
    const div = document.createElement("div");
    div.className = "sa-overview__item";
    const label = document.createElement("div");
    label.className = "sa-label";
    label.textContent = item.label;
    const value = document.createElement("div");
    value.className = "sa-p";
    renderRich(value, item.value);
    div.append(label, value);
    overviewEl.appendChild(div);
  });

  // --- Research --------------------------------------------------------
  const r = DATA.research;
  text("sarResearchHeading", r.heading);

  text("sarDiscoveryH3", r.discovery.h3);
  makeTable(byId("sarDiscoveryTable"), r.discovery.tableHeaders, r.discovery.tableRows);
  setImgSrc(byId("sarDiscoveryPhoto"), r.discovery.photo);

  text("sarPrioritizationH3", r.prioritization.h3);
  makeTable(byId("sarPrioritizationTable"), r.prioritization.tableHeaders, r.prioritization.tableRows);
  makeStrip(byId("sarPrioritizationStrip"), r.prioritization.photos);

  text("sarProblemH3", r.problemQuantified.h3);
  text("sarProblemIntro", r.problemQuantified.intro);
  makeTable(byId("sarProblemTable"), r.problemQuantified.tableHeaders, r.problemQuantified.tableRows, 2);
  text("sarProblemFootnote", r.problemQuantified.footnote);

  // --- Iterative Design and Solution ----------------------------------
  const f = DATA.solutionFinding;
  text("sarFindingHeading", f.heading);

  text("sarConceptH3", f.conceptExploration.h3);
  makeTable(byId("sarConceptTable"), f.conceptExploration.tableHeaders, f.conceptExploration.tableRows);
  makeStrip(byId("sarConceptStrip"), f.conceptExploration.photos);

  text("sarRationaleH3", f.designRationale.h3);
  text("sarRationaleIntro", f.designRationale.intro);
  makeTable(byId("sarRationaleTable"), f.designRationale.tableHeaders, f.designRationale.tableRows);
  makeStrip(byId("sarRationaleStrip"), f.designRationale.photos);

  text("sarValidationH3", f.validation.h3);
  makeTable(byId("sarValidationTable"), f.validation.tableHeaders, f.validation.tableRows);

  // --- Results ---------------------------------------------------------
  const res = DATA.results;
  text("sarResultsHeading", res.heading);

  text("sarImpactH3", res.impact.h3);
  text("sarImpactIntro", res.impact.intro);
  makeTable(byId("sarImpactTable"), res.impact.tableHeaders, res.impact.tableRows, 2);

  // --- Conclusion ------------------------------------------------------
  const c = DATA.conclusion;
  text("sarConclusionHeading", c.heading);
  text("sarConclusionH3", c.h3);
  const learningsEl = byId("sarLearnings");
  c.rows.forEach((row) => {
    const rowEl = document.createElement("div");
    rowEl.className = "sa-learnings__row";
    const title = document.createElement("div");
    title.className = "sa-learnings__cell sa-learnings__title";
    renderRich(title, row.title);
    const context = document.createElement("div");
    context.className = "sa-learnings__cell sa-learnings__context";
    renderRich(context, row.context);
    const learning = document.createElement("div");
    learning.className = "sa-learnings__cell sa-learnings__learning";
    renderRich(learning, row.learning);
    rowEl.append(title, context, learning);
    learningsEl.appendChild(rowEl);
  });
  text("sarConclusionClosing", c.closing);

  const videoEl = byId("sarVideo");
  if (res.videoEmbedUrl) {
    videoEl.textContent = "";
    videoEl.classList.add("is-filled");
    const iframe = document.createElement("iframe");
    iframe.src = res.videoEmbedUrl;
    iframe.allowFullscreen = true;
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    // YouTube's own oEmbed response for this video includes this exact
    // attribute on its recommended <iframe> — without it, some
    // browsers/contexts send no referrer at all, which YouTube's player
    // rejects with "Error 153: Video player configuration error".
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    videoEl.appendChild(iframe);
  } else {
    videoEl.textContent = "Product walkthrough video";
  }

  text("sarProductLinkIntro", res.productLink.intro);
  const productLinkEl = byId("sarProductLink");
  productLinkEl.textContent = res.productLink.label;
  productLinkEl.setAttribute("href", res.productLink.href);

  // --- Footer ------------------------------------------------------
  text("sarFootBack", DATA.footer.backLabel);
  byId("sarFootBack").setAttribute("href", DATA.backHref);
  text("sarFootSocials", DATA.footer.socialsLabel);
})();
