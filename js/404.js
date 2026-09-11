// 404 page — "Infinite Fold" (same drag-to-pan 3D card engine as
// gaming-gallery.html, see js/gallery.js) but combining BOTH photo sets
// (images/gallery/ + images/gaming/, via js/gallery-manifest.js and
// js/gaming-manifest.js) into one shuffled deck, and running an ambient
// auto-drift when nobody's touching it so the page is never static. No
// tap-to-zoom lightbox on this page — cards are drag/drift-only, purely
// decorative.
(() => {
  "use strict";

  const galleryFiles = window.GALLERY_PHOTOS || [];
  const gamingFiles = window.GAMING_PHOTOS || [];
  const gamingCaptions = window.GAMING_CAPTIONS || {};

  const FRAMES = [
    ...galleryFiles.map((file) => ({
      src: "images/gallery/" + encodeURIComponent(file),
      title: "", place: "", tech: ""
    })),
    ...gamingFiles.map((file) => {
      const cap = gamingCaptions[file] || {};
      return {
        src: "images/gaming/" + encodeURIComponent(file),
        title: cap.title || "", place: cap.place || "", tech: cap.tech || ""
      };
    })
  ];

  // Fisher–Yates — otherwise every gallery photo would sit before every
  // gaming shot in FRAMES, which frameAt()'s hash-walk mostly hides but
  // this removes any doubt.
  for (let i = FRAMES.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [FRAMES[i], FRAMES[j]] = [FRAMES[j], FRAMES[i]];
  }

  if (!FRAMES.length) return;

  const FRICTION = 0.94;
  const FOCUS_RADIUS = 0.3; // dist below which a card is "in focus" (bigger, caption shows) — unrelated to the removed lightbox
  const MAX_RY = 34, MAX_RX = 26, MAX_RZ = 3.6;

  const SIZE_BUMP = 1.15;
  const FOCUS_BOOST = 1.25 / SIZE_BUMP;

  const MOBILE_SHRINK = 0.6;
  const MIN_ZOOM = 0.55, MAX_ZOOM = 2.0;

  // Ambient auto-drift: how fast it pans (px/frame), how long to wait
  // after the visitor last touched it before drift resumes, and how
  // often it nudges toward a new random-ish direction rather than
  // holding one heading forever.
  const DRIFT_SPEED = 0.4;
  const DRIFT_IDLE_MS = 900;
  const DRIFT_RETARGET_MS = 4500;

  const rootEl = document.getElementById("foldRoot");
  const planeEl = document.getElementById("foldPlane");
  const protoEl = document.getElementById("foldProto");
  const nowTitleEl = document.getElementById("foldNowTitle");
  const nowMetaEl = document.getElementById("foldNowMeta");
  if (!rootEl || !planeEl || !protoEl) return;

  const state = {
    pan: { x: 0, y: 0 },
    vel: { x: 0, y: 0 },
    zoom: 1,
    nearest: -1,
    dragging: false,
    pool: null,
    cols: 0,
    rows: 0,
    W: 391, H: 262, CW: 442, CH: 313
  };

  // Backdated so drift is eligible to start the moment the page loads,
  // without requiring the visitor to interact first.
  let lastInteraction = performance.now() - DRIFT_IDLE_MS;
  let driftAngle = Math.random() * Math.PI * 2;
  let lastDriftPick = performance.now();

  function sizeFor() {
    const small = window.innerWidth <= 820;
    const shrink = (small ? MOBILE_SHRINK : 1) * state.zoom;
    const baseW = (small ? 230 : 340 * 1.2) * shrink;
    const baseH = (small ? 154 : 228 * 1.2) * shrink;
    const gap = (small ? 26 : 44 * 1.2) * shrink;
    state.W = Math.round(baseW * SIZE_BUMP);
    state.H = Math.round(baseH * SIZE_BUMP);
    state.CW = state.W + Math.round(gap * SIZE_BUMP);
    state.CH = state.H + Math.round(gap * SIZE_BUMP);
  }

  function buildPool() {
    const cols = Math.ceil(window.innerWidth / state.CW) + 4;
    const rows = Math.ceil(window.innerHeight / state.CH) + 4;
    const need = cols * rows;
    if (state.cols === cols && state.rows === rows && state.pool && state.pool.length === need) {
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
      planeEl.appendChild(el);
      state.pool.push(cell);
    }
  }

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
        const t = 1 - dist / FOCUS_RADIUS;
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

  // Drifts the plane in a slowly-wandering direction once the visitor's
  // been idle for DRIFT_IDLE_MS — never fights a fresh drag or a flick's
  // momentum (both keep resetting lastInteraction via interacted()), and
  // stops instantly the moment state.dragging goes true (tick()'s own
  // `if (!state.dragging)` guard below skips this call entirely).
  function applyDrift(now) {
    if (now - lastInteraction < DRIFT_IDLE_MS) return;
    if (now - lastDriftPick > DRIFT_RETARGET_MS) {
      driftAngle += (Math.random() - 0.5) * Math.PI * 0.6; // wander, don't teleport
      lastDriftPick = now;
    }
    state.pan.x += Math.cos(driftAngle) * DRIFT_SPEED;
    state.pan.y += Math.sin(driftAngle) * DRIFT_SPEED;
  }

  let raf;
  function tick() {
    raf = requestAnimationFrame(tick);
    if (!state.dragging) {
      if (Math.abs(state.vel.x) > 0.05 || Math.abs(state.vel.y) > 0.05) {
        state.pan.x += state.vel.x; state.pan.y += state.vel.y;
        state.vel.x *= FRICTION; state.vel.y *= FRICTION;
      } else {
        state.vel.x = 0; state.vel.y = 0;
        applyDrift(performance.now());
      }
    }
    layout();
  }

  function interacted() {
    lastInteraction = performance.now();
  }

  const pointers = new Map();
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
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
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
      if (Math.abs(dx) + Math.abs(dy) > 3) interacted();
      state.pan.x += dx; state.pan.y += dy;
      state.vel.x = dx; state.vel.y = dy;
      dragLast = { x: pts[0].x, y: pts[0].y };
    } else if (pts.length === 2 && pinchLast) {
      const cur = midDist(pts[0], pts[1]);
      let newZoom = state.zoom;
      if (cur.d > 4 && pinchLast.d > 4) {
        const scaleRatio = cur.d / pinchLast.d;
        newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, state.zoom * scaleRatio));
      }
      const ratioZ = newZoom / state.zoom;
      state.pan.x = cur.mx - (pinchLast.mx - state.pan.x) * ratioZ;
      state.pan.y = cur.my - (pinchLast.my - state.pan.y) * ratioZ;
      state.zoom = newZoom;
      state.vel.x = 0; state.vel.y = 0;
      sizeFor();
      buildPool();
      interacted();
      pinchLast = cur;
    }
  }

  function onUp(e) {
    if (!pointers.has(e.pointerId)) return;
    pointers.delete(e.pointerId);
    state.dragging = pointers.size > 0;
    if (!state.dragging) rootEl.classList.remove("is-dragging");
    refreshGestureBase();
    interacted(); // release also resets the idle clock, so a flick's momentum plays out before drift resumes
  }

  function onKey(e) {
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

  window.addEventListener("resize", onResize);
  window.addEventListener("keydown", onKey);
  rootEl.addEventListener("wheel", onWheel, { passive: false });
  rootEl.addEventListener("pointerdown", onDown);
  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onUp);
  window.addEventListener("pointercancel", onUp);
  rootEl.addEventListener("contextmenu", (e) => e.preventDefault());

  sizeFor();
  buildPool();
  raf = requestAnimationFrame(tick);
})();
