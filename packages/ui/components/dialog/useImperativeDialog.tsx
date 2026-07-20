"use client";

import * as React from "react";
import { Dialog, type DialogSize } from "./Dialog";

export interface ImperativeDialogOptions {
  /** 다이얼로그 내용 (DialogHeader 포함 가능) */
  content: React.ReactNode;
  size?: DialogSize;
  dismissable?: boolean;
  label?: string;
}

export interface UseImperativeDialogReturn {
  /** 다이얼로그 열기 */
  show: (options: ImperativeDialogOptions) => void;
  /** 다이얼로그 닫기 */
  hide: () => void;
  /** 현재 열림 상태 */
  isOpen: boolean;
  /** 트리에 렌더할 다이얼로그 엘리먼트 — 컴포넌트 JSX에 포함시킬 것 */
  element: React.ReactNode;
}

/**
 * 명령형 다이얼로그 훅 — isOpen 상태 관리 없이 show()/hide()로 제어.
 * 반환된 element를 JSX에 렌더해야 동작한다.
 * 스펙: root/components/web/ui/dialog.md
 *
 * @example
 * const { show, hide, element } = useImperativeDialog();
 * <Button onClick={() => show({ content: <Settings onDone={hide} /> })}>설정</Button>
 * {element}
 */
export function useImperativeDialog(): UseImperativeDialogReturn {
  const [options, setOptions] = React.useState<ImperativeDialogOptions | null>(
    null
  );

  const show = React.useCallback(
    (next: ImperativeDialogOptions) => setOptions(next),
    []
  );
  const hide = React.useCallback(() => setOptions(null), []);

  const element =
    options != null ? (
      <Dialog
        isOpen
        onOpenChange={(open) => {
          if (!open) hide();
        }}
        size={options.size}
        dismissable={options.dismissable}
        label={options.label}
      >
        {options.content}
      </Dialog>
    ) : null;

  return { show, hide, isOpen: options != null, element };
}

export default useImperativeDialog;
