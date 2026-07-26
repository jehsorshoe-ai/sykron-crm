document.addEventListener("DOMContentLoaded", () => {

  /* ---- Header scroll state + progress bar ---- */
  const header = document.getElementById("siteHeader");
  const progressBar = document.getElementById("progressBar");
  const toTop = document.getElementById("toTop");

  function onScroll() {
    const scrollY = window.scrollY;
    header.classList.toggle("scrolled", scrollY > 40);
    toTop.classList.toggle("show", scrollY > 700);

    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    progressBar.style.width = max > 0 ? `${(scrollY / max) * 100}%` : "0%";
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ---- Mobile menu ---- */
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");

  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
  mainNav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ---- Scroll reveal ---- */
  const revealEls = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });
  revealEls.forEach(el => io.observe(el));

  /* ---- Case study tabs ---- */
  const tabs = document.querySelectorAll(".case-tab");
  const panels = document.querySelectorAll(".case-panel");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.case;
      tabs.forEach(t => t.classList.toggle("active", t === tab));
      panels.forEach(p => p.classList.toggle("active", p.dataset.casePanel === target));
    });
  });

});
