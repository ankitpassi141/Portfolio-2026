// Ambient sound for the Sunflower page: looping field recordings (CC0, BigSoundBank — see audio/sunflower/LICENSE.txt),
// crossfaded by time of day: breeze all day, morning birdsong by day, meadow crickets and frogs by night.
const FILES = { breeze: 'audio/sunflower/day-breeze.mp3', birds: 'audio/sunflower/day-birds.mp3', crickets: 'audio/sunflower/night-crickets.mp3' };
const GAIN = { breeze: 1.1, birds: 1.8, crickets: 0.5 };      // levelled by ear against the recordings' loudness (crickets are ~9 dB hotter)

export function createAmbience() {
  let ctx = null, master = null, loading = null, enabled = false, day = 1;
  const gains = {};

  async function build() {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination);
    await Promise.all(Object.entries(FILES).map(async ([k, url]) => {
      try {
        const buf = await ctx.decodeAudioData(await (await fetch(url)).arrayBuffer());
        const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
        const g = ctx.createGain(); g.gain.value = 0; gains[k] = g;
        src.connect(g); g.connect(master); src.start(0, Math.random() * buf.duration);
      } catch (e) { console.warn('Ambient sound failed to load:', url, e); }
    }));
    document.addEventListener('visibilitychange', () => { if (!ctx) return; if (document.hidden) ctx.suspend(); else if (enabled) ctx.resume(); });
    apply(true);
  }
  function apply(now) {
    if (!ctx) return;
    const t = ctx.currentTime, k = now ? 0.01 : 0.4;
    const target = { breeze: 0.5 + 0.5 * day, birds: day * day, crickets: 1 - day };
    for (const n in gains) gains[n].gain.setTargetAtTime(target[n] * GAIN[n] * 0.5, t, k);
  }

  return {
    get enabled() { return enabled; },
    // call from a user gesture the first time
    async setEnabled(on) {
      enabled = on;
      if (on) {
        if (!ctx) { loading = build(); }
        await loading; await ctx.resume();
        master.gain.setTargetAtTime(1, ctx.currentTime, 0.5);
      } else if (ctx) {
        master.gain.setTargetAtTime(0, ctx.currentTime, 0.15);
        setTimeout(() => { if (!enabled) ctx.suspend(); }, 700);
      }
    },
    update(dayAmt) { day = dayAmt; if (enabled) apply(false); },
  };
}
