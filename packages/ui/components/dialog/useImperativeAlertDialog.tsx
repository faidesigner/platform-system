"use client";

import * as React from "react";
import {
  AlertDialog,
  type AlertDialogActionTone,
} from "./AlertDialog";

export interface ImperativeAlertOptions {
  title: string;
  description: string;
  actionLabel: string;
  cancelLabel?: string;
  actionTone?: AlertDialogActionTone;
}

export interface UseImperativeAlertDialogReturn {
  /** 확인 다이얼로그 열기 — 사용자가 액션을 선택하면 true, 취소하면 false */
  confirm: (options: ImperativeAlertOptions) => Promise<boolean>;
  /** 트리에 렌더할 엘리먼트 — 컴포넌트 JSX에 포함시킬 것 */
  element: React.ReactNode;
}

/**
 * 명령형 확인 다이얼로그 훅 — Promise 기반이라 흐름 제어가 간단하다.
 * 스펙: root/components/web/ui/dialog.md
 *
 * @example
 * const { confirm, element } = useImperativeAlertDialog();
 * const handleDelete = async () => {
 *   if (await confirm({ title: '삭제할까요?', description: '되돌릴 수 없습니다.', actionLabel: '삭제하기' })) {
 *     await deleteItem();
 *   }
 * };
 * {element}
 */
export function useImperativeAlertDialog(): UseImperativeAlertDialogReturn {
  const [state, setState] = React.useState<{
    options: ImperativeAlertOptions;
    resolve: (result: boolean) => void;
  } | null>(null);

  const confirm = React.useCallback(
    (options: ImperativeAlertOptions) =>
      new Promise<boolean>((resolve) => setState({ options, resolve })),
    []
  );

  const settle = (result: boolean) => {
    state?.resolve(result);
    setState(null);
  };

  const element =
    state != null ? (
      <AlertDialog
        isOpen
        onOpenChange={(open) => {
          if (!open) settle(false);
        }}
        title={state.options.title}
        description={state.options.description}
        actionLabel={state.options.actionLabel}
        cancelLabel={state.options.cancelLabel}
        actionTone={state.options.actionTone}
        onAction={() => settle(true)}
      />
    ) : null;

  return { confirm, element };
}

export default useImperativeAlertDialog;
