# public/textures — 자산 출처 (Asset Provenance)

랜딩 래스터 자산의 출처·분류를 기록한다. 거버넌스(Company-OS): 자산 0 전제,
AI-slop 회피, 표상 proof(매장·인물·제품)는 자체 촬영/실구현만, 비표상 추상 재질만
제한적으로 허용.

분류 기준 — "보는 사람이 특정 실재(매장/사람/제품/장소)를 식별·오인할 수 있는가?"

- YES = 표상(proof). **AI 생성 금지.** 자체 촬영/실구현 + 동의 게이트 필수.
- NO = 비표상(재질/색면). CSS/SVG 우선, 불가피할 때만 비표상 래스터.

| 파일 | 분류 | 출처 | 용도 | 비고 |
|---|---|---|---|---|
| `brass-foil-tile.jpg` | 비표상 (브러시드 브래스 매크로) | 출처 미기록 — 소급 확인 필요 | `.button.primary` background, soft-light 타일 | 존치. 인물/공간/제품 미표상이라 거버넌스 무관 |
| `og-card.jpg` | 비표상 (홈페이지 Hero 자체 캡처 — 워드마크·카피만, 인물/공간/제품 없음) | 자체 렌더 (현 사이트 Hero를 헤드리스 Chrome로 1200×630 캡처) | OG/twitter 소셜 미리보기 카드 | **2026-06-23 재도입.** 실제 Hero를 그대로 캡처 → 사이트와 항상 일치. 메타(`og:image`/`og:image:*`/`twitter:image`) 복구, `twitter:card`=`summary_large_image` |

## 제거 이력

- `og-card.jpg` (구버전 웜+세리프 디자인 Hero 렌더, OG/twitter 소셜 카드) — **2026-06-23 제거.**
  현 모노크롬 리디자인과 불일치해 공유 시 옛 디자인 썸네일이 노출됨. 관련 메타
  (`og:image` / `twitter:image` / `og:image:*`)도 삭제하고 `twitter:card`를 `summary`로 변경.
  → **같은 날 현 모노크롬 Hero 자체 캡처로 재도입**(위 표 참조).
- `hero-stage.jpg` (생성형 AI 기반, 표상형 '무대/공간') — **2026-06-16 제거.** 매장 미오픈
  상태에서 표상 이미지를 Hero full-bleed + OG 대표 카드로 공개 노출 → public proof
  gate 저촉. Hero 배경을 CSS dark+brass 추상 그라데이션(`src/styles.css`의 `.hero-image`)으로
  대체. 매장 오픈 + 자체 촬영 확보 시에만 실사진 full-bleed로 승격.

## 규칙

- 새 래스터 추가 시 위 표에 분류/출처/오너 승인을 기록(생성물이면 모델·시드·프롬프트
  전문 포함).
- 표상 proof 슬롯(Creators 포트레이트 / News 썸네일 / Showreel 영상)은 실재 + 동의
  확보 전까지 빈 상태(confident empty)를 유지한다. placeholder/스톡/AI 인물·썸네일·영상 금지.
- 비표상 래스터도 "CSS/SVG로 불가능"이 입증될 때만 추가하고, 표상성·AI-slop·AA·텍스트
  아티팩트 게이트를 통과시킨다.
