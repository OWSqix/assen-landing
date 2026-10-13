import './styles.css';
import { renderApp } from './render.js';
import { initCast } from './features/cast.js';
import { initCursor } from './features/cursor.js';
import { initNavSheet } from './features/nav-sheet.js';
import { initSectionRail } from './features/section-rail.js';
import { initSectionSnap } from './features/section-snap.js';

const app = document.querySelector('#app');

// Contact map: a click-to-load facade, so Google Maps (and its cookies) only load on request.
app.addEventListener('click', (event) => {
  const facade = event.target.closest('.map-facade');
  if (!facade || facade.dataset.loaded) return;
  facade.dataset.loaded = '1';
  const iframe = document.createElement('iframe');
  iframe.src = facade.dataset.mapSrc;
  iframe.title = facade.getAttribute('aria-label') || 'Assen Entertainment 위치';
  iframe.loading = 'lazy';
  iframe.referrerPolicy = 'no-referrer-when-downgrade';
  facade.replaceWith(iframe);
});

// Production HTML ships prerendered (scripts/prerender.mjs); render client-side otherwise (dev).
if (!app.dataset.prerendered) app.innerHTML = renderApp();

const header = document.querySelector('.site-header');

// Images inside a [data-image-shell] get is-loaded / is-error state classes.
const watchImage = (img) => {
  const shell = img.closest('[data-image-shell]');
  if (!shell) return;
  const loaded = () => {
    shell.classList.remove('is-loading', 'is-error');
    shell.classList.add('is-loaded');
  };
  const failed = () => {
    shell.classList.remove('is-loading', 'is-loaded');
    shell.classList.add('is-error');
  };
  if (img.complete) {
    if (img.naturalWidth > 0) loaded();
    else failed();
    return;
  }
  img.addEventListener('load', loaded, { once: true });
  img.addEventListener('error', failed, { once: true });
};

const updateHeader = () => {
  header.dataset.elevated = window.scrollY > 24 ? 'true' : 'false';
};

document.querySelectorAll('[data-image-load]').forEach(watchImage);
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

initCast(app);
initSectionRail(app);
initNavSheet(app);
initSectionSnap(app);
initCursor();

// Entrance motion (GSAP) — desktop fine-pointer only, loaded lazily after fonts settle.
// `pre-motion` hides the animated elements until GSAP takes over; the 1.6s failsafe (and any
// load error) reveals them so content never stays hidden.
if (
  window.matchMedia('(pointer: fine)').matches &&
  window.matchMedia('(min-width: 768px)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches
) {
  document.documentElement.classList.add('pre-motion');
  const reveal = () => document.documentElement.classList.remove('pre-motion');
  const failsafe = window.setTimeout(reveal, 1600);
  let started = false;
  const start = () => {
    if (started) return;
    started = true;
    import('./motion-entrance.js')
      .then(({ setupMotion }) => {
        window.clearTimeout(failsafe);
        setupMotion();
      })
      .catch(reveal);
  };
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(start);
    window.setTimeout(start, 600);
  } else {
    start();
  }
}
