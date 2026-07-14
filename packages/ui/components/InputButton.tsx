"use client";

import * as React from "react";

export type InputButtonSize = "large" | "medium";

export interface InputButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value" | "prefix"> {
  /**
   * 접근성 라벨. Field 계열 래퍼와 함께 쓸 때는 래퍼의 label이 htmlFor로
   * 연결되므로 생략 가능 — 단독 사용 시 필수.
   */
  label?: string;
  /** 선택된 값 (텍스트 또는 Chip 등) — 없으면 placeholder 표시 */
  value?: React.ReactNode;
  /** @default '선택' */
  placeholder?: string;
  /**
   * 크기 — medium(40px)은 데스크톱 기본, large(52px)는 터치/모바일.
   * @default 'medium'
   */
  size?: InputButtonSize;
  /** 값 앞 슬롯 (아이콘/텍스트) */
  prefix?: React.ReactNode;
  /** 값 뒤 슬롯 (아이콘/텍스트) — 셰브론 등 */
  suffix?: React.ReactNode;
  /** 값이 있을 때 클리어 버튼 표시 @default false */
  hasClear?: boolean;
  onClear?: () => void;
  /** 에러 상태 — 2px negative 스트로크 */
  error?: boolean;
  /** 읽기 전용 — disabled 배경 + 일반 텍스트, 클릭 불가 */
  readOnly?: boolean;
}

function cn(...values: Array<string | undefined | null | false>) {
  return values.filter(Boolean).join(" ");
}

/* Seed input-button 스펙의 구조/치수를 foundation 근사 토큰으로 매핑 */
const SIZE_CLASSES: Record<InputButtonSize, { root: string; clear: string }> = {
  large: {
    // Seed: h 52 / gap 10 / radius 12 / px 16 / font 16
    root: "h-[var(--size-52,3.25rem)] gap-s rounded-fai-ms px-m text-body",
    clear: "w-[22px] h-[22px]",
  },
  medium: {
    // Seed: h 40 / gap 8 / radius 8 / px 14→12 / font 14
    root: "h-3xl gap-s rounded-fai-s px-ms text-body-s",
    clear: "w-[18px] h-[18px]",
  },
};

/**
 * 입력 필드 형태의 버튼 — 직접 타이핑하지 않고 피커/선택창을 여는 트리거.
 * 선택이 완료되면 value가 라벨 자리에 표시된다.
 * 반드시 선택 UI(Dialog, DropdownMenu, Calendar 팝오버 등)와 함께 사용.
 *
 * 라벨/설명 셸은 포함하지 않음 — Field 계열 래퍼 또는 상위 폼이 담당
 * (기존 DateInput류의 내장 라벨 방식과 다른 신규 패턴 ✱).
 * 스펙: root/components/web/ui/input-button.md
 *
 * @example
 * <InputButton label="지역 선택" value={region} placeholder="지역 선택"
 *   hasClear onClear={() => setRegion(null)} onClick={openRegionSheet} />
 */
export function InputButton({
  label,
  value,
  placeholder = "선택",
  size = "medium",
  prefix,
  suffix,
  hasClear = false,
  onClear,
  error = false,
  readOnly = false,
  disabled,
  className,
  onClick,
  ...rest
}: InputButtonProps) {
  const hasValue = value != null && value !== "";
  const interactive = !disabled && !readOnly;
  const sizeCls = SIZE_CLASSES[size];

  return (
    <button
      type="button"
      aria-label={label}
      aria-haspopup="dialog"
      disabled={disabled}
      aria-readonly={readOnly || undefined}
      onClick={interactive ? onClick : undefined}
      className={cn(
        "inline-flex items-center text-left min-w-[160px]",
        sizeCls.root,
        "border transition-colors duration-[var(--duration-instant,150ms)]",
        /* 상태 — 기존 박스형 폼 트리거 규칙 + Seed 상태 모델 */
        disabled
          ? "bg-fill-disabled text-[var(--color-text-basic-disabled)] border-border-disabled cursor-not-allowed"
          : readOnly
            ? "bg-fill-disabled text-[var(--color-text-basic-primary)] border-border-disabled cursor-default"
            : error
              ? // Seed: 에러는 2px 스트로크 — 레이아웃 밀림 방지를 위해 1px border + 1px inset shadow
                "bg-[var(--color-bg-100)] border-[var(--color-border-negative)] shadow-[inset_0_0_0_1px_var(--color-border-negative)] cursor-pointer"
              : cn(
                  "bg-[var(--color-bg-100)] border-border-secondary cursor-pointer",
                  "hover:border-border-primary",
                  // pressed — interaction.light.black 오버레이 (기존 인터랙션 규칙)
                  "active:[background-image:linear-gradient(0deg,var(--color-interaction-light-black-pressed),var(--color-interaction-light-black-pressed))]"
                ),
        className
      )}
      {...rest}
    >
      {prefix != null && (
        <span
          className={cn(
            "flex shrink-0 items-center",
            disabled
              ? "text-[var(--color-icon-basic-disabled)]"
              : "text-[var(--color-icon-basic-secondary)]"
          )}
        >
          {prefix}
        </span>
      )}

      <span
        className={cn(
          "flex-1 min-w-0 truncate",
          !hasValue && !disabled && "text-[var(--color-text-basic-tertiary)]"
        )}
      >
        {hasValue ? value : placeholder}
      </span>

      {hasClear && hasValue && interactive && (
        <span
          role="button"
          aria-label="지우기"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            onClear?.();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              e.stopPropagation();
              onClear?.();
            }
          }}
          className={cn(
            "inline-flex shrink-0 items-center justify-center rounded-fai-circle",
            sizeCls.clear,
            "text-[var(--color-icon-basic-tertiary)] hover:bg-fill-faint"
          )}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </span>
      )}

      {suffix != null && (
        <span
          className={cn(
            "flex shrink-0 items-center",
            disabled
              ? "text-[var(--color-icon-basic-disabled)]"
              : "text-[var(--color-icon-basic-secondary)]"
          )}
        >
          {suffix}
        </span>
      )}
    </button>
  );
}

export default InputButton;
