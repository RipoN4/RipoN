import { initScene } from "./scene.js";

// ============================================================================
// 1. 3D COSMIC GALAXY VORTEX SCENE INITIALIZATION
// ============================================================================
const canvas = document.getElementById("gl");
let sceneEngine = null;
try {
  sceneEngine = initScene(canvas);
  window.sceneEngine = sceneEngine;
} catch (e) {
  console.warn("WebGL initialization note:", e);
}

// ============================================================================
// 2. TIMELINE ERA DATA & RENDERER (Sector 05)
// ============================================================================
const timelineEras = [
  {
    title: "Roots & Survival",
    range: "1996–2007",
    milestones: [
      {
        year: "26 AUG, 1996",
        title: "Born in Rural Bengal",
        desc: "Born in Swarupnagar, a humble village in West Bengal, India. Raised in a loving family of four: my parents, my elder brother, and myself."
      },
      {
        year: "2000–2004",
        title: "The Flood & Mumbai Migration",
        desc: "A devastating flood destroyed our village home. Facing extreme financial hardship for daily necessities, our family had to migrate to Mumbai in 2004 to survive and find work."
      },
      {
        year: "LATE 2007 (AGE 9)",
        title: "1st Rank Out of 160 Students",
        desc: "Returned home to Bengal. Started formal schooling late at age 9, directly admitted into Class 1 in a Govt primary school. Stunned everyone by standing 1st rank among all 160 students throughout primary school."
      }
    ]
  },
  {
    title: "Discovery & Fire",
    range: "2012–2016",
    milestones: [
      {
        year: "2012–2014",
        title: "2G Nokia Phone & First Webpage",
        desc: "Borrowed my father's and uncle's 2G keypad Nokia phones. Discovered the magic of web pages and Wapka. Built my very first live website using a free domain, displaying my own name and photo."
      },
      {
        year: "2015",
        title: "First AdSense & Bamboo Antenna",
        desc: "Discovered Google AdSense and turned passion into real income. Bought my first smartphone, tablet, and laptop. Built a custom wireless antenna on our rooftop to catch faint broadband signals in the village."
      },
      {
        year: "2016",
        title: "The Big Setback & Comeback",
        desc: "Operating 15+ websites with solid income when my primary Google email was unexpectedly suspended. Lost all sites and revenue overnight. After months of heartbreak, refused to quit and rebuilt a resilient multi-account network."
      }
    ]
  },
  {
    title: "Breakthrough",
    range: "2017–2020",
    milestones: [
      {
        year: "2017",
        title: "Festival Blogging & Technical RipoN",
        desc: "Invented 'Festival Blogging' with viral greeting scripts driving millions of views in 48 hours. Launched 'Technical RipoN' on YouTube as Reliance Jio democratized internet access across India."
      },
      {
        year: "2018",
        title: "50,000 Subs & Full-Time Leap",
        desc: "Technical RipoN rocketed past 50k subscribers. Monetized the channel, invested in a DSLR camera, and took the bold decision to leave formal education to pursue blogging and content creation full-time."
      },
      {
        year: "2020",
        title: "The SEOMafia Movement",
        desc: "Launched SEOMafia to teach unfiltered, honest SEO. Aimed for 100 students; over 3,000 enrolled. Mentored over 120+ people into sustainable online earnings before retiring the course permanently."
      }
    ]
  },
  {
    title: "Peak & Freedom",
    range: "2022–2026+",
    milestones: [
      {
        year: "2022–2024",
        title: "Peak Scaling ($70k–$90k/Month)",
        desc: "Scaled to 500+ simultaneously ranking properties and 10,000+ total sites built over time. Reached record peak monthly solo earnings of $70,000–$90,000 through automated systems and ad networks."
      },
      {
        year: "2025",
        title: "7-Month Intensive AI Mastery",
        desc: "Stepped back from routine blogging to master Artificial Intelligence, local neural models, coding agents, and automated software pipelines to prepare for the future of tech."
      },
      {
        year: "2026 & BEYOND",
        title: "Peace, Family & IN IMAGINATION",
        desc: "Living happily with my loving wife and child in West Bengal. Free from financial traps, building whatever my mind conceives, and living the motto: IN IMAGINATION."
      }
    ]
  }
];

const eraDeck = document.getElementById("eraMilestonesDeck");
const eraButtons = document.querySelectorAll(".era-tab-btn");

function renderEra(index) {
  if (!eraDeck) return;
  const era = timelineEras[index] || timelineEras[0];
  eraButtons.forEach((b, i) => b.classList.toggle("is-active", i === index));

  eraDeck.style.opacity = "0";
  eraDeck.style.transform = "translateY(10px)";

  setTimeout(() => {
    eraDeck.innerHTML = era.milestones.map((m) => `
      <div class="milestone-card">
        <span class="milestone-year-badge">${m.year}</span>
        <h3 class="milestone-title">${m.title}</h3>
        <p class="milestone-desc">${m.desc}</p>
      </div>
    `).join("");

    eraDeck.style.transition = "opacity 0.4s ease, transform 0.4s ease";
    eraDeck.style.opacity = "1";
    eraDeck.style.transform = "translateY(0)";
  }, 180);
}

renderEra(0);
eraButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const eraIdx = parseInt(btn.getAttribute("data-era"), 10) || 0;
    renderEra(eraIdx);
  });
});

// ============================================================================
// ============================================================================
// 3. VERTICAL FULL-SCREEN SMOOTH TRANSITION CONTROLLER
// Desktop: 1-Second Smooth Transitions with Cinematic Heading Reveal
// Mobile: 100% Native Smooth Scrolling with Zero Transitions
// ============================================================================
const sectorInfo = [
  { tag: "SECTOR 01", title: "HOME" },
  { tag: "SECTOR 02", title: "BLOGGING" },
  { tag: "SECTOR 03", title: "YOUTUBE" },
  { tag: "SECTOR 04", title: "CODING & AI" },
  { tag: "SECTOR 05", title: "PERSONAL LIFE" },
  { tag: "SECTOR 06", title: "SOCIAL MEDIA" },
  { tag: "SECTOR 07", title: "LANDED" }
];

class FullscreenSectorManager {
  constructor() {
    this.deck = document.getElementById("fullscreenDeck");
    this.slides = document.querySelectorAll(".sector-slide");
    this.curtain = document.getElementById("warpCurtain");
    this.revealOverlay = document.getElementById("sectorHeadingReveal");
    this.revealTag = document.getElementById("revealTag");
    this.revealTitle = document.getElementById("revealTitle");
    this.progressBar = document.querySelector(".scroll-progress span");
    this.total = this.slides.length;
    this.currentIndex = 0;
    this.isAnimating = false;
    this.cooldown = 1000; // Exactly 1.0 second duration

    this.navLinks = document.querySelectorAll(".nav-links a, .mobile-nav-panel a");
    this.sectorDots = document.querySelectorAll(".sector-dot-btn");

    this.initMobileObserver();
    this.initInputs();
    this.updateSectorVisuals(0, false);

    // Handle screen resize across the 768px mobile breakpoint
    window.addEventListener("resize", () => {
      if (this.isMobile()) {
        if (this.deck) this.deck.style.transform = "";
      } else {
        if (this.deck) this.deck.style.transform = `translate3d(0, -${this.currentIndex * 100}vh, 0)`;
      }
    });
  }

  isMobile() {
    return window.innerWidth <= 768;
  }

  goTo(index, force = false) {
    if (index < 0 || index >= this.total) return;

    // Mobile: Standard natural smooth scrolling without deck locking
    if (this.isMobile()) {
      const targetSlide = this.slides[index];
      if (targetSlide) {
        targetSlide.scrollIntoView({ behavior: "smooth" });
      }
      this.currentIndex = index;
      this.updateSectorVisuals(this.currentIndex, false);
      return;
    }

    // Desktop: 1-second transition + Cinematic Heading Reveal
    if (this.isAnimating && !force) return;
    if (index === this.currentIndex && !force) return;

    const goingDown = index > this.currentIndex;
    this.isAnimating = true;

    // Trigger 1-second Heading Reveal Overlay
    if (this.revealOverlay && this.revealTag && this.revealTitle && sectorInfo[index]) {
      this.revealTag.textContent = sectorInfo[index].tag;
      this.revealTitle.textContent = sectorInfo[index].title;
      this.revealOverlay.classList.remove("is-active");
      void this.revealOverlay.offsetWidth; // Force reflow
      this.revealOverlay.classList.add("is-active");
    }

    // Trigger full-screen warp energy curtain sweep
    if (this.curtain) {
      this.curtain.classList.remove("sweep-down", "sweep-up");
      void this.curtain.offsetWidth;
      this.curtain.classList.add(goingDown ? "sweep-up" : "sweep-down");
    }

    this.currentIndex = index;

    // 1-second hardware-accelerated vertical slide
    if (this.deck) {
      this.deck.style.transform = `translate3d(0, -${this.currentIndex * 100}vh, 0)`;
    }

    this.updateSectorVisuals(this.currentIndex, true);

    setTimeout(() => {
      this.isAnimating = false;
    }, this.cooldown);
  }

  next() {
    if (this.currentIndex < this.total - 1) this.goTo(this.currentIndex + 1);
  }

  prev() {
    if (this.currentIndex > 0) this.goTo(this.currentIndex - 1);
  }

  updateSectorVisuals(index, triggerSound = true) {
    this.slides.forEach((s, idx) => {
      s.classList.toggle("is-active", idx === index);
    });

    const activeSlide = this.slides[index];
    if (!activeSlide) return;

    const primary = activeSlide.getAttribute("data-color-primary") || "#00f2fe";
    const secondary = activeSlide.getAttribute("data-color-secondary") || "#2563eb";

    // Smoothly transition 3D galaxy vortex colors & down-to-up elevation
    if (sceneEngine) {
      if (sceneEngine.setSectionColor) {
        sceneEngine.setSectionColor(primary, secondary);
      }
      if (sceneEngine.setScrollProgress) {
        sceneEngine.setScrollProgress(index / (this.total - 1));
      }
    }

    // Set root active theme color
    document.documentElement.style.setProperty("--active-theme-color", primary);

    // Update progress bar
    if (this.progressBar) {
      const p = (index / (this.total - 1)) * 100;
      this.progressBar.style.width = `${p}%`;
    }

    // Update Header Quick Nav Links
    this.navLinks.forEach((link) => {
      const targetSec = parseInt(link.getAttribute("data-target-sector"), 10);
      link.classList.toggle("active", targetSec === index);
    });

    // Update Floating Orbital Sector Dots
    this.sectorDots.forEach((dot) => {
      const targetSec = parseInt(dot.getAttribute("data-target-sector"), 10);
      dot.classList.toggle("is-active", targetSec === index);
    });
  }

  initMobileObserver() {
    // On mobile, update background space colors and active nav item seamlessly on native scroll
    const observer = new IntersectionObserver((entries) => {
      if (!this.isMobile()) return;
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const secIdx = parseInt(entry.target.getAttribute("data-sector"), 10);
          if (!isNaN(secIdx)) {
            this.currentIndex = secIdx;
            this.updateSectorVisuals(secIdx, false);
          }
        }
      });
    }, {
      rootMargin: "-20% 0px -40% 0px",
      threshold: 0.1
    });

    this.slides.forEach((slide) => observer.observe(slide));
  }

  initInputs() {
    // 1. Mouse Wheel & Trackpad (Desktop only)
    let wheelDeltaAccumulator = 0;
    let wheelTimer = null;

    window.addEventListener("wheel", (e) => {
      if (this.isMobile()) return; // Native smooth scrolling on mobile

      if (this.isAnimating) return;

      wheelDeltaAccumulator += e.deltaY;
      clearTimeout(wheelTimer);
      wheelTimer = setTimeout(() => { wheelDeltaAccumulator = 0; }, 180);

      if (Math.abs(wheelDeltaAccumulator) > 35) {
        if (wheelDeltaAccumulator > 0) this.next();
        else this.prev();
        wheelDeltaAccumulator = 0;
      }
    }, { passive: false });

    // 2. Touch Swipes (Desktop / large touch screens only; completely disabled on mobile <= 768px)
    let touchStartY = 0;
    let touchStartX = 0;

    window.addEventListener("touchstart", (e) => {
      if (this.isMobile()) return; // Let mobile scroll naturally
      if (!e.touches || e.touches.length === 0) return;
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    window.addEventListener("touchend", (e) => {
      if (this.isMobile()) return; // Let mobile scroll naturally
      if (!e.changedTouches || e.changedTouches.length === 0) return;
      if (this.isAnimating) return;

      const touchEndY = e.changedTouches[0].clientY;
      const touchEndX = e.changedTouches[0].clientX;
      const deltaY = touchStartY - touchEndY;
      const deltaX = Math.abs(touchStartX - touchEndX);

      // Verify dominant vertical swipe
      if (Math.abs(deltaY) > 45 && Math.abs(deltaY) > deltaX * 1.2) {
        if (deltaY > 0) this.next();
        else this.prev();
      }
    }, { passive: true });

    // 3. Keyboard Arrow Keys
    window.addEventListener("keydown", (e) => {
      if (this.isMobile()) return;
      if (["ArrowDown", "PageDown", "Space"].includes(e.code)) {
        e.preventDefault();
        this.next();
      } else if (["ArrowUp", "PageUp"].includes(e.code)) {
        e.preventDefault();
        this.prev();
      }
    });

    // 4. Clickable Sector Target Elements (Anchor Links & Buttons)
    document.querySelectorAll("[data-target-sector]").forEach((el) => {
      el.addEventListener("click", (e) => {
        const href = el.getAttribute("href");
        const secIdx = parseInt(el.getAttribute("data-target-sector"), 10);
        if (!isNaN(secIdx)) {
          e.preventDefault();
          this.goTo(secIdx);
          if (href && href.startsWith("#") && history.replaceState) {
            history.replaceState(null, "", href);
          }
        }
      });
    });

    // Handle initial hash routing if visited directly
    const hashToSector = {
      "#top": 0,
      "#home": 0,
      "#blogging": 1,
      "#youtube": 2,
      "#coding": 3,
      "#timeline": 4,
      "#socials": 5,
      "#landing": 6
    };
    if (window.location.hash && hashToSector[window.location.hash] !== undefined) {
      setTimeout(() => this.goTo(hashToSector[window.location.hash], true), 80);
    }

    // 5. Floating Bottom Hint Button
    const hintBtn = document.getElementById("scrollHintBtn");
    if (hintBtn) {
      hintBtn.addEventListener("click", () => this.next());
    }
  }
}

const sectorManager = new FullscreenSectorManager();
window.sectorManager = sectorManager;

// ============================================================================
// 5. LOCAL TIME TELEMETRY TICKER (IST UTC+5:30)
// ============================================================================
const timeEl = document.getElementById("localTime");
function updateLocalTime() {
  if (!timeEl) return;
  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-US", {
    timeZone: "Asia/Kolkata",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  timeEl.textContent = `${timeStr} IST`;
}
updateLocalTime();
setInterval(updateLocalTime, 1000);

// ============================================================================
// 6. MAGNETIC CURSOR & TACTILE HOVER (Desktop)
// ============================================================================
const cursorDot = document.getElementById("cursorDot");
const cursorRing = document.getElementById("cursorRing");
const hasFinePointer = window.matchMedia("(pointer: fine)").matches;

if (hasFinePointer && cursorDot && cursorRing) {
  let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  let ringPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

  window.addEventListener("pointermove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    cursorDot.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`;
  }, { passive: true });

  const renderCursor = () => {
    ringPos.x += (mouse.x - ringPos.x) * 0.16;
    ringPos.y += (mouse.y - ringPos.y) * 0.16;
    cursorRing.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;
    requestAnimationFrame(renderCursor);
  };
  requestAnimationFrame(renderCursor);

  document.querySelectorAll("a, button, [data-magnetic]").forEach((el) => {
    el.addEventListener("pointerenter", () => cursorRing.classList.add("is-hovering"));
    el.addEventListener("pointerleave", () => cursorRing.classList.remove("is-hovering"));
  });
}

// ============================================================================
// 7. MOBILE NAVIGATION DRAWER
// ============================================================================
const navToggle = document.getElementById("navToggle");
const mobileNav = document.getElementById("mobileNav");

if (navToggle && mobileNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = mobileNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    if (isOpen) mobileNav.removeAttribute("hidden");
    else mobileNav.setAttribute("hidden", "");
  });

  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileNav.classList.remove("is-open");
      mobileNav.setAttribute("hidden", "");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// ============================================================================
// 8. FAST CURTAIN LOADER DISMISSAL
// Sub-second reveal to ensure rapid FCP and LCP scores
// ============================================================================
function dismissLoader() {
  const loader = document.getElementById("loader");
  if (loader && !loader.classList.contains("is-loaded")) {
    loader.classList.add("is-loaded");
  }
}

if (document.readyState === "complete" || document.readyState === "interactive") {
  requestAnimationFrame(dismissLoader);
} else {
  document.addEventListener("DOMContentLoaded", dismissLoader, { once: true });
  window.addEventListener("load", dismissLoader, { once: true });
}
setTimeout(dismissLoader, 300);
