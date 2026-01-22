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

  // Back to top button
  const backToTop = document.createElement("button");
  backToTop.className = "back-to-top";
  backToTop.setAttribute("aria-label", "Back to top");
  backToTop.innerHTML = "↑";
  document.body.appendChild(backToTop);

  // Show/hide back to top button based on scroll position
  const toggleBackToTop = () => {
    if (window.scrollY > 300) {
      backToTop.classList.add("visible");
    } else {
      backToTop.classList.remove("visible");
    }
  };

  window.addEventListener("scroll", toggleBackToTop, { passive: true });
  toggleBackToTop(); // Check initial state

  // Scroll to top when clicked
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Image Lightbox
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.innerHTML = `
    <div class="lightbox__content">
      <button class="lightbox__close" aria-label="Close lightbox">×</button>
      <img class="lightbox__image" src="" alt="" />
    </div>
  `;
  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector(".lightbox__image");
  const lightboxClose = lightbox.querySelector(".lightbox__close");

  // Function to open lightbox
  function openLightbox(imgSrc, imgAlt) {
    lightboxImg.src = imgSrc;
    lightboxImg.alt = imgAlt;
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden"; // Prevent scrolling
  }

  // Function to close lightbox
  function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = ""; // Restore scrolling
  }

  // Add click listeners to all project images
  const projectImages = document.querySelectorAll(".project-media img");
  projectImages.forEach((img) => {
    img.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent card overlay click
      openLightbox(img.src, img.alt);
    });
  });

  // Close lightbox on close button click
  lightboxClose.addEventListener("click", (e) => {
    e.stopPropagation();
    closeLightbox();
  });

  // Prevent closing when clicking the backdrop (removed closeLightbox on backdrop click)
  // lightbox.addEventListener("click", closeLightbox); <--- Removed

  // Prevent closing when clicking the image itself
  lightboxImg.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  // Close lightbox on ESC key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("active")) {
      closeLightbox();
    }
  });
})();

