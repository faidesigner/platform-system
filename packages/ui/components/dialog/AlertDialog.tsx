"use client";

import * as React from "react";
import { Dialog } from "./Dialog";
import { Button } from "../button/Button";

export type AlertDialogActionTone = "negative" | "primary";

export interface AlertDialogProps {
  /** 열림 상태 (제어형, 필수) */
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  /** 제목 (필수) */
  title: string;
  /** 설명 (필수 — 무엇이 일어나는지 명시) */
  description: string;
  /** 취소 버튼 라벨 @default '취소' */
  cancelLabel?: string;
  /** 확인(액션) 버튼 라벨 (필수) — "삭제하기"처럼 동작을 명시 */
  actionLabel: string;
  /**
   * 액션 버튼 톤 — 파괴적 액션은 negative(기본)
   * ⚠️ negative는 Button 시스템 톤이 아닌 AlertDialog 전용 오버라이드 (규칙 미확정)
   * @default 'negative'
   */
  actionTone?: AlertDialogActionTone;
  /** 액션 진행 중 로딩 @default false */
  isActionLoading?: boolean;
  /** 액션 실행 콜백 — 완료 후 onOpenChange(false)는 호출자 책임 */
  onAction: () => void;
}

/**
 * 파괴적·비가역 액션 확인 다이얼로그.
 * 스크림 클릭·Escape로 닫히지 않음 — 명시적 선택 강제 (overlay-rules.md).
 * 초기 포커스는 취소 버튼(덜 위험한 쪽)에.
 * 명령형 사용은 useImperativeAlertDialog 훅.
 * 스펙: root/components/web/ui/dialog.md
 *
 * @example
 * <AlertDialog isOpen={open} onOpenChange={setOpen}
 *   title="대화를 삭제할까요?" description="삭제하면 되돌릴 수 없습니다."
 *   actionLabel="삭제하기" onAction={handleDelete} />
 */
export function AlertDialog({
  isOpen,
  onOpenChange,
  title,
  description,
  cancelLabel = "취소",
  actionLabel,
  actionTone = "negative",
  isActionLoading = false,
  onAction,
}: AlertDialogProps) {
  return (
    <Dialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="s"
      role="alertdialog"
      dismissable={false}
      label={title}
    >
      <h2 className="m-0 text-body font-semibold text-[var(--color-text-basic-primary)]">
        {title}
      </h2>
      <p className="mt-2xs mb-0 text-body-s text-[var(--color-text-basic-secondary)]">
        {description}
      </p>
      <div className="flex justify-end gap-s pt-xl">
        {/* 초기 포커스: 취소 (Dialog가 첫 포커스 가능 요소로 이동) */}
        <Button
          tone="secondary"
          disabled={isActionLoading}
          onClick={() => onOpenChange(false)}
        >
          {cancelLabel}
        </Button>
        <Button
          tone="primary"
          loading={isActionLoading}
          onClick={onAction}
          className={
            actionTone === "negative"
              ? "!bg-[var(--color-filled-basic-negative)] !text-[var(--color-text-basic-inverse)] !border-transparent"
              : undefined
          }
        >
          {actionLabel}
        </Button>
      </div>
    </Dialog>
  );
}

export default AlertDialog;
