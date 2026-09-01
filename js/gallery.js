// "Infinite Fold" — a draggable, infinitely-recycled 3D grid of photo
// cards. Vanilla-JS port of the original interaction design; frame content
// comes from window.GALLERY (see js/gallery-data.js).
(() => {
  "use strict";

  // Photos come from images/gallery/ via js/gallery-manifest.js (regenerated
  // by scripts/build-gallery-manifest.ps1 — see js/gallery-data.js for how
  // to add a photo). Captions are an optional extra layered on top from
  // window.GALLERY_CAPTIONS — a photo without one just shows with no
  // caption/title displayed.
  const photoFiles = window.GALLERY_PHOTOS || [];
  const captions = window.GALLERY_CAPTIONS || {};

  const FRAMES = photoFiles.map((file) => {
    const cap = captions[file] || {};
    return {
      src: "images/gallery/" + encodeURIComponent(file),
      title: cap.title || "",
      place: cap.place || "",
      tech: cap.tech || ""
    };
  });

  if (!FRAMES.length) return;

  const FRICTION = 0.94;
  const FOCUS_RADIUS = 0.3; // dist below which a card is "in focus"
  const MAX_RY = 34, MAX_RX = 26, MAX_RZ = 3.6;

  // Card sizing: every card is SIZE_BUMP bigger than the original design;
  // the single card in focus (dist < FOCUS_RADIUS) gets boosted further in
  // layout() so it lands at FOCUS_BOOST * SIZE_BUMP (25%) over the original
  // at dead-center, while everything else stays at the SIZE_BUMP baseline.
  const SIZE_BUMP = 1.15;
  const FOCUS_BOOST = 1.25 / SIZE_BUMP;

  const rootEl = document.getElementById("foldRoot");
  const planeEl = document.getElementById("foldPlane");
  const protoEl = document.getElementById("foldProto");
  const hintEl = document.getElementById("foldHint");
  const nowTitleEl = document.getElementById("foldNowTitle");
  const nowMetaEl = document.getElementById("foldNowMeta");
  const focusEl = document.getElementById("foldFocus");
  const focusPhotoEl = document.getElementById("foldFocusPhoto");
  const focusTitleEl = document.getElementById("foldFocusTitle");
  const focusPlaceEl = document.getElementById("foldFocusPlace");
  const focusTechEl = document.getElementById("foldFocusTech");
  if (!rootEl || !planeEl || !protoEl) return;

  const state = {
    pan: { x: 0, y: 0 },
    vel: { x: 0, y: 0 },
    nearest: -1,
    dragging: false,
    moved: false,
    hinted: false,
    focusIdx: null,
    pool: null,
    cols: 0,
    rows: 0,
    W: 391, H: 262, CW: 442, CH: 313
  };

  function sizeFor() {
    const small = window.innerWidth <= 820;
    const baseW = small ? 230 : 340;
    const baseH = small ? 154 : 228;
    const gap = small ? 26 : 44;
    state.W = Math.round(baseW * SIZE_BUMP);
    state.H = Math.round(baseH * SIZE_BUMP);
    state.CW = state.W + Math.round(gap * SIZE_BUMP);
    state.CH = state.H + Math.round(gap * SIZE_BUMP);
  }

  // Recycled pool: viewport plus a two-cell buffer on every side.
  function buildPool() {
    const cols = Math.ceil(window.innerWidth / state.CW) + 4;
    const rows = Math.ceil(window.innerHeight / state.CH) + 4;
    const need = cols * rows;
    if (state.cols === cols && state.rows === rows && state.pool && state.pool.length === need) return;
    state.cols = cols; state.rows = rows;
    for (const old of [...planeEl.querySelectorAll('[data-cell="1"]')]) old.remove();
    state.pool = [];
    for (let i = 0; i < need; i++) {
      const el = protoEl.cloneNode(true);
      el.setAttribute("data-cell", "1");
      el.removeAttribute("id");
      el.classList.add("is-live");
      el.style.width = state.W + "px";
      el.style.height = state.H + "px";
      const cell = {
        el,
        photo: el.querySelector(".fold-card__photo"),
        cap: el.querySelector(".fold-card__caption"),
        title: el.querySelector(".fold-card__title"),
        place: el.querySelector(".fold-card__place"),
        tech: el.querySelector(".fold-card__tech"),
        idx: -1, focused: false, cx: null, cy: null
      };
      el.addEventListener("pointerup", (ev) => {
        if (state.moved) return;
        ev.stopPropagation();
        openFocus(cell.idx);
      });
      planeEl.appendChild(el);
      state.pool.push(cell);
    }
  }

  // Which frame lives in a cell is a function of its integer coordinates
  // only — a Latin-square walk, so a pan never shows the same frame twice
  // in a row or column within one full cycle, and revisiting a spot shows
  // the same photo.
  function frameAt(cx, cy) {
    const n = FRAMES.length;
    return (((cx * 5 + cy * 7) % n) + n) % n;
  }

  function paint(cell, cx, cy) {
    const idx = frameAt(cx, cy);
    if (cell.idx === idx && cell.cx === cx && cell.cy === cy) return;
    cell.cx = cx; cell.cy = cy;
    if (cell.idx !== idx) {
      const f = FRAMES[idx];
      cell.idx = idx;
      cell.photo.style.backgroundImage = 'url("' + f.src + '")';
      cell.title.textContent = f.title;
      cell.place.textContent = f.place;
      cell.tech.textContent = f.tech;
    }
  }

  function layout() {
    if (!state.pool || !state.pool.length) return;
    const vw = window.innerWidth, vh = window.innerHeight;
    const halfW = vw / 2, halfH = vh / 2;
    const startCol = Math.floor(-state.pan.x / state.CW) - 2;
    const startRow = Math.floor(-state.pan.y / state.CH) - 2;
    let best = null, bestD = Infinity;

    for (let i = 0; i < state.pool.length; i++) {
      const cell = state.pool[i];
      const c = i % state.cols, r = Math.floor(i / state.cols);
      const cx = startCol + c, cy = startRow + r;
      paint(cell, cx, cy);

      const x = cx * state.CW + state.pan.x;
      const y = cy * state.CH + state.pan.y;
      const nx = ((x + state.W / 2) - halfW) / halfW * 1.8;
      const ny = ((y + state.H / 2) - halfH) / halfH * 1.8;
      const dist = Math.hypot(nx, ny);

      const ry = -nx * MAX_RY;
      const rx = -ny * MAX_RX;
      const rz = nx * MAX_RZ;
      const tz = -dist * 92;
      let scale = Math.max(0.58, 1 - dist * 0.16);
      if (dist < FOCUS_RADIUS) {
        const t = 1 - dist / FOCUS_RADIUS; // 1 at dead-center, 0 at the focus boundary
        scale *= 1 + (FOCUS_BOOST - 1) * t;
      }
      const op = Math.max(0.12, 1 - dist * 0.42);
      const bright = Math.max(0.42, 1 - dist * 0.4);
      const sat = Math.max(0.25, 1 - dist * 0.55);

      cell.el.style.transform = "translate3d(" + x + "px," + y + "px," + tz + "px) rotateY(" + ry + "deg) rotateX(" + rx + "deg) rotateZ(" + rz + "deg) scale(" + scale + ")";
      cell.el.style.opacity = op;
      cell.el.style.zIndex = String(1000 - Math.round(dist * 100));
      cell.photo.style.filter = "brightness(" + bright + ") saturate(" + sat + ")";

      const inFocus = dist < FOCUS_RADIUS && !!FRAMES[cell.idx].title;
      if (inFocus !== cell.focused) {
        cell.focused = inFocus;
        cell.cap.classList.toggle("is-visible", inFocus);
      }
      if (dist < bestD) { bestD = dist; best = cell; }
    }

    if (best && best.idx !== state.nearest) {
      state.nearest = best.idx;
      const f = FRAMES[best.idx];
      if (nowTitleEl) nowTitleEl.textContent = f.title;
      if (nowMetaEl) nowMetaEl.textContent = f.title ? (f.place + " · " + f.tech) : "";
    }
  }

  let raf;
  function tick() {
    raf = requestAnimationFrame(tick);
    if (!state.dragging) {
      if (Math.abs(state.vel.x) > 0.05 || Math.abs(state.vel.y) > 0.05) {
        state.pan.x += state.vel.x; state.pan.y += state.vel.y;
        state.vel.x *= FRICTION; state.vel.y *= FRICTION;
      } else { state.vel.x = 0; state.vel.y = 0; }
    }
    layout();
  }

  function interacted() {
    if (state.hinted) return;
    state.hinted = true;
    if (hintEl) hintEl.style.opacity = "0";
    try { localStorage.setItem("fold-hint", "done"); } catch (e) {}
  }

  function openFocus(idx) {
    if (idx == null || idx < 0) return;
    const f = FRAMES[idx];
    state.focusIdx = idx;
    state.vel.x = 0; state.vel.y = 0;
    if (focusPhotoEl) focusPhotoEl.style.backgroundImage = f.src ? 'url("' + f.src + '")' : f.tone;
    if (focusTitleEl) focusTitleEl.textContent = f.title;
    if (focusPlaceEl) focusPlaceEl.textContent = f.place;
    if (focusTechEl) focusTechEl.textContent = f.tech;
    if (focusEl) focusEl.classList.add("is-open");
  }
  function closeFocus() {
    state.focusIdx = null;
    if (focusEl) focusEl.classList.remove("is-open");
  }

  function onDown(e) {
    if (state.focusIdx != null) return;
    state.dragging = true;
    state.moved = false;
    state.vel.x = 0; state.vel.y = 0;
    let last = { x: e.clientX, y: e.clientY };
    rootEl.classList.add("is-dragging");
    const move = (ev) => {
      if (!state.dragging) return;
      const dx = ev.clientX - last.x, dy = ev.clientY - last.y;
      if (Math.abs(dx) + Math.abs(dy) > 3) { state.moved = true; interacted(); }
      state.pan.x += dx; state.pan.y += dy;
      state.vel.x = dx; state.vel.y = dy;
      last = { x: ev.clientX, y: ev.clientY };
    };
    const up = () => {
      state.dragging = false;
      rootEl.classList.remove("is-dragging");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
  }

  function onKey(e) {
    if (e.key === "Escape" && state.focusIdx != null) { closeFocus(); return; }
    const map = { ArrowLeft: [state.CW, 0], ArrowRight: [-state.CW, 0], ArrowUp: [0, state.CH], ArrowDown: [0, -state.CH] };
    const d = map[e.key];
    if (!d) return;
    state.vel.x = 0; state.vel.y = 0;
    state.pan.x += d[0]; state.pan.y += d[1];
    interacted();
    e.preventDefault();
  }

  function onWheel(e) {
    state.vel.x = 0; state.vel.y = 0;
    state.pan.x -= e.deltaX;
    state.pan.y -= e.deltaY;
    interacted();
    e.preventDefault();
  }

  function onResize() { sizeFor(); buildPool(); }

  if (focusEl) focusEl.addEventListener("click", closeFocus);
  window.addEventListener("resize", onResize);
  window.addEventListener("keydown", onKey);
  rootEl.addEventListener("wheel", onWheel, { passive: false });
  rootEl.addEventListener("pointerdown", onDown);

  try { if (localStorage.getItem("fold-hint") === "done" && hintEl) hintEl.style.opacity = "0"; } catch (e) {}

  sizeFor();
  buildPool();
  raf = requestAnimationFrame(tick);
})();
