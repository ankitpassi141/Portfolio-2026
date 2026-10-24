/* FootSal radial order menu: the pure geometry and rules behind the defender's order menu and Mark mode.
   No DOM, no three.js, no game state, so the game (window.FootSalRadial) and the unit tests
   (tests/unit/footsal-radial.test.mjs, via module.exports) use the same code.
   Screen values are CSS pixels; pitch values are FootSal game units (x 0..1 across, y 0..1.5 along,
   y = 0 is the goal the defenders guard). */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.FootSalRadial = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  // fan: a 180° half-ring of three 60° wedges around the defender. Inside DEAD is the centre (cancel);
  // the wedge buttons sit at RING; the hit area ends at OUTER. At RING each wedge is 64·π/3 ≈ 67 px wide.
  const DEAD = 24, RING = 64, OUTER = 104, SPAN = Math.PI / 3;
  const WEDGES = ['zone', 'press', 'mark'];
  // candidate fan directions (screen angles, y down), in tie-break order: up first, then up-ish, then the rest
  const D = Math.PI / 4;
  const DIRS = [-2 * D, -3 * D, -D, 4 * D, 0, 3 * D, D, 2 * D];
  const GOAL = { x: 0.5, y: 0 };

  const wrap = a => { while (a > Math.PI) a -= 2 * Math.PI; while (a <= -Math.PI) a += 2 * Math.PI; return a; };

  // points on the fan's outline: its centre plus the outer arc, sampled every 15°
  function fanPoints(c, angle) {
    const pts = [{ x: c.x, y: c.y }];
    for (let k = 0; k <= 12; k++) {
      const a = angle - Math.PI / 2 + Math.PI * k / 12;
      pts.push({ x: c.x + Math.cos(a) * OUTER, y: c.y + Math.sin(a) * OUTER });
    }
    return pts;
  }
  function fanBox(c, angle) {
    const p = fanPoints(c, angle);
    return { left: Math.min(...p.map(q => q.x)), right: Math.max(...p.map(q => q.x)),
             top: Math.min(...p.map(q => q.y)), bottom: Math.max(...p.map(q => q.y)) };
  }
  // smallest distance from any fan point to the safe rect's edges (negative = sticks out)
  function clearance(c, angle, safe) {
    return Math.min(...fanPoints(c, angle).map(p => Math.min(p.x - safe.left, safe.right - p.x, p.y - safe.top, safe.bottom - p.y)));
  }

  // fanAngle(screenPos, safeRect): of 8 directions, the one whose fan keeps the most clearance from the
  // screen edges and HUD bands (safeRect is the area between them). Ties within half a pixel keep the
  // earlier candidate, so up wins ties.
  function fanAngle(pos, safe) {
    let best = DIRS[0], bv = -Infinity;
    for (const a of DIRS) { const v = clearance(pos, a, safe); if (v > bv + 0.5) { bv = v; best = a; } }
    return best;
  }
  // where to draw the fan: on the defender, nudged just enough to stay fully inside safeRect (only needed
  // when a defender sits right in a corner or under a HUD band)
  function fanCentre(pos, angle, safe) {
    const b = fanBox(pos, angle);
    const dx = Math.max(0, safe.left - b.left) - Math.max(0, b.right - safe.right);
    const dy = Math.max(0, safe.top - b.top) - Math.max(0, b.bottom - safe.bottom);
    return { x: pos.x + dx, y: pos.y + dy };
  }

  // wedgeAt(pointer, centre, fanAngle): 'zone' | 'press' | 'mark' | null. null inside the 24 px dead zone,
  // beyond OUTER, or behind the fan. Boundaries: relative angle in [-90°, -30°) is zone, [-30°, +30°] press,
  // (+30°, +90°] mark.
  function wedgeAt(p, c, angle) {
    const dx = p.x - c.x, dy = p.y - c.y, d = Math.hypot(dx, dy);
    if (d < DEAD || d > OUTER) return null;
    const rel = wrap(Math.atan2(dy, dx) - angle), eps = 1e-9;
    if (Math.abs(rel) > Math.PI / 2 + eps) return null;
    if (rel < -SPAN / 2 - eps) return 'zone';
    if (rel <= SPAN / 2 + eps) return 'press';
    return 'mark';
  }
  // centre of a wedge's button, for laying out the menu
  function wedgeCentre(c, angle, name) {
    const a = angle + (WEDGES.indexOf(name) - 1) * SPAN;
    return { x: c.x + Math.cos(a) * RING, y: c.y + Math.sin(a) * RING, a };
  }

  // the goal-side point a marker heads for: MARK_GAP (0.055) from the circle centre toward the goal
  function markPoint(c, gap = 0.055) {
    const gx = GOAL.x - c.x, gy = GOAL.y - c.y, l = Math.hypot(gx, gy) || 1;
    return { x: c.x + gx / l * gap, y: c.y + gy / l * gap };
  }
  // markReach(defenderPos, circles, speed, react, horizon = 1.2): 'reach' | 'late' per circle. Uses only the
  // fuzzy circle centres and the defender's spot, never real attacker positions: can the defender cover the
  // distance to the circle's mark point in the time left after reacting?
  function markReach(def, circles, speed, react, horizon = 1.2, gap = 0.055) {
    const r = reachRadius(speed, react, horizon);
    return circles.map(c => { const m = markPoint(c, gap); return Math.hypot(m.x - def.x, m.y - def.y) <= r ? 'reach' : 'late'; });
  }
  const reachRadius = (speed, react, horizon = 1.2) => speed * Math.max(0, horizon - react);
  // markedBy(orders): circle index -> defender numbers (1-based) already marking it
  function markedBy(orders) {
    const out = {};
    (orders || []).forEach((o, i) => { if (o && o.t === 'mark' && o.k != null) (out[o.k] = out[o.k] || []).push(i + 1); });
    return out;
  }

  return { DEAD, RING, OUTER, SPAN, WEDGES, DIRS, fanPoints, fanBox, fanAngle, fanCentre, wedgeAt, wedgeCentre,
           markPoint, markReach, reachRadius, markedBy };
});
