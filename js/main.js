// Renders the Work Gallery cards from home-content-data.js. This runs
// first, before the case-study click wiring below, since these cards
// carry the data-case attributes that wiring depends on existing already.
(() => {
  "use strict";

  const g = window.WORK_GALLERY;
  const wrap = document.getElementById("galleryFolders");
  const count = document.getElementById("galleryCount");
  if (!g || !wrap) return;

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

  if (count) count.textContent = String(g.cards.length).padStart(2, "0");
})();

(() => {
  "use strict";

  const CASES = {
    "one-plan": {
      title: "One Plan",
      kicker: "0→1 · discovery, architecture, POC",
      headline: "One plan, from blank document to working tool",
      meta: [
        { label: "Role", value: "Lead product designer" },
        { label: "Span", value: "2025 — 2026" },
        { label: "Scope", value: "Research → IA → POC" },
        { label: "Team", value: "2 eng · 1 PM" }
      ],
      sections: [
        { h4: "The problem", paras: ["Planning happened in four places at once: a deck for leadership, a spreadsheet for dates, a tracker for work, and a document nobody had opened since kickoff. Nothing agreed with anything else, and the disagreement only surfaced at review."] },
        { h4: "What I did", paras: ["Fourteen interviews across three functions, then a single object model: a plan is a set of gated phases, each holding decisions rather than tasks."], items: ["Mapped every artefact in use and cut the ones that only existed to reassure someone", "Built three architecture models and tested them as paper walkthroughs before any UI", "Shipped a working proof of concept — a real plan a real team ran a quarter on"] },
        { h4: "The hard part", paras: ["Gates are political. A tool that makes a stalled phase visible also makes an owner visible, and the first pilot team quietly stopped updating the plan once that became true. The POC design does not solve this; it just stops hiding it.", "Still open: whether the object model survives a portfolio of forty plans, and who owns the gate definitions once the tool leaves the pilot."] }
      ]
    },
    "ib-engine": {
      title: "IB Engine",
      kicker: "Enterprise product · investor board workflows",
      headline: "Cutting board sign-off from eleven days to four",
      meta: [
        { label: "Role", value: "Product designer" },
        { label: "Span", value: "2025 — 2026" },
        { label: "Surface", value: "Web, internal" },
        { label: "Users", value: "Investment committee" }
      ],
      sections: [
        { h4: "The problem", paras: ["Board packets were assembled by hand, routed over email, and approved in whatever order people happened to read them. The median time from packet ready to signed decision was eleven working days, and nobody could say where it went."] },
        { h4: "What I did", paras: ["Instrumented the existing path first, then designed the routing as a visible queue rather than a set of notifications."], items: ["One packet object with a status that everyone reads the same way", "Approvals routed in parallel where policy allows it, sequential only where it does not", "A director-level view that shows the blocking step, not a progress percentage"] },
        { h4: "The hard part", paras: ["The four-day figure comes from the first two quarters after rollout and covers packets that entered the new flow cleanly. Exceptions — anything needing legal — still take as long as they ever did, and they are roughly a fifth of volume.", "Unresolved: whether making the blocking step public speeds decisions or just moves the pressure onto whoever is named."] }
      ]
    },
    "migration": {
      title: "Migration",
      kicker: "In-product guidance layer · vendor change",
      headline: "Moving a guidance layer, and writing down what was lost",
      meta: [
        { label: "Role", value: "Design + documentation lead" },
        { label: "Span", value: "2025" },
        { label: "Output", value: "Tracker · config · brief" },
        { label: "Surface", value: "Whole product" }
      ],
      sections: [
        { h4: "The problem", paras: ["Every tooltip, walkthrough and empty-state hint in the product sat inside one vendor's layer. The contract ended. The replacement was chosen before anyone audited what the old one was actually doing."] },
        { h4: "What I did", paras: ["Built the audit that should have existed first: every flow, its trigger, its owner, and whether anyone had touched it in a year."], items: ["A migration tracker the whole team wrote into, not a status report I maintained alone", "Configuration patterns so guidance stopped being authored ad hoc", "A director brief stating plainly which capabilities did not survive the move"] },
        { h4: "The hard part", paras: ["The brief was the uncomfortable deliverable. Two of the flows the business cared most about could not be rebuilt in the new layer, and the honest recommendation was to move them into the product itself rather than fake them.", "Open: roughly a third of the migrated flows have no owner, and unowned guidance goes stale invisibly."] }
      ]
    },
    "ux-mind": {
      title: "UX Mind",
      kicker: "Side project · free research tool",
      headline: "Pick the right method, in under a minute",
      meta: [
        { label: "Role", value: "Design + build" },
        { label: "Span", value: "2024 — now" },
        { label: "Cost", value: "Free" },
        { label: "Launch", value: "Product Hunt" }
      ],
      sections: [
        { h4: "The problem", paras: ["Method choice is where most junior research goes wrong. The available references are either academic taxonomies or listicles, and neither answers the actual question: given this goal, this timeline and these constraints, what should I run on Monday?"] },
        { h4: "What I did", paras: ["Three inputs, one recommendation, and the reasoning shown rather than hidden."], items: ["Goal, timeline and access as the only inputs — no account, no onboarding", "Every recommendation states what it will not tell you", "A second-choice method, because the first is often blocked by access"] },
        { h4: "The hard part", paras: ["A recommender flattens judgement. People take the output as permission to skip the thinking, so the interface has to argue with itself — showing limits alongside the answer, which measurably reduces how often people click through.", "Open question: whether it should refuse to answer when the inputs are contradictory."] }
      ]
    },
    "images": {
      title: "Images & Photos",
      kicker: "Process shots · whiteboards · film",
      headline: "The unedited half of the work",
      meta: [
        { label: "Count", value: "24 frames" },
        { label: "Subjects", value: "Walls, sketches" },
        { label: "Camera", value: "Phone, mostly" },
        { label: "Updated", value: "Monthly" }
      ],
      sections: [
        { h4: "What it is", paras: ["Whiteboards mid-argument, paper walkthroughs, the wall of a workshop before anyone cleaned it up. Kept because the tidy artefact never shows how a decision was actually reached."] },
        { h4: "The hard part", paras: ["Most of it cannot be shown — client material, real names, real numbers. What is left skews towards the photogenic rather than the important."] }
      ]
    },
    "writing": {
      title: "Writing",
      kicker: "Essays · Medium",
      headline: "Notes on designing tools that decide things",
      meta: [
        { label: "Where", value: "Medium" },
        { label: "Cadence", value: "Irregular" },
        { label: "Subjects", value: "Enterprise UX" },
        { label: "Length", value: "1500 words" }
      ],
      sections: [
        { h4: "What it is", paras: ["Short pieces on the parts of enterprise design that are rarely written about: governance surfaces, approval flows, and what happens to a design when the person using it is accountable for the outcome."] },
        { h4: "The hard part", paras: ["Most of the interesting material is not publishable. What survives the edit tends to be the general lesson rather than the specific case, which is the weaker half."] }
      ],
      link: "medium"
    },
    "workshops": {
      title: "Workshops & Mentoring",
      kicker: "Teaching · 1:1 and group",
      headline: "Teaching method selection and critique",
      meta: [
        { label: "Format", value: "Half-day + 1:1" },
        { label: "Since", value: "2022" },
        { label: "Sessions", value: "42 · 1:1" },
        { label: "Workshops", value: "06 run" }
      ],
      sections: [
        { h4: "What it is", paras: ["Sessions on choosing a research method and on running a critique that produces decisions rather than opinions. Run internally, and for design communities in Delhi."] },
        { h4: "The hard part", paras: ["A half-day changes vocabulary, not behaviour. The follow-up 1:1s are where anything actually shifts, and they do not scale."] }
      ],
      link: "adplist"
    }
  };

  const sheet = document.getElementById("sheet");
  const sheetTitle = document.getElementById("sheetTitle");
  const sheetKicker = document.getElementById("sheetKicker");
  const sheetHeadline = document.getElementById("sheetHeadline");
  const sheetMeta = document.getElementById("sheetMeta");
  const sheetSections = document.getElementById("sheetSections");
  const sheetClose = document.getElementById("sheetClose");

  let lastTrigger = null;

  function renderCase(id) {
    const c = CASES[id];
    if (!c) return false;
    sheetTitle.textContent = c.title;
    sheetKicker.textContent = c.kicker;
    sheetHeadline.textContent = c.headline;

    sheetMeta.innerHTML = "";
    c.meta.forEach((m) => {
      const cell = document.createElement("div");
      cell.className = "sheet__meta-cell";
      cell.innerHTML = `<span class="sheet__meta-label">${m.label}</span><span class="sheet__meta-value">${m.value}</span>`;
      sheetMeta.appendChild(cell);
    });

    sheetSections.innerHTML = "";
    sheetSections.style.display = "flex";
    sheetSections.style.flexDirection = "column";
    sheetSections.style.gap = "20px";
    c.sections.forEach((sec) => {
      const wrap = document.createElement("div");
      wrap.className = "sheet__section";
      const h4 = document.createElement("h4");
      h4.textContent = sec.h4;
      wrap.appendChild(h4);
      (sec.paras || []).forEach((p) => {
        const el = document.createElement("p");
        el.textContent = p;
        wrap.appendChild(el);
      });
      (sec.items || []).forEach((it) => {
        const el = document.createElement("div");
        el.className = "sheet__item";
        const span = document.createElement("span");
        span.textContent = it;
        el.appendChild(span);
        wrap.appendChild(el);
      });
      sheetSections.appendChild(wrap);
    });

    if (c.link && window.SOCIALS && window.SOCIALS[c.link]) {
      const entry = window.SOCIALS[c.link];
      const cta = document.createElement("a");
      cta.className = "sheet__cta";
      cta.href = entry.url;
      cta.textContent = `Visit ${entry.label} →`;
      if (/^https?:/i.test(entry.url)) {
        cta.target = "_blank";
        cta.rel = "noopener noreferrer";
      }
      sheetSections.appendChild(cta);
    }
    return true;
  }

  // If case-studies-data.js has a real URL for this card, that takes over
  // from the in-page write-up entirely — see js/case-studies-data.js.
  function externalCaseUrl(id) {
    const cs = window.CASE_STUDIES && window.CASE_STUDIES[id];
    return cs && cs.url && cs.url !== "#" ? cs.url : null;
  }

  function openCase(id, trigger) {
    if (!renderCase(id)) return;
    lastTrigger = trigger || null;
    sheet.hidden = false;
    if (location.hash !== "#/" + id) history.pushState(null, "", "#/" + id);
    requestAnimationFrame(() => sheetClose.focus());
  }

  function closeCase() {
    if (!sheet.hidden) {
      sheet.hidden = true;
      if (location.hash) history.pushState(null, "", location.pathname + location.search);
      if (lastTrigger && lastTrigger.isConnected) lastTrigger.focus();
      lastTrigger = null;
    }
  }

  function syncFromHash() {
    const m = (location.hash || "").match(/^#\/(.+)$/);
    if (m && CASES[m[1]]) {
      const url = externalCaseUrl(m[1]);
      if (url) { location.replace(url); return; }
      renderCase(m[1]);
      sheet.hidden = false;
    } else {
      sheet.hidden = true;
    }
  }

  document.querySelectorAll("[data-case]").forEach((el) => {
    const id = el.dataset.case;
    const url = externalCaseUrl(id);
    if (url) {
      // A real link is set — wire it up and skip the sheet entirely so
      // Ctrl/middle-click "open in new tab" works natively, no JS needed.
      el.href = url;
      el.target = "_blank";
      el.rel = "noopener noreferrer";
      return;
    }
    el.addEventListener("click", (e) => {
      e.preventDefault();
      openCase(id, el);
    });
  });

  sheetClose.addEventListener("click", closeCase);
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !sheet.hidden) closeCase();
  });
  window.addEventListener("hashchange", syncFromHash);
  syncFromHash();
})();

// Renders the Experience card from the shared work-history data (see
// experience-data.js) so it always matches About's Track section.
(() => {
  "use strict";

  const body = document.getElementById("experienceBody");
  const count = document.getElementById("experienceCount");
  const jobs = window.EXPERIENCE;
  if (!body || !jobs) return;

  body.innerHTML = "";
  jobs.forEach((job) => {
    const row = document.createElement("div");
    row.className = "experience__row";

    const dot = document.createElement("span");
    dot.className = "experience__dot" + (job.current ? " experience__dot--current" : "");

    const meta = document.createElement("span");
    meta.className = "experience__meta";

    const org = document.createElement("span");
    org.className = "experience__org";
    org.textContent = job.org;

    const role = document.createElement("span");
    role.className = "experience__role";
    role.textContent = job.role;

    const span = document.createElement("span");
    span.className = "experience__span";
    span.textContent = job.when;

    meta.append(org, role, span);
    row.append(dot, meta);
    body.appendChild(row);
  });

  if (count) {
    const n = String(jobs.length).padStart(2, "0");
    count.textContent = `${n} role${jobs.length === 1 ? "" : "s"}`;
  }
})();

// Renders the Profile card from the shared copy (see home-content-data.js).
(() => {
  "use strict";

  const p = window.PROFILE;
  const body = document.getElementById("profileBody");
  const foot = document.getElementById("profileFoot");
  if (!p || !body || !foot) return;

  const eyebrow = document.createElement("div");
  eyebrow.className = "profile__eyebrow";
  eyebrow.textContent = p.eyebrow;

  const headline = document.createElement("div");
  headline.className = "profile__headline";
  headline.textContent = p.headline;

  const bio = document.createElement("p");
  bio.className = "profile__bio";
  bio.textContent = p.bio;

  const tags = document.createElement("div");
  tags.className = "profile__tags";
  (p.tags || []).forEach((t) => {
    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = t;
    tags.appendChild(tag);
  });

  body.append(eyebrow, headline, bio, tags);

  const left = document.createElement("span");
  left.textContent = p.footLeft;
  const right = document.createElement("span");
  right.textContent = p.footRight;
  foot.append(left, right);
})();

// Below 1280px the nav card (What else I'm upto!) leaves the page flow and
// becomes a hamburger-triggered overlay — see the <1280px rules in
// style.css. Above that width the hamburger is hidden and this is inert.
(() => {
  "use strict";

  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("navCard");
  const closeBtn = document.getElementById("navClose");
  if (!toggle || !nav) return;

  let lastFocus = null;

  function openNav() {
    lastFocus = document.activeElement;
    nav.hidden = false;
    document.body.classList.add("nav-open");
    toggle.setAttribute("aria-expanded", "true");
    requestAnimationFrame(() => (closeBtn || nav).focus());
  }

  function closeNav() {
    if (nav.hidden) return;
    nav.hidden = true;
    document.body.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
    if (lastFocus && lastFocus.isConnected) lastFocus.focus();
    lastFocus = null;
  }

  toggle.addEventListener("click", () => {
    if (nav.hidden) openNav(); else closeNav();
  });
  if (closeBtn) closeBtn.addEventListener("click", closeNav);
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !nav.hidden) closeNav();
  });
  // Resizing past the breakpoint while open would otherwise strand it
  // hidden-but-still-"open" from the toggle's point of view.
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1280 && !nav.hidden) closeNav();
  });
})();
