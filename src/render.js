// HTML templates for the whole page. Pure string functions (no DOM access) so the same
// module renders in the browser (dev / fallback) and in Node at build time, where
// scripts/prerender.mjs writes renderApp() into dist/index.html.
import logoWhite from './assets/assen-logo-white.png';
import logoWhiteLong from './assets/assen-logo-white-long.png';
import {
  ABOUT_CARDS,
  COMPANY_INSTAGRAM,
  CONTACT_EMAIL,
  CREATORS,
  NEWS,
  SECTIONS,
  SERVICES,
  SHOWREEL,
} from './content.js';
import { CREATOR_SNS, INSTAGRAM_ICON, SERVICE_SNS } from './icons.js';
import { clean, escapeHtml, isHttpUrl, isImageSrc, pad2 } from './lib/html.js';

/* ── Creators ─────────────────────────────────────────────────────────── */

// Placeholder "stamp" marks for empty creator slots; picked and tilted per slot index.
const STAMP_SHAPES = [
  `<circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" stroke-width="1.1" />
   <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" stroke-width="0.6" stroke-dasharray="1.5 3" />
   <path d="M50 31 L53.5 44.5 L67.5 44.5 L56 53 L60 67 L50 58.5 L40 67 L44 53 L32.5 44.5 L46.5 44.5 Z" fill="none" stroke="currentColor" stroke-width="0.9" />`,
  `<rect x="12" y="24" width="76" height="52" fill="none" stroke="currentColor" stroke-width="1.1" />
   <rect x="17" y="29" width="66" height="42" fill="none" stroke="currentColor" stroke-width="0.5" stroke-dasharray="2 3" />
   <line x1="24" y1="40" x2="76" y2="40" stroke="currentColor" stroke-width="1.4" />
   <line x1="24" y1="50" x2="76" y2="50" stroke="currentColor" stroke-width="1.4" />
   <line x1="24" y1="60" x2="76" y2="60" stroke="currentColor" stroke-width="1.4" />`,
  `<circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" stroke-width="0.6" stroke-dasharray="1 4.6" stroke-linecap="round" />
   <circle cx="50" cy="50" r="33" fill="none" stroke="currentColor" stroke-width="1.2" />
   <circle cx="50" cy="50" r="6" fill="none" stroke="currentColor" stroke-width="0.9" />`,
  `<circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" stroke-width="1.4" />
   <circle cx="50" cy="50" r="36" fill="none" stroke="currentColor" stroke-width="0.7" />
   <circle cx="50" cy="50" r="22" fill="none" stroke="currentColor" stroke-width="0.7" stroke-dasharray="1.5 3" />
   <line x1="50" y1="40" x2="50" y2="60" stroke="currentColor" stroke-width="0.8" />
   <line x1="40" y1="50" x2="60" y2="50" stroke="currentColor" stroke-width="0.8" />`,
];

const castStamp = (index = 0) => {
  const n = Math.abs(Math.trunc(index));
  const shape = STAMP_SHAPES[n % STAMP_SHAPES.length];
  const rotate = ((n * 37) % 16) - 11;
  const opacity = (n % 5 == 2 ? 1 : 0.82 + ((n * 13) % 16) / 100).toFixed(2);
  return `
  <svg viewBox="0 0 100 100" aria-hidden="true" class="cast-stamp-svg"
    style="transform:rotate(${rotate}deg);opacity:${opacity}">
    ${shape}
  </svg>`;
};

/** Trim a creator entry and drop any URL that isn't an allowed shape. */
export const normalizeCreator = (creator) => {
  const sns = creator.sns || {};
  return {
    name: clean(creator.name),
    role: clean(creator.role),
    image: isImageSrc(creator.image) ? clean(creator.image) : '',
    href: isHttpUrl(creator.href) ? clean(creator.href) : '',
    tags: Array.isArray(creator.tags) ? creator.tags.map(clean).filter(Boolean).slice(0, 6) : [],
    intro: clean(creator.intro),
    sns: {
      instagram: isHttpUrl(sns.instagram) ? clean(sns.instagram) : '',
      youtube: isHttpUrl(sns.youtube) ? clean(sns.youtube) : '',
      x: isHttpUrl(sns.x) ? clean(sns.x) : '',
    },
  };
};

const slotLabel = (creator, index) => escapeHtml(clean(creator.slot) || pad2(index + 1));

const hasCreators = CREATORS.some((creator) => {
  const c = normalizeCreator(creator);
  return !!(c.name || c.role || c.image || c.intro || c.tags.length);
});

const castCard = (creator, index) => {
  const { name, role, image } = normalizeCreator(creator);
  const slot = slotLabel(creator, index);
  const filled = !!(name || role || image);
  const label = filled ? `${escapeHtml(name) || `크리에이터`} 상세 보기` : `크리에이터 ${slot} · 준비 중이에요`;
  const visual = image
    ? `<span class="cast-card-visual has-image"><img class="is-graded" src="${escapeHtml(image)}" alt="" width="600" height="800" loading="lazy" decoding="async" /></span>`
    : `<span class="cast-card-visual">
        <span class="cast-card-stamp" aria-hidden="true">${castStamp(index)}<span class="cast-stamp-label">곧<br />만나요</span></span>
      </span>`;
  const meta = filled
    ? `${name ? `<span class="cast-card-name">${escapeHtml(name)}</span>` : ``}${role ? `<span class="cast-card-role">${escapeHtml(role)}</span>` : ``}`
    : `<span class="cast-card-name cast-card-soon">준비 중이에요</span>`;
  return `
    <button type="button" class="cast-card${filled ? `` : ` is-empty`}" data-motion="creator-slot" data-cast-index="${index}" aria-label="${label}" aria-haspopup="dialog">
      <span class="cast-card-index" aria-hidden="true">${slot}</span>
      ${visual}
      <span class="cast-card-meta">
        ${meta}
        <span class="cast-card-cue" aria-hidden="true">상세 보기 <i>→</i></span>
      </span>
    </button>
  `;
};

const castDetailSns = (sns) => `
        <div class="cast-detail-sns" aria-label="SNS 바로가기">
          ${CREATOR_SNS.map((s) => (sns[s.key] ? `<a class="cast-sns-link" href="${escapeHtml(sns[s.key])}" target="_blank" rel="noopener noreferrer" aria-label="${s.label}">${s.icon}</a>` : `<span class="cast-sns-link is-empty" role="img" aria-label="${s.label} 준비 중">${s.icon}</span>`)).join(``)}
        </div>`;

/** Body of the creator detail modal (rendered on open by features/cast.js). */
export const renderCastDetail = (creator, index) => {
  const { name, role, image, href, tags, intro, sns } = normalizeCreator(creator);
  const slot = slotLabel(creator, index);
  const filled = !!(name || role || image || intro || tags.length);
  const portrait = image
    ? `<div class="cast-detail-portrait has-image"><img class="is-graded" src="${escapeHtml(image)}" alt="${name ? escapeHtml(name) : `크리에이터`}" width="600" height="800" decoding="async" /></div>`
    : `<div class="cast-detail-portrait">
        <span class="cast-detail-index" aria-hidden="true">${slot}</span>
        <span class="cast-card-stamp" aria-hidden="true">${castStamp(index)}<span class="cast-stamp-label">곧<br />만나요</span></span>
      </div>`;
  const info = filled
    ? `
        ${name ? `<h3 class="cast-detail-name">${escapeHtml(name)}</h3>` : ``}
        ${role ? `<p class="cast-detail-role">${escapeHtml(role)}</p>` : ``}
        ${tags.length ? `<ul class="cast-detail-tags">${tags.map((tag) => `<li>${escapeHtml(tag)}</li>`).join(``)}</ul>` : ``}
        ${intro ? `<p class="cast-detail-intro">${escapeHtml(intro)}</p>` : ``}
        ${href ? `<a class="button secondary" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">공식 프로필</a>` : ``}
      `
    : `<p class="cast-detail-soon">준비 중이에요</p>`;
  return `
    <div class="cast-detail">
      <div class="cast-detail-aside">
        ${portrait}
        ${castDetailSns(sns)}
      </div>
      <div class="cast-detail-info">
        <span class="cast-detail-kicker">Cast · ${slot}</span>
        ${info}
      </div>
    </div>
  `;
};

/* ── Services ─────────────────────────────────────────────────────────── */

const serviceCtaRow = (service) => `
              <div class="service-cta-row">
                <span class="service-cta-label">${service.cta}</span>
                <div class="service-socials" aria-label="${escapeHtml(service.title)} SNS">${SERVICE_SNS.map((s) => (service.socials[s.key] ? `<a class="service-social" href="${escapeHtml(service.socials[s.key])}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(service.title)} ${s.label}">${s.icon}</a>` : `<span class="service-social is-empty" role="img" aria-label="${escapeHtml(service.title)} ${s.label} 준비 중">${s.icon}</span>`)).join(``)}</div>
              </div>`;

const serviceRow = (service, index) => `
            <div class="service-row${index % 2 == 1 ? ` service-row--reverse` : ``}" data-motion="service-row">
              <div class="service-visual${service.comingSoon ? ` is-soon` : ``}${service.logo ? ` is-logo` : ``}" aria-hidden="true">
                <span class="service-index">${pad2(index + 1)}</span>
                ${service.logo ? `<span class="service-logo"><img src="${service.logo}" alt="" width="320" height="173" loading="lazy" decoding="async" /></span>` : ``}
                ${service.comingSoon ? `<span class="service-soon"><span class="service-soon-box"><span class="service-soon-title">Coming Soon!</span><span class="service-soon-sub">${service.comingSoon}</span></span></span>` : ``}
              </div>
              <div class="service-info">
                <div class="service-tag">${service.tag}</div>
                <h3 class="service-title">${service.title}</h3>
                <p class="service-p">${service.body}</p>
                ${service.comingSoon ? `<span class="service-link is-soon">${service.comingSoon}</span>` : service.socials ? serviceCtaRow(service) : `<a class="service-link" href="${service.href}">${service.cta}</a>`}
              </div>
            </div>`;

/* ── News ─────────────────────────────────────────────────────────────── */

const normalizeNews = (item) => ({
  source: clean(item.source),
  date: clean(item.date),
  title: clean(item.title),
  summary: clean(item.summary),
  icon: isImageSrc(item.icon) ? clean(item.icon) : '',
  href: isHttpUrl(item.href) ? clean(item.href) : '',
});

const hasNews = NEWS.some((item) => {
  const n = normalizeNews(item);
  return !!(n.title || n.href);
});

const newsRow = (item) => {
  const { source, date, title, summary, icon, href } = normalizeNews(item);
  if (!(title || href))
    return `
      <div class="news-row is-empty" data-motion="news-item" aria-hidden="true">
        <div class="news-row-main">
          <span class="news-meta"><span class="news-meta-text">소식 준비 중</span></span>
          <h3 class="news-row-title">새 소식이 준비되는 대로 가장 먼저 전해드릴게요.</h3>
        </div>
      </div>
    `;
  const meta = [source, date].filter(Boolean).map(escapeHtml).join(` · `);
  const inner = `
    <div class="news-row-main">
      <span class="news-meta">${icon ? `<img class="news-source-icon" src="${escapeHtml(icon)}" alt="" width="20" height="20" loading="lazy" decoding="async" />` : ``}${meta ? `<span class="news-meta-text">${meta}</span>` : ``}</span>
      ${title ? `<h3 class="news-row-title">${escapeHtml(title)}</h3>` : ``}
      ${summary ? `<p class="news-row-summary">${escapeHtml(summary)}</p>` : ``}
    </div>
    <span class="news-row-arrow" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M5 12h13M12 6l6 6-6 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </span>
  `;
  return href
    ? `<a class="news-row" data-motion="news-item" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${inner}</a>`
    : `<article class="news-row" data-motion="news-item">${inner}</article>`;
};

/* ── Showreel ─────────────────────────────────────────────────────────── */

const youtubeId = /^[\w-]{6,20}$/.test(clean(SHOWREEL.youtubeId)) ? clean(SHOWREEL.youtubeId) : '';

const showreelMedia = () =>
  youtubeId
    ? `<iframe src="https://www.youtube-nocookie.com/embed/${escapeHtml(youtubeId)}" title="${escapeHtml(SHOWREEL.title) || `Assen 소개 영상`}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`
    : `<div class="showreel-leader" aria-hidden="true">
                <span class="leader-perf leader-perf-left"></span>
                <span class="leader-perf leader-perf-right"></span>
                <svg class="leader-svg" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="55" fill="none" stroke="currentColor" stroke-width="0.7" />
                  <circle cx="60" cy="60" r="41" fill="none" stroke="currentColor" stroke-width="0.7" />
                  <line x1="60" y1="3" x2="60" y2="117" stroke="currentColor" stroke-width="0.5" />
                  <line x1="3" y1="60" x2="117" y2="60" stroke="currentColor" stroke-width="0.5" />
                  <path d="M52 46 L76 60 L52 74 Z" fill="currentColor" />
                </svg>
                <span class="leader-count">REEL 00 · 준비 중</span>
              </div>`;

/* ── Navigation ───────────────────────────────────────────────────────── */

const railItems = () =>
  SECTIONS.map(
    ({ id, label }, index) => `
      <li>
        <a href="#${id}" class="section-rail-link" data-spy="${id}" aria-label="${label} 섹션으로 이동">
          <span class="section-rail-num">${pad2(index + 1)}</span>
          <span class="section-rail-label">${label}</span>
          <span class="section-rail-dot" aria-hidden="true"></span>
        </a>
      </li>`,
  ).join(``);

const navSheetItems = () =>
  SECTIONS.map(
    ({ id, label }, index) => `
            <li>
              <a href="#${id}" data-nav-close>
                <span class="nav-sheet-num" aria-hidden="true">${pad2(index + 1)}</span>
                <span class="nav-sheet-label">${label}</span>
              </a>
            </li>`,
  ).join(``);

/* ── Page ─────────────────────────────────────────────────────────────── */

export const renderApp = () => `
  <a class="skip-link" href="#hero">본문 바로가기</a>
  <header class="site-header" data-elevated="false">
    <a class="brand" href="#hero" aria-label="Assen Entertainment home">
      <img class="brand-logo" src="${logoWhiteLong}" alt="Assen Entertainment" width="800" height="183" />
    </a>
    <nav class="nav-links" aria-label="주요 메뉴">
      ${SECTIONS.map(({ id, label }) => `<a href="#${id}">${label}</a>`).join(``)}
    </nav>
    <div class="header-actions">
      <button type="button" class="nav-index" data-nav-open aria-haspopup="dialog" aria-expanded="false" aria-controls="nav-sheet" aria-label="메뉴 열기">
        <span class="nav-index-rule" aria-hidden="true"></span><span class="nav-index-label">Index</span>
        <svg class="nav-index-burger" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>
      </button>
      <a class="header-cta header-cta--icon" href="${COMPANY_INSTAGRAM}" target="_blank" rel="noopener noreferrer" aria-label="Assen Entertainment 인스타그램">${INSTAGRAM_ICON}</a>
    </div>
  </header>

  <nav class="section-rail" aria-label="섹션 바로가기">
    <span class="section-rail-progress" aria-hidden="true"></span>
    <ol class="section-rail-list">${railItems()}</ol>
  </nav>

  <div id="smooth-wrapper">
   <div id="smooth-content">
  <main>
    <section id="hero" class="hero">
      <div class="hero-content">
        <p class="hero-eyebrow" data-motion="hero-kicker">Subculture Entertainment Company</p>
        <h1 class="hero-title" data-motion="hero-title">
          <span class="line-mask"><span class="wordmark-name">ASSEN</span></span>
          <span class="line-mask"><span class="wordmark-suffix">ENTERTAINMENT</span></span>
        </h1>
        <p class="hero-sub" data-motion="hero-lead">
          우리의 문화를 깊이 탐구하고<br />
          온·오프라인에서 크리에이터와 팬이 소통하는 공간을 만듭니다.
        </p>
      </div>
    </section>

    <section id="about" class="section about-section">
      <div class="section-label" aria-hidden="true">About</div>
      <div class="about-wrap">
        <div class="about-intro">
          <h2 class="about-h" data-motion="about-heading"><strong>팬덤과 크리에이터</strong>를<br />잇는 엔터테인먼트 회사</h2>
          <p class="about-p" data-motion="about-copy">어쎈엔터테인먼트는 서브컬처를 탐구하고, 크리에이터와 팬이 <span class="nowrap"><br>온·오프라인</span>에서 소통하는 공간을 만들겠다는 목표로 설립된 회사입니다.</p>
          <p class="about-p">크리에이터가 자신만의 세계관과 팬덤을 온전히 가꿀 수 있도록, <br />그리고 팬이 그 세계에 더 깊이 들어올 수 있도록 돕는 것이 우리의 목표입니다.</p>
          <p class="about-p">서브컬처에 대한 깊은 이해와 열정을 가진 인력들이 모여 크리에이터에게는 온전한 브랜드 가치를, 팬에게는 더 풍부한 경험을 제공합니다.</p>
          <p class="about-p">단순한 콘텐츠 소비를 넘어, 크리에이터와 팬이 함께 <br />서브컬처 문화를 만들어가는 생태계를 추구합니다.</p>
        </div>
        <div class="about-cards-slot">
          <div class="about-cards">
            ${ABOUT_CARDS.map(
              (card) => `
            <div class="about-card" data-motion="about-card">
              <div class="about-card-icon" aria-hidden="true">${card.icon}</div>
              <div class="about-card-title">${card.title}</div>
              <div class="about-card-desc">${card.desc}</div>
            </div>`,
            ).join(``)}
          </div>
        </div>
      </div>
    </section>

    <section id="services" class="section services-section">
      <div class="service-rows">
        ${SERVICES.map(serviceRow).join(``)}
      </div>
    </section>

    <section id="creators" class="section creator-section is-locked" aria-labelledby="creator-title">
      <div class="creator-shell">
        <div class="creator-heading">
          <div>
            <p class="section-kicker">Creators</p>
            <h2 id="creator-title">함께하는 크리에이터를 소개드려요</h2>
          </div>
          <div class="cast-rail-nav" aria-hidden="true">
            <button type="button" class="cast-arrow" data-cast-prev aria-label="이전 크리에이터 보기">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5 L8 12 L15 19" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" /></svg>
            </button>
            <button type="button" class="cast-arrow" data-cast-next aria-label="다음 크리에이터 보기">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5 L16 12 L9 19" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" /></svg>
            </button>
          </div>
        </div>

        <div class="cast-rail-wrap">
          <div class="cast-rail" data-cast-rail${hasCreators ? ` aria-label="Assen 크리에이터"` : ``} aria-hidden="true" inert>
            ${CREATORS.map(castCard).join(``)}
          </div>
          <div class="cast-soon" role="status">
            <span class="cast-soon-title">Coming Soon!</span>
            <span class="cast-soon-sub">7월에 공개됩니다.</span>
          </div>
        </div>
      </div>
    </section>

    <section id="news" class="section news-section band--tight">
      <div class="news-shell">
        <div class="news-heading">
          <p class="section-kicker">News &amp; Press</p>
          <h2>어쎈엔터테인먼트의 새로운 소식</h2>
        </div>
        <div class="soon-wrap${hasNews ? `` : ` is-locked`}">
          <div class="news-list"${hasNews ? `` : ` inert`}>
            ${NEWS.map(newsRow).join(``)}
          </div>
          ${
            hasNews
              ? ``
              : `<div class="soon-cover" role="status">
            <span class="soon-title">Coming Soon!</span>
          </div>`
          }
        </div>
      </div>
    </section>

    <section id="showreel" class="section video-section band--tall">
      <div class="video-shell">
        <div class="video-heading">
          <p class="section-kicker">Showreel</p>
          <h2>어쎈엔터테인먼트 소개 영상</h2>
        </div>
        <div class="video-frame${youtubeId ? `` : ` is-empty`}" data-motion="showreel-frame" aria-label="Assen 소개 영상">
          ${showreelMedia()}
          <div class="soon-cover" role="status">
            <span class="soon-title">Coming Soon!</span>
          </div>
        </div>
      </div>
    </section>

    <section id="contact" class="contact-section">
      <div class="contact-inner">
        <p class="section-kicker">Contact</p>
        <h2>파트너십 문의하기</h2>
        <div class="contact-grid">
          <div class="contact-map">
            <button type="button" class="map-facade" data-map-embed
              data-map-src="https://maps.google.com/maps?q=%EB%8C%80%ED%95%9C%EB%AF%BC%EA%B5%AD%20%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C%20%EB%A7%88%ED%8F%AC%EA%B5%AC%20%EC%84%9C%EA%B5%90%EB%8F%99%20405-13&z=16&hl=ko&output=embed"
              aria-label="지도 보기 — 서울특별시 마포구 서교동 405-13, 서교빌딩 4층">
              <svg class="map-facade-pin" width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 22s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="10" r="2.6" stroke="currentColor" stroke-width="1.6"/></svg>
              <span class="map-facade-addr">서울특별시 마포구 서교동 405-13, 서교빌딩 4층</span>
              <span class="map-facade-cta">지도 보기</span>
            </button>
          </div>
          <div class="contact-aside">
            <img class="contact-logo" src="${logoWhite}" alt="Assen Entertainment" width="640" height="197" loading="lazy" decoding="async" />
            <div class="contact-aside-lines">
              <p>주식회사 어쎈엔터테인먼트 | 사업자등록번호 : 432-87-03563</p>
              <p>주소 : 04053 서울특별시 마포구 서교동 405-13, 서교빌딩 4층</p>
              <p><a href="mailto:${CONTACT_EMAIL}">대표 : 신진명 | E-mail : ${CONTACT_EMAIL}</a></p>
              <p>Copyright © ${new Date().getFullYear()} Assen Entertainment </p>
            </div>
            <a class="contact-inquiry-btn" href="mailto:${CONTACT_EMAIL}">문의하기</a>
          </div>
        </div>
      </div>
    </section>
  </main>
   </div>
  </div>

  <div class="cast-modal" data-cast-modal hidden>
    <div class="cast-modal-backdrop" data-cast-close></div>
    <div class="cast-modal-panel" role="dialog" aria-modal="true" aria-label="크리에이터 상세 정보" tabindex="-1">
      <button type="button" class="cast-modal-close" data-cast-close aria-label="닫기">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6 L18 18 M18 6 L6 18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" /></svg>
      </button>
      <div class="cast-modal-body" data-cast-body></div>
    </div>
  </div>

  <div class="nav-sheet" id="nav-sheet" data-nav-sheet hidden>
    <div class="nav-sheet-backdrop" data-nav-close></div>
    <div class="nav-sheet-panel" role="dialog" aria-modal="true" aria-label="메뉴" tabindex="-1">
      <div class="nav-sheet-head">
        <span class="nav-sheet-eyebrow">Assen Entertainment</span>
        <button type="button" class="nav-sheet-close" data-nav-close aria-label="닫기">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6 L18 18 M18 6 L6 18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" /></svg>
        </button>
      </div>
      <ol class="nav-sheet-list">
        ${navSheetItems()}
      </ol>
      <a class="button primary nav-sheet-cta" href="#contact" data-nav-close>문의하기</a>
    </div>
  </div>
`;
