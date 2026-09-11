// Site-wide background music. This is a multi-page (non-SPA) site, so
// audio can't literally keep playing through a real page navigation —
// the page unloads and takes it with it. This is the practical
// equivalent instead: every page creates the same track fresh, resumes
// it from wherever it last was, and keeps the same play/pause state, all
// via localStorage — so it *feels* continuous even though technically a
// new <audio> element starts on every load.
//
// Include on a page with (both relative to that page, matching however
// deep it sits — see the other per-depth asset paths on this site):
//   <link rel="stylesheet" href="{path-to-root}css/background-music.css">
//   <script src="{path-to-root}js/background-music.js"></script>
//
// Placement: if the page has a <span id="bgmSlot"></span> somewhere in
// its header, the toggle is built there — small, inline, colored via
// currentColor so it matches that header's own text color with no
// per-page theming needed. Pages with no such slot (the three
// full-viewport canvas pages — Experiments, Gaming & Exploration, Photo
// Gallery — which have no header row to put it in) get a floating
// bottom-corner button instead.
//
// The track itself lives at audio/background-music.mp3 — until that file
// exists, this script fails quiet (no button shown, nothing broken). See
// reference/background-music.md.
//
// Exposes window.backgroundMusic = { toggle(), isPlaying() } and fires a
// window "bgm:change" event on every real play/pause, so other UI (the
// Settings & Consent sheet's "Play Music" row) can drive/reflect playback
// without reaching into this file.
(() => {
  "use strict";

  const STORAGE_PLAYING = "bgm-playing";
  const STORAGE_TIME = "bgm-time";

  // This script's own <script src> tells us how deep the current page
  // sits relative to the site root (e.g. "../../../js/background-music.js"
  // on a raw case-study page) — reusing that instead of hand-writing a
  // prefix per page.
  const scriptEl = document.currentScript;
  const scriptSrc = scriptEl ? scriptEl.getAttribute("src") || "" : "";
  const rootPrefix = scriptSrc.replace(/js\/background-music\.js.*$/, "");

  const audio = document.createElement("audio");
  audio.loop = true;
  audio.preload = "auto";
  audio.src = rootPrefix + "audio/background-music.mp3";

  let button = null;
  let built = false;

  function readStoredPlaying() {
    return localStorage.getItem(STORAGE_PLAYING) === "true"; // paused by default on a first-ever visit
  }

  function writeStoredPlaying(playing) {
    try { localStorage.setItem(STORAGE_PLAYING, String(playing)); } catch (e) {}
  }

  function writeStoredTime() {
    if (!Number.isFinite(audio.currentTime)) return;
    try { localStorage.setItem(STORAGE_TIME, String(audio.currentTime)); } catch (e) {}
  }

  function updateButton() {
    if (!button) return;
    const playing = !audio.paused;
    button.classList.toggle("is-playing", playing);
    button.setAttribute("aria-pressed", String(playing));
    button.setAttribute("aria-label", playing ? "Pause background music" : "Play background music");
  }

  function icon(cls) {
    const span = document.createElement("span");
    span.className = cls;
    span.setAttribute("aria-hidden", "true");
    return span;
  }

  function buildButton() {
    if (button) return button;
    const slot = document.getElementById("bgmSlot");

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "bgm-toggle" + (slot ? "" : " bgm-toggle--floating");
    btn.append(
      icon("bgm-toggle__ring"),
      icon("bgm-toggle__glyph bgm-toggle__glyph--play"),
      icon("bgm-toggle__glyph bgm-toggle__glyph--pause")
    );

    btn.addEventListener("click", () => {
      if (audio.paused) {
        audio.play().catch(() => {});
      } else {
        audio.pause();
      }
    });

    (slot || document.body).appendChild(btn);
    button = btn;
    return btn;
  }

  // The only two moments playback state actually changes are these two
  // events (a real click firing one of them, or a first-load autoplay
  // attempt below firing one) — driving the button from here instead of
  // from inside the click handler means it always reflects reality, even
  // when a browser blocks a play() call outside a user gesture.
  audio.addEventListener("play", () => { writeStoredPlaying(true); updateButton(); notifyChange(); });
  audio.addEventListener("pause", () => { writeStoredPlaying(false); updateButton(); notifyChange(); });

  // Fires on every real play/pause so other UI (e.g. the "Play Music" row
  // in the Settings & Consent sheet, see js/settings-sheet.js) can mirror
  // the actual audio state without polling it.
  function notifyChange() {
    window.dispatchEvent(new Event("bgm:change"));
  }

  audio.addEventListener("loadedmetadata", () => {
    const storedTime = parseFloat(localStorage.getItem(STORAGE_TIME));
    if (Number.isFinite(storedTime) && storedTime > 0 && storedTime < audio.duration) {
      audio.currentTime = storedTime;
    }
  });

  // canplay (not canplaythrough) — fires as soon as playback can start,
  // without waiting for an estimate that the whole file will buffer in
  // time, which on a slow connection may never come.
  audio.addEventListener("canplay", () => {
    if (built) return;
    built = true;
    buildButton();
    updateButton();

    // Resume automatically only if the visitor had it playing before —
    // this is an autoplay-with-sound attempt outside a fresh gesture on
    // *this* page, so most browsers allow it once you've genuinely
    // interacted with audio on the site before, but not universally. If
    // it's blocked, play() just rejects and the button honestly shows
    // "paused" rather than claiming otherwise.
    if (readStoredPlaying()) {
      audio.play().catch(() => {});
    }
  });

  audio.addEventListener("error", () => {
    // No track at audio/background-music.mp3 yet (or it failed to load)
    // — fail quiet rather than showing a button that does nothing.
    if (button) { button.remove(); button = null; }
  });

  setInterval(writeStoredTime, 1000);
  document.addEventListener("visibilitychange", writeStoredTime);
  window.addEventListener("pagehide", writeStoredTime);

  document.body.appendChild(audio);

  // Small public API so other UI can drive playback without reaching into
  // this closure — used by the Settings & Consent sheet's "Play Music" row
  // (see js/settings-sheet.js). Works even before the track has loaded or
  // the toggle button has been built.
  window.backgroundMusic = {
    toggle() {
      if (audio.paused) audio.play().catch(() => {});
      else audio.pause();
    },
    isPlaying() {
      return !audio.paused;
    }
  };
})();
