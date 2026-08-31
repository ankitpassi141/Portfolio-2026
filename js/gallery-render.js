// Renders Work Gallery folder cards — metric (+ optional unit), a 2-line
// caption, a before → after comparison table, a short methodology note,
// and a CTA — from home-content-data.js. Runs into every container marked
// .js-work-gallery, so both the Home page's Work Gallery and the All Case
// Studies page render from the exact same data and markup. Must run before
// js/case-sheet.js, since that's what wires up the data-case attributes
// this creates.
(() => {
  "use strict";

  const g = window.WORK_GALLERY;
  const targets = document.querySelectorAll(".js-work-gallery");
  if (!g || !targets.length) return;

  targets.forEach((wrap) => {
    wrap.innerHTML = "";
    g.cards.forEach((card) => {
      const a = document.createElement("a");
      a.className = "folder folder--" + card.variant + (card.variant === 2 ? " folder--ink" : "");
      a.dataset.case = card.id;
      a.href = "#";
      a.setAttribute("aria-haspopup", "dialog");

      const tabRow = document.createElement("div");
      tabRow.className = "folder__tab-row";
      const tab = document.createElement("span");
      tab.className = "folder__tab";
      const tabInner = document.createElement("span");
      tabInner.textContent = card.tab;
      tab.appendChild(tabInner);
      tabRow.appendChild(tab);

      const body = document.createElement("div");
      body.className = "folder__body";

      const content = document.createElement("div");
      content.className = "folder__content";

      const metricRow = document.createElement("div");
      metricRow.className = "folder__metric-row";
      const metric = document.createElement("div");
      metric.className = "figure--feature";
      metric.textContent = card.metric;
      metricRow.appendChild(metric);
      if (card.metricUnit) {
        const unit = document.createElement("span");
        unit.className = "figure__unit";
        unit.textContent = card.metricUnit;
        metricRow.appendChild(unit);
      }

      const caption = document.createElement("div");
      caption.className = "figure__caption";
      caption.textContent = card.metricCaption;

      const table = document.createElement("div");
      table.className = "folder__table";
      (card.comparisons || []).forEach((c) => {
        const row = document.createElement("div");
        row.className = "folder__table-row";

        const label = document.createElement("span");
        label.className = "folder__table-label";
        label.textContent = c.label;

        const value = document.createElement("span");
        const from = document.createElement("span");
        from.className = "folder__table-from";
        from.textContent = c.from;
        const to = document.createElement("span");
        to.className = "folder__table-to";
        to.textContent = c.to;
        value.append(from, " → ", to);

        row.append(label, value);
        table.appendChild(row);
      });

      const note = document.createElement("p");
      note.className = "folder__note";
      note.textContent = card.note;

      content.append(metricRow, caption, table, note);

      const foot = document.createElement("div");
      foot.className = "folder__foot";
      const ctaLeft = document.createElement("span");
      ctaLeft.textContent = card.cta;
      const ctaRight = document.createElement("span");
      ctaRight.textContent = "→";
      foot.append(ctaLeft, ctaRight);

      body.append(content, foot);
      a.append(tabRow, body);
      wrap.appendChild(a);
    });
  });

  document.querySelectorAll("[data-gallery-count]").forEach((el) => {
    el.textContent = String(g.cards.length).padStart(2, "0");
  });
})();
