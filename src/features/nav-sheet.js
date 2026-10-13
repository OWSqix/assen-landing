// "Index" menu sheet (the header menu below desktop width): open/close, Escape, focus trap.
import { lockScroll, overlayCloseDelay, trapTab } from '../lib/ui.js';

export const initNavSheet = (app) => {
  const sheet = app.querySelector('[data-nav-sheet]');
  const openButton = app.querySelector('[data-nav-open]');
  if (!sheet || !openButton) return;

  const panel = sheet.querySelector('.nav-sheet-panel');
  let hideTimer = 0;

  const open = () => {
    window.clearTimeout(hideTimer);
    sheet.hidden = false;
    requestAnimationFrame(() => sheet.classList.add('is-open'));
    lockScroll(true);
    openButton.setAttribute('aria-expanded', 'true');
    if (panel) panel.focus();
  };

  const close = () => {
    if (sheet.hidden) return;
    sheet.classList.remove('is-open');
    lockScroll(false);
    openButton.setAttribute('aria-expanded', 'false');
    hideTimer = window.setTimeout(() => {
      sheet.hidden = true;
    }, overlayCloseDelay());
    openButton.focus();
  };

  openButton.addEventListener('click', open);
  sheet.querySelectorAll('[data-nav-close]').forEach((el) => el.addEventListener('click', close));

  document.addEventListener('keydown', (event) => {
    if (sheet.hidden) return;
    if (event.key === 'Escape') {
      close();
      return;
    }
    if (event.key === 'Tab' && panel) trapTab(event, panel, 'a[href], button:not([disabled])');
  });
};
