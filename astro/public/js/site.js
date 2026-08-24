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
