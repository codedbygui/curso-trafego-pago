const header = document.querySelector(".site-header");
const CHECKOUT_VALUE = 113.5;
const CHECKOUT_CURRENCY = "BRL";
const COUNTDOWN_DURATION_MS = 10 * 60 * 1000;
const COUNTDOWN_STORAGE_KEY = "tg_offer_countdown_ends_at";

const trackCheckoutIntent = () => {
  const eventPayload = {
    content_name: "Gestão de Tráfego: Migrando para a Área",
    content_category: "Curso online",
    currency: CHECKOUT_CURRENCY,
    value: CHECKOUT_VALUE,
  };

  if (window.fbq) {
    window.fbq("track", "InitiateCheckout", eventPayload);
  }

  if (window.gtag) {
    window.gtag("event", "begin_checkout", {
      currency: CHECKOUT_CURRENCY,
      value: CHECKOUT_VALUE,
      items: [
        {
          item_name: "Gestão de Tráfego: Migrando para a Área",
          item_category: "Curso online",
          price: CHECKOUT_VALUE,
          quantity: 1,
        },
      ],
    });
  }
};

const updateHeader = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

const countdownTargets = document.querySelectorAll("[data-countdown]");

if (countdownTargets.length) {
  const now = Date.now();
  const storedEndsAt = Number(sessionStorage.getItem(COUNTDOWN_STORAGE_KEY));
  const endsAt = storedEndsAt > now ? storedEndsAt : now + COUNTDOWN_DURATION_MS;

  sessionStorage.setItem(COUNTDOWN_STORAGE_KEY, String(endsAt));

  const updateCountdown = () => {
    const remaining = Math.max(0, endsAt - Date.now());
    const totalSeconds = Math.ceil(remaining / 1000);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    const label = `${minutes}:${seconds}`;

    countdownTargets.forEach((target) => {
      target.textContent = label;
    });
  };

  updateCountdown();
  window.setInterval(updateCountdown, 1000);
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    if (!targetId || targetId === "#") return;
    const target = document.querySelector(targetId);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

document.querySelectorAll("details").forEach((detail) => {
  detail.addEventListener("toggle", () => {
    if (!detail.open) return;
    document.querySelectorAll("details").forEach((item) => {
      if (item !== detail) item.removeAttribute("open");
    });
  });
});

const revealTargets = document.querySelectorAll(
  ".section-heading, .step-card, .module-list article, .testimonial-card, .comparison-grid article, .offer-card, .faq-list details, .metrics-row div"
);

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );

  revealTargets.forEach((target, index) => {
    target.classList.add("reveal");
    target.style.transitionDelay = `${Math.min(index % 4, 3) * 80}ms`;
    observer.observe(target);
  });
} else {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
}

document.querySelectorAll("[data-carousel]").forEach((carousel) => {
  const viewport = carousel.querySelector(".testimonial-viewport");
  const prev = carousel.querySelector("[data-carousel-prev]");
  const next = carousel.querySelector("[data-carousel-next]");

  if (!viewport || !prev || !next) return;

  const move = (direction) => {
    viewport.scrollBy({
      left: direction * viewport.clientWidth * 0.9,
      behavior: "smooth",
    });
  };

  prev.addEventListener("click", () => move(-1));
  next.addEventListener("click", () => move(1));
});

document.querySelectorAll("[data-track-checkout]").forEach((link) => {
  link.addEventListener("click", trackCheckoutIntent);
});

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });
