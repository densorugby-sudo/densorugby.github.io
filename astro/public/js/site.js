const menu = document.getElementById("menu");
const back = document.getElementById("back");
const nav = document.getElementById("nav");

const closeMenu = () => {
  nav.classList.remove("open-menu");
  back.classList.remove("open");
  menu.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-is-open");
};

menu.addEventListener("click", () => {
  const willOpen = !nav.classList.contains("open-menu");
  nav.classList.toggle("open-menu", willOpen);
  back.classList.toggle("open", willOpen);
  menu.setAttribute("aria-expanded", String(willOpen));
  document.body.classList.toggle("menu-is-open", willOpen);
});

back.addEventListener("click", closeMenu);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});
nav.querySelectorAll("a:not([aria-disabled='true'])").forEach((link) => link.addEventListener("click", closeMenu));
nav.querySelectorAll("[aria-disabled='true']").forEach((link) => link.addEventListener("click", (event) => event.preventDefault()));

const aboutGallery = document.querySelector(".about-gallery");

if (aboutGallery) {
  const slides = [...aboutGallery.querySelectorAll(".about-gallery__slide")];
  const dots = [...aboutGallery.querySelectorAll(".about-gallery__dots button")];
  const previous = aboutGallery.querySelector(".about-gallery__arrow--prev");
  const next = aboutGallery.querySelector(".about-gallery__arrow--next");
  let current = 0;

  const show = (index) => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => slide.classList.toggle("is-active", slideIndex === current));
    dots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === current;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-pressed", String(isActive));
    });
  };

  previous.addEventListener("click", () => show(current - 1));
  next.addEventListener("click", () => show(current + 1));
  dots.forEach((dot, index) => dot.addEventListener("click", () => show(index)));
}
