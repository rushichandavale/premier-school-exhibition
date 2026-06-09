/**
 * hero-slider.js
 * Dual-axis hero slider: horizontal (arrow buttons / dots) AND
 * vertical (side arrow buttons / scroll wheel). Auto-play, touch/swipe,
 * pause on hover, keyboard navigation, ARIA live region updates.
 * Respects prefers-reduced-motion.
 *
 * Premier Schools Exhibition
 */

(function () {
  'use strict';

  /* ── DOM References ────────────────────────────────────────────────── */
  const slider   = document.getElementById('hero-slider');
  const track    = document.getElementById('hero-track');
  const prevBtn  = document.getElementById('hero-prev');
  const nextBtn  = document.getElementById('hero-next');
  const upBtn    = document.getElementById('hero-up');
  const downBtn  = document.getElementById('hero-down');
  const dots     = document.querySelectorAll('.hero__dot');
  const slides   = document.querySelectorAll('.hero__slide');

  if (!slider || !track || !slides.length) return;

  /* ── State ─────────────────────────────────────────────────────────── */
  const total          = slides.length;
  let   current        = 0;
  let   autoPlayTimer  = null;
  let   touchStartX    = 0;
  let   touchStartY    = 0;
  let   isDragging     = false;

  /* Detect user preference for reduced motion */
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  const AUTO_PLAY_INTERVAL = 5000; // ms

  /* ── Core: Go to slide ─────────────────────────────────────────────── */
  function goTo(index) {
    // Clamp and wrap
    current = ((index % total) + total) % total;

    /* Translate track */
    track.style.transform = `translateX(-${current * 100}%)`;

    /* Update dots */
    dots.forEach(function (dot, i) {
      const isActive = i === current;
      dot.classList.toggle('hero__dot--active', isActive);
      dot.setAttribute('aria-selected', String(isActive));
    });

    /* Update ARIA on slides */
    slides.forEach(function (slide, i) {
      slide.setAttribute('aria-hidden', String(i !== current));
    });

    /* Announce to screen readers via aria-live */
    slider.setAttribute('aria-label',
      'Hero slide ' + (current + 1) + ' of ' + total
    );
  }

  /* ── Auto-play ─────────────────────────────────────────────────────── */
  function startAutoPlay() {
    if (prefersReducedMotion) return; // never auto-play for reduced-motion
    stopAutoPlay();
    autoPlayTimer = setInterval(function () {
      goTo(current + 1);
    }, AUTO_PLAY_INTERVAL);
  }

  function stopAutoPlay() {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
  }

  /* ── Button handlers ───────────────────────────────────────────────── */
  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      goTo(current - 1);
      startAutoPlay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      goTo(current + 1);
      startAutoPlay();
    });
  }

  /* Vertical axis buttons mirror horizontal behaviour */
  if (upBtn) {
    upBtn.addEventListener('click', function () {
      goTo(current - 1);
      startAutoPlay();
    });
  }

  if (downBtn) {
    downBtn.addEventListener('click', function () {
      goTo(current + 1);
      startAutoPlay();
    });
  }

  /* Dot navigation */
  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      const target = Number(dot.dataset.slide);
      if (!Number.isNaN(target)) {
        goTo(target);
        startAutoPlay();
      }
    });
  });

  /* ── Keyboard navigation ───────────────────────────────────────────── */
  slider.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      goTo(current - 1);
      startAutoPlay();
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      goTo(current + 1);
      startAutoPlay();
    } else if (e.key === 'Home') {
      e.preventDefault();
      goTo(0);
      startAutoPlay();
    } else if (e.key === 'End') {
      e.preventDefault();
      goTo(total - 1);
      startAutoPlay();
    }
  });

  /* Make slider focusable for keyboard */
  slider.setAttribute('tabindex', '0');

  /* ── Pause on hover / focus ────────────────────────────────────────── */
  slider.addEventListener('mouseenter', stopAutoPlay);
  slider.addEventListener('mouseleave', startAutoPlay);
  slider.addEventListener('focusin',    stopAutoPlay);
  slider.addEventListener('focusout',   startAutoPlay);

  /* ── Touch / Swipe support ─────────────────────────────────────────── */
  track.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    isDragging  = true;
    stopAutoPlay();
  }, { passive: true });

  track.addEventListener('touchend', function (e) {
    if (!isDragging) return;
    isDragging = false;

    const deltaX = e.changedTouches[0].clientX - touchStartX;
    const deltaY = e.changedTouches[0].clientY - touchStartY;

    const SWIPE_THRESHOLD = 50;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      /* Horizontal swipe */
      if (deltaX < -SWIPE_THRESHOLD) {
        goTo(current + 1);
      } else if (deltaX > SWIPE_THRESHOLD) {
        goTo(current - 1);
      }
    } else {
      /* Vertical swipe */
      if (deltaY < -SWIPE_THRESHOLD) {
        goTo(current + 1);
      } else if (deltaY > SWIPE_THRESHOLD) {
        goTo(current - 1);
      }
    }

    startAutoPlay();
  }, { passive: true });

  /* ── Mouse wheel (vertical scroll) on desktop ─────────────────────── */
  let wheelDebounce = null;
  slider.addEventListener('wheel', function (e) {
    if (Math.abs(e.deltaY) < 30) return; // ignore tiny nudges
    e.preventDefault();
    clearTimeout(wheelDebounce);
    wheelDebounce = setTimeout(function () {
      if (e.deltaY > 0) {
        goTo(current + 1);
      } else {
        goTo(current - 1);
      }
      startAutoPlay();
    }, 80);
  }, { passive: false });

  /* ── Initialise ─────────────────────────────────────────────────────── */
  goTo(0);
  startAutoPlay();

}());
