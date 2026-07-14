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
  /** 활성 바가 0% → 100% 채워지는 시간 (ms, 기본 4000) */
  duration?: number;
  className?: string;
  /** 개별 바(button) 에 추가할 클래스 (높이 등 재정의 시 사용) */
  barClassName?: string;
}

export function ProgressBar({
  count,
  activeIndex,
  onChange,
  getAriaLabel,
  duration = 4000,
  className = "",
  barClassName = "",
}: ProgressBarProps) {
  return (
    <div className={`relative z-10 flex items-start gap-2xs w-full self-stretch ${className}`}>
      <style>{`@keyframes fai-progress-fill { from { width: 0% } to { width: 100% } }`}</style>
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          className={`relative flex-1 h-2xs rounded-fai-s bg-quaternary overflow-hidden cursor-pointer ${barClassName}`}
          aria-label={getAriaLabel ? getAriaLabel(i) : `스텝 ${i + 1}로 이동`}
        >
          {i <= activeIndex && (
            <div
              key={i === activeIndex ? `fill-${activeIndex}` : `done-${i}`}
              className={`absolute inset-y-0 left-0 bg-icon-basic-inverse ${i < activeIndex ? "w-full" : ""}`}
              style={
                i === activeIndex
                  ? { animation: `fai-progress-fill ${duration}ms linear forwards` }
                  : undefined
              }
            />
          )}
        </button>
      ))}
    </div>
  );
}
