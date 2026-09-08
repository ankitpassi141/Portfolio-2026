# Contact Popup Icons — Reference

The footer's "Let's Connect" button opens a small popup listing LinkedIn,
Instagram and Email, each with an icon on the left. Icons are your own SVG
files — drop a replacement in `images/icons/social/` using the same
filename and it's picked up automatically, no HTML/CSS changes needed.

Two pages have this: [index.html](../index.html) (Home) and
[about.html](../about.html) (About). Same markup pattern and behaviour on
both, but each page restyles `.contact-trigger`/`.contact-popup*` to match
its own visual system — Home's ink/cobalt tokens in
[css/style.css](../css/style.css), About's warm rust/paper palette in
[css/about.css](../css/about.css).

| Social link | File | Currently |
|---|---|---|
| LinkedIn  | [images/icons/social/linkedin.svg](../images/icons/social/linkedin.svg)   | placeholder briefcase glyph |
| Instagram | [images/icons/social/instagram.svg](../images/icons/social/instagram.svg) | placeholder camera glyph |
| Email     | [images/icons/social/email.svg](../images/icons/social/email.svg)         | placeholder envelope glyph |

## How it renders

Each icon is drawn via a CSS `mask-image` (see `.contact-popup__icon--*` in
[css/style.css](../css/style.css)), not a plain `<img>`. That means:

- **Any single-color/flat SVG works** — only the shape's alpha (what's
  "filled" vs. transparent) matters. Fill color in the SVG itself is
  ignored.
- The icon automatically **inherits the row's color** — ink by default,
  cobalt on hover — matching the text-label treatment exactly, with no
  separate icon theming to maintain.
- Recommended: a 24×24 (or any square) viewBox, single `<path>`, comfortably
  inset from the edges so it doesn't look cramped at the 16×16px render
  size.

## To swap an icon

Just overwrite the file at the path in the table above (same filename). If
you want to change filenames instead, update the matching
`.contact-popup__icon--*` rule's `mask-image` url in
[css/style.css](../css/style.css) (search for `contact-popup__icon--`).

## The popup itself

- Markup lives in each page's footer (`.contact-menu` — `#contactTrigger`
  button + `#contactPopup`). Each row is a `[data-social]` link, wired to
  `window.SOCIALS` (see [js/social-data.js](../js/social-data.js)) by
  [js/social-render.js](../js/social-render.js) — that's what sets the
  `href` and the `[data-social-hint]` text (the handle/URL shown under each
  label).
- Open/close behaviour (click to toggle, click-outside, Escape) lives in
  [js/contact-popup.js](../js/contact-popup.js) — shared as-is by both
  pages, since it only touches `#contactTrigger`/`#contactPopup` and has no
  page-specific styling of its own.
- To add this to a third page: copy the `.contact-menu` markup block from
  either page's footer, load `js/social-data.js`, `js/social-render.js` and
  `js/contact-popup.js`, and add `.contact-trigger`/`.contact-popup*` rules
  to that page's own stylesheet (copy one of the two existing blocks as a
  starting point and re-theme the colors).
