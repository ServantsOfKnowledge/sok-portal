// Servants of Knowledge — nav, tabs (deep-linkable by #id), press paging.
(function () {
  "use strict";

  // Page order: ← → keys, the footer arrows, dots and swipe all walk this list.
  var PAGES = [["index", "Home"], ["infrastructure", "Infrastructure"], ["work", "Digitisation"], ["collections", "Collections"], ["research-desk", "Research Desk"], ["about", "About"], ["press", "Media"], ["events", "Events"], ["publications", "Publications"], ["partners", "Partners"], ["support", "Donate"]];
  // Addresses carry no .html: "about", and "./" for the home page of the current folder (English at the root, Kannada in /kn/).
  function norm(h) { return (h || "").replace(/#.*$/, "").replace(/^\.\//, "").replace(/\.html$/, "") || "index"; }
  var here = norm(location.pathname.split("/").pop());
  var inKn = /\/kn\/[^\/]*$/.test(location.pathname);
  var KN = ["ಮುಖಪುಟ", "ಮೂಲಸೌಕರ್ಯ", "ಡಿಜಿಟಲೀಕರಣ", "ಸಂಗ್ರಹಗಳು", "Research Desk", "ನಮ್ಮ ಬಗ್ಗೆ", "ಮಾಧ್ಯಮ", "ಕಾರ್ಯಕ್ರಮಗಳು", "ಪ್ರಕಟಣೆಗಳು", "ಪಾಲುದಾರರು", "ದೇಣಿಗೆ ನೀಡಿ"];
  function U(i) { return PAGES[i][0] === "index" ? "./" : PAGES[i][0]; }
  function T(i) { return inKn ? KN[i] : PAGES[i][1]; }
  var at = PAGES.findIndex(function (p) { return p[0] === here; });
  function go(n) {
    if (n < 0 || n >= PAGES.length) return;
    try { sessionStorage.setItem("dir", n < at ? "back" : "fwd"); } catch (e) {}
    location.href = U(n);
  }
  try { if (sessionStorage.getItem("dir") === "back") document.documentElement.setAttribute("data-dir", "back"); } catch (e) {}
  var prevA = document.querySelector(".pg.prev"), nextA = document.querySelector(".pg.next");
  if (prevA) { if (at > 0) { prevA.href = U(at - 1); prevA.title = T(at - 1); prevA.addEventListener("click", function () { try { sessionStorage.setItem("dir", "back"); } catch (e) {} }); } else prevA.classList.add("off"); }
  if (nextA) { if (at >= 0 && at < PAGES.length - 1) { nextA.href = U(at + 1); nextA.title = T(at + 1); nextA.addEventListener("click", function () { try { sessionStorage.setItem("dir", "fwd"); } catch (e) {} }); } else nextA.classList.add("off"); }
  document.querySelectorAll(".dots a").forEach(function (a) { if (norm(a.getAttribute("href")) === here) a.setAttribute("aria-current", "page"); });
  document.addEventListener("keydown", function (e) {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
    if (e.key === "ArrowRight") go(at + 1); else if (e.key === "ArrowLeft") go(at - 1);
  });
  var sx = 0, sy = 0;
  document.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  document.addEventListener("touchend", function (e) {
    var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 70 && Math.abs(dy) < 50) go(dx < 0 ? at + 1 : at - 1);
  }, { passive: true });

  // "?" button beside the footer arrows: tells people they can swipe or use the arrow keys.
  // Shown once on a first visit (remembered in localStorage), and again whenever "?" is pressed.
  var pagerNav = document.querySelector(".pager-nav");
  if (pagerNav) {
    var touch = window.matchMedia("(hover: none)").matches, tip = null, tipTimer;
    var hintBtn = document.createElement("button");
    hintBtn.type = "button"; hintBtn.className = "pg hint-btn"; hintBtn.textContent = "?";
    hintBtn.setAttribute("aria-label", inKn ? "ಸಾಗುವುದು ಹೇಗೆ" : "How to move around"); hintBtn.setAttribute("aria-expanded", "false");
    pagerNav.appendChild(hintBtn);
    var hideTip = function () { clearTimeout(tipTimer); if (tip) tip.classList.remove("on"); hintBtn.setAttribute("aria-expanded", "false"); };
    var showTip = function () {
      if (!tip) { tip = document.createElement("div"); tip.className = "hint-tip"; tip.setAttribute("role", "status"); document.body.appendChild(tip); }
      var lr = "<kbd>←</kbd><kbd>→</kbd>", ud = "<kbd>↑</kbd><kbd>↓</kbd>", rows = window.matchMedia("(min-width: 1001px)").matches;
      tip.innerHTML = touch
        ? (inKn ? "ಪುಟ ಬದಲಿಸಲು ಎಡ ಅಥವಾ ಬಲಕ್ಕೆ ಸ್ವೈಪ್ ಮಾಡಿ " : "Swipe left or right to change page ") + lr
        : (inKn ? "ಪುಟ ಬದಲಿಸಲು " + lr + (rows ? " · ಪುಟದೊಳಗೆ ಸಾಗಲು " + ud : "") : "Change page " + lr + (rows ? " · Move within a page " + ud : ""));
      requestAnimationFrame(function () { tip.classList.add("on"); });
      hintBtn.setAttribute("aria-expanded", "true");
      clearTimeout(tipTimer); tipTimer = setTimeout(hideTip, 7000);
    };
    hintBtn.addEventListener("click", function () { if (tip && tip.classList.contains("on")) hideTip(); else showTip(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") hideTip(); });
    var seen = false; try { seen = !!localStorage.getItem("sokHint"); } catch (e) {}
    if (!seen) { try { localStorage.setItem("sokHint", "1"); } catch (e) {} setTimeout(showTip, 1500); }
  }

  var toggle = document.querySelector(".nav-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      toggle.setAttribute("aria-expanded", document.body.classList.toggle("nav-open") ? "true" : "false");
    });
    document.querySelectorAll(".nav-links a").forEach(function (a) {
      a.addEventListener("click", function () { document.body.classList.remove("nav-open"); });
    });
  }

  // Home headline: the six messages take turns (three standalone, three that follow the opening phrase); hovering the text pauses it.
  var rot = document.querySelectorAll(".rot .r");
  if (rot.length > 1) {
    var ri = 0, paused = false, hero = document.querySelector(".home .copy");
    if (hero) { hero.addEventListener("mouseenter", function () { paused = true; }); hero.addEventListener("mouseleave", function () { paused = false; }); }
    // The box is as tall as the longest message; shorter ones grow (up to 1.5x) to fill it.
    var fit = function () {
      var box = document.querySelector(".rot"); box.style.height = "";
      rot.forEach(function (r) { r.style.fontSize = ""; });
      var H = Math.max.apply(null, Array.prototype.map.call(rot, function (r) { return r.offsetHeight; }));
      box.style.height = H + "px";
      rot.forEach(function (r) {
        var lo = parseFloat(getComputedStyle(r).fontSize), hi = lo * 1.5;
        for (var k = 0; k < 8; k++) { var m = (lo + hi) / 2; r.style.fontSize = m + "px"; if (r.offsetHeight <= H) lo = m; else hi = m; }
        r.style.fontSize = lo + "px";
      });
    }, ft;
    fit();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
    window.addEventListener("resize", function () { clearTimeout(ft); ft = setTimeout(fit, 120); });
    setInterval(function () {
      if (paused) return;
      rot[ri].classList.remove("on"); rot[ri].setAttribute("aria-hidden", "true");
      ri = (ri + 1) % rot.length;
      rot[ri].classList.add("on"); rot[ri].removeAttribute("aria-hidden");
    }, 5200);
  }

  // Videos: click to play inside the card (privacy-friendly embed); modifier-click still opens YouTube.
  document.querySelectorAll('.vcard[href*="youtube.com/watch"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
      var id = (a.href.match(/[?&]v=([\w-]{11})/) || [])[1], t = a.querySelector(".thumb");
      if (!id || !t) return;
      e.preventDefault();
      t.classList.add("playing");
      t.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0" title="Video" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>';
    });
  });

  var yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();

  document.querySelectorAll(".nav-links a").forEach(function (a) {
    if (norm(a.getAttribute("href")) === here && !/^\.\./.test(a.getAttribute("href"))) a.setAttribute("aria-current", "page");
  });

  // Tabs: <button class="tab" data-tab="id"> shows <section class="panel" id="id">.
  var tabs = Array.prototype.slice.call(document.querySelectorAll("[data-tab]"));
  function show(id, push) {
    var found = false;
    tabs.forEach(function (t) {
      var on = t.getAttribute("data-tab") === id;
      t.setAttribute("aria-selected", on ? "true" : "false");
      found = found || on;
    });
    if (!found) return false;
    document.querySelectorAll(".panel").forEach(function (p) { p.classList.toggle("active", p.id === id); });
    if (push) history.replaceState(null, "", "#" + id);
    if (typeof window.onPanel === "function") window.onPanel(id);
    return true;
  }
  if (tabs.length) {
    tabs.forEach(function (t) { t.addEventListener("click", function () { show(t.getAttribute("data-tab"), true); }); });
    var first = tabs[0].getAttribute("data-tab");
    if (!show(location.hash.slice(1), false)) show(first, false);
    window.addEventListener("hashchange", function () { show(location.hash.slice(1), false); });
  }

  // Master-detail lists (timeline): <button data-md="id"> shows <div class="md-item" id="id">.
  document.querySelectorAll(".md").forEach(function (md) {
    var btns = md.querySelectorAll("[data-md]");
    btns.forEach(function (b) {
      b.addEventListener("click", function () {
        btns.forEach(function (x) { x.setAttribute("aria-selected", x === b ? "true" : "false"); });
        md.querySelectorAll(".md-item").forEach(function (i) { i.classList.toggle("active", i.id === b.getAttribute("data-md")); });
      });
    });
  });

  // ↑ ↓ step through the items on the page (list items, then tabs); ← → still change page.
  // Desktop only: below 1001px panels scroll, and the arrows should keep scrolling them.
  document.addEventListener("keydown", function (e) {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
    if ((e.key !== "ArrowDown" && e.key !== "ArrowUp") || !window.matchMedia("(min-width: 1001px)").matches) return;
    var d = e.key === "ArrowDown" ? 1 : -1;
    var panel = document.querySelector(".panel.active") || document;
    var md = panel.querySelector(".md"), items = md ? Array.prototype.slice.call(md.querySelectorAll("[data-md]")) : [];
    var i = items.findIndex(function (b) { return b.getAttribute("aria-selected") === "true"; });
    if (items.length && i + d >= 0 && i + d < items.length) { items[i + d].click(); e.preventDefault(); return; }
    var steps = tabs.length ? tabs : Array.prototype.slice.call(document.querySelectorAll(".pf")); // Partners: filter chips
    var t = steps.findIndex(function (x) { return x.getAttribute("aria-selected") === "true"; });
    if (t >= 0 && t + d >= 0 && t + d < steps.length) { steps[t + d].click(); e.preventDefault(); }
  });

  // Partners: filter chips dim the other categories (everything stays on screen).
  var pg = document.querySelector(".pgrid");
  if (pg) {
    var pf = document.querySelectorAll(".pf");
    pf.forEach(function (b) {
      b.addEventListener("click", function () {
        var cat = b.getAttribute("data-cat");
        pf.forEach(function (x) { x.setAttribute("aria-selected", x === b ? "true" : "false"); });
        pg.querySelectorAll(".pt").forEach(function (t) { t.classList.toggle("dim", cat !== "all" && t.getAttribute("data-cat") !== cat); });
      });
    });
  }

  // Press: year filter + paging sized to the space available (no scrolling).
  var grid = document.querySelector(".press-grid");
  if (grid) {
    var cards = Array.prototype.slice.call(grid.children);
    var pills = document.querySelectorAll(".tab[data-filter]");
    var prev = document.getElementById("prev"), next = document.getElementById("next"), count = document.getElementById("count");
    var filter = "all", page = 0;
    function render() {
      var list = cards.filter(function (c) { return filter === "all" || c.getAttribute("data-year") === filter; });
      var cols = getComputedStyle(grid).gridTemplateColumns.split(" ").length;
      cards.forEach(function (c) { c.style.display = ""; });
      var h = cards[0].offsetHeight || 150, gap = parseFloat(getComputedStyle(grid).rowGap) || 14;
      var rows = Math.max(1, Math.floor((grid.clientHeight + gap) / (h + gap)));
      var size = window.matchMedia("(max-width: 760px)").matches ? list.length || 1 : cols * rows, pages = Math.max(1, Math.ceil(list.length / size));
      page = Math.min(page, pages - 1);
      cards.forEach(function (c) { c.style.display = "none"; });
      list.slice(page * size, page * size + size).forEach(function (c) { c.style.display = ""; });
      count.textContent = inKn ? "ಪುಟ " + (page + 1) + " / " + pages + " · " + list.length + " ಲೇಖನಗಳು" : "Page " + (page + 1) + " of " + pages + " · " + list.length + " articles";
      prev.disabled = page === 0; next.disabled = page >= pages - 1;
    }
    pills.forEach(function (p) {
      p.addEventListener("click", function () {
        pills.forEach(function (x) { x.setAttribute("aria-selected", x === p ? "true" : "false"); });
        filter = p.getAttribute("data-filter"); page = 0; render();
      });
    });
    prev.addEventListener("click", function () { page--; render(); });
    next.addEventListener("click", function () { page++; render(); });
    // ↓ ↑: next/previous page of articles, then the next/previous year (paging is off on phones).
    document.addEventListener("keydown", function (e) {
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || (e.key !== "ArrowDown" && e.key !== "ArrowUp") || !window.matchMedia("(min-width: 761px)").matches) return;
      var d = e.key === "ArrowDown" ? 1 : -1, btn = d > 0 ? next : prev;
      var cur = Array.prototype.findIndex.call(pills, function (x) { return x.getAttribute("aria-selected") === "true"; });
      if (!btn.disabled) btn.click(); else if (pills[cur + d]) { pills[cur + d].click(); if (d < 0) { while (!next.disabled) next.click(); } } else return;
      e.preventDefault();
    });
    window.addEventListener("resize", render);
    render();
  }
})();
