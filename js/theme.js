(() => {
  "use strict";

  // Runs synchronously in <head>, before paint, so the saved theme applies
  // with no flash of the wrong one.
  const root = document.documentElement;
  let saved = null;
  try { saved = localStorage.getItem("passi-theme"); } catch (e) {}
  if (saved === "dark" || saved === "light") root.setAttribute("data-theme", saved);

  function currentTheme() {
    const attr = root.getAttribute("data-theme");
    if (attr) return attr;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function toggleTheme() {
    const next = currentTheme() === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("passi-theme", next); } catch (e) {}
  }

  document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("themeToggle");
    if (btn) btn.addEventListener("click", toggleTheme);
  });
})();
