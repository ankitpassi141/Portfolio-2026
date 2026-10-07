// Film pipeline for the Sunflower page: diffusion bloom → one "uber" pass (tone map, grade, halation, fringe, vignette, grain).
//
//   RenderPass (HDR, half-float, no tone mapping)
//     → UnrealBloomPass   half-res base + its own mip chain = cheap, wide, soft diffusion (Pro-Mist look)
//     → FilmPass (below)  ONE full-screen pass for everything else
//
// Tweak at runtime through pipeline.params (bloomIntensity, grainAmount, grainSpeed, liftedBlacks, …) or pipeline.setLevel().
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

const FilmShader = {
  name: 'FilmShader',
  uniforms: {
    tDiffuse: { value: null },
    uRes: { value: new THREE.Vector2(1, 1) },
    uExposure: { value: 0.5 },
    uLift: { value: 0.035 },         // raised black point (matte charcoal shadows)
    uContrast: { value: 0.35 },      // soft S-curve amount
    uHalation: { value: 0.35 },      // warm red glow bleeding around highlights
    uFringe: { value: 0.0025 },      // radial chromatic fringing at the edges
    uVignette: { value: 0.28 },
    uGrain: { value: 0.05 },         // amplitude, display space
    uGrainSize: { value: 1.4 },      // grain pixel size in device px
    uFrame: { value: 0 },            // changes only at grainSpeed fps
  },
  vertexShader: /* glsl */`
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: /* glsl */`
    uniform sampler2D tDiffuse;
    uniform vec2 uRes;
    uniform float uExposure, uLift, uContrast, uHalation, uFringe, uVignette, uGrain, uGrainSize, uFrame;
    varying vec2 vUv;

    float luma(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }
    // Narkowicz ACES fit
    vec3 aces(vec3 x) { return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0); }
    float hash(vec3 p) { p = fract(p * vec3(0.1031, 0.1030, 0.0973)); p += dot(p, p.yxz + 33.33); return fract((p.x + p.y) * p.z); }

    void main() {
      vec2 d = vUv - 0.5;
      float r2 = dot(d * vec2(uRes.x / uRes.y, 1.0), d * vec2(uRes.x / uRes.y, 1.0));

      // chromatic fringing: red and blue sampled slightly apart, more toward the edges
      vec2 off = d * uFringe * (0.3 + r2 * 4.0);
      vec3 col = vec3(texture2D(tDiffuse, vUv + off).r, texture2D(tDiffuse, vUv).g, texture2D(tDiffuse, vUv - off).b);

      // halation: six taps around the pixel; only what is brighter than ~0.9 after exposure leaks, tinted red-orange
      if (uHalation > 0.0) {
        vec3 h = vec3(0.0); vec2 px = 7.0 / uRes;
        for (int i = 0; i < 6; i++) {
          float a = float(i) * 1.0472;
          vec3 s = texture2D(tDiffuse, vUv + vec2(cos(a), sin(a)) * px).rgb * uExposure;
          h += s * max(luma(s) - 0.9, 0.0);
        }
        col += (h / 6.0) * vec3(1.0, 0.38, 0.14) * uHalation / uExposure;
      }

      // tone map (exposure first so highlights roll off instead of clipping)
      col = aces(col * uExposure);

      // grade: cool-neutral mids, warm highlights, soft S-curve, lifted charcoal blacks
      float l = luma(col);
      col *= mix(vec3(0.97, 1.0, 1.035), vec3(1.045, 1.0, 0.93), smoothstep(0.45, 0.95, l));
      col = mix(col, col * col * (3.0 - 2.0 * col), uContrast);
      col = col * (1.0 - uLift) + uLift * vec3(0.93, 0.95, 1.0);

      gl_FragColor = linearToOutputTexel(vec4(col, 1.0));      // to sRGB, then the display-space finishing touches

      // vignette
      gl_FragColor.rgb *= 1.0 - uVignette * smoothstep(0.12, 0.62, r2);

      // grain: monochrome, blocky at uGrainSize, strongest in the midtones, re-seeded at grainSpeed fps
      vec2 g = floor(gl_FragCoord.xy / uGrainSize);
      float n = hash(vec3(g, uFrame)) + hash(vec3(g + 17.0, uFrame + 3.0)) - 1.0;      // triangular noise, no DC offset
      float ld = luma(gl_FragColor.rgb);
      gl_FragColor.rgb += n * uGrain * (0.35 + 0.65 * (1.0 - abs(ld * 2.0 - 1.0)));
    }`,
};

export const LEVELS = ['off', 'low', 'high'];

export function createFilmPipeline(renderer, scene, camera, { level = 'high', maxPixelRatio = 2 } = {}) {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const params = {
    bloomIntensity: 0.18, bloomRadius: 0.95, bloomThreshold: 0.8,   // threshold is in post-exposure units
    grainAmount: 0.022, grainSpeed: 18,                              // grainSpeed in fps; 0 or reduced-motion freezes it
    liftedBlacks: 0.035, contrast: 0.2, halation: 0.35, fringe: 0.0025, vignette: 0.14,
  };
  const size = new THREE.Vector2();
  renderer.getSize(size);
  const composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 4 }));
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(size.x / 2, size.y / 2), params.bloomIntensity, params.bloomRadius, 1);
  composer.addPass(bloom);
  const film = new ShaderPass(FilmShader);
  composer.addPass(film);

  let pr = Math.min(devicePixelRatio, maxPixelRatio), prMax = pr, cur = level, frameMs = 16, slow = 0;
  const api = {
    params, composer, get level() { return cur; },
    get enabled() { return cur !== 'off'; },
    setLevel(l) {
      cur = l;
      bloom.enabled = l !== 'off';
      if (l === 'off') { renderer.toneMapping = THREE.ACESFilmicToneMapping; return; }
      renderer.toneMapping = THREE.NoToneMapping;               // the film pass does the tone mapping
      bloom.resolution.set(size.x / (l === 'low' ? 4 : 2), size.y / (l === 'low' ? 4 : 2));
      api.resize(size.x, size.y);
    },
    resize(w, h) {
      size.set(w, h);
      composer.setPixelRatio(pr); composer.setSize(w, h);
      bloom.resolution.set(w / (cur === 'low' ? 4 : 2), h / (cur === 'low' ? 4 : 2));
    },
    // call once per frame instead of renderer.render()
    render(t, exposure) {
      const hi = cur === 'high', u = film.uniforms;
      bloom.strength = params.bloomIntensity * (hi ? 1 : 0.8);
      bloom.radius = params.bloomRadius;
      bloom.threshold = params.bloomThreshold / Math.max(exposure, 0.05);   // bloom sees un-exposed HDR
      u.uExposure.value = exposure;
      u.uRes.value.set(size.x * pr, size.y * pr);
      u.uLift.value = params.liftedBlacks; u.uContrast.value = params.contrast; u.uVignette.value = params.vignette;
      u.uHalation.value = hi ? params.halation : 0; u.uFringe.value = hi ? params.fringe : 0;
      u.uGrain.value = params.grainAmount; u.uGrainSize.value = Math.max(1, 1.4 * pr);
      u.uFrame.value = (reduceMotion || !params.grainSpeed) ? 0 : Math.floor(t * 0.001 * params.grainSpeed);
      composer.render();
      // dynamic resolution: if frames stay slow, shed pixels (down to 0.6×), recover slowly when fast again
      frameMs += (Math.min(t - (api._t || t), 100) - frameMs) * 0.05; api._t = t;
      if (frameMs > 28) slow++; else if (frameMs < 18) slow--; else slow = 0;
      if (slow > 90 && pr > prMax * 0.6) { pr = Math.max(prMax * 0.6, pr - 0.15); slow = 0; api.resize(size.x, size.y); }
      else if (slow < -300 && pr < prMax) { pr = Math.min(prMax, pr + 0.15); slow = 0; api.resize(size.x, size.y); }
    },
  };
  api.setLevel(cur);
  return api;
}
