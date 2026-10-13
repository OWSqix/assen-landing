// Entrance + scroll motion. Split into its own chunk (dynamic import from main.js) so GSAP
// never blocks first paint and is skipped entirely on touch / small / reduced-motion devices.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(ScrollTrigger, CustomEase);
CustomEase.create('assenOut', '0.16, 1, 0.28, 1');

export const setupMotion = () => {
  if (!document.querySelector('#app')) {
    document.documentElement.classList.remove('pre-motion');
    return;
  }

  const heroLines = gsap.utils.toArray('.hero .line-mask > span');
  document.documentElement.classList.remove('pre-motion');

  gsap
    .timeline({ defaults: { ease: 'assenOut', duration: 0.85 } })
    .from('.hero .hero-eyebrow', { y: 14, autoAlpha: 0, duration: 0.6 }, 0)
    .from(heroLines, { yPercent: 118, duration: 1, stagger: 0.1 }, 0.05)
    .from('.hero .hero-sub', { y: 16, autoAlpha: 0, duration: 0.7 }, 0.55)
    .from('.hero .hero-actions', { y: 16, autoAlpha: 0, duration: 0.7 }, 0.68);

  // Elements that fade/rise in once as they enter the viewport.
  gsap.utils
    .toArray(
      [
        '.about-h',
        '[data-motion="about-card"]',
        '[data-motion="service-row"]',
        '#news .news-heading',
        '#showreel .video-heading',
        '#contact .contact-inner > h2',
        '#contact .section-kicker',
        '.contact-route',
      ].join(','),
    )
    .forEach((el) => {
      gsap.from(el, {
        y: 26,
        autoAlpha: 0,
        duration: 0.7,
        ease: 'assenOut',
        immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });

  // Hero wordmark recedes as the page scrolls past it.
  gsap.to('.hero .hero-title', {
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.4 },
    scale: 0.86,
    yPercent: -6,
    autoAlpha: 0.12,
    ease: 'none',
    transformOrigin: '50% 40%',
  });

  requestAnimationFrame(() => ScrollTrigger.refresh());
};
