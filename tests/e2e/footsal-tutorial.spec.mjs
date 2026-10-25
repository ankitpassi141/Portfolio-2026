// First-time tutorial: intro on a fresh profile, each phase card once with the clock held, How to play,
// Show tips again, two player after the hand-off, and reduced motion. Each test starts from cleared storage.
import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const OUT = new URL('../artifacts/', import.meta.url);
mkdirSync(OUT, { recursive: true });
const shot = (page, name) => page.screenshot({ path: new URL(name, OUT).pathname.replace(/^\/([A-Za-z]:)/, '$1') });
const card = page => page.evaluate(() => { const c = document.querySelector('.card.tip'); return c ? c.dataset.card : null; });
const click = (page, sel) => page.evaluate(s => document.querySelector(s).click(), sel);

let errors;
test.beforeEach(async ({ page }) => {
  errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  await page.goto('/footsal.html?debug');
  await page.evaluate(() => { localStorage.removeItem('footsal.tips.v1'); localStorage.setItem('gpfc.settings.v1', JSON.stringify({ clock: true, t1: 20, t2: 20, cam: 'top' })); });
  await page.reload();
  await page.waitForFunction(() => window.__fs && window.FootSalRadial);
  const reject = page.getByRole('button', { name: 'Reject' });
  if (await reject.isVisible().catch(() => false)) await reject.click();
});
test.afterEach(() => { expect(errors).toEqual([]); });

test('fresh profile: intro, then each phase card once with the clock held (single player, clock on)', async ({ page }) => {
  await click(page, '#enter');
  for (const id of ['win', 'turns', 'phases']) {
    await expect.poll(() => card(page)).toBe(id);
    await expect(page.locator('#tpSkip')).toBeVisible();
    if (id === 'win') await shot(page, 'tip-intro-win.png');
    await click(page, '#tpNext');
  }
  // straight into a single player match, Set up card first, clock frozen at the full 20 s
  await expect.poll(() => card(page)).toBe('setup');
  expect(await page.evaluate(() => [window.__fs.S.mode, window.__fs.S.phase, window.__fs.S.deadline])).toEqual(['bot', 'setupA', null]);
  await page.waitForTimeout(1500);
  expect(await page.evaluate(() => window.__fs.S.deadline)).toBeNull();
  await shot(page, 'tip-setup.png');
  const left = await page.evaluate(() => { const t = performance.now(); document.querySelector('#tpNext').click(); return window.__fs.S.deadline - t; });
  expect(Math.abs(left - 20000)).toBeLessThan(50);
  // Plan: Reading the circles, then Attacking, still frozen
  await click(page, '#go');
  await expect.poll(() => card(page)).toBe('circles');
  await expect(page.locator('.tip-dots i')).toHaveCount(2);
  expect(await page.evaluate(() => window.__fs.S.deadline)).toBeNull();
  await click(page, '#tpNext');
  await expect.poll(() => card(page)).toBe('attack');
  await click(page, '#tpNext');
  await page.evaluate(() => { const S = window.__fs.S; S.seq = [1, 3]; S.goalTapped = true; S.meter = { t0: 0, sw: { c: .62, w: .24 }, v: .62 }; document.querySelector('#go').click(); });
  // the Kickoff card comes before the Kickoff page
  await expect.poll(() => card(page)).toBe('kickoff');
  await click(page, '#tpNext');
  await expect(page.locator('.kick')).toBeVisible();
  // a new match shows no cards again
  await page.evaluate(() => window.__fs.newGame('bot', ['A', 'B'], 5));
  await page.waitForTimeout(300);
  expect(await card(page)).toBeNull();
});

test('clock off: the card still shows and no clock starts', async ({ page }) => {
  await page.evaluate(() => { const F = window.__fs; F.TIP.intro = true; F.SET.clock = false; F.newGame('bot', ['A', 'B'], 5); });
  await expect.poll(() => card(page)).toBe('setup');
  await click(page, '#tpNext');
  expect(await page.evaluate(() => window.__fs.S.deadline)).toBeNull();
  await expect(page.locator('#timer')).toHaveClass(/off/);
});

test('two player: each card comes after the hand-off, once per card', async ({ page }) => {
  await page.evaluate(() => { const F = window.__fs; F.TIP.intro = true; F.newGame('2p', ['Red Lions', 'Blue Owls'], 5); });
  await expect.poll(() => card(page)).toBe('setup');
  await click(page, '#tpNext');
  await click(page, '#go');
  await expect(page.locator('#ready')).toBeVisible();          // hand-off first, no card yet
  expect(await card(page)).toBeNull();
  await click(page, '#ready');
  await page.waitForTimeout(300);
  expect(await card(page)).toBeNull();                         // Set up already seen on this device
  await click(page, '#go');
  await click(page, '#ready');
  await expect.poll(() => card(page)).toBe('circles');
});

test('How to play shows all 7 cards and leaves first-time behaviour alone; Show tips again resets', async ({ page }) => {
  await page.evaluate(() => { window.__fs.TIP.intro = true; });
  await click(page, '#enter');
  await expect(page.locator('.menu nav button')).toHaveText(['Play single player', 'Play two player', 'How to play', 'Settings', 'Credits', 'Quit']);
  await click(page, '#m6');
  const ids = [];
  for (let i = 0; i < 7; i++) {
    ids.push(await card(page));
    if (i === 5) { await page.evaluate(() => window.__fs.tipAt(1)); await shot(page, 'tip-orders.png'); }
    if (i === 4) { await page.evaluate(() => window.__fs.tipAt(3.6)); await shot(page, 'tip-attack.png'); }
    await click(page, '#tpNext');
  }
  expect(ids).toEqual(['win', 'turns', 'setup', 'circles', 'attack', 'orders', 'kickoff']);
  await expect(page.locator('.card.menu')).toBeVisible();
  expect(await page.evaluate(() => Object.keys(window.__fs.TIP.seen))).toEqual([]);
  // seen flags set, then cleared from Settings
  await page.evaluate(() => { window.__fs.TIP.seen = { setup: 1, circles: 1 }; });
  await click(page, '#m3');
  await click(page, '#tipsAgain');
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('footsal.tips.v1')).seen)).toEqual({});
});

test('Skip tutorial marks everything seen and goes to the menu', async ({ page }) => {
  await click(page, '#enter');
  await expect.poll(() => card(page)).toBe('win');
  await click(page, '#tpSkip');
  await expect(page.locator('.card.menu')).toBeVisible();
  const seen = await page.evaluate(() => JSON.parse(localStorage.getItem('footsal.tips.v1')).seen);
  expect(Object.keys(seen).sort()).toEqual(['attack', 'circles', 'kickoff', 'lostBall', 'orders', 'phases', 'setup', 'turns', 'win']);
});

test('reduced motion: final frame with a Replay button', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.evaluate(() => { window.__fs.TIP.intro = true; window.__fs.openTips(['win'], 'deck', () => {}); });
  await expect(page.locator('#tpRe')).toBeVisible();
  await expect(page.locator('.tip-sb .t0 .sb-score')).toHaveText('1');
});
