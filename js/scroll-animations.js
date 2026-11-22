/* The Inner Child Restaurant — GSAP ScrollTrigger animations and 3D choreography */
(function () {
  'use strict';
  const TIC = window.TIC;
  const { reduce, fine, isMobile, hasGsap } = TIC;
  const gsap = window.gsap, ScrollTrigger = window.ScrollTrigger;
  const lenis = TIC.lenis, menu = TIC.menu, storyWords = TIC.storyWords;

  /* ---------- Scroll animations (GSAP + ScrollTrigger) ---------- */
  function setupScroll(S) {
    const mm = gsap.matchMedia();

    // hero parallax
    gsap.to('.hero__title', { yPercent: -18, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero__bottom, .chip', { opacity: 0, y: -40, ease: 'none', scrollTrigger: { trigger: '#hero', start: '30% top', end: 'bottom top', scrub: true } });

    // marquees: loop + velocity reaction
    const loops = [...document.querySelectorAll('.marquee__track')].map(tr => {
      const dir = Number(tr.dataset.dir);
      const tw = gsap.fromTo(tr, { xPercent: dir > 0 ? 0 : -50 }, { xPercent: dir > 0 ? -50 : 0, duration: 26, repeat: -1, ease: 'none' });
      return { tr, tw, skew: gsap.quickTo(tr, 'skewX', { duration: .5, ease: 'power3' }) };
    });
    if (lenis) lenis.on('scroll', ({ velocity }) => {
      loops.forEach(l => { l.tw.timeScale(1 + Math.min(Math.abs(velocity) * .12, 5)); l.skew(gsap.utils.clamp(-10, 10, -velocity * .4)); });
    });
    gsap.utils.toArray('.marquee').forEach((m, i) => gsap.fromTo(m, { xPercent: i ? -6 : 6 }, { xPercent: i ? 6 : -6, ease: 'none',
      scrollTrigger: { trigger: m, start: 'top bottom', end: 'bottom top', scrub: true } }));

    // story: pinned word-by-word reveal
    if (!reduce) {
      gsap.timeline({ scrollTrigger: { trigger: '#story', start: 'top top', end: '+=150%', pin: true, scrub: 1 } })
        .fromTo(storyWords, { opacity: .12 }, { opacity: 1, stagger: .1, ease: 'none' })
        .from('.story__host', { opacity: 0, y: 20, duration: 1 }, '-=.6');
    }

    // kitchen cards fan in
    gsap.utils.toArray('.dish').forEach((d, i) => {
      gsap.fromTo(d, { y: 200, rotate: (i - 1) * 9, opacity: 0 }, { y: 0, rotate: 0, opacity: 1, ease: 'power2.out',
        scrollTrigger: { trigger: '.dishes', start: 'top 95%', end: 'top 40%', scrub: 1 } });
      gsap.fromTo(d.querySelector('img'), { yPercent: -6 }, { yPercent: 6, ease: 'none',
        scrollTrigger: { trigger: d, start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    // space: pinned horizontal gallery
    const track = document.querySelector('.space__track');
    const dist = () => Math.max(0, track.scrollWidth - innerWidth);
    const hs = gsap.to(track, { x: () => -dist(), ease: 'none',
      scrollTrigger: { trigger: '#space', start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 1, invalidateOnRefresh: true,
        onUpdate: self => gsap.set('.space__progress i', { scaleX: self.progress }) } });
    gsap.utils.toArray('.space__fig').forEach(fig => {
      gsap.fromTo(fig.querySelector('img'), { xPercent: -8 }, { xPercent: 8, ease: 'none',
        scrollTrigger: { trigger: fig, containerAnimation: hs, start: 'left right', end: 'right left', scrub: true } });
      gsap.from(fig.querySelector('.space__cap'), { y: 40, opacity: 0, duration: .9, ease: 'power3.out',
        scrollTrigger: { trigger: fig, containerAnimation: hs, start: 'left 70%' } });
    });
    gsap.from('.space__list li', { x: 60, opacity: 0, stagger: .08, duration: .8, ease: 'power3.out',
      scrollTrigger: { trigger: '.space__list', containerAnimation: hs, start: 'left 75%' } });

    // statement: pinned char reveal
    const stChars = [...document.querySelectorAll('.statement .c')];
    if (!reduce) {
      gsap.timeline({ scrollTrigger: { trigger: '#statement', start: 'top top', end: '+=110%', pin: true, scrub: 1 } })
        .fromTo(stChars, { opacity: .08, yPercent: 30 }, { opacity: 1, yPercent: 0, stagger: .04, ease: 'power2.out' });
    }

    // visit background parallax
    gsap.fromTo('.visit__bg', { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '#visit', start: 'top bottom', end: 'bottom top', scrub: true } });

    // footer wordmark
    gsap.from('.footer__word .c', { yPercent: 110, stagger: .03, ease: 'power3.out',
      scrollTrigger: { trigger: '.footer', start: 'top 85%', end: 'top 30%', scrub: 1 } });

    // nav: hide on scroll down, show on scroll up
    let lastDir = 0;
    ScrollTrigger.create({ start: 200, end: 'max', onUpdate: self => {
      if (self.direction !== lastDir && menu.hidden) { lastDir = self.direction; gsap.to('#nav', { yPercent: self.direction > 0 ? -160 : 0, duration: .5, ease: 'power3.out' }); }
    }, onLeaveBack: () => { lastDir = 0; gsap.to('#nav', { yPercent: 0, duration: .5 }); } });

    // 3D choreography
    if (S) {
      const { pose, poses } = S;
      const fn = name => Object.fromEntries(Object.keys(poses.hero()).map(k => [k, () => poses[name]()[k]]));
      const leg = (from, to, trigger, start, end) => gsap.fromTo(pose, fn(from), { ...fn(to), ease: 'power1.inOut', immediateRender: false,
        scrollTrigger: { trigger, start, end, scrub: true, invalidateOnRefresh: true } });
      leg('hero', 'story', '#story', 'top bottom', 'top top');
      leg('story', 'kitchen', '#kitchen', 'top bottom', 'top 25%');
      leg('kitchen', 'statement', '#statement', 'top bottom', 'top top');
      leg('statement', 'visit', '#visit', 'top bottom', 'top 30%');
      ScrollTrigger.addEventListener('refresh', () => { if (scrollY < innerHeight * .3) Object.assign(pose, poses.hero()); });
      // skip rendering while the 3D layer is fully covered
      ScrollTrigger.create({ trigger: '#space', start: 'top top', end: 'bottom bottom', onToggle: self => S.setVisible(!self.isActive) });
      ScrollTrigger.create({ trigger: '#visit', start: 'top top', end: 'max', onToggle: self => S.setVisible(!self.isActive) });
    }

    addEventListener('load', () => ScrollTrigger.refresh());
    ScrollTrigger.refresh();
  }
  TIC.setupScroll = setupScroll;
})();
