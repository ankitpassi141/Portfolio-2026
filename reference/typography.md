# Typography Reference

Every font, size, weight, line-height, letter-spacing and text-transform
used on the site, grouped by page, with breakpoint overrides called out
separately. Pulled directly from the CSS — if a value here ever looks
wrong, the CSS file cited is the source of truth, not this doc.

## How the site's type systems are organized

This site has **two kinds of pages**:

1. **Token-driven pages** — Home, Case Studies, Side Projects, the Case
   Study template, and Design System. All read their type values from
   [css/tokens.css](../css/tokens.css)'s custom properties (`--fs-*`,
   `--ls-*`, `--lh-*`, `--display-*`). **Change a value in tokens.css once
   and every page in this group updates together.** Power-BI's raw page
   also uses these tokens, though it isn't part of the bento-grid layout
   the others share.
2. **Bespoke pages** — About, Experiments, Gaming & Exploration, Photo
   Gallery, and all three case studies (both their public teaser and
   private raw versions) each carry their **own, self-contained** type
   system with hardcoded `px` values — changing tokens.css has **no
   effect** on these. Each was carried over from its own separate design
   handoff on purpose (see each page's own CSS header comment). To change
   type on one of these, edit that page's own CSS file directly.

Every section below names its file(s) up front so you know which bucket
you're in before you start editing.

---

## 0. Design tokens — css/tokens.css

The shared source for every token-driven page (section 1 below lists which
pages). Nothing here is page-specific — this table *is* the definition.

**Font families**
| Token | Value | Used for |
|---|---|---|
| `--font-display` | `'Archivo', sans-serif` (weights 700/800/900 loaded) | Headlines, wordmarks, big figures |
| `--font-mono` | `'Azeret Mono', monospace` (weights 400/500 loaded) | Body text, labels, nav, everything else |

**Sizes** (`--fs-*`)
| Token | Value | Typical use |
|---|---|---|
| `--fs-label` | 10.5px | Kickers, meta text, footer, uppercase tags |
| `--fs-nav` | 11px | Drawer/nav rows |
| `--fs-dense` | 10.5px | Dense table/checklist rows |
| `--fs-body` | 12px | Card prose |
| `--fs-body-sheet` | 12.5px | Case-sheet prose |
| `--fs-window-title` | 12.5px | Card title bars |
| `--fs-intro` | 13px | Design System page's intro paragraph only |
| `--fs-section-num` | 26px | Design System page's §01–§06 digits only |

**Display sizes** — all `clamp()`, so these are already fluid/responsive
without a media query (min, viewport-scaled, max):
| Token | Value | Used for |
|---|---|---|
| `--display-headline` | `clamp(22px, 2.5vw, 44px)` | Profile card headline |
| `--display-card` | `clamp(24px, 2.6vw, 44px)` | About card's big figure |
| `--display-feature` | `clamp(30px, 3.4vw, 58px)` | Work Gallery's metric figure |
| `--display-sheet` | `clamp(23px, 3.6vw, 45px)` | Case-sheet headline |
| `--display-wordmark` | `clamp(26px, 5.2vw, 74px)` | Footer wordmark |
| `--display-compact` | `clamp(22px, 2.2vw, 36px)` | Mentoring stat figures |
| `--display-doc-title` | `clamp(34px, 5vw, 68px)` | Design System masthead only |

**Letter-spacing** (`--ls-*` / `--tracking-*`)
| Token | Value |
|---|---|
| `--ls-label` | .08em |
| `--ls-nav` | .14em |
| `--ls-tight` | .06em (small-caps in tight metadata rows) |
| `--ls-numeral` | -.03em (Design System's §01–§06 digits only) |
| `--ls-window-title` | .01em |
| `--tracking-display` | -.045em (every `--display-*` size above) |

**Line-height** (`--lh-*`)
| Token | Value | Used for |
|---|---|---|
| `--lh-tight` | .8 | Feature figures, wordmark |
| `--lh-headline` | .9 | Profile headline |
| `--lh-card` | 1.6 | Card body prose |
| `--lh-sheet` | 1.8 | Case-sheet prose |
| `--lh-dense` | 1.5 | Dense rows |

No responsive overrides live in tokens.css itself — the `clamp()` display
sizes already scale continuously, so there's nothing that needs a
breakpoint-specific value here. (Layout, not type, is what changes at
breakpoints on the token-driven pages — see each page's own Breakpoints
note below for what that means for wrapping/line count.)

---

## 1. Home — index.html

**Files:** [css/tokens.css](../css/tokens.css) + [css/style.css](../css/style.css)
**Fonts loaded:** Archivo (700/800/900), Azeret Mono (400/500)

| Element | Selector | Font | Weight | Size | Line-height | Letter-spacing | Transform |
|---|---|---|---|---|---|---|---|
| Body/base | `html, body` | `--font-mono` | 400 | — | — | — | — |
| Topbar | `.topbar` | `--font-mono` | 400 | `--fs-label` (10.5px) | — | `--ls-label` | uppercase |
| Card title bar | `.card__title` | `--font-display` | 800 | `--fs-window-title` (12.5px) | — | `--ls-window-title` | uppercase |
| Card meta | `.card__bar-meta`, `.card__foot` | `--font-mono` | 500 (foot only) | `--fs-label` | — | `--ls-label` | uppercase |
| Profile eyebrow | `.profile__eyebrow` | `--font-mono` | 400 | `--fs-label` | — | `--ls-label` | uppercase |
| **Profile headline** | `.profile__headline` | `--font-display` | 900 | `--display-headline` (clamp 22–44px) | `--lh-headline` (.9) | `--tracking-display` | — |
| Profile bio | `.profile__bio` | `--font-mono` | 400 | `--fs-body` (12px) | `--lh-card` (1.6) | — | — |
| Tags | `.tag` | `--font-mono` | 400 | `--fs-label` | — | `--ls-label` | uppercase |
| Folder tab | `.folder__tab` | `--font-mono` | 400 | `--fs-label` | — | `--ls-label` | uppercase |
| **Feature figure** (metric, e.g. "-47.6%") | `.figure--feature` | `--font-display` | 900 | `--display-feature` (clamp 30–58px) | `--lh-tight` (.8) | `--tracking-display` | — |
| Figure caption | `.figure__caption`, `.folder__note` | `--font-mono` | 400 | `--fs-label` | 1.5 (note only) | `--ls-label` | uppercase |
| Table rows | `.folder__table-row` | `--font-mono` | 400 (500 label, 700 "to" value) | `--fs-dense` (10.5px) | — | — | — |
| Drawer rows | `.drawer__row` | `--font-mono` (inherit) | 400 | `--fs-nav` (11px) | — | `--ls-nav` (.14em) | uppercase |
| Experience org/role/span | `.experience__org` etc. | `--font-mono` | 500 (org), 400 (role/span) | `--fs-dense` | — | — | — |
| **Mentoring stat figure** | `.stat__figure` | `--font-display` | 900 | `--display-compact` (clamp 22–36px) | `--lh-tight` | `--tracking-display` | — |
| Stat label | `.stat__label` | `--font-mono` | 400 | `--fs-label` | — | `--ls-label` | uppercase |
| **About card figure** | `.about__figure` | `--font-display` | 900 | `--display-card` (clamp 24–44px) | **.78 (hardcoded, not a token)** | `--tracking-display` | — |
| About bio | `.about__bio` | `--font-mono` | 400 | `--fs-body` | `--lh-card` | — | — |
| **Footer wordmark** ("ANKIT PASSI") | `.wordmark` | `--font-display` | 900 | `--display-wordmark` (clamp 26–74px) | `--lh-tight` | `--tracking-display` | — |
| Footer links | `.pagefoot__links` | `--font-mono` | 400 | `--fs-label` | — | `--ls-label` | uppercase |
| Contact trigger ("Let's Connect") | `.contact-trigger` | `--font-mono` | 400 | `--fs-label` | — | `--ls-label` | uppercase |
| Contact popup label | `.contact-popup__label` | inherit | **700 (hardcoded)** | `--fs-label` | — | `--ls-label` | uppercase |
| Contact popup hint | `.contact-popup__hint` | `--font-mono` | 400 | `--fs-dense` | — | — | — |
| **Case-sheet headline** | `.sheet__headline` | `--font-display` | 900 | `--display-sheet` (clamp 23–45px) | **.94 (hardcoded)** | `--tracking-display` | — |
| Case-sheet body | `.sheet__section p`, `.sheet__item` | `--font-mono` | 400 | `--fs-body-sheet` (12.5px) | `--lh-sheet` (1.8) | — | — |
| Case-sheet section head | `.sheet__section h4` | `--font-mono` | **400 (overridden from inherited 400 explicitly)** | `--fs-nav` | — | `--ls-nav` | uppercase |

### Breakpoints (index.html / style.css)
No `font-size`/`line-height`/`letter-spacing` values change at any
breakpoint on this page — every size is already a fluid `clamp()` or a
fixed token. What *does* change at breakpoints is layout only:
- **1280–1365px**: Work Gallery's 3 folders stack vertically instead of
  side-by-side (type unaffected).
- **≤1279px**: cards reflow to a single column; the nav card becomes a
  hamburger-triggered overlay. Topbar switches from a single row to
  wrapped rows (`flex-wrap: wrap`) — still the same `--fs-label` type.
- **≤980px**: Experience/Mentoring cards go full-width; light theme is
  forced regardless of OS dark-mode.
- **1366px+ and max-height 820px**: layout-only scroll adjustment.

---

## 2. About — about.html

**File:** [css/about.css](../css/about.css) (fully self-contained — does **not** use tokens.css)
**Fonts loaded:** Fraunces (400/500/600/700/900, incl. italic 500), Newsreader (400/500, incl. italic 400), Azeret Mono (400/500)

| Element | Selector | Font | Weight | Size | Line-height | Letter-spacing | Transform |
|---|---|---|---|---|---|---|---|
| Body/base | `body` | `"Newsreader", Georgia, serif` | 400 | — | — | — | — |
| Back link | `.ohome` | `"Azeret Mono", monospace` | 400 | 11px | — | .1em | uppercase |
| **Hero wordmark** ("Ankit Passi") | `.cwordmark` | `"Fraunces", serif` | 900 | `clamp(52px, 10.5vw, 160px)` | .86 | -.01em | uppercase |
| Belief line | `.cbelief` | `"Azeret Mono", monospace` | 400 | 12.5px | 1.7 | .03em | — |
| Mission line | `.cmission` | `"Azeret Mono", monospace` | 400 | 13px | 1.75 | .02em | — |
| Bio kicker | `.aboutme .bio .kicker` | `"Azeret Mono", monospace` | 400 | 9.5px | — | .14em | uppercase |
| Bio paragraph | `.aboutme .bio p` | inherit (Newsreader) | 400 | 16.5px | 1.8 | — | — |
| Fact label | `.aboutme .facts .fact__label` | `"Azeret Mono", monospace` | 400 | 9px | — | .12em | uppercase |
| **Fact value** | `.aboutme .facts .fact__value` | `"Fraunces", serif` | 700 | 17px | — | -.01em | — |
| Hobbies heading | `.obhead` | `"Azeret Mono", monospace` | 400 | 10px | — | .16em | uppercase |
| Hobby card meta | `.lmeta` | `"Azeret Mono", monospace` | 400 | 9px | — | .08em | uppercase |
| **Hobby card title** | `.ltitle` | `"Fraunces", serif` | 700 | 17px | — | -.01em | — |
| Q&A question | `.q` | `"Azeret Mono", monospace` | 400 | 10.5px | 1.6 | .07em | uppercase |
| Q&A answer | `.a` | inherit (Newsreader) | 400 | 17px | 1.85 | — | — |
| Tag-cloud label | `.lbl` | `"Azeret Mono", monospace` | 400 | 10px | — | .14em | uppercase |
| **Tag-cloud items** | `.ltags span` | `"Fraunces", serif` | 400, *italic* | 15px | — | — | — |
| Footer | `footer span, footer a` | `"Azeret Mono", monospace` | 400 | 10px | — | .1em | uppercase |
| Contact trigger ("Let's Connect") | `.contact-trigger` | `"Azeret Mono", monospace` | 400 | 10px | — | .1em | uppercase |
| Contact popup label | `.contact-popup__label` | `"Azeret Mono", monospace` | **700 (hardcoded)** | 10px | — | .08em | uppercase |
| Contact popup hint | `.contact-popup__hint` | `"Azeret Mono", monospace` | 400 | 9.5px | — | — | — |

### Breakpoints (about.html / about.css)
No type values change at either breakpoint (≤820px, ≤520px) — only layout
does (hero column stacks, thumbnail/hobby grids adjust column count,
Q&A's sticky question column becomes static). Font sizes, weights, and
letter-spacing are identical at every width.

---

## 3. Case Studies — case-studies.html

**Files:** [css/tokens.css](../css/tokens.css) + [css/style.css](../css/style.css) (shared `.card`/`.folder`/`.sheet` components) + [css/pages.css](../css/pages.css) (shared sub-page chrome) + [css/case-studies.css](../css/case-studies.css) (layout only, no type of its own)
**Fonts loaded:** Archivo (700/800/900), Azeret Mono (400/500)

This page reuses the exact same card/folder/sheet type roles as Home
(section 1) — case-studies.css itself declares no typography at all, only
grid layout. New type role introduced by pages.css's shared sub-page
chrome:

| Element | Selector | Font | Weight | Size | Line-height | Letter-spacing | Transform |
|---|---|---|---|---|---|---|---|
| Sub-page topbar | `.subtopbar` | `--font-mono` (inherited) | 400 | `--fs-label` | — | `--ls-label` | uppercase |
| Icon chip | `.icon-chip` | `--font-mono` | 400 | `--fs-dense` | 1 | — | — |

### Breakpoints (case-studies.html)
`≤980px`: layout switches from fixed 100dvh to scrollable `auto` height —
no type changes. The Work Gallery folder card grid (shared with Home)
also reflows to 1 column at `≤980px` (defined in case-studies.css, layout
only).

---

## 4. Side Projects — side-projects.html

**Files:** [css/tokens.css](../css/tokens.css) + [css/style.css](../css/style.css) + [css/pages.css](../css/pages.css) + [css/side-projects.css](../css/side-projects.css)
**Fonts loaded:** Archivo (700/800/900), Azeret Mono (400/500)

Sub-page topbar type role is the same as section 3. Page-specific type
(from side-projects.css):

| Element | Selector | Font | Weight | Size | Line-height | Letter-spacing | Transform |
|---|---|---|---|---|---|---|---|
| **Sidebar headline** | `.sidebar__headline` | `--font-display` | 900 | `--display-headline` (clamp 22–44px) | **.88 (hardcoded)** | `--tracking-display` | — |
| Sidebar bio | `.sidebar__bio` | `--font-mono` (inherited) | 400 | `--fs-body` | `--lh-card` | — | — |
| Nav-list row | `.navlist__row` | `--font-mono` | 400 (500 for value) | `--fs-dense` | — | `--ls-label` (label span only) | uppercase (label span only) |
| Nav-list action | `.navlist__action` | `--font-mono` (inherited) | 500 | `--fs-label` | — | `--ls-label` | uppercase |
| Drag-wall hint | `.wall__hint` | `--font-mono` | 400 | `--fs-label` | — | `--ls-label` | uppercase |
| **Project card title** | `.pcard__title` | `--font-display` | 800 | `--fs-window-title` (12.5px) | — | `--ls-window-title` | uppercase |
| Project card desc | `.pcard__desc` | `--font-mono` (inherited) | 400 | `--fs-label` | 1.5 | — | — |
| Project card thumb placeholder | `.pcard__thumb` | `--font-mono` | 400 | `--fs-label` | — | `--ls-label` | uppercase |

### Breakpoints (side-projects.html)
`≤980px`: sidebar + wall stack vertically instead of side-by-side (layout
only, no type changes).

---

## 5. Case Study template — case-study.html

**Files:** [css/tokens.css](../css/tokens.css) + [css/style.css](../css/style.css) + [css/case-study.css](../css/case-study.css)
**Fonts loaded:** Archivo (700/800/900), Azeret Mono (400/500)
**Note:** this is the shared iframe-wrapper template for any *external*
case-study URL (see [reference/case-studies.md](case-studies.md)) — none
of the three real case studies currently use it, since all three are
native pages now.

| Element | Selector | Font | Weight | Size | Line-height | Letter-spacing | Transform |
|---|---|---|---|---|---|---|---|
| Top bar / breadcrumbs | `.case-page__bar`, `.crumbs` | `--font-mono` (inherited) | 400 | `--fs-label` | — | `--ls-label` | uppercase |

No other type roles — the page is just a topbar + a full-bleed iframe.

### Breakpoints
None — this page is deliberately fixed at 100dvh on every screen size (see
the CSS file's own header comment), so nothing reflows or changes size.

---

## 6. Design System — design-system.html

**Files:** [css/tokens.css](../css/tokens.css) + [css/design-system.css](../css/design-system.css)
**Fonts loaded:** Archivo (700/800/900), Azeret Mono (400/500)
**Note:** this page *documents* the tokens from section 0 visually — its
own type (below) is the chrome around that documentation, not the tokens
themselves.

| Element | Selector | Font | Weight | Size | Line-height | Letter-spacing | Transform |
|---|---|---|---|---|---|---|---|
| Body/base | `body` | `--font-mono` | 400 | — | — | — | — |
| Header meta | `.ds-header__meta` | `--font-mono` (inherited) | 400 | `--fs-label` | — | `--ls-label` | uppercase |
| **Masthead** ("Tokens, and how to change them") | `.ds-header h1` | `--font-display` | 900 | `--display-doc-title` (clamp 34–68px) | **.86 (hardcoded)** | `--tracking-display` | — |
| Intro paragraph | `.ds-header p` | `--font-mono` (inherited) | 400 | `--fs-intro` (13px) | 1.75 | — | — |
| Home link | `.ds-header .home-link` | `--font-mono` (inherited) | 400 | `--fs-label` | — | `--ls-label` | uppercase |
| **Section number** ("01"–"06") | `.section__num span` | `--font-display` | 900 | `--fs-section-num` (26px) | — | `--ls-numeral` (-.03em) | — |
| Section heading | `.section__num h2` | `--font-mono` (inherited) | 400 | `--fs-nav` | — | `--ls-nav` | uppercase |
| Rules-box label | `.rules-box__label` | `--font-mono` (inherited) | 400 | `--fs-label` | — | `--ls-label` | uppercase |
| Rules-box list | `.rules-box__list` | `--font-mono` (inherited) | 400 | `--fs-body` | 1.7 | — | — |
| Table head | `.table__head` | `--font-mono` (inherited) | 400 | `--fs-label` | — | `--ls-label` | uppercase |
| Table row | `.table__row` | `--font-mono` (inherited) | 400 (first cell 500) | `--fs-body` | 1.6 (cells 2/3/4) | — | — |
| Table foot note | `.table__foot` | `--font-mono` (inherited) | 400 | `--fs-body` | 1.7 | — | — |
| Swatch name | `.swatch__name` | `--font-mono` (inherited) | 400 (first span 500) | `--fs-nav` | — | `--ls-tight` | uppercase |
| Swatch hex/use | `.swatch__hex`, `.swatch__use` | `--font-mono` (inherited) | 400 | `--fs-nav` / `--fs-body` | — / 1.6 | — | — |
| Type-row name | `.type-row__name` | `--font-mono` (inherited) | 500 | `--fs-nav` | — | `--ls-label` | uppercase |
| Type-row spec/use | `.type-row__spec`, `.type-row__use` | `--font-mono` (inherited) | 400 | `--fs-nav` / `--fs-body` | — / 1.65 | — | — |
| Spacing panel label | `.panel__label` | `--font-mono` (inherited) | 400 | `--fs-label` | — | `--ls-label` | uppercase |
| Space-row px value | `.space-row__px` | `--font-mono` (inherited) | 500 | `--fs-nav` | — | — | — |
| Space-row use | `.space-row__use` | `--font-mono` (inherited) | 400 | `--fs-body` | 1.5 | — | — |
| Border-row | `.border-row` | `--font-mono` (inherited) | 400 | `--fs-body` | 1.6 | — | — |
| Component head | `.component__head` | `--font-mono` (inherited) | 400 (first span 500) | `--fs-nav` | — | `--ls-tight` | uppercase |
| Component anatomy/rule | `.component__anatomy`, `.component__rule` | `--font-mono` (inherited) | 400 | `--fs-body` / `--fs-nav` | 1.65 / 1.6 | — | — |
| Prose box | `.prose-box` | `--font-mono` (inherited) | 400 (bold via `<strong>` 700) | `--fs-body-sheet` | 1.75 | — | — |

### Breakpoints
None declared in design-system.css — every column/grid on this page uses
`repeat(auto-fit, minmax(...))`, so it reflows continuously without a
media query, and no type value changes at any width.

---

## 7. Experiments — experiments.html

**File:** [css/experiments.css](../css/experiments.css) (fully self-contained)
**Fonts loaded:** Azeret Mono (400/500/600), Anton, Poppins (400/500)

| Element | Selector | Font | Weight | Size | Line-height | Letter-spacing | Transform |
|---|---|---|---|---|---|---|---|
| Back link | `.xback` | `"Azeret Mono", monospace` | 400 | 12px | — | .08em | uppercase |
| **Title** | `.xtitle` | `"Anton", sans-serif` | 400 | `clamp(40px, 7vw, 80px)` | 1 | .02em | uppercase |
| Subtitle | `.xsubtitle` | `"Poppins", sans-serif` | 400 | 16px | 1.5 | — | — |
| Clock | `.xclock` | `"Azeret Mono", monospace` | 400 | 13px | — | .04em | — |
| Card name | `.xcard__name` | inherit (Azeret Mono) | 600 | 15px | — | .01em | — |
| Card description | `.xcard__desc` | inherit (Azeret Mono) | 400 | 12.5px | 1.55 | — | — |
| Card link ("Open →") | `.xcard__link` | inherit (Azeret Mono) | 400 | 12.5px | — | .03em | — |
| Card close button | `.xcard__close` | `"Azeret Mono", monospace` | 400 | 16px | 1 | — | — |

### Breakpoints
None in experiments.css itself — no `font-size`/type media query exists
on this page at all (the `.bgm-toggle--floating` override here is a
*position* change, not typographic).

---

## 8. Gaming & Exploration — gaming-gallery.html

**File:** [css/gallery.css](../css/gallery.css) (fully self-contained — "Infinite Fold" drag-to-pan gallery)
**Fonts loaded:** Space Grotesk (500/700), DM Mono (400/500)

| Element | Selector | Font | Weight | Size | Line-height | Letter-spacing | Transform |
|---|---|---|---|---|---|---|---|
| Base | `.fold-root` | `'DM Mono', monospace` | 400 | — | — | — | — |
| Card title | `.fold-card__title` | inherit (DM Mono) | 400 | 10px | 1.3 | .13em | uppercase |
| Card place | `.fold-card__place` | inherit (DM Mono) | 400 | 8.5px | 1.3 | .16em | uppercase |
| Card tech | `.fold-card__tech` | inherit (DM Mono) | 400 | 8.5px | 1.3 | .16em | uppercase |
| Home link text | `.fold-home` | inherit (DM Mono) | 400 | 8.5px | — | .16em | uppercase |
| Home link arrow | `.fold-home__arrow` | `'Space Grotesk', sans-serif` | 400 | 11px | — | — | — |
| Drag hint | `.fold-hint` | inherit (DM Mono) | 400 | 9.5px | — | .22em | uppercase |
| **"Now viewing" title** | `.fold-now__title` | `'Space Grotesk', sans-serif` | 500 | 13px | 1.25 | -.005em | — |
| "Now viewing" meta | `.fold-now__meta` | inherit (DM Mono) | 400 | 8.5px | 1.35 | .16em | uppercase |
| Lightbox close (×) | `.fold-focus__close` | inherit (DM Mono) | 400 | 16px | 1 | — | — |
| **Lightbox title** | `.fold-focus__title` | `'Space Grotesk', sans-serif` | 500 | 17px | — | -.005em | — |
| Lightbox place | `.fold-focus__place` | inherit (DM Mono) | 400 | 9px | — | .16em | uppercase |
| Lightbox tech | `.fold-focus__tech` | inherit (DM Mono) | 400 | 9px | 1.4 | .16em | uppercase |
| Lightbox release hint | `.fold-focus__release` | inherit (DM Mono) | 400 | 8.5px | — | .2em | uppercase |

### Breakpoints
`≤820px`: only `.fold-now`'s `max-width` changes (60vw) — no font size,
weight, or spacing changes at any width on this page.

---

## 9. Photo Gallery — photo-gallery.html

**File:** [css/gaming.css](../css/gaming.css) (fully self-contained — cursor-trail brutalist yellow canvas; confusingly named, see [reference/gaming-exploration.md](gaming-exploration.md) for why)
**Fonts loaded:** Anton, Space Mono (400/700)

| Element | Selector | Font | Weight | Size | Line-height | Letter-spacing | Transform |
|---|---|---|---|---|---|---|---|
| Base | `.gm-root` | `'Space Mono', monospace` | 400 | — | — | — | — |
| Home link | `.gm-home` | inherit (Space Mono) | **700** | 12px | — | .12em | uppercase |
| Size-readout label | `.gm-size__label` | inherit (Space Mono) | **700** | 9px | — | .14em | uppercase |
| **Size-readout value** ("100%") | `.gm-size__value` | `Anton, sans-serif` | 400 | 22px | 1 | .01em | — |
| Size-reset button | `.gm-size__reset` | inherit (Space Mono) | **700** | 11px | — | .12em | uppercase |
| Drag hint | `.gm-hint` | inherit (Space Mono) | **700** | 11px | — | .2em | uppercase |
| Empty state | `.gm-empty` | inherit (Space Mono) | 400 | 13px | 1.6 | — | — |
| Empty state `<code>` | `.gm-empty code` | `'Space Mono', monospace` | 400 | — (inherits 13px) | — | — | — |

### Breakpoints
`≤640px`: only `.gm-home`/`.gm-size` padding and position shift — no font
size, weight, or spacing changes.

---

## 10–15. Case studies — public teasers (SmartADC, Assessment Generator, Power-BI)

**Files:** [css/smartadc.css](../css/smartadc.css) / [css/automated-test.css](../css/automated-test.css) / [css/power-bi.css](../css/power-bi.css) — all three are near-identical templates (same type roles/sizes), differing only in `--accent` color and a couple of `max-width` tweaks per headline.
**Fonts loaded (all three):** Fraunces (400/500/600, optical sizing), IBM Plex Sans (400/500/600), IBM Plex Mono (400/500)

| Element | Selector | Font | Weight | Size | Line-height | Letter-spacing | Transform |
|---|---|---|---|---|---|---|---|
| Body/base | `body` | `'IBM Plex Sans', sans-serif` | 400 | — | — | — | — |
| Back link | `.back` | inherit (IBM Plex Sans) | 400 | 14px | — | — | — |
| Role tag | `.role-tag` | `'IBM Plex Mono', monospace` | 400 | 12px | — | .02em | — |
| **Hero headline** | `.hero h1` | `'Fraunces', serif` | 500 | `clamp(32px, 5vw, 48px)` | 1.12 | -.01em | — |
| Hero intro | `.hero p` | inherit (IBM Plex Sans) | 400 | 17px | 1.6 | — | — |
| Live tag (SmartADC only — "Shipped · live at...") | `.live-tag` | `'IBM Plex Mono', monospace` | 400 | 12px | — | — | — |
| Figure caption | `figcaption` | inherit (IBM Plex Sans) | 400 | 13px | — | — | — |
| Strip label ("THE PROBLEM" etc.) | `.strip .k` | `'IBM Plex Mono', monospace` | 400 | 11px | — | — | uppercase (via data, not CSS) |
| Strip text | `.strip p` | inherit (IBM Plex Sans) | 400 | 14.5px | 1.55 | — | — |
| **Metric number** (Assessment Generator/SmartADC only — Power-BI has no `.metrics`) | `.metrics .num` | `'Fraunces', serif` | 500 | `clamp(22px, 3.4vw, 30px)` | 1.1 | — | — |
| Metric label | `.metrics .lbl` | inherit (IBM Plex Sans) | 400 | 12.5px | 1.4 | — | — |
| Caveat ("Honestly:...") | `.caveat` | inherit (IBM Plex Sans) | 400 (bold run 500) | 14.5px | 1.6 | — | — |
| **CTA heading** | `.cta h2` | `'Fraunces', serif` | 500 | 26px | — | — | — |
| CTA intro | `.cta p` | inherit (IBM Plex Sans) | 400 | 15px | 1.6 | — | — |
| CTA links | `.cta-links a` | inherit (IBM Plex Sans) | 400 (primary 500) | 14.5px | — | — | — |
| Footer | `footer p` | inherit (IBM Plex Sans) | 400 | 12.5px | — | — | — |

Max-width differences on `.hero h1` (doesn't affect size, only wrap
point): SmartADC 16ch, Assessment Generator 15ch, Power-BI 14ch.

### Breakpoints (all three teasers)
`≤640px`: `.strip` and `.metrics` switch from a 3/4-column grid to
1-column (2-column for `.metrics`) — **layout only, no font-size/weight/
letter-spacing changes** at this breakpoint on any of the three pages.

---

## 12/14/16. Case studies — private `/raw` pages

Each raw page has its **own distinct** bespoke system (not shared with
its public teaser, and not shared with each other) — see each page's own
CSS header comment for why.

### SmartADC raw — study/smartadc/raw/index.html
**File:** [css/smartadc-raw.css](../css/smartadc-raw.css) (neubrutalist — same visual language as Photo Gallery)
**Fonts loaded:** Anton, Space Mono (400/700)

| Element | Selector | Font | Weight | Size | Line-height | Letter-spacing | Transform |
|---|---|---|---|---|---|---|---|
| Body/base | `body` | `"Space Mono", monospace` | 400 | — | — | — | — |
| Eyebrow / backlink | `.sa-label`, `.sa-backlink` | `"Space Mono", monospace` | **700** | 11px | — | .06em / .08em | uppercase |
| Private badge | `.sa-private-badge` | `"Space Mono", monospace` | **700** | 10px | — | .06em | uppercase |
| **Page title** | `.sa-title` | `"Anton", sans-serif` | 400 | `clamp(34px, 5.8vw, 66px)` | 1 | -.01em | uppercase |
| Body paragraph | `.sa-p` | `"Space Mono", monospace` | 400 | 15px | 1.7 | — | — |
| Dek (intro line) | `.sa-dek` | inherit (`.sa-p`) | **700** | 17px | (1.7 via `.sa-p`) | — | — |
| **H2** | `.sa-h2` | `"Anton", sans-serif` | 400 | `clamp(24px, 3.2vw, 34px)` | — | — | uppercase |
| **H3** | `.sa-h3` | `"Anton", sans-serif` | 400 | 22px | — | — | uppercase |
| Footnote | `.sa-footnote` | `"Space Mono", monospace` | 400, *italic* | 13px | 1.6 | — | — |
| Table header | `table.sa-table th` | `"Space Mono", monospace` | **700** | 11px | — | .06em | uppercase |
| Table cell | `table.sa-table td` | `"Space Mono", monospace` | 400 | 14px | 1.55 | — | — |
| Video embed label | `.sa-video` | `"Space Mono", monospace` | **700** | 12px | — | .05em | uppercase |
| Learnings title | `.sa-learnings__title` | inherit | **700** | 15px | — | — | uppercase |
| Learnings cell | `.sa-learnings__cell` | `"Space Mono", monospace` | 400 | 14px | 1.5 | — | — |
| Footer back / socials | `.sa-foot__back`, `.sa-foot__socials` | `"Space Mono", monospace` | **700** | 12px | — | .08em | uppercase |
| Lightbox close (×) | `.sa-lightbox__close` | `"Space Mono", monospace` | **700** | 20px | 1 | — | — |

**Breakpoints:** `≤820px`/`≤520px` change `.sa-overview`/`.sa-learnings__row`
column counts only — no type values change.

### Assessment Generator raw — study/automated-test/raw/index.html
**File:** [css/automated-test-raw.css](../css/automated-test-raw.css) (editorial serif/mono)
**Fonts loaded:** Fraunces (400/600/700/900 — *loaded but not actually used anywhere in this CSS file*), Azeret Mono (400/500/600/700), Oswald (400/500/600/700), Inter (400/500/600)

| Element | Selector | Font | Weight | Size | Line-height | Letter-spacing | Transform |
|---|---|---|---|---|---|---|---|
| Body/base | `body` | `"Inter", sans-serif` | 400 | — | — | — | — |
| Eyebrow | `.cs-label` | `"Azeret Mono", monospace` | **700** | 11px | — | .06em | uppercase |
| Backlink | `.cs-backlink` | `"Azeret Mono", monospace` | 400 | 11px | — | .08em | uppercase |
| Private badge | `.cs-private-badge` | `"Azeret Mono", monospace` | **700** | 10px | — | .06em | uppercase |
| **Page title** | `.cs-title` | `"Oswald", sans-serif` | 600 | `clamp(32px, 5.6vw, 64px)` | 1 | -.01em | uppercase |
| Body paragraph | `.cs-p` | `"Inter", sans-serif` | 400 | 16px | 1.6 | — | — |
| Dek | `.cs-dek` | inherit (`.cs-p`) | 400 | 19px | (1.6 via `.cs-p`) | — | — |
| Findings list | `.cs-findings` | `"Inter", sans-serif` | 400 | 16px | 1.6 | — | — |
| **H2** | `.cs-h2` | `"Oswald", sans-serif` | 600 | `clamp(24px, 3vw, 32px)` | — | — | — |
| **H3** | `.cs-h3` | `"Oswald", sans-serif` | 500 | 24px | — | — | — |
| Footnote | `.cs-footnote` | `"Inter", sans-serif` | 400, *italic* | 13.5px | 1.6 | — | — |
| Table header | `table.cs-table th` | `"Azeret Mono", monospace` | **700** | 11px | — | .06em | uppercase |
| Table cell | `table.cs-table td` | `"Inter", sans-serif` | 400 | 15px | 1.55 | — | — |
| Table "stat" cell | `td.cs-stat` | `"Azeret Mono", monospace` | **700** | (inherits 15px) | — | — | — |
| Figma embed label | `.cs-figma` | `"Azeret Mono", monospace` | 400 | 12px | — | .05em | uppercase |
| Quote | `.cs-quote p` | `"Inter", sans-serif` | 400, *italic* | 17px | 1.6 | — | — |
| Learnings title | `.cs-learnings__title` | inherit (Inter) | 600 | 16px | — | — | — |
| Learnings cell | `.cs-learnings__cell` | `"Inter", sans-serif` | 400 | 15px | 1.5 | — | — |
| Footer back / socials | `.cs-foot__back`, `.cs-foot__socials` | `"Azeret Mono", monospace` | **700** | 12px | — | .08em | uppercase |

**Breakpoints:** `≤820px`/`≤520px` change `.cs-overview`/`.cs-paths`/
`.cs-cards`/`.cs-steps`/`.cs-quote-group__grid`/`.cs-learnings__row`
column counts only — no type values change.

### Power-BI raw — study/power-bi/raw/index.html
**Files:** [css/tokens.css](../css/tokens.css) + [css/power-bi-raw.css](../css/power-bi-raw.css) — the one raw page that reuses the site's own design tokens instead of a bespoke system (deliberately, to "look like the rest of the portfolio" — see the file's own header comment)
**Fonts loaded:** Archivo (700/800/900), Azeret Mono (400/500)

| Element | Selector | Font | Weight | Size | Line-height | Letter-spacing | Transform |
|---|---|---|---|---|---|---|---|
| Body/base | `body` | `--font-mono` | 400 | — | — | — | — |
| Eyebrow | `.pb-label` | `--font-mono` | 500 | `--fs-label` | — | `--ls-label` | uppercase |
| Backlink | `.pb-backlink` | `--font-mono` | 400 | `--fs-nav` | — | `--ls-nav` | uppercase |
| Private badge | `.pb-private-badge` | `--font-mono` | 500 | 10px | — | .06em | uppercase |
| **Page title** | `.pb-title` | `--font-display` | 900 | `--display-headline` (clamp 22–44px) | `--lh-headline` | `--tracking-display` | — |
| Body paragraph | `.pb-p` | `--font-mono` (inherited) | 400 | 13px | 1.75 | — | — |
| Dek | `.pb-dek` | inherit (`.pb-p`) | 500 | 15px | (1.75 via `.pb-p`) | — | — |
| **H2** | `.pb-h2` | `--font-mono` | 500 | `--fs-nav` (11px) | — | `--ls-nav` | uppercase |
| **H3** | `.pb-h3` | `--font-display` | 800 | 20px | — | `--tracking-display` | — |
| H4 | `.pb-h4` | `--font-mono` | 500 | `--fs-nav` | — | `--ls-nav` | uppercase |
| Overview item | `.pb-overview__item .pb-p` | inherit (`.pb-p`) | 400 | 12.5px | (1.75 via `.pb-p`) | — | — |
| Table header | `table.pb-table th` | `--font-mono` | 500 | 10px | — | .08em | uppercase |
| Table cell | `table.pb-table td` | `--font-mono` | 400 | 12.5px | 1.65 | — | — |
| List item | `.pb-list li` | inherit (`.pb-p`) | 400 | 13px | 1.7 | — | — |
| Footer back / socials | `.pb-foot__back`, `.pb-foot__socials` | `--font-mono` | 400 | `--fs-nav` | — | `--ls-nav` | uppercase |

**Breakpoints:** `≤820px`/`≤520px` change `.pb-overview` column count only
— no type values change. Because this page reuses tokens.css, a token
change made in section 0 (e.g. `--fs-label`) affects this page too, even
though it's visually presented as a "raw"/private page.

---

## Quick-reference: "I want to change X everywhere"

| I want to change... | Edit this |
|---|---|
| Body text size/font on Home, Case Studies, Side Projects, Case Study template, Design System | `--fs-body` / `--font-mono` in [css/tokens.css](../css/tokens.css) |
| All-caps label size/tracking on those same pages | `--fs-label` / `--ls-label` in tokens.css |
| Any headline size on those same pages | the relevant `--display-*` token in tokens.css |
| About page's entire type system | [css/about.css](../css/about.css) only |
| One case study's accent color (not type) | that file's own `--accent` (see each teaser CSS's header comment) |
| One case study's headline/body font | that file's own `body`/`.hero h1`/`h2`/`h3` rules directly — no shared token |
| The floating/inline music toggle or Contact popup type | [css/background-music.css](../css/background-music.css) / the `.contact-*` rules in [css/style.css](../css/style.css) (About has its own copy in about.css) |
