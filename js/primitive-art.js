// Primitive — page UI: image input, mode + settings, the playback queue and
// SVG / PNG export. The work runs in a Web Worker built below (workerMain);
// geometry and both algorithms live in js/primitive-art-core.js.
// Two modes: "shapes" (translucent primitives) and "line" (one unbroken line).
// See reference/primitive-art-page.md.
(function () {
  'use strict';

  const { toPathD, rgb, buildSvg, lineCtrl, lineWidth, buildLineSvg } = window.PrimitiveCore;
  const $ = (id) => document.getElementById(id);

  const DISPLAY_LONG_SIDE = 960; // backing-store size of the live canvas
  // shapes: frames per shape (rAF ≈ 60fps): slow ≈ 12 shapes/s, normal ≈ 60/s, instant = all at once
  const FRAMES_PER_SHAPE = { slow: 5, normal: 1, instant: 0 };
  // line: seconds to draw the whole line (0 = all at once)
  const LINE_SECONDS = { slow: 12, normal: 4, instant: 0 };

  const el = {
    drop: $('drop'), file: $('file'), dropImg: $('dropImg'), dropName: $('dropName'),
    dropHint: $('dropHint'), ambient: $('ambient'), barWrap: $('barWrap'),
    settings: $('settings'), shapeCtl: $('shapeCtl'), lineCtl: $('lineCtl'),
    swatches: $('swatches'), lineColor: $('lineColor'), colorOut: $('colorOut'),
    run: $('run'), exportSvg: $('exportSvg'), exportPng: $('exportPng'), exportMsg: $('exportMsg'),
    empty: $('empty'), result: $('result'), original: $('original'), canvas: $('canvas'),
    frameEmpty: $('frameEmpty'), live: $('live'), bar: $('bar'),
    expand: $('expand'), genFrame: $('genFrame'), orbitHint: $('orbitHint'),
    lightbox: $('lightbox'), lbStage: $('lbStage'), lbCount: $('lbCount'),
    lbDepth: $('lbDepth'), lbReset: $('lbReset'), lbClose: $('lbClose'),
  };

  // Shapes mode is fixed to every shape type and a 128 px working image
  // (longest side). One "Detail" level drives both search knobs: random
  // candidates and hill-climb mutations per shape (1 = the fast 50 / 20).
  const KINDS = ['triangle', 'ellipse', 'rectangle', 'bezier'];
  const WORK_RES = 128;
  const CANDIDATES_PER_LEVEL = 50, MUTATIONS_PER_LEVEL = 20;
  // Line mode works on a larger image: the line needs room to show tone.
  const LINE_RES = 320;
  const PAPER = '#f4efe6', NIGHT = '#141418'; // line backgrounds

  // settings
  const opts = {
    mode: 'shapes', count: 150, alpha: 0.5, detail: 1, points: 12000,
    lineColor: '#1b1b1f', speed: 'normal',
  };

  // run state
  let source = null;    // { name, url, img }
  let status = 'empty'; // empty | ready | running | stopped | done
  let worker = null;
  let raf = 0;
  // shapes mode
  let shapes = [];      // shapes drawn so far (what export writes)
  let geom = null;      // { w, h, bg } of the working image
  let queue = [];       // computed but not yet drawn: the worker outpaces anyone watching
  let finished = false; // the worker has sent every shape
  let runTarget = opts.count;
  let placed = 0;
  // line mode: { w, h, color, bg, invert, pts, drawn, computeP }
  // pts = null while the worker is still planning; drawn = segments drawn so far
  let line = null;
  // shapes mode, once a run has finished or been stopped: the shapes as
  // separate layers in 3D (js/primitive-art-3d.js), laid over the 2D canvas
  let layers = null;
  let layersToken = 0; // bumped on every reset so a late-loading viewer is discarded

  // A light line reads on a dark background (and its density follows
  // brightness instead of darkness); a dark line goes on paper.
  function isLight(hex) {
    const v = parseInt(hex.slice(1), 16);
    return (0.299 * (v >> 16 & 255) + 0.587 * (v >> 8 & 255) + 0.114 * (v & 255)) / 255 > 0.55;
  }

  // ------------------------------------------------------------- rendering

  function hasResult() {
    return opts.mode === 'line' ? !!(line && line.drawn > 0) : placed > 0 && !!geom;
  }

  function render() {
    const running = status === 'running';
    el.settings.disabled = running;
    el.file.disabled = running;
    el.shapeCtl.hidden = opts.mode !== 'shapes';
    el.lineCtl.hidden = opts.mode !== 'line';

    el.run.textContent = running ? 'Stop' : status === 'done' || status === 'stopped' ? 'Run again' : 'Generate';
    el.run.disabled = !running && !source;
    el.exportSvg.disabled = el.exportPng.disabled = running || !hasResult();

    el.empty.hidden = !!source;
    el.result.hidden = !source;
    if (!source) return;

    const planning = opts.mode === 'line' && running && line && !line.pts;
    el.frameEmpty.hidden = !(status === 'ready' || planning);
    el.frameEmpty.textContent = planning
      ? `Planning one line through ${opts.points.toLocaleString()} points…`
      : 'Press Generate';
    el.live.hidden = !running;
    el.expand.hidden = !layers || running;

    let p = 0;
    if (opts.mode === 'shapes') p = runTarget ? placed / runTarget : 0;
    else if (line) p = line.pts ? 0.25 + 0.75 * line.drawn / Math.max(1, line.pts.length / 2 - 1) : 0.25 * line.computeP;
    const pct = Math.round(Math.min(1, p) * 100);
    el.bar.style.width = `${pct}%`;
    el.barWrap.setAttribute('aria-valuenow', pct);
  }

  // ---------------------------------------------------------------- canvas

  function setupCanvas(w, h, fill) {
    const cv = el.canvas;
    const scale = DISPLAY_LONG_SIDE / Math.max(w, h);
    cv.width = Math.round(w * scale);
    cv.height = Math.round(h * scale);
    const ctx = cv.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = fill;
    ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
  }

  function clearCanvas() {
    const ctx = el.canvas.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, el.canvas.width, el.canvas.height);
  }

  // Same path data as the SVG export, so what you watch is what you export.
  function drawShape(s) {
    const ctx = el.canvas.getContext('2d');
    ctx.globalAlpha = s.alpha;
    ctx.fillStyle = rgb(s.color);
    ctx.fill(new Path2D(toPathD(s)));
    ctx.globalAlpha = 1;
  }

  // Line segments [from, to) as one continuous stroke — the same smoothed
  // Béziers (lineCtrl) the SVG export writes. ctx is already scaled to
  // working-image units.
  function drawLineRange(ctx, l, from, to) {
    if (to <= from) return;
    const p = l.pts;
    ctx.lineWidth = lineWidth(l.w, l.h, l.pts.length / 2);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = l.color;
    ctx.beginPath();
    ctx.moveTo(p[2 * from], p[2 * from + 1]);
    for (let k = from; k < to; k++) {
      const c = lineCtrl(p, k);
      ctx.bezierCurveTo(c[0], c[1], c[2], c[3], c[4], c[5]);
    }
    ctx.stroke();
  }

  function redrawLine() {
    setupCanvas(line.w, line.h, line.bg);
    drawLineRange(el.canvas.getContext('2d'), line, 0, line.drawn);
  }

  function downscale(img, longSide) {
    const s = longSide / Math.max(img.naturalWidth, img.naturalHeight);
    const w = Math.max(1, Math.round(img.naturalWidth * s));
    const h = Math.max(1, Math.round(img.naturalHeight * s));
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const ctx = c.getContext('2d', { willReadFrequently: true });
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, w, h);
    return { data: ctx.getImageData(0, 0, w, h).data, w, h };
  }

  // ---------------------------------------------------------------- worker

  // Runs inside the worker. Stopping = the page terminating the worker.
  //  start (shapes): init { bg, width, height, rmse } · shape { shape, index, rmse } · done
  //  startLine:      progress { p } · line { pts } · done
  function workerMain(self) {
    self.onmessage = (ev) => {
      const msg = ev.data;
      const PC = self.PrimitiveCore;
      if (msg.type === 'startLine') {
        let last = -1;
        const pts = PC.singleLine(msg.rgba, msg.width, msg.height,
          { points: msg.points, invert: msg.invert, timeBudgetMs: 3000 },
          (p) => { if (p - last >= 0.02 || p === 1) { last = p; self.postMessage({ type: 'progress', p }); } });
        self.postMessage({ type: 'line', pts }, [pts.buffer]);
        self.postMessage({ type: 'done' });
        return;
      }
      if (msg.type !== 'start') return;
      const t0 = performance.now();
      const opt = new PC.Optimizer(msg.rgba, msg.width, msg.height);
      self.postMessage({ type: 'init', bg: opt.bg, width: opt.W, height: opt.H, rmse: opt.rmsePct });
      let placed = 0;
      let misses = 0;
      // A tight synchronous loop is fine; each postMessage streams one shape.
      while (placed < msg.count && misses < 200) {
        const s = opt.step(msg.settings);
        if (!s) { misses++; continue; }
        misses = 0;
        placed++;
        self.postMessage({ type: 'shape', shape: s, index: placed, rmse: opt.rmsePct });
      }
      self.postMessage({ type: 'done', rmse: opt.rmsePct, ms: performance.now() - t0 });
    };
  }

  // The worker is built from a blob of source already on the page rather than
  // a separate .js URL: Chrome refuses `new Worker('file.js')` when the page is
  // opened from disk (file://), and this way it runs the same from disk or hosted.
  const workerUrl = URL.createObjectURL(new Blob(
    [`(${window.primitiveCore})(self);\n(${workerMain})(self);`],
    { type: 'text/javascript' },
  ));

  function stopWorker() {
    if (worker) worker.terminate();
    worker = null;
  }
  function stopPlayback() {
    cancelAnimationFrame(raf);
    queue = [];
  }

  function newWorker() {
    worker = new Worker(workerUrl);
    worker.onerror = () => {
      stop();
      setExportMsg('Something went wrong while generating. Try again.');
    };
    return worker;
  }

  // shapes: drain the queue at the chosen speed
  function playShapes() {
    let frame = 0;
    const tick = () => {
      const fps = FRAMES_PER_SHAPE[opts.speed];
      let n = fps === 0 ? queue.length : frame % fps === 0 ? 1 : 0;
      frame++;
      let last;
      while (n-- > 0 && queue.length) {
        last = queue.shift();
        shapes.push(last.shape);
        drawShape(last.shape);
      }
      if (last) placed = last.index;
      if (finished && queue.length === 0) {
        status = 'done';
        buildLayers();
        render();
        return;
      }
      render();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  }

  // line: trace the planned line, a slice of segments per frame
  function playLine() {
    const ctx = el.canvas.getContext('2d');
    const segs = line.pts.length / 2 - 1;
    const tick = () => {
      const secs = LINE_SECONDS[opts.speed];
      const per = secs ? Math.max(1, Math.ceil(segs / (secs * 60))) : segs;
      const to = Math.min(segs, line.drawn + per);
      drawLineRange(ctx, line, line.drawn, to);
      line.drawn = to;
      if (to >= segs) {
        status = 'done';
        render();
        return;
      }
      render();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  }

  function start() {
    if (!source) return;
    stopWorker();
    stopPlayback();
    dropLayers();
    setExportMsg('');
    if (opts.mode === 'line') startLine(); else startShapes();
    status = 'running';
    render();
  }

  function startShapes() {
    const { data, w, h } = downscale(source.img, WORK_RES);
    shapes = [];
    finished = false;
    placed = 0;
    runTarget = opts.count;

    newWorker().onmessage = (ev) => {
      const m = ev.data;
      if (m.type === 'init') {
        geom = { w: m.width, h: m.height, bg: m.bg };
        setupCanvas(m.width, m.height, rgb(m.bg));
        playShapes();
      } else if (m.type === 'shape') {
        queue.push(m);
      } else if (m.type === 'done') {
        finished = true;
        stopWorker();
      }
    };
    worker.postMessage({
      type: 'start', rgba: data, width: w, height: h, count: opts.count,
      settings: {
        alpha: opts.alpha, kinds: KINDS,
        candidates: opts.detail * CANDIDATES_PER_LEVEL, mutations: opts.detail * MUTATIONS_PER_LEVEL,
      },
    }, [data.buffer]);
  }

  function startLine() {
    const { data, w, h } = downscale(source.img, LINE_RES);
    const invert = isLight(opts.lineColor);
    line = { w, h, color: opts.lineColor, bg: invert ? NIGHT : PAPER, invert, pts: null, drawn: 0, computeP: 0 };
    setupCanvas(w, h, line.bg);

    newWorker().onmessage = (ev) => {
      const m = ev.data;
      if (m.type === 'progress') {
        line.computeP = m.p;
        render();
      } else if (m.type === 'line') {
        line.pts = m.pts;
        playLine();
      } else if (m.type === 'done') {
        stopWorker();
      }
    };
    worker.postMessage({ type: 'startLine', rgba: data, width: w, height: h, points: opts.points, invert }, [data.buffer]);
  }

  function stop() {
    stopWorker();
    stopPlayback();
    status = 'stopped';
    buildLayers(); // whatever was placed before stopping can still be orbited
    render();
  }

  // ------------------------------------------------------------- 3D layers

  function buildLayers() {
    if (opts.mode !== 'shapes' || !geom || !shapes.length || !window.PrimitiveLayers) return;
    const token = ++layersToken;
    window.PrimitiveLayers.create({ w: geom.w, h: geom.h, bg: rgb(geom.bg), shapes: shapes.slice() })
      .then((v) => {
        if (token !== layersToken) { v.dispose(); return; } // a newer run took over
        layers = v;
        v.setDepth(+el.lbDepth.value);
        v.onInteract(() => { el.orbitHint.hidden = true; });
        v.mount(el.genFrame, { left: false, touch: false });
        // no right-click on touch screens: point them at the lightbox instead
        el.orbitHint.textContent = matchMedia('(pointer: coarse)').matches
          ? 'Open 3D view to orbit the layers'
          : 'Right-drag to orbit the layers · Scroll to zoom';
        el.orbitHint.hidden = false;
        render();
      })
      .catch(() => { /* no WebGL or three.js unreachable: the 2D result stays, no 3D view */ });
  }

  function dropLayers() {
    layersToken++;
    if (!el.lightbox.hidden) closeLightbox(false);
    if (layers) layers.dispose();
    layers = null;
    el.orbitHint.hidden = true;
  }

  // Lightbox: the same 3D view, moved into a full-screen overlay. There a
  // plain drag (or one finger) orbits too, and pinch zooms.
  let lbReturnFocus = null;
  function openLightbox() {
    if (!layers) return;
    lbReturnFocus = document.activeElement;
    el.lbCount.textContent = layers.layers.toLocaleString();
    el.lightbox.hidden = false;
    document.body.classList.add('lb-open');
    layers.mount(el.lbStage, { left: true, touch: true });
    el.orbitHint.hidden = true;
    el.lbClose.focus();
  }
  function closeLightbox(restoreFocus) {
    el.lightbox.hidden = true;
    document.body.classList.remove('lb-open');
    if (layers) layers.mount(el.genFrame, { left: false, touch: false });
    if (restoreFocus !== false && lbReturnFocus) lbReturnFocus.focus();
  }
  el.expand.addEventListener('click', openLightbox);
  el.lbClose.addEventListener('click', () => closeLightbox());
  el.lbReset.addEventListener('click', () => layers && layers.reset());
  el.lbDepth.addEventListener('input', () => layers && layers.setDepth(+el.lbDepth.value));
  el.lightbox.addEventListener('click', (e) => { if (e.target === el.lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !el.lightbox.hidden) closeLightbox();
  });

  // Drop any result and show the empty "Press Generate" frame.
  function resetResult() {
    stopWorker();
    stopPlayback();
    dropLayers();
    shapes = [];
    geom = null;
    placed = 0;
    runTarget = opts.count;
    line = null;
    clearCanvas();
    setExportMsg('');
    status = source ? 'ready' : 'empty';
  }

  // ----------------------------------------------------------------- input

  function loadUrl(name, url, autoRun) {
    stopWorker();
    stopPlayback();
    const img = new Image();
    img.onload = () => {
      if (source && source.url.startsWith('blob:')) URL.revokeObjectURL(source.url);
      source = { name, url, img };
      el.original.src = url;
      el.ambient.src = url;
      el.dropImg.src = url;
      el.dropImg.hidden = false;
      el.dropName.textContent = name;
      el.dropHint.textContent = 'Click or drop to replace';
      // both frames take the image's own proportions (see .frame in the CSS)
      el.result.style.setProperty('--ar', img.naturalWidth / img.naturalHeight);
      // portrait images sit side by side; landscape ones stack
      el.result.classList.toggle('side', img.naturalWidth < img.naturalHeight);
      resetResult();
      if (autoRun) start(); else render();
    };
    img.onerror = () => setExportMsg('That file couldn’t be read as an image.');
    img.src = url;
  }

  function loadFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    loadUrl(file.name, URL.createObjectURL(file), false);
  }

  el.file.addEventListener('change', () => { loadFile(el.file.files[0]); el.file.value = ''; });
  el.drop.addEventListener('dragover', (e) => { e.preventDefault(); el.drop.classList.add('is-drag'); });
  el.drop.addEventListener('dragleave', () => el.drop.classList.remove('is-drag'));
  el.drop.addEventListener('drop', (e) => {
    e.preventDefault();
    el.drop.classList.remove('is-drag');
    if (status !== 'running') loadFile(e.dataTransfer.files[0]);
  });

  // ranges: value → opts + its <output>
  const ranges = {
    count: (v) => v, alpha: (v) => v.toFixed(2), detail: (v) => v, points: (v) => v.toLocaleString(),
  };
  for (const key of Object.keys(ranges)) {
    const input = $(key), out = $(key + 'Out');
    out.textContent = ranges[key](+input.value);
    input.addEventListener('input', () => {
      opts[key] = +input.value;
      out.textContent = ranges[key](opts[key]);
      render();
    });
  }

  function segmented(id, onPick) {
    const seg = $(id);
    seg.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      for (const x of seg.querySelectorAll('button')) x.classList.toggle('on', x === b);
      onPick(b.dataset.v);
    });
  }
  segmented('speedSeg', (v) => { opts.speed = v; }); // takes effect mid-run too
  // Switching mode starts a fresh run in the new mode right away.
  segmented('modeSeg', (v) => {
    if (v === opts.mode) return;
    opts.mode = v;
    resetResult();
    if (source) start(); else render();
  });

  // Line colour: a dark ↔ light switch flips the background and which tones
  // get ink, so it re-plans the line; otherwise it just recolours what's there.
  function setLineColor(hex) {
    hex = hex.toLowerCase();
    opts.lineColor = hex;
    el.colorOut.textContent = hex.toUpperCase();
    el.lineColor.value = hex;
    for (const b of el.swatches.querySelectorAll('button')) {
      const on = b.dataset.c === hex;
      b.classList.toggle('on', on);
      b.setAttribute('aria-checked', on);
    }
    el.lineColor.parentElement.classList.toggle('on', !el.swatches.querySelector('button.on'));
    if (!line || status === 'running') return;
    if (line.pts && isLight(hex) === line.invert) {
      line.color = hex;
      redrawLine();
    } else if (source) {
      start();
    }
  }
  el.swatches.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (b) setLineColor(b.dataset.c);
  });
  el.lineColor.addEventListener('input', () => setLineColor(el.lineColor.value));

  el.run.addEventListener('click', () => (status === 'running' ? stop() : start()));

  // ---------------------------------------------------------------- export

  function setExportMsg(text) {
    el.exportMsg.textContent = text;
    el.exportMsg.hidden = !text;
  }

  const PNG_LONG_SIDE = 2048; // PNG export size: it's all vectors, so render big and sharp

  function download(blob, ext) {
    const base = source ? source.name.replace(/\.[^.]+$/, '') : 'primitive';
    const tag = opts.mode === 'line' ? 'single-line' : `${shapes.length}shapes`;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${base}-${tag}.${ext}`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  el.exportSvg.addEventListener('click', () => {
    let svg;
    if (opts.mode === 'line') {
      if (!line || !line.drawn) return;
      // only what's been drawn, in case the run was stopped part-way
      svg = buildLineSvg(line.w, line.h, line.bg, line.color, line.pts.subarray(0, (line.drawn + 1) * 2),
        lineWidth(line.w, line.h, line.pts.length / 2));
    } else {
      if (!geom) return;
      svg = buildSvg(geom.w, geom.h, geom.bg, shapes);
    }
    download(new Blob([svg], { type: 'image/svg+xml' }), 'svg');
  });

  // Redraws the result (same paths as the SVG) on a fresh canvas at
  // PNG_LONG_SIDE, rather than saving the on-screen preview canvas.
  el.exportPng.addEventListener('click', () => {
    const isLine = opts.mode === 'line';
    if (isLine ? !(line && line.drawn) : !geom) return;
    const w = isLine ? line.w : geom.w, h = isLine ? line.h : geom.h;
    const scale = PNG_LONG_SIDE / Math.max(w, h);
    const c = document.createElement('canvas');
    c.width = Math.round(w * scale);
    c.height = Math.round(h * scale);
    const ctx = c.getContext('2d');
    ctx.fillStyle = isLine ? line.bg : rgb(geom.bg);
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    if (isLine) {
      drawLineRange(ctx, line, 0, line.drawn);
    } else {
      for (const s of shapes) {
        ctx.globalAlpha = s.alpha;
        ctx.fillStyle = rgb(s.color);
        ctx.fill(new Path2D(toPathD(s)));
      }
    }
    c.toBlob((blob) => {
      if (blob) download(blob, 'png');
      else setExportMsg('PNG export isn’t available in this browser.');
    }, 'image/png');
  });

  // ---------------------------------------------------------------- sample

  // A procedurally drawn dusk scene so the page opens in a working state.
  function makeSampleImage() {
    const W = 640, H = 420;
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    const g = c.getContext('2d');
    const sky = g.createLinearGradient(0, 0, 0, H * 0.62);
    sky.addColorStop(0, '#1d2b5a');
    sky.addColorStop(0.55, '#b04a5a');
    sky.addColorStop(1, '#f2a65a');
    g.fillStyle = sky; g.fillRect(0, 0, W, H);
    const sun = g.createRadialGradient(430, 230, 10, 430, 230, 120);
    sun.addColorStop(0, '#fff2c4'); sun.addColorStop(0.35, '#ffd27a'); sun.addColorStop(1, 'rgba(255,190,110,0)');
    g.fillStyle = sun; g.beginPath(); g.arc(430, 230, 120, 0, Math.PI * 2); g.fill();
    const ridge = (base, amp, seed, color) => {
      g.fillStyle = color; g.beginPath(); g.moveTo(0, H);
      for (let x = 0; x <= W; x += 8) {
        const y = base - amp * (0.6 * Math.sin(x / 70 + seed) + 0.3 * Math.sin(x / 23 + seed * 2) + 0.1 * Math.sin(x / 9 + seed));
        g.lineTo(x, y);
      }
      g.lineTo(W, H); g.closePath(); g.fill();
    };
    ridge(250, 40, 1.3, '#6b3a5a');
    ridge(285, 30, 4.1, '#3d2645');
    const sea = g.createLinearGradient(0, 290, 0, H);
    sea.addColorStop(0, '#e08a5c'); sea.addColorStop(1, '#2a2240');
    g.fillStyle = sea; g.fillRect(0, 290, W, H - 290);
    g.fillStyle = 'rgba(255,230,170,0.55)';
    for (let i = 0; i < 14; i++) {
      const y = 298 + i * 9, w = 120 - i * 7;
      g.fillRect(430 - w / 2 + Math.sin(i) * 10, y, w, 2.5);
    }
    return c.toDataURL('image/png');
  }

  // ----------------------------------------------------------- liquid glass

  // Chromium only: each .glass piece refracts what's behind it, a displacement
  // map that bends the backdrop outward near the rounded edges, like light
  // through a thick lens rim. Same technique as Valley Drive; elsewhere the
  // glass stays a plain blur (see .glass in the CSS).
  const LIQUID = /Chrome\/\d+/.test(navigator.userAgent) && window.CSS && CSS.supports('backdrop-filter', 'url(#x)');
  const lgDefs = $('lgDefs'), SVGNS = 'http://www.w3.org/2000/svg';
  function glassMap(w, h, rad) {
    const cv = document.createElement('canvas');
    cv.width = w; cv.height = h;
    const ctx = cv.getContext('2d'), img = ctx.createImageData(w, h);
    const bezel = Math.min(24, Math.min(w, h) * 0.32);
    const sdf = (x, y) => { // signed distance to the rounded rect (negative inside)
      const qx = Math.abs(x - w / 2) - (w / 2 - rad), qy = Math.abs(y - h / 2) - (h / 2 - rad);
      return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - rad;
    };
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4, px = x + 0.5, py = y + 0.5, d = -sdf(px, py);
      let r = 128, g = 128;
      if (d < bezel) {
        const gx = sdf(px + 1, py) - sdf(px - 1, py), gy = sdf(px, py + 1) - sdf(px, py - 1), gl = Math.hypot(gx, gy) || 1;
        const t = Math.pow(1 - Math.max(0, d) / bezel, 2);
        r = 128 + (gx / gl) * t * 127; g = 128 + (gy / gl) * t * 127;
      }
      img.data[i] = r; img.data[i + 1] = g; img.data[i + 2] = 128; img.data[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    return cv.toDataURL();
  }
  function liquidGlass(node, n) {
    const id = 'lg' + n;
    const f = document.createElementNS(SVGNS, 'filter');
    f.setAttribute('id', id);
    f.setAttribute('filterUnits', 'userSpaceOnUse');
    f.setAttribute('primitiveUnits', 'userSpaceOnUse');
    f.setAttribute('color-interpolation-filters', 'sRGB');
    const im = document.createElementNS(SVGNS, 'feImage');
    im.setAttribute('result', 'map');
    im.setAttribute('preserveAspectRatio', 'none');
    const dm = document.createElementNS(SVGNS, 'feDisplacementMap');
    dm.setAttribute('in', 'SourceGraphic'); dm.setAttribute('in2', 'map');
    dm.setAttribute('xChannelSelector', 'R'); dm.setAttribute('yChannelSelector', 'G');
    f.append(im, dm);
    lgDefs.appendChild(f);
    let last = '';
    const build = () => {
      const w = Math.round(node.offsetWidth), h = Math.round(node.offsetHeight);
      if (!w || !h || last === w + 'x' + h) return;
      last = w + 'x' + h;
      const rad = Math.min(parseFloat(getComputedStyle(node).borderTopLeftRadius) || 0, w / 2, h / 2);
      for (const [a, v] of [['x', 0], ['y', 0], ['width', w], ['height', h]]) { f.setAttribute(a, v); im.setAttribute(a, v); }
      im.setAttribute('href', glassMap(w, h, rad));
      dm.setAttribute('scale', Math.round(Math.min(46, Math.min(w, h) * 0.55)));
      node.style.backdropFilter = `url(#${id}) blur(18px) saturate(1.5) brightness(1.06)`;
    };
    new ResizeObserver(build).observe(node);
    build();
  }
  if (LIQUID) document.querySelectorAll('.glass').forEach(liquidGlass);

  render();
  loadUrl('sample-dusk.png', makeSampleImage(), true);
})();
