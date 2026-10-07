// Sunflower — see reference/sunflower-page.md.
// A procedural 3D sunflower in a meadow. The sun's real position (from the viewer's GPS + clock) drives the
// directional light, the sky, the flower's heliotropism and its night-time droop; the phone compass steers the camera.
import * as THREE from 'three';
import { Sky } from 'three/addons/objects/Sky.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createFilmPipeline } from './sunflower-fx.js';
import { createAmbience } from './sunflower-audio.js';

const RAD = Math.PI / 180;
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
function mulberry32(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const rand = mulberry32(7);
const TOUCH = matchMedia('(pointer: coarse)').matches;

// ======================= Renderer / scene =======================
const stage = document.getElementById('stage');
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, TOUCH ? 2 : 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
stage.appendChild(renderer.domElement);
renderer.domElement.tabIndex = 0;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(46, innerWidth / innerHeight, 0.05, 3000);
scene.fog = new THREE.FogExp2(0xaec6dc, 0.011);

// Sky: a physically based sky driven by the real sun. It is rendered into a cube map that serves as the
// backdrop and (through PMREM) the image-based light, so sky, ambient light and sun always agree.
const skyScene = new THREE.Scene();
const sky = new Sky(); sky.scale.setScalar(10000); skyScene.add(sky);
const skyU = sky.material.uniforms;
skyU.turbidity.value = 4; skyU.rayleigh.value = 1.4; skyU.mieCoefficient.value = 0.004; skyU.mieDirectionalG.value = 0.82;
const cubeRT = new THREE.WebGLCubeRenderTarget(TOUCH ? 256 : 512, { type: THREE.HalfFloatType });
const cubeCam = new THREE.CubeCamera(1, 20000, cubeRT);
const pmrem = new THREE.PMREMGenerator(renderer);
let envRT = null, lastEnv = { az: -999, alt: -999, t: 0 };
scene.background = cubeRT.texture;
function refreshSky(sunDir, az, alt, force) {
  const now = performance.now();
  if (!force && (now - lastEnv.t < 250 || (Math.abs(az - lastEnv.az) < 0.35 && Math.abs(alt - lastEnv.alt) < 0.35))) return;
  lastEnv = { az, alt, t: now };
  skyU.sunPosition.value.copy(sunDir);
  skyU.rayleigh.value = 1.2 + 1.6 * (1 - smooth(-2, 18, alt));      // redder, thicker air near the horizon
  cubeCam.update(renderer, skyScene);
  const next = pmrem.fromCubemap(cubeRT.texture);
  if (envRT) envRT.dispose();
  envRT = next; scene.environment = envRT.texture;
}

// Stars fade in once the sun is well below the horizon.
const stars = (() => {
  const n = 1400, pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const u = rand() * 2 - 1, a = rand() * Math.PI * 2, r = Math.sqrt(1 - u * u);
    pos.set([r * Math.cos(a) * 1500, Math.abs(u) * 1500, r * Math.sin(a) * 1500], i * 3);
  }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const m = new THREE.PointsMaterial({ color: 0xffffff, size: 1.6, sizeAttenuation: false, transparent: true, opacity: 0, depthWrite: false, fog: false });
  const p = new THREE.Points(g, m); p.frustumCulled = false; scene.add(p); return p;
})();

// Lights. Only the sun casts shadows.
const sunLight = new THREE.DirectionalLight(0xfff2dd, 3);
sunLight.castShadow = true;
sunLight.shadow.mapSize.set(TOUCH ? 1024 : 2048, TOUCH ? 1024 : 2048);
Object.assign(sunLight.shadow.camera, { left: -4, right: 4, top: 4, bottom: -4, near: 1, far: 60 });
sunLight.shadow.bias = -0.0004; sunLight.shadow.normalBias = 0.02; sunLight.shadow.radius = 3;
sunLight.target.position.set(0, 1.0, 0);
scene.add(sunLight, sunLight.target);
const hemi = new THREE.HemisphereLight(0x9fc4ff, 0x4a3a20, 0.3); scene.add(hemi);
const ambient = new THREE.AmbientLight(0xb4c4e6, 0.3); scene.add(ambient);   // floor so the scene never goes fully dark

// Translucency: thin petals and grass glow when the sun is behind them (as seen from the camera).
const sunView = { value: new THREE.Vector3(0, 1, 0) };    // direction to the sun, in view space
const sunGlow = { value: new THREE.Color(0, 0, 0) };      // sun colour × how strong the sun is
function addTranslucency(mat, strength, power = 4) {
  const prev = mat.onBeforeCompile;
  mat.onBeforeCompile = (sh, r) => {
    prev?.(sh, r);
    sh.uniforms.uSunView = sunView; sh.uniforms.uSunGlow = sunGlow;
    sh.fragmentShader = 'uniform vec3 uSunView; uniform vec3 uSunGlow;\n' + sh.fragmentShader.replace('#include <emissivemap_fragment>',
      `#include <emissivemap_fragment>
       { float back = pow(max(dot(uSunView, -normalize(vViewPosition)), 0.0), ${power.toFixed(1)});
         totalEmissiveRadiance += diffuseColor.rgb * uSunGlow * back * ${strength.toFixed(2)}; }`);
  };
  mat.customProgramCacheKey = () => 'tr' + strength + power + (prev ? 'w' : '');
  return mat;
}

// ======================= Procedural textures =======================
function canvasTex(w, h, draw, srgb = true) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  t.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return t;
}
function discDraw(color) {
  return (g, w, h) => {
    const R = w / 2; g.clearRect(0, 0, w, h);
    g.save(); g.beginPath(); g.arc(R, R, R - 1, 0, 7); g.clip();
    g.fillStyle = color ? '#1a1008' : '#000'; g.fillRect(0, 0, w, h);
    const N = 2600, ga = Math.PI * (3 - Math.sqrt(5)), sp = R / Math.sqrt(N);
    for (let i = 0; i < N; i++) {
      const rr = Math.sqrt(i / N) * R * 0.975, a = i * ga, x = R + rr * Math.cos(a), y = R + rr * Math.sin(a), f = rr / R, rad = sp * 0.66;
      const gr = g.createRadialGradient(x, y, 0, x, y, rad);
      if (color) {
        let c0, c1;
        if (f < 0.28) { c0 = '#8a7a30'; c1 = '#40330f'; }
        else if (f < 0.82) { c0 = '#6b4119'; c1 = '#24150a'; }
        else { c0 = '#c47c16'; c1 = '#4a2a0c'; }
        gr.addColorStop(0, c0); gr.addColorStop(1, c1);
      } else { gr.addColorStop(0, '#fff'); gr.addColorStop(1, '#000'); }
      g.fillStyle = gr; g.beginPath(); g.arc(x, y, rad, 0, 7); g.fill();
    }
    g.restore();
  };
}
const discColor = canvasTex(1024, 1024, discDraw(true));
const discBump = canvasTex(1024, 1024, discDraw(false), false);

const petalColor = canvasTex(256, 512, (g, w, h) => {
  const gr = g.createLinearGradient(0, h, 0, 0);
  gr.addColorStop(0, '#d9840a'); gr.addColorStop(0.35, '#f6b50e'); gr.addColorStop(0.8, '#ffd21f'); gr.addColorStop(1, '#ffdc45');
  g.fillStyle = gr; g.fillRect(0, 0, w, h);
  g.lineWidth = 1.2;
  for (let k = 0; k < 17; k++) {
    const x = w * (0.08 + 0.84 * k / 16);
    g.strokeStyle = 'rgba(170,90,0,0.30)'; g.beginPath(); g.moveTo(w / 2 + (x - w / 2) * 0.2, h); g.lineTo(x, h * 0.06); g.stroke();
  }
  for (let i = 0; i < 1500; i++) { g.fillStyle = `rgba(${rand() < .5 ? '255,240,160' : '150,80,0'},0.05)`; g.fillRect(rand() * w, rand() * h, 2, 6 + rand() * 10); }
});
const petalBump = canvasTex(256, 512, (g, w, h) => {
  g.fillStyle = '#999'; g.fillRect(0, 0, w, h); g.lineWidth = 2.2;
  for (let k = 0; k < 17; k++) {
    const x = w * (0.08 + 0.84 * k / 16);
    g.strokeStyle = '#222'; g.beginPath(); g.moveTo(w / 2 + (x - w / 2) * 0.2, h); g.lineTo(x, h * 0.06); g.stroke();
  }
}, false);

const leafColor = canvasTex(512, 512, (g, w, h) => {
  const gr = g.createLinearGradient(0, 0, w, 0);
  gr.addColorStop(0, '#2f6a1e'); gr.addColorStop(0.5, '#4a8a2a'); gr.addColorStop(1, '#2f6a1e');
  g.fillStyle = gr; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 4000; i++) { g.fillStyle = `rgba(${rand() < .5 ? '20,60,10' : '120,170,60'},0.06)`; g.fillRect(rand() * w, rand() * h, 3, 3); }
  g.strokeStyle = 'rgba(190,220,120,0.55)'; g.lineWidth = 5; g.beginPath(); g.moveTo(w / 2, h); g.lineTo(w / 2, 0); g.stroke();
  g.lineWidth = 2.2; g.strokeStyle = 'rgba(170,205,100,0.4)';
  for (let j = 0; j < 12; j++) {
    const y = h * (0.9 - j * 0.065);
    for (const sx of [0, w]) { g.beginPath(); g.moveTo(w / 2, y); g.quadraticCurveTo((w / 2 + sx) / 2, y - 40, sx, y - h * 0.16); g.stroke(); }
  }
});
const leafBump = canvasTex(512, 512, (g, w, h) => {
  g.fillStyle = '#aaa'; g.fillRect(0, 0, w, h);
  g.strokeStyle = '#333'; g.lineWidth = 5; g.beginPath(); g.moveTo(w / 2, h); g.lineTo(w / 2, 0); g.stroke();
  g.lineWidth = 2.5;
  for (let j = 0; j < 12; j++) {
    const y = h * (0.9 - j * 0.065);
    for (const sx of [0, w]) { g.beginPath(); g.moveTo(w / 2, y); g.quadraticCurveTo((w / 2 + sx) / 2, y - 40, sx, y - h * 0.16); g.stroke(); }
  }
}, false);

const noiseTex = canvasTex(128, 128, (g, w, h) => {
  g.fillStyle = '#7a8f55'; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 2500; i++) { const v = 90 + rand() * 120 | 0; g.fillStyle = `rgba(${v},${v + 20},${v - 30},0.35)`; g.fillRect(rand() * w, rand() * h, 1 + rand() * 2, 1 + rand() * 4); }
});
noiseTex.wrapS = noiseTex.wrapT = THREE.RepeatWrapping; noiseTex.repeat.set(2, 24);

// ======================= Geometry builders =======================
function gridGeometry(nu, nv, fn) {        // fn(u in -1..1, v in 0..1) -> [x,y,z]
  const pos = [], uv = [], idx = [];
  for (let j = 0; j <= nv; j++) for (let i = 0; i <= nu; i++) {
    const u = i / nu * 2 - 1, v = j / nv;
    pos.push(...fn(u, v)); uv.push(i / nu, v);
  }
  for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) {
    const a = j * (nu + 1) + i, b = a + 1, c = a + nu + 1, d = c + 1;
    idx.push(a, b, c, b, d, c);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx); g.computeVertexNormals(); return g;
}
// petal: along +Y (length 1), width in X, curl in Z
const petalGeo = gridGeometry(6, 14, (s, t) => {
  const hw = 0.2 * Math.pow(Math.sin(Math.PI * Math.pow(t, 0.7)), 0.85);
  const x = s * hw;
  const z = -0.18 * t * t + 0.5 * s * s * hw * 0.5 + 0.012 * Math.sin(t * 11 + s * 3);
  return [x, t, z];
});
// leaf: along +X (length 1), width in Z, bends in Y
const leafGeo = gridGeometry(10, 22, (s, t) => {
  const bt = clamp((t - 0.22) / 0.78, 0, 1);
  const hw = t < 0.22 ? 0.012 : 0.36 * Math.pow(Math.sin(Math.PI * Math.pow(bt, 0.62)), 0.9) + 0.012;
  const y = 0.45 * t - 0.75 * t * t - 0.12 * Math.abs(s) * hw + 0.01 * Math.sin(t * 14 + s * 4);
  return [t, y, s * hw];
});
function discGeo(R, depth) {
  const g = new THREE.PlaneGeometry(2 * R, 2 * R, 80, 80), p = g.attributes.position;
  for (let i = 0; i < p.count; i++) { const d = Math.hypot(p.getX(i), p.getY(i)) / R; p.setZ(i, d < 1 ? depth * (1 - d * d) + 0.002 * Math.sin(d * 40) * d : 0); }
  g.computeVertexNormals(); return g;
}

// ======================= The plant =======================
const plant = new THREE.Group(); scene.add(plant);
// Lower stem is fixed; the neck above it is an arc whose bend (phi) grows as the flower droops at night.
const lowCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.025, 0.5, 0.012), new THREE.Vector3(-0.02, 1.1, -0.01), new THREE.Vector3(0.0, 1.45, 0.03)
]);
const lowPts = lowCurve.getSpacedPoints(80);
const NECK = 0.4, neckP0 = lowPts[80].clone(), neckT0 = lowCurve.getTangentAt(1).normalize();
const bendDir = new THREE.Vector3(-1, 0, 0); bendDir.addScaledVector(neckT0, -bendDir.dot(neckT0)).normalize();   // droops toward the west
function neckPoint(u, phi, out) {
  const k = NECK / phi, a = phi * u;
  return out.copy(neckP0).addScaledVector(neckT0, k * Math.sin(a)).addScaledVector(bendDir, k * (1 - Math.cos(a)));
}
function neckTangent(phi, out) { return out.copy(neckT0).multiplyScalar(Math.cos(phi)).addScaledVector(bendDir, Math.sin(phi)).normalize(); }
// stem with taper
const TS = 160, RS = 14;
const stem = new THREE.Mesh(new THREE.BufferGeometry(), new THREE.MeshStandardMaterial({ color: 0x6e9a3a, map: noiseTex, bumpMap: noiseTex, bumpScale: 1.5, roughness: 0.75 }));
stem.castShadow = stem.receiveShadow = true; plant.add(stem);
let stemPhi = -1;
function buildStem(phi) {
  const pts = lowPts.slice(0, 80);
  for (let i = 0; i <= 40; i++) pts.push(neckPoint(i / 40, phi, new THREE.Vector3()));
  const stemCurve = new THREE.CatmullRomCurve3(pts);
  const stemGeo = new THREE.TubeGeometry(stemCurve, TS, 1, RS, false);
  headPivot.position.copy(neckPoint(1, phi, new THREE.Vector3()));
  const p = stemGeo.attributes.position;
  for (let i = 0; i <= TS; i++) {
    const u = i / TS, c = stemCurve.getPointAt(u), r = 0.026 - 0.012 * u + 0.009 * smooth(0.88, 1, u);
    for (let j = 0; j <= RS; j++) {
      const k = i * (RS + 1) + j;
      p.setXYZ(k, c.x + (p.getX(k) - c.x) * r, c.y + (p.getY(k) - c.y) * r, c.z + (p.getZ(k) - c.z) * r);
    }
  }
  stemGeo.computeVertexNormals();
  stem.geometry.dispose(); stem.geometry = stemGeo; stemPhi = phi;
}

// leaves (they droop a little at night)
const leafMat = addTranslucency(new THREE.MeshStandardMaterial({ map: leafColor, bumpMap: leafBump, bumpScale: 2, roughness: 0.6, side: THREE.DoubleSide }), 0.35, 3);
const leaves = [];
for (let i = 0; i < 7; i++) {
  const p = lowCurve.getPointAt(0.1 + i * 0.12);
  const m = new THREE.Mesh(leafGeo, leafMat);
  const sc = 0.62 - i * 0.045;
  m.scale.set(sc, sc, sc);
  m.position.copy(p);
  m.rotation.y = -(i * 2.399 + 0.5);                 // golden-angle phyllotaxis
  m.userData.baseZ = (rand() - 0.5) * 0.25;
  m.castShadow = m.receiveShadow = true; plant.add(m); leaves.push(m);
}
const setLeafDroop = d => leaves.forEach((m, i) => { m.rotation.z = m.userData.baseZ - d * (0.32 + 0.04 * i); });

// head
const headPivot = new THREE.Group(); headPivot.position.copy(neckP0); plant.add(headPivot);
const head = new THREE.Group(); head.position.z = 0.08; head.scale.setScalar(2.0); headPivot.add(head);

const disc = new THREE.Mesh(discGeo(0.115, 0.012), new THREE.MeshStandardMaterial({
  map: discColor, bumpMap: discBump, bumpScale: 7, roughness: 0.85, alphaTest: 0.5, side: THREE.DoubleSide }));
disc.castShadow = disc.receiveShadow = true; head.add(disc);
{   // warm backing under the disc so no sky shows through the seam between disc and petal bases
  const fill = new THREE.Mesh(new THREE.CircleGeometry(0.124, 48), new THREE.MeshStandardMaterial({ color: 0xa8700c, roughness: 0.9, side: THREE.DoubleSide }));
  fill.position.z = -0.013; fill.receiveShadow = true; head.add(fill);
}

const petalMat = addTranslucency(new THREE.MeshPhysicalMaterial({ map: petalColor, bumpMap: petalBump, bumpScale: 1.2, roughness: 0.5,
  sheen: 0.25, sheenColor: new THREE.Color(0xffc21a), sheenRoughness: 0.6, side: THREE.DoubleSide }), 0.5, 3);
// Real photographic textures (public-domain macro of a sunflower head, see images/sunflower/LICENSE.txt) replace the
// procedural ones once they arrive; the procedural versions stay as the instant fallback.
{
  const tl = new THREE.TextureLoader(), aniso = renderer.capabilities.getMaxAnisotropy();
  const load = (url, fn) => tl.load(url, t => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = aniso; fn(t); }, undefined, e => console.warn('Texture unavailable:', url, e));
  load('images/sunflower/sunflower_disc.webp', t => { Object.assign(disc.material, { map: t, bumpMap: t, bumpScale: 5 }); disc.material.needsUpdate = true; });
  load('images/sunflower/sunflower_petal.jpg', t => { petalMat.map = t; petalMat.needsUpdate = true; });
}
const dummy = new THREE.Object3D(), tint = new THREE.Color();
const wiltRings = [];
function placeRing(im, w) {                     // w = 0 (perky) .. 1 (wilted: petals fold toward the face side and shrink a little)
  const { items, R0, wiltK } = im.userData;
  items.forEach((it, i) => {
    dummy.position.set(R0 * Math.cos(it.a), R0 * Math.sin(it.a), it.z);
    dummy.rotation.set(it.tilt + w * wiltK * it.wr, it.twist, it.a - Math.PI / 2, 'ZXY');
    const k = 1 - 0.12 * w * (wiltK > 0 ? 1 : 0);
    dummy.scale.set(it.sw * k, it.L * k, it.L * k);
    dummy.updateMatrix(); im.setMatrixAt(i, dummy.matrix);
  });
  im.instanceMatrix.needsUpdate = true;
}
const setWilt = w => wiltRings.forEach(im => placeRing(im, w));
function petalRing(n, R0, len, z0, tiltMin, tiltMax, offset, mat, hueFn, widthMul = 1, wiltK = 0) {
  const im = new THREE.InstancedMesh(petalGeo, mat, n), items = [];
  for (let i = 0; i < n; i++) {
    const a = (i + offset) / n * Math.PI * 2 + (rand() - 0.5) * 0.08, L = len * (0.88 + rand() * 0.24);
    items.push({ a, L, z: z0 + rand() * 0.004, tilt: tiltMin + rand() * (tiltMax - tiltMin), twist: (rand() - 0.5) * 0.5,
                 sw: L * widthMul * (0.9 + rand() * 0.25), wr: 0.7 + rand() * 0.6 });
    im.setColorAt(i, hueFn());
  }
  im.userData = { items, R0, wiltK };
  placeRing(im, 0); if (wiltK) wiltRings.push(im);
  im.castShadow = im.receiveShadow = true; head.add(im); return im;
}
const yel = () => tint.setHSL(0.125 + rand() * 0.02, 0.9 + rand() * 0.1, 0.9 + rand() * 0.18).clone();
petalRing(34, 0.106, 0.112, -0.016, -0.7, -0.25, 0.5, petalMat, yel, 1, 1.15);  // back layer
petalRing(32, 0.11, 0.122, -0.008, -0.45, -0.05, 0.25, petalMat, yel, 1, 1.15); // middle layer
petalRing(28, 0.114, 0.128, -0.002, -0.22, 0.14, 0, petalMat, yel, 1, 1.15);    // front layer

// green bracts (sepals) and back cap
const bractMat = addTranslucency(new THREE.MeshStandardMaterial({ map: leafColor, bumpMap: leafBump, bumpScale: 2, roughness: 0.7, side: THREE.DoubleSide }), 0.3, 3);
const green = () => tint.setHSL(0.26 + rand() * 0.03, 0.45, 0.82 + rand() * 0.15).clone();
petalRing(18, 0.1, 0.075, -0.02, -1.15, -0.8, 0, bractMat, green, 1.4);
petalRing(18, 0.085, 0.065, -0.035, -1.35, -1.0, 0.5, bractMat, green, 1.4);
{
  const capGeo = new THREE.SphereGeometry(0.108, 48, 20, 0, Math.PI * 2, 0, Math.PI / 2); capGeo.rotateX(-Math.PI / 2);
  const cap = new THREE.Mesh(capGeo, new THREE.MeshStandardMaterial({ color: 0x4f7a2a, map: noiseTex, bumpMap: noiseTex, bumpScale: 2, roughness: 0.8 }));
  cap.scale.z = 0.5; cap.position.z = -0.012; cap.castShadow = cap.receiveShadow = true; head.add(cap);
}

// ======================= Meadow =======================
const bladeGeo = gridGeometry(1, 5, (s, t) => [s * 0.016 * (1 - 0.92 * t), t, 0.35 * t * t]);
{
  const n = bladeGeo.attributes.position.count, col = new Float32Array(n * 3), p = bladeGeo.attributes.position;
  for (let i = 0; i < n; i++) {
    const t = clamp(p.getY(i), 0, 1);
    col[i * 3] = 0.03 + 0.3 * t; col[i * 3 + 1] = 0.10 + 0.42 * t; col[i * 3 + 2] = 0.02 + 0.08 * t;
  }
  bladeGeo.setAttribute('color', new THREE.BufferAttribute(col, 3));
}
const grassTime = { value: 0 };
// Wind: sways vertices by height². Geometry is normalised to height 1 so the same sway suits blades, tufts and clumps.
function addWind(mat) {
  const prev = mat.onBeforeCompile, key = mat.customProgramCacheKey;
  mat.onBeforeCompile = (sh, r) => {
    prev?.(sh, r);
    sh.uniforms.uTime = grassTime;
    sh.vertexShader = 'uniform float uTime;\n' + sh.vertexShader.replace('#include <begin_vertex>', `#include <begin_vertex>
      #ifdef USE_INSTANCING
        float ph = instanceMatrix[3].x * 2.7 + instanceMatrix[3].z * 1.9;
        float gust = 0.55 + 0.45 * sin(uTime * 0.35 + instanceMatrix[3].x * 0.45 + instanceMatrix[3].z * 0.3);
        float hh = position.y * position.y;
        transformed.x += (sin(uTime * 1.6 + ph) * 0.07 + gust * 0.05) * hh;
        transformed.z += cos(uTime * 1.2 + ph * 1.3) * 0.05 * hh;
      #endif`);
  };
  mat.customProgramCacheKey = () => key.call(mat) + 'wind';
  return mat;
}
const grassMat = addWind(addTranslucency(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.65, side: THREE.DoubleSide }), 0.9, 4));
// The meadow covers the whole plain in three levels of detail. Every ring is split into angular sectors, each its own
// InstancedMesh with a bounding sphere, so only the sectors in view are drawn.
//   LOD0  0–8 m     single blades, 5 segments, wind, casts shadows within 2.6 m
//   LOD1  8–35 m    tufts of 5 two-segment blades
//   LOD2  35–130 m  tufts of 3 flat blades (beyond that fog and the ground texture take over)
function tuftGeometry(nBlades, segs, spread, seed, wMul = 1) {
  const rnd = mulberry32(seed), pos = [], col = [], uv = [], idx = [];
  for (let b = 0; b < nBlades; b++) {
    const ang = rnd() * Math.PI, ox = (rnd() - 0.5) * spread, oz = (rnd() - 0.5) * spread, h = 0.7 + rnd() * 0.5, w = 0.016 * wMul * (1.2 + rnd() * 0.6), lean = (rnd() - 0.2) * 0.5;
    const base = pos.length / 3, c = Math.cos(ang), s = Math.sin(ang);
    for (let j = 0; j <= segs; j++) {
      const t = j / segs;
      for (const sx of [-1, 1]) {
        const lx = sx * w * (1 - 0.9 * t), lz = lean * t * t * h;
        pos.push(ox + lx * c + lz * s, t * h, oz + lx * s - lz * c);
        col.push(0.03 + 0.3 * t, 0.1 + 0.42 * t, 0.02 + 0.08 * t); uv.push(sx * 0.5 + 0.5, t);
      }
    }
    for (let j = 0; j < segs; j++) { const a = base + j * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx); g.computeVertexNormals();
  for (let i = 0; i < g.attributes.normal.count; i++) g.attributes.normal.setXYZ(i, 0, 1, 0);   // light like the ground, not like flat cards
  return g;
}
{
  const gcol = new THREE.Color();
  const tint = () => gcol.setHSL(0.02 + rand() * 0.05, 0.25 * rand(), 0.75 + rand() * 0.45).clone();
  const place = (geo, list, cast, receive) => {            // list of {x,z,h,w}
    const m = new THREE.InstancedMesh(geo, grassMat, list.length);
    list.forEach((o, i) => {
      dummy.position.set(o.x, 0, o.z);
      dummy.rotation.set((rand() - 0.5) * 0.3, rand() * 6.283, (rand() - 0.5) * 0.3, 'YXZ');
      dummy.scale.set(o.w, o.h, o.w * (0.9 + rand() * 0.2));
      dummy.updateMatrix(); m.setMatrixAt(i, dummy.matrix); m.setColorAt(i, tint());
    });
    m.castShadow = cast; m.receiveShadow = receive; m.computeBoundingSphere();
    m.boundingSphere.radius += 1.5;                         // room for wind sway
    scene.add(m); return m;
  };
  const sectors = (geo, count, r0, r1, N, hFn, wFn) => {    // uniform scatter over an annulus, split into N sectors
    for (let s = 0; s < N; s++) {
      const list = [], n = Math.round(count / N);
      for (let i = 0; i < n; i++) {
        const a = (s + rand()) / N * Math.PI * 2, r = Math.sqrt(r0 * r0 + rand() * (r1 * r1 - r0 * r0));
        list.push({ x: Math.cos(a) * r, z: Math.sin(a) * r, h: hFn(r), w: wFn(r) });
      }
      place(geo, list, false, false);
    }
  };

  // LOD0 — as before, in a 8 m disc
  const R = 8, blades = [];
  const add = (x, z) => { const r = Math.hypot(x, z); if (r < 0.05 || r > R) return; blades.push([x, z, r]); };
  const clumps = TOUCH ? 170 : 520, per = TOUCH ? 100 : 120, scatter = TOUCH ? 3500 : 12000;
  for (let c = 0; c < clumps; c++) {
    const a = rand() * 6.283, r = Math.pow(rand(), 0.7) * R, cx = Math.cos(a) * r, cz = Math.sin(a) * r;
    const k = Math.round(per * (1 - 0.65 * r / R));
    for (let q = 0; q < k; q++) add(cx + (rand() + rand() + rand() - 1.5) * 0.3, cz + (rand() + rand() + rand() - 1.5) * 0.3);
  }
  for (let k = 0; k < scatter; k++) { const a = rand() * 6.283, r = Math.sqrt(rand()) * R; add(Math.cos(a) * r, Math.sin(a) * r); }
  const toObj = ([x, z, r]) => ({ x, z, h: (0.18 + rand() * rand() * 0.6) * (1 - 0.45 * (r / R) * (r / R)), w: 0.7 + rand() * 0.9 });
  place(bladeGeo, blades.filter(b => b[2] < 2.6).map(toObj), !TOUCH, true);
  const outer = blades.filter(b => b[2] >= 2.6).map(toObj), N0 = 6;
  for (let s = 0; s < N0; s++) place(bladeGeo, outer.filter(o => Math.floor(((Math.atan2(o.z, o.x) + Math.PI * 2) % (Math.PI * 2)) / (Math.PI * 2) * N0) === s), false, false);

  // LOD1 / LOD2 — tufts
  const tuft1 = tuftGeometry(5, 2, 0.35, 11, 1.6), tuft2 = tuftGeometry(3, 1, 0.5, 23, 3.2);
  const hAt = r => (0.28 + rand() * 0.3) * (1 - 0.3 * Math.min(1, (r - 8) / 30));
  sectors(tuft1, TOUCH ? 5000 : 11000, 7.5, 35, 12, hAt, () => 0.9 + rand() * 0.7);
  sectors(tuft2, TOUCH ? 9000 : 24000, 34, 130, 16, () => 0.4 + rand() * 0.35, r => 1.6 + rand() * 1.2 + r * 0.012);

  // LOD1a — real grass clumps (Poly Haven grass_medium_02, CC0) from 4.5 m to 22 m
  new GLTFLoader().load('images/sunflower/grass_medium_02/grass_medium_02_1k.gltf', gltf => {
    const parts = [];
    gltf.scene.updateMatrixWorld(true);
    gltf.scene.traverse(o => { if (o.isMesh) parts.push(o.geometry.clone().applyMatrix4(o.matrixWorld)); });
    parts.sort((a, b) => a.attributes.position.count - b.attributes.position.count);
    const variants = parts.slice(0, 2);                         // the two lightest clumps
    const src = gltf.scene.getObjectByProperty('isMesh', true).material;
    const alpha = new THREE.TextureLoader().load('images/sunflower/grass_medium_02/textures/grass_medium_02_alpha_1k.png');
    const mat = addWind(addTranslucency(new THREE.MeshStandardMaterial({
      map: src.map, normalMap: src.normalMap, alphaMap: alpha, alphaTest: 0.45, roughness: 0.75, color: 0x9bbd78, side: THREE.DoubleSide }), 0.22, 4));
    variants.forEach((g, vi) => {
      g.computeBoundingBox(); const b = g.boundingBox, h = b.max.y - b.min.y;
      g.translate(-(b.min.x + b.max.x) / 2, -b.min.y, -(b.min.z + b.max.z) / 2); g.scale(1 / h, 1 / h, 1 / h);
      const N = 12, per = Math.round((TOUCH ? 700 : 2000) / 2 / N);
      for (let s = 0; s < N; s++) {
        const m = new THREE.InstancedMesh(g, mat, per);
        for (let i = 0; i < per; i++) {
          const a = (s + rand()) / N * Math.PI * 2, r = Math.sqrt(4.5 * 4.5 + rand() * (22 * 22 - 4.5 * 4.5)), sc = 0.4 + rand() * 0.5;
          dummy.position.set(Math.cos(a) * r, 0, Math.sin(a) * r); dummy.rotation.set(0, rand() * 6.283, 0); dummy.scale.setScalar(sc);
          dummy.updateMatrix(); m.setMatrixAt(i, dummy.matrix); m.setColorAt(i, tint());
        }
        m.computeBoundingSphere(); m.boundingSphere.radius += 1.5; scene.add(m);
      }
    });
  }, undefined, e => console.warn('Grass model unavailable, using tufts only.', e));
}


// ======================= Fireflies (dusk → night) =======================
const fireflyU = { uTime: { value: 0 }, uAmt: { value: 0 }, uPx: { value: 1 } };
{
  const n = TOUCH ? 90 : 170, base = new Float32Array(n * 3), seed = new Float32Array(n * 4);
  for (let i = 0; i < n; i++) {
    const a = rand() * 6.283, r = 1.2 + Math.sqrt(rand()) * 9;
    base.set([Math.cos(a) * r, 0.2 + rand() * 1.9, Math.sin(a) * r], i * 3);
    seed.set([rand(), rand(), rand(), rand()], i * 4);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(base, 3)); g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 4));
  const m = new THREE.ShaderMaterial({
    uniforms: fireflyU, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `
      uniform float uTime, uAmt, uPx; attribute vec4 aSeed; varying float vA;
      void main() {
        vec3 p = position;
        p.x += sin(uTime * (0.25 + aSeed.x * 0.3) + aSeed.y * 6.283) * 0.7 + sin(uTime * 0.9 + aSeed.w * 9.0) * 0.08;
        p.y += sin(uTime * (0.35 + aSeed.z * 0.3) + aSeed.x * 9.0) * 0.3;
        p.z += cos(uTime * (0.22 + aSeed.w * 0.3) + aSeed.z * 6.283) * 0.7;
        float blink = pow(0.5 + 0.5 * sin(uTime * (0.7 + aSeed.x * 0.8) + aSeed.w * 40.0), 4.0);
        vA = (0.12 + 0.88 * blink) * uAmt;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = clamp((7.0 + 14.0 * blink) * uPx / -mv.z, 2.0, 60.0);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      varying float vA;
      void main() {
        float d = length(gl_PointCoord - 0.5) * 2.0;
        float a = pow(max(1.0 - d, 0.0), 2.2);
        gl_FragColor = vec4(vec3(0.85, 1.0, 0.35) * 3.0 * a * vA, a * vA);
      }`,
  });
  const pts = new THREE.Points(g, m); pts.frustumCulled = false; scene.add(pts);
}
// ======================= Ground (CC0 Poly Haven sparse_grass, kept in images/sunflower/) =======================
const groundBase = new THREE.Color(0x56733a), groundTint = new THREE.Color(1.3, 1.5, 0.95);
const groundMat = new THREE.MeshStandardMaterial({ color: groundBase, roughness: 1 });
// The texture tiles 800×; blend two differently scaled/rotated samples with a slow noise so no grid shows, and fade to
// the texture's average colour with distance.
groundMat.onBeforeCompile = sh => {
  sh.fragmentShader = sh.fragmentShader.replace('#include <map_fragment>', `
    #ifdef USE_MAP
      vec2 uvB = mat2(0.8, -0.6, 0.6, 0.8) * vMapUv * 0.23 + vec2(0.37, 0.61);
      float wv = smoothstep(0.25, 0.75, 0.5 + 0.5 * sin(vMapUv.x * 0.031 + sin(vMapUv.y * 0.023) * 2.0) * sin(vMapUv.y * 0.027 + 1.3));
      vec4 gtex = mix(texture2D(map, vMapUv), texture2D(map, uvB), wv);
      gtex.rgb = mix(gtex.rgb, vec3(0.19, 0.29, 0.07), smoothstep(12.0, 90.0, length(vViewPosition)));
      diffuseColor *= gtex;
    #endif`);
};
const ground = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000).rotateX(-Math.PI / 2), groundMat);
ground.receiveShadow = true; scene.add(ground);
{
  const loader = new THREE.TextureLoader();
  const get = (f, srgb) => new Promise((res, rej) => loader.load(`images/sunflower/sparse_grass_${f}_1k.jpg`, t => {
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(1000, 1000); t.anisotropy = renderer.capabilities.getMaxAnisotropy();
    t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace; res(t);
  }, undefined, rej));
  Promise.all([get('diff', true), get('rough', false), get('nor_gl', false)]).then(([d, r, n]) => {
    Object.assign(groundMat, { map: d, roughnessMap: r, normalMap: n }); groundBase.copy(groundTint); groundMat.needsUpdate = true;
  }).catch(e => console.warn('Ground textures unavailable, using plain colour.', e));
}

// ======================= Sun maths =======================
function sunPos(date, lat, lng) {
  const d = date.valueOf() / 86400000 - 0.5 + 2440588 - 2451545;
  const M = RAD * (357.5291 + 0.98560028 * d);
  const C = RAD * (1.9148 * Math.sin(M) + 0.02 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M));
  const L = M + C + RAD * 102.9372 + Math.PI, e = RAD * 23.4397;
  const dec = Math.asin(Math.sin(e) * Math.sin(L)), ra = Math.atan2(Math.sin(L) * Math.cos(e), Math.cos(L));
  const H = RAD * (280.16 + 360.9856235 * d) - RAD * -lng - ra, phi = RAD * lat;
  const alt = Math.asin(Math.sin(phi) * Math.sin(dec) + Math.cos(phi) * Math.cos(dec) * Math.cos(H));
  const azS = Math.atan2(Math.sin(H), Math.cos(H) * Math.sin(phi) - Math.tan(dec) * Math.cos(phi));
  return { az: ((azS / RAD + 180) % 360 + 360) % 360, alt: alt / RAD };
}
// world: +X east, +Y up, -Z north
const dirFrom = (az, alt) => new THREE.Vector3(Math.sin(az * RAD) * Math.cos(alt * RAD), Math.sin(alt * RAD), -Math.cos(az * RAD) * Math.cos(alt * RAD));

// ======================= Location + compass =======================
const $ = id => document.getElementById(id);
let loc = { lat: 28.6139, lng: 77.2090, real: false };
let heading = 200, headingSmooth = 200, devPitch = 0, pitchSmooth = 0, haveCompass = false;
function compassHeading(a, b, g) {      // direction the back of the device points, tilt-compensated
  const z = a * RAD, x = b * RAD, y = g * RAD, cY = Math.cos(y), cZ = Math.cos(z), sX = Math.sin(x), sY = Math.sin(y), sZ = Math.sin(z);
  const Vx = -cZ * sY - sZ * sX * cY, Vy = -sZ * sY + cZ * sX * cY;
  return ((Math.atan2(Vx, Vy) / RAD) + 360) % 360;
}
let relOffset = null, gotMotion = false;
function onOrient(e) {
  if (e.beta == null) return;
  let h = null;
  if (typeof e.webkitCompassHeading === 'number') h = e.webkitCompassHeading;                     // iOS: true compass
  else if (e.absolute && e.alpha != null) h = compassHeading(e.alpha, e.beta, e.gamma);          // Android: absolute compass
  else if (e.alpha != null) {                                                                    // no compass: rotation relative to where the phone started
    const r = compassHeading(e.alpha, e.beta, e.gamma);
    if (relOffset == null) relOffset = ((heading - r) % 360 + 360) % 360;
    h = (r + relOffset) % 360;
  }
  if (h == null) return;
  heading = h; haveCompass = true; gotMotion = true;
  // elevation of the back-of-device direction: 0 when held upright, up when the top tilts toward the sky
  devPitch = Math.asin(clamp(-Math.cos(e.beta * RAD) * Math.cos((e.gamma || 0) * RAD), -1, 1));
}
function listen() { addEventListener('deviceorientationabsolute', onOrient, true); addEventListener('deviceorientation', onOrient, true); }
listen();

const placeName = $('locInfo');
async function nameThePlace(lat, lng) {
  try {
    const r = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`);
    const j = await r.json(); const n = [j.city || j.locality, j.countryName].filter(Boolean).join(', ');
    if (n) loc.name = n;
  } catch (_) {}
}
// Location, best source first: GPS → IP lookup (only if it agrees with the clock's timezone) → timezone alone.
// The sun's position depends on the exact instant plus latitude/longitude, so even a rough estimate is close for hours-level sun angles.
const TZ_CITY = { 'Asia/Kolkata': [28.61, 77.21, 'India'], 'Asia/Calcutta': [28.61, 77.21, 'India'], 'Asia/Dubai': [25.2, 55.27, 'Dubai'], 'Asia/Singapore': [1.35, 103.82, 'Singapore'],
  'Asia/Tokyo': [35.68, 139.69, 'Tokyo'], 'Asia/Shanghai': [31.23, 121.47, 'China'], 'Asia/Karachi': [24.86, 67.0, 'Karachi'], 'Asia/Dhaka': [23.81, 90.41, 'Dhaka'],
  'Europe/London': [51.5, -0.12, 'London'], 'Europe/Paris': [48.86, 2.35, 'Paris'], 'Europe/Berlin': [52.52, 13.4, 'Berlin'], 'Europe/Madrid': [40.42, -3.7, 'Madrid'],
  'Europe/Moscow': [55.75, 37.62, 'Moscow'], 'America/New_York': [40.71, -74.0, 'New York'], 'America/Chicago': [41.88, -87.63, 'Chicago'], 'America/Denver': [39.74, -104.99, 'Denver'],
  'America/Los_Angeles': [34.05, -118.24, 'Los Angeles'], 'America/Sao_Paulo': [-23.55, -46.63, 'São Paulo'], 'Australia/Sydney': [-33.87, 151.21, 'Sydney'],
  'Africa/Cairo': [30.04, 31.24, 'Cairo'], 'Africa/Lagos': [6.52, 3.38, 'Lagos'], 'Africa/Johannesburg': [-26.2, 28.05, 'Johannesburg'], 'Pacific/Auckland': [-36.85, 174.76, 'Auckland'] };
const REGION_LAT = { Europe: 49, America: 30, Asia: 25, Africa: 5, Australia: -30, Pacific: -15, Atlantic: 30, Indian: -10 };
const tzLng = () => Math.max(-180, Math.min(180, -new Date().getTimezoneOffset() / 60 * 15));   // each hour of UTC offset ≈ 15° of longitude
function estimateFromTimezone() {
  let tz = ''; try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (_) {}
  const c = TZ_CITY[tz];
  if (c) return { lat: c[0], lng: c[1], name: c[2] };
  return { lat: REGION_LAT[tz.split('/')[0]] ?? 25, lng: tzLng(), name: tz.split('/').pop().replace(/_/g, ' ') || 'Estimated' };
}
{ const e = estimateFromTimezone(); loc = { lat: e.lat, lng: e.lng, real: false, approx: true, name: e.name }; }
async function refineFromIp() {
  try {
    const j = await (await fetch('https://ipwho.is/?fields=success,latitude,longitude,city,country', { cache: 'no-store' })).json();
    if (!j.success || loc.real) return;
    // a VPN or a wrong database entry puts the IP far from the timezone the clock says; then keep the timezone estimate
    const dLng = Math.abs(((j.longitude - tzLng() + 540) % 360) - 180);
    if (dLng > 35) return;
    loc = { lat: j.latitude, lng: j.longitude, real: false, approx: true, name: [j.city, j.country].filter(Boolean).join(', ') };
  } catch (_) {}
}
refineFromIp();
// GPS overrides the estimates as soon as it is allowed and available.
navigator.geolocation?.watchPosition(p => {
  const first = !loc.real;
  loc = { lat: p.coords.latitude, lng: p.coords.longitude, real: true, name: first ? '' : loc.name };
  if (first) nameThePlace(loc.lat, loc.lng);
}, () => {}, { maximumAge: 60000, timeout: 20000 });
// iOS only hands out motion data after a permission prompt, and Safari only allows that from a real tap (click / touchend),
// so the first tap on the scene asks for it. Android needs no permission.
const needsMotionPermission = typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function';
let motionDenied = false, asking = false;
async function askMotion() {
  if (!needsMotionPermission || gotMotion || asking) return;
  asking = true;
  try {
    if ((await DeviceOrientationEvent.requestPermission()) === 'granted') { listen(); removeEventListener('click', askMotion, true); removeEventListener('touchend', askMotion, true); }
    else motionDenied = true;
  } catch (_) { motionDenied = true; }
  asking = false;
}
if (needsMotionPermission) { addEventListener('click', askMotion, true); addEventListener('touchend', askMotion, true); }

// drag = look around, pinch / wheel = zoom. With a compass the view springs back to the true heading on release;
// without one there is no "correct" heading, so drags stick (the reset button undoes them).
let dragging = false, lastX = 0, lastY = 0, userYaw = 0, userPitch = 0, releasedAt = 0, zoom = 1, pinchD = 0;
let initHeading = 0; const ptrs = new Map(), cv = renderer.domElement;
const pinchDist = () => { const [a, b] = [...ptrs.values()]; return Math.hypot(a.x - b.x, a.y - b.y); };
cv.addEventListener('pointerdown', e => {
  if (!needsMotionPermission || gotMotion) $('hint').style.opacity = 0;
  cv.setPointerCapture(e.pointerId); ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (ptrs.size === 2) { dragging = false; pinchD = pinchDist(); }
  else { dragging = true; lastX = e.clientX; lastY = e.clientY; }
});
const endPtr = e => {
  ptrs.delete(e.pointerId); pinchD = 0;
  if (ptrs.size === 1) { const p = [...ptrs.values()][0]; dragging = true; lastX = p.x; lastY = p.y; }
  else if (dragging) { dragging = false; releasedAt = performance.now(); }
};
cv.addEventListener('pointerup', endPtr); cv.addEventListener('pointercancel', endPtr);
cv.addEventListener('pointermove', e => {
  if (!ptrs.has(e.pointerId)) return;
  ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (ptrs.size === 2) {
    const d = pinchDist(); if (pinchD > 0) zoom = clamp(zoom * d / pinchD, 0.55, 3); pinchD = d; return;
  }
  if (!dragging) return;
  const dx = e.clientX - lastX, dy = e.clientY - lastY; lastX = e.clientX; lastY = e.clientY;
  if (haveCompass) { userYaw -= dx * 0.3; userPitch = clamp(userPitch + dy * 0.004, -0.5, 0.5); }
  else { heading = (heading - dx * 0.3 + 360) % 360; userPitch = clamp(userPitch + dy * 0.004, -0.6, 1.2); }
});
cv.addEventListener('wheel', e => { e.preventDefault(); zoom = clamp(zoom * Math.exp(-e.deltaY * 0.0015), 0.55, 3); }, { passive: false });
$('reset').onclick = () => { zoom = 1; userYaw = userPitch = 0; if (!haveCompass) heading = initHeading; };

// ======================= Time of day =======================
// Always the viewer's clock. ?t=HH:MM (for screenshots / sharing) pins the page to that local time instead.
const clockEl = $('clock');
const pinned = /^(\d{1,2}):(\d{2})$/.exec(new URLSearchParams(location.search).get('t') || '');
function currentDate() {
  const d = new Date();
  if (pinned) d.setHours(clamp(+pinned[1], 0, 23), clamp(+pinned[2], 0, 59), 0, 0);
  return d;
}

// ======================= Loop =======================
const headQ = new THREE.Quaternion(), targetQ = new THREE.Quaternion(), zAxis = new THREE.Vector3(0, 0, 1);
const s00 = sunPos(currentDate(), loc.lat, loc.lng);
let droop = smooth(0, -8, s00.alt);
buildStem(0.12 + droop * 2.7); setWilt(droop); setLeafDroop(droop);
{   // start already facing the sun (or hanging, at night) instead of swinging round on load
  const face = s00.alt > -3 ? dirFrom(s00.az, Math.max(s00.alt, 4)) : dirFrom(90, 6);
  headPivot.quaternion.setFromUnitVectors(zAxis, face.lerp(neckTangent(stemPhi, new THREE.Vector3()), droop).normalize());
}

const tmpV = new THREE.Vector3(), fogC = new THREE.Color(), warmC = new THREE.Color(1, 0.62, 0.38), nightFog = new THREE.Color(0.05, 0.065, 0.11);
const lookDir = new THREE.Vector3(), sunCol = new THREE.Color();
const fmt2 = n => String(n).padStart(2, '0');
const fx = createFilmPipeline(renderer, scene, camera, { level: 'low' });   // fixed, very light film look
fx.resize(innerWidth, innerHeight);
window.sunflowerFx = fx;       // console: sunflowerFx.params.grainAmount = 0.08, …
// Ambient sound: on by default, starts at the first touch/click (browsers require a gesture). The choice is remembered.
const amb = createAmbience(), soundBtn = $('sound');
let wantSound = true;
try { wantSound = localStorage.getItem('sunflower-sound') !== '0'; } catch (_) {}
const paintSound = () => { soundBtn.setAttribute('aria-pressed', wantSound); soundBtn.classList.toggle('off', !wantSound); soundBtn.setAttribute('aria-label', wantSound ? 'Sound on' : 'Sound off'); };
paintSound();
soundBtn.onclick = e => { e.stopPropagation(); wantSound = !wantSound; try { localStorage.setItem('sunflower-sound', wantSound ? '1' : '0'); } catch (_) {} paintSound(); amb.setEnabled(wantSound); };
if (wantSound) addEventListener('pointerdown', function first(e) { if (e.target === soundBtn || soundBtn.contains(e.target)) return; removeEventListener('pointerdown', first, true); if (wantSound && !amb.enabled) amb.setEnabled(true); }, true);
let lastT = 0, lastUi = 0, first = true;
{ const s0 = sunPos(currentDate(), loc.lat, loc.lng); heading = headingSmooth = initHeading = (s0.az + 180 + 30) % 360; }   // start with the flower's face toward us
function frame(t) {
  const dt = Math.min(0.1, (t - lastT) / 1000); lastT = t;
  const date = currentDate();
  const s = sunPos(date, loc.lat, loc.lng);
  const sunDir = dirFrom(s.az, s.alt);
  const day = smooth(-4, 12, s.alt), warm = 1 - smooth(4, 25, s.alt), sunUp = smooth(-1, 10, s.alt);

  refreshSky(sunDir, s.az, s.alt, first); first = false;

  // lights follow the real sun
  sunLight.position.copy(sunDir).multiplyScalar(30).add(sunLight.target.position);
  sunLight.intensity = 3.0 * sunUp;
  sunLight.color.setRGB(1, 0.95 - 0.35 * warm, 0.88 - 0.6 * warm);
  hemi.intensity = 0.2 + 0.3 * day;
  ambient.intensity = 0.1 + 0.3 * (1 - day);
  scene.environmentIntensity = 0.5 + 0.6 * day;
  scene.backgroundIntensity = 0.05 + 0.95 * smooth(-16, -3, s.alt);
  renderer.toneMappingExposure = 0.36 + 0.5 * (1 - day);
  fogC.setRGB(0.62, 0.74, 0.88).lerp(warmC, warm * day * 0.55).multiplyScalar(0.75).lerp(nightFog, 1 - day);
  scene.fog.color.copy(fogC);
  groundMat.color.copy(groundBase).multiplyScalar(0.55 + 0.45 * day);
  stars.material.opacity = smooth(-3, -14, s.alt);
  grassTime.value = t * 0.001;
  fireflyU.uTime.value = t * 0.001; fireflyU.uAmt.value = smooth(4, -5, s.alt); fireflyU.uPx.value = innerHeight * renderer.getPixelRatio() * 0.35;
  amb.update(day, t * 0.001);

  // heliotropism by day; at night the neck bends over and the head hangs, petals wilting
  const droopTarget = smooth(0, -8, s.alt);
  droop += (droopTarget - droop) * (1 - Math.exp(-dt * 0.9));
  const phi = 0.12 + droop * 2.7;
  if (Math.abs(phi - stemPhi) > 0.004) { buildStem(phi); setWilt(droop); setLeafDroop(droop); }
  const sunFace = s.alt > -3 ? dirFrom(s.az, Math.max(s.alt, 4)) : dirFrom(90, 6);
  const target = sunFace.lerp(neckTangent(phi, tmpV), droop).normalize();
  targetQ.setFromUnitVectors(zAxis, target);
  headPivot.quaternion.slerp(targetQ, 1 - Math.exp(-dt * 2.5));
  headPivot.rotation.z += Math.sin(t * 0.0013) * 0.0008;

  // camera: stands a few metres from the plant and looks where the phone points
  const dh = ((heading - headingSmooth + 540) % 360) - 180; headingSmooth = (headingSmooth + dh * 0.15 + 360) % 360;
  pitchSmooth += ((haveCompass ? devPitch : 0) - pitchSmooth) * 0.15;
  if (!dragging && haveCompass && performance.now() - releasedAt > 350) {          // recorrect after letting go
    const k = 1 - Math.exp(-dt * 3);
    userYaw -= userYaw * k; userPitch -= userPitch * k;
    if (Math.abs(userYaw) < 0.05) userYaw = 0;
  }
  const hr = (headingSmooth + userYaw) * RAD, dist = 2.35 / Math.min(1, Math.pow(camera.aspect, 0.5)) / zoom;
  const el = 0.2 + pitchSmooth + userPitch;
  camera.position.set(-Math.sin(hr) * dist, 1.15, Math.cos(hr) * dist);
  lookDir.set(Math.sin(hr) * Math.cos(el), Math.sin(el), -Math.cos(hr) * Math.cos(el));
  camera.lookAt(tmpV.copy(camera.position).add(lookDir));
  camera.updateMatrixWorld();

  // translucency uniforms (sun direction in view space, sun colour × strength)
  sunView.value.copy(sunDir).transformDirection(camera.matrixWorldInverse);
  sunGlow.value.copy(sunLight.color).multiplyScalar(sunLight.intensity * 0.22);

  if (t - lastUi > 250) {
    lastUi = t;
    placeName.textContent = loc.real ? (loc.name || 'Your location') : (loc.name ? loc.name + ' (approx.)' : 'Locating…');
    clockEl.textContent = `${fmt2(date.getHours())}:${fmt2(date.getMinutes())}`;
    $('hint').textContent = needsMotionPermission && !gotMotion ? (motionDenied ? 'Motion is blocked: enable it in Settings > Safari > Motion & Orientation' : 'Tap anywhere to turn the scene with your phone') : haveCompass ? 'Move your phone around to see every side · pinch to zoom' : 'Drag to look · pinch or scroll to zoom';
  }
  if (fx.enabled) fx.render(t, renderer.toneMappingExposure); else renderer.render(scene, camera);
  if (first === false && !frame.shown) { frame.shown = true; $('loading').classList.add('done'); }
  requestAnimationFrame(frame);
}
addEventListener('resize', () => { renderer.setSize(innerWidth, innerHeight); fx.resize(innerWidth, innerHeight); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); });
camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
requestAnimationFrame(frame);
