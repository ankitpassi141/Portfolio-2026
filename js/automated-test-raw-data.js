// Editable content for the private /raw companion to the Assessment
// Generator case study — the FULL case study, unredacted, with the real
// baseline/before-after numbers that were removed from the public page
// (js/automated-test-data.js) because they're a former employer's
// confidential data. Same shape as CASE_STUDY there — every section
// mirrors it 1:1, plus one extra research method row that only showed up
// on the condensed public version. Not linked from anywhere on the site
// — reachable only by knowing the URL (study/automated-test/raw/).
window.CASE_STUDY_RAW = {
  pageTitle: "Assessment Generator (raw) — Ankit Passi",
  pageDescription: "Full internal write-up of the Assessment Generator case study, with real numbers — private, not for sharing.",
  backHref: "../../automated-test.html",

  eyebrow: "automated test generator",
  title: "AI-powered Assessment Generator",
  dek: "From 90 Minutes to 5: Designing an AI Workflow that Cut Assessment Creation Time by 95%",
  heroPhoto: "hero.webp",

  overview: {
    heading: "Project overview & Context",
    items: [
      { label: "My Role", value: "Lead Product Designer" },
      { label: "Team", value: "2 Product Managers, 5+ Software Engineers, 1 AI/ML Specialist" },
      { label: "Product Focus", value: "A client-facing, B2B SaaS platform for creating skills assessments for various purposes" },
      { label: "Core Business Goal", value: "Reduce the Ops dependency on the product and the time to create assessments, by creating a self-served AI-powered platform that dramatically works specifically on test creation aspect" }
    ]
  },

  research: {
    heading: "Foundational Research and Problem Quantification",
    firstImpression: {
      h3: "The First Impression",
      paras: ["Our product was failing at the most critical moment: a user's first impression. The manual assessment builder was so complex that it was actively driving away new business and frustrating our loyal users."]
    },
    methods: {
      h3: "Undertaking Research",
      tableHeaders: ["Research Method", "Strategic Focus", "Key Insight Gained"],
      tableRows: [
        ["Contextual Inquiry", "I observed users as they tried to complete the task using the current system", "Setting up baseline metrics to identify the problem areas of the workflow"],
        ["Post-task Survey", "I employed a quick survey that captures the effort on user part on completing the task", "This is done to capture the raw experience of users into quantifiable metrics to refer in later stages"],
        ["Semi-Structured Interviews", "I asked users open-ended questions about their experience, frustrations, and workarounds.", "Qualitative insights from the users on the current system to dig up more problem areas based on usage"],
        ["Business Data Analysis", "Partnered with Product & Support teams.", "Triangulated our user research with business KPIs like churn rates and support ticket volume"],
        ["Competitive Analysis (with PMs)", "Reviewed various organisation who are offering AI-powered solutions in all shapes and form to identify market offering and product-level insigts", "Analyzing the products & features offered by various organizations to see what are benefits & drawbacks of the approaches"]
      ]
    },
    problemQuantified: {
      h3: "The Problem: Quantified",
      intro: "I ran a baseline study observing 10 participants (mix of new and experienced users), to understand the \"why\" behind the reported numbers, so I conducted a qualitative research to quantify the exact operational cost of the workflow",
      tableHeaders: ["Metric (The Problem)", "Pre-Redesign Result (Baseline)", "Success Criteria", "Impact on Strategic Goal"],
      tableRows: [
        ["Time-to-First-Value (TTFV)", "~ 90 Minutes", "~ 5 Minutes", "For a new user, an average of 90 minutes is needed to get any value from the product, which proves an steep learning curve to adoption"],
        ["Expert User Time on Task", "~ 25 Minutes", "~ 5 Minutes", "It proved that it is not a training issue. Even power users needed ~25 minutes for a task they did regularly."],
        ["Zero-Intervention Success Rate", "40%", "90%", "Only 2 out of 5 new users were able to complete the task without help. This proved self-service model was fundamentally broken."],
        ["User Effort Score", "6.2/7", "< 2.0 / 7 (Very Easy)", "The score in the survey showed that users find the task \"Very Difficult\""],
        ["Support Ticket Volume", "40%", "Reduce by > 75%", "This one broken system was responsible for ~40% of all new user support tickets, creating a significant and unnecessary operational cost."]
      ],
      footnote: "Workflow bias: Our research sample of 10 participants was split into two key segments: 5 new users (to measure our baseline TTFV) and 5 experienced users (to measure expert time on task). This allowed us to quantify both the onboarding failure and the ongoing inefficiency of the old system."
    },
    summary: {
      h3: "To summarise",
      paras: [
        "The data and metrics collected showcased we have a Leaky Bucket. A phenomenon that tells us that we are spending money to acquire new clients, only to have them unable to use the core features immediately, because our core assessment workflow is sub-optimal.",
        "This baseline data was the foundation for my design strategy. The goal was no longer to just \"make it better,\" but to radically reduce Time-to-First-Value and create a frictionless self-service experience."
      ]
    }
  },

  solutionFinding: {
    heading: "Finding the Right Solution",
    exploration: {
      h3: "Exploration & The Process",
      paras: [
        "My process was not linear.",
        "It involved rapid exploration, using low-fidelity designs to reveal critical constraints, and negotiating a hybrid solution that was best for the user and the business."
      ]
    },
    ideation: {
      h3: "Ideation: From Sketches to Two Conflicting Paths",
      paras: [
        "I began with broad exploration, creating numerous paper sketches and user flows. This work helped my team visualize the possibilities, and our ideas quickly converged into two conflicting paths.",
        "To move the debate from abstract to concrete, I created low-fidelity wireframes for both potential solutions."
      ],
      pathA: {
        title: "Path A: The \"In-line Assistant\"",
        desc: "An AI assistant embedded inside the new manual test creation flow, offering contextual suggestions at each step.",
        photos: ["path-a-wireframe-1.webp", "path-a-wireframe-2.webp", "path-a-wireframe-3.png", "path-a-wireframe-4.webp"]
      },
      pathB: {
        title: "Path B: The \"Generator\"",
        desc: "A completely separate workflow where a user enters a prompt and the AI generates a complete, finished test.",
        photos: ["path-b-wireframe-1.webp", "path-b-wireframe-2.webp", "path-b-wireframe-3.webp", "path-b-wireframe-4.webp", "path-b-wireframe-5.webp", "path-b-wireframe-6.webp", "path-b-wireframe-7.avif"]
      }
    },
    review: {
      h3: "Review & Decision: Using Design to Reveal Constraints",
      intro: "I presented these two low-fidelity flows to Product and Engineering leadership in a single meeting. This was the turning point. My wireframes made the concepts real enough for the team to provide critical feedback.",
      tableHeaders: ["Stakeholder", "Artifact", "Feedback on My Low-Fi Designs"],
      tableRows: [
        ["Tech / Engineering", "Did a quick Proof-of-concept", "Implementation Issue: The In-line assistant is technically too complex and difficult to implement deeply with our codebase and current resources."],
        ["Product / Business", "Validating with clients & product roadmap", "Strategic Issue: The AI Generator is a strategic problem. It would compete with the newly developed manual test-creation platform and totally negate this new product, which is not a wise product growth strategy."]
      ],
      paras: [
        "We were at an impasse. Tech had vetoed Path A, and Product had vetoed Path B.",
        "Crucially, my own competitive analysis confirmed that Path B was a flawed user experience anyway, as competitors with 'Full Generators' all suffered from the same user complaint: zero control."
      ]
    },
    proposal: {
      h3: "My Proposal (The \"Blueprint\")",
      paras: [
        "This is where I proposed a third, hybrid solution based on what we had learned. We could get the speed of the \"Generator\" (which Tech approved) without negating our other product (which satisfied Product's concern).",
        "My proposal was \"The Blueprint Generator.\"",
        "This was the right decision because it solved all three problems at once:"
      ],
      cards: [
        { label: "User Problem", text: "It gives them the 95% speed boost they need, but also provides the control that competitors were missing." },
        { label: "Business Problem", text: "It doesn't compete with the manual platform; it acts as a \"super-powered on-ramp\" to it, enhancing its value." },
        { label: "Technology Problem", text: "It was feasible to build in parallel with the new manual workflow." }
      ]
    },
    summary: {
      h3: "To summarise",
      paras: [
        "I began by creating low-fidelity wireframes for two potential paths: a \"In-line Assistant\" and a \"Full Generator.\" My designs helped reveal that the In-line Assistant was technically unfeasible, while competitive analysis and product strategy showed the Generator was a flawed user experience.",
        "I successfully navigated this impasse by proposing a third, hybrid \"Blueprint\" solution that was technically feasible, strategically aligned with our other products, and offered the ideal balance of speed and user control."
      ]
    }
  },

  solution: {
    heading: "The Solution",
    intro: {
      h3: "The Solution: The \"Blueprint\" Generator",
      paras: [
        "Based on our strategic decision, I designed the \"Blueprint Generator.\" This solution transforms the user's role from a manual builder into a strategic reviewer, solving our 90-minute onboarding crisis.",
        "The entire experience is powered by our in-house AI model, which was trained on over 1000 of our own high-quality assessments. This gave us the unique ability to accurately extract skills from a job description and build a relevant test structure - a key technical enabler that made this design possible."
      ]
    },
    decisions: {
      h3: "Key Design Decisions",
      intro: "To make this successful, my design was guided by few core principles:",
      tableHeaders: ["Guideline", "Thought Process"],
      tableRows: [
        ["Speed to Value Above All", "We wanted to expedite the process from Blank page to a usable blueprint in less than 5 minutes. This demanded a simple, single-prompt interface."],
        ["Build Trust Through Transparency", "The user must be able to see what the AI did (e.g., \"Skills identified: Python, SQL\") and is always in control and have the ability to edit it. This was critical for user trust."],
        ["Empower, Don't Trap", "The user must never feel stuck in an automated flow. The \"Seamless Handoff\" was designed to feel like an empowerment step, not a restrictive one."],
        ["Increased Visibility of Collateral", "The user should have increased visibility of the Pre-built Assessments, Custom Assessments available in their accounts at all time, so that they can reuse the existing one (if they want to), instead of creating new one everytime."]
      ]
    },
    steps: {
      h3: "Blueprint Generator: The Three-Step Flow",
      items: [
        {
          title: "Step 1: Provide Input",
          action: "The user pastes a job description or types a simple prompt.",
          benefit: "Minimal effort required from the user to get started.",
          photos: ["three-step-1-image-1.webp", "three-step-1-image-2.webp"]
        },
        {
          title: "Step 2: Generate Blueprint",
          action: "The AI reads the input, identifies key skills, and builds a recommended 'blueprint.' It also surfaces existing 'Recommended Tests' from the user's account to prevent duplicate work.",
          benefit: "Eliminates the 90-minute \"blank page\" problem and does 90% of the work.",
          photos: ["three-step-2-image-1.webp", "three-step-2-image-2.webp", "three-step-2-image-3.webp"]
        },
        {
          title: "Step 3: Seamless Handoff",
          action: "The user reviews the blueprint and is seamlessly transitioned into the manual workflow, which is now pre-populated with the AI's blueprint.",
          benefit: "The user gets the speed of a generator and the full control of the manual builder.",
          photos: ["three-step-3-image-1.webp", "three-step-3-image-2.webp"]
        }
      ]
    },
    figmaEmbedUrl: "https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2Fxckc6tVb98cF6zv1LBR0DP%2FPortfolio%3Fcontent-scaling%3Dfixed%26kind%3Dproto%26node-id%3D2409-16432%26page-id%3D2409%253A16084%26scaling%3Dscale-down%26starting-point-node-id%3D2409%253A16432"
  },

  results: {
    heading: "The Results",
    validation: {
      h3: "Design Validation (Testing the Solution)",
      paras: [
        "Since the final product is still in development, we could not measure post-launch business metrics. The critical next step was to validate our \"Blueprint\" hypothesis and prove, with data, that the design was ready for development.",
        "I ran a final round of moderated usability testing with our high-fidelity prototype. We used the same 10-participant split (5 new, 5 expert) to measure our new design directly against the \"before\" metrics.",
        "The results proved that our \"Blueprint\" strategy was a success."
      ]
    },
    impact: {
      h3: "Final Result: Quantified Impact",
      tableHeaders: ["Metric", "Pre-design Result (Baseline)", "Post-Design Result (Validation Test)", "The Impact"],
      tableRows: [
        ["Time-to-First-Value (TTFV)", "~ 90 Minutes", "~ 4.5 Minutes", "A 95% reduction in time for new users. We turned a 90-minute crisis into a 5-minute \"wow\" moment."],
        ["Expert User Time on Task", "~ 25 Minutes", "~ 4.5 Minutes", "An 82% reduction in time for expert users. This proved the new flow was a superior path for all users."],
        ["Zero-Intervention Success Rate", "40%", "92% (9 of 10 users)", "We met our >90% goal. This proved the design was truly intuitive and solved our self-service problem."],
        ["User Effort Score", "6.2/7", "1.8 / 7 (Very Easy)", "We flipped user sentiment from \"frustration\" to \"delight.\" The task was no longer a pain point."]
      ],
      closing: "The data was clear: the Blueprint solution successfully solved our critical onboarding crisis and met or exceeded every success criterion we set."
    },
    quotes: {
      h3: "What Users Said (Qualitative Feedback)",
      intro: "The numbers showed us the design was a success, but the user quotes told us why.",
      groups: [
        {
          label: "On Speed & Ease of Use",
          quotes: [
            "This was magical. I used to spend 25 minutes just getting the structure right. With AI help, I can just focus on content, not the structure.",
            "Can I really have a full-blown usable assignment in 10 mins? Amazing!"
          ]
        },
        {
          label: "On Trust & Control",
          quotes: [
            "I've used other AI tools that just spit out a final thing, and I hate it. I loved this because it showed me the blueprint, let me agree with it, and then I could still make my own changes. I actually trust this.",
            "I love that AI model we are using to get the blueprint right is trained directly on our content library which we painstaking populated for last 5-7 years"
          ]
        }
      ]
    }
  },

  conclusion: {
    heading: "Conclusion",
    h3: "Key Challenges & Learnings",
    intro: "This project was not just a design challenge; it was a strategic one. Navigating these two issues was critical to the project's success.",
    rows: [
      {
        title: "Building User Trust in AI",
        context: "Our early research showed that expert users were skeptical of AI. They didn't trust or think that a \"black box\" can build a high-quality, usable assessment for them",
        learning: "I learned that for AI products, transparency is more important than speed. My \"Blueprint\" solution was successful because it was transparent. It let the user review and approve the AI's work at every step before committing, which built the trust necessary for them to adopt the feature."
      },
      {
        title: "Balancing User Needs vs. Business Strategy",
        context: "We were stuck in an impasse. Tech vetoed the \"Co-pilot,\" and Product vetoed the \"Full Generator\" as it competed with our other new platform",
        learning: "The best solution is often a hybrid that re-frames the problem. My 'Blueprint' solution did more than just compromise; it created a superior outcome that was better than either of our original paths."
      },
      {
        title: "Proving the Final Business Value",
        context: "Our validation testing proved the usability of the design, but the product is not yet launched. We have not yet proven the business impact",
        learning: "A designer's job isn't done at the validation stage. The key learning is that the ultimate measure of this design's success is not just the 95% time reduction, but a measurable decrease in customer churn. My immediate next step on this project is to partner with our data team to track these business metrics post-launch to prove the design's true ROI."
      }
    ],
    closing: "This design has been validated to solve our core usability crisis, and I am confident that its launch will drive the significant business results we set out to achieve."
  },

  footer: {
    backLabel: "← Back to the public case study",
    socialsLabel: "Socials"
  }
};
