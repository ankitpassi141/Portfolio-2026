// City Pulse globe — see reference/survey-page.md.
// A small planet (simplex-noise continents) with gridded cities, highways
// between them and instanced traffic driving both ways. OrbitControls for
// spin/zoom, GSAP for camera flights, CSS2DRenderer for the city labels.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { createNoise3D } from 'simplex-noise';
import { gsap } from 'gsap';

const { smoothstep, lerp, clamp, degToRad } = THREE.MathUtils;

const R = 10;            // planet radius
const BLOCK = 0.16;      // city block pitch
const ROAD_W = 0.034;
const HWY_W = 0.06;
const MAX_CARS = 1600;

// grid must be even so the centre lines meet the highways at an intersection
export const CITIES = [
  { id: 'harbor',    name: 'Harbor City',  lat: 16,  lon: 18,  grid: 12, tall: 0.95, palette: ['#cfd8e3', '#a9bccf', '#8ea7c4', '#e6e1d6', '#7d97b8'] },
  { id: 'riverside', name: 'Riverside',    lat: -14, lon: 58,  grid: 8,  tall: 0.22, palette: ['#efe6d4', '#e3d3b8', '#d8c8a9', '#f4efe4', '#c9b796'] },
  { id: 'hill',      name: 'Hill Station', lat: 40,  lon: 70,  grid: 6,  tall: 0.14, palette: ['#e9dccb', '#c9a78a', '#b98f6e', '#efe3d2', '#a87d5d'] },
  { id: 'tech',      name: 'Tech Park',    lat: -26, lon: -14, grid: 10, tall: 0.6,  palette: ['#bcd3e6', '#d9e4ee', '#9fc1dd', '#eef3f7', '#7fa8cc'] },
  { id: 'old',       name: 'Old Town',     lat: 30,  lon: -46, grid: 8,  tall: 0.1,  palette: ['#d9a173', '#e7c39b', '#c8805a', '#efd9bb', '#b56c4a'] },
];
const HIGHWAYS = [['harbor', 'riverside'], ['harbor', 'old'], ['harbor', 'tech'], ['riverside', 'hill'], ['old', 'hill'], ['tech', 'riverside']];

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function slerpDir(a, b, t) {
  const om = Math.acos(clamp(a.dot(b), -1, 1));
  const s = Math.sin(om);
  return a.clone().multiplyScalar(Math.sin((1 - t) * om) / s).addScaledVector(b, Math.sin(t * om) / s);
}

export function createGlobe(container, { onCityClick } = {}) {
  const rand = mulberry32(1103);
  const rr = (a, b) => a + (b - a) * rand();
  const noise3D = createNoise3D(rand);
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- cities: direction + tangent frame ----------
  const byId = {};
  for (const c of CITIES) {
    const la = degToRad(c.lat), lo = degToRad(c.lon);
    c.dir = new THREE.Vector3(Math.cos(la) * Math.sin(lo), Math.sin(la), Math.cos(la) * Math.cos(lo));
    c.east = new THREE.Vector3(0, 1, 0).cross(c.dir).normalize();
    c.north = c.dir.clone().cross(c.east).normalize();
    c.half = (c.grid * BLOCK) / 2;
    c.ang = (c.half * Math.SQRT2) / R;
    byId[c.id] = c;
  }
  const local = (c, x, y) => c.dir.clone().multiplyScalar(R).addScaledVector(c.east, x).addScaledVector(c.north, y);

  // ---------- terrain field ----------
  function cityMask(n) {
    let m = 0;
    for (const c of CITIES) {
      const a = Math.acos(clamp(n.dot(c.dir), -1, 1));
      m = Math.max(m, 1 - smoothstep(a, c.ang + 0.015, c.ang + 0.13));
    }
    return m;
  }
  function terrain(n) {
    const m = cityMask(n);
    const v = noise3D(n.x * 1.1, n.y * 1.1, n.z * 1.1) * 0.65
      + noise3D(n.x * 2.7 + 5, n.y * 2.7, n.z * 2.7) * 0.3
      + noise3D(n.x * 6, n.y * 6, n.z * 6 + 9) * 0.1 - 0.06 + m * 0.9;
    const coast = smoothstep(v, -0.02, 0.06);
    const mtn = smoothstep(v, 0.38, 0.85) * (1 - m);
    const hills = (noise3D(n.x * 9, n.y * 9, n.z * 9) + 1) * 0.015 * coast * (1 - m);
    return { v, m, coast, mtn, h: R - 0.12 + 0.12 * coast + mtn * 0.75 + hills };
  }
  const roadRadius = (n) => Math.max(terrain(n).h, R) + 0.004;

  // ---------- renderer / scene ----------
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  container.prepend(renderer.domElement);

  const labelRenderer = new CSS2DRenderer();
  labelRenderer.domElement.className = 'labels';
  container.appendChild(labelRenderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.2, 1200);
  scene.add(camera);

  scene.add(new THREE.HemisphereLight(0xdcecff, 0x6b7480, 1.5));
  const sun = new THREE.DirectionalLight(0xfff3e0, 2.6);
  sun.position.set(14, 12, 10);           // follows the camera, so the side you look at is lit
  camera.add(sun);
  scene.add(sun.target);

  const world = new THREE.Group();
  scene.add(world);

  // ---------- planet ----------
  const C = (h) => new THREE.Color(h);
  const COL = {
    deep: C('#0f2d57'), shallow: C('#2f79b8'), sand: C('#e2d39d'), grass: C('#79b25c'),
    forest: C('#3f7d44'), rock: C('#8b8676'), snow: C('#f4f6f8'), urban: C('#c9c6bb'),
  };
  {
    const geo = new THREE.IcosahedronGeometry(1, 64);
    const pos = geo.attributes.position;
    const col = new Float32Array(pos.count * 3);
    const n = new THREE.Vector3(), c = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
      n.fromBufferAttribute(pos, i).normalize();
      const t = terrain(n);
      pos.setXYZ(i, n.x * t.h, n.y * t.h, n.z * t.h);
      if (t.coast < 0.5) c.copy(COL.deep).lerp(COL.shallow, t.coast * 2);
      else if (t.m > 0.8) c.copy(COL.grass).lerp(COL.urban, smoothstep(t.m, 0.8, 0.98));
      else if (t.v < 0.1) c.copy(COL.sand);
      else if (t.mtn > 0.42) c.copy(COL.snow);
      else if (t.mtn > 0.16) c.copy(COL.rock);
      else c.copy(COL.grass).lerp(COL.forest, smoothstep(noise3D(n.x * 4, n.y * 4 + 3, n.z * 4), -0.2, 0.5));
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    }
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    geo.computeVertexNormals();
    world.add(new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95, flatShading: true })));

    const water = new THREE.Mesh(
      new THREE.SphereGeometry(R - 0.025, 128, 64),
      new THREE.MeshStandardMaterial({ color: 0x2f7fd0, roughness: 0.18, metalness: 0.1, transparent: true, opacity: 0.8 })
    );
    world.add(water);

    const atmo = new THREE.Mesh(
      new THREE.SphereGeometry(R * 1.09, 64, 32),
      new THREE.ShaderMaterial({
        side: THREE.BackSide, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
        vertexShader: 'varying vec3 vN; void main(){ vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
        fragmentShader: 'varying vec3 vN; void main(){ float i = pow(0.68 - dot(vN, vec3(0.0,0.0,1.0)), 3.0); gl_FragColor = vec4(0.38,0.65,1.0,1.0) * i; }',
      })
    );
    scene.add(atmo);
  }

  // ---------- stars ----------
  {
    const p = new Float32Array(1800 * 3), v = new THREE.Vector3();
    for (let i = 0; i < 1800; i++) {
      v.randomDirection().multiplyScalar(rr(300, 600));
      p.set([v.x, v.y, v.z], i * 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    scene.add(new THREE.Points(g, new THREE.PointsMaterial({ color: 0xffffff, size: 1.6, sizeAttenuation: false, transparent: true, opacity: 0.75 })));
  }

  // ---------- roads ----------
  const roads = [];
  function addRoad(dirAt, len, kind) {
    const n = Math.max(2, Math.ceil(len / 0.04));
    const ups = [], pts = [], cum = [0];
    for (let i = 0; i <= n; i++) {
      const d = dirAt(i / n).normalize();
      ups.push(d);
      pts.push(d.clone().multiplyScalar(roadRadius(d)));
      if (i) cum.push(cum[i - 1] + pts[i].distanceTo(pts[i - 1]));
    }
    roads.push({ pts, ups, cum, len: cum[n], kind, w: kind === 'hwy' ? HWY_W : ROAD_W });
  }
  for (const c of CITIES) {
    for (let i = 0; i <= c.grid; i++) {
      const x = -c.half + i * BLOCK;
      addRoad((t) => local(c, x, lerp(-c.half, c.half, t)), 2 * c.half, 'city');
      addRoad((t) => local(c, lerp(-c.half, c.half, t), x), 2 * c.half, 'city');
    }
  }
  // highways leave from the middle of the grid side that faces the other city
  function gate(a, b) {
    const t = b.dir.clone().addScaledVector(a.dir, -a.dir.dot(b.dir));
    const e = t.dot(a.east), n = t.dot(a.north);
    return (Math.abs(e) > Math.abs(n) ? local(a, Math.sign(e) * a.half, 0) : local(a, 0, Math.sign(n) * a.half)).normalize();
  }
  for (const [ia, ib] of HIGHWAYS) {
    const a = byId[ia], b = byId[ib];
    const ga = gate(a, b), gb = gate(b, a);
    addRoad((t) => slerpDir(ga, gb, t), Math.acos(ga.dot(gb)) * R, 'hwy');
  }

  {
    const pos = [], col = [], idx = [], dpos = [], didx = [];
    const t = new THREE.Vector3(), side = new THREE.Vector3(), cCity = C('#3a3e46'), cHwy = C('#2b2e34');
    for (const r of roads) {
      const base = pos.length / 3, cc = r.kind === 'hwy' ? cHwy : cCity;
      for (let i = 0; i < r.pts.length; i++) {
        const a = r.pts[Math.max(0, i - 1)], b = r.pts[Math.min(r.pts.length - 1, i + 1)];
        t.subVectors(b, a).normalize();
        side.crossVectors(t, r.ups[i]).normalize().multiplyScalar(r.w / 2);
        const p = r.pts[i];
        pos.push(p.x + side.x, p.y + side.y, p.z + side.z, p.x - side.x, p.y - side.y, p.z - side.z);
        col.push(cc.r, cc.g, cc.b, cc.r, cc.g, cc.b);
        if (i) { const k = base + (i - 1) * 2; idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); }
        // centre dashes on highways
        if (r.kind === 'hwy' && i < r.pts.length - 1 && i % 4 < 2) {
          const q = r.pts[i + 1], u = r.ups[i], s2 = side.clone().setLength(0.0035), lift = 0.003;
          const db = dpos.length / 3;
          for (const v of [p, q]) for (const sg of [1, -1]) dpos.push(v.x + u.x * lift + s2.x * sg, v.y + u.y * lift + s2.y * sg, v.z + u.z * lift + s2.z * sg);
          didx.push(db, db + 1, db + 2, db + 1, db + 3, db + 2);
        }
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    world.add(new THREE.Mesh(g, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 })));
    const dg = new THREE.BufferGeometry();
    dg.setAttribute('position', new THREE.Float32BufferAttribute(dpos, 3));
    dg.setIndex(didx);
    world.add(new THREE.Mesh(dg, new THREE.MeshBasicMaterial({ color: 0xf2d16b, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 })));
  }

  // ---------- buildings + parks ----------
  const m4 = new THREE.Matrix4(), up = new THREE.Vector3(), ex = new THREE.Vector3(), ez = new THREE.Vector3(), pv = new THREE.Vector3(), sc = new THREE.Vector3();
  const lots = [], parkTrees = [];
  for (const c of CITIES) {
    const inner = BLOCK - ROAD_W - 0.018, sub = inner / 2;
    for (let i = 0; i < c.grid; i++) for (let j = 0; j < c.grid; j++) {
      const cx = -c.half + (i + 0.5) * BLOCK, cy = -c.half + (j + 0.5) * BLOCK;
      const d = Math.hypot(cx, cy) / (c.half * Math.SQRT2);
      const core = Math.pow(1 - clamp(d, 0, 1), 2.4);
      if (rand() < 0.1 && d > 0.25) {
        lots.push({ c, x: cx, y: cy, w: inner + 0.008, d: inner + 0.008, h: 0.005, color: '#6fae5a' });
        for (let k = 0; k < 5; k++) parkTrees.push(local(c, cx + rr(-0.45, 0.45) * inner, cy + rr(-0.45, 0.45) * inner).normalize());
        continue;
      }
      for (let a = 0; a < 2; a++) for (let b = 0; b < 2; b++) {
        if (rand() < 0.07) continue;
        let h = 0.03 + c.tall * core * rr(0.45, 1.25) + rr(0, 0.04);
        if (rand() < 0.05 * core) h *= 1.7;
        lots.push({
          c, x: cx + (a - 0.5) * sub, y: cy + (b - 0.5) * sub,
          w: sub * rr(0.62, 0.9), d: sub * rr(0.62, 0.9), h,
          color: c.palette[(rand() * c.palette.length) | 0],
        });
      }
    }
  }
  {
    const mesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0),
      new THREE.MeshStandardMaterial({ roughness: 0.65, metalness: 0.05 }), lots.length);
    const col = new THREE.Color();
    lots.forEach((l, i) => {
      pv.copy(local(l.c, l.x, l.y)).normalize();
      up.copy(pv);
      ex.copy(l.c.east).addScaledVector(up, -l.c.east.dot(up)).normalize();
      ez.crossVectors(ex, up);
      m4.makeBasis(ex, up, ez).scale(sc.set(l.w, l.h, l.d)).setPosition(pv.multiplyScalar(R + 0.002));
      mesh.setMatrixAt(i, m4);
      mesh.setColorAt(i, col.set(l.color));
    });
    world.add(mesh);
  }

  // ---------- trees ----------
  {
    const spots = [...parkTrees.map((d) => ({ d, h: R + 0.005, s: 0.7 }))];
    const v = new THREE.Vector3();
    for (let tries = 0; spots.length < 2600 && tries < 40000; tries++) {
      v.set(rr(-1, 1), rr(-1, 1), rr(-1, 1));
      if (v.lengthSq() > 1 || v.lengthSq() < 0.01) continue;
      v.normalize();
      const t = terrain(v);
      if (t.coast < 0.97 || t.v < 0.13 || t.mtn > 0.22 || t.m > 0.25) continue;
      spots.push({ d: v.clone(), h: t.h, s: rr(0.8, 1.4) });
    }
    const mesh = new THREE.InstancedMesh(new THREE.ConeGeometry(0.5, 1, 6).translate(0, 0.5, 0),
      new THREE.MeshStandardMaterial({ roughness: 0.9, flatShading: true }), spots.length);
    const q = new THREE.Quaternion(), qy = new THREE.Quaternion(), Y = new THREE.Vector3(0, 1, 0), col = new THREE.Color();
    spots.forEach((s, i) => {
      q.setFromUnitVectors(Y, s.d).multiply(qy.setFromAxisAngle(Y, rr(0, 6.28)));
      m4.compose(pv.copy(s.d).multiplyScalar(s.h - 0.005), q, sc.set(0.05 * s.s, 0.12 * s.s, 0.05 * s.s));
      mesh.setMatrixAt(i, m4);
      mesh.setColorAt(i, col.setHSL(rr(0.28, 0.36), rr(0.4, 0.55), rr(0.22, 0.32)));
    });
    world.add(mesh);
  }

  // ---------- clouds ----------
  const clouds = new THREE.Group();
  const cloudMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, flatShading: true, transparent: true, opacity: 0.85, depthWrite: false });
  {
    const puffs = [];
    for (let i = 0; i < 34; i++) {
      const d = new THREE.Vector3().randomDirection();
      const e = new THREE.Vector3().randomDirection().cross(d).normalize();
      const n = 3 + ((rand() * 4) | 0);
      for (let k = 0; k < n; k++) {
        const p = d.clone().multiplyScalar(R + 1.6).addScaledVector(e, (k - n / 2) * 0.28 + rr(-0.08, 0.08));
        puffs.push({ p, d, s: rr(0.18, 0.36) });
      }
    }
    const mesh = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 1), cloudMat, puffs.length);
    const q = new THREE.Quaternion(), Y = new THREE.Vector3(0, 1, 0);
    puffs.forEach((p, i) => {
      q.setFromUnitVectors(Y, p.d);
      m4.compose(p.p, q, sc.set(p.s * 1.4, p.s * 0.7, p.s));
      mesh.setMatrixAt(i, m4);
    });
    clouds.add(mesh);
    scene.add(clouds);
  }

  // ---------- cars ----------
  const carGeo = mergeGeometries([
    new THREE.BoxGeometry(1, 0.45, 1).translate(0, 0.3, 0),
    new THREE.BoxGeometry(0.82, 0.36, 0.52).translate(0, 0.7, -0.06),
  ]);
  const headGeo = mergeGeometries([
    new THREE.BoxGeometry(0.22, 0.14, 0.05).translate(-0.3, 0.35, 0.51),
    new THREE.BoxGeometry(0.22, 0.14, 0.05).translate(0.3, 0.35, 0.51),
  ]);
  const tailGeo = headGeo.clone().scale(1, 1, -1);
  const carMesh = new THREE.InstancedMesh(carGeo, new THREE.MeshStandardMaterial({ roughness: 0.35, metalness: 0.3 }), MAX_CARS);
  const headMesh = new THREE.InstancedMesh(headGeo, new THREE.MeshBasicMaterial({ color: 0xfff6d8 }), MAX_CARS);
  const tailMesh = new THREE.InstancedMesh(tailGeo, new THREE.MeshBasicMaterial({ color: 0xff3b3b }), MAX_CARS);
  for (const m of [carMesh, headMesh, tailMesh]) { m.instanceMatrix.setUsage(THREE.DynamicDrawUsage); m.frustumCulled = false; world.add(m); }

  const PAINT = ['#e8443a', '#f2f2f2', '#2b2f36', '#f5b83d', '#3a7bd5', '#9aa3ad', '#2fae7a', '#d9d9d9', '#1f4f9c'];
  const weights = roads.map((r) => r.len * (r.kind === 'hwy' ? 1.8 : 1));
  const total = weights.reduce((a, b) => a + b, 0);
  const cars = [];
  {
    const col = new THREE.Color();
    for (let k = 0; k < MAX_CARS; k++) {
      let x = rand() * total, ri = 0;
      while (x > weights[ri]) x -= weights[ri++];
      const r = roads[Math.min(ri, roads.length - 1)];
      const hwy = r.kind === 'hwy', truck = hwy && rand() < 0.15;
      cars.push({
        r, s: rand() * r.len, dir: rand() < 0.5 ? 1 : -1, idx: 0,
        v: hwy ? rr(0.35, 0.55) : rr(0.12, 0.22),
        scale: new THREE.Vector3(truck ? 0.026 : 0.02, truck ? 0.028 : 0.018, truck ? 0.07 : 0.04),
      });
      carMesh.setColorAt(k, col.set(truck ? '#e9e4d8' : PAINT[(rand() * PAINT.length) | 0]));
    }
  }
  let carCount = Math.round(MAX_CARS * 0.5);
  const fwd = new THREE.Vector3(), left = new THREE.Vector3();
  function moveCars(dt) {
    for (let k = 0; k < carCount; k++) {
      const c = cars[k], r = c.r, cum = r.cum;
      c.s += c.dir * c.v * dt;
      if (c.s > r.len) { c.s = 2 * r.len - c.s; c.dir = -1; }   // U-turn at the ends
      if (c.s < 0) { c.s = -c.s; c.dir = 1; }
      let i = Math.min(c.idx, cum.length - 2);
      while (i < cum.length - 2 && c.s > cum[i + 1]) i++;
      while (i > 0 && c.s < cum[i]) i--;
      c.idx = i;
      const f = (c.s - cum[i]) / (cum[i + 1] - cum[i] || 1);
      pv.lerpVectors(r.pts[i], r.pts[i + 1], f);
      up.lerpVectors(r.ups[i], r.ups[i + 1], f).normalize();
      fwd.subVectors(r.pts[i + 1], r.pts[i]).multiplyScalar(c.dir);
      fwd.addScaledVector(up, -fwd.dot(up)).normalize();
      left.crossVectors(up, fwd);
      pv.addScaledVector(left, -r.w * 0.25);                     // keep right
      m4.makeBasis(left, up, fwd).scale(c.scale).setPosition(pv);
      carMesh.setMatrixAt(k, m4); headMesh.setMatrixAt(k, m4); tailMesh.setMatrixAt(k, m4);
    }
    for (const m of [carMesh, headMesh, tailMesh]) { m.count = carCount; m.instanceMatrix.needsUpdate = true; }
  }

  // ---------- labels ----------
  for (const c of CITIES) {
    const el = document.createElement('button');
    el.type = 'button';
    el.className = 'city-label';
    el.textContent = c.name;
    el.addEventListener('click', (e) => { e.stopPropagation(); flyTo(c.id); onCityClick?.(c.id); });
    el.addEventListener('pointerdown', (e) => e.stopPropagation());
    const obj = new CSS2DObject(el);
    obj.position.copy(c.dir).multiplyScalar(R + c.tall + 0.35);
    world.add(obj);
    c.label = el;
  }
  function setActiveCity(id) { for (const c of CITIES) c.label.classList.toggle('on', c.id === id); }

  // ---------- camera + controls ----------
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
  controls.minDistance = R + 0.7;
  controls.zoomSpeed = 0.9;
  let spinOn = !reduceMotion;
  controls.autoRotate = spinOn;
  controls.autoRotateSpeed = 0.5;

  let HOME_DIST = 30;     // refit to the frame in resize()
  const home = byId.harbor.dir.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), -0.35).add(new THREE.Vector3(0, 0.35, 0)).normalize();
  camera.position.copy(home).multiplyScalar(HOME_DIST);
  controls.update();

  let idleTimer = 0, flight = null;
  controls.addEventListener('start', () => {
    controls.autoRotate = false;
    clearTimeout(idleTimer);
    flight?.kill(); flight = null;
    document.getElementById('hint')?.classList.add('gone');
  });
  controls.addEventListener('end', () => {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => { controls.autoRotate = spinOn; }, 4000);
  });

  function flyDir(dir, dist, duration = 1.6) {
    flight?.kill();
    clearTimeout(idleTimer);
    controls.autoRotate = false;
    const fromDir = camera.position.clone().normalize(), fromDist = camera.position.length();
    const q = new THREE.Quaternion().setFromUnitVectors(fromDir, dir.clone().normalize());
    const qt = new THREE.Quaternion(), o = { t: 0 };
    const hop = Math.max(0, Math.acos(clamp(fromDir.dot(dir), -1, 1)) * 4 - Math.abs(dist - fromDist) * 0.3);
    flight = gsap.to(o, {
      t: 1, duration: reduceMotion ? 0 : duration, ease: 'power2.inOut',
      onUpdate() {
        qt.identity().slerp(q, o.t);
        camera.position.copy(fromDir).applyQuaternion(qt).multiplyScalar(lerp(fromDist, dist, o.t) + Math.sin(o.t * Math.PI) * hop);
      },
      onComplete() { flight = null; idleTimer = setTimeout(() => { controls.autoRotate = spinOn; }, 6000); },
    });
  }
  function flyTo(id, dist = R + 3.4) {
    const c = byId[id];
    if (!c) return;
    setActiveCity(id);
    // look from slightly south so the skyline reads at an angle
    const view = c.dir.clone().addScaledVector(c.north, -0.04).normalize();
    flyDir(view, dist);
  }
  function zoom(f) {
    const dist = clamp(camera.position.length() * f, controls.minDistance, controls.maxDistance);
    flyDir(camera.position.clone().normalize(), dist, 0.5);
  }
  function reset() { setActiveCity(null); flyDir(home, HOME_DIST); }
  function setSpin(on) { spinOn = on; controls.autoRotate = on; }
  function setTraffic(level) { carCount = Math.round(MAX_CARS * clamp(level, 1, 10) / 10); }
  function celebrate() {
    setActiveCity(null);
    flyDir(home, HOME_DIST, 1.4);
    if (reduceMotion) return;
    gsap.fromTo(controls, { autoRotateSpeed: 14 }, { autoRotateSpeed: 0.5, duration: 4, delay: 1.4, ease: 'power2.out', onStart: () => { controls.autoRotate = true; } });
  }

  // ---------- size + loop ----------
  function resize() {
    const w = container.clientWidth, h = container.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    labelRenderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    // distance that fits the planet (plus a margin) in the narrower field of view
    const vf = degToRad(camera.fov) / 2, hf = Math.atan(Math.tan(vf) * camera.aspect);
    const atHome = Math.abs(camera.position.length() - HOME_DIST) < 0.5;
    HOME_DIST = (R * 1.2) / Math.sin(Math.min(vf, hf));
    controls.maxDistance = HOME_DIST * 1.6;
    if (atHome && !flight) camera.position.setLength(HOME_DIST);
  }
  new ResizeObserver(resize).observe(container);
  resize();

  const clock = new THREE.Clock(), camDir = new THREE.Vector3();
  let first = true;
  renderer.setAnimationLoop(() => {
    const dt = Math.min(clock.getDelta(), 0.05);
    const dist = camera.position.length();
    controls.rotateSpeed = clamp((dist - R) / 18, 0.06, 0.9);
    controls.update();
    moveCars(dt);
    clouds.rotation.y += dt * 0.012;
    cloudMat.opacity = clamp((dist - (R + 4)) / 5, 0, 0.85);
    clouds.visible = cloudMat.opacity > 0.01;
    camDir.copy(camera.position).normalize();
    for (const c of CITIES) c.label.classList.toggle('away', camDir.dot(c.dir) < 0.25);
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
    if (first) { first = false; document.getElementById('loading')?.classList.add('gone'); }
  });

  return { flyTo, zoom, reset, setSpin, setTraffic, celebrate, setActiveCity };
}
