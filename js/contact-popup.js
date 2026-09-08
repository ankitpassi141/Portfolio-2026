// Wires up the footer's "Contact" trigger (see index.html's
// .contact-menu) to open/close the small popup listing LinkedIn,
// Instagram and Email. The popup's rows are [data-social] elements
// already wired to window.SOCIALS by js/social-render.js — this file
// only owns show/hide, outside-click, and Escape.
(() => {
  "use strict";

  const trigger = document.getElementById("contactTrigger");
  const popup = document.getElementById("contactPopup");
  if (!trigger || !popup) return;

  function openPopup() {
    popup.hidden = false;
    trigger.setAttribute("aria-expanded", "true");
    document.addEventListener("click", onOutsideClick, true);
    document.addEventListener("keydown", onKeydown);
  }

  function closePopup(returnFocus) {
    if (popup.hidden) return;
    popup.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
    document.removeEventListener("click", onOutsideClick, true);
    document.removeEventListener("keydown", onKeydown);
    if (returnFocus) trigger.focus();
  }

  function onOutsideClick(e) {
    if (!popup.contains(e.target) && e.target !== trigger) closePopup(false);
  }

  function onKeydown(e) {
    if (e.key === "Escape") closePopup(true);
  }

  trigger.addEventListener("click", () => {
    if (popup.hidden) openPopup(); else closePopup(false);
  });
})();
