/* ==========================================================================
   Althaf & Nitha — Nikkah Invitation
   All editable content lives in weddingData below.
   ========================================================================== */

const weddingData = {
  nikkah: {
    date: "2026-12-26",  // YYYY-MM-DD
    time: "00:00",        // 24hr, IST (UTC+05:30) — 12:00 AM
    label: "Nikkah"
  },
  venue: "Las Ciglal Convention Centre",
  address: "Kalampoor, Muvattupuzha",
  // Leave googleMaps empty ("") to use a venue-name search; paste the exact
  // Google Maps share link here once available.
  googleMaps: "",
  music: "music.mp3"
};

const mapsUrl = weddingData.googleMaps ||
  "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(weddingData.venue + ", " + weddingData.address);
const mapsEmbed = "https://www.google.com/maps?q=" + encodeURIComponent(weddingData.venue + ", " + weddingData.address) + "&output=embed";

document.addEventListener("DOMContentLoaded", () => {
  initPreloader();
  initArchReveal();
  initSmartCountdown();
  initMusicToggle();
  initSideNav();
  initMaps();
  initAOS();
  initHeroParallax();
});

/* ---------------------------------- Maps links ---------------------------------- */
function initMaps() {
  ["mapsBtn", "directionsBtn"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.href = mapsUrl;
  });
  const frame = document.getElementById("venueMapEmbed");
  if (frame) frame.src = mapsEmbed;
}

/* ---------------------------------- Preloader ---------------------------------- */
function initPreloader() {
  const el = document.getElementById("preloader");
  if (!el) return;
  window.addEventListener("load", () => {
    setTimeout(() => el.classList.add("is-hidden"), 700);
  });
  setTimeout(() => el.classList.add("is-hidden"), 3400);
}

/* ---------------------------------- Arch reveal (signature interaction) ---------------------------------- */
function initArchReveal() {
  const cta = document.getElementById("archCta");
  const frame = document.getElementById("archFrame");
  const stage = document.getElementById("heroStage");
  const hero = document.getElementById("hero");
  const music = document.getElementById("bgMusic");
  const musicBtn = document.getElementById("musicToggle");

  if (!cta || !frame || !stage || !hero) return;

  let opened = false;

  const openArch = () => {
    if (opened) return;
    opened = true;
    frame.classList.add("is-open");
    stage.classList.add("is-revealed");
    hero.classList.add("is-open");
    spawnRingParticles();

    if (music && musicBtn && !musicBtn.hidden) {
      music.volume = 0.55;
      music.play().then(() => {
        musicBtn.classList.add("is-playing");
      }).catch(() => { /* autoplay blocked — user can tap the music button manually */ });
    }
  };

  cta.addEventListener("click", openArch);
  cta.addEventListener("keyup", (e) => {
    if (e.key === "Enter" || e.key === " ") openArch();
  });

  // Also allow scrolling / swiping on the closed gate to open the invitation
  hero.addEventListener("wheel", (e) => { if (!opened && e.deltaY > 0) openArch(); }, { passive: true });
  let touchStartY = null;
  hero.addEventListener("touchstart", (e) => { touchStartY = e.touches[0].clientY; }, { passive: true });
  hero.addEventListener("touchmove", (e) => {
    if (opened || touchStartY === null) return;
    if (touchStartY - e.touches[0].clientY > 24) openArch();
  }, { passive: true });
}

/* ---------------------------------- Ring particle burst ---------------------------------- */
function spawnRingParticles() {
  const holder = document.getElementById("ringParticles");
  if (!holder || holder.dataset.played) return;
  holder.dataset.played = "true";

  const RING_SVG = (size, hue) => `
    <svg viewBox="0 0 40 40" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="15" fill="none" stroke="${hue}" stroke-width="2.4"/>
    </svg>`;

  const COUNT = 18;
  for (let i = 0; i < COUNT; i++) {
    const p = document.createElement("span");
    p.className = "ring-particle";

    const size = 12 + Math.random() * 22;
    const hue = Math.random() > 0.5 ? "#F3D998" : "#D4AF37";
    p.innerHTML = RING_SVG(size, hue);

    const startX = 50 + (Math.random() * 60 - 30);
    const drift = (Math.random() * 220 - 110);
    const rise = 260 + Math.random() * 220;
    const rotate = (Math.random() * 360 - 180).toFixed(0);
    const delay = (Math.random() * 0.35).toFixed(2);
    const duration = (2.2 + Math.random() * 1.4).toFixed(2);

    p.style.left = `${startX}%`;
    p.style.setProperty("--drift", `${drift}px`);
    p.style.setProperty("--rise", `-${rise}px`);
    p.style.setProperty("--rotate", `${rotate}deg`);
    p.style.animationDelay = `${delay}s`;
    p.style.animationDuration = `${duration}s`;

    holder.appendChild(p);
    setTimeout(() => p.remove(), (parseFloat(duration) + parseFloat(delay)) * 1000 + 200);
  }
}

/* ---------------------------------- Countdown ---------------------------------- */
function initSmartCountdown() {
  const daysEl = document.getElementById("cd-days");
  const hoursEl = document.getElementById("cd-hours");
  const minsEl = document.getElementById("cd-mins");
  const secsEl = document.getElementById("cd-secs");
  const labelEl = document.getElementById("countdownLabel");
  if (!daysEl) return;

  const target = new Date(`${weddingData.nikkah.date}T${weddingData.nikkah.time}:00+05:30`).getTime();
  const pad = (n) => String(Math.max(n, 0)).padStart(2, "0");

  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) {
      if (labelEl) labelEl.textContent = "The Nikkah celebrations have begun";
      daysEl.textContent = hoursEl.textContent = minsEl.textContent = secsEl.textContent = "00";
      return;
    }
    daysEl.textContent = pad(Math.floor(diff / 86400000));
    hoursEl.textContent = pad(Math.floor((diff / 3600000) % 24));
    minsEl.textContent = pad(Math.floor((diff / 60000) % 60));
    secsEl.textContent = pad(Math.floor((diff / 1000) % 60));
  }

  tick();
  setInterval(tick, 1000);
}

/* ---------------------------------- Music toggle ---------------------------------- */
function initMusicToggle() {
  const btn = document.getElementById("musicToggle");
  const audio = document.getElementById("bgMusic");
  if (!btn || !audio || !weddingData.music) return;

  audio.addEventListener("canplaythrough", () => { btn.hidden = false; }, { once: true });
  audio.addEventListener("error", () => { btn.hidden = true; });
  audio.src = weddingData.music;
  audio.load();

  btn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play().then(() => btn.classList.add("is-playing")).catch(() => {});
    } else {
      audio.pause();
      btn.classList.remove("is-playing");
    }
  });
}

/* ---------------------------------- Side nav active state ---------------------------------- */
function initSideNav() {
  const dots = document.querySelectorAll(".side-nav__dot");
  const sections = Array.from(dots).map((d) => document.querySelector(d.getAttribute("href")));
  if (!dots.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const idx = sections.indexOf(entry.target);
      dots.forEach((d) => d.removeAttribute("aria-current"));
      if (dots[idx]) dots[idx].setAttribute("aria-current", "true");
    });
  }, { threshold: 0.4 });

  sections.forEach((s) => s && observer.observe(s));
}

/* ---------------------------------- AOS init ---------------------------------- */
function initAOS() {
  if (!window.AOS) return;
  AOS.init({ duration: 900, easing: "ease-out-cubic", once: true, offset: 60 });

  // Web fonts swapping in late (and images finishing decode) shift section
  // positions after AOS has already cached its trigger offsets. On iOS Safari
  // this is the main reason scroll-reveal animations look "broken" — they fire
  // at the wrong scroll position, or not at all. Recalculate once everything
  // has actually settled.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => AOS.refreshHard());
  }
  window.addEventListener("load", () => {
    setTimeout(() => AOS.refreshHard(), 300);
  });
}

/* ---------------------------------- Subtle hero parallax ---------------------------------- */
function initHeroParallax() {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      const heroHeight = hero.offsetHeight;
      if (y < heroHeight) {
        hero.style.setProperty("--parallax", `${y * 0.05}px`);
      }
      ticking = false;
    });
  }, { passive: true });
}
