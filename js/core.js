/* The Inner Child Restaurant — shared settings used by every script */
(function () {
  'use strict';
  const TIC = (window.TIC = window.TIC || {});
  TIC.reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  TIC.fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  TIC.isMobile = () => window.innerWidth < 768;
  TIC.isTablet = () => window.innerWidth >= 768 && window.innerWidth < 1024;
  TIC.isShort = () => window.innerHeight < 550;
  TIC.hasGsap = !!(window.gsap && window.ScrollTrigger);
  if (TIC.hasGsap) window.gsap.registerPlugin(window.ScrollTrigger);
  TIC.timeout = ms => new Promise(r => setTimeout(r, ms));
})();
