// FootSal defender order menu, driven with real touch input (CDP touch events) on a 390x844 phone.
import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const SHOTS = new URL('../artifacts/', import.meta.url);
mkdirSync(SHOTS, { recursive: true });

// Starts a single-player match where the human defends, places defender #4 and #5, and stops in the
// defender's Phase 2 (planD) with the top-down camera settled. `place` overrides kickoff spots by index.
async function toDefencePlan(page, place = {}) {
  await page.goto('/footsal.html?debug');
  await page.waitForFunction(() => window.__fs && window.FootSalRadial);
  await page.evaluate(async (place) => {
    const w = ms => new Promise(r => setTimeout(r, ms)), F = window.__fs;
    document.querySelector('#enter').click();
    F.SET.t1 = 30; F.SET.t2 = 30;                       // the clock keeps running; give the test room
    F.newGame('bot', ['Saffron City', 'Granite Town'], 5);
    await w(50);
    const S = F.S; S.attacker = 1; F.startAttack(); await w(50);   // CPU attacks, human defends
    Object.assign(S.def, { 3: { x: .62, y: .38 }, 4: { x: .35, y: .62 } });
    for (const [i, p] of Object.entries(place)) S.def[i] = p;
    document.querySelector('#go').click(); await w(80);  // lock positions -> CPU plans -> our planD
  }, place);
  await expect.poll(() => page.evaluate(() => window.__fs.S.phase)).toBe('planD');
  await page.waitForTimeout(1700);                      // camera blend (1.4 s) into the top-down view
  await page.evaluate(() => { document.querySelector('#cut').innerHTML = ''; });
  const banner = page.getByRole('button', { name: 'Reject' });
  if (await banner.isVisible().catch(() => false)) await banner.click();
}

async function touch(page) {
  const cdp = await page.context().newCDPSession(page);
  const send = (type, p) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: p ? [{ x: p.x, y: p.y, id: 1 }] : [] });
  const api = {
    start: p => send('touchStart', p),
    move: p => send('touchMove', p),
    end: () => send('touchEnd'),
    async tap(p) { await api.start(p); await api.end(); },
    async slide(a, b, steps = 6) { for (let k = 1; k <= steps; k++) await api.move({ x: a.x + (b.x - a.x) * k / steps, y: a.y + (b.y - a.y) * k / steps }); },
  };
  return api;
}
const at = (page, fn, arg) => page.evaluate(fn, arg);
const defScreen = (page, i) => at(page, i => window.__fs.screenOf(window.__fs.planPos()[i]), i);
const orders = page => at(page, () => JSON.stringify(window.__fs.S.orders));
const uiState = page => at(page, () => window.__fs.ui.state);

let errors;
test.beforeEach(async ({ page }) => {
  errors = [];
  // these tests start past the first-launch tutorial (tests/e2e/footsal-tutorial.spec.mjs covers it)
  await page.addInitScript(() => localStorage.setItem('footsal.tips.v1', JSON.stringify({ intro: true, seen: { win: 1, turns: 1, phases: 1, setup: 1, circles: 1, attack: 1, orders: 1, kickoff: 1, lostBall: 1 } })));
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
});
test.afterEach(() => { expect(errors, errors.join('\n')).toEqual([]); });

test('a tap on a defender opens the order menu', async ({ page }) => {
  await toDefencePlan(page);
  const t = await touch(page), d4 = await defScreen(page, 3);
  await t.tap(d4);
  expect(await uiState(page)).toBe('menuOpen');
  await expect(page.locator('#radial')).toBeVisible();
  await expect(page.locator('#radial .rd-btn')).toHaveCount(3);
  await expect(page.locator('#radial .rd-cap')).toContainText('#4');
});

test('an 8+ px drag repositions the defender without opening the menu', async ({ page }) => {
  await toDefencePlan(page);
  const t = await touch(page), d5 = await defScreen(page, 4), before = await orders(page);
  const p0 = await at(page, () => window.__fs.planPos()[4]);
  // record when the page actually receives the touch, to tell slow test rendering from a real bug
  await at(page, () => { window.__pt = []; const cv = document.querySelector('#gl');
    ['pointerdown', 'pointermove'].forEach(t => cv.addEventListener(t, () => window.__pt.push([t, performance.now()]), true)); });
  // queue the press and the first move together: headless software WebGL takes ~1 s per touch round
  // trip, which would otherwise look like a finger held still past the 450 ms hold-to-open
  await Promise.all([t.start(d5), t.move({ x: d5.x + 12, y: d5.y })]);   // past 8 px at once: a drag
  await t.slide({ x: d5.x + 12, y: d5.y }, { x: d5.x + 45, y: d5.y + 30 });
  const gap = await at(page, () => { const d = window.__pt.find(e => e[0] === 'pointerdown'), m = window.__pt.find(e => e[0] === 'pointermove'); return d && m ? Math.round(m[1] - d[1]) : -1; });
  console.log(`press -> first move: ${gap} ms`);
  expect(await uiState(page)).toBe('dragging');
  await t.end();
  const p1 = await at(page, () => window.__fs.planPos()[4]);
  expect(Math.hypot(p1.x - p0.x, p1.y - p0.y)).toBeGreaterThan(0.02);
  expect(await uiState(page)).toBe('idle');
  await expect(page.locator('#radial')).toBeHidden();
  expect(await orders(page)).toBe(before);
});

test('the slide gesture sets a Mark on the intended attacker', async ({ page }) => {
  await toDefencePlan(page);
  const t = await touch(page), d4 = await defScreen(page, 3);
  // aim for the marker farthest from the defender, so the release can't land on the defender itself
  const k = await at(page, () => { const F = window.__fs, me = F.planPos()[3];
    let best = 0, bd = -1; F.S.fuzzA.forEach((c, j) => { const d = Math.hypot(c.x - me.x, c.y - me.y); if (d > bd) { bd = d; best = j; } }); return best; });
  await t.start(d4);
  // hold still: the menu opens under the finger (450 ms, later on a slow renderer)
  await expect.poll(() => uiState(page), { timeout: 8000 }).toBe('menuOpen');
  const mark = await at(page, () => window.__fs.wedgeScreen('mark'));
  await t.slide(d4, mark);
  await page.waitForTimeout(300);                          // rest on Mark: Mark mode starts
  expect(await uiState(page)).toBe('markPick');
  const target = await at(page, k => window.__fs.screenOf(window.__fs.S.fuzzA[k]), k);
  await t.slide(mark, target);
  // Chrome hands moves to the page on the next frame; wait for the last one to land
  await expect.poll(() => at(page, () => window.__fs.ui.circle), { timeout: 5000 }).toBe(k);
  await t.end();
  expect(await uiState(page)).toBe('idle');
  expect(await at(page, () => window.__fs.S.orders[3])).toEqual({ t: 'mark', k });
});

test('Esc leaves orders unchanged', async ({ page }) => {
  await toDefencePlan(page);
  const t = await touch(page), d4 = await defScreen(page, 3), before = await orders(page);
  await t.tap(d4);
  expect(await uiState(page)).toBe('menuOpen');
  await page.keyboard.press('Escape');
  expect(await uiState(page)).toBe('idle');
  expect(await at(page, () => window.__fs.S.paused || false)).toBe(false);   // Esc closed the menu, didn't pause
  expect(await orders(page)).toBe(before);
  // and from Mark mode
  await t.tap(d4);
  await t.tap(await at(page, () => window.__fs.wedgeScreen('mark')));
  expect(await uiState(page)).toBe('markPick');
  await page.keyboard.press('Escape');
  expect(await uiState(page)).toBe('idle');
  expect(await orders(page)).toBe(before);
});

test('an outside tap leaves orders unchanged', async ({ page }) => {
  await toDefencePlan(page);
  const t = await touch(page), d4 = await defScreen(page, 3), before = await orders(page);
  await t.tap(d4);
  await t.tap({ x: 30, y: 700 });                           // empty pitch, outside the fan
  expect(await uiState(page)).toBe('idle');
  expect(await orders(page)).toBe(before);
  // Mark mode: a tap outside every marker cancels too
  await t.tap(d4);
  await t.tap(await at(page, () => window.__fs.wedgeScreen('mark')));
  expect(await uiState(page)).toBe('markPick');
  const empty = await at(page, () => { const F = window.__fs, R = window.FootSalRadial;
    for (let y = .05; y < 1.45; y += .05) for (let x = .05; x < .95; x += .05)
      if (F.S.fuzzA.every(c => Math.hypot(c.x - x, c.y - y) > .2) && F.planPos().every(d => Math.hypot(d.x - x, d.y - y) > .1)) return F.screenOf({ x, y });
    return null; });
  expect(empty).not.toBeNull();
  await t.tap(empty);
  expect(await uiState(page)).toBe('idle');
  expect(await orders(page)).toBe(before);
});

test('screenshots: centre, left touchline, Mark mode', async ({ page }) => {
  test.setTimeout(150_000);
  await toDefencePlan(page, { 3: { x: .5, y: .7 }, 4: { x: .05, y: .5 } });
  const t = await touch(page);
  const centre = await defScreen(page, 3);
  // Esc only closes the menu when it is open (otherwise it pauses the game), so check before each one
  const closeMenu = async () => {
    await expect.poll(() => uiState(page), { timeout: 8000 }).toBe('menuOpen');
    await page.keyboard.press('Escape');
    await expect.poll(() => uiState(page)).toBe('idle');
    expect(await at(page, () => window.__fs.S.paused || false)).toBe(false);
  };
  await t.tap(centre);
  await expect.poll(() => uiState(page), { timeout: 8000 }).toBe('menuOpen');
  await page.waitForTimeout(250);
  await page.screenshot({ path: new URL('radial-centre.png', SHOTS).pathname.replace(/^\/(\w:)/, '$1') });
  await closeMenu();
  const left = await defScreen(page, 4);
  await t.tap(left);
  await expect.poll(() => uiState(page), { timeout: 8000 }).toBe('menuOpen');
  await page.waitForTimeout(250);
  const box = await at(page, () => window.FootSalRadial.fanBox(window.__fs.ui.fanC, window.__fs.ui.fan));
  expect(box.left).toBeGreaterThanOrEqual(8 - 0.5);         // fan fully on screen at the touchline
  expect(box.right).toBeLessThanOrEqual(390 - 8 + 0.5);
  await page.screenshot({ path: new URL('radial-left-touchline.png', SHOTS).pathname.replace(/^\/(\w:)/, '$1') });
  await closeMenu();
  // Mark mode mid-slide, finger on a marker
  await t.start(centre);
  await expect.poll(() => uiState(page), { timeout: 8000 }).toBe('menuOpen');
  const mark = await at(page, () => window.__fs.wedgeScreen('mark'));
  await t.slide(centre, mark);
  await page.waitForTimeout(300);
  const k = await at(page, () => { const F = window.__fs, me = F.planPos()[3]; let b = 0, bd = -1;
    F.S.fuzzA.forEach((c, j) => { const d = Math.hypot(c.x - me.x, c.y - me.y); if (d > bd) { bd = d; b = j; } }); return b; });
  await t.slide(mark, await at(page, k => window.__fs.screenOf(window.__fs.S.fuzzA[k]), k));
  await page.waitForTimeout(250);
  await page.screenshot({ path: new URL('radial-mark-mode.png', SHOTS).pathname.replace(/^\/(\w:)/, '$1') });
  await t.end();
});
