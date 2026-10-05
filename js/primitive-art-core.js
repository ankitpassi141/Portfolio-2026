// Primitive — shape geometry + optimizer. Shared by the page (js/primitive-art.js,
// for drawing and SVG export) and its worker (built in that file from this
// function's source, so it also runs from file://). No DOM in here: it has to
// run inside the worker. See reference/primitive-art-page.md.
function primitiveCore(root) {
  'use strict';

  const ALL_KINDS = ['triangle', 'rectangle', 'ellipse', 'bezier'];

  /*
   * Parameter layouts (all in working-resolution pixel space):
   *  triangle : [x1, y1, x2, y2, x3, y3]
   *  rectangle: [cx, cy, w, h, angleRad]
   *  ellipse  : [cx, cy, rx, ry, angleRad]
   *  bezier   : [x0, y0, c1x, c1y, c2x, c2y, x3, y3]  (closed, filled cubic segment)
   */

  function gauss(rng) {
    let u = 0;
    while (u === 0) u = rng();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rng());
  }

  // ------------------------------------------------------------ generation

  function randomShape(kind, W, H, rng) {
    const L = Math.max(W, H);
    const cx = rng() * W;
    const cy = rng() * H;
    // Bias toward smaller shapes but allow big ones (early shapes need them).
    const size = () => 2 + Math.pow(rng(), 2) * L * 0.5;
    switch (kind) {
      case 'triangle': {
        const s = size();
        const p = [];
        for (let i = 0; i < 3; i++) p.push(cx + (rng() * 2 - 1) * s, cy + (rng() * 2 - 1) * s);
        return { kind, p };
      }
      case 'rectangle':
        return { kind, p: [cx, cy, size(), size(), rng() * Math.PI] };
      case 'ellipse':
        return { kind, p: [cx, cy, size() / 2, size() / 2, rng() * Math.PI] };
      case 'bezier': {
        const s = size();
        const p = [];
        for (let i = 0; i < 4; i++) p.push(cx + (rng() * 2 - 1) * s, cy + (rng() * 2 - 1) * s);
        return { kind, p };
      }
    }
  }

  // -------------------------------------------------------------- mutation

  function mutate(s, W, H, rng) {
    const p = s.p.slice();
    const L = Math.max(W, H);
    const step = L / 16;
    const clampX = (v) => Math.min(W + L * 0.25, Math.max(-L * 0.25, v));
    const clampY = (v) => Math.min(H + L * 0.25, Math.max(-L * 0.25, v));

    if (s.kind === 'triangle' || s.kind === 'bezier') {
      const i = Math.floor(rng() * (p.length / 2)) * 2;
      p[i] = clampX(p[i] + gauss(rng) * step);
      p[i + 1] = clampY(p[i + 1] + gauss(rng) * step);
    } else {
      // rectangle / ellipse: move, resize, or rotate
      const r = Math.floor(rng() * 3);
      if (r === 0) {
        p[0] = clampX(p[0] + gauss(rng) * step);
        p[1] = clampY(p[1] + gauss(rng) * step);
      } else if (r === 1) {
        const minS = s.kind === 'ellipse' ? 1 : 2;
        p[2] = Math.min(L, Math.max(minS, p[2] + gauss(rng) * step));
        p[3] = Math.min(L, Math.max(minS, p[3] + gauss(rng) * step));
      } else {
        p[4] = p[4] + gauss(rng) * 0.4;
      }
    }
    return { kind: s.kind, p };
  }

  // --------------------------------------------------------- polygonizing

  function cubicPoint(p, t) {
    const u = 1 - t;
    const a = u * u * u, b = 3 * u * u * t, c = 3 * u * t * t, d = t * t * t;
    return [
      a * p[0] + b * p[2] + c * p[4] + d * p[6],
      a * p[1] + b * p[3] + c * p[5] + d * p[7],
    ];
  }

  // Flat [x0,y0,x1,y1,...] polygon approximating the shape, for rasterization.
  function toPolygon(s) {
    const p = s.p;
    switch (s.kind) {
      case 'triangle':
        return p;
      case 'rectangle': {
        const [cx, cy, w, h, a] = p;
        const c = Math.cos(a), sn = Math.sin(a);
        const hw = w / 2, hh = h / 2;
        const out = [];
        for (const [dx, dy] of [[-hw, -hh], [hw, -hh], [hw, hh], [-hw, hh]]) {
          out.push(cx + dx * c - dy * sn, cy + dx * sn + dy * c);
        }
        return out;
      }
      case 'ellipse': {
        const [cx, cy, rx, ry, a] = p;
        const c = Math.cos(a), sn = Math.sin(a);
        const N = 28;
        const out = [];
        for (let i = 0; i < N; i++) {
          const t = (i / N) * Math.PI * 2;
          const x = Math.cos(t) * rx, y = Math.sin(t) * ry;
          out.push(cx + x * c - y * sn, cy + x * sn + y * c);
        }
        return out;
      }
      case 'bezier': {
        const N = 24;
        const out = [];
        for (let i = 0; i <= N; i++) {
          const [x, y] = cubicPoint(p, i / N);
          out.push(x, y);
        }
        return out; // closed implicitly back to start
      }
    }
  }

  // -------------------------------------------------------- rasterization

  // Scanline fill with the non-zero winding rule (matches SVG/canvas default),
  // sampling at pixel centres. Writes spans as triples [y, xStart, xEnd]
  // (inclusive) into `out` (an Int32Array) and returns the number of ints written.
  function rasterize(s, W, H, out) {
    const poly = toPolygon(s);
    const n = poly.length / 2;
    let minY = Infinity, maxY = -Infinity;
    for (let i = 1; i < poly.length; i += 2) {
      if (poly[i] < minY) minY = poly[i];
      if (poly[i] > maxY) maxY = poly[i];
    }
    const y0 = Math.max(0, Math.ceil(minY - 0.5));
    const y1 = Math.min(H - 1, Math.floor(maxY - 0.5));
    const xs = [];
    const ds = [];
    let len = 0;

    for (let y = y0; y <= y1; y++) {
      const sy = y + 0.5;
      xs.length = 0;
      ds.length = 0;
      for (let i = 0; i < n; i++) {
        const j = (i + 1) % n;
        const xi = poly[2 * i], yi = poly[2 * i + 1];
        const xj = poly[2 * j], yj = poly[2 * j + 1];
        let d;
        if (yi <= sy && yj > sy) d = 1;
        else if (yj <= sy && yi > sy) d = -1;
        else continue;
        const x = xi + ((sy - yi) * (xj - xi)) / (yj - yi);
        // insertion sort by x
        let k = xs.length;
        xs.push(x);
        ds.push(d);
        while (k > 0 && xs[k - 1] > x) {
          xs[k] = xs[k - 1];
          ds[k] = ds[k - 1];
          k--;
        }
        xs[k] = x;
        ds[k] = d;
      }
      let wind = 0;
      let start = 0;
      for (let k = 0; k < xs.length; k++) {
        const prev = wind;
        wind += ds[k];
        if (prev === 0 && wind !== 0) start = xs[k];
        else if (prev !== 0 && wind === 0) {
          const xa = Math.max(0, Math.ceil(start - 0.5));
          const xb = Math.min(W - 1, Math.ceil(xs[k] - 0.5) - 1);
          if (xa <= xb && len + 3 <= out.length) {
            out[len++] = y;
            out[len++] = xa;
            out[len++] = xb;
          }
        }
      }
    }
    return len;
  }

  // ------------------------------------------------------------ SVG paths

  const f = (v) => {
    const r = Math.round(v * 100) / 100;
    return Object.is(r, -0) ? '0' : String(r);
  };

  // SVG path data for the shape (exact curves, not the polygon approximation).
  // The live canvas and the SVG export both draw from this, so the export is
  // exactly what you watched.
  function toPathD(s) {
    const p = s.p;
    switch (s.kind) {
      case 'triangle':
        return `M${f(p[0])} ${f(p[1])}L${f(p[2])} ${f(p[3])}L${f(p[4])} ${f(p[5])}Z`;
      case 'rectangle': {
        const q = toPolygon(s);
        return `M${f(q[0])} ${f(q[1])}L${f(q[2])} ${f(q[3])}L${f(q[4])} ${f(q[5])}L${f(q[6])} ${f(q[7])}Z`;
      }
      case 'ellipse': {
        const [cx, cy, rx, ry, a] = p;
        const dx = Math.cos(a) * rx, dy = Math.sin(a) * rx;
        const deg = f((a * 180) / Math.PI);
        return (
          `M${f(cx + dx)} ${f(cy + dy)}` +
          `A${f(rx)} ${f(ry)} ${deg} 1 1 ${f(cx - dx)} ${f(cy - dy)}` +
          `A${f(rx)} ${f(ry)} ${deg} 1 1 ${f(cx + dx)} ${f(cy + dy)}Z`
        );
      }
      case 'bezier':
        return `M${f(p[0])} ${f(p[1])}C${f(p[2])} ${f(p[3])} ${f(p[4])} ${f(p[5])} ${f(p[6])} ${f(p[7])}Z`;
    }
  }

  function rgb(c) {
    return `rgb(${c[0]},${c[1]},${c[2]})`;
  }

  function buildSvg(W, H, bg, shapes) {
    // each shape is its own named layer (Figma / Illustrator import them as layers)
    const lines = shapes.map(
      (s, i) => `<path id="layer-${i + 1}" d="${toPathD(s)}" fill="${rgb(s.color)}" fill-opacity="${f(s.alpha)}"/>`,
    );
    // viewBox in working-res units; width/height just set a default display size.
    const scale = 1024 / Math.max(W, H);
    return [
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${Math.round(W * scale)}" height="${Math.round(H * scale)}">`,
      `<rect width="${W}" height="${H}" fill="${rgb(bg)}"/>`,
      ...lines,
      `</svg>`,
    ].join('\n');
  }

  // ------------------------------------------------------------- optimizer

  // Greedy sequential hill-climbing: per shape, N random candidates, keep the
  // one with the biggest drop in squared RGB error, then M mutations of it
  // keeping strict improvements, then commit.
  class Optimizer {
    constructor(rgba, W, H, rng) {
      this.rng = rng || Math.random;
      this.W = W;
      this.H = H;
      const N = W * H;
      this.target = new Float32Array(N * 3); // RGB, 3 floats per pixel
      let r = 0, g = 0, b = 0;
      for (let i = 0; i < N; i++) {
        // Composite any transparency over white so PNGs with alpha behave.
        const a = rgba[i * 4 + 3] / 255;
        const R = rgba[i * 4] * a + 255 * (1 - a);
        const G = rgba[i * 4 + 1] * a + 255 * (1 - a);
        const B = rgba[i * 4 + 2] * a + 255 * (1 - a);
        this.target[i * 3] = R;
        this.target[i * 3 + 1] = G;
        this.target[i * 3 + 2] = B;
        r += R; g += G; b += B;
      }
      this.bg = [Math.round(r / N), Math.round(g / N), Math.round(b / N)];
      this.current = new Float32Array(N * 3);
      let err = 0;
      for (let i = 0; i < N * 3; i++) {
        const v = this.bg[i % 3];
        this.current[i] = v;
        const d = v - this.target[i];
        err += d * d;
      }
      this.error = err; // total squared error over all channels
      // Worst case a shape covers every pixel as one span per row; nonzero fills
      // can produce several spans per row, so give generous headroom.
      this.spans = new Int32Array(H * 3 * 16);
      this.bestSpans = new Int32Array(H * 3 * 16);
    }

    // RMSE as a percentage of full scale (0-100).
    get rmsePct() {
      return (Math.sqrt(this.error / (this.W * this.H * 3)) / 255) * 100;
    }

    // Error-optimal colour for a shape drawn at alpha `a` over the current canvas.
    // Per pixel: new = (1-a)·cur + a·c. Minimising Σ(new − target)² over the mask
    // gives c = (mean(target) − (1−a)·mean(cur)) / a. (Plain mean(target) is only
    // optimal when a = 1.)
    evaluate(spans, len, a) {
      const W = this.W, T = this.target, C = this.current;
      let tr = 0, tg = 0, tb = 0, cr = 0, cg = 0, cb = 0, n = 0;
      for (let k = 0; k < len; k += 3) {
        const row = spans[k] * W;
        for (let x = spans[k + 1], xe = spans[k + 2]; x <= xe; x++) {
          const i = (row + x) * 3;
          tr += T[i]; tg += T[i + 1]; tb += T[i + 2];
          cr += C[i]; cg += C[i + 1]; cb += C[i + 2];
          n++;
        }
      }
      if (n === 0) return null;
      const solve = (t, c) => Math.max(0, Math.min(255, Math.round((t / n - (1 - a) * (c / n)) / a)));
      const color = [solve(tr, cr), solve(tg, cg), solve(tb, cb)];

      let delta = 0;
      const R = color[0], G = color[1], B = color[2];
      for (let k = 0; k < len; k += 3) {
        const row = spans[k] * W;
        for (let x = spans[k + 1], xe = spans[k + 2]; x <= xe; x++) {
          const i = (row + x) * 3;
          let c = C[i], t = T[i], nv = c + (R - c) * a;
          delta += (nv - t) * (nv - t) - (c - t) * (c - t);
          c = C[i + 1]; t = T[i + 1]; nv = c + (G - c) * a;
          delta += (nv - t) * (nv - t) - (c - t) * (c - t);
          c = C[i + 2]; t = T[i + 2]; nv = c + (B - c) * a;
          delta += (nv - t) * (nv - t) - (c - t) * (c - t);
        }
      }
      return { delta, color };
    }

    // Find and commit one shape. Returns null if no candidate improved the
    // image (rare; the caller just calls again).
    step(st) {
      const W = this.W, H = this.H, rng = this.rng;
      const a = st.alpha;
      let best = null, bestE = null, bestLen = 0;

      const consider = (s) => {
        const len = rasterize(s, W, H, this.spans);
        const e = this.evaluate(this.spans, len, a);
        if (e && (!bestE || e.delta < bestE.delta)) {
          best = s;
          bestE = e;
          bestLen = len;
          // keep the winning mask so commit doesn't need to re-rasterize
          this.bestSpans.set(this.spans.subarray(0, len));
        }
      };

      // 1) random candidates
      for (let i = 0; i < st.candidates; i++) {
        const kind = st.kinds[Math.floor(rng() * st.kinds.length)];
        consider(randomShape(kind, W, H, rng));
      }
      if (!best) return null;

      // 2) hill-climb: mutate the incumbent, keep strict improvements
      for (let i = 0; i < st.mutations; i++) consider(mutate(best, W, H, rng));

      if (!bestE || bestE.delta >= 0) return null;

      // 3) commit
      const [R, G, B] = bestE.color;
      const C = this.current;
      const sp = this.bestSpans;
      for (let k = 0; k < bestLen; k += 3) {
        const row = sp[k] * W;
        for (let x = sp[k + 1], xe = sp[k + 2]; x <= xe; x++) {
          const i = (row + x) * 3;
          C[i] += (R - C[i]) * a;
          C[i + 1] += (G - C[i + 1]) * a;
          C[i + 2] += (B - C[i + 2]) * a;
        }
      }
      this.error += bestE.delta;
      return { kind: best.kind, p: best.p, color: bestE.color, alpha: a };
    }
  }

  // ======================================================== single line mode
  //
  // The whole image as one unbroken line ("TSP art"):
  //  1. tone   — luminance per pixel, contrast-stretched; ink density = darkness
  //              (or brightness, for a light line on a dark background)
  //  2. points — N dots scattered with that density, then evened out with
  //              weighted Lloyd relaxation (stippling)
  //  3. route  — one open path through every dot: Hilbert-curve order, then
  //              2-opt with neighbour lists, which also removes self-crossings
  //  4. draw   — the path is smoothed into cubic Béziers (Catmull-Rom), shared
  //              by the canvas, the SVG and the PNG
  // Dense dots in dark areas = tight loops = dark; sparse dots = light.

  // Spatial hash over points, for nearest-point queries.
  function buildGrid(px, py, n, W, H, cs) {
    const gw = Math.ceil(W / cs) + 1, gh = Math.ceil(H / cs) + 1;
    const start = new Int32Array(gw * gh + 1);
    const cell = new Int32Array(n);
    for (let i = 0; i < n; i++) {
      const cx = Math.min(gw - 1, Math.max(0, Math.floor(px[i] / cs)));
      const cy = Math.min(gh - 1, Math.max(0, Math.floor(py[i] / cs)));
      cell[i] = cy * gw + cx;
      start[cell[i] + 1]++;
    }
    for (let c = 0; c < gw * gh; c++) start[c + 1] += start[c];
    const fill = start.slice(0, gw * gh);
    const items = new Int32Array(n);
    for (let i = 0; i < n; i++) items[fill[cell[i]]++] = i;
    return { gw, gh, cs, start, items };
  }

  // Up to k nearest points to (x, y), excluding `skip`; returns indices nearest-first.
  function kNearest(g, px, py, x, y, k, skip) {
    const { gw, gh, cs, start, items } = g;
    const cx = Math.min(gw - 1, Math.max(0, Math.floor(x / cs)));
    const cy = Math.min(gh - 1, Math.max(0, Math.floor(y / cs)));
    const bestI = [], bestD = [];
    const maxR = Math.max(gw, gh);
    for (let r = 0; r <= maxR; r++) {
      for (let gy = cy - r; gy <= cy + r; gy++) {
        if (gy < 0 || gy >= gh) continue;
        const edgeRow = gy === cy - r || gy === cy + r;
        for (let gx = cx - r; gx <= cx + r; gx += edgeRow ? 1 : 2 * r || 1) {
          if (gx < 0 || gx >= gw) continue;
          const c = gy * gw + gx;
          for (let t = start[c]; t < start[c + 1]; t++) {
            const i = items[t];
            if (i === skip) continue;
            const dx = px[i] - x, dy = py[i] - y, d = dx * dx + dy * dy;
            if (bestI.length < k || d < bestD[bestD.length - 1]) {
              let s = bestI.length < k ? bestI.length : bestI.length - 1;
              bestI[s] = i; bestD[s] = d;
              while (s > 0 && bestD[s - 1] > d) {
                bestI[s] = bestI[s - 1]; bestD[s] = bestD[s - 1];
                bestI[s - 1] = i; bestD[s - 1] = d;
                s--;
              }
            }
          }
        }
      }
      // every point in ring r+1 is at least r·cs away
      if (bestI.length >= k && bestD[bestD.length - 1] <= (r * cs) * (r * cs)) break;
    }
    return bestI;
  }

  // Single nearest point to (x, y): the hot path of the stippling step.
  function nearest1(g, px, py, x, y) {
    const { gw, gh, cs, start, items } = g;
    const cx = Math.min(gw - 1, Math.max(0, Math.floor(x / cs)));
    const cy = Math.min(gh - 1, Math.max(0, Math.floor(y / cs)));
    let best = -1, bd = Infinity;
    const maxR = Math.max(gw, gh);
    for (let r = 0; r <= maxR; r++) {
      for (let gy = cy - r; gy <= cy + r; gy++) {
        if (gy < 0 || gy >= gh) continue;
        const edgeRow = gy === cy - r || gy === cy + r;
        for (let gx = cx - r; gx <= cx + r; gx += edgeRow ? 1 : 2 * r || 1) {
          if (gx < 0 || gx >= gw) continue;
          const c = gy * gw + gx;
          for (let t = start[c]; t < start[c + 1]; t++) {
            const i = items[t];
            const dx = px[i] - x, dy = py[i] - y, d = dx * dx + dy * dy;
            if (d < bd) { bd = d; best = i; }
          }
        }
      }
      if (best >= 0 && bd <= (r * cs) * (r * cs)) break;
    }
    return best;
  }

  // Index along a Hilbert curve on a 2^order grid, for a good starting route.
  function hilbertIndex(order, x, y) {
    let d = 0;
    for (let s = 1 << (order - 1); s > 0; s >>= 1) {
      const rx = (x & s) > 0 ? 1 : 0, ry = (y & s) > 0 ? 1 : 0;
      d += s * s * ((3 * rx) ^ ry);
      if (ry === 0) {
        if (rx === 1) { x = s - 1 - x; y = s - 1 - y; }
        const t = x; x = y; y = t;
      }
    }
    return d;
  }

  // rgba → ordered points [x0, y0, x1, y1, ...] of one continuous line.
  // opts: { points, invert, timeBudgetMs }; progress(p) gets 0..1.
  function singleLine(rgba, W, H, opts, progress, rng) {
    rng = rng || Math.random;
    progress = progress || (() => {});
    const N = W * H;
    const n = Math.max(2, opts.points | 0);
    const gamma = opts.gamma || 3.2, floor = opts.floor != null ? opts.floor : 0.01;

    // 1) tone → density
    const lum = new Float32Array(N);
    const hist = new Uint32Array(256);
    for (let i = 0; i < N; i++) {
      const a = rgba[i * 4 + 3] / 255;
      const R = rgba[i * 4] * a + 255 * (1 - a);
      const G = rgba[i * 4 + 1] * a + 255 * (1 - a);
      const B = rgba[i * 4 + 2] * a + 255 * (1 - a);
      const l = (0.299 * R + 0.587 * G + 0.114 * B) / 255;
      lum[i] = l;
      hist[Math.min(255, Math.round(l * 255))]++;
    }
    // stretch the 1st–99th percentile to full range so flat images still read
    let acc = 0, lo = 0, hi = 255;
    for (let v = 0; v < 256; v++) { acc += hist[v]; if (acc >= N * 0.01) { lo = v; break; } }
    acc = 0;
    for (let v = 255; v >= 0; v--) { acc += hist[v]; if (acc >= N * 0.01) { hi = v; break; } }
    const span = Math.max(1, hi - lo) / 255, lo01 = lo / 255;
    // histogram equalisation, blended in: spreads crowded tones (a mostly-dark
    // photo) across the range so shapes separate. 0 = plain stretch, 1 = full.
    const eq = opts.equalize != null ? opts.equalize : 0.6;
    const cdf = new Float32Array(256);
    for (let v = 0, c = 0; v < 256; v++) { c += hist[v]; cdf[v] = c / N; }
    const rho = new Float32Array(N);
    let rhoMax = 0;
    for (let i = 0; i < N; i++) {
      let t = Math.min(1, Math.max(0, (lum[i] - lo01) / span));
      t = (1 - eq) * t + eq * cdf[Math.min(255, Math.round(lum[i] * 255))];
      if (!opts.invert) t = 1 - t;            // ink where it's dark
      const r = Math.pow(t, gamma) + floor;   // a little ink everywhere keeps the line flowing
      rho[i] = r;
      if (r > rhoMax) rhoMax = r;
    }

    // 2) scatter n dots with that density (rejection sampling)...
    const px = new Float32Array(n), py = new Float32Array(n);
    for (let i = 0, tries = 0; i < n; tries++) {
      const x = rng() * W, y = rng() * H;
      const r = rho[Math.min(H - 1, y | 0) * W + Math.min(W - 1, x | 0)];
      if (rng() * rhoMax < r || tries > n * 400) { px[i] = x; py[i] = y; i++; }
    }
    // ...then even them out: move each dot to the density-weighted centroid
    // of the pixels nearest to it (weighted Lloyd / Voronoi stippling).
    const ITER = 14;
    const sx = new Float64Array(n), sy = new Float64Array(n), sw = new Float64Array(n);
    const cs = Math.max(1, Math.sqrt(N / n));
    for (let it = 0; it < ITER; it++) {
      const g = buildGrid(px, py, n, W, H, cs);
      sx.fill(0); sy.fill(0); sw.fill(0);
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const w = rho[y * W + x];
          const j = nearest1(g, px, py, x + 0.5, y + 0.5);
          sx[j] += w * (x + 0.5); sy[j] += w * (y + 0.5); sw[j] += w;
        }
      }
      for (let j = 0; j < n; j++) {
        if (sw[j] > 0) { px[j] = sx[j] / sw[j]; py[j] = sy[j] / sw[j]; }
      }
      progress(0.6 * (it + 1) / ITER);
    }

    // 3) route: Hilbert order...
    let order = 1;
    while ((1 << order) < Math.max(W, H)) order++;
    const hk = new Float64Array(n);
    const idx = new Array(n);
    for (let i = 0; i < n; i++) {
      idx[i] = i;
      hk[i] = hilbertIndex(order, Math.min((1 << order) - 1, px[i] | 0), Math.min((1 << order) - 1, py[i] | 0));
    }
    idx.sort((a, b) => hk[a] - hk[b]);
    const tour = Int32Array.from(idx);
    const pos = new Int32Array(n);
    for (let i = 0; i < n; i++) pos[tour[i]] = i;

    // ...then 2-opt over each dot's K nearest neighbours, with a work queue
    // ("don't look bits") so settled parts of the line aren't re-checked.
    const K = 8;
    const g = buildGrid(px, py, n, W, H, cs);
    const neigh = new Int32Array(n * K).fill(-1);
    for (let i = 0; i < n; i++) {
      const nb = kNearest(g, px, py, px[i], py[i], K, i);
      for (let k = 0; k < nb.length; k++) neigh[i * K + k] = nb[k];
    }
    const dist = (a, b) => Math.hypot(px[a] - px[b], py[a] - py[b]);
    const reverse = (i, j) => { // reverse tour[i..j] in place
      while (i < j) {
        const a = tour[i], b = tour[j];
        tour[i] = b; pos[b] = i; tour[j] = a; pos[a] = j;
        i++; j--;
      }
    };
    const queue = Array.from(tour);
    const queued = new Uint8Array(n).fill(1);
    const push = (c) => { if (c >= 0 && !queued[c]) { queued[c] = 1; queue.push(c); } };
    const t0 = Date.now(), budget = opts.timeBudgetMs || 3000;
    const EPS = 1e-7;
    let qi = 0, steps = 0;

    const improveFrom = (a) => {
      const i = pos[a];
      // successor side: edge (a, b)
      if (i < n - 1) {
        const b = tour[i + 1], dab = dist(a, b);
        for (let k = 0; k < K; k++) {
          const c = neigh[a * K + k];
          if (c < 0) break;
          const dac = dist(a, c);
          if (dac >= dab) break;
          const j = pos[c];
          if (j > i + 1) {
            // ... a b ... c d ...  →  ... a c ... b d ...
            const d = j < n - 1 ? tour[j + 1] : -1;
            const delta = d >= 0 ? dac + dist(b, d) - dab - dist(c, d) : dac - dab;
            if (delta < -EPS) { reverse(i + 1, j); push(b); push(c); push(d); return true; }
          } else if (j < i) {
            // ... c e ... a b ...  →  ... c a ... e b ...
            const e = tour[j + 1];
            const delta = dac + dist(e, b) - dist(c, e) - dab;
            if (delta < -EPS) { reverse(j + 1, i); push(b); push(c); push(e); return true; }
          }
        }
      }
      // predecessor side: edge (p, a)
      if (i > 0) {
        const p = tour[i - 1], dpa = dist(p, a);
        for (let k = 0; k < K; k++) {
          const c = neigh[a * K + k];
          if (c < 0) break;
          const dac = dist(a, c);
          if (dac >= dpa) break;
          const j = pos[c];
          if (j < i - 1) {
            // ... f c ... p a ...  →  ... f p ... c a ...
            const f = j > 0 ? tour[j - 1] : -1;
            const delta = f >= 0 ? dist(f, p) + dac - dist(f, c) - dpa : dac - dpa;
            if (delta < -EPS) { reverse(j, i - 1); push(p); push(c); push(f); return true; }
          } else if (j > i) {
            // ... p a ... h c ...  →  ... p h ... a c ...
            const h = tour[j - 1];
            const delta = dist(p, h) + dac - dpa - dist(h, c);
            if (delta < -EPS) { reverse(i, j - 1); push(p); push(c); push(h); return true; }
          }
        }
      }
      return false;
    };

    while (qi < queue.length) {
      const a = queue[qi++];
      queued[a] = 0;
      if (improveFrom(a)) push(a);
      if ((++steps & 1023) === 0) {
        if (Date.now() - t0 > budget) break;
        progress(0.6 + 0.4 * Math.min(1, qi / queue.length));
        if (qi > 1 << 20) { queue.splice(0, qi); qi = 0; } // keep the queue from growing forever
      }
    }
    progress(1);

    const out = new Float32Array(n * 2);
    for (let i = 0; i < n; i++) { out[2 * i] = px[tour[i]]; out[2 * i + 1] = py[tour[i]]; }
    return out;
  }

  // Cubic Bézier controls for the smoothed segment from point k to k+1
  // (Catmull-Rom through the neighbouring points).
  function lineCtrl(pts, k) {
    const m = pts.length / 2;
    const i0 = Math.max(0, k - 1), i3 = Math.min(m - 1, k + 2);
    const x0 = pts[2 * i0], y0 = pts[2 * i0 + 1];
    const x1 = pts[2 * k], y1 = pts[2 * k + 1];
    const x2 = pts[2 * k + 2], y2 = pts[2 * k + 3];
    const x3 = pts[2 * i3], y3 = pts[2 * i3 + 1];
    return [x1 + (x2 - x0) / 6, y1 + (y2 - y0) / 6, x2 - (x3 - x1) / 6, y2 - (y3 - y1) / 6, x2, y2];
  }

  // Line width in working-image units, tied to the average dot spacing so the
  // overall darkness stays the same whatever the point count: dense loops
  // close up into near-solid ink, sparse ones stay open.
  const lineWidth = (W, H, n) => 0.6 * Math.sqrt((W * H) / n);

  const f1 = (v) => {
    const r = Math.round(v * 10) / 10;
    return Object.is(r, -0) ? '0' : String(r);
  };

  function linePathD(pts) {
    const m = pts.length / 2;
    let d = `M${f1(pts[0])} ${f1(pts[1])}`;
    for (let k = 0; k < m - 1; k++) {
      const c = lineCtrl(pts, k);
      d += `C${f1(c[0])} ${f1(c[1])} ${f1(c[2])} ${f1(c[3])} ${f1(c[4])} ${f1(c[5])}`;
    }
    return d;
  }

  // width: from lineWidth() with the full point count (pts may be a part-drawn prefix)
  function buildLineSvg(W, H, bg, color, pts, width) {
    const scale = 1024 / Math.max(W, H);
    return [
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${Math.round(W * scale)}" height="${Math.round(H * scale)}">`,
      `<rect width="${W}" height="${H}" fill="${bg}"/>`,
      `<path d="${linePathD(pts)}" fill="none" stroke="${color}" stroke-width="${f(width)}" stroke-linecap="round" stroke-linejoin="round"/>`,
      `</svg>`,
    ].join('\n');
  }

  root.PrimitiveCore = {
    ALL_KINDS, randomShape, mutate, toPolygon, rasterize, toPathD, rgb, buildSvg, Optimizer,
    singleLine, lineCtrl, lineWidth, linePathD, buildLineSvg,
  };
}
primitiveCore(self);
