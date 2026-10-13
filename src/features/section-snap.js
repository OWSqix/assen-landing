// Desktop full-page section snapping. One wheel notch / arrow key / swipe moves exactly one
// section with a short ease-out and a brief input lock, so it reacts instantly; sections taller
// than the viewport scroll natively until their edge is reached. Off for coarse pointers,
// widths under 1200px and reduced motion.

const cubicBezier = (x1, y1, x2, y2) => {
  const a = (p1, p2) => 1 - 3 * p2 + 3 * p1;
  const b = (p1, p2) => 3 * p2 - 6 * p1;
  const c = (p1) => 3 * p1;
  const sample = (t, p1, p2) => ((a(p1, p2) * t + b(p1, p2)) * t + c(p1)) * t;
  const slope = (t, p1, p2) => 3 * a(p1, p2) * t * t + 2 * b(p1, p2) * t + c(p1);
  return (x) => {
    let t = x;
    for (let i = 0; i < 5; i += 1) {
      const s = slope(t, x1, x2);
      if (s === 0) break;
      t -= (sample(t, x1, x2) - x) / s;
    }
    return sample(t, y1, y2);
  };
};

const SNAP_DURATION = 50; // ms
const INPUT_LOCK = 90; // ms

export const initSectionSnap = (app) => {
  if (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    window.matchMedia('(pointer: coarse), (max-width: 1199px)').matches
  )
    return;
  const main = app.querySelector('main');
  if (!main) return;
  const sections = [...main.querySelectorAll(':scope > section')].filter(Boolean);
  if (sections.length < 2) return;

  document.documentElement.classList.add('fp-active');

  let current = 0;
  let locked = false;
  let unlockTimer = 0;
  let frame = 0;

  const overlayOpen = () =>
    !!app.querySelector('[data-cast-modal]:not([hidden]), [data-nav-sheet]:not([hidden])');

  const ease = cubicBezier(0.25, 1, 0.35, 1);

  const goTo = (index) => {
    current = Math.max(0, Math.min(sections.length - 1, index));
    locked = true;
    const startY = window.scrollY;
    const distance = Math.round(sections[current].getBoundingClientRect().top + startY) - startY;
    window.cancelAnimationFrame(frame);
    if (Math.abs(distance) >= 2) {
      const start = performance.now();
      const step = (now) => {
        const t = Math.min(1, (now - start) / SNAP_DURATION);
        window.scrollTo(0, startY + distance * ease(t));
        if (t < 1) frame = window.requestAnimationFrame(step);
      };
      frame = window.requestAnimationFrame(step);
    }
    window.clearTimeout(unlockTimer);
    unlockTimer = window.setTimeout(() => {
      locked = false;
    }, INPUT_LOCK);
  };

  // True while the current (taller-than-viewport) section still has room to scroll natively.
  const canScrollWithin = (direction) => {
    const section = sections[current];
    if (section.scrollHeight <= window.innerHeight + 4) return false;
    const rect = section.getBoundingClientRect();
    return direction > 0 ? rect.bottom > window.innerHeight + 6 : rect.top < -6;
  };

  window.addEventListener(
    'wheel',
    (event) => {
      if (overlayOpen()) return;
      if (locked) {
        event.preventDefault();
        return;
      }
      if (Math.abs(event.deltaY) < 4) return;
      const direction = event.deltaY > 0 ? 1 : -1;
      if (!canScrollWithin(direction)) {
        event.preventDefault();
        goTo(current + direction);
      }
    },
    { passive: false },
  );

  window.addEventListener('keydown', (event) => {
    if (event.defaultPrevented || locked || overlayOpen()) return;
    const tag = (event.target && event.target.tagName) || '';
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(tag)) return;
    if (event.key === 'ArrowDown' || event.key === 'PageDown') {
      event.preventDefault();
      goTo(current + 1);
    } else if (event.key === 'ArrowUp' || event.key === 'PageUp') {
      event.preventDefault();
      goTo(current - 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      goTo(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      goTo(sections.length - 1);
    }
  });

  let touchStartY = null;
  window.addEventListener(
    'touchstart',
    (event) => {
      touchStartY = event.touches[0].clientY;
    },
    { passive: true },
  );
  window.addEventListener(
    'touchend',
    (event) => {
      if (touchStartY === null || locked || overlayOpen()) return;
      const delta = touchStartY - event.changedTouches[0].clientY;
      touchStartY = null;
      if (Math.abs(delta) < 44) return;
      const direction = delta > 0 ? 1 : -1;
      if (!canScrollWithin(direction)) goTo(current + direction);
    },
    { passive: true },
  );

  // Re-sync the current index after native scrolling (scrollbar drag, anchor links, etc.).
  let settleTimer = 0;
  window.addEventListener(
    'scroll',
    () => {
      if (locked) return;
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => {
        let nearest = 0;
        let best = Infinity;
        sections.forEach((section, index) => {
          const distance = Math.abs(section.getBoundingClientRect().top);
          if (distance < best) {
            best = distance;
            nearest = index;
          }
        });
        current = nearest;
      }, 140);
    },
    { passive: true },
  );
};
