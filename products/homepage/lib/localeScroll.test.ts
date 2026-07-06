import { describe, it, expect, beforeEach, vi } from 'vitest';
import { markLocaleSwitchScroll, consumeLocaleSwitchScroll } from './localeScroll';

describe('localeScroll', () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it('저장한 스크롤 위치를 그대로 반환한다', () => {
    vi.spyOn(window, 'scrollY', 'get').mockReturnValue(1500);
    markLocaleSwitchScroll();
    expect(consumeLocaleSwitchScroll()).toBe(1500);
  });

  it('consume는 1회성 — 두 번째 호출은 null (다음 실제 이동에서 오복원 방지)', () => {
    vi.spyOn(window, 'scrollY', 'get').mockReturnValue(800);
    markLocaleSwitchScroll();
    expect(consumeLocaleSwitchScroll()).toBe(800);
    expect(consumeLocaleSwitchScroll()).toBeNull();
  });

  it('저장된 적 없으면 null', () => {
    expect(consumeLocaleSwitchScroll()).toBeNull();
  });

  it('스크롤 0(최상단)에서 전환해도 0을 복원한다 (falsy 함정 방지)', () => {
    vi.spyOn(window, 'scrollY', 'get').mockReturnValue(0);
    markLocaleSwitchScroll();
    expect(consumeLocaleSwitchScroll()).toBe(0);
  });
});
