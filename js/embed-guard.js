// Embed mode — lets the homepage's Lab tile run an experiment live inside a
// small frame. Load it first in <head> on any page the tile embeds. It does
// nothing at all unless the URL has ?embed=1, so the normal page is
// untouched.
//
// In embed mode the page shows only the running app, and stays quiet:
//   - all page chrome (back button, HUDs, hints, loaders) is hidden
//   - audio is muted: AudioContexts stay suspended and media never plays
//   - nothing is written to storage (so it can't reset e.g. the site-wide
//     background-music position or a saved sound preference)
//   - no location prompt and no third-party location lookups
//   - the cookie banner / analytics don't load (see cookie-consent.js)
// To embed another page, add its chrome selectors to HIDE below.
(() => {
  "use strict";
  if (!/[?&]embed=1(?:&|$)/.test(location.search)) return;

  window.__embed = true;
  document.documentElement.setAttribute("data-embed", "1");   // attribute, not a class: some pages reset <html class>

  // Per-page chrome to hide (everything except the app's own canvas/stage).
  const HIDE = {
    "sunflower.html": ".back, .panel, .reset, .snd, .cap, .hint, #loading",
    "valley-drive.html": ".xp, .topright, .bar, .hint, .toast, .pad, #loading",
    "qr-city.html": ".back-link",
    "open-water.html": ".back, .brand, .topbar, .panel, #diag",
    "constellations.html": ".cback, .to-freeroam, .topright, .odo, .run, .flightbar, .hint, .loader, .fallback, .call-surfer"
  };
  const page = location.pathname.split("/").pop() || "index.html";
  const style = document.createElement("style");
  style.textContent =
    "html[data-embed], html[data-embed] body { overflow: hidden !important; }" +
    (HIDE[page] ? "html[data-embed] " + HIDE[page].split(",").map((s) => s.trim()).join(", html[data-embed] ") + " { display: none !important; }" : "");
  document.head.appendChild(style);

  // Audio: contexts are created suspended and can't be resumed; media
  // elements "play" silently.
  const AC = window.AudioContext || window.webkitAudioContext;
  if (AC) {
    class QuietAudioContext extends AC {
      constructor(...args) { super(...args); try { this.suspend(); } catch (e) {} }
      resume() { return Promise.resolve(); }
    }
    window.AudioContext = window.webkitAudioContext = QuietAudioContext;
  }
  HTMLMediaElement.prototype.play = function () { this.muted = true; return Promise.resolve(); };

  // Never persist anything from inside the frame.
  Storage.prototype.setItem = function () {};
  Storage.prototype.removeItem = function () {};

  // No location prompt, and no third-party IP / reverse-geocode lookups.
  try {
    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      value: {
        getCurrentPosition(_ok, fail) { if (fail) fail({ code: 1, message: "disabled in embed" }); },
        watchPosition(_ok, fail) { if (fail) fail({ code: 1, message: "disabled in embed" }); return 0; },
        clearWatch() {}
      }
    });
  } catch (e) {}
  const realFetch = window.fetch;
  window.fetch = function (input, init) {
    const url = String((input && input.url) || input);
    if (/ipwho\.is|bigdatacloud\.net/i.test(url)) return Promise.reject(new TypeError("blocked in embed"));
    return realFetch.call(window, input, init);
  };
})();
