# Case Study Pages — Reference

Case-study cards with a real URL set (see the table below) open on
`case-study.html` — one shared page/template used for every case study —
instead of opening the URL directly. The URL loads inside that page's
iframe, so the visitor's browser stays on this site's own address bar
(`.../case-study.html?id=one-plan`) rather than jumping straight to the
external site's own URL.

## To set or change a case study's URL

Edit [js/case-studies-data.js](../js/case-studies-data.js) and paste the
real link into the matching entry's `url` field. That's the only file you
need to touch — `case-study.html` reads it automatically via the `?id=` in
the link.

| Case study | Key (`id`) | Where to edit |
|---|---|---|
| Assessment Generator | `one-plan`  | `js/case-studies-data.js` → `CASE_STUDIES["one-plan"]` |
| Power-BI Tool        | `ib-engine` | `js/case-studies-data.js` → `CASE_STUDIES["ib-engine"]` |
| Assessment Centers   | `migration` | `js/case-studies-data.js` → `CASE_STUDIES["migration"]` |

## How it works

- Every case study reuses the same `case-study.html` file — only the `?id=`
  query string changes, so each case study effectively gets its own address
  (`case-study.html?id=<key>`) while staying on this one page/template.
- [js/case-study.js](../js/case-study.js) reads that `id`, looks up its
  `url` in `window.CASE_STUDIES`, and sets it as the iframe's `src`.
- If a URL refuses to be framed (some sites send an `X-Frame-Options`/CSP
  header that blocks embedding), you'll see a blank frame — there's no
  in-page fallback link for that case, so double-check embedding works
  before relying on a new URL here.
- Leaving a card's `url` as `"#"` skips this entirely and falls back to the
  built-in in-page write-up sheet (edit that content in
  [js/case-sheet.js](../js/case-sheet.js), inside the `CASES` object).
