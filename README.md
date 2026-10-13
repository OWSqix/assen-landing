# assen-landing

assenent.com 랜딩 페이지 소스입니다. 원본 git 저장소가 삭제된 뒤, 2026-10-13에 FTP의 빌드 결과물로부터 역복원했습니다.

## 명령어

```bash
npm install
npm run dev       # 개발 서버 (http://localhost:5173)
npm run build     # dist/ 생성 (빌드 → SSR 빌드 → 프리렌더)
npm run preview   # dist/ 로컬 확인
```

## 구조

```
index.html              <head>(메타·CSP·JSON-LD·폰트) + 빈 #app
src/
  main.js               진입점: 렌더(프리렌더 없을 때만) → 기능 초기화 → GSAP 지연 로드
  content.js            ★ 콘텐츠 데이터: 크리에이터, 뉴스, 쇼릴, 사업영역, 메뉴
  render.js             페이지 전체 HTML 템플릿 (DOM 미사용 → 빌드 시 Node에서도 실행)
  icons.js              SNS 아이콘 SVG
  styles.css            전체 스타일
  motion-entrance.js    GSAP 입장/스크롤 모션 (별도 청크)
  features/             cast(크리에이터 레일·모달), cursor, nav-sheet, section-rail, section-snap
  lib/                  html(이스케이프·URL 검증), ui(스크롤 잠금·포커스 트랩)
  assets/               로고 PNG (빌드 시 해시 파일명으로 출력)
public/                 그대로 배포 루트에 복사: favicon류, fonts, news 아이콘, og-card,
                        .htaccess, robots.txt, sitemap.xml, privacy.html, 구글 인증 html
scripts/prerender.mjs   빌드 마지막 단계: renderApp() 결과를 dist/index.html의 #app에 삽입
vite.config.js          CSS를 index.html에 <style>로 인라인하는 플러그인
```

빌드 파이프라인:
1. `vite build`로 클라이언트를 빌드합니다. CSS는 `<style>`로 인라인되고, JS와 로고는 `dist/assets/`에 해시 파일명으로 출력됩니다.
2. `vite build --ssr src/render.js`로 렌더 함수를 Node용으로 빌드합니다. 로고 URL은 1단계와 같은 해시를 씁니다.
3. `scripts/prerender.mjs`가 렌더 결과를 `#app`에 넣고 `data-prerendered="true"`를 붙입니다. `main.js`는 이 속성이 있으면 다시 렌더하지 않습니다.

## 콘텐츠 수정

대부분 `src/content.js`만 고치면 됩니다.

- **크리에이터**: `CREATORS`의 각 슬롯에 `name`, `role`, `image`, `intro`, `tags`, `href`, `sns`를 채웁니다. `image`는 `public/creators/01.jpg`에 두고 `'/creators/01.jpg'`로 지정합니다.
  공개할 때는 `render.js`의 creators 섹션에서 다음 세 가지도 바꿔야 합니다.
  - `is-locked` 클래스 제거
  - 레일의 `aria-hidden="true" inert` 제거
  - `cast-soon`("Coming Soon! 7월에 공개됩니다.") 블록 정리
- **뉴스**: `NEWS` 배열에 항목을 추가합니다. 언론사 아이콘은 `public/news/`에 넣습니다.
- **쇼릴**: `SHOWREEL.youtubeId`에 유튜브 영상 ID를 넣습니다. 섹션의 `soon-cover`도 함께 정리하세요.

### 폰트 서브셋 주의

`public/fonts/pretendard-variable.woff2`는 페이지에 쓰인 글자만 담은 서브셋(약 86KB, 한글 247자)입니다. 서브셋에 없는 한글이 들어오면 그 글자만 시스템 폰트로 표시됩니다. 크리에이터 이름처럼 새 한글을 추가했다면 Pretendard Variable 원본(OFL)으로 서브셋을 다시 만들어야 합니다(예: npm `subset-font`). 파일을 바꾸면 `index.html`의 `?v=` 값 두 곳도 함께 바꿔 캐시를 무효화하세요.

### CSP 해시

`index.html` CSP의 `script-src 'sha256-…'` 값은 JSON-LD(`<script type="application/ld+json">`) 블록 내용의 해시입니다. JSON-LD를 고치면 다시 계산해서 넣으세요.

```bash
node -e "const h=require('fs').readFileSync('index.html','utf8').match(/<script type=\"application\/ld\+json\">([\s\S]*?)<\/script>/)[1];console.log(require('crypto').createHash('sha256').update(h).digest('base64'))"
```

## 배포 (카페24 FTP)

`dist/` 안의 내용을 웹 루트에 업로드합니다(`.htaccess` 포함). `index.html`은 매번 바뀌고, `assets/`의 파일명은 내용 해시라 기존 파일과 겹치지 않습니다.

- 서버의 `assets/`에는 예전 배포에서 남은 `index-*.js`·`index-*.css`가 쌓여 있습니다. 새 `index.html`을 올린 뒤 그 파일이 참조하지 않는 파일은 지워도 됩니다.
- FTP 클라이언트가 텍스트 파일을 ASCII 모드로 전송하면 줄바꿈이 바뀔 수 있습니다. 바이너리 모드를 권장합니다.
- HTTPS 인증서(Let's Encrypt)는 수동 갱신 방식입니다. `.htaccess`의 HSTS는 갱신을 놓쳤을 때를 대비해 7일로 짧게 잡혀 있습니다.

## 복원 메모

- **Vite 8.0.16 고정**: 원본 빌드를 재현하는 버전입니다. 이 버전으로 빌드하면 `motion-entrance` 청크(GSAP 3.15.0 포함)가 원본과 바이트 단위로 같고, 해시(`ClQlUNHy`)도 같습니다. 8.1.5에서는 이 청크가 달라지고, 8.2 이상에서는 `index.html`의 인라인 `<style>`까지 압축됩니다. 어느 쪽이든 동작에는 차이가 없습니다.
- **CSS**: 압축본을 포매팅해 복원했습니다. lightningcss로 다시 압축하면 원본과 바이트 단위로 같지만, 원본의 주석은 남아 있지 않습니다.
- **JS**: 압축 번들을 해독해 모듈로 다시 작성했습니다. 원본은 `main.js` 한 파일에 데이터·템플릿·기능이 모두 들어 있던 구조로 보입니다. 헤드리스 Chrome에서 원본 사이트와 비교해 DOM, 스크린샷(데스크톱·모바일·모션 감소 모드), 섹션 스냅, 메뉴 동작이 같음을 확인했습니다.
- **프리렌더**: 원본은 브라우저에서 렌더한 DOM을 저장한 것으로 보입니다(`<br>`, `></path>` 형태). 복원본은 템플릿 문자열을 그대로 넣으므로 표기(`<br />`, `/>`)만 다르고, 파싱된 DOM은 같습니다.
- 원본에 있던 흔적도 그대로 두었습니다: 모션 대상 중 `.hero-actions`·`.contact-route`(현재 없는 요소), `#smooth-wrapper`, `window.__assenLockScroll` 훅.
