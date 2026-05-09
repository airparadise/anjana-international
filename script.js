/* =============================================
   ANJANA INTERNATIONAL — script.js
   ============================================= 
*/

// ---- Navigation ----
function navigate(pageId) {
  // Hide all pages
  document
    .querySelectorAll(".page")
    .forEach((p) => p.classList.remove("active"));
  // Show target page
  const target = document.getElementById(pageId);
  if (target) {
    target.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  // Update nav links
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.toggle("active", link.dataset.page === pageId);
  });
  // Close mobile menu
  document.getElementById("navLinks").classList.remove("open");
}

// Nav link clicks
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    navigate(link.dataset.page);
  });
});

// Logo click → home
document
  .querySelector(".logo")
  .addEventListener("click", () => navigate("home"));

// Hamburger
document.getElementById("hamburger").addEventListener("click", () => {
  document.getElementById("navLinks").classList.toggle("open");
});

// Scroll → navbar shadow
window.addEventListener("scroll", () => {
  document
    .getElementById("navbar")
    .classList.toggle("scrolled", window.scrollY > 30);
});

// ---- Product Filters ----
document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".filter-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const filter = btn.dataset.filter;
    document.querySelectorAll(".product-card").forEach((card) => {
      if (filter === "all" || card.dataset.cat === filter) {
        card.style.display = "";
        card.style.animation = "fadeIn 0.4s ease";
      } else {
        card.style.display = "none";
      }
    });
  });
});

// ---- Contact Form ----
function handleFormSubmit(e) {
  e.preventDefault();
  document.getElementById("contactForm").style.display = "none";
  document.getElementById("formSuccess").classList.add("visible");
}

// ---- Intersection Observer for subtle entrance animations ----
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  },
  { threshold: 0.1 },
);

function observeCards() {
  document
    .querySelectorAll(
      ".cat-card, .testi-card, .product-card, .value-card, .team-card, .region-card, .cert-card, .vb-item, .logistics-item, .qa-step",
    )
    .forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition =
        "opacity 0.5s ease, transform 0.5s ease, box-shadow 0.32s cubic-bezier(0.4,0,0.2,1), border-color 0.32s cubic-bezier(0.4,0,0.2,1)";
      observer.observe(el);
    });
}

// Run on page navigation
const originalNavigate = navigate;
window.navigate = function (pageId) {
  originalNavigate(pageId);
  setTimeout(observeCards, 100);
};

// Initial run
setTimeout(observeCards, 200);

// ---- Stat counter animation ----
function animateCounters() {
  document.querySelectorAll(".stat-num").forEach((el) => {
    const text = el.textContent;
    const match = text.match(/(\d+)/);
    if (!match) return;
    const target = parseInt(match[1]);
    const suffix = text.replace(/\d+/, "");
    let start = 0;
    const duration = 1600;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}

// Trigger counter when stats are visible
const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounters();
        statsObserver.disconnect();
      }
    });
  },
  { threshold: 0.5 },
);

const statsStrip = document.querySelector(".stats-strip");
if (statsStrip) statsObserver.observe(statsStrip);
