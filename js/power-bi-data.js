// All editable text for study/power-bi.html — the condensed public
// teaser (a hook, one image, a 3-item summary, an honesty line, and a
// contact CTA). The full write-up lives in js/power-bi-raw-data.js /
// study/power-bi/raw/index.html instead. Edit strings here;
// js/power-bi.js reads this file and builds the whole page from it.
// See reference/power-bi-case-study.md.
window.CASE_STUDY = {
  pageTitle: "Unified Dashboard — Ankit Passi",
  pageDescription: "Redesigning a Power BI reporting platform's information architecture for a global FMCG's Sales and Finance teams.",
  backHref: "../index.html",
  backLabel: "← Back to home",
  roleTag: "**Power BI · IA & Design System**",

  hero: {
    title: "New hires needed a week just to find a number.",
    intro: "A Power BI reporting platform for a global FMCG's Sales and Finance teams had grown from one quick-view tool into 8–9 reports, three layers of drill-down deep, over 15 months. I redesigned the information architecture, the interaction model, and the visual system underneath it."
  },

  // The one image this teaser shows — the same hero shot used atop the
  // full /raw write-up.
  figure: {
    photo: "hero-1.png",
    alt: "Overview of the redesigned Power BI reporting dashboard.",
    caption: "The old structure mirrored the order reports were built in. This groups metrics by how they're actually used together."
  },

  strip: [
    { label: "**PROBLEM**", text: "Three levels of drill-down stood between the user and the number they needed. Nothing was visible without already knowing where to look." },
    { label: "**CHANGE**", text: "Replaced it with a two-tier structure: a persistent quick-glance section, plus two tabs that load pre-filtered, immediately visible views." },
    { label: "**HELD UP**", text: "The design token system built for this one section was later adopted across the entire Power BI reporting suite — not just the part I owned." }
  ],

  caveat: "**Honestly:** my work ended at handoff, before usage data existed — there's no adoption metric to point to. What I can point to is the suite-wide theme adoption above, and stakeholder sign-off at delivery.",

  cta: {
    heading: "There's more underneath this",
    intro: "The full case study covers where stakeholders pushed back — on navigation, on where disclaimers live — and how those got resolved. Message me and I'll send it over.",
    links: [
      { label: "Email me", href: "mailto:ankitpassi.design@gmail.com?subject=Power%20BI%20case%20study", primary: true },
      { label: "Message on LinkedIn", href: "https://linkedin.com/in/ankitpassi", external: true }
    ]
  },

  footNote: "Ankit Passi · Product Design"
};
