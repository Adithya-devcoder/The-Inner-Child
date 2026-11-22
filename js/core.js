/* The Inner Child Restaurant — shared settings used by every script */
(function () {
  'use strict';
  const TIC = (window.TIC = window.TIC || {});
  TIC.reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  TIC.fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  TIC.isMobile = () => innerWidth < 760;
  TIC.hasGsap = !!(window.gsap && window.ScrollTrigger);
  if (TIC.hasGsap) window.gsap.registerPlugin(window.ScrollTrigger);
  TIC.timeout = ms => new Promise(r => setTimeout(r, ms));
})();
