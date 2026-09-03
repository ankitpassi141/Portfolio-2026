// About page ("Off the Clock") renderer. Reads window.ABOUT (see
// js/about-data.js) and fills in the page, then wires up the
// scroll-reveal (IntersectionObserver adding an `in` class to every
// `.reveal`/`.annotated` element as it scrolls into view — see
// css/about.css for the actual transition).
(() => {
  "use strict";

  const DATA = window.ABOUT;
  if (!DATA) return;

  const PHOTO_DIR = "images/about/";

  // Layers a photo (top) over its fallback gradient (bottom) inside `el` —
  // if the photo file doesn't exist yet, the browser just skips painting
  // that layer and the gradient shows through untouched. See css/about.css
  // for the shared .fb sizing/position rules.
  function paintPhoto(el, item) {
    const fb = document.createElement("div");
    fb.className = "fb";
    const [c1, c2] = item.gradient;
    fb.style.backgroundImage = 'url("' + PHOTO_DIR + encodeURIComponent(item.photo) + '"), linear-gradient(155deg,' + c1 + ',' + c2 + ')';
    el.appendChild(fb);
  }

  function text(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  // Wordmark — only the first word ("Ankit") gets the hand-drawn
  // underline annotation; the rest renders as plain text after it.
  function renderWordmark() {
    const el = document.getElementById("aboutWordmark");
    if (!el) return;
    const spaceIdx = DATA.heroName.indexOf(" ");
    const first = spaceIdx === -1 ? DATA.heroName : DATA.heroName.slice(0, spaceIdx);
    const rest = spaceIdx === -1 ? "" : DATA.heroName.slice(spaceIdx);

    const annotated = document.createElement("span");
    annotated.className = "annotated";
    annotated.appendChild(document.createTextNode(first));
    annotated.insertAdjacentHTML("beforeend", '<svg viewBox="0 0 240 60"><path d="M6,32 C60,4 190,4 234,30 C190,52 60,54 6,30"/></svg>');
    el.appendChild(annotated);
    if (rest) el.appendChild(document.createTextNode(rest));
  }

  function renderHero() {
    const el = document.getElementById("aboutHeroPhoto");
    if (el) paintPhoto(el, DATA.hero);
  }

  function renderThumbs() {
    const wrap = document.getElementById("aboutThumbs");
    if (!wrap) return;
    DATA.thumbs.forEach((t) => {
      const cell = document.createElement("div");
      cell.className = "cthumb";
      paintPhoto(cell, t);
      wrap.appendChild(cell);
    });
  }

  function renderFacts() {
    const wrap = document.getElementById("aboutFacts");
    if (!wrap) return;
    DATA.facts.forEach((f) => {
      const row = document.createElement("div");
      row.className = "fact";
      const label = document.createElement("span");
      label.className = "fact__label";
      label.textContent = f.label;
      const value = document.createElement("span");
      value.className = "fact__value";
      value.textContent = f.value;
      row.append(label, value);
      wrap.appendChild(row);
    });
  }

  // A hobby card with a `video` field plays that video on hover (and the
  // card lifts — see .lissue:hover in css/about.css); it's paused at its
  // poster frame the rest of the time. If the file is missing or fails to
  // load, the poster (its `photo`) just stays showing, same as any other
  // missing asset on this page.
  //
  // Plays with sound (not muted) — browsers vary on whether a hover
  // counts as enough of a "user gesture" to allow that; if a browser
  // blocks it, play() just rejects silently (caught below) and the video
  // still shows, just without sound in that browser.
  function wireHoverVideo(card, video) {
    let broken = false;
    video.addEventListener("error", () => { broken = true; });
    card.addEventListener("mouseenter", () => {
      if (broken) return;
      video.currentTime = 0;
      video.play().catch(() => {});
    });
    card.addEventListener("mouseleave", () => {
      video.pause();
      video.currentTime = 0;
    });
  }

  // Fullscreen lightbox that plays a hobby's video on tap, full volume — a
  // tap is a genuine user gesture, so autoplay-with-sound is reliable here
  // even though the hover preview above isn't. Mobile/touch only: devices
  // with real hover (desktop, mouse) already get the hover preview, and a
  // click there would just be a redundant, unrequested modal on top of it.
  const IS_TOUCH_DEVICE = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  let lightbox = null;
  function getLightbox() {
    if (lightbox) return lightbox;
    lightbox = document.createElement("div");
    lightbox.className = "about-lightbox";

    const video = document.createElement("video");
    video.controls = true;
    video.playsInline = true;

    const close = document.createElement("button");
    close.type = "button";
    close.className = "about-lightbox__close";
    close.setAttribute("aria-label", "Close");
    close.textContent = "×";
    close.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeLightbox();
    });

    lightbox.append(video, close);
    document.body.appendChild(lightbox);
    return lightbox;
  }
  function openLightbox(src) {
    const el = getLightbox();
    const video = el.querySelector("video");
    video.src = src;
    el.classList.add("is-open");
    video.currentTime = 0;
    video.play().catch(() => {});
  }
  function closeLightbox() {
    if (!lightbox || !lightbox.classList.contains("is-open")) return;
    lightbox.classList.remove("is-open");
    lightbox.querySelector("video").pause();
  }

  function renderHobbies() {
    const wrap = document.getElementById("aboutHobbies");
    if (!wrap) return;
    DATA.hobbies.forEach((h) => {
      const card = document.createElement("div");
      card.className = "lissue reveal";

      const cover = document.createElement("div");
      cover.className = "lcover";

      // A video-enabled card shows the video itself, directly — not a
      // separate static photo with the video layered on top of it. Its
      // `poster` attribute (the still frame shown before playback) does
      // the job the photo layer used to do, so there's exactly one visual
      // element, filling the tile the same `cover` way every plain photo
      // card does — no separate crop/inset math to get out of sync.
      if (h.video) {
        card.classList.add("has-video");
        const src = PHOTO_DIR + encodeURIComponent(h.video);

        const video = document.createElement("video");
        video.className = "lvideo";
        video.src = src;
        video.poster = PHOTO_DIR + encodeURIComponent(h.photo);
        video.loop = true;
        video.playsInline = true;
        video.preload = "metadata";
        cover.appendChild(video);
        wireHoverVideo(card, video);

        if (IS_TOUCH_DEVICE) {
          cover.addEventListener("click", () => openLightbox(src));
        }
      } else {
        paintPhoto(cover, h);
      }

      const meta = document.createElement("div");
      meta.className = "lmeta";
      meta.textContent = h.category;

      const title = document.createElement("div");
      title.className = "ltitle";
      title.textContent = h.title;

      card.append(cover, meta, title);
      wrap.appendChild(card);
    });
  }

  // Each pair is its own flex row (not one shared CSS Grid across every
  // pair) — a sticky question's containing block is then unambiguously
  // just its own row, so it can't overlap a different pair's question.
  // Sticky elements sharing one grid across rows of uneven height is a
  // well-known cross-browser trouble spot; this sidesteps it entirely.
  function renderQa() {
    const wrap = document.getElementById("aboutQa");
    if (!wrap) return;
    DATA.qa.forEach((pair) => {
      const row = document.createElement("div");
      row.className = "qa-pair";

      const qCol = document.createElement("div");
      qCol.className = "qcol";
      const q = document.createElement("div");
      q.className = "q reveal";
      q.textContent = pair.q;
      qCol.appendChild(q);

      const aCol = document.createElement("div");
      aCol.className = "acol";
      const a = document.createElement("p");
      a.className = "a reveal";
      a.textContent = pair.a;
      aCol.appendChild(a);

      row.append(qCol, aCol);
      wrap.appendChild(row);
    });
  }

  function renderTags() {
    const wrap = document.getElementById("aboutTags");
    if (!wrap) return;
    DATA.tags.forEach((tag) => {
      const span = document.createElement("span");
      span.textContent = tag;
      wrap.appendChild(span);
    });
  }

  document.title = DATA.pageTitle;
  const descMeta = document.getElementById("aboutPageDescription");
  if (descMeta) descMeta.setAttribute("content", DATA.pageDescription);

  text("aboutBioKicker", DATA.bioKicker);
  text("aboutHobbiesHeading", DATA.hobbiesHeading);
  text("aboutTagsLabel", DATA.tagsLabel);

  renderWordmark();
  renderHero();
  text("aboutBelief", DATA.belief);
  renderThumbs();
  text("aboutMission", DATA.mission);
  text("aboutBio", DATA.bio);
  renderFacts();
  renderHobbies();
  renderQa();
  renderTags();
  text("aboutFootLocation", DATA.footer.location);
  text("aboutFootEmail", DATA.footer.email);

  // Scroll reveal — run only after every .reveal/.annotated element above
  // actually exists in the DOM. Content starts at opacity: 0 (see .reveal
  // in about.css) until this adds "in", so a forced-reveal safety net
  // follows: IntersectionObserver isn't universally reliable right at page
  // load on every mobile browser (a viewport still settling after the
  // address bar collapses, etc. can mean it never fires for something
  // that's already on screen), and without a fallback that leaves the
  // content stuck invisible rather than just unanimated. If
  // IntersectionObserver isn't supported at all, skip straight to reveal.
  const revealTargets = document.querySelectorAll(".reveal, .annotated");
  if (window.IntersectionObserver) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    revealTargets.forEach((el, i) => {
      el.style.transitionDelay = (i % 6) * 50 + "ms";
      io.observe(el);
    });
    setTimeout(() => {
      revealTargets.forEach((el) => el.classList.add("in"));
    }, 2500);
  } else {
    revealTargets.forEach((el) => el.classList.add("in"));
  }
})();
