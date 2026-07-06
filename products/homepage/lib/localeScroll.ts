// 언어 전환 시 스크롤 위치 보존.
//
// 왜 필요한가: [locale]이 <html>을 소유하는 루트 세그먼트라 언어 전환(/ko → /en)은
// 그 아래 트리(SmoothScroll 포함)를 리마운트시킨다. 리마운트되면 SmoothScroll의
// 스크롤 초기화 이펙트가 마운트 시 1회 실행되어 최상단으로 이동한다(pathname 가드로는
// 막을 수 없음 — 이펙트는 deps와 무관하게 마운트 때 항상 돈다).
// 따라서 전환 직전 위치를 저장했다가 새 마운트에서 복원한다.

const KEY = 'fai:localeSwitchScrollY';

/** 언어 전환 직전 현재 스크롤 위치를 저장한다. */
export function markLocaleSwitchScroll(): void {
  try {
    sessionStorage.setItem(KEY, String(window.scrollY));
  } catch {
    // storage 비활성(프라이빗 모드 등) 환경은 복원을 포기한다 — 최상단 이동으로 폴백.
  }
}

/**
 * 저장된 스크롤 위치를 읽고 **즉시 제거**한다(1회성).
 * 다음 실제 페이지 이동에서 잘못 복원되지 않도록 소비 즉시 비운다.
 * @returns 저장된 y값, 없거나 무효하면 null
 */
export function consumeLocaleSwitchScroll(): number | null {
  try {
    const v = sessionStorage.getItem(KEY);
    if (v === null) return null;
    sessionStorage.removeItem(KEY);
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}
