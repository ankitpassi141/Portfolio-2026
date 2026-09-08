// All editable text for study/automated-test.html — the condensed
// public teaser (a hook, one image, a 3-item summary, a 4-stat metrics
// row, an honesty line, and a contact CTA). The full write-up lives in
// js/automated-test-raw-data.js / study/automated-test/raw/index.html
// instead. Edit strings here; js/automated-test.js reads this file and
// builds the whole page from it. See
// reference/automated-test-case-study.md.
window.CASE_STUDY = {
  pageTitle: "The Blueprint Generator — Ankit Passi",
  pageDescription: "An AI workflow for a B2B assessment platform — two rejected paths, and the hybrid solution neither side had considered.",
  backHref: "../index.html",
  backLabel: "← Back to home",
  roleTag: "**AI Workflow · Product Strategy**",

  hero: {
    title: "Engineering vetoed one plan. Product vetoed the other.",
    intro: "A B2B assessment platform's manual test builder was so complex it was driving away new business at the first impression. Two teams proposed two different AI-powered fixes — and both got blocked. I designed a third path that neither side had considered."
  },

  // The one image this teaser shows — the same hero shot used atop the
  // full /raw write-up.
  figure: {
    photo: "hero.webp",
    alt: "The Blueprint Generator interface, showing an AI-drafted assessment structure handed off into the existing manual test-building workflow.",
    caption: "**The Blueprint Generator**: Proprietary AI drafts the structure, the user reviews and edits it inside the workflow they already knew."
  },

  strip: [
    { label: "**THE IMPASSE**", text: "Engineering vetoed an embedded AI assistant as too complex to ship. Product vetoed a full generator as a threat to the platform's own roadmap. Both paths were dead." },
    { label: "**THE PROPOSAL**", text: "A hybrid \"Blueprint\": AI drafts a starting structure from a prompt, then hands the user into the existing manual builder, pre-filled - speed without giving up control." },
    { label: "**STATUS**", text: "Validated through moderated usability testing on a working prototype. The product hasn't shipped yet - there's no live usage data." }
  ],

  metrics: [
    { num: "~4.5 min", label: "Time-to-first-value, down from a critically high baseline" },
    { num: "92%", label: "Zero-intervention success rate (9 of 10 users), vs. a 90% goal" },
    { num: "1.8 / 7", label: "User effort score — \"very easy,\" down from \"very difficult\"" },
    { num: "95%", label: "Faster than the manual builder it replaced" }
  ],

  cta: {
    heading: "There's more underneath this",
    intro: "The full case study covers the research that quantified the problem, both rejected paths in detail, and the validation data behind the proposal. Message me and I'll send it over.",
    links: [
      { label: "Email me", href: "mailto:ankitpassi.design@gmail.com?subject=Blueprint%20Generator%20case%20study", primary: true },
      { label: "Message on LinkedIn", href: "https://linkedin.com/in/ankitpassi", external: true }
    ]
  },

  footNote: "Ankit Passi · Product Design"
};
