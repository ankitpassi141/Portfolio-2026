// Valley Drive — an endless low-poly driving toy (three.js r128 + simplex-noise 2.4, loaded from
// jsDelivr by valley-drive.html). Started from the single-file prototype; see reference/valley-drive-page.md.
(() => {
  // =====================================================================
  // Config
  // =====================================================================
  const CHUNK = 64;
  const SEGS = 30;
  const VIEW = 4;
  const BUILD_PER_FRAME = 2;
  const ROAD_HALF = 5.5;
  const BLEND = 38;
  const G = 9.8 * 1.8;               // arcade gravity

  // Props per chunk
  const TREE_TRIES = 200;
  const ROCK_TRIES = 45;             // small scattered stones
  const BOULDER_TRIES = 9;           // rolling boulders beside the road
  const ROAD_BOULDER_CHANCE = 0.28;  // …and the odd one sitting on the road
  const ROAD_ROCK_CHANCE = 0.45;
  const LOG_CHANCE = 0.3;            // a fallen log lying across part of the road
  const SAFE_START = 40;             // keep road hazards this far from the spawn point

  const C = (hex) => new THREE.Color(hex).convertSRGBToLinear();
  const COL = {
    road: C(0xd8bb86), shoulder: C(0x9fce5c), grass: C(0x5eae3b), grassDark: C(0x4f9a33),
    rock: C(0xee9a4c), rockDark: C(0xde8540), tree: C(0x8fd84a), boulder: C(0xa98a74),
    stone: C(0x9d9087), bark: C(0x7b5134), trail: C(0xc4a676), trailDark: C(0xb89a6a),
  };

  // =====================================================================
  // Seeded noise (new seed on every load, or on "New map")
  // =====================================================================
  let SEED, simplex, seedNum;
  const newSeed = () => Math.random().toString(36).slice(2, 8).toUpperCase();
  function setSeed(s) {
    SEED = s;
    simplex = new SimplexNoise(s);
    seedNum = 0; for (let i = 0; i < s.length; i++) seedNum = (seedNum * 31 + s.charCodeAt(i)) | 0;
  }
  setSeed(newSeed());
  const n2 = (x, y) => simplex.noise2D(x, y);
  const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const wrapAngle = (a) => Math.atan2(Math.sin(a), Math.cos(a));
  // keep v within ±half of c, stepping by whole box widths (world-fixed particles around a moving centre)
  const wrapTo = (v, c, half) => c - half + ((((v - c + half) % (2 * half)) + 2 * half) % (2 * half));

  const pathX = (z) => 70 * n2(z * 0.0028, 11.3) + 22 * n2(z * 0.009, 57.1);
  const roadY = (z) => 9 * n2(z * 0.0021, 91.7) + 2.5 * n2(z * 0.008, 33.3);
  const roadDist = (x, z) => {
    const s = (pathX(z + 1) - pathX(z - 1)) * 0.5;
    return Math.abs(x - pathX(z)) / Math.sqrt(1 + s * s);
  };
  const mountain = (x, z) => {
    let a = 0, f = 1 / 150, amp = 1, sum = 0;
    for (let o = 0; o < 4; o++) { a += amp * n2(x * f, z * f); sum += amp; f *= 2.05; amp *= 0.5; }
    const v = a / sum * 0.5 + 0.5;
    const r = 1 - Math.abs(n2(x / 60 + 40, z / 60 - 12));
    return 4 + 62 * Math.pow(v, 1.6) + 16 * r * r * v;
  };
  function sample(x, z) {
    const d = roadDist(x, z);
    const s = smooth(ROAD_HALF - 0.5, ROAD_HALF + BLEND, d);
    const bumps = 1.2 * n2(x * 0.07, z * 0.07) * smooth(ROAD_HALF, ROAD_HALF + 8, d);
    const rel = s * mountain(x, z) + bumps;
    return { y: roadY(z) + rel, rel, d };
  }
  // sideways position across the road (perpendicular to it, not along x), and back
  const roadSec = (z) => { const s = (pathX(z + 1) - pathX(z - 1)) * 0.5; return Math.sqrt(1 + s * s); };
  const roadLat = (x, z) => (x - pathX(z)) / roadSec(z);
  const heightAt = (x, z) => sample(x, z).y;
  const _n = new THREE.Vector3();
  function normalAt(x, z, out = _n) {
    const e = 0.8;
    return out.set(heightAt(x - e, z) - heightAt(x + e, z), 2 * e, heightAt(x, z - e) - heightAt(x, z + e)).normalize();
  }
  const snowline = (x, z) => 24 + 8 * n2(x * 0.04, z * 0.04);
  // Dirt trails: the zero-lines of two low-frequency noise fields wind across the hills (so they
  // join up across chunks and cross the road), and a third field makes them come and go.
  // Only for looks — auto-drive follows the road. `widen` > 1 gives a margin (for trees).
  const trailAt = (x, z, widen) => {
    if (n2(x * 0.004 + 3.1, z * 0.004 - 8.2) < -0.2) return false;
    return Math.abs(n2(x * 0.0055 + 311.7, z * 0.0055 - 91.3)) < 0.03 * widen
      || Math.abs(n2(x * 0.009 - 57.2, z * 0.009 + 12.9)) < 0.022 * widen;
  };

  function rng(seed) {
    return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  }
  const chunkHash = (cx, cz, salt) => (cx * 73856093) ^ (cz * 19349663) ^ seedNum ^ (salt * 83492791);

  // =====================================================================
  // Renderer / scene / camera
  // =====================================================================
  const canvas = document.getElementById('scene');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  const DPR = Math.min(window.devicePixelRatio, 2);
  renderer.setPixelRatio(DPR);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.background = C(0xb4d3ef);
  scene.fog = new THREE.Fog(scene.background.clone(), 300, 600);

  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 1600);
  const ISO_YAW = Math.PI / 4, ISO_PITCH = 50 * Math.PI / 180, ISO_DIST = 500;
  const ISO_DIR = new THREE.Vector3(Math.sin(ISO_YAW) * Math.cos(ISO_PITCH), Math.sin(ISO_PITCH), Math.cos(ISO_YAW) * Math.cos(ISO_PITCH));
  let zoom = 75, zoomTarget = 75;
  const ZOOM_MIN = 35, ZOOM_MAX = 170;

  const ambient = new THREE.AmbientLight(0xffffff, 0.42);
  const hemi = new THREE.HemisphereLight(C(0xcfe6ff), C(0x6f8a4a), 0.28);
  const sun = new THREE.DirectionalLight(0xfff3e0, 1.15);
  sun.castShadow = true;
  sun.shadow.mapSize.set(4096, 4096);
  Object.assign(sun.shadow.camera, { left: -150, right: 150, top: 150, bottom: -150, near: 1, far: 700 });
  sun.shadow.bias = -0.0006;
  sun.shadow.normalBias = 0.4;
  scene.add(ambient, hemi, sun, sun.target);

  // =====================================================================
  // Materials + shared geometry (low-poly, flat shaded)
  // =====================================================================
  const MATS = {
    terrain: new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.92, metalness: 0 }),
    tree: new THREE.MeshStandardMaterial({ color: COL.tree, flatShading: true, roughness: 0.85 }),
    boulder: new THREE.MeshStandardMaterial({ color: COL.boulder, flatShading: true, roughness: 0.9 }),
    stone: new THREE.MeshStandardMaterial({ color: COL.stone, flatShading: true, roughness: 0.9 }),
    log: new THREE.MeshStandardMaterial({ color: COL.bark, flatShading: true, roughness: 0.95 }),
  };
  MATS.treeFallen = MATS.tree.clone();       // knocked-down trees don't sway

  // Shared shader inputs: clock, wind gust (0–1), snow lying on the ground (0–1), puddles (0–1), sky colour
  const U = {
    time: { value: 0 }, gust: { value: 0 }, snow: { value: 0 }, puddle: { value: 0 },
    sky: { value: new THREE.Color() }, ground: { value: null },
  };

  // Ground noise, tileable every GROUND_TILE metres: R = where puddles gather, G = where snow settles
  // first. The CPU samples the same texels (bilinear, like the GPU) to know when a wheel is in a puddle.
  const GROUND_TILE = 96, GN = 128;
  const groundData = new Uint8Array(GN * GN * 4);
  {
    const tn = new SimplexNoise('valley-ground'), TAU = Math.PI * 2;
    const t4 = (u, v, f, o) => tn.noise4D(Math.cos(TAU * u) * f + o, Math.sin(TAU * u) * f, Math.cos(TAU * v) * f, Math.sin(TAU * v) * f + o);
    for (let y = 0; y < GN; y++) for (let x = 0; x < GN; x++) {
      const u = x / GN, v = y / GN, i = (y * GN + x) * 4;
      const pud = 0.5 + 0.5 * (0.65 * t4(u, v, 1.6, 0) + 0.35 * t4(u, v, 4.2, 7));
      const snw = 0.5 + 0.5 * (0.5 * t4(u, v, 3, 20) + 0.5 * t4(u, v, 9, 40));
      groundData[i] = clamp(pud * 255, 0, 255); groundData[i + 1] = clamp(snw * 255, 0, 255); groundData[i + 3] = 255;
    }
  }
  U.ground.value = new THREE.DataTexture(groundData, GN, GN, THREE.RGBAFormat);
  Object.assign(U.ground.value, { wrapS: THREE.RepeatWrapping, wrapT: THREE.RepeatWrapping, magFilter: THREE.LinearFilter, minFilter: THREE.LinearFilter, generateMipmaps: false, needsUpdate: true });
  function groundNoise(x, z, ch) {                  // bilinear, same texel centres as the GPU
    const fx = ((x / GROUND_TILE) % 1 + 1) % 1 * GN - 0.5, fz = ((z / GROUND_TILE) % 1 + 1) % 1 * GN - 0.5;
    const x0 = Math.floor(fx), z0 = Math.floor(fz), tx = fx - x0, tz = fz - z0;
    const at = (xx, zz) => groundData[((((zz % GN) + GN) % GN) * GN + (((xx % GN) + GN) % GN)) * 4 + ch] / 255;
    return (at(x0, z0) * (1 - tx) + at(x0 + 1, z0) * tx) * (1 - tz) + (at(x0, z0 + 1) * (1 - tx) + at(x0 + 1, z0 + 1) * tx) * tz;
  }
  const PUDDLE_T = (p) => 1 - p * 0.35;            // puddle threshold on R, lower as the ground gets wetter
  const inPuddle = (x, z) => U.puddle.value > 0.05 && groundNoise(x, z, 0) > PUDDLE_T(U.puddle.value) + 0.03 && normalAt(x, z).y > 0.96;

  // One shader hook for all the props (programs are told apart by their defines):
  //  FX_SWAY  — trees bend with the wind, tips most, each on its own phase
  //  FX_PUDDLE — the terrain gathers glossy, sky-tinted puddles on flat ground
  //  always   — snow settles on upward-facing faces, patchy at first, then everywhere
  function fxCompile(sh) {
    Object.assign(sh.uniforms, { uTime: U.time, uGust: U.gust, uSnow: U.snow, uPuddle: U.puddle, uSkyCol: U.sky, uGroundTex: U.ground, uMinUp: { value: this.userData.minUp }, uSnowAmt: { value: this.userData.snowAmt } });
    sh.vertexShader = 'uniform float uTime;\nuniform float uGust;\nvarying vec3 vFxWP;\n' + sh.vertexShader
      .replace('#include <begin_vertex>', `#include <begin_vertex>
      #ifdef FX_SWAY
        #ifdef USE_INSTANCING
          vec2 swp = vec2(instanceMatrix[3][0], instanceMatrix[3][2]);
        #else
          vec2 swp = vec2(modelMatrix[3][0], modelMatrix[3][2]);
        #endif
        float hk = max(position.y, 0.0) / 3.4;
        float sway = sin(uTime * (1.4 + 1.6 * uGust) + swp.x * 0.35 + swp.y * 0.21) * (0.05 + 0.25 * uGust) + 0.3 * uGust;
        transformed.x += sway * hk * hk;
        transformed.z += sway * hk * hk * 0.4;
      #endif`)
      .replace('#include <project_vertex>', `#include <project_vertex>
      #ifdef USE_INSTANCING
        vFxWP = (modelMatrix * instanceMatrix * vec4(transformed, 1.0)).xyz;
      #else
        vFxWP = (modelMatrix * vec4(transformed, 1.0)).xyz;
      #endif`);
    sh.fragmentShader = 'uniform float uSnow;\nuniform float uPuddle;\nuniform vec3 uSkyCol;\nuniform sampler2D uGroundTex;\nuniform float uMinUp;\nuniform float uSnowAmt;\nvarying vec3 vFxWP;\n' + sh.fragmentShader
      .replace('#include <color_fragment>', `#include <color_fragment>
      vec3 fxN = normalize(cross(dFdx(vFxWP), dFdy(vFxWP)));
      float fxUp = abs(fxN.y);
      vec4 fxTex = texture2D(uGroundTex, vFxWP.xz / ${GROUND_TILE.toFixed(1)});
      float fxPud = 0.0;
      #ifdef FX_PUDDLE
        // (same threshold as PUDDLE_T on the CPU)
        fxPud = smoothstep(1.0 - uPuddle * 0.35, 1.0 - uPuddle * 0.35 + 0.04, fxTex.r) * smoothstep(0.95, 0.975, fxUp) * step(0.02, uPuddle);
        diffuseColor.rgb = mix(diffuseColor.rgb, uSkyCol * 0.5 + vec3(0.015, 0.03, 0.05), fxPud * 0.85);
      #endif
      float fxSnow = clamp((uSnow * 1.35 - fxTex.g) * 5.0, 0.0, 1.0) * smoothstep(uMinUp, uMinUp + 0.25, fxUp) * uSnowAmt * (1.0 - fxPud);
      diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.92, 0.95, 1.0), fxSnow);`)
      .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>
      roughnessFactor = mix(roughnessFactor, 0.1, fxPud);
      roughnessFactor = mix(roughnessFactor, 0.75, fxSnow);`);
  }
  const addFx = (mat, { minUp = 0.55, snowAmt = 1, sway = false, puddle = false } = {}) => {
    mat.userData.minUp = minUp; mat.userData.snowAmt = snowAmt;
    mat.defines = Object.assign(mat.defines || {}, sway ? { FX_SWAY: '' } : {}, puddle ? { FX_PUDDLE: '' } : {});
    mat.onBeforeCompile = fxCompile;
  };
  addFx(MATS.terrain, { puddle: true });
  addFx(MATS.tree, { minUp: 0.15, snowAmt: 0.75, sway: true });
  addFx(MATS.treeFallen, { minUp: 0.15, snowAmt: 0.75 });
  addFx(MATS.boulder, { minUp: 0.45 });
  addFx(MATS.stone, { minUp: 0.45 });
  addFx(MATS.log, { minUp: 0.5 });
  const GEOS = {
    tree: new THREE.ConeGeometry(0.9, 3.4, 5, 1).translate(0, 1.7, 0),
    boulder: new THREE.IcosahedronGeometry(1, 0),
    log: new THREE.CylinderGeometry(1, 1, 1, 7, 1).rotateZ(Math.PI / 2),   // unit length along x
  };
  const X_AXIS = new THREE.Vector3(1, 0, 0);

  // =====================================================================
  // Chunks
  // =====================================================================
  const chunks = new Map();          // key → { mesh, trees, treeData, rocks, roadRocks, logs, cx, cz }
  const knocked = new Set();         // "cx,cz,i" of trees already knocked down
  const movedLogs = new Set();       // chunk keys whose road log the car has moved (it's a body now)
  const propsSpawned = new Set();    // chunk keys whose boulders exist
  const key = (cx, cz) => cx + ',' + cz;
  const tmpColor = new THREE.Color();

  function terrainGeometry(cx, cz) {
    const ox = cx * CHUNK, oz = cz * CHUNK;
    const g = new THREE.PlaneGeometry(CHUNK, CHUNK, SEGS, SEGS);
    g.rotateX(-Math.PI / 2);
    const pos = g.attributes.position, nv = pos.count;
    const rel = new Float32Array(nv), dist = new Float32Array(nv);
    for (let i = 0; i < nv; i++) {
      const s = sample(pos.getX(i) + ox, pos.getZ(i) + oz);
      pos.setY(i, s.y); rel[i] = s.rel; dist[i] = s.d;
    }

    // Split into separate triangles, one solid colour each
    const idx = g.index.array;
    const flat = g.toNonIndexed();
    g.dispose();
    const tris = idx.length / 3, colors = new Float32Array(tris * 9), fp = flat.attributes.position;
    const r = rng(chunkHash(cx, cz, 1));
    for (let t = 0; t < tris; t++) {
      const a = idx[t * 3], b = idx[t * 3 + 1], c = idx[t * 3 + 2];
      const d = (dist[a] + dist[b] + dist[c]) / 3;
      const h = (rel[a] + rel[b] + rel[c]) / 3;
      const wx = (fp.getX(t * 3) + fp.getX(t * 3 + 1) + fp.getX(t * 3 + 2)) / 3 + ox;
      const wz = (fp.getZ(t * 3) + fp.getZ(t * 3 + 1) + fp.getZ(t * 3 + 2)) / 3 + oz;
      // face slope, for keeping trails off steep ground
      const ax = fp.getX(t * 3), ay = fp.getY(t * 3), az = fp.getZ(t * 3);
      const e1x = fp.getX(t * 3 + 1) - ax, e1y = fp.getY(t * 3 + 1) - ay, e1z = fp.getZ(t * 3 + 1) - az;
      const e2x = fp.getX(t * 3 + 2) - ax, e2y = fp.getY(t * 3 + 2) - ay, e2z = fp.getZ(t * 3 + 2) - az;
      const nx = e1y * e2z - e1z * e2y, ny = e1z * e2x - e1x * e2z, nz = e1x * e2y - e1y * e2x;
      const upness = Math.abs(ny) / (Math.hypot(nx, ny, nz) || 1);
      if (d < ROAD_HALF) tmpColor.copy(COL.road);
      else if (d < ROAD_HALF + 2.2) tmpColor.copy(COL.shoulder);
      else if (h > snowline(wx, wz)) tmpColor.copy(r() < 0.5 ? COL.rock : COL.rockDark);
      else if (upness > 0.82 && h < snowline(wx, wz) - 3 && trailAt(wx, wz, 1)) tmpColor.copy(r() < 0.5 ? COL.trail : COL.trailDark);
      else tmpColor.copy(r() < 0.55 ? COL.grass : COL.grassDark);
      const j = 0.96 + r() * 0.08;
      for (let k = 0; k < 3; k++) {
        colors[t * 9 + k * 3] = tmpColor.r * j; colors[t * 9 + k * 3 + 1] = tmpColor.g * j; colors[t * 9 + k * 3 + 2] = tmpColor.b * j;
      }
    }
    flat.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    flat.computeVertexNormals();
    flat.computeBoundingBox(); flat.computeBoundingSphere();
    return flat;
  }

  const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _v = new THREE.Vector3(), _s = new THREE.Vector3();
  const ZERO_M = new THREE.Matrix4().makeScale(0, 0, 0);

  function buildChunk(cx, cz) {
    const ox = cx * CHUNK, oz = cz * CHUNK, k = key(cx, cz);
    const mesh = new THREE.Mesh(terrainGeometry(cx, cz), MATS.terrain);
    mesh.position.set(ox, 0, oz);
    mesh.castShadow = true; mesh.receiveShadow = true;
    mesh.matrixAutoUpdate = false; mesh.updateMatrix();
    scene.add(mesh);
    // The road crosses each z in exactly one chunk column: only that chunk places road hazards there
    const roadHere = (z) => Math.abs(pathX(z) - ox) < CHUNK / 2 && Math.abs(z) > SAFE_START;

    // Trees (deterministic per chunk + seed)
    const r = rng(chunkHash(cx, cz, 2));
    const treeData = [];
    for (let i = 0; i < TREE_TRIES; i++) {
      const x = ox + (r() - 0.5) * CHUNK, z = oz + (r() - 0.5) * CHUNK;
      const sc = 0.7 + r() * 0.7, rot = r() * 6.28;
      const s = sample(x, z);
      if (s.d < ROAD_HALF + 4) continue;
      if (s.rel > snowline(x, z) - 6) continue;
      if (trailAt(x, z, 1.8)) continue;                         // keep the dirt trails clear
      if (normalAt(x, z).y < 0.8) continue;
      treeData.push({ x, y: s.y - 0.3, z, sc, rot, alive: !knocked.has(k + ',' + treeData.length), id: treeData.length });
    }
    let trees = null;
    if (treeData.length) {
      trees = new THREE.InstancedMesh(GEOS.tree, MATS.tree, treeData.length);
      treeData.forEach((t, i) => {
        if (!t.alive) { trees.setMatrixAt(i, ZERO_M); return; }
        _q.setFromEuler(_e.set(0, t.rot, 0));
        _m.compose(_v.set(t.x - ox, t.y, t.z - oz), _q, _s.set(t.sc, t.sc * (0.9 + (i % 3) * 0.12), t.sc));
        trees.setMatrixAt(i, _m);
      });
      trees.position.set(ox, 0, oz);
      trees.castShadow = true; trees.receiveShadow = true;
      trees.matrixAutoUpdate = false; trees.updateMatrix();
      scene.add(trees);
    }

    // Small stones: scattered off-road, plus now and then one on the road (a bump auto-drive steers round)
    const rr = rng(chunkHash(cx, cz, 4));
    const rockData = [], roadRocks = [];
    for (let i = 0; i < ROCK_TRIES; i++) {
      const x = ox + (rr() - 0.5) * CHUNK, z = oz + (rr() - 0.5) * CHUNK;
      const rad = 0.2 + rr() * 0.5, rot = rr() * 6.28;
      const s = sample(x, z);
      if (s.d < ROAD_HALF + 1.5) continue;
      if (normalAt(x, z).y < 0.6) continue;
      rockData.push({ x, y: s.y, z, r: rad, rot });
    }
    if (rr() < ROAD_ROCK_CHANCE) {
      const z = oz + (rr() - 0.5) * CHUNK, lat = (rr() - 0.5) * (ROAD_HALF * 2 - 2), rad = 0.4 + rr() * 0.3, rot = rr() * 6.28;
      if (roadHere(z)) {
        const x = pathX(z) + lat;
        const t = { x, y: heightAt(x, z), z, r: rad, rot, hit: false };
        rockData.push(t); roadRocks.push(t);
      }
    }
    let rocks = null;
    if (rockData.length) {
      rocks = new THREE.InstancedMesh(GEOS.boulder, MATS.stone, rockData.length);
      rockData.forEach((t, i) => {
        _q.setFromEuler(_e.set(0, t.rot, 0));
        _m.compose(_v.set(t.x - ox, t.y - t.r * 0.2, t.z - oz), _q, _s.set(t.r * 1.15, t.r * 0.7, t.r));
        rocks.setMatrixAt(i, _m);
      });
      rocks.position.set(ox, 0, oz);
      rocks.castShadow = true; rocks.receiveShadow = true;
      rocks.matrixAutoUpdate = false; rocks.updateMatrix();
      scene.add(rocks);
    }

    // Fallen log lying across one side of the road (the other side stays passable)
    const logs = [];
    const rl = rng(chunkHash(cx, cz, 5));
    if (rl() < LOG_CHANCE) {
      const z = oz + (rl() - 0.5) * (CHUNK - 8);
      const side = rl() < 0.5 ? -1 : 1, len = 3.2 + rl() * 1.8, rad = 0.32 + rl() * 0.1, jit = (rl() - 0.5) * 0.7;
      if (roadHere(z) && !movedLogs.has(k)) {                     // (a log the car moved lives on as a body)
        const sl = (pathX(z + 1) - pathX(z - 1)) * 0.5, inv = 1 / Math.sqrt(1 + sl * sl);
        const px = inv, pz = -sl * inv;                              // across the road
        const cj = Math.cos(jit), sj = Math.sin(jit);
        const nx = px * cj - pz * sj, nz = px * sj + pz * cj;         // …a little skewed
        const lat = side * (ROAD_HALF + 0.8 - len / 2);
        const mx = pathX(z) + px * lat, mz = z + pz * lat;
        const x1 = mx - nx * len / 2, z1 = mz - nz * len / 2, x2 = mx + nx * len / 2, z2 = mz + nz * len / 2;
        const y1 = heightAt(x1, z1) + rad * 0.85, y2 = heightAt(x2, z2) + rad * 0.85;
        const lm = new THREE.Mesh(GEOS.log, MATS.log);
        lm.position.set((x1 + x2) / 2, (y1 + y2) / 2, (z1 + z2) / 2);
        _v.set(x2 - x1, y2 - y1, z2 - z1);
        const l3 = _v.length();
        lm.quaternion.setFromUnitVectors(X_AXIS, _v.divideScalar(l3));
        lm.scale.set(l3, rad, rad);
        lm.castShadow = true; lm.receiveShadow = true;
        scene.add(lm);
        logs.push({ mesh: lm, x1, z1, x2, z2, y: (y1 + y2) / 2, r: rad, home: k });
      }
    }

    chunks.set(k, { mesh, trees, treeData, rocks, roadRocks, logs, cx, cz });

    // Boulders: spawned once per chunk visit, then simulated freely
    if (!propsSpawned.has(k)) {
      propsSpawned.add(k);
      const rb = rng(chunkHash(cx, cz, 3));
      for (let i = 0; i < BOULDER_TRIES; i++) {
        const x = ox + (rb() - 0.5) * CHUNK, z = oz + (rb() - 0.5) * CHUNK;
        const rad = 0.8 + rb() * 1.1;
        const s = sample(x, z);
        if (s.d < ROAD_HALF + 3 || s.d > ROAD_HALF + 30) continue;
        if (normalAt(x, z).y < 0.9) continue;
        spawnBoulder(x, s.y + rad * 0.8, z, rad, k);
      }
      if (rb() < ROAD_BOULDER_CHANCE) {
        const z = oz + (rb() - 0.5) * CHUNK, rad = 0.8 + rb() * 0.6, lat = (rb() - 0.5) * (ROAD_HALF * 2 - 2 * rad);
        if (roadHere(z)) { const x = pathX(z) + lat; spawnBoulder(x, heightAt(x, z) + rad * 0.8, z, rad, k); }
      }
    }
  }

  function disposeChunkMeshes(k) {
    const ch = chunks.get(k);
    if (!ch) return;
    scene.remove(ch.mesh); ch.mesh.geometry.dispose();
    if (ch.trees) { scene.remove(ch.trees); ch.trees.dispose(); }
    if (ch.rocks) { scene.remove(ch.rocks); ch.rocks.dispose(); }
    for (const l of ch.logs) scene.remove(l.mesh);
    chunks.delete(k);
  }

  function updateChunks(px, pz, fx, fz, budget) {
    const ccx = Math.round(px / CHUNK), ccz = Math.round(pz / CHUNK);
    for (const [k, ch] of chunks) {
      if (Math.abs(ch.cx - ccx) > VIEW + 1 || Math.abs(ch.cz - ccz) > VIEW + 1) {
        disposeChunkMeshes(k);
        propsSpawned.delete(k);
        removeBouldersOf(k);
      }
    }
    const need = [];
    for (let dz = -VIEW; dz <= VIEW; dz++) for (let dx = -VIEW; dx <= VIEW; dx++) {
      const cx = ccx + dx, cz = ccz + dz;
      if (chunks.has(key(cx, cz))) continue;
      const wx = cx * CHUNK - px, wz = cz * CHUNK - pz, dd = Math.hypot(wx, wz);
      const ahead = dd > 0 ? (wx * fx + wz * fz) / dd : 1;
      need.push([dd * (1.4 - 0.6 * ahead), cx, cz]);
    }
    need.sort((a, b) => a[0] - b[0]);
    for (let i = 0; i < Math.min(budget, need.length); i++) buildChunk(need[i][1], need[i][2]);
  }

  // =====================================================================
  // Dynamic props: boulders (rolling rigid spheres) and knocked-down trees
  // =====================================================================
  const boulders = [];
  function spawnBoulder(x, y, z, r, home) {
    const mesh = new THREE.Mesh(GEOS.boulder, MATS.boulder);
    mesh.scale.set(r, r * 0.85, r);
    mesh.castShadow = true; mesh.receiveShadow = true;
    mesh.rotation.set(Math.random() * 6, Math.random() * 6, 0);
    scene.add(mesh);
    boulders.push({ mesh, pos: new THREE.Vector3(x, y, z), vel: new THREE.Vector3(), r, home, awake: true, rest: 0 });
  }
  function removeBouldersOf(home) {
    for (let i = boulders.length - 1; i >= 0; i--) {
      if (boulders[i].home === home) { scene.remove(boulders[i].mesh); boulders.splice(i, 1); }
    }
  }

  const fallen = [];
  function knockTree(ch, t, carVel) {
    t.alive = false;
    knocked.add(key(ch.cx, ch.cz) + ',' + t.id);
    ch.trees.setMatrixAt(ch.treeData.indexOf(t), ZERO_M);
    ch.trees.instanceMatrix.needsUpdate = true;
    const mesh = new THREE.Mesh(GEOS.tree, MATS.treeFallen);
    mesh.castShadow = true;
    mesh.scale.setScalar(t.sc);
    scene.add(mesh);
    const dir = new THREE.Vector3(carVel.x, 0, carVel.z);
    const spd = dir.length();
    dir.normalize();
    fallen.push({
      mesh, pos: new THREE.Vector3(t.x, t.y, t.z), sc: t.sc,
      vel: new THREE.Vector3(dir.x * spd * 0.5, 2 + spd * 0.12, dir.z * spd * 0.5),
      axis: new THREE.Vector3(dir.z, 0, -dir.x),     // tip over in the direction of travel
      angle: 0, angVel: 1.5 + spd * 0.12, yaw: t.rot, life: 0,
    });
    if (fallen.length > 40) { scene.remove(fallen[0].mesh); fallen.shift(); }
  }

  // Logs the car has hit become bodies: they slide, spin about their middle, roll downhill, hop when
  // struck, and a hard hit snaps them in two (pieces can snap again while they're long enough)
  const logBodies = [];
  const LOG_DENSITY = 90;            // kg per metre
  function logFromStatic(ch, l) {
    ch.logs.splice(ch.logs.indexOf(l), 1);
    movedLogs.add(l.home);
    const len = Math.hypot(l.x2 - l.x1, l.z2 - l.z1);
    return addLogBody(l.mesh, (l.x1 + l.x2) / 2, l.y, (l.z1 + l.z2) / 2, Math.atan2(l.z2 - l.z1, l.x2 - l.x1), len, l.r);
  }
  function addLogBody(mesh, x, y, z, yaw, len, r) {
    const b = { mesh, x, y, z, yaw, len, r, vx: 0, vy: 0, vz: 0, w: 0, roll: 0, awake: true, rest: 0, cool: 0 };
    b.m = LOG_DENSITY * len; b.I = b.m * len * len / 12;
    logBodies.push(b);
    placeLog(b);
    return b;
  }
  const logEnds = (b) => {
    const ax = Math.cos(b.yaw) * b.len / 2, az = Math.sin(b.yaw) * b.len / 2;
    return [b.x - ax, b.z - az, b.x + ax, b.z + az];
  };
  const _qr = new THREE.Quaternion();
  function placeLog(b) {
    const [x1, z1, x2, z2] = logEnds(b);
    const h1 = heightAt(x1, z1), h2 = heightAt(x2, z2);
    _v.set(x2 - x1, h2 - h1, z2 - z1);
    const l3 = _v.length();
    b.mesh.quaternion.setFromUnitVectors(X_AXIS, _v.divideScalar(l3)).multiply(_qr.setFromAxisAngle(X_AXIS, b.roll));
    b.mesh.scale.set(b.len, b.r, b.r);
    b.mesh.position.set(b.x, b.y, b.z);
  }
  function breakLog(b, u, hitSpeed, loud = 1) {
    // split at the point of impact (kept away from the very ends)
    u = clamp(u, 0.3, 0.7);
    const [x1, z1, x2, z2] = logEnds(b);
    const pieces = [[0, u], [u, 1]];
    const i = logBodies.indexOf(b);
    if (i >= 0) logBodies.splice(i, 1);
    pieces.forEach(([a, c], k) => {
      const mx = x1 + (x2 - x1) * (a + c) / 2, mz = z1 + (z2 - z1) * (a + c) / 2, len = b.len * (c - a);
      const mesh = k === 0 ? b.mesh : new THREE.Mesh(GEOS.log, MATS.log);
      if (k) { mesh.castShadow = mesh.receiveShadow = true; scene.add(mesh); }
      const p = addLogBody(mesh, mx, b.y, mz, b.yaw + (Math.random() - 0.5) * 0.3, len, b.r);
      // each half keeps the log's motion at its own centre, plus a kick apart and a hop
      const rx = mx - b.x, rz = mz - b.z;
      p.vx = b.vx - b.w * rz + rx * 1.5 + (Math.random() - 0.5) * 2;
      p.vz = b.vz + b.w * rx + rz * 1.5 + (Math.random() - 0.5) * 2;
      p.vy = 2.5 + Math.random() * 2.5;
      p.w = (Math.random() - 0.5) * 6 + b.w;
      p.cool = 0.4;
    });
    chips(b.x, b.y, b.z, 26, hitSpeed);
    logSound(true, Math.min(1, hitSpeed / 20) * loud);
    if (logBodies.length > 30) { scene.remove(logBodies[0].mesh); logBodies.shift(); }
  }
  function stepLogs(dt) {
    for (let i = logBodies.length - 1; i >= 0; i--) {
      const b = logBodies[i];
      if (Math.abs(b.x - state.x) > 260 || Math.abs(b.z - state.z) > 260) { scene.remove(b.mesh); logBodies.splice(i, 1); continue; }
      b.cool = Math.max(0, b.cool - dt);
      if (!b.awake) continue;
      const [x1, z1, x2, z2] = logEnds(b);
      const ground = (heightAt(x1, z1) + heightAt(x2, z2)) / 2 + b.r * 0.85;
      b.vy -= G * dt;
      b.y += b.vy * dt;
      const onGround = b.y <= ground;
      if (onGround) {
        b.y = ground;
        b.vy = b.vy < -3 ? -b.vy * 0.2 : 0;
        const n = normalAt(b.x, b.z);
        b.vx += n.x * G * 0.45 * dt; b.vz += n.z * G * 0.45 * dt;      // slides / rolls downhill
        const f = Math.exp(-dt * 2.4);
        b.vx *= f; b.vz *= f; b.w *= Math.exp(-dt * 2.8);
        const sp = Math.hypot(b.vx, b.vz);
        if (sp < 0.25 && Math.abs(b.w) < 0.15 && n.y > 0.9) { b.rest += dt; if (b.rest > 0.8) { b.awake = false; b.vx = b.vz = b.w = 0; } }
        else b.rest = 0;
      }
      b.x += b.vx * dt; b.z += b.vz * dt; b.yaw += b.w * dt;
      // roll about its own axis when moving sideways to it
      b.roll += (-b.vx * Math.sin(b.yaw) + b.vz * Math.cos(b.yaw)) / b.r * dt;
      placeLog(b);
    }
  }
  // vehicle ↔ log body: 2D rigid-body impulse at the contact point (the player's car ≈ 1200 kg)
  function hitLog(v, b, fx, fz) {
    const s = v.s;
    const [x1, z1, x2, z2] = logEnds(b);
    const ex = x2 - x1, ez = z2 - z1;
    const u = clamp(((s.x - x1) * ex + (s.z - z1) * ez) / (ex * ex + ez * ez), 0, 1);
    const px = x1 + ex * u, pz = z1 + ez * u;
    let nx = s.x - px, nz = s.z - pz;
    const d = Math.hypot(nx, nz), minD = b.r + v.hitR;
    if (d >= minD || d < 1e-4 || Math.abs(b.y - s.y) > 2.4) return;
    nx /= d; nz /= d;
    // separate, sharing the overlap by mass
    const over = minD - d, share = b.m / (b.m + v.mass);
    s.x += nx * over * share; s.z += nz * over * share;
    b.x -= nx * over * (1 - share); b.z -= nz * over * (1 - share);
    const rx = px - b.x, rz = pz - b.z;
    const lvx = b.vx - b.w * rz, lvz = b.vz + b.w * rx;           // log's velocity at the contact point
    const vrel = (fx * s.speed - lvx) * nx + (fz * s.speed - lvz) * nz;
    if (vrel >= -0.2) return;                                    // not closing
    const rn = rx * nz - rz * nx;
    const j = -(1 + 0.2) * vrel / (1 / v.mass + 1 / b.m + rn * rn / b.I);
    b.vx -= j / b.m * nx; b.vz -= j / b.m * nz; b.w -= j * rn / b.I;
    b.vy = Math.max(b.vy, Math.min(4, -vrel * 0.25));
    b.awake = true; b.rest = 0;
    s.speed += (j / v.mass) * (nx * fx + nz * fz);
    s.suspV += 0.5 + Math.min(1, -vrel / 15);
    const loud = v.player ? 1 : audibility(v);
    if (-vrel > 9 && b.len > 1.8 && b.cool <= 0) breakLog(b, u, -vrel, loud);
    else { logSound(false, Math.min(1, -vrel / 15) * loud); if (-vrel > 4) chips(px, b.y, pz, 6, -vrel); }
  }

  const _up = new THREE.Vector3(0, 1, 0), _axis = new THREE.Vector3(), _qa = new THREE.Quaternion(), _qb = new THREE.Quaternion();
  function stepProps(dt) {
    // Boulders
    for (const b of boulders) {
      if (!b.awake) continue;
      if (Math.abs(b.pos.x - state.x) > 170 || Math.abs(b.pos.z - state.z) > 170) continue;
      b.vel.y -= G * dt;
      b.pos.addScaledVector(b.vel, dt);
      const ground = heightAt(b.pos.x, b.pos.z);
      const n = normalAt(b.pos.x, b.pos.z);
      if (b.pos.y - b.r * 0.8 < ground) {
        b.pos.y = ground + b.r * 0.8;
        const vn = b.vel.dot(n);
        if (vn < 0) b.vel.addScaledVector(n, -vn * 1.25);              // restitution 0.25
        const fr = Math.max(0, 1 - 1.4 * dt);
        b.vel.multiplyScalar(fr);                                       // rolling friction
        const hs = Math.hypot(b.vel.x, b.vel.z);
        if (hs > 0.01) {
          _axis.set(b.vel.z, 0, -b.vel.x).normalize();
          _qa.setFromAxisAngle(_axis, hs * dt / b.r);
          b.mesh.quaternion.premultiply(_qa);
        }
        if (b.vel.lengthSq() < 0.15 && n.y > 0.88) { b.rest += dt; if (b.rest > 0.6) { b.awake = false; b.vel.set(0, 0, 0); } }
        else b.rest = 0;
      }
      b.mesh.position.copy(b.pos);
    }
    // Knocked trees
    for (let i = fallen.length - 1; i >= 0; i--) {
      const f = fallen[i];
      f.life += dt;
      f.vel.y -= G * dt;
      f.pos.addScaledVector(f.vel, dt);
      const ground = heightAt(f.pos.x, f.pos.z);
      if (f.pos.y < ground) { f.pos.y = ground; f.vel.y = 0; f.vel.multiplyScalar(Math.max(0, 1 - 4 * dt)); }
      if (f.angle < Math.PI / 2 - 0.05) { f.angle = Math.min(Math.PI / 2 - 0.05, f.angle + f.angVel * dt); f.angVel += 4 * dt; }
      _qa.setFromAxisAngle(f.axis, f.angle);
      _qb.setFromAxisAngle(_up, f.yaw);
      f.mesh.quaternion.multiplyQuaternions(_qa, _qb);
      const sink = f.life > 7 ? (f.life - 7) * 0.8 : 0;
      f.mesh.position.set(f.pos.x, f.pos.y - sink, f.pos.z);
      if (f.life > 9) { scene.remove(f.mesh); fallen.splice(i, 1); }
    }
    stepLogs(dt);
  }

  // =====================================================================
  // Car
  // =====================================================================
  function buildCar() {
    const car = new THREE.Group();
    const body = new THREE.Group();
    car.add(body);
    const M = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: C(c), flatShading: true, roughness: 0.55, metalness: 0.1 }, o));
    const red = M(0xd8342c, { roughness: 0.4, metalness: 0.25 });
    const black = M(0x1c1f24, { roughness: 0.7 });
    const glass = M(0x2a3b4f, { roughness: 0.15, metalness: 0.4 });
    const chrome = M(0xcfd6de, { roughness: 0.25, metalness: 0.8 });
    const lamp = M(0xffffff, { emissive: C(0xfff6d8), emissiveIntensity: 0.9 });
    const tail = M(0xb3121b, { emissive: C(0xff2a2a), emissiveIntensity: 0.6 });
    const tyre = M(0x16181b, { roughness: 0.9 });
    const rim = M(0x9aa3ad, { roughness: 0.35, metalness: 0.7 });
    const box = (w, h, d, mat, x, y, z) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; body.add(m); return m; };

    box(1.78, 0.62, 3.98, red, 0, 0.78, 0);
    box(1.84, 0.26, 4.04, black, 0, 0.42, 0);
    const hood = box(1.72, 0.18, 1.05, red, 0, 1.14, -1.45); hood.rotation.x = 0.06;
    box(1.6, 0.58, 2.35, glass, 0, 1.38, 0.3);
    const ws = box(1.58, 0.62, 0.08, glass, 0, 1.36, -0.92); ws.rotation.x = -0.52;
    box(1.63, 0.08, 2.4, red, 0, 1.11, 0.3);
    [[-1, -0.78], [1, -0.78], [-1, 0.25], [1, 0.25], [-1, 1.42], [1, 1.42]].forEach(([s, z]) => box(0.06, 0.56, 0.12, black, s * 0.8, 1.38, z));
    box(1.66, 0.08, 2.46, black, 0, 1.71, 0.3);
    box(0.06, 0.07, 2.1, chrome, -0.66, 1.79, 0.32);
    box(0.06, 0.07, 2.1, chrome, 0.66, 1.79, 0.32);
    box(1.2, 0.32, 0.06, black, 0, 0.88, -2.0);
    box(1.24, 0.05, 0.07, chrome, 0, 1.0, -2.02);
    box(0.36, 0.14, 0.07, lamp, -0.66, 1.0, -2.0);
    box(0.36, 0.14, 0.07, lamp, 0.66, 1.0, -2.0);
    box(1.1, 0.1, 0.1, chrome, 0, 0.36, -2.03);
    box(0.3, 0.16, 0.06, tail, -0.7, 1.0, 2.01);
    box(0.3, 0.16, 0.06, tail, 0.7, 1.0, 2.01);
    const rg = box(1.4, 0.42, 0.06, glass, 0, 1.38, 1.5); rg.rotation.x = 0.28;
    box(1.1, 0.1, 0.1, chrome, 0, 0.36, 2.03);
    [[-1, -1.25], [1, -1.25], [-1, 1.25], [1, 1.25]].forEach(([s, z]) => box(0.08, 0.34, 0.98, black, s * 0.9, 0.66, z));
    box(0.18, 0.12, 0.1, black, -0.92, 1.2, -0.72);
    box(0.18, 0.12, 0.1, black, 0.92, 1.2, -0.72);

    const wheels = [];
    const tyreGeo = new THREE.CylinderGeometry(0.37, 0.37, 0.28, 9).rotateZ(Math.PI / 2);
    const rimGeo = new THREE.CylinderGeometry(0.21, 0.21, 0.3, 6).rotateZ(Math.PI / 2);
    [[-0.82, -1.25, true], [0.82, -1.25, true], [-0.82, 1.25, false], [0.82, 1.25, false]].forEach(([x, z, front]) => {
      const pivot = new THREE.Group(); pivot.position.set(x, 0.37, z);
      const spin = new THREE.Group(); pivot.add(spin);
      const t = new THREE.Mesh(tyreGeo, tyre); t.castShadow = true;
      spin.add(t, new THREE.Mesh(rimGeo, rim));
      car.add(pivot);
      wheels.push({ pivot, spin, front });
    });

    const flameMat = new THREE.MeshBasicMaterial({ color: C(0xffb03a), transparent: true, opacity: 0.9 });
    const flames = new THREE.Group();
    [-0.45, 0.45].forEach((x) => {
      const f = new THREE.Mesh(new THREE.ConeGeometry(0.16, 1.1, 5).rotateX(Math.PI / 2).translate(0, 0, 0.55), flameMat);
      f.position.set(x, 0.38, 2.05);
      flames.add(f);
    });
    flames.visible = false;
    body.add(flames);

    // Headlights for dusk, night and bad weather
    const beams = [];
    [-0.66, 0.66].forEach((x) => {
      const sp = new THREE.SpotLight(0xfff2d0, 0, 70, 0.42, 0.55, 1.2);
      sp.position.set(x, 1.0, -2.1);
      sp.target.position.set(x * 3, -1.5, -24);
      body.add(sp, sp.target);
      beams.push(sp);
    });

    // X-ray silhouette where terrain hides the car (drawn after terrain, before the car)
    const xray = new THREE.MeshBasicMaterial({ color: C(0xf2f7ff), depthFunc: THREE.GreaterDepth, depthWrite: false });
    const parts = [];
    car.traverse((o) => { if (o.isMesh && o.material !== flameMat) parts.push(o); });
    parts.forEach((o) => { o.renderOrder = 2; const g = new THREE.Mesh(o.geometry, xray); g.renderOrder = 1; o.add(g); });
    return { car, body, wheels, flames, beams, lamp, tail };
  }
  const { car, body: carBody, wheels, flames, beams, lamp: lampMat, tail: tailMat } = buildCar();
  scene.add(car);

  // =====================================================================
  // Vehicle state
  // =====================================================================
  const UP = new THREE.Vector3(0, 1, 0);
  const state = { x: 0, y: 0, z: 0, vy: 0, yaw: 0, speed: 0, steer: 0, odo: 0, grounded: true, air: 0, boosting: false, susp: 0, suspV: 0, stuck: 0, stuckX: 0, stuckZ: 0 };
  const carVel = new THREE.Vector3();
  const normal = new THREE.Vector3(0, 1, 0);
  // The player's car as a vehicle: traffic (further down) runs through the same physics, collisions
  // and auto-drive. dir: which way along the road it drives (1 = toward −z, the player's way).
  // halfW: half-width auto-drive keeps clear with; hitR: collision radius against props.
  const player = {
    player: true, kind: 'suv', s: state, obj: car, body: carBody, wheels, vel: carVel, normal,
    dir: 1, avoidOff: 0, mass: 1200, halfL: 2.0, halfW: 1.05, hitR: 1.15, maxF: 36, accel: 14, turn: 1.55, roll: 0.06, pace: 1,
  };
  // is the road centre at z free of logs and boulders? (so a reset never lands the car on one)
  function roadClear(z) {
    const x = pathX(z), ccx = Math.round(x / CHUNK), ccz = Math.round(z / CHUNK);
    for (const b of boulders) if (Math.hypot(b.pos.x - x, b.pos.z - z) < b.r + 2.5) return false;
    for (let dz = -1; dz <= 1; dz++) for (let dx = -1; dx <= 1; dx++) {
      const ch = chunks.get(key(ccx + dx, ccz + dz));
      if (!ch) continue;
      for (const l of ch.logs) {
        const ex = l.x2 - l.x1, ez = l.z2 - l.z1;
        const u = clamp(((x - l.x1) * ex + (z - l.z1) * ez) / (ex * ex + ez * ez), 0, 1);
        if (Math.hypot(x - (l.x1 + ex * u), z - (l.z1 + ez * u)) < l.r + 2.5) return false;
      }
    }
    for (const b of logBodies) if (Math.hypot(b.x - x, b.z - z) < b.len / 2 + 2.5) return false;
    return true;
  }
  function placeOnRoad(z) {
    for (let i = 0; i < 8 && !roadClear(z); i++) z -= 6;     // step on down the road until it's clear
    state.z = z; state.x = pathX(z); state.y = roadY(z) + 0.3;
    const s = (pathX(z - 1) - pathX(z + 1)) * 0.5;
    state.yaw = Math.atan2(-s, 1);
    state.speed = 0; state.steer = 0; state.vy = 0; state.stuck = 0; state.stuckX = state.x; state.stuckZ = state.z;
    player.avoidOff = 0;
    normal.set(0, 1, 0);
    car.position.set(state.x, state.y, state.z);
    car.quaternion.setFromAxisAngle(UP, state.yaw);
  }

  // =====================================================================
  // Input + modes (auto-drive by default; any drive key takes over)
  // =====================================================================
  let mode = 'auto';
  const keys = {};
  const map = { KeyW: 'up', ArrowUp: 'up', KeyS: 'down', ArrowDown: 'down', KeyA: 'left', ArrowLeft: 'left', KeyD: 'right', ArrowRight: 'right', Space: 'boost', ControlLeft: 'brake', ControlRight: 'brake' };
  // on auto-drive, Space (boost) and Ctrl (brake) help out without taking over the wheel
  // Touch screens (mobile): always auto-drive — steering, boost and brake only nudge it
  const MOBILE = matchMedia('(pointer: coarse)').matches;
  const keepsAuto = (k) => k === 'boost' || k === 'brake' || (MOBILE && (k === 'left' || k === 'right'));
  const toastEl = document.getElementById('toast');
  const hintEl = document.getElementById('hint');
  const modeEl = document.getElementById('mode'), modeValEl = document.getElementById('modeVal');
  let toastTimer = 0;
  function toast(msg) { toastEl.textContent = msg; toastEl.style.opacity = 1; clearTimeout(toastTimer); toastTimer = setTimeout(() => { toastEl.style.opacity = 0; }, 1800); }
  const hideHint = () => hintEl.classList.add('gone');
  setTimeout(hideHint, 14000);
  const refocus = () => canvas.focus();

  function setMode(m, quiet) {
    if (MOBILE) m = 'auto';
    if (MOBILE && mode === 'auto') quiet = true;
    mode = m;
    modeValEl.textContent = m === 'auto' ? 'Auto' : 'Manual';
    modeEl.classList.toggle('is-auto', m === 'auto');
    modeEl.setAttribute('aria-pressed', m === 'auto');
    modeEl.setAttribute('aria-label', 'Auto-drive ' + (m === 'auto' ? 'on' : 'off') + '. Click, press M, or press up or down while focused to switch.');
    if (!quiet) toast(m === 'auto' ? 'Auto-drive on · any drive key takes over' : 'Manual driving');
  }
  const toggleMode = () => setMode(mode === 'auto' ? 'manual' : 'auto');

  addEventListener('keydown', (e) => {
    startAudio();
    if (e.code === 'Space' && e.target && e.target.tagName === 'BUTTON') return;   // Space still presses a focused button
    // The focused drive-mode control takes ↑ / ↓ for itself
    if (e.target === modeEl && (e.code === 'ArrowUp' || e.code === 'ArrowDown')) {
      e.preventDefault();
      if (!e.repeat) toggleMode();
      return;
    }
    if (map[e.code]) {
      keys[map[e.code]] = true; e.preventDefault();
      hideHint();
      if (mode === 'auto' && !keepsAuto(map[e.code])) setMode('manual');
    }
    if (e.repeat) return;
    if (e.code === 'KeyR') placeOnRoad(state.z);
    if (e.code === 'KeyM') toggleMode();
    if (e.code === 'KeyH') toggleUi();
    if (e.code === 'BracketRight') nextPhase();                    // undocumented: skip ahead a phase
    if (e.code === 'Equal' || e.code === 'NumpadAdd') zoomTarget = Math.max(ZOOM_MIN, zoomTarget / 1.2);
    if (e.code === 'Minus' || e.code === 'NumpadSubtract') zoomTarget = Math.min(ZOOM_MAX, zoomTarget * 1.2);
  });
  addEventListener('keyup', (e) => { if (map[e.code]) keys[map[e.code]] = false; });
  addEventListener('blur', () => { for (const k in keys) keys[k] = false; });
  addEventListener('wheel', (e) => {
    e.preventDefault();
    zoomTarget = clamp(zoomTarget * Math.exp(e.deltaY * 0.0012), ZOOM_MIN, ZOOM_MAX);
  }, { passive: false });
  canvas.addEventListener('pointerdown', () => canvas.focus());
  // Pinch to zoom (touch screens): two fingers apart zooms in, together zooms out
  if (MOBILE) {
    const touches = new Map();
    let pinchDist = 0, pinchZoom = 0;
    const spread = () => { const [a, b] = [...touches.values()]; return Math.hypot(a.x - b.x, a.y - b.y); };
    canvas.addEventListener('pointerdown', (e) => {
      touches.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (touches.size === 2) { pinchDist = spread(); pinchZoom = zoomTarget; }
    });
    canvas.addEventListener('pointermove', (e) => {
      if (!touches.has(e.pointerId)) return;
      touches.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (touches.size === 2 && pinchDist > 0) zoomTarget = clamp(pinchZoom * pinchDist / Math.max(1, spread()), ZOOM_MIN, ZOOM_MAX);
    });
    const lift = (e) => { touches.delete(e.pointerId); if (touches.size < 2) pinchDist = 0; };
    ['pointerup', 'pointercancel', 'pointerleave'].forEach((ev) => canvas.addEventListener(ev, lift));
  }
  [['tl', 'left'], ['tr', 'right'], ['tb', 'brake'], ['tx', 'boost']].forEach(([id, k]) => {
    const b = document.getElementById(id);
    const on = (e) => { e.preventDefault(); keys[k] = true; b.classList.add('on'); if (mode === 'auto' && !keepsAuto(k)) setMode('manual'); };
    const off = (e) => { e.preventDefault(); keys[k] = false; b.classList.remove('on'); };
    b.addEventListener('pointerdown', on);
    b.addEventListener('pointerup', off);
    b.addEventListener('pointerleave', off);
    b.addEventListener('pointercancel', off);
  });
  modeEl.addEventListener('click', (e) => { toggleMode(); if (e.detail) refocus(); });   // mouse click: back to driving; keyboard: stay
  document.getElementById('sound').addEventListener('click', (e) => { setSound(!audio.on); if (e.detail) refocus(); });

  // =====================================================================
  // Auto-drive: pure pursuit on the road centreline, shifted sideways to thread past boulders,
  // stones, logs, fallen trees and other vehicles. Any vehicle can use it: v.dir says which way
  // along the road it's heading. With traffic about, everyone keeps to the left (India) and
  // overtakes on the right.
  // =====================================================================
  // Obstacles in road coordinates: distances ahead to their near / far edges + lateral extent
  // relative to pathX
  const obs = [];
  let obsN = 0;
  // w: how bad hitting it is — boulders just get shoved and stones are bumps, logs stop the car dead,
  // other vehicles are kept well clear of
  const W_BOULDER = 0.3, W_STONE = 0.5, W_TREE = 0.5, W_LOG = 3, W_VEH = 2.5;
  const KEEP = 2.3;                  // how far left of the centre vehicles keep when there's traffic
  // along-road distance from vehicle v forward to world z
  const aheadOf = (v, z) => (v.s.z - z) * v.dir;
  function pushObs(v, za, zb, lo, hi, w, veh) {
    const a = aheadOf(v, za), b = aheadOf(v, zb);
    const near = Math.min(a, b), far = Math.max(a, b);
    if (far < -6 || near > 75) return;
    const o = obs[obsN] || (obs[obsN] = {});
    o.near = near; o.far = far; o.lo = lo; o.hi = hi; o.w = w; o.veh = veh || null;
    obsN++;
  }
  function pushCircle(v, x, z, r, w) {
    const off = roadLat(x, z);
    if (Math.abs(off) > ROAD_HALF + r + 1.5) return;
    pushObs(v, z - r, z + r, off - r, off + r, w);
  }
  function gatherObstacles(v) {
    obsN = 0;
    const s = v.s;
    for (const b of boulders) pushCircle(v, b.pos.x, b.pos.z, b.r, W_BOULDER);
    const ccx = Math.round(s.x / CHUNK), ccz = Math.round(s.z / CHUNK);
    for (let dz = -2; dz <= 2; dz++) for (let dx = -2; dx <= 2; dx++) {
      const ch = chunks.get(key(ccx + dx, ccz + dz));
      if (!ch) continue;
      for (const t of ch.roadRocks) pushCircle(v, t.x, t.z, t.r, W_STONE);
      for (const l of ch.logs) {
        const o1 = roadLat(l.x1, l.z1), o2 = roadLat(l.x2, l.z2);
        pushObs(v, Math.min(l.z1, l.z2) - l.r, Math.max(l.z1, l.z2) + l.r, Math.min(o1, o2) - l.r, Math.max(o1, o2) + l.r, W_LOG);
      }
    }
    for (const b of logBodies) {                   // logs (and pieces) something has already moved
      const [x1, z1, x2, z2] = logEnds(b);
      const o1 = roadLat(x1, z1), o2 = roadLat(x2, z2);
      if (Math.min(Math.abs(o1), Math.abs(o2)) > ROAD_HALF + 2) continue;
      pushObs(v, Math.min(z1, z2) - b.r, Math.max(z1, z2) + b.r, Math.min(o1, o2) - b.r, Math.max(o1, o2) + b.r, W_LOG * 0.6);
    }
    for (const f of fallen) {
      if (f.life < 0.3 || f.life > 7.5) continue;
      // lying tree: centre roughly 1.5 m past its stump in the direction it fell
      pushCircle(v, f.pos.x - f.axis.z * 1.5 * f.sc, f.pos.z + f.axis.x * 1.5 * f.sc, 1.3 + 0.5 * f.sc, W_TREE);
    }
    // other vehicles: where they are and where they're steering to, with a margin. One coming the
    // other way also claims the road it'll cover in the next two seconds; one going our way is
    // only a soft block (we can always wait behind it until the other side is clear)
    for (const u of vehicles) {
      if (u === v || Math.abs(u.s.z - s.z) > 150) continue;
      const off = roadLat(u.s.x, u.s.z);
      const plan = u.player && mode !== 'auto' ? off : u.avoidOff;
      const along = Math.cos(u.s.yaw) * u.s.speed * v.dir;           // its speed our way
      const lo = Math.min(off, plan) - u.halfW - 0.4, hi = Math.max(off, plan) + u.halfW + 0.4;
      const behind = aheadOf(v, u.s.z);
      if (behind < -(u.halfL + 2)) {
        // overtaking us from just behind: it's about to be alongside, so hold clear of its line
        if (behind > -25 && along > s.speed + 1) pushObs(v, s.z + v.dir * 1, s.z - v.dir * 3, lo, hi, W_VEH, u);
        continue;
      }
      const reachZ = along < 0 ? v.dir * Math.min(60, -along * 2) : 0;
      pushObs(v, u.s.z - v.dir * u.halfL, u.s.z + v.dir * u.halfL + reachZ, lo, hi, along < 0 ? W_VEH : W_VEH * 0.25, u);
    }
  }

  const CLEARANCE = 0.55, LANE = ROAD_HALF - 1.2;
  // how much a lateral offset c overlaps the obstacles ahead (weighted toward near and solid ones)
  function blockage(v, c, reach, staticOnly) {
    let sum = 0;
    const hw = v.halfW + CLEARANCE;
    for (let i = 0; i < obsN; i++) {
      const o = obs[i];
      if (o.far < -4 || o.near > reach || (staticOnly && o.veh)) continue;   // passed, or too far
      const pen = Math.min(c + hw - o.lo, o.hi - (c - hw));
      if (pen > 0) sum += pen * o.w * (1 + 40 / (Math.max(o.near, 0) + 8));
    }
    return sum;
  }

  function autoInputs(v, dt) {
    const s = v.s;
    gatherObstacles(v);
    // Plan past the nearest group of obstacles first (one line can't clear a stone on the left at
    // 20 m and a log on the right at 50 m); farther ones get their turn once these are passed
    let first = Infinity;
    for (let i = 0; i < obsN; i++) {
      if (obs[i].far >= -4 && obs[i].near <= 60) first = Math.min(first, Math.max(obs[i].near, 0));
    }
    const reach = Math.max(first + 14, 24);                      // anything close is always in the plan
    // traffic keeps left; so does the player's car when there's traffic about (else the middle)
    let busy = !v.player;
    for (const u of vehicles) if (u !== v && Math.abs(u.s.z - s.z) < 110) busy = true;
    const pref = busy ? -v.dir * KEEP : 0;
    // Pick the free line across the road closest to the current plan and the preferred side;
    // if every line is blocked, the least-bad one (shove a boulder rather than hit a log)
    let best = 0, bestCost = Infinity;
    for (let c = -LANE; c <= LANE + 1e-6; c += 0.25) {
      const b = blockage(v, c, reach);
      const cost = b * 100 + 0.5 * Math.abs(c - v.avoidOff) + (busy ? 1 : 0.6) * Math.abs(c - pref);
      if (cost < bestCost) { bestCost = cost; best = c; }
    }
    const stuckBehind = blockage(v, best, reach, true) > 0;      // no line clear of hazards
    v.avoidOff += (best - v.avoidOff) * Math.min(1, dt * 2.5);
    const carOff = roadLat(s.x, s.z);
    const threat = blockage(v, carOff, Math.min(45, reach), true) > 0;
    const swerving = threat || Math.abs(v.avoidOff - pref) > 0.6;

    const L = swerving ? 7 + Math.abs(s.speed) * 0.4 : 12 + Math.abs(s.speed) * 0.7;
    const tz = s.z - v.dir * L;
    const tx = pathX(tz) + v.avoidOff * roadSec(tz);
    // pure pursuit cuts the inside of bends (by metres on tight ones): add a cross-track term so the
    // vehicle actually holds the line it picked
    const crossTrack = Math.atan(2.2 * (v.avoidOff - carOff) / (Math.abs(s.speed) + 4));
    const desired = Math.atan2(-(tx - s.x), -(tz - s.z)) - v.dir * clamp(crossTrack, -0.35, 0.35);
    const diff = wrapAngle(desired - s.yaw);
    let steer = clamp(diff * 2.8, -1, 1);
    // touch screens: holding left / right steers by hand; auto-drive takes the wheel back on release
    const handSteer = v.player && MOBILE && (keys.left || keys.right);
    if (handSteer) steer = (keys.left ? 1 : 0) - (keys.right ? 1 : 0);
    const a0 = Math.atan2(pathX(s.z - v.dir * 18) - pathX(s.z), 18);
    const a1 = Math.atan2(pathX(s.z - v.dir * 40) - pathX(s.z - v.dir * 18), 22);
    const curve = Math.abs(a1 - a0);
    let target = Math.min(clamp(30 - curve * 45, 12, 30) * v.pace, v.maxF * 0.95);
    // Space (or the Boost button) on auto-drive: flat out, whatever's ahead — auto-drive still steers,
    // but none of the slow-downs below apply
    const boost = v.player && !!keys.boost;
    if (boost) return { up: 1, down: 0, steer, boost, hold: false };
    if (threat) target = Math.min(target, 15);                   // ease off while threading past
    if (stuckBehind) target = Math.min(target, 5);              // no clear line: creep up to it
    // a vehicle ahead in our line: going our way, drop to its pace and hang back until there's room
    // to pass; coming at us, slow right down (but keep rolling, so the two can still sidestep)
    for (let i = 0; i < obsN; i++) {
      const o = obs[i];
      if (!o.veh || o.near < 0 || o.near > 35) continue;
      const u = o.veh.s, along = Math.cos(u.yaw) * u.speed * v.dir;
      const uOff = roadLat(u.x, u.z);
      if (Math.abs(uOff - carOff) > v.halfW + o.veh.halfW + 0.2) continue;
      target = Math.min(target, along > -1 ? Math.max(0, along + (o.near - 9) * 0.6) : Math.max(4, o.near * 0.4));
    }
    if (Math.abs(diff) > 0.5 && !handSteer) target = Math.min(target, 7);
    // hold: waiting behind something — stand on the brake so a slope doesn't roll us into it
    return { up: s.speed < target ? 1 : 0, down: s.speed > target + 3 ? 1 : 0, steer, boost, hold: target < 0.5 };
  }

  // =====================================================================
  // Vehicle physics: arcade drive + gravity, air time, suspension, collisions (every vehicle)
  // =====================================================================
  const ray = new THREE.Raycaster(); ray.far = 2000;
  const rayOrigin = new THREE.Vector3(), DOWN = new THREE.Vector3(0, -1, 0);
  const tmpN = new THREE.Vector3(), fwd3 = new THREE.Vector3();
  const qYaw = new THREE.Quaternion(), qAlign = new THREE.Quaternion(), qTarget = new THREE.Quaternion();

  function groundHit(x, z) {
    const ch = chunks.get(key(Math.round(x / CHUNK), Math.round(z / CHUNK)));
    if (!ch) return null;
    rayOrigin.set(x, 800, z);
    ray.set(rayOrigin, DOWN);
    return ray.intersectObject(ch.mesh, false)[0] || null;
  }

  const MAX_REV = 9;
  function stepCar(dt) {
    const inp = mode === 'auto'
      ? autoInputs(player, dt)
      : { up: keys.up ? 1 : 0, down: keys.down ? 1 : 0, steer: (keys.left ? 1 : 0) - (keys.right ? 1 : 0), boost: !!keys.boost };
    // Ctrl: brake (in either mode) — no throttle while it's held
    inp.brake = !!keys.brake;
    if (inp.brake) { inp.up = 0; inp.boost = false; }
    moveVehicle(player, dt, inp);
    flames.visible = state.boosting;
    if (state.boosting) flames.children.forEach((f) => { f.scale.z = 0.7 + Math.random() * 0.7; });
    return inp;                        // the dust, tyre tracks and engine sound follow the pedals
  }

  function moveVehicle(v, dt, inp) {
    const s = v.s, obj = v.obj, normal = v.normal;
    s.steer += (inp.steer - s.steer) * Math.min(1, dt * 7);
    const control = s.air < 0.15;                             // brief coyote time over small bumps

    const onRoad = roadDist(s.x, s.z) < ROAD_HALF + 0.8;
    s.boosting = !!(inp.boost && inp.up && s.speed > -0.5 && control);
    const maxF = (onRoad ? v.maxF : v.maxF * 0.55) * (s.boosting ? 1.6 : 1);
    let sp = s.speed;
    if (control) {
      if (inp.up) sp += (sp < 0 ? 28 : (s.boosting ? 26 : v.accel) * (1 - Math.max(0, sp) / maxF * 0.6)) * dt;
      if (inp.down) sp -= (sp > 0.5 ? 30 : 8) * dt;
      if (inp.brake) sp -= Math.sign(sp) * Math.min(Math.abs(sp), 34 * dt);   // stops, never reverses
      if (!inp.up && !inp.down && !inp.brake) sp -= Math.sign(sp) * Math.min(Math.abs(sp), (3 + Math.abs(sp) * 0.12) * dt);
      if (!onRoad) sp -= Math.sign(sp) * Math.min(Math.abs(sp), Math.abs(sp) * 0.6 * dt);
      if (!s.boosting && sp > maxF) sp -= Math.min(sp - maxF, 10 * dt);
      fwd3.set(0, 0, -1).applyQuaternion(obj.quaternion);
      sp -= G * 0.55 * fwd3.y * dt;                              // gravity along the slope
      if (inp.hold && !inp.up) sp -= Math.sign(sp) * Math.min(Math.abs(sp), 34 * dt);   // held on the brake
    } else {
      sp *= 1 - 0.05 * dt;                                        // air drag only
    }
    s.speed = clamp(sp, -MAX_REV, v.maxF * 1.6);

    const turnScale = clamp(s.speed / 6, -1, 1) * (1 - 0.45 * Math.min(1, Math.abs(s.speed) / v.maxF));
    s.yaw += s.steer * v.turn * turnScale * dt * (control ? 1 : 0.25);

    const fx = -Math.sin(s.yaw), fz = -Math.cos(s.yaw);
    const nx = s.x + fx * s.speed * dt, nz = s.z + fz * s.speed * dt;
    const hit = groundHit(nx, nz);
    const gY = hit ? hit.point.y : heightAt(nx, nz);
    if (hit) tmpN.copy(hit.face.normal); else normalAt(nx, nz, tmpN);

    if (s.grounded && tmpN.y < 0.62 && gY > s.y + 0.05) {
      s.speed *= -0.3;                                             // too steep: bounce off
    } else {
      s.odo += Math.hypot(nx - s.x, nz - s.z);
      s.x = nx; s.z = nz;
      // Vertical: ballistic unless the ground catches us
      s.vy -= G * dt;
      let ny = s.y + s.vy * dt;
      if (ny <= gY + 0.02) {
        if (!s.grounded && s.vy < -2) s.suspV += s.vy * 0.06;    // landing thump
        const groundVy = dt > 0 ? (gY - s.y) / dt : 0;
        s.vy = clamp(groundVy, -25, 25);
        ny = gY;
        s.grounded = true; s.air = 0;
        normal.lerp(tmpN, Math.min(1, dt * 10)).normalize();
      } else {
        s.grounded = false; s.air += dt;
      }
      s.y = ny;
    }

    v.vel.set(fx * s.speed, s.vy, fz * s.speed);
    collideProps(v);

    // Orientation
    qYaw.setFromAxisAngle(UP, s.yaw);
    if (s.grounded) qAlign.setFromUnitVectors(UP, normal);
    qTarget.multiplyQuaternions(qAlign, qYaw);
    obj.quaternion.slerp(qTarget, Math.min(1, dt * (s.grounded ? 12 : 3)));
    obj.position.set(s.x, s.y, s.z);

    // Suspension spring (visual body bob); cars roll out of a bend, a bike leans into it
    s.suspV += (-60 * s.susp - 8 * s.suspV) * dt;
    s.susp += s.suspV * dt;
    const body = v.body, roller = v.lean || body;               // a bike leans wheels and all
    body.position.y = clamp(s.susp, -0.25, 0.2);
    roller.rotation.z += (-s.steer * Math.min(1, Math.abs(s.speed) / 20) * v.roll - roller.rotation.z) * Math.min(1, dt * 6);
    body.rotation.x += ((inp.up && s.speed > 0 ? 0.015 : 0) - ((inp.down || inp.brake) && s.speed > 1 ? 0.03 : 0) - body.rotation.x) * Math.min(1, dt * 6);
    for (const w of v.wheels) {
      w.spin.rotation.x -= s.speed * dt / w.r;
      if (w.front) w.pivot.rotation.y = s.steer * 0.45;
    }

    // Auto-drive safety: under 3 m of progress in 3 s (wedged, or bouncing off something) → the
    // player's car goes back onto the road a little further on; traffic is flagged to deal with it
    if (!v.player || mode === 'auto') {
      s.stuck += dt;
      if (s.stuck > 3) {
        const moved = Math.hypot(s.x - s.stuckX, s.z - s.stuckZ);
        s.stuck = 0; s.stuckX = s.x; s.stuckZ = s.z;
        if (moved < 3) {
          if (v.player) placeOnRoad(s.z + (Math.cos(s.yaw) >= 0 ? -12 : 12));
          else v.stuckOut = true;
        }
      }
    }
  }

  const _d = new THREE.Vector3();
  function collideProps(v) {
    const s = v.s, vel = v.vel;
    const ccx = Math.round(s.x / CHUNK), ccz = Math.round(s.z / CHUNK);
    const fx = -Math.sin(s.yaw), fz = -Math.cos(s.yaw);
    for (let dz = -1; dz <= 1; dz++) for (let dx = -1; dx <= 1; dx++) {
      const ch = chunks.get(key(ccx + dx, ccz + dz));
      if (!ch) continue;
      // Trees in the 3×3 chunks around the vehicle
      if (ch.trees) {
        for (const t of ch.treeData) {
          if (!t.alive) continue;
          const ddx = t.x - s.x, ddz = t.z - s.z;
          const rr = v.hitR + 0.15 + 0.5 * t.sc;
          if (ddx * ddx + ddz * ddz < rr * rr && Math.abs(t.y - s.y) < 3) {
            knockTree(ch, t, vel);
            s.speed *= 0.72;
            s.suspV += 0.8;
          }
        }
      }
      // Stones on the road: a jolt and a little speed lost, once per pass
      for (const t of ch.roadRocks) {
        const ddx = t.x - s.x, ddz = t.z - s.z, rr = t.r + v.hitR - 0.25;
        const hitBy = t.hitBy || (t.hitBy = new Set());
        if (ddx * ddx + ddz * ddz < rr * rr && Math.abs(t.y - s.y) < 2) {
          if (!hitBy.has(v)) { hitBy.add(v); s.suspV += 0.6 + t.r; s.speed *= 0.9; }
        } else hitBy.delete(v);
      }
      // Road logs: the first touch turns one into a body, which then takes the hit
      for (let li = ch.logs.length - 1; li >= 0; li--) {
        const l = ch.logs[li];
        const ex = l.x2 - l.x1, ez = l.z2 - l.z1;
        const u = clamp(((s.x - l.x1) * ex + (s.z - l.z1) * ez) / (ex * ex + ez * ez), 0, 1);
        const d = Math.hypot(s.x - (l.x1 + ex * u), s.z - (l.z1 + ez * u));
        if (d < l.r + v.hitR && Math.abs(l.y - s.y) < 2.4) hitLog(v, logFromStatic(ch, l), fx, fz);
      }
    }
    for (const b of logBodies) hitLog(v, b, fx, fz);
    // Boulders: momentum exchange, boulder mass ∝ r³
    for (const b of boulders) {
      _d.set(b.pos.x - s.x, 0, b.pos.z - s.z);
      const dist = _d.length(), minD = b.r + v.hitR + 0.15;
      if (dist > minD || Math.abs(b.pos.y - s.y - 0.6) > b.r + 1.4 || dist < 1e-4) continue;
      _d.divideScalar(dist);
      const rel = (vel.x - b.vel.x) * _d.x + (vel.z - b.vel.z) * _d.z;
      b.pos.addScaledVector(_d, minD - dist);
      if (rel > 0) {
        const mb = 400 * b.r * b.r * b.r, mc = v.mass;
        const j = (1.3 * rel) / (1 / mb + 1 / mc);
        b.vel.addScaledVector(_d, j / mb);
        b.vel.y += Math.min(4, rel * 0.15);
        const along = _d.x * fx + _d.z * fz;
        s.speed -= (j / mc) * Math.sign(along || 1) * Math.abs(along);
        b.awake = true; b.rest = 0;
        s.suspV += 0.4;
      }
    }
  }

  // =====================================================================
  // Traffic: another car, a motorbike or a noisy, smoky tractor — at most two at a time, from
  // either direction. Same physics, collisions and auto-drive as the player's car: faster ones
  // coming up from behind overtake, oncoming ones keep to their side, and each honks once or twice
  // as it comes past (and often again alongside).
  // =====================================================================
  const vehicles = [player];
  const traffic = [];
  const MAX_TRAFFIC = 2;
  let nextSpawn = 5;
  const vmat = (c, o) => new THREE.MeshStandardMaterial(Object.assign({ color: C(c), flatShading: true, roughness: 0.55, metalness: 0.1 }, o));
  // shared by all traffic (the lamps glow with the player's at dusk)
  const TM = {
    black: vmat(0x1c1f24, { roughness: 0.7 }), glass: vmat(0x2a3b4f, { roughness: 0.15, metalness: 0.4 }),
    chrome: vmat(0xcfd6de, { roughness: 0.25, metalness: 0.8 }), tyre: vmat(0x16181b, { roughness: 0.9 }),
    rim: vmat(0x9aa3ad, { roughness: 0.35, metalness: 0.7 }), skin: vmat(0xb97d5b), denim: vmat(0x33476b),
    lamp: vmat(0xffffff, { emissive: C(0xfff6d8), emissiveIntensity: 0.9 }),
    tail: vmat(0xb3121b, { emissive: C(0xff2a2a), emissiveIntensity: 0.6 }),
  };
  const SHARED = new Set(Object.values(TM));
  // Headlights: one spotlight per traffic slot, made up front and parked in the scene while unused
  // (the scene's light count never changes, so nothing recompiles when a vehicle turns up)
  let headlights = 0;                  // 0–1, set with the player's lamps at dusk / in bad weather
  const trafficBeams = Array.from({ length: MAX_TRAFFIC }, () => {
    const sp = new THREE.SpotLight(0xfff2d0, 0, 70, 0.5, 0.55, 1.2);
    scene.add(sp, sp.target);
    return { sp, v: null };
  });
  function fitBeam(v) {
    const b = trafficBeams.find((x) => !x.v);
    if (!b) return;
    b.v = v; v.beam = b;
    b.sp.position.copy(v.lampPos);
    b.sp.target.position.set(0, -1.5, v.lampPos.z - 24);
    v.body.add(b.sp, b.sp.target);
  }
  function parkBeam(v) {
    const b = v.beam;
    if (!b) return;
    b.v = null; v.beam = null;
    b.sp.intensity = 0;
    scene.add(b.sp, b.sp.target);                 // (re-parents it off the vehicle)
  }
  const pick = (a) => a[Math.floor(Math.random() * a.length)];

  // a vehicle is built facing −z with its wheels on y = 0, like the player's car
  function vehicleShell() {
    const obj = new THREE.Group(), body = new THREE.Group();
    obj.add(body);
    const box = (w, h, d, mat, x, y, z) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; body.add(m); return m; };
    const wheels = [];
    const wheel = (x, z, r, wd, front, parent = obj) => {
      const pivot = new THREE.Group(); pivot.position.set(x, r, z);
      const spin = new THREE.Group(); pivot.add(spin);
      const t = new THREE.Mesh(new THREE.CylinderGeometry(r, r, wd, 9).rotateZ(Math.PI / 2), TM.tyre); t.castShadow = true;
      spin.add(t, new THREE.Mesh(new THREE.CylinderGeometry(r * 0.56, r * 0.56, wd + 0.02, 6).rotateZ(Math.PI / 2), TM.rim));
      parent.add(pivot);
      wheels.push({ pivot, spin, front, r });
    };
    return { obj, body, box, wheel, wheels };
  }
  function buildHatch() {
    const V = vehicleShell(), { box } = V;
    const paint = vmat(pick([0x2f7fb8, 0xf2c14e, 0xeef1f4, 0x3a8f6b, 0x2b3a67, 0xe07a2f]), { roughness: 0.4, metalness: 0.25 });
    box(1.7, 0.55, 3.8, paint, 0, 0.72, 0);
    box(1.76, 0.22, 3.86, TM.black, 0, 0.38, 0);
    const hood = box(1.64, 0.14, 1.0, paint, 0, 1.03, -1.35); hood.rotation.x = 0.08;
    box(1.52, 0.5, 2.0, TM.glass, 0, 1.24, 0.4);
    box(1.58, 0.08, 2.06, paint, 0, 1.52, 0.42);
    const ws = box(1.5, 0.52, 0.08, TM.glass, 0, 1.2, -0.72); ws.rotation.x = -0.62;
    [[-1, -0.55], [1, -0.55], [-1, 1.38], [1, 1.38]].forEach(([sd, z]) => box(0.06, 0.5, 0.12, paint, sd * 0.77, 1.24, z));
    box(0.34, 0.13, 0.07, TM.lamp, -0.6, 0.88, -1.91);
    box(0.34, 0.13, 0.07, TM.lamp, 0.6, 0.88, -1.91);
    box(0.28, 0.16, 0.06, TM.tail, -0.66, 0.92, 1.91);
    box(0.28, 0.16, 0.06, TM.tail, 0.66, 0.92, 1.91);
    box(1.0, 0.1, 0.1, TM.chrome, 0, 0.34, -1.94);
    [[-0.8, -1.2, true], [0.8, -1.2, true], [-0.8, 1.2, false], [0.8, 1.2, false]].forEach(([x, z, f]) => V.wheel(x, z, 0.34, 0.26, f));
    V.lampPos = new THREE.Vector3(0, 0.88, -1.95);
    return V;
  }
  function buildBike() {
    const V = vehicleShell(), { box } = V;
    // the whole bike (wheels too) leans into bends: wheels hang off the body's lean group
    const lean = new THREE.Group();
    V.obj.remove(V.body); lean.add(V.body); V.obj.add(lean);
    const paint = vmat(pick([0xc0392b, 0x23262b, 0x2e86c1, 0xf39c12]), { roughness: 0.35, metalness: 0.3 });
    const jacket = vmat(pick([0x6b3b2a, 0x2c3e50, 0x7a1f2b, 0x3d5a3d]));
    const helmet = vmat(pick([0xf4f4f4, 0xd8342c, 0x1c1f24, 0xf2c14e]), { roughness: 0.3 });
    box(0.32, 0.34, 1.0, paint, 0, 0.78, -0.1);              // tank + body
    box(0.3, 0.12, 0.7, TM.black, 0, 0.97, 0.38);             // seat
    box(0.24, 0.3, 0.46, TM.chrome, 0, 0.52, 0.02);           // engine
    box(0.09, 0.09, 0.8, TM.chrome, 0.2, 0.44, 0.45);          // exhaust
    const fork = box(0.07, 0.72, 0.07, TM.chrome, 0, 0.74, -0.72); fork.rotation.x = 0.35;
    box(0.72, 0.05, 0.05, TM.black, 0, 1.1, -0.64);           // handlebar
    box(0.18, 0.15, 0.08, TM.lamp, 0, 0.98, -0.82);
    box(0.14, 0.08, 0.05, TM.tail, 0, 0.94, 0.74);
    // rider
    box(0.44, 0.24, 0.52, TM.denim, 0, 1.1, 0.3);
    box(0.13, 0.5, 0.14, TM.denim, -0.21, 0.8, 0.08);
    box(0.13, 0.5, 0.14, TM.denim, 0.21, 0.8, 0.08);
    const torso = box(0.46, 0.64, 0.3, jacket, 0, 1.48, 0.2); torso.rotation.x = -0.42;
    [-1, 1].forEach((sd) => { const a = box(0.11, 0.11, 0.62, jacket, sd * 0.26, 1.46, -0.24); a.rotation.x = 0.35; });
    box(0.32, 0.32, 0.34, helmet, 0, 1.92, 0.02);
    box(0.26, 0.1, 0.05, TM.glass, 0, 1.92, -0.16);
    V.wheel(0, -0.74, 0.33, 0.12, true, lean);
    V.wheel(0, 0.64, 0.33, 0.15, false, lean);
    V.lean = lean;
    V.lampPos = new THREE.Vector3(0, 0.98, -0.86);
    return V;
  }
  function buildTractor() {
    const V = vehicleShell(), { box } = V;
    const paint = vmat(pick([0xc0392b, 0x3f8f3a, 0x2d6fb5, 0xe67e22]), { roughness: 0.6 });
    const shirt = vmat(pick([0xe9e3d3, 0x4f7cac, 0xa33b3b]));
    box(0.86, 0.78, 1.9, paint, 0, 1.18, -0.9);               // engine hood
    box(0.7, 0.5, 0.06, TM.black, 0, 1.14, -1.87);            // grille
    box(0.16, 0.14, 0.06, TM.lamp, -0.3, 1.46, -1.88);
    box(0.16, 0.14, 0.06, TM.lamp, 0.3, 1.46, -1.88);
    box(0.5, 0.3, 1.6, TM.black, 0, 0.72, -0.9);              // chassis
    box(1.05, 0.5, 1.1, TM.black, 0, 1.0, 0.6);               // gearbox under the seat
    box(0.48, 0.12, 1.3, paint, -0.97, 1.62, 0.6);            // rear fenders
    box(0.48, 0.12, 1.3, paint, 0.97, 1.62, 0.6);
    box(0.56, 0.12, 0.5, TM.black, 0, 1.45, 0.8);             // seat
    box(0.56, 0.42, 0.1, TM.black, 0, 1.7, 1.05);
    const col = box(0.06, 0.6, 0.06, TM.black, 0, 1.62, 0.12); col.rotation.x = -0.5;
    box(0.4, 0.04, 0.4, TM.black, 0, 1.92, 0.28);             // steering wheel
    box(0.14, 0.12, 0.05, TM.tail, -0.6, 1.3, 1.18);
    box(0.14, 0.12, 0.05, TM.tail, 0.6, 1.3, 1.18);
    // canopy on four posts
    [[-0.62, 0.15], [0.62, 0.15], [-0.62, 1.12], [0.62, 1.12]].forEach(([x, z]) => box(0.06, 1.3, 0.06, TM.black, x, 2.1, z));
    box(1.5, 0.08, 1.45, paint, 0, 2.78, 0.62);
    // driver
    box(0.44, 0.56, 0.28, shirt, 0, 1.84, 0.82);
    box(0.26, 0.28, 0.26, TM.skin, 0, 2.28, 0.8);
    box(0.3, 0.1, 0.3, vmat(pick([0xe8c547, 0xd35400, 0xf4f4f4])), 0, 2.45, 0.8);   // turban / cap
    // exhaust stack: the smoke comes out of its top
    box(0.12, 0.95, 0.12, TM.black, 0.3, 1.98, -1.3);
    V.exhaust = new THREE.Vector3(0.3, 2.5, -1.3);
    V.lampPos = new THREE.Vector3(0, 1.46, -1.92);
    V.wheel(-0.95, 0.62, 0.78, 0.45, false);
    V.wheel(0.95, 0.62, 0.78, 0.45, false);
    V.wheel(-0.6, -1.45, 0.42, 0.24, true);
    V.wheel(0.6, -1.45, 0.42, 0.24, true);
    return V;
  }
  // pace: cruise speed relative to the player's auto-drive (above 1 catches up and overtakes)
  const KINDS = {
    car: { build: buildHatch, mass: 1100, halfL: 1.95, halfW: 1.0, hitR: 1.1, maxF: 42, accel: 16, turn: 1.6, roll: 0.07, pace: 1.45, trackHalf: 0.13 },
    bike: { build: buildBike, mass: 260, halfL: 1.1, halfW: 0.55, hitR: 0.6, maxF: 44, accel: 20, turn: 1.9, roll: -0.4, pace: 1.55, trackHalf: 0.07 },
    tractor: { build: buildTractor, mass: 3200, halfL: 2.0, halfW: 1.2, hitR: 1.3, maxF: 10, accel: 5, turn: 1.3, roll: 0.03, pace: 0.33, trackHalf: 0.21 },
  };

  function spawnTraffic(now) {
    const r = Math.random();
    const kind = r < 0.48 ? 'car' : r < 0.76 ? 'bike' : 'tractor';
    const pdir = Math.cos(state.yaw) >= 0 ? 1 : -1;          // the way the player is heading
    let dir, dist;
    if (Math.random() < 0.5) { dir = -pdir; dist = 190; }            // oncoming, from up the road
    else if (kind === 'tractor') { dir = pdir; dist = 150; }         // too slow to catch up: met ahead
    else { dir = pdir; dist = -80; }                                 // from behind, faster: overtakes
    let z = state.z - pdir * dist, ok = false;
    for (let i = 0; i < 10 && !ok; i++) {
      ok = roadClear(z) && vehicles.every((u) => Math.abs(u.s.z - z) > 30);
      if (!ok) z -= pdir * Math.sign(dist) * 8;                      // step on, away from the player
    }
    if (!ok) return false;
    const K = KINDS[kind], M = K.build();
    const off = -dir * KEEP;
    const sl = (pathX(z - 1) - pathX(z + 1)) * 0.5;
    const s = { x: pathX(z) + off * roadSec(z), y: 0, z, vy: 0, yaw: Math.atan2(-sl, 1) + (dir < 0 ? Math.PI : 0), speed: kind === 'tractor' ? 8 : Math.max(20, state.speed), steer: 0, odo: 0, grounded: true, air: 0, boosting: false, susp: 0, suspV: 0, stuck: 0, stuckX: 0, stuckZ: 0 };
    s.y = heightAt(s.x, s.z) + 0.1;
    s.stuckX = s.x; s.stuckZ = s.z;
    const v = Object.assign({}, K, {
      kind, s, obj: M.obj, body: M.body, wheels: M.wheels, lean: M.lean, exhaust: M.exhaust,
      vel: new THREE.Vector3(), normal: new THREE.Vector3(0, 1, 0), dir, avoidOff: off,
      lastD: Math.hypot(s.x - state.x, s.z - state.z), closing: 0, honkStage: 0, backUp: 0, puffAcc: 0, dustAcc: 0, splashCool: 0,
    });
    v.obj.position.set(s.x, s.y, s.z);
    v.obj.quaternion.setFromAxisAngle(UP, s.yaw);
    scene.add(v.obj);
    v.lampPos = M.lampPos;
    fitBeam(v);
    // tyre tracks from its rear wheel(s), at ground level
    v.trail = takeTrailSlot();
    v.rear = M.wheels.filter((w) => !w.front).map((w) => new THREE.Vector3(w.pivot.position.x, 0, w.pivot.position.z));
    vehicles.push(v); traffic.push(v);
    return true;
  }
  function removeTraffic(v) {
    parkBeam(v);
    scene.remove(v.obj);
    v.obj.traverse((o) => { if (o.isMesh) { o.geometry.dispose(); if (!SHARED.has(o.material)) o.material.dispose(); } });
    freeTrailSlot(v.trail);
    if (v.au) { v.au.srcs.forEach((o) => { try { o.stop(); } catch (e) { /* already stopped */ } }); v.au.att.disconnect(); }
    vehicles.splice(vehicles.indexOf(v), 1);
    traffic.splice(traffic.indexOf(v), 1);
  }

  // --- Tractor smoke: dark puffs from the exhaust stack that swell, rise, drift downwind and fade
  const SMOKE_N = 160, SMOKE_LIFE = 2.8;
  const smokePos = new Float32Array(SMOKE_N * 3), smokeVel = new Float32Array(SMOKE_N * 3);
  const smokeBirth = new Float32Array(SMOKE_N).fill(-10), smokeSeed = new Float32Array(SMOKE_N);
  for (let i = 0; i < SMOKE_N; i++) smokeSeed[i] = Math.random();
  const smokeGeo = new THREE.BufferGeometry();
  smokeGeo.setAttribute('position', new THREE.BufferAttribute(smokePos, 3));
  smokeGeo.setAttribute('aBirth', new THREE.BufferAttribute(smokeBirth, 1));
  smokeGeo.setAttribute('aSeed', new THREE.BufferAttribute(smokeSeed, 1));
  const smokeMat = new THREE.ShaderMaterial({
    uniforms: { uTime: U.time, uPx: { value: 10 }, uColor: { value: new THREE.Color(0x3b3a38) } },
    vertexShader: `uniform float uTime, uPx; attribute float aBirth, aSeed; varying float vT; varying float vSeed;
      void main() {
        vT = clamp((uTime - aBirth) / ${SMOKE_LIFE.toFixed(2)}, 0.0, 1.0);
        vSeed = aSeed;
        gl_PointSize = uPx * (0.35 + 2.4 * sqrt(vT)) * (0.75 + 0.5 * aSeed);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: `uniform vec3 uColor; varying float vT; varying float vSeed;
      void main() {
        float d = length(gl_PointCoord - 0.5) * 2.0;
        float a = smoothstep(1.0, 0.15, d) * pow(1.0 - vT, 1.4) * smoothstep(0.0, 0.05, vT) * 0.55;
        if (vT >= 1.0 || a < 0.01) discard;
        gl_FragColor = vec4(uColor * (0.8 + 0.5 * vSeed + 0.6 * vT), a);
      }`,
    transparent: true, depthWrite: false,
  });
  const smoke = new THREE.Points(smokeGeo, smokeMat);
  smoke.frustumCulled = false; smoke.renderOrder = 3;
  scene.add(smoke);
  let smokeNext = 0;
  function stepSmoke(dt, now) {
    let live = false;
    const drag = Math.exp(-dt * 1.4);
    for (let i = 0; i < SMOKE_N; i++) {
      if (now - smokeBirth[i] > SMOKE_LIFE) continue;
      live = true;
      smokeVel[i * 3] = smokeVel[i * 3] * drag + (2 + 8 * gust) * 0.3 * dt;       // downwind
      smokeVel[i * 3 + 1] = smokeVel[i * 3 + 1] * drag + 0.6 * dt;                // warm: keeps rising
      smokeVel[i * 3 + 2] *= drag;
      for (let k = 0; k < 3; k++) smokePos[i * 3 + k] += smokeVel[i * 3 + k] * dt;
    }
    smoke.visible = live;
    if (!live) return;
    smokeGeo.attributes.position.needsUpdate = true;
    smokeGeo.attributes.aBirth.needsUpdate = true;
    smokeMat.uniforms.uPx.value = 0.8 * pxPerM();
    smokeMat.uniforms.uColor.value.setHex(0x3b3a38).multiplyScalar(0.35 + 0.65 * dayK);
  }

  const _tw = new THREE.Vector3();
  function stepTraffic(dt, now) {
    if (traffic.length < MAX_TRAFFIC && now > nextSpawn) nextSpawn = now + (spawnTraffic(now) ? 6 + Math.random() * 12 : 1.5);
    for (let i = traffic.length - 1; i >= 0; i--) {
      const v = traffic[i], s = v.s;
      const inp = autoInputs(v, dt);
      if (v.backUp > 0) { v.backUp -= dt; inp.up = 0; inp.down = 1; inp.steer = -inp.steer; }   // wedged: back out
      moveVehicle(v, dt, inp);
      v.inp = inp;
      if (v.beam) v.beam.sp.intensity = (v.kind === 'bike' ? 1.5 : 2.2) * headlights;
      const d = Math.hypot(s.x - state.x, s.z - state.z);
      v.closing += ((v.lastD - d) / Math.max(dt, 1e-3) - v.closing) * Math.min(1, dt * 4);
      v.lastD = d;
      // gone: far off and heading away (or very far), or wedged somewhere out of sight
      if (d > 320 || (d > 170 && v.closing < 0) || (v.stuckOut && d > 60)) { removeTraffic(v); continue; }
      if (v.stuckOut) { v.stuckOut = false; v.backUp = 1.4; }
      // honk coming up to pass (once or twice), often again alongside; ready again once well clear
      const lead = aheadOf(v, state.z);
      if (v.honkStage === 0 && d < 45 && v.closing > 2) { honk(v, Math.random() < 0.5 ? 2 : 1); v.honkStage = 1; }
      else if (v.honkStage === 1 && Math.abs(lead) < 6) { if (Math.random() < 0.65) honk(v, 1); v.honkStage = 2; }
      else if (v.honkStage > 0 && d > 60) v.honkStage = 0;

      const sp = Math.abs(s.speed);
      v.obj.updateMatrixWorld();
      // tractor: a steady chug of smoke, thicker on the throttle
      if (v.exhaust) {
        v.puffAcc += dt * (7 + (inp.up ? 9 : 0));
        while (v.puffAcc >= 1) {
          v.puffAcc -= 1;
          v.obj.localToWorld(_tw.copy(v.exhaust));
          const j = smokeNext; smokeNext = (smokeNext + 1) % SMOKE_N;
          smokePos[j * 3] = _tw.x; smokePos[j * 3 + 1] = _tw.y; smokePos[j * 3 + 2] = _tw.z;
          smokeVel[j * 3] = v.vel.x * 0.4 + (Math.random() - 0.5) * 0.6;
          smokeVel[j * 3 + 1] = 1.6 + Math.random() * 1.2;
          smokeVel[j * 3 + 2] = v.vel.z * 0.4 + (Math.random() - 0.5) * 0.6;
          smokeBirth[j] = now;
        }
      }
      // rear wheels: dust off dry ground, spray through puddles
      if (!s.grounded || sp < 3) continue;
      const rear = v.wheels.find((w) => !w.front);
      const onRoad = roadDist(s.x, s.z) < ROAD_HALF + 0.8;
      const dry = 1 - 0.85 * atmo.wet, snowy = Math.max(atmo.snow, atmo.cover);
      v.dustAcc += dt * (onRoad ? 0.5 : 1) * (sp / 36) * Math.max(dry, snowy) * (v.kind === 'bike' ? 18 : 40);
      const fx = -Math.sin(s.yaw), fz = -Math.cos(s.yaw);
      while (v.dustAcc >= 1) {
        v.dustAcc -= 1;
        rear.pivot.getWorldPosition(_tw);
        spawnDust(_tw.x + (Math.random() - 0.5) * 0.8, _tw.y - rear.r + 0.2, _tw.z + (Math.random() - 0.5) * 0.8,
          -fx * s.speed * 0.18 + (Math.random() - 0.5) * 2.4, 0.8 + Math.random() * 1.6, -fz * s.speed * 0.18 + (Math.random() - 0.5) * 2.4, now);
      }
      v.splashCool -= dt;
      if (v.splashCool <= 0) {
        rear.pivot.getWorldPosition(_tw);
        if (inPuddle(_tw.x, _tw.z)) {
          v.splashCool = 0.15;
          spray(_tw.x, _tw.y - rear.r + 0.15, _tw.z, 4 + Math.round(sp * 0.3), sp, -fx, -fz);
          if (Math.random() < 0.3) splashSound(Math.min(1, sp / 25) * audibility(v));
        }
      }
    }
    collideVehicles();
    stepSmoke(dt, now);
  }

  // Vehicle ↔ vehicle: each is a capsule along its heading; overlap is shared out by mass and the
  // closing speed exchanged as an impulse (with a little spin from an off-centre hit)
  function collideVehicles() {
    for (let i = 0; i < vehicles.length; i++) for (let j = i + 1; j < vehicles.length; j++) {
      const a = vehicles[i], b = vehicles[j], A = a.s, B = b.s;
      if (Math.abs(A.x - B.x) > 7 || Math.abs(A.z - B.z) > 7 || Math.abs(A.y - B.y) > 2.2) continue;
      const ux = -Math.sin(A.yaw), uz = -Math.cos(A.yaw), vx = -Math.sin(B.yaw), vz = -Math.cos(B.yaw);
      const ra = a.halfW * 0.92, rb = b.halfW * 0.92, la = a.halfL - ra, lb = b.halfL - rb;
      // closest points between the two centre segments
      const rx = A.x - B.x, rz = A.z - B.z;
      const k = ux * vx + uz * vz, dd = ux * rx + uz * rz, e = vx * rx + vz * rz;
      const den = 1 - k * k;
      let sa = den > 1e-6 ? clamp((k * e - dd) / den, -la, la) : 0;
      const sb = clamp(k * sa + e, -lb, lb);
      sa = clamp(k * sb - dd, -la, la);
      let nx = (A.x + ux * sa) - (B.x + vx * sb), nz = (A.z + uz * sa) - (B.z + vz * sb);
      const dist = Math.hypot(nx, nz), minD = ra + rb;
      if (dist >= minD || dist < 1e-4) continue;
      nx /= dist; nz /= dist;                                      // from b toward a
      const over = minD - dist, share = b.mass / (a.mass + b.mass);
      A.x += nx * over * share; A.z += nz * over * share;
      B.x -= nx * over * (1 - share); B.z -= nz * over * (1 - share);
      const vrel = (ux * A.speed - vx * B.speed) * nx + (uz * A.speed - vz * B.speed) * nz;
      if (vrel >= -0.3) continue;                                  // not closing
      const imp = -(1 + 0.3) * vrel / (1 / a.mass + 1 / b.mass);
      A.speed += imp / a.mass * (nx * ux + nz * uz);
      B.speed -= imp / b.mass * (nx * vx + nz * vz);
      A.yaw += clamp(imp / a.mass * sa * (ux * nz - uz * nx) * 0.12, -0.35, 0.35);
      B.yaw -= clamp(imp / b.mass * sb * (vx * nz - vz * nx) * 0.12, -0.35, 0.35);
      A.suspV += Math.min(1.2, -vrel * 0.08); B.suspV += Math.min(1.2, -vrel * 0.08);
      // one crunch per knock (not one per frame of a scrape)
      const t = performance.now() / 1000;
      if (-vrel < 1.2 || t - (b.lastCrash || 0) < 0.4) continue;
      b.lastCrash = t;
      crashSound(Math.min(1, -vrel / 14) * Math.max(a.player || b.player ? 1 : 0, audibility(a.player ? b : a)));
    }
  }

  // =====================================================================
  // Time of day: five phases of 1.5–2 minutes each (Auto), or held at one the visitor picks
  // =====================================================================
  const PHASES = [
    { name: 'early morning', from: 4.5, to: 7.5 },
    { name: 'morning', from: 7.5, to: 12 },
    { name: 'afternoon', from: 12, to: 17 },
    { name: 'evening', from: 17, to: 20 },
    { name: 'night', from: 20, to: 28.5 },        // runs past midnight to 04:30
  ];
  // bottom-left toggle: Auto, then a fixed time the clock glides to (and holds)
  const TIME_OPTS = [
    { label: 'Auto' },
    { label: 'Early morning', hour: 6.4 },
    { label: 'Day', hour: 10 },
    { label: 'Afternoon', hour: 14.5 },
    { label: 'Evening', hour: 18.3 },
    { label: 'Night', hour: 23.5 },
  ];
  const phaseLength = () => 90 + Math.random() * 30;
  let phase = 2, phaseDur = phaseLength(), phaseT = phaseDur * 0.3;   // start in the early afternoon
  let tod = 13.5, timeMode = 0;
  function nextPhase() {
    phase = (phase + 1) % PHASES.length;
    phaseDur = phaseLength();
    phaseT = 0;
    if (wxMode === 0) rollWeather();
  }
  function setTimeMode(i) {
    timeMode = i;
    if (i === 0) {
      // back to Auto: carry on the cycle from wherever the clock is now
      phase = PHASES.findIndex((p) => { const h = tod < p.from ? tod + 24 : tod; return h >= p.from && h < p.to; });
      if (phase < 0) phase = 4;
      const p = PHASES[phase], h = tod < p.from ? tod + 24 : tod;
      phaseDur = phaseLength();
      phaseT = (h - p.from) / (p.to - p.from) * phaseDur;
    }
  }
  function stepTime(dt) {
    if (timeMode === 0) {
      phaseT += dt;
      if (phaseT >= phaseDur) nextPhase();
      const p = PHASES[phase];
      tod = (p.from + (p.to - p.from) * Math.min(1, phaseT / phaseDur)) % 24;
    } else {
      // glide the short way round the clock to the chosen time
      const diff = ((TIME_OPTS[timeMode].hour - tod + 36) % 24) - 12;
      tod = (tod + diff * (1 - Math.exp(-dt / 3.5)) + 24) % 24;
    }
  }
  const sunElev = () => Math.sin((tod - 6) / 12 * Math.PI);

  // =====================================================================
  // Weather: rain, thunderstorms, snow, fog, cloud and wind gusts in random combinations (Auto,
  // easing slowly from one phase's mix to the next), or a preset from the bottom-right toggle.
  // Snow settles on the ground and melts into puddles once the sun is up; puddles dry slowly.
  // =====================================================================
  const CALM = { fog: 0.2, rain: 0, snow: 0, storm: 0, wind: 0.08, cloud: 0 };
  const target = Object.assign({}, CALM);
  const atmo = Object.assign({ wet: 0, cover: 0, puddle: 0 }, CALM);
  const WX_OPTS = ['Auto', 'Rain', 'Snow', 'Clear', 'Overcast'];
  const WX_PRESET = {
    Rain: { fog: 0.3, rain: 1, snow: 0, storm: 0.5, wind: 0.5, cloud: 1 },
    Snow: { fog: 0.3, rain: 0, snow: 1, storm: 0, wind: 0.3, cloud: 0.7 },
    Clear: { fog: 0.15, rain: 0, snow: 0, storm: 0, wind: 0.08, cloud: 0 },
    Overcast: { fog: 0.45, rain: 0, snow: 0, storm: 0, wind: 0.25, cloud: 1 },
  };
  let wxMode = 0, easeTau = 20;
  function rollWeather() {
    const r = Math.random();
    const precip = r < 0.45 ? 'none' : r < 0.65 ? 'rain' : r < 0.8 ? 'storm' : 'snow';
    const foggy = Math.random() < (precip === 'storm' ? 0.15 : 0.3);
    const windy = Math.random() < 0.35;
    target.fog = foggy ? 1 : 0.2;
    target.rain = precip === 'rain' || precip === 'storm' ? 1 : 0;
    target.storm = precip === 'storm' ? 1 : 0;
    target.snow = precip === 'snow' ? 1 : 0;
    target.cloud = precip === 'none' ? (Math.random() < 0.35 ? 1 : 0) : precip === 'snow' ? 0.7 : 1;
    target.wind = precip === 'storm' ? 0.8 : windy ? 1 : 0.08;
  }
  function setWeatherMode(i) {
    wxMode = i;
    if (i === 0) { easeTau = 20; rollWeather(); }
    else { easeTau = 7; Object.assign(target, WX_PRESET[WX_OPTS[i]]); }
  }

  let gust = 0, flash = 0, strikeTimer = 6;
  let gustNext = 6 + Math.random() * 10, gustAt = -99, gustPeak = 0, gustEvent = 0;
  const flashes = [];
  // clearing after snow / rain: time since it stopped, and how much there was then
  const CLEAR_S = 12;
  const clr = { snowT: CLEAR_S, snowFrom: 0, rainT: CLEAR_S, rainFrom: 0 };
  const easeGone = (from, t) => (t >= CLEAR_S ? 0 : from * Math.pow(1 - t / CLEAR_S, 3));
  function stepWeather(dt, now) {
    const a = 1 - Math.exp(-dt / easeTau);
    for (const k of ['fog', 'rain', 'snow', 'storm', 'wind', 'cloud']) atmo[k] += (target[k] - atmo[k]) * a;

    // Snow lying on the ground builds while it snows; rain fills puddles. Once the snow (or rain) is
    // over, it clears with an ease-out — quick at first, then settling — and is gone CLEAR_S seconds
    // later. Melting snow leaves puddles that swell and dry up again within the same 12 s.
    const snowing = atmo.snow > 0.05 && target.snow > 0.05, raining = atmo.rain > 0.1 && target.rain > 0.05;
    if (snowing) { atmo.cover = Math.min(1, atmo.cover + atmo.snow * dt / 45); clr.snowT = 0; clr.snowFrom = atmo.cover; }
    else { clr.snowT += dt; atmo.cover = easeGone(clr.snowFrom, clr.snowT); }
    if (raining) { atmo.puddle = Math.min(1, atmo.puddle + atmo.rain * dt / 60); clr.rainT = 0; clr.rainFrom = atmo.puddle; }
    else {
      clr.rainT += dt;
      const u = Math.min(1, clr.snowT / CLEAR_S);
      const melt = snowing ? 0 : Math.min(1, clr.snowFrom * 1.4) * 2.2 * (1 - Math.pow(1 - u, 3)) * Math.pow(1 - u, 2);
      atmo.puddle = Math.max(easeGone(clr.rainFrom, clr.rainT), melt);
    }
    const wetTarget = Math.max(raining ? atmo.rain : 0, atmo.puddle * 0.6);
    atmo.wet += (wetTarget - atmo.wet) * (1 - Math.exp(-dt / (wetTarget > atmo.wet ? 15 : 1.2)));   // dries with the puddles
    MATS.terrain.roughness = 0.92 - 0.42 * atmo.wet;
    MATS.terrain.color.setScalar(1 - 0.22 * atmo.wet);
    U.snow.value = atmo.cover;
    U.puddle.value = atmo.puddle;

    // Wind: a background swell, plus a random gust sweeping through every 7–25 s (whoosh and all)
    gustNext -= dt;
    if (gustNext <= 0) {
      gustNext = 7 + Math.random() * 18;
      gustAt = now; gustPeak = 0.5 + Math.random() * 0.5;
      whoosh(gustPeak);
    }
    const ge = now - gustAt;
    gustEvent = gustPeak * (ge < 1.2 ? smooth(0, 1.2, ge) : ge < 2.4 ? 1 : Math.max(0, 1 - (ge - 2.4) / 3.2));
    gust = Math.max(atmo.wind * (0.3 + 0.7 * (0.5 + 0.5 * n2(now * 0.35, 913.7))), gustEvent);
    U.gust.value = gust;

    // Lightning: a double flash every few seconds in a thunderstorm, thunder a moment later
    if (atmo.storm > 0.4) {
      strikeTimer -= dt;
      if (strikeTimer <= 0) {
        strikeTimer = (5 + Math.random() * 12) / atmo.storm;
        flashes.push(now, now + 0.08 + Math.random() * 0.1);
        if (Math.random() < 0.5) flashes.push(now + 0.3 + Math.random() * 0.2);
        thunder(0.4 + Math.random() * 2.2, atmo.storm);
      }
    }
    flash = 0;
    for (let i = flashes.length - 1; i >= 0; i--) {
      const age = now - flashes[i];
      if (age > 1) flashes.splice(i, 1);
      else if (age >= 0) flash += Math.exp(-age * 11);
    }
    flash = Math.min(1, flash) * Math.min(1, atmo.storm * 1.5);
  }
  const overcast = () => clamp(Math.max(atmo.rain, atmo.snow * 0.8, atmo.cloud * 0.85, (atmo.fog - 0.2) / 0.8), 0, 1);

  // =====================================================================
  // Sky + light for the current time and weather
  // =====================================================================
  const SKY_KEYS = [
    [0, 0x0d1830], [4.8, 0x1a2749], [5.8, 0x6e6a95], [6.6, 0xf0a47e], [8, 0xb4d3ef],
    [16.5, 0xb4d3ef], [17.8, 0xef9a6a], [18.8, 0x6a5b8c], [19.8, 0x1c2548], [24, 0x0d1830],
  ].map(([h, c]) => [h, new THREE.Color(c)]);
  const skyAt = (h, out) => {
    for (let i = 0; i < SKY_KEYS.length - 1; i++) {
      const [h0, c0] = SKY_KEYS[i], [h1, c1] = SKY_KEYS[i + 1];
      if (h >= h0 && h <= h1) return out.copy(c0).lerp(c1, (h - h0) / (h1 - h0));
    }
    return out.copy(SKY_KEYS[0][1]);
  };
  const lightDir = new THREE.Vector3();
  const skySRGB = new THREE.Color(), sunCol = new THREE.Color(), grey = new THREE.Color();
  const WARM = new THREE.Color(0xfff3e0), FLASH = new THREE.Color(0xdfe6ff);
  let nightK = 0, dayK = 1;
  function applyTime() {
    const ang = (tod - 6) / 12 * Math.PI;                 // 0 at sunrise, π at sunset
    const elev = Math.sin(ang);
    const k = smooth(-0.1, 0.3, elev);                     // 0 night → 1 day
    const oc = overcast();
    if (elev > -0.05) {
      // Sun: east (+x) at dawn, west (−x) at dusk, tilted south
      lightDir.set(Math.cos(ang), Math.max(0.1, elev), 0.5).normalize();
      sunCol.set(0xff9a55).lerp(WARM, smooth(0.02, 0.45, elev)).convertSRGBToLinear();
      sun.intensity = 0.25 + 0.95 * smooth(-0.05, 0.35, elev);
    } else {
      // Moon on the opposite arc
      lightDir.set(-Math.cos(ang), Math.max(0.25, -elev), 0.35).normalize();
      sunCol.set(0x9fb4ff).convertSRGBToLinear();
      sun.intensity = 0.28;
    }
    sun.intensity *= 1 - 0.55 * oc - 0.2 * atmo.storm;     // cloud cover
    sun.color.copy(sunCol);
    ambient.intensity = (0.12 + 0.3 * k) * (1 - 0.3 * atmo.storm) + 1.6 * flash;
    hemi.intensity = 0.1 + 0.18 * k + 0.8 * flash;
    skyAt(tod, skySRGB);
    const lum = skySRGB.r * 0.3 + skySRGB.g * 0.59 + skySRGB.b * 0.11;
    grey.setRGB(lum, lum, lum * 1.04);
    skySRGB.lerp(grey, 0.7 * oc).multiplyScalar(1 - 0.35 * atmo.storm).lerp(FLASH, 0.55 * flash);
    scene.background.copy(skySRGB).convertSRGBToLinear();
    scene.fog.color.copy(scene.background);
    U.sky.value.copy(scene.background);                    // puddles reflect the sky
    dayK = k; nightK = 1 - k;
    const lights = Math.max(smooth(0.25, 0.8, nightK), 0.7 * smooth(0.3, 0.9, oc));
    beams.forEach((b) => { b.intensity = 2.2 * lights; });
    headlights = lights;
    lampMat.emissiveIntensity = TM.lamp.emissiveIntensity = 0.9 + 2 * lights;
    tailMat.emissiveIntensity = TM.tail.emissiveIntensity = 0.6 + 1.6 * lights;
    document.body.style.background = '#' + skySRGB.getHexString();
  }

  // =====================================================================
  // Atmosphere: fog banks, rain (+ splashes), snow, wind streaks, fireflies
  // =====================================================================
  let atmoReady = false;
  const pxPerM = () => innerHeight * DPR / zoom;

  // --- Fog banks: soft flat sheets drifting low over the valley; ridges poke through them
  function makeFogTexture() {
    const size = 128, cv = document.createElement('canvas');
    cv.width = cv.height = size;
    const ctx = cv.getContext('2d'), img = ctx.createImageData(size, size);
    const tn = new SimplexNoise('valley-fog');
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
      const u = x / size * 2 - 1, v = y / size * 2 - 1;
      const n = 0.5 + 0.5 * (0.6 * tn.noise2D(x * 0.03, y * 0.03) + 0.4 * tn.noise2D(x * 0.08 + 5, y * 0.08));
      const a = Math.pow(Math.max(0, 1 - Math.sqrt(u * u + v * v)), 1.6) * (0.3 + 0.7 * n);
      const i = (y * size + x) * 4;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = 255; img.data[i + 3] = a * 255;
    }
    ctx.putImageData(img, 0, 0);
    return new THREE.CanvasTexture(cv);
  }
  const FOG_N = 36, FOG_BOX = 160;
  const fogMat = new THREE.MeshBasicMaterial({ map: makeFogTexture(), transparent: true, depthWrite: false, opacity: 0 });
  const fogGeo = new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2);
  const fogBanks = [];
  const fogGroup = new THREE.Group();
  for (let i = 0; i < FOG_N; i++) {
    const m = new THREE.Mesh(fogGeo, fogMat);
    const s = 45 + Math.random() * 70;
    m.scale.set(s, 1, s * (0.6 + Math.random() * 0.5));
    m.rotation.y = Math.random() * Math.PI;
    m.renderOrder = 3;
    fogGroup.add(m);
    fogBanks.push({ mesh: m, lift: 1.5 + Math.random() * 12 });
  }
  scene.add(fogGroup);
  const placeFog = (f) => f.mesh.position.setY(roadY(f.mesh.position.z) + f.lift);

  // --- Particles in a box that follows the camera focus (world-fixed, wrapped in the shader).
  // uOffset is the wind drift integrated on the CPU, so changing wind never makes the field jump.
  const BOX = 80, TALL = 90;
  const wrapGLSL = `
    uniform vec3 uFocus; uniform float uTime; uniform vec2 uOffset;
    vec3 boxed(vec3 p, float fall, float base, float tall) {
      float y = mod(p.y - uTime * fall, tall);
      float x = uFocus.x - ${BOX.toFixed(1)} + mod(p.x + uOffset.x - (uFocus.x - ${BOX.toFixed(1)}), ${(2 * BOX).toFixed(1)});
      float z = uFocus.z - ${BOX.toFixed(1)} + mod(p.z + uOffset.y - (uFocus.z - ${BOX.toFixed(1)}), ${(2 * BOX).toFixed(1)});
      return vec3(x, uFocus.y + base + y, z);
    }`;
  const focusU = { value: new THREE.Vector3() };
  function boxGeometry(n, verts, extra) {
    const g = new THREE.BufferGeometry();
    const p = new Float32Array(n * verts * 3), end = new Float32Array(n * verts), ph = new Float32Array(n * verts);
    for (let i = 0; i < n; i++) {
      const x = Math.random() * 2 * BOX, y = Math.random() * TALL, z = Math.random() * 2 * BOX, r = Math.random();
      for (let v = 0; v < verts; v++) { p.set([x, y, z], (i * verts + v) * 3); end[i * verts + v] = v; ph[i * verts + v] = r; }
    }
    g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    if (extra === 'end') g.setAttribute('aEnd', new THREE.BufferAttribute(end, 1));
    g.setAttribute('aPhase', new THREE.BufferAttribute(ph, 1));
    return g;
  }
  const streakFrag = `uniform vec3 uColor; uniform float uOpacity; varying float vEnd;
      void main() { gl_FragColor = vec4(uColor, uOpacity * (1.0 - 0.8 * vEnd)); }`;

  // Rain: streaks slanting with the wind
  const rainMat = new THREE.ShaderMaterial({
    uniforms: { uFocus: focusU, uTime: U.time, uOffset: { value: new THREE.Vector2() }, uTail: { value: new THREE.Vector3(0, 1.9, 0) }, uOpacity: { value: 0 }, uColor: { value: new THREE.Color(0xd4e0ee) } },
    vertexShader: `${wrapGLSL}
      uniform vec3 uTail; attribute float aEnd; varying float vEnd;
      void main() {
        vec3 w = boxed(position, 38.0, -30.0, ${TALL.toFixed(1)}) + uTail * aEnd;
        vEnd = aEnd;
        gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.0);
      }`,
    fragmentShader: streakFrag, transparent: true, depthWrite: false,
  });
  const rain = new THREE.LineSegments(boxGeometry(2800, 2, 'end'), rainMat);
  rain.frustumCulled = false; rain.renderOrder = 4;
  scene.add(rain);

  // Wind streaks: faint fast dashes of air in a gust
  const windMat = new THREE.ShaderMaterial({
    uniforms: { uFocus: focusU, uTime: U.time, uOffset: { value: new THREE.Vector2() }, uOpacity: { value: 0 }, uColor: { value: new THREE.Color(0xffffff) } },
    vertexShader: `${wrapGLSL}
      attribute float aEnd; attribute float aPhase; varying float vEnd;
      void main() {
        vec3 w = boxed(position, 0.0, -6.0, 34.0);
        w.y += sin(uTime * 1.3 + aPhase * 30.0) * 0.8;
        w += vec3(-3.4, 0.0, -1.1) * (0.6 + aPhase) * aEnd;
        vEnd = aEnd;
        gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.0);
      }`,
    fragmentShader: streakFrag, transparent: true, depthWrite: false,
  });
  const windLines = new THREE.LineSegments(boxGeometry(700, 2, 'end'), windMat);
  windLines.frustumCulled = false; windLines.renderOrder = 4;
  scene.add(windLines);

  // Snow: soft flakes drifting down with a lazy sway
  const snowMat = new THREE.ShaderMaterial({
    uniforms: { uFocus: focusU, uTime: U.time, uOffset: { value: new THREE.Vector2() }, uOpacity: { value: 0 }, uSize: { value: 4 } },
    vertexShader: `${wrapGLSL}
      uniform float uSize; attribute float aPhase;
      void main() {
        vec3 w = boxed(position, 2.2 + aPhase * 1.2, -30.0, ${TALL.toFixed(1)});
        w.x += sin(uTime * 0.7 + aPhase * 6.283) * 1.2;
        w.z += cos(uTime * 0.5 + aPhase * 6.283) * 1.2;
        gl_PointSize = uSize * (0.6 + 0.8 * aPhase);
        gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.0);
      }`,
    fragmentShader: `uniform float uOpacity;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.15, d) * uOpacity;
        if (a < 0.01) discard;
        gl_FragColor = vec4(1.0, 1.0, 1.0, a);
      }`,
    transparent: true, depthWrite: false,
  });
  const snow = new THREE.Points(boxGeometry(3000, 1), snowMat);
  snow.frustumCulled = false; snow.renderOrder = 4;
  scene.add(snow);

  // Rain splashes: little rings popping on the ground around the car
  const SPLASH_N = 360, SPLASH_LIFE = 0.45;
  const splashPos = new Float32Array(SPLASH_N * 3), splashBirth = new Float32Array(SPLASH_N).fill(-10);
  const splashGeo = new THREE.BufferGeometry();
  splashGeo.setAttribute('position', new THREE.BufferAttribute(splashPos, 3));
  splashGeo.setAttribute('aBirth', new THREE.BufferAttribute(splashBirth, 1));
  const splashMat = new THREE.ShaderMaterial({
    uniforms: { uTime: U.time, uSize: { value: 10 }, uOpacity: { value: 0 } },
    vertexShader: `uniform float uTime, uSize; attribute float aBirth; varying float vT;
      void main() {
        vT = clamp((uTime - aBirth) / ${SPLASH_LIFE.toFixed(2)}, 0.0, 1.0);
        gl_PointSize = uSize;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: `uniform float uOpacity; varying float vT;
      void main() {
        vec2 c = gl_PointCoord - 0.5;
        float d = length(vec2(c.x, c.y / 0.766)) * 2.0;           // ground circle seen from 50° up
        float a = (1.0 - smoothstep(0.0, 0.16, abs(d - vT))) * (1.0 - vT) * uOpacity;
        if (a < 0.01) discard;
        gl_FragColor = vec4(0.9, 0.95, 1.0, a);
      }`,
    transparent: true, depthWrite: false,
  });
  const splashes = new THREE.Points(splashGeo, splashMat);
  splashes.frustumCulled = false; splashes.renderOrder = 4;
  scene.add(splashes);

  // Fireflies: blinking green-gold motes hovering over the ground at night
  const FLY_N = 650, FLY_BOX = 90;
  const flyPos = new Float32Array(FLY_N * 3), flyPhase = new Float32Array(FLY_N);
  for (let i = 0; i < FLY_N; i++) flyPhase[i] = Math.random();
  const flyGeo = new THREE.BufferGeometry();
  flyGeo.setAttribute('position', new THREE.BufferAttribute(flyPos, 3));
  flyGeo.setAttribute('aPhase', new THREE.BufferAttribute(flyPhase, 1));
  const flyMat = new THREE.ShaderMaterial({
    uniforms: { uTime: U.time, uSize: { value: 10 }, uIntensity: { value: 0 } },
    vertexShader: `uniform float uTime, uSize, uIntensity; attribute float aPhase; varying float vA;
      void main() {
        vec3 p = position + vec3(sin(uTime * 0.5 + aPhase * 7.0) * 1.6, sin(uTime * 0.9 + aPhase * 3.0) * 0.6, cos(uTime * 0.4 + aPhase * 5.0) * 1.6);
        float blink = pow(max(0.0, sin(uTime * (0.8 + aPhase * 0.9) + aPhase * 20.0)), 3.0);
        vA = (0.15 + 0.85 * blink) * uIntensity;
        gl_PointSize = uSize * (0.55 + 0.45 * blink);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }`,
    fragmentShader: `varying float vA;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        float a = pow(smoothstep(0.5, 0.0, d), 1.6) * vA;
        gl_FragColor = vec4(vec3(0.85, 1.0, 0.45) * a, a);
      }`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  });
  const fireflies = new THREE.Points(flyGeo, flyMat);
  fireflies.frustumCulled = false; fireflies.renderOrder = 5;
  scene.add(fireflies);
  const flyY = (i) => { flyPos[i * 3 + 1] = heightAt(flyPos[i * 3], flyPos[i * 3 + 2]) + 0.6 + flyPhase[i] * 2.6; };

  const fogTint = new THREE.Color(), WHITE = new THREE.Color(1, 1, 1);
  function stepAtmosphere(dt, now) {
    focusU.value.copy(focus);
    const fx = focus.x, fz = focus.z, ppm = pxPerM();

    if (!atmoReady) {
      atmoReady = true;
      for (const f of fogBanks) {
        f.mesh.position.set(fx + (Math.random() - 0.5) * 2 * FOG_BOX, 0, fz + (Math.random() - 0.5) * 2 * FOG_BOX);
        placeFog(f);
      }
      for (let i = 0; i < FLY_N; i++) {
        flyPos[i * 3] = fx + (Math.random() - 0.5) * 2 * FLY_BOX;
        flyPos[i * 3 + 2] = fz + (Math.random() - 0.5) * 2 * FLY_BOX;
        flyY(i);
      }
      flyGeo.attributes.position.needsUpdate = true;
    }

    // Fog banks drift with the wind and wrap around the focus
    const fogOp = 0.3 * atmo.fog;
    fogGroup.visible = fogOp > 0.004;
    if (fogGroup.visible) {
      fogMat.opacity = fogOp;
      fogTint.copy(scene.background).lerp(WHITE, 0.35);
      fogMat.color.copy(fogTint);
      for (const f of fogBanks) {
        const p = f.mesh.position;
        p.x += (1.4 + 7 * gust) * dt; p.z += (0.5 + 2 * gust) * dt;
        const wx = wrapTo(p.x, fx, FOG_BOX), wz = wrapTo(p.z, fz, FOG_BOX);
        if (wx !== p.x || wz !== p.z) { p.x = wx; p.z = wz; placeFog(f); }
      }
    }

    // Rain: drift and slant follow the wind
    const rdx = 4 + 16 * gust, rdz = 1.5 + 4 * gust;
    rainMat.uniforms.uOffset.value.x += rdx * dt; rainMat.uniforms.uOffset.value.y += rdz * dt;
    rainMat.uniforms.uTail.value.set(-rdx, 38, -rdz).normalize().multiplyScalar(1.9);
    rain.visible = atmo.rain > 0.01;
    rainMat.uniforms.uOpacity.value = 0.72 * atmo.rain;

    snowMat.uniforms.uOffset.value.x += (1.2 + 9 * gust) * dt; snowMat.uniforms.uOffset.value.y += (0.4 + 2 * gust) * dt;
    snow.visible = atmo.snow > 0.01;
    snowMat.uniforms.uOpacity.value = 0.9 * atmo.snow;
    snowMat.uniforms.uSize.value = Math.max(3 * DPR, 0.26 * ppm);

    windMat.uniforms.uOffset.value.x += 30 * gust * dt; windMat.uniforms.uOffset.value.y += 10 * gust * dt;
    windMat.uniforms.uOpacity.value = 0.35 * smooth(0.25, 0.8, gust) * (0.4 + 0.6 * dayK);
    windLines.visible = windMat.uniforms.uOpacity.value > 0.005;

    // Splashes: recycle finished rings to fresh spots on the ground in view
    splashes.visible = atmo.rain > 0.05;
    if (splashes.visible) {
      splashMat.uniforms.uOpacity.value = 0.8 * atmo.rain;
      splashMat.uniforms.uSize.value = 0.9 * ppm;
      const span = zoom * 0.9;
      let changed = false;
      for (let i = 0; i < SPLASH_N; i++) {
        if (now - splashBirth[i] < SPLASH_LIFE || Math.random() > atmo.rain * 0.5) continue;
        const x = fx + (Math.random() - 0.5) * 2 * span, z = fz + (Math.random() - 0.5) * 2 * span;
        splashPos[i * 3] = x; splashPos[i * 3 + 1] = heightAt(x, z) + 0.08; splashPos[i * 3 + 2] = z;
        splashBirth[i] = now;
        changed = true;
      }
      if (changed) { splashGeo.attributes.position.needsUpdate = true; splashGeo.attributes.aBirth.needsUpdate = true; }
    }

    // Fireflies: dusk to dawn whenever there is no rain or thunder (strong gusts thin them out)
    const flies = smooth(0.35, 0.85, nightK) * (1 - Math.max(atmo.rain, atmo.storm)) * (1 - 0.5 * gust);
    fireflies.visible = flies > 0.01;
    if (fireflies.visible) {
      flyMat.uniforms.uIntensity.value = flies;
      flyMat.uniforms.uSize.value = Math.max(14 * DPR, 1.15 * ppm);
      let changed = false;
      for (let i = 0; i < FLY_N; i++) {
        const x = flyPos[i * 3], z = flyPos[i * 3 + 2];
        const wx = wrapTo(x, fx, FLY_BOX), wz = wrapTo(z, fz, FLY_BOX);
        if (wx !== x || wz !== z) { flyPos[i * 3] = wx; flyPos[i * 3 + 2] = wz; flyY(i); changed = true; }
      }
      if (changed) flyGeo.attributes.position.needsUpdate = true;
    }
  }

  // =====================================================================
  // Clouds: low-poly clusters drifting high over the valley with the wind. They always cast
  // shadows (the sun's shadow map sees them), so shadows sweep across the ground even close up;
  // the clouds themselves only fade into view once you zoom out. More of them in cloudy weather.
  // =====================================================================
  const CLOUD_N = 14, CLOUD_BOX = 190;
  const cloudMat = new THREE.MeshStandardMaterial({ color: 0xffffff, flatShading: true, roughness: 1, transparent: true, opacity: 0, depthWrite: false });
  const clouds = [];
  for (let i = 0; i < CLOUD_N; i++) {
    const g = new THREE.Group();
    const puffs = 6 + Math.floor(Math.random() * 5), base = 13 + Math.random() * 9;
    for (let p = 0; p < puffs; p++) {
      const m = new THREE.Mesh(GEOS.boulder, cloudMat);
      const r = base * (0.55 + Math.random() * 0.6);
      m.scale.set(r * 1.5, r * 0.42, r * 1.1);
      m.position.set((p - puffs / 2) * base * 0.75 + (Math.random() - 0.5) * base, (Math.random() - 0.3) * base * 0.25, (Math.random() - 0.5) * base * 1.6);
      m.rotation.set(Math.random() * 3, Math.random() * 3, 0);
      m.castShadow = true;
      g.add(m);
    }
    g.rotation.y = Math.random() * Math.PI;
    g.visible = false;
    scene.add(g);
    clouds.push({ g, lift: 85 + Math.random() * 30, size: 0.7 + Math.random() * 0.7, grow: 0, placed: false });
  }
  function stepClouds(dt) {
    // share of the clouds out: a few on a clear day, the lot when it's overcast or stormy
    const cover = clamp(0.45 + 0.55 * Math.max(atmo.cloud, atmo.rain, atmo.snow * 0.8, atmo.storm), 0, 1);
    cloudMat.opacity = 0.9 * smooth(95, 140, zoom);
    cloudMat.colorWrite = cloudMat.opacity > 0.01;             // invisible close up, but still casting shadows
    cloudMat.color.setScalar(1 - 0.45 * atmo.storm);
    cloudMat.emissive.setScalar(0.4 * (0.15 + 0.85 * dayK) * (1 - 0.6 * atmo.storm));   // soft, not rock-like shading
    const vx = (2.5 + 9 * gust) * dt, vz = (1 + 3 * gust) * dt;
    clouds.forEach((c, i) => {
      const want = i < cover * CLOUD_N ? 1 : 0;
      c.grow += (want - c.grow) * Math.min(1, dt / 8);           // clouds swell in and melt away slowly
      c.g.visible = c.grow > 0.02;
      if (!c.placed) { c.g.position.set(focus.x + (Math.random() - 0.5) * 2 * CLOUD_BOX, 0, focus.z + (Math.random() - 0.5) * 2 * CLOUD_BOX); c.placed = true; }
      const p = c.g.position;
      p.x = wrapTo(p.x + vx, focus.x, CLOUD_BOX);
      p.z = wrapTo(p.z + vz, focus.z, CLOUD_BOX);
      p.y = focus.y + c.lift;
      c.g.scale.setScalar(c.size * c.grow);
    });
  }

  // =====================================================================
  // Wheels on the ground: dust kicked up behind the car, and tyre tracks
  // =====================================================================
  const REAR = [new THREE.Vector3(-0.82, 0, 1.25), new THREE.Vector3(0.82, 0, 1.25)];
  const _w = new THREE.Vector3();

  // --- Dust: soft puffs that billow up, drift back and fade (sand on the road, earth off it, spray in snow)
  const DUST_N = 420, DUST_LIFE = 1.6;
  const dustPos = new Float32Array(DUST_N * 3), dustVel = new Float32Array(DUST_N * 3);
  const dustBirth = new Float32Array(DUST_N).fill(-10), dustSeed = new Float32Array(DUST_N);
  for (let i = 0; i < DUST_N; i++) dustSeed[i] = Math.random();
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  dustGeo.setAttribute('aBirth', new THREE.BufferAttribute(dustBirth, 1));
  dustGeo.setAttribute('aSeed', new THREE.BufferAttribute(dustSeed, 1));
  const dustMat = new THREE.ShaderMaterial({
    uniforms: { uTime: U.time, uPx: { value: 10 }, uColor: { value: new THREE.Color() }, uOpacity: { value: 0.4 } },
    vertexShader: `uniform float uTime, uPx; attribute float aBirth, aSeed; varying float vT; varying float vSeed;
      void main() {
        vT = clamp((uTime - aBirth) / ${DUST_LIFE.toFixed(2)}, 0.0, 1.0);
        vSeed = aSeed;
        gl_PointSize = uPx * (0.7 + 2.6 * sqrt(vT)) * (0.7 + 0.6 * aSeed);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: `uniform vec3 uColor; uniform float uOpacity; varying float vT; varying float vSeed;
      void main() {
        float d = length(gl_PointCoord - 0.5) * 2.0;
        float a = smoothstep(1.0, 0.2, d) * pow(1.0 - vT, 1.6) * smoothstep(0.0, 0.08, vT) * uOpacity;
        if (vT >= 1.0 || a < 0.01) discard;
        gl_FragColor = vec4(uColor * (0.9 + 0.2 * vSeed), a);
      }`,
    transparent: true, depthWrite: false,
  });
  const dust = new THREE.Points(dustGeo, dustMat);
  dust.frustumCulled = false; dust.renderOrder = 3;
  scene.add(dust);
  const DUST_SAND = new THREE.Color(0xf3e6c8), DUST_EARTH = new THREE.Color(0xc9ae8a), SNOW_SPRAY = new THREE.Color(0xf4f7fb);
  let dustNext = 0, dustAcc = 0, gustDustAcc = 0;
  function spawnDust(x, y, z, vx, vy, vz, now) {
    const i = dustNext; dustNext = (dustNext + 1) % DUST_N;
    dustPos[i * 3] = x; dustPos[i * 3 + 1] = y; dustPos[i * 3 + 2] = z;
    dustVel[i * 3] = vx; dustVel[i * 3 + 1] = vy; dustVel[i * 3 + 2] = vz;
    dustBirth[i] = now;
  }

  // --- Bits: small ballistic particles — water spray from puddles, wood chips from logs
  const BIT_N = 360, BIT_LIFE = 0.9;
  const bitPos = new Float32Array(BIT_N * 3), bitVel = new Float32Array(BIT_N * 3), bitCol = new Float32Array(BIT_N * 3);
  const bitBirth = new Float32Array(BIT_N).fill(-10);
  const bitGeo = new THREE.BufferGeometry();
  bitGeo.setAttribute('position', new THREE.BufferAttribute(bitPos, 3));
  bitGeo.setAttribute('aBirth', new THREE.BufferAttribute(bitBirth, 1));
  bitGeo.setAttribute('aColor', new THREE.BufferAttribute(bitCol, 3));
  const bitMat = new THREE.ShaderMaterial({
    uniforms: { uTime: U.time, uPx: { value: 10 }, uLight: { value: 1 } },
    vertexShader: `uniform float uTime, uPx; attribute float aBirth; attribute vec3 aColor; varying float vT; varying vec3 vCol;
      void main() {
        vT = clamp((uTime - aBirth) / ${BIT_LIFE.toFixed(2)}, 0.0, 1.0);
        vCol = aColor;
        gl_PointSize = uPx * (1.0 - 0.4 * vT);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: `uniform float uLight; varying float vT; varying vec3 vCol;
      void main() {
        float d = length(gl_PointCoord - 0.5) * 2.0;
        float a = smoothstep(1.0, 0.5, d) * (1.0 - vT * vT);
        if (vT >= 1.0 || a < 0.02) discard;
        gl_FragColor = vec4(vCol * uLight, a * 0.9);
      }`,
    transparent: true, depthWrite: false,
  });
  const bits = new THREE.Points(bitGeo, bitMat);
  bits.frustumCulled = false; bits.renderOrder = 4;
  scene.add(bits);
  let bitNext = 0, bitsLive = false;
  const WATER = [0.82, 0.9, 1.0], WOOD = [0.62, 0.44, 0.28];
  function addBit(x, y, z, vx, vy, vz, col) {
    const i = bitNext; bitNext = (bitNext + 1) % BIT_N;
    bitPos.set([x, y, z], i * 3); bitVel.set([vx, vy, vz], i * 3); bitCol.set(col, i * 3);
    bitBirth[i] = U.time.value;
    bitsLive = true;
  }
  function spray(x, y, z, n, sp, bx, bz) {         // fans out sideways and back from the wheel
    for (let k = 0; k < n; k++) {
      const side = (Math.random() - 0.5) * 2;
      addBit(x, y, z, bx * sp * 0.25 + -bz * side * (1.5 + sp * 0.12), 1.5 + Math.random() * (1.5 + sp * 0.12), bz * sp * 0.25 + bx * side * (1.5 + sp * 0.12), WATER);
    }
  }
  function chips(x, y, z, n, sp) {
    for (let k = 0; k < n; k++) {
      const a = Math.random() * Math.PI * 2, s = 1 + Math.random() * (1 + sp * 0.2);
      addBit(x, y + 0.2, z, Math.cos(a) * s, 2 + Math.random() * 3, Math.sin(a) * s, WOOD);
    }
  }
  function stepBits(dt, now) {
    if (!bitsLive) { bits.visible = false; return; }
    let live = false;
    for (let i = 0; i < BIT_N; i++) {
      if (now - bitBirth[i] > BIT_LIFE) continue;
      live = true;
      bitVel[i * 3 + 1] -= G * dt;
      bitPos[i * 3] += bitVel[i * 3] * dt; bitPos[i * 3 + 1] += bitVel[i * 3 + 1] * dt; bitPos[i * 3 + 2] += bitVel[i * 3 + 2] * dt;
    }
    bitsLive = bits.visible = live;
    bitGeo.attributes.position.needsUpdate = true;
    bitGeo.attributes.aBirth.needsUpdate = true;
    bitGeo.attributes.aColor.needsUpdate = true;
    bitMat.uniforms.uPx.value = Math.max(3 * DPR, 0.22 * pxPerM());
    bitMat.uniforms.uLight.value = 0.35 + 0.65 * dayK;
  }
  const splashCool = [0, 0];
  let lastSplashSound = -1;

  // --- Tyre tracks: a ribbon behind each rear wheel of every vehicle, fading gently away over
  // 2.5 s. Slot 0 is the player's car; traffic borrows slots 1–2 (two ribbons per slot) while it's
  // around, and what it leaves behind keeps fading after it's gone.
  const TRAIL_N = 480, TRAIL_LIFE = 2.5, TRAIL_SLOTS = 1 + MAX_TRAFFIC, RIBBONS = TRAIL_SLOTS * 2;
  const trails = Array.from({ length: RIBBONS }, () => ({
    x: new Float32Array(TRAIL_N), y: new Float32Array(TRAIL_N), z: new Float32Array(TRAIL_N), h: new Float32Array(TRAIL_N),
    t: new Float32Array(TRAIL_N).fill(-100), a: new Float32Array(TRAIL_N), brk: new Uint8Array(TRAIL_N).fill(1),
    head: 0, lx: NaN, lz: NaN, broken: true,
  }));
  const slotFree = Array.from({ length: TRAIL_SLOTS }, (_, i) => i > 0);
  function takeTrailSlot() {
    const i = slotFree.indexOf(true);
    if (i < 0) return -1;
    slotFree[i] = false;
    trails[i * 2].broken = trails[i * 2 + 1].broken = true;     // don't join onto the last owner's tracks
    return i;
  }
  function freeTrailSlot(i) { if (i > 0) slotFree[i] = true; }
  player.trail = 0; player.rear = REAR; player.trackHalf = 0.14;
  // strength over age: starts fading at once, slowly at first, gone by TRAIL_LIFE
  const trackFade = (age) => (age > TRAIL_LIFE ? 0 : 1 - smooth(0, TRAIL_LIFE, age));
  const SEG = TRAIL_N - 1, TV = RIBBONS * SEG * 4;
  const trackPos = new Float32Array(TV * 3), trackAlpha = new Float32Array(TV);
  const trackIdx = new Uint16Array(RIBBONS * SEG * 6);
  for (let s = 0; s < RIBBONS * SEG; s++) trackIdx.set([s * 4, s * 4 + 1, s * 4 + 2, s * 4 + 2, s * 4 + 1, s * 4 + 3], s * 6);
  const trackGeo = new THREE.BufferGeometry();
  trackGeo.setAttribute('position', new THREE.BufferAttribute(trackPos, 3));
  trackGeo.setAttribute('aAlpha', new THREE.BufferAttribute(trackAlpha, 1));
  trackGeo.setIndex(new THREE.BufferAttribute(trackIdx, 1));
  const trackMat = new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color(0x2a2118) } },
    vertexShader: `attribute float aAlpha; varying float vA;
      void main() { vA = aAlpha; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `uniform vec3 uColor; varying float vA;
      void main() { if (vA < 0.005) discard; gl_FragColor = vec4(uColor, vA); }`,
    transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -4,
  });
  const tracks = new THREE.Mesh(trackGeo, trackMat);
  tracks.frustumCulled = false; tracks.renderOrder = 2;
  scene.add(tracks);

  function stepWheels(dt, now, inp) {
    car.updateMatrixWorld();
    const sp = Math.abs(state.speed);
    const onRoad = roadDist(state.x, state.z) < ROAD_HALF + 0.8;
    const skid = clamp(Math.abs(state.steer) * sp / 25 + ((inp.down || inp.brake) && state.speed > 3 ? 0.6 : 0) + (state.boosting ? 0.4 : 0), 0, 1);

    // Dust: more off-road, when boosting and when sliding; damped by wet ground, turned to spray in snow
    const dry = 1 - 0.85 * atmo.wet;
    const snowy = Math.max(atmo.snow, atmo.cover);
    const rate = state.grounded && sp > 3 ? (onRoad ? 0.5 : 1) * (sp / 36) * (1 + skid * 1.5) * Math.max(dry, snowy) * 70 : 0;
    const fx = -Math.sin(state.yaw), fz = -Math.cos(state.yaw);
    dustAcc += rate * dt;
    while (dustAcc >= 1) {
      dustAcc -= 1;
      car.localToWorld(_w.copy(REAR[dustNext & 1]));
      spawnDust(_w.x + (Math.random() - 0.5) * 0.4, _w.y + 0.2, _w.z + (Math.random() - 0.5) * 0.4,
        -fx * state.speed * 0.18 + (Math.random() - 0.5) * 2.4, 0.8 + Math.random() * 1.6, -fz * state.speed * 0.18 + (Math.random() - 0.5) * 2.4, now);
    }
    // A strong gust lifts dust (or powder snow) off the ground around the car and carries it downwind
    gustDustAcc += gustEvent > 0.35 ? (gustEvent - 0.35) * 60 * Math.max(dry, snowy) * dt : 0;
    while (gustDustAcc >= 1) {
      gustDustAcc -= 1;
      const x = focus.x + (Math.random() - 0.5) * zoom * 1.4, z = focus.z + (Math.random() - 0.5) * zoom * 1.4;
      spawnDust(x, heightAt(x, z) + 0.3, z, 6 + 12 * gust, 0.4 + Math.random(), 2 + 4 * gust, now);
    }

    // Puddles: driving through one throws up spray (and a splash you can hear)
    for (let w = 0; w < 2; w++) {
      splashCool[w] -= dt;
      if (splashCool[w] > 0 || !state.grounded || sp < 2.5) continue;
      car.localToWorld(_w.copy(REAR[w]));
      if (!inPuddle(_w.x, _w.z)) continue;
      splashCool[w] = 0.12;
      spray(_w.x, _w.y + 0.15, _w.z, 5 + Math.round(sp * 0.4), sp, -fx, -fz);
      if (now - lastSplashSound > 0.3) { lastSplashSound = now; splashSound(Math.min(1, sp / 25)); }
    }
    stepBits(dt, now);
    let live = false;
    const drag = Math.exp(-dt * 2.2);
    for (let i = 0; i < DUST_N; i++) {
      if (now - dustBirth[i] > DUST_LIFE) continue;
      live = true;
      dustVel[i * 3] = dustVel[i * 3] * drag + (3 + 10 * gust) * 0.35 * dt;     // blown downwind
      dustVel[i * 3 + 1] *= drag;
      dustVel[i * 3 + 2] *= drag;
      dustPos[i * 3] += dustVel[i * 3] * dt;
      dustPos[i * 3 + 1] += dustVel[i * 3 + 1] * dt;
      dustPos[i * 3 + 2] += dustVel[i * 3 + 2] * dt;
    }
    dust.visible = live;
    if (live) {
      dustGeo.attributes.position.needsUpdate = true;
      dustGeo.attributes.aBirth.needsUpdate = true;
      dustMat.uniforms.uPx.value = 0.7 * pxPerM();
      const c = dustMat.uniforms.uColor.value.copy(onRoad ? DUST_SAND : DUST_EARTH).lerp(SNOW_SPRAY, snowy);
      c.multiplyScalar(0.3 + 0.7 * dayK);
      dustMat.uniforms.uOpacity.value = 0.6;
    }

    // Tyre tracks: a point every half metre per rear wheel while grounded — every vehicle, deeper
    // when it's sliding, braking or boosting
    for (const vh of vehicles) {
      if (!(vh.trail >= 0)) continue;
      const s = vh.s, vsp = Math.abs(s.speed), vin = (vh.player ? inp : vh.inp) || {};
      const vOnRoad = roadDist(s.x, s.z) < ROAD_HALF + 0.8;
      const vSkid = clamp(Math.abs(s.steer) * vsp / 25 + ((vin.down || vin.brake) && s.speed > 3 ? 0.6 : 0) + (s.boosting ? 0.4 : 0), 0, 1);
      const strength = clamp((vOnRoad ? 0.16 : 0.24) + 0.45 * vSkid + 0.12 * atmo.wet + 0.15 * snowy, 0, 0.7);
      for (let w = 0; w < vh.rear.length; w++) {
        const tr = trails[vh.trail * 2 + w];
        vh.obj.localToWorld(_w.copy(vh.rear[w]));
        if (!s.grounded || vsp < 0.5) { if (!s.grounded) tr.broken = true; continue; }
        const d = Math.hypot(_w.x - tr.lx, _w.z - tr.lz);
        if (d < 0.5 && !tr.broken) continue;
        const i = tr.head; tr.head = (tr.head + 1) % TRAIL_N;
        const hit = groundHit(_w.x, _w.z);
        tr.x[i] = _w.x; tr.z[i] = _w.z; tr.y[i] = (hit ? hit.point.y : heightAt(_w.x, _w.z)) + 0.05;
        tr.t[i] = now; tr.a[i] = strength; tr.h[i] = vh.trackHalf;
        tr.brk[i] = tr.broken || d > 4 ? 1 : 0;                  // a jump or a reset starts a fresh track
        tr.broken = false; tr.lx = _w.x; tr.lz = _w.z;
      }
    }
    // rebuild the ribbons (oldest → newest), fading with age
    let v = 0;
    for (let w = 0; w < RIBBONS; w++) {
      const tr = trails[w];
      for (let s = 1; s < TRAIL_N; s++) {
        const i = (tr.head + s) % TRAIL_N, p = (i + TRAIL_N - 1) % TRAIL_N;
        const a = tr.brk[i] ? 0 : tr.a[i] * trackFade(now - tr.t[i]);
        let dx = tr.x[i] - tr.x[p], dz = tr.z[i] - tr.z[p];
        const len = Math.hypot(dx, dz) || 1;
        dx = dx / len * tr.h[i]; dz = dz / len * tr.h[i];
        const pa = a > 0 ? tr.a[p] * trackFade(now - tr.t[p]) : 0;
        trackPos.set([tr.x[p] + dz, tr.y[p], tr.z[p] - dx, tr.x[p] - dz, tr.y[p], tr.z[p] + dx,
          tr.x[i] + dz, tr.y[i], tr.z[i] - dx, tr.x[i] - dz, tr.y[i], tr.z[i] + dx], v * 3);
        trackAlpha[v] = trackAlpha[v + 1] = pa; trackAlpha[v + 2] = trackAlpha[v + 3] = a;
        v += 4;
      }
    }
    trackGeo.attributes.position.needsUpdate = true;
    trackGeo.attributes.aAlpha.needsUpdate = true;
  }

  // =====================================================================
  // Sound (Web Audio, all synthesised): engine, wind, rain + drops, thunder.
  // Starts on the first key press or tap (browsers block audio before that).
  // =====================================================================
  const audio = { ctx: null, on: true };
  try { audio.on = localStorage.getItem('valley-drive-sound') !== 'off'; } catch (e) { /* storage blocked */ }
  const soundBtn = document.getElementById('sound');
  soundBtn.setAttribute('aria-pressed', audio.on);
  function startAudio() {
    if (!audio.on) return;
    if (audio.ctx) { if (audio.ctx.state === 'suspended' && !document.hidden) audio.ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ac = audio.ctx = new AC();
    const master = audio.master = ac.createGain();
    master.gain.value = 0.85;
    master.connect(ac.destination);
    const sr = ac.sampleRate;
    const white = ac.createBuffer(1, sr * 2, sr), brown = ac.createBuffer(1, sr * 4, sr);
    { const d = white.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; }
    { const d = brown.getChannelData(0); let last = 0; for (let i = 0; i < d.length; i++) { last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02; d[i] = last * 3.5; } }
    audio.white = white; audio.brown = brown;
    const loop = (buf) => { const s = ac.createBufferSource(); s.buffer = buf; s.loop = true; s.start(0, Math.random()); return s; };
    const filter = (type, f, q) => { const n = ac.createBiquadFilter(); n.type = type; n.frequency.value = f; n.Q.value = q || 0.7; return n; };
    const gain = (v) => { const g = ac.createGain(); g.gain.value = v; return g; };

    // Engine: a sawtooth + sub square, pulsed for a little chug, through a throttle-driven low-pass
    const eg = gain(0), lp = filter('lowpass', 500, 2.5), trem = gain(0.7), sub = gain(0.4);
    const o1 = ac.createOscillator(); o1.type = 'sawtooth'; o1.frequency.value = 45;
    const o2 = ac.createOscillator(); o2.type = 'square'; o2.frequency.value = 22;
    const lfo = ac.createOscillator(); lfo.frequency.value = 12;
    const lfoG = gain(0.3);
    lfo.connect(lfoG).connect(trem.gain);
    o1.connect(trem); o2.connect(sub).connect(trem);
    trem.connect(lp).connect(eg).connect(master);
    const rumble = loop(brown), rumbleF = filter('lowpass', 140);
    rumble.connect(rumbleF).connect(gain(0.6)).connect(eg);
    o1.start(); o2.start(); lfo.start();
    // Wind: brown noise through a swaying band-pass
    const wf = filter('bandpass', 400, 0.6), wg = gain(0);
    loop(brown).connect(wf).connect(wg).connect(master);
    // Rain: hiss, plus single drops tapping near the car
    const rg = gain(0);
    loop(white).connect(filter('highpass', 900)).connect(filter('lowpass', 6500)).connect(rg).connect(master);
    audio.dropBus = gain(0.5); audio.dropBus.connect(master);
    audio.nodes = { o1, o2, lfo, lp, eg, wf, wg, rg };
    audio.dropAcc = 0;
  }
  function setSound(on) {
    audio.on = on;
    soundBtn.setAttribute('aria-pressed', on);
    try { localStorage.setItem('valley-drive-sound', on ? 'on' : 'off'); } catch (e) { /* storage blocked */ }
    if (on) startAudio();
    else if (audio.ctx) audio.ctx.suspend();
  }
  document.addEventListener('visibilitychange', () => {
    if (!audio.ctx) return;
    if (document.hidden) audio.ctx.suspend();
    else if (audio.on) audio.ctx.resume();
  });
  function thunder(delay, vol) {
    const ac = audio.ctx;
    if (!ac || ac.state !== 'running') return;
    const t = ac.currentTime + delay;
    const src = ac.createBufferSource(); src.buffer = audio.brown;
    const lpf = ac.createBiquadFilter(); lpf.type = 'lowpass'; lpf.frequency.value = 160 + Math.random() * 120;
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(1.1 * vol, t + 0.12);
    g.gain.exponentialRampToValueAtTime(0.25 * vol, t + 0.9);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 3.8);
    src.connect(lpf).connect(g).connect(audio.master);
    src.start(t, Math.random() * 2); src.stop(t + 4);
  }
  function drop() {
    const ac = audio.ctx, t = ac.currentTime;
    const src = ac.createBufferSource(); src.buffer = audio.white;
    const bp = ac.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1800 + Math.random() * 4200; bp.Q.value = 4;
    const g = ac.createGain();
    g.gain.setValueAtTime(0.25 + Math.random() * 0.35, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    src.connect(bp).connect(g).connect(audio.dropBus);
    src.start(t, Math.random() * 1.5, 0.06);
  }
  // one-shot noise burst: buffer → filter → gain envelope (attack, then exponential decay)
  function burst(buf, type, freq, q, vol, attack, decay, delay = 0, sweepTo = 0) {
    const ac = audio.ctx;
    if (!ac || ac.state !== 'running') return;
    const t = ac.currentTime + delay;
    const src = ac.createBufferSource(); src.buffer = buf;
    const f = ac.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
    if (sweepTo) { f.frequency.setValueAtTime(freq, t); f.frequency.exponentialRampToValueAtTime(sweepTo, t + attack + decay * 0.5); }
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, vol), t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
    src.connect(f).connect(g).connect(audio.master);
    src.start(t, Math.random() * 1.5); src.stop(t + attack + decay + 0.05);
  }
  // a gust sweeping through: rising, whistling band of wind that sinks away again
  function whoosh(peak) { if (audio.ctx) burst(audio.brown, 'bandpass', 280, 1.4, 0.55 * peak, 1.3, 4.6, 0, 900); }
  function splashSound(v) {
    if (!audio.ctx) return;
    burst(audio.white, 'bandpass', 900 + Math.random() * 500, 0.9, 0.35 * (0.4 + v), 0.01, 0.35);
    burst(audio.white, 'highpass', 3000, 0.7, 0.12 * (0.4 + v), 0.02, 0.25, 0.04);
  }
  function logSound(broke, v) {
    if (!audio.ctx) return;
    burst(audio.brown, 'lowpass', 180, 1, 0.9 * (0.3 + v), 0.005, 0.45);                 // thud
    if (broke) burst(audio.white, 'bandpass', 1800, 2.5, 0.5 * (0.4 + v), 0.003, 0.18);   // crack
  }
  function stepAudio(dt, inp) {
    const ac = audio.ctx;
    if (!ac || ac.state !== 'running') return;
    const t = ac.currentTime, n = audio.nodes, sp = Math.abs(state.speed);
    // rough gearbox: revs climb through each 10 m/s band, then drop a little into the next gear
    const gear = Math.min(4, Math.floor(sp / 10)), within = Math.min(1, (sp - gear * 10) / 10);
    let f = 40 + within * 46 + gear * 7;
    if (state.boosting) f *= 1.18;
    const throttle = inp.up ? 1 : 0;
    n.o1.frequency.setTargetAtTime(f, t, 0.08);
    n.o2.frequency.setTargetAtTime(f * 0.5, t, 0.08);
    n.lfo.frequency.setTargetAtTime(f * 0.25, t, 0.1);
    n.lp.frequency.setTargetAtTime(260 + within * 320 + throttle * 380 + (state.boosting ? 600 : 0), t, 0.12);
    n.eg.gain.setTargetAtTime(0.06 + throttle * 0.05 + sp / 36 * 0.05 + (state.boosting ? 0.05 : 0), t, 0.15);
    // wind: rises with speed and with the gusts
    n.wg.gain.setTargetAtTime(0.03 + sp / 36 * 0.14 + gust * 0.42, t, 0.3);
    n.wf.frequency.setTargetAtTime(300 + gust * 650 + sp * 9, t, 0.4);
    // rain
    n.rg.gain.setTargetAtTime(0.3 * atmo.rain, t, 0.5);
    audio.dropAcc += dt * atmo.rain * 24;
    while (audio.dropAcc >= 1) { audio.dropAcc -= 1; if (Math.random() < 0.8) drop(); }
    stepTrafficAudio(t);
  }

  // --- Traffic: each vehicle gets its own engine voice, fading with distance, panned across the
  // screen and pitched by the Doppler shift as it comes and goes; honks go out through the same path
  function audibility(v) { return 1 / (1 + Math.pow(Math.hypot(v.s.x - state.x, v.s.z - state.z) / 22, 1.6)); }
  function trafficVoice(v) {
    const ac = audio.ctx;
    const att = ac.createGain(); att.gain.value = 0;
    const pan = ac.createStereoPanner ? ac.createStereoPanner() : null;
    if (pan) att.connect(pan).connect(audio.master); else att.connect(audio.master);
    const eg = ac.createGain(); eg.connect(att);
    const osc = (type, f) => { const o = ac.createOscillator(); o.type = type; o.frequency.value = f; o.start(); return o; };
    const au = { att, pan, eg, srcs: [], dop: 1 };
    if (v.kind === 'tractor') {
      // diesel: a low square thudding at firing rate, plus clatter
      const o1 = osc('square', 30), o2 = osc('sawtooth', 61), lp = ac.createBiquadFilter();
      lp.type = 'lowpass'; lp.frequency.value = 420; lp.Q.value = 3;
      const trem = ac.createGain(); trem.gain.value = 0.5;
      const lfo = osc('square', 7), lfoG = ac.createGain(); lfoG.gain.value = 0.5;
      lfo.connect(lfoG).connect(trem.gain);
      o1.connect(trem); o2.connect(trem); trem.connect(lp).connect(eg);
      const clat = ac.createBufferSource(); clat.buffer = audio.white; clat.loop = true; clat.start();
      const bp = ac.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1400; bp.Q.value = 1.5;
      const cg = ac.createGain(); cg.gain.value = 0.18;
      clat.connect(bp).connect(cg).connect(trem);
      Object.assign(au, { oscs: [o1, o2], ratios: [1, 2.03], lfo, lfoRatio: 0.24, lp, vol: 0.2, base: 30, span: 14, step: 0 });
      au.srcs.push(o1, o2, lfo, clat);
    } else {
      // petrol: a saw through a low-pass (car), or two buzzy detuned saws, rasping higher (bike)
      const bike = v.kind === 'bike';
      const o1 = osc('sawtooth', 60), o2 = osc(bike ? 'sawtooth' : 'square', 30), lp = ac.createBiquadFilter();
      lp.type = bike ? 'bandpass' : 'lowpass'; lp.frequency.value = bike ? 900 : 650; lp.Q.value = bike ? 1.1 : 2;
      const g2 = ac.createGain(); g2.gain.value = bike ? 0.8 : 0.4;
      o1.connect(lp); o2.connect(g2).connect(lp); lp.connect(eg);
      Object.assign(au, bike
        ? { oscs: [o1, o2], ratios: [1, 1.012], lp, vol: 0.075, base: 80, span: 95, step: 14, lpBase: 700, lpSpan: 900 }
        : { oscs: [o1, o2], ratios: [1, 0.5], lp, vol: 0.09, base: 48, span: 50, step: 8, lpBase: 380, lpSpan: 700 });
      au.srcs.push(o1, o2);
    }
    return au;
  }
  const _cr = new THREE.Vector3();
  function stepTrafficAudio(t) {
    _cr.setFromMatrixColumn(camera.matrixWorld, 0);
    for (const v of traffic) {
      if (!v.au) v.au = trafficVoice(v);
      const au = v.au, s = v.s, sp = Math.abs(s.speed);
      // Doppler: pitched up on the way in, down on the way out
      au.dop = 343 / (343 - clamp(v.closing, -80, 80));
      const gear = Math.min(4, Math.floor(sp / 10)), within = Math.min(1, (sp - gear * 10) / 10);
      const f = (v.kind === 'tractor' ? au.base + (sp / v.maxF) * au.span : au.base + within * au.span + gear * au.step) * au.dop;
      au.oscs.forEach((o, i) => o.frequency.setTargetAtTime(f * au.ratios[i], t, 0.08));
      if (au.lfo) au.lfo.frequency.setTargetAtTime(f * au.lfoRatio, t, 0.1);
      const thr = v.inp && v.inp.up ? 1 : 0;
      if (au.lpBase) au.lp.frequency.setTargetAtTime(au.lpBase + within * au.lpSpan * 0.5 + thr * au.lpSpan * 0.5, t, 0.12);
      au.eg.gain.setTargetAtTime(au.vol * (0.75 + 0.25 * thr), t, 0.15);
      au.att.gain.setTargetAtTime(audibility(v), t, 0.1);
      if (au.pan) au.pan.pan.setTargetAtTime(clamp(((s.x - state.x) * _cr.x + (s.z - state.z) * _cr.z) / 30, -0.85, 0.85), t, 0.1);
    }
  }
  // a horn: two detuned square tones, beeped n times
  function honk(v, n) {
    const ac = audio.ctx;
    if (!ac || ac.state !== 'running' || !v.au) return;
    const [f1, f2, len, gap, cut] = v.kind === 'bike' ? [610, 770, 0.14, 0.09, 3400]
      : v.kind === 'tractor' ? [290, 348, 0.36, 0.14, 1500] : [405, 510, 0.24, 0.1, 2400];
    for (let k = 0; k < n; k++) {
      const t = ac.currentTime + 0.02 + k * (len + gap);
      const g = ac.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.13, t + 0.015);
      g.gain.setValueAtTime(0.13, t + len - 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, t + len);
      const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = cut;
      lp.connect(g).connect(v.au.att);
      [f1, f2].forEach((f) => {
        const o = ac.createOscillator(); o.type = 'square'; o.frequency.value = f * v.au.dop;
        o.connect(lp); o.start(t); o.stop(t + len + 0.02);
      });
    }
  }
  function crashSound(v) {
    if (!audio.ctx || v < 0.03) return;
    burst(audio.brown, 'lowpass', 220, 1, 1.0 * (0.3 + v), 0.004, 0.4);                  // thump
    burst(audio.white, 'bandpass', 2600, 3, 0.35 * (0.3 + v), 0.002, 0.22);              // metal clank
    burst(audio.white, 'highpass', 4200, 0.8, 0.12 * v, 0.01, 0.5, 0.05);               // rattle of bits
  }

  // =====================================================================
  // Isometric follow camera
  // =====================================================================
  const focus = new THREE.Vector3(), want = new THREE.Vector3();
  function applyFrustum() {
    const aspect = innerWidth / innerHeight, h = zoom / 2;
    camera.left = -h * aspect; camera.right = h * aspect; camera.top = h; camera.bottom = -h;
    camera.updateProjectionMatrix();
    const edge = h / Math.tan(ISO_PITCH);
    // thicker haze in fog, rain and snow
    const f = 0.7 * clamp(Math.max((atmo.fog - 0.2) / 0.8, atmo.rain * 0.45, atmo.snow * 0.5), 0, 1);
    scene.fog.near = ISO_DIST + edge * (0.45 - 1.05 * f);
    scene.fog.far = Math.min(ISO_DIST + edge * (1.25 - 0.6 * f) + 25 * (1 - f), ISO_DIST + 190);
  }
  function stepCamera(dt, snap) {
    const fx = -Math.sin(state.yaw), fz = -Math.cos(state.yaw);
    const lead = Math.max(-4, state.speed) * 0.45;
    want.set(state.x + fx * lead, state.y, state.z + fz * lead);
    focus.lerp(want, snap ? 1 : 1 - Math.exp(-dt * 3.5));
    const zt = zoomTarget * (state.boosting ? 1.12 : 1);
    zoom += (zt - zoom) * (snap ? 1 : 1 - Math.exp(-dt * 3));
    applyFrustum();
    camera.position.copy(focus).addScaledVector(ISO_DIR, ISO_DIST);
    camera.lookAt(focus);
  }

  // =====================================================================
  // HUD: distance · speed (with speed / boost arcs) · drive mode
  // =====================================================================
  const spdEl = document.getElementById('spd'), odoEl = document.getElementById('odo');
  const arcSpeed = document.getElementById('arcSpeed'), arcBoost = document.getElementById('arcBoost');
  let hudT = 0, boostVis = 0, lastSpd = '', lastOdo = '';
  function stepHud(dt) {
    boostVis += ((state.boosting ? 1 : 0) - boostVis) * Math.min(1, dt * 4);
    hudT += dt; if (hudT < 0.066) return; hudT = 0;
    const kmh = Math.abs(state.speed) * 3.6;
    const s = String(Math.round(kmh)), o = (state.odo / 1000).toFixed(1);
    if (s !== lastSpd) { spdEl.textContent = s; lastSpd = s; }
    if (o !== lastOdo) { odoEl.textContent = o; lastOdo = o; }
    arcSpeed.style.strokeDashoffset = (100 - clamp(kmh / 220, 0, 1) * 100).toFixed(1);
    arcBoost.style.strokeDashoffset = (100 - boostVis * 100).toFixed(1);
  }

  // Bottom-left: time of day · bottom-right: weather. Each click steps to the next option.
  const todBtn = document.getElementById('todBtn'), wxBtn = document.getElementById('wxBtn');
  function showToggles() {
    const t = TIME_OPTS[timeMode].label, w = WX_OPTS[wxMode];
    todBtn.querySelector('.tg-val').textContent = t;
    wxBtn.querySelector('.tg-val').textContent = w;
    todBtn.setAttribute('aria-label', 'Time of day: ' + t + '. Click for the next option.');
    wxBtn.setAttribute('aria-label', 'Weather: ' + w + '. Click for the next option.');
  }
  todBtn.addEventListener('click', (e) => { setTimeMode((timeMode + 1) % TIME_OPTS.length); showToggles(); if (e.detail) refocus(); });
  wxBtn.addEventListener('click', (e) => { setWeatherMode((wxMode + 1) % WX_OPTS.length); showToggles(); if (e.detail) refocus(); });
  showToggles();

  // Hide the UI (eye button, or H): everything but that button goes; it fades until hovered
  const hideBtn = document.getElementById('hideUi');
  function toggleUi() {
    const hidden = !document.body.classList.contains('ui-hidden');
    document.body.classList.toggle('ui-hidden', hidden);
    hideBtn.setAttribute('aria-pressed', hidden);
    hideBtn.setAttribute('aria-label', (hidden ? 'Show' : 'Hide') + ' the controls (H)');
  }
  hideBtn.addEventListener('click', (e) => { toggleUi(); if (e.detail) refocus(); });

  // Music: the portfolio's own track, quietly, picking up where the site's player left off
  const music = new Audio('audio/background-music.mp3');
  music.loop = true; music.volume = 0.16; music.preload = 'auto';
  let musicOn = true;
  try { musicOn = localStorage.getItem('valley-drive-music') !== 'off'; } catch (e) { /* storage blocked */ }
  music.addEventListener('loadedmetadata', () => {
    try { const t = parseFloat(localStorage.getItem('bgm-time')); if (t > 0 && t < music.duration) music.currentTime = t; } catch (e) { /* storage blocked */ }
  }, { once: true });
  const musicBtn = document.getElementById('music');
  const showMusic = () => { musicBtn.setAttribute('aria-pressed', musicOn); musicBtn.setAttribute('aria-label', 'Music ' + (musicOn ? 'on' : 'off')); };
  function tryMusic() { if (musicOn && music.paused && !document.hidden) music.play().catch(() => { /* waits for a gesture */ }); }
  musicBtn.addEventListener('click', (e) => {
    musicOn = !musicOn;
    try { localStorage.setItem('valley-drive-music', musicOn ? 'on' : 'off'); } catch (err) { /* storage blocked */ }
    if (musicOn) tryMusic(); else music.pause();
    showMusic();
    if (e.detail) refocus();
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) music.pause(); else tryMusic(); });
  addEventListener('pagehide', () => { try { localStorage.setItem('bgm-time', String(music.currentTime)); } catch (e) { /* storage blocked */ } });
  showMusic();

  // Sound starts by itself where the browser allows it (e.g. arriving by a click from Experiments);
  // otherwise on the very first key, click or touch
  const kickAudio = () => { startAudio(); tryMusic(); };
  ['pointerdown', 'keydown', 'touchstart', 'mousedown'].forEach((ev) => addEventListener(ev, kickAudio, { passive: true }));
  kickAudio();

  // Liquid glass (Chromium): each glass piece refracts what's behind it — a displacement map that
  // bends the backdrop outward near the rounded edges, like light through a thick lens rim
  const LIQUID = /Chrome\/\d+/.test(navigator.userAgent) && window.CSS && CSS.supports('backdrop-filter', 'url(#x)');
  const lgDefs = document.getElementById('lgDefs'), SVGNS = 'http://www.w3.org/2000/svg';
  function glassMap(w, h, rad) {
    const cv = document.createElement('canvas');
    cv.width = w; cv.height = h;
    const ctx = cv.getContext('2d'), img = ctx.createImageData(w, h);
    const bezel = Math.min(20, Math.min(w, h) * 0.32);
    const sdf = (x, y) => {                                   // signed distance to the rounded rect (−inside)
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
  function liquidGlass(el, n) {
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
      const w = Math.round(el.offsetWidth), h = Math.round(el.offsetHeight);
      if (!w || !h || last === w + 'x' + h) return;
      last = w + 'x' + h;
      const rad = Math.min(parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0, w / 2, h / 2);
      for (const [a, v] of [['x', 0], ['y', 0], ['width', w], ['height', h]]) { f.setAttribute(a, v); im.setAttribute(a, v); }
      im.setAttribute('href', glassMap(w, h, rad));
      dm.setAttribute('scale', Math.round(Math.min(46, Math.min(w, h) * 0.55)));
      el.style.backdropFilter = `url(#${id}) blur(3px) saturate(1.5) brightness(1.06)`;
    };
    new ResizeObserver(build).observe(el);
    build();
  }
  if (LIQUID) document.querySelectorAll('.glass').forEach(liquidGlass);

  function resize() {
    renderer.setSize(innerWidth, innerHeight, false);
    if (innerWidth < innerHeight) zoomTarget = Math.max(zoomTarget, 70);
    applyFrustum();
  }
  addEventListener('resize', resize);
  resize();
  placeOnRoad(0);
  for (let dz = -3; dz <= 3; dz++) for (let dx = -3; dx <= 3; dx++) buildChunk(Math.round(state.x / CHUNK) + dx, dz);
  stepTime(0);
  applyTime();
  stepCar(0.016);
  stepCamera(0, true);
  setMode('auto', true);
  document.getElementById('loading').remove();

  const clock = new THREE.Clock();
  let now = 0;
  function frame() {
    const dt = Math.min(clock.getDelta(), 0.05);
    now += dt;
    U.time.value = now;
    stepTime(dt);
    stepWeather(dt, now);
    applyTime();
    const inp = stepCar(dt);
    stepTraffic(dt, now);
    stepProps(dt);
    updateChunks(state.x, state.z, -Math.sin(state.yaw), -Math.cos(state.yaw), BUILD_PER_FRAME);
    stepCamera(dt, false);
    stepAtmosphere(dt, now);
    stepClouds(dt);
    stepWheels(dt, now, inp);
    stepAudio(dt, inp);
    sun.position.copy(focus).addScaledVector(lightDir, 260);
    sun.target.position.copy(focus);
    sun.target.updateMatrixWorld();
    stepHud(dt);
    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }
  canvas.focus();
  requestAnimationFrame(frame);
})();
