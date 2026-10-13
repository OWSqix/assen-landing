// Custom cursor: a lagging ring plus a tight dot. The ring shows a "View" / "Drag" label over
// creator cards and the creator rail. Fine pointers only; skipped under reduced motion.

export const initCursor = () => {
  if (
    !window.matchMedia('(pointer: fine)').matches ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
    return;

  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  ring.setAttribute('aria-hidden', 'true');
  const label = document.createElement('span');
  label.className = 'cursor-label';
  ring.appendChild(label);
  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  dot.setAttribute('aria-hidden', 'true');
  document.body.append(ring, dot);

  let pointerX = window.innerWidth / 2;
  let pointerY = window.innerHeight / 2;
  let ringX = pointerX;
  let ringY = pointerY;
  let dotX = pointerX;
  let dotY = pointerY;

  const tick = () => {
    dotX += (pointerX - dotX) * 0.35;
    dotY += (pointerY - dotY) * 0.35;
    ringX += (pointerX - ringX) * 0.16;
    ringY += (pointerY - ringY) * 0.16;
    dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
    window.requestAnimationFrame(tick);
  };
  window.requestAnimationFrame(tick);

  window.addEventListener(
    'pointermove',
    (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      ring.dataset.active = 'true';
      dot.dataset.active = 'true';
    },
    { passive: true },
  );

  window.addEventListener(
    'pointerover',
    (event) => {
      const card = event.target.closest('.cast-card');
      const rail = event.target.closest('[data-cast-rail]');
      const interactive = event.target.closest('a, button, [role="button"]');
      if (card || rail) {
        label.textContent = card ? 'View' : 'Drag';
        ring.dataset.state = 'label';
        ring.dataset.hover = 'false';
      } else {
        ring.dataset.state = '';
        ring.dataset.hover = interactive ? 'true' : 'false';
      }
    },
    { passive: true },
  );

  window.addEventListener(
    'pointerdown',
    (event) => {
      // Snap the ring onto the press point so the "pressed" state reads instantly.
      ringX = event.clientX;
      ringY = event.clientY;
      ring.dataset.pressed = 'true';
      dot.dataset.pressed = 'true';
    },
    { passive: true },
  );

  window.addEventListener(
    'pointerup',
    () => {
      ring.dataset.pressed = 'false';
      dot.dataset.pressed = 'false';
    },
    { passive: true },
  );

  document.addEventListener('pointerleave', () => {
    ring.dataset.active = 'false';
    dot.dataset.active = 'false';
  });
};
