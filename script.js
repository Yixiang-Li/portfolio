function activateTab(tablist, nextTab) {
  const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
  const container = tablist.closest("[data-tabs]");
  if (!container) return;

  tabs.forEach((tab) => {
    const active = tab === nextTab;
    const panel = container.querySelector(`#${tab.getAttribute("aria-controls")}`);
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
    if (!panel) return;
    panel.hidden = !active;
    panel.classList.remove("is-entering");
    if (active) {
      panel.getBoundingClientRect();
      panel.classList.add("is-entering");
    }
  });
}

document.querySelectorAll("[data-tabs] [role='tablist']").forEach((tablist) => {
  const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
  tabs.forEach((tab, index) => {
    tab.tabIndex = tab.getAttribute("aria-selected") === "true" ? 0 : -1;
    tab.addEventListener("click", () => activateTab(tablist, tab));
    tab.addEventListener("keydown", (event) => {
      const last = tabs.length - 1;
      let nextIndex = index;

      if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = index === last ? 0 : index + 1;
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = index === 0 ? last : index - 1;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = last;
      if (nextIndex === index) return;

      event.preventDefault();
      tabs[nextIndex].focus();
      activateTab(tablist, tabs[nextIndex]);
    });
  });
});

const tocLinks = Array.from(document.querySelectorAll(".toc:not(.empty) a[href^='#']"));
const tocSections = tocLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window && tocLinks.length && tocSections.length) {
  const setCurrentLink = (id) => {
    tocLinks.forEach((link) => {
      const current = link.getAttribute("href") === `#${id}`;
      if (current) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target?.id) setCurrentLink(visible.target.id);
    },
    { rootMargin: "-20% 0px -60% 0px", threshold: [0.15, 0.35, 0.6] },
  );

  tocSections.forEach((section) => observer.observe(section));
}

document.querySelectorAll("[data-lens]").forEach((module) => {
  const buttons = Array.from(module.querySelectorAll("[data-lens-trigger]"));
  const title = module.querySelector("[data-lens-title]");
  const copy = module.querySelector("[data-lens-copy]");
  const number = module.querySelector("[data-lens-number]");
  const output = module.querySelector(".decision-detail");

  buttons.forEach((button, index) => {
    button.tabIndex = button.classList.contains("is-active") ? 0 : -1;
    button.addEventListener("click", () => {
      buttons.forEach((item) => {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-selected", String(active));
        item.tabIndex = active ? 0 : -1;
      });
      if (title) title.textContent = button.dataset.title || "";
      if (copy) copy.textContent = button.dataset.copy || "";
      if (number) number.textContent = String(index + 1).padStart(2, "0");
      output?.classList.remove("is-updating");
      output?.getBoundingClientRect();
      output?.classList.add("is-updating");
    });
    button.addEventListener("keydown", (event) => {
      const last = buttons.length - 1;
      let nextIndex = index;

      if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = index === last ? 0 : index + 1;
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = index === 0 ? last : index - 1;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = last;
      if (nextIndex === index) return;

      event.preventDefault();
      buttons[nextIndex].focus();
      buttons[nextIndex].click();
    });
  });
});
