/* Ashraf Hany — Portfolio
   Bootstrap handles the navbar collapse, scrollspy and "show more" collapse.
   This file only adds the small extras. */
(function () {
  "use strict";

  // Footer year
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Close the mobile menu after picking a link
  var navLinks = document.getElementById("navLinks");
  if (navLinks && window.bootstrap) {
    var menu = bootstrap.Collapse.getOrCreateInstance(navLinks, { toggle: false });
    navLinks.querySelectorAll(".nav-link").forEach(function (link) {
      link.addEventListener("click", function () {
        if (navLinks.classList.contains("show")) menu.hide();
      });
    });
  }

  // Project screenshot follows the cursor (desktop only, see CSS)
  var canHover = window.matchMedia("(hover: hover) and (min-width: 992px)");
  document.querySelectorAll(".project-row").forEach(function (row) {
    row.addEventListener("mousemove", function (e) {
      if (!canHover.matches) return;
      var r = row.getBoundingClientRect();
      var x = Math.min(e.clientX - r.left, r.width - 360);
      row.style.setProperty("--x", x + "px");
      row.style.setProperty("--y", e.clientY - r.top + "px");
    });
  });
})();
