"use client";

import * as React from "react";
import { CollapsibleGroupContext } from "./CollapsibleGroupContext";

export type CollapsibleConfig = {
  /** 비제어 모드 초기 열림 상태 @default true */
  defaultIsOpen?: boolean;
  /** 제어 모드 열림 상태 */
  isOpen?: boolean;
  /** 열림 상태 변경 콜백 */
  onOpenChange?: (isOpen: boolean) => void;
};

export interface UseCollapsibleOptions {
  /**
   * 접기 동작 설정.
   * - `true`: 활성화 (기본 열림, 비제어)
   * - `CollapsibleConfig`: 세부 설정 (제어/비제어)
   * - `false`/`undefined`: 비활성화 (항상 열림)
   */
  isCollapsible?: boolean | CollapsibleConfig;
  /** CollapsibleGroup 안에서의 식별 값 — 있으면 그룹이 상태 제어 */
  value?: string;
}

export interface UseCollapsibleReturn {
  /** 접기 동작 활성 여부 */
  isEnabled: boolean;
  /** 현재 열림 상태 */
  isOpen: boolean;
  /** 열림/닫힘 토글 */
  toggle: () => void;
}

/**
 * 접기/펼치기 상태 관리 훅. Collapsible 컴포넌트의 코어 로직이며,
 * 자체 UI를 만들 때(커스텀 트리거, 사이드바 섹션 등) 직접 사용한다.
 *
 * 우선순위: CollapsibleGroup(value 제공 시) > 제어(isOpen) > 비제어(defaultIsOpen)
 * 스펙: root/components/web/ui/collapsible.md
 *
 * @example
 * const { isOpen, toggle } = useCollapsible({ isCollapsible: true });
 * <button aria-expanded={isOpen} onClick={toggle}>섹션</button>
 * {isOpen && <div>내용</div>}
 */
export function useCollapsible(
  options: UseCollapsibleOptions
): UseCollapsibleReturn {
  const { isCollapsible, value } = options;

  const group = React.useContext(CollapsibleGroupContext);
  const isControlledByGroup = group != null && value != null;

  // true → 빈 설정, 객체 → 그대로, false/undefined → 비활성
  const config: CollapsibleConfig | null =
    isCollapsible === true ? {} : isCollapsible ? isCollapsible : null;
  const isEnabled = config != null || isControlledByGroup;

  // 비제어 내부 상태
  const [internalOpen, setInternalOpen] = React.useState(
    config?.defaultIsOpen ?? true
  );

  const isOpen = !isEnabled
    ? true
    : isControlledByGroup
      ? group.openValues.has(value)
      : (config?.isOpen ?? internalOpen);

  const toggle = React.useCallback(() => {
    if (!isEnabled) return;
    if (isControlledByGroup) {
      group.toggle(value);
      return;
    }
    const next = !isOpen;
    if (config?.isOpen == null) setInternalOpen(next);
    config?.onOpenChange?.(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEnabled, isControlledByGroup, group, value, isOpen, config?.isOpen, config?.onOpenChange]);

  return { isEnabled, isOpen, toggle };
}

export default useCollapsible;
