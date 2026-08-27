// Single source of truth for work history. Edit an entry here and it
// updates both the Home page's Experience card and the About page's Track —
// neither page hardcodes a company, role, or date range of its own.
//
// `trackNote` is what makes a role show up in About's Track. Track shows
// entries in the same order as Experience, prefixed by the "Next thing"
// bookend below.
window.EXPERIENCE = [
  {
    org: "Deloitte Digital",
    role: "Senior Consultant (Design)",
    when: "Jan 2026 - Now",        // shown on the Experience card
    whenShort: "2026-Now",         // shown on the (narrower) Track row
    current: true,
    trackNote: "Assessment products — test authoring, proctoring, candidate experience, at exam-day volume."
  },
  {
    org: "Mercer Assessment Solutions (Prev. Mettl)",
    role: "Senior Product Designer",
    when: "Feb 2020 - Jan 2026",
    whenShort: "2020-2026",
    current: false,
    trackNote: "The states nobody wants to see: disconnections, flagged sessions, disputed results."
  },
  {
    org: "TEKSystems Global Services",
    role: "UX designer",
    when: "July 2018 - Jan 2020",
    whenShort: "2018-2020",
    current: false,
    trackNote: "The first stop — learning how enterprise UX decisions actually get made and lived with."
  }
];

// About's Track leads with this one bookend (not a real employer, so it
// lives here rather than in EXPERIENCE) before listing the entries above.
window.TRACK_BOOKENDS = {
  before: { role: "Next thing", when: "future", mark: "cobalt", note: "Senior IC or lead, wherever the decisions are messy and someone is accountable for them." }
};
