// Change this to the inbox that should receive enquiries.
const CONTACT_EMAIL = "hello@droneyourtour.com";

// Mobile menu
const toggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("site-nav");
toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
  toggle.textContent = open ? "Close" : "Menu";
});
nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
  nav.classList.remove("open");
  toggle.setAttribute("aria-expanded", "false");
  toggle.textContent = "Menu";
}));

// Hero altitude readout: climbs to 120 m once on load
const alt = document.getElementById("alt");
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (reduce) {
  alt.textContent = "120";
} else {
  const start = performance.now();
  const step = now => {
    const t = Math.min((now - start) / 2200, 1);
    alt.textContent = Math.round(120 * (1 - Math.pow(1 - t, 3)));
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

document.getElementById("year").textContent = new Date().getFullYear();

// Contact form: opens the visitor's email app with the enquiry filled in.
// To use a form service (Formspree, Netlify Forms, etc.) instead, see README.md.
const form = document.getElementById("contact-form");
const status = form.querySelector(".form-status");
form.addEventListener("submit", e => {
  e.preventDefault();
  let firstBad = null;
  form.querySelectorAll("[required]").forEach(el => {
    const ok = el.checkValidity();
    el.setAttribute("aria-invalid", String(!ok));
    if (!ok && !firstBad) firstBad = el;
  });
  if (firstBad) {
    status.textContent = "Fill in your names, a valid email and a short message to send your enquiry.";
    firstBad.focus();
    return;
  }
  const d = Object.fromEntries(new FormData(form));
  const body =
    `Names: ${d.names}\nEmail: ${d.email}\nTravel dates: ${d.dates || "-"}\nPackage: ${d.package}\n\n${d.message}`;
  window.location.href =
    `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Pre-wedding enquiry from " + d.names)}&body=${encodeURIComponent(body)}`;
  status.textContent = "Your email app should open with the enquiry ready to send.";
});
