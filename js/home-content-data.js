// Editable copy for the Home page's Profile, Work Gallery, About and
// drawer ("What else I'm upto!") cards. Change text here — no HTML/CSS
// knowledge needed — and the page picks it up automatically. Profile,
// About and the drawer are rendered by js/main.js; Work Gallery is
// rendered by js/gallery-render.js (also reused by the All Case Studies
// page, so its content applies there too).

window.PROFILE = {
  eyebrow: "Eight years · Still Learning!",
  headline: "Designing products to protect innocents from AI slop!",
  bio: "Six years on assessment products, now enroute to solve problems for an enterprise level.",
  tags: ["Product Design", "0→1", "UX Research"],
  footLeft: "Product Designer in Action",
  footRight: "Since 2015"
};

// Work Gallery — each card: a tab label, a metric (split into the big
// number and an optional smaller unit, e.g. metric:"95", metricUnit:"%"),
// a 2-line caption, a before → after comparison table, a short methodology
// footnote, and a CTA. `variant` (1/2/3) picks the tab's colour identity —
// leave it matched to `id` unless you're deliberately reordering the cards.
window.WORK_GALLERY = {
  count: "03",
  cards: [
    {
      id: "one-plan",
      variant: 1,
      tab: "Assessment Generator",
      metric: "95",
      metricUnit: "%",
      metricCaption: "Reduction in assessment creation time",
      comparisons: [
        { label: "New user", from: "90m", to: "4.5m" },
        { label: "Expert", from: "25m", to: "4.5m" },
        { label: "Success", from: "40%", to: "92%" }
      ],
      note: "Validated & Adopted by clients",
      cta: "See how it works!"
    },
    {
      id: "ib-engine",
      variant: 2,
      tab: "Power-BI Dashboard",
      metric: "9 → 1",
      metricCaption: "One system replacing 15 months of scope creep",
      comparisons: [
        { label: "Drill levels", from: "3", to: "2" },
        { label: "Onboarding", from: "1 wk", to: "None" },
        { label: "Style guides", from: "9", to: "1" }
      ],
      note: "System adopted suite-wide",
      cta: "See the changes!"
    },
    {
      id: "migration",
      variant: 3,
      tab: "Assessment centers",
      metric: "47.6",
      metricUnit: "%",
      metricCaption: "Faster time-to-completion",
      comparisons: [
        { label: "Setup time", from: "12.4m", to: "6m" },
        { label: "Error rate", from: "35.7%", to: "9.5%" },
        { label: "Task success", from: "71%", to: "86%" }
      ],
      note: "Workflow adopted by HR & Ops admins",
      cta: "Workflow in Action"
    }
  ]
};

// About card (Home page) — the image + text side-by-side card that links
// to about.html. `figure`/`figureLabel` is the big stat, `bio` the short
// paragraph, and `ctaLeft`/`ctaRight` the footer row at the bottom.
window.ABOUT_CARD = {
  figure: "08",
  figureLabel: "Years, Learning constantly",
  bio: "Learn about my design journey & a little about me! Hiring, or after a second pair of eyes? Write.",
  ctaLeft: "Learn more about me",
  ctaRight: "→"
};

// Mentoring card. `stats` fills the 2×2 number grid (accent:true colours
// it cobalt, like the first row here). `noteLeft`/`noteRight` is the small
// row above the footer; `ctaLeft`/`ctaRight` is the card's bottom "Book a
// 1:1" row — the whole card links out to window.SOCIALS.adplist (see
// social-data.js for the actual URL).
window.MENTORING = {
  stats: [
    { value: "800+", label: "Minutes mentored", accent: true },
    { value: "10+", label: "1:1 Sessions", accent: true },
    { value: "10+", label: "Designers placed", accent: false },
    { value: "07", label: "Yrs of teaching", accent: false }
  ],
  noteLeft: "Method & critique",
  noteRight: "ADPList & LinkedIn",
  ctaLeft: "Book your session here",
  ctaRight: "→"
};

// Experience card's bottom footer row (the card body itself is rendered
// from window.EXPERIENCE — see experience-data.js).
window.EXPERIENCE_CARD = {
  footLeft: "Total experience",
  footRight: "08 YRS"
};

// Drawer ("What else I'm upto!") — each row: a label, a right-side hint
// (a count, an arrow, or blank), and where it goes:
//   type: "page"   → href straight to another page on the site
//   type: "social" → a key into window.SOCIALS (see social-data.js)
//   type: "case"   → a key into the case-study sheet (see js/case-sheet.js)
// `foot` is the small full-width row pinned to the bottom of the drawer.
window.DRAWER = {
  rows: [
    { label: "Side projects & Experimentation", hint: "09", type: "page", target: "https://ankitpassi.in/ai" },
    { label: "Writing & articles", hint: "Medium", type: "social", target: "medium" },
    { label: "Workshop & Mentoring", hint: "→", type: "case", target: "workshops" },
    { label: "Photo gallery", hint: "→", type: "case", target: "images" },
    { label: "Gaming & Exploration", hint: "→", type: "case", target: "gaming" },
    { label: "Resume & CV", hint: "DOCX", type: "social", target: "resume" }
  ]
};
