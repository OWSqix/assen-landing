// String helpers shared by the HTML templates. Content values are trimmed and escaped before
// they reach markup, and URLs are only accepted from an allow-listed shape.

export const clean = (value) => String(value ?? '').trim();

export const escapeHtml = (value) =>
  clean(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

/** Absolute http(s) link — used for outbound hrefs (profiles, SNS, press articles). */
export const isHttpUrl = (value) => /^https?:\/\//i.test(clean(value));

/** http(s) or root-relative path — used for image sources. */
export const isImageSrc = (value) => /^(https?:\/\/|\/)/i.test(clean(value));

export const pad2 = (n) => String(n).padStart(2, '0');
