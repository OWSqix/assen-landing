// Page content. Edit this file to update creators, news, the showreel or services —
// templates in render.js pick the changes up and the build re-prerenders index.html.
import cafeLogo from './assets/cafe_logo.png';

export const CONTACT_EMAIL = 'ceo@assenent.com';

export const COMPANY_INSTAGRAM = 'https://www.instagram.com/assen_entertainment/';

// Section order drives the header nav, the section rail and the mobile nav sheet.
export const SECTIONS = [
  { id: 'hero', label: '홈' },
  { id: 'about', label: '회사소개' },
  { id: 'services', label: '사업영역' },
  { id: 'creators', label: '크리에이터' },
  { id: 'news', label: '뉴스' },
  { id: 'showreel', label: '영상' },
  { id: 'contact', label: '문의' },
];

// Sections with a light background; the section rail switches to its dark-on-light style there.
export const LIGHT_SECTIONS = ['about', 'creators', 'showreel'];

export const ABOUT_CARDS = [
  {
    icon: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 8H17V13C17 15.2 15.2 17 13 17H9C6.8 17 5 15.2 5 13Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M17 9.5H19C20.1 9.5 21 10.4 21 11.5 21 12.6 20.1 13.5 19 13.5H17" stroke="currentColor" stroke-width="1.5"/><path d="M8 3.5V5M11 3.5V5M14 3.5V5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M4.5 20H17.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    title: '하츠코이 카페',
    desc: '크리에이터와 팬이 직접 만나는 오프라인 소통 공간',
  },
  {
    icon: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3 20 7.5 12 12 4 7.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M4 12 12 16.5 20 12" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M4 16.5 12 21 20 16.5" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
    title: '크리에이터 온라인 플랫폼',
    desc: '서브컬처 크리에이터와 팬을 잇는 온라인 커뮤니티 우리만을 위한 공간',
  },
  {
    icon: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 20S4 14.6 4 9.3C4 6.7 6 4.9 8.3 4.9 9.9 4.9 11.3 5.9 12 7.2 12.7 5.9 14.1 4.9 15.7 4.9 18 4.9 20 6.7 20 9.3 20 14.6 12 20 12 20Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
    title: '크리에이터 매니지먼트',
    desc: '크리에이터의 브랜드 가치를 온전히 가꿀 수 있도록 지원',
  },
  {
    icon: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="6.5" cy="12" r="3" stroke="currentColor" stroke-width="1.5"/><circle cx="17.5" cy="12" r="3" stroke="currentColor" stroke-width="1.5"/><path d="M9.5 12H14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    title: '브랜드 파트너십',
    desc: '서브컬처 크리에이터와 브랜드를 연결하는 협업 솔루션',
  },
];

// Service rows. `comingSoon` (any non-empty string, even ' ') covers the visual with a
// Coming Soon box; `socials` swaps the CTA link for an SNS icon row (empty = greyed icon).
export const SERVICES = [
  {
    tag: 'Offline Maid Café',
    title: '하츠코이',
    mark: '하츠코이',
    body: '서브컬처의 대표적인 문화, 메이드카페를 기반으로 한 오프라인 공간입니다. 팬들이 크리에이터와 직접 만나고 특별한 시간을 보낼 수 있는 독특한 경험을 제공합니다.',
    cta: '더 알아보기',
    href: '#contact',
    logo: cafeLogo,
    socials: {
      instagram: 'https://www.instagram.com/hatsukoi_maidcafe/',
      youtube: '',
      tiktok: '',
      x: '',
    },
  },
  {
    tag: 'Online Platform',
    title: 'Assen Platform',
    mark: 'Platform',
    body: '하츠코이를 포함한 어쎈이 추구하는 모든 경험을 온라인으로 이어갑니다. 팬 소식, 독점 콘텐츠, 한정 굿즈 판매 등 다양한 커뮤니티 기능을 통해 언제 어디서나 크리에이터와 연결될 수 있습니다.',
    cta: '플랫폼 방문 →',
    href: '#contact',
    comingSoon: ' ',
  },
];

const emptySns = () => ({ instagram: '', youtube: '', x: '' });

// Creator slots. A slot with no name/role/image renders as a "곧 만나요" stamp card.
// image: http(s) URL or root-relative path (e.g. '/creators/01.jpg' from public/).
// href / sns: absolute http(s) URLs only; anything else is dropped.
export const CREATORS = [
  { slot: '01', name: '', role: '', image: '', href: '', tags: [], intro: '', sns: emptySns() },
  { slot: '02', name: '', role: '', image: '', href: '', tags: [], intro: '', sns: emptySns() },
  { slot: '03', name: '', role: '', image: '', href: '', tags: [], intro: '', sns: emptySns() },
  { slot: '04', name: '', role: '', image: '', href: '', tags: [], intro: '', sns: emptySns() },
  { slot: '05', name: '', role: '', image: '', href: '', tags: [], intro: '', sns: emptySns() },
  { slot: '06', name: '', role: '', image: '', href: '', tags: [], intro: '', sns: emptySns() },
];

// Press coverage. icon: root-relative path to a favicon in public/news/.
export const NEWS = [
  {
    source: '한국목재신문',
    date: '2026.06.29',
    title: '어쎈엔터테인먼트, 서브컬처 생태계 구축 본격화',
    summary: '어쎈엔터테인먼트가 오프라인 메이드카페 하츠코이를 거점으로 서브컬처 생태계 구축에 본격 나섰습니다. 크리에이터 매니지먼트와 콘텐츠 제작을 결합해, 팬과 크리에이터가 더 깊이 연결되는 온·오프라인 경험을 만들어갑니다.',
    href: 'https://www.woodkorea.co.kr/news/articleView.html?idxno=90045',
    icon: '/news/icon-woodkorea.png',
  },
  {
    source: '경상일보',
    date: '2026.06.29',
    title: '어쎈엔터테인먼트, 팬 플랫폼 중심 서브컬처 생태계 구축 나서',
    summary: '어쎈엔터테인먼트가 팬 플랫폼을 중심으로 서브컬처 생태계 구축에 나섰습니다. 오프라인 하츠코이를 팬이 콘텐츠를 경험하고 크리에이터와 교류하는 공간으로 확장해, 온·오프라인을 잇는 팬덤 경험을 제공합니다.',
    href: 'https://www.ksilbo.co.kr/news/articleView.html?idxno=1060702',
    icon: '/news/icon-ksilbo.png',
  },
  {
    source: 'SWTV',
    date: '2026.06.29',
    title: "어쎈엔터테인먼트, '버추얼·코스프레·게임' 서브컬처 생태계 구축",
    summary: '어쎈엔터테인먼트가 버추얼 크리에이터·코스프레·게임을 아우르는 서브컬처 생태계 구축에 나섰습니다. 메이드카페 하츠코이를 비롯한 온·오프라인 팬덤 경험으로 팬과 크리에이터를 연결하는 핵심 허브로 도약합니다.',
    href: 'https://swtvnews.com/news/newsview.php?ncode=1065573312417038',
    icon: '/news/icon-swtv.png',
  },
  {
    source: '시선뉴스',
    date: '2026.06.29',
    title: '어쎈엔터테인먼트, "팬과 크리에이터가 소통하고 성장할 수 있는 생태계 구축에 나서"',
    summary: '어쎈엔터테인먼트가 팬을 단순 소비자가 아닌 문화 참여자로 바라보며 서브컬처 생태계 구축에 나섰습니다. 오프라인 메이드카페 하츠코이와 온라인 플랫폼을 연계하고 콘텐츠 기획·크리에이터 매니지먼트를 기반으로, 팬과 크리에이터가 함께 소통하고 성장하는 환경을 만들어갑니다.',
    href: 'https://www.sisunnews.co.kr/news/articleView.html?idxno=241472',
    icon: '/news/icon-sisunnews.png',
  },
];

// Showreel. Set youtubeId (the 11-char id from the watch URL) to replace the film-leader
// placeholder with a youtube-nocookie embed.
export const SHOWREEL = { youtubeId: '', title: '' };
