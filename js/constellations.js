// Constellations — full-screen WebGL particle experiments (Three.js r128, loaded from cdnjs
// by constellations.html). One page, two versions, picked with the V1 / V2 switch:
//   V1 (?v=1) — the original particle field: click to gather shapes, black-hole cursor,
//               right-drag orbit, Rotation speed / Cursor radius sliders.     -> runV1()
//   V2 (default) — the spacecraft: fly through a course of loops (or a particle tube),
//               Manual / Auto-cruise, loop-driven speed, Shift boost.         -> runV2()
// Only the chosen version runs; switching sets ?v= and reloads. In both, all particle
// physics runs on the GPU: positions/velocities live in float textures updated by two
// full-screen shader passes per frame. See reference/constellations-page.md.
(function(){
  "use strict";

  var canvas = document.getElementById('scene');
  var fallback = document.getElementById('fallback');
  // the tiny inline script in <head> already set <html class="v1|v2"> from ?v= (so the right
  // controls show from the first paint); read it back here
  var VERSION = document.documentElement.classList.contains('v1') ? 1 : 2;

  function showFallback(html){
    fallback.style.display = 'flex';
    canvas.style.display = 'none';
    document.querySelectorAll('.v1-only, .v2-only').forEach(function(el){ el.style.display = 'none'; });
    if (html) fallback.querySelector('div').innerHTML = html;
  }

  // V1 / V2 switch: remember the choice in the URL (?v=1 for V1, nothing for V2) and reload
  document.querySelectorAll('[data-version]').forEach(function(btn){
    var v = parseInt(btn.getAttribute('data-version'), 10);
    btn.classList.toggle('on', v === VERSION);
    btn.setAttribute('aria-pressed', v === VERSION ? 'true' : 'false');
    btn.addEventListener('click', function(){
      if (v === VERSION) return;
      var url = new URL(window.location.href);
      if (v === 1) url.searchParams.set('v', '1'); else url.searchParams.delete('v');
      window.location.assign(url.toString());
    });
  });

  if (typeof THREE === 'undefined') {
    showFallback();
  } else {
    try { if (VERSION === 1) runV1(); else runV2(); }
    catch (e) {
      console.error(e);
      showFallback('<strong>Something went wrong loading the scene.</strong><br>Try reloading the page.');
    }
  }

  // ======================================================================================
  //  V1 — the original particle field
  // ======================================================================================
  function runV1(){
    var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var isSmall = window.innerWidth < 620;

    // ---------- particle budget ----------
    // Physics lives in GPU textures: one texel per particle, SIM_SIZE^2 particles.
    // The particles fill a big cube (FIELD_HALF) that the camera always stays inside, so the
    // screen is filled from every orbit angle and zoom level. 1024 -> 1M particles.
    // Override with ?n=512 etc.
    var params = new URLSearchParams(window.location.search);
    var SIM_SIZE = parseInt(params.get('n'), 10) || (isSmall ? 512 : 1024);
    SIM_SIZE = Math.max(32, Math.min(SIM_SIZE, 2048));
    var PARTICLE_COUNT = SIM_SIZE * SIM_SIZE;
    // the particles nearest the click (in 3D, as seen from the camera) gather into the shape,
    // draining a visible pocket around it
    var SHAPE_PARTICLES = Math.min(Math.round(PARTICLE_COUNT * 0.03), isSmall ? 8000 : 20000);

    // ---------- tuning knobs ----------
    var CAM_DIST       = 9.5;                                  // starting orbit distance
    var ZOOM_MIN       = 3, ZOOM_MAX = 22;                     // orbit distance limits (camera stays inside the field)
    var FIELD_HALF     = isSmall ? 20 : 24;                    // particle cube half-size (wraps on all axes)
    var WANDER_SPEED   = prefersReducedMotion ? 0.003 : 0.007; // each particle's own random drift, units/frame (x rotation-speed slider)
    var FLOW_RESPONSE  = 0.08;                                 // how quickly free particles settle back into their wander
    var SEEK_SPEED     = 0.16;                                 // max speed while streaming toward the shape (far ones travel fast, then ease in)
    var SEEK_RESPONSE  = 0.1;                                  // steering responsiveness while seeking
    var ARRIVE         = 0.06;                                 // slow-down gain near the target (spring-like)
    var FORM_STAGGER   = 1.4;                                  // seconds between nearest and farthest particle setting off
    var BURST_STRENGTH = prefersReducedMotion ? 0.01 : 0.03;   // small outward nudge when the shape is released
    var DISPERSE_SPEED = prefersReducedMotion ? 0.02 : 0.045;  // max glide speed while dispersing
    var DISPERSE_RESPONSE = 0.03;                              // steering while dispersing (low = soft, drifting turns)
    var DISPERSE_FADE  = 0.005;                                // per-frame rate a dispersing particle hands back to the flow (~3s)
    var BH_HORIZON     = 0.14;                                 // event horizon, as a fraction of the cursor radius
    var SHAPE_SCALE    = 0.6;                                  // shapes are ~1.5 units radius; this makes them "small"
    var POINT_SIZE     = isSmall ? 0.045 : 0.035;              // world-space sprite size
    var CLUSTER_SEEK   = 0.05;                                 // autonomous clusters gather more lazily than a clicked shape
    var CLUSTER_STAGGER = 2.5;                                 // seconds over which a cluster's particles set off
    var METEOR_MAX     = 3;                                    // shooting stars on screen at once
    var BH_PULL        = 0.004;                                // black-hole radial pull (low = slow, gentle)
    var BH_SWIRL       = 0.007;                                // black-hole orbital swirl (slow circling)

    // ---------- renderer / scene / camera ----------
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x05060a, 1);

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(50, 1, 0.1, 150);
    camera.position.set(0, 0, CAM_DIST);

    // ---------- float render target support ----------
    var gl = renderer.getContext();
    if (renderer.capabilities.isWebGL2) {
      renderer.extensions.get('EXT_color_buffer_float');
    } else {
      renderer.extensions.get('OES_texture_float');
      renderer.extensions.get('OES_texture_half_float');
      renderer.extensions.get('WEBGL_color_buffer_float');
    }
    function makeRT(type){
      return new THREE.WebGLRenderTarget(SIM_SIZE, SIM_SIZE, {
        minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter,
        wrapS: THREE.ClampToEdgeWrapping, wrapT: THREE.ClampToEdgeWrapping,
        format: THREE.RGBAFormat, type: type,
        depthBuffer: false, stencilBuffer: false
      });
    }
    function pickSimType(){
      var candidates = [THREE.FloatType, THREE.HalfFloatType];
      for (var i = 0; i < candidates.length; i++){
        var rt = makeRT(candidates[i]);
        renderer.setRenderTarget(rt);
        var ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
        renderer.setRenderTarget(null);
        rt.dispose();
        if (ok) return candidates[i];
      }
      return null;
    }
    var SIM_TYPE = pickSimType();
    if (SIM_TYPE === null){
      showFallback('<strong>This GPU can\'t render to float textures.</strong><br>Constellations\' GPU physics needs them &mdash; try a different browser or device.');
      return;
    }

    // ---------- sizing / bounds ----------
    var tanHalfFov = Math.tan(camera.fov * Math.PI / 360);
    // world cube the free particles live (and wrap) in; bigger than the max zoom distance,
    // so the camera is always inside the cloud and every direction is filled
    var bounds = new THREE.Vector3(FIELD_HALF, FIELD_HALF, FIELD_HALF);
    var pointScale = 1;
    var renderUniforms = null;

    function sizeToWindow(){
      var w = window.innerWidth, h = window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      pointScale = (h * renderer.getPixelRatio()) / (2 * tanHalfFov);
      if (renderUniforms) renderUniforms.uScale.value = pointScale;
    }
    sizeToWindow();

    // ---------- faint starfield backdrop (a full sphere, so every orbit angle has one) ----------
    (function makeStars(){
      var starCount = isSmall ? 500 : 900;
      var pos = new Float32Array(starCount * 3);
      for (var i = 0; i < starCount; i++){
        var r = 70 + Math.random() * 50;
        var theta = Math.random() * Math.PI * 2;
        var phi = Math.acos(2 * Math.random() - 1);
        pos[i*3]   = r * Math.sin(phi) * Math.cos(theta);
        pos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
        pos[i*3+2] = r * Math.cos(phi);
      }
      var g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      var m = new THREE.PointsMaterial({ color: 0x8891a8, size: 0.14, sizeAttenuation: true, transparent: true, opacity: 0.5 });
      scene.add(new THREE.Points(g, m));
    })();

    // ---------- surface sampling (area-weighted, works for any geometry) ----------
    var _vA = new THREE.Vector3(), _vB = new THREE.Vector3(), _vC = new THREE.Vector3();
    function sampleSurface(geometry, count){
      var nonIndexed = geometry.index ? geometry.toNonIndexed() : geometry;
      var pos = nonIndexed.attributes.position;
      var triCount = Math.floor(pos.count / 3);
      var areas = new Float64Array(triCount);
      var total = 0;
      for (var i = 0; i < triCount; i++){
        _vA.fromBufferAttribute(pos, i*3);
        _vB.fromBufferAttribute(pos, i*3+1);
        _vC.fromBufferAttribute(pos, i*3+2);
        var area = new THREE.Triangle(_vA, _vB, _vC).getArea();
        areas[i] = area;
        total += area;
      }
      var cumulative = new Float64Array(triCount);
      var acc = 0;
      for (i = 0; i < triCount; i++){ acc += areas[i]; cumulative[i] = acc; }

      var out = new Float32Array(count * 3);
      for (i = 0; i < count; i++){
        var r = Math.random() * total;
        var lo = 0, hi = triCount - 1;
        while (lo < hi){
          var mid = (lo + hi) >> 1;
          if (cumulative[mid] < r) lo = mid + 1; else hi = mid;
        }
        _vA.fromBufferAttribute(pos, lo*3);
        _vB.fromBufferAttribute(pos, lo*3+1);
        _vC.fromBufferAttribute(pos, lo*3+2);
        var u = Math.random(), v = Math.random();
        if (u + v > 1){ u = 1 - u; v = 1 - v; }
        out[i*3]   = _vA.x + u * (_vB.x - _vA.x) + v * (_vC.x - _vA.x);
        out[i*3+1] = _vA.y + u * (_vB.y - _vA.y) + v * (_vC.y - _vA.y);
        out[i*3+2] = _vA.z + u * (_vB.z - _vA.z) + v * (_vC.z - _vA.z);
      }
      if (nonIndexed !== geometry) nonIndexed.dispose();
      return out;
    }

    // ---------- shape library ----------
    var shapes = [
      { name: 'Sphere',        make: function(){ return new THREE.SphereGeometry(1.5, 64, 48); } },
      { name: 'Icosahedron',   make: function(){ return new THREE.IcosahedronGeometry(1.7, 3); } },
      { name: 'Torus',         make: function(){ return new THREE.TorusGeometry(1.2, 0.48, 32, 96); } },
      { name: 'Torus Knot',    make: function(){ return new THREE.TorusKnotGeometry(0.92, 0.32, 260, 32); } },
      { name: 'Dodecahedron',  make: function(){ return new THREE.DodecahedronGeometry(1.65, 2); } },
      { name: 'Cube',          make: function(){ return new THREE.BoxGeometry(2.15, 2.15, 2.15, 6, 6, 6); } },
      { name: 'Octahedron',    make: function(){ return new THREE.OctahedronGeometry(1.8, 2); } }
    ];

    // ---------- initial GPU data ----------
    function floatTex(data){
      var t = new THREE.DataTexture(data, SIM_SIZE, SIM_SIZE, THREE.RGBAFormat, THREE.FloatType);
      t.minFilter = THREE.NearestFilter;
      t.magFilter = THREE.NearestFilter;
      t.needsUpdate = true;
      return t;
    }

    var initPos  = new Float32Array(PARTICLE_COUNT * 4);
    var initVel  = new Float32Array(PARTICLE_COUNT * 4);
    var seedData = new Float32Array(PARTICLE_COUNT * 4);
    var targetData = new Float32Array(PARTICLE_COUNT * 4);

    for (var i = 0; i < PARTICLE_COUNT; i++){
      var k = i * 4;
      initPos[k]   = (Math.random() * 2 - 1) * bounds.x;
      initPos[k+1] = (Math.random() * 2 - 1) * bounds.y;
      initPos[k+2] = (Math.random() * 2 - 1) * bounds.z;
      initPos[k+3] = 0;                   // w = cluster slot the particle belongs to (0 = none)
      seedData[k]   = Math.random();      // speed variety
      seedData[k+1] = 0;                  // 1 = part of the current shape (chosen per click)
      seedData[k+2] = Math.random();      // phase / color pick
      seedData[k+3] = Math.random();      // size / burst variety
    }

    var seedTex = floatTex(seedData);
    var targetTex = floatTex(targetData);  // xyz = local shape offset, w = departure order (0 = nearest)

    // ---------- GPGPU ping-pong setup ----------
    var simScene = new THREE.Scene();
    var simCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    var simMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2));
    simMesh.frustumCulled = false;
    simScene.add(simMesh);

    var SIM_VERT = [
      'varying vec2 vUv;',
      'void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }'
    ].join('\n');

    function simMaterial(uniforms, frag){
      return new THREE.ShaderMaterial({
        uniforms: uniforms, vertexShader: SIM_VERT, fragmentShader: frag,
        depthTest: false, depthWrite: false
      });
    }

    var copyMat = simMaterial({ tSrc: { value: null } }, [
      'uniform sampler2D tSrc; varying vec2 vUv;',
      'void main(){ gl_FragColor = texture2D(tSrc, vUv); }'
    ].join('\n'));

    var posRT = [makeRT(SIM_TYPE), makeRT(SIM_TYPE)];
    var velRT = [makeRT(SIM_TYPE), makeRT(SIM_TYPE)];
    var cur = 0;

    function blit(srcTex, rt){
      copyMat.uniforms.tSrc.value = srcTex;
      simMesh.material = copyMat;
      renderer.setRenderTarget(rt);
      renderer.render(simScene, simCam);
    }
    (function seedTargets(){
      var p0 = floatTex(initPos), v0 = floatTex(initVel);
      blit(p0, posRT[0]); blit(p0, posRT[1]);
      blit(v0, velRT[0]); blit(v0, velRT[1]);
      renderer.setRenderTarget(null);
      p0.dispose(); v0.dispose();
      initPos = initVel = null;
    })();

    // shared uniforms (same objects in both passes)
    var uDt = { value: 1 };
    var uTime = { value: 0 };
    var uMode = { value: 0 };
    var uBounds = { value: bounds };
    // black hole = a cone from the camera through the cursor, so it covers the same
    // on-screen disc at every depth. uBHTan = radius / distance along the ray.
    var uBHOrigin = { value: new THREE.Vector3() };
    var uBHDir = { value: new THREE.Vector3(0, 0, -1) };
    var uBHTan = { value: 0 };
    var uBHOn = { value: 0 };
    var uBHHorizon = { value: BH_HORIZON };

    var BH_GLSL = [
      'uniform vec3 uBHOrigin; uniform vec3 uBHDir; uniform float uBHTan; uniform float uBHOn; uniform float uBHHorizon;',
      // returns (pull 0..1, distance to axis, cone radius); pull 0 = outside
      'vec3 blackHole(vec3 pos, out vec3 n, out vec3 tang){',
      '  n = vec3(0.0); tang = vec3(0.0);',
      '  if (uBHOn < 0.001 || uBHTan <= 0.0) return vec3(0.0);',
      '  vec3 rel = pos - uBHOrigin; float along = dot(rel, uBHDir);',
      '  if (along < 0.5) return vec3(0.0);',
      '  vec3 off = rel - uBHDir * along; float d = length(off) + 1e-5;',
      '  float R = along * uBHTan;',
      '  if (d >= R) return vec3(0.0, d, R);',
      '  n = off / d;',
      '  tang = normalize(cross(uBHDir, n));',
      '  return vec3((1.0 - d / R) * uBHOn, d, R);',
      '}',
      'bool swallowed(vec3 bh){ return bh.x > 0.0 && bh.y < bh.z * uBHHorizon * uBHOn; }',
      'float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453); }'
    ].join('\n');

    // ---------- autonomous clusters (GPU-side) ----------
    // Up to 3 clusters form on their own. Membership lives in the position texture's w
    // (slot 1..3, 0 = free): on a cluster's spawn frame every free particle of the chosen
    // colour inside its capture radius joins; on its clear frame they're let go. Targets are
    // procedural shape surfaces, so no CPU readback or texture uploads are needed.
    var CLUSTER_SLOTS = 3;
    function arr(make){ var a = []; for (var s = 0; s < CLUSTER_SLOTS; s++) a.push(make()); return a; }
    var clusterUniforms = {
      uCCenter: { value: arr(function(){ return new THREE.Vector3(); }) },
      uCRot:    { value: arr(function(){ return new THREE.Matrix3(); }) },
      uCStart:  { value: [0, 0, 0] }, uCState: { value: [0, 0, 0] },   // state: 0 idle, 1 forming/holding, 2 dissolving
      uCShape:  { value: [0, 0, 0] }, uCScale: { value: [1, 1, 1] }, uCSeed: { value: [0, 0, 0] },
      uCRadius: { value: [0, 0, 0] }, uCColor: { value: [-1, -1, -1] }, uCTake: { value: [1, 1, 1] },
      uCSpawn:  { value: [0, 0, 0] }, uCClear: { value: [0, 0, 0] }, uCBurst: { value: [0, 0, 0] }
    };
    var CL_GLSL = [
      'uniform vec3 uCCenter[3]; uniform mat3 uCRot[3];',
      'uniform float uCStart[3]; uniform float uCState[3]; uniform float uCShape[3]; uniform float uCScale[3]; uniform float uCSeed[3];',
      'uniform float uCRadius[3]; uniform float uCColor[3]; uniform float uCTake[3];',
      'uniform float uCSpawn[3]; uniform float uCClear[3]; uniform float uCBurst[3];',
      // copy one slot's data (1-based); loop form keeps array indexing legal on WebGL1
      'void clusterData(float slot, out vec3 c, out mat3 r, out float start, out float state, out float shape, out float scale, out float seed, out float burst){',
      '  c = vec3(0.0); r = mat3(1.0); start = 0.0; state = 0.0; shape = 0.0; scale = 1.0; seed = 0.0; burst = 0.0;',
      '  for (int i = 0; i < 3; i++){',
      '    if (abs(float(i + 1) - slot) < 0.5){',
      '      c = uCCenter[i]; r = uCRot[i]; start = uCStart[i]; state = uCState[i];',
      '      shape = uCShape[i]; scale = uCScale[i]; seed = uCSeed[i]; burst = uCBurst[i];',
      '    }',
      '  }',
      '}',
      // same colour pick as the render shader: 0 sky, 1 orchid, 2 amber
      'float colorClass(vec4 s){ float pick = fract(s.z * 17.0 + s.w * 5.0); return pick < 0.45 ? 0.0 : (pick < 0.8 ? 1.0 : 2.0); }'
    ].join('\n');

    // procedural shape surfaces, roughly unit radius; h/h3 are per-particle randoms,
    // seed is the cluster's own random, t is time (for shapes that shimmer)
    var SHAPE_GLSL = [
      'vec3 cNode(float seed, float i){',                            // constellation star i
      '  return (vec3(hash(vec2(seed, i)), hash(vec2(seed + 1.3, i)), hash(vec2(seed + 2.7, i))) * 2.0 - 1.0)',
      '         * vec3(1.0, 0.75, 0.2);',
      '}',
      'vec3 shapePoint(float type, vec2 h, float h3, float seed, float t){',
      '  float u = h.x, v = h.y;',
      '  if (type > 7.5 && type < 8.5){',                           // constellation
      // 6 stars joined in a path: ~45% of particles pile onto the stars (bright points),
      // the rest sit on the joining lines, quantised into faint dotted links
      '    float k = floor(h3 * 5.0);',
      '    vec3 a = cNode(seed, k), b = cNode(seed, k + 1.0);',
      '    if (v < 0.45){',
      '      vec3 star = h3 < 0.5 ? a : b;',
      '      return star + (vec3(u, fract(u * 7.3), fract(u * 3.1)) - 0.5) * 0.07;',
      '    }',
      '    float s = (floor(u * 12.0) + 0.5) / 12.0;',
      '    return mix(a, b, s) + (vec3(fract(v * 5.7), fract(v * 9.3), fract(v * 2.9)) - 0.5) * 0.02;',
      '  }',
      '  if (type > 8.5){',                                          // star river
      // a winding, narrow band, densest along its centre line, with a gentle shimmer along its length
      '    float s = u + 0.025 * sin(t * 0.6 + v * 23.0);',
      '    float w = v - 0.5; float off = w * w * w * 4.0 * 0.45;',
      '    return vec3((s * 2.0 - 1.0) * 1.4,',
      '                0.32 * sin(s * 6.5 + seed) + off,',
      '                0.22 * sin(s * 4.7 + seed * 1.7) + (h3 - 0.5) * 0.05);',
      '  }',
      '  if (type < 0.5){',                                         // sphere
      '    float z = 2.0*u - 1.0, a = 6.2831*v, r = sqrt(max(0.0, 1.0 - z*z));',
      '    return vec3(r*cos(a), r*sin(a), z);',
      '  } else if (type < 1.5){',                                  // torus
      '    float a = 6.2831*u, b = 6.2831*v;',
      '    return vec3((0.72 + 0.28*cos(b))*cos(a), (0.72 + 0.28*cos(b))*sin(a), 0.28*sin(b));',
      '  } else if (type < 2.5){',                                  // cube shell
      '    float face = floor(h3 * 6.0); vec2 q = vec2(u, v) * 2.0 - 1.0; vec3 p;',
      '    if (face < 1.0) p = vec3(1.0, q); else if (face < 2.0) p = vec3(-1.0, q);',
      '    else if (face < 3.0) p = vec3(q.x, 1.0, q.y); else if (face < 4.0) p = vec3(q.x, -1.0, q.y);',
      '    else if (face < 5.0) p = vec3(q, 1.0); else p = vec3(q, -1.0);',
      '    return p * 0.65;',
      '  } else if (type < 3.5){',                                  // trefoil knot
      '    float t = 6.2831*u; float r = 0.55 + 0.25*cos(3.0*t);',
      '    vec3 c = vec3(r*cos(2.0*t), r*sin(2.0*t), 0.3*sin(3.0*t));',
      '    return c + (vec3(v, h3, fract(v*7.31 + h3*3.7)) - 0.5) * 0.16;',
      '  } else if (type < 4.5){',                                  // spiral galaxy
      '    float arm = floor(h3 * 3.0); float r = pow(u, 0.7);',
      '    float a = r * 5.0 + arm * 2.0944 + (v - 0.5) * 0.6;',
      '    return vec3(r*cos(a), r*sin(a), (fract(v*13.7) - 0.5) * 0.08 * (1.0 - r));',
      '  } else if (type < 5.5){',                                  // thin ring
      '    float a = 6.2831*u; float r = 1.0 + (v - 0.5) * 0.08;',
      '    return vec3(r*cos(a), r*sin(a), (h3 - 0.5) * 0.05);',
      '  } else if (type < 6.5){',                                  // double helix
      '    float y = u*2.0 - 1.0; float a = y * 9.42 + (h3 < 0.5 ? 0.0 : 3.1416);',
      '    return vec3(0.35*cos(a), y, 0.35*sin(a)) + (vec3(v, fract(v*9.1), fract(v*5.3)) - 0.5) * 0.06;',
      '  }',
      '  float z = 2.0*u - 1.0, a = 6.2831*v, r = sqrt(max(0.0, 1.0 - z*z));', // octahedron
      '  vec3 p = vec3(r*cos(a), r*sin(a), z);',
      '  return p / (abs(p.x) + abs(p.y) + abs(p.z));',
      '}'
    ].join('\n');

    // velocity pass: random wander, black hole, seek-to-shape, release/disperse
    var velUniforms = {
      tPos: { value: null }, tVel: { value: null }, tSeed: { value: seedTex }, tTarget: { value: targetTex },
      uTime: uTime, uDt: uDt, uMode: uMode, uBounds: uBounds,
      uFlowTime: { value: 0 }, uFormStart: { value: 0 }, uBurst: { value: 0 },
      uWanderSpeed: { value: WANDER_SPEED }, uFlowResponse: { value: FLOW_RESPONSE },
      uBHPull: { value: BH_PULL }, uBHSwirl: { value: BH_SWIRL },
      uDisperseResponse: { value: DISPERSE_RESPONSE }, uDisperseFade: { value: DISPERSE_FADE },
      uSeekSpeed: { value: SEEK_SPEED }, uSeekResponse: { value: SEEK_RESPONSE }, uArrive: { value: ARRIVE },
      uStagger: { value: FORM_STAGGER }, uBurstStrength: { value: BURST_STRENGTH },
      uDisperseSpeed: { value: DISPERSE_SPEED },
      uCenter: { value: new THREE.Vector3() }, uRot: { value: new THREE.Matrix3() },
      uClusterSeek: { value: CLUSTER_SEEK }, uClusterStagger: { value: CLUSTER_STAGGER },
      uBHOrigin: uBHOrigin, uBHDir: uBHDir, uBHTan: uBHTan, uBHOn: uBHOn, uBHHorizon: uBHHorizon
    };
    Object.keys(clusterUniforms).forEach(function(key){ velUniforms[key] = clusterUniforms[key]; });
    var velMat = simMaterial(velUniforms, [
      'uniform sampler2D tPos; uniform sampler2D tVel; uniform sampler2D tSeed; uniform sampler2D tTarget;',
      'uniform float uTime; uniform float uFlowTime; uniform float uDt; uniform float uMode; uniform float uFormStart; uniform float uBurst;',
      'uniform float uWanderSpeed; uniform float uFlowResponse; uniform float uSeekSpeed; uniform float uSeekResponse;',
      'uniform float uDisperseResponse; uniform float uDisperseFade; uniform float uDisperseSpeed;',
      'uniform float uArrive; uniform float uStagger; uniform float uBurstStrength;',
      'uniform float uBHPull; uniform float uBHSwirl; uniform float uClusterSeek; uniform float uClusterStagger;',
      'uniform vec3 uCenter; uniform vec3 uBounds; uniform mat3 uRot;',
      'varying vec2 vUv;',
      BH_GLSL,
      CL_GLSL,
      SHAPE_GLSL,

      'void main(){',
      '  vec4 P = texture2D(tPos, vUv);',
      '  vec4 V = texture2D(tVel, vUv);',
      '  vec4 S = texture2D(tSeed, vUv);',
      '  vec4 T = texture2D(tTarget, vUv);',
      '  vec3 pos = P.xyz; vec3 vel = V.xyz;',
      '  float isP = step(0.5, S.y);',
      '  float userSeek = uMode * isP;',
      // the click-formed shape always wins over an autonomous cluster
      '  float slot = userSeek > 0.5 ? 0.0 : P.w;',
      '  vec3 cC; mat3 cR; float cStart, cState, cShape, cScale, cSeed, cBurst;',
      '  clusterData(slot, cC, cR, cStart, cState, cShape, cScale, cSeed, cBurst);',
      '  float clusterSeek = (slot > 0.5 && abs(cState - 1.0) < 0.5) ? 1.0 : 0.0;',
      '  float seeking = max(userSeek, clusterSeek);',

      // free roaming: every particle wanders on its own path. Its heading is three slow sine
      // waves with per-particle frequencies and phases, so directions are independent and
      // keep turning (no shared currents), and the cloud stays evenly spread.
      '  vec3 fr = 0.12 + 0.3 * vec3(S.x, S.w, hash(vUv + 0.47));',
      '  float ph = S.z * 6.2831;',
      '  vec3 heading = vec3(sin(uFlowTime * fr.x + ph),',
      '                      sin(uFlowTime * fr.y + ph * 1.7 + 1.3),',
      '                      sin(uFlowTime * fr.z + ph * 2.3 + 2.1));',
      '  vec3 desired = normalize(heading + 1e-4) * uWanderSpeed * (0.5 + S.x);',

      // dispersing (released from a shape, V.w still high): glide toward a random spot
      // around the shape, then hand back to the wander as w fades
      '  float dw = (1.0 - seeking) * clamp(V.w, 0.0, 1.0);',
      '  if (dw > 0.001){',
      '    bool fromCluster = slot > 0.5;',
      '    float r = fract((fromCluster ? cSeed : uFormStart) * 0.1379);',
      '    vec3 home = (fromCluster ? cC : uCenter)',
      '              + (vec3(hash(vUv + r + 0.29), hash(vUv + r + 0.53), hash(vUv + r + 0.91)) * 2.0 - 1.0) * (fromCluster ? 5.0 : 7.0);',
      '    vec3 toHome = home - pos; float hd = length(toHome) + 1e-5;',
      '    vec3 homeV = toHome / hd * min(uDisperseSpeed * (0.6 + 0.8*S.x), hd * 0.02);',
      '    desired = mix(desired, homeV, dw);',
      '  }',

      // black hole: a slow, gentle vortex scaled by the cone radius. Roughly half the particles
      // it touches are captured and spiral in over many seconds; the rest circle a while and
      // are eased back out, so the swirl keeps dispersing instead of just draining.
      '  vec3 n = vec3(0.0), tang = vec3(0.0), bh = vec3(0.0);',
      '  if (seeking < 0.5) bh = blackHole(pos, n, tang);',
      '  float bf = bh.x;',
      '  if (bf > 0.0){',
      '    float captured = hash(vUv + 0.77) < 0.55 ? 1.0 : -0.8;',
      '    desired += (-n * (0.25 + bf) * uBHPull * captured + tang * sqrt(bf) * uBHSwirl) * bh.z;',
      '  }',
      '  float resp = mix(mix(uFlowResponse, uDisperseResponse, dw), 0.05, bf);',
      '  float kf = 1.0 - pow(1.0 - resp, uDt);',
      '  vec3 freeV = vel + (desired - vel) * kf;',

      // one-frame outward nudge when the shape is released
      '  if (uBurst > 0.5 && isP > 0.5){',
      '    vec3 dir = pos - uCenter;',
      '    dir += (vec3(hash(vUv + 0.13), hash(vUv + 0.71), hash(vUv + 0.37)) - 0.5) * 1.2;',
      '    freeV += normalize(dir + 1e-4) * uBurstStrength * (0.45 + 0.9*S.w);',
      '  }',
      '  if (cBurst > 0.5 && slot > 0.5){',
      '    vec3 dir = pos - cC;',
      '    dir += (vec3(hash(vUv + 0.19), hash(vUv + 0.61), hash(vUv + 0.43)) - 0.5) * 1.2;',
      '    freeV += normalize(dir + 1e-4) * uBurstStrength * (0.45 + 0.9*S.w);',
      '  }',

      '  vec3 newV = freeV;',
      '  float goal = 0.0;',
      '  if (seeking > 0.5){',
      '    vec3 wob = vec3(sin(uTime*1.3 + S.x*40.0), sin(uTime*1.1 + S.z*40.0), sin(uTime*1.7 + S.w*40.0)) * 0.012;',
      '    vec3 tgt; float a; float maxSpd;',
      '    if (userSeek > 0.5){',
      '      tgt = uCenter + uRot * T.xyz + wob;',
      // nearest particles set off first (T.w = departure order), so the gathering ripples inward
      '      a = smoothstep(0.0, 1.0, (uTime - uFormStart - T.w * uStagger) * 1.5);',
      '      maxSpd = uSeekSpeed;',
      '    } else {',
      '      vec2 h = vec2(hash(vUv + cSeed), hash(vUv * 1.37 + cSeed + 0.5));',
      '      tgt = cC + cR * shapePoint(cShape, h, hash(vUv * 2.11 + cSeed + 0.9), cSeed, uTime) * cScale + wob;',
      // autonomous clusters gather lazily, particles joining over a few seconds
      '      a = smoothstep(0.0, 1.0, (uTime - cStart - hash(vUv + cSeed + 0.3) * uClusterStagger) * 0.8);',
      '      maxSpd = uClusterSeek;',
      '    }',
      '    vec3 to = tgt - pos; float d = length(to) + 1e-5;',
      '    float spd = min(maxSpd * (0.7 + 0.6*S.x), d * uArrive);',
      '    float ks = 1.0 - pow(1.0 - uSeekResponse, uDt);',
      '    vec3 seekV = vel + (to / d * spd - vel) * ks;',
      '    newV = mix(freeV, seekV, a);',
      '    goal = a * (1.0 - smoothstep(0.05, 0.8, d));',
      '  }',

      // w = eased "formed" amount: rises as a particle settles into the shape, falls slowly while dispersing
      // (negative w = freshly respawned from the black hole, fading back in over ~1s)
      '  float kw = 1.0 - pow(1.0 - (goal > V.w ? (V.w < 0.0 ? 0.02 : 0.06) : uDisperseFade), uDt);',
      '  float w = V.w + (goal - V.w) * kw;',
      '  if (swallowed(bh)){ newV = vec3(0.0); w = -1.0; }',
      '  gl_FragColor = vec4(newV, w);',
      '}'
    ].join('\n'));

    // position pass: integrate, wrap free particles, respawn anything the black hole swallowed,
    // and manage cluster membership (w)
    var posUniforms = {
      tPos: { value: null }, tVel: { value: null }, tSeed: { value: seedTex },
      uDt: uDt, uTime: uTime, uMode: uMode, uBounds: uBounds,
      uBHOrigin: uBHOrigin, uBHDir: uBHDir, uBHTan: uBHTan, uBHOn: uBHOn, uBHHorizon: uBHHorizon
    };
    Object.keys(clusterUniforms).forEach(function(key){ posUniforms[key] = clusterUniforms[key]; });
    var posMat = simMaterial(posUniforms, [
      'uniform sampler2D tPos; uniform sampler2D tVel; uniform sampler2D tSeed;',
      'uniform float uDt; uniform float uTime; uniform float uMode; uniform vec3 uBounds;',
      'varying vec2 vUv;',
      BH_GLSL,
      CL_GLSL,
      'void main(){',
      '  vec4 P = texture2D(tPos, vUv);',
      '  vec4 S = texture2D(tSeed, vUv);',
      '  vec3 old = P.xyz; float slot = P.w;',
      '  bool userSeek = uMode > 0.5 && S.y > 0.5;',
      '  if (userSeek) slot = 0.0;',                       // the click-formed shape takes it over
      '  for (int i = 0; i < 3; i++){',
      '    if (abs(float(i + 1) - slot) < 0.5 && uCClear[i] > 0.5) slot = 0.0;',
      '  }',
      // a newly spawned cluster claims free particles of its colour inside its capture radius
      '  if (slot < 0.5 && !userSeek){',
      '    float cls = colorClass(S);',
      '    for (int i = 0; i < 3; i++){',
      '      if (uCSpawn[i] > 0.5 && distance(old, uCCenter[i]) < uCRadius[i]',
      '          && (uCColor[i] < 0.0 || abs(cls - uCColor[i]) < 0.5)',
      '          && hash(vUv * 3.7 + uCSeed[i]) < uCTake[i]) slot = float(i + 1);',
      '    }',
      '  }',
      '  vec3 cC; mat3 cR; float cStart, cState, cShape, cScale, cSeed, cBurst;',
      '  clusterData(slot, cC, cR, cStart, cState, cShape, cScale, cSeed, cBurst);',
      '  bool seeking = userSeek || (slot > 0.5 && abs(cState - 1.0) < 0.5);',
      '  vec3 n = vec3(0.0), tang = vec3(0.0), bh = vec3(0.0);',
      '  if (!seeking) bh = blackHole(old, n, tang);',
      '  vec3 pos;',
      '  if (swallowed(bh)){',
      '    slot = 0.0;',
      // re-emerge at a random spot in the field (fading in), so swallowed areas refill evenly
      '    pos = vec3((hash(vUv + fract(uTime * 0.37)) * 2.0 - 1.0) * uBounds.x,',
      '               (hash(vUv + fract(uTime * 0.71) + 0.2) * 2.0 - 1.0) * uBounds.y,',
      '               (hash(vUv + fract(uTime * 0.53) + 0.6) * 2.0 - 1.0) * uBounds.z);',
      '  } else {',
      '    pos = old + texture2D(tVel, vUv).xyz * uDt;',
      // the field is a 3D torus: leaving one face re-enters at the opposite one (faded out at the faces)
      '    if (!seeking) pos = mod(pos + uBounds, 2.0 * uBounds) - uBounds;',
      '  }',
      '  gl_FragColor = vec4(pos, slot);',
      '}'
    ].join('\n'));

    function simulate(){
      velUniforms.tPos.value = posRT[cur].texture;
      velUniforms.tVel.value = velRT[cur].texture;
      simMesh.material = velMat;
      renderer.setRenderTarget(velRT[1 - cur]);
      renderer.render(simScene, simCam);

      posUniforms.tPos.value = posRT[cur].texture;
      posUniforms.tVel.value = velRT[1 - cur].texture;
      simMesh.material = posMat;
      renderer.setRenderTarget(posRT[1 - cur]);
      renderer.render(simScene, simCam);

      renderer.setRenderTarget(null);
      cur = 1 - cur;
    }

    // read current particle positions back to the CPU (used once per click to pick the nearest ones)
    function halfToFloat(h){
      var s = (h & 0x8000) ? -1 : 1, e = (h >> 10) & 0x1f, f = h & 0x3ff;
      if (e === 0) return s * Math.pow(2, -14) * (f / 1024);
      if (e === 31) return f ? NaN : s * Infinity;
      return s * Math.pow(2, e - 15) * (1 + f / 1024);
    }
    function readPositions(){
      var n = PARTICLE_COUNT * 4;
      if (SIM_TYPE === THREE.FloatType){
        var buf = new Float32Array(n);
        renderer.readRenderTargetPixels(posRT[cur], 0, 0, SIM_SIZE, SIM_SIZE, buf);
        return buf;
      }
      var hb = new Uint16Array(n), out = new Float32Array(n);
      renderer.readRenderTargetPixels(posRT[cur], 0, 0, SIM_SIZE, SIM_SIZE, hb);
      for (var j = 0; j < n; j++) out[j] = halfToFloat(hb[j]);
      return out;
    }

    // ---------- render: one vertex per particle, positions fetched from the sim texture ----------
    var refs = new Float32Array(PARTICLE_COUNT * 2);
    for (i = 0; i < PARTICLE_COUNT; i++){
      refs[i*2]   = ((i % SIM_SIZE) + 0.5) / SIM_SIZE;
      refs[i*2+1] = (Math.floor(i / SIM_SIZE) + 0.5) / SIM_SIZE;
    }
    var geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(PARTICLE_COUNT * 3), 3));
    geometry.setAttribute('reference', new THREE.BufferAttribute(refs, 2));

    renderUniforms = {
      tPos: { value: posRT[cur].texture }, tVel: { value: velRT[cur].texture }, tSeed: { value: seedTex },
      uScale: { value: pointScale }, uSize: { value: POINT_SIZE }, uCamDist: { value: CAM_DIST }, uBounds: uBounds,
      // three distinct particle colors: sky, orchid, amber
      uColorA: { value: new THREE.Color(0x38bdf8) }, uColorB: { value: new THREE.Color(0xe879f9) },
      uColorC: { value: new THREE.Color(0xfbbf24) }
    };
    var material = new THREE.ShaderMaterial({
      uniforms: renderUniforms,
      vertexShader: [
        'uniform sampler2D tPos; uniform sampler2D tVel; uniform sampler2D tSeed;',
        'uniform float uScale; uniform float uSize; uniform float uCamDist; uniform vec3 uBounds;',
        'uniform vec3 uColorA; uniform vec3 uColorB; uniform vec3 uColorC;',
        'attribute vec2 reference;',
        'varying vec3 vColor; varying float vAlpha;',
        'void main(){',
        '  vec3 p = texture2D(tPos, reference).xyz;',
        '  vec4 v = texture2D(tVel, reference);',
        '  vec4 s = texture2D(tSeed, reference);',
        '  float f = clamp(v.w, 0.0, 1.0);',
        '  vec4 mv = modelViewMatrix * vec4(p, 1.0);',
        '  float depth = -mv.z;',
        '  float speed = length(v.xyz);',
        // each particle keeps one of three colors (45% / 35% / 20%), in the field and in the shape
        '  float pick = fract(s.z * 17.0 + s.w * 5.0);',
        '  vec3 baseC = pick < 0.45 ? uColorA : (pick < 0.8 ? uColorB : uColorC);',
        // fast movers (e.g. spiralling into the black hole) glow a little hotter
        '  vColor = baseC * (1.0 + min(speed * 5.0, 0.6));',
        // fades: far away (atmospheric depth), very close to the lens (no giant blobs),
        // and near the field's faces (so particles wrapping across the cube never pop)
        '  float far = 1.0 - 0.8 * smoothstep(uCamDist, uCamDist + 28.0, depth);',
        '  float nearLens = smoothstep(0.6, 2.5, depth);',
        '  vec3 edge = uBounds - abs(p);',
        '  float faces = smoothstep(0.0, 3.0, min(edge.x, min(edge.y, edge.z)));',
        '  vAlpha = 0.7 * far * nearLens * max(faces, f) * mix(1.0, 0.45, f) * (1.0 + min(v.w, 0.0));',
        '  float size = min(uSize * (0.7 + 0.6 * s.w) * uScale / max(depth, 0.1), 28.0);',
        // sub-pixel points shimmer; keep them 1.5px and fade them instead
        '  if (size < 1.5){ vAlpha *= size / 1.5; size = 1.5; }',
        '  gl_PointSize = size;',
        '  gl_Position = projectionMatrix * mv;',
        '}'
      ].join('\n'),
      fragmentShader: [
        'varying vec3 vColor; varying float vAlpha;',
        'void main(){',
        '  vec2 c = gl_PointCoord - 0.5;',
        '  float d = dot(c, c) * 4.0;',
        '  if (d > 1.0) discard;',
        '  float a = 1.0 - d;',
        '  gl_FragColor = vec4(vColor, a * a * vAlpha);',
        '}'
      ].join('\n'),
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    var points = new THREE.Points(geometry, material);
    points.frustumCulled = false;
    scene.add(points);

    window.addEventListener('resize', sizeToWindow);

    // ---------- orbit camera (right-drag / two-finger drag, wheel / pinch zoom) ----------
    var orbit = { theta: 0, phi: Math.PI / 2, radius: CAM_DIST, tTheta: 0, tPhi: Math.PI / 2, tRadius: CAM_DIST };
    var ORBIT_TARGET = new THREE.Vector3(0, 0, 0);
    function orbitBy(dx, dy){
      orbit.tTheta -= dx * 0.006;
      orbit.tPhi = Math.max(0.08, Math.min(Math.PI - 0.08, orbit.tPhi - dy * 0.006));
    }
    function zoomBy(factor){
      orbit.tRadius = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, orbit.tRadius * factor));
    }
    function updateCamera(){
      orbit.theta  += (orbit.tTheta  - orbit.theta)  * 0.15;
      orbit.phi    += (orbit.tPhi    - orbit.phi)    * 0.15;
      orbit.radius += (orbit.tRadius - orbit.radius) * 0.15;
      var sp = Math.sin(orbit.phi);
      camera.position.set(
        ORBIT_TARGET.x + orbit.radius * sp * Math.sin(orbit.theta),
        ORBIT_TARGET.y + orbit.radius * Math.cos(orbit.phi),
        ORBIT_TARGET.z + orbit.radius * sp * Math.cos(orbit.theta)
      );
      camera.lookAt(ORBIT_TARGET);
      camera.updateMatrixWorld();
      renderUniforms.uCamDist.value = orbit.radius;
    }

    // ---------- shape state ----------
    var formed = false;
    var shapeIndex = -1;
    var formStart = 0;
    var rotTime = 0;
    var pendingBurst = false;
    var tmpVec = new THREE.Vector3();
    var rotEuler = new THREE.Euler();
    var rotMat4 = new THREE.Matrix4();
    var viewProj = new THREE.Matrix4();
    var raycaster = new THREE.Raycaster();
    var ndc = new THREE.Vector2();
    var tapPlane = new THREE.Plane();
    var camDir = new THREE.Vector3();
    var shapeCenter = new THREE.Vector3();

    function rayFromClient(clientX, clientY){
      ndc.x = (clientX / window.innerWidth) * 2 - 1;
      ndc.y = -(clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(ndc, camera);
      return raycaster.ray;
    }

    // pick the particles nearest the click *on screen* (through the whole depth, with a mild
    // preference for ones near the shape's depth, slightly randomised so the drained pocket
    // has a soft edge), ordered nearest-first for the departure ripple.
    // With up to millions of particles a full sort is too slow, so a histogram finds the
    // cut-off distance and only the chosen few are sorted.
    function pickNearest(clientX, clientY, count, centerDepth){
      var pos = readPositions();
      var W = window.innerWidth, H = window.innerHeight;
      viewProj.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
      var e = viewProj.elements;
      var dist = new Float32Array(PARTICLE_COUNT);
      var BINS = 4096, maxD = Math.hypot(W, H) * 3, binScale = BINS / maxD;
      var hist = new Uint32Array(BINS);
      for (var j = 0; j < PARTICLE_COUNT; j++){
        var x = pos[j*4], y = pos[j*4+1], z = pos[j*4+2];
        var cw = e[3]*x + e[7]*y + e[11]*z + e[15];   // view-space depth
        if (!(cw > 0.3)) { dist[j] = Infinity; continue; }
        var sx = ((e[0]*x + e[4]*y + e[8]*z + e[12]) / cw * 0.5 + 0.5) * W;
        var sy = (0.5 - (e[1]*x + e[5]*y + e[9]*z + e[13]) / cw * 0.5) * H;
        var dx = sx - clientX, dy = sy - clientY;
        var d = Math.sqrt(dx*dx + dy*dy) * (1 + 0.05 * Math.abs(cw - centerDepth)) * (0.85 + Math.random() * 0.3);
        dist[j] = d;
        if (d < maxD) hist[(d * binScale) | 0]++;
      }
      var cutoff = maxD, acc = 0;
      for (var b = 0; b < BINS; b++){
        acc += hist[b];
        if (acc >= count){ cutoff = (b + 1) / binScale; break; }
      }
      var picked = [];
      for (j = 0; j < PARTICLE_COUNT; j++) if (dist[j] < cutoff) picked.push(j);
      picked.sort(function(a, c){ return dist[a] - dist[c]; });
      return Uint32Array.from(picked.slice(0, count));
    }

    function formShapeAt(clientX, clientY, now){
      // centre: where the click ray meets the plane through the orbit target, facing the camera
      camera.getWorldDirection(camDir);
      tapPlane.setFromNormalAndCoplanarPoint(camDir, ORBIT_TARGET);
      if (!rayFromClient(clientX, clientY).intersectPlane(tapPlane, shapeCenter)) return;

      var chosen;
      try { chosen = pickNearest(clientX, clientY, SHAPE_PARTICLES, camera.position.distanceTo(shapeCenter)); }
      catch (err) {
        // readback unsupported: fall back to a random selection
        console.warn(err);
        chosen = new Uint32Array(SHAPE_PARTICLES);
        for (var r = 0; r < SHAPE_PARTICLES; r++) chosen[r] = Math.floor(Math.random() * PARTICLE_COUNT);
      }

      var idx;
      do { idx = Math.floor(Math.random() * shapes.length); } while (idx === shapeIndex && shapes.length > 1);
      shapeIndex = idx;
      var geo = shapes[idx].make();
      var pts = sampleSurface(geo, chosen.length);
      geo.dispose();

      var euler = new THREE.Euler(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2);
      var scale = SHAPE_SCALE * (0.85 + Math.random() * 0.3);
      var shapeRadius = 1.7 * scale;

      for (var j = 0; j < PARTICLE_COUNT; j++) seedData[j*4+1] = 0;
      for (j = 0; j < chosen.length; j++){
        tmpVec.set(pts[j*3], pts[j*3+1], pts[j*3+2]).applyEuler(euler).multiplyScalar(scale);
        var k = chosen[j] * 4;
        seedData[k+1] = 1;
        targetData[k]   = tmpVec.x;
        targetData[k+1] = tmpVec.y;
        targetData[k+2] = tmpVec.z;
        targetData[k+3] = j / chosen.length;   // departure order
      }
      seedTex.needsUpdate = true;
      targetTex.needsUpdate = true;

      // keep the shape inside the field
      shapeCenter.x = Math.max(-bounds.x + shapeRadius, Math.min(bounds.x - shapeRadius, shapeCenter.x));
      shapeCenter.y = Math.max(-bounds.y + shapeRadius, Math.min(bounds.y - shapeRadius, shapeCenter.y));
      shapeCenter.z = Math.max(-bounds.z + shapeRadius, Math.min(bounds.z - shapeRadius, shapeCenter.z));
      velUniforms.uCenter.value.copy(shapeCenter);
      velUniforms.uFormStart.value = now;
      formStart = now;
      rotTime = 0;
      uMode.value = 1;
      formed = true;
    }

    function releaseShape(){
      uMode.value = 0;
      pendingBurst = true;
      formed = false;
    }

    // ---------- autonomous clusters: lifecycle ----------
    // idle -> spawn (claims nearby particles of one colour) -> gather + hold 8-16s
    //      -> dissolve (drift apart) -> clear -> idle. A new one starts every few seconds
    // while a slot is free, at a random visible spot, so the field keeps "evolving".
    var cu = clusterUniforms;
    var clusters = arr(function(){
      return { state: 0, until: 0, rot: 0, rates: new THREE.Vector3(), base: new THREE.Matrix4() };
    });
    var nextClusterAt = 1.5;
    var clusterRotM4 = new THREE.Matrix4(), clusterEuler = new THREE.Euler();

    function pickClusterCenter(out){
      for (var attempt = 0; attempt < 8; attempt++){
        // a random on-screen point (clear of the edges and the slider panel), at a random depth
        var ray = rayFromClient(window.innerWidth * (0.1 + Math.random() * 0.8), window.innerHeight * (0.1 + Math.random() * 0.62));
        out.copy(ray.origin).addScaledVector(ray.direction, 6 + Math.random() * 9);
        var m = FIELD_HALF - 7;
        out.set(Math.max(-m, Math.min(m, out.x)), Math.max(-m, Math.min(m, out.y)), Math.max(-m, Math.min(m, out.z)));
        var clear = !(formed && out.distanceTo(shapeCenter) < 5);
        for (var s = 0; s < CLUSTER_SLOTS && clear; s++){
          if (clusters[s].state !== 0 && out.distanceTo(cu.uCCenter.value[s]) < 6) clear = false;
        }
        if (clear) return true;
      }
      return false;
    }

    function spawnCluster(s, now){
      if (!pickClusterCenter(cu.uCCenter.value[s])) return false;
      var c = clusters[s];
      var size = Math.random();
      // ~15% constellations, ~15% star rivers, otherwise one of the 8 solid shapes (see shapePoint())
      var roll = Math.random();
      var shape = roll < 0.15 ? 8 : roll < 0.3 ? 9 : Math.floor(Math.random() * 8);
      var flat = shape >= 8;
      cu.uCShape.value[s] = shape;
      cu.uCScale.value[s] = flat ? 0.7 + size * 0.7 : 0.35 + size * 0.75;  // shape radius, world units
      cu.uCRadius.value[s] = (4.5 + size * 3) * (isSmall ? 1.3 : 1);    // capture radius -> particle count (~2.5k-5k)
      cu.uCColor.value[s] = Math.random() < 0.85 ? Math.floor(Math.random() * 3) : -1;  // one colour, or mixed
      cu.uCTake.value[s] = 0.8 + Math.random() * 0.2;
      cu.uCSeed.value[s] = Math.random() * 100;
      cu.uCStart.value[s] = now;
      cu.uCState.value[s] = 1;
      cu.uCSpawn.value[s] = 1;
      c.state = 1;
      c.until = now + 6 + Math.random() * 12;
      c.rot = 0;
      if (flat){
        // constellations / rivers are flat: face the current view with a slight tilt and barely turn
        c.rates.set((Math.random() - 0.5) * 0.06, (Math.random() - 0.5) * 0.06, (Math.random() - 0.5) * 0.1);
        c.base.makeRotationFromQuaternion(camera.quaternion)
          .multiply(clusterRotM4.makeRotationFromEuler(clusterEuler.set((Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.5, Math.random() * 6.28)));
      } else {
        c.rates.set((Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.3);
        c.base.makeRotationFromEuler(clusterEuler.set(Math.random() * 6.28, Math.random() * 6.28, Math.random() * 6.28));
      }
      return true;
    }

    // sets this frame's one-shot flags; clearClusterFlags() resets them after the sim step
    function updateClusters(now, delta){
      var free = -1;
      for (var s = 0; s < CLUSTER_SLOTS; s++){
        var c = clusters[s];
        if (c.state === 0){ if (free < 0) free = s; continue; }
        c.rot += delta * speedMul;
        clusterEuler.set(c.rot * c.rates.x, c.rot * c.rates.y, c.rot * c.rates.z);
        clusterRotM4.makeRotationFromEuler(clusterEuler).multiply(c.base);
        cu.uCRot.value[s].setFromMatrix4(clusterRotM4);
        if (now < c.until) continue;
        if (c.state === 1){            // hold over: drift apart
          dissolveCluster(s, now);
        } else {                       // dispersal done: release membership
          c.state = 0;
          cu.uCState.value[s] = 0; cu.uCClear.value[s] = 1;
        }
      }
      if (free >= 0 && now > nextClusterAt){
        nextClusterAt = now + (spawnCluster(free, now) ? 3 + Math.random() * 5 : 1);
      }
    }
    function dissolveCluster(s, now){
      var c = clusters[s];
      c.state = 2; c.until = now + 6;
      cu.uCState.value[s] = 2; cu.uCBurst.value[s] = 1;
    }

    // which forming/holding cluster (if any) is under a screen point; generous hit area
    var _proj = new THREE.Vector3();
    function clusterAt(clientX, clientY){
      var best = -1, bestD = Infinity;
      var pxPerUnitAt1 = window.innerHeight / (2 * tanHalfFov);
      for (var s = 0; s < CLUSTER_SLOTS; s++){
        if (clusters[s].state !== 1) continue;
        var ctr = cu.uCCenter.value[s];
        var depth = _proj.copy(ctr).applyMatrix4(camera.matrixWorldInverse).z * -1;
        if (depth <= 0.3) continue;
        _proj.copy(ctr).project(camera);
        var sx = (_proj.x * 0.5 + 0.5) * window.innerWidth, sy = (0.5 - _proj.y * 0.5) * window.innerHeight;
        var reach = Math.max(36, cu.uCScale.value[s] * 1.4 * pxPerUnitAt1 / depth);
        var d = Math.hypot(sx - clientX, sy - clientY);
        if (d < reach && d < bestD){ best = s; bestD = d; }
      }
      return best;
    }

    function clearClusterFlags(){
      for (var s = 0; s < CLUSTER_SLOTS; s++){ cu.uCSpawn.value[s] = 0; cu.uCClear.value[s] = 0; cu.uCBurst.value[s] = 0; }
    }

    // ---------- controls ----------
    var speedInput = document.getElementById('speed'), speedOut = document.getElementById('speedOut');
    var radiusInput = document.getElementById('radius'), radiusOut = document.getElementById('radiusOut');
    var speedMul = 0.3, bhRadiusPx = 150;
    function paintFill(input){
      var pct = (input.value - input.min) / (input.max - input.min) * 100;
      input.style.setProperty('--fill', pct + '%');
    }
    function readControls(){
      speedMul = parseFloat(speedInput.value);
      bhRadiusPx = parseFloat(radiusInput.value);
      speedOut.textContent = speedMul.toFixed(1) + '×';
      radiusOut.textContent = bhRadiusPx === 0 ? 'off' : bhRadiusPx + 'px';
      paintFill(speedInput); paintFill(radiusInput);
    }
    speedInput.addEventListener('input', readControls);
    var previewTimer = 0;
    radiusInput.addEventListener('input', function(){
      readControls();
      // show the new size where the cursor last was, even though the pointer is on the slider
      bhEl.classList.add('preview', 'on');
      clearTimeout(previewTimer);
      previewTimer = setTimeout(function(){ bhEl.classList.remove('preview'); }, 900);
    });
    readControls();

    // ---------- black-hole cursor overlay ----------
    var bhEl = document.getElementById('bh');
    var bhReach = bhEl.querySelector('.bh-reach'), bhCore = bhEl.querySelector('.bh-core');
    var bhX = window.innerWidth / 2, bhY = window.innerHeight / 2;   // eased screen position
    var ptrX = bhX, ptrY = bhY;                                        // raw pointer position
    var ptrOnCanvas = false;
    var bhStrength = 0;
    function drawBlackHole(){
      var show = (ptrOnCanvas && !orbiting && bhRadiusPx > 0) || bhEl.classList.contains('preview');
      bhEl.classList.toggle('on', show && bhRadiusPx > 0);
      bhEl.style.transform = 'translate(' + bhX + 'px,' + bhY + 'px)';
      var reach = bhRadiusPx * 2, core = Math.max(10, bhRadiusPx * BH_HORIZON * 2);
      bhReach.style.width = bhReach.style.height = reach + 'px';
      bhCore.style.width = bhCore.style.height = core + 'px';
    }

    // ---------- pointer input ----------
    // left click/tap (press+release, little movement) = gather / release
    // right-drag (mouse) or two-finger drag (touch) = orbit; wheel / pinch = zoom
    var orbiting = false, orbitId = null, lastX = 0, lastY = 0;
    var downX = 0, downY = 0, downAt = 0, downId = null, lastTapAt = 0;
    var touches = {}, touchCount = 0, pinchDist = 0, pinchCX = 0, pinchCY = 0;

    function touchCentroid(){
      var ids = Object.keys(touches), a = touches[ids[0]], b = touches[ids[1]];
      return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, d: Math.hypot(a.x - b.x, a.y - b.y) };
    }

    canvas.addEventListener('contextmenu', function(e){ e.preventDefault(); });

    canvas.addEventListener('pointerdown', function(e){
      if (e.pointerType === 'touch'){
        touches[e.pointerId] = { x: e.clientX, y: e.clientY };
        touchCount++;
        if (touchCount === 2){
          downId = null;              // a second finger cancels the tap
          ptrOnCanvas = false;
          orbiting = true;
          var c = touchCentroid(); pinchCX = c.x; pinchCY = c.y; pinchDist = c.d;
          return;
        }
      }
      if (e.pointerType === 'mouse' && e.button === 2){
        orbiting = true; orbitId = e.pointerId;
        lastX = e.clientX; lastY = e.clientY;
        canvas.setPointerCapture(e.pointerId);
        canvas.classList.add('orbiting');
        return;
      }
      if (e.button !== 0) return;
      ptrX = e.clientX; ptrY = e.clientY; ptrOnCanvas = true;
      if (e.pointerType === 'touch'){ bhX = ptrX; bhY = ptrY; }
      downX = e.clientX; downY = e.clientY; downAt = performance.now(); downId = e.pointerId;
    });

    window.addEventListener('pointermove', function(e){
      if (e.pointerType === 'touch' && touches[e.pointerId]){
        touches[e.pointerId].x = e.clientX; touches[e.pointerId].y = e.clientY;
        if (touchCount >= 2){
          var c = touchCentroid();
          orbitBy(c.x - pinchCX, c.y - pinchCY);
          if (pinchDist > 0 && c.d > 0) zoomBy(pinchDist / c.d);
          pinchCX = c.x; pinchCY = c.y; pinchDist = c.d;
          return;
        }
      }
      if (orbiting && e.pointerId === orbitId){
        orbitBy(e.clientX - lastX, e.clientY - lastY);
        lastX = e.clientX; lastY = e.clientY;
        return;
      }
      ptrX = e.clientX; ptrY = e.clientY;
      if (e.pointerType === 'mouse') ptrOnCanvas = e.target === canvas;
    }, { passive: true });

    function endTouch(e){
      if (!touches[e.pointerId]) return;
      delete touches[e.pointerId];
      touchCount = Math.max(0, touchCount - 1);
      if (touchCount < 2) orbiting = false;
      if (touchCount === 0) ptrOnCanvas = false;
    }

    canvas.addEventListener('pointerup', function(e){
      if (e.pointerType === 'touch') endTouch(e);
      if (e.pointerType === 'mouse' && e.button === 2){
        orbiting = false; orbitId = null;
        canvas.classList.remove('orbiting');
        return;
      }
      // each release must pair with its own press, and taps closer than 250ms are ignored
      if (downId === null || e.pointerId !== downId) return;
      downId = null;
      var now = performance.now();
      var moved = Math.abs(e.clientX - downX) + Math.abs(e.clientY - downY);
      if (moved > 14 || now - downAt > 700 || now - lastTapAt < 250) return;
      lastTapAt = now;
      // clicking a self-formed cluster disperses it; otherwise, while a clicked shape exists any
      // click releases it, and a click on empty field forms a new one
      var hit = clusterAt(e.clientX, e.clientY);
      if (hit >= 0) dissolveCluster(hit, clock.elapsedTime);
      else if (formed) releaseShape();
      else formShapeAt(e.clientX, e.clientY, clock.elapsedTime);
    });
    canvas.addEventListener('pointercancel', function(e){
      if (e.pointerType === 'touch') endTouch(e);
      if (e.pointerId === orbitId){ orbiting = false; orbitId = null; canvas.classList.remove('orbiting'); }
      if (e.pointerId === downId) downId = null;
    });
    canvas.addEventListener('pointerleave', function(e){ if (e.pointerType === 'mouse' && !orbiting) ptrOnCanvas = false; });
    window.addEventListener('blur', function(){ ptrOnCanvas = false; orbiting = false; canvas.classList.remove('orbiting'); });

    canvas.addEventListener('wheel', function(e){
      e.preventDefault();
      zoomBy(Math.exp(e.deltaY * 0.0012));
    }, { passive: false });

    // ---------- loop ----------
    var clock = new THREE.Clock();
    var flowTime = 0;

    function animate(){
      requestAnimationFrame(animate);
      frame(Math.min(clock.getDelta(), 0.05), clock.elapsedTime);
    }

    function frame(delta, t){
      uDt.value = delta * 60;
      uTime.value = t;

      updateCamera();

      // rotation-speed slider scales the whole field's motion: wander speed, how fast
      // headings turn, and the shape's spin
      flowTime += delta * speedMul;
      rotTime += delta * speedMul;
      velUniforms.uFlowTime.value = flowTime;
      velUniforms.uWanderSpeed.value = WANDER_SPEED * speedMul;

      if (formed){
        rotEuler.set(rotTime * 0.11, rotTime * 0.17, rotTime * 0.05);
        rotMat4.makeRotationFromEuler(rotEuler);
        velUniforms.uRot.value.setFromMatrix4(rotMat4);
      }

      // black hole: eased on/off, overlay trails the pointer slightly, cone follows the overlay
      var bhActive = ptrOnCanvas && !orbiting && bhRadiusPx > 0;
      bhStrength += ((bhActive ? 1 : 0) - bhStrength) * 0.1;
      bhX += (ptrX - bhX) * 0.35;
      bhY += (ptrY - bhY) * 0.35;
      var ray = rayFromClient(bhX, bhY);
      uBHOrigin.value.copy(ray.origin);
      uBHDir.value.copy(ray.direction);
      uBHTan.value = bhRadiusPx * 2 * tanHalfFov / window.innerHeight;
      uBHOn.value = bhStrength;
      drawBlackHole();

      updateClusters(t, delta);
      velUniforms.uBurst.value = pendingBurst ? 1 : 0;
      simulate();
      pendingBurst = false;
      clearClusterFlags();

      renderUniforms.tPos.value = posRT[cur].texture;
      renderUniforms.tVel.value = velRT[cur].texture;
      renderer.render(scene, camera);
      drawMeteors(delta, t);
    }

    // ---------- shooting stars (2D overlay) ----------
    // 1-3 at a time, launched at random intervals from just off one edge and streaking
    // all the way across the screen with a fading tail.
    var meteorCanvas = document.getElementById('meteors');
    var mctx = meteorCanvas.getContext('2d');
    var meteors = [];
    var nextMeteorAt = 3 + Math.random() * 5;
    var meteorTints = ['255,255,255', '186,230,253', '245,208,254', '254,240,138'];
    function sizeMeteors(){
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      meteorCanvas.width = Math.round(window.innerWidth * dpr);
      meteorCanvas.height = Math.round(window.innerHeight * dpr);
      mctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    sizeMeteors();
    window.addEventListener('resize', sizeMeteors);

    function launchMeteor(){
      var W = window.innerWidth, H = window.innerHeight, diag = Math.hypot(W, H);
      // mostly downward diagonals, either way, occasionally steeper or shallower
      var ang = (Math.random() < 0.5 ? 0.35 : Math.PI - 0.35) + (Math.random() - 0.5) * 0.7;
      var dx = Math.cos(ang), dy = Math.sin(ang);
      // start off-screen behind the centre line, offset sideways so paths cover the whole screen
      var off = (Math.random() - 0.5) * diag * 0.8;
      var sx = W / 2 - dx * (diag / 2 + 80) - dy * off;
      var sy = H / 2 - dy * (diag / 2 + 80) + dx * off;
      meteors.push({
        x: sx, y: sy, dx: dx, dy: dy,
        speed: 700 + Math.random() * 800,
        tail: 110 + Math.random() * 190,
        width: 1 + Math.random() * 1.2,
        tint: meteorTints[Math.floor(Math.random() * meteorTints.length)],
        dist: 0, total: diag + 160 + 300
      });
    }

    function drawMeteors(delta, t){
      mctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      if (prefersReducedMotion) return;
      if (t > nextMeteorAt){
        if (meteors.length < METEOR_MAX) launchMeteor();
        nextMeteorAt = t + 5 + Math.random() * 10;
      }
      for (var m = meteors.length - 1; m >= 0; m--){
        var s = meteors[m];
        s.dist += s.speed * delta;
        if (s.dist > s.total){ meteors.splice(m, 1); continue; }
        var hx = s.x + s.dx * s.dist, hy = s.y + s.dy * s.dist;
        var tl = Math.min(s.tail, s.dist);
        var tx = hx - s.dx * tl, ty = hy - s.dy * tl;
        var life = Math.min(1, s.dist / 200) * Math.min(1, (s.total - s.dist) / 200);
        var g = mctx.createLinearGradient(tx, ty, hx, hy);
        g.addColorStop(0, 'rgba(' + s.tint + ',0)');
        g.addColorStop(1, 'rgba(' + s.tint + ',' + (0.85 * life) + ')');
        mctx.strokeStyle = g;
        mctx.lineWidth = s.width;
        mctx.lineCap = 'round';
        mctx.beginPath(); mctx.moveTo(tx, ty); mctx.lineTo(hx, hy); mctx.stroke();
        var glow = mctx.createRadialGradient(hx, hy, 0, hx, hy, 3.5 * s.width);
        glow.addColorStop(0, 'rgba(255,255,255,' + (0.9 * life) + ')');
        glow.addColorStop(1, 'rgba(' + s.tint + ',0)');
        mctx.fillStyle = glow;
        mctx.beginPath(); mctx.arc(hx, hy, 3.5 * s.width, 0, Math.PI * 2); mctx.fill();
      }
    }
    animate();
  }

  // ======================================================================================
  //  V2 — the spacecraft
  // ======================================================================================
  function runV2(){
    var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var isSmall = window.innerWidth < 620;
    var isTouch = window.matchMedia && window.matchMedia('(hover: none), (pointer: coarse)').matches;

    // ---------- particle budget ----------
    // Physics lives in GPU textures: one texel per particle, SIM_SIZE^2 particles.
    // The particles fill a cube (FIELD_HALF) centred on the spacecraft that wraps on every
    // axis, so the field is endless in every direction the craft flies. Kept fairly sparse
    // so it reads as open space. 700 -> 490k particles. Override with ?n=768 etc.
    var params = new URLSearchParams(window.location.search);
    var SIM_SIZE = parseInt(params.get('n'), 10) || (isSmall ? 493 : 700);
    SIM_SIZE = Math.max(32, Math.min(SIM_SIZE, 2048));
    var PARTICLE_COUNT = SIM_SIZE * SIM_SIZE;

    // ---------- tuning knobs ----------
    var FIELD_HALF     = isSmall ? 20 : 24;                    // particle cube half-size around the craft (wraps on all axes)
    var MOTION_SPEED   = 0.3;                                  // overall pace of the field's own motion (wander, cluster spin)
    var WANDER_SPEED   = prefersReducedMotion ? 0.003 : 0.007; // each particle's own random drift, units/frame (x MOTION_SPEED)
    var FLOW_RESPONSE  = 0.08;                                 // how quickly free particles settle back into their wander
    var SEEK_RESPONSE  = 0.1;                                  // steering responsiveness while gathering into a cluster
    var ARRIVE         = 0.06;                                 // slow-down gain near a cluster target (spring-like)
    var BURST_STRENGTH = prefersReducedMotion ? 0.01 : 0.03;   // small outward nudge when a cluster drifts apart
    var EXPLODE_STRENGTH = prefersReducedMotion ? 0.04 : 0.11; // outward blast when the craft smashes a cluster
    var DISPERSE_SPEED = prefersReducedMotion ? 0.02 : 0.045;  // max glide speed while dispersing
    var DISPERSE_RESPONSE = 0.03;                              // steering while dispersing (low = soft, drifting turns)
    var DISPERSE_FADE  = 0.005;                                // per-frame rate a dispersing particle hands back to the wander (~3s)
    var POINT_SIZE     = isSmall ? 0.05 : 0.04;                // world-space sprite size
    var CLUSTER_SEEK   = 0.08;                                 // how fast particles stream into a forming cluster
    var CLUSTER_STAGGER = 1.5;                                 // seconds over which a cluster's particles set off
    var CLUSTER_EVERY  = [2.5, 5];                             // seconds between new obstacle clusters (min, max)
    var CLUSTER_SIZE   = [0.3, 1.6];                           // obstacle shape radius range, world units
    var METEOR_MAX     = 3;                                    // shooting stars on screen at once
    var METEOR_EVERY   = [4, 12];                              // seconds between shooting stars (avg 8)

    // spacecraft (speeds in world units per 60fps frame)
    var CRAFT_SCALE    = 0.75;                                 // model size
    // speed comes from the loops: cruise at BASE_SPEED, x LOOP_SPEEDUP for every loop flown
    // through, back to BASE_SPEED on any hit. Once it reaches SPEED_CAP it holds there, and each
    // further loop is laid a little smaller instead (see LOOP_SHRINK). Auto-cruise ramps up
    // gradually to SPEED_CAP (AUTO_RAMP_SECONDS); switching to Manual keeps the current speed.
    // Shift (or the Boost button on touch screens) multiplies whatever the speed is by up to BOOST, briefly.
    var BASE_SPEED     = 0.08;
    var LOOP_SPEEDUP   = 1.1;
    var SPEED_CAP      = 0.2;                                  // ~2,160 km/h on the readout
    var AUTO_RAMP_SECONDS = 20;                                // Auto-cruise: cruise -> max speed over this long
    var BOOST          = 1.6;                                  // Shift: speed x this while held (eases in / out)
    var KMH_PER_SPEED  = 10800;                                // display: 1 world unit = 50 m, so units/frame x 60 x 50 x 3.6
    var CRAFT_TURN     = 0.032;                                // yaw rate while holding left/right (rad/frame)
    var TURN_EASE      = 0.09;                                 // how quickly the turn rate eases toward the input (smooths steering)
    var CRAFT_HIT_RADIUS = 0.45;                               // collision size against clusters
    var WAKE_RADIUS    = [1.6, 6];                             // bow-wave reach at rest / at high speed
    var STREAK_FRAMES  = 9;                                    // dashes show this many frames of motion (relative to the camera)
    var STREAK_MAX_PX  = 90;                                   // longest dash on screen
    var RATTLE_TIME    = 2.6;                                  // seconds the craft shakes after a crash
    var CHASE_BACK = 5.2, CHASE_UP = 1.4, LOOK_AHEAD = 5, LOOK_UP = 0.2; // chase camera (craft sits a bit below centre)
    var BASE_FOV = 50, SPEED_FOV = 22;                         // field of view widens with speed

    // the course: waypoints joined by a particle tube you fly through (the only shape you can pass through)
    var LOOP_COLOR     = 0x39ff14;                             // reserved: nothing else in the scene uses this green
    var LOOP_RADIUS    = 2.2;                                  // tube radius at each waypoint (the scoring opening is this minus the wall)
    var LOOP_TUBE      = 0.14;                                 // wall thickness for collisions
    var LOOP_SPACING   = [26, 40];                             // distance between consecutive loops at cruise speed...
    var LOOP_SPACING_MAX_STRETCH = 4;                          // ...stretched with speed (up to this x) so there's time to steer
    var LOOP_FIRST     = 22;                                   // how far ahead a new course starts
    var LOOPS_AHEAD    = 4;                                    // loops laid out ahead at any time
    var LOOP_SHRINK    = 0.96;                                 // at the speed cap, each new loop is this much smaller...
    var LOOP_MIN_RADIUS = 1.05;                                // ...down to this: the scoring zone (~0.7) is still ~1.8x the craft's half-wingspan (0.4)
    var LOOP_WANDER    = 160;                                  // stray this far from the course (x stretch) and it restarts ahead
    var ROUTE_CLEARANCE = 3.5;                                 // obstacles keep at least this (+ their own size) off the loop line

    // distant galaxies you can fly toward
    var LANDMARK_COUNT = 4;
    var LANDMARK_DIST  = [420, 900];                           // how far ahead new ones appear
    var LANDMARK_RECYCLE = 1700;                               // replaced once this far away
    // galaxy rivers: a couple of enormous flowing bands of stars far off in the background
    var RIVER_COUNT    = 2;
    var RIVER_DIST     = [1400, 2200];
    var RIVER_RECYCLE  = 3600;
    var GALAXY_SCALE   = 4.5;                                  // distant galaxies are drawn this many times their base size
    var RIVER_SCALE    = 2.5;                                  // ...and the galaxy rivers this many times
    var LANDMARK_REVEAL = 9;                                   // seconds a new galaxy / river takes to build up, star by star

    // ---------- renderer / scene / camera ----------
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x05060a, 1);

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(BASE_FOV, 1, 0.1, 12000);   // far enough for the scaled-up galaxy rivers
    camera.position.set(0, CHASE_UP, CHASE_BACK);

    // ---------- float render target support ----------
    var gl = renderer.getContext();
    if (renderer.capabilities.isWebGL2) {
      renderer.extensions.get('EXT_color_buffer_float');
    } else {
      renderer.extensions.get('OES_texture_float');
      renderer.extensions.get('OES_texture_half_float');
      renderer.extensions.get('WEBGL_color_buffer_float');
    }
    function makeRT(type){
      return new THREE.WebGLRenderTarget(SIM_SIZE, SIM_SIZE, {
        minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter,
        wrapS: THREE.ClampToEdgeWrapping, wrapT: THREE.ClampToEdgeWrapping,
        format: THREE.RGBAFormat, type: type,
        depthBuffer: false, stencilBuffer: false
      });
    }
    function pickSimType(){
      var candidates = [THREE.FloatType, THREE.HalfFloatType];
      for (var i = 0; i < candidates.length; i++){
        var rt = makeRT(candidates[i]);
        renderer.setRenderTarget(rt);
        var ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
        renderer.setRenderTarget(null);
        rt.dispose();
        if (ok) return candidates[i];
      }
      return null;
    }
    var SIM_TYPE = pickSimType();
    if (SIM_TYPE === null){
      showFallback('<strong>This GPU can\'t render to float textures.</strong><br>Constellations\' GPU physics needs them &mdash; try a different browser or device.');
      return;
    }

    // ---------- sizing / bounds ----------
    var tanHalfFov = 1;
    var bounds = new THREE.Vector3(FIELD_HALF, FIELD_HALF, FIELD_HALF);
    var pointScale = 1;
    var renderUniforms = null;

    // also called every frame the field of view changes with speed
    function applyProjection(){
      var w = window.innerWidth, h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      tanHalfFov = Math.tan(camera.fov * Math.PI / 360);
      pointScale = (h * renderer.getPixelRatio()) / (2 * tanHalfFov);
      if (renderUniforms){
        renderUniforms.uScale.value = pointScale;
        renderUniforms.uViewport.value.set(w * renderer.getPixelRatio(), h * renderer.getPixelRatio());
      }
    }
    function sizeToWindow(){
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      applyProjection();
    }
    sizeToWindow();

    // ---------- faint starfield backdrop ----------
    // Far away, travels with the camera (so it never runs out), and drawn first as a
    // background so galaxies and loops always sit in front of it.
    var stars = (function makeStars(){
      var starCount = isSmall ? 700 : 1300;
      var pos = new Float32Array(starCount * 3);
      for (var i = 0; i < starCount; i++){
        var r = 1500 + Math.random() * 300;
        var theta = Math.random() * Math.PI * 2;
        var phi = Math.acos(2 * Math.random() - 1);
        pos[i*3]   = r * Math.sin(phi) * Math.cos(theta);
        pos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
        pos[i*3+2] = r * Math.cos(phi);
      }
      var g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      var m = new THREE.PointsMaterial({ color: 0x5c6377, size: 2.4, sizeAttenuation: true, depthWrite: false });
      var p = new THREE.Points(g, m);
      p.renderOrder = -10;
      p.frustumCulled = false;
      scene.add(p);
      return p;
    })();

    // ---------- initial GPU data ----------
    function floatTex(data){
      var t = new THREE.DataTexture(data, SIM_SIZE, SIM_SIZE, THREE.RGBAFormat, THREE.FloatType);
      t.minFilter = THREE.NearestFilter;
      t.magFilter = THREE.NearestFilter;
      t.needsUpdate = true;
      return t;
    }

    var initPos  = new Float32Array(PARTICLE_COUNT * 4);
    var initVel  = new Float32Array(PARTICLE_COUNT * 4);
    var seedData = new Float32Array(PARTICLE_COUNT * 4);

    for (var i = 0; i < PARTICLE_COUNT; i++){
      var k = i * 4;
      initPos[k]   = (Math.random() * 2 - 1) * bounds.x;
      initPos[k+1] = (Math.random() * 2 - 1) * bounds.y;
      initPos[k+2] = (Math.random() * 2 - 1) * bounds.z;
      initPos[k+3] = 0;                   // w = cluster slot the particle belongs to (0 = none)
      seedData[k]   = Math.random();      // speed variety
      seedData[k+1] = Math.random();      // spare
      seedData[k+2] = Math.random();      // phase / color pick
      seedData[k+3] = Math.random();      // size / burst variety
    }

    var seedTex = floatTex(seedData);
    seedData = null;

    // ---------- GPGPU ping-pong setup ----------
    var simScene = new THREE.Scene();
    var simCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    var simMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2));
    simMesh.frustumCulled = false;
    simScene.add(simMesh);

    var SIM_VERT = [
      'varying vec2 vUv;',
      'void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }'
    ].join('\n');

    function simMaterial(uniforms, frag){
      return new THREE.ShaderMaterial({
        uniforms: uniforms, vertexShader: SIM_VERT, fragmentShader: frag,
        depthTest: false, depthWrite: false
      });
    }

    var copyMat = simMaterial({ tSrc: { value: null } }, [
      'uniform sampler2D tSrc; varying vec2 vUv;',
      'void main(){ gl_FragColor = texture2D(tSrc, vUv); }'
    ].join('\n'));

    var posRT = [makeRT(SIM_TYPE), makeRT(SIM_TYPE)];
    var velRT = [makeRT(SIM_TYPE), makeRT(SIM_TYPE)];
    var cur = 0;

    function blit(srcTex, rt){
      copyMat.uniforms.tSrc.value = srcTex;
      simMesh.material = copyMat;
      renderer.setRenderTarget(rt);
      renderer.render(simScene, simCam);
    }
    (function seedTargets(){
      var p0 = floatTex(initPos), v0 = floatTex(initVel);
      blit(p0, posRT[0]); blit(p0, posRT[1]);
      blit(v0, velRT[0]); blit(v0, velRT[1]);
      renderer.setRenderTarget(null);
      p0.dispose(); v0.dispose();
      initPos = initVel = null;
    })();

    // shared uniforms (same objects in every pass that uses them)
    var uDt = { value: 1 };
    var uTime = { value: 0 };
    var uBounds = { value: bounds };
    var uFieldCenter = { value: new THREE.Vector3() };   // the wrap cube follows the craft
    var uShift = { value: new THREE.Vector3() };         // one-frame world re-centre (see rebaseWorld)

    var COMMON_GLSL = 'float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453); }';

    // ---------- autonomous clusters (GPU-side) ----------
    // Up to CLUSTER_SLOTS clusters form on their own. Membership lives in the position
    // texture's w (slot 1..N, 0 = free): on a cluster's spawn frame every free particle of the
    // chosen colour inside its capture radius joins; on its clear frame they're let go.
    // Targets are procedural shape surfaces, so no CPU readback or texture uploads are needed.
    var CLUSTER_SLOTS = 5;
    function arr(make){ var a = []; for (var s = 0; s < CLUSTER_SLOTS; s++) a.push(make()); return a; }
    function filled(v){ return arr(function(){ return v; }); }
    var clusterUniforms = {
      uCCenter: { value: arr(function(){ return new THREE.Vector3(); }) },
      uCRot:    { value: arr(function(){ return new THREE.Matrix3(); }) },
      uCStart:  { value: filled(0) }, uCState: { value: filled(0) },   // state: 0 idle, 1 forming/holding, 2 dissolving
      uCShape:  { value: filled(0) }, uCScale: { value: filled(1) }, uCSeed: { value: filled(0) },
      uCRadius: { value: filled(0) }, uCColor: { value: filled(-1) }, uCTake: { value: filled(1) },
      uCSpawn:  { value: filled(0) }, uCClear: { value: filled(0) },
      uCBurst:  { value: filled(0) }    // one-frame outward kick strength (drift apart vs explosion)
    };
    var N = String(CLUSTER_SLOTS);
    var CL_GLSL = [
      'uniform vec3 uCCenter[' + N + ']; uniform mat3 uCRot[' + N + '];',
      'uniform float uCStart[' + N + ']; uniform float uCState[' + N + ']; uniform float uCShape[' + N + '];',
      'uniform float uCScale[' + N + ']; uniform float uCSeed[' + N + '];',
      'uniform float uCRadius[' + N + ']; uniform float uCColor[' + N + ']; uniform float uCTake[' + N + '];',
      'uniform float uCSpawn[' + N + ']; uniform float uCClear[' + N + ']; uniform float uCBurst[' + N + '];',
      // copy one slot's data (1-based); loop form keeps array indexing legal on WebGL1
      'void clusterData(float slot, out vec3 c, out mat3 r, out float start, out float state, out float shape, out float scale, out float seed, out float burst){',
      '  c = vec3(0.0); r = mat3(1.0); start = 0.0; state = 0.0; shape = 0.0; scale = 1.0; seed = 0.0; burst = 0.0;',
      '  for (int i = 0; i < ' + N + '; i++){',
      '    if (abs(float(i + 1) - slot) < 0.5){',
      '      c = uCCenter[i]; r = uCRot[i]; start = uCStart[i]; state = uCState[i];',
      '      shape = uCShape[i]; scale = uCScale[i]; seed = uCSeed[i]; burst = uCBurst[i];',
      '    }',
      '  }',
      '}',
      // same colour pick as the render shader: 0 sky, 1 orchid, 2 amber
      'float colorClass(vec4 s){ float pick = fract(s.z * 17.0 + s.w * 5.0); return pick < 0.45 ? 0.0 : (pick < 0.8 ? 1.0 : 2.0); }'
    ].join('\n');

    // procedural shape surfaces, roughly unit radius; h/h3 are per-particle randoms,
    // seed is the cluster's own random, t is time (for shapes that shimmer).
    // pm (0..1, derived from the seed) varies each shape's proportions -- tube thickness,
    // knot type, arm count, turns, star count -- so no two clusters look alike. On top of that,
    // each cluster's rotation matrix carries an uneven per-axis stretch (see spawnCluster).
    var SHAPE_GLSL = [
      'vec3 cNode(float seed, float i){',                            // constellation star i
      '  return (vec3(hash(vec2(seed, i)), hash(vec2(seed + 1.3, i)), hash(vec2(seed + 2.7, i))) * 2.0 - 1.0)',
      '         * vec3(1.0, 0.75, 0.2);',
      '}',
      'vec3 shapePoint(float type, vec2 h, float h3, float seed, float t){',
      '  float u = h.x, v = h.y;',
      '  float pm = fract(seed * 0.3719);',
      '  if (type > 7.5 && type < 8.5){',                           // constellation
      // 4-8 stars joined in a path: ~45% of particles pile onto the stars (bright points),
      // the rest sit on the joining lines, quantised into faint dotted links
      '    float links = 3.0 + floor(pm * 5.0);',
      '    float k = floor(h3 * links);',
      '    vec3 a = cNode(seed, k), b = cNode(seed, k + 1.0);',
      '    if (v < 0.45){',
      '      vec3 star = h3 < 0.5 ? a : b;',
      '      return star + (vec3(u, fract(u * 7.3), fract(u * 3.1)) - 0.5) * 0.07;',
      '    }',
      '    float s = (floor(u * 12.0) + 0.5) / 12.0;',
      '    return mix(a, b, s) + (vec3(fract(v * 5.7), fract(v * 9.3), fract(v * 2.9)) - 0.5) * 0.02;',
      '  }',
      '  if (type > 8.5){',                                          // star river
      // a winding, narrow band, densest along its centre line, with a gentle shimmer along its length
      '    float s = u + 0.025 * sin(t * 0.6 + v * 23.0);',
      '    float w = v - 0.5; float off = w * w * w * 4.0 * (0.3 + pm * 0.4);',
      '    return vec3((s * 2.0 - 1.0) * 1.4,',
      '                (0.15 + 0.35 * pm) * sin(s * (4.0 + pm * 6.0) + seed) + off,',
      '                0.22 * sin(s * 4.7 + seed * 1.7) + (h3 - 0.5) * 0.05);',
      '  }',
      '  if (type < 0.5){',                                         // sphere (an ellipsoid once stretched)
      '    float z = 2.0*u - 1.0, a = 6.2831*v, r = sqrt(max(0.0, 1.0 - z*z));',
      '    return vec3(r*cos(a), r*sin(a), z);',
      '  } else if (type < 1.5){',                                  // torus: thin hoop to fat donut
      '    float tube = 0.1 + pm * 0.35, R = 1.0 - tube;',
      '    float a = 6.2831*u, b = 6.2831*v;',
      '    return vec3((R + tube*cos(b))*cos(a), (R + tube*cos(b))*sin(a), tube*sin(b));',
      '  } else if (type < 2.5){',                                  // box shell
      '    float face = floor(h3 * 6.0); vec2 q = vec2(u, v) * 2.0 - 1.0; vec3 p;',
      '    if (face < 1.0) p = vec3(1.0, q); else if (face < 2.0) p = vec3(-1.0, q);',
      '    else if (face < 3.0) p = vec3(q.x, 1.0, q.y); else if (face < 4.0) p = vec3(q.x, -1.0, q.y);',
      '    else if (face < 5.0) p = vec3(q, 1.0); else p = vec3(q, -1.0);',
      '    return p * 0.65;',
      '  } else if (type < 3.5){',                                  // torus knot: (2,3), (2,5) or (3,4)
      '    float P = pm < 0.34 ? 2.0 : (pm < 0.67 ? 2.0 : 3.0), Q = pm < 0.34 ? 3.0 : (pm < 0.67 ? 5.0 : 4.0);',
      '    float t = 6.2831*u; float r = 0.55 + 0.25*cos(Q*t);',
      '    vec3 c = vec3(r*cos(P*t), r*sin(P*t), 0.3*sin(Q*t));',
      '    return c + (vec3(v, h3, fract(v*7.31 + h3*3.7)) - 0.5) * 0.16;',
      '  } else if (type < 4.5){',                                  // spiral galaxy: 2-5 arms, loose to tight
      '    float arms = 2.0 + floor(pm * 4.0);',
      '    float arm = floor(h3 * arms); float r = pow(u, 0.7);',
      '    float a = r * (3.0 + pm * 5.0) + arm * 6.2831 / arms + (v - 0.5) * 0.6;',
      '    return vec3(r*cos(a), r*sin(a), (fract(v*13.7) - 0.5) * 0.08 * (1.0 - r));',
      '  } else if (type < 5.5){',                                  // ring / band
      '    float a = 6.2831*u; float r = 1.0 + (v - 0.5) * (0.05 + pm * 0.3);',
      '    return vec3(r*cos(a), r*sin(a), (h3 - 0.5) * (0.04 + pm * 0.2));',
      '  } else if (type < 6.5){',                                  // double helix: 1-3 turns
      '    float turns = 1.0 + pm * 2.0;',
      '    float y = u*2.0 - 1.0; float a = y * 3.1416 * turns + (h3 < 0.5 ? 0.0 : 3.1416);',
      '    float rad = 0.25 + pm * 0.25;',
      '    return vec3(rad*cos(a), y, rad*sin(a)) + (vec3(v, fract(v*9.1), fract(v*5.3)) - 0.5) * 0.06;',
      '  }',
      '  float z = 2.0*u - 1.0, a = 6.2831*v, r = sqrt(max(0.0, 1.0 - z*z));', // octahedron
      '  vec3 p = vec3(r*cos(a), r*sin(a), z);',
      '  return p / (abs(p.x) + abs(p.y) + abs(p.z));',
      '}'
    ].join('\n');

    // velocity pass: random wander, spacecraft wake, cluster gathering, drift-apart / explosions
    var velUniforms = {
      tPos: { value: null }, tVel: { value: null }, tSeed: { value: seedTex },
      uTime: uTime, uDt: uDt, uBounds: uBounds,
      uFlowTime: { value: 0 },
      uWanderSpeed: { value: WANDER_SPEED * MOTION_SPEED }, uFlowResponse: { value: FLOW_RESPONSE },
      uDisperseResponse: { value: DISPERSE_RESPONSE }, uDisperseFade: { value: DISPERSE_FADE },
      uSeekResponse: { value: SEEK_RESPONSE }, uArrive: { value: ARRIVE },
      uDisperseSpeed: { value: DISPERSE_SPEED },
      uClusterSeek: { value: CLUSTER_SEEK }, uClusterStagger: { value: CLUSTER_STAGGER },
      uCraftPos: { value: new THREE.Vector3() }, uCraftVel: { value: new THREE.Vector3() },
      uWakeRadius: { value: WAKE_RADIUS[0] }, uShift: uShift
    };
    Object.keys(clusterUniforms).forEach(function(key){ velUniforms[key] = clusterUniforms[key]; });
    var velMat = simMaterial(velUniforms, [
      'uniform sampler2D tPos; uniform sampler2D tVel; uniform sampler2D tSeed;',
      'uniform float uTime; uniform float uFlowTime; uniform float uDt;',
      'uniform float uWanderSpeed; uniform float uFlowResponse; uniform float uSeekResponse;',
      'uniform float uDisperseResponse; uniform float uDisperseFade; uniform float uDisperseSpeed;',
      'uniform float uArrive; uniform float uClusterSeek; uniform float uClusterStagger;',
      'uniform vec3 uBounds; uniform vec3 uCraftPos; uniform vec3 uCraftVel; uniform float uWakeRadius; uniform vec3 uShift;',
      'varying vec2 vUv;',
      COMMON_GLSL,
      CL_GLSL,
      SHAPE_GLSL,

      'void main(){',
      '  vec4 P = texture2D(tPos, vUv);',
      '  vec4 V = texture2D(tVel, vUv);',
      '  vec4 S = texture2D(tSeed, vUv);',
      '  vec3 pos = P.xyz - uShift; vec3 vel = V.xyz;',   // uShift: see rebaseWorld()
      '  float slot = P.w;',
      '  vec3 cC; mat3 cR; float cStart, cState, cShape, cScale, cSeed, cBurst;',
      '  clusterData(slot, cC, cR, cStart, cState, cShape, cScale, cSeed, cBurst);',
      '  float seeking = (slot > 0.5 && abs(cState - 1.0) < 0.5) ? 1.0 : 0.0;',

      // free roaming: every particle wanders on its own path. Its heading is three slow sine
      // waves with per-particle frequencies and phases, so directions are independent and
      // keep turning (no shared currents), and the cloud stays evenly spread.
      '  vec3 fr = 0.12 + 0.3 * vec3(S.x, S.w, hash(vUv + 0.47));',
      '  float ph = S.z * 6.2831;',
      '  vec3 heading = vec3(sin(uFlowTime * fr.x + ph),',
      '                      sin(uFlowTime * fr.y + ph * 1.7 + 1.3),',
      '                      sin(uFlowTime * fr.z + ph * 2.3 + 2.1));',
      '  vec3 desired = normalize(heading + 1e-4) * uWanderSpeed * (0.5 + S.x);',

      // dispersing (released from a cluster, V.w still high): glide toward a random spot
      // around it, then hand back to the wander as w fades
      '  float dw = (1.0 - seeking) * clamp(V.w, 0.0, 1.0);',
      '  if (dw > 0.001 && slot > 0.5){',
      '    float r = fract(cSeed * 0.1379);',
      '    vec3 home = cC + (vec3(hash(vUv + r + 0.29), hash(vUv + r + 0.53), hash(vUv + r + 0.91)) * 2.0 - 1.0) * 5.0;',
      '    vec3 toHome = home - pos; float hd = length(toHome) + 1e-5;',
      '    vec3 homeV = toHome / hd * min(uDisperseSpeed * (0.6 + 0.8*S.x), hd * 0.02);',
      '    desired = mix(desired, homeV, dw);',
      '  }',
      // fast movers (shoved by the craft, or blasted out of a cluster) keep their momentum for
      // a while, which is what draws them out into streaks
      '  float resp = mix(uFlowResponse, uDisperseResponse, dw);',
      '  resp = mix(resp, 0.02, clamp(length(vel) * 12.0, 0.0, 1.0));',
      '  float kf = 1.0 - pow(1.0 - resp, uDt);',
      '  vec3 freeV = vel + (desired - vel) * kf;',

      // spacecraft wake: a bow wave (wider the faster the craft goes) shoves particles out of
      // the way and flings them back past it, so they peel off in long streaks
      '  vec3 rel = pos - uCraftPos; float cd = length(rel);',
      '  if (seeking < 0.5 && cd < uWakeRadius){',
      '    float wf = 1.0 - cd / uWakeRadius;',
      '    vec3 away = rel / max(cd, 1e-3);',
      '    float cs = min(length(uCraftVel), 1.0);',
      '    vec3 kick = away * (0.02 + cs * 0.35) + normalize(uCraftVel + 1e-5) * cs * 0.2;',
      '    freeV = mix(freeV, kick, wf * wf * 0.65);',
      '  }',

      // one-frame outward kick when a cluster drifts apart (gentle) or is smashed (explosion)
      '  if (cBurst > 0.0 && slot > 0.5){',
      '    vec3 dir = pos - cC;',
      '    dir += (vec3(hash(vUv + 0.19), hash(vUv + 0.61), hash(vUv + 0.43)) - 0.5) * 1.2;',
      '    freeV += normalize(dir + 1e-4) * cBurst * (0.45 + 0.9*S.w);',
      '  }',

      '  vec3 newV = freeV;',
      '  float goal = 0.0;',
      '  if (seeking > 0.5){',
      '    vec3 wob = vec3(sin(uTime*1.3 + S.x*40.0), sin(uTime*1.1 + S.z*40.0), sin(uTime*1.7 + S.w*40.0)) * 0.012;',
      '    vec2 h = vec2(hash(vUv + cSeed), hash(vUv * 1.37 + cSeed + 0.5));',
      '    vec3 tgt = cC + cR * shapePoint(cShape, h, hash(vUv * 2.11 + cSeed + 0.9), cSeed, uTime) * cScale + wob;',
      // clusters gather quickly, particles joining over a second or two
      '    float a = smoothstep(0.0, 1.0, (uTime - cStart - hash(vUv + cSeed + 0.3) * uClusterStagger) * 1.2);',
      '    vec3 to = tgt - pos; float d = length(to) + 1e-5;',
      '    float spd = min(uClusterSeek * (0.7 + 0.6*S.x), d * uArrive);',
      '    float ks = 1.0 - pow(1.0 - uSeekResponse, uDt);',
      '    vec3 seekV = vel + (to / d * spd - vel) * ks;',
      '    newV = mix(freeV, seekV, a);',
      '    goal = a * (1.0 - smoothstep(0.05, 0.8, d));',
      '  }',

      // w = eased "formed" amount: rises as a particle settles into a cluster, falls slowly while dispersing
      '  float kw = 1.0 - pow(1.0 - (goal > V.w ? 0.06 : uDisperseFade), uDt);',
      '  gl_FragColor = vec4(newV, V.w + (goal - V.w) * kw);',
      '}'
    ].join('\n'));

    // position pass: integrate, wrap free particles around the craft, manage cluster membership (w)
    var posUniforms = {
      tPos: { value: null }, tVel: { value: null }, tSeed: { value: seedTex },
      uDt: uDt, uBounds: uBounds, uFieldCenter: uFieldCenter, uShift: uShift
    };
    Object.keys(clusterUniforms).forEach(function(key){ posUniforms[key] = clusterUniforms[key]; });
    var posMat = simMaterial(posUniforms, [
      'uniform sampler2D tPos; uniform sampler2D tVel; uniform sampler2D tSeed;',
      'uniform float uDt; uniform vec3 uBounds; uniform vec3 uFieldCenter; uniform vec3 uShift;',
      'varying vec2 vUv;',
      COMMON_GLSL,
      CL_GLSL,
      'void main(){',
      '  vec4 P = texture2D(tPos, vUv);',
      '  vec4 S = texture2D(tSeed, vUv);',
      '  vec3 old = P.xyz - uShift; float slot = P.w;',
      '  for (int i = 0; i < ' + N + '; i++){',
      '    if (abs(float(i + 1) - slot) < 0.5 && uCClear[i] > 0.5) slot = 0.0;',
      '  }',
      // a newly spawned cluster claims free particles of its colour inside its capture radius
      '  if (slot < 0.5){',
      '    float cls = colorClass(S);',
      '    for (int i = 0; i < ' + N + '; i++){',
      '      if (uCSpawn[i] > 0.5 && distance(old, uCCenter[i]) < uCRadius[i]',
      '          && (uCColor[i] < 0.0 || abs(cls - uCColor[i]) < 0.5)',
      '          && hash(vUv * 3.7 + uCSeed[i]) < uCTake[i]) slot = float(i + 1);',
      '    }',
      '  }',
      '  vec3 cC; mat3 cR; float cStart, cState, cShape, cScale, cSeed, cBurst;',
      '  clusterData(slot, cC, cR, cStart, cState, cShape, cScale, cSeed, cBurst);',
      '  bool seeking = slot > 0.5 && abs(cState - 1.0) < 0.5;',
      '  vec3 pos = old + texture2D(tVel, vUv).xyz * uDt;',
      // the field is a 3D torus centred on the craft: whatever falls behind re-enters ahead
      // (faded out at the faces), so the field never ends however far you fly
      '  if (!seeking) pos = uFieldCenter + mod(pos - uFieldCenter + uBounds, 2.0 * uBounds) - uBounds;',
      '  gl_FragColor = vec4(pos, slot);',
      '}'
    ].join('\n'));

    function simulate(){
      velUniforms.tPos.value = posRT[cur].texture;
      velUniforms.tVel.value = velRT[cur].texture;
      simMesh.material = velMat;
      renderer.setRenderTarget(velRT[1 - cur]);
      renderer.render(simScene, simCam);

      posUniforms.tPos.value = posRT[cur].texture;
      posUniforms.tVel.value = velRT[1 - cur].texture;
      simMesh.material = posMat;
      renderer.setRenderTarget(posRT[1 - cur]);
      renderer.render(simScene, simCam);

      renderer.setRenderTarget(null);
      cur = 1 - cur;
    }

    // ---------- render: one vertex per particle, positions fetched from the sim texture ----------
    var refs = new Float32Array(PARTICLE_COUNT * 2);
    for (i = 0; i < PARTICLE_COUNT; i++){
      refs[i*2]   = ((i % SIM_SIZE) + 0.5) / SIM_SIZE;
      refs[i*2+1] = (Math.floor(i / SIM_SIZE) + 0.5) / SIM_SIZE;
    }
    var geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(PARTICLE_COUNT * 3), 3));
    geometry.setAttribute('reference', new THREE.BufferAttribute(refs, 2));

    renderUniforms = {
      tPos: { value: posRT[cur].texture }, tVel: { value: velRT[cur].texture }, tSeed: { value: seedTex },
      uScale: { value: pointScale }, uSize: { value: POINT_SIZE }, uCamDist: { value: CHASE_BACK },
      uBounds: uBounds, uFieldCenter: uFieldCenter,
      uViewport: { value: new THREE.Vector2(1, 1) }, uStreak: { value: STREAK_FRAMES }, uStreakMax: { value: STREAK_MAX_PX },
      uCamVel: { value: new THREE.Vector3() },
      // three distinct particle colors: sky, orchid, amber
      uColorA: { value: new THREE.Color(0x38bdf8) }, uColorB: { value: new THREE.Color(0xe879f9) },
      uColorC: { value: new THREE.Color(0xfbbf24) }
    };
    var material = new THREE.ShaderMaterial({
      uniforms: renderUniforms,
      vertexShader: [
        'uniform sampler2D tPos; uniform sampler2D tVel; uniform sampler2D tSeed;',
        'uniform float uScale; uniform float uSize; uniform float uCamDist; uniform vec3 uBounds; uniform vec3 uFieldCenter;',
        'uniform vec3 uColorA; uniform vec3 uColorB; uniform vec3 uColorC;',
        'uniform vec2 uViewport; uniform float uStreak; uniform float uStreakMax; uniform vec3 uCamVel;',
        'attribute vec2 reference;',
        'varying vec3 vColor; varying float vAlpha;',
        'varying vec2 vDir; varying float vLen; varying float vSize;',
        'void main(){',
        '  vec3 p = texture2D(tPos, reference).xyz;',
        '  vec4 v = texture2D(tVel, reference);',
        '  vec4 s = texture2D(tSeed, reference);',
        '  float f = clamp(v.w, 0.0, 1.0);',
        '  vec4 mv = modelViewMatrix * vec4(p, 1.0);',
        '  float depth = -mv.z;',
        '  float speed = length(v.xyz);',
        // each particle keeps one of three colors (45% / 35% / 20%), in the field and in clusters
        '  float pick = fract(s.z * 17.0 + s.w * 5.0);',
        '  vec3 baseC = pick < 0.45 ? uColorA : (pick < 0.8 ? uColorB : uColorC);',
        // fast movers (wake streaks, explosions) glow hotter
        '  vColor = baseC * (1.0 + min(speed * 5.0, 0.8));',
        // fades: far away (atmospheric depth), very close to the lens (no giant blobs),
        // and near the field's faces (so particles wrapping across the cube never pop)
        '  float far = 1.0 - 0.8 * smoothstep(uCamDist, uCamDist + 28.0, depth);',
        '  float nearLens = smoothstep(0.6, 2.5, depth);',
        '  vec3 edge = uBounds - abs(p - uFieldCenter);',
        '  float faces = smoothstep(0.0, 3.0, min(edge.x, min(edge.y, edge.z)));',
        '  vAlpha = 0.6 * far * nearLens * max(faces, f) * mix(1.0, 0.45, f);',
        '  float size = min(uSize * (0.7 + 0.6 * s.w) * uScale / max(depth, 0.1), 28.0);',
        // sub-pixel points shimmer; keep them 1.5px and fade them instead
        '  if (size < 1.5){ vAlpha *= size / 1.5; size = 1.5; }',
        // motion streaks, like a long exposure: a particle moving fast *relative to the camera*
        // (the craft racing past it, or it being flung by the wake / an explosion) is drawn as a
        // dash back along its on-screen path. At speed the whole field becomes light streaks.
        '  vec3 rv = v.xyz - uCamVel;',
        // (builds up gradually: faint at the first speed levels, full from the upper ones)
        '  vec3 sv = rv * smoothstep(0.03, 0.3, length(rv));',
        '  vec4 clip0 = projectionMatrix * mv;',
        '  vec4 clip1 = projectionMatrix * (modelViewMatrix * vec4(p - sv * uStreak, 1.0));',
        '  vec2 dpx = (clip1.xy / clip1.w - clip0.xy / clip0.w) * 0.5 * uViewport;',
        '  float len = clip1.w > 0.1 ? min(length(dpx), uStreakMax) : 0.0;',
        '  if (len < 1.0) len = 0.0;',
        '  vDir = len > 0.0 ? normalize(dpx) : vec2(1.0, 0.0);',
        '  dpx = vDir * len;',
        '  vLen = len; vSize = size;',
        // a long dash spreads the same light over more pixels, so dim it (keeps full speed from whiting out)
        '  vAlpha *= clamp(2.0 * size / (size + len), 0.2, 1.0);',
        '  gl_PointSize = size + len;',
        '  gl_Position = clip0;',
        '  gl_Position.xy += (dpx / uViewport) * clip0.w;',   // centre the sprite halfway along the dash
        '}'
      ].join('\n'),
      fragmentShader: [
        'varying vec3 vColor; varying float vAlpha;',
        'varying vec2 vDir; varying float vLen; varying float vSize;',
        'void main(){',
        // distance from this pixel to the dash (a segment of length vLen), in units of the dot radius
        '  vec2 q = (vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y) - 0.5) * (vSize + vLen);',
        '  float along = dot(q, vDir), across = dot(q, vec2(-vDir.y, vDir.x));',
        '  float r = length(vec2(max(abs(along) - vLen * 0.5, 0.0), across)) / (vSize * 0.5);',
        '  float d = r * r;',
        '  if (d > 1.0) discard;',
        '  float a = 1.0 - d;',
        // dashes fade toward their tail, so they read as motion rather than sticks
        '  float tail = vLen > 0.0 ? clamp(0.5 - along / max(vLen, 1.0), 0.0, 1.0) : 0.0;',
        '  gl_FragColor = vec4(vColor, a * a * vAlpha * (1.0 - 0.75 * tail));',
        '}'
      ].join('\n'),
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    var points = new THREE.Points(geometry, material);
    points.frustumCulled = false;
    scene.add(points);

    sizeToWindow();   // now that renderUniforms exists, fill in the viewport size too
    window.addEventListener('resize', sizeToWindow);

    // ---------- soft glow sprite (engine, explosion flashes, loop and galaxy halos) ----------
    function glowTexture(){
      var c = document.createElement('canvas'); c.width = c.height = 64;
      var x = c.getContext('2d');
      var g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, 'rgba(255,255,255,1)');
      g.addColorStop(0.25, 'rgba(255,255,255,0.55)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      x.fillStyle = g; x.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(c);
    }
    var glowTex = glowTexture();
    function glowSprite(color, opacity){
      return new THREE.Sprite(new THREE.SpriteMaterial({
        map: glowTex, color: color, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: opacity
      }));
    }

    // ---------- spacecraft ----------
    // A small swept-wing craft built from primitives. Local forward is -z.
    scene.add(new THREE.AmbientLight(0x8b93a8, 0.7));
    var SUN_DIR = new THREE.Vector3(0.4, 1, 0.3).normalize();
    var sun = new THREE.DirectionalLight(0xffffff, 1.1);
    sun.position.copy(SUN_DIR);
    scene.add(sun);

    var craft = new THREE.Group();       // position + heading (what the physics moves)
    var craftBody = new THREE.Group();   // bank / rattle wobble on top of that
    craft.add(craftBody);
    scene.add(craft);
    (function buildCraft(){
      var hullMat = new THREE.MeshStandardMaterial({ color: 0xd3d9e6, metalness: 0.55, roughness: 0.35 });
      var darkMat = new THREE.MeshStandardMaterial({ color: 0x2a3142, metalness: 0.6, roughness: 0.5 });
      var glassMat = new THREE.MeshStandardMaterial({ color: 0x0b2a3a, emissive: 0x38bdf8, emissiveIntensity: 0.9, metalness: 0.2, roughness: 0.1 });

      var nose = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.8, 18), hullMat);
      nose.rotation.x = -Math.PI / 2;                     // tip toward -z
      craftBody.add(nose);
      var tail = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.12, 0.24, 18), darkMat);
      tail.rotation.x = Math.PI / 2;
      tail.position.z = 0.52;
      craftBody.add(tail);
      var cockpit = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 12), glassMat);
      cockpit.scale.set(1, 0.75, 1.9);
      cockpit.position.set(0, 0.085, -0.02);
      craftBody.add(cockpit);

      [-1, 1].forEach(function(side){
        var wing = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.022, 0.26), hullMat);
        wing.position.set(side * 0.3, -0.02, 0.26);
        wing.rotation.y = side * -0.42;                   // swept back
        craftBody.add(wing);
        var tipMat = new THREE.MeshBasicMaterial({ color: side < 0 ? 0xe879f9 : 0xfbbf24 });
        var tip = new THREE.Mesh(new THREE.SphereGeometry(0.03, 10, 8), tipMat);
        tip.position.set(side * 0.53, -0.02, 0.42);
        craftBody.add(tip);
      });
      var fin = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.17, 0.22), darkMat);
      fin.position.set(0, 0.11, 0.44);
      craftBody.add(fin);
    })();
    var engineCore = new THREE.Mesh(new THREE.SphereGeometry(0.085, 14, 10),
      new THREE.MeshBasicMaterial({ color: 0xbfe9ff }));
    engineCore.position.z = 0.66;
    craftBody.add(engineCore);
    var engineGlow = glowSprite(0x38bdf8, 1);
    engineGlow.position.z = 0.72;
    craftBody.add(engineGlow);
    var engineLight = new THREE.PointLight(0x38bdf8, 0.8, 3);
    engineLight.position.z = 0.8;
    craftBody.add(engineLight);
    craft.scale.setScalar(CRAFT_SCALE);

    var craftState = {
      heading: 0,                         // yaw; 0 = flying toward -z
      camHeading: 0,                      // the chase camera eases after the heading
      speed: 0,                           // forward speed, units per frame
      target: BASE_SPEED,                 // cruise speed: BASE_SPEED x LOOP_SPEEDUP per loop since the last hit
      turnVel: 0,                         // eased turn rate (-1..1 of CRAFT_TURN), for smooth turns
      boost: 1,                           // eased Shift boost multiplier (1..BOOST)
      side: new THREE.Vector3(),          // sideways knock from a crash, decays
      vel: new THREE.Vector3(),           // resulting world velocity, units per frame
      bank: 0,
      rattle: 0,                          // 1 right after a crash, eases to 0 over RATTLE_TIME
      thrust: 0
    };
    var fwd = new THREE.Vector3(0, 0, -1);
    var right = new THREE.Vector3(1, 0, 0);
    var UP = new THREE.Vector3(0, 1, 0);
    var prevCraftPos = new THREE.Vector3();

    // ---------- engine trail: a ribbon of glowing points left behind the engine ----------
    var TRAIL_N = 1500;
    var trailPos = new Float32Array(TRAIL_N * 3);
    var trailAge = new Float32Array(TRAIL_N).fill(99);
    var trailPower = new Float32Array(TRAIL_N);
    var trailHead = 0;
    var trailGeo = new THREE.BufferGeometry();
    trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPos, 3));
    trailGeo.setAttribute('age', new THREE.BufferAttribute(trailAge, 1));
    trailGeo.setAttribute('power', new THREE.BufferAttribute(trailPower, 1));
    var trail = new THREE.Points(trailGeo, new THREE.ShaderMaterial({
      uniforms: { uScale: renderUniforms.uScale },
      vertexShader: [
        'uniform float uScale;',
        'attribute float age; attribute float power;',
        'varying float vA; varying float vT;',
        'void main(){',
        '  vec4 mv = modelViewMatrix * vec4(position, 1.0);',
        '  float life = clamp(1.0 - age / 1.1, 0.0, 1.0);',
        '  vA = life * life * power; vT = life;',
        '  gl_PointSize = clamp((0.03 + 0.08 * life) * uScale / max(-mv.z, 0.1), 1.0, 20.0);',
        '  gl_Position = projectionMatrix * mv;',
        '}'
      ].join('\n'),
      fragmentShader: [
        'varying float vA; varying float vT;',
        'void main(){',
        '  vec2 c = gl_PointCoord - 0.5; float d = dot(c, c) * 4.0;',
        '  if (d > 1.0) discard;',
        '  vec3 col = mix(vec3(0.91, 0.47, 0.98), vec3(0.75, 0.93, 1.0), vT);',  // orchid tail -> white-blue near the engine
        '  gl_FragColor = vec4(col, (1.0 - d) * vA * 0.8);',
        '}'
      ].join('\n'),
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
    }));
    trail.frustumCulled = false;
    scene.add(trail);
    var _enginePos = new THREE.Vector3(), _lastEngine = new THREE.Vector3(0, 0, 0.72 * CRAFT_SCALE);

    // ---------- explosion flashes ----------
    var flashes = arr(function(){
      var s = glowSprite(0xffffff, 0);
      s.visible = false;
      scene.add(s);
      return { sprite: s, t: 1, size: 1 };
    });
    var flashColors = [0x38bdf8, 0xe879f9, 0xfbbf24];
    function flashAt(slot, pos, size, colorClass){
      var f = flashes[slot];
      f.sprite.position.copy(pos);
      f.sprite.material.color.setHex(colorClass >= 0 ? flashColors[colorClass] : 0xffffff);
      f.t = 0; f.size = size; f.sprite.visible = true;
    }
    function updateFlashes(delta){
      flashes.forEach(function(f){
        if (!f.sprite.visible) return;
        f.t += delta / 0.7;
        if (f.t >= 1){ f.sprite.visible = false; return; }
        var e = 1 - Math.pow(1 - f.t, 3);
        f.sprite.scale.setScalar(f.size * (0.6 + e * 2.6));
        f.sprite.material.opacity = (1 - f.t) * (1 - f.t);
      });
    }

    // ---------- distant landmarks: spiral galaxies ----------
    // Big, far-off galaxies placed ahead of the craft (roughly the way it's heading) that you
    // can chase toward. They live in world space (not the wrapping particle cube) and are
    // swapped for new ones once they're left far behind. No green palette here: that neon
    // green is reserved for the fly-through loops, so they're unmistakable at any speed.
    var PALETTES = [
      [0x38bdf8, 0x1e3a8a, 0xa5f3fc], [0xe879f9, 0x581c87, 0xfbcfe8],
      [0xfbbf24, 0x9a3412, 0xfde68a], [0xf87171, 0x4c0519, 0xfecaca]
    ];
    var landmarkTime = { value: 0 };

    // a slowly turning spiral galaxy with a glowing core
    function makeGalaxy(){
      var reveal = { value: 0 };               // 0 -> 1 over LANDMARK_REVEAL seconds (see updateLandmarks)
      var count = isSmall ? 12000 : 24000;
      var Rg = 30 + Math.random() * 40;
      var arms = 2 + Math.floor(Math.random() * 3);
      var pal = PALETTES[Math.floor(Math.random() * PALETTES.length)];
      var g = new THREE.BufferGeometry();
      var rr = new Float32Array(count), ang = new Float32Array(count), hgt = new Float32Array(count), rnd = new Float32Array(count);
      for (var j = 0; j < count; j++){
        var r = Math.pow(Math.random(), 0.65);
        var arm = Math.floor(Math.random() * arms);
        rr[j] = r;
        ang[j] = r * 7.0 + arm * (6.2831 / arms) + (Math.random() - 0.5) * (0.35 + (1 - r) * 0.8);
        hgt[j] = (Math.random() - 0.5) * (1 - r) * 0.12;
        rnd[j] = Math.random();
      }
      g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
      g.setAttribute('rr', new THREE.BufferAttribute(rr, 1));
      g.setAttribute('ang', new THREE.BufferAttribute(ang, 1));
      g.setAttribute('hgt', new THREE.BufferAttribute(hgt, 1));
      g.setAttribute('rnd', new THREE.BufferAttribute(rnd, 1));
      var m = new THREE.ShaderMaterial({
        uniforms: {
          uTime: landmarkTime, uScale: renderUniforms.uScale, uR: { value: Rg }, uReveal: reveal,
          uA: { value: new THREE.Color(pal[0]) }, uB: { value: new THREE.Color(pal[2]) }
        },
        vertexShader: [
          'uniform float uTime; uniform float uScale; uniform float uR; uniform vec3 uA; uniform vec3 uB; uniform float uReveal;',
          'attribute float rr; attribute float ang; attribute float hgt; attribute float rnd;',
          'varying vec3 vC; varying float vA;',
          'void main(){',
          '  float a = ang + uTime * 0.03 / (0.25 + rr);',                  // inner parts turn faster
          '  vec3 p = vec3(cos(a) * rr, hgt, sin(a) * rr) * uR;',
          '  vec4 mv = modelViewMatrix * vec4(p, 1.0);',
          '  vC = mix(vec3(1.0, 0.96, 0.9), mix(uA, uB, rnd), smoothstep(0.0, 0.35, rr));',
          '  vA = 0.25 + 0.75 * (1.0 - rr);',
          // builds up gradually: stars appear one by one, from the core outward, as uReveal goes 0 -> 1
          '  float order = rr * 0.6 + rnd * 0.4;',
          '  vA *= smoothstep(order * 0.85, order * 0.85 + 0.15, uReveal);',
          '  gl_PointSize = clamp((0.5 + rnd) * uScale / max(-mv.z, 0.1), 1.0, 12.0);',
          '  gl_Position = projectionMatrix * mv;',
          '}'
        ].join('\n'),
        fragmentShader: [
          'varying vec3 vC; varying float vA;',
          'void main(){ vec2 c = gl_PointCoord - 0.5; float d = dot(c, c) * 4.0; if (d > 1.0) discard; gl_FragColor = vec4(vC, (1.0 - d) * vA * 0.3); }'
        ].join('\n'),
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
      });
      var pts = new THREE.Points(g, m);
      pts.frustumCulled = false;
      var group = new THREE.Group();
      group.add(pts);
      var core = glowSprite(0xfff4e0, 0);      // brightens with the reveal
      core.scale.setScalar(Rg * 0.7);
      group.add(core);
      group.rotation.set((Math.random() - 0.5) * 1.2, Math.random() * 6.28, (Math.random() - 0.5) * 1.2);
      group.scale.setScalar(GALAXY_SCALE);
      return { kind: 'galaxy', group: group, radius: 0, reveal: reveal, core: core };
    }

    var landmarks = [];
    function disposeLandmark(lm){
      scene.remove(lm.group);
      lm.group.traverse(function(o){
        if (o.geometry) o.geometry.dispose();
        if (o.material) o.material.dispose();   // (the shared glow texture itself is kept)
      });
    }
    function placeLandmark(lm, spread){
      // somewhere ahead, within `spread` radians of the heading, a little above or below
      var a = craftState.heading + (Math.random() - 0.5) * 2 * spread;
      var d = LANDMARK_DIST[0] + Math.random() * (LANDMARK_DIST[1] - LANDMARK_DIST[0]);
      lm.group.position.set(
        craft.position.x - Math.sin(a) * d,
        craft.position.y + (Math.random() - 0.5) * 90,
        craft.position.z - Math.cos(a) * d
      );
      for (var j = 0; j < landmarks.length; j++){   // keep them from piling onto each other
        var o = landmarks[j];
        if (o !== lm && o.group.position.distanceTo(lm.group.position) < 140) return false;
      }
      return true;
    }
    function spawnLandmark(spread){
      var lm = makeGalaxy();
      for (var tries = 0; tries < 6 && !placeLandmark(lm, spread); tries++){}
      scene.add(lm.group);
      landmarks.push(lm);
    }
    // new galaxies / rivers don't pop in: their stars appear gradually over LANDMARK_REVEAL seconds
    // (eased, so it starts as a faint scattering and fills in)
    function buildUp(lm, delta){
      if (lm.reveal.value >= 1) return;
      lm.revealT = Math.min(1, (lm.revealT || 0) + delta / LANDMARK_REVEAL);
      lm.reveal.value = lm.revealT * lm.revealT * (3 - 2 * lm.revealT);
    }
    function updateLandmarks(delta){
      landmarkTime.value += delta;
      for (var j = landmarks.length - 1; j >= 0; j--){
        var lm = landmarks[j];
        if (lm.group.position.distanceTo(craft.position) > LANDMARK_RECYCLE){
          disposeLandmark(lm);
          landmarks.splice(j, 1);
          continue;
        }
        buildUp(lm, delta);
        lm.core.material.opacity = 0.4 * lm.reveal.value;
      }
      while (landmarks.length < LANDMARK_COUNT) spawnLandmark(1.1);

      for (j = rivers.length - 1; j >= 0; j--){
        if (rivers[j].group.position.distanceTo(craft.position) > RIVER_RECYCLE){
          disposeLandmark(rivers[j]);
          rivers.splice(j, 1);
          continue;
        }
        buildUp(rivers[j], delta);
      }
      while (rivers.length < RIVER_COUNT) spawnRiver();
    }

    // ---------- galaxy rivers: enormous flowing bands of stars, far in the background ----------
    // Kilometres-long (thousands of units) winding streams, far enough away that they drift
    // past slowly like a Milky Way band. Sky / orchid / amber / rose only, never loop green.
    var rivers = [];
    function makeRiver(){
      var reveal = { value: 0 };               // 0 -> 1 over LANDMARK_REVEAL seconds (see updateLandmarks)
      var count = isSmall ? 22000 : 45000;
      var L = 2600 + Math.random() * 1800;
      var pal = PALETTES[Math.floor(Math.random() * PALETTES.length)];
      var g = new THREE.BufferGeometry();
      var tt = new Float32Array(count), off = new Float32Array(count * 2), rnd = new Float32Array(count);
      for (var j = 0; j < count; j++){
        tt[j] = Math.random();
        var a = Math.random() * 6.28, r = Math.pow(Math.random(), 2.0);   // densest along the centre line
        off[j*2] = Math.cos(a) * r; off[j*2+1] = Math.sin(a) * r;
        rnd[j] = Math.random();
      }
      g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
      g.setAttribute('t', new THREE.BufferAttribute(tt, 1));
      g.setAttribute('off', new THREE.BufferAttribute(off, 2));
      g.setAttribute('rnd', new THREE.BufferAttribute(rnd, 1));
      var m = new THREE.ShaderMaterial({
        uniforms: {
          uTime: landmarkTime, uScale: renderUniforms.uScale, uL: { value: L }, uReveal: reveal,
          uW: { value: 120 + Math.random() * 160 }, uAmp: { value: 250 + Math.random() * 450 },
          uK: { value: 3 + Math.random() * 4 }, uPh: { value: Math.random() * 6.28 },
          uA: { value: new THREE.Color(pal[0]) }, uB: { value: new THREE.Color(pal[2]) }
        },
        vertexShader: [
          'uniform float uTime; uniform float uScale; uniform float uL; uniform float uW; uniform float uAmp; uniform float uK; uniform float uPh; uniform float uReveal;',
          'uniform vec3 uA; uniform vec3 uB;',
          'attribute float t; attribute vec2 off; attribute float rnd;',
          'varying vec3 vC; varying float vA;',
          'void main(){',
          '  float s = fract(t + uTime * (0.0015 + 0.0015 * rnd));',        // slowly flowing along its length
          '  vec3 p = vec3((s - 0.5) * uL, sin(s * uK + uPh) * uAmp * 0.3, sin(s * uK * 0.7 + uPh * 1.3) * uAmp);',
          '  p.yz += off * uW;',
          '  vec4 mv = modelViewMatrix * vec4(p, 1.0);',
          '  vC = mix(uA, uB, rnd);',
          '  vA = smoothstep(0.0, 0.1, s) * (1.0 - smoothstep(0.9, 1.0, s)) * (1.0 - length(off) * 0.7);',
          // builds up gradually: stars appear one by one (in random order) as uReveal goes 0 -> 1
          '  vA *= smoothstep(rnd * 0.85, rnd * 0.85 + 0.15, uReveal);',
          '  gl_PointSize = clamp((6.0 + rnd * 14.0) * uScale / max(-mv.z, 0.1), 1.0, 10.0);',
          '  gl_Position = projectionMatrix * mv;',
          '}'
        ].join('\n'),
        fragmentShader: [
          'varying vec3 vC; varying float vA;',
          'void main(){ vec2 c = gl_PointCoord - 0.5; float d = dot(c, c) * 4.0; if (d > 1.0) discard; gl_FragColor = vec4(vC, (1.0 - d) * vA * 0.2); }'
        ].join('\n'),
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
      });
      var pts = new THREE.Points(g, m);
      pts.frustumCulled = false;
      var group = new THREE.Group();
      group.add(pts);
      group.rotation.set((Math.random() - 0.5) * 0.6, Math.random() * 6.28, (Math.random() - 0.5) * 0.6);
      group.scale.setScalar(RIVER_SCALE);
      return { kind: 'river', group: group, reveal: reveal };
    }
    function spawnRiver(){
      var lm = makeRiver();
      // off to one side and high above the flight plane, so it arcs across the upper sky
      // without ever crossing the loop route
      var a = craftState.heading + (Math.random() - 0.5) * 2.4;
      var d = RIVER_DIST[0] + Math.random() * (RIVER_DIST[1] - RIVER_DIST[0]);
      lm.group.position.set(
        craft.position.x - Math.sin(a) * d,
        craft.position.y + 450 + Math.random() * 500,
        craft.position.z - Math.cos(a) * d
      );
      scene.add(lm.group);
      rivers.push(lm);
    }

    // ---------- the course: invisible waypoints, drawn as a particle tube ----------
    // A chain of waypoints laid out one after another along a gently curving path ahead of the
    // craft, at its flight height; the tube (below) is drawn through them. Flying through the
    // middle of the tube at a waypoint speeds you up; clipping its wall there counts as a hit.
    // The course keeps extending ahead as waypoints are used up, and restarts in front of the
    // craft if it wanders off (or turns around). (The code calls waypoints "loops" -- they
    // used to be drawn as rings.)
    var loops = [];
    var loopIdSeq = 0;
    var course = { pos: new THREE.Vector3(), yaw: 0, active: false };
    var loopStreak = 0;                     // waypoints flown through since the last hit
    var loopRadius = LOOP_RADIUS;           // tube radius at the next waypoint laid (shrinks at the speed cap)
    var _ln = new THREE.Vector3(), _hit = new THREE.Vector3();

    function makeLoop(pos, yaw){
      var marker = new THREE.Object3D();      // just a position (never added to the scene)
      marker.position.copy(pos);
      var size = loopRadius / LOOP_RADIUS;
      var loop = {
        group: marker, size: size, radius: loopRadius, tube: LOOP_TUBE * size, id: ++loopIdSeq,
        normal: new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw)),
        state: 'ahead', fade: 0
      };
      loops.push(loop);
      return loop;
    }
    function removeLoop(j){ loops.splice(j, 1); }
    function restartCourse(){
      course.yaw = craftState.heading;
      course.pos.copy(craft.position).addScaledVector(fwd, LOOP_FIRST - LOOP_SPACING[0]);
      course.pos.y = craft.position.y;
      course.active = true;
      course.laid = false;
    }
    function extendCourse(){
      // each new loop bends the path a little left or right (the first one sits dead ahead),
      // never swinging too far from where the craft is heading
      if (course.laid) course.yaw += (Math.random() - 0.5) * 0.5;
      course.laid = true;
      course.yaw = craftState.heading + Math.max(-0.7, Math.min(0.7, course.yaw - craftState.heading));
      var step = (LOOP_SPACING[0] + Math.random() * (LOOP_SPACING[1] - LOOP_SPACING[0])) * loopStretch();
      _ln.copy(course.pos);
      course.pos.x += -Math.sin(course.yaw) * step;
      course.pos.z += -Math.cos(course.yaw) * step;
      course.pos.y = craft.position.y;
      clearRoute(_ln, course.pos);
      makeLoop(course.pos, course.yaw);
    }
    // the faster the craft, the further apart new loops are laid, so there's still time to line up
    function loopStretch(){
      return Math.max(1, Math.min(LOOP_SPACING_MAX_STRETCH, craftState.target / 0.25));
    }
    // nothing but loops may sit on the route: any obstacle already on this new stretch of it
    // quietly dissolves back into the field
    function clearRoute(a, b){
      for (var s = 0; s < CLUSTER_SLOTS; s++){
        if (clusters[s].state !== 1) continue;
        var ctr = cu.uCCenter.value[s];
        if (sweptDistance(a, b, ctr) < ROUTE_CLEARANCE + clusters[s].reach) dissolveCluster(s, uTime.value, 0);
      }
    }
    function aheadCount(){
      var n = 0;
      for (var j = 0; j < loops.length; j++) if (loops[j].state === 'ahead') n++;
      return n;
    }
    function nearestAheadDistance(){
      var best = Infinity;
      for (var j = 0; j < loops.length; j++){
        if (loops[j].state !== 'ahead') continue;
        best = Math.min(best, loops[j].group.position.distanceTo(craft.position));
      }
      return best;
    }

    function updateLoops(delta, t){
      // wandered off (or turned around): drop the old course and lay a new one ahead
      _toC.set(0, 0, 0);
      var anyAhead = false;
      for (var j = 0; j < loops.length; j++){
        var l = loops[j];
        if (l.state !== 'ahead') continue;
        _toC.copy(l.group.position).sub(craft.position);
        if (_toC.dot(fwd) > -4) { anyAhead = true; break; }
      }
      if (!course.active || !anyAhead || nearestAheadDistance() > LOOP_WANDER * loopStretch()){
        for (j = loops.length - 1; j >= 0; j--) if (loops[j].state === 'ahead') loops[j].state = 'missed';
        restartCourse();
      }
      while (aheadCount() < LOOPS_AHEAD) extendCourse();

      for (j = loops.length - 1; j >= 0; j--){
        var lp = loops[j];
        if (lp.state === 'ahead'){
          // waypoints left behind (passed beside, not through) quietly retire
          _toC.copy(lp.group.position).sub(craft.position);
          if (_toC.dot(fwd) < -12 || _toC.length() > LOOP_WANDER * 1.5 * loopStretch()) lp.state = 'missed';
          continue;
        }
        lp.fade += delta;                       // used ones linger briefly, then go
        if (lp.fade >= 1) removeLoop(j);
      }
      updateTube(t);
    }

    // ---------- the tube: a flowing tube of green light along the course ----------
    // Drawn in Manual (hidden in Auto-cruise). Scoring (Manual): through the middle at each waypoint speeds you up,
    // clipping the wall there counts as a hit. In Auto-cruise the walls don't count, so you can
    // steer out of it (see updateCraft).
    var TUBE_STRANDS = 8, TUBE_STRAND_STEP = 0.12, TUBE_RING_EVERY = 3, TUBE_RING_POINTS = 48;
    var tubeTime = { value: 0 };
    var tubeGeo = new THREE.BufferGeometry();
    var tube = new THREE.Points(tubeGeo, new THREE.ShaderMaterial({
      uniforms: { uTime: tubeTime, uScale: renderUniforms.uScale, uColor: { value: new THREE.Color(LOOP_COLOR) } },
      vertexShader: [
        'uniform float uTime; uniform float uScale; uniform vec3 uColor;',
        'attribute float along; attribute float rnd;',
        'varying float vA;',
        'void main(){',
        '  vec4 mv = modelViewMatrix * vec4(position, 1.0);',
        '  float depth = -mv.z;',
        // bright bands of light racing along the tube, over a soft steady glow
        '  float band = pow(0.5 + 0.5 * sin(along * 0.55 - uTime * 7.0 + rnd * 0.8), 8.0);',
        '  float ring = rnd < 0.0 ? 1.0 : 0.0;',
        '  vA = ring > 0.5 ? 0.3 : (0.35 + 0.65 * band) * (0.7 + 0.3 * rnd);',
        '  vA *= smoothstep(1.5, 5.0, depth);',          // don't blind the camera from inside
        '  gl_PointSize = clamp((ring > 0.5 ? 0.03 : 0.04 + 0.04 * band) * uScale / max(depth, 0.1), 1.0, 8.0);',
        '  gl_Position = projectionMatrix * mv;',
        '}'
      ].join('\n'),
      fragmentShader: [
        'uniform vec3 uColor; varying float vA;',
        'void main(){ vec2 c = gl_PointCoord - 0.5; float d = dot(c, c) * 4.0; if (d > 1.0) discard; gl_FragColor = vec4(uColor, (1.0 - d) * vA); }'
      ].join('\n'),
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
    }));
    tube.frustumCulled = false;
    scene.add(tube);
    var tubeDirty = true, tubeSig = '';
    // tail = where the tube starts (the waypoint just passed); first* = the next waypoint ahead
    var tubeTail = { pos: new THREE.Vector3(), radius: LOOP_RADIUS, firstId: -1, firstPos: new THREE.Vector3(), firstRadius: LOOP_RADIUS };
    var _tT = new THREE.Vector3(), _tS = new THREE.Vector3(), _tU = new THREE.Vector3(), _tC = new THREE.Vector3();

    function applyCourseVisibility(){ tube.visible = !autoCruise; }   // hidden while flying itself

    // rebuild the tube's particles whenever the course changes: a smooth curve from the last
    // waypoint behind the craft through every waypoint ahead, ringed with glowing points
    function updateTube(t){
      tubeTime.value = t;
      var ahead = loops.filter(function(l){ return l.state === 'ahead'; });
      if (!ahead.length) return;
      // the waypoint just flown past (or beside) becomes the tube's tail, so it starts behind
      // you; a brand-new course starts it a little behind the craft instead
      if (tubeTail.firstId !== ahead[0].id){
        if (tubeTail.firstId >= 0 && tubeTail.firstPos.distanceTo(craft.position) < 80){
          tubeTail.pos.copy(tubeTail.firstPos); tubeTail.radius = tubeTail.firstRadius;
        } else {
          tubeTail.pos.copy(craft.position).addScaledVector(fwd, -12); tubeTail.radius = ahead[0].radius;
        }
        tubeTail.firstId = ahead[0].id;
        tubeTail.firstPos.copy(ahead[0].group.position);
        tubeTail.firstRadius = ahead[0].radius;
        tubeDirty = true;
      }
      var sig = ahead.map(function(l){ return l.id; }).join(',');
      if (!tubeDirty && sig === tubeSig) return;
      tubeDirty = false; tubeSig = sig;

      var pts = [tubeTail.pos.clone()], radii = [tubeTail.radius];
      ahead.forEach(function(l){ pts.push(l.group.position.clone()); radii.push(l.radius); });
      var curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal');
      var len = curve.getLength();
      // the tube's wall: TUBE_STRANDS continuous threads of light twisting gently along the
      // course (sampled every TUBE_STRAND_STEP), plus a faint ring every TUBE_RING_EVERY units
      var steps = Math.max(2, Math.floor(len / TUBE_STRAND_STEP));
      var ringEvery = Math.max(1, Math.round(TUBE_RING_EVERY / TUBE_STRAND_STEP));
      var n = steps * TUBE_STRANDS + Math.ceil(steps / ringEvery) * TUBE_RING_POINTS;
      var pos = new Float32Array(n * 3), along = new Float32Array(n), rnd = new Float32Array(n);
      var k = 0;
      function put(a, r){
        pos[k*3]   = _tC.x + (Math.cos(a) * _tS.x + Math.sin(a) * _tU.x) * r;
        pos[k*3+1] = _tC.y + (Math.cos(a) * _tS.y + Math.sin(a) * _tU.y) * r;
        pos[k*3+2] = _tC.z + (Math.cos(a) * _tS.z + Math.sin(a) * _tU.z) * r;
        rnd[k] = Math.random();
      }
      for (var i = 0; i < steps; i++){
        var u = i / (steps - 1);
        curve.getPointAt(u, _tC);
        curve.getTangentAt(u, _tT);
        _tS.crossVectors(_tT, UP).normalize();
        _tU.crossVectors(_tS, _tT).normalize();
        var seg = u * (radii.length - 1), s0 = Math.floor(seg), s1 = Math.min(radii.length - 1, s0 + 1);
        var r = radii[s0] + (radii[s1] - radii[s0]) * (seg - s0);
        var twist = u * len * 0.12;
        for (var p = 0; p < TUBE_STRANDS; p++, k++){
          put((p / TUBE_STRANDS) * 6.2831 + twist, r);
          along[k] = u * len;
        }
        if (i % ringEvery === 0){
          for (p = 0; p < TUBE_RING_POINTS; p++, k++){
            put((p / TUBE_RING_POINTS) * 6.2831, r * (0.98 + Math.random() * 0.04));
            along[k] = u * len;
            rnd[k] = -1;                              // marks ring points (dimmer, see shader)
          }
        }
      }
      tubeGeo.dispose();
      tubeGeo = new THREE.BufferGeometry();
      tubeGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      tubeGeo.setAttribute('along', new THREE.BufferAttribute(along, 1));
      tubeGeo.setAttribute('rnd', new THREE.BufferAttribute(rnd, 1));
      tube.geometry = tubeGeo;
    }

    // did the craft's path this frame cross a loop's plane? through the middle scores,
    // through the rim is a crash
    function checkLoops(){
      for (var j = 0; j < loops.length; j++){
        var l = loops[j];
        if (l.state !== 'ahead') continue;
        var c = l.group.position;
        var a = _ln.copy(prevCraftPos).sub(c).dot(l.normal);
        var b = _hit.copy(craft.position).sub(c).dot(l.normal);
        if (a === b || (a > 0) === (b > 0)) continue;       // stayed on one side
        var tt = a / (a - b);
        _hit.copy(prevCraftPos).lerp(craft.position, tt);
        var r = _hit.distanceTo(c);
        if (autoCruise){
          // flying itself: crossing near a waypoint just moves the course on (no score, and the
          // (hidden) tube's walls don't count, so you're free to steer off the course)
          if (r < l.radius * 4){ l.state = 'passed'; l.fade = 0; }
          continue;
        }
        if (r < l.radius - l.tube - CRAFT_HIT_RADIUS * 0.6){
          l.state = 'passed'; l.fade = 0;
          loopStreak++;
          // +10% on the current cruise speed per loop, up to the cap; once at the cap the speed
          // holds and each new loop is laid a little smaller instead
          if (craftState.target >= SPEED_CAP - 1e-6) loopRadius = Math.max(LOOP_MIN_RADIUS, loopRadius * LOOP_SHRINK);
          craftState.target = Math.min(SPEED_CAP, craftState.target * LOOP_SPEEDUP);
          hudPulse('up');
        } else if (r < l.radius + l.tube + CRAFT_HIT_RADIUS * 0.6){
          l.state = 'missed'; l.fade = 0;
          crash(c);
        }
      }
    }

    // ---------- speed: rolling digital odometer (km/h) ----------
    // ODO_DIGITS wheels, each a strip of 0-9 that slides to the current digit (CSS transition);
    // unused leading zeros are dimmed. Updated ~10x a second.
    var ODO_DIGITS = 5;
    var hudEl = document.getElementById('odo');
    var odoDigitsEl = document.getElementById('odoDigits');
    var odoTextEl = document.getElementById('odoText');
    var odoStrips = [], odoCells = [];
    (function buildOdometer(){
      if (!odoDigitsEl) return;
      for (var d = 0; d < ODO_DIGITS; d++){
        var cell = document.createElement('span');
        cell.className = 'odo-digit';
        var strip = document.createElement('span');
        strip.className = 'odo-strip';
        for (var n = 0; n <= 9; n++){ var s = document.createElement('span'); s.textContent = n; strip.appendChild(s); }
        cell.appendChild(strip);
        odoDigitsEl.appendChild(cell);
        odoCells.push(cell); odoStrips.push(strip);
      }
    })();
    var hudTimer = 0, hudShown = -1, hudNextAt = 0;
    function hudPulse(mood){
      if (!hudEl) return;
      hudEl.classList.remove('up', 'down');
      void hudEl.offsetWidth;                    // restart the pulse animation
      hudEl.classList.add(mood);
      clearTimeout(hudTimer);
      hudTimer = setTimeout(function(){ hudEl.classList.remove('up', 'down'); }, 700);
    }
    function updateHud(t){
      if (!odoStrips.length || t < hudNextAt) return;
      hudNextAt = t + 0.1;
      var kmh = Math.min(Math.pow(10, ODO_DIGITS) - 1, Math.round(Math.max(craftState.speed, 0) * KMH_PER_SPEED));
      if (kmh === hudShown) return;
      hudShown = kmh;
      var str = String(kmh);
      while (str.length < ODO_DIGITS) str = '0' + str;
      var firstSig = ODO_DIGITS - String(kmh).length;
      for (var d = 0; d < ODO_DIGITS; d++){
        odoStrips[d].style.transform = 'translateY(' + (-1.3 * parseInt(str[d], 10)) + 'em)';
        odoCells[d].classList.toggle('lead', d < firstSig && d < ODO_DIGITS - 1);
      }
      if (odoTextEl) odoTextEl.textContent = 'Speed ' + kmh + ' km/h';
    }

    // ---------- autonomous clusters: lifecycle ----------
    // idle -> spawn (claims nearby particles of one colour) -> gather + hold 6-18s
    //      -> dissolve (drift apart, or explode if the craft hits it) -> clear -> idle.
    // New ones keep appearing just ahead of the craft at its own height, beside or in its path.
    var cu = clusterUniforms;
    var clusters = arr(function(){
      return { state: 0, until: 0, rot: 0, rates: new THREE.Vector3(), base: new THREE.Matrix4(),
               stretch: new THREE.Matrix4(), reach: 0 };
    });
    var nextClusterAt = 1;
    var clusterRotM4 = new THREE.Matrix4(), clusterEuler = new THREE.Euler();

    // somewhere just ahead at flight height, to the left or right of the craft's path, but
    // never on the loop route: `reach` is the shape's own outer radius
    function pickClusterCenter(out, reach){
      var c = craft.position;
      for (var attempt = 0; attempt < 10; attempt++){
        var ahead = 11 + Math.random() * 7;                  // stays inside the particle cube
        var lateral = (Math.random() < 0.5 ? -1 : 1) * (1.5 + reach + Math.random() * 5);
        out.copy(c).addScaledVector(fwd, ahead).addScaledVector(right, lateral);
        out.y = c.y + (Math.random() - 0.5) * 0.8;
        var clear = true;
        for (var s = 0; s < CLUSTER_SLOTS && clear; s++){
          if (clusters[s].state !== 0 && out.distanceTo(cu.uCCenter.value[s]) < 3 + reach + clusters[s].reach) clear = false;
        }
        if (clear && nearCourse(out, ROUTE_CLEARANCE + reach)) clear = false;
        if (clear) return true;
      }
      return false;
    }

    var _stretch = new THREE.Vector3();
    function spawnCluster(s, now){
      var c = clusters[s];
      // random kind: ~15% constellations, ~15% star rivers, otherwise one of the 8 solid shapes
      var roll = Math.random();
      var shape = roll < 0.15 ? 8 : roll < 0.3 ? 9 : Math.floor(Math.random() * 8);
      var flat = shape >= 8;
      // random size (mostly small-to-medium, now and then big) and an uneven stretch per axis
      var size = Math.pow(Math.random(), 1.5);
      var scale = CLUSTER_SIZE[0] + size * (CLUSTER_SIZE[1] - CLUSTER_SIZE[0]);
      if (flat) scale *= 1.3;
      _stretch.set(0.55 + Math.random() * 1.0, 0.55 + Math.random() * 1.0, flat ? 1 : 0.55 + Math.random() * 1.0);
      c.stretch.makeScale(_stretch.x, _stretch.y, _stretch.z);
      c.reach = scale * Math.max(_stretch.x, _stretch.y, _stretch.z) * (flat ? 1.4 : 1);
      if (!pickClusterCenter(cu.uCCenter.value[s], c.reach)) return false;
      cu.uCShape.value[s] = shape;
      cu.uCScale.value[s] = scale;
      // capture radius -> particle count; bigger shapes gather from further out
      cu.uCRadius.value[s] = (6 + scale * 4) * (isSmall ? 1.2 : 1);
      cu.uCColor.value[s] = Math.random() < 0.85 ? Math.floor(Math.random() * 3) : -1;  // one colour, or mixed
      cu.uCTake.value[s] = 0.85 + Math.random() * 0.15;
      cu.uCSeed.value[s] = Math.random() * 100;
      cu.uCStart.value[s] = now;
      cu.uCState.value[s] = 1;
      cu.uCSpawn.value[s] = 1;
      c.state = 1;
      c.until = now + 6 + Math.random() * 12;
      c.rot = 0;
      if (flat){
        // constellations / rivers are flat: face the current view with a slight tilt and barely turn
        c.rates.set((Math.random() - 0.5) * 0.06, (Math.random() - 0.5) * 0.06, (Math.random() - 0.5) * 0.1);
        c.base.makeRotationFromQuaternion(camera.quaternion)
          .multiply(clusterRotM4.makeRotationFromEuler(clusterEuler.set((Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.5, Math.random() * 6.28)));
      } else {
        c.rates.set((Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.3);
        c.base.makeRotationFromEuler(clusterEuler.set(Math.random() * 6.28, Math.random() * 6.28, Math.random() * 6.28));
      }
      return true;
    }

    function dissolveCluster(s, now, strength){
      var c = clusters[s];
      c.state = 2; c.until = now + 6;
      cu.uCState.value[s] = 2; cu.uCBurst.value[s] = strength;
    }

    // sets this frame's one-shot flags; clearClusterFlags() resets them after the sim step
    var _toC = new THREE.Vector3();
    function updateClusters(now, delta){
      var free = -1;
      for (var s = 0; s < CLUSTER_SLOTS; s++){
        var c = clusters[s];
        if (c.state === 0){ if (free < 0) free = s; continue; }
        c.rot += delta * MOTION_SPEED;
        clusterEuler.set(c.rot * c.rates.x, c.rot * c.rates.y, c.rot * c.rates.z);
        // rotation x the cluster's own uneven stretch (so spheres become ellipsoids, cubes boxes...)
        clusterRotM4.makeRotationFromEuler(clusterEuler).multiply(c.base).multiply(c.stretch);
        cu.uCRot.value[s].setFromMatrix4(clusterRotM4);
        // passed or left far behind: let it go quietly so its particles rejoin the endless
        // field and the slot frees up for something new ahead
        if (c.state === 1){
          _toC.copy(cu.uCCenter.value[s]).sub(craft.position);
          if (_toC.length() > FIELD_HALF * 0.85 || _toC.dot(fwd) < -6){
            dissolveCluster(s, now, 0);
            continue;
          }
        }
        if (now < c.until) continue;
        if (c.state === 1){            // hold over: drift apart
          dissolveCluster(s, now, BURST_STRENGTH);
        } else {                       // dispersal done: release membership
          c.state = 0;
          cu.uCState.value[s] = 0; cu.uCClear.value[s] = 1;
        }
      }
      if (free >= 0 && now > nextClusterAt){
        nextClusterAt = now + (spawnCluster(free, now)
          ? CLUSTER_EVERY[0] + Math.random() * (CLUSTER_EVERY[1] - CLUSTER_EVERY[0]) : 0.5);
      }
    }
    function clearClusterFlags(){
      for (var s = 0; s < CLUSTER_SLOTS; s++){ cu.uCSpawn.value[s] = 0; cu.uCClear.value[s] = 0; cu.uCBurst.value[s] = 0; }
    }

    // ---------- collisions ----------
    // closest distance from point c to the segment the craft swept this frame
    // (so it can't tunnel through things at high speed)
    var _seg = new THREE.Vector3(), _pc = new THREE.Vector3();
    function sweptDistance(a, b, c){
      _seg.copy(b).sub(a);
      var len2 = _seg.lengthSq();
      var tt = len2 > 0 ? Math.max(0, Math.min(1, _pc.copy(c).sub(a).dot(_seg) / len2)) : 0;
      return _pc.copy(a).addScaledVector(_seg, tt).distanceTo(c);
    }
    // is point p within `clearance` of the loop route (from the craft, through every loop ahead)?
    function nearCourse(p, clearance){
      var prev = craft.position;
      for (var j = 0; j < loops.length; j++){
        if (loops[j].state !== 'ahead') continue;
        var lp = loops[j].group.position;
        if (p.distanceTo(lp) < clearance + LOOP_RADIUS) return true;
        if (prev && sweptDistance(prev, lp, p) < clearance) return true;
        prev = lp;
      }
      return false;
    }
    // a crash (any shape, or a loop's rim): rattle, explosion sound, and the loop speed-up is
    // wiped -- back to cruise speed (still flying)
    function crash(fromPoint){
      var st = craftState;
      st.rattle = 1;
      loopStreak = 0;
      st.target = BASE_SPEED;                    // (Auto-cruise then ramps back up gradually)
      loopRadius = LOOP_RADIUS;                  // loops laid from now on are full size again
      st.speed = Math.min(st.speed, BASE_SPEED);
      hudPulse('down');
      playExplosion();
      // a small sideways shove away from whatever was hit
      _pc.copy(craft.position).sub(fromPoint).setY(0);
      var sideSign = _pc.dot(right) >= 0 ? 1 : -1;
      st.side.copy(right).multiplyScalar(sideSign * 0.06);
    }
    function checkCollisions(now){
      for (var s = 0; s < CLUSTER_SLOTS; s++){
        if (clusters[s].state !== 1 || now - cu.uCStart.value[s] < 0.6) continue;
        var ctr = cu.uCCenter.value[s];
        var reach = clusters[s].reach * 0.85 + CRAFT_HIT_RADIUS;
        if (sweptDistance(prevCraftPos, craft.position, ctr) > reach) continue;
        dissolveCluster(s, now, EXPLODE_STRENGTH);
        flashAt(s, ctr, 1.2 + cu.uCScale.value[s] * 2, cu.uCColor.value[s]);
        crash(ctr);
      }
      checkLoops();
    }

    // ---------- input: arrow keys (+ WASD), Shift to boost; on touch, tap/drag to steer + Boost ----------
    var keys = { up: false, down: false, left: false, right: false, boost: false };
    var KEYMAP = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
                   w: 'up', s: 'down', a: 'left', d: 'right', W: 'up', S: 'down', A: 'left', D: 'right', Shift: 'boost' };
    var hintEl = document.getElementById('hint');
    var hintGone = false;
    function dismissHint(){
      if (hintGone || !hintEl) return;
      hintGone = true;
      hintEl.classList.add('gone');
    }
    window.addEventListener('keydown', function(e){
      var k = KEYMAP[e.key];
      if (!k || e.altKey || e.ctrlKey || e.metaKey) return;
      e.preventDefault();
      pressFlightKey(k);
      dismissHint();
    });
    window.addEventListener('keyup', function(e){
      var k = KEYMAP[e.key];
      if (k) keys[k] = false;
    });
    window.addEventListener('blur', function(){ Object.keys(keys).forEach(function(k){ keys[k] = false; }); });

    // touch screens: no arrow pad -- the craft flies forward on its own (Auto-cruise by default),
    // tilt the phone or tap/drag on the left / right half of the screen to steer, hold Boost to boost
    var touchFly = false;
    function enableTouch(){
      if (touchFly) return;
      touchFly = true;
      document.body.classList.add('touch');
    }
    if (isTouch) enableTouch();

    // tilt to steer (touch screens only): tipping the phone left or right turns that way, harder
    // the further it's tipped -- nothing inside TILT_DEADZONE degrees (so holding it roughly level
    // flies straight), full turn at TILT_FULL degrees. iOS only hands out motion data after a tap
    // grants permission, so it's asked for on the first touch; elsewhere it just starts.
    var TILT_DEADZONE = 5, TILT_FULL = 25;
    var tiltTurn = 0;                        // -1..1, + = left (same sign as the ← key)
    var tiltOn = false;
    function onTilt(e){
      if (!touchFly || e.gamma == null) return;
      var angle = (screen.orientation && screen.orientation.angle) || window.orientation || 0;
      // the left/right tip is gamma in portrait, beta in landscape (sign flips with the side)
      var tilt = angle === 90 ? e.beta : (angle === -90 || angle === 270) ? -e.beta : e.gamma;
      var mag = Math.max(0, Math.abs(tilt) - TILT_DEADZONE) / (TILT_FULL - TILT_DEADZONE);
      tiltTurn = -Math.sign(tilt) * Math.min(1, mag);   // left edge down = negative tilt = turn left
    }
    function startTilt(){
      if (tiltOn || !window.DeviceOrientationEvent) return;
      var DOE = window.DeviceOrientationEvent;
      if (typeof DOE.requestPermission === 'function'){
        DOE.requestPermission().then(function(res){
          if (res === 'granted' && !tiltOn){ tiltOn = true; window.addEventListener('deviceorientation', onTilt); }
        }).catch(function(){});
      } else {
        tiltOn = true;
        window.addEventListener('deviceorientation', onTilt);
      }
    }
    if (isTouch && !(window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === 'function')) startTilt();
    window.addEventListener('touchend', function(){ if (touchFly) startTilt(); }, { passive: true });
    window.addEventListener('blur', function(){ tiltTurn = 0; });
    // a touch anywhere on a device we didn't detect as touch-first still switches to touch controls
    window.addEventListener('touchstart', enableTouch, { passive: true, once: true });

    var boostBtn = document.getElementById('boostBtn');
    if (boostBtn){
      var boostPress = function(e){ e.preventDefault(); pressFlightKey('boost'); boostBtn.classList.add('active'); try { boostBtn.setPointerCapture(e.pointerId); } catch (err) {} };
      var boostRelease = function(){ keys.boost = false; boostBtn.classList.remove('active'); };
      boostBtn.addEventListener('pointerdown', boostPress);
      boostBtn.addEventListener('pointerup', boostRelease);
      boostBtn.addEventListener('pointercancel', boostRelease);
      boostBtn.addEventListener('lostpointercapture', boostRelease);
      boostBtn.addEventListener('contextmenu', function(e){ e.preventDefault(); });
    }

    // each finger on the scene steers toward its side of the screen; dragging across the
    // middle switches sides. Several fingers: left wins if any is on the left and none right.
    var steerTouches = {};
    function applyTouchSteer(){
      var l = false, r = false;
      for (var id in steerTouches){ if (steerTouches[id] === 'left') l = true; else r = true; }
      keys.left = l && !r;
      keys.right = r && !l;
    }
    function touchSide(e){ return e.clientX < window.innerWidth / 2 ? 'left' : 'right'; }
    renderer.domElement.addEventListener('pointerdown', function(e){
      if (e.pointerType === 'mouse') return;
      enableTouch();
      e.preventDefault();
      steerTouches[e.pointerId] = touchSide(e);
      applyTouchSteer();
      dismissHint();
      try { renderer.domElement.setPointerCapture(e.pointerId); } catch (err) {}
    });
    renderer.domElement.addEventListener('pointermove', function(e){
      if (!(e.pointerId in steerTouches)) return;
      steerTouches[e.pointerId] = touchSide(e);
      applyTouchSteer();
    });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function(type){
      renderer.domElement.addEventListener(type, function(e){
        if (!(e.pointerId in steerTouches)) return;
        delete steerTouches[e.pointerId];
        applyTouchSteer();
      });
    });
    renderer.domElement.addEventListener('contextmenu', function(e){ if (touchFly) e.preventDefault(); });

    // ---------- flight mode: Manual / Auto-cruise ----------
    var autoCruise = false;
    var AUTO_RESUME_SECONDS = 3;             // Auto-cruise: no ←/→ for this long and it rejoins the course
    var lastSteerAt = -Infinity;             // when ←/→ was last held (scene time, seconds)
    var modeBtns = document.querySelectorAll('[data-mode]');
    function setMode(auto){
      autoCruise = auto;
      modeBtns.forEach(function(b){
        var on = (b.getAttribute('data-mode') === 'auto') === auto;
        b.classList.toggle('on', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      document.body.classList.toggle('auto-cruise', auto);
      if (auto && !touchFly) dismissHint();       // (the touch hint is about steering, still useful in Auto-cruise)
      Object.keys(keys).forEach(function(k){ keys[k] = false; });
      // switching either way keeps the current speed: Auto-cruise ramps up from here, Manual
      // carries on from here (and the tube takes it up or a hit resets it)
      craftState.target = Math.max(BASE_SPEED, Math.min(SPEED_CAP, craftState.speed));
      lastSteerAt = -Infinity;                   // Auto-cruise takes the course straight away
      applyCourseVisibility();                   // the tube is hidden while flying itself
    }
    // in Auto-cruise, ↑ or ↓ hands control back (Manual); ←/→ just steer
    function pressFlightKey(k){
      if (autoCruise && (k === 'up' || k === 'down')) setMode(false);
      keys[k] = true;
    }
    modeBtns.forEach(function(b){
      b.addEventListener('click', function(){ setMode(b.getAttribute('data-mode') === 'auto'); b.blur(); });
    });
    setMode(touchFly);                           // phones start in Auto-cruise, desktop in Manual

    // autopilot: how hard to turn (-1..1 of the normal turn rate) to follow the course. It
    // steers proportionally toward the next waypoint (a gentle gain, which together with the
    // turn easing gives smooth, well-damped curves), and once a waypoint is close it already
    // looks to the one after, so it never jinks at the last moment.
    var AUTOPILOT_GAIN = 2.5;
    function autopilotTurn(){
      var target = null, c = craft.position;
      for (var j = 0; j < loops.length; j++){
        if (loops[j].state !== 'ahead') continue;
        target = loops[j];
        if (target.group.position.distanceTo(c) > 10) break;   // far enough: aim here
      }
      if (!target) return 0;
      var p = target.group.position;
      var want = Math.atan2(-(p.x - c.x), -(p.z - c.z));
      var diff = want - craftState.heading;
      diff = Math.atan2(Math.sin(diff), Math.cos(diff));      // shortest way round
      return Math.max(-1, Math.min(1, diff * AUTOPILOT_GAIN));
    }

    // ---------- spacecraft flight + chase camera ----------
    var camTarget = new THREE.Vector3();
    var camLook = new THREE.Vector3();
    var camFwd = new THREE.Vector3(0, 0, -1);

    function updateCraft(delta, t){
      var f = delta * 60;
      var st = craftState;
      st.rattle = Math.max(0, st.rattle - delta / RATTLE_TIME);
      var control = 1 - 0.6 * st.rattle;           // controls feel sluggish while rattled
      prevCraftPos.copy(craft.position);
      // steering: the arrow keys in Manual. In Auto-cruise the autopilot follows the (hidden) tube, but
      // ←/→ (or tilt / taps) take over and can steer right out of it; after AUTO_RESUME_SECONDS with no steering the
      // autopilot takes back over and flies onto the course again.
      // Either way the turn rate eases in and out rather than snapping, so turns look smooth.
      var turnInput = (keys.left ? 1 : 0) - (keys.right ? 1 : 0);
      if (!turnInput) turnInput = tiltTurn;          // touch screens: tilt steers, proportionally
      var throttle = keys.up || keys.boost || touchFly;   // touch screens always fly forward
      if (autoCruise){
        if (turnInput) lastSteerAt = t;
        else if (t - lastSteerAt > AUTO_RESUME_SECONDS) turnInput = autopilotTurn();
        throttle = true;
        // Auto-cruise: work up to max speed gradually rather than jumping to it
        st.target = Math.min(SPEED_CAP, st.target + (SPEED_CAP - BASE_SPEED) / AUTO_RAMP_SECONDS * delta);
      }
      st.turnVel += (turnInput - st.turnVel) * Math.min(1, TURN_EASE * f);
      var turn = st.turnVel;
      st.heading += turn * CRAFT_TURN * control * f;
      fwd.set(-Math.sin(st.heading), 0, -Math.cos(st.heading));
      right.set(Math.cos(st.heading), 0, -Math.sin(st.heading));

      // Shift boost: eases in while held, back out when released (either mode)
      var boostGoal = keys.boost ? BOOST : 1;
      st.boost += (boostGoal - st.boost) * Math.min(1, (boostGoal > st.boost ? 0.05 : 0.03) * f);
      var goal = st.target * st.boost;

      // speed: ↑ flies at the cruise speed, which only the tube changes (see checkLoops/crash)
      if (keys.down && !autoCruise){
        st.speed = Math.max(-0.03, st.speed - 0.004 * f);                // brake, then creep backwards
      } else if (throttle || st.speed > goal + 0.005){
        // (the second case: settling back down after a crash or a boost, even off the throttle)
        var rate = goal > st.speed ? 0.03 : 0.05;
        st.speed += (goal - st.speed) * Math.min(1, rate * f * control);
      } else {
        st.speed *= Math.pow(0.985, f);                                  // coast to a stop
      }
      st.thrust += ((throttle ? 1 : 0) - st.thrust) * 0.1 * f;

      st.side.multiplyScalar(Math.pow(0.93, f));
      st.vel.copy(fwd).multiplyScalar(st.speed).add(st.side);
      craft.position.addScaledVector(st.vel, f);

      craft.rotation.set(0, st.heading, 0);
      st.bank += (turn * 0.55 - st.bank) * 0.08 * f;
      // rattle: fast shudder on every axis that eases out
      var r = st.rattle * st.rattle;
      craftBody.rotation.set(
        -Math.min(st.speed * 0.8, 0.12) + Math.sin(t * 47) * 0.22 * r,
        Math.sin(t * 39 + 1.3) * 0.18 * r,
        st.bank + Math.sin(t * 53 + 2.1) * 0.35 * r
      );
      craftBody.position.set(Math.sin(t * 61) * 0.07 * r, Math.sin(t * 43 + 0.7) * 0.07 * r + Math.sin(t * 1.3) * 0.03, 0);

      // engine: brighter and longer with thrust and speed, flickers while rattled
      var flicker = st.rattle > 0 ? 0.55 + 0.45 * Math.abs(Math.sin(t * 70)) : 1;
      var speedT = Math.min(1, Math.max(st.speed, 0) / 0.6);
      var power = (0.35 + 0.45 * st.thrust + 0.4 * speedT) * flicker;
      engineGlow.scale.setScalar(0.35 + power * 0.9);
      engineGlow.material.opacity = 0.5 + 0.5 * Math.min(power, 1);
      engineCore.scale.setScalar(0.7 + power * 0.5);
      engineLight.intensity = 0.4 + power;

      // trail: lay points along the engine's path since last frame (more the faster it goes),
      // so it reads as a continuous ribbon even at full speed
      craft.updateMatrixWorld(true);
      _enginePos.set(0, 0, 0.72).applyMatrix4(craftBody.matrixWorld);
      for (var j = 0; j < TRAIL_N; j++) trailAge[j] += delta;
      var pw = Math.min(1, 0.15 + speedT) * flicker;
      var subs = Math.max(3, Math.min(30, Math.ceil(_enginePos.distanceTo(_lastEngine) / 0.05)));
      for (var sub = 1; sub <= subs; sub++){
        var a = sub / subs;
        trailHead = (trailHead + 1) % TRAIL_N;
        trailPos[trailHead*3]   = _lastEngine.x + (_enginePos.x - _lastEngine.x) * a;
        trailPos[trailHead*3+1] = _lastEngine.y + (_enginePos.y - _lastEngine.y) * a;
        trailPos[trailHead*3+2] = _lastEngine.z + (_enginePos.z - _lastEngine.z) * a;
        trailAge[trailHead] = delta * (1 - a);
        trailPower[trailHead] = pw;
      }
      _lastEngine.copy(_enginePos);
      trailGeo.attributes.position.needsUpdate = true;
      trailGeo.attributes.age.needsUpdate = true;
      trailGeo.attributes.power.needsUpdate = true;
    }

    function updateCamera(delta, t){
      var f = delta * 60;
      var st = craftState;
      var r = st.rattle * st.rattle;
      // chase camera locked to the craft's position (so framing holds at any speed), easing
      // after its heading; looking a little ahead and down puts the craft just below centre
      st.camHeading += (st.heading - st.camHeading) * Math.min(1, 0.12 * f);
      camFwd.set(-Math.sin(st.camHeading), 0, -Math.cos(st.camHeading));
      camTarget.copy(craft.position).addScaledVector(camFwd, -CHASE_BACK).addScaledVector(UP, CHASE_UP);
      camera.position.copy(camTarget);
      camera.position.x += Math.sin(t * 57) * 0.09 * r;
      camera.position.y += Math.sin(t * 49 + 1.1) * 0.09 * r;
      camLook.copy(craft.position).addScaledVector(camFwd, LOOK_AHEAD).addScaledVector(UP, LOOK_UP);
      camera.lookAt(camLook);
      // wider field of view the faster you go (warp feel)
      var fov = BASE_FOV + SPEED_FOV * Math.min(1, Math.max(st.speed, 0));
      if (Math.abs(fov - camera.fov) > 0.01){ camera.fov += (fov - camera.fov) * Math.min(1, 0.08 * f); applyProjection(); }
      camera.updateMatrixWorld();
      stars.position.copy(camera.position);
      renderUniforms.uCamDist.value = camera.position.distanceTo(craft.position);
      renderUniforms.uCamVel.value.copy(st.vel);

      velUniforms.uCraftPos.value.copy(craft.position);
      velUniforms.uCraftVel.value.copy(st.vel);
      velUniforms.uWakeRadius.value = WAKE_RADIUS[0] + (WAKE_RADIUS[1] - WAKE_RADIUS[0]) * Math.min(1, Math.max(st.speed, 0));
      uFieldCenter.value.copy(craft.position);
    }

    // keep coordinates near the origin however far the craft travels (float precision):
    // every so often shift the whole world back by the craft's offset in one frame
    var REBASE_AT = 400;
    function rebaseWorld(){
      if (craft.position.lengthSq() < REBASE_AT * REBASE_AT) return false;
      var d = uShift.value.copy(craft.position);
      craft.position.sub(d); prevCraftPos.sub(d); camTarget.sub(d); camera.position.sub(d); camLook.sub(d);
      camera.updateMatrixWorld();
      cu.uCCenter.value.forEach(function(v){ v.sub(d); });
      flashes.forEach(function(fl){ fl.sprite.position.sub(d); });
      landmarks.forEach(function(lm){ lm.group.position.sub(d); });
      loops.forEach(function(l){ l.group.position.sub(d); });
      tubeDirty = true;
      tubeTail.pos.sub(d); tubeTail.firstPos.sub(d);
      rivers.forEach(function(rv){ rv.group.position.sub(d); });
      course.pos.sub(d);
      for (var j = 0; j < TRAIL_N; j++){ trailPos[j*3] -= d.x; trailPos[j*3+1] -= d.y; trailPos[j*3+2] -= d.z; }
      trailGeo.attributes.position.needsUpdate = true;
      _lastEngine.sub(d);
      stars.position.copy(camera.position);
      velUniforms.uCraftPos.value.copy(craft.position);
      uFieldCenter.value.copy(craft.position);
      return true;
    }

    // ---------- sound (synthesised with Web Audio; no audio files) ----------
    // A rocket rumble that swells with thrust and speed, and a blast on every crash.
    // Browsers only allow audio after a user gesture, so it starts on the first key press /
    // tap. The speaker button in the HUD mutes it (remembered in localStorage).
    var audio = null;
    var soundOn = true;
    try { soundOn = localStorage.getItem('constellations-sound') !== 'off'; } catch (e) {}
    var soundBtn = document.getElementById('sound');

    function noiseBuffer(ctx, seconds, brown){
      var len = Math.floor(ctx.sampleRate * seconds);
      var buf = ctx.createBuffer(1, len, ctx.sampleRate);
      var data = buf.getChannelData(0), last = 0;
      for (var j = 0; j < len; j++){
        var white = Math.random() * 2 - 1;
        if (brown){ last = (last + 0.02 * white) / 1.02; data[j] = last * 3.5; }   // deep, rumbly
        else data[j] = white;
      }
      return buf;
    }
    function initAudio(){
      if (audio) { if (audio.ctx.state === 'suspended') audio.ctx.resume(); return; }
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      var ctx = new AC();
      var master = ctx.createGain();
      master.gain.value = soundOn ? 1 : 0;
      master.connect(ctx.destination);

      // engine: looping brown noise through a lowpass (roar) + a low sawtooth (throb)
      var roar = ctx.createBufferSource();
      roar.buffer = noiseBuffer(ctx, 2, true);
      roar.loop = true;
      var roarFilter = ctx.createBiquadFilter();
      roarFilter.type = 'lowpass'; roarFilter.frequency.value = 300; roarFilter.Q.value = 0.7;
      var roarGain = ctx.createGain(); roarGain.gain.value = 0;
      roar.connect(roarFilter); roarFilter.connect(roarGain); roarGain.connect(master);
      var hum = ctx.createOscillator();
      hum.type = 'sawtooth'; hum.frequency.value = 45;
      var humFilter = ctx.createBiquadFilter();
      humFilter.type = 'lowpass'; humFilter.frequency.value = 220;
      var humGain = ctx.createGain(); humGain.gain.value = 0;
      hum.connect(humFilter); humFilter.connect(humGain); humGain.connect(master);
      roar.start(); hum.start();

      audio = { ctx: ctx, master: master, roarFilter: roarFilter, roarGain: roarGain, hum: hum, humGain: humGain,
                blast: noiseBuffer(ctx, 1.6, false) };
    }
    function updateEngineSound(){
      if (!audio) return;
      var st = craftState, now = audio.ctx.currentTime;
      var sp = Math.min(1, Math.max(st.speed, 0) / 0.6);
      var level = st.thrust * 0.6 + sp * 0.4;                       // silent at rest, loudest flat out
      audio.roarGain.gain.setTargetAtTime(0.28 * level, now, 0.08);
      audio.roarFilter.frequency.setTargetAtTime(250 + 1500 * sp + 400 * st.thrust, now, 0.1);
      audio.humGain.gain.setTargetAtTime(0.06 * level, now, 0.08);
      audio.hum.frequency.setTargetAtTime(40 + 45 * sp + (st.rattle > 0 ? Math.random() * 12 * st.rattle : 0), now, 0.05);
    }
    function playExplosion(){
      if (!audio) return;
      var ctx = audio.ctx, now = ctx.currentTime;
      // crackling burst: white noise through a lowpass that closes as it fades
      var src = ctx.createBufferSource(); src.buffer = audio.blast;
      var lp = ctx.createBiquadFilter(); lp.type = 'lowpass';
      lp.frequency.setValueAtTime(3200, now);
      lp.frequency.exponentialRampToValueAtTime(120, now + 1.3);
      var g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(0.9, now + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);
      src.connect(lp); lp.connect(g); g.connect(audio.master);
      src.start(now); src.stop(now + 1.6);
      // low thump underneath
      var osc = ctx.createOscillator(); osc.type = 'sine';
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.exponentialRampToValueAtTime(32, now + 0.5);
      var og = ctx.createGain();
      og.gain.setValueAtTime(0.0001, now);
      og.gain.exponentialRampToValueAtTime(0.8, now + 0.01);
      og.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
      osc.connect(og); og.connect(audio.master);
      osc.start(now); osc.stop(now + 0.65);
    }
    function setSound(on){
      soundOn = on;
      try { localStorage.setItem('constellations-sound', on ? 'on' : 'off'); } catch (e) {}
      if (soundBtn){
        soundBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
        soundBtn.classList.toggle('muted', !on);
      }
      if (audio) audio.master.gain.setTargetAtTime(on ? 1 : 0, audio.ctx.currentTime, 0.05);
    }
    setSound(soundOn);
    if (soundBtn){
      soundBtn.addEventListener('click', function(){ initAudio(); setSound(!soundOn); soundBtn.blur(); });
    }
    ['keydown', 'pointerdown', 'touchstart'].forEach(function(type){
      window.addEventListener(type, initAudio, { passive: true });
    });
    document.addEventListener('visibilitychange', function(){
      if (!audio) return;
      if (document.hidden) audio.ctx.suspend(); else audio.ctx.resume();
    });

    // ---------- loop ----------
    var clock = new THREE.Clock();
    var flowTime = 0;

    function animate(){
      requestAnimationFrame(animate);
      frame(Math.min(clock.getDelta(), 0.05), clock.elapsedTime);
    }

    function frame(delta, t){
      uDt.value = delta * 60;
      uTime.value = t;
      flowTime += delta * MOTION_SPEED;
      velUniforms.uFlowTime.value = flowTime;

      updateCraft(delta, t);
      checkCollisions(t);
      var rebased = rebaseWorld();
      updateCamera(delta, t);
      updateLandmarks(delta);
      updateLoops(delta, t);
      updateClusters(t, delta);
      simulate();
      clearClusterFlags();
      if (rebased) uShift.value.set(0, 0, 0);
      updateFlashes(delta);
      updateHud(t);
      updateEngineSound();

      renderUniforms.tPos.value = posRT[cur].texture;
      renderUniforms.tVel.value = velRT[cur].texture;
      renderer.render(scene, camera);
      drawMeteors(delta, t);
    }

    // ---------- shooting stars (2D overlay) ----------
    // Up to 3 at a time, launched every 4-12s (avg 8) from just off one edge and streaking
    // all the way across the screen with a fading tail.
    var meteorCanvas = document.getElementById('meteors');
    var mctx = meteorCanvas.getContext('2d');
    var meteors = [];
    var nextMeteorAt = 3 + Math.random() * 5;
    var meteorTints = ['255,255,255', '186,230,253', '245,208,254', '254,240,138'];
    function sizeMeteors(){
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      meteorCanvas.width = Math.round(window.innerWidth * dpr);
      meteorCanvas.height = Math.round(window.innerHeight * dpr);
      mctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    sizeMeteors();
    window.addEventListener('resize', sizeMeteors);

    function launchMeteor(){
      var W = window.innerWidth, H = window.innerHeight, diag = Math.hypot(W, H);
      // mostly downward diagonals, either way, occasionally steeper or shallower
      var ang = (Math.random() < 0.5 ? 0.35 : Math.PI - 0.35) + (Math.random() - 0.5) * 0.7;
      var dx = Math.cos(ang), dy = Math.sin(ang);
      // start off-screen behind the centre line, offset sideways so paths cover the whole screen
      var off = (Math.random() - 0.5) * diag * 0.8;
      var sx = W / 2 - dx * (diag / 2 + 80) - dy * off;
      var sy = H / 2 - dy * (diag / 2 + 80) + dx * off;
      meteors.push({
        x: sx, y: sy, dx: dx, dy: dy,
        speed: 700 + Math.random() * 800,
        tail: 110 + Math.random() * 190,
        width: 1 + Math.random() * 1.2,
        tint: meteorTints[Math.floor(Math.random() * meteorTints.length)],
        dist: 0, total: diag + 160 + 300
      });
    }

    function drawMeteors(delta, t){
      mctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      if (prefersReducedMotion) return;
      if (t > nextMeteorAt){
        if (meteors.length < METEOR_MAX) launchMeteor();
        nextMeteorAt = t + METEOR_EVERY[0] + Math.random() * (METEOR_EVERY[1] - METEOR_EVERY[0]);
      }
      for (var m = meteors.length - 1; m >= 0; m--){
        var s = meteors[m];
        s.dist += s.speed * delta;
        if (s.dist > s.total){ meteors.splice(m, 1); continue; }
        var hx = s.x + s.dx * s.dist, hy = s.y + s.dy * s.dist;
        var tl = Math.min(s.tail, s.dist);
        var tx = hx - s.dx * tl, ty = hy - s.dy * tl;
        var life = Math.min(1, s.dist / 200) * Math.min(1, (s.total - s.dist) / 200);
        var g = mctx.createLinearGradient(tx, ty, hx, hy);
        g.addColorStop(0, 'rgba(' + s.tint + ',0)');
        g.addColorStop(1, 'rgba(' + s.tint + ',' + (0.85 * life) + ')');
        mctx.strokeStyle = g;
        mctx.lineWidth = s.width;
        mctx.lineCap = 'round';
        mctx.beginPath(); mctx.moveTo(tx, ty); mctx.lineTo(hx, hy); mctx.stroke();
        var glow = mctx.createRadialGradient(hx, hy, 0, hx, hy, 3.5 * s.width);
        glow.addColorStop(0, 'rgba(255,255,255,' + (0.9 * life) + ')');
        glow.addColorStop(1, 'rgba(' + s.tint + ',0)');
        mctx.fillStyle = glow;
        mctx.beginPath(); mctx.arc(hx, hy, 3.5 * s.width, 0, Math.PI * 2); mctx.fill();
      }
    }

    // first landmarks: one galaxy roughly straight ahead so there's something to chase from the start
    (function initialLandmarks(){
      var first = makeGalaxy();
      first.group.position.set(-60 + Math.random() * 120, 20 + Math.random() * 30, -(300 + Math.random() * 100));
      scene.add(first.group);
      landmarks.push(first);
      while (landmarks.length < LANDMARK_COUNT) spawnLandmark(Math.PI * 0.6);
    })();
    updateCraft(0, 0);
    updateCamera(0, 0);
    updateLoops(0, 0);
    animate();
  }
})();
