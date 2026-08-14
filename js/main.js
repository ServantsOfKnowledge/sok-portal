// Servants of Knowledge — shared site behavior
// Mobile nav toggle, scroll-reveal, active nav highlight, press filters.

(function () {
  "use strict";

  // Mobile nav toggle
  var toggle = document.querySelector(".nav-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.querySelectorAll(".nav-links a").forEach(function (link) {
      link.addEventListener("click", function () {
        document.body.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Active nav link
  var path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(function (link) {
    var href = link.getAttribute("href");
    if (href === path || (path === "" && href === "index.html")) {
      link.setAttribute("aria-current", "page");
    }
  });

  // Nav "materializes" once there's content scrolled behind it
  var nav = document.querySelector(".site-nav");
  if (nav) {
    var ticking = false;
    var syncNav = function () {
      nav.classList.toggle("is-scrolled", window.scrollY > 8);
      ticking = false;
    };
    syncNav();
    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          requestAnimationFrame(syncNav);
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  // Scroll reveal
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) { el.classList.add("in-view"); });
    } else {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("in-view");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
      );
      revealEls.forEach(function (el, i) {
        el.style.transitionDelay = Math.min(i % 6, 5) * 60 + "ms";
        observer.observe(el);
      });
    }
  }

  // Press page filters
  var filterBar = document.querySelector(".press-filters");
  if (filterBar) {
    var pills = filterBar.querySelectorAll(".filter-pill");
    var items = document.querySelectorAll("[data-year], [data-outlet]");
    pills.forEach(function (pill) {
      pill.addEventListener("click", function () {
        pills.forEach(function (p) { p.classList.remove("active"); });
        pill.classList.add("active");
        var filter = pill.getAttribute("data-filter");
        items.forEach(function (item) {
          if (filter === "all" || item.getAttribute("data-year") === filter) {
            item.style.display = "";
          } else {
            item.style.display = "none";
          }
        });
      });
    });
  }
})();
