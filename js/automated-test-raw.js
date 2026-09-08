// Assessment Generator case study renderer — PRIVATE /raw version. Reads
// window.CASE_STUDY_RAW (see js/automated-test-raw-data.js) and fills in
// the page. This is a full mirror of js/automated-test.js's rendering
// logic (same section shapes, same HTML ids), just pointed at the
// unredacted data and this page's own nesting depth for image paths —
// see reference/automated-test-case-study.md for why the two pages and
// data files are kept separate instead of sharing one script.
(() => {
  "use strict";

  const DATA = window.CASE_STUDY_RAW;
  if (!DATA) return;

  // One level deeper than the public page (study/automated-test/raw/ vs
  // study/automated-test.html), so the relative path needs an extra "../".
  const PHOTO_DIR = "../../../images/automated-test/";

  // Turns **word** into <strong>word</strong> — write **bold** in any
  // data-file string (paragraphs, table cells, quotes, etc.) to bold
  // that part of it. Builds real nodes via createElement/createTextNode
  // rather than innerHTML, so it can't be tricked into running markup
  // as HTML.
  function richNodes(value) {
    const frag = document.createDocumentFragment();
    if (value == null) return frag;
    const parts = String(value).split(/\*\*(.+?)\*\*/g);
    parts.forEach((part, i) => {
      if (!part) return;
      if (i % 2 === 1) {
        const strong = document.createElement("strong");
        strong.textContent = part;
        frag.appendChild(strong);
      } else {
        frag.appendChild(document.createTextNode(part));
      }
    });
    return frag;
  }

  function renderRich(el, value) {
    el.textContent = "";
    el.appendChild(richNodes(value));
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
    lightboxEl.className = "cs-lightbox";
    const img = document.createElement("img");
    img.className = "cs-lightbox__img";
    img.alt = "";
    const close = document.createElement("button");
    close.type = "button";
    close.className = "cs-lightbox__close";
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
    lb.querySelector(".cs-lightbox__img").src = src;
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

  function makeParas(container, paras) {
    (paras || []).forEach((p) => {
      const el = document.createElement("p");
      el.className = "cs-p";
      renderRich(el, p);
      container.appendChild(el);
    });
  }

  function makeTable(container, headers, rows, statCol) {
    const table = document.createElement("table");
    table.className = "cs-table";
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
        if (i === statCol) td.classList.add("cs-stat");
        tr.appendChild(td);
      });
      table.appendChild(tr);
    });
    container.appendChild(table);
  }

  function byId(id) { return document.getElementById(id); }

  // --- Head / hero -------------------------------------------------
  document.title = DATA.pageTitle;
  const descMeta = byId("csrPageDescription");
  if (descMeta) descMeta.setAttribute("content", DATA.pageDescription);
  byId("csrBack").setAttribute("href", DATA.backHref);

  text("csrEyebrow", DATA.eyebrow);
  text("csrTitle", DATA.title);
  text("csrDek", DATA.dek);
  paintPhoto(byId("csrHero"), DATA.heroPhoto);

  // --- Overview ------------------------------------------------------
  text("csrOverviewHeading", DATA.overview.heading);
  const overviewEl = byId("csrOverview");
  DATA.overview.items.forEach((item) => {
    const div = document.createElement("div");
    div.className = "cs-overview__item";
    const label = document.createElement("div");
    label.className = "cs-label";
    label.textContent = item.label;
    const value = document.createElement("div");
    value.className = "cs-p";
    renderRich(value, item.value);
    div.append(label, value);
    overviewEl.appendChild(div);
  });

  // --- Research --------------------------------------------------------
  const r = DATA.research;
  text("csrResearchHeading", r.heading);
  text("csrFirstImpH3", r.firstImpression.h3);
  makeParas(byId("csrFirstImpParas"), r.firstImpression.paras);

  text("csrMethodsH3", r.methods.h3);
  makeTable(byId("csrMethodsTable"), r.methods.tableHeaders, r.methods.tableRows);

  text("csrProblemH3", r.problemQuantified.h3);
  text("csrProblemIntro", r.problemQuantified.intro);
  makeTable(byId("csrProblemTable"), r.problemQuantified.tableHeaders, r.problemQuantified.tableRows);
  text("csrProblemFootnote", r.problemQuantified.footnote);

  text("csrResearchSummaryH3", r.summary.h3);
  makeParas(byId("csrResearchSummaryParas"), r.summary.paras);

  // --- Finding the Right Solution ------------------------------------
  const f = DATA.solutionFinding;
  text("csrFindingHeading", f.heading);
  text("csrExplorationH3", f.exploration.h3);
  makeParas(byId("csrExplorationParas"), f.exploration.paras);

  text("csrIdeationH3", f.ideation.h3);
  makeParas(byId("csrIdeationParas"), f.ideation.paras);

  const pathsEl = byId("csrPaths");
  [f.ideation.pathA, f.ideation.pathB].forEach((path) => {
    const wrap = document.createElement("div");
    wrap.className = "cs-path";
    const h3 = document.createElement("h3");
    h3.className = "cs-h3";
    h3.textContent = path.title;
    const desc = document.createElement("p");
    desc.className = "cs-p";
    renderRich(desc, path.desc);
    const strip = document.createElement("div");
    strip.className = "cs-path__strip";
    path.photos.forEach((photo) => {
      const slot = document.createElement("div");
      slot.className = "cs-path__photo";
      paintPhoto(slot, photo);
      strip.appendChild(slot);
    });
    wrap.append(h3, desc, strip);
    pathsEl.appendChild(wrap);
  });

  text("csrReviewH3", f.review.h3);
  text("csrReviewIntro", f.review.intro);
  makeTable(byId("csrReviewTable"), f.review.tableHeaders, f.review.tableRows);
  makeParas(byId("csrReviewParas"), f.review.paras);

  text("csrProposalH3", f.proposal.h3);
  makeParas(byId("csrProposalParas"), f.proposal.paras);
  const cardsEl = byId("csrProposalCards");
  f.proposal.cards.forEach((card) => {
    const div = document.createElement("div");
    div.className = "cs-card";
    const label = document.createElement("div");
    label.className = "cs-label";
    label.textContent = card.label;
    const p = document.createElement("p");
    p.className = "cs-p";
    renderRich(p, card.text);
    div.append(label, p);
    cardsEl.appendChild(div);
  });

  text("csrFindingSummaryH3", f.summary.h3);
  makeParas(byId("csrFindingSummaryParas"), f.summary.paras);

  // --- The Solution --------------------------------------------------
  const s = DATA.solution;
  text("csrSolutionHeading", s.heading);
  text("csrSolutionIntroH3", s.intro.h3);
  makeParas(byId("csrSolutionIntroParas"), s.intro.paras);

  text("csrDecisionsH3", s.decisions.h3);
  text("csrDecisionsIntro", s.decisions.intro);
  makeTable(byId("csrDecisionsTable"), s.decisions.tableHeaders, s.decisions.tableRows);

  text("csrStepsH3", s.steps.h3);
  const stepsEl = byId("csrSteps");
  s.steps.items.forEach((step) => {
    const wrap = document.createElement("div");
    wrap.className = "cs-step";
    const h3 = document.createElement("h3");
    h3.className = "cs-h3";
    h3.textContent = step.title;
    const action = document.createElement("p");
    action.className = "cs-p";
    const actionStrong = document.createElement("strong");
    actionStrong.textContent = "Action: ";
    action.append(actionStrong, richNodes(step.action));
    const benefit = document.createElement("p");
    benefit.className = "cs-p";
    const benefitStrong = document.createElement("strong");
    benefitStrong.textContent = "Benefit: ";
    benefit.append(benefitStrong, richNodes(step.benefit));
    const strip = document.createElement("div");
    strip.className = "cs-step__strip";
    step.photos.forEach((photo) => {
      const slot = document.createElement("div");
      slot.className = "cs-step__photo";
      paintPhoto(slot, photo);
      strip.appendChild(slot);
    });
    wrap.append(h3, action, benefit, strip);
    stepsEl.appendChild(wrap);
  });

  const figmaEl = byId("csrFigma");
  if (s.figmaEmbedUrl) {
    figmaEl.textContent = "";
    figmaEl.classList.add("is-filled");
    const iframe = document.createElement("iframe");
    iframe.src = s.figmaEmbedUrl;
    iframe.allowFullscreen = true;
    figmaEl.appendChild(iframe);
  } else {
    figmaEl.textContent = "Figma prototype embed";
  }

  // --- Results ---------------------------------------------------------
  const res = DATA.results;
  text("csrResultsHeading", res.heading);
  text("csrValidationH3", res.validation.h3);
  makeParas(byId("csrValidationParas"), res.validation.paras);

  text("csrImpactH3", res.impact.h3);
  makeTable(byId("csrImpactTable"), res.impact.tableHeaders, res.impact.tableRows, 2);
  text("csrImpactClosing", res.impact.closing);

  text("csrQuotesH3", res.quotes.h3);
  text("csrQuotesIntro", res.quotes.intro);
  const quoteGroupsEl = byId("csrQuoteGroups");
  res.quotes.groups.forEach((group) => {
    const wrap = document.createElement("div");
    wrap.className = "cs-quote-group";
    const label = document.createElement("div");
    label.className = "cs-label";
    label.textContent = group.label;
    const grid = document.createElement("div");
    grid.className = "cs-quote-group__grid";
    group.quotes.forEach((q) => {
      const quote = document.createElement("div");
      quote.className = "cs-quote";
      const p = document.createElement("p");
      p.append("“", richNodes(q), "”");
      quote.appendChild(p);
      grid.appendChild(quote);
    });
    wrap.append(label, grid);
    quoteGroupsEl.appendChild(wrap);
  });

  // --- Conclusion ------------------------------------------------------
  const c = DATA.conclusion;
  text("csrConclusionHeading", c.heading);
  text("csrConclusionH3", c.h3);
  text("csrConclusionIntro", c.intro);
  const learningsEl = byId("csrLearnings");
  c.rows.forEach((row) => {
    const rowEl = document.createElement("div");
    rowEl.className = "cs-learnings__row";
    const title = document.createElement("div");
    title.className = "cs-learnings__cell cs-learnings__title";
    renderRich(title, row.title);
    const context = document.createElement("div");
    context.className = "cs-learnings__cell cs-learnings__context";
    renderRich(context, row.context);
    const learning = document.createElement("div");
    learning.className = "cs-learnings__cell cs-learnings__learning";
    renderRich(learning, row.learning);
    rowEl.append(title, context, learning);
    learningsEl.appendChild(rowEl);
  });
  text("csrConclusionClosing", c.closing);

  // --- Footer ------------------------------------------------------
  text("csrFootBack", DATA.footer.backLabel);
  byId("csrFootBack").setAttribute("href", DATA.backHref);
  text("csrFootSocials", DATA.footer.socialsLabel);
})();
