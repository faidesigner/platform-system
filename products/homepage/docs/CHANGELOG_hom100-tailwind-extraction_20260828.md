# HOM-100 — footer 배경색 유실과 Tailwind 클래스 추출 함정

작성: 2026-08-28 / 브랜치: `fix/hom100-footer-background` → develop `1b3feb2`

---

## 요약

footer 배경색이 통째로 사라진 채 dev에 배포됐다. **CSS도 토큰도 정상이었고, Tailwind가 클래스를 추출하지 못한 것**이 원인이다. vitest 213개와 배포 게이트 4종이 모두 통과했다.

조사 도중 더 큰 문제를 발견했다 — **배포 게이트가 자기 주석 때문에 스스로 무력화**되고 있었다.

---

## 1. 근본 원인

```
✗ className={`relative w-full bg-bg-200${wideCompact ? ' fai-footer--wide' : ''}`}
✓ className={`relative w-full bg-bg-200 ${wideCompact ? 'fai-footer--wide' : ''}`}
```

Tailwind는 소스 텍스트를 **정적으로 스캔**해 클래스 후보를 뽑는다. 클래스 문자 바로 뒤에 공백 없이 `${...}`가 붙으면 추출기가 보는 토큰은 `bg-bg-200${wideCompact`가 되어 후보로 인정되지 않는다.

결과: 클래스는 HTML에 그대로 붙어 있고 **CSS 규칙만 없다.**

- 타입 오류 없음 (문자열 조립이므로)
- 빌드 경고 없음
- 런타임 오류 없음
- 화면에서는 "그 속성이 지정되지 않은 것"과 구분 불가

### 왜 특히 위험한가

같은 클래스를 **다른 파일에서도 쓰고 있으면 우연히 생성돼 통과한다.** 그 다른 사용처가 리팩토링으로 사라지는 순간 조용히 터진다. 즉 지금 "정상"인 것도 시한폭탄이다.

실제로 6곳 중 4곳이 이 상태였다.

| 위치 | 클래스 | 상태 |
|---|---|---|
| `packages/ui/components/footer/Footer.tsx:274` | 배경 유틸 | 🔴 유실 (HOM-100) |
| `components/sections/products/StoreEffects.tsx:107` | desktop 높이 | 🔴 유실 |
| `packages/ui/components/footer/Footer.tsx:171` | `leading-[20px]` | 🟡 타 파일 덕에 생존 |
| `components/sections/CtaBanner.tsx:61` | `text-text-inverse` | 🟡 생존 |
| `components/sections/products/StoreTypes.tsx:77` | `object-cover` | 🟡 생존 |
| `components/sections/products/ProductFeatures.tsx:152` | (BEM 클래스) | 🟡 무해 |

**StoreEffects 건은 부수 수확이다.** PR #11이 3열 카드 제목 높이를 2×line-height로 통일했는데, `desktop:h-[4.875rem]`이 유실돼 **1440px 이상에서 그 수정이 작동하지 않고 있었다.** 아무도 몰랐다.

---

## 2. 게이트가 스스로 무력화된 사고

배경색 검사를 `check-footer-layout.mjs`에 추가하고, 습관대로 사고 형태로 되돌려 게이트가 무는지 확인했다. **통과했다.**

원인: 게이트 스크립트 주석에 클래스명을 적었기 때문이다.

```js
msg: `footer 배경색이 투명하다 ... bg-bg-200 유틸리티가 생성되지 않았을 가능성`
//                                 ^^^^^^^^^ 이 문자열이 CSS로 유입된다
```

Tailwind v4의 자동 소스 감지는 `.gitignore` 밖 **모든** 파일을 훑는다. `scripts/*.mjs`도 포함이다.

### 더 나쁜 것: config 주석이 거짓이었다

`tailwind.config.ts`에는 이미 이렇게 적혀 있었다.

```
// 테스트 파일은 스캔에서 제외 — 주석/정규식 속 클래스 리터럴이 프로덕션 CSS로 새는 것 방지.
'!./**/*.{test,spec}.{ts,tsx,js,jsx}',
```

의도는 정확했다. **그런데 v4에서 이 negation은 적용되지 않는다.** 실증: 테스트 파일에 `bg-[#123456]` 카나리를 넣고 빌드하면 CSS에 그대로 생성된다.

즉 "막았다고 적혀 있지만 안 막힌" 상태로 방치돼 있었고, 그 구멍이 이번에 게이트를 무력화했다.

### 해결

```css
@import "tailwindcss" source(none);
@source ".";
@source "../components";
@source "../config";
@source "../root/components";
@source "../../../packages/ui/components";
```

`source(none)`이 자동 감지를 끄고, `@source` 목록만 스캔한다.

**시도했다가 실패한 것:** `@source not "..."` — postcss 8.4.31이 prelude를 파싱하지 못해 빌드가 깨진다(`CssSyntaxError: Unknown word`). postcss를 올릴 수 있게 되면 테스트 파일 제외를 이 방식으로 추가할 수 있다.

**또 한 번 밟은 함정:** CSS 주석 안에 glob 패턴(별표 두 개 + 슬래시 + 별표)을 쓰면 `*/`가 포함되어 **주석이 조기 종료**되고 빌드가 깨진다.

### 과다 배제 검증

스캔 범위를 좁이면 필요한 클래스가 빠질 위험이 있다. 소스의 단순 클래스(variant·arbitrary 없는 것) **275개를 산출 CSS와 전수 대조**했다.

- 누락 **0건**
- 오탐 4건 — 템플릿 리터럴 변수명 파편 3개(`error`/`pathname`/`submitted`) + Tailwind marker `peer` 1개

게이트 4종과 vitest 215개도 모두 통과.

---

## 3. 재발 방지

이 결함은 기존 검사 **전부를 통과**했다. 원인과 증상을 각각 막았다.

### ① `app/tailwindExtraction.test.ts` — 원인 금지

`className={\`...\`}` 템플릿에서 클래스 문자 바로 뒤에 공백 없이 `${...}`가 붙는 것을 금지한다.

**유실 여부와 무관하게 패턴 자체를 막는 이유:** 위에서 본 대로 "지금 우연히 살아 있는 것"이 가장 위험하다. 산출 CSS를 사후 대조하는 방식은 variant 이스케이프 때문에 오탐이 많아 원인 쪽을 막는 것이 확실하다.

⚠️ **이 파일에는 실제 클래스명을 쓰지 않았다.** 테스트 파일도 스캔 대상이므로 여기 적은 클래스가 CSS로 새어 지키려는 회귀를 되살린다. 예시는 존재하지 않는 이름(`bg-EXAMPLE-200`)으로 적고 그 이유를 파일 상단에 명시했다.

### ② `check-footer-layout.mjs` 불변식 ④ — 증상 검출

footer의 **computed** `backgroundColor`가 투명이면 배포 중단. 클래스 존재만으로는 알 수 없고 실제 렌더 값을 봐야 잡힌다.

### 두 가드 모두 실제로 무는지 확인

| | 사고 형태 | 정상 |
|---|---|---|
| 정적 가드 | `Footer.tsx:274 — ...bg-bg-200${` 지목, 1 failed | 215 PASS |
| 배포 게이트 | 9개 조합 전부 `배경 rgba(0, 0, 0, 0)` ✗, exit=1 | `rgb(245, 245, 245)` ✓ exit=0 |

---

## 4. 배포 게이트 현황 (4종)

| 게이트 | 불변식 |
|---|---|
| `check-mobile-overflow.mjs` | 가로 오버플로우 (3 로케일 × 7 라우트) |
| `check-footer-layout.mjs` | 로고 폭 로케일 불변 / 로고~회사명 여백 ≥24px / 전화번호 1줄 / **배경색 존재** |
| `check-about-layout.mjs` | 라벨 우측 여백 편차 ≤1px / 카드 화면 이탈 / 이미지 비율 9:5 (7폭 × 3로케일) |
| `check-root-html.mjs` | 산출물의 Meta 인증 · 언어 감지 / 루트 점유 라우트 부재 |

공용 인프라는 `scripts/lib/staticPreview.mjs`(`withPreview` / `measurePage`)로 추출했다 — 서빙 규칙이 게이트마다 갈라지면 "게이트는 통과하는데 배포물은 다르다"가 발생하므로 한 곳에만 둔다.

---

## 5. 남은 것

- **postcss 업그레이드 시** `@source not`으로 테스트 파일을 스캔에서 제외할 수 있다. 현재는 "테스트 파일에 실제 클래스명을 쓰지 않는다"는 규율로 대응 중이다.
- `packages/ui` 수정 시 **worktree를 쓰지 말 것** — `@fai/ui` 심볼릭 링크가 메인 워크스페이스를 가리켜 검증이 무의미해진다.
