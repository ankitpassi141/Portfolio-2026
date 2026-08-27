// Renders the Track card from the shared work-history data (see
// experience-data.js) so it always matches Home's Experience card.
(() => {
  "use strict";

  const body = document.getElementById("trackBody");
  const count = document.getElementById("trackCount");
  const jobs = window.EXPERIENCE;
  const bookends = window.TRACK_BOOKENDS;
  if (!body || !jobs || !bookends) return;

  const stops = [
    { ...bookends.before, mark: "var(--cobalt)" },
    ...jobs
      .filter((job) => job.trackNote)
      .map((job) => ({ role: job.org, when: job.whenShort, mark: "var(--ink)", note: job.trackNote }))
  ];

  body.innerHTML = "";
  stops.forEach((stop, i) => {
    const row = document.createElement("div");
    row.className = "track__row";
    if (i === stops.length - 1) row.style.borderBottom = "0";

    const head = document.createElement("div");
    head.className = "track__head";

    const who = document.createElement("span");
    who.className = "track__who";
    const mark = document.createElement("span");
    mark.className = "track__mark";
    mark.style.background = stop.mark;
    const role = document.createElement("span");
    role.className = "track__role";
    role.textContent = stop.role;
    who.append(mark, role);

    const when = document.createElement("span");
    when.className = "track__when";
    when.textContent = stop.when;

    head.append(who, when);

    const note = document.createElement("div");
    note.className = "track__note";
    note.textContent = stop.note;

    row.append(head, note);
    body.appendChild(row);
  });

  if (count) count.textContent = `${String(stops.length).padStart(2, "0")} stops`;
})();
