# Favicon system

Generated with [RealFaviconGenerator](https://realfavicongenerator.net/)
and installed site-wide. The real icon files live in `images/favicon/`
and every one of the site's 15 HTML pages links to them.

## Files in `images/favicon/`

| File | Size | Purpose |
|---|---|---|
| `favicon.ico` | 16×16 + 32×32 (multi-size .ico) | Legacy fallback — old browsers, RSS readers, some crawlers |
| `favicon.svg` | vector | Modern browsers' tab icon — scales crisply at any size |
| `favicon-96x96.png` | 96×96 | Larger raster fallback (Chrome, Google search results) |
| `apple-touch-icon.png` | 180×180 | iOS "Add to Home Screen" icon |
| `web-app-manifest-192x192.png` | 192×192 | Android home-screen / PWA icon |
| `web-app-manifest-512x512.png` | 512×512 | Android splash screen / PWA icon |
| `site.webmanifest` | — | PWA metadata; points at the two `web-app-manifest-*.png` files above |

## Where it's wired in

Every page carries this block right after the viewport `<meta>` tag in
`<head>`:

```html
<link rel="icon" type="image/png" href="/images/favicon/favicon-96x96.png" sizes="96x96">
<link rel="icon" type="image/svg+xml" href="/images/favicon/favicon.svg">
<link rel="shortcut icon" href="/images/favicon/favicon.ico">
<link rel="apple-touch-icon" sizes="180x180" href="/images/favicon/apple-touch-icon.png">
<meta name="apple-mobile-web-app-title" content="Ankit Passi">
<link rel="manifest" href="/images/favicon/site.webmanifest">
<meta name="theme-color" content="#E7E4DA">
```

Paths are root-absolute (start with `/`), so the same block works
unchanged whether the page sits at the site root, in `study/`, or in
`study/*/raw/` — no per-depth `../` juggling needed. This only works
because the site deploys at the domain root (`ankitpassi.in/...`); if
that ever changes, the paths would need updating everywhere.

`theme-color` (`#E7E4DA`) matches `--paper` in `css/tokens.css` — the
color mobile browser chrome tints to match the site. Change both
together if the site's base surface color ever changes. It's not part
of RealFaviconGenerator's own output — added separately since it's a
natural companion to a favicon setup.

`site.webmanifest`'s `name`/`short_name` are set to "Ankit Passi" and
`theme_color`/`background_color` to the same `#E7E4DA`, overriding the
generator's own placeholder defaults.

## Regenerating the icons later

If you make a new favicon at RealFaviconGenerator, download its 7
files (same names as above) and drop them straight into
`images/favicon/`, overwriting what's there — the `<head>` markup and
file names don't need to change. Just re-check `site.webmanifest`
afterward, since a fresh download resets `name`/`theme_color` back to
the generator's placeholders and those need restoring to the values
above.

## Adding the block to a new page

If a 16th HTML page gets added later, copy the seven lines above into
its `<head>`, right after the viewport meta tag.
