// SmartADC case study renderer. Reads window.CASE_STUDY (see
// js/smartadc-data.js) and fills in the page.
(() => {
  "use strict";

  const DATA = window.CASE_STUDY;
  if (!DATA) return;

  // Relative to this page's own location (study/smartadc.html, one level
  // below the site root) — a site-root-absolute path would 404 when the
  // site is opened via file:// instead of a real web server, since a
  // leading "/" resolves to the filesystem root, not the portfolio folder.
  const PHOTO_DIR = "../images/smartadc/";

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

  // A photo slot is a background-image on top of the element's own CSS
  // background-color — if the file doesn't exist yet, the browser just
  // skips painting that layer and the flat placeholder color shows
  // through untouched, same graceful-fallback pattern as every other
  // photo slot on this site. Once painted, clicking it opens the full
  // image in the lightbox above.
  function paintPhoto(el, filename) {
    if (!filename) return;
    const src = PHOTO_DIR + encodeURIComponent(filename);
    el.style.backgroundImage = 'url("' + src + '")';
    el.classList.add("has-photo");
    el.addEventListener("click", () => openLightbox(src));
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
  const descMeta = byId("saPageDescription");
  if (descMeta) descMeta.setAttribute("content", DATA.pageDescription);
  byId("saBack").setAttribute("href", DATA.backHref);

  text("saEyebrow", DATA.eyebrow);
  text("saTitle", DATA.title);
  text("saDek", DATA.dek);
  paintPhoto(byId("saHero"), DATA.heroPhoto);

  // --- Overview ------------------------------------------------------
  text("saOverviewHeading", DATA.overview.heading);
  const overviewEl = byId("saOverview");
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
  text("saResearchHeading", r.heading);

  text("saDiscoveryH3", r.discovery.h3);
  makeTable(byId("saDiscoveryTable"), r.discovery.tableHeaders, r.discovery.tableRows);

  text("saPrioritizationH3", r.prioritization.h3);
  makeTable(byId("saPrioritizationTable"), r.prioritization.tableHeaders, r.prioritization.tableRows);

  text("saProblemH3", r.problemQuantified.h3);
  text("saProblemIntro", r.problemQuantified.intro);
  makeTable(byId("saProblemTable"), r.problemQuantified.tableHeaders, r.problemQuantified.tableRows);
  text("saProblemFootnote", r.problemQuantified.footnote);

  // --- Iterative Design and Solution ----------------------------------
  const f = DATA.solutionFinding;
  text("saFindingHeading", f.heading);

  text("saConceptH3", f.conceptExploration.h3);
  makeTable(byId("saConceptTable"), f.conceptExploration.tableHeaders, f.conceptExploration.tableRows);
  makeStrip(byId("saConceptStrip"), f.conceptExploration.photos);

  text("saRationaleH3", f.designRationale.h3);
  text("saRationaleIntro", f.designRationale.intro);
  makeTable(byId("saRationaleTable"), f.designRationale.tableHeaders, f.designRationale.tableRows);
  makeStrip(byId("saRationaleStrip"), f.designRationale.photos);

  text("saValidationH3", f.validation.h3);
  makeTable(byId("saValidationTable"), f.validation.tableHeaders, f.validation.tableRows);

  // --- Results ---------------------------------------------------------
  const res = DATA.results;
  text("saResultsHeading", res.heading);

  text("saImpactH3", res.impact.h3);
  text("saImpactIntro", res.impact.intro);
  makeTable(byId("saImpactTable"), res.impact.tableHeaders, res.impact.tableRows, 1);

  // --- Conclusion ------------------------------------------------------
  const c = DATA.conclusion;
  text("saConclusionHeading", c.heading);
  text("saConclusionH3", c.h3);
  const learningsEl = byId("saLearnings");
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
  text("saConclusionClosing", c.closing);

  const videoEl = byId("saVideo");
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

  text("saProductLinkIntro", res.productLink.intro);
  const productLinkEl = byId("saProductLink");
  productLinkEl.textContent = res.productLink.label;
  productLinkEl.setAttribute("href", res.productLink.href);

  // --- Footer ------------------------------------------------------
  text("saFootBack", DATA.footer.backLabel);
  byId("saFootBack").setAttribute("href", DATA.backHref);
  text("saFootSocials", DATA.footer.socialsLabel);
})();
