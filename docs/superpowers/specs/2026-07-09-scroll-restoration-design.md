# 스크롤 복원 (뒤로/앞으로) 설계

- 작성일: 2026-07-09
- 대상: `products/homepage`
- 관련: PR #7에서 시도됐다 보류된 popstate 스크롤 복원 재구현 (stale-flag 버그 제거)

## 배경 / 문제

브라우저 뒤로/앞으로 가기 시 이전 스크롤 위치가 복원되지 않고 항상 최상단으로 이동한다.
현재 `SmoothScroll`의 라우트 전환 이펙트는 `consumeLocaleSwitchScroll()`(언어 전환) 또는
해시 앵커가 아니면 무조건 `toTop()`을 호출하기 때문이다.

기존에 스크롤 복원 로직이 **세 곳에 분산**되어 있다:

1. `lib/localeScroll.ts` — 언어 전환 시 remount 대비 복원 (SmoothScroll이 소비).
2. `components/sections/about/AboutPeople.tsx` — 카드 링크 클릭 시 `window.scrollY` 저장,
   mount 시 복원하는 컴포넌트-로컬 임시 훅 (`aboutPeopleScrollY`). 카드 링크는 **외부 URL**
   (`faindersai.career.greetinghr.com/interview*`)이라 **전체 문서 리로드**가 일어나며,
   이때 `popstate`는 발화하지 않는다 → SPA popstate만으로는 이 흐름을 커버하지 못한다.
3. PR #7이 `SmoothScroll`에 추가하려던 범용 popstate 복원 — `isPopStateRef` boolean 플래그가
   **해시 전용 뒤로가기(pathname 불변)에서 고착**되어, 다음 실제 내비게이션의 `toTop()`을
   건너뛰는 버그가 있어 병합 시 보류됨.

## 목표

- 모든 페이지에서 브라우저 뒤로/앞으로 시 직전 스크롤 위치를 복원한다.
- Lenis 스무스 스크롤과 정합되게 동작한다.
- PR #7의 stale-flag 버그를 **구조적으로 재현 불가능**하게 만든다.
- 분산된 로직을 정리한다: 범용 메커니즘이 `AboutPeople`의 임시 훅을 흡수·대체하고,
  `localeScroll`은 트리거 성격이 달라(remount) 그대로 유지·공존한다.

## 비목표 (YAGNI)

- 동일 URL이 히스토리에 여러 번 등장할 때 엔트리별로 다른 스크롤을 구분하는 것(브라우저 native
  scrollRestoration 수준). URL 단위 근사로 충분하다.
- `localeScroll`(언어 전환 복원)을 같은 훅으로 통합하는 전면 일원화. 트리거가 remount라 별개로 둔다.
- 가로 스크롤 컨테이너(예: AboutPeople 카드 레일)의 내부 스크롤 복원. 페이지 세로 스크롤만 다룬다.

## 아키텍처

### 순수 로직 모듈 — `lib/scrollPositions.ts`
DOM·라우팅에서 분리해 단위 테스트 100%를 보장한다.

- `saveScrollPosition(url: string, y: number): void`
  `sessionStorage`의 단일 키 `fai:scrollPositions`(JSON `{ [url]: y }`)에 기록. 항목 수 상한(예: 30)을
  두어 오래된 것부터 제거. storage 비활성(프라이빗 모드) 시 조용히 무시(try/catch).
- `readScrollPosition(url: string): number | null`
  저장값 반환. 없거나 무효(NaN)면 `null`.
- (판정 헬퍼) `samePath(a: string, b: string): boolean`
  두 URL의 pathname(해시·search 제외)이 같은지. 해시 전용 pop 판별에 사용.

### 복원 실행 헬퍼 — `restoreScroll(y)` (SmoothScroll 내부 또는 lib)
콘텐츠 높이가 목표에 도달할 때까지 rAF로 최대 N프레임 재시도 후 복원한다
(SSG 하이드레이션·이미지 로드로 문서 높이가 뒤늦게 커지는 경우 대비 — 기존 localeScroll 재시도 패턴 재사용).

```
restoreScroll(y):
  tries = 0
  loop via requestAnimationFrame:
    maxY = documentElement.scrollHeight - innerHeight
    if maxY >= y or tries++ >= N:
      lenisRef.current?.resize()
      (lenisRef.current ? lenisRef.current.scrollTo(min(y, max(0, maxY)), {immediate:true})
                        : window.scrollTo(0, min(y, max(0, maxY))))
      stop
```

### 두 가지 내비게이션 타입 — 서로소(disjoint) 경로로 완결
- **SPA(클라이언트) 뒤로/앞으로:** 문서 리로드 없이 next 라우터가 처리 → `popstate` 발화 →
  아래 popstate 경로가 복원.
- **문서 리로드 뒤로/앞으로:** 외부 URL 왕복 복귀, 또는 리로드된 직접 뒤로가기 → SmoothScroll가
  새로 mount됨. 이 문서는 `popstate`가 안 뜨는 대신
  `performance.getEntriesByType('navigation')[0].type === 'back_forward'`로 판별 가능 →
  **mount-time 경로**가 복원.
- 두 경로는 겹치지 않는다: SPA 내비는 문서를 리로드하지 않으므로 navigation.type이 그대로
  `'navigate'`(최초 로드값)라 mount-time 경로가 발화하지 않는다. 따라서 이중 복원 없음.
- 이 mount-time 경로가 `AboutPeople`의 외부 왕복 복귀 케이스를 대체하므로 임시 훅을 **안전하게 삭제**한다.

### mount-time 복원 (문서 리로드 back/forward)
```
on SmoothScroll mount (1회):
  history.scrollRestoration = 'manual'
  if navigationType() === 'back_forward':
      restoreScroll(readScrollPosition(fullUrl()) ?? 0)
```
`navigationType()` = `performance.getEntriesByType('navigation')[0]?.type` (없으면 `undefined`).

### 판정 (SPA pop 감지) — boolean 플래그 대신 **URL 동일성**

`SmoothScroll`에 refs:
- `handledUrlRef` — 스크롤 이펙트가 마지막으로 처리한 전체 URL.
- `pendingPopUrlRef` — pathname이 바뀌는 pop이 지정한 복원 대상 URL.

```
history.scrollRestoration = 'manual'   // mount 시 1회

popstate 리스너:
  target = fullUrl()                    // pop 시점엔 location이 이미 target
  if samePath(target, handledUrlRef.current):   // 해시 전용 pop → [pathname] 이펙트 안 돎
      restoreScroll(readScrollPosition(target) ?? 0)   // 리스너가 직접 복원(자기완결)
  else:
      pendingPopUrlRef.current = target            // pathname 변경 pop → 이펙트가 처리

[pathname] 스크롤 이펙트 (push + pathname 변경 pop에서 발화):
  target = fullUrl(); handledUrlRef.current = target
  if pendingPopUrlRef.current === target:
      pendingPopUrlRef.current = null
      restoreScroll(readScrollPosition(target) ?? 0)      // 뒤로/앞으로
  elif (savedY = consumeLocaleSwitchScroll()) != null:
      restoreScroll(savedY)                                // 언어 전환(기존 유지)
  elif hash:
      앵커로 스크롤 (기존 로직)
  else:
      toTop()

scroll 리스너 (throttle, rAF 또는 ~150ms):
  saveScrollPosition(fullUrl(), window.scrollY)
```

### 왜 stale-flag 버그가 불가능한가
판정이 boolean이 아니라 **URL 일치 비교**다. 해시 전용 pop이 `pendingPopUrlRef`에 값을 남겨도,
이후 일반 push는 *다른 URL*이므로 `pendingPopUrlRef.current === target`가 거짓 → 정상 `toTop()`.
즉 "고착된 플래그가 무관한 다음 내비게이션을 오판"하는 시나리오가 성립하지 않는다.
(추가로 pathname 변경 pop 경로에서는 소비 즉시 `null`로 비운다.)

## 데이터 흐름

1. 사용자가 페이지를 스크롤 → throttle된 리스너가 `fai:scrollPositions[url] = y` 갱신.
2. 링크 클릭(push) → `[pathname]` 이펙트: pending pop 아님 → `toTop()`(또는 해시 앵커).
3. 브라우저 뒤로가기(pathname 변경) → popstate 리스너가 `pendingPopUrlRef=target` → 이펙트가
   `readScrollPosition(target)`로 `restoreScroll`.
4. 브라우저 뒤로가기(해시만 변경) → popstate 리스너가 즉시 `restoreScroll`(이펙트 미발화).

## 에러 / 엣지 처리

- storage 비활성: `try/catch`로 저장·조회 실패를 삼키고 복원 미수행(= 최상단 폴백).
- 저장값 없음: `?? 0` → 최상단.
- 콘텐츠 높이 미달: rAF 재시도 후 도달 가능 최댓값으로 클램프.
- Lenis 미초기화: `window.scrollTo` 폴백.
- React StrictMode(dev) 이중 마운트: 리스너 등록/해제는 이펙트 cleanup에서 대칭 처리.

## 테스트 (TDD, vitest)

순수 로직(`lib/scrollPositions.ts`)은 단위 테스트 100%:
- `save`/`read` 왕복, 무효값 → `null`, storage 예외 안전, 항목 수 상한 동작.
- `samePath`: 해시/search 차이 무시, pathname 차이 구분.

판정·복원 흐름(모듈로 분리한 결정 로직) 테스트:
1. 일반 push → `toTop`.
2. pathname 변경 pop → 저장된 위치 복원.
3. **회귀: 해시 전용 pop 직후 push → 반드시 `toTop`** (PR #7 버그 고정).
4. 콘텐츠 높이 미달 시 rAF 재시도 후 복원.
5. Lenis 부재 시 `window.scrollTo` 폴백.
6. `navigationType()==='back_forward'` → mount-time 복원, `'navigate'` → 미복원.

## 변경 파일(예정)

- 신규 `products/homepage/lib/scrollPositions.ts` + `scrollPositions.test.ts`
- 수정 `products/homepage/components/layout/SmoothScroll.tsx`
- 삭제/정리 `products/homepage/components/sections/about/AboutPeople.tsx`의
  `aboutPeopleScrollY` 저장·복원 훅 + `saveScroll` `onClick` 배선
  (외부 왕복 복귀는 SmoothScroll의 mount-time `back_forward` 경로가 대체).
- 유지 `products/homepage/lib/localeScroll.ts` (변경 없음)
