// Primitive — the finished shapes as separate layers in 3D (Shapes mode).
// Each shape is its own flat mesh, stacked in placement order above a background
// plane. At rest the layers lie flat (depth 0) so the view matches the 2D
// result exactly; orbiting fans them apart. three.js r128 (same as Valley Drive)
// is loaded from jsDelivr the first time it's needed.
// Used by js/primitive-art.js; see reference/primitive-art-page.md.
(function () {
  'use strict';

  const THREE_URL = 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js';
  const FOV = 28;                 // narrow lens: gentle perspective on the stack
  const DEPTH_PER_SIDE = 0.8;     // full stack depth at Layer depth 1, × the image's long side
  const ZOOM_MIN = 0.15, ZOOM_MAX = 3;

  let threePromise = null;
  function loadThree() {
    if (window.THREE) return Promise.resolve(window.THREE);
    if (!threePromise) {
      threePromise = new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = THREE_URL;
        s.onload = () => (window.THREE ? resolve(window.THREE) : reject(new Error('three.js missing')));
        s.onerror = () => { threePromise = null; reject(new Error('three.js failed to load')); };
        document.head.appendChild(s);
      });
    }
    return threePromise;
  }

  function webglAvailable() {
    try {
      const c = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
    } catch (e) { return false; }
  }

  // ------------------------------------------------------------ geometry

  // Outline points for one shape in working-image units (y down), finer than
  // the optimizer's polygons so curves stay smooth when zoomed in.
  function outline(s) {
    const p = s.p;
    if (s.kind === 'triangle') return [[p[0], p[1]], [p[2], p[3]], [p[4], p[5]]];
    if (s.kind === 'rectangle') {
      const q = window.PrimitiveCore.toPolygon(s);
      return [[q[0], q[1]], [q[2], q[3]], [q[4], q[5]], [q[6], q[7]]];
    }
    if (s.kind === 'ellipse') {
      const [cx, cy, rx, ry, a] = p, c = Math.cos(a), sn = Math.sin(a), out = [];
      for (let i = 0; i < 72; i++) {
        const t = (i / 72) * Math.PI * 2, x = Math.cos(t) * rx, y = Math.sin(t) * ry;
        out.push([cx + x * c - y * sn, cy + x * sn + y * c]);
      }
      return out;
    }
    const out = []; // bezier: closed cubic
    for (let i = 0; i < 48; i++) {
      const t = i / 48, u = 1 - t;
      const a = u * u * u, b = 3 * u * u * t, c = 3 * u * t * t, d = t * t * t;
      out.push([a * p[0] + b * p[2] + c * p[4] + d * p[6], a * p[1] + b * p[3] + c * p[5] + d * p[7]]);
    }
    return out;
  }

  // Does a closed outline cross itself? (Self-crossing Béziers can't be
  // triangulated as one simple polygon, so they get a texture instead.)
  function selfCrosses(pts) {
    const n = pts.length;
    const cross = (a, b, c) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
    for (let i = 0; i < n; i++) {
      const a = pts[i], b = pts[(i + 1) % n];
      for (let j = i + 2; j < n; j++) {
        if (i === 0 && j === n - 1) continue; // neighbours via the closing edge
        const c = pts[j], d = pts[(j + 1) % n];
        if (cross(a, b, c) * cross(a, b, d) < 0 && cross(c, d, a) * cross(c, d, b) < 0) return true;
      }
    }
    return false;
  }

  function shapeMesh(T, s, W, H, clip) {
    const mat = new T.MeshBasicMaterial({
      color: new T.Color(s.color[0] / 255, s.color[1] / 255, s.color[2] / 255),
      transparent: true, opacity: s.alpha, side: T.DoubleSide,
      depthTest: false, depthWrite: false, clippingPlanes: clip,
    });
    const pts = outline(s);
    if (s.kind !== 'bezier' || !selfCrosses(pts)) {
      const shape = new T.Shape(pts.map(([x, y]) => new T.Vector2(x - W / 2, H / 2 - y)));
      return new T.Mesh(new T.ShapeGeometry(shape), mat);
    }
    // Self-crossing Bézier: paint it (non-zero fill, exactly like the 2D
    // canvas) into a small texture and put that on a plane.
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const [x, y] of pts) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
    const ppu = Math.min(12, 1024 / Math.max(1, x1 - x0, y1 - y0)), pad = 2 / ppu;
    x0 -= pad; y0 -= pad; x1 += pad; y1 += pad;
    const cv = document.createElement('canvas');
    cv.width = Math.ceil((x1 - x0) * ppu); cv.height = Math.ceil((y1 - y0) * ppu);
    const ctx = cv.getContext('2d');
    ctx.setTransform(ppu, 0, 0, ppu, -x0 * ppu, -y0 * ppu);
    ctx.fillStyle = '#fff';
    ctx.fill(new Path2D(window.PrimitiveCore.toPathD(s)));
    const tex = new T.CanvasTexture(cv);
    tex.generateMipmaps = false;
    tex.minFilter = T.LinearFilter;
    mat.map = tex;
    const pw = cv.width / ppu, ph = cv.height / ppu;
    const mesh = new T.Mesh(new T.PlaneGeometry(pw, ph), mat);
    mesh.userData.offset = [x0 + pw / 2 - W / 2, H / 2 - (y0 + ph / 2)];
    return mesh;
  }

  // ------------------------------------------------------------- viewer

  // data: { w, h, bg: css colour, shapes: PlacedShape[] }
  // Resolves to a viewer, or rejects if WebGL / three.js aren't available.
  async function create(data) {
    if (!webglAvailable()) throw new Error('WebGL unavailable');
    const T = await loadThree();
    const { w: W, h: H, shapes } = data;
    const L = Math.max(W, H), n = shapes.length;

    const renderer = new T.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.localClippingEnabled = true;
    const canvas = renderer.domElement;
    canvas.className = 'layers-gl';
    canvas.setAttribute('aria-label', `Generated image as ${n} layers in 3D`);

    const scene = new T.Scene();
    const camera = new T.PerspectiveCamera(FOV, W / H, 0.1, L * 100);
    // Layers stay inside the image's frame, like the 2D canvas clips them.
    // The stack never rotates (the camera orbits), so world-space planes work.
    const clip = [
      new T.Plane(new T.Vector3(1, 0, 0), W / 2), new T.Plane(new T.Vector3(-1, 0, 0), W / 2),
      new T.Plane(new T.Vector3(0, 1, 0), H / 2), new T.Plane(new T.Vector3(0, -1, 0), H / 2),
    ];

    // background: bottom layer, front face only, so from behind you see the
    // shapes float rather than the back of an opaque card
    const bgMat = new T.MeshBasicMaterial({ color: new T.Color(data.bg), side: T.FrontSide, depthTest: false, depthWrite: false });
    const bgMesh = new T.Mesh(new T.PlaneGeometry(W, H), bgMat);
    bgMesh.renderOrder = 0;
    scene.add(bgMesh);
    const meshes = shapes.map((s) => {
      const m = shapeMesh(T, s, W, H, clip);
      scene.add(m);
      return m;
    });

    // view state: spread = current layer depth (0 = flat), depth = what
    // orbiting fans out to (the Layer depth slider)
    const view = { theta: 0, phi: 0, zoom: 1, spread: 0, depth: 1 };
    let anim = null, frame = 0, firstOrbit = true, onInteract = null;
    let host = null, mode = { left: false, touch: false };

    function layout() {
      const D = view.spread * DEPTH_PER_SIDE * L;
      meshes.forEach((m, i) => {
        const o = m.userData.offset || [0, 0];
        m.position.set(o[0], o[1], D * (i + 1) / n);
      });
      const target = new T.Vector3(0, 0, D / 2);
      const t = Math.tan((FOV * Math.PI) / 360);
      const fit = Math.max(H / 2 / t, W / 2 / (t * camera.aspect));
      const r = fit * view.zoom;
      camera.position.set(
        target.x + r * Math.sin(view.theta) * Math.cos(view.phi),
        target.y + r * Math.sin(view.phi),
        target.z + r * Math.cos(view.theta) * Math.cos(view.phi),
      );
      camera.lookAt(target);
      // painter's order: bottom layer first when seen from the front,
      // reversed when the camera swings round behind the stack
      const behind = camera.position.z < target.z;
      meshes.forEach((m, i) => { m.renderOrder = behind ? n - i : i + 1; });
    }

    function draw() {
      frame = 0;
      if (anim) {
        const k = Math.min(1, (performance.now() - anim.t0) / anim.ms);
        const e = 1 - Math.pow(1 - k, 3);
        for (const key in anim.to) view[key] = anim.from[key] + (anim.to[key] - anim.from[key]) * e;
        if (k >= 1) anim = null;
      }
      layout();
      renderer.render(scene, camera);
      if (anim) request();
    }
    function request() { if (!frame) frame = requestAnimationFrame(draw); }

    function animateTo(to, ms) {
      const from = {};
      for (const key in to) from[key] = view[key];
      anim = { from, to, t0: performance.now(), ms: ms || 600 };
      request();
    }

    function resize() {
      if (!host) return;
      const w = host.clientWidth, h = host.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      request();
    }
    const ro = new ResizeObserver(resize);

    function interacted() {
      if (onInteract) onInteract();
      if (firstOrbit) { firstOrbit = false; animateTo({ spread: view.depth }, 700); }
    }

    // ---- input: right-drag (and, in the lightbox, left-drag / one finger) orbits;
    // wheel or pinch zooms; double-click resets
    const pointers = new Map();
    let pinch0 = 0, zoom0 = 1;
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    canvas.addEventListener('pointerdown', (e) => {
      const ok = e.pointerType === 'touch' ? mode.touch : e.button === 2 || (mode.left && e.button === 0);
      if (!ok) return;
      e.preventDefault();
      try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* keep orbiting without capture */ }
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        pinch0 = Math.hypot(a.x - b.x, a.y - b.y); zoom0 = view.zoom;
      }
      canvas.classList.add('is-dragging');
      interacted();
    });
    canvas.addEventListener('pointermove', (e) => {
      const p = pointers.get(e.pointerId);
      if (!p) return;
      const dx = e.clientX - p.x, dy = e.clientY - p.y;
      p.x = e.clientX; p.y = e.clientY;
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (pinch0) view.zoom = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, zoom0 * pinch0 / d));
      } else {
        view.theta -= dx * 0.008;
        view.phi = Math.max(-1.45, Math.min(1.45, view.phi + dy * 0.008));
      }
      request();
    });
    const release = (e) => {
      pointers.delete(e.pointerId);
      if (pointers.size < 2) pinch0 = 0;
      if (!pointers.size) canvas.classList.remove('is-dragging');
    };
    canvas.addEventListener('pointerup', release);
    canvas.addEventListener('pointercancel', release);
    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      view.zoom = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, view.zoom * Math.exp(e.deltaY * 0.0015)));
      interacted();
      request();
    }, { passive: false });
    canvas.addEventListener('dblclick', () => viewer.reset());

    const viewer = {
      canvas,
      layers: n,
      // Move the 3D view into `el` (the frame, or the lightbox stage).
      // left: plain left-drag orbits too; touch: one finger orbits, two pinch.
      mount(el, opts) {
        if (host) ro.unobserve(host);
        host = el;
        mode = { left: !!(opts && opts.left), touch: !!(opts && opts.touch) };
        canvas.style.touchAction = mode.touch ? 'none' : 'auto';
        el.appendChild(canvas);
        ro.observe(el);
        resize();
      },
      // back to the flat, face-on view (it looks just like the 2D result)
      reset() {
        firstOrbit = true;
        animateTo({ theta: 0, phi: 0, zoom: 1, spread: 0 }, 650);
      },
      setDepth(v) {
        view.depth = v;
        if (!firstOrbit) animateTo({ spread: v }, 250);
      },
      onInteract(fn) { onInteract = fn; },
      dispose() {
        cancelAnimationFrame(frame);
        ro.disconnect();
        scene.traverse((o) => {
          if (o.geometry) o.geometry.dispose();
          if (o.material) { if (o.material.map) o.material.map.dispose(); o.material.dispose(); }
        });
        renderer.dispose();
        if (renderer.forceContextLoss) renderer.forceContextLoss();
        canvas.remove();
      },
    };
    return viewer;
  }

  window.PrimitiveLayers = { create };
})();
