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
    const lines = shapes.map(
      (s) => `<path d="${toPathD(s)}" fill="${rgb(s.color)}" fill-opacity="${f(s.alpha)}"/>`,
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

  root.PrimitiveCore = { ALL_KINDS, randomShape, mutate, toPolygon, rasterize, toPathD, rgb, buildSvg, Optimizer };
}
primitiveCore(self);
