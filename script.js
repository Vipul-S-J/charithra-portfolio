```js
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // -----------------------------
  // Page Loader
  // -----------------------------
  const loader = $(".site-loader");

  const hide = () => {
    loader?.classList.add("is-hidden");
  };

  addEventListener("load", () => {
    setTimeout(hide, 450);
  });

  setTimeout(hide, 1700);

  // -----------------------------
  // Reveal Animations
  // -----------------------------
  const reveals = $$(".reveal, .image-reveal");

  if ("IntersectionObserver" in window && !reduce) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.04,
        rootMargin: "0px 0px -5%",
      }
    );

    reveals.forEach((el, i) => {
      el.style.transitionDelay = `${Math.min((i % 5) * 70, 280)}ms`;
      io.observe(el);
    });
  } else {
    reveals.forEach((el) => el.classList.add("in-view"));
  }

  // -----------------------------
  // Mobile Menu
  // -----------------------------
  const menu = $(".menu-toggle");
  const nav = $(".nav");

  menu?.addEventListener("click", () => {
    const open = menu.classList.toggle("open");

    nav?.classList.toggle("open", open);
    menu.setAttribute("aria-expanded", open);
  });

  $$(".nav a").forEach((a) => {
    a.addEventListener("click", () => {
      menu?.classList.remove("open");
      nav?.classList.remove("open");
    });
  });

  // -----------------------------
  // Scroll Progress
  // -----------------------------
  const bar = $(".progress-bar");

  function progress() {
    const max = document.documentElement.scrollHeight - innerHeight;

    if (bar) {
      bar.style.width =
        (max > 0 ? (scrollY / max) * 100 : 0) + "%";
    }

    $(".back-top")?.classList.toggle("show", scrollY > 650);
  }

  addEventListener("scroll", progress, {
    passive: true,
  });

  progress();

  // -----------------------------
  // Back To Top
  // -----------------------------
  $(".back-top")?.addEventListener("click", () => {
    scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // -----------------------------
  // Active Navigation
  // -----------------------------
  const links = $$(".nav a");
  const sections = $$("main section[id]");

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            links.forEach((a) => {
              a.classList.toggle(
                "active",
                a.getAttribute("href") === "#" + entry.target.id
              );
            });
          }
        });
      },
      {
        rootMargin: "-35% 0px -55%",
      }
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }

  // -----------------------------
  // Project Filters
  // -----------------------------
  $$(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      $$(".filter-btn").forEach((b) => {
        b.classList.remove("active");
      });

      btn.classList.add("active");

      const filter = btn.dataset.filter;

      $$(".project").forEach((project) => {
        project.classList.toggle(
          "is-filtered",
          filter !== "all" &&
            project.dataset.category !== filter
        );
      });

      refreshGallery();
    });
  });

  // -----------------------------
  // Lightbox Gallery
  // -----------------------------
  let gallery = [];
  let index = 0;

  const box = $(".lightbox");
  const boxImg = $(".lightbox img");
  const cap = $(".lightbox figcaption");

  function refreshGallery() {
    gallery = $$(".project-pages img, .hero-image img").filter(
      (img) => !img.closest(".project.is-filtered")
    );

    gallery.forEach((img, i) => {
      img.onclick = () => open(i);
    });
  }

  function open(i) {
    index = i;

    const img = gallery[index];

    if (!img || !box || !boxImg || !cap) {
      return;
    }

    boxImg.src = img.currentSrc || img.src;
    boxImg.alt = img.alt;
    cap.textContent = img.alt;

    box.classList.add("open");
    box.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";
  }

  function close() {
    if (!box) {
      return;
    }

    box.classList.remove("open");
    box.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";
  }

  function move(direction) {
    if (!gallery.length) {
      return;
    }

    index = (index + direction + gallery.length) % gallery.length;

    open(index);
  }

  refreshGallery();

  $(".lightbox-close")?.addEventListener("click", close);

  $(".lightbox-prev")?.addEventListener("click", () => {
    move(-1);
  });

  $(".lightbox-next")?.addEventListener("click", () => {
    move(1);
  });

  box?.addEventListener("click", (event) => {
    if (event.target === box) {
      close();
    }
  });

  addEventListener("keydown", (event) => {
    if (!box?.classList.contains("open")) {
      return;
    }

    if (event.key === "Escape") {
      close();
    }

    if (event.key === "ArrowRight") {
      move(1);
    }

    if (event.key === "ArrowLeft") {
      move(-1);
    }
  });

  // -----------------------------
  // Custom Cursor
  // -----------------------------
  const cursor = $(".cursor");

  if (
    cursor &&
    matchMedia("(pointer:fine)").matches &&
    !reduce
  ) {
    const text = cursor.querySelector("span");

    let mx = innerWidth / 2;
    let my = innerHeight / 2;

    let cx = mx;
    let cy = my;

    addEventListener("mousemove", (event) => {
      mx = event.clientX;
      my = event.clientY;
    });

    (function tick() {
      cx += (mx - cx) * 0.15;
      cy += (my - cy) * 0.15;

      cursor.style.left = cx + "px";
      cursor.style.top = cy + "px";

      requestAnimationFrame(tick);
    })();

    const bindCursor = () => {
      $$("img, .scroll-link, .contact-row a").forEach((el) => {
        el.addEventListener("mouseenter", () => {
          if (text) {
            text.textContent = el.matches("img")
              ? "VIEW"
              : "OPEN";
          }

          cursor.classList.add("visible");
        });

        el.addEventListener("mouseleave", () => {
          cursor.classList.remove("visible");
        });
      });
    };

    bindCursor();
  }

  // -----------------------------
  // Hero Image Parallax
  // -----------------------------
  const hero = $(".hero-image");

  if (
    hero &&
    !reduce &&
    matchMedia("(pointer:fine)").matches
  ) {
    const img = hero.querySelector("img");

    if (img) {
      hero.addEventListener("mousemove", (event) => {
        const rect = hero.getBoundingClientRect();

        const x =
          (event.clientX - rect.left) / rect.width - 0.5;

        const y =
          (event.clientY - rect.top) / rect.height - 0.5;

        img.style.transform =
          `scale(1.035) translate(${x * 8}px, ${y * 8}px)`;
      });

      hero.addEventListener("mouseleave", () => {
        img.style.transform = "";
      });
    }
  }

  // -----------------------------
  // Project Image 3D Hover
  // -----------------------------
  if (
    !reduce &&
    matchMedia("(pointer:fine)").matches
  ) {
    $$(".project-pages img").forEach((img) => {
      img.addEventListener("mousemove", (event) => {
        const rect = img.getBoundingClientRect();

        const x =
          (event.clientX - rect.left) / rect.width - 0.5;

        const y =
          (event.clientY - rect.top) / rect.height - 0.5;

        img.style.transform =
          `perspective(900px) ` +
          `rotateX(${y * -2}deg) ` +
          `rotateY(${x * 2}deg) ` +
          `scale(1.018)`;
      });

      img.addEventListener("mouseleave", () => {
        img.style.transform = "";
      });
    });
  }

  // -----------------------------
  // Magnetic Links
  // -----------------------------
  $$(".scroll-link, .contact-row a, .brand").forEach((el) => {
    if (
      !matchMedia("(pointer:fine)").matches ||
      reduce
    ) {
      return;
    }

    el.addEventListener("mousemove", (event) => {
      const rect = el.getBoundingClientRect();

      const x =
        (event.clientX - rect.left - rect.width / 2) * 0.1;

      const y =
        (event.clientY - rect.top - rect.height / 2) * 0.1;

      el.style.transform =
        `translate(${x}px, ${y}px)`;
    });

    el.addEventListener("mouseleave", () => {
      el.style.transform = "";
    });
  });
})();
```

