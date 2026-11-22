/* The Inner Child Restaurant — custom cursor */
(function () {
  'use strict';
  const TIC = window.TIC;
  const { reduce, fine, isMobile, hasGsap } = TIC;
  const gsap = window.gsap, ScrollTrigger = window.ScrollTrigger;

  /* ---------- Custom cursor ---------- */
  if (fine && hasGsap && !reduce) {
    const ring = document.querySelector('.cursor'), dot = document.querySelector('.cursor-dot');
    const rx = gsap.quickTo(ring, 'x', { duration: .5, ease: 'power3' }), ry = gsap.quickTo(ring, 'y', { duration: .5, ease: 'power3' });
    const dx = gsap.quickTo(dot, 'x', { duration: .08 }), dy = gsap.quickTo(dot, 'y', { duration: .08 });
    addEventListener('pointermove', e => { rx(e.clientX); ry(e.clientY); dx(e.clientX); dy(e.clientY); });
    document.querySelectorAll('[data-cursor]').forEach(el => {
      const type = el.dataset.cursor;
      el.addEventListener('pointerenter', () => ring.classList.add(type === 'hover' ? 'is-hover' : 'is-link'));
      el.addEventListener('pointerleave', () => ring.classList.remove('is-hover', 'is-link'));
    });
  } else {
    document.querySelectorAll('.cursor,.cursor-dot').forEach(el => el.remove());
  }
})();
