// Assessment Generator case study renderer. Reads window.CASE_STUDY (see
// js/automated-test-data.js) and fills in the page.
(() => {
  "use strict";

  const DATA = window.CASE_STUDY;
  if (!DATA) return;

  // Relative to this page's own location (study/automated-test.html, one
  // level below the site root) — a site-root-absolute path would 404
  // when the site is opened via file:// instead of a real web server,
  // since a leading "/" resolves to the filesystem root, not the
  // portfolio folder.
  const PHOTO_DIR = "../images/automated-test/";

  function text(id, value) {
    const el = document.getElementById(id);
    if (el && value != null) el.textContent = value;
  }

  // A photo slot is a background-image on top of the element's own CSS
  // background-color (var(--paper-raised)) — if the file doesn't exist yet,
  // the browser just skips painting that layer and the flat placeholder
  // color shows through untouched, same graceful-fallback pattern as the
  // About page.
  function paintPhoto(el, filename) {
    if (!filename) return;
    el.style.backgroundImage = 'url("' + PHOTO_DIR + encodeURIComponent(filename) + '")';
  }

  function makeParas(container, paras) {
    (paras || []).forEach((p) => {
      const el = document.createElement("p");
      el.className = "cs-p";
      el.textContent = p;
      container.appendChild(el);
    });
  }

  function makeList(container, items) {
    (items || []).forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      container.appendChild(li);
    });
  }

  function makeTable(container, headers, rows, statCol) {
    const table = document.createElement("table");
    table.className = "cs-table";
    const thead = document.createElement("tr");
    headers.forEach((h) => {
      const th = document.createElement("th");
      th.textContent = h;
      thead.appendChild(th);
    });
    table.appendChild(thead);
    rows.forEach((row) => {
      const tr = document.createElement("tr");
      row.forEach((cell, i) => {
        const td = document.createElement("td");
        td.textContent = cell;
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
  const descMeta = byId("csPageDescription");
  if (descMeta) descMeta.setAttribute("content", DATA.pageDescription);
  byId("csBack").setAttribute("href", DATA.backHref);

  text("csEyebrow", DATA.eyebrow);
  text("csTitle", DATA.title);
  text("csDek", DATA.dek);
  paintPhoto(byId("csHero"), DATA.heroPhoto);

  // --- Overview ------------------------------------------------------
  text("csOverviewHeading", DATA.overview.heading);
  const overviewEl = byId("csOverview");
  DATA.overview.items.forEach((item) => {
    const div = document.createElement("div");
    div.className = "cs-overview__item";
    const label = document.createElement("div");
    label.className = "cs-label";
    label.textContent = item.label;
    const value = document.createElement("div");
    value.className = "cs-p";
    value.textContent = item.value;
    div.append(label, value);
    overviewEl.appendChild(div);
  });

  // --- Research --------------------------------------------------------
  const r = DATA.research;
  text("csResearchHeading", r.heading);
  text("csFirstImpH3", r.firstImpression.h3);
  makeParas(byId("csFirstImpParas"), r.firstImpression.paras);

  text("csMethodsH3", r.methods.h3);
  makeTable(byId("csMethodsTable"), r.methods.tableHeaders, r.methods.tableRows);

  text("csProblemH3", r.problemQuantified.h3);
  text("csProblemIntro", r.problemQuantified.intro);
  text("csProblemConfidentialNote", r.problemQuantified.confidentialNote);
  makeList(byId("csProblemFindings"), r.problemQuantified.findings);

  text("csGoalsH3", r.projectGoals.h3);
  text("csGoalsIntro", r.projectGoals.intro);
  makeTable(byId("csGoalsTable"), r.projectGoals.tableHeaders, r.projectGoals.tableRows, 1);

  text("csResearchSummaryH3", r.summary.h3);
  makeParas(byId("csResearchSummaryParas"), r.summary.paras);

  // --- Finding the Right Solution ------------------------------------
  const f = DATA.solutionFinding;
  text("csFindingHeading", f.heading);
  text("csExplorationH3", f.exploration.h3);
  makeParas(byId("csExplorationParas"), f.exploration.paras);

  text("csIdeationH3", f.ideation.h3);
  makeParas(byId("csIdeationParas"), f.ideation.paras);

  const pathsEl = byId("csPaths");
  [f.ideation.pathA, f.ideation.pathB].forEach((path) => {
    const wrap = document.createElement("div");
    wrap.className = "cs-path";
    const h3 = document.createElement("h3");
    h3.className = "cs-h3";
    h3.textContent = path.title;
    const desc = document.createElement("p");
    desc.className = "cs-p";
    desc.textContent = path.desc;
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

  text("csReviewH3", f.review.h3);
  text("csReviewIntro", f.review.intro);
  makeTable(byId("csReviewTable"), f.review.tableHeaders, f.review.tableRows);
  makeParas(byId("csReviewParas"), f.review.paras);

  text("csProposalH3", f.proposal.h3);
  makeParas(byId("csProposalParas"), f.proposal.paras);
  const cardsEl = byId("csProposalCards");
  f.proposal.cards.forEach((card) => {
    const div = document.createElement("div");
    div.className = "cs-card";
    const label = document.createElement("div");
    label.className = "cs-label";
    label.textContent = card.label;
    const p = document.createElement("p");
    p.className = "cs-p";
    p.textContent = card.text;
    div.append(label, p);
    cardsEl.appendChild(div);
  });

  text("csFindingSummaryH3", f.summary.h3);
  makeParas(byId("csFindingSummaryParas"), f.summary.paras);

  // --- The Solution --------------------------------------------------
  const s = DATA.solution;
  text("csSolutionHeading", s.heading);
  text("csSolutionIntroH3", s.intro.h3);
  makeParas(byId("csSolutionIntroParas"), s.intro.paras);

  text("csDecisionsH3", s.decisions.h3);
  text("csDecisionsIntro", s.decisions.intro);
  makeTable(byId("csDecisionsTable"), s.decisions.tableHeaders, s.decisions.tableRows);

  text("csStepsH3", s.steps.h3);
  const stepsEl = byId("csSteps");
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
    action.append(actionStrong, document.createTextNode(step.action));
    const benefit = document.createElement("p");
    benefit.className = "cs-p";
    const benefitStrong = document.createElement("strong");
    benefitStrong.textContent = "Benefit: ";
    benefit.append(benefitStrong, document.createTextNode(step.benefit));
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

  const figmaEl = byId("csFigma");
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
  text("csResultsHeading", res.heading);
  text("csValidationH3", res.validation.h3);
  makeParas(byId("csValidationParas"), res.validation.paras);

  text("csImpactH3", res.impact.h3);
  makeTable(byId("csImpactTable"), res.impact.tableHeaders, res.impact.tableRows, 2);
  text("csImpactClosing", res.impact.closing);

  text("csQuotesH3", res.quotes.h3);
  text("csQuotesIntro", res.quotes.intro);
  const quoteGroupsEl = byId("csQuoteGroups");
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
      p.textContent = "“" + q + "”";
      quote.appendChild(p);
      grid.appendChild(quote);
    });
    wrap.append(label, grid);
    quoteGroupsEl.appendChild(wrap);
  });

  // --- Conclusion ------------------------------------------------------
  const c = DATA.conclusion;
  text("csConclusionHeading", c.heading);
  text("csConclusionH3", c.h3);
  text("csConclusionIntro", c.intro);
  const learningsEl = byId("csLearnings");
  c.rows.forEach((row) => {
    const rowEl = document.createElement("div");
    rowEl.className = "cs-learnings__row";
    const title = document.createElement("div");
    title.className = "cs-learnings__cell cs-learnings__title";
    title.textContent = row.title;
    const context = document.createElement("div");
    context.className = "cs-learnings__cell cs-learnings__context";
    context.textContent = row.context;
    const learning = document.createElement("div");
    learning.className = "cs-learnings__cell cs-learnings__learning";
    learning.textContent = row.learning;
    rowEl.append(title, context, learning);
    learningsEl.appendChild(rowEl);
  });
  text("csConclusionClosing", c.closing);

  // --- Footer ------------------------------------------------------
  text("csFootBack", DATA.footer.backLabel);
  byId("csFootBack").setAttribute("href", DATA.backHref);
  text("csFootSocials", DATA.footer.socialsLabel);
})();
