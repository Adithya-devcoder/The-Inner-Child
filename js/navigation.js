/* The Inner Child Restaurant — menu links and mobile menu */
(function () {
  'use strict';
  const TIC = window.TIC;
  const { reduce, fine, isMobile, hasGsap } = TIC;
  const gsap = window.gsap, ScrollTrigger = window.ScrollTrigger;
  const lenis = TIC.lenis;

  /* ---------- Anchors + mobile menu ---------- */
  const menuBtn = document.querySelector('.nav__menu');
  const menu = document.getElementById('mobileMenu');
  function setMenu(open) {
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.hidden = !open;
    if (open && hasGsap) gsap.fromTo(menu, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: .35, ease: 'power3.out' });
  }
  menuBtn.addEventListener('click', () => setMenu(menu.hidden));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); menuBtn.focus(); } });
  document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (!t) return;
    e.preventDefault();
    setMenu(false);
    if (lenis) lenis.scrollTo(t, { duration: 1.6, easing: x => 1 - Math.pow(1 - x, 4) });
    else t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  }));
  TIC.menu = menu;
})();
