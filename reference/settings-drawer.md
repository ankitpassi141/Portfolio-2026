# Settings & Consent sheet

Home page only. A "Settings & Consent" row in the "What else I'm upto!"
drawer opens a small dialog (`#settingsSheet` in index.html) with three
rows: **Play Music**, **Analytics & Cookie Access**, and a static "More
settings coming soon" placeholder.

## Files involved

- **`js/home-content-data.js`** — `window.DRAWER.rows` has the drawer
  entry: `{ label: "Settings & Consent", hint: "→", type: "settings" }`.
- **`js/main.js`** — the drawer-rendering code recognizes
  `type === "settings"` and wires the row to call
  `window.openSettingsSheet(el)`.
- **`index.html`** — the `#settingsSheet` markup itself (right after
  `#sheet`, the case-study dialog — same `.sheet` chrome, separate
  element, separate state, so the two never conflict).
- **`js/settings-sheet.js`** — open/close mechanics (Escape key, focus
  moves to the close button on open and back to the trigger on close)
  and wires the two functional rows:
  - **Play Music** calls `window.backgroundMusic.toggle()` (exposed by
    `js/background-music.js`) and mirrors the real playing/paused state
    via the `window` `"bgm:change"` event that file fires — not a
    locally-guessed toggle state, so it stays correct even if autoplay
    is blocked.
  - **Analytics & Cookie Access** closes the sheet and calls
    `window.showCookieConsent()` (exposed by `js/cookie-consent.js`) to
    re-open the cookie banner, letting a visitor change a choice they
    already made. See `reference/analytics.md`.
- **`css/style.css`** — `.settings-list`/`.settings-row` styles, right
  after the case-study sheet's own styles.

## Adding a real fourth row later

Replace the static "More settings coming soon" `<div class="settings-row
settings-row--static">` in index.html with a real `<button
class="settings-row">`, wire its click in `js/settings-sheet.js` the
same way the other two rows are wired, and give it a `<span>` hint on
the right if it needs one (see the existing rows for the exact markup
shape).
