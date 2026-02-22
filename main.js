// main.js
(() => {
  // =========================
  // Mobile burger menu
  // =========================
  const burgerBtn = document.getElementById("burgerBtn");
  const mobileNav = document.getElementById("mobileNav");

  const openNav = () => {
    document.body.classList.add("nav-open");
    if (burgerBtn) burgerBtn.setAttribute("aria-expanded", "true");
  };

  const closeNav = () => {
    document.body.classList.remove("nav-open");
    if (burgerBtn) burgerBtn.setAttribute("aria-expanded", "false");
  };

  const toggleNav = () => {
    document.body.classList.contains("nav-open") ? closeNav() : openNav();
  };

  if (burgerBtn && mobileNav) {
    burgerBtn.addEventListener("click", toggleNav);

    // Ferme le menu si on clique sur un lien
    mobileNav.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (a) closeNav();
    });

    // Ferme avec ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeNav();
    });

    // Si on repasse en desktop, on ferme
    window.addEventListener("resize", () => {
      if (window.innerWidth > 980) closeNav();
    });
  }

  // =========================
  // FAQ accordion (1 seul ouvert)
  // =========================
  const items = Array.from(document.querySelectorAll(".faqItem"));

  items.forEach((item) => {
    const btn = item.querySelector(".faqQ");
    if (!btn) return;

    btn.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      // Un seul ouvert à la fois
      items.forEach((it) => {
        it.classList.remove("open");
        const b = it.querySelector(".faqQ");
        if (b) b.setAttribute("aria-expanded", "false");
      });

      if (!isOpen) {
        item.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  // =========================
  // Apple-like reveal (fade in on scroll)
  // =========================
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const revealTargets = [
    ...document.querySelectorAll(".heroCard, .preview, section.sectionCard, footer")
  ];

  // Ajoute .reveal automatiquement (CSS: .reveal + .is-in)
  revealTargets.forEach((el) => el.classList.add("reveal"));

  if (!prefersReduced && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { root: null, threshold: 0.14, rootMargin: "0px 0px -6% 0px" }
    );

    revealTargets.forEach((el) => io.observe(el));
  } else {
    // Fallback: tout visible
    revealTargets.forEach((el) => el.classList.add("is-in"));
  }

  // =========================
  // Parallax léger sur l'image ValueBot
  // - désactivé sur mobile / touch / reduced motion
  // =========================
  if (!prefersReduced) {
    const card = document.querySelector(".valuebot-inner");
    const img = card ? card.querySelector("img") : null;

    const isTouch =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(hover: none)").matches;

    if (card && img && !isTouch) {
      let raf = null;

      const update = () => {
        raf = null;

        const rect = card.getBoundingClientRect();
        const vh = window.innerHeight || document.documentElement.clientHeight;

        // progress -1..1 autour du centre de l'écran
        const center = rect.top + rect.height / 2;
        const p = (center - vh / 2) / (vh / 2);
        const clamped = Math.max(-1, Math.min(1, p));

        // amplitude ultra légère (max ~10px)
        const y = clamped * 10;

        // IMPORTANT:
        // Le micro-zoom hover premium (CSS) prend le relais au hover.
        // Ici on applique un transform de base "parallax + léger scale"
        img.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0) scale(1.02)`;
      };

      const onScroll = () => {
        if (raf) return;
        raf = requestAnimationFrame(update);
      };

      // init + listeners
      update();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
    }
  }
})();
