const progress = document.querySelector(".reading-progress");

function updateProgress() {
  if (!progress) return;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
  progress.style.transform = `scaleX(${Math.min(Math.max(ratio, 0), 1)})`;
}

updateProgress();
window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);

const sidebar = document.querySelector(".sidebar");
const sidebarButton = document.querySelector(".sidebar-button");

sidebarButton?.addEventListener("click", () => {
  const open = sidebar?.classList.toggle("is-open") ?? false;
  sidebarButton.setAttribute("aria-expanded", String(open));
});

const links = Array.from(document.querySelectorAll(".sidebar a[href^='#']"));
const sections = links
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window && links.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible?.target?.id) return;
      links.forEach((link) => {
        const current = link.getAttribute("href") === `#${visible.target.id}`;
        if (current) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });
    },
    { rootMargin: "-18% 0px -64% 0px", threshold: [0.15, 0.35, 0.6] },
  );

  sections.forEach((section) => observer.observe(section));
}
