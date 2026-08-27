// Editable copy for the Home page's Profile and Work Gallery cards.
// Change text here — no HTML/CSS knowledge needed — and the page picks it
// up automatically. Rendered by js/main.js.

window.PROFILE = {
  eyebrow: "Eight years · Two halves",
  headline: "Designing the products to protect innocents from AI slop!",
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
