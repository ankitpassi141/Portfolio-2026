// FootSal: clock switch, setup summary, Kickoff page and the rewritten planning text, at 390x844.
// Saves screenshots to tests/artifacts/ and fails on any console error.
import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const SHOTS = fileURLToPath(new URL('../artifacts/', import.meta.url));
mkdirSync(SHOTS, { recursive: true });
const shot = (page, name) => page.screenshot({ path: SHOTS + name });

let errors;
test.beforeEach(async ({ page }) => {
  errors = [];
  // these tests start past the first-launch tutorial (tests/e2e/footsal-tutorial.spec.mjs covers it)
  await page.addInitScript(() => localStorage.setItem('footsal.tips.v1', JSON.stringify({ intro: true, seen: { win: 1, turns: 1, phases: 1, setup: 1, circles: 1, attack: 1, orders: 1, kickoff: 1, lostBall: 1 } })));
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  await page.goto('/footsal.html?debug');
  await page.waitForFunction(() => window.__fs && window.FootSalRadial);
  const reject = page.getByRole('button', { name: 'Reject' });
  if (await reject.isVisible().catch(() => false)) await reject.click();
  await page.evaluate(() => document.querySelector('#enter').click());   // it pulses, so never "stable"
});
test.afterEach(() => { expect(errors, errors.join('\n')).toEqual([]); });

test('settings: clock switch greys out the times, and the setup screen shows the setting', async ({ page }) => {
  await page.locator('#m3').click();
  await expect(page.locator('#ck [data-v="1"]')).toHaveAttribute('aria-pressed', 'true');   // default On
  await page.locator('.clk').first().scrollIntoViewIfNeeded();
  await shot(page, 'settings-clock-on.png');
  await page.locator('#ck [data-v="0"]').click();
  await expect(page.locator('.clk').first()).toHaveClass(/off/);
  await expect(page.locator('#t1 button').first()).toBeDisabled();
  await shot(page, 'settings-clock-off.png');
  await page.locator('#back').click();
  await page.locator('#m1').click();
  // single player setup has its own Clock On / Off (the same setting); times stay in Settings
  await expect(page.locator('#sck [data-v="0"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#ckSum')).toHaveText('Each turn waits for Done or Lock in.');
  await shot(page, 'setup-clock-off.png');
  // back on: the note gives both times
  await page.locator('#back').click(); await page.locator('#m3').click();
  await page.locator('#ck [data-v="1"]').click(); await page.locator('#back').click();
  await page.locator('#m1').click();
  await expect(page.locator('#ckSum')).toHaveText(/^\d+ s to set up, \d+ s to plan\./);
  await shot(page, 'setup-clock-on.png');
});

test('clock off: no stopwatch and the turn waits for the player', async ({ page }) => {
  await page.evaluate(() => { const F = window.__fs; F.SET.clock = false; F.SET.t1 = 5; F.newGame('bot', ['Saffron City', 'Granite Town'], 5); });
  await expect(page.locator('#timer')).toHaveClass(/off/);
  await page.waitForTimeout(6500);                                      // longer than the 5 s clock
  expect(await page.evaluate(() => window.__fs.S.phase)).toBe('setupA');
  expect(await page.evaluate(() => window.__fs.S.deadline)).toBeNull();
});

test('planning screen uses the new text', async ({ page }) => {
  await page.evaluate(async () => { const F = window.__fs, w = ms => new Promise(r => setTimeout(r, ms));
    F.SET.t1 = 30; F.SET.t2 = 30; F.newGame('bot', ['Saffron City', 'Granite Town'], 5); await w(50);
    document.querySelector('#go').click(); });
  await expect.poll(() => page.evaluate(() => window.__fs.S.phase)).toBe('planA');
  await page.waitForTimeout(1700);
  await page.evaluate(() => { document.querySelector('#cut').innerHTML = ''; });
  await expect(page.locator('#title')).toHaveText('Plan your attack');
  await expect(page.locator('#hint')).toHaveText('Tap who starts, then who they pass to.');
  const font = await page.locator('#title').evaluate(el => getComputedStyle(el).fontFamily);
  expect(font).toContain('Barlow');
  const size = await page.locator('#hint').evaluate(el => getComputedStyle(el).fontSize);
  expect(size).toBe('16px');
  await shot(page, 'planning-attack.png');
});

async function toKickoff(page, mode) {
  await page.evaluate(async (mode) => { const F = window.__fs, w = ms => new Promise(r => setTimeout(r, ms));
    F.newGame(mode, ['Riverside Rovers', 'Granite Town'], 5); await w(50);
    F.S.score = [1, 2]; F.S.attackNo = 4; F.go('ready'); }, mode);
  await expect(page.locator('#ov.kickoff')).toBeVisible();
  await page.waitForTimeout(900);
}

test('kickoff page, single player: face-off, no plan details, kicks off at once', async ({ page }) => {
  await toKickoff(page, 'bot');
  await expect(page.locator('.kick-tag')).toContainText('Attack 4 · Riverside Rovers attack');
  await expect(page.locator('.kick-band')).toHaveCount(2);
  await expect(page.locator('.kb-a .kb-tag')).toHaveText('You · Attacking');   // single player names You / CPU
  await expect(page.locator('.kb-d .kb-tag')).toHaveText('CPU · Defending');
  await expect(page.locator('#hud')).toBeHidden();
  await page.waitForTimeout(600);                                            // let the bands finish sliding in
  const nothing = await page.evaluate(() => ({ text: document.querySelector('#ov').innerText, ball: window.__fs.scene && true }));
  expect(nothing.text).not.toMatch(/order|press|mark|hold|position/i);    // nothing about either plan
  await shot(page, 'kickoff-single.png');
  await page.evaluate(() => document.querySelector('#ko').click());
  await expect.poll(() => page.evaluate(() => window.__fs.S.phase)).toBe('play');
});

test('kickoff page, two player: countdown screenshot (frozen on 3)', async ({ page }) => {
  await toKickoff(page, '2p');
  // screenshots take ~2 s with software WebGL, longer than the countdown, so stop it on "3": the countdown
  // only advances while the phase is 'ready', and the pop animation is paused at full size
  await page.evaluate(() => { document.querySelector('#ko').click(); window.__fs.S.phase = 'frozen';
    const a = document.querySelector('#kcount').getAnimations()[0]; if (a) { a.pause(); a.currentTime = 220; } });
  await expect(page.locator('#kcount')).toHaveText('3');
  await shot(page, 'kickoff-two-player-countdown.png');
});

test('scoreboard shows the mode; setup offers the CPU level', async ({ page }) => {
  await page.locator('#m1').evaluate(b => b.click());
  await expect(page.locator('#df [data-v="med"]')).toHaveAttribute('aria-pressed', 'true');   // default Medium
  await page.locator('#df [data-v="hard"]').click();
  await shot(page, 'setup-difficulty.png');
  await page.locator('#start').click();
  await expect(page.locator('#sbMode')).toHaveText('VS CPU');
  await expect(page.locator('#n0')).toContainText('You');
  await expect(page.locator('#n1')).toContainText('CPU');
  await page.waitForTimeout(1700);
  await page.evaluate(() => { document.querySelector('#cut').innerHTML = ''; });
  await shot(page, 'hud-scoreboard.png');
  expect(await page.evaluate(() => window.__fs.SET.diff)).toBe('hard');
});

test('pause: team 1 band on top, team 2 at the bottom, and Attack / Defend for the player', async ({ page }) => {
  await page.evaluate(async () => { const F = window.__fs, w = ms => new Promise(r => setTimeout(r, ms));
    F.SET.t1 = 30; F.SET.t2 = 30; F.newGame('bot', ['Saffron City', 'Granite Town'], 5); await w(50); F.S.score = [2, 1]; });
  await page.locator('#pause').click();
  await expect(page.locator('#ov.pause .pz-t0 .pz-name b')).toHaveText('Saffron City');
  await expect(page.locator('#ov.pause .pz-t1 .pz-name b')).toHaveText('Granite Town');
  await expect(page.locator('.pz-t0 .pz-score')).toHaveText('2');
  await expect(page.locator('.pz-role')).toHaveText('You: Attack');
  await page.waitForTimeout(500);
  await shot(page, 'pause.png');
  await page.locator('#res').click();
  // when the player defends, the pause screen says Defend
  await page.evaluate(() => { const F = window.__fs; F.S.attacker = 1; F.startAttack(); });
  await page.locator('#pause').click();
  await expect(page.locator('.pz-role')).toHaveText('You: Defend');
});

test('Lock in without a shot asks for the shot, then the strike, before locking', async ({ page }) => {
  await page.evaluate(async () => { const F = window.__fs, w = ms => new Promise(r => setTimeout(r, ms));
    F.SET.t1 = 60; F.SET.t2 = 60; F.newGame('bot', ['Saffron City', 'Granite Town'], 5); await w(50);
    document.querySelector('#go').click(); });
  await expect.poll(() => page.evaluate(() => window.__fs.S.phase)).toBe('planA');
  await page.evaluate(() => { window.__fs.S.seq = [1, 3]; });
  await page.locator('#go').click();                                         // Lock in, no shot yet
  expect(await page.evaluate(() => window.__fs.S.phase)).toBe('planA');
  await expect(page.locator('#hint')).toHaveText('Take your shot: tap the goal.');
  await page.waitForTimeout(1500);
  await page.evaluate(() => { document.querySelector('#cut').innerHTML = ''; });
  await shot(page, 'take-your-shot.png');
  // the player taps the goal: the strike meter appears with the sweet-spot instruction
  await page.evaluate(() => { const S = window.__fs.S; S.goalTapped = true; S.flashA = ''; S.meter = { t0: performance.now(), sw: { c: .62, w: .22 }, v: null }; });
  await page.evaluate(() => window.__fs.hud());
  await expect(page.locator('#hint')).toHaveText('Tap when the needle is in the yellow for a perfect shot, or tap Lock in to shoot now.');
  await expect(page.locator('#meter')).toBeVisible();
  await expect(page.locator('#meter .mlab')).toHaveText('TAP IN THE YELLOW FOR A PERFECT SHOT');
  await shot(page, 'strike-meter.png');
  // Lock in while the needle runs takes the strike where it is, shows it, then locks in
  await page.locator('#go').click();
  expect(await page.evaluate(() => window.__fs.S.meter.v)).not.toBeNull();
  await expect.poll(() => page.evaluate(() => window.__fs.S.phase)).not.toBe('planA');
});

test('a goal is replayed, and the replay can be skipped', async ({ page }) => {
  await page.evaluate(async () => { const F = window.__fs, w = ms => new Promise(r => setTimeout(r, ms));
    F.SET.t1 = 60; F.SET.t2 = 60; F.newGame('bot', ['Saffron City', 'Granite Town'], 5); await w(50);
    const S = F.S; S.att[4] = { x: .5, y: .4 }; document.querySelector('#go').click(); await w(80);
    // a clean chance: one pass then a sweet-spot shot, and the defence moved out of the way
    S.seq = [3, 4]; S.goalTapped = true; S.meter = { t0: 0, sw: { c: .62, w: .24 }, v: .62 };
    document.querySelector('#go').click(); await w(80);
    S.def = S.def.map((p, i) => i ? { x: i % 2 ? .04 : .96, y: 1.3 + i * .03 } : p); S.shifts = []; S.orders = F.defaultOrders(5);
    Math.random = () => 0.001;                                                 // the shot goes in
    document.querySelector('#ko').click(); });
  await expect.poll(() => page.evaluate(() => window.__fs.S.out && window.__fs.S.out.type)).toBe('goal');
  await expect.poll(() => page.evaluate(() => window.__fs.S.phase), { timeout: 30000 }).toBe('replay');
  await expect(page.locator('#replay')).toBeVisible();
  await expect(page.locator('#title')).toHaveText('Goal replay');
  await page.waitForTimeout(1200);
  // hold the replay on this frame (software WebGL screenshots are slow enough for it to end by itself)
  await page.evaluate(() => { const S = window.__fs.S, e = performance.now() - S.rpStart;
    window.__rpHold = setInterval(() => { S.rpStart = performance.now() - e; }, 16);
    document.querySelector('#cut').innerHTML = ''; });
  await shot(page, 'goal-replay.png');
  expect(await page.evaluate(() => window.__fs.S.phase)).toBe('replay');
  await page.evaluate(() => clearInterval(window.__rpHold));
  expect(await page.evaluate(() => window.__fs.S.score[0])).toBe(1);        // counted once, not again in the replay
  await page.locator('#rpSkip').click();
  await expect(page.locator('#replay')).toBeHidden();
  await expect(page.locator('#ov .card h2')).toHaveText('Goal!');
  expect(await page.evaluate(() => window.__fs.S.score[0])).toBe(1);
});

test('kickoff page, two player: 3-2-1 countdown, then play', async ({ page }) => {
  await toKickoff(page, '2p');
  await shot(page, 'kickoff-two-player.png');
  await page.evaluate(() => document.querySelector('#ko').click());
  await expect(page.locator('#kcount')).toHaveText('3');
  // the countdown hands over to play (with no plan set it then resolves at once, so allow 'result')
  await expect.poll(() => page.evaluate(() => window.__fs.S.phase), { timeout: 8000 }).toMatch(/^(play|result)$/);
});
