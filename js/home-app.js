// Home page v3 rendering + interactions — replaces the old main.js /
// gallery-render.js / contact-popup.js / settings-sheet.js combo for
// index.html only (none of those files are included here any more; other
// pages that still use them are untouched). Reads the same shared data
// files (window.PROFILE, WORK_GALLERY, EXPERIENCE, MENTORING, DRAWER,
// SOCIALS) so content and destinations stay identical to the rest of the
// site — only the markup/visuals are new. Work-gallery cards still get a
// data-case attribute and are wired via window.wireCaseLinks() (from
// js/case-sheet.js, loaded before this file), so clicking one opens the
// exact same shared case-study sheet as case-studies.html uses. Social
// rows use data-social so js/social-render.js (loaded after this file)
// wires their real hrefs.
(() => {
  "use strict";

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  // ---------------- Profile ----------------
  (() => {
    const p = window.PROFILE;
    if (!p) return;

    document.querySelectorAll("#hpEyebrow, #hpMobEyebrow").forEach((n) => { n.textContent = p.eyebrow; });
    document.querySelectorAll("#hpHeadline, #hpMobHeadline").forEach((n) => { n.textContent = p.headline; });
    const bio = document.getElementById("hpBio");
    if (bio) bio.textContent = p.bio;

    document.querySelectorAll("#hpTags, #hpMobTags").forEach((wrap) => {
      wrap.innerHTML = "";
      (p.tags || []).forEach((t) => wrap.appendChild(el("span", "hp-tag", t)));
    });

    const foot = document.getElementById("hpProfileFoot");
    if (foot) {
      foot.appendChild(el("span", null, p.footLeft));
      const right = el("b", null, p.footRight);
      foot.appendChild(right);
    }
  })();

  // ---------------- Mobile quick-fact strip ----------------
  (() => {
    const stats = document.getElementById("hpMobStats");
    if (!stats) return;
    const years = ((window.EXPERIENCE_CARD && window.EXPERIENCE_CARD.footRight) || "").replace(/\D/g, "") || "—";
    const roles = window.EXPERIENCE ? String(window.EXPERIENCE.length).padStart(2, "0") : "—";
    const minutes = (window.MENTORING && window.MENTORING.stats && window.MENTORING.stats[0] && window.MENTORING.stats[0].value) || "—";
    [
      [years, "Years exp."],
      [roles, "Roles held"],
      [minutes, "Min. mentored"]
    ].forEach(([value, label]) => {
      const stat = el("div", "hp-mob-stat");
      stat.append(el("div", "hp-mob-stat__value", value), el("div", "hp-mob-stat__label", label));
      stats.appendChild(stat);
    });
  })();

  // ---------------- Work gallery ----------------
  function renderMetric(container, card) {
    if (card.metricUnit) {
      const wrap = el("div", "hp-work-card__stat hp-work-card__stat--accent");
      wrap.append(card.metric, el("span", "hp-work-card__stat-unit", card.metricUnit));
      container.appendChild(wrap);
      return;
    }
    if (String(card.metric).includes("→")) {
      const parts = String(card.metric).split("→").map((s) => s.trim());
      const wrap = el("div", "hp-work-card__stat");
      wrap.append(parts[0], el("span", "hp-work-card__stat-arrow", "→"), parts[1]);
      container.appendChild(wrap);
      return;
    }
    container.appendChild(el("div", "hp-work-card__stat hp-work-card__stat--accent", card.metric));
  }

  function buildWorkCard(card, variant) {
    // variant: "desktop" (full card, opens the case sheet) | "mobile-latest" |
    // "mobile-list" (both similar to desktop's card but flat, no ink-swap hover)
    const isCompact = variant !== "desktop";
    const a = document.createElement("a");
    a.href = "#";
    a.dataset.case = card.id;
    a.setAttribute("aria-haspopup", "dialog");
    a.className = isCompact ? "hp-mob-work-card" : "hp-work-card" + (card.variant === 2 ? " hp-work-card--accent" : "");

    const tab = el(isCompact ? "div" : "div", isCompact ? "hp-mob-work-card__tab" : "hp-work-card__tab", card.tab);
    a.appendChild(tab);

    if (isCompact) {
      const stat = el("div", "hp-mob-work-card__stat");
      if (card.metricUnit) {
        stat.append(card.metric, el("span", "hp-mob-work-card__stat-unit", card.metricUnit));
      } else if (String(card.metric).includes("→")) {
        const parts = String(card.metric).split("→").map((s) => s.trim());
        stat.append(parts[0], el("span", "hp-mob-work-card__stat-arrow", "→"), parts[1]);
      } else {
        stat.textContent = card.metric;
      }
      a.appendChild(stat);
    } else {
      renderMetric(a, card);
    }

    a.appendChild(el("div", isCompact ? "hp-mob-work-card__caption" : "hp-work-card__caption", card.metricCaption));
    a.appendChild(el("div", (isCompact ? "hp-mob-work-card__divider" : "hp-work-card__divider") + " hp-divider"));

    const table = el("div", isCompact ? "hp-mob-work-card__table" : "hp-work-card__table");
    (card.comparisons || []).forEach((c) => {
      const row = el("div", isCompact ? "hp-mob-work-card__table-row" : "hp-work-card__table-row");
      row.appendChild(el("span", "hp-work-card__table-label", c.label));
      const value = el("span");
      value.append(c.from + " → ", el("b", null, c.to));
      row.appendChild(value);
      table.appendChild(row);
    });
    a.appendChild(table);

    if (!isCompact) {
      const result = el("div", "hp-work-card__result");
      result.append(el("b", null, "Result: "), card.note);
      a.appendChild(result);
      a.appendChild(el("div", "hp-divider"));
    }

    const foot = el("div", isCompact ? "hp-mob-work-card__foot" : "hp-work-card__foot");
    foot.append(el("span", null, card.cta), el("span", null, "→"));
    a.appendChild(foot);

    return a;
  }

  (() => {
    const g = window.WORK_GALLERY;
    if (!g) return;

    document.querySelectorAll("#hpGalleryCount").forEach((n) => { n.textContent = String(g.cards.length).padStart(2, "0"); });

    const desktopWrap = document.getElementById("hpGallery");
    if (desktopWrap) g.cards.forEach((card) => desktopWrap.appendChild(buildWorkCard(card, "desktop")));

    const mobListWrap = document.getElementById("hpMobWorkList");
    if (mobListWrap) g.cards.forEach((card) => mobListWrap.appendChild(buildWorkCard(card, "mobile-list")));

    const latestWrap = document.getElementById("hpMobLatestWork");
    if (latestWrap && g.cards.length) latestWrap.appendChild(buildWorkCard(g.cards[0], "mobile-latest"));
  })();

  // ---------------- Experience ----------------
  function buildExpRow(job, mobile) {
    if (mobile) {
      const item = el("div", "hp-mob-exp-item");
      const row = el("div", "hp-exp-role-row");
      row.append(el("span", "hp-exp-org", job.org), el("span", "hp-exp-span", job.when));
      item.append(row, el("div", "hp-exp-role", job.role));
      return item;
    }
    const row = el("div", "hp-exp-row");
    const rail = el("div", "hp-exp-rail");
    rail.appendChild(el("span", "hp-exp-dot" + (job.current ? " hp-exp-dot--current" : "")));
    row.appendChild(rail);
    const meta = el("div", "hp-exp-meta");
    meta.appendChild(el("span", "hp-exp-org", job.org));
    const roleRow = el("div", "hp-exp-role-row");
    roleRow.append(el("span", "hp-exp-role", job.role), el("span", "hp-exp-span", job.when));
    meta.appendChild(roleRow);
    row.appendChild(meta);
    return { row, rail };
  }

  (() => {
    const jobs = window.EXPERIENCE;
    if (!jobs) return;

    document.querySelectorAll("#hpExperienceYrs").forEach((n) => {
      n.textContent = (window.EXPERIENCE_CARD && window.EXPERIENCE_CARD.footRight) || "";
    });

    const list = document.getElementById("hpExperienceList");
    if (list) {
      jobs.forEach((job, i) => {
        const { row, rail } = buildExpRow(job, false);
        if (i < jobs.length - 1) rail.appendChild(el("span", "hp-exp-line"));
        list.appendChild(row);
      });
    }

    const mobList = document.getElementById("hpMobExpList");
    if (mobList) jobs.forEach((job) => mobList.appendChild(buildExpRow(job, true)));
  })();

  // ---------------- Mentoring ----------------
  function buildMentoringStat(stat) {
    const wrap = el("div", "hp-mstat");
    wrap.appendChild(el("div", "hp-mstat__value" + (stat.accent ? " hp-mstat__value--accent" : ""), stat.value));
    wrap.appendChild(el("div", "hp-mstat__label", stat.label));
    return wrap;
  }

  (() => {
    const m = window.MENTORING;
    if (!m) return;

    document.querySelectorAll("#hpMentoringGrid, #hpMobMentoringGrid").forEach((grid) => {
      (m.stats || []).forEach((stat) => grid.appendChild(buildMentoringStat(stat)));
    });

    const cta = document.getElementById("hpMentoringCta");
    if (cta) cta.append(el("span", null, m.ctaLeft), el("span", null, m.ctaRight));
  })();

  // ---------------- "What else I'm upto" nav rows ----------------
  function buildNavRow(row) {
    const tag = row.type === "settings" ? "button" : "a";
    const node = document.createElement(tag);
    node.className = "hp-nav-row" + (row.desktopOnly ? " hp-nav-row--desktop-only" : "");

    if (row.type === "page") {
      node.href = row.target;
      if (/^https?:/i.test(row.target)) { node.target = "_blank"; node.rel = "noopener noreferrer"; }
    } else if (row.type === "social") {
      node.href = "#";
      node.dataset.social = row.target;
    } else if (row.type === "case") {
      node.href = "#";
      node.dataset.case = row.target;
    } else if (row.type === "settings") {
      node.type = "button";
      node.addEventListener("click", () => openSettingsPopup(node));
    }

    node.appendChild(el("span", null, row.label));
    node.appendChild(el("span", "hp-nav-row__hint", row.hint || ""));
    return node;
  }

  (() => {
    const d = window.DRAWER;
    if (!d) return;
    const desktopWrap = document.getElementById("hpNavList");
    if (desktopWrap) d.rows.forEach((row) => desktopWrap.appendChild(buildNavRow(row)));
    const mobileWrap = document.getElementById("hpMobNavList");
    if (mobileWrap) {
      // "About Me" (desktopOnly) is covered on mobile by the profile photo's
      // own link + the header's "Person behind this!" — skip it here so it
      // isn't listed twice.
      d.rows.filter((row) => !row.desktopOnly).forEach((row) => mobileWrap.appendChild(buildNavRow(row)));
    }
  })();

  // ---------------- Case-study links ----------------
  if (window.wireCaseLinks) window.wireCaseLinks();

  // ---------------- Music ----------------
  function syncMusicUI() {
    const playing = !!(window.backgroundMusic && window.backgroundMusic.isPlaying());
    const rowLabel = document.getElementById("hpMusicRowLabel");
    if (rowLabel) rowLabel.textContent = playing ? "Playing music" : "Play music";
    const musicRow = document.getElementById("hpMusicRow");
    if (musicRow) musicRow.classList.toggle("is-active", playing);
    const mobBtn = document.getElementById("hpMobMusic");
    if (mobBtn) mobBtn.classList.toggle("is-active", playing);
    const settingsHint = document.getElementById("hpSettingsMusicHint");
    if (settingsHint) settingsHint.textContent = playing ? "Currently playing" : "Paused";
  }

  function toggleMusic() {
    if (window.backgroundMusic) window.backgroundMusic.toggle();
  }

  const musicRow = document.getElementById("hpMusicRow");
  if (musicRow) musicRow.addEventListener("click", toggleMusic);
  const mobMusic = document.getElementById("hpMobMusic");
  if (mobMusic) mobMusic.addEventListener("click", toggleMusic);
  window.addEventListener("bgm:change", syncMusicUI);
  syncMusicUI();

  // ---------------- Overlay open/close transition helpers ----------------
  // [hidden] maps to display:none, which can't be transitioned — so opening
  // removes [hidden] first, forces a layout flush (so the browser registers
  // that pre-transition state), then adds .is-open to trigger the CSS fade;
  // closing removes .is-open to trigger the reverse fade and only restores
  // [hidden] once that transition has actually finished playing.
  const OVERLAY_TRANSITION_MS = 220;

  function openOverlay(overlay, focusEl) {
    if (!overlay) return;
    window.clearTimeout(overlay._hpHideTimer);
    overlay.hidden = false;
    void overlay.offsetWidth;
    overlay.classList.add("is-open");
    if (focusEl) requestAnimationFrame(() => focusEl.focus());
  }

  function closeOverlay(overlay) {
    if (!overlay || !overlay.classList.contains("is-open")) return;
    overlay.classList.remove("is-open");
    overlay._hpHideTimer = window.setTimeout(() => { overlay.hidden = true; }, OVERLAY_TRANSITION_MS);
  }

  // ---------------- Let's connect popup ----------------
  const connectOverlay = document.getElementById("hpConnectOverlay");
  const connectClose = document.getElementById("hpConnectClose");
  let connectLastTrigger = null;

  function openConnectPopup(trigger) {
    connectLastTrigger = trigger || null;
    openOverlay(connectOverlay, connectClose);
  }
  function closeConnectPopup() {
    if (!connectOverlay || !connectOverlay.classList.contains("is-open")) return;
    closeOverlay(connectOverlay);
    if (connectLastTrigger && connectLastTrigger.isConnected) connectLastTrigger.focus();
    connectLastTrigger = null;
  }

  document.querySelectorAll("[data-open-connect]").forEach((btn) => {
    btn.addEventListener("click", () => openConnectPopup(btn));
  });
  if (connectClose) connectClose.addEventListener("click", closeConnectPopup);
  if (connectOverlay) {
    connectOverlay.addEventListener("click", (e) => { if (e.target === connectOverlay) closeConnectPopup(); });
  }

  // ---------------- Settings & consent popup ----------------
  const settingsOverlay = document.getElementById("hpSettingsOverlay");
  const settingsClose = document.getElementById("hpSettingsClose");
  const cookieRow = document.getElementById("hpSettingsCookieRow");
  let settingsLastTrigger = null;

  function openSettingsPopup(trigger) {
    settingsLastTrigger = trigger || null;
    syncMusicUI();
    openOverlay(settingsOverlay, settingsClose);
  }
  function closeSettingsPopup() {
    if (!settingsOverlay || !settingsOverlay.classList.contains("is-open")) return;
    closeOverlay(settingsOverlay);
    if (settingsLastTrigger && settingsLastTrigger.isConnected) settingsLastTrigger.focus();
    settingsLastTrigger = null;
  }

  const settingsMusicRow = document.getElementById("hpSettingsMusicRow");
  if (settingsMusicRow) settingsMusicRow.addEventListener("click", toggleMusic);
  if (cookieRow) {
    cookieRow.addEventListener("click", () => {
      closeSettingsPopup();
      if (window.showCookieConsent) window.showCookieConsent();
    });
  }
  if (settingsClose) settingsClose.addEventListener("click", closeSettingsPopup);
  if (settingsOverlay) {
    settingsOverlay.addEventListener("click", (e) => { if (e.target === settingsOverlay) closeSettingsPopup(); });
  }

  window.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    closeConnectPopup();
    closeSettingsPopup();
  });

  // ---------------- Mobile tab switching ----------------
  (() => {
    const tabs = document.querySelectorAll(".hp-mob-tab");
    const panels = document.querySelectorAll("[data-tab-panel]");
    if (!tabs.length) return;

    function showTab(name) {
      tabs.forEach((t) => t.classList.toggle("is-active", t.dataset.tab === name));
      panels.forEach((p) => { p.hidden = p.dataset.tabPanel !== name; });
    }

    tabs.forEach((t) => t.addEventListener("click", () => showTab(t.dataset.tab)));
    document.querySelectorAll("[data-switch-tab]").forEach((btn) => {
      btn.addEventListener("click", () => showTab(btn.dataset.switchTab));
    });
  })();
})();
