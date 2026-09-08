// Experiments page — full-viewport canvas "constellation" of drifting
// project nodes. Reads window.EXPERIMENTS (see js/experiments-data.js) for
// content, then drives a single requestAnimationFrame loop that owns all
// the physics/rendering. Ported from a Claude Design canvas prototype —
// the drawing math below is a direct translation of that prototype's
// logic, not a reinterpretation, so it stays pixel-faithful to the design.
(() => {
  "use strict";

  const DATA = window.EXPERIMENTS;
  if (!DATA) return;

  const PARALLAX_SCALE = 0.4;

  function lerp(a, b, t) { return a + (b - a) * t; }
  function dist(x1, y1, x2, y2) { return Math.hypot(x1 - x2, y1 - y2); }
  function rand(min, max) { return min + Math.random() * (max - min); }

  // Turns **word** into <strong>word</strong> — write **bold** in a
  // data-file string (e.g. a project card's `desc`) to bold that part
  // of it. Builds real nodes via createElement/createTextNode rather
  // than innerHTML, so it can't be tricked into running markup as HTML.
  function renderRich(el, value) {
    el.textContent = "";
    if (value == null) return;
    const parts = String(value).split(/\*\*(.+?)\*\*/g);
    parts.forEach((part, i) => {
      if (!part) return;
      if (i % 2 === 1) {
        const strong = document.createElement("strong");
        strong.textContent = part;
        el.appendChild(strong);
      } else {
        el.appendChild(document.createTextNode(part));
      }
    });
  }

  function getPhase(hour) {
    if (hour >= 6 && hour < 14) return { name: "day", bg: "#141b33", nebula: "160,150,220", line1: "138,120,220", line2: "150,140,230" };
    if (hour >= 14 && hour < 18) return { name: "evening", bg: "#241a2e", nebula: "200,110,140", line1: "220,140,120", line2: "230,150,140" };
    return { name: "night", bg: "#05050a", nebula: "60,50,90", line1: "196,166,255", line2: "196,166,255" };
  }

  // --- Static content wiring -------------------------------------------
  document.getElementById("xTitle").textContent = DATA.title;
  document.getElementById("xSubtitle").textContent = DATA.subtitle;
  document.getElementById("xBack").setAttribute("href", DATA.backHref);

  const canvas = document.getElementById("xCanvas");
  const ctx = canvas.getContext("2d");
  const clockEl = document.getElementById("xClock");
  const cardEl = document.getElementById("xCard");
  const cardThumbImgEl = document.getElementById("xCardThumbImg");
  const cardNameEl = document.getElementById("xCardName");
  const cardDescEl = document.getElementById("xCardDesc");
  const cardLinkEl = document.getElementById("xCardLink");
  const cardCloseEl = document.getElementById("xCardClose");

  let W = 0, H = 0;
  let cursorRaw = { x: 0, y: 0 };
  let cursorSmoothed = { x: 0, y: 0 };
  let pointerScreen = { x: 0, y: 0 };
  let hoverFade = 0;
  let hoveredNode = null;
  let lastHoveredNode = null;
  let activeDrag = null;
  let downInfo = null;
  let card = null; // { name, desc, link, left, top } while the info card is open
  let _t = 0;

  const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  function reduceMotionActive() {
    return !!DATA.reduceMotion || reduceMotionQuery.matches;
  }

  // --- Node setup --------------------------------------------------------
  const nodes = [];
  const projects = DATA.projects || [];
  projects.forEach((p, i) => {
    const angle = (i / projects.length) * Math.PI * 2 + 0.35;
    const rx = 0.30 * rand(0.85, 1.15);
    const ry = 0.30 * rand(0.85, 1.15);
    nodes.push({
      type: "project", project: p,
      fx: 0.5 + Math.cos(angle) * rx, fy: 0.5 + Math.sin(angle) * ry,
      baseRadius: rand(16, 36), depth: rand(0.15, 0.75),
      particleOffset: Math.random(), pos: { x: 0, y: 0 },
      wanderPhaseX: rand(0, Math.PI * 2), wanderPhaseY: rand(0, Math.PI * 2),
      wanderSpeed: rand(0.06, 0.14), wanderAmp: rand(0.01, 0.022),
      velX: 0, velY: 0,
      dragging: false, releasing: false,
    });
  });
  const ambientCount = Math.max(0, Math.round(DATA.ambientNodeCount ?? 30));
  for (let i = 0; i < ambientCount; i++) {
    let fx, fy;
    do { fx = rand(0.03, 0.97); fy = rand(0.03, 0.97); } while (dist(fx, fy, 0.5, 0.5) < 0.12);
    const sizeRoll = Math.random();
    const baseRadius = sizeRoll < 0.55 ? rand(2, 6) : sizeRoll < 0.85 ? rand(6, 11) : rand(11, 16);
    nodes.push({
      type: "ambient", project: null,
      fx, fy, baseRadius, depth: rand(0.15, 0.75),
      particleOffset: Math.random(), pos: { x: 0, y: 0 },
      wanderPhaseX: rand(0, Math.PI * 2), wanderPhaseY: rand(0, Math.PI * 2),
      wanderSpeed: rand(0.08, 0.26), wanderAmp: rand(0.014, 0.045),
      velX: 0, velY: 0,
      dragging: false, releasing: false,
    });
  }
  const dust = [];
  for (let i = 0; i < 90; i++) {
    dust.push({ fx: Math.random(), fy: Math.random(), r: rand(0.6, 1.8), phase: Math.random() * 10, speed: rand(0.3, 0.9) });
  }

  // --- Sizing --------------------------------------------------------
  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    W = rect.width; H = rect.height;
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function nodeTarget(node) {
    const t = _t * (DATA.motionSpeed ?? 1.4);
    const wx = (Math.sin(t * node.wanderSpeed + node.wanderPhaseX) * 0.7 + Math.sin(t * node.wanderSpeed * 2.3 + node.wanderPhaseY * 1.7) * 0.3) * node.wanderAmp * W;
    const wy = (Math.cos(t * node.wanderSpeed * 0.9 + node.wanderPhaseY) * 0.7 + Math.cos(t * node.wanderSpeed * 2.1 + node.wanderPhaseX * 1.5) * 0.3) * node.wanderAmp * H;
    return {
      x: node.fx * W + wx - cursorSmoothed.x * node.depth * PARALLAX_SCALE,
      y: node.fy * H + wy - cursorSmoothed.y * node.depth * PARALLAX_SCALE,
    };
  }

  function hitNode(px, py) {
    for (let i = nodes.length - 1; i >= 0; i--) {
      const n = nodes[i];
      const pad = n.type === "project" ? 10 : 8;
      if (dist(px, py, n.pos.x, n.pos.y) < n.baseRadius + pad) return n;
    }
    return null;
  }

  // --- Pointer interaction -------------------------------------------
  function onPointerDown(e) {
    const rect = canvas.getBoundingClientRect();
    const px = e.clientX - rect.left, py = e.clientY - rect.top;
    const node = hitNode(px, py);
    downInfo = { x: e.clientX, y: e.clientY, moved: false, node };
    if (node) {
      node.dragging = true; node.releasing = false;
      node.dragOffsetX = px - node.pos.x; node.dragOffsetY = py - node.pos.y;
      activeDrag = node;
      try { canvas.setPointerCapture(e.pointerId); } catch (err) {}
    }
  }

  function onPointerMove(e) {
    const rect = canvas.getBoundingClientRect();
    const px = e.clientX - rect.left, py = e.clientY - rect.top;
    pointerScreen = { x: px, y: py };
    cursorRaw = { x: px - W / 2, y: py - H / 2 };
    if (activeDrag) {
      const n = activeDrag;
      n.pos = { x: px - n.dragOffsetX, y: py - n.dragOffsetY };
    }
    if (downInfo && !downInfo.moved) {
      if (dist(e.clientX, e.clientY, downInfo.x, downInfo.y) > 6) downInfo.moved = true;
    }
  }

  function onPointerUp() {
    if (activeDrag) {
      activeDrag.dragging = false;
      activeDrag.releasing = true;
      activeDrag = null;
    }
    const info = downInfo;
    downInfo = null;
    if (!info) return;
    if (!info.moved && info.node && info.node.type === "project") {
      openCard(info.node);
    } else if (!info.moved && !info.node && card) {
      closeCard();
    }
  }

  // Thumbnail is a live screenshot of the project's own link, via a
  // public screenshot API — no manual image to keep in sync with the
  // link. Kept hidden (gradient placeholder shows through) until it
  // actually loads, and stays hidden on failure/non-http links instead
  // of showing a broken-image icon.
  function setCardThumb(link) {
    cardThumbImgEl.onload = null;
    cardThumbImgEl.onerror = null;
    cardThumbImgEl.style.display = "none";
    cardThumbImgEl.removeAttribute("src");
    if (!/^https?:\/\//i.test(link)) return;
    cardThumbImgEl.onload = () => { cardThumbImgEl.style.display = "block"; };
    cardThumbImgEl.onerror = () => { cardThumbImgEl.style.display = "none"; };
    cardThumbImgEl.src = "https://api.microlink.io/?url=" + encodeURIComponent(link) + "&screenshot=true&meta=false&embed=screenshot.url";
  }

  function openCard(node) {
    const cardW = 250, cardH = 280;
    const left = Math.min(Math.max(node.pos.x + 20, 12), W - cardW - 12);
    const top = Math.min(Math.max(node.pos.y - 30, 12), H - cardH - 12);
    card = { ...node.project, left, top };
    cardNameEl.textContent = card.name;
    renderRich(cardDescEl, card.desc);
    cardLinkEl.setAttribute("href", card.link);
    setCardThumb(card.link);
    cardEl.style.left = left + "px";
    cardEl.style.top = top + "px";
    cardEl.classList.add("is-open");
  }

  function closeCard() {
    card = null;
    cardEl.classList.remove("is-open");
  }

  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
  window.addEventListener("resize", resize);
  cardCloseEl.addEventListener("click", closeCard);

  // --- Clock -----------------------------------------------------------
  function tickClock() {
    clockEl.textContent = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }
  tickClock();
  setInterval(tickClock, 1000);

  // --- Draw loop -----------------------------------------------------
  function draw(now) {
    requestAnimationFrame(draw);
    if (!W || !H) return;
    const t = now / 1000;
    _t = t;
    const reduceMotion = reduceMotionActive();
    const drift = reduceMotion ? 0 : t;
    const phase = getPhase(new Date().getHours());

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = phase.bg;
    ctx.fillRect(0, 0, W, H);

    ctx.globalCompositeOperation = "lighter";
    const nebColors = [phase.nebula, phase.line1, phase.line2];
    const blobs = [
      { x: 0.28 + Math.sin(drift * 0.045) * 0.09, y: 0.32 + Math.cos(drift * 0.037) * 0.08, rBase: 0.42, rPulse: 0.14, rSpeed: 0.06, colorIdx: 0 },
      { x: 0.72 + Math.cos(drift * 0.041) * 0.09, y: 0.65 + Math.sin(drift * 0.048) * 0.08, rBase: 0.38, rPulse: 0.12, rSpeed: 0.05, colorIdx: 1 },
      { x: 0.5 + Math.sin(drift * 0.028) * 0.12, y: 0.48 + Math.cos(drift * 0.033) * 0.1, rBase: 0.46, rPulse: 0.16, rSpeed: 0.045, colorIdx: 2 },
      { x: 0.18 + Math.sin(drift * 0.052 + 2) * 0.08, y: 0.72 + Math.cos(drift * 0.044 + 1) * 0.09, rBase: 0.3, rPulse: 0.1, rSpeed: 0.07, colorIdx: 1 },
      { x: 0.82 + Math.cos(drift * 0.036 + 3) * 0.08, y: 0.22 + Math.sin(drift * 0.05 + 2) * 0.09, rBase: 0.32, rPulse: 0.11, rSpeed: 0.055, colorIdx: 0 },
    ];
    blobs.forEach((b) => {
      const cx = b.x * W, cy = b.y * H;
      const r = (b.rBase + Math.sin(drift * b.rSpeed) * b.rPulse) * Math.max(W, H);
      const alpha = 0.22 + 0.14 * (Math.sin(drift * b.rSpeed * 1.3) * 0.5 + 0.5);
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, `rgba(${nebColors[b.colorIdx]},${alpha})`);
      g.addColorStop(1, `rgba(${nebColors[b.colorIdx]},0)`);
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
    });
    ctx.globalCompositeOperation = "source-over";

    dust.forEach((d) => {
      const tw = reduceMotion ? 0.6 : (Math.sin(t * d.speed + d.phase) * 0.5 + 0.5);
      ctx.fillStyle = `rgba(255,255,255,${0.15 + tw * 0.35})`;
      ctx.beginPath(); ctx.arc(d.fx * W, d.fy * H, d.r, 0, Math.PI * 2); ctx.fill();
    });

    cursorSmoothed.x = lerp(cursorSmoothed.x, cursorRaw.x, 0.08);
    cursorSmoothed.y = lerp(cursorSmoothed.y, cursorRaw.y, 0.08);

    nodes.forEach((n) => {
      n.velX = (n.velX || 0) * 0.9;
      n.velY = (n.velY || 0) * 0.9;
      if (n.dragging) return;
      const target = nodeTarget(n);
      if (n.releasing) {
        n.pos.x = lerp(n.pos.x, target.x, 0.12) + n.velX;
        n.pos.y = lerp(n.pos.y, target.y, 0.12) + n.velY;
        if (dist(n.pos.x, n.pos.y, target.x, target.y) < 0.5) n.releasing = false;
      } else {
        n.pos = { x: target.x + n.velX, y: target.y + n.velY };
      }
    });

    const sizeScale = DATA.nodeSizeScale ?? 1;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        if (a.dragging || b.dragging) continue;
        const ra = a.baseRadius * (a.type === "project" ? sizeScale : 1);
        const rb = b.baseRadius * (b.type === "project" ? sizeScale : 1);
        const dx = b.pos.x - a.pos.x, dy = b.pos.y - a.pos.y;
        const d = Math.hypot(dx, dy) || 0.001;
        const minDist = ra + rb;
        if (d < minDist) {
          const overlap = (minDist - d) / d;
          const nx = dx * overlap, ny = dy * overlap;
          const totalMass = ra + rb;
          const aPush = rb / totalMass, bPush = ra / totalMass;
          a.pos.x -= nx * aPush; a.pos.y -= ny * aPush;
          b.pos.x += nx * bPush; b.pos.y += ny * bPush;
          const bounce = 0.6;
          a.velX -= nx * aPush * bounce; a.velY -= ny * aPush * bounce;
          b.velX += nx * bPush * bounce; b.velY += ny * bPush * bounce;
        }
      }
    }

    let hovered = null;
    if (!activeDrag) {
      const cand = hitNode(pointerScreen.x, pointerScreen.y);
      if (cand && cand.type === "project") hovered = cand;
    }
    hoveredNode = hovered;
    if (hovered) lastHoveredNode = hovered;
    hoverFade = lerp(hoverFade, hovered ? 1 : 0, hovered ? 0.05 : 0.018);

    const hubX = W / 2 + cursorSmoothed.x, hubY = H / 2 + cursorSmoothed.y;
    const idleMul = 1 - hoverFade;
    if (idleMul > 0.01) {
      nodes.forEach((n) => {
        ctx.strokeStyle = `rgba(${phase.line1},${0.07 * idleMul})`;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(n.pos.x, n.pos.y); ctx.lineTo(hubX, hubY); ctx.stroke();
        if (!reduceMotion) {
          const pt = (t * 0.25 + n.particleOffset) % 1;
          const px = lerp(n.pos.x, hubX, pt), py = lerp(n.pos.y, hubY, pt);
          ctx.fillStyle = `rgba(255,255,255,${0.5 * idleMul})`;
          ctx.beginPath(); ctx.arc(px, py, 1.3, 0, Math.PI * 2); ctx.fill();
        }
      });
    }

    if (hoverFade > 0.01 && lastHoveredNode) {
      const src = lastHoveredNode;
      nodes.forEach((n) => {
        if (n === src) return;
        const len = dist(src.pos.x, src.pos.y, n.pos.x, n.pos.y);
        const pulse = 0.25 + 0.15 * Math.sin(t * 2 + len * 0.05);
        ctx.strokeStyle = `rgba(${phase.line2},${pulse * hoverFade})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(src.pos.x, src.pos.y); ctx.lineTo(n.pos.x, n.pos.y); ctx.stroke();
        if (!reduceMotion) {
          const pt = (t * 0.4 + n.particleOffset) % 1;
          const px = lerp(src.pos.x, n.pos.x, pt), py = lerp(src.pos.y, n.pos.y, pt);
          ctx.fillStyle = `rgba(255,255,255,${0.7 * hoverFade})`;
          ctx.beginPath(); ctx.arc(px, py, 1.6, 0, Math.PI * 2); ctx.fill();
        }
      });
    }

    nodes.forEach((n) => {
      const isActiveHover = n === lastHoveredNode && hoverFade > 0.01 && !n.dragging;
      const scale = isActiveHover ? 1 + 0.15 * hoverFade : 1;
      const sizeMul = n.type === "project" ? (DATA.nodeSizeScale ?? 1) : 1;
      const r = n.baseRadius * scale * sizeMul;
      const bright = isActiveHover ? hoverFade * 0.5 : 0;
      const tint = n.type === "project" ? phase.line2 : phase.line1;
      if (isActiveHover) {
        const sg = ctx.createRadialGradient(n.pos.x + r * 0.3, n.pos.y + r * 0.5, 0, n.pos.x + r * 0.3, n.pos.y + r * 0.5, r * 2.6);
        sg.addColorStop(0, `rgba(0,0,0,${0.35 * hoverFade})`);
        sg.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = sg;
        ctx.beginPath(); ctx.arc(n.pos.x + r * 0.3, n.pos.y + r * 0.5, r * 2.6, 0, Math.PI * 2); ctx.fill();
      }
      let g = ctx.createRadialGradient(n.pos.x, n.pos.y, 0, n.pos.x, n.pos.y, r * 2.2);
      g.addColorStop(0, `rgba(${tint},${0.16 + bright})`);
      g.addColorStop(1, `rgba(${tint},0)`);
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(n.pos.x, n.pos.y, r * 2.2, 0, Math.PI * 2); ctx.fill();
      g = ctx.createRadialGradient(n.pos.x, n.pos.y, 0, n.pos.x, n.pos.y, r * 1.3);
      g.addColorStop(0, `rgba(${tint},${0.45 + bright})`);
      g.addColorStop(1, `rgba(${tint},0)`);
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(n.pos.x, n.pos.y, r * 1.3, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = `rgba(255,255,255,${0.85 + bright * 0.3})`;
      ctx.beginPath(); ctx.arc(n.pos.x, n.pos.y, r * 0.4, 0, Math.PI * 2); ctx.fill();
    });
  }

  resize();
  requestAnimationFrame(draw);
})();
