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

nav.querySelectorAll("a:not([aria-disabled='true'])").forEach((link) => {
    link.addEventListener("click", closeMenu);
});

nav.querySelectorAll("[aria-disabled='true']").forEach((link) => {
    link.addEventListener("click", (event) => event.preventDefault());
});

const slideTrack = document.querySelector(".hero-slides");
const slides = [...document.querySelectorAll(".hero-slide:not(.hero-slide--clone)")];
const dots = [...document.querySelectorAll(".hero-dot")];
const previous = document.querySelector(".hero-arrow--prev");
const next = document.querySelector(".hero-arrow--next");
const hero = document.querySelector(".introback");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let currentSlide = 0;
let visualSlide = 1;
let slideTimer;
let isSliding = false;

const updateSlideState = (index) => {
    currentSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
        slide.classList.toggle("is-active", slideIndex === currentSlide);
    });
    dots.forEach((dot, dotIndex) => {
        const isActive = dotIndex === currentSlide;
        dot.classList.toggle("is-active", isActive);
        dot.setAttribute("aria-pressed", String(isActive));
    });
};

const moveSlide = (direction) => {
    if (isSliding) return;
    isSliding = true;
    visualSlide += direction;
    updateSlideState(currentSlide + direction);
    slideTrack.style.transform = `translateX(-${visualSlide * 100}%)`;
    if (reduceMotion) isSliding = false;
};

const selectSlide = (index) => {
    if (isSliding || index === currentSlide) return;
    isSliding = true;
    updateSlideState(index);
    visualSlide = currentSlide + 1;
    slideTrack.style.transform = `translateX(-${visualSlide * 100}%)`;
    if (reduceMotion) isSliding = false;
    startSlider();
};

slideTrack.addEventListener("transitionend", (event) => {
    if (event.target !== slideTrack || event.propertyName !== "transform") return;

    if (visualSlide === slides.length + 1) {
        visualSlide = 1;
    } else if (visualSlide === 0) {
        visualSlide = slides.length;
    } else {
        isSliding = false;
        return;
    }

    slideTrack.classList.add("is-resetting");
    slideTrack.style.transform = `translateX(-${visualSlide * 100}%)`;
    updateSlideState(currentSlide);

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            slideTrack.classList.remove("is-resetting");
            isSliding = false;
        });
    });
});

const startSlider = () => {
    if (reduceMotion) return;
    window.clearInterval(slideTimer);
    slideTimer = window.setInterval(() => moveSlide(1), 6000);
};

previous.addEventListener("click", () => {
    moveSlide(-1);
    startSlider();
});
next.addEventListener("click", () => {
    moveSlide(1);
    startSlider();
});
dots.forEach((dot, index) => dot.addEventListener("click", () => selectSlide(index)));

hero.addEventListener("mouseenter", () => window.clearInterval(slideTimer));
hero.addEventListener("mouseleave", startSlider);
hero.addEventListener("focusin", () => window.clearInterval(slideTimer));
hero.addEventListener("focusout", startSlider);

startSlider();

const newsCarousel = document.querySelector(".news-carousel");
const newsTrack = document.querySelector(".news-track");
const newsPrevious = document.querySelector(".carousel-arrow--prev");
const newsNext = document.querySelector(".carousel-arrow--next");

const updateNewsControls = () => {
    const maximumScroll = newsTrack.scrollWidth - newsTrack.clientWidth;
    newsPrevious.disabled = newsTrack.scrollLeft <= 4;
    newsNext.disabled = newsTrack.scrollLeft >= maximumScroll - 4;
    newsCarousel.classList.toggle("is-at-end", newsNext.disabled);
};

const scrollNews = (direction) => {
    const card = newsTrack.querySelector(".news-card");
    const gap = Number.parseFloat(getComputedStyle(newsTrack).columnGap) || 0;
    newsTrack.scrollBy({ left: direction * (card.offsetWidth + gap), behavior: "smooth" });
};

newsPrevious.addEventListener("click", () => scrollNews(-1));
newsNext.addEventListener("click", () => scrollNews(1));
newsTrack.addEventListener("scroll", updateNewsControls, { passive: true });
window.addEventListener("resize", updateNewsControls);
updateNewsControls();
