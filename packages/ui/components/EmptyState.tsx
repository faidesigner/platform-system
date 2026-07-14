"use client";

import * as React from "react";

export interface EmptyStateProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** 상태 제목 (필수) — 무엇이 비어 있는지 */
  title: string;
  /** 이유·다음 행동 안내 */
  description?: string;
  /** 상단 아이콘/일러스트 */
  icon?: React.ReactNode;
  /** 액션 버튼(들) — Button 권장 */
  actions?: React.ReactNode;
  /** 제목 헤딩 레벨 @default 3 */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  /** 좁은 영역용 축소 레이아웃 @default false */
  compact?: boolean;
}

function cn(...values: Array<string | undefined | null | false>) {
  return values.filter(Boolean).join(" ");
}

/**
 * 데이터가 없거나 검색 결과가 비었을 때의 안내 상태.
 * 제목은 상황을, 설명은 이유·다음 행동을 알려주고 actions로 해결 동선을 제공.
 * 스펙: root/components/web/ui/empty-state.md
 *
 * @example
 * <EmptyState
 *   icon={<InboxIcon />}
 *   title="아직 프로젝트가 없어요"
 *   description="첫 프로젝트를 만들어 시작해 보세요."
 *   actions={<Button tone="primary">프로젝트 만들기</Button>}
 * />
 */
export function EmptyState({
  title,
  description,
  icon,
  actions,
  headingLevel = 3,
  compact = false,
  className,
  ...rest
}: EmptyStateProps) {
  const Heading = `h${headingLevel}` as const;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        compact ? "gap-2xs py-xl px-m" : "gap-s py-4xl px-xl",
        className
      )}
      {...rest}
    >
      {icon != null && (
        <span
          aria-hidden="true"
          className={cn(
            "inline-flex items-center justify-center rounded-fai-circle",
            "bg-fill-faint text-[var(--color-icon-basic-tertiary)]",
            compact ? "w-3xl h-3xl" : "w-4xl h-4xl"
          )}
        >
          {icon}
        </span>
      )}
      <Heading
        className={cn(
          "m-0 font-semibold text-[var(--color-text-basic-primary)]",
          compact ? "text-body-s" : "text-body"
        )}
      >
        {title}
      </Heading>
      {description != null && (
        <p
          className={cn(
            "m-0 max-w-[400px] text-[var(--color-text-basic-secondary)]",
            compact ? "text-caption-m" : "text-body-s"
          )}
        >
          {description}
        </p>
      )}
      {actions != null && (
        <div className={cn("flex items-center gap-s", compact ? "pt-2xs" : "pt-s")}>
          {actions}
        </div>
      )}
    </div>
  );
}

export default EmptyState;
