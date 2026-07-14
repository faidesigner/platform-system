"use client";

import * as React from "react";

export type FileInputMode = "dropzone" | "input";

export interface FileInputProps {
  /** 라벨 (필수 — 접근성) */
  label: string;
  labelHidden?: boolean;
  /** 보조 설명 (허용 형식/용량 안내 권장) */
  description?: string;
  /** 필수 표시 (빨간 *) @default false */
  required?: boolean;
  disabled?: boolean;
  /** 외부 검증 에러 */
  error?: boolean;
  errorMessage?: string;
  /** 선택 파일 (제어형) — multiple이면 File[] */
  value: File | File[] | null;
  onChange: (files: File | File[] | null) => void;
  /** input accept 속성 (".pdf,image/*" 등) */
  accept?: string;
  /** 복수 선택 @default false */
  multiple?: boolean;
  /** 파일당 최대 크기(byte) — 초과 시 내부 에러 표시 */
  maxSize?: number;
  /** 최대 파일 수 (multiple 전용) */
  maxFiles?: number;
  /** 드롭존 안내 문구 @default '파일을 끌어다 놓거나 클릭해서 선택' */
  placeholder?: string;
  /** dropzone(기본) / input(한 줄 박스형) */
  mode?: FileInputMode;
  className?: string;
}

function cn(...values: Array<string | undefined | null | false>) {
  return values.filter(Boolean).join(" ");
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

const UploadIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" />
  </svg>
);

/**
 * 파일 업로드 입력. dropzone(드래그&드롭 + 클릭, 기본) / input(한 줄) 두 모드.
 * 박스형 폼 트리거 규칙(date-input.md ✱)을 따르며, 드롭존은 dashed 보더 신규 패턴.
 * maxSize/maxFiles 초과는 내부에서 걸러 에러 메시지로 표시한다.
 * 스펙: root/components/web/ui/file-input.md
 *
 * @example
 * <FileInput label="첨부 파일" accept=".pdf,image/*" maxSize={10 * 1024 * 1024}
 *   value={files} onChange={setFiles} multiple />
 */
export function FileInput({
  label,
  labelHidden = false,
  description,
  required = false,
  disabled = false,
  error = false,
  errorMessage,
  value,
  onChange,
  accept,
  multiple = false,
  maxSize,
  maxFiles,
  placeholder = "파일을 끌어다 놓거나 클릭해서 선택",
  mode = "dropzone",
  className,
}: FileInputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [internalError, setInternalError] = React.useState<string | null>(null);

  const files: File[] = value == null ? [] : Array.isArray(value) ? value : [value];
  const hasError = error || internalError != null;
  const shownError = errorMessage ?? internalError;

  const commit = (list: File[]) => {
    setInternalError(null);
    if (maxSize != null) {
      const over = list.find((f) => f.size > maxSize);
      if (over) {
        setInternalError(`'${over.name}'이(가) 최대 크기(${formatSize(maxSize)})를 초과했습니다.`);
        return;
      }
    }
    const merged = multiple ? [...files, ...list] : list.slice(0, 1);
    if (multiple && maxFiles != null && merged.length > maxFiles) {
      setInternalError(`최대 ${maxFiles}개까지 첨부할 수 있습니다.`);
      return;
    }
    onChange(multiple ? merged : (merged[0] ?? null));
  };

  const removeAt = (index: number) => {
    setInternalError(null);
    const next = files.filter((_, i) => i !== index);
    onChange(multiple ? next : null);
  };

  const openPicker = () => {
    if (!disabled) inputRef.current?.click();
  };

  const dropHandlers = disabled
    ? {}
    : {
        onDragOver: (e: React.DragEvent) => {
          e.preventDefault();
          setIsDragOver(true);
        },
        onDragLeave: () => setIsDragOver(false),
        onDrop: (e: React.DragEvent) => {
          e.preventDefault();
          setIsDragOver(false);
          commit(Array.from(e.dataTransfer.files));
        },
      };

  return (
    <div className={cn("inline-flex flex-col min-w-[280px]", className)}>
      {/* 라벨 — 폼 공통 규칙 (required 빨간 *) */}
      <span
        className={cn(
          "text-body-s font-medium text-[var(--color-text-basic-primary)] pb-2xs",
          labelHidden && "sr-only"
        )}
      >
        {label}
        {required && (
          <span aria-hidden="true" className="text-[var(--color-text-basic-negative)]">
            {" *"}
          </span>
        )}
      </span>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        aria-label={label}
        className="sr-only"
        onChange={(e) => {
          commit(Array.from(e.target.files ?? []));
          e.target.value = ""; // 같은 파일 재선택 허용
        }}
      />

      {/* 트리거 — dropzone: dashed 신규 패턴 / input: 박스형 규칙 */}
      <button
        type="button"
        disabled={disabled}
        onClick={openPicker}
        {...dropHandlers}
        className={cn(
          "flex items-center justify-center gap-s text-body-s transition-colors",
          "rounded-fai-s bg-[var(--color-bg-100)] cursor-pointer",
          mode === "dropzone"
            ? "flex-col border-2 border-dashed py-xl px-m" // 2px — 1px dashed의 코너 렌더 이슈 회피 (디자이너 확정)
            : "h-3xl px-ms border",
          disabled
            ? "bg-fill-disabled text-[var(--color-text-basic-disabled)] border-border-disabled cursor-not-allowed"
            : hasError
              ? "border-[var(--color-border-negative)]"
              : isDragOver
                ? "border-border-brand bg-fill-faint"
                : mode === "dropzone"
                  ? // 중간톤 토큰 border-fourth — dashed 용도 (디자이너 확정 2026-07-14)
                    "border-[var(--color-border-fourth)] hover:bg-fill-faint"
                  : "border-border-secondary hover:border-border-primary"
        )}
      >
        <span
          className={cn(
            "shrink-0",
            disabled
              ? "text-[var(--color-icon-basic-disabled)]"
              : "text-[var(--color-icon-basic-secondary)]"
          )}
        >
          {UploadIcon}
        </span>
        <span className="text-[var(--color-text-basic-tertiary)]">
          {placeholder}
        </span>
      </button>

      {/* 파일 목록 */}
      {files.length > 0 && (
        <ul className="list-none m-0 p-0 pt-2xs flex flex-col gap-2xs">
          {files.map((file, i) => (
            <li
              key={`${file.name}-${i}`}
              className="flex items-center gap-s px-ms py-2xs rounded-fai-s bg-fill-faint text-body-s"
            >
              <span className="flex-1 min-w-0 truncate text-[var(--color-text-basic-primary)]">
                {file.name}
              </span>
              <span className="shrink-0 text-caption-m text-[var(--color-text-basic-tertiary)]">
                {formatSize(file.size)}
              </span>
              {!disabled && (
                <button
                  type="button"
                  aria-label={`${file.name} 제거`}
                  onClick={() => removeAt(i)}
                  className="inline-flex shrink-0 items-center justify-center w-l h-l rounded-fai-circle bg-transparent border-none cursor-pointer text-[var(--color-icon-basic-tertiary)] hover:bg-[var(--color-filled-basic-primaryOp-secondary)]"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* 설명 / 에러 */}
      {hasError && shownError != null ? (
        <span role="alert" className="pt-2xs text-caption-m text-[var(--color-text-basic-negative)]">
          {shownError}
        </span>
      ) : description != null ? (
        <span className="pt-2xs text-caption-m text-[var(--color-text-basic-tertiary)]">
          {description}
        </span>
      ) : null}
    </div>
  );
}

export default FileInput;
