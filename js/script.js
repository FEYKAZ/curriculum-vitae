const html = document.documentElement;
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-menu a");
const sections = document.querySelectorAll("main section");
const revealElements = document.querySelectorAll(".reveal");
const contactForm = document.getElementById("contactForm");
const year = document.getElementById("year");
const themeToggle = document.getElementById("themeToggle");
const themeIcon = themeToggle.querySelector(".theme-icon");
const themeLabel = themeToggle.querySelector(".theme-label");

year.textContent = new Date().getFullYear();

/* =========================================================
   MOBILE MENU
   ========================================================= */

menuToggle.addEventListener("click", () => {
  navMenu.classList.toggle("open");
});

navLinks.forEach(link => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("open");
  });
});

/* =========================================================
   THEME SWITCHER
   Black <-> White
   Saves the selected theme in localStorage.
   ========================================================= */

const savedTheme = localStorage.getItem("cv-theme");

if (savedTheme === "white" || savedTheme === "black") {
  html.dataset.theme = savedTheme;
}

function updateThemeButton() {
  const isWhite = html.dataset.theme === "white";

  themeIcon.textContent = isWhite ? "☀" : "☾";
  themeLabel.textContent = isWhite ? "White" : "Black";
  themeToggle.setAttribute(
    "aria-label",
    isWhite ? "Switch to black theme" : "Switch to white theme"
  );
}

updateThemeButton();

themeToggle.addEventListener("click", () => {
  const nextTheme = html.dataset.theme === "black" ? "white" : "black";

  html.dataset.theme = nextTheme;
  localStorage.setItem("cv-theme", nextTheme);

  updateThemeButton();
});

/* =========================================================
   SCROLL REVEAL
   ========================================================= */

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, { threshold: 0.12 });

revealElements.forEach(element => revealObserver.observe(element));

/* =========================================================
   ACTIVE NAVIGATION
   ========================================================= */

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const id = entry.target.getAttribute("id");

    navLinks.forEach(link => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === `#${id}`
      );
    });
  });
}, { rootMargin: "-35% 0px -55% 0px" });

sections.forEach(section => sectionObserver.observe(section));

/* =========================================================
   CERTIFICATE LIGHTBOX
   Clicking a certificate opens a larger preview.
   ========================================================= */

const certificateImages = document.querySelectorAll(".certificate-image img");

const lightbox = document.createElement("div");
lightbox.className = "certificate-lightbox";
lightbox.innerHTML = `
  <button class="lightbox-close" aria-label="Close certificate preview">×</button>
  <img src="" alt="Certificate preview">
`;

document.body.appendChild(lightbox);

const lightboxImage = lightbox.querySelector("img");
const lightboxClose = lightbox.querySelector(".lightbox-close");

certificateImages.forEach(image => {
  image.addEventListener("click", () => {
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightbox.classList.add("open");
  });
});

function closeLightbox() {
  lightbox.classList.remove("open");
}

lightboxClose.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", event => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeLightbox();
  }
});

/* =========================================================
   CONTACT FORM
   Front-end only: opens the visitor's email application.
   Change the email address below to your real email.
   ========================================================= */

contactForm.addEventListener("submit", event => {
  event.preventDefault();

  const name = contactForm.elements.name.value.trim();
  const email = contactForm.elements.email.value.trim();
  const message = contactForm.elements.message.value.trim();

  const subject = encodeURIComponent(`Website Contact from ${name}`);
  const body = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\n\n${message}`
  );

  window.location.href =
    `mailto:your-email@example.com?subject=${subject}&body=${body}`;
});
