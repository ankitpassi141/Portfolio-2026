// Wires up every [data-social="key"] element to window.SOCIALS (see
// social-data.js). Add data-social="linkedin" (etc.) to any <a> and its
// href stays in sync automatically; add a child with data-social-hint
// and its text syncs too. External (http/https) links open in a new tab.
(() => {
  "use strict";

  const socials = window.SOCIALS;
  if (!socials) return;

  document.querySelectorAll("[data-social]").forEach((el) => {
    const entry = socials[el.dataset.social];
    if (!entry) return;

    if (el.tagName === "A") {
      el.href = entry.url;
      if (/^https?:/i.test(entry.url)) {
        el.target = "_blank";
        el.rel = "noopener noreferrer";
      }
    }

    const hint = el.querySelector("[data-social-hint]");
    if (hint && entry.hint != null) hint.textContent = entry.hint;
  });
})();
