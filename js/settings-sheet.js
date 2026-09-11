// Settings & Consent sheet — Home page only, opened from the "Settings &
// Consent" row in the drawer (see window.DRAWER in home-content-data.js
// and the `type === "settings"` branch in main.js). Reuses the same
// .sheet dialog chrome as the case-study sheet (js/case-sheet.js) but is
// a fully separate element/instance, so the two never fight over state.
//
// "Play Music" delegates to window.backgroundMusic (js/background-music.js)
// and "Analytics & Cookie Access" delegates to window.showCookieConsent
// (js/cookie-consent.js) — both expose a tiny public API for exactly this.
(() => {
  "use strict";

  const sheet = document.getElementById("settingsSheet");
  const closeBtn = document.getElementById("settingsSheetClose");
  const musicRow = document.getElementById("settingsMusicRow");
  const musicHint = document.getElementById("settingsMusicHint");
  const analyticsRow = document.getElementById("settingsAnalyticsRow");
  if (!sheet || !closeBtn) return;

  let lastTrigger = null;

  function syncMusicHint() {
    if (!musicHint) return;
    const playing = !!(window.backgroundMusic && window.backgroundMusic.isPlaying());
    musicHint.textContent = playing ? "Playing" : "Paused";
    if (musicRow) musicRow.classList.toggle("is-active", playing);
  }

  function open(trigger) {
    lastTrigger = trigger || null;
    sheet.hidden = false;
    syncMusicHint();
    requestAnimationFrame(() => closeBtn.focus());
  }

  function close() {
    if (sheet.hidden) return;
    sheet.hidden = true;
    if (lastTrigger && lastTrigger.isConnected) lastTrigger.focus();
    lastTrigger = null;
  }

  if (musicRow) {
    musicRow.addEventListener("click", () => {
      if (window.backgroundMusic) window.backgroundMusic.toggle();
    });
  }
  // The audio's play/pause can be async (autoplay blocked, etc.) — mirror
  // the real state via the event background-music.js fires, rather than
  // assuming the click always succeeds.
  window.addEventListener("bgm:change", syncMusicHint);

  if (analyticsRow) {
    analyticsRow.addEventListener("click", () => {
      close();
      if (window.showCookieConsent) window.showCookieConsent();
    });
  }

  closeBtn.addEventListener("click", close);
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !sheet.hidden) close();
  });

  window.openSettingsSheet = open;
})();
