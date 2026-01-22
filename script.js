(() => {
  const root = document.documentElement;
  const stored = localStorage.getItem("theme");
  const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;

  function setTheme(mode) {
    if (mode === "light") root.setAttribute("data-theme", "light");
    else root.removeAttribute("data-theme");
    localStorage.setItem("theme", mode);
  }

  if (stored) setTheme(stored);
  else setTheme(prefersLight ? "light" : "dark");

  // Theme toggle
  const themeBtn = document.querySelector("[data-theme-toggle]");
  themeBtn?.addEventListener("click", () => {
    const isLight = root.getAttribute("data-theme") === "light";
    setTheme(isLight ? "dark" : "light");
  });

  // Year in footer
  const y = document.querySelector("[data-year]");
  if (y) y.textContent = String(new Date().getFullYear());

  // Sticky header elevation on scroll
  const header = document.querySelector("[data-elevate]");
  const onScroll = () => {
    header?.setAttribute("data-elevate", window.scrollY > 6 ? "true" : "false");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Mobile nav
  const toggle = document.querySelector(".nav__toggle");
  const links = document.querySelector("[data-navlinks]");
  const close = () => {
    links?.removeAttribute("data-open");
    toggle?.setAttribute("aria-expanded", "false");
  };

  toggle?.addEventListener("click", () => {
    const open = links?.getAttribute("data-open") === "true";
    if (open) close();
    else {
      links?.setAttribute("data-open", "true");
      toggle?.setAttribute("aria-expanded", "true");
    }
  });

  // Close nav when clicking a link (mobile)
  links?.addEventListener("click", (e) => {
    const t = e.target;
    if (t && t.tagName === "A") close();
  });

  // Close nav on outside click
  document.addEventListener("click", (e) => {
    if (!links || !toggle) return;
    const target = e.target;
    const isInside = links.contains(target) || toggle.contains(target);
    if (!isInside) close();
  });

  // Brand click: always go to true top (prevents header cut-off)
  const brand = document.querySelector(".brand");
  brand?.addEventListener("click", (e) => {
    // Let the hash update, but force a clean top scroll
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();

