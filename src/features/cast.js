// Creator ("cast") rail and detail modal: arrow + keyboard navigation, mouse drag with
// inertia, a FLIP morph from the card into the modal portrait, and swipe-down-to-close on touch.
import { CREATORS } from '../content.js';
import { normalizeCreator, renderCastDetail } from '../render.js';
import { lockScroll, overlayCloseDelay, prefersReducedMotion, trapTab } from '../lib/ui.js';

const MODAL_FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const initCast = (app) => {
  const rail = app.querySelector('[data-cast-rail]');
  const modal = app.querySelector('[data-cast-modal]');
  const body = app.querySelector('[data-cast-body]');
  if (!rail || !modal || !body) return;

  const panel = modal.querySelector('.cast-modal-panel');
  const closeButton = modal.querySelector('.cast-modal-close');
  let returnFocus = null;
  let closeTimer = 0;
  // True from closeModal() until the modal is hidden or reopened. Repeat close requests
  // (Escape, backdrop) during the exit animation are ignored instead of restarting it.
  let closing = false;
  // Bumped on every open and close. A close only tears down if no newer open/close happened
  // since, so reopening during the exit animation can't be hidden by the stale close.
  let closeToken = 0;
  // Set when a mouse drag moved the rail, so the click that ends the drag doesn't open a card.
  // Cleared by the next press on the rail; keyboard activation is never suppressed.
  let dragMoved = false;

  /* ── Modal ──────────────────────────────────────────────────────────── */

  // The card→portrait morph only runs where it will be smooth.
  const canMorph = () =>
    !prefersReducedMotion() &&
    typeof Element.prototype.animate === 'function' &&
    (navigator.hardwareConcurrency === undefined || navigator.hardwareConcurrency > 4) &&
    window.matchMedia('(pointer: fine)').matches;

  const measureMorph = (card) => {
    const visual = card && card.querySelector('.cast-card-visual');
    const portrait = body.querySelector('.cast-detail-portrait');
    if (!visual || !portrait || typeof portrait.animate !== 'function') return null;
    return {
      dest: portrait,
      card: visual.getBoundingClientRect(),
      portrait: portrait.getBoundingClientRect(),
    };
  };

  const isOnScreen = (rect) => rect.width > 0 && rect.bottom > 0 && rect.top < window.innerHeight;

  const cardTransform = (m) =>
    `translate(${m.card.left - m.portrait.left}px, ${m.card.top - m.portrait.top}px) scale(${m.card.width / m.portrait.width}, ${m.card.height / m.portrait.height})`;

  let originCard = null;

  const morphIn = (card) => {
    if (!canMorph()) return;
    const m = measureMorph(card);
    if (!m || !m.card.width || !m.portrait.width) return;
    m.dest.animate(
      [
        { transformOrigin: 'top left', transform: cardTransform(m) },
        { transformOrigin: 'top left', transform: 'none' },
      ],
      { duration: 460, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
    );
  };

  const morphOut = (card, done) => {
    const m = canMorph() ? measureMorph(card) : null;
    if (!m || !m.card.width || !m.portrait.width || !isOnScreen(m.card)) {
      done();
      return;
    }
    const animation = m.dest.animate(
      [
        { transformOrigin: 'top left', transform: 'none', opacity: 1 },
        { transformOrigin: 'top left', transform: cardTransform(m), opacity: 0.15 },
      ],
      { duration: 380, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
    );
    animation.onfinish = done;
    animation.oncancel = done;
  };

  const openModal = (index, card) => {
    const creator = CREATORS[index];
    if (!creator) return;
    returnFocus = document.activeElement;
    originCard = card || null;
    window.clearTimeout(closeTimer);
    closeToken += 1; // cancel a close that is still animating
    closing = false;
    body.innerHTML = renderCastDetail(creator, index);
    if (panel) {
      const { name } = normalizeCreator(creator);
      panel.setAttribute('aria-label', name ? `${name} 크리에이터 상세 정보` : '크리에이터 상세 정보');
      panel.classList.toggle('no-morph', !canMorph());
    }
    modal.hidden = false;
    requestAnimationFrame(() => {
      modal.classList.add('is-open');
      requestAnimationFrame(() => morphIn(originCard));
    });
    lockScroll(true);
    if (closeButton) closeButton.focus();
  };

  const closeModal = () => {
    if (modal.hidden || closing) return;
    closing = true;
    modal.classList.remove('is-open');
    lockScroll(false);
    window.clearTimeout(closeTimer);
    const token = ++closeToken;
    let finished = false;
    const finish = () => {
      // Once only (animation end and the fallback timer both call this), and never after the
      // modal was reopened in the meantime.
      if (finished || token !== closeToken) return;
      finished = true;
      closing = false;
      modal.hidden = true;
      body.innerHTML = '';
      originCard = null;
    };
    if (canMorph() && originCard) {
      // Fallback first, so the close still completes even if the animation never settles.
      closeTimer = window.setTimeout(finish, 600);
      morphOut(originCard, finish);
    } else {
      closeTimer = window.setTimeout(finish, overlayCloseDelay());
    }
    if (returnFocus && typeof returnFocus.focus === 'function') returnFocus.focus();
    returnFocus = null;
  };

  // Touch: drag the panel down to dismiss (only from the top of its scroll).
  if (panel) {
    let startY = 0;
    let offsetY = 0;
    let swiping = false;
    let frame = 0;

    const paint = () => {
      frame = 0;
      if (!swiping) return;
      panel.style.transform = `translateY(${offsetY}px)`;
      panel.style.opacity = String(Math.max(0.4, 1 - offsetY / 480));
    };

    const onPointerDown = (event) => {
      if (event.pointerType !== 'touch' || !modal.classList.contains('is-open') || panel.scrollTop > 0) return;
      startY = event.clientY;
      offsetY = 0;
      swiping = true;
    };

    const onPointerMove = (event) => {
      if (!swiping) return;
      offsetY = event.clientY - startY;
      if (offsetY <= 0) {
        if (frame) {
          cancelAnimationFrame(frame);
          frame = 0;
        }
        panel.classList.remove('is-dragging');
        panel.style.transform = '';
        panel.style.opacity = '';
        swiping = false;
        return;
      }
      panel.classList.add('is-dragging');
      if (!frame) frame = requestAnimationFrame(paint);
    };

    const onPointerUp = () => {
      if (!swiping) return;
      swiping = false;
      if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
      panel.classList.remove('is-dragging');
      panel.style.opacity = '';
      panel.style.transform = '';
      if (offsetY > 88) closeModal();
    };

    panel.addEventListener('pointerdown', onPointerDown, { passive: true });
    panel.addEventListener('pointermove', onPointerMove, { passive: true });
    panel.addEventListener('pointerup', onPointerUp, { passive: true });
    panel.addEventListener('pointercancel', onPointerUp, { passive: true });
  }

  rail.querySelectorAll('[data-cast-index]').forEach((card) => {
    card.addEventListener('click', (event) => {
      // detail === 0 means keyboard or synthetic activation (Enter/Space, element.click(),
      // assistive tech), which never ends a drag.
      if (dragMoved && event.detail !== 0) {
        event.preventDefault();
        return;
      }
      openModal(Number(card.dataset.castIndex), card);
    });
  });

  modal.querySelectorAll('[data-cast-close]').forEach((el) => {
    el.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', (event) => {
    if (modal.hidden) return;
    if (event.key === 'Escape') {
      closeModal();
      return;
    }
    if (event.key === 'Tab' && panel) trapTab(event, panel, MODAL_FOCUSABLE);
  });

  /* ── Rail navigation ────────────────────────────────────────────────── */

  const prevButton = app.querySelector('[data-cast-prev]');
  const nextButton = app.querySelector('[data-cast-next]');

  const scrollByCard = (direction) => {
    const card = rail.querySelector('.cast-card');
    const step = card ? card.getBoundingClientRect().width + 18 : rail.clientWidth * 0.8;
    rail.scrollBy({ left: direction * step, behavior: 'smooth' });
  };

  const setArrowState = (button, atEdge, scrollable) => {
    const disabled = atEdge || !scrollable;
    button.setAttribute('aria-disabled', String(disabled));
    button.classList.toggle('is-disabled', disabled);
  };

  const updateArrows = () => {
    if (!prevButton || !nextButton) return;
    const maxScroll = rail.scrollWidth - rail.clientWidth - 2;
    const scrollable = rail.scrollWidth > rail.clientWidth + 4;
    setArrowState(prevButton, rail.scrollLeft <= 2, scrollable);
    setArrowState(nextButton, rail.scrollLeft >= maxScroll, scrollable);
  };

  if (prevButton) {
    prevButton.addEventListener('click', () => {
      if (prevButton.getAttribute('aria-disabled') !== 'true') scrollByCard(-1);
    });
  }
  if (nextButton) {
    nextButton.addEventListener('click', () => {
      if (nextButton.getAttribute('aria-disabled') !== 'true') scrollByCard(1);
    });
  }

  const cards = Array.from(rail.querySelectorAll('.cast-card'));
  cards.forEach((card) => {
    card.addEventListener('focus', () => {
      card.scrollIntoView({ inline: 'nearest', block: 'nearest' });
    });
  });

  rail.addEventListener('keydown', (event) => {
    const current = cards.indexOf(document.activeElement);
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      if (current >= 0 && current < cards.length - 1) cards[current + 1].focus();
      else scrollByCard(1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      if (current > 0) cards[current - 1].focus();
      else scrollByCard(-1);
    }
  });

  /* ── Mouse drag with inertia ────────────────────────────────────────── */

  let pressed = false;
  let startX = 0;
  let startScroll = 0;
  let lastX = 0;
  let lastTime = 0;
  let velocity = 0; // px per ms
  let glideFrame = 0;
  let glideTime = 0;

  const setCursorDragging = (dragging) => {
    const ring = document.querySelector('.cursor-ring');
    if (ring) ring.dataset.dragging = dragging ? 'true' : 'false';
  };

  const stopGlide = () => {
    if (glideFrame) {
      cancelAnimationFrame(glideFrame);
      glideFrame = 0;
    }
    glideTime = 0;
  };

  rail.addEventListener('pointerdown', (event) => {
    // Any new press (mouse, touch or pen) clears a previous drag, so only the click that ends
    // a drag is suppressed — not a later tap.
    dragMoved = false;
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    stopGlide();
    pressed = true;
    startX = event.clientX;
    startScroll = rail.scrollLeft;
    lastX = event.clientX;
    lastTime = event.timeStamp;
    velocity = 0;
  });

  rail.addEventListener('pointermove', (event) => {
    if (!pressed) return;
    const dx = event.clientX - startX;
    if (Math.abs(dx) > 4) {
      if (!dragMoved) setCursorDragging(true);
      dragMoved = true;
      rail.classList.add('is-dragging');
    }
    const dt = event.timeStamp - lastTime;
    if (dt > 0) velocity = (event.clientX - lastX) / dt;
    lastX = event.clientX;
    lastTime = event.timeStamp;
    rail.scrollLeft = startScroll - dx;
  });

  const glide = (now) => {
    const dt = glideTime ? Math.min(32, now - glideTime) : 16;
    glideTime = now;
    rail.scrollLeft -= velocity * dt;
    velocity *= 0.94 ** (dt / 16);
    const maxScroll = rail.scrollWidth - rail.clientWidth;
    if (Math.abs(velocity) > 0.02 && rail.scrollLeft > 0 && rail.scrollLeft < maxScroll) {
      glideFrame = requestAnimationFrame(glide);
    } else {
      glideFrame = 0;
      glideTime = 0;
    }
  };

  const endDrag = () => {
    if (!pressed) return;
    pressed = false;
    requestAnimationFrame(() => rail.classList.remove('is-dragging'));
    setCursorDragging(false);
    if (dragMoved && Math.abs(velocity) > 0.05) {
      stopGlide();
      glideFrame = requestAnimationFrame(glide);
    }
  };

  rail.addEventListener('pointerup', endDrag);
  rail.addEventListener('pointercancel', endDrag);
  rail.addEventListener('pointerleave', endDrag);
  rail.addEventListener('scroll', updateArrows, { passive: true });
  window.addEventListener('resize', updateArrows);
  updateArrows();
};
