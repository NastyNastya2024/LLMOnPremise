(function () {
  const EASE = "cubic-bezier(0.2, 0.9, 0.4, 1.1)";
  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const mobileNav = document.getElementById("mobile-nav");
  const form = document.getElementById("waitlist-form");
  const success = document.getElementById("waitlist-success");
  const ctaBtn = document.getElementById("cta-btn");

  /* Header scroll + тема на hero */
  const hero = document.querySelector(".hero");
  function onScroll() {
    if (!header) return;
    const y = window.scrollY;
    header.classList.toggle("scrolled", y > 40);
    if (hero) {
      const heroBottom = hero.offsetTop + hero.offsetHeight - header.offsetHeight;
      header.classList.toggle("on-hero", y < heroBottom);
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
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

  /* Анимация линий в блоке «Решение» */
  const solutionSection = document.querySelector(".solution");
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function activateSolutionLines() {
    solutionSection?.classList.add("lines-active");
  }

  if (solutionSection) {
    if (prefersReduced) {
      activateSolutionLines();
    } else {
      const linesObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              activateSolutionLines();
              linesObserver.disconnect();
            }
          });
        },
        { threshold: 0.08, rootMargin: "80px 0px 0px 0px" }
      );
      linesObserver.observe(solutionSection);

      /* Если блок уже в зоне видимости при загрузке */
      requestAnimationFrame(() => {
        const rect = solutionSection.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
          activateSolutionLines();
        }
      });
    }
  }

  /* Scroll reveal */
  const revealEls = document.querySelectorAll(".reveal-scroll");

  if (prefersReduced) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);

            if (entry.target.id === "solution-terminal") {
              startTypewriter();
            }
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -48px 0px" }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* Typewriter — solution terminal */
  const terminalLines = [
    { text: "> Развертывание на GPU...", class: "line-dim" },
    { text: "> Обучение модели под ваши задачи...", class: "line-dim" },
    { text: "✓ Готово.", class: "line-ok" },
  ];
  let typewriterStarted = false;

  function startTypewriter() {
    if (typewriterStarted) return;
    typewriterStarted = true;
    const out = document.getElementById("typewriter-output");
    if (!out) return;

    const delayStart = 300;
    let lineIndex = 0;
    let charIndex = 0;
    let currentLine = "";

    function typeNext() {
      if (lineIndex >= terminalLines.length) return;
      const line = terminalLines[lineIndex];
      if (charIndex === 0) {
        currentLine = document.createElement("div");
        currentLine.className = line.class;
        out.appendChild(currentLine);
      }
      if (charIndex < line.text.length) {
        currentLine.textContent += line.text[charIndex];
        charIndex++;
        setTimeout(typeNext, 28);
      } else {
        lineIndex++;
        charIndex = 0;
        setTimeout(typeNext, 200);
      }
    }

    setTimeout(typeNext, delayStart);
  }

  /* Counter animation for summary */
  let countersDone = false;

  function animateCounters(section) {
    if (countersDone || !section) return;
    const values = section.querySelectorAll(".summary-value[data-count]");
    if (!values.length) return;
    countersDone = true;

    values.forEach((el) => {
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || "";
      const duration = 800;
      const start = performance.now();

      function tick(now) {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        const current = Math.round(target * eased);
        el.textContent = current + suffix;
        if (t < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }

  /* Summary counters on scroll */
  const summarySection = document.getElementById("summary");
  if (summarySection && !prefersReduced) {
    const summaryObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounters(summarySection);
            summaryObserver.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    summaryObserver.observe(summarySection);
  }

  /* CTA pulse on first view */
  if (ctaBtn && !prefersReduced) {
    const ctaObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            ctaBtn.classList.add("pulse-once");
            ctaObserver.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );
    ctaObserver.observe(ctaBtn);
  }
})();
