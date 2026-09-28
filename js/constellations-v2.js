// Constellations V2 — the spacecraft (Three.js r128, loaded from cdnjs by constellations-v2.html):
// fly anywhere in 3D through a particle tube, cruising or a Challenge (tube distance + best), no speed limit, Shift
// boost, Space brake; tilt / tap steering on phones. All particle physics runs on the GPU:
// positions/velocities live in float textures updated by two full-screen shader passes per
// frame. (Kept on its own page while it's in progress; V1 is constellations.html /
// js/constellations.js.) See reference/constellations-page.md.
(function(){
  "use strict";

  var canvas = document.getElementById('scene');
  var fallback = document.getElementById('fallback');

  function showFallback(html){
    fallback.style.display = 'flex';
    canvas.style.display = 'none';
    document.querySelectorAll('.v2-only').forEach(function(el){ el.style.display = 'none'; });
    if (html) fallback.querySelector('div').innerHTML = html;
  }

  if (typeof THREE === 'undefined') {
    showFallback();
  } else {
    try { runV2(); }
    catch (e) {
      console.error(e);
      showFallback('<strong>Something went wrong loading the scene.</strong><br>Try reloading the page.');
    }
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
    // speed: cruise at BASE_SPEED; in a Challenge, x LOOP_SPEEDUP for every waypoint flown through
    // the middle of the tube, back to BASE_SPEED on any hit. Cruising (no challenge) ramps up
    // gradually, AUTO_RAMP_RATE per second. There is no speed limit in either. Switching keeps
    // the current speed. Shift (or the Boost button on touch screens) multiplies whatever the
    // speed is by up to BOOST, briefly.
    var BASE_SPEED     = 0.08;
    var LOOP_SPEEDUP   = 1.1;
    var AUTO_RAMP_RATE = 0.006;                                // cruising: speed gained per second (~65 km/h a second), no ceiling
    var BOOST          = 1.6;                                  // Shift: speed x this while held (eases in / out)
    var KMH_PER_SPEED  = 10800;                                // display: 1 world unit = 50 m, so units/frame x 60 x 50 x 3.6
    var CRAFT_TURN     = 0.032;                                // yaw rate while holding left/right (rad/frame)
    var CRAFT_PITCH    = 0.028;                                // pitch rate while holding up/down (rad/frame): full loops are possible
    var AUTO_LEVEL     = 0.02;                                 // when not pitching, the craft gently rolls back upright (so left/right stay intuitive)
    var BRAKE_RATE     = 0.006;                                // Space: speed lost per frame while held (down to a stop)
    var RESTART_ACCEL  = 0.0006;                               // after braking to a stop: gentlest pull-away (0 -> cruise in ~2s)
    var TURN_EASE      = 0.09;                                 // how quickly the turn rate eases toward the input (smooths steering)
    var CRAFT_HIT_RADIUS = 0.45;                               // collision size against clusters
    var WAKE_RADIUS    = [1.6, 6];                             // bow-wave reach at rest / at high speed
    var STREAK_FRAMES  = 9;                                    // dashes show this many frames of motion (relative to the camera)
    var STREAK_MAX_PX  = 90;                                   // longest dash on screen
    var RATTLE_TIME    = 2.6;                                  // seconds the craft shakes after a crash
    var CHASE_BACK = 5.2, CHASE_UP = 1.4, LOOK_AHEAD = 5, LOOK_UP = 0.2; // chase camera (craft sits a bit below centre)
    var BASE_FOV = 50, SPEED_FOV = 22;                         // field of view widens with speed

    // the course: waypoints joined by a particle tube you fly through (the only shape you can pass through)
    var LOOP_RADIUS    = 2.2;                                  // tube radius at each waypoint
    var LOOP_SPACING   = [26, 40];                             // distance between consecutive loops at cruise speed...
    var LOOP_SPACING_MAX_STRETCH = 4;                          // ...stretched with speed (up to this x) so there's time to steer
    var LOOP_FIRST     = 22;                                   // how far ahead a new course starts
    var LOOPS_AHEAD    = 4;                                    // loops laid out ahead at any time
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

    var craft = new THREE.Group();       // position + full 3D orientation (what the physics moves)
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
      pitchVel: 0,                        // eased pitch rate (-1..1 of CRAFT_PITCH), + = nose up
      camQuat: new THREE.Quaternion(),    // the chase camera eases after the craft's orientation
      speed: 0,                           // forward speed, units per frame
      target: BASE_SPEED,                 // cruise speed: BASE_SPEED x LOOP_SPEEDUP per loop since the last hit
      turnVel: 0,                         // eased turn rate (-1..1 of CRAFT_TURN), for smooth turns
      boost: 1,                           // eased Shift boost multiplier (1..BOOST)
      side: new THREE.Vector3(),          // sideways knock from a crash, decays
      vel: new THREE.Vector3(),           // resulting world velocity, units per frame
      bank: 0,
      rattle: 0,                          // 1 right after a crash, eases to 0 over RATTLE_TIME
      thrust: 0,
      restarting: false                   // pulling away gently after braking to a stop
    };
    var fwd = new THREE.Vector3(0, 0, -1);
    var right = new THREE.Vector3(1, 0, 0);
    var craftUp = new THREE.Vector3(0, 1, 0);   // the craft's own up (its orientation is craft.quaternion)
    var UP = new THREE.Vector3(0, 1, 0);
    var prevCraftPos = new THREE.Vector3();

    // random directions for placing things in 3D: perpDir() is any direction square to `axis`;
    // coneDir() is within `spread` radians of it, any way round
    var _p1 = new THREE.Vector3(), _p2 = new THREE.Vector3(), _lmDir = new THREE.Vector3();
    function perpDir(out, axis){
      _p1.crossVectors(axis, Math.abs(axis.y) < 0.9 ? UP : _p2.set(1, 0, 0)).normalize();
      _p2.crossVectors(axis, _p1);
      var phi = Math.random() * 6.2832;
      return out.copy(_p1).multiplyScalar(Math.cos(phi)).addScaledVector(_p2, Math.sin(phi));
    }
    function coneDir(out, axis, spread){
      var th = spread * Math.sqrt(Math.random());
      perpDir(out, axis).multiplyScalar(Math.sin(th));
      return out.addScaledVector(axis, Math.cos(th)).normalize();
    }

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
    // swapped for new ones once they're left far behind.
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
      // somewhere ahead, within `spread` radians of the way the craft is pointing (any way round)
      var d = LANDMARK_DIST[0] + Math.random() * (LANDMARK_DIST[1] - LANDMARK_DIST[0]);
      lm.group.position.copy(craft.position).addScaledVector(coneDir(_lmDir, fwd, spread), d);
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
    // past slowly like a Milky Way band. Sky / orchid / amber / rose.
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
      // far off to one side of the way the craft is pointing (any way round: above, below,
      // beside), a little ahead or behind, so it arcs across the sky without crossing the route
      var d = RIVER_DIST[0] + Math.random() * (RIVER_DIST[1] - RIVER_DIST[0]);
      var off = 450 + Math.random() * 500;
      perpDir(_lmDir, fwd).multiplyScalar(off).addScaledVector(fwd, d * (Math.random() * 1.2 - 0.2));
      lm.group.position.copy(craft.position).add(_lmDir);
      scene.add(lm.group);
      rivers.push(lm);
    }

    // ---------- the course: invisible waypoints, drawn as a particle tube ----------
    // A chain of waypoints laid out one after another along a path that curves gently in any
    // direction ahead of the craft; the tube (below) is drawn through them. Flying through the
    // middle of the tube at a waypoint speeds you up; clipping its wall there counts as a hit.
    // The course keeps extending ahead as waypoints are used up, and is only re-laid in front of
    // the craft once it strays more than COURSE_FAR from it. (The code calls waypoints "loops" -- they
    // used to be drawn as rings.)
    var loops = [];
    var loopIdSeq = 0;
    var course = { pos: new THREE.Vector3(), dir: new THREE.Vector3(0, 0, -1), heading: new THREE.Vector3(0, 0, -1), active: false };
    var COURSE_FAR = 10;                   // re-lay the course only once the craft is this far from it (10 units = 500 m)
    var COURSE_MAX_BEND = 0.7;             // the course wanders at most this far (rad) from its overall heading...
    var COURSE_DRIFT = 0.1;                // ...which itself drifts slowly after the way the course has been going
    var loopStreak = 0;                     // waypoints flown through since the last hit
    var loopRadius = LOOP_RADIUS;           // tube radius at each waypoint
    var _ln = new THREE.Vector3(), _hit = new THREE.Vector3();

    function makeLoop(pos, dir){
      var marker = new THREE.Object3D();      // just a position (never added to the scene)
      marker.position.copy(pos);
      var size = loopRadius / LOOP_RADIUS;
      var loop = {
        group: marker, size: size, radius: loopRadius, id: ++loopIdSeq,
        normal: dir.clone(),                  // the way the course runs through it
        state: 'ahead', fade: 0
      };
      loops.push(loop);
      return loop;
    }
    function removeLoop(j){ loops.splice(j, 1); }
    function restartCourse(){
      course.dir.copy(fwd);
      tubeTail.firstId = -1;                  // a fresh course: start the tube just behind the craft, not at the old one
      tubeTail.pos.copy(craft.position).addScaledVector(fwd, -12);
      course.heading.copy(course.dir);
      course.pos.copy(craft.position).addScaledVector(course.dir, LOOP_FIRST - LOOP_SPACING[0]);
      course.active = true;
      course.laid = false;
    }
    var _cPerp = new THREE.Vector3();
    function extendCourse(){
      // each new waypoint bends the path a little, any way round -- left, right, up, down (the
      // first one sits dead ahead) -- never swinging more than COURSE_MAX_BEND from the course's
      // overall heading, which drifts slowly after it (so it meanders, but never doubles back)
      if (course.laid) course.dir.addScaledVector(perpDir(_cPerp, course.dir), Math.random() * 0.3).normalize();
      course.laid = true;
      var cosA = course.dir.dot(course.heading);
      if (cosA < Math.cos(COURSE_MAX_BEND)){
        _cPerp.copy(course.dir).addScaledVector(course.heading, -cosA);
        if (_cPerp.lengthSq() < 1e-6) perpDir(_cPerp, course.heading);
        _cPerp.normalize();
        course.dir.copy(course.heading).multiplyScalar(Math.cos(COURSE_MAX_BEND)).addScaledVector(_cPerp, Math.sin(COURSE_MAX_BEND));
      }
      course.heading.lerp(course.dir, COURSE_DRIFT).normalize();
      var step = (LOOP_SPACING[0] + Math.random() * (LOOP_SPACING[1] - LOOP_SPACING[0])) * loopStretch();
      _ln.copy(course.pos);
      course.pos.addScaledVector(course.dir, step);
      clearRoute(_ln, course.pos);
      makeLoop(course.pos, course.dir);
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
    // how far the craft is from the course's centre line -- measured against the tube's actual
    // curve (tubeSamples, every 0.5 units) once it's been built, else the straight path through
    // the waypoints (on long, fast stretches the curve can bow several units off those chords)
    function distanceToCourse(){
      var best = Infinity, c = craft.position, S = tubeSamples;
      if (S.length >= 8){
        for (var j = 0; j + 7 < S.length; j += 4){
          _sa.set(S[j], S[j+1], S[j+2]); _sb.set(S[j+4], S[j+5], S[j+6]);
          best = Math.min(best, sweptDistance(_sa, _sb, c));
        }
        return best;
      }
      var prev = tubeTail.pos;
      for (j = 0; j < loops.length; j++){
        if (loops[j].state !== 'ahead') continue;
        best = Math.min(best, sweptDistance(prev, loops[j].group.position, c));
        prev = loops[j].group.position;
      }
      return best;
    }
    function updateLoops(delta, t){
      // the course stays put however you fly around it -- turn away, turn back, fly alongside
      // -- and is only re-laid ahead (aligned with where the craft points) once the craft is
      // more than COURSE_FAR from it. Never while it's inside the tube: then the course just keeps
      // extending ahead as usual.
      if (!course.active || (aheadCount() && !insideTube() && distanceToCourse() > COURSE_FAR)){
        for (var j = loops.length - 1; j >= 0; j--) if (loops[j].state === 'ahead') loops[j].state = 'missed';
        restartCourse();
      }
      while (aheadCount() < LOOPS_AHEAD) extendCourse();

      for (j = loops.length - 1; j >= 0; j--){
        var lp = loops[j];
        if (lp.state === 'ahead'){
          // waypoints left behind -- the craft is past them along the course (beside, not
          // through) -- quietly retire, and the course extends further on
          _toC.copy(craft.position).sub(lp.group.position);
          if (_toC.dot(lp.normal) > 12) lp.state = 'missed';
          continue;
        }
        lp.fade += delta;                       // used ones linger briefly, then go
        if (lp.fade >= 1) removeLoop(j);
      }
      updateTube(t);
    }

    // ---------- the tube: a wormhole of light along the course ----------
    // Drawn only in a Challenge (hidden while cruising). Flying through it at each waypoint speeds
    // you up; its wall is just light -- flying out through it only ends the distance run.
    // A wormhole of light: tens of thousands of particles swirling round the course, each drawn
    // as a short streak along the tube (twisted a little round it, so they read as a spiral),
    // in blue / violet / magenta / cyan, with bright pulses racing along. Three kinds: the wall
    // itself (most), soft wisps drifting further out, and a few bright sparks inside.
    // Positions are built on the CPU when the course changes (centre point + frame + angle +
    // radius per particle); the swirl, colour and streaks are all done in the shader.
    var TUBE_DENSITY = isSmall ? 160 : 320;          // particles per unit of tube length...
    var TUBE_MAX_PARTICLES = isSmall ? 32000 : 80000;  // ...up to this many
    var TUBE_FRAME_STEP = 0.5;                       // centre-line sample spacing (also used by insideTube)
    var TUBE_ARMS = 5;                               // spiral bands the wall particles bunch into
    var tubeTime = { value: 0 }, tubeLen = { value: 1 };
    var tubeGeo = new THREE.BufferGeometry();
    var tube = new THREE.Points(tubeGeo, new THREE.ShaderMaterial({
      uniforms: { uTime: tubeTime, uLen: tubeLen, uScale: renderUniforms.uScale, uViewport: renderUniforms.uViewport },
      vertexShader: [
        'uniform float uTime; uniform float uLen; uniform float uScale; uniform vec2 uViewport;',
        'attribute vec3 aTan; attribute vec3 aSide; attribute vec4 aP; attribute float along; attribute float aKind;',
        'varying vec3 vColor; varying float vAlpha; varying vec2 vDir; varying float vLen; varying float vSize;',
        'vec3 pal(float t){',
        '  vec3 a = vec3(0.25, 0.36, 1.0), b = vec3(0.6, 0.32, 1.0), c = vec3(1.0, 0.36, 0.76), d = vec3(0.36, 0.88, 1.0);',
        '  t = fract(t) * 4.0;',
        '  if (t < 1.0) return mix(a, b, t);',
        '  if (t < 2.0) return mix(b, c, t - 1.0);',
        '  if (t < 3.0) return mix(c, d, t - 2.0);',
        '  return mix(d, a, t - 3.0);',
        '}',
        'void main(){',
        '  float rnd = aP.w;',
        // swirl: every particle orbits the centre line (wisps slower, sparks faster)
        '  float spin = (aKind > 1.5 ? 0.9 : aKind > 0.5 ? 0.18 : 0.35) + 0.25 * rnd;',
        '  float a = aP.x + uTime * spin;',
        '  vec3 up = cross(aSide, aTan);',
        '  vec3 radial = cos(a) * aSide + sin(a) * up;',
        '  vec3 swirl = -sin(a) * aSide + cos(a) * up;',
        '  vec3 p = position + radial * aP.y;',
        '  vec3 dir = normalize(aTan + swirl * 0.18);',          // mostly along the tube: streaks rush past, radiating from the far end
        '  vec4 mv = modelViewMatrix * vec4(p, 1.0);',
        '  float depth = -mv.z;',
        // light pulses racing along the tube, over a steady glow
        '  float band = pow(0.5 + 0.5 * sin(along * 0.3 - uTime * 6.0 + rnd * 1.5), 10.0);',
        '  vec3 col = pal(along * 0.012 + a * 0.08 + rnd * 0.22 + uTime * 0.03);',
        '  vColor = mix(col * 1.35, vec3(1.0, 0.94, 1.0), band * 0.6 + (aKind > 1.5 ? 0.5 : 0.0));',
        '  float alpha = aKind > 1.5 ? 1.0 : aKind > 0.5 ? 0.13 : 0.8;',
        '  alpha *= 0.55 + 0.45 * band + 0.25 * rnd;',
        '  alpha *= smoothstep(0.0, 6.0, along) * smoothstep(0.0, 10.0, uLen - along);',   // soft ends
        '  alpha *= smoothstep(1.2, 5.0, depth);',                                          // don't blind the camera from inside
        '  float size = (aKind > 1.5 ? 0.045 : aKind > 0.5 ? 0.3 : 0.075) * uScale / max(depth, 0.1);',
        '  size = min(size, aKind > 0.5 && aKind < 1.5 ? 18.0 : 10.0);',     // (wisps: big soft haze)
        '  if (size < 1.2){ alpha *= size / 1.2; size = 1.2; }',
        // the streak: from here a little way along its direction, measured on screen
        '  vec4 clip0 = projectionMatrix * mv;',
        '  vec4 clip1 = projectionMatrix * (modelViewMatrix * vec4(p + dir * aP.z, 1.0));',
        '  vec2 dpx = (clip1.xy / clip1.w - clip0.xy / clip0.w) * 0.5 * uViewport;',
        '  float len = (clip1.w > 0.1 && clip0.w > 0.1) ? min(length(dpx), 110.0) : 0.0;',
        '  if (len < 1.0) len = 0.0;',
        '  vDir = len > 0.0 ? normalize(dpx) : vec2(1.0, 0.0);',
        '  dpx = vDir * len;',
        '  vLen = len; vSize = size;',
        '  alpha *= clamp(2.5 * size / (size + len), 0.25, 1.0);',   // long streaks spread their light thinner
        '  vAlpha = alpha;',
        '  gl_PointSize = size + len;',
        '  gl_Position = clip0;',
        '  gl_Position.xy += (dpx / uViewport) * clip0.w;',          // centre the sprite halfway along the streak
        '}'
      ].join('\n'),
      fragmentShader: [
        'varying vec3 vColor; varying float vAlpha; varying vec2 vDir; varying float vLen; varying float vSize;',
        'void main(){',
        '  vec2 q = (vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y) - 0.5) * (vSize + vLen);',
        '  float along = dot(q, vDir), across = dot(q, vec2(-vDir.y, vDir.x));',
        '  float r = length(vec2(max(abs(along) - vLen * 0.5, 0.0), across)) / (vSize * 0.5);',
        '  float d = r * r;',
        '  if (d > 1.0) discard;',
        '  float a = 1.0 - d;',
        '  float tail = vLen > 0.0 ? clamp(0.5 - along / max(vLen, 1.0), 0.0, 1.0) : 0.0;',   // fade toward the tail
        '  gl_FragColor = vec4(vColor, a * a * vAlpha * (1.0 - 0.7 * tail));',
        '}'
      ].join('\n'),
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
    }));
    tube.frustumCulled = false;
    scene.add(tube);
    // the tube's centre line + radius, sampled every TUBE_FRAME_STEP (0.5 units)
    // when it's rebuilt, as flat [x, y, z, r, ...] -- used to tell whether the craft is inside
    var tubeSamples = [];
    var _sa = new THREE.Vector3(), _sb = new THREE.Vector3(), _sp = new THREE.Vector3();
    function insideTube(){
      var c = craft.position, S = tubeSamples;
      for (var j = 0; j + 7 < S.length; j += 4){
        _sa.set(S[j], S[j+1], S[j+2]); _sb.set(S[j+4], S[j+5], S[j+6]);
        _sp.subVectors(_sb, _sa);
        var L2 = _sp.lengthSq();
        var u = L2 > 0 ? Math.max(0, Math.min(1, _sp.dot(_sb.subVectors(c, _sa)) / L2)) : 0;
        var r = S[j+3] + (S[j+7] - S[j+3]) * u;
        if (_sb.copy(_sa).addScaledVector(_sp, u).distanceToSquared(c) < r * r) return true;
      }
      return false;
    }
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
      tubeLen.value = len;
      // 1) the centre line every TUBE_FRAME_STEP: point, tangent, and a side vector carried along
      //    the curve (parallel transport) so the swirl never flips or pinches, however the course
      //    climbs, dives or loops -- also kept as tubeSamples for insideTube()
      var steps = Math.max(2, Math.floor(len / TUBE_FRAME_STEP) + 1);
      var FC = new Float32Array(steps * 3), FT = new Float32Array(steps * 3), FS = new Float32Array(steps * 3), FR = new Float32Array(steps);
      tubeSamples.length = 0;
      for (var i = 0; i < steps; i++){
        var u = i / (steps - 1);
        curve.getPointAt(u, _tC);
        curve.getTangentAt(u, _tT);
        if (i === 0) _tS.crossVectors(_tT, Math.abs(_tT.y) < 0.9 ? UP : _tU.set(1, 0, 0));
        else _tS.addScaledVector(_tT, -_tS.dot(_tT));
        _tS.normalize();
        var seg = u * (radii.length - 1), s0 = Math.floor(seg), s1 = Math.min(radii.length - 1, s0 + 1);
        var r = radii[s0] + (radii[s1] - radii[s0]) * (seg - s0);
        FC[i*3] = _tC.x; FC[i*3+1] = _tC.y; FC[i*3+2] = _tC.z;
        FT[i*3] = _tT.x; FT[i*3+1] = _tT.y; FT[i*3+2] = _tT.z;
        FS[i*3] = _tS.x; FS[i*3+1] = _tS.y; FS[i*3+2] = _tS.z;
        FR[i] = r;
        tubeSamples.push(_tC.x, _tC.y, _tC.z, r);
      }
      // 2) the particles, scattered evenly along it
      var n = Math.min(TUBE_MAX_PARTICLES, Math.round(len * TUBE_DENSITY));
      var pos = new Float32Array(n * 3), tan = new Float32Array(n * 3), side = new Float32Array(n * 3);
      var prm = new Float32Array(n * 4), alongA = new Float32Array(n), kind = new Float32Array(n);
      for (var k = 0; k < n; k++){
        var f = Math.random() * (steps - 1), fi = Math.floor(f), ff = f - fi, fj = Math.min(steps - 1, fi + 1);
        for (var c = 0; c < 3; c++){
          pos[k*3+c]  = FC[fi*3+c] + (FC[fj*3+c] - FC[fi*3+c]) * ff;
          tan[k*3+c]  = FT[fi*3+c];
          side[k*3+c] = FS[fi*3+c];
        }
        var s = f * (len / (steps - 1));                 // distance along the tube
        var rr = FR[fi], roll = Math.random(), kd, rad, ang, streak;
        var g = (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;   // ~bell curve, -1..1
        if (roll < 0.74){                                // the wall, bunched into spiral arms
          kd = 0;
          rad = rr * (1 + g * 0.16);
          ang = Math.random() < 0.65
            ? (Math.floor(Math.random() * TUBE_ARMS) / TUBE_ARMS) * 6.2832 + s * 0.09 + g * 0.45
            : Math.random() * 6.2832;
          streak = 1 + Math.random() * 2.5;
        } else if (roll < 0.95){                         // wisps drifting further out
          kd = 1;
          rad = rr * (1.2 + Math.random() * 1.1);
          ang = Math.random() * 6.2832;
          streak = 2 + Math.random() * 3;
        } else {                                         // bright sparks inside
          kd = 2;
          rad = rr * Math.sqrt(Math.random()) * 0.8;
          ang = Math.random() * 6.2832;
          streak = 1.5 + Math.random() * 2.5;
        }
        prm[k*4] = ang; prm[k*4+1] = rad; prm[k*4+2] = streak; prm[k*4+3] = Math.random();
        alongA[k] = s; kind[k] = kd;
      }
      tubeGeo.dispose();
      tubeGeo = new THREE.BufferGeometry();
      tubeGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      tubeGeo.setAttribute('aTan', new THREE.BufferAttribute(tan, 3));
      tubeGeo.setAttribute('aSide', new THREE.BufferAttribute(side, 3));
      tubeGeo.setAttribute('aP', new THREE.BufferAttribute(prm, 4));
      tubeGeo.setAttribute('along', new THREE.BufferAttribute(alongA, 1));
      tubeGeo.setAttribute('aKind', new THREE.BufferAttribute(kind, 1));
      tube.geometry = tubeGeo;
    }

    // did the craft's path this frame cross a waypoint's plane inside the tube? (Challenge: +10%)
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
        if (r < l.radius){                       // through the tube at a waypoint
          l.state = 'passed'; l.fade = 0;
          loopStreak++;
          // +10% on the current cruise speed per waypoint
          craftState.target *= LOOP_SPEEDUP;           // (no ceiling)
          hudPulse('up');
        }
        // (the tube's wall is just light: flying through it isn't a hit -- it only ends the
        // distance run, see updateRun)
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

    // somewhere just ahead, off to any side of the craft's path (left, right, above, below),
    // but never on the route: `reach` is the shape's own outer radius
    var _cDir = new THREE.Vector3();
    function pickClusterCenter(out, reach){
      var c = craft.position;
      for (var attempt = 0; attempt < 10; attempt++){
        var ahead = 11 + Math.random() * 7;                  // stays inside the particle cube
        var lateral = 1.5 + reach + Math.random() * 5;
        out.copy(c).addScaledVector(fwd, ahead).addScaledVector(perpDir(_cDir, fwd), lateral);
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
      st.target = BASE_SPEED;                    // (cruising then ramps back up gradually)
      st.speed = Math.min(st.speed, BASE_SPEED);
      resetRun();                                // a Challenge run ends on any hit
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

    // ---------- input: arrow keys (+ WASD) steer in 3D, Space brakes, Shift boosts; on touch, tilt/tap to steer + Boost ----------
    var keys = { up: false, down: false, left: false, right: false, boost: false, brake: false };
    var KEYMAP = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
                   w: 'up', s: 'down', a: 'left', d: 'right', W: 'up', S: 'down', A: 'left', D: 'right', Shift: 'boost', ' ': 'brake' };
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

    // touch screens: no arrow pad -- the craft flies forward on its own (always),
    // tilt the phone or tap/drag on the left / right half of the screen to steer, hold Boost to boost
    var touchFly = false;
    function enableTouch(){
      if (touchFly) return;
      touchFly = true;
      document.body.classList.add('touch');
    }
    if (isTouch) enableTouch();

    // tilt to steer (touch screens only): tip the phone left / right to turn that way, and tip
    // its top toward / away from you to climb / dive -- harder the further it's tipped. Nothing
    // inside the dead zone (so holding it roughly still flies straight), then easing in and gently
    // levelling off (a smoothstep) to TILT_MAX_TURN of the full rate at TILT_FULL degrees, so
    // steep tilts don't whip the craft round. Climb/dive is measured from however you're holding
    // the phone (calibrated from the first readings, re-centred on rotation and, slowly, while
    // it's held near the middle), not from flat.
    // Both come from the direction of gravity in screen coordinates (worked out from the
    // orientation angles), so portrait and landscape behave the same and nothing jumps when the
    // phone passes upright.
    var TILT_DEADZONE = 5, TILT_FULL = 35, TILT_MAX_TURN = 0.7;
    var PITCH_DEADZONE = 6, PITCH_FULL = 30, PITCH_MAX = 0.7;
    var tiltTurn = 0;                        // -1..1, + = left (same sign as the ← key)
    var tiltPitch = 0;                       // -1..1, + = nose up (same sign as the ↑ key)
    var pitchBase = null, pitchCal = [], D2R = Math.PI / 180;
    function tiltCurve(v, dead, full, max){
      var m = Math.min(1, Math.max(0, Math.abs(v) - dead) / (full - dead));
      return Math.sign(v) * max * m * m * (3 - 2 * m);
    }
    function recentrePitch(){ pitchBase = null; pitchCal.length = 0; tiltPitch = 0; }
    function onTilt(e){
      if (e.gamma == null || e.beta == null) return;
      if (!tiltSeen){ tiltSeen = true; rememberTilt(); }
      if (!touchFly) return;
      // gravity in device coordinates (x right, y up the screen, z out of it)...
      var b = e.beta * D2R, g = e.gamma * D2R;
      var gx = Math.cos(b) * Math.sin(g), gy = -Math.sin(b), gz = -Math.cos(b) * Math.cos(g);
      // ...turned into screen coordinates for the current orientation
      var th = ((screen.orientation && screen.orientation.angle) || window.orientation || 0) * D2R;
      var sx = gx * Math.cos(th) - gy * Math.sin(th), sy = gx * Math.sin(th) + gy * Math.cos(th);
      // left / right: how far the screen is rolled toward a side (left edge down = left) -- measured
      // against whichever of "flat" / "upright" it's nearer, so a 20° tip reads as 20° however
      // steeply the phone is held
      var roll = Math.atan2(sx, Math.max(Math.abs(sy), Math.abs(gz))) / D2R;
      tiltTurn = -tiltCurve(roll, TILT_DEADZONE, TILT_FULL, TILT_MAX_TURN);
      // climb / dive: the screen's angle from flat (0 flat, 90 upright), against the calibrated
      // resting angle -- top tipped toward you (more upright) = climb
      var fb = Math.atan2(-sy, -gz) / D2R;
      if (pitchBase === null){
        pitchCal.push(fb);
        if (pitchCal.length >= 8) pitchBase = pitchCal.reduce(function(s, v){ return s + v; }, 0) / pitchCal.length;
        tiltPitch = 0;
        return;
      }
      var dev = fb - pitchBase;
      if (Math.abs(dev) < PITCH_DEADZONE) pitchBase += dev * 0.01;   // drift with the way it's held
      tiltPitch = tiltCurve(dev, PITCH_DEADZONE, PITCH_FULL, PITCH_MAX);
    }
    window.addEventListener('orientationchange', recentrePitch);
    if (screen.orientation && screen.orientation.addEventListener) screen.orientation.addEventListener('change', recentrePitch);
    document.addEventListener('visibilitychange', function(){ if (!document.hidden) recentrePitch(); });
    // Motion permission: Android just sends the data. iOS only does after the visitor allows it,
    // and a page can only ask from inside a tap -- there's no way round that. So: listen from the
    // start (if this browser already allowed it, tilt simply works, no prompt); once it's been
    // allowed, remember that (localStorage), and on later visits quietly re-confirm it without a
    // tap -- iOS answers "granted" straight away for a site it already allowed. Only if there's
    // still no motion data is it asked for, once, on the first tap.
    var TILT_KEY = 'constellations-tilt';
    var tiltSeen = false, tiltAsked = false;
    function rememberTilt(){ try { localStorage.setItem(TILT_KEY, 'granted'); } catch (e) {} }
    var DOE = window.DeviceOrientationEvent;
    var needsPermission = !!(DOE && typeof DOE.requestPermission === 'function');
    if (DOE) window.addEventListener('deviceorientation', onTilt);
    function askTilt(){
      if (!needsPermission || tiltSeen || tiltAsked) return;
      tiltAsked = true;
      DOE.requestPermission().then(function(res){
        if (res === 'granted') rememberTilt();
        else { try { localStorage.removeItem(TILT_KEY); } catch (e) {} }
      }).catch(function(){ tiltAsked = false; });           // (not from a tap: try again on one)
    }
    var tiltRemembered = false;
    try { tiltRemembered = localStorage.getItem(TILT_KEY) === 'granted'; } catch (e) {}
    if (needsPermission && tiltRemembered){
      DOE.requestPermission().then(function(res){ if (res !== 'granted') tiltAsked = false; }).catch(function(){});
    }
    window.addEventListener('touchend', function(){ if (touchFly) askTilt(); }, { passive: true });

    // landscape on a phone: go fullscreen to hide the browser's tabs and toolbars. Browsers only
    // allow that from a tap, so it happens on the first tap in landscape (and again after
    // rotating back to landscape). Android supports it; iPhone Safari doesn't let pages go
    // fullscreen at all (Add to Home Screen is the only way there).
    function isLandscape(){ return window.matchMedia && window.matchMedia('(orientation: landscape)').matches; }
    function goFullscreen(){
      if (!touchFly || !isLandscape()) return;
      var el = document.documentElement;
      if (document.fullscreenElement || document.webkitFullscreenElement) return;
      var req = el.requestFullscreen || el.webkitRequestFullscreen;
      if (!req) return;
      try {
        var p = req.call(el, { navigationUI: 'hide' });
        if (p && p.catch) p.catch(function(){});
      } catch (err) {}
    }
    window.addEventListener('touchend', goFullscreen, { passive: true });
    window.addEventListener('blur', function(){ tiltTurn = 0; tiltPitch = 0; });
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

    // ---------- flight mode: cruising, or a Challenge ----------
    // Cruising (the default, autoCruise = true): the tube is hidden and the speed ramps up on its
    // own; on desktop the autopilot follows the course whenever you're not steering. The
    // "Challenge?" button switches to a Challenge (autoCruise = false): the tube shows, there's
    // no autopilot, threading waypoints speeds you up (the wall is just light, no collision) -- and a
    // counter measures how far you've flown inside the tube without leaving it (with your Best).
    var autoCruise = true;
    var AUTO_RESUME_SECONDS = 3;             // cruising: no steering for this long and the autopilot rejoins the course
    var lastSteerAt = -Infinity;             // when the craft was last steered (scene time, seconds)
    var challengeBtn = document.getElementById('challengeBtn');
    function setMode(auto){
      autoCruise = auto;
      var challenge = !auto;
      if (challengeBtn){
        challengeBtn.classList.toggle('on', challenge);
        challengeBtn.setAttribute('aria-pressed', challenge ? 'true' : 'false');
        challengeBtn.textContent = challenge ? 'Free Roam?' : 'Challenge?';
      }
      document.body.classList.toggle('challenge', challenge);
      Object.keys(keys).forEach(function(k){ keys[k] = false; });
      // switching either way keeps the current speed: cruising ramps up from here, a Challenge
      // carries on from here (and the tube takes it up or a hit resets it)
      craftState.target = Math.max(BASE_SPEED, craftState.speed);
      lastSteerAt = -Infinity;                   // cruising takes the course straight away
      resetRun();
      applyCourseVisibility();                   // the tube only shows in a Challenge
    }
    // (while cruising every arrow just steers for a while; see updateCraft)
    function pressFlightKey(k){
      keys[k] = true;
    }
    if (challengeBtn){
      challengeBtn.addEventListener('click', function(){ setMode(!autoCruise); challengeBtn.blur(); });
    }

    // Challenge distance: metres flown with the craft's centre inside the tube, reset the moment
    // it leaves (or hits the wall). "Best" is kept in localStorage.
    var BEST_KEY = 'constellations-best';
    var runEl = document.getElementById('run');
    var runNowEl = document.getElementById('runNow'), runBestEl = document.getElementById('runBest');
    var runM = 0, bestM = 0, runShown = -1, bestShown = -1, bestSaved = 0;
    try { bestM = bestSaved = Math.max(0, parseFloat(localStorage.getItem(BEST_KEY)) || 0); } catch (e) {}
    var fmtM = window.Intl && Intl.NumberFormat ? new Intl.NumberFormat('en') : null;
    function fmt(m){ var v = Math.floor(m); return fmtM ? fmtM.format(v) : String(v); }
    function saveBest(){
      if (bestM <= bestSaved) return;
      bestSaved = bestM;
      try { localStorage.setItem(BEST_KEY, String(Math.floor(bestM))); } catch (e) {}
    }
    function resetRun(){
      if (runM > 0 && runEl){
        runEl.classList.remove('out'); void runEl.offsetWidth; runEl.classList.add('out');
      }
      runM = 0;
      saveBest();
    }
    window.addEventListener('pagehide', saveBest);
    document.addEventListener('visibilitychange', function(){ if (document.hidden) saveBest(); });
    function updateRun(delta){
      if (!autoCruise){
        if (insideTube()){
          runM += Math.max(0, craftState.speed) * delta * 60 * 50;   // units/frame -> metres (1 unit = 50 m)
          if (runM > bestM) bestM = runM;
        } else if (runM > 0){
          resetRun();
        }
      }
      if (!runNowEl) return;
      var shownNow = Math.floor(runM), shownBest = Math.floor(bestM);
      if (shownNow !== runShown){ runShown = shownNow; runNowEl.textContent = fmt(runM); }
      if (shownBest !== bestShown){ bestShown = shownBest; runBestEl.textContent = fmt(bestM); }
    }

    setMode(true);                               // everyone starts cruising

    // autopilot: how hard to turn and pitch (-1..1 of the normal rates) to follow the course. It
    // steers proportionally toward the next waypoint (a gentle gain, which together with the
    // turn easing gives smooth, well-damped curves), and once a waypoint is close it already
    // looks to the one after, so it never jinks at the last moment. Works in the craft's own
    // frame, so it flies the course whichever way up it is.
    var AUTOPILOT_GAIN = 2.5;
    var _apDir = new THREE.Vector3(), _apInv = new THREE.Quaternion();
    var autopilot = { turn: 0, pitch: 0 };
    function autopilotSteer(){
      autopilot.turn = autopilot.pitch = 0;
      var target = null, c = craft.position;
      for (var j = 0; j < loops.length; j++){
        if (loops[j].state !== 'ahead') continue;
        target = loops[j];
        if (target.group.position.distanceTo(c) > 10) break;   // far enough: aim here
      }
      if (!target) return autopilot;
      // where the waypoint is, as seen from the craft (x = right, y = up, -z = ahead)
      _apDir.copy(target.group.position).sub(c).applyQuaternion(_apInv.copy(craft.quaternion).invert());
      var yawErr = Math.atan2(-_apDir.x, -_apDir.z);
      var pitchErr = Math.atan2(_apDir.y, Math.sqrt(_apDir.x * _apDir.x + _apDir.z * _apDir.z));
      autopilot.turn = Math.max(-1, Math.min(1, yawErr * AUTOPILOT_GAIN));
      autopilot.pitch = Math.max(-1, Math.min(1, pitchErr * AUTOPILOT_GAIN));
      return autopilot;
    }

    // ---------- spacecraft flight + chase camera ----------
    var camTarget = new THREE.Vector3();
    var camLook = new THREE.Vector3();
    var camFwd = new THREE.Vector3(0, 0, -1);
    var camUp = new THREE.Vector3(0, 1, 0);
    var AXIS_X = new THREE.Vector3(1, 0, 0);
    var _qStep = new THREE.Quaternion(), _lvl = new THREE.Vector3(), _lvlX = new THREE.Vector3();

    function updateCraft(delta, t){
      var f = delta * 60;
      var st = craftState;
      st.rattle = Math.max(0, st.rattle - delta / RATTLE_TIME);
      var control = 1 - 0.6 * st.rattle;           // controls feel sluggish while rattled
      prevCraftPos.copy(craft.position);
      // steering, in the craft's own frame: ←/→ turn, ↑/↓ pitch the nose up/down -- so it can
      // fly any way at all (climb, dive, loop). Touch screens steer left/right only (tilt / taps).
      // While cruising the autopilot follows the (hidden) tube, but any steering takes over and
      // can fly right out of it; after AUTO_RESUME_SECONDS with no steering the autopilot takes
      // back over (desktop only: on phones cruising just handles the speed).
      // Either way the rates ease in and out rather than snapping, so turns look smooth.
      var turnInput = (keys.left ? 1 : 0) - (keys.right ? 1 : 0);
      if (!turnInput) turnInput = tiltTurn;          // touch screens: tilt steers, proportionally
      var pitchInput = (keys.up ? 1 : 0) - (keys.down ? 1 : 0);
      if (!pitchInput) pitchInput = tiltPitch;       // touch screens: tipping the top toward / away climbs / dives
      if (autoCruise){
        if (turnInput || pitchInput) lastSteerAt = t;
        else if (!touchFly && t - lastSteerAt > AUTO_RESUME_SECONDS){
          autopilotSteer();
          turnInput = autopilot.turn; pitchInput = autopilot.pitch;
        }
        // cruising: keep speeding up gradually (no limit)
        st.target += AUTO_RAMP_RATE * delta;          // (no ceiling)
      }
      st.turnVel += (turnInput - st.turnVel) * Math.min(1, TURN_EASE * f);
      st.pitchVel += (pitchInput - st.pitchVel) * Math.min(1, TURN_EASE * f);
      var turn = st.turnVel;
      craft.quaternion.multiply(_qStep.setFromAxisAngle(UP, turn * CRAFT_TURN * control * f));
      craft.quaternion.multiply(_qStep.setFromAxisAngle(AXIS_X, st.pitchVel * CRAFT_PITCH * control * f));
      fwd.set(0, 0, -1).applyQuaternion(craft.quaternion);
      craftUp.set(0, 1, 0).applyQuaternion(craft.quaternion);
      // not pitching: roll gently back upright (world up), so left/right always mean what you
      // expect -- skipped while pointing nearly straight up or down, where "upright" is undefined
      if (Math.abs(st.pitchVel) < 0.05 && Math.abs(fwd.dot(UP)) < 0.95){
        _lvl.copy(UP).addScaledVector(fwd, -fwd.dot(UP)).normalize();
        var roll = Math.atan2(_lvlX.crossVectors(craftUp, _lvl).dot(fwd), craftUp.dot(_lvl));
        craft.quaternion.premultiply(_qStep.setFromAxisAngle(fwd, roll * Math.min(1, AUTO_LEVEL * f)));
      }
      craft.quaternion.normalize();
      fwd.set(0, 0, -1).applyQuaternion(craft.quaternion);
      right.set(1, 0, 0).applyQuaternion(craft.quaternion);
      craftUp.set(0, 1, 0).applyQuaternion(craft.quaternion);

      // Shift boost: eases in while held, back out when released (either mode)
      var boostGoal = keys.boost ? BOOST : 1;
      st.boost += (boostGoal - st.boost) * Math.min(1, (boostGoal > st.boost ? 0.05 : 0.03) * f);
      var goal = st.target * st.boost;

      // speed: the craft always flies at the cruise speed (which only the tube changes, see
      // checkLoops/crash); Space brakes, down to a stop. Let go before it stops and it picks the
      // speed back up; brake right down to 0 and it starts over from rest -- cruise speed again,
      // pulled away gently (at most RESTART_ACCEL), then ramping up as usual from there
      var braking = keys.brake;
      if (braking){
        st.speed = Math.max(0, st.speed - BRAKE_RATE * f);
        if (st.speed === 0 && !st.restarting){
          st.restarting = true;
          st.target = BASE_SPEED;                   // (cruising then ramps up again gradually)
          goal = st.target * st.boost;
        }
      } else {
        var rate = goal > st.speed ? 0.03 : 0.05;
        var step = (goal - st.speed) * Math.min(1, rate * f * control);
        if (st.restarting){
          step = Math.min(step, RESTART_ACCEL * f);
          if (st.speed + step >= goal - 1e-4) st.restarting = false;
        }
        st.speed += step;
      }
      st.thrust += ((braking ? 0 : 1) - st.thrust) * 0.1 * f;

      st.side.multiplyScalar(Math.pow(0.93, f));
      st.vel.copy(fwd).multiplyScalar(st.speed).add(st.side);
      craft.position.addScaledVector(st.vel, f);

      st.bank += (turn * 0.55 - st.bank) * 0.08 * f;
      // rattle: fast shudder on every axis that eases out
      var r = st.rattle * st.rattle;
      craftBody.rotation.set(
        -Math.min(st.speed * 0.8, 0.12) + st.pitchVel * 0.15 + Math.sin(t * 47) * 0.22 * r,   // (nose leads a pitch a little)
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
      // after its orientation (all three axes, so it follows climbs, dives and loops); sitting
      // a little above the craft and looking ahead puts the craft just below centre
      st.camQuat.slerp(craft.quaternion, Math.min(1, 0.12 * f));
      camFwd.set(0, 0, -1).applyQuaternion(st.camQuat);
      camUp.set(0, 1, 0).applyQuaternion(st.camQuat);
      camTarget.copy(craft.position).addScaledVector(camFwd, -CHASE_BACK).addScaledVector(camUp, CHASE_UP);
      camera.position.copy(camTarget);
      camera.position.addScaledVector(right, Math.sin(t * 57) * 0.09 * r);
      camera.position.addScaledVector(camUp, Math.sin(t * 49 + 1.1) * 0.09 * r);
      camLook.copy(craft.position).addScaledVector(camFwd, LOOK_AHEAD).addScaledVector(camUp, LOOK_UP);
      camera.up.copy(camUp);
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
      for (var ts = 0; ts < tubeSamples.length; ts += 4){ tubeSamples[ts] -= d.x; tubeSamples[ts+1] -= d.y; tubeSamples[ts+2] -= d.z; }
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
    // Starts as soon as the browser allows (see below). The speaker button in the HUD mutes it
    // (remembered in localStorage).
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
      syncSoundWaiting();
    }
    setSound(soundOn);
    if (soundBtn){
      soundBtn.addEventListener('click', function(){ initAudio(); setSound(!soundOn); soundBtn.blur(); });
    }
    // Browsers only let a page start sound on its own if the visitor has already interacted with
    // the site enough (Chrome's media-engagement score, etc.) -- so try right away, and if the
    // browser keeps it paused, the speaker button pulses and the first key press / tap / click
    // anywhere starts it.
    initAudio();
    function audioBlocked(){ return !audio || audio.ctx.state !== 'running'; }
    function syncSoundWaiting(){ if (soundBtn) soundBtn.classList.toggle('waiting', soundOn && audioBlocked()); }
    if (audio){
      audio.ctx.onstatechange = syncSoundWaiting;
      audio.ctx.resume().then(syncSoundWaiting, syncSoundWaiting);
    }
    syncSoundWaiting();
    ['keydown', 'pointerdown', 'pointerup', 'touchstart', 'touchend', 'click', 'mousedown'].forEach(function(type){
      window.addEventListener(type, function(){ initAudio(); syncSoundWaiting(); }, { passive: true, capture: true });
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
      updateRun(delta);
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
