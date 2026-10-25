/* Ashraf Hany — Portfolio
   Language + theme are already applied by the small script in <head> (no flash).
   This file wires the toggle buttons and the page extras. */
(function () {
  "use strict";

  var root = document.documentElement;

  function save(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* private mode: still works for this page */ }
  }

  // ---------- Language (EN / AR) ----------
  function setLang(lang) {
    root.lang = lang;
    root.dir = lang === "ar" ? "rtl" : "ltr";
    var ltr = document.getElementById("bs-css-ltr");
    var rtl = document.getElementById("bs-css-rtl");
    if (ltr && rtl) {
      ltr.media = lang === "ar" ? "not all" : "all";
      rtl.media = lang === "ar" ? "all" : "not all";
    }
    var title = root.getAttribute("data-title-" + lang);
    if (title) document.title = title;
    save("lang", lang);
    // Drop ?lang= from the URL so the saved choice wins next time
    if (location.search.indexOf("lang=") !== -1 && window.history && history.replaceState) {
      var url = new URL(location.href);
      url.searchParams.delete("lang");
      history.replaceState(null, "", url.pathname + url.search + url.hash);
    }
  }

  document.querySelectorAll("[data-toggle-lang]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setLang(root.lang === "ar" ? "en" : "ar");
    });
  });
  // Title must match the language picked in <head>
  var initialTitle = root.getAttribute("data-title-" + root.lang);
  if (initialTitle) document.title = initialTitle;

  // ---------- Theme (light / dark) ----------
  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    root.setAttribute("data-bs-theme", theme);
    save("theme", theme);
  }

  document.querySelectorAll("[data-toggle-theme]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
    });
  });

  // ---------- Footer year ----------
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // ---------- Close the mobile menu after picking a link ----------
  var navLinks = document.getElementById("navLinks");
  if (navLinks && window.bootstrap) {
    var menu = bootstrap.Collapse.getOrCreateInstance(navLinks, { toggle: false });
    navLinks.querySelectorAll(".nav-link").forEach(function (link) {
      link.addEventListener("click", function () {
        if (navLinks.classList.contains("show")) menu.hide();
      });
    });
  }

  // ---------- Back-to-top button (sits above the WhatsApp button) ----------
  var toTop = document.createElement("button");
  toTop.type = "button";
  toTop.className = "to-top";
  toTop.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M12 19V5M6 11l6-6 6 6"/></svg>' +
    '<span class="visually-hidden" data-lang="en">Back to top</span><span class="visually-hidden" data-lang="ar">للأعلى</span>';
  toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
  document.body.appendChild(toTop);
  function updateToTop() { toTop.classList.toggle("is-visible", window.scrollY > 600); }
  window.addEventListener("scroll", updateToTop, { passive: true });
  updateToTop();

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- Hero: stats count up from 0 ----------
  if (!reduceMotion) {
    document.querySelectorAll(".hero__stats b").forEach(function (b, i) {
      var node = b.firstChild;   // the number's text node (the "+" lives in a sibling <em>)
      var target = node && parseInt(node.nodeValue, 10);
      if (!target) return;
      // The real number stays in place until the count actually starts, so a stalled timer never shows 0
      setTimeout(function () {
        node.nodeValue = "0";
        var start = null, dur = 1300;
        function step(t) {
          if (start === null) start = t;
          var p = Math.min((t - start) / dur, 1);
          node.nodeValue = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        // Safety net: if frames never run (e.g. a background tab), still land on the real number
        setTimeout(function () { node.nodeValue = String(target); }, dur + 400);
      }, 600 + i * 100);
    });
  }

  // ---------- Hero: portrait follows the mouse a little (desktop only) ----------
  var hero = document.querySelector(".hero");
  var finePointer = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (hero && finePointer && !reduceMotion) {
    hero.addEventListener("mousemove", function (e) {
      var r = hero.getBoundingClientRect();
      hero.style.setProperty("--mx", (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
      hero.style.setProperty("--my", (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
    });
    hero.addEventListener("mouseleave", function () {
      hero.style.setProperty("--mx", 0);
      hero.style.setProperty("--my", 0);
    });
  }

  // ---------- Fade sections in as they scroll into view ----------
  var revealEls = document.querySelectorAll("[data-reveal]");
  if (revealEls.length && "IntersectionObserver" in window) {
    root.classList.add("js-reveal");
    // Stagger items that sit side by side (cards, services, experience rows)
    revealEls.forEach(function (el) {
      var siblings = Array.prototype.filter.call(el.parentNode.children, function (c) { return c.hasAttribute("data-reveal"); });
      var idx = siblings.indexOf(el);
      if (siblings.length > 1) el.style.setProperty("--d", (idx % 4) * 0.09 + "s");
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  }
})();
