/* The Inner Child Restaurant — menu links and mobile menu */
(function () {
  'use strict';
  const TIC = window.TIC;
  const { reduce, hasGsap } = TIC;
  const gsap = window.gsap;
  const lenis = TIC.lenis;

  /* ---------- Anchors + mobile menu ---------- */
  const menuBtn = document.querySelector('.nav__menu');
  const menu = document.getElementById('mobileMenu');

  function setMenu(open) {
    if (!menuBtn || !menu) return;
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.hidden = !open;
    if (open) {
      document.body.style.overflow = 'hidden';
      if (hasGsap) {
        gsap.fromTo(menu, { opacity: 0, y: -12, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: .3, ease: 'power3.out' });
        gsap.fromTo(menu.querySelectorAll('a'), { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: .3, stagger: .05, ease: 'power2.out', delay: .05 });
      }
    } else {
      document.body.style.overflow = '';
    }
  }

  if (menuBtn && menu) {
    menuBtn.addEventListener('click', e => {
      e.stopPropagation();
      setMenu(menu.hidden);
    });

    // Close when tapping outside
    document.addEventListener('click', e => {
      if (!menu.hidden && !menu.contains(e.target) && !menuBtn.contains(e.target)) {
        setMenu(false);
      }
    });

    // Close on escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !menu.hidden) {
        setMenu(false);
        menuBtn.focus();
      }
    });

    // Close if window is resized past mobile breakpoint
    window.addEventListener('resize', () => {
      if (window.innerWidth > 820 && !menu.hidden) {
        setMenu(false);
      }
    });
  }

  // Smooth scroll links
  document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const targetId = a.getAttribute('href');
    const t = document.querySelector(targetId);
    if (!t) return;
    e.preventDefault();
    setMenu(false);
    if (lenis) lenis.scrollTo(t, { duration: 1.4, easing: x => 1 - Math.pow(1 - x, 4) });
    else t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  }));

  TIC.menu = menu;
})();
