/*!
 * main.js — Portfolio interactions
 * - Year auto-fill
 * - Typewriter hero subtitle
 * - Scroll-triggered fade-ins
 * - Nav scroll state + mobile toggle
 * - Smooth anchor scrolling
 */
(function () {
  "use strict";

  /* ── Year ─────────────────────────────────────── */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── Typewriter ───────────────────────────────── */
  const subtitleEl = document.getElementById("heroSubtitle");
  const LINES = [
    "Engineering Student @ Marquette University",
    "Embedded Systems  ·  TinyML  ·  IoT",
    "Firmware · Sensor Fusion · Edge AI",
  ];
  let lineIndex = 0;
  let charIndex = 0;
  let deleting  = false;
  let pauseTimer = null;

  function typeStep() {
    const line = LINES[lineIndex];

    if (!deleting) {
      charIndex++;
      subtitleEl.textContent = line.slice(0, charIndex) + (charIndex < line.length ? "▋" : " ▋");
      if (charIndex >= line.length) {
        // Pause before deleting
        pauseTimer = setTimeout(() => { deleting = true; typeStep(); }, 2400);
        return;
      }
    } else {
      charIndex--;
      subtitleEl.textContent = line.slice(0, charIndex) + "▋";
      if (charIndex === 0) {
        deleting = false;
        lineIndex = (lineIndex + 1) % LINES.length;
        setTimeout(typeStep, 350);
        return;
      }
    }

    const speed = deleting ? 28 : 46;
    setTimeout(typeStep, speed + Math.random() * 25);
  }

  // Start after hero fade-in
  setTimeout(typeStep, 1500);

  /* ── Intersection Observer (fade-in) ─────────── */
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  document.querySelectorAll(".fi").forEach((el) => io.observe(el));

  /* ── Nav scroll state ─────────────────────────── */
  const navbar = document.getElementById("navbar");

  function onScroll() {
    if (window.scrollY > 30) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ── Mobile nav toggle ────────────────────────── */
  const navToggle = document.getElementById("navToggle");
  const navLinks  = document.getElementById("navLinks");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });

    // Close when a link is clicked
    navLinks.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => navLinks.classList.remove("open"));
    });
  }

  /* ── Smooth scroll ────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const target = document.querySelector(a.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      const offset = navbar ? navbar.offsetHeight + 8 : 0;
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  /* ── Glitch effect on logo hover ─────────────── */
  const logo = document.querySelector(".nav-logo");
  let glitchTimer = null;

  if (logo) {
    logo.addEventListener("mouseenter", () => {
      let flashes = 0;
      function flash() {
        if (flashes++ > 5) {
          logo.style.textShadow = "";
          return;
        }
        const on = flashes % 2 === 0;
        logo.style.textShadow = on
          ? "0 0 18px #39ff14, 0 0 35px rgba(57,255,20,.25), 2px 0 0 #00e5ff, -2px 0 0 #ff3c6e"
          : "0 0 18px #39ff14, 0 0 35px rgba(57,255,20,.25)";
        glitchTimer = setTimeout(flash, 60);
      }
      clearTimeout(glitchTimer);
      flash();
    });
  }

  /* ── Cursor trail (subtle) ────────────────────── */
  const trailDots = [];
  const TRAIL_COUNT = 8;

  for (let i = 0; i < TRAIL_COUNT; i++) {
    const dot = document.createElement("div");
    dot.style.cssText = `
      position: fixed;
      pointer-events: none;
      width: ${4 - i * 0.3}px;
      height: ${4 - i * 0.3}px;
      border-radius: 50%;
      background: rgba(0,200,83,${0.55 - i * 0.06});
      z-index: 9999;
      transition: transform .05s, left ${0.05 + i * 0.04}s, top ${0.05 + i * 0.04}s;
      left: -20px; top: -20px;
    `;
    document.body.appendChild(dot);
    trailDots.push(dot);
  }

  let mx = -20, my = -20;

  window.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    trailDots[0].style.left = mx - 2 + "px";
    trailDots[0].style.top  = my - 2 + "px";
  });

  // Lazy follow for remaining dots
  let trailFrame;
  function trailLoop() {
    for (let i = 1; i < TRAIL_COUNT; i++) {
      const prev  = trailDots[i - 1];
      const curr  = trailDots[i];
      const px    = parseFloat(prev.style.left) + 2;
      const py    = parseFloat(prev.style.top)  + 2;
      const cx    = parseFloat(curr.style.left) + 2;
      const cy    = parseFloat(curr.style.top)  + 2;
      const nx    = cx + (px - cx) * 0.4;
      const ny    = cy + (py - cy) * 0.4;
      curr.style.left = (nx - 2) + "px";
      curr.style.top  = (ny - 2) + "px";
    }
    trailFrame = requestAnimationFrame(trailLoop);
  }

  trailLoop();

  // Hide trail on mobile / touch devices
  window.addEventListener("touchstart", () => {
    trailDots.forEach((d) => (d.style.display = "none"));
    cancelAnimationFrame(trailFrame);
  }, { once: true });

})();
