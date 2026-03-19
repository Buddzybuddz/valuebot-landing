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

// =========================
// ValueBot - Stats + analyses
// =========================

const SUPABASE_URL = "https://zdedwolwawmloodopioh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" + ".eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkZWR3b2x3YXdtbG9vZG9waW9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NzUzNzAsImV4cCI6MjA3NTM1MTM3MH0" + ".sp9-4ZHO_bUxAIDWhRWUFkj44kSM4utN_wRoxbpFIto";

function formatPct(value) {
  if (value === null || value === undefined || isNaN(Number(value))) return "--";
  return `${Number(value).toFixed(1)}%`;
}

function formatOdds(value) {
  if (value === null || value === undefined || isNaN(Number(value))) return "--";
  return Number(value).toFixed(2);
}

function formatDateFR(dateStr) {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${day}-${month}-${year}`;
}

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function loadValueBotPerformance() {
  const pctEl = document.getElementById("pctWinValue");
  const avgEl = document.getElementById("avgOddsValue");
  const listEl = document.getElementById("analysisList");

  if (!pctEl || !avgEl || !listEl) return;

  try {
    // Stats
    const statsUrl =
      `${SUPABASE_URL}/rest/v1/statistiques_roi_v2` +
      `?select=pct_win_total_value,cote_moyenne_total_value,season` +
      `&order=season.desc` +
      `&limit=1`;

    const statsRes = await fetch(statsUrl, {
      method: "GET",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Accept-Profile": "valuebet"
      }
    });

    const statsText = await statsRes.text();
    console.log("stats status =", statsRes.status);
    console.log("stats raw =", statsText);

    if (!statsRes.ok) {
      throw new Error(`STATS ${statsRes.status} - ${statsText}`);
    }

    const statsData = statsText ? JSON.parse(statsText) : [];
    const stats = statsData?.[0] || null;

    pctEl.textContent = formatPct(stats?.pct_win_total_value);
    avgEl.textContent = formatOdds(stats?.cote_moyenne_total_value);

    // Analyses avant aujourd'hui
    const today = new Date().toISOString().split("T")[0];

    const analysesUrl =
      `${SUPABASE_URL}/rest/v1/value_bet_ia_roi_v2` +
      `?select=date,league_name,team_name,analyse` +
      `&analyse=not.is.null` +
      `&date=lt.${today}` +
      `&order=date.desc` +
      `&limit=4`;

    const analysesRes = await fetch(analysesUrl, {
      method: "GET",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Accept-Profile": "valuebet"
      }
    });

    const analysesText = await analysesRes.text();
    console.log("analyses status =", analysesRes.status);
    console.log("analyses raw =", analysesText);

    if (!analysesRes.ok) {
      throw new Error(`ANALYSES ${analysesRes.status} - ${analysesText}`);
    }

    const analysesData = analysesText ? JSON.parse(analysesText) : [];

    if (!analysesData.length) {
      listEl.innerHTML = `<div class="analysisItem empty">Aucune analyse récente disponible.</div>`;
      return;
    }

    listEl.innerHTML = analysesData.map(item => `
      <article class="analysisItem">
        <div class="analysisMeta">
          <span>${formatDateFR(item.date)}</span>
          ${item.league_name ? `<span>${escapeHtml(item.league_name)}</span>` : ""}
          ${item.team_name ? `<span>${escapeHtml(item.team_name)}</span>` : ""}
        </div>
        <div class="analysisText">${item.analyse || ""}</div>
      </article>
    `).join("");

  } catch (error) {
    console.error("Erreur chargement stats ValueBot :", error);
    pctEl.textContent = "--";
    avgEl.textContent = "--";
    listEl.innerHTML = `<div class="analysisItem error">${escapeHtml(error.message)}</div>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadValueBotPerformance();
});
