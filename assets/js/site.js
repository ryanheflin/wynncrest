async function loadComponent(selector, path) {
  const target = document.querySelector(selector);
  if (!target) return;

  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Unable to load ${path}`);
    target.innerHTML = await response.text();
  } catch (error) {
    console.error(error);
  }
}

function initYear() {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
}

function initMenu() {
  const menuButton = document.getElementById("menuButton");
  const navLinks = document.getElementById("navLinks");

  if (!menuButton || !navLinks) return;

  menuButton.setAttribute("aria-expanded", "false");

  menuButton.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });
}

function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach(item => item.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.10 });

  items.forEach(item => observer.observe(item));
}

function initEmailForms() {
  document.querySelectorAll("form[data-email-form]").forEach(form => {
    form.addEventListener("submit", event => {
      event.preventDefault();

      const subject = form.dataset.emailSubject || "Wynncrest Books Inquiry";
      const data = new FormData(form);
      const lines = [];

      for (const [name, value] of data.entries()) {
        const cleanValue = String(value).trim();
        if (cleanValue) lines.push(`${name}: ${cleanValue}`);
      }

      const body = lines.join("\n\n");
      const mailto =
        "mailto:liz@lizheflin.com?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(body);

      window.location.href = mailto;
    });
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  await Promise.all([
    loadComponent("#site-header", "/components/header.html"),
    loadComponent("#site-footer", "/components/footer.html")
  ]);

  initYear();
  initMenu();
  initReveal();
  initEmailForms();
});
