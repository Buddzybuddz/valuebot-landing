(function () {
  "use strict";

  // =========================
  // Burger menu (mobile)
  // =========================
  const burgerBtn = document.getElementById("burgerBtn");
  const mobileNav = document.getElementById("mobileNav");

  function openNav() {
    document.body.classList.add("nav-open");
    if (burgerBtn) burgerBtn.setAttribute("aria-expanded", "true");
  }

  function closeNav() {
    document.body.classList.remove("nav-open");
    if (burgerBtn) burgerBtn.setAttribute("aria-expanded", "false");
  }

  function toggleNav() {
    document.body.classList.contains("nav-open") ? closeNav() : openNav();
  }

  if (burgerBtn && mobileNav) {
    burgerBtn.addEventListener("click", toggleNav);

    // Fermer au clic sur un lien
    mobileNav.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (a) closeNav();
    });

    // Fermer sur ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeNav();
    });

    // Si on repasse desktop (rotation / resize), on ferme
    window.addEventListener("resize", () => {
      if (window.innerWidth > 980) closeNav();
    });
  }

  // =========================
  // FAQ accordion
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
})();
