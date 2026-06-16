"use client";

export interface ProgressBarProps {
  /** 전체 스텝 수 */
  count: number;
  /** 현재 활성 인덱스 (0-based) */
  activeIndex: number;
  /** 스텝 클릭 시 호출 — 클릭된 인덱스 전달 */
  onChange: (index: number) => void;
  /** 각 버튼의 aria-label 생성 함수 (기본: `스텝 ${i + 1}로 이동`) */
  getAriaLabel?: (index: number) => string;
  className?: string;
}

export function ProgressBar({
  count,
  activeIndex,
  onChange,
  getAriaLabel,
  className = "",
}: ProgressBarProps) {
  return (
    <div className={`relative z-10 flex items-start gap-2xs w-full self-stretch ${className}`}>
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          className="relative flex-1 h-2xs rounded-fai-s bg-quaternary overflow-hidden cursor-pointer"
          aria-label={getAriaLabel ? getAriaLabel(i) : `스텝 ${i + 1}로 이동`}
        >
          <div
            className={`absolute inset-y-0 left-0 bg-icon-basic-inverse transition-all duration-300 ease-in-out ${i <= activeIndex ? "w-full" : "w-0"}`}
          />
        </button>
      ))}
    </div>
  );
}
