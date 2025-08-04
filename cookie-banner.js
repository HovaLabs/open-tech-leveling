// Cookie Banner and Google Analytics Management
(function () {
  "use strict";

  // Check if user has already made a choice
  const cookieConsent = localStorage.getItem("cookieConsent");
  const cookieBanner = document.getElementById("cookie-banner");

  if (cookieConsent === "accepted") {
    // Load Google Analytics
    loadGoogleAnalytics();
    if (cookieBanner) cookieBanner.style.display = "none";
  } else if (cookieConsent === "declined") {
    // Hide banner if declined
    if (cookieBanner) cookieBanner.style.display = "none";
  } else {
    // Show banner if no choice has been made
    setTimeout(() => {
      if (cookieBanner) cookieBanner.classList.add("show");
    }, 1000); // Show after 1 second
  }

  // Cookie banner functionality
  const acceptBtn = document.getElementById("accept-cookies");
  const declineBtn = document.getElementById("decline-cookies");

  if (acceptBtn) {
    acceptBtn.addEventListener("click", function () {
      localStorage.setItem("cookieConsent", "accepted");
      hideCookieBanner();
      loadGoogleAnalytics();
    });
  }

  if (declineBtn) {
    declineBtn.addEventListener("click", function () {
      localStorage.setItem("cookieConsent", "declined");
      hideCookieBanner();
    });
  }

  function hideCookieBanner() {
    if (cookieBanner) {
      cookieBanner.classList.remove("show");
      setTimeout(() => {
        cookieBanner.style.display = "none";
      }, 300); // Wait for animation to complete
    }
  }

  function loadGoogleAnalytics() {
    // Only load if not already loaded
    if (window.gtag && window.gtag.loaded) return;

    // Initialize dataLayer and gtag function first
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    window.gtag = gtag;

    // Google Analytics 4 (GA4) tracking code
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=G-T1P751TQPW";
    document.head.appendChild(script);

    script.onload = function () {
      gtag("js", new Date());
      gtag("config", "G-T1P751TQPW");
      window.gtag.loaded = true;
    };
  }
})();
