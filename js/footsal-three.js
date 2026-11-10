// Loads Three.js (an ES module since r160, resolved through the page's import map: a CDN on the website,
// www/vendor/three in the Android app), hands it to the game as the global THREE it was written against,
// with the three add-ons it uses attached, then runs the game scripts in order.
import * as T from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';

window.THREE = Object.assign({}, T, { GLTFLoader, HDRLoader, SkeletonUtils });

// the game scripts sit next to this file and share its ?v= cache key
const here = new URL(import.meta.url);
const run = name => new Promise((ok, fail) => {
  const s = document.createElement('script');
  s.src = new URL(name + here.search, here).href;
  s.onload = ok; s.onerror = () => fail(new Error('could not load ' + name));
  document.body.appendChild(s);
});
run('footsal-radial.js').then(() => run('footsal.js')).catch(e => {
  console.error(e);
  const f = document.getElementById('fail');
  if (f) { f.textContent = 'The game could not load. Check your connection and reload.'; f.hidden = false; }
});
