/**
 * school-cards.js
 * "Choose the School" mobile slider — click-and-hold (drag) to scroll the
 * cards horizontally. Touch devices use native momentum scrolling; this adds
 * mouse-drag support. No arrow buttons or dots.
 *
 * Premier Schools Exhibition
 */

(function () {
  'use strict';

  const slider = document.getElementById('school-slider');
  if (!slider) return;

  let isDown = false;
  let startX = 0;
  let startScrollLeft = 0;
  let moved = false;

  slider.addEventListener('pointerdown', function (e) {
    if (e.pointerType !== 'mouse') return;
    isDown = true;
    moved = false;
    startX = e.clientX;
    startScrollLeft = slider.scrollLeft;
    slider.classList.add('is-dragging');
    slider.setPointerCapture(e.pointerId);
  });

  slider.addEventListener('pointermove', function (e) {
    if (!isDown) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 3) moved = true;
    slider.scrollLeft = startScrollLeft - dx;
  });

  function endDrag(e) {
    if (!isDown) return;
    isDown = false;
    slider.classList.remove('is-dragging');
    try { slider.releasePointerCapture(e.pointerId); } catch (_) {}
  }

  slider.addEventListener('pointerup', endDrag);
  slider.addEventListener('pointercancel', endDrag);

  slider.addEventListener('click', function (e) {
    if (moved) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);

  /* ── Pagination dots ────────────────────────────────────────────────── */
  const dots  = Array.prototype.slice.call(
    document.querySelectorAll('#school-dots .choose-school__dot')
  );
  const track = document.getElementById('school-slider-track');
  const cards = track
    ? Array.prototype.slice.call(track.querySelectorAll('.school-card'))
    : [];

  if (dots.length && cards.length) {
    function activeIndex() {
      const base = slider.getBoundingClientRect().left;
      const pad  = parseFloat(getComputedStyle(slider).paddingLeft) || 0;
      let best = 0;
      let bestDist = Infinity;
      cards.forEach(function (card, i) {
        const dist = Math.abs(card.getBoundingClientRect().left - base - pad);
        if (dist < bestDist) { bestDist = dist; best = i; }
      });
      return best;
    }

    function setActiveDot(index) {
      dots.forEach(function (dot, i) {
        const on = i === index;
        dot.classList.toggle('choose-school__dot--active', on);
        dot.setAttribute('aria-selected', String(on));
      });
    }

    let ticking = false;
    slider.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        setActiveDot(activeIndex());
        ticking = false;
      });
    }, { passive: true });

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        cards[i].scrollIntoView({
          behavior: 'smooth',
          inline: 'start',
          block: 'nearest'
        });
        setActiveDot(i);
      });
    });

    setActiveDot(activeIndex());
  }

}());
