/* The Inner Child Restaurant — Framer Motion reveals, magnetic buttons and card tilt */
(function () {
  'use strict';
  const TIC = window.TIC;
  const { reduce, fine, isMobile, hasGsap } = TIC;
  const gsap = window.gsap, ScrollTrigger = window.ScrollTrigger;

  /* ---------- Framer Motion: reveals, magnetic buttons, 3D tilt ---------- */
  function setupFramer(F) {
    if (!F) return;
    const { animate, inView } = F;
    const ease = [.22, 1, .36, 1];

    document.querySelectorAll('.reveal').forEach(el => {
      inView(el, (a) => {
        const target = a instanceof Element ? a : a.target;
        const siblings = [...target.parentElement.children].filter(c => c.classList.contains('reveal'));
        const delay = Math.max(0, siblings.indexOf(target)) * .08;
        animate(target, { opacity: [0, 1], transform: ['translateY(36px)', 'translateY(0px)'] }, { duration: reduce ? .01 : .9, delay, ease });
      }, { amount: .25 });
    });

    if (!fine || reduce) return;

    document.querySelectorAll('.magnetic').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        animate(el, { x: (e.clientX - r.left - r.width / 2) * .32, y: (e.clientY - r.top - r.height / 2) * .38 },
          { type: 'spring', stiffness: 320, damping: 18, mass: .6 });
      });
      el.addEventListener('pointerleave', () => animate(el, { x: 0, y: 0 }, { type: 'spring', stiffness: 180, damping: 12 }));
    });

    document.querySelectorAll('.dish__inner').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
        el.style.setProperty('--gx', `${(px + .5) * 100}%`); el.style.setProperty('--gy', `${(py + .5) * 100}%`);
        animate(el, { rotateY: px * 14, rotateX: -py * 14, scale: 1.02 }, { type: 'spring', stiffness: 220, damping: 20 });
      });
      el.addEventListener('pointerleave', () => animate(el, { rotateY: 0, rotateX: 0, scale: 1 }, { type: 'spring', stiffness: 160, damping: 16 }));
    });
  }
  TIC.setupFramer = setupFramer;
})();
