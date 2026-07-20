"use client";

import * as React from "react";

/* ── Context — 자식 input이 id/상태를 이어받음.
   Field는 라벨/설명/에러 "텍스트 셸"만 소유하고,
   박스 모양(보더·높이·radius)은 자식 input 컴포넌트가 소유한다. ── */

export interface FieldContextValue {
  /** 자식 컨트롤이 사용할 id (라벨 htmlFor와 연결) */
  inputId: string;
  /** 설명/에러 요소 id — aria-describedby용 */
  describedById?: string;
  /** 상태 전파 — 자식이 스스로 자기 에러 스타일을 그린다 */
  error: boolean;
  disabled: boolean;
  required: boolean;
}

export const FieldContext = React.createContext<FieldContextValue | null>(null);

/** 자식 input에서 Field 컨텍스트를 읽는 훅 (없으면 null — 단독 사용) */
export function useField(): FieldContextValue | null {
  return React.useContext(FieldContext);
}

export interface FieldProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** 라벨 (필수) */
  label: string;
  /** 라벨 시각 숨김 (스크린리더 유지) @default false */
  labelHidden?: boolean;
  /** 라벨 아래(또는 input 아래) 보조 설명 */
  description?: string;
  /** 필수 표시 — 빨간 * (폼 공통 규칙) @default false */
  required?: boolean;
  /** 에러 상태 — 자식 input에 컨텍스트로 전파 @default false */
  error?: boolean;
  /** 에러 메시지 — error일 때 description 대신 표시 */
  errorMessage?: string;
  /** 자식 전체 비활성 @default false */
  disabled?: boolean;
  /** InputButton 등 셸 없는 input 컴포넌트 */
  children: React.ReactNode;
}

function cn(...values: Array<string | undefined | null | false>) {
  return values.filter(Boolean).join(" ");
}

/**
 * 폼 필드 셸 — 라벨 + 설명/에러 텍스트를 소유하고,
 * 자식 input(InputButton 등)에 id·error·disabled를 컨텍스트로 전파한다.
 *
 * 시각 소유권 분리 (디자이너 확정 2026-07-14):
 * - Field: 라벨·설명·에러 텍스트만
 * - 자식 input: 박스 모양 전부 (input-button.md 참조) — Field에서 수정 불가
 * 스펙: root/components/web/ui/field.md
 *
 * @example
 * <Field label="지역" required error={!region && touched} errorMessage="지역을 선택하세요">
 *   <InputButton value={region} placeholder="지역 선택" onClick={openSheet} />
 * </Field>
 */
export function Field({
  label,
  labelHidden = false,
  description,
  required = false,
  error = false,
  errorMessage,
  disabled = false,
  children,
  className,
  ...rest
}: FieldProps) {
  const inputId = React.useId();
  const describedById = React.useId();
  const hasHelpText = (error && errorMessage != null) || description != null;

  const ctx = React.useMemo<FieldContextValue>(
    () => ({
      inputId,
      describedById: hasHelpText ? describedById : undefined,
      error,
      disabled,
      required,
    }),
    [inputId, describedById, hasHelpText, error, disabled, required]
  );

  return (
    <FieldContext.Provider value={ctx}>
      <div className={cn("inline-flex flex-col", className)} {...rest}>
        {/* 라벨 — 폼 공통 규칙 (w/text/S medium + required 빨간 *) */}
        <label
          htmlFor={inputId}
          className={cn(
            "text-body-s font-medium pb-2xs",
            disabled
              ? "text-[var(--color-text-basic-disabled)]"
              : "text-[var(--color-text-basic-primary)]",
            labelHidden && "sr-only"
          )}
        >
          {label}
          {required && (
            <span aria-hidden="true" className="text-[var(--color-text-basic-negative)]">
              {" *"}
            </span>
          )}
        </label>

        {children}

        {/* 설명 / 에러 — 에러가 우선 */}
        {error && errorMessage != null ? (
          <span
            id={describedById}
            role="alert"
            className="pt-2xs text-caption-m text-[var(--color-text-basic-negative)]"
          >
            {errorMessage}
          </span>
        ) : description != null ? (
          <span
            id={describedById}
            className={cn(
              "pt-2xs text-caption-m",
              disabled
                ? "text-[var(--color-text-basic-disabled)]"
                : "text-[var(--color-text-basic-tertiary)]"
            )}
          >
            {description}
          </span>
        ) : null}
      </div>
    </FieldContext.Provider>
  );
}

export default Field;
