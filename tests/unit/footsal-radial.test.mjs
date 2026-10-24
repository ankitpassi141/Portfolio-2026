// Unit tests for js/footsal-radial.js (the radial order menu's pure functions).
// Run: cd tests && npm run test:unit
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const R = require('../../js/footsal-radial.js');

const deg = d => d * Math.PI / 180;
// a 390x844 phone: 8 px side gutters, HUD bands above 150 px and below 760 px
const W = 390, H = 844;
const SAFE = { left: 8, right: W - 8, top: 150, bottom: 760 };
const inside = (box, safe, eps = 0.5) =>
  box.left >= safe.left - eps && box.right <= safe.right + eps && box.top >= safe.top - eps && box.bottom <= safe.bottom + eps;
const placed = (pos, safe) => { const a = R.fanAngle(pos, safe); const c = R.fanCentre(pos, a, safe); return { a, c, box: R.fanBox(c, a) }; };

test('fanAngle: defenders on both touchlines keep the fan on screen', () => {
  for (const pos of [{ x: 14, y: 450 }, { x: W - 14, y: 450 }, { x: 0, y: 450 }, { x: W, y: 450 }]) {
    const { box } = placed(pos, SAFE);
    assert.ok(inside(box, SAFE), `fan off screen for ${JSON.stringify(pos)}: ${JSON.stringify(box)}`);
  }
});

test('fanAngle: all four corners keep the fan on screen', () => {
  const corners = [{ x: SAFE.left, y: SAFE.top }, { x: SAFE.right, y: SAFE.top }, { x: SAFE.left, y: SAFE.bottom }, { x: SAFE.right, y: SAFE.bottom },
                   { x: 30, y: 170 }, { x: W - 30, y: 170 }, { x: 30, y: 740 }, { x: W - 30, y: 740 }];
  for (const pos of corners) {
    const { box } = placed(pos, SAFE);
    assert.ok(inside(box, SAFE), `fan off screen for ${JSON.stringify(pos)}: ${JSON.stringify(box)}`);
  }
});

test('fanAngle: defenders under the top and bottom HUD bands still get an on-screen fan', () => {
  for (const pos of [{ x: W / 2, y: 60 }, { x: 20, y: 40 }, { x: W / 2, y: 820 }, { x: W - 20, y: 830 }]) {
    const { box } = placed(pos, SAFE);
    assert.ok(inside(box, SAFE), `fan under the HUD for ${JSON.stringify(pos)}: ${JSON.stringify(box)}`);
  }
});

test('fanAngle: faces away from a cramped edge, and prefers up when there is room everywhere', () => {
  assert.equal(R.fanAngle({ x: W / 2, y: 450 }, SAFE), deg(-90), 'open middle -> up');
  const nearTop = R.fanAngle({ x: W / 2, y: SAFE.top + 20 }, SAFE);
  assert.ok(Math.sin(nearTop) > 0, 'near the top band the fan opens downward');
  const nearLeft = R.fanAngle({ x: 14, y: 450 }, SAFE);
  assert.ok(Math.cos(nearLeft) > 0, 'at the left touchline the fan opens to the right');
  const nearRight = R.fanAngle({ x: W - 14, y: 450 }, SAFE);
  assert.ok(Math.cos(nearRight) < 0, 'at the right touchline the fan opens to the left');
});

test('fanAngle: a defender with room needs no nudge (fan stays on the defender)', () => {
  const pos = { x: W / 2, y: 450 }, a = R.fanAngle(pos, SAFE), c = R.fanCentre(pos, a, SAFE);
  assert.deepEqual(c, pos);
});

test('wedgeAt: wedge boundaries (fan pointing up)', () => {
  const c = { x: 200, y: 400 }, up = deg(-90);
  const at = (relDeg, r = R.RING) => { const a = up + deg(relDeg); return R.wedgeAt({ x: c.x + Math.cos(a) * r, y: c.y + Math.sin(a) * r }, c, up); };
  assert.equal(at(-90), 'zone', 'left edge of the fan');
  assert.equal(at(-31), 'zone');
  assert.equal(at(-30), 'press', '-30° belongs to press');
  assert.equal(at(0), 'press');
  assert.equal(at(30), 'press', '+30° belongs to press');
  assert.equal(at(31), 'mark');
  assert.equal(at(90), 'mark', 'right edge of the fan');
  assert.equal(at(91), null, 'just behind the fan');
  assert.equal(at(180), null, 'behind the defender');
});

test('wedgeAt: dead zone and outer edge', () => {
  const c = { x: 200, y: 400 }, up = deg(-90);
  const atR = r => R.wedgeAt({ x: c.x, y: c.y - r }, c, up);
  assert.equal(atR(0), null);
  assert.equal(atR(23.9), null, 'inside the 24 px dead zone');
  assert.equal(atR(24), 'press', 'dead zone edge');
  assert.equal(atR(R.OUTER), 'press', 'outer edge still hits');
  assert.equal(atR(R.OUTER + 0.1), null, 'beyond the fan');
});

test('wedgeAt: works for any fan direction (fan pointing right)', () => {
  const c = { x: 50, y: 400 }, right = 0;
  assert.equal(R.wedgeAt({ x: c.x + 64, y: c.y }, c, right), 'press');
  assert.equal(R.wedgeAt({ x: c.x, y: c.y - 64 }, c, right), 'zone');
  assert.equal(R.wedgeAt({ x: c.x, y: c.y + 64 }, c, right), 'mark');
  assert.equal(R.wedgeAt({ x: c.x - 64, y: c.y }, c, right), null);
});

test('wedges are at least 48 px wide at the button radius', () => {
  assert.ok(R.RING * R.SPAN >= 48, `arc width ${R.RING * R.SPAN}`);
  for (const w of R.WEDGES) {
    const p = R.wedgeCentre({ x: 0, y: 0 }, deg(-90), w);
    assert.equal(R.wedgeAt(p, { x: 0, y: 0 }, deg(-90)), w, `wedgeCentre(${w}) lands in ${w}`);
  }
});

test('markReach: same output when real attacker positions change but circles do not', () => {
  const circles = [{ x: 0.5, y: 0.42 }, { x: 0.2, y: 0.9 }, { x: 0.8, y: 0.62 }];
  const def = { x: 0.48, y: 0.3 };
  const attackers = [{ x: 0.52, y: 0.45 }, { x: 0.25, y: 0.85 }, { x: 0.75, y: 0.6 }];
  const before = R.markReach(def, circles, 0.13, 0.28);
  attackers.forEach(a => { a.x = 1 - a.x; a.y += 0.3; }); // the real attackers move; the circles do not
  const after = R.markReach(def, circles, 0.13, 0.28);
  assert.deepEqual(after, before);
  assert.equal(R.markReach.length, 4, 'takes defender, circles, speed, react (horizon/gap optional) and nothing else');
});

test('markReach: reach vs late from the goal-side mark point', () => {
  const speed = 0.13, react = 0.28, r = R.reachRadius(speed, react); // 0.1196 units
  const def = { x: 0.5, y: 0.3 };
  const near = { x: 0.5, y: 0.3 + 0.055 + r - 0.01 };   // its mark point is just inside the reach
  const far = { x: 0.5, y: 0.3 + 0.055 + r + 0.01 };    // just outside
  assert.deepEqual(R.markReach(def, [near, far], speed, react), ['reach', 'late']);
  const m = R.markPoint({ x: 0.5, y: 1 });
  assert.ok(Math.abs(m.y - (1 - 0.055)) < 1e-9 && m.x === 0.5, 'mark point is 0.055 goal-side');
  assert.deepEqual(R.markReach(def, [near], speed, react, 0.2), ['late'], 'a horizon shorter than the reaction reaches nothing');
});

test('markedBy: circle index -> defender numbers, double marking allowed', () => {
  const orders = [{ t: 'keep' }, { t: 'mark', k: 2 }, { t: 'zone' }, { t: 'mark', k: 2 }, { t: 'mark', k: 0 }, { t: 'press' }];
  assert.deepEqual(R.markedBy(orders), { 2: [2, 4], 0: [5] });
  assert.deepEqual(R.markedBy([]), {});
});
