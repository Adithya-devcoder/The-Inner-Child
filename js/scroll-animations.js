/* The Inner Child Restaurant — GSAP ScrollTrigger animations and 3D choreography */
(function () {
  'use strict';
  const TIC = window.TIC;
  const { reduce, isMobile, hasGsap } = TIC;
  const gsap = window.gsap, ScrollTrigger = window.ScrollTrigger;
  const lenis = TIC.lenis, menu = TIC.menu, storyWords = TIC.storyWords;

  /* ---------- Scroll animations (GSAP + ScrollTrigger) ---------- */
  function setupScroll(S) {
    if (!hasGsap) return;

    // Prevent jumpy mobile scroll triggers caused by address bar hide/show
    ScrollTrigger.config({ ignoreMobileResize: true });

    // Hero parallax
    gsap.to('.hero__title', {
      yPercent: -18,
      ease: 'none',
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
    });
    gsap.to('.hero__bottom, .chip', {
      opacity: 0,
      y: -30,
      ease: 'none',
      scrollTrigger: { trigger: '#hero', start: '25% top', end: 'bottom top', scrub: true }
    });

    // Marquees: continuous loop + scroll velocity skew
    const loops = [...document.querySelectorAll('.marquee__track')].map(tr => {
      const dir = Number(tr.dataset.dir);
      const tw = gsap.fromTo(tr, { xPercent: dir > 0 ? 0 : -50 }, { xPercent: dir > 0 ? -50 : 0, duration: 26, repeat: -1, ease: 'none' });
      return { tr, tw, skew: gsap.quickTo(tr, 'skewX', { duration: .5, ease: 'power3' }) };
    });
    if (lenis) {
      lenis.on('scroll', ({ velocity }) => {
        loops.forEach(l => {
          l.tw.timeScale(1 + Math.min(Math.abs(velocity) * .12, 5));
          l.skew(gsap.utils.clamp(-8, 8, -velocity * .3));
        });
      });
    }
    gsap.utils.toArray('.marquee').forEach((m, i) => {
      gsap.fromTo(m, { xPercent: i ? -5 : 5 }, {
        xPercent: i ? 5 : -5,
        ease: 'none',
        scrollTrigger: { trigger: m, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });

    // Story: pinned word-by-word reveal
    if (!reduce) {
      const mob = isMobile();
      gsap.timeline({
        scrollTrigger: {
          trigger: '#story',
          start: 'top top',
          end: () => mob ? '+=100%' : '+=140%',
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true
        }
      })
      .fromTo(storyWords, { opacity: .12 }, { opacity: 1, stagger: .1, ease: 'none' })
      .from('.story__host', { opacity: 0, y: 20, duration: 1 }, '-=.6');
    }

    // Kitchen cards fan in
    gsap.utils.toArray('.dish').forEach((d, i) => {
      gsap.fromTo(d, { y: 140, rotate: isMobile() ? 0 : (i - 1) * 8, opacity: 0 }, {
        y: 0, rotate: 0, opacity: 1, ease: 'power2.out',
        scrollTrigger: { trigger: '.dishes', start: 'top 95%', end: 'top 45%', scrub: 1 }
      });
      const img = d.querySelector('img');
      if (img) {
        gsap.fromTo(img, { yPercent: -6 }, {
          yPercent: 6, ease: 'none',
          scrollTrigger: { trigger: d, start: 'top bottom', end: 'bottom top', scrub: true }
        });
      }
    });

    // Space: pinned horizontal gallery
    const track = document.querySelector('.space__track');
    if (track) {
      const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
      const hs = gsap.to(track, {
        x: () => -dist(),
        ease: 'none',
        scrollTrigger: {
          trigger: '#space',
          start: 'top top',
          end: () => '+=' + dist(),
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: self => gsap.set('.space__progress i', { scaleX: self.progress })
        }
      });

      gsap.utils.toArray('.space__fig').forEach(fig => {
        const img = fig.querySelector('img');
        if (img) {
          gsap.fromTo(img, { xPercent: -8 }, {
            xPercent: 8, ease: 'none',
            scrollTrigger: { trigger: fig, containerAnimation: hs, start: 'left right', end: 'right left', scrub: true }
          });
        }
        const cap = fig.querySelector('.space__cap');
        if (cap) {
          gsap.from(cap, {
            y: 30, opacity: 0, duration: .8, ease: 'power3.out',
            scrollTrigger: { trigger: fig, containerAnimation: hs, start: 'left 70%' }
          });
        }
      });

      gsap.from('.space__list li', {
        x: 40, opacity: 0, stagger: .08, duration: .7, ease: 'power3.out',
        scrollTrigger: { trigger: '.space__list', containerAnimation: hs, start: 'left 75%' }
      });
    }

    // Statement: pinned character reveal
    const stChars = [...document.querySelectorAll('.statement .c')];
    if (!reduce && stChars.length) {
      gsap.timeline({
        scrollTrigger: {
          trigger: '#statement',
          start: 'top top',
          end: () => isMobile() ? '+=90%' : '+=110%',
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true
        }
      })
      .fromTo(stChars, { opacity: .08, yPercent: 24 }, { opacity: 1, yPercent: 0, stagger: .03, ease: 'power2.out' });
    }

    // Visit background parallax
    gsap.fromTo('.visit__bg', {
      yPercent: -8
    }, {
      yPercent: 8, ease: 'none',
      scrollTrigger: { trigger: '#visit', start: 'top bottom', end: 'bottom top', scrub: true }
    });

    // Footer wordmark
    gsap.from('.footer__word .c', {
      yPercent: 110, stagger: .025, ease: 'power3.out',
      scrollTrigger: { trigger: '.footer', start: 'top 85%', end: 'top 30%', scrub: 1 }
    });

    // Nav: hide on scroll down, show on scroll up
    let lastDir = 0;
    ScrollTrigger.create({
      start: 180,
      end: 'max',
      onUpdate: self => {
        if (self.direction !== lastDir && (!menu || menu.hidden)) {
          lastDir = self.direction;
          gsap.to('#nav', { yPercent: self.direction > 0 ? -160 : 0, duration: .45, ease: 'power3.out' });
        }
      },
      onLeaveBack: () => {
        lastDir = 0;
        gsap.to('#nav', { yPercent: 0, duration: .4 });
      }
    });

    // 3D choreography
    if (S) {
      const { pose, poses } = S;
      const fn = name => Object.fromEntries(Object.keys(poses.hero()).map(k => [k, () => poses[name]()[k]]));
      const leg = (from, to, trigger, start, end) => gsap.fromTo(pose, fn(from), {
        ...fn(to), ease: 'power1.inOut', immediateRender: false,
        scrollTrigger: { trigger, start, end, scrub: true, invalidateOnRefresh: true }
      });
      leg('hero', 'story', '#story', 'top bottom', 'top top');
      leg('story', 'kitchen', '#kitchen', 'top bottom', 'top 25%');
      leg('kitchen', 'statement', '#statement', 'top bottom', 'top top');
      leg('statement', 'visit', '#visit', 'top bottom', 'top 30%');

      ScrollTrigger.addEventListener('refresh', () => {
        if (scrollY < window.innerHeight * .3) Object.assign(pose, poses.hero());
      });

      // Pause rendering when 3D layer is fully occluded
      ScrollTrigger.create({ trigger: '#space', start: 'top top', end: 'bottom bottom', onToggle: self => S.setVisible(!self.isActive) });
      ScrollTrigger.create({ trigger: '#visit', start: 'top top', end: 'max', onToggle: self => S.setVisible(!self.isActive) });
    }

    // Refresh triggers on load and orientation change
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 200);
    });
    window.addEventListener('orientationchange', () => {
      setTimeout(() => ScrollTrigger.refresh(), 300);
    });
    window.addEventListener('load', () => ScrollTrigger.refresh());

    ScrollTrigger.refresh();
  }
  TIC.setupScroll = setupScroll;
})();
