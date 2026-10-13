// Fixed section rail: highlights the section crossing the viewport midline and draws a
// scroll-progress bar via the --rail-progress custom property.
import { LIGHT_SECTIONS } from '../content.js';

export const initSectionRail = (app) => {
  const links = Array.from(app.querySelectorAll('.section-rail-link'));
  if (links.length === 0) return;
  const sections = links.map((link) => document.getElementById(link.dataset.spy)).filter(Boolean);
  if (sections.length === 0) return;

  const rail = app.querySelector('.section-rail');
  const lightSections = new Set(LIGHT_SECTIONS);
  let activeId = '';

  const setActive = (id) => {
    if (id === activeId) return;
    activeId = id;
    if (rail) rail.classList.toggle('is-on-light', lightSections.has(id));
    links.forEach((link) => {
      const isActive = link.dataset.spy === id;
      link.classList.toggle('is-active', isActive);
      if (isActive) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: '-50% 0px -50% 0px', threshold: 0 },
  );
  sections.forEach((section) => observer.observe(section));

  if (rail) {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      rail.style.setProperty('--rail-progress', progress.toFixed(4));
    };
    const schedule = () => {
      frame ||= window.requestAnimationFrame(update);
    };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    update();
  }
};
