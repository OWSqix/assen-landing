// Small behaviour helpers shared by the overlay features (cast modal, nav sheet).

export const prefersReducedMotion = () =>
  window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** How long an overlay's CSS exit transition runs before it is set `hidden`. */
export const overlayCloseDelay = () => (prefersReducedMotion() ? 0 : 360);

/**
 * Lock page scroll while an overlay is open. Defers to `window.__assenLockScroll` when a
 * smooth-scroll layer installs one; otherwise toggles body overflow.
 */
export const lockScroll = (locked) => {
  if (typeof window.__assenLockScroll === 'function') {
    window.__assenLockScroll(locked);
  } else {
    document.body.style.overflow = locked ? 'hidden' : '';
  }
};

/** Keep Tab / Shift+Tab focus inside `container` (call from a keydown handler). */
export const trapTab = (event, container, selector) => {
  const focusables = container.querySelectorAll(selector);
  if (focusables.length === 0) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
};
