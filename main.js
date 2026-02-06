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
