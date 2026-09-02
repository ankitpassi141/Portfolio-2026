# Footer Social Icons — Reference

The mobile footer (below 980px) shows icons instead of text labels for the
social links. Icons are your own SVG files — drop a replacement in
`images/icons/social/` using the same filename and it's picked up
automatically, no HTML/CSS changes needed.

| Social link | File | Currently |
|---|---|---|
| LinkedIn  | [images/icons/social/linkedin.svg](../images/icons/social/linkedin.svg)   | placeholder briefcase glyph |
| Instagram | [images/icons/social/instagram.svg](../images/icons/social/instagram.svg) | placeholder camera glyph |
| Email     | [images/icons/social/email.svg](../images/icons/social/email.svg)         | placeholder envelope glyph |

## How it renders

Each icon is drawn via a CSS `mask-image` (see `.pagefoot__link-icon--*` in
[css/style.css](../css/style.css)), not a plain `<img>`. That means:

- **Any single-color/flat SVG works** — only the shape's alpha (what's
  "filled" vs. transparent) matters. Fill color in the SVG itself is
  ignored.
- The icon automatically **inherits the link's color** — ink by default,
  cobalt on hover — matching the text-label treatment exactly, with no
  separate icon theming to maintain.
- Recommended: a 24×24 (or any square) viewBox, single `<path>`, comfortably
  inset from the edges so it doesn't look cramped at the 18×18px render
  size.

## To swap an icon

Just overwrite the file at the path in the table above (same filename). If
you want to change filenames instead, update the matching
`.pagefoot__link-icon--*` rule's `mask-image` url in
[css/style.css](../css/style.css) (search for `pagefoot__link-icon--`).
