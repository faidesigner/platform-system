# 개발 로그 — GA 이벤트 / Contact-Zapier / SEO+i18n (2026-07-01)

브랜치: `feat/static-export-deploy` · 관련 스펙/계획: `docs/superpowers/specs|plans/2026-07-01-*`

## 범위
1. GA4 버튼 클릭 이벤트 계측(12지점)
2. 문의 폼 Zapier 웹훅 전송 연동
3. SEO 로케일별 메타데이터 + 일본어 로케일 `jp→ja`

## 핵심 설계 결정 (why)
- **GA 이벤트 3종**: Notion GA 문서 분류(관심/잠재/문의완료)를 그대로 `interest_click`/`lead_acquisition_click`/`inquiry_complete`로. 공통 파라미터 `location`/`label`.
- **`inquiry_complete` 발화 시점**: 폼 **제출 성공 시**(검증 통과 후)만. 클릭 즉시 아님 → 전환 수치 신뢰도. `[빠른 상담하기]`(카카오)는 외부 이동이라 클릭 시.
- **`@fai/ui` 분석 비종속**: 공용 패키지엔 GA 명칭/이벤트를 절대 넣지 않고 제네릭 옵셔널 콜백(`onItemClick`/`onContactClick`/`onSocialClick`/`MenuItem.onClick`)만. GA는 homepage 브릿지(NavigationBarBridge/FooterBridge)에서만. 대안(전역 클릭 리스너)은 href/텍스트 매칭이 취약해 기각.
- **Zapier payload**: 관심사 → `solution[]`(`"vision checkout"`/`"standard store"`/`"micro store"` — 사용자 확정 문자열), 세부 버티컬(베이커리/급식/특수입지/기타)은 `content` 자동 문자열, `option:[]`, `utm_*`+`referrer` 캡처.
- **로케일 `ja`**: 일본어 언어코드는 ISO 639-1 `ja`(기존 `jp`는 국가코드 오용). `en`/`ja`는 미번역이라 `noindex` 유지, 번역 완료 시 해제.
- **홈 `<title>`**: 검색제목(설명형) 사용, 서브페이지 템플릿 `%s | Fainders.AI`(탭 통일값과 별개).

## Gotchas (주의)
- **`sendGAEvent`는 `window` 없으면 throw** → `trackEvent`에 `typeof window === "undefined"` 가드 필수(정적 export 프리렌더 안전). 계획서가 "내부 가드된다"고 했으나 사실 아님 → 구현 중 교정.
- **Zapier는 `application/x-www-form-urlencoded` + `JSON.stringify(body)`** 조합을 기대. `application/json`으로 보내면 필드가 **빈 값으로 매핑**됨.
- **`pnpm lint` 사전 깨짐**: `eslint-config-next` ↔ `@eslint/eslintrc` 순환 JSON 크래시. 우리 코드 무관. 게이트는 `build`+`test`.
- **`<html lang>` 재구성**: 이 Next(16.2.7)에선 root layout을 `app/[locale]/layout.tsx`로 병합(`<html lang={locale}>`)하고 `app/layout.tsx` 제거하는 패턴 사용(Next 문서 확인). GA/JSON-LD/폰트/globals.css 유실 없이 이관.
- **루트 언어 리다이렉트**: `public/index.html`이 `navigator.languages` 우선순위로 라우팅 → 영어 우선 브라우저는 `/en`으로 감(정상 동작, 버그 아님). 미번역 상태가 신경 쓰이면 "무조건 /ko"로 바꿀 수 있음.

## 운영 인계 (코드 밖)
- **GA4 콘솔**: `location`/`label` **맞춤 측정기준** 등록, `lead_acquisition_click`·`inquiry_complete` **주요 이벤트(전환)** 등록해야 리포트/전환 집계됨.
- **`G-FZQS63DGEW`**: 코드에 없음. `G-GCQKJ5TF6R`의 **"연결된 사이트 태그"** 로 추정 → GA4 관리 → 데이터 스트림 → 태그 설정에서 해제.
- **마케팅 카피**: `config/site.ts` `seo` 맵의 `// TODO(marketing)`(en/ja 검색제목·키워드, ja OG제목) 확정 교체.

## 검증 결과
- GA: dataLayer 실측 **10/10** + 빈 폼 미발화 확인(데스크톱+모바일).
- Zapier: 실전 전송 **5건 200/success**(ko/en/ja 포함), payload 규격 일치.
- SEO: `out/` 산출물에서 ko/en/ja `lang`·`title`·`description`·`robots`·`og`·`hreflang` 전항목 일치, `/jp` 제거.
- DEV 배포: https://d6hs8futv6rcu.cloudfront.net (라이브 확인).
