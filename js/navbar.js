/**
 * navbar.js
 * Mobile hamburger toggle + scroll-state class for the navbar.
 * On scroll past threshold: adds .navbar--scrolled to swap styles.
 *
 * Premier Schools Exhibition
 */

(function () {
  'use strict';

  const toggle  = document.getElementById('nav-toggle');
  const nav     = document.getElementById('navbar-nav');
  const navbar  = document.querySelector('.navbar');

  /* ── Hamburger toggle ────────────────────────────────────────────────── */
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isOpen));
      nav.classList.toggle('navbar__nav--open', !isOpen);
    });

    document.addEventListener('click', function (e) {
      if (!toggle.contains(e.target) && !nav.contains(e.target)) {
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('navbar__nav--open');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('navbar__nav--open');
        toggle.focus();
      }
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('navbar__nav--open');
      });
    });
  }

  /* ── Scroll state ────────────────────────────────────────────────────── */
  if (!navbar) return;

  var SCROLL_THRESHOLD = 60;

  function onScroll() {
    var scrolled = window.scrollY > SCROLL_THRESHOLD;
    navbar.classList.toggle('navbar--scrolled', scrolled);
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  onScroll();

  /* ── Click animation for CTA Button ──────────────────────────────────── */
  const registerBtn = document.getElementById('nav-register-btn');
  if (registerBtn) {
    registerBtn.addEventListener('click', function (e) {
      e.preventDefault();
      registerBtn.classList.toggle('is-clicked');
    });
  }

  const submitBtn = document.getElementById('enquiry-submit-btn');
  if (submitBtn) {
    submitBtn.addEventListener('click', function () {
      submitBtn.classList.toggle('is-clicked');
    });
  }

  /* ── Mobile sticky "Register Now" → reveal hidden enquiry form ────────── */
  const mobileRegisterBtn = document.getElementById('mobile-register-btn');
  const formPanel = document.getElementById('enquire');
  if (mobileRegisterBtn && formPanel) {
    mobileRegisterBtn.addEventListener('click', function (e) {
      e.preventDefault();
      formPanel.classList.add('is-revealed');
      formPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const firstInput = formPanel.querySelector('input, textarea');
      if (firstInput) {
        window.setTimeout(function () { firstInput.focus(); }, 450);
      }
    });
  }

  const prescheduleBtn = document.getElementById('preschedule-btn');
  if (prescheduleBtn) {
    prescheduleBtn.addEventListener('click', function (e) {
      e.preventDefault();
      prescheduleBtn.classList.toggle('is-clicked');
    });
  }

}());
