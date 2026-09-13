// Wires up both the footer's "Let's Connect" button and the topbar's
// "Always open for a conversation" availability pill (see index.html) to
// open/close the same small popup listing LinkedIn, Instagram and Email.
// The popup's rows are [data-social] elements already wired to
// window.SOCIALS by js/social-render.js — this file owns show/hide,
// positioning it next to whichever trigger was clicked, outside-click,
// and Escape.
(() => {
  "use strict";

  const popup = document.getElementById("contactPopup");
  const triggers = [
    document.getElementById("contactTrigger"),
    document.getElementById("availabilityTrigger")
  ].filter(Boolean);
  if (!popup || !triggers.length) return;

  const GAP = 10; // roughly --space-3

  let lastTrigger = null;

  // Positions the (already-unhidden, so its real size is measurable)
  // popup next to `trigger`: below it if there's room, above it
  // otherwise, right-aligned to it and clamped so it never runs off
  // either edge of the viewport. Runs on every open since the trigger —
  // and the viewport — can differ each time.
  function positionPopup(trigger) {
    const rect = trigger.getBoundingClientRect();
    const popupRect = popup.getBoundingClientRect();
    const vw = window.innerWidth, vh = window.innerHeight;

    let top = rect.bottom + GAP;
    if (top + popupRect.height > vh - GAP) {
      top = rect.top - popupRect.height - GAP;
    }
    top = Math.max(GAP, top);

    let left = rect.right - popupRect.width;
    left = Math.min(left, vw - popupRect.width - GAP);
    left = Math.max(GAP, left);

    popup.style.top = Math.round(top) + "px";
    popup.style.left = Math.round(left) + "px";
  }

  function openPopup(trigger) {
    lastTrigger = trigger;
    popup.hidden = false;
    positionPopup(trigger);
    triggers.forEach((t) => t.setAttribute("aria-expanded", String(t === trigger)));
    document.addEventListener("click", onOutsideClick, true);
    document.addEventListener("keydown", onKeydown);
  }

  function closePopup(returnFocus) {
    if (popup.hidden) return;
    popup.hidden = true;
    triggers.forEach((t) => t.setAttribute("aria-expanded", "false"));
    document.removeEventListener("click", onOutsideClick, true);
    document.removeEventListener("keydown", onKeydown);
    if (returnFocus && lastTrigger) lastTrigger.focus();
    lastTrigger = null;
  }

  // .contains() rather than a strict === / includes check — the
  // availability trigger has a child <span> (the pulsing dot), and a
  // click landing on that child's e.target still needs to count as "on a
  // trigger", not "outside".
  function onOutsideClick(e) {
    if (popup.contains(e.target)) return;
    if (triggers.some((t) => t.contains(e.target))) return;
    closePopup(false);
  }

  function onKeydown(e) {
    if (e.key === "Escape") closePopup(true);
  }

  window.addEventListener("resize", () => {
    if (!popup.hidden && lastTrigger) positionPopup(lastTrigger);
  });

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      if (popup.hidden) openPopup(trigger); else closePopup(false);
    });
  });
})();
