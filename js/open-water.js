// Open Water: a real-time WebGL ocean. Gerstner swell, a CPU shallow-water ripple solver, cannon.js
// floating bodies, GPU splash particles and synthesised sound. Loaded by open-water.html after three.js r128
// and cannon.js 0.6.2 (cdnjs). See reference/open-water-page.md.
(function () {
'use strict';
var $ = function (id) { return document.getElementById(id); };
var canvas = $('gl');

var renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, powerPreference: 'high-performance' });
} catch (err) { $('fail').hidden = false; return; }

/* ---------- state ---------- */
var state = { height: 0.7, chop: 0.9, wind: 15, sun: 14, cover: 0.25, clarity: 0.75, caustics: 1.0, spray: 1.0, volume: 0.6, camH: 4.5 };
var SUN_AZ = 25 * Math.PI / 180;

var WL = [90, 60, 41, 28, 19, 13, 9, 6.2, 4.3, 3.0, 2.1, 1.5];                          /* wavelengths in metres */
var WS = [0.0050, 0.0060, 0.0075, 0.0085, 0.0095, 0.0100, 0.0100, 0.0095, 0.0090, 0.0085, 0.0080, 0.0075];  /* amplitude per metre of wavelength */
var WOFF = [0, -0.35, 0.4, -0.7, 0.8, -1.1, 1.2, -0.55, 0.95, -1.3, 0.65, -0.2];              /* directional spread, radians */

/* ---------- water simulation: linear shallow-water equations, staggered grid, CPU ---------- */
/* h_t = -div(q),  q_t = -c^2 grad(h + P)     h: surface elevation, q: volume flux, P: pressure head from floating hulls
   c^2 = g * 0.6 m: the wave speed (2.4 m/s) of ripples a few metres long, not the true speed of a long shallow-water wave */
var SIM_N = 192, SIM_SZ = 96, SIM_DX = SIM_SZ / SIM_N, SIM_C2 = 9.81 * 0.6, SIM_O = -SIM_SZ / 2;
var simH = new Float32Array(SIM_N * SIM_N), simQx = new Float32Array(SIM_N * SIM_N), simQz = new Float32Array(SIM_N * SIM_N);
var simF = new Float32Array(SIM_N * SIM_N), simP = new Float32Array(SIM_N * SIM_N), simSp = new Float32Array(SIM_N * SIM_N);
var simData = new Float32Array(SIM_N * SIM_N * 4);
var simTex = new THREE.DataTexture(simData, SIM_N, SIM_N, THREE.RGBAFormat, THREE.FloatType);
simTex.minFilter = simTex.magFilter = THREE.NearestFilter;
simTex.generateMipmaps = false; simTex.flipY = false; simTex.needsUpdate = true;
(function () {
  var N = SIM_N, W = 14, i, j;
  for (j = 0; j < N; j++) for (i = 0; i < N; i++) {
    var d = Math.min(i, j, N - 1 - i, N - 1 - j);
    simSp[j * N + i] = d < W ? Math.pow((W - d) / W, 2) * 6 : 0;   /* absorbing sponge so waves leave the basin instead of bouncing back */
  }
})();

function simStep(dt) {
  var N = SIM_N, c = SIM_C2 * dt / SIM_DX, r = dt / SIM_DX, i, j, k, m, keep = 1 - 0.35 * dt, fd = Math.exp(-0.45 * dt);
  for (j = 0; j < N; j++) {
    for (i = 0; i < N; i++) {
      k = j * N + i;
      m = keep - simSp[k] * dt;
      var hp = simH[k] + simP[k];
      simQx[k] = i < N - 1 ? (simQx[k] - c * (simH[k + 1] + simP[k + 1] - hp)) * m : 0;
      simQz[k] = j < N - 1 ? (simQz[k] - c * (simH[k + N] + simP[k + N] - hp)) * m : 0;
    }
  }
  for (j = 0; j < N; j++) {
    for (i = 0; i < N; i++) {
      k = j * N + i;
      var div = simQx[k] - (i > 0 ? simQx[k - 1] : 0) + simQz[k] - (j > 0 ? simQz[k - N] : 0);
      var h = (simH[k] - r * div) * (1 - (0.04 + simSp[k] * 0.5) * dt);
      simH[k] = (h > -3 && h < 3) ? h : 0;
      simF[k] *= fd;
    }
  }
}

/* zero-volume pulse (a hump inside a wider dip), so a splash sends out rings and does not add water */
function simKick(x, z, amp, sig, foam) {
  var N = SIM_N, lim = SIM_SZ / 2 - 6;
  if (Math.abs(x) > lim || Math.abs(z) > lim) return false;
  var gi = (x - SIM_O) / SIM_DX - 0.5, gj = (z - SIM_O) / SIM_DX - 0.5, R = Math.ceil(sig * 4 / SIM_DX) + 1;
  var i0 = Math.max(1, Math.floor(gi) - R), i1 = Math.min(N - 2, Math.floor(gi) + R);
  var j0 = Math.max(1, Math.floor(gj) - R), j1 = Math.min(N - 2, Math.floor(gj) + R);
  var s2 = 2 * sig * sig;
  for (var j = j0; j <= j1; j++) for (var i = i0; i <= i1; i++) {
    var dx = (i + 0.5) * SIM_DX + SIM_O - x, dz = (j + 0.5) * SIM_DX + SIM_O - z, r2 = dx * dx + dz * dz, k = j * N + i;
    var g1 = Math.exp(-r2 / s2);
    simH[k] += amp * (g1 - 0.25 * Math.exp(-r2 / (4 * s2)));
    simF[k] = Math.min(1, simF[k] + foam * g1);
  }
  return true;
}

function simHAt(x, z) {
  var N = SIM_N, qx = (x - SIM_O) / SIM_SZ, qz = (z - SIM_O) / SIM_SZ;
  var ex = Math.min(qx, 1 - qx), ez = Math.min(qz, 1 - qz);
  if (ex <= 0 || ez <= 0) return 0;
  var ew = Math.min(ex / 0.06, 1), ev = Math.min(ez / 0.06, 1);
  ew = ew * ew * (3 - 2 * ew) * ev * ev * (3 - 2 * ev);
  var gx = qx * N - 0.5, gz = qz * N - 0.5, ix = Math.floor(gx), iz = Math.floor(gz), fx = gx - ix, fz = gz - iz;
  var x0 = Math.max(0, Math.min(N - 1, ix)), x1 = Math.max(0, Math.min(N - 1, ix + 1));
  var z0 = Math.max(0, Math.min(N - 1, iz)), z1 = Math.max(0, Math.min(N - 1, iz + 1));
  var a = simH[z0 * N + x0], b = simH[z0 * N + x1], c = simH[z1 * N + x0], d = simH[z1 * N + x1];
  return ((a + (b - a) * fx) * (1 - fz) + (c + (d - c) * fx) * fz) * ew;
}

/* pack height, slope and foam into the texture the shaders read */
function packSim() {
  var N = SIM_N, inv = 1 / (2 * SIM_DX), i, j, k, o;
  for (j = 0; j < N; j++) {
    for (i = 0; i < N; i++) {
      k = j * N + i; o = k * 4;
      var gx = (simH[i < N - 1 ? k + 1 : k] - simH[i > 0 ? k - 1 : k]) * inv;
      var gz = (simH[j < N - 1 ? k + N : k] - simH[j > 0 ? k - N : k]) * inv;
      var s = Math.sqrt(gx * gx + gz * gz) - 0.25;
      if (s > 0) { var fb = Math.min(1, s * 2.2); if (fb > simF[k]) simF[k] = fb; }
      simData[o] = simH[k]; simData[o + 1] = gx; simData[o + 2] = gz; simData[o + 3] = simF[k];
    }
  }
  simTex.needsUpdate = true;
}

var SIMCHUNK = [
'uniform highp sampler2D uSim;',
'uniform vec2 uSimO;',
'uniform float uSimS;',
'uniform float uSimN;',
'vec4 simAt(vec2 p){',
'  vec2 q=(p-uSimO)/uSimS;',
'  vec2 e=min(q,1.0-q);',
'  float ew=smoothstep(0.0,0.06,e.x)*smoothstep(0.0,0.06,e.y);',
'  vec2 g=clamp(q,0.0,1.0)*uSimN-0.5;',
'  vec2 i0=floor(g);vec2 f=g-i0;',
'  float inv=1.0/uSimN;',
'  vec2 c0=clamp(i0,0.0,uSimN-1.0);vec2 c1=clamp(i0+1.0,0.0,uSimN-1.0);',
'  vec4 a=texture2D(uSim,(c0+0.5)*inv);',
'  vec4 b=texture2D(uSim,(vec2(c1.x,c0.y)+0.5)*inv);',
'  vec4 c=texture2D(uSim,(vec2(c0.x,c1.y)+0.5)*inv);',
'  vec4 d=texture2D(uSim,(c1+0.5)*inv);',
'  return mix(mix(a,b,f.x),mix(c,d,f.x),f.y)*ew;',
'}'
].join('\n');

var U = {
  uTime: { value: 0 },
  uSunDir: { value: new THREE.Vector3(0, 1, 0) },
  uCover: { value: state.cover },
  uExposure: { value: 1.0 },
  uWaves: { value: WL.map(function () { return new THREE.Vector4(); }) },
  uChop: { value: 1 },
  uWindAng: { value: 0 },
  uHs: { value: 1 },
  uFoamAmt: { value: 0 },
  uRip: { value: [0, 1, 2, 3, 4, 5].map(function () { return new THREE.Vector4(0, 0, -100, 0); }) },
  uClarity: { value: state.clarity },
  uCaustic: { value: state.caustics },
  uSim: { value: simTex },
  uSimO: { value: new THREE.Vector2(SIM_O, SIM_O) },
  uSimS: { value: SIM_SZ },
  uSimN: { value: SIM_N }
};

/* uniforms for the splash layer: shares every value object with U */
var SU = Object.assign({}, U, {
  uSpray: { value: state.spray },
  uPxScale: { value: 800 },
  uWind: { value: new THREE.Vector2(0, 1) },
  uBurst: { value: [0, 1, 2, 3, 4, 5].map(function () { return new THREE.Vector4(0, 0, -100, 0); }) },
  uImp: { value: [0, 1, 2, 3].map(function () { return new THREE.Vector4(0, 0, -100, 0); }) },
  uImpB: { value: [0, 1, 2, 3].map(function () { return new THREE.Vector4(0, 0, 0, 0); }) }
});

/* ---------- GLSL ---------- */
var COMMON = [
'precision highp float;',
'uniform float uTime;',
'uniform vec3 uSunDir;',
'uniform float uCover;',
'uniform float uExposure;',
'float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}',
'float noise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);',
'  float a=hash(i);float b=hash(i+vec2(1.0,0.0));float c=hash(i+vec2(0.0,1.0));float d=hash(i+vec2(1.0,1.0));',
'  return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);}',
'float fbm(vec2 p){float s=0.0;float a=0.5;for(int i=0;i<5;i++){s+=a*noise(p);p=p*2.03+vec2(17.1,9.7);a*=0.5;}return s;}',
'float fbm3(vec2 p){float s=0.0;float a=0.5;for(int i=0;i<3;i++){s+=a*noise(p);p=p*2.07+vec2(5.3,13.1);a*=0.5;}return s;}',

'vec3 sunColor(){',
'  float s=uSunDir.y;',
'  vec3 c=mix(vec3(1.0,0.42,0.16),vec3(1.0,0.95,0.86),smoothstep(0.0,0.4,s));',
'  return c*smoothstep(-0.07,0.05,s)*(1.0-0.8*uCover);',
'}',

'void skyBase(out vec3 zen,out vec3 hor){',
'  float s=uSunDir.y;',
'  float dk=smoothstep(-0.2,0.3,s);',
'  zen=mix(vec3(0.004,0.008,0.03),vec3(0.09,0.26,0.60),dk);',
'  hor=mix(vec3(0.02,0.04,0.08),vec3(0.58,0.74,0.88),dk);',
'  float warm=exp(-(s*4.2)*(s*4.2));',
'  hor=mix(hor,vec3(0.95,0.48,0.24),warm*0.75);',
'  zen=mix(zen,vec3(0.20,0.15,0.35),warm*0.35);',
'}',

'vec3 skyColor(vec3 rd){',
'  vec3 zen;vec3 hor;skyBase(zen,hor);',
'  float el=clamp(rd.y,0.0,1.0);',
'  float sd=max(dot(rd,uSunDir),0.0);',
'  vec3 sc=sunColor();',
'  vec3 h2=hor+sc*0.28*pow(sd,5.0)*(1.0-el);',
'  vec3 col=mix(h2,zen,pow(el,0.42));',
'  float lum=dot(col,vec3(0.299,0.587,0.114));',
'  col=mix(col,vec3(lum)*vec3(0.9,0.95,1.0),uCover*0.65);',
'  col+=sc*(pow(sd,300.0)*4.0+pow(sd,24.0)*0.35);',
'  col+=sc*50.0*smoothstep(0.9997,0.99995,sd);',
'  if(rd.y>0.005){',
'    vec2 cp=rd.xz/(rd.y+0.18)*0.8+vec2(uTime*0.006,uTime*0.003);',
'    float d1=fbm(cp*1.4);',
'    float d2=fbm(cp*1.4+uSunDir.xz*0.12);',
'    float cov=smoothstep(mix(0.56,0.22,uCover),mix(0.86,0.55,uCover),d1)*smoothstep(0.0,0.2,rd.y);',
'    float edge=clamp((d1-d2)*5.0+0.55,0.0,1.0);',
'    vec3 lit=hor*0.55+sc*1.3;',
'    vec3 shade=mix(zen,hor,0.5)*0.55+0.02;',
'    col=mix(col,mix(shade,lit,edge),cov*0.9);',
'  }',
'  return col;',
'}',

'vec3 aces(vec3 x){return clamp((x*(2.51*x+0.03))/(x*(2.43*x+0.59)+0.14),0.0,1.0);}',
'vec3 finish(vec3 c){',
'  c=aces(c*uExposure);',
'  c=pow(c,vec3(1.0/2.2));',
'  c+=(hash(gl_FragCoord.xy+fract(uTime))-0.5)/255.0;',
'  return c;',
'}'
].join('\n');

var RIPPLE = [
'uniform vec4 uRip[6];',
'float ripple(vec2 p,out vec2 g){',
'  float h=0.0;g=vec2(0.0);',
'  for(int i=0;i<6;i++){',
'    vec4 r=uRip[i];float age=uTime-r.z;',
'    if(r.w>0.0&&age>0.0&&age<14.0){',
'      vec2 dv=p-r.xy;float d=length(dv)+0.0001;',
'      float x=d-2.0*age;float k=2.4;',
'      float env=exp(-age*0.45)*exp(-x*x*0.35)/(1.0+d*0.25);',
'      float ph=k*x;',
'      h+=r.w*env*cos(ph);',
'      float dh=r.w*env*(-k*sin(ph)-0.7*x*cos(ph));',
'      g+=dh*dv/d;',
'    }',
'  }',
'  return h;',
'}'
].join('\n');

var SKY_VERT = [
'varying vec3 vDir;',
'void main(){vDir=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}'
].join('\n');

var SKY_FRAG = COMMON + '\n' + [
'varying vec3 vDir;',
'void main(){',
'  vec3 rd=vDir;',
'  rd.y=max(rd.y,0.0);',
'  rd=normalize(rd+vec3(0.0,0.00001,0.0)+vec3(0.00001,0.0,0.0));',
'  gl_FragColor=vec4(finish(skyColor(rd)),1.0);',
'}'
].join('\n');

var WATER_VERT = [
'precision highp float;',
'uniform float uTime;',
'uniform vec4 uWaves[12];',
'uniform float uChop;',
'uniform float uHs;',
'uniform float uFoamAmt;',
RIPPLE,
SIMCHUNK,
'varying vec3 vWorld;',
'varying vec3 vN;',
'varying float vFoam;',
'varying float vH;',
'void main(){',
'  vec3 p=(modelMatrix*vec4(position,1.0)).xyz;',
'  vec3 disp=vec3(0.0);',
'  float nx=0.0;float nz=0.0;float ny=0.0;',
'  float jxx=0.0;float jxz=0.0;float jzz=0.0;',
'  float dv=distance(p,cameraPosition);',
'  for(int i=0;i<12;i++){',
'    vec4 w=uWaves[i];',
'    vec2 D=w.xy;float k=w.w;',
'    float Lw=6.2831853/k;',
'    float A=w.z*(1.0-smoothstep(Lw*10.0,Lw*30.0,dv));',
'    float c=sqrt(9.81/k);',
'    float f=k*(dot(D,p.xz)-c*uTime)+float(i)*1.7;',
'    float s=sin(f);float co=cos(f);',
'    disp.xz+=D*(uChop*A*co);',
'    disp.y+=A*s;',
'    nx+=D.x*k*A*co;nz+=D.y*k*A*co;ny+=uChop*k*A*s;',
'    float q=uChop*k*A*s;',
'    jxx+=q*D.x*D.x;jxz+=q*D.x*D.y;jzz+=q*D.y*D.y;',
'  }',
'  vec2 rg;',
'  disp.y+=ripple(p.xz,rg);',
'  disp.y+=simAt(p.xz).x;',
'  vN=normalize(vec3(-nx,1.0-ny,-nz));',
'  vWorld=p+disp;',
'  vH=disp.y;',
'  float Jd=(1.0-jxx)*(1.0-jzz)-jxz*jxz;',
'  float fH=smoothstep(0.55,1.0,disp.y/(0.55*uHs+0.001));',
'  float fJ=1.0-smoothstep(0.2,0.55,Jd);',
'  vFoam=max(fH,fJ)*uFoamAmt;',
'  gl_Position=projectionMatrix*viewMatrix*vec4(vWorld,1.0);',
'}'
].join('\n');

var WATER_FRAG = COMMON + '\n' + RIPPLE + '\n' + SIMCHUNK + '\n' + [
'varying vec3 vWorld;',
'varying vec3 vN;',
'varying float vFoam;',
'varying float vH;',
'uniform float uClarity;',
'uniform float uCaustic;',
'uniform float uHs;',
'uniform vec4 uWaves[12];',
'uniform float uWindAng;',
'uniform float uFoamAmt;',
'float gAmt;float gPatch;',

/* fine surface detail: ten short gravity-wave trains with analytic slope, no texture lookups */
'void detail(vec2 p,float dist,out vec2 g,out float h){',
'  g=vec2(0.0);h=0.0;',
'  for(int i=0;i<8;i++){',
'    float fi=float(i);',
'    float L=1.9*pow(0.72,fi);',
'    float k=6.2831853/L;',
'    float ang=uWindAng+1.6*sin(fi*2.4+1.0);',
'    vec2 D=vec2(sin(ang),cos(ang));',
'    float c=sqrt(9.81/k);',
'    float f=k*(dot(D,p)-c*uTime)+fi*2.13;',
'    float fade=1.0-smoothstep(L*40.0,L*160.0,dist);',
'    float sl=0.034*gAmt*gPatch*fade;',
'    g+=D*(sl*cos(f));',
'    h+=sl/k*sin(f);',
'  }',
'}',

/* slope and Hessian of the surface (12 swell waves + 6 detail waves), used to focus sunlight into caustics */
'void waveField(vec2 p,float dist,out vec2 g,out vec3 H){',
'  g=vec2(0.0);H=vec3(0.0);',
'  for(int i=2;i<12;i++){',
'    vec4 w=uWaves[i];vec2 D=w.xy;float A=w.z;float k=w.w;',
'    float c=sqrt(9.81/k);',
'    float f=k*(dot(D,p)-c*uTime)+float(i)*1.7;',
'    float s=sin(f);float co=cos(f);',
'    g+=D*(A*k*co);',
'    float q=-A*k*k*s;',
'    H+=vec3(D.x*D.x,D.x*D.y,D.y*D.y)*q;',
'  }',
'  for(int i=0;i<4;i++){',
'    float fi=float(i);',
'    float L=1.9*pow(0.72,fi);',
'    float k=6.2831853/L;',
'    float ang=uWindAng+1.6*sin(fi*2.4+1.0);',
'    vec2 D=vec2(sin(ang),cos(ang));',
'    float c=sqrt(9.81/k);',
'    float f=k*(dot(D,p)-c*uTime)+fi*2.13;',
'    float fade=1.0-smoothstep(L*40.0,L*160.0,dist);',
'    float sl=0.034*gAmt*gPatch*fade;',
'    g+=D*(sl*cos(f));',
'    float q=-sl*k*sin(f);',
'    H+=vec3(D.x*D.x,D.x*D.y,D.y*D.y)*q;',
'  }',
'}',

'float seaDepth(vec2 p){',
'  float base=mix(4.0,55.0,1.0-smoothstep(-240.0,30.0,p.y));',
'  float n=noise(p*0.025+7.3);',
'  float dune=0.10*sin(p.x*0.55+sin(p.y*0.23)*2.4)+0.05*sin(p.y*0.9+p.x*0.2);',
'  return base*(0.7+0.6*n)+dune;',
'}',

'float caustic(vec2 uv,float time){',
'  vec2 p=mod(uv*6.28318530718,6.28318530718)-250.0;',
'  vec2 i=p;float c=1.0;float inten=0.005;',
'  for(int n=0;n<5;n++){',
'    float t=time*(1.0-(3.5/float(n+1)));',
'    i=p+vec2(cos(t-i.x)+sin(t+i.y),sin(t-i.y)+cos(t+i.x));',
'    c+=1.0/length(vec2(p.x/(sin(i.x+t)/inten),p.y/(cos(i.y+t)/inten)));',
'  }',
'  c/=5.0;',
'  c=1.17-pow(c,1.4);',
'  return pow(abs(c),8.0);',
'}',

'void main(){',
'  vec3 toCam=cameraPosition-vWorld;',
'  float dist=length(toCam);',
'  vec3 V=toCam/dist;',
'  vec3 N=normalize(vN);',
'  vec2 p=vWorld.xz;',
'  float hd=length(toCam.xz);',
'  vec4 sv=simAt(p);',

'  float detailAmt=1.0-smoothstep(30.0,220.0,hd);',
'  vec2 dg=vec2(0.0);',
'  if(detailAmt>0.01){',
'    float e=0.05;',
'    vec2 q1=p*0.9+vec2(uTime*0.30,uTime*0.18);',
'    vec2 q2=p*1.55-vec2(uTime*0.22,-uTime*0.27);',
'    float h0=fbm3(q1)+0.6*fbm3(q2);',
'    float hx=fbm3(q1+vec2(e,0.0))+0.6*fbm3(q2+vec2(e,0.0));',
'    float hz=fbm3(q1+vec2(0.0,e))+0.6*fbm3(q2+vec2(0.0,e));',
'    dg=vec2(hx-h0,hz-h0)/e*0.16*detailAmt*(0.4+0.6*min(uHs,1.5));',
'  }',
'  vec2 rg;float rh=ripple(p,rg);',
'  N=normalize(vec3(N.x-dg.x-rg.x-sv.y,N.y,N.z-dg.y-rg.y-sv.z));',
'  N=normalize(mix(N,vec3(0.0,1.0,0.0),smoothstep(60.0,420.0,hd)*0.55));',
'  float nv=dot(N,V);',
'  if(nv<0.03){N=normalize(N+V*(0.03-nv));nv=max(dot(N,V),0.001);}',

'  vec3 zen;vec3 hor;skyBase(zen,hor);',
'  vec3 sc=sunColor();',
'  float dayf=smoothstep(-0.2,0.3,uSunDir.y);',
'  float sunUp=smoothstep(-0.05,0.1,uSunDir.y);',
'  vec3 ambCol=mix(hor,zen,0.5);',
'  float ambLum=dot(ambCol,vec3(0.299,0.587,0.114));',

'  vec3 R=reflect(-V,N);R.y=abs(R.y);',
'  vec3 refl=skyColor(R);',
'  float F=min(0.02+0.98*pow(1.0-clamp(nv,0.0,1.0),5.0),0.98);',

'  vec3 absK=vec3(0.42,0.11,0.025)*(1.55-uClarity*1.1);',
'  vec3 waterCol=vec3(0.004,0.07,0.30)*(0.12+ambLum*1.6)*(1.0+0.6*dot(sc,vec3(0.333))*max(uSunDir.y,0.0));',

'  vec3 Nr=normalize(mix(N,vec3(0.0,1.0,0.0),0.55));',
'  vec3 T=refract(-V,Nr,0.7502);',
'  float smax=70.0;float s0=0.0;float s1=0.0;bool hit=false;',
'  for(int i=1;i<=24;i++){',
'    float fi=float(i)/24.0;',
'    s1=fi*fi*smax;',
'    vec3 q=vWorld+T*s1;',
'    if(q.y<-seaDepth(q.xz)){hit=true;break;}',
'    s0=s1;',
'  }',
'  vec3 body=waterCol;',
'  if(hit){',
'    for(int j=0;j<6;j++){',
'      float m=0.5*(s0+s1);vec3 q=vWorld+T*m;',
'      if(q.y<-seaDepth(q.xz)){s1=m;}else{s0=m;}',
'    }',
'    vec3 hp=vWorld+T*s1;',
'    float path=s1;',
'    float colDepth=max(vWorld.y-hp.y,0.05);',
'    vec2 h2=hp.xz;',
'    float sandN=noise(h2*0.35)*0.5+noise(h2*1.7)*0.3+noise(h2*9.0)*0.2;',
'    float ra=h2.x*2.6+sin(h2.y*0.37)*2.5+noise(h2*0.5)*3.0;',
'    float rip=0.5+0.5*sin(ra);',
'    float grain=noise(h2*34.0);',
'    float speck=smoothstep(0.90,0.96,noise(h2*17.0+5.0));',
'    vec3 sand=mix(vec3(0.60,0.52,0.38),vec3(0.82,0.75,0.58),sandN);',
'    sand*=0.84+0.16*rip;',
'    sand*=0.92+0.16*grain;',
'    sand=mix(sand,vec3(0.9,0.86,0.78),speck*0.45);',
'    float gx=0.10*cos(ra)+0.04*(noise(h2*34.0+vec2(0.07,0.0))-grain)*14.0;',
'    float gz=0.05*cos(h2.y*0.9+h2.x*0.2)+0.04*(noise(h2*34.0+vec2(0.0,0.07))-grain)*14.0;',
'    vec3 bn=normalize(vec3(-gx,1.0,-gz));',
'    vec3 Lr=refract(-uSunDir,vec3(0.0,1.0,0.0),0.7502);',
'    float lp=colDepth/max(-Lr.y,0.2);',
'    vec2 ce=h2-Lr.xz*lp;',
'    vec2 wob=vec2(noise(ce*0.3+3.1),noise(ce*0.3+9.7))-0.5;',
'    vec2 cuv=ce*0.09+wob*0.25;',
'    float cA=caustic(cuv,uTime*0.55);',
'    float cB=caustic(cuv*1.618+0.41,uTime*0.42+9.0);',
'    float cc=cA*0.6+cB*0.4;',
'    float sharp=1.0-smoothstep(1.5,16.0,colDepth);',
'    float cm=clamp(1.0+uCaustic*(cc*2.2*(0.2+0.8*sharp)-0.3),0.25,2.8);',
'    vec3 sunAbs=exp(-absK*lp);',
'    vec3 bedRad=sand*(sc*2.0*max(dot(bn,-Lr),0.0)*sunAbs*cm*sunUp+ambCol*0.55*exp(-absK*colDepth*1.2));',
'    vec3 trans=exp(-absK*path);',
'    float scat=1.0-exp(-path*0.16*(1.6-uClarity));',
'    body=bedRad*trans+waterCol*scat;',
'  }',

'  float crest=smoothstep(0.0,0.9,vH/(0.5*uHs+0.05));',
'  float sss=pow(max(dot(-V,uSunDir),0.0),3.0)*crest*dayf*sunUp;',
'  body+=vec3(0.05,0.42,0.30)*sc*sss*0.9;',

'  vec3 H=normalize(uSunDir+V);',
'  float NdH=max(dot(N,H),0.0);',
'  float Fh=0.02+0.98*pow(1.0-max(dot(H,V),0.0),5.0);',
'  float rf=smoothstep(30.0,300.0,hd);',
'  float spec=pow(NdH,mix(900.0,220.0,rf))*mix(28.0,10.0,rf)+pow(NdH,120.0)*1.4+pow(NdH,18.0)*0.05;',

'  vec3 col=body*(1.0-F)+refl*F+sc*spec*Fh;',

'  float ft=fbm3(p*1.1+vec2(uTime*0.08,0.0))*0.6+fbm3(p*3.7-vec2(0.0,uTime*0.15))*0.4;',
'  float foam=vFoam*smoothstep(0.30,0.62,ft+vFoam*0.35);',
'  foam=max(foam,smoothstep(0.18,0.7,sv.w*(0.55+0.9*ft)));',
'  foam*=1.0-smoothstep(120.0,260.0,hd);',
'  vec3 foamCol=vec3(0.93,0.97,1.0)*(sc*max(dot(N,uSunDir),0.0)*0.85+ambCol*0.95+0.02);',
'  col=mix(col,foamCol,clamp(foam,0.0,1.0)*0.92);',

'  float fog=max(1.0-exp(-pow(hd/190.0,1.5)),smoothstep(150.0,250.0,hd));',
'  vec3 fd=-V;fd.y=0.02;fd=normalize(fd);',
'  col=mix(col,skyColor(fd),fog);',
'  gl_FragColor=vec4(finish(col),1.0);',
'}'
].join('\n');

/* ---------- splash layer: ambient crest spray and tap bursts, simulated on the GPU ---------- */
var SPRAY_COMMON = [
'precision highp float;',
'uniform float uTime;',
'uniform vec4 uWaves[12];',
'uniform float uPxScale;',
'varying float vAlpha;',
'varying float vDist;',
'float surfH(vec2 p,float t){',
'  float h=0.0;',
'  for(int i=0;i<12;i++){vec4 w=uWaves[i];float k=w.w;float c=sqrt(9.81/k);h+=w.z*sin(k*(dot(w.xy,p)-c*t)+float(i)*1.7);}',
'  return h;',
'}',
'float rnd(vec2 v){return fract(sin(dot(v,vec2(12.9898,78.233)))*43758.5453);}'
].join('\n');

var SPRAY_VERT = SPRAY_COMMON + '\n' + [
'uniform float uHs;',
'uniform float uFoamAmt;',
'uniform float uSpray;',
'uniform vec2 uWind;',
'attribute vec4 aSeed;',
'void main(){',
'  vAlpha=0.0;vDist=0.0;',
'  vec2 cam=cameraPosition.xz;',
'  float R=110.0;float LIFE=1.5;',
'  vec2 base=aSeed.xy*R;',
'  vec2 p0=cam+mod(base-cam+R*0.5,R)-R*0.5;',
'  float cyc=uTime/LIFE+aSeed.z;',
'  float n=floor(cyc);float ph=fract(cyc);',
'  float ts=(n-aSeed.z)*LIFE;',
'  float r1=rnd(vec2(n,aSeed.w*91.7));',
'  float r2=rnd(vec2(n+3.1,aSeed.w*57.3));',
'  float r3=rnd(vec2(n+7.7,aSeed.w*13.9));',
'  vec2 sp=p0+(vec2(r1,r2)-0.5)*30.0;',
'  float h0=surfH(sp,ts);',
'  float crest=h0/(0.5*uHs+0.01);',
'  float emit=step(0.6,crest)*step(r3,uFoamAmt*uSpray*1.5);',
'  float age=ph*LIFE;',
'  float vy=1.0+3.0*r2*(0.5+0.35*uHs);',
'  vec2 vh=uWind*(2.0+5.0*r1)+(vec2(r3,r1)-0.5)*1.6;',
'  vec3 wp=vec3(sp.x+vh.x*age,h0+0.1+vy*age-5.5*age*age,sp.y+vh.y*age);',
'  float d=length(wp.xz-cam);',
'  float dc=distance(wp,cameraPosition);',
'  float fade=(1.0-smoothstep(R*0.30,R*0.46,d))*(1.0-smoothstep(70.0,105.0,dc));',
'  float a=emit*fade*(1.0-ph)*smoothstep(0.0,0.08,ph)*0.85;',
'  if(a<0.01||wp.y<h0-0.15){gl_Position=vec4(2.0,2.0,2.0,1.0);gl_PointSize=0.0;return;}',
'  vAlpha=a;vDist=dc;',
'  gl_Position=projectionMatrix*viewMatrix*vec4(wp,1.0);',
'  float sz=(0.05+0.10*r2)*(1.2-0.5*ph);',
'  gl_PointSize=clamp(sz*uPxScale/gl_Position.w,1.5,48.0);',
'}'
].join('\n');

var BURST_VERT = SPRAY_COMMON + '\n' + [
'uniform vec4 uBurst[6];',
'attribute vec4 aSeed;',
'attribute float aId;',
'void main(){',
'  vAlpha=0.0;vDist=0.0;',
'  vec4 b=uBurst[int(aId+0.5)];',
'  float age=uTime-b.z;',
'  if(b.w<=0.0||age<0.0||age>3.0){gl_Position=vec4(2.0,2.0,2.0,1.0);gl_PointSize=0.0;return;}',
'  float th=aSeed.x*6.2831853;',
'  float sp=(0.6+2.8*aSeed.y*aSeed.y)*b.w;',
'  float vy=(2.5+4.5*aSeed.z)*(0.6+0.7*b.w);',
'  float land=2.0*vy/9.8;',
'  if(age>land){gl_Position=vec4(2.0,2.0,2.0,1.0);gl_PointSize=0.0;return;}',
'  float y0=surfH(b.xy,uTime);',
'  vec3 wp=vec3(b.x+cos(th)*sp*age,y0+0.05+vy*age-4.9*age*age,b.y+sin(th)*sp*age);',
'  float dc=distance(wp,cameraPosition);',
'  vAlpha=(1.0-age/land)*smoothstep(0.0,0.05,age)*0.9;vDist=dc;',
'  gl_Position=projectionMatrix*viewMatrix*vec4(wp,1.0);',
'  float sz=0.035+0.09*aSeed.w;',
'  gl_PointSize=clamp(sz*uPxScale/gl_Position.w,1.5,40.0);',
'}'
].join('\n');

/* object impacts: a crown of droplets thrown off the rim, a delayed central jet, and fine mist. Everything scales with the hit. */
var IMPACT_VERT = SPRAY_COMMON + '\n' + [
'uniform vec4 uImp[4];',
'uniform vec4 uImpB[4];',
'attribute vec4 aSeed;',
'attribute float aId;',
'void main(){',
'  vAlpha=0.0;vDist=0.0;',
'  int id=int(aId+0.5);',
'  vec4 b=uImp[id];vec4 cb=uImpB[id];',
'  float age=uTime-b.z;',
'  if(b.w<=0.0||age<0.0||age>4.0){gl_Position=vec4(2.0,2.0,2.0,1.0);gl_PointSize=0.0;return;}',
'  float k=sqrt(b.w);float R0=cb.x;',
'  float th=aSeed.x*6.2831853;vec2 dir=vec2(cos(th),sin(th));',
'  float ty=aSeed.w;float t0=0.0;vec2 x0=vec2(0.0);float vh;float vy;float sz;',
'  if(ty<0.45){',
'    x0=dir*R0*(0.8+0.3*aSeed.y);vh=(1.0+3.0*aSeed.y)*k;vy=(2.2+5.0*aSeed.z)*k;sz=0.05+0.10*aSeed.y;',
'  }else if(ty<0.72){',
'    t0=0.10+0.16*aSeed.y;x0=dir*R0*0.3*aSeed.z;vh=(0.2+0.9*aSeed.y)*k;vy=(4.5+6.0*aSeed.z)*k;sz=0.06+0.11*aSeed.z;',
'  }else{',
'    x0=dir*R0*(0.5+aSeed.y);vh=(2.0+6.0*aSeed.y)*k;vy=(1.0+6.0*aSeed.z)*k;sz=0.04+0.07*aSeed.y;',
'  }',
'  float a2=age-t0;',
'  float life=2.0*vy/9.8;',
'  if(a2<0.0||a2>life){gl_Position=vec4(2.0,2.0,2.0,1.0);gl_PointSize=0.0;return;}',
'  float y0=surfH(b.xy,b.z);',
'  vec3 wp=vec3(b.x+x0.x+dir.x*vh*a2,y0+0.1+vy*a2-4.9*a2*a2,b.y+x0.y+dir.y*vh*a2);',
'  float dc=distance(wp,cameraPosition);',
'  vAlpha=smoothstep(0.0,0.04,a2)*(1.0-smoothstep(0.75,1.0,a2/life))*0.7;vDist=dc;',
'  gl_Position=projectionMatrix*viewMatrix*vec4(wp,1.0);',
'  gl_PointSize=clamp(sz*uPxScale/gl_Position.w,1.5,80.0);',
'}'
].join('\n');

var SPRITE_FRAG = COMMON + '\n' + [
'varying float vAlpha;',
'varying float vDist;',
'void main(){',
'  vec2 c=gl_PointCoord-0.5;',
'  float r=dot(c,c)*4.0;',
'  float a=smoothstep(1.0,0.35,r)*vAlpha;',
'  if(a<0.01)discard;',
'  vec3 zen;vec3 hor;skyBase(zen,hor);',
'  vec3 sc=sunColor();',
'  vec3 amb=mix(hor,zen,0.5);',
'  vec3 col=vec3(0.95,0.98,1.0)*(sc*0.8+amb*0.9+0.02);',
'  float fog=max(1.0-exp(-pow(vDist/190.0,1.5)),smoothstep(150.0,250.0,vDist));',
'  col=mix(col,hor,fog);',
'  gl_FragColor=vec4(finish(col),a);',
'}'
].join('\n');

/* ---------- scene ---------- */
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(58, 1, 0.3, 2600);
camera.rotation.order = 'YXZ';

var sky = new THREE.Mesh(
  new THREE.SphereGeometry(1000, 32, 16),
  new THREE.ShaderMaterial({ uniforms: U, vertexShader: SKY_VERT, fragmentShader: SKY_FRAG, side: THREE.BackSide, depthTest: false, depthWrite: false })
);
sky.frustumCulled = false;
sky.renderOrder = -1;
scene.add(sky);

var small = Math.min(window.innerWidth, window.innerHeight) < 700;
/* polar grid centred on the camera: about 0.2 m between vertices nearby, widening toward the horizon */
function makeOceanGeometry(rings, segs, rmax) {
  var pos = new Float32Array((rings + 1) * segs * 3), idx = [], i, j, t, r, a;
  for (i = 0; i <= rings; i++) {
    t = i / rings; r = rmax * t * t;
    for (j = 0; j < segs; j++) {
      a = j / segs * Math.PI * 2;
      var o = (i * segs + j) * 3;
      pos[o] = Math.cos(a) * r; pos[o + 1] = 0; pos[o + 2] = Math.sin(a) * r;
    }
  }
  for (i = 0; i < rings; i++) {
    for (j = 0; j < segs; j++) {
      var j2 = (j + 1) % segs;
      var A = i * segs + j, B = i * segs + j2, C = (i + 1) * segs + j, D = (i + 1) * segs + j2;
      idx.push(A, B, C, B, D, C);
    }
  }
  var g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setIndex(new THREE.BufferAttribute(new Uint32Array(idx), 1));
  return g;
}
var geo = makeOceanGeometry(small ? 320 : 480, small ? 480 : 720, 260);
var water = new THREE.Mesh(geo, new THREE.ShaderMaterial({ uniforms: U, vertexShader: WATER_VERT, fragmentShader: WATER_FRAG, side: THREE.DoubleSide }));
water.frustumCulled = false;
scene.add(water);

function makePoints(n, bursts) {
  var g = new THREE.BufferGeometry();
  var seed = new Float32Array(n * 4), id = new Float32Array(n), i;
  for (i = 0; i < n * 4; i++) seed[i] = Math.random();
  for (i = 0; i < n; i++) id[i] = Math.floor(i / (n / 6));
  g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
  g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 4));
  if (bursts) g.setAttribute('aId', new THREE.BufferAttribute(id, 1));
  var m = new THREE.Points(g, new THREE.ShaderMaterial({
    uniforms: SU, vertexShader: bursts ? BURST_VERT : SPRAY_VERT, fragmentShader: SPRITE_FRAG,
    transparent: true, depthWrite: false, depthTest: true
  }));
  m.frustumCulled = false;
  m.renderOrder = 2;
  return m;
}
scene.add(makePoints(small ? 5000 : 9000, false));
scene.add(makePoints(6 * 140, true));
(function () {
  var n = 4 * 520, g = new THREE.BufferGeometry(), seed = new Float32Array(n * 4), id = new Float32Array(n), i;
  for (i = 0; i < n * 4; i++) seed[i] = Math.random();
  for (i = 0; i < n; i++) id[i] = Math.floor(i / 520);
  g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
  g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 4));
  g.setAttribute('aId', new THREE.BufferAttribute(id, 1));
  var m = new THREE.Points(g, new THREE.ShaderMaterial({ uniforms: SU, vertexShader: IMPACT_VERT, fragmentShader: SPRITE_FRAG, transparent: true, depthWrite: false, depthTest: true }));
  m.frustumCulled = false; m.renderOrder = 2;
  scene.add(m);
})();

/* ---------- parameters ---------- */
var BEAUFORT = ['Calm', 'Light air', 'Light breeze', 'Gentle breeze', 'Moderate breeze', 'Fresh breeze', 'Strong breeze', 'Near gale', 'Gale', 'Strong gale', 'Storm', 'Violent storm', 'Hurricane'];
var BF_HS = [0.05, 0.2, 0.5, 0.9, 1.4, 2.2, 3.2, 4.5, 6, 7.5, 9.5, 12];

function applyWaves() {
  var a = state.wind * Math.PI / 180, sumA2 = 0, sumKA = 0, i;
  for (i = 0; i < WL.length; i++) {
    var ang = a + WOFF[i];
    var A = WL[i] * WS[i] * state.height;
    var k = 2 * Math.PI / WL[i];
    U.uWaves.value[i].set(Math.sin(ang), Math.cos(ang), A, k);
    sumA2 += A * A; sumKA += k * A;
  }
  var hs = 4 * Math.sqrt(sumA2 / 2);
  var chop = sumKA > 0 ? Math.min(state.chop, 1.2 / sumKA) : state.chop;
  U.uChop.value = chop;
  SU.uWind.value.set(Math.sin(a), Math.cos(a));
  U.uWindAng.value = a;
  U.uHs.value = Math.max(hs, 0.02);
  U.uFoamAmt.value = Math.max(0, Math.min(1, (hs - 0.7) / 1.8)) * (0.5 + 0.5 * Math.min(state.chop, 1));
  var b = 0; for (i = 0; i < BF_HS.length; i++) if (hs > BF_HS[i]) b = i + 1;
  $('rd-b').innerHTML = '<b>Beaufort ' + b + '</b> ' + BEAUFORT[b].toLowerCase();
  $('rd-h').innerHTML = 'Hs <b>' + hs.toFixed(1) + ' m</b>';
}

function applySun() {
  var el = state.sun * Math.PI / 180;
  U.uSunDir.value.set(Math.cos(el) * Math.sin(SUN_AZ), Math.sin(el), -Math.cos(el) * Math.cos(SUN_AZ));
}

var yaw = 0, pitch = -0.10;
var camPos = new THREE.Vector3(0, state.camH, 38);
var view = { top: false, busy: false, t: 0, dur: 1.2, from: null, to: null, saved: null };
function applyCamera() {
  camera.position.copy(camPos);
  camera.rotation.set(pitch, yaw, 0);
}

/* ---------- controls UI ---------- */
var CFG = [
  { k: 'height',   label: 'Swell height',  min: 0.1, max: 2.5, step: 0.05, fmt: function (v) { return v.toFixed(2) + '×'; } },
  { k: 'chop',     label: 'Choppiness',    min: 0,   max: 1.4, step: 0.05, fmt: function (v) { return v.toFixed(2); } },
  { k: 'wind',     label: 'Wave heading',  min: 0,   max: 360, step: 1,    fmt: function (v) { return Math.round(v) + '°'; } },
  { k: 'sun',      label: 'Sun elevation', min: -6,  max: 80,  step: 1,    fmt: function (v) { return Math.round(v) + '°'; } },
  { k: 'cover',    label: 'Cloud cover',   min: 0,   max: 1,   step: 0.01, fmt: function (v) { return Math.round(v * 100) + '%'; } },
  { k: 'clarity',  label: 'Water clarity', min: 0.2, max: 1,   step: 0.01, fmt: function (v) { return Math.round(v * 100) + '%'; } },
  { k: 'caustics', label: 'Caustics',      min: 0,   max: 2,   step: 0.05, fmt: function (v) { return v.toFixed(2); } },
  { k: 'spray',    label: 'Spray',         min: 0,   max: 2,   step: 0.05, fmt: function (v) { return v.toFixed(2); } },
  { k: 'volume',   label: 'Volume',        min: 0,   max: 1,   step: 0.01, fmt: function (v) { return Math.round(v * 100) + '%'; } },
  { k: 'camH',     label: 'Camera height', min: 1.5, max: 30,  step: 0.5,  fmt: function (v) { return v.toFixed(1) + ' m'; } }
];
var inputs = {}, outputs = {};
var host = $('sliders');
CFG.forEach(function (c) {
  var row = document.createElement('div'); row.className = 'ctl';
  var id = 's-' + c.k;
  var lab = document.createElement('label'); lab.htmlFor = id; lab.textContent = c.label;
  var out = document.createElement('output'); out.htmlFor = id;
  var inp = document.createElement('input');
  inp.type = 'range'; inp.id = id; inp.min = c.min; inp.max = c.max; inp.step = c.step; inp.value = state[c.k];
  row.appendChild(lab); row.appendChild(out); row.appendChild(inp);
  host.appendChild(row);
  inputs[c.k] = inp; outputs[c.k] = out;
  inp.addEventListener('input', function () { state[c.k] = parseFloat(inp.value); refresh(c.k); });
});

function refresh(key) {
  CFG.forEach(function (c) { outputs[c.k].textContent = c.fmt(state[c.k]); });
  if (key === 'height' || key === 'chop' || key === 'wind') applyWaves();
  if (key === 'sun') applySun();
  if (key === 'cover') U.uCover.value = state.cover;
  if (key === 'clarity') U.uClarity.value = state.clarity;
  if (key === 'caustics') U.uCaustic.value = state.caustics;
  if (key === 'spray') SU.uSpray.value = state.spray;
  if (key === 'volume') applyVolume();
  if (key === 'camH' && !view.top && !view.busy) { camPos.y = state.camH; applyCamera(); }
  markChips();
}

function setAll(vals) {
  Object.keys(vals).forEach(function (k) { state[k] = vals[k]; inputs[k].value = vals[k]; });
  if (!view.top && !view.busy) camPos.y = state.camH;
  SU.uSpray.value = state.spray;
  applyWaves(); applySun(); applyCamera();
  U.uCover.value = state.cover; U.uClarity.value = state.clarity; U.uCaustic.value = state.caustics;
  refresh();
}

var SEA = { Calm: { height: 0.25, chop: 0.6, cover: 0.1, spray: 0.6 }, Swell: { height: 0.7, chop: 0.9, cover: 0.25, spray: 1.0 }, Storm: { height: 2.0, chop: 1.2, cover: 0.9, spray: 1.8 } };
var LIGHT = { Noon: { sun: 58 }, Golden: { sun: 9 }, Dusk: { sun: -3 } };
var chipEls = [];
function makeChips(hostId, map) {
  Object.keys(map).forEach(function (name) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'chip'; b.textContent = name;
    b.addEventListener('click', function () { setAll(map[name]); });
    $(hostId).appendChild(b); chipEls.push({ el: b, vals: map[name] });
  });
}
function markChips() {
  chipEls.forEach(function (c) {
    var on = Object.keys(c.vals).every(function (k) { return Math.abs(state[k] - c.vals[k]) < 1e-6; });
    c.el.classList.toggle('on', on);
  });
}
makeChips('chips-sea', SEA);
makeChips('chips-light', LIGHT);

var paused = false;
$('pause').addEventListener('click', function () {
  paused = !paused; this.textContent = paused ? 'Resume' : 'Pause'; this.classList.toggle('on', paused);
});

var panel = $('panel'), toggle = $('toggle');
function setPanel(open) { panel.hidden = !open; toggle.setAttribute('aria-expanded', String(open)); }
toggle.addEventListener('click', function () { setPanel(panel.hidden); });
setPanel(window.innerWidth > 760);

/* ---------- pointer: look around, tap for ripple ---------- */
var ripIdx = 0, burstIdx = 0, simT = 0;
var ray = new THREE.Raycaster();
function splashAt(x, z, k) {
  if (!simKick(x, z, -0.3 * k, 0.8, 0.9 * k)) {
    U.uRip.value[ripIdx].set(x, z, simT, 0.35);
    ripIdx = (ripIdx + 1) % U.uRip.value.length;
  }
  SU.uBurst.value[burstIdx].set(x, z, simT, Math.max(0.3, Math.min(1, k)));
  burstIdx = (burstIdx + 1) % SU.uBurst.value.length;
  splashSound(x, z);
}
function dropRipple(cx, cy) {
  var r = canvas.getBoundingClientRect();
  var ndc = new THREE.Vector2(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1);
  ray.setFromCamera(ndc, camera);
  var d = ray.ray.direction, o = ray.ray.origin;
  if (d.y >= -0.002) return;
  var t = -o.y / d.y;
  if (t > 320) return;
  splashAt(o.x + d.x * t, o.z + d.z * t, 1.0);
}

var down = null;
canvas.addEventListener('pointerdown', function (e) {
  down = { x: e.clientX, y: e.clientY, lx: e.clientX, ly: e.clientY, t: performance.now(), moved: 0 };
  try { canvas.setPointerCapture(e.pointerId); } catch (x) {}
  canvas.classList.add('drag');
  canvas.focus();
});
canvas.addEventListener('pointermove', function (e) {
  if (!down) return;
  var dx = e.clientX - down.lx, dy = e.clientY - down.ly;
  down.lx = e.clientX; down.ly = e.clientY;
  down.moved += Math.abs(dx) + Math.abs(dy);
  if (view.busy) return;
  yaw += dx * 0.0035;
  if (!view.top) pitch = Math.max(-1.25, Math.min(1.3, pitch + dy * 0.0035));
  applyCamera();
});
function endPointer(e) {
  if (!down) return;
  if (down.moved < 6 && performance.now() - down.t < 450) dropRipple(e.clientX, e.clientY);
  down = null; canvas.classList.remove('drag');
}
canvas.addEventListener('pointerup', endPointer);
canvas.addEventListener('pointercancel', function () { down = null; canvas.classList.remove('drag'); });

/* ---------- floating bodies: cannon.js rigid bodies, buoyancy sampled from the live wave field ---------- */
var RHO = 1000, GRAV = 9.81;
var hasPhys = typeof CANNON !== 'undefined';
var pworld = null, bodies = [], pAcc = 0, driven = null, kH = 0.9, kV = 6.0;
if (hasPhys) {
  pworld = new CANNON.World();
  pworld.gravity.set(0, -GRAV, 0);
  pworld.broadphase = new CANNON.NaiveBroadphase();
  pworld.solver.iterations = 8;
  pworld.defaultContactMaterial.friction = 0.25;
  pworld.defaultContactMaterial.restitution = 0.15;
}

function sstep(a, b, x) { var t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); }

/* height of the rendered surface at (x, z): the 12 swell waves (with the same distance fade as the vertex shader) plus the simulation */
function surfaceAt(x, z, t) {
  var h = 0, W = U.uWaves.value, dx = x - camPos.x, dz = z - camPos.z, dv = Math.sqrt(dx * dx + dz * dz + camPos.y * camPos.y);
  for (var i = 0; i < W.length; i++) {
    var w = W[i], k = w.w, Lw = 6.2831853 / k, c = Math.sqrt(GRAV / k);
    h += w.z * (1 - sstep(Lw * 10, Lw * 30, dv)) * Math.sin(k * (w.x * x + w.y * z - c * t) + i * 1.7);
  }
  return h + simHAt(x, z);
}

/* ----- body shading: same sky, sun and tonemap as the water ----- */
var BODY_VERT = [
'precision highp float;',
'varying vec3 vWorld;varying vec3 vNrm;varying vec2 vUv;varying float vLY;',
'void main(){',
'  vec4 wp=modelMatrix*vec4(position,1.0);',
'  vWorld=wp.xyz;vNrm=normalize(mat3(modelMatrix)*normal);vUv=uv;vLY=position.y;',
'  gl_Position=projectionMatrix*viewMatrix*wp;',
'}'
].join('\n');

var BODY_FRAG = COMMON + '\n' + [
'varying vec3 vWorld;varying vec3 vNrm;varying vec2 vUv;varying float vLY;',
'uniform vec3 uColor;uniform sampler2D uMap;uniform float uUseMap;uniform float uGloss;uniform float uWL;',
'uniform vec3 uStripeCol;uniform vec2 uStripeY;uniform float uLamp;',
'void main(){',
'  vec3 toCam=cameraPosition-vWorld;float dist=length(toCam);vec3 V=toCam/dist;',
'  vec3 N=normalize(vNrm);if(dot(N,V)<0.0)N=-N;',
'  vec3 alb=uColor;',
'  if(uUseMap>0.5){alb*=pow(texture2D(uMap,vUv).rgb,vec3(2.2));}',
'  if(vLY>uStripeY.x&&vLY<uStripeY.y)alb=uStripeCol;',
'  vec3 zen;vec3 hor;skyBase(zen,hor);vec3 sc=sunColor();',
'  vec3 amb=mix(hor*0.3+vec3(0.0,0.02,0.03),mix(hor,zen,0.5),N.y*0.5+0.5);',
'  float nl=max(dot(N,uSunDir),0.0);',
'  vec3 H=normalize(uSunDir+V);',
'  float spec=pow(max(dot(N,H),0.0),mix(30.0,260.0,uGloss))*uGloss*2.0;',
'  float F=0.04+0.96*pow(1.0-max(dot(N,V),0.0),5.0);',
'  vec3 R=reflect(-V,N);R.y=abs(R.y);',
'  vec3 col=alb*(sc*nl*1.5+amb*0.9)+sc*spec+skyColor(R)*F*uGloss;',
'  float rel=vWorld.y-uWL;',
'  col*=1.0-0.45*(1.0-smoothstep(-0.05,0.18,rel));',
'  float wet=exp(-abs(rel)*14.0);',
'  col=mix(col,vec3(0.92,0.97,1.0)*(sc*0.5+amb*0.9),wet*0.28);',
'  col+=vec3(1.0,0.7,0.3)*uLamp*(0.7+0.3*sin(uTime*3.0))*(1.0-0.7*smoothstep(-0.05,0.25,uSunDir.y))*2.0;',
'  float hd=length(toCam.xz);',
'  float fog=max(1.0-exp(-pow(hd/190.0,1.5)),smoothstep(150.0,250.0,hd));',
'  vec3 fd=-V;fd.y=0.02;fd=normalize(fd);',
'  col=mix(col,skyColor(fd),fog);',
'  gl_FragColor=vec4(finish(col),1.0);',
'}'
].join('\n');

var whiteTex = new THREE.DataTexture(new Uint8Array([255, 255, 255, 255]), 1, 1, THREE.RGBAFormat);
whiteTex.needsUpdate = true;

function canvasTex(w, h, draw) {
  var c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  var t = new THREE.CanvasTexture(c); t.anisotropy = 4; t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}
var TEX = {};
function getTex(name) {
  if (TEX[name]) return TEX[name];
  if (name === 'crate') {
    TEX[name] = canvasTex(256, 256, function (g, w, h) {
      var i, y;
      g.fillStyle = '#8c5d2e'; g.fillRect(0, 0, w, h);
      for (i = 0; i < 6; i++) {
        y = i * h / 6;
        g.fillStyle = 'hsl(30,' + (38 + (i * 7) % 12) + '%,' + (32 + (i * 5) % 9) + '%)'; g.fillRect(0, y + 2, w, h / 6 - 3);
        g.strokeStyle = 'rgba(40,22,8,.35)'; g.lineWidth = 1;
        for (var n = 0; n < 9; n++) { var gy = y + 4 + Math.random() * (h / 6 - 8); g.beginPath(); g.moveTo(0, gy); g.bezierCurveTo(w * 0.3, gy + (Math.random() - .5) * 4, w * 0.6, gy + (Math.random() - .5) * 4, w, gy); g.stroke(); }
        g.fillStyle = 'rgba(20,10,4,.7)'; g.fillRect(0, y, w, 2);
      }
      g.strokeStyle = '#4e3216'; g.lineWidth = 18; g.strokeRect(9, 9, w - 18, h - 18);
      g.lineWidth = 14; g.beginPath(); g.moveTo(14, 14); g.lineTo(w - 14, h - 14); g.moveTo(w - 14, 14); g.lineTo(14, h - 14); g.stroke();
      g.fillStyle = '#b9b2a4';
      [[14, 14], [w - 14, 14], [14, h - 14], [w - 14, h - 14], [w / 2, h / 2]].forEach(function (p) { g.beginPath(); g.arc(p[0], p[1], 4, 0, 6.3); g.fill(); });
    });
  } else {
    TEX[name] = canvasTex(64, 128, function (g, w, h) {
      for (var i = 0; i < 8; i++) { g.fillStyle = i % 2 ? '#f3eee4' : '#c8321f'; g.fillRect(0, i * h / 8, w, h / 8 + 1); }
    });
  }
  return TEX[name];
}

function bodyMat(b, o) {
  var u = Object.assign({}, U, {
    uColor: { value: new THREE.Vector3(o.c[0], o.c[1], o.c[2]) },
    uMap: { value: o.map ? getTex(o.map) : whiteTex },
    uUseMap: { value: o.map ? 1 : 0 },
    uGloss: { value: o.gloss || 0.2 },
    uWL: { value: 0 },
    uStripeCol: { value: new THREE.Vector3(o.sc ? o.sc[0] : 0, o.sc ? o.sc[1] : 0, o.sc ? o.sc[2] : 0) },
    uStripeY: { value: new THREE.Vector2(o.sy ? o.sy[0] : 1, o.sy ? o.sy[1] : 0) },
    uLamp: { value: o.lamp || 0 }
  });
  b.mats.push(u.uWL);
  return new THREE.ShaderMaterial({ uniforms: u, vertexShader: BODY_VERT, fragmentShader: BODY_FRAG });
}

function probeGrid(nx, nz, ax, az) {
  var out = [], i, j;
  for (i = 0; i < nx; i++) for (j = 0; j < nz; j++) out.push([nx > 1 ? -ax + 2 * ax * i / (nx - 1) : 0, 0, nz > 1 ? -az + 2 * az * j / (nz - 1) : 0]);
  return out;
}

var DEFS = {
  crate: {
    label: 'Crate', mass: 530, vol: 1.4 * 0.6 * 1.4, area: 1.96, hp: 0.6, rad: 1.0,
    probes: probeGrid(3, 3, 0.5, 0.5), patches: [[0, 0, 0.55]],
    shape: function () { return [new CANNON.Box(new CANNON.Vec3(0.7, 0.3, 0.7)), new CANNON.Vec3(0, 0, 0)]; },
    build: function (b) {
      var g = new THREE.Group();
      g.add(new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.6, 1.4), bodyMat(b, { c: [1, 1, 1], map: 'crate', gloss: 0.08 })));
      return g;
    }
  },
  buoy: {
    label: 'Buoy', mass: 290, vol: 0.5236, area: 0.785, hp: 1.0, rad: 0.7,
    probes: [[0, 0.3, 0], [0.3, 0.3, 0], [-0.3, 0.3, 0], [0, 0.3, 0.3], [0, 0.3, -0.3]], patches: [[0, 0, 0.4]],
    shape: function () { return [new CANNON.Sphere(0.5), new CANNON.Vec3(0, 0.3, 0)]; },
    build: function (b) {
      var g = new THREE.Group(), m;
      m = new THREE.Mesh(new THREE.SphereGeometry(0.5, 28, 20), bodyMat(b, { c: [1, 1, 1], map: 'buoy', gloss: 0.5 })); m.position.y = 0.3; g.add(m);
      m = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.05, 1.1, 10), bodyMat(b, { c: [0.08, 0.08, 0.09], gloss: 0.3 })); m.position.y = 1.35; g.add(m);
      m = new THREE.Mesh(new THREE.SphereGeometry(0.1, 14, 10), bodyMat(b, { c: [1.0, 0.55, 0.15], gloss: 0.6, lamp: 1 })); m.position.y = 1.95; g.add(m);
      return g;
    }
  },
  boat: {
    label: 'Boat', mass: 1560, vol: 4.4 * 0.8 * 1.4, area: 6.16, hp: 0.8, rad: 2.2,
    probes: probeGrid(5, 3, 1.8, 0.5), patches: [[-1.3, 0, 0.7], [0, 0, 0.7], [1.3, 0, 0.7]],
    shape: function () { return [new CANNON.Box(new CANNON.Vec3(2.2, 0.4, 0.7)), new CANNON.Vec3(0, 0, 0)]; },
    build: function (b) {
      var g = new THREE.Group(), m, s = new THREE.Shape();
      s.moveTo(-2.2, -0.7); s.lineTo(0.8, -0.7); s.quadraticCurveTo(1.9, -0.6, 2.3, 0); s.quadraticCurveTo(1.9, 0.6, 0.8, 0.7); s.lineTo(-2.2, 0.7); s.lineTo(-2.2, -0.7);
      var hg = new THREE.ExtrudeGeometry(s, { depth: 0.8, bevelEnabled: false, curveSegments: 10 });
      hg.rotateX(-Math.PI / 2); hg.translate(0, -0.4, 0);
      g.add(new THREE.Mesh(hg, bodyMat(b, { c: [0.78, 0.76, 0.70], gloss: 0.45, sc: [0.55, 0.06, 0.05], sy: [-0.17, -0.07] })));
      m = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.62, 0.95), bodyMat(b, { c: [0.10, 0.28, 0.36], gloss: 0.5 })); m.position.set(-0.75, 0.71, 0); g.add(m);
      m = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.34, 0.86), bodyMat(b, { c: [0.01, 0.02, 0.03], gloss: 0.95 })); m.position.set(-0.12, 0.8, 0); m.rotation.z = -0.35; g.add(m);
      m = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.9, 8), bodyMat(b, { c: [0.7, 0.7, 0.72], gloss: 0.5 })); m.position.set(-1.0, 1.5, 0); g.add(m);
      m = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 8), bodyMat(b, { c: [1, 0.9, 0.7], gloss: 0.5, lamp: 1 })); m.position.set(-1.0, 1.98, 0); g.add(m);
      return g;
    }
  }
};

function addBody(kind) {
  if (!hasPhys) return null;
  var d = DEFS[kind];
  if (bodies.length >= 8) removeBody(bodies[0]);
  var fx = -Math.sin(yaw), fz = -Math.cos(yaw), x = 0, z = 0, tries, spread = 3;
  for (tries = 0; tries < 40; tries++) {
    if (tries % 8 === 7) spread += 3;
    if (view.top) { x = camPos.x + (Math.random() - 0.5) * 2 * (spread + 4); z = camPos.z + (Math.random() - 0.5) * 2 * (spread + 4); }
    else { x = camPos.x + fx * 14 + (Math.random() - 0.5) * 2 * spread; z = camPos.z + fz * 14 + (Math.random() - 0.5) * 2 * spread; }
    x = Math.max(-30, Math.min(30, x)); z = Math.max(-30, Math.min(30, z));
    var clear = true;
    for (var bi = 0; bi < bodies.length; bi++) {
      var dxb = bodies[bi].body.position.x - x, dzb = bodies[bi].body.position.z - z, need = bodies[bi].def.rad + d.rad + 1.2;
      if (dxb * dxb + dzb * dzb < need * need) { clear = false; break; }
    }
    if (clear) break;
  }
  var body = new CANNON.Body({ mass: d.mass, position: new CANNON.Vec3(x, 4 + Math.random(), z) });
  var sh = d.shape();
  body.addShape(sh[0], sh[1]);
  body.quaternion.setFromEuler((Math.random() - 0.5) * 0.5, Math.random() * 6.28, (Math.random() - 0.5) * 0.5, 'XYZ');
  body.linearDamping = 0.01; body.angularDamping = 0.1;
  pworld.addBody(body);
  var b = { kind: kind, def: d, body: body, mats: [], sub: 0, prevSub: 0, out: true, sub0: d.mass / (RHO * d.vol), speed: 0 };
  b.group = d.build(b);
  scene.add(b.group);
  bodies.push(b);
  if (kind === 'boat') driven = b;
  return b;
}
function removeBody(b) {
  var i = bodies.indexOf(b);
  if (i < 0) return;
  bodies.splice(i, 1);
  scene.remove(b.group);
  b.group.traverse(function (o) { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); });
  pworld.remove(b.body);
  if (driven === b) { driven = null; for (var j = bodies.length - 1; j >= 0; j--) if (bodies[j].kind === 'boat') { driven = bodies[j]; break; } }
}
function clearBodies() { while (bodies.length) removeBody(bodies[0]); }

var tv = hasPhys ? { p: new CANNON.Vec3(), w: new CANNON.Vec3() } : null;

function applyHydro(b, h) {
  var d = b.def, body = b.body, q = body.quaternion, n = d.probes.length, sumS = 0, i;
  var m = d.mass, vShare = d.vol / n, P = tv.p, W = tv.w;
  var bx = body.position.x, by = body.position.y, bz = body.position.z;
  for (i = 0; i < n; i++) {
    var pr = d.probes[i];
    P.set(pr[0], pr[1], pr[2]); q.vmult(P, W);
    var rx = W.x, ry = W.y, rz = W.z;
    var eta = surfaceAt(bx + rx, bz + rz, simT);
    var s = (eta - (by + ry)) / d.hp + 0.5;
    s = s < 0 ? 0 : s > 1 ? 1 : s;
    if (s <= 0) continue;
    sumS += s / n;
    var av = body.angularVelocity, vel = body.velocity;
    var pvx = vel.x + av.y * rz - av.z * ry, pvy = vel.y + av.z * rx - av.x * rz, pvz = vel.z + av.x * ry - av.y * rx;
    var k = m / n * s;
    var Fx = -k * kH * pvx, Fy = RHO * GRAV * vShare * s - k * kV * pvy, Fz = -k * kH * pvz;
    if (pvy < 0) {                                   /* slamming: entering water is resisted by the pressure of the water being shoved aside */
      var slam = 0.5 * RHO * 1.3 * (d.area / n) * pvy * pvy * Math.min(1, s * 4);
      Fy += Math.min(slam, 25 * m * GRAV / n);
    }
    body.force.x += Fx; body.force.y += Fy; body.force.z += Fz;
    body.torque.x += ry * Fz - rz * Fy; body.torque.y += rz * Fx - rx * Fz; body.torque.z += rx * Fy - ry * Fx;
  }
  b.prevSub = b.sub; b.sub = sumS;
  var e = 0.6;
  var gx = (surfaceAt(bx + e, bz, simT) - surfaceAt(bx - e, bz, simT)) / (2 * e);
  var gz = (surfaceAt(bx, bz + e, simT) - surfaceAt(bx, bz - e, simT)) / (2 * e);
  var fh = RHO * GRAV * d.vol * sumS;           /* the buoyant force is normal to the surface, so a sloped surface pushes sideways */
  body.force.x -= fh * gx; body.force.z -= fh * gz;
  var ka = m * 0.35 * 2.5 * sumS;               /* water resists spinning */
  body.torque.x -= ka * body.angularVelocity.x; body.torque.y -= ka * body.angularVelocity.y; body.torque.z -= ka * body.angularVelocity.z;
  var lim = 40;                                  /* a weak current keeps everything inside the simulated basin */
  if (Math.abs(bx) > lim) body.force.x -= Math.sign(bx) * m * (Math.abs(bx) - lim) * 0.4;
  if (Math.abs(bz) > lim) body.force.z -= Math.sign(bz) * m * (Math.abs(bz) - lim) * 0.4;
  if (b === driven && sumS > 0.08) {
    var thr = (keys.ArrowUp ? 1 : 0) - (keys.ArrowDown ? 0.5 : 0), st = (keys.ArrowLeft ? 1 : 0) - (keys.ArrowRight ? 1 : 0);
    if (thr || st) {
      P.set(1, 0, 0); q.vmult(P, W);
      var hl = Math.sqrt(W.x * W.x + W.z * W.z) + 1e-6;
      body.force.x += W.x / hl * thr * m * 1.2; body.force.z += W.z / hl * thr * m * 1.2;
      var sp = Math.sqrt(body.velocity.x * body.velocity.x + body.velocity.z * body.velocity.z);
      body.torque.y += st * m * 0.3 * Math.min(1.2, 0.3 + sp / 2);
    }
  }
}

/* hull pushes on the water: its change in draught is a pressure head, a moving hull leaves a wake, an impact sends rings */
function paintBody(b, h) {
  var d = b.def, body = b.body, N = SIM_N, q = body.quaternion;
  var v = body.velocity, speed = Math.sqrt(v.x * v.x + v.z * v.z);
  b.speed = speed;
  var rest = b.sub0 * d.vol / d.area;
  var head = 0.25 * rest * Math.min(speed / 2, 1);
  var dV = (b.sub - b.prevSub) * d.vol;              /* volume of hull that just went under */
  var slamK = Math.max(0, Math.min(1, (-v.y - 0.5) / 2));
  var cav = dV > 0 ? Math.min(0.12, dV / (d.patches.length * 6.2832)) * slamK : 0;
  var P = tv.p, W = tv.w;
  for (var pi = 0; pi < d.patches.length; pi++) {
    var pt = d.patches[pi];
    P.set(pt[0], 0, pt[1]); q.vmult(P, W);
    var cx = body.position.x + W.x, cz = body.position.z + W.z, sig = pt[2];
    var gi = (cx - SIM_O) / SIM_DX - 0.5, gj = (cz - SIM_O) / SIM_DX - 0.5, R = Math.ceil(sig * 2.6 / SIM_DX) + 1;
    var i0 = Math.max(1, Math.floor(gi) - R), i1 = Math.min(N - 2, Math.floor(gi) + R);
    var j0 = Math.max(1, Math.floor(gj) - R), j1 = Math.min(N - 2, Math.floor(gj) + R);
    var s2 = 2 * sig * sig, fm = b.sub > 0.05 ? (Math.min(1, speed * 0.25) * 3 + 0.3) * h : 0, cv = cav / (sig * sig);
    for (var j = j0; j <= j1; j++) for (var i = i0; i <= i1; i++) {
      var dx = (i + 0.5) * SIM_DX + SIM_O - cx, dz = (j + 0.5) * SIM_DX + SIM_O - cz, g1 = Math.exp(-(dx * dx + dz * dz) / s2), k = j * N + i;
      simP[k] += head * g1;
      if (cv > 0) simH[k] -= cv * g1;
      if (fm > 0) simF[k] = Math.min(1, simF[k] + fm * g1);
    }
  }
  if (b.sub < 0.01) b.out = true;
  else if (b.out) { b.out = false; if (v.y < -1.0) impactSplash(b, -v.y); }
}

var impIdx = 0;
function impactSplash(b, speed) {
  var d = b.def, x = b.body.position.x, z = b.body.position.z;
  var k = Math.min(1.6, Math.max(0.25, speed / 8) * Math.min(1.5, 0.55 + d.mass / 1200));
  simKick(x, z, -0.5 * k, 0.5 + 0.3 * d.rad, 1.0);
  SU.uImp.value[impIdx].set(x, z, simT, k);
  SU.uImpB.value[impIdx].set(d.rad * 0.8, 0, 0, 0);
  impIdx = (impIdx + 1) % 4;
  splashSound(x, z, 0.8 + k * 0.6);
}

/* the camera is solid too */
function collideCamera() {
  if (view.top || view.busy) return;
  for (var i = 0; i < bodies.length; i++) {
    var p = bodies[i].body.position, r = bodies[i].def.rad + 0.7;
    if (camPos.y > p.y + 2.4) continue;
    var dx = camPos.x - p.x, dz = camPos.z - p.z, dd = Math.sqrt(dx * dx + dz * dz);
    if (dd < r) { if (dd < 1e-4) { dx = 1; dd = 1; } camPos.x = p.x + dx / dd * r; camPos.z = p.z + dz / dd * r; applyCamera(); }
  }
}

function stepPhysics(dt) {
  var i, b, n = 0, h = 1 / 120;
  if (!paused) {
    pAcc += Math.min(dt, 0.05);
    while (pAcc >= h && n < 5) {
      pAcc -= h; n++;
      simP.fill(0);
      for (i = 0; i < bodies.length; i++) { applyHydro(bodies[i], h); paintBody(bodies[i], h); }
      if (pworld && bodies.length) pworld.step(h);
      simStep(h);
    }
    for (i = bodies.length - 1; i >= 0; i--) if (bodies[i].body.position.y < -8 || !isFinite(bodies[i].body.position.y)) removeBody(bodies[i]);
    packSim();
  }
  for (i = 0; i < bodies.length; i++) {
    b = bodies[i];
    b.group.position.set(b.body.position.x, b.body.position.y, b.body.position.z);
    b.group.quaternion.set(b.body.quaternion.x, b.body.quaternion.y, b.body.quaternion.z, b.body.quaternion.w);
    var wl = surfaceAt(b.body.position.x, b.body.position.z, simT);
    for (var m = 0; m < b.mats.length; m++) b.mats[m].value = wl;
  }
}

/* ----- top view ----- */
function setTop(on) {
  if (view.busy || on === view.top) return;
  view.busy = true; view.t = 0; view.top = on;
  view.from = { x: camPos.x, y: camPos.y, z: camPos.z, pitch: pitch };
  if (on) {
    view.saved = { x: camPos.x, y: camPos.y, z: camPos.z, pitch: pitch };
    view.to = { x: camPos.x * 0.3, y: 45, z: camPos.z * 0.3 - 4, pitch: -1.5707 };
  } else {
    view.to = { x: view.saved.x, y: view.saved.y, z: view.saved.z, pitch: view.saved.pitch };
  }
  $('topview').classList.toggle('on', on);
  $('topview').textContent = on ? 'Back' : 'Top view';
  $('topview').setAttribute('aria-pressed', String(on));
  inputs.camH.disabled = on;
}
function tweenCamera(dt) {
  if (!view.busy) return;
  view.t += dt / view.dur;
  var k = Math.min(view.t, 1), e = k * k * (3 - 2 * k), f = view.from, t = view.to;
  camPos.set(f.x + (t.x - f.x) * e, f.y + (t.y - f.y) * e, f.z + (t.z - f.z) * e);
  pitch = f.pitch + (t.pitch - f.pitch) * e;
  applyCamera();
  if (k >= 1) {
    view.busy = false;
    if (!view.top) { state.camH = camPos.y; inputs.camH.value = camPos.y; outputs.camH.textContent = CFG[CFG.length - 1].fmt(camPos.y); }
  }
}
$('topview').addEventListener('click', function () { setTop(!view.top); });
window.addEventListener('keydown', function (e) {
  if (e.code === 'KeyT' && !e.repeat && !e.ctrlKey && !e.metaKey && !e.altKey) setTop(!view.top);
});

/* ----- spawn controls ----- */
(function () {
  var host = $('chips-float');
  ['crate', 'buoy', 'boat'].forEach(function (k) {
    var bt = document.createElement('button'); bt.type = 'button'; bt.className = 'chip'; bt.textContent = DEFS[k].label;
    if (!hasPhys) bt.disabled = true;
    bt.addEventListener('click', function () { addBody(k); });
    host.appendChild(bt);
  });
  var cl = document.createElement('button'); cl.type = 'button'; cl.className = 'chip'; cl.textContent = 'Clear';
  cl.addEventListener('click', clearBodies);
  host.appendChild(cl);
  if (!hasPhys) $('note').textContent = 'cannon.js did not load, so floating bodies are off. The water simulation still runs.';
})();

/* ---------- sound: synthesised with Web Audio and driven by the same wave state as the picture ---------- */
var snd = { ctx: null, on: false, wanted: true, n: null, gust: 1, gustT: 1, gustClock: 0, lap: 0, gull: 18, thunder: 22 };

function makeNoise(ctx, seconds, type) {
  var sr = ctx.sampleRate, n = Math.floor(seconds * sr), f = Math.floor(0.6 * sr);
  var buf = ctx.createBuffer(2, n, sr);
  for (var ch = 0; ch < 2; ch++) {
    var raw = new Float32Array(n + f), i, v, w;
    var b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0, last = 0;
    for (i = 0; i < n + f; i++) {
      w = Math.random() * 2 - 1;
      if (type === 'white') v = w;
      else if (type === 'pink') {
        b0 = 0.99886 * b0 + w * 0.0555179; b1 = 0.99332 * b1 + w * 0.0750759; b2 = 0.96900 * b2 + w * 0.1538520;
        b3 = 0.86650 * b3 + w * 0.3104856; b4 = 0.55000 * b4 + w * 0.5329522; b5 = -0.7616 * b5 - w * 0.0168980;
        v = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11; b6 = w * 0.115926;
      } else { last = (last + 0.02 * w) / 1.02; v = last * 3.5; }
      raw[i] = v;
    }
    var out = buf.getChannelData(ch), sum = 0;
    for (i = 0; i < n; i++) out[i] = raw[i];
    for (i = 0; i < f; i++) { var a = i / f; out[i] = raw[i] * Math.sin(a * Math.PI / 2) + raw[n + i] * Math.cos(a * Math.PI / 2); }
    for (i = 0; i < n; i++) sum += out[i] * out[i];
    var g = 0.2 / Math.sqrt(sum / n + 1e-9);
    for (i = 0; i < n; i++) out[i] *= g;
  }
  return buf;
}

function makeImpulse(ctx, secs, decay) {
  var n = Math.floor(secs * ctx.sampleRate), b = ctx.createBuffer(2, n, ctx.sampleRate);
  for (var ch = 0; ch < 2; ch++) {
    var d = b.getChannelData(ch);
    for (var i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, decay);
  }
  return b;
}

/* height of the real wave field under the camera, same formula as the vertex shader */
function heaveAt(x, z, t) {
  var h = 0, W = U.uWaves.value;
  for (var i = 0; i < W.length; i++) {
    var w = W[i], k = w.w, c = Math.sqrt(9.81 / k);
    h += w.z * Math.sin(k * (w.x * x + w.y * z - c * t) + i * 1.7);
  }
  return h;
}

function startAudio() {
  if (snd.ctx) return;
  var AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  var ctx = new AC(), n = {};
  snd.ctx = ctx; snd.n = n;
  n.master = ctx.createGain(); n.master.gain.value = 0;
  var comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -16; comp.ratio.value = 3; comp.attack.value = 0.02; comp.release.value = 0.3;
  n.master.connect(comp); comp.connect(ctx.destination);
  n.verb = ctx.createConvolver(); n.verb.buffer = makeImpulse(ctx, 2.4, 3);
  var vg = ctx.createGain(); vg.gain.value = 0.5; n.verb.connect(vg); vg.connect(n.master);
  n.pink = makeNoise(ctx, 10, 'pink'); n.brown = makeNoise(ctx, 10, 'brown'); n.white = makeNoise(ctx, 6, 'white');

  function loop(buf) { var s = ctx.createBufferSource(); s.buffer = buf; s.loop = true; s.start(0, Math.random() * buf.duration); return s; }
  function filt(type, f, q) { var b = ctx.createBiquadFilter(); b.type = type; b.frequency.value = f; b.Q.value = q; return b; }
  function chain(src, nodes, dest) { var p = src; nodes.forEach(function (x) { p.connect(x); p = x; }); p.connect(dest); }

  n.wLP = filt('lowpass', 1200, 0.4); n.wG = ctx.createGain(); n.wG.gain.value = 0;
  chain(loop(n.pink), [n.wLP, n.wG], n.master);
  n.rG = ctx.createGain(); n.rG.gain.value = 0;
  chain(loop(n.brown), [filt('lowpass', 220, 0.5), n.rG], n.master);
  n.dBP = filt('bandpass', 520, 0.6); n.dG = ctx.createGain(); n.dG.gain.value = 0;
  chain(loop(n.pink), [n.dBP, n.dG], n.master);
  n.whBP = filt('bandpass', 1100, 9); n.whG = ctx.createGain(); n.whG.gain.value = 0;
  chain(loop(n.white), [n.whBP, n.whG], n.master);
  n.hG = ctx.createGain(); n.hG.gain.value = 0;
  chain(loop(n.white), [filt('highpass', 4500, 0.5), n.hG], n.master);
}

function route(node, panV, wet) {
  var c = snd.ctx, n = snd.n, out = node;
  if (c.createStereoPanner) { var p = c.createStereoPanner(); p.pan.value = Math.max(-1, Math.min(1, panV)); node.connect(p); out = p; }
  out.connect(n.master);
  if (wet) { var w = c.createGain(); w.gain.value = wet; out.connect(w); w.connect(n.verb); }
}

function burst(buf, when, dur, freq, q, type, peak, panV, wet) {
  var c = snd.ctx, s = c.createBufferSource(); s.buffer = buf;
  var f = c.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
  var g = c.createGain();
  g.gain.setValueAtTime(0.0001, when);
  g.gain.exponentialRampToValueAtTime(peak, when + 0.006);
  g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
  s.connect(f); f.connect(g); route(g, panV, wet);
  s.start(when, Math.random() * (buf.duration - dur - 0.2)); s.stop(when + dur + 0.05);
}

function splashSound(x, z, k) {
  if (!snd.on) return;
  var c = snd.ctx, n = snd.n, t = c.currentTime + 0.01, i;
  var dx = x - camPos.x, dz = z - camPos.z, d = Math.sqrt(dx * dx + dz * dz) + 0.01;
  var gd = Math.min(1.6, k || 1) / (1 + d / 10), panV = (dx * Math.cos(yaw) - dz * Math.sin(yaw)) / d;
  /* body of the splash: noise that darkens as it dies */
  var s = c.createBufferSource(); s.buffer = n.white;
  var lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 0.7;
  lp.frequency.setValueAtTime(5000, t); lp.frequency.exponentialRampToValueAtTime(350, t + 0.5);
  var g = c.createGain();
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.7 * gd, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
  s.connect(lp); lp.connect(g); route(g, panV, 0.35); s.start(t, Math.random() * 3); s.stop(t + 0.6);
  /* low thump of the water closing */
  var o = c.createOscillator(); o.type = 'sine';
  o.frequency.setValueAtTime(240, t); o.frequency.exponentialRampToValueAtTime(62, t + 0.2);
  var og = c.createGain(); og.gain.setValueAtTime(0.0001, t); og.gain.exponentialRampToValueAtTime(0.5 * gd, t + 0.01); og.gain.exponentialRampToValueAtTime(0.0001, t + 0.26);
  o.connect(og); route(og, panV, 0.15); o.start(t); o.stop(t + 0.3);
  /* bubbles popping, each a short rising sine */
  for (i = 0; i < 7; i++) {
    var bt = t + 0.04 + Math.random() * 0.5, f0 = 500 + Math.random() * 1800;
    var b = c.createOscillator(); b.type = 'sine';
    b.frequency.setValueAtTime(f0, bt); b.frequency.exponentialRampToValueAtTime(f0 * 1.9, bt + 0.07);
    var bg = c.createGain(); bg.gain.setValueAtTime(0.0001, bt); bg.gain.exponentialRampToValueAtTime(0.1 * gd, bt + 0.008); bg.gain.exponentialRampToValueAtTime(0.0001, bt + 0.09);
    b.connect(bg); route(bg, panV + (Math.random() - 0.5) * 0.2, 0.25); b.start(bt); b.stop(bt + 0.1);
  }
  /* droplets falling back */
  for (i = 0; i < 14; i++) {
    burst(n.white, t + 0.25 + Math.random() * 1.0, 0.04, 2500 + Math.random() * 2800, 6, 'bandpass', 0.05 * gd * (0.4 + Math.random()), panV + (Math.random() - 0.5) * 0.3, 0.2);
  }
}

function gullCall() {
  var c = snd.ctx, t0 = c.currentTime + 0.05, panV = (Math.random() * 2 - 1) * 0.8;
  var calls = 2 + Math.floor(Math.random() * 3), base = 0.9 + Math.random() * 0.25;
  for (var i = 0; i < calls; i++) {
    var t = t0 + i * (0.42 + Math.random() * 0.12), f = base * (1 - i * 0.04);
    var o = c.createOscillator(); o.type = 'sawtooth';
    o.frequency.setValueAtTime(1000 * f, t);
    o.frequency.linearRampToValueAtTime(1750 * f, t + 0.1);
    o.frequency.linearRampToValueAtTime(1300 * f, t + 0.28);
    o.frequency.linearRampToValueAtTime(880 * f, t + 0.5);
    var vib = c.createOscillator(); vib.frequency.value = 38;
    var vg = c.createGain(); vg.gain.value = 40; vib.connect(vg); vg.connect(o.frequency);
    var bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 2100; bp.Q.value = 1.6;
    var lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 4200;
    var g = c.createGain();
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.09, t + 0.04);
    g.gain.setValueAtTime(0.09, t + 0.25); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.58);
    o.connect(bp); bp.connect(lp); lp.connect(g); route(g, panV, 0.55);
    o.start(t); vib.start(t); o.stop(t + 0.62); vib.stop(t + 0.62);
  }
}

function thunder() {
  var c = snd.ctx, n = snd.n, t = c.currentTime + 0.1, dur = 5.5, i;
  var s = c.createBufferSource(); s.buffer = n.brown;
  var lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 0.8;
  lp.frequency.setValueAtTime(420, t); lp.frequency.exponentialRampToValueAtTime(70, t + dur);
  var curve = new Float32Array(48), v = 0;
  for (i = 0; i < curve.length; i++) {
    var x = i / (curve.length - 1);
    v = 0.55 * v + 0.45 * Math.random();
    curve[i] = Math.min(1, Math.sin(Math.min(x * 14, Math.PI / 2))) * Math.pow(1 - x, 1.6) * (0.5 + v) * 1.3;
  }
  var g = c.createGain(); g.gain.setValueAtTime(0, t); g.gain.setValueCurveAtTime(curve, t, dur);
  s.connect(lp); lp.connect(g); route(g, (Math.random() * 2 - 1) * 0.6, 0.5);
  s.start(t, Math.random() * 4); s.stop(t + dur + 0.1);
}

function updateAudio(dt) {
  if (!snd.on || !snd.n) return;
  var c = snd.ctx, n = snd.n, t = c.currentTime;
  var hs = U.uHs.value, rough = Math.min(hs / 2.4, 1);
  var hn = Math.max(-1, Math.min(1, heaveAt(camPos.x, camPos.z, simT) / (0.45 * hs + 0.05)));
  var crest = Math.pow(Math.max(0, hn * 0.5 + 0.5), 2.2);
  var alt = 1 / (1 + Math.max(0, camPos.y - 1.5) / 18);
  var windK = Math.min(1, 0.2 + 0.5 * rough + 0.3 * state.cover);

  snd.gustClock -= dt;
  if (snd.gustClock <= 0) { snd.gustClock = 2 + Math.random() * 3; snd.gustT = 0.6 + Math.random() * 0.7; }
  snd.gust += (snd.gustT - snd.gust) * (1 - Math.exp(-dt * 0.7));

  n.wG.gain.setTargetAtTime((0.05 + 0.5 * rough) * (0.25 + crest) * (0.55 + 0.45 * alt), t, 0.12);
  n.wLP.frequency.setTargetAtTime(500 + 3200 * crest * (0.4 + rough), t, 0.12);
  n.rG.gain.setTargetAtTime((0.05 + 0.4 * rough) * (0.4 + 0.9 * crest), t, 0.2);
  n.dG.gain.setTargetAtTime((0.03 + 0.3 * windK) * snd.gust * (0.6 + 0.8 * (1 - alt)), t, 0.3);
  n.dBP.frequency.setTargetAtTime(380 + 520 * windK * snd.gust, t, 0.3);
  n.whG.gain.setTargetAtTime(Math.max(0, windK - 0.6) * 0.06 * snd.gust, t, 0.4);
  n.whBP.frequency.setTargetAtTime(900 + 700 * snd.gust, t, 0.5);
  n.hG.gain.setTargetAtTime(0.035 * state.spray * U.uFoamAmt.value * (0.3 + crest), t, 0.2);

  /* small laps against the camera: more of them when the sea is choppy and the camera is low */
  snd.lap += dt * (1.2 + 7 * rough * Math.min(state.chop, 1.2)) * (0.4 + 0.6 * alt);
  while (snd.lap >= 1) {
    snd.lap -= 1;
    var r = Math.random();
    burst(n.white, t + Math.random() * 0.05, 0.07 + r * 0.18, 900 + r * 2400, 2 + r * 4, 'bandpass',
      0.03 + 0.06 * Math.random() * (0.5 + rough), (Math.random() * 2 - 1) * 0.8, 0.1);
  }

  snd.gull -= dt;
  if (snd.gull <= 0) { snd.gull = 20 + Math.random() * 35; if (hs < 1.8 && state.sun > 2 && state.cover < 0.7) gullCall(); }
  snd.thunder -= dt;
  if (snd.thunder <= 0) { snd.thunder = 16 + Math.random() * 30; if (state.cover > 0.75 && hs > 1.0) thunder(); }
}

function applyVolume() {
  if (snd.n) snd.n.master.gain.setTargetAtTime(snd.on ? state.volume : 0, snd.ctx.currentTime, 0.25);
}
function setSound(on) {
  snd.wanted = on;
  if (on) { startAudio(); if (snd.ctx && snd.ctx.resume) snd.ctx.resume(); }
  snd.on = on && !!snd.ctx;
  applyVolume();
  var b = $('sound'); b.textContent = snd.on ? 'Sound on' : 'Sound off'; b.classList.toggle('on', snd.on);
}
$('sound').addEventListener('click', function () { setSound(!snd.on); });
function firstGesture(e) {
  if (e.target && e.target.id === 'sound') return;
  window.removeEventListener('pointerdown', firstGesture);
  window.removeEventListener('keydown', firstGesture);
  if (snd.wanted && !snd.ctx) setSound(true);
}
window.addEventListener('pointerdown', firstGesture);
window.addEventListener('keydown', firstGesture);
document.addEventListener('visibilitychange', function () {
  if (!snd.ctx) return;
  if (document.hidden) snd.ctx.suspend(); else if (snd.on) snd.ctx.resume();
});

/* ---------- keyboard: WASD fly ---------- */
var keys = {};
var MOVE_KEYS = { KeyW: 1, KeyA: 1, KeyS: 1, KeyD: 1, KeyQ: 1, KeyE: 1, ShiftLeft: 1, ShiftRight: 1, ArrowUp: 1, ArrowDown: 1, ArrowLeft: 1, ArrowRight: 1 };
window.addEventListener('keydown', function (e) {
  if (!MOVE_KEYS[e.code] || e.ctrlKey || e.metaKey || e.altKey) return;
  keys[e.code] = true;
  if (e.code.indexOf('Key') === 0 || e.code.indexOf('Arrow') === 0) e.preventDefault();
});
window.addEventListener('keyup', function (e) { keys[e.code] = false; });
window.addEventListener('blur', function () { keys = {}; });

function moveCamera(dt) {
  var f = (keys.KeyW ? 1 : 0) - (keys.KeyS ? 1 : 0);
  var s = (keys.KeyD ? 1 : 0) - (keys.KeyA ? 1 : 0);
  var v = (keys.KeyE ? 1 : 0) - (keys.KeyQ ? 1 : 0);
  if ((!f && !s && !v) || view.busy) return;
  var sp = ((keys.ShiftLeft || keys.ShiftRight) ? 22 : 7) * dt;
  var cp = Math.cos(pitch), sy = Math.sin(yaw), cy = Math.cos(yaw);
  if (view.top) {
    var ps = camPos.y * 0.5 * ((keys.ShiftLeft || keys.ShiftRight) ? 2.2 : 1) * dt;
    camPos.x += (-sy * f + cy * s) * ps;
    camPos.z += (-cy * f - sy * s) * ps;
    camPos.y = Math.max(12, Math.min(220, camPos.y * (1 + v * 0.9 * dt)));
    applyCamera();
    return;
  }
  camPos.x += (-sy * cp * f + cy * s) * sp;
  camPos.y += (Math.sin(pitch) * f + v) * sp;
  camPos.z += (-cy * cp * f - sy * s) * sp;
  camPos.y = Math.max(1.2, Math.min(60, camPos.y));
  state.camH = camPos.y;
  inputs.camH.value = state.camH;
  outputs.camH.textContent = CFG[CFG.length - 1].fmt(state.camH);
  applyCamera();
}

/* ---------- sizing and loop ---------- */
var pr = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2);
function resize() {
  renderer.setPixelRatio(pr);
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.fov = camera.aspect < 0.8 ? 72 : 58;
  SU.uPxScale.value = (renderer.domElement.height * 0.5) / Math.tan(camera.fov * Math.PI / 360);
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);

var last = performance.now(), fpsEma = 60, lowFor = 0, readT = 0, diagFrames = 0;
function frame(now) {
  var dt = Math.min((now - last) / 1000, 0.1); last = now;
  tweenCamera(dt);
  moveCamera(dt);
  collideCamera();
  updateAudio(dt);
  if (!paused) simT += dt;
  U.uTime.value = simT;
  stepPhysics(dt);

  sky.position.copy(camera.position);
  water.position.set(camera.position.x, 0, camera.position.z);
  renderer.render(scene, camera);
  if (diagFrames < 4 && ++diagFrames === 4) {
    try {
      var msg = '';
      (renderer.info.programs || []).forEach(function (pg) {
        var dg = pg.diagnostics;
        if (dg && dg.runnable === false) {
          msg += 'Shader failed to build:\n' + (dg.programLog || '') + '\n' + (dg.vertexShader && dg.vertexShader.log || '') + '\n' + (dg.fragmentShader && dg.fragmentShader.log || '') + '\n';
        }
      });
      if (renderer.getContext().isContextLost()) msg += 'The graphics context was lost (the GPU gave up on a frame).\n';
      if (msg) { $('diag').textContent = msg.slice(0, 1800); $('diag').hidden = false; }
    } catch (x) {}
  }

  if (dt > 0) fpsEma += (1 / dt - fpsEma) * 0.05;
  readT += dt;
  if (readT > 1) {
    readT = 0;
    $('rd-f').innerHTML = '<b>' + Math.round(fpsEma) + '</b> fps';
    $('rd-p').innerHTML = '<b>' + bodies.length + '</b> bodies';
    lowFor = fpsEma < 32 ? lowFor + 1 : 0;
    if (lowFor >= 2 && pr > 0.7) { pr = Math.max(0.7, pr * 0.85); lowFor = 0; resize(); }
  }
  requestAnimationFrame(frame);
}

/* ---------- debug hook: add ?debug to the URL. Used by tests/smoke.mjs and for poking at the sim from the console ---------- */
if (/[?&]debug/.test(location.search)) {
  window.__ow = {
    view: view, camPos: camPos, bodies: bodies, pworld: pworld, simH: simH, simF: simF,
    surfaceAt: surfaceAt, simKick: simKick, setTop: setTop, addBody: addBody, clearBodies: clearBodies,
    get simT() { return simT; }, get pitch() { return pitch; }, get yaw() { return yaw; },
    setKeys: function (k) { keys = k; },
    pause: function (v) { paused = v; },
    /* step the simulation n fixed frames without rendering; works while paused */
    adv: function (n) { var p = paused; paused = false; for (var i = 0; i < n; i++) { simT += 1 / 60; U.uTime.value = simT; stepPhysics(1 / 60); } paused = p; }
  };
}

/* ---------- start ---------- */
applyWaves(); applySun(); applyCamera(); resize(); refresh();
requestAnimationFrame(frame);
})();
