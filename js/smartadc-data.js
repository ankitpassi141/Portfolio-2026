// All editable text for study/smartadc.html — the condensed public
// teaser (a hook, one image, a 3-item summary, a 4-stat metrics row, an
// honesty line, and a contact CTA). The full write-up lives in
// js/smartadc-raw-data.js / study/smartadc/raw/index.html instead.
// Edit strings here; js/smartadc.js reads this file and builds the
// whole page from it. See reference/smartadc-case-study.md.
window.CASE_STUDY = {
  pageTitle: "SmartADC — Ankit Passi",
  pageDescription: "Redesigning a virtual Assessment & Development Center workflow that cut setup time and error rate for HR & Ops teams.",
  backHref: "../index.html",
  backLabel: "← Back to home",
  roleTag: "**SmartADC · UX & Workflow Design**",

  hero: {
    title: "Everyone thought the problem was report generation. It wasn't.",
    intro: "Ops teams configured virtual assessment centers by hand — scheduling, criteria, sharing, reporting — across shared Excel sheets. The team's working theory was that report generation was the bottleneck. Research said otherwise.",
    liveTagPrefix: "Shipped · live at",
    liveTagLabel: "mettl.com/smartadc",
    liveTagHref: "https://mettl.com/virtual-assessment-center/"
  },

  // The one image this teaser shows — the same hero shot used atop the
  // full /raw write-up.
  figure: {
    photo: "hero-1.webp",
    alt: "SmartADC's linear configuration wizard with in-line, real-time validation replacing the old Excel-based workflow.",
    caption: "The linear wizard with in-line validation — built to enforce the sequence Excel never could."
  },

  strip: [
    { label: "**THE REDIRECT**", text: "Interviews with Ops and HR showed report generation was one symptom, not the cause. The real friction was upstream — scheduling and criteria-setting handled through error-prone spreadsheets." },
    { label: "**THE BUILD**", text: "A controlled, linear wizard with progressive disclosure and real-time in-line validation — designed to prevent the errors Excel let through, not just report on them after." },
    { label: "**STATUS**", text: "Shipped. Currently live in Mettl's virtual assessment center product, in production use by HR and Ops teams." }
  ],

  metrics: [
    { num: "−47.58%", label: "Time-to-completion for the full configuration workflow" },
    { num: "−26.19%", label: "Non-critical error rate during the workflow" },
    { num: "+14.28%", label: "Task success rate, completing the flow in one go" },
    { num: "+70%", label: "User pain score, self-reported via survey" }
  ],

  caveat: "**Honestly:** these figures come from a final round of validation testing against the same baseline sample group used at the start of the project — not live telemetry pulled after launch. The product has since shipped; I rolled off before tracking post-launch adoption data.",

  cta: {
    heading: "There's more underneath this",
    intro: "The full case study covers the research pivot in detail, the stakeholder trade-off on where validation lived in the interface, and how the baseline was measured. Message me and I'll send it over.",
    links: [
      { label: "Email me", href: "mailto:ankitpassi.design@gmail.com?subject=SmartADC%20case%20study", primary: true },
      { label: "Message on LinkedIn", href: "https://linkedin.com/in/ankitpassi", external: true }
    ]
  },

  footNote: "Ankit Passi · Product Design"
};
