/* The Inner Child Restaurant — liquid glass refraction animation */
(function () {
  'use strict';
  const TIC = window.TIC;
  const { reduce, fine, isMobile, hasGsap } = TIC;
  const gsap = window.gsap, ScrollTrigger = window.ScrollTrigger;

  /* ---------- Liquid glass: gentle living refraction ---------- */
  if (hasGsap && !reduce) {
    const noise = document.getElementById('liquidNoise');
    const map = document.getElementById('liquidMap');
    const lg = { f: 0.009, s: 70 };
    gsap.to(lg, { f: 0.012, duration: 6, yoyo: true, repeat: -1, ease: 'sine.inOut',
      onUpdate: () => noise.setAttribute('baseFrequency', `${lg.f.toFixed(4)} ${(lg.f * 1.45).toFixed(4)}`) });
    document.querySelectorAll('.glass').forEach(el => {
      el.addEventListener('pointerenter', () => gsap.to(lg, { s: 110, duration: .6, ease: 'power2.out', onUpdate: () => map.setAttribute('scale', lg.s.toFixed(1)) }));
      el.addEventListener('pointerleave', () => gsap.to(lg, { s: 70, duration: .9, ease: 'power2.out', onUpdate: () => map.setAttribute('scale', lg.s.toFixed(1)) }));
    });
  }
})();
