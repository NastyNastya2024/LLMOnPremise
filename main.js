(function () {
  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const mobileNav = document.getElementById("mobile-nav");
  const form = document.getElementById("waitlist-form");
  const success = document.getElementById("waitlist-success");

  /* Sticky header */
  function onScroll() {
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mobile nav */
  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", () => {
      const open = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!open));
      mobileNav.hidden = open;
    });
    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navToggle.setAttribute("aria-expanded", "false");
        mobileNav.hidden = true;
      });
    });
  }

  /* Waitlist */
  if (form && success) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = form.querySelector("#email");
      if (!email.value.trim() || !email.validity.valid) {
        email.focus();
        return;
      }
      form.hidden = true;
      success.hidden = false;
    });
  }

  /* Scroll reveal */
  const revealEls = document.querySelectorAll(
    ".section-title, .section-lead, .problem-card, .step, .chart-block, .cap-card, .benefit-card, .metric, .terminal-window, .faq-item"
  );
  revealEls.forEach((el) => el.classList.add("reveal"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
  );
  revealEls.forEach((el) => observer.observe(el));

  /* Animate bars on scroll */
})();
