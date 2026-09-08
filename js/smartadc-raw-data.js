// Full, unredacted text for study/smartadc/raw/index.html — a genuine
// second copy of the public case study (js/smartadc-data.js), just with
// the real baseline sample size and pre-redesign figures restored. See
// reference/smartadc-case-study.md.
window.CASE_STUDY_RAW = {
  pageTitle: "SmartADC (raw) — Ankit Passi",
  pageDescription: "Full internal write-up of the SmartADC case study, with real baseline numbers — private, not for sharing.",
  backHref: "../../smartadc.html",

  eyebrow: "assessment centers",
  title: "SmartADC — Creating Assessment Centers of Tomorrow",
  dek: "Driving Operational ROI: An 86% Increase in Successful Workflow Optimization",
  heroPhoto: "hero-1.webp",

  overview: {
    heading: "Project Overview & Context",
    items: [
      { label: "My Role", value: "Lead UX Designer" },
      { label: "Team", value: "Product Manager, 5+ Engineers, 3 QA Specialists" },
      { label: "Product Focus", value: "Virtual Assessment & Development Center (ADC) Configuration Flow" },
      { label: "Core Business Goal", value: "Streamline time spent by HR & Ops on complex ADC workflows to **lower operational bandwidth and make the entire process self-served.**" },
      { label: "Problem Context", value: "The process was manual — shared Excel sheets for scheduling, defining ADC criteria, sharing with candidates, and report configuration." }
    ]
  },

  research: {
    heading: "Foundational Research and Problem Quantification",
    discovery: {
      h3: "Discovery & Qualitative Research",
      tableHeaders: ["Research Method", "Initial Finding vs. Final Finding", "Strategic Influence / Outcome"],
      tableRows: [
        ["**Initial Ops Perception (Original Problem)**", "The problem was post-analytical: **Consolidated Report Generation** was a nightmare for Ops because of the volume of candidates.", "Initial research prevented the team from solving the wrong problem."],
        ["**Semi-Structured Interviews (Ops & HR)**", "Revealed Report Generation was only one part of the problem — the core issue was the pre-analytical phase (Scheduling, Defining ADC, Sharing), currently handled via error-prone Excel sheets.", "Pivoted the project's focus to Workflow Reliability and Input Enforcement to solve the self-service goal."],
        ["**Brainstorming Activity (Ops & HR)**", "With everyone's collaboration, we defined the workflow needed to guarantee a reliable configuration across the board.", "Established the design requirement for a **controlled, linear workflow** to eliminate manual errors — removing the need for Excel-sheet handling."]
      ],
      photo: "qualitative-research-1.webp"
    },
    prioritization: {
      h3: "Strategic Prioritization",
      tableHeaders: ["Research Method", "Strategic Focus", "Key Insight Gained"],
      tableRows: [
        ["**Competitive Analysis (with PMs)**", "Reviewed competitor ADC platforms to identify solution offerings and in-market workflow patterns.", "Summarized that a linear but guided workflow is the industry standard for complex configurations — in line with our initial concept direction."],
        ["**Feature Bucketing (with PMs & Tech)**", "Used the **MoSCoW prioritization framework** to pick features for an MVP that strikes a balance between expected ROI and engineering effort.", "Confirmed that optimizing the pre- and post-ADC workflow & configuration flexibility provided the greatest, most immediate ROI in Time-to-Completion (TTC) reduction."]
      ],
      photos: ["priortisation-1.webp", "priortisation-2.webp", "priortisation-3.webp", "priortisation-4.webp", "priortisation-5.webp"]
    },
    problemQuantified: {
      h3: "Quantifying the Baseline Problem",
      intro: "I ran a baseline study observing N = 7 HR & Ops administrators attempting to create an ADC, use the scheduling flow, and configure reports on the legacy system, to quantify the exact operational cost of the existing design's friction.",
      tableHeaders: ["Metric (The Problem)", "Success Criteria", "Pre-Redesign Result (Baseline)", "Impact on Strategic Goal (Self-Service)"],
      tableRows: [
        ["**Time to Completion (TTC)**", "Time the user took to complete the workflow.", "12.4 minutes", "**High OpsEx** — directly consumed Ops bandwidth in critical tasks."],
        ["**Error Rate (ER) — Non-Critical**", "How many non-critical mistakes the user makes during the workflow — back buttons, wrong inputs.", "35.71% (15 errors out of 42 error opportunities)", "**Root Cause of Delay:** the interface was confusing with high micro-friction (to-and-fro from Excel to the Mettl system), forcing users to rely on the Ops team for support and error correction."],
        ["**Task Success Rate (TSR)**", "User is able to complete the workflow in a single go, without encountering any error.", "71.43% (5 out of 7 attempts successful)", "**Unreliable Process:** a low success rate confirmed the process was not self-served and required manual oversight, consuming Ops bandwidth."],
        ["**User Pain Scale (UPS)**", "User undertook a survey asking basic questions about the workflow.", "4.28 / 5 (significant pain)", "**Unreliable Process:** users felt the process was overly complex and frustrating, contradicting the self-service goal (a high pain score)."]
      ],
      footnote: "**Workflow bias:** teams were used to working in Excel, and often had defined templates for each process, which mitigated errors in the existing workflow — making it feel locally optimal even though it didn't scale."
    }
  },

  solutionFinding: {
    heading: "Iterative Design and Solution",
    conceptExploration: {
      h3: "Concept Exploration and Definition",
      tableHeaders: ["Design Type", "Goal", "Outcome"],
      tableRows: [
        ["**Paper Sketches**", "Rapidly explored layout and interaction alternatives for the linear flow — where to place CTAs, contextual information, progress visualization, and more.", "Decided on the necessity of a controlled, sequential flow segregated by logical information."],
        ["**Low-Fidelity Designs (Wireframing)**", "Defined the information hierarchy and engaged Product and Engineering teams early for buy-in.", "Used to negotiate early **technical trade-offs** — real-time validations, information dependencies between sections."],
        ["**High-Fidelity Designs**", "Built final screens with visual polish and functional micro-interactions.", "Developed the final **In-Line Validation system** that directly countered the baseline error rate."]
      ],
      photos: ["concept-exploration-1.jpg", "concept-exploration-2.webp", "concept-exploration-3.webp", "concept-exploration-4.webp", "concept-exploration-5.webp", "concept-exploration-6.webp"]
    },
    designRationale: {
      h3: "High-Fidelity Design and Rationale",
      intro: "Developed the final user interface, incorporating visual design and specific components designed to solve the quantified problems.",
      tableHeaders: ["Design Feature", "Metric Solved", "Design Rationale"],
      tableRows: [
        ["**Linear Wizard with Progressive Disclosure**", "Task Success Rate (TSR)", "The **Linear Wizard** was chosen because it enforces compliance logic (e.g., must define Candidate Groups before selecting Assessor Slots) to prevent critical failures."],
        ["**In-Line, Real-Time Validation**", "Error Rate (35.71%)", "Real-time, in-line validation with contextual feedback was implemented to provide immediate feedback, minimizing the wasted time associated with the 35.71% error rate."],
        ["**Component-Driven Inputs**", "Time to Completion", "Enforcing data selection based on prior information — via dropdowns, date pickers, and more — directly reduces support load on the Operations team."]
      ],
      photos: ["high-fidelity-1.webp", "high-fidelity-2.webp", "high-fidelity-3.webp", "high-fidelity-4.webp", "high-fidelity-5.webp", "high-fidelity-6.webp"]
    },
    validation: {
      h3: "Validation Testing",
      tableHeaders: ["Aspect", "Details"],
      tableRows: [
        ["Methodology", "Conducted a final round of validation testing on the functional high-fidelity prototype with the same sample group (N = 7)."],
        ["Outcome", "The observations provided the final post-redesign data, confirming the success of the new workflow and ensuring the system was ready for deployment."]
      ]
    }
  },

  results: {
    heading: "The Results",
    impact: {
      h3: "Quantified Impact and ROI",
      intro: "The final metrics demonstrate the success of the self-service focus, proving that design clarity translates directly into massive time savings and ROI.",
      tableHeaders: ["Metric", "Pre-Redesign", "Post-Redesign", "Impact on Strategic Goal"],
      tableRows: [
        ["**Time to Completion (TTC)**", "12.4 minutes", "6.5 minutes", "47.58% Reduction: directly reduced operational bandwidth; HR can now launch almost two ADCs in the time it took to launch one."],
        ["**Error Rate (ER)**", "35.71%", "9.52%", "26.19% Reduction: self-service validation — proves the process is clear and robust enough to scale without needing manual support."],
        ["**Task Success Rate (TSR)**", "71.43%", "85.71%", "14.28% Improvement: increased user confidence, ensuring the entire process can be trusted end-to-end."],
        ["**User Pain Score (UPS)**", "4.28 / 5", "1.28 / 5", "70% Improvement: proves the design successfully eliminated friction and achieved high user acceptance."]
      ]
    },
    videoEmbedUrl: "https://www.youtube.com/embed/M0BUDIRSaZI",
    productLink: {
      intro: "Interested in exploring this product? View it live at",
      label: "www.mettl.com/smartadc",
      href: "https://mettl.com/virtual-assessment-center/"
    }
  },

  conclusion: {
    heading: "Depth of Collaboration and Strategic Learning",
    h3: "Collaboration, Trade-Offs & Key Learnings",
    rows: [
      { title: "**Strategic Influence**", context: "My research redefined the project — the initial focus was on Report Generation; the research I conducted pivoted the team to focus on Workflow Reliability.", learning: "Design research influenced shaping the what and why, not just executing the how." },
      { title: "**Trade-Off Negotiation**", context: "Compromised with a non-intrusive left-hand panel solution.", learning: "Successfully aligned the PM's Feature Adoption goal with the Business ROI goal, proving data can resolve internal conflict." },
      { title: "**Key Learning**", context: "Solved the macro-problem (TTC) by solving the micro-problem (ER).", learning: "For B2B self-service, eliminating micro-friction is the most effective path to achieving large-scale operational savings." }
    ],
    closing: "By strategically redefining the problem through research, my design eliminated the pre-analytical friction (a **26% Error Rate**), directly translating into a **47.58% operational efficiency gain** and fulfilling the promise of a fully self-served platform."
  },

  footer: {
    backLabel: "← Back to the public case study",
    socialsLabel: "Socials"
  }
};
