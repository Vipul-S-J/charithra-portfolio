```js
(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [
    ...root.querySelectorAll(selector)
  ];

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // ==========================================
  // PAGE LOADER
  // ==========================================

  const loader = $(".site-loader");

  function hideLoader() {
    if (loader) {
      loader.classList.add("is-hidden");
    }
  }

  window.addEventListener("load", () => {
    window.setTimeout(hideLoader, 450);
  });

  window.setTimeout(hideLoader, 1700);

  // ==========================================
  // REVEAL ANIMATIONS
  // ==========================================

  const revealElements = $$(".reveal, .image-reveal");

  if (
    "IntersectionObserver" in window &&
    !reduceMotion
  ) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.04,
        rootMargin: "0px 0px -5%"
      }
    );

    revealElements.forEach((element, index) => {
      element.style.transitionDelay =
        Math.min((index % 5) * 70, 280) + "ms";

      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("in-view");
    });
  }

  // ==========================================
  // MOBILE MENU
  // ==========================================

  const menu = $(".menu-toggle");
  const nav = $(".nav");

  if (menu) {
    menu.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("open");

      if (nav) {
        nav.classList.toggle("open", isOpen);
      }

      menu.setAttribute(
        "aria-expanded",
        String(isOpen)
      );
    });
  }

  $$(".nav a").forEach((link) => {
    link.addEventListener("click", () => {
      if (menu) {
        menu.classList.remove("open");
      }

      if (nav) {
        nav.classList.remove("open");
      }
    });
  });

  // ==========================================
  // SCROLL PROGRESS
  // ==========================================

  const progressBar = $(".progress-bar");

  function updateProgress() {
    const maxScroll =
      document.documentElement.scrollHeight -
      window.innerHeight;

    if (progressBar) {
      const percentage =
        maxScroll > 0
          ? (window.scrollY / maxScroll) * 100
          : 0;

      progressBar.style.width = percentage + "%";
    }

    const backTop = $(".back-top");

    if (backTop) {
      backTop.classList.toggle(
        "show",
        window.scrollY > 650
      );
    }
  }

  window.addEventListener(
    "scroll",
    updateProgress,
    { passive: true }
  );

  updateProgress();

  // ==========================================
  // BACK TO TOP
  // ==========================================

  const backTop = $(".back-top");

  if (backTop) {
    backTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  // ==========================================
  // ACTIVE NAVIGATION
  // ==========================================

  const navLinks = $$(".nav a");
  const sections = $$("main section[id]");

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          navLinks.forEach((link) => {
            const href = link.getAttribute("href");

            link.classList.toggle(
              "active",
              href === "#" + entry.target.id
            );
          });
        });
      },
      {
        rootMargin: "-35% 0px -55%"
      }
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }

  // ==========================================
  // PROJECT FILTERS
  // ==========================================

  $$(".filter-btn").forEach((button) => {
    button.addEventListener("click", () => {
      $$(".filter-btn").forEach((btn) => {
        btn.classList.remove("active");
      });

      button.classList.add("active");

      const filter = button.dataset.filter;

      $$(".project").forEach((project) => {
        const shouldHide =
          filter !== "all" &&
          project.dataset.category !== filter;

        project.classList.toggle(
          "is-filtered",
          shouldHide
        );
      });

      refreshGallery();
    });
  });

  // ==========================================
  // LIGHTBOX GALLERY
  // ==========================================

  let gallery = [];
  let galleryIndex = 0;

  const lightbox = $(".lightbox");
  const lightboxImage = $(".lightbox img");
  const lightboxCaption = $(".lightbox figcaption");

  function refreshGallery() {
    gallery = $$(".project-pages img, .hero-image img").filter(
      (image) => {
        const hiddenProject =
          image.closest(".project.is-filtered");

        return !hiddenProject;
      }
    );

    gallery.forEach((image, index) => {
      image.onclick = () => {
        openLightbox(index);
      };
    });
  }

  function openLightbox(index) {
    galleryIndex = index;

    const image = gallery[galleryIndex];

    if (
      !image ||
      !lightbox ||
      !lightboxImage ||
      !lightboxCaption
    ) {
      return;
    }

    lightboxImage.src =
      image.currentSrc || image.src;

    lightboxImage.alt = image.alt;

    lightboxCaption.textContent = image.alt;

    lightbox.classList.add("open");

    lightbox.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightbox) {
      return;
    }

    lightbox.classList.remove("open");

    lightbox.setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.style.overflow = "";
  }

  function moveGallery(direction) {
    if (!gallery.length) {
      return;
    }

    galleryIndex =
      (galleryIndex +
        direction +
        gallery.length) %
      gallery.length;

    openLightbox(galleryIndex);
  }

  refreshGallery();

  const lightboxClose = $(".lightbox-close");
  const lightboxPrev = $(".lightbox-prev");
  const lightboxNext = $(".lightbox-next");

  if (lightboxClose) {
    lightboxClose.addEventListener(
      "click",
      closeLightbox
    );
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener(
      "click",
      () => {
        moveGallery(-1);
      }
    );
  }

  if (lightboxNext) {
    lightboxNext.addEventListener(
      "click",
      () => {
        moveGallery(1);
      }
    );
  }

  if (lightbox) {
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });
  }

  window.addEventListener("keydown", (event) => {
    if (
      !lightbox ||
      !lightbox.classList.contains("open")
    ) {
      return;
    }

    if (event.key === "Escape") {
      closeLightbox();
    }

    if (event.key === "ArrowRight") {
      moveGallery(1);
    }

    if (event.key === "ArrowLeft") {
      moveGallery(-1);
    }
  });

  // ==========================================
  // CUSTOM CURSOR
  // ==========================================

  const cursor = $(".cursor");

  if (
    cursor &&
    window.matchMedia("(pointer:fine)").matches &&
    !reduceMotion
  ) {
    const cursorText = cursor.querySelector("span");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    let cursorX = mouseX;
    let cursorY = mouseY;

    window.addEventListener("mousemove", (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    });

    function animateCursor() {
      cursorX +=
        (mouseX - cursorX) * 0.15;

      cursorY +=
        (mouseY - cursorY) * 0.15;

      cursor.style.left =
        cursorX + "px";

      cursor.style.top =
        cursorY + "px";

      window.requestAnimationFrame(
        animateCursor
      );
    }

    animateCursor();

    $$(
      "img, .scroll-link, .contact-row a"
    ).forEach((element) => {
      element.addEventListener(
        "mouseenter",
        () => {
          if (cursorText) {
            cursorText.textContent =
              element.matches("img")
                ? "VIEW"
                : "OPEN";
          }

          cursor.classList.add("visible");
        }
      );

      element.addEventListener(
        "mouseleave",
        () => {
          cursor.classList.remove(
            "visible"
          );
        }
      );
    });
  }

  // ==========================================
  // HERO IMAGE PARALLAX
  // ==========================================

  const hero = $(".hero-image");

  if (
    hero &&
    !reduceMotion &&
    window.matchMedia("(pointer:fine)").matches
  ) {
    const heroImage = hero.querySelector("img");

    if (heroImage) {
      hero.addEventListener(
        "mousemove",
        (event) => {
          const rect =
            hero.getBoundingClientRect();

          const x =
            (event.clientX - rect.left) /
              rect.width -
            0.5;

          const y =
            (event.clientY - rect.top) /
              rect.height -
            0.5;

          heroImage.style.transform =
            "scale(1.035) " +
            "translate(" +
            x * 8 +
            "px, " +
            y * 8 +
            "px)";
        }
      );

      hero.addEventListener(
        "mouseleave",
        () => {
          heroImage.style.transform = "";
        }
      );
    }
  }

  // ==========================================
  // PROJECT IMAGE 3D HOVER
  // ==========================================

  if (
    !reduceMotion &&
    window.matchMedia("(pointer:fine)").matches
  ) {
    $$(".project-pages img").forEach(
      (image) => {
        image.addEventListener(
          "mousemove",
          (event) => {
            const rect =
              image.getBoundingClientRect();

            const x =
              (event.clientX - rect.left) /
                rect.width -
              0.5;

            const y =
              (event.clientY - rect.top) /
                rect.height -
              0.5;

            image.style.transform =
              "perspective(900px) " +
              "rotateX(" +
              y * -2 +
              "deg) " +
              "rotateY(" +
              x * 2 +
              "deg) " +
              "scale(1.018)";
          }
        );

        image.addEventListener(
          "mouseleave",
          () => {
            image.style.transform = "";
          }
        );
      }
    );
  }

  // ==========================================
  // MAGNETIC LINKS
  // ==========================================

  $$(".scroll-link, .contact-row a, .brand").forEach(
    (element) => {
      if (
        !window.matchMedia("(pointer:fine)").matches ||
        reduceMotion
      ) {
        return;
      }

      element.addEventListener(
        "mousemove",
        (event) => {
          const rect =
            element.getBoundingClientRect();

          const x =
            (event.clientX -
              rect.left -
              rect.width / 2) *
            0.1;

          const y =
            (event.clientY -
              rect.top -
              rect.height / 2) *
            0.1;

          element.style.transform =
            "translate(" +
            x +
            "px, " +
            y +
            "px)";
        }
      );

      element.addEventListener(
        "mouseleave",
        () => {
          element.style.transform = "";
        }
      );
    }
  );
})();
```
