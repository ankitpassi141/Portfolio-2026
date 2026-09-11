// Cookie consent banner + gated Microsoft Clarity loader — shared across
// every page (see reference/analytics.md). Clarity's own snippet only
// runs after the visitor accepts; rejecting, or not having chosen yet,
// means zero tracking requests fire at all.
//
// Include on every page (identical everywhere — root-absolute paths, so
// page depth doesn't matter):
//   <link rel="stylesheet" href="/css/cookie-consent.css">
//   <script src="/js/cookie-consent.js"></script>
//
// Exposes window.showCookieConsent() so other UI (the Settings & Consent
// sheet's "Analytics & Cookie Access" row, see js/settings-sheet.js) can
// re-open the banner on demand, letting a visitor revisit or change a
// choice they already made.
(() => {
  "use strict";

  // The only place the Clarity project ID lives — update it here if the
  // project is ever regenerated. See reference/analytics.md.
  const CLARITY_PROJECT_ID = "ygh28db06g";

  const STORAGE_KEY = "cookie-consent"; // "accepted" | "declined"

  let clarityLoaded = false;
  function loadClarity() {
    if (clarityLoaded) return; // e.g. accept -> reject -> accept again via the Settings sheet
    clarityLoaded = true;
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", CLARITY_PROJECT_ID);
  }

  function readConsent() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }

  function writeConsent(value) {
    try { localStorage.setItem(STORAGE_KEY, value); } catch (e) {}
  }

  let banner = null;
  function buildBanner() {
    if (banner) return banner;

    banner = document.createElement("div");
    banner.className = "cookie-consent";
    banner.hidden = true;
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-label", "Cookie consent");

    const label = document.createElement("p");
    label.className = "cookie-consent__label";
    label.textContent = "Privacy";

    const text = document.createElement("p");
    text.className = "cookie-consent__text";
    text.textContent = "This site uses cookies for essential functions and analytics that actually helps me better this portfolio.";

    const divider = document.createElement("hr");
    divider.className = "cookie-consent__divider";

    const actions = document.createElement("div");
    actions.className = "cookie-consent__actions";

    const accept = document.createElement("button");
    accept.type = "button";
    accept.className = "cookie-consent__btn cookie-consent__btn--accept";
    accept.textContent = "Accept all";
    accept.addEventListener("click", () => {
      writeConsent("accepted");
      loadClarity();
      banner.hidden = true;
    });

    const reject = document.createElement("button");
    reject.type = "button";
    reject.className = "cookie-consent__btn cookie-consent__btn--reject";
    reject.textContent = "Reject";
    reject.addEventListener("click", () => {
      writeConsent("declined");
      banner.hidden = true;
    });

    actions.append(accept, reject);

    banner.append(label, text, divider, actions);
    document.body.appendChild(banner);
    return banner;
  }

  function showBanner() {
    buildBanner().hidden = false;
  }
  window.showCookieConsent = showBanner;

  // Standard consent norms: show once, before any tracking; persist
  // whatever the visitor chose; never re-prompt on a later page just
  // because they haven't revisited this exact page yet; only reappears if
  // they explicitly reopen it (Settings & Consent → Analytics & Cookie
  // Access) or clear their stored choice.
  const consent = readConsent();
  if (consent === "accepted") loadClarity();
  else if (consent !== "declined") showBanner(); // no stored choice — first visit
})();
