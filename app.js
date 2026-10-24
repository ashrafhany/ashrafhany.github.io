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

  // Follow the device setting until the visitor picks a theme themselves
  if (window.matchMedia) {
    var mq = window.matchMedia("(prefers-color-scheme: dark)");
    var onChange = function (e) {
      var picked = null;
      try { picked = localStorage.getItem("theme"); } catch (err) {}
      if (!picked) {
        root.setAttribute("data-theme", e.matches ? "dark" : "light");
        root.setAttribute("data-bs-theme", e.matches ? "dark" : "light");
      }
    };
    if (mq.addEventListener) mq.addEventListener("change", onChange);
  }

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

  // ---------- Project screenshot follows the cursor (desktop, when a row has one) ----------
  var canHover = window.matchMedia && window.matchMedia("(hover: hover) and (min-width: 992px)");
  document.querySelectorAll(".project-row").forEach(function (row) {
    if (!row.querySelector(".project-row__thumb")) return;
    row.addEventListener("mousemove", function (e) {
      if (!canHover || !canHover.matches) return;
      var r = row.getBoundingClientRect();
      var x = Math.min(e.clientX - r.left, r.width - 360);
      row.style.setProperty("--x", x + "px");
      row.style.setProperty("--y", e.clientY - r.top + "px");
    });
  });
})();
