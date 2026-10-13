// Inline SVG icons (currentColor, so they inherit the surrounding text colour).

const INSTAGRAM = {
  key: 'instagram',
  label: 'Instagram',
  icon: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.6"/><circle cx="17.4" cy="6.6" r="1.15" fill="currentColor"/></svg>',
};

const YOUTUBE = {
  key: 'youtube',
  label: 'YouTube',
  icon: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="2.5" y="5.5" width="19" height="13" rx="4" stroke="currentColor" stroke-width="1.6"/><path d="M10 9.2 L15.6 12 L10 14.8 Z" fill="currentColor"/></svg>',
};

const X = {
  key: 'x',
  label: 'X',
  icon: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.9 2H22l-7.6 8.7L23 22h-6.9l-5.4-7-6.2 7H1.3l8.1-9.3L1 2h7.1l4.9 6.4L18.9 2Zm-1.2 18h1.9L7 4H5l12.7 16Z"/></svg>',
};

const TIKTOK = {
  key: 'tiktok',
  label: 'TikTok',
  icon: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M15.8 3c.36 1.93 1.66 3.3 3.7 3.5v2.5c-1.4 0-2.66-.42-3.7-1.18v6.34a5.4 5.4 0 1 1-5.4-5.4c.28 0 .55.02.82.06v2.6a2.7 2.7 0 1 0 2.08 2.62V3h2.5Z"/></svg>',
};

/** SNS links shown in the creator detail modal. */
export const CREATOR_SNS = [INSTAGRAM, YOUTUBE, X];

/** SNS links shown under a service row. */
export const SERVICE_SNS = [INSTAGRAM, YOUTUBE, TIKTOK, X];

export const INSTAGRAM_ICON = INSTAGRAM.icon;
