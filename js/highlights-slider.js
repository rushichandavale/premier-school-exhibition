/**
 * highlights-slider.js
 * Exhibition Highlights photo slider.
 * Supports:
 *  - Arrow button navigation (scrolls track by one card)
 *  - Mouse drag (click-and-hold to pan)
 *  - Touch swipe (mobile)
 *  - Keyboard arrows
 *
 * Premier Schools Exhibition
 */

(function () {
  'use strict';

  /* ── DOM References ────────────────────────────────────────────────── */
  const sliderEl = document.getElementById('highlights-slider');
  const track    = document.getElementById('highlights-track');
  const prevBtn  = document.getElementById('highlights-prev');
  const nextBtn  = document.getElementById('highlights-next');

  if (!sliderEl || !track) return;

  /* ── Helpers ───────────────────────────────────────────────────────── */
  function getCardScrollStep() {
    const card = track.querySelector('.highlight-card');
    if (!card) return 360;
    const style = window.getComputedStyle(track);
    const gap   = parseFloat(style.gap) || 20;
    return card.offsetWidth + gap;
  }

  function updateButtons() {
    if (prevBtn) prevBtn.disabled = track.scrollLeft <= 0;
    if (nextBtn) nextBtn.disabled =
      track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
  }

  /* ── Arrow button navigation ───────────────────────────────────────── */
  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      track.scrollBy({ left: -getCardScrollStep(), behavior: 'smooth' });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      track.scrollBy({ left: getCardScrollStep(), behavior: 'smooth' });
    });
  }

  track.addEventListener('scroll', updateButtons, { passive: true });

  /* ── Mouse drag-to-scroll ──────────────────────────────────────────── */
  let isMouseDown  = false;
  let startX       = 0;
  let scrollStart  = 0;

  sliderEl.addEventListener('mousedown', function (e) {
    isMouseDown  = true;
    startX       = e.pageX - sliderEl.offsetLeft;
    scrollStart  = track.scrollLeft;
    sliderEl.classList.add('is-dragging');
  });

  document.addEventListener('mouseup', function () {
    isMouseDown = false;
    sliderEl.classList.remove('is-dragging');
  });

  document.addEventListener('mousemove', function (e) {
    if (!isMouseDown) return;
    e.preventDefault();
    const x    = e.pageX - sliderEl.offsetLeft;
    const walk = (x - startX) * 1.2;
    track.scrollLeft = scrollStart - walk;
  });

  sliderEl.addEventListener('click', function (e) {
    if (Math.abs(track.scrollLeft - scrollStart) > 5) {
      e.preventDefault();
    }
  });

  /* ── Touch swipe ───────────────────────────────────────────────────── */
  let touchStartX = 0;

  track.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', function (e) {
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (delta < -40) track.scrollBy({ left:  getCardScrollStep(), behavior: 'smooth' });
    if (delta >  40) track.scrollBy({ left: -getCardScrollStep(), behavior: 'smooth' });
  }, { passive: true });

  /* ── Keyboard ──────────────────────────────────────────────────────── */
  sliderEl.setAttribute('tabindex', '0');
  sliderEl.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft')  { e.preventDefault(); track.scrollBy({ left: -getCardScrollStep(), behavior: 'smooth' }); }
    if (e.key === 'ArrowRight') { e.preventDefault(); track.scrollBy({ left:  getCardScrollStep(), behavior: 'smooth' }); }
  });

  /* ── Init ──────────────────────────────────────────────────────────── */
  updateButtons();

  window.addEventListener('resize', updateButtons);

}());
