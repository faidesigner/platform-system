# GA 클릭 이벤트 태그 설계

- 작성일: 2026-07-01
- 대상: `products/homepage` (Next.js 정적 export)
- 기준 문서: Notion — Google Analytics (FAI Homepage v3.0, 2026.06.24)
- 상태: 승인됨 (설계 확정)

## 1. 목적과 범위

Notion GA 문서가 정의한 **버튼 클릭 이벤트 태그**를 홈페이지에 심는다. GA4 페이지뷰는
`@next/third-parties`의 `<GoogleAnalytics gaId="G-GCQKJ5TF6R" />`로 이미 자동 추적 중이므로
이번 작업 범위가 아니다.

범위:

- Notion이 정의한 12개 클릭 지점에 3종 커스텀 이벤트 발화
- 이벤트 로직을 homepage에 집중, 공용 `@fai/ui`는 분석 비종속 유지
- vitest 최소 세팅 + 순수 로직 단위 테스트

범위 밖:

- GA4 관리콘솔의 맞춤 측정기준/주요 이벤트(전환) 등록 (운영자 인계 사항)
- SEO 작업 (별도 진행)
- 문의 폼 백엔드 연동 (현재 폼은 서버 전송 없음)

## 2. 이벤트 스키마

3개 커스텀 이벤트, 공통 파라미터 `location` + `label`:

```ts
trackEvent("interest_click",         { location, label });
trackEvent("lead_acquisition_click", { location, label });
trackEvent("inquiry_complete",       { location, label });
```

- `location` (enum): 발화 위치 식별자
  - `nav`, `home_hero`, `home_customers`, `home_cta_banner`,
    `product_hero`, `product_cta_banner`, `media_showcase`,
    `footer`, `contact_form`, `contact_kakao`
- `label` (string): 노출 텍스트/식별자 (예 `제품`, `도입 문의하기`, `LinkedIn`)
- 페이지 경로·언어는 GA가 `page_location`으로 자동 부착 → 파라미터에 넣지 않는다.

### GA4 매핑 규칙

- `interest_click` = Notion "관심 고객"
- `lead_acquisition_click` = Notion "잠재 고객 확보"
- `inquiry_complete` = Notion "문의 완료"

> 운영 인계: GA4 리포트에서 `location`/`label`로 분해하려면 관리콘솔에서 **맞춤 측정기준** 등록 필요.
> `lead_acquisition_click`·`inquiry_complete`는 **주요 이벤트(전환)** 로 등록 권장.

## 3. 버튼 → 이벤트 매핑

| # | 위치 | 버튼 | event | location | label |
|---|---|---|---|---|---|
| 1 | 네비 | 제품/회사소개/미디어 | interest_click | `nav` | 메뉴명 |
| 2 | 네비 | 문의하기 | lead_acquisition_click | `nav` | 문의하기 |
| 3 | 홈 hero | 자세히 알아보기 | interest_click | `home_hero` | 자세히 알아보기 |
| 4 | 홈 customers | 실제 도입 후기 더보기 | interest_click | `home_customers` | 실제 도입 후기 더보기 |
| 5 | 홈 ctaBanner | 도입 문의하기 | lead_acquisition_click | `home_cta_banner` | 도입 문의하기 |
| 6 | 제품 hero | 도입 문의하기 | lead_acquisition_click | `product_hero` | 도입 문의하기 |
| 7 | 제품 ctaBanner | 도입 문의하기 | lead_acquisition_click | `product_cta_banner` | 도입 문의하기 |
| 8 | 미디어 | 더 알아보기 | interest_click | `media_showcase` | 더 알아보기 |
| 9 | 미디어 | Instagram/LinkedIn | interest_click | `media_showcase` | 플랫폼명 |
| 10 | 푸터 | SNS 아이콘 | interest_click | `footer` | 플랫폼명 |
| 11 | 문의 | 문의하기(제출 성공) | inquiry_complete | `contact_form` | 문의하기 |
| 12 | 문의 | 빠른 상담하기(카카오) | inquiry_complete | `contact_kakao` | 빠른 상담하기 |

발화 시점 규칙:

- #11 `inquiry_complete`: 폼 검증 통과 후 `setSubmitted(true)` 직전(성공 확정 지점)에서만 발화.
  검증 실패 시 발화하지 않는다.
- #12: 카카오는 외부 이동이므로 클릭 시점 발화.
- CtaBanner는 홈·제품 공용 컴포넌트 → `location` prop 주입으로 #5/#7 구분.
- 네비 "채용"은 Notion "채용 제외" 명시 → 계측하지 않는다.

## 4. 아키텍처

```
products/homepage/lib/analytics/
├── events.ts    # 이벤트명 상수 + location enum + 파라미터 타입 (단일 소스)
└── track.ts     # trackEvent(event, params): sendGAEvent 얇은 래퍼 (gtag 접점 유일)
```

원칙:

- **gtag/sendGAEvent를 만지는 곳은 `track.ts` 하나뿐.** 나머지는 타입 안전한 `trackEvent()`만 호출.
- `trackEvent`는 SSR/GA 미로드 환경에서 안전하게 no-op (정적 export·빌드 타임 보호).

### 4.1 homepage 소유 버튼

CtaBanner / HeroSection / CustomersSection / ShowcaseSection / ContactUsSection 의
onClick·submit 핸들러에서 `trackEvent()`를 직접 호출한다.

### 4.2 `@fai/ui` 내부 접점 (네비 메뉴·네비 문의하기·푸터 SNS)

공용 컴포넌트에 **분석 비종속 콜백 prop**을 추가하고, homepage 브릿지에서 `trackEvent`로 연결한다.
`@fai/ui`는 "무엇이 클릭됐다"만 알리고 GA는 모른다.

- `NavigationBar`: `onItemClick?(item: NavItem)` (메뉴 네비), `onContactClick?()` (문의하기 CTA)
- `Footer`: `onSocialClick?(label: string)`
- 브릿지: `NavigationBarBridge`가 nav 콜백을, homepage Footer 사용처가 social 콜백을 `trackEvent`에 연결.

콜백 prop은 모두 optional → 기존 사용처 무영향(하위 호환).

### 대안 (비채택)

문서 레벨 전역 클릭 리스너로 href/텍스트 매칭 → `@fai/ui` 무수정이지만 매칭이 취약
(social href·nav 텍스트 변경 시 조용히 깨짐). 타입 안전성·유지보수성에서 콜백 prop 방식이 우수.

## 5. 테스트 (Strict TDD)

현재 프로젝트에 vitest 미설치 → homepage에 vitest 최소 세팅 추가.

- `buildEvent(name, params)` 순수 payload 조립 함수 100% 단위 테스트 (Red→Green→Refactor)
- `trackEvent`가 `sendGAEvent`를 올바른 인자로 호출하는지 mock 검증
- UI 배선은 대표 흐름 1건: 문의 폼 제출 **성공 시** inquiry_complete 발화 / **검증 실패 시** 미발화

## 6. 부수 정리

- `components/layout/Footer.tsx` 사용처 확인 후, 죽은 코드로 확정되면 제거
  (SNS href가 `https://linkedin.com` 등 플레이스홀더로 실제 렌더 Footer(`@fai/ui`)와 불일치).

## 7. 검증 기준 (완료 정의)

- 12개 지점 각각 클릭 시 dataLayer에 규격대로 이벤트가 push되는지 실측 (GA DebugView / Playwright)
- `lint`·`build`·`vitest` 통과
- `@fai/ui` 기존 사용처(다른 제품 포함) 타입/렌더 무영향
