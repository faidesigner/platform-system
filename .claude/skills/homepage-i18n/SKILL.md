---
name: homepage-i18n
description: Use when adding or editing user-facing copy or translations on the FAI homepage (products/homepage) — where strings live, ko/en/ja key sync, server vs client access, the @fai/ui boundary, what must NOT be translated, and how to verify no wrong-language text leaks.
---

# Homepage i18n (ko / en / ja)

## 개요
모든 UI 카피는 `products/homepage/messages/{ko,en,ja}.json`가 **단일 소스**이고 컴포넌트는 next-intl로 읽는다. `config/site.ts`는 **구조/에셋(이미지·URL·아이콘·색상변수)** 만 갖는다. 로케일은 `ko`(기본·index) / `en` / `ja`(**`jp` 아님** — ISO 639-1). en·ja는 미번역 구간까진 `noindex`.

## 규칙
- **키 동기**: ko/en/ja가 **동일한 키 집합**이어야 한다(누락 시 해당 로케일 렌더/빌드 깨짐).
- **접근**: 서버 컴포넌트 `await getTranslations()`, 클라이언트 `useTranslations()`. `[locale]/layout`에 `NextIntlClientProvider` 이미 있음.
- **중첩 객체 배열**(features/benefits/reviews/caseStudies/media items 등): 구조·에셋은 `config`에 남기고 **텍스트만 messages에 인덱스 키**로. 컴포넌트/`page.tsx`가 `config[i]` + `t('...<i>.<field>')`를 병합.
- **`@fai/ui`는 i18n 비결합**: 공용 패키지는 `next-intl`을 import하지 않는다. 텍스트는 **optional prop으로 주입**하고 homepage 브릿지(NavigationBarBridge/FooterBridge)에서 `t(...)`로 넘긴다. (GA 콜백과 동일 패턴)
- **네임스페이스**: `common`(공용 CTA) / `nav` / `footer` / `home` / `products.<slug>` / `about` / `media` / `contact`. 공용 버튼은 `common.cta.*` 재사용(중복 키 금지).
- **서버→클라 함수 prop 금지**(RSC): aria 등은 서버에서 문자열로 미리 만들어 prop으로.

## 번역 금지 (원문 유지)
고유명사(Fainders.AI, FAI, VCO, VISION CHECK-OUT, WALK-THROUGH, STANDARD/MICRO STORE), 고객사/투자사/인명, URL·이미지 경로, 이메일·전화·주소·사업자번호 등 실데이터, 숫자·단위. `MISSING_FROM_DESIGN` 플레이스홀더는 손대지 않는다. Zapier payload의 `content`는 영업팀용 **한국어 유지**(payload는 config 라벨을 읽음).

## 초벌 번역 & 검수
en/ja는 초벌로 넣되 **`products/homepage/docs/TODO_i18n-marketing-review.md`에 검수 대상 누적**(브랜드 카피·언론 헤드라인·로마자 인명/주소 등).

## 검증
```bash
# 1) 키 동기 (ko=en=ja, 차집합 0)
node -e "const w=(x,p='')=>x&&typeof x==='object'&&!Array.isArray(x)?Object.entries(x).flatMap(([k,v])=>w(v,p?p+'.'+k:k)):[p];const L=l=>new Set(w(require('./messages/'+l+'.json')));const ko=L('ko'),en=L('en'),ja=L('ja');const d=(a,b)=>[...a].filter(x=>!b.has(x));console.log(ko.size,en.size,ja.size,d(ko,en),d(en,ko),d(ko,ja),d(ja,ko))"
# 2) 빌드+테스트
pnpm build && pnpm test
```
- **로케일 오염 스윕(Playwright)**: dev 서버 후 각 페이지 `document.body.innerText` 수집 → `/en`·`/ja`에 한글(`[가-힣]`), `/ko`·`/en`에 카나(`[぀-ヿ]`) 검출. **분류 필수**: LEAK(UI 카피 오역/미번역) vs 의도적(고유명사·인명·주소) vs 외부동기(YouTube RSS/Stibee — 미번역 알려진 공백). LEAK만 수정.

## 흔한 실수
- 배열 텍스트를 config에 남긴 채 방치 → 오역/미번역. 인덱스 키로 이전.
- 한 로케일에만 키 추가 → 키 desync. 항상 3개 동시.
- `@fai/ui`에 next-intl import → 경계 위반. prop 주입으로.
- 컴포넌트 테스트가 `@/i18n/navigation`을 끌어오면 vitest에서 next/navigation 해석 실패 → 테스트에서 `vi.mock("@/i18n/navigation", ...)`로 스텁.
