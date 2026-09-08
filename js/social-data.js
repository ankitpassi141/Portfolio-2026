// Single source of truth for every external destination this site links
// to — the social/contact equivalent of experience-data.js. Change a URL
// here and everywhere it's used updates: the Contact popup in the Home
// page footer (see js/contact-popup.js), and the Medium/ADPList links
// inside the Writing and Workshops case studies on Home.
//
// `hint` is the small secondary text shown next to some of these (the
// handle/URL in the Contact popup, "PDF", "Articles") — leave it null if
// the link doesn't show one.
window.SOCIALS = {
  linkedin: {
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/ankitpassi",
    hint: "linkedin.com/in/ankitpassi"
  },
  instagram: {
    label: "Instagram",
    url: "https://www.instagram.com/ankitpassi.design",
    hint: "@ankitpassi.design"
  },
  email: {
    label: "Email",
    url: "mailto:ankitpassi.design@gmail.com",
    hint: "ankitpassi.design@gmail.com"
  },
  medium: {
    label: "Medium",
    url: "https://medium.com/@ankitpassi", // TODO: add your real Medium profile URL, e.g. https://medium.com/@ankitpassi
    hint: "Articles"
  },
  adplist: {
    label: "ADPList",
    url: "https://adplist.org/mentors/ankit-passi", // TODO: add your real ADPList mentor URL, e.g. https://adplist.org/mentors/ankit-passi
    hint: "Book a 1:1"
  },
  resume: {
    label: "Résumé",
    url: "https://docs.google.com/document/d/1HrxiKL2klGbriXVCr1eCqZ2TVZc8H3_kXH9to46vNKM/edit?usp=sharing", // TODO: link to your résumé — a hosted PDF or a Drive/Notion link
    hint: "PDF"
  }
};
