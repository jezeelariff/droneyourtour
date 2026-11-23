// Mobile menu
const toggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("site-nav");
if (toggle && nav) {
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
}

// Hero altitude readout: climbs to 120 m once on load
const alt = document.getElementById("alt");
if (alt) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
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
}

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

/* ------------------------------------------------------------------
   Contact form
   - Sends the enquiry to your Cloudflare Worker, which emails you via Resend.
   - The page never reloads and no email app opens.
   - What the visitor types is saved in their browser as they type, so it
     survives a refresh or a failed send. It's cleared after a successful send.
   ------------------------------------------------------------------ */
const form = document.getElementById("contact-form");
if (form) {
  const ENDPOINT = form.dataset.endpoint;
  const DRAFT_KEY = "dyt-enquiry-draft";
  const status = form.querySelector(".form-status");
  const button = form.querySelector('button[type="submit"]');
  const fields = ["names", "contact", "dates", "package", "message"];

  const setStatus = (text, kind) => {
    status.textContent = text;
    status.classList.toggle("is-ok", kind === "ok");
    status.classList.toggle("is-err", kind === "err");
  };

  // Restore a saved draft
  try {
    const saved = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null");
    if (saved) fields.forEach(n => { if (saved[n] && form.elements[n]) form.elements[n].value = saved[n]; });
  } catch (_) { /* storage unavailable: ignore */ }

  // Save as they type
  const saveDraft = () => {
    try {
      const d = {};
      fields.forEach(n => { d[n] = form.elements[n] ? form.elements[n].value : ""; });
      localStorage.setItem(DRAFT_KEY, JSON.stringify(d));
    } catch (_) { /* ignore */ }
  };
  form.addEventListener("input", saveDraft);
  form.addEventListener("change", saveDraft);

  form.addEventListener("submit", async e => {
    e.preventDefault();

    // Validate required fields
    let firstBad = null;
    form.querySelectorAll("[required]").forEach(el => {
      const ok = el.value.trim() !== "" && el.checkValidity();
      el.setAttribute("aria-invalid", String(!ok));
      if (!ok && !firstBad) firstBad = el;
    });
    if (firstBad) {
      setStatus("Please add your name, a WhatsApp number or email, and a short message.", "err");
      firstBad.focus();
      return;
    }

    const payload = Object.fromEntries(new FormData(form));
    button.disabled = true;
    const label = button.textContent;
    button.textContent = "Sending…";
    setStatus("", null);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || "Send failed");

      form.reset();
      try { localStorage.removeItem(DRAFT_KEY); } catch (_) {}
      setStatus("Thank you! Your enquiry has been sent. I’ll get back to you soon.", "ok");
    } catch (err) {
      // Fields stay filled in, so nothing needs retyping
      setStatus("Sorry, that didn’t go through. Your details are still here, so please try again, or message me on WhatsApp.", "err");
      console.error(err);
    } finally {
      clearTimeout(timer);
      button.disabled = false;
      button.textContent = label;
    }
  });
}

// Select package automatically when clicking a package button
document.querySelectorAll(".pkg-select").forEach(link => {
  link.addEventListener("click", () => {
    const pkgName = link.dataset.package;
    const pkgSelect = document.querySelector('#contact-form select[name="package"]');
    if (pkgSelect && pkgName) {
      pkgSelect.value = pkgName;
      pkgSelect.dispatchEvent(new Event("change", { bubbles: true }));
    }
  });
});
