(() => {
  "use strict";

  const GAP = 12; // spacing between repeated tiles on the wall (independent of --gutter)
  const NUDGE = 60;

  const wall = document.getElementById("wall");
  const plane = document.getElementById("plane");
  const tile = document.getElementById("tile");
  const recentreBtn = document.getElementById("recentreBtn");

  const pan = { x: 0, y: 0 };
  let tileSize = null;
  let signature = null;
  let dragging = false;

  function wrap(v, n) {
    return ((v % n) + n) % n;
  }

  function draw() {
    if (!tileSize) return;
    const x = wrap(pan.x, tileSize.w) - tileSize.w;
    const y = wrap(pan.y, tileSize.h) - tileSize.h;
    plane.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }

  function nudge(dx, dy) {
    pan.x += dx;
    pan.y += dy;
    draw();
  }

  function recentre() {
    pan.x = 0;
    pan.y = 0;
    draw();
  }

  // The authored tile (in the HTML, editable) is the source of truth. Clones
  // of it fill a ring around the viewport; the plane is offset modulo the
  // measured tile size so the wall repeats seamlessly in every direction.
  function buildWall() {
    const tileW = tile.offsetWidth + GAP;
    const tileH = tile.offsetHeight + GAP;
    if (!tileW || !tileH) {
      requestAnimationFrame(buildWall);
      return;
    }
    const cx = Math.ceil(wall.clientWidth / tileW) + 2;
    const cy = Math.ceil(wall.clientHeight / tileH) + 2;
    const sig = `${cx}x${cy}@${tileW}x${tileH}`;
    if (signature === sig) {
      draw();
      return;
    }
    signature = sig;

    plane.querySelectorAll('[data-tile="clone"]').forEach((el) => el.remove());
    tile.style.left = "0px";
    tile.style.top = "0px";

    for (let ty = 0; ty < cy; ty++) {
      for (let tx = 0; tx < cx; tx++) {
        if (tx === 0 && ty === 0) continue;
        const clone = tile.cloneNode(true);
        clone.removeAttribute("id");
        clone.setAttribute("data-tile", "clone");
        clone.setAttribute("aria-hidden", "true");
        clone.style.left = `${tx * tileW}px`;
        clone.style.top = `${ty * tileH}px`;
        plane.appendChild(clone);
      }
    }

    tileSize = { w: tileW, h: tileH };
    draw();
  }

  wall.addEventListener("pointerdown", (e) => {
    dragging = true;
    wall.classList.add("is-dragging");
    const start = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y };

    const move = (ev) => {
      if (!dragging) return;
      pan.x = start.px + (ev.clientX - start.x);
      pan.y = start.py + (ev.clientY - start.y);
      draw();
    };
    const up = () => {
      dragging = false;
      wall.classList.remove("is-dragging");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  });

  window.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "ArrowLeft": nudge(NUDGE, 0); break;
      case "ArrowRight": nudge(-NUDGE, 0); break;
      case "ArrowUp": nudge(0, NUDGE); break;
      case "ArrowDown": nudge(0, -NUDGE); break;
      case "Home": recentre(); break;
      default: return;
    }
    e.preventDefault();
  });

  recentreBtn.addEventListener("click", recentre);
  window.addEventListener("resize", buildWall);
  buildWall();
})();
