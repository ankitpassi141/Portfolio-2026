// "Infinite Fold" — a draggable, infinitely-recycled 3D grid of photo
// cards. Vanilla-JS port of the original interaction design.
(() => {
  "use strict";

  // Photos come from images/gaming/ via js/gaming-manifest.js (regenerated
  // by scripts/build-gaming-manifest.ps1 — see js/gaming-data.js for how
  // to add a photo). Captions are an optional extra layered on top from
  // window.GAMING_CAPTIONS — a photo without one just shows with no
  // caption/title displayed.
  const photoFiles = window.GAMING_PHOTOS || [];
  const captions = window.GAMING_CAPTIONS || {};

  const FRAMES = photoFiles.map((file) => {
    const cap = captions[file] || {};
    return {
      src: "images/gaming/" + encodeURIComponent(file),
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

  // Mobile cards start smaller (more of the grid visible at once); pinch
  // zooms from there. state.zoom bakes straight into sizeFor()'s output —
  // layout() never needs to know about it.
  const MOBILE_SHRINK = 0.6; // was 0.72 — default mobile view was too zoomed in
  const MIN_ZOOM = 0.55, MAX_ZOOM = 2.0;

  // Zoom range for the focused-photo lightbox (separate from the grid's
  // own zoom above) — scroll on desktop, pinch on mobile.
  const FOCUS_MIN_ZOOM = 1, FOCUS_MAX_ZOOM = 4;

  const rootEl = document.getElementById("foldRoot");
  const planeEl = document.getElementById("foldPlane");
  const protoEl = document.getElementById("foldProto");
  const hintEl = document.getElementById("foldHint");
  const nowTitleEl = document.getElementById("foldNowTitle");
  const nowMetaEl = document.getElementById("foldNowMeta");
  const focusEl = document.getElementById("foldFocus");
  const focusCloseEl = document.getElementById("foldFocusClose");
  const focusPhotoEl = document.getElementById("foldFocusPhoto");
  const focusTitleEl = document.getElementById("foldFocusTitle");
  const focusPlaceEl = document.getElementById("foldFocusPlace");
  const focusTechEl = document.getElementById("foldFocusTech");
  if (!rootEl || !planeEl || !protoEl) return;

  const state = {
    pan: { x: 0, y: 0 },
    vel: { x: 0, y: 0 },
    zoom: 1,
    nearest: -1,
    dragging: false,
    moved: false,
    hinted: false,
    focusIdx: null,
    focusZoom: 1,
    focusPan: { x: 0, y: 0 },
    pool: null,
    cols: 0,
    rows: 0,
    W: 391, H: 262, CW: 442, CH: 313
  };

  function sizeFor() {
    const small = window.innerWidth <= 820;
    const shrink = (small ? MOBILE_SHRINK : 1) * state.zoom;
    // Desktop cards are 20% bigger than their original design size —
    // mobile's baseline (230/154) is untouched.
    const baseW = (small ? 230 : 340 * 1.2) * shrink;
    const baseH = (small ? 154 : 228 * 1.2) * shrink;
    const gap = (small ? 26 : 44 * 1.2) * shrink;
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
    if (state.cols === cols && state.rows === rows && state.pool && state.pool.length === need) {
      // Cell count is still right, but a zoom change may have resized
      // W/H under us — every live cell's box needs to catch up.
      for (const cell of state.pool) {
        cell.el.style.width = state.W + "px";
        cell.el.style.height = state.H + "px";
      }
      return;
    }
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
      // Tap-to-open is handled in onUp() via cellAtPoint(), not here — a
      // pointerup listener on the card itself is unreliable: the 3D
      // perspective transform (rotateX/rotateY under perspective) makes
      // Chromium's real hit-testing miss the element even dead-center in
      // its own getBoundingClientRect(), landing on .fold-plane behind it
      // instead. cellAtPoint() sidesteps that by working out which cell a
      // click falls in from the same flat grid math layout() uses, before
      // the 3D wobble is applied — reliable regardless of rotation.
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

  // Reverse of layout()'s own position math (x = cx*CW + pan.x, top-left
  // corner) — works out which world cell a screen point falls in, and
  // whether it's within the card itself or the gap trailing it. Doesn't
  // know or care about the 3D rotation any card is currently wobbled by;
  // see the comment in buildPool() for why that's exactly the point.
  function cellAtPoint(clientX, clientY) {
    const px = clientX - state.pan.x, py = clientY - state.pan.y;
    const cx = Math.floor(px / state.CW), cy = Math.floor(py / state.CH);
    const localX = px - cx * state.CW, localY = py - cy * state.CH;
    if (localX > state.W || localY > state.H) return null;
    return frameAt(cx, cy);
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
    state.focusZoom = 1;
    state.focusPan = { x: 0, y: 0 };
    if (focusPhotoEl) {
      focusPhotoEl.style.transform = "";
      focusPhotoEl.style.backgroundImage = f.src ? 'url("' + f.src + '")' : f.tone;
    }
    if (focusTitleEl) focusTitleEl.textContent = f.title;
    if (focusPlaceEl) focusPlaceEl.textContent = f.place;
    if (focusTechEl) focusTechEl.textContent = f.tech;
    if (focusEl) focusEl.classList.add("is-open");
    updateFocusBaseCenter();
  }
  function closeFocus() {
    state.focusIdx = null;
    focusPointers.clear();
    focusDragLast = null;
    focusPinchLast = null;
    if (focusEl) focusEl.classList.remove("is-open");
  }

  // --- Lightbox zoom/pan (scroll on desktop, pinch/drag on mobile) -------
  //
  // The photo is centered by flex layout; state.focusPan is a translate on
  // top of that center, so (0,0) always means "centered, no offset". To
  // convert a pointer's screen position into that same local space we need
  // the photo's on-screen center with no transform applied yet —
  // focusBaseCenter caches that, measured once when the lightbox opens
  // (briefly clearing the transform to measure it doesn't cause a visible
  // flash: no repaint happens between the two synchronous style writes).
  let focusBaseCenter = { x: 0, y: 0 };
  function updateFocusBaseCenter() {
    if (!focusPhotoEl) return;
    const prevTransform = focusPhotoEl.style.transform;
    focusPhotoEl.style.transform = "none";
    const r = focusPhotoEl.getBoundingClientRect();
    focusBaseCenter = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    focusPhotoEl.style.transform = prevTransform;
  }

  // Keeps the pan clamped so the zoomed photo can't be dragged fully out
  // of view, then paints the transform.
  function applyFocusTransform() {
    if (!focusPhotoEl) return;
    const w = focusPhotoEl.offsetWidth, h = focusPhotoEl.offsetHeight;
    const maxPanX = Math.max(0, (w * (state.focusZoom - 1)) / 2);
    const maxPanY = Math.max(0, (h * (state.focusZoom - 1)) / 2);
    state.focusPan.x = Math.min(maxPanX, Math.max(-maxPanX, state.focusPan.x));
    state.focusPan.y = Math.min(maxPanY, Math.max(-maxPanY, state.focusPan.y));
    focusPhotoEl.style.transform = "translate(" + state.focusPan.x + "px," + state.focusPan.y + "px) scale(" + state.focusZoom + ")";
    focusPhotoEl.style.cursor = state.focusZoom > 1 ? "grab" : "default";
  }

  // Zooms toward (clientX, clientY) by `factor`, keeping the point under it
  // visually fixed — same "solve for the new pan" algebra regardless of
  // whether the caller is a wheel tick or a pinch delta.
  function zoomFocusAt(clientX, clientY, factor) {
    const newZoom = Math.min(FOCUS_MAX_ZOOM, Math.max(FOCUS_MIN_ZOOM, state.focusZoom * factor));
    if (newZoom === state.focusZoom) return;
    const ratio = newZoom / state.focusZoom;
    const lx = clientX - focusBaseCenter.x;
    const ly = clientY - focusBaseCenter.y;
    state.focusPan.x = lx * (1 - ratio) + ratio * state.focusPan.x;
    state.focusPan.y = ly * (1 - ratio) + ratio * state.focusPan.y;
    state.focusZoom = newZoom;
    applyFocusTransform();
  }

  function onFocusWheel(e) {
    if (state.focusIdx == null) return;
    e.preventDefault();
    e.stopPropagation();
    const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
    zoomFocusAt(e.clientX, e.clientY, factor);
  }

  // Separate pointer-gesture tracking from the grid's own (a different map,
  // a different state slice) — one finger pans the zoomed photo, two
  // fingers pinch-zoom it, mirroring the grid's own drag/pinch handling.
  const focusPointers = new Map();
  let focusDragLast = null;
  let focusPinchLast = null;
  let focusMoved = false;

  function focusRefreshGestureBase() {
    const pts = [...focusPointers.values()];
    if (pts.length === 1) {
      focusDragLast = { x: pts[0].x, y: pts[0].y };
      focusPinchLast = null;
    } else if (pts.length === 2) {
      focusPinchLast = midDist(pts[0], pts[1]);
      focusDragLast = null;
    } else {
      focusDragLast = null;
      focusPinchLast = null;
    }
  }

  function onFocusDown(e) {
    if (state.focusIdx == null) return;
    if (e.target.closest(".fold-focus__close")) return;
    focusPointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    focusMoved = false;
    focusRefreshGestureBase();
  }

  function onFocusMove(e) {
    if (state.focusIdx == null || !focusPointers.has(e.pointerId)) return;
    focusPointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const pts = [...focusPointers.values()];

    if (pts.length === 1 && focusDragLast) {
      const dx = pts[0].x - focusDragLast.x, dy = pts[0].y - focusDragLast.y;
      if (Math.abs(dx) + Math.abs(dy) > 3) focusMoved = true;
      if (state.focusZoom > 1) {
        state.focusPan.x += dx;
        state.focusPan.y += dy;
        applyFocusTransform();
      }
      focusDragLast = { x: pts[0].x, y: pts[0].y };
    } else if (pts.length === 2 && focusPinchLast) {
      const cur = midDist(pts[0], pts[1]);
      if (cur.d > 4 && focusPinchLast.d > 4) {
        zoomFocusAt(cur.mx, cur.my, cur.d / focusPinchLast.d);
      }
      focusMoved = true;
      focusPinchLast = cur;
    }
  }

  function onFocusUp(e) {
    if (!focusPointers.has(e.pointerId)) return;
    focusPointers.delete(e.pointerId);
    const noneLeft = focusPointers.size === 0;
    focusRefreshGestureBase();
    // A genuine tap (no drag/pinch) on the backdrop closes the lightbox;
    // a tap on the photo itself does nothing, so zoom gestures can't
    // accidentally dismiss it.
    if (noneLeft && !focusMoved && state.focusIdx != null) {
      if (!e.target.closest(".fold-focus__photo") && !e.target.closest(".fold-focus__close")) {
        closeFocus();
      }
    }
  }

  function onFocusDblClick(e) {
    if (state.focusIdx == null) return;
    e.stopPropagation();
    state.focusZoom = 1;
    state.focusPan = { x: 0, y: 0 };
    applyFocusTransform();
  }

  // One-finger drags pan the grid; two fingers pinch-zoom (and pan from
  // their midpoint at the same time). Tracked by pointerId so a second
  // touch landing mid-drag doesn't fight the first — dragLast/pinchLast
  // hold whatever reference frame matches the CURRENT pointer count, reset
  // every time a finger goes down or up so transitions never jump.
  const pointers = new Map(); // pointerId -> {x, y}
  let dragLast = null;
  let pinchLast = null;

  function midDist(a, b) {
    return { mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2, d: Math.hypot(a.x - b.x, a.y - b.y) };
  }

  function refreshGestureBase() {
    const pts = [...pointers.values()];
    if (pts.length === 1) {
      dragLast = { x: pts[0].x, y: pts[0].y };
      pinchLast = null;
    } else if (pts.length === 2) {
      pinchLast = midDist(pts[0], pts[1]);
      dragLast = null;
    } else {
      dragLast = null;
      pinchLast = null;
    }
  }

  function onDown(e) {
    if (state.focusIdx != null) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    state.moved = false;
    state.vel.x = 0; state.vel.y = 0;
    state.dragging = true;
    rootEl.classList.add("is-dragging");
    refreshGestureBase();
  }

  function onMove(e) {
    if (!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const pts = [...pointers.values()];

    if (pts.length === 1 && dragLast) {
      const dx = pts[0].x - dragLast.x, dy = pts[0].y - dragLast.y;
      if (Math.abs(dx) + Math.abs(dy) > 3) { state.moved = true; interacted(); }
      state.pan.x += dx; state.pan.y += dy;
      state.vel.x = dx; state.vel.y = dy;
      dragLast = { x: pts[0].x, y: pts[0].y };
    } else if (pts.length === 2 && pinchLast) {
      const cur = midDist(pts[0], pts[1]);
      let newZoom = state.zoom;
      if (cur.d > 4 && pinchLast.d > 4) {
        // Fingers spreading apart (cur.d grows) grows zoom — pinch-out
        // zooms the grid in; pinching together zooms it out.
        const scaleRatio = cur.d / pinchLast.d;
        newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, state.zoom * scaleRatio));
      }
      // Zoom-around-point + two-finger pan in one step: whatever world
      // location sat under the old midpoint now sits under the new one.
      const ratioZ = newZoom / state.zoom;
      state.pan.x = cur.mx - (pinchLast.mx - state.pan.x) * ratioZ;
      state.pan.y = cur.my - (pinchLast.my - state.pan.y) * ratioZ;
      state.zoom = newZoom;
      state.vel.x = 0; state.vel.y = 0;
      state.moved = true;
      sizeFor();
      buildPool();
      interacted();
      pinchLast = cur;
    }
  }

  function onUp(e) {
    if (!pointers.has(e.pointerId)) return;
    const wasSolo = pointers.size === 1; // exactly one finger/cursor was down — not the tail end of a pinch
    pointers.delete(e.pointerId);
    state.dragging = pointers.size > 0;
    if (!state.dragging) rootEl.classList.remove("is-dragging");
    if (wasSolo && !state.moved) {
      const idx = cellAtPoint(e.clientX, e.clientY);
      if (idx != null) openFocus(idx);
    }
    refreshGestureBase();
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
    if (state.focusIdx != null) return; // lightbox owns wheel input while open — see onFocusWheel
    state.vel.x = 0; state.vel.y = 0;
    state.pan.x -= e.deltaX;
    state.pan.y -= e.deltaY;
    interacted();
    e.preventDefault();
  }

  function onResize() { sizeFor(); buildPool(); if (state.focusIdx != null) updateFocusBaseCenter(); }

  if (focusCloseEl) focusCloseEl.addEventListener("click", (e) => { e.stopPropagation(); closeFocus(); });
  if (focusEl) {
    focusEl.addEventListener("wheel", onFocusWheel, { passive: false });
    focusEl.addEventListener("pointerdown", onFocusDown);
    focusEl.addEventListener("dblclick", onFocusDblClick);
  }
  window.addEventListener("resize", onResize);
  window.addEventListener("keydown", onKey);
  rootEl.addEventListener("wheel", onWheel, { passive: false });
  rootEl.addEventListener("pointerdown", onDown);
  // move/up on window, not rootEl: a desktop drag can carry the mouse
  // outside the viewport, and (for touch) window still gets the bubbled
  // event via the pointer's implicit target capture either way.
  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onUp);
  window.addEventListener("pointercancel", onUp);
  window.addEventListener("pointermove", onFocusMove);
  window.addEventListener("pointerup", onFocusUp);
  window.addEventListener("pointercancel", onFocusUp);
  // Casual deterrent only — right-click "save image" isn't offered on CSS
  // background-images anyway, but this blocks the fallback page menu too.
  // Doesn't stop DevTools/view-source; nothing client-side can.
  rootEl.addEventListener("contextmenu", (e) => e.preventDefault());

  try { if (localStorage.getItem("fold-hint") === "done" && hintEl) hintEl.style.opacity = "0"; } catch (e) {}

  sizeFor();
  buildPool();
  raf = requestAnimationFrame(tick);
})();
