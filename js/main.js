/* The Inner Child Restaurant — start-up: loading screen, intro animation, wires everything together */
(function () {
  'use strict';
  const TIC = window.TIC;
  const { reduce, fine, isMobile, hasGsap } = TIC;
  const gsap = window.gsap, ScrollTrigger = window.ScrollTrigger;
  const lenis = TIC.lenis;

  document.getElementById('year').textContent = new Date().getFullYear();
  if (!hasGsap) { document.querySelector('.loader')?.remove(); }

  /* ---------- Framer Motion (DOM engine) ---------- */
  const framerP = import('https://esm.sh/framer-motion@11.11.17/dom')
    .catch(() => import('https://cdn.jsdelivr.net/npm/motion@11.11.17/+esm'))
    .catch(() => null);

  /* ================= BOOT ================= */
  const timeout = TIC.timeout;
  const sceneP = TIC.initScene().catch(err => { console.warn('3D scene unavailable', err); return null; });

  async function boot() {
    if (!hasGsap) return;
    const loader = document.querySelector('.loader');
    const count = loader.querySelector('.loader__count');
    const prog = { v: 0 };
    gsap.from('.loader .lw', { yPercent: 110, opacity: 0, duration: 1, stagger: .12, ease: 'power4.out' });
    const counting = new Promise(r => gsap.to(prog, { v: 100, duration: reduce ? .3 : 1.9, ease: 'power2.inOut',
      onUpdate: () => count.textContent = Math.round(prog.v), onComplete: r }));

    const [S, F] = await Promise.all([
      Promise.race([sceneP, timeout(5000).then(() => null)]),
      Promise.race([framerP, timeout(4000).then(() => null)]),
      document.fonts ? document.fonts.ready.catch(() => {}) : null,
      counting
    ]);

    if (S) gsap.ticker.add(S.render);
    if (F) document.documentElement.classList.add('js');

    // hidden states for intro
    const heroChars = [...document.querySelectorAll('.hero__title .c')];
    gsap.set(heroChars, { yPercent: 115, rotate: 8 });
    gsap.set('.hero-in', { opacity: 0, y: 26 });
    gsap.set('#nav', { opacity: 0, y: -30 });

    const tl = gsap.timeline({ onComplete: () => { loader.remove(); } });
    tl.to('.loader .lw', { yPercent: -110, opacity: 0, duration: .6, stagger: .06, ease: 'power3.in' })
      .to(loader, { clipPath: 'inset(0 0 100% 0)', duration: 1.0, ease: 'power4.inOut' }, '-=.15')
      .to(heroChars, { yPercent: 0, rotate: 0, duration: 1.2, stagger: .028, ease: 'expo.out' }, '-=.45')
      .to('#nav', { opacity: 1, y: 0, duration: .9, ease: 'power3.out' }, '-=1')
      .to('.hero-in', { opacity: 1, y: 0, duration: .9, stagger: .1, ease: 'power3.out' }, '-=.9');
    if (S) tl.to(S.intro, { s: 1, duration: 1.8, ease: 'elastic.out(1, .65)' }, '-=1.4');
    tl.add(() => lenis && lenis.start(), '-=.6');

    TIC.setupScroll(S);
    TIC.setupFramer(F);
  }

  boot();
})();
