# Case Study Pages — Reference

Case-study cards with a real `url` set (see the table below) skip the
built-in in-page write-up and open that URL instead — but **how** depends
on whether it's external or a page on this site:

- An **external URL** (`http://`/`https://`, e.g. a Framer link) opens on
  `case-study.html` — one shared page/template used for every external
  case study — instead of opening the URL directly. The URL loads inside
  that page's iframe, so the visitor's browser stays on this site's own
  address bar (`.../case-study.html?id=ib-engine`) rather than jumping
  straight to the external site's own URL.
- A **local path** (e.g. `study/automated-test.html`, a case study built
  natively on this site — see
  [automated-test-case-study.md](automated-test-case-study.md)) opens
  directly, no iframe wrapper — it's already on this site, and a native
  case study page has its own "Back to Home" header, so wrapping it in
  case-study.html's would just double it up. Write it as a **relative**
  path (no leading `/`) — the cards that use this `url` live in
  `index.html` and `case-studies.html`, both at the site root, so a plain
  relative path resolves correctly whether the site is served over a
  real web server or opened directly via `file://`. A leading `/`
  resolves to the machine's drive root under `file://` and breaks the
  link — see the "Path convention" note in
  [automated-test-case-study.md](automated-test-case-study.md) for the
  same issue inside the case-study pages themselves.

## To set or change a case study's URL

Edit [js/case-studies-data.js](../js/case-studies-data.js) and paste the
real link (external or local) into the matching entry's `url` field.
That's the only file you need to touch for an external URL —
`case-study.html` reads it automatically via the `?id=` in the link. A
local URL needs the actual page to exist too, of course.

| Case study | Key (`id`) | Where to edit |
|---|---|---|
| Assessment Generator | `one-plan`  | `js/case-studies-data.js` → `CASE_STUDIES["one-plan"]` (currently `study/automated-test.html`, native) |
| Power-BI Tool        | `ib-engine` | `js/case-studies-data.js` → `CASE_STUDIES["ib-engine"]` (currently a Framer link) |
| Assessment Centers   | `migration` | `js/case-studies-data.js` → `CASE_STUDIES["migration"]` (currently a Framer link) |

## How it works

- [js/case-sheet.js](../js/case-sheet.js)'s `wireCaseLinks()` sets each
  `[data-case]` card's `href` based on that split:
  `isLocalCaseUrl()` (no `http(s)://` scheme) sends it straight to the
  local URL; anything else goes through `case-study.html?id=<key>`.
  `syncFromHash()` does the same split for the drawer's `type: "case"`
  entries.
- For external URLs: every one reuses the same `case-study.html` file —
  only the `?id=` query string changes, so each effectively gets its own
  address (`case-study.html?id=<key>`) while staying on this one
  page/template. [js/case-study.js](../js/case-study.js) reads that `id`,
  looks up its `url` in `window.CASE_STUDIES`, and sets it as the
  iframe's `src`. If a URL refuses to be framed (some sites send an
  `X-Frame-Options`/CSP header that blocks embedding), you'll see a blank
  frame — there's no in-page fallback link for that case, so
  double-check embedding works before relying on a new external URL here.
- Leaving a card's `url` as `"#"` skips all of this and falls back to the
  built-in in-page write-up sheet (edit that content in
  [js/case-sheet.js](../js/case-sheet.js), inside the `CASES` object).
