# Analytics & cookie consent

Microsoft Clarity, gated behind a consent banner, shared across every
page from one place — nothing is copy-pasted per-page.

## Where the Clarity ID lives

**`js/cookie-consent.js`**, near the top:

```js
const CLARITY_PROJECT_ID = "ygh28db06g";
```

That's the only place it appears. If you ever regenerate the Clarity
project, update it there and every page picks it up automatically.

## How it works

- `js/cookie-consent.js` and `css/cookie-consent.css` are linked on all
  15 HTML pages (root-absolute paths — `/js/cookie-consent.js` and
  `/css/cookie-consent.css` — so the same two lines work regardless of
  how deep the page sits).
- On a page with no stored choice yet, the script builds a small
  ~290px card, fixed bottom-right (24px margin). It's a plain
  DOM-injected element, not an iframe or a full-page overlay — the rest
  of the page stays interactive under it.
- **Accept all** → stores `localStorage["cookie-consent"] = "accepted"`,
  then runs Microsoft's own Clarity snippet (unmodified, just wrapped in
  a function so it only fires on demand) to start tracking.
- **Reject** → stores `"declined"`, banner closes, Clarity's snippet
  never runs. No `clarity.ms` request is ever made.
- On every later page load, the script checks that stored value first:
  `"accepted"` silently loads Clarity with no banner; `"declined"` does
  nothing; no value shows the banner again.
- Choice is stored in `localStorage` (not cookies, not a session) — it
  persists across pages and future visits on that browser, matching the
  "no need for granular categories, a static site can use localStorage"
  scope for this site.
- `loadClarity()` is idempotent (guarded by a `clarityLoaded` flag), so
  re-accepting after a decline never injects the snippet twice.

## Revisiting consent later

`window.showCookieConsent()` re-opens the banner on demand regardless of
any stored choice — this is what the Home page's Settings & Consent
sheet's "Analytics & Cookie Access" row calls (see js/settings-sheet.js).
Accepting or declining there overwrites the stored choice exactly like
the first-visit banner does.

## Resetting consent (for testing)

In the browser console on the site:

```js
localStorage.removeItem("cookie-consent");
```

Reload the page and the banner reappears.

## Styling

`css/cookie-consent.css` is its own small design system (white card,
system sans-serif font, colors like `#2b2924`/`#8a8478`/`#dcd8d1`) built
to a specific supplied spec — deliberately not the site's ink/paper/mono
palette from `css/tokens.css`. It's self-contained regardless, because
several pages (About, Experiments, Gaming & Exploration, Photo Gallery,
the three raw case studies) don't load `tokens.css` at all.
