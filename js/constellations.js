// Constellations (V1) — a full-screen WebGL particle field (Three.js r128, loaded from cdnjs by
// constellations.html): click to gather shapes, black-hole cursor, right-drag orbit, Rotation
// speed / Cursor radius sliders. All particle physics runs on the GPU: positions/velocities
// live in float textures updated by two full-screen shader passes per frame.
// (V2, the spacecraft, lives on its own page for now: constellations-v2.html /
// js/constellations-v2.js.) See reference/constellations-page.md.
(function(){
  "use strict";

  var canvas = document.getElementById('scene');
  var fallback = document.getElementById('fallback');

  function showFallback(html){
    fallback.style.display = 'flex';
    canvas.style.display = 'none';
    document.querySelectorAll('.v1-only').forEach(function(el){ el.style.display = 'none'; });
    if (html) fallback.querySelector('div').innerHTML = html;
  }

  if (typeof THREE === 'undefined') {
    showFallback();
  } else {
    try { runV1(); }
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
})();
