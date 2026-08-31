// Home-page-only rendering: the drawer ("What else I'm upto!"), the About
// card, the Experience card, the Profile card, and the hamburger nav
// overlay. Work Gallery rendering lives in js/gallery-render.js and the
// case-study sheet in js/case-sheet.js — both are shared with the All Case
// Studies page, so they run earlier in the script order (see index.html).

// Renders the drawer's rows from home-content-data.js. Runs before
// social-render.js (so its [data-social] rows get wired) and re-runs
// case-sheet.js's [data-case] wiring afterwards (so its case rows do too).
(() => {
  "use strict";

  const d = window.DRAWER;
  const nav = document.querySelector(".drawer");
  if (!d || !nav) return;

  nav.innerHTML = "";
  d.rows.forEach((row) => {
    const el = document.createElement(row.type === "page" ? "a" : row.type === "social" ? "a" : "button");
    el.className = "drawer__row";

    if (row.type === "page") {
      el.href = row.target;
    } else if (row.type === "social") {
      el.href = "#";
      el.dataset.social = row.target;
    } else if (row.type === "case") {
      el.dataset.case = row.target;
    }

    const label = document.createElement("span");
    label.textContent = row.label;
    const hint = document.createElement("span");
    hint.textContent = row.hint || "";
    el.append(label, hint);
    nav.appendChild(el);
  });

  if (d.foot) {
    const foot = document.createElement("div");
    foot.className = "drawer__foot";
    const left = document.createElement("span");
    left.textContent = d.foot.left;
    const right = document.createElement("span");
    right.textContent = d.foot.right;
    foot.append(left, right);
    nav.appendChild(foot);
  }

  if (window.wireCaseLinks) window.wireCaseLinks();
})();

// Renders the About card from the shared copy (see home-content-data.js).
(() => {
  "use strict";

  const a = window.ABOUT_CARD;
  const content = document.getElementById("aboutContent");
  const foot = document.getElementById("aboutFoot");
  if (!a || !content || !foot) return;

  const figureRow = document.createElement("div");
  figureRow.className = "about__figure-row";
  const figure = document.createElement("span");
  figure.className = "about__figure";
  figure.textContent = a.figure;
  const figureLabel = document.createElement("span");
  figureLabel.className = "about__figure-label";
  figureLabel.textContent = a.figureLabel;
  figureRow.append(figure, figureLabel);

  const bio = document.createElement("p");
  bio.className = "about__bio";
  bio.textContent = a.bio;

  content.append(figureRow, bio);

  const left = document.createElement("span");
  left.textContent = a.ctaLeft;
  const right = document.createElement("span");
  right.textContent = a.ctaRight;
  foot.append(left, right);
})();

// Renders the Experience card from the shared work-history data (see
// experience-data.js) so it always matches About's Track section.
(() => {
  "use strict";

  const body = document.getElementById("experienceBody");
  const count = document.getElementById("experienceCount");
  const foot = document.getElementById("experienceFoot");
  const jobs = window.EXPERIENCE;
  if (!body || !jobs) return;

  if (foot && window.EXPERIENCE_CARD) {
    const left = document.createElement("span");
    left.textContent = window.EXPERIENCE_CARD.footLeft;
    const right = document.createElement("span");
    right.textContent = window.EXPERIENCE_CARD.footRight;
    foot.append(left, right);
  }

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

// Renders the Mentoring card from the shared copy (see home-content-data.js).
(() => {
  "use strict";

  const m = window.MENTORING;
  const grid = document.getElementById("mentoringGrid");
  const note = document.getElementById("mentoringNote");
  const cta = document.getElementById("mentoringCta");
  if (!m || !grid || !note || !cta) return;

  (m.stats || []).forEach((stat, i) => {
    let row = grid.children[Math.floor(i / 2)];
    if (!row) {
      row = document.createElement("div");
      row.className = "stat-row";
      grid.appendChild(row);
    }
    const cell = document.createElement("div");
    cell.className = "stat";
    const figure = document.createElement("div");
    figure.className = "stat__figure" + (stat.accent ? " stat__figure--accent" : "");
    figure.textContent = stat.value;
    const label = document.createElement("div");
    label.className = "stat__label";
    label.textContent = stat.label;
    cell.append(figure, label);
    row.appendChild(cell);
  });

  const noteLeft = document.createElement("span");
  noteLeft.textContent = m.noteLeft;
  const noteRight = document.createElement("span");
  noteRight.textContent = m.noteRight;
  note.append(noteLeft, noteRight);

  const ctaLeft = document.createElement("span");
  ctaLeft.textContent = m.ctaLeft;
  const ctaRight = document.createElement("span");
  ctaRight.textContent = m.ctaRight;
  cta.append(ctaLeft, ctaRight);
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
