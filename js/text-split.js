/* The Inner Child Restaurant — splits headings into letters and the story into words */
(function () {
  'use strict';
  const TIC = window.TIC;
  const { reduce, fine, isMobile, hasGsap } = TIC;
  const gsap = window.gsap, ScrollTrigger = window.ScrollTrigger;

  /* ---------- Text splitting ---------- */
  function splitChars(el) {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map(w => `<span class="w">${[...w].map(c => `<span class="c">${c}</span>`).join('')}</span>`).join(' ');
    return [...el.querySelectorAll('.c')];
  }
  function splitWords(el) {
    const frag = document.createDocumentFragment();
    [...el.childNodes].forEach(n => {
      const isEl = n.nodeType === 1;
      n.textContent.split(/(\s+)/).forEach(part => {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.append(' '); return; }
        const s = document.createElement('span');
        s.className = 'sw' + (isEl && n.className ? ' ' + n.className : '');
        s.textContent = part;
        frag.append(s);
      });
    });
    el.innerHTML = ''; el.append(frag);
    return [...el.querySelectorAll('.sw')];
  }
  const charMap = new Map();
  document.querySelectorAll('[data-chars]').forEach(el => charMap.set(el, splitChars(el)));
  const storyWords = splitWords(document.querySelector('[data-words]'));
  TIC.splitChars = splitChars;
  TIC.splitWords = splitWords;
  TIC.storyWords = storyWords;
})();
