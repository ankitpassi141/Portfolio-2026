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

  // ---------------- Lab tile (latest experiment) ----------------
  // One tile in the desktop/tablet column (#hpLab) and one at the top of the
  // mobile "What else?" tab (#hpMobLab). Both share the same index, so the
  // ← / → buttons on either keep them in step. Data: window.LAB.
  (() => {
    const lab = window.LAB;
    const list = lab && lab.experiments;
    if (!list || !list.length) return;

    const total = (window.EXPERIMENTS && window.EXPERIMENTS.projects && window.EXPERIMENTS.projects.length) || list.length;
    const allHref = lab.allHref || "experiments.html";
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tiles = [];
    let index = 0;

    // An entry with a `live` page runs that app itself in the preview (in a
    // frame, in embed mode — see js/embed-guard.js). That's a real WebGL
    // scene, so only attempt it where it's reasonable: not under reduced
    // motion or data-saver, not on very low-end devices, and only with WebGL.
    // Anywhere it isn't possible the thumbnail (or video) shows instead.
    // Auto-advance: every AUTO_MS the tile moves to the next experiment. The
    // clock only runs while an entry is genuinely showing — not while a live
    // app is still loading — and a manual ←/→ restarts it. It pauses while
    // the pointer is over the tile or a keyboard user has focus in it, while
    // the tile is off screen or the tab hidden, and never runs under reduced
    // motion.
    const AUTO_MS = 10000;
    let autoTimer = 0;
    let autoPaused = false;
    function scheduleAuto() {
      clearTimeout(autoTimer);
      if (reduceMotion || autoPaused || list.length < 2 || document.visibilityState !== "visible") return;
      const showing = tiles.filter((t) => t.visible);
      if (!showing.length) return;
      const loading = showing.some((t) => t.liveSrc && !t.liveFailed && !(t.frame && t.frame.classList.contains("is-ready")));
      if (loading) return;
      autoTimer = setTimeout(() => step(1), AUTO_MS);
    }

    // (No CPU-core-count check: Safari/iOS reports that number unreliably,
    // and it wrongly ruled out capable iPhones.)
    const canRunLive = (() => {
      if (reduceMotion) return false;
      if (navigator.connection && navigator.connection.saveData) return false;
      if (navigator.deviceMemory && navigator.deviceMemory <= 2) return false;
      try {
        const c = document.createElement("canvas");
        const gl = c.getContext("webgl2") || c.getContext("webgl");
        if (!gl) return false;
        const lose = gl.getExtension("WEBGL_lose_context");
        if (lose) lose.loseContext();
        return true;
      } catch (e) { return false; }
    })();

    function buildTile(container, withText) {
      container.className = "hp-lab";

      const preview = el("div", "hp-lab__preview");
      const media = el("div", "hp-lab__media");
      const open = el("a", "hp-lab__open");

      const badge = el("span", "hp-lab__badge");
      const dot = el("span", "hp-lab__dot");
      dot.append(el("span", "hp-lab__ring"), el("span", "hp-lab__core"));
      badge.append(dot, "New");

      const bar = el("div", "hp-lab__bar");
      const caption = el("div", "hp-lab__caption");
      const barTitle = el("div", "hp-lab__title");
      const barDesc = el("div", "hp-lab__subtext");
      caption.append(barTitle, barDesc);
      const nav = el("span", "hp-lab__nav");
      const prev = el("button", null, "←");
      prev.type = "button";
      prev.setAttribute("aria-label", "Previous experiment");
      const next = el("button", null, "→");
      next.type = "button";
      next.setAttribute("aria-label", "Next experiment");
      nav.append(prev, next);
      bar.append(caption, nav);

      preview.append(media, open, badge, bar);
      container.appendChild(preview);

      const allLabel = "All experiments · " + total;
      function buildAll(extraClass) {
        const a = el("a", "hp-lab__all" + (extraClass ? " " + extraClass : ""));
        a.href = allHref;
        a.append(allLabel, el("span", null, "→"));
        return a;
      }

      // Tablet swaps the title overlay for a text column beside the preview
      // (CSS decides which is visible) — only the desktop container carries it.
      let heading = null, desc = null;
      if (withText) {
        const text = el("div", "hp-lab__text");
        heading = el("div", "hp-lab__heading");
        desc = el("div", "hp-lab__desc");
        text.append(heading, desc, buildAll());
        container.appendChild(text);
      }
      container.appendChild(buildAll("hp-lab__all--below"));

      prev.addEventListener("click", () => step(-1));
      next.addEventListener("click", () => step(1));
      const tile = { media, open, badge, barTitle, barDesc, heading, desc, liveSrc: null, liveFailed: false, frame: null, timer: 0, visible: false };
      tiles.push(tile);

      // Swipe the preview left / right to change experiment — touch and pen
      // only (mobile and tablet; desktop has the arrows). A mostly-horizontal
      // drag of 40px+ steps once, and the tap-through to the project is
      // suppressed for that gesture. Vertical scrolling is untouched
      // (touch-action: pan-y on the preview).
      let swipeX = 0, swipeY = 0, swipeActive = false, swiped = false;
      preview.addEventListener("pointerdown", (e) => {
        if (e.pointerType === "mouse") return;
        swipeActive = true; swiped = false; swipeX = e.clientX; swipeY = e.clientY;
      });
      preview.addEventListener("pointerup", (e) => {
        if (!swipeActive) return;
        swipeActive = false;
        const dx = e.clientX - swipeX, dy = e.clientY - swipeY;
        if (Math.abs(dx) >= 40 && Math.abs(dx) > Math.abs(dy) * 1.5) {
          swiped = true;
          step(dx < 0 ? 1 : -1);
        }
      });
      preview.addEventListener("pointercancel", () => { swipeActive = false; });
      open.addEventListener("click", (e) => { if (swiped) { e.preventDefault(); swiped = false; } });

      container.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") { autoPaused = true; scheduleAuto(); } });
      container.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") { autoPaused = false; scheduleAuto(); } });
      container.addEventListener("focusin", (e) => { if (e.target.matches(":focus-visible")) { autoPaused = true; scheduleAuto(); } });
      container.addEventListener("focusout", () => { autoPaused = false; scheduleAuto(); });

      // Only run a live app while its tile is actually on screen (the mobile
      // tile sits in a hidden tab until opened), so it never burns GPU
      // off-screen.
      if ("IntersectionObserver" in window) {
        new IntersectionObserver((entries) => {
          tile.visible = entries[entries.length - 1].isIntersecting;
          syncLive(tile);
          scheduleAuto();
        }, { threshold: 0.15 }).observe(preview);
      } else {
        tile.visible = true;
      }
    }

    function liveUrl(item) {
      const u = new URL(item.live, location.href);
      u.searchParams.set("embed", "1");
      return u.href;
    }

    function unmountLive(tile) {
      clearTimeout(tile.timer);
      if (tile.frame) { tile.frame.remove(); tile.frame = null; }
    }

    // Mounts or removes the live frame to match whether it should be running
    // right now (an entry with `live`, the tile on screen, the tab visible).
    // The frame stays invisible until it has loaded and had a moment to start
    // up; if it never loads, it's removed and the thumbnail stays.
    function syncLive(tile) {
      const want = !!tile.liveSrc && !tile.liveFailed && tile.visible && document.visibilityState === "visible";
      if (!want) { unmountLive(tile); return; }
      if (tile.frame) return;
      const f = document.createElement("iframe");
      f.className = "hp-lab__live";
      f.tabIndex = -1;
      f.title = "";
      f.setAttribute("aria-hidden", "true");
      f.setAttribute("scrolling", "no");
      f.addEventListener("load", () => {
        clearTimeout(tile.timer);
        setTimeout(() => {
          if (tile.frame !== f) return;
          f.classList.add("is-ready");
          scheduleAuto();
        }, 900);
      });
      f.src = tile.liveSrc;
      tile.media.appendChild(f);
      tile.frame = f;
      // Generous: heavy 3D pages on a slow mobile connection can take a while.
      tile.timer = setTimeout(() => {
        tile.liveFailed = true;
        unmountLive(tile);
        scheduleAuto();
      }, 45000);
    }
    document.addEventListener("visibilitychange", () => { tiles.forEach(syncLive); scheduleAuto(); });

    // The thumbnail is always the base layer; a live app (see syncLive) or a
    // video goes on top and only becomes visible once it is genuinely running.
    // So the thumbnail is what you see whenever there's nothing live or no
    // video, it hasn't loaded yet, it fails, the browser blocks autoplay, or
    // the visitor prefers reduced motion.
    function setMedia(tile, item) {
      const media = tile.media;
      unmountLive(tile);
      media.textContent = "";
      tile.liveSrc = canRunLive && item.live ? liveUrl(item) : null;
      tile.liveFailed = false;
      if (item.poster) {
        const img = document.createElement("img");
        img.src = item.poster;
        img.alt = "";
        img.draggable = false;
        media.appendChild(img);
      } else {
        media.appendChild(el("div", "hp-lab__stripes"));
      }
      if (tile.liveSrc) {
        syncLive(tile);
      } else if (item.videoSrc && !reduceMotion) {
        const v = document.createElement("video");
        v.muted = true;
        v.loop = true;
        v.autoplay = true;
        v.playsInline = true;
        v.setAttribute("muted", "");
        v.setAttribute("playsinline", "");
        v.addEventListener("playing", () => v.classList.add("is-playing"));
        v.addEventListener("error", () => v.remove());
        v.src = item.videoSrc;
        media.appendChild(v);
        const p = v.play();
        if (p && p.catch) p.catch(() => {});
      }
    }

    function render() {
      const item = list[index];
      const external = /^https?:\/\//i.test(item.href);
      tiles.forEach((t) => {
        t.barTitle.textContent = item.title;
        t.barDesc.textContent = item.description || "";
        if (t.heading) t.heading.textContent = item.title;
        if (t.desc) t.desc.textContent = item.description || "";
        t.badge.hidden = !item.isNew;
        t.open.href = item.href;
        t.open.setAttribute("aria-label", "Open " + item.title);
        t.open.target = external ? "_blank" : "_self";
        if (external) t.open.rel = "noopener noreferrer";
        else t.open.removeAttribute("rel");
        setMedia(t, item);
      });
      scheduleAuto();
    }

    function step(offset) {
      index = (index + offset + list.length) % list.length;
      render();
    }

    const desktopHost = document.getElementById("hpLab");
    if (desktopHost) buildTile(desktopHost, true);
    const mobileHost = document.getElementById("hpMobLab");
    if (mobileHost) buildTile(mobileHost, false);
    render();

    // Tablet swaps the Lab tile and the Mentoring card: the tile goes beside
    // Experience (where Mentoring sits on desktop) and Mentoring goes beside
    // the drawer, where the tile sits on desktop. They live in different
    // columns, so move the nodes at that breakpoint and restore them
    // otherwise (see the tablet block in css/home.css).
    const mentoring = document.getElementById("hpMentoring");
    const split = document.querySelector(".hp-split");
    const navCol = document.querySelector(".hp-col--nav");
    if (desktopHost && mentoring && split && navCol) {
      const tabletQuery = window.matchMedia("(min-width: 768px) and (max-width: 1279.98px)");
      const place = () => {
        if (tabletQuery.matches) {
          if (desktopHost.parentElement !== split) split.appendChild(desktopHost);
          if (mentoring.parentElement !== navCol) navCol.insertBefore(mentoring, navCol.firstChild);
        } else {
          if (desktopHost.parentElement !== navCol) navCol.insertBefore(desktopHost, navCol.firstChild);
          if (mentoring.parentElement !== split) split.appendChild(mentoring);
        }
      };
      place();
      tabletQuery.addEventListener("change", place);
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

  // ---------------- Page-load ink-wipe safety net ----------------
  // The ink-wipe overlay (css/home.css) is a pure-CSS animation that should
  // translate itself off-screen on its own, but some mobile browsers have
  // been seen leaving it stuck covering the screen — worst case, the
  // browser never runs the animation at all, in which case the overlay's
  // plain (non-keyframe) background:#111 still paints and nothing ever
  // moves it. So don't rely on the CSS alone: once a screen (the desktop
  // .hp-page, or a mobile tab panel) actually becomes visible, force its
  // overlay to hide shortly after, whether or not the animation fired.
  // Panels not yet visited are left alone so switching to them still gets
  // a real reveal instead of an instantly-skipped one.
  (() => {
    const FALLBACK_MS = 1000;
    function armInkWipe(scope) {
      const wipe = scope.querySelector(".hp-ink-wipe");
      if (!wipe || wipe.dataset.armed) return;
      wipe.dataset.armed = "1";
      const finish = () => { wipe.style.display = "none"; };
      wipe.addEventListener("animationend", finish, { once: true });
      setTimeout(finish, FALLBACK_MS);
    }

    const hpDesktop = document.getElementById("hpDesktop");
    if (hpDesktop) armInkWipe(hpDesktop);
    document.querySelectorAll(".hp-mob-panel:not([hidden])").forEach(armInkWipe);

    document.querySelectorAll("[data-tab-panel]").forEach((panel) => {
      new MutationObserver(() => { if (!panel.hidden) armInkWipe(panel); })
        .observe(panel, { attributes: true, attributeFilter: ["hidden"] });
    });
  })();
})();
