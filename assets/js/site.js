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

function initStickyNav() {
  const nav = document.querySelector(".nav");
  if (!nav) return;

  const updateNav = () => {
    nav.classList.toggle("nav-scrolled", window.scrollY > 28);
  };

  updateNav();
  window.addEventListener("scroll", updateNav, { passive: true });
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



function pushAnalyticsEvent(eventName, params = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...params });
}

function initAnalyticsConsent() {
  const existing = document.querySelector("[data-analytics-consent]");
  if (existing) return;

  let choice = null;
  try {
    choice = localStorage.getItem("wynncrest_analytics_consent");
  } catch (error) {}

  if (choice) return;

  const banner = document.createElement("div");
  banner.className = "analytics-consent";
  banner.setAttribute("data-analytics-consent", "");
  banner.innerHTML = `
    <div class="analytics-consent-inner">
      <p>We use optional analytics to understand how visitors use Wynncrest Books and improve the site.</p>
      <div class="analytics-consent-actions">
        <button type="button" class="analytics-consent-button analytics-consent-accept">Allow analytics</button>
        <button type="button" class="analytics-consent-button analytics-consent-decline">Decline</button>
      </div>
    </div>
  `;

  document.body.appendChild(banner);

  const saveChoice = value => {
    try { localStorage.setItem("wynncrest_analytics_consent", value); } catch (error) {}
    if (typeof gtag === "function") {
      gtag("consent", "update", {
        analytics_storage: value === "granted" ? "granted" : "denied"
      });
    }
    pushAnalyticsEvent("analytics_consent_update", { analytics_consent: value });
    banner.remove();
  };

  banner.querySelector(".analytics-consent-accept")?.addEventListener("click", () => saveChoice("granted"));
  banner.querySelector(".analytics-consent-decline")?.addEventListener("click", () => saveChoice("denied"));
}

function initCookieSettings() {
  document.querySelectorAll("[data-cookie-settings]").forEach(button => {
    button.addEventListener("click", () => {
      try { localStorage.removeItem("wynncrest_analytics_consent"); } catch (error) {}
      window.location.reload();
    });
  });
}

function initAnalyticsEvents() {
  document.querySelectorAll("a[href^='mailto:']").forEach(link => {
    link.addEventListener("click", () => {
      pushAnalyticsEvent("email_click", {
        link_url: link.href,
        link_text: link.textContent.trim()
      });
    });
  });

  document.querySelectorAll("a[href='/publish/#application'], a[href$='/publish/#application']").forEach(link => {
    link.addEventListener("click", () => {
      pushAnalyticsEvent("publishing_inquiry_start", {
        link_text: link.textContent.trim(),
        page_path: window.location.pathname
      });
    });
  });

  document.querySelectorAll("a[href='/referrals/'], a[href$='/referrals/']").forEach(link => {
    link.addEventListener("click", () => {
      pushAnalyticsEvent("referral_interest", {
        link_text: link.textContent.trim(),
        page_path: window.location.pathname
      });
    });
  });


  document.querySelectorAll(".wynncrest-airtable-form").forEach(frame => {
    frame.addEventListener("load", () => {
      pushAnalyticsEvent("embedded_form_view", {
        form_title: frame.title || "Wynncrest form",
        page_path: window.location.pathname
      });
    });
  });

  if (window.location.pathname.replace(/\/+$/, "") === "/thank-you") {
    pushAnalyticsEvent("generate_lead", {
      lead_type: "website_form",
      page_path: window.location.pathname
    });
  }
}


document.addEventListener("DOMContentLoaded", async () => {
  await Promise.all([
    loadComponent("#site-header", "/components/header.html"),
    loadComponent("#site-footer", "/components/footer.html")
  ]);

  initYear();
  initMenu();
  initStickyNav();
  initReveal();
  initEmailForms();
  initAnalyticsConsent();
  initCookieSettings();
  initAnalyticsEvents();
});
