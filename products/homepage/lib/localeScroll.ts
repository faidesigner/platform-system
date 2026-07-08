/**
 * 언어 전환 시 스크롤 위치 보존 헬퍼.
 *
 * 동작 흐름:
 *  1. LanguageSwitcher에서 locale 전환 직전 saveLocaleScroll() 호출 → sessionStorage 저장
 *  2. SmoothScroll 리마운트 후 peekLocaleScroll()로 값 확인 (삭제하지 않음)
 *  3. 실제 복원 완료 직전 clearLocaleScroll() 호출 → 그 때 삭제
 *
 * React StrictMode(dev) 이중 실행 대응:
 *  - 1차(가짜) 마운트: peekLocaleScroll()로 값 읽음(삭제 안 함) → rAF 예약
 *  - 클린업: cancelAnimationFrame → rAF 취소 (clearLocaleScroll 미실행)
 *  - 2차(실제) 마운트: peekLocaleScroll()로 다시 값 읽음 → rAF 실행 → clearLocaleScroll + 복원 ✅
 */

const SESSION_KEY = 'fai_locale_scroll_y';

/** 언어 전환 직전 현재 scrollY를 sessionStorage에 저장. */
export const saveLocaleScroll = (): void => {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(SESSION_KEY, String(Math.round(window.scrollY)));
};

/**
 * 저장된 scrollY를 읽어 반환. sessionStorage는 삭제하지 않음.
 * 실제 복원 성공 후 clearLocaleScroll()을 별도 호출해야 함.
 */
export const peekLocaleScroll = (): number | null => {
  if (typeof window === 'undefined') return null;
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (raw === null) return null;
  const y = Number(raw);
  return Number.isFinite(y) ? y : null;
};

/**
 * 복원 완료 후 호출 — 일반 페이지 이동에서 재사용되지 않도록 삭제.
 */
export const clearLocaleScroll = (): void => {
  if (typeof window !== 'undefined') sessionStorage.removeItem(SESSION_KEY);
};
