"use client";

import * as React from "react";
import {
  Info,
  CircleCheck,
  TriangleAlert,
  CircleAlert,
  ChevronDown,
  X,
} from "lucide-react";

export type BannerStatus = "info" | "success" | "warning" | "error";
export type BannerContainer = "card" | "section";

export interface BannerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** 아이콘·컬러 스킴 결정 (필수) */
  status: BannerStatus;
  /** 헤더 타이틀 (필수) */
  title: React.ReactNode;
  /** 타이틀 아래 보조 설명 */
  description?: React.ReactNode;
  /** 기본 status 아이콘 교체 */
  icon?: React.ReactNode;
  /** 닫기 버튼 노출 + 자체 숨김 처리 @default false */
  isDismissable?: boolean;
  /** 닫기 클릭 콜백 (없어도 배너는 스스로 숨김) */
  onDismiss?: () => void;
  /** 헤더 end 영역 액션 (ghost/secondary Button 권장) */
  endContent?: React.ReactNode;
  /** 카드형 / 전체 너비형 @default 'card' */
  container?: BannerContainer;
  /** 콘텐츠 영역 초기 펼침 여부 @default false */
  defaultIsExpanded?: boolean;
  /** 접이식 콘텐츠 영역 (리스트, 링크 등 리치 콘텐츠) */
  children?: React.ReactNode;
}

function cn(...values: Array<string | undefined | null | false>) {
  return values.filter(Boolean).join(" ");
}

/* status → 토큰/아이콘/role 매핑 (foundation 시맨틱 토큰만 사용) */
const STATUS_CONFIG: Record<
  BannerStatus,
  {
    bg: string;
    iconColor: string;
    role: "status" | "alert";
    DefaultIcon: React.ComponentType<{ size?: number; className?: string }>;
  }
> = {
  info: {
    bg: "bg-[var(--color-filled-basic-info-secondary)]",
    iconColor: "text-[var(--color-icon-basic-Info)]",
    role: "status",
    DefaultIcon: Info,
  },
  success: {
    bg: "bg-[var(--color-filled-basic-positive-secondary)]",
    iconColor: "text-[var(--color-icon-basic-positive)]",
    role: "status",
    DefaultIcon: CircleCheck,
  },
  warning: {
    bg: "bg-[var(--color-filled-basic-warning-secondary)]",
    iconColor: "text-[var(--color-icon-basic-warning)]",
    role: "alert",
    DefaultIcon: TriangleAlert,
  },
  error: {
    bg: "bg-[var(--color-filled-basic-negative-secondary)]",
    iconColor: "text-[var(--color-icon-basic-negative)]",
    role: "alert",
    DefaultIcon: CircleAlert,
  },
};

/** end 영역 공용 ghost 아이콘 버튼 */
function GhostIconButton({
  label,
  onClick,
  expanded,
  children,
}: {
  label: string;
  onClick: () => void;
  expanded?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-expanded={expanded}
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center p-2xs rounded-fai-xs",
        "text-[var(--color-icon-basic-secondary)]",
        "hover:bg-[var(--color-filled-basic-primaryOp-secondary)]",
        "transition-colors cursor-pointer bg-transparent border-none"
      )}
    >
      {children}
    </button>
  );
}

/**
 * 페이지/섹션 상단에 지속 노출되는 상태 알림 배너.
 * 2단 구성: Header(상태 컬러 배경) + Content(선택, 접이식).
 * 스펙: root/components/web/ui/banner.md
 *
 * @example
 * <Banner status="info" title="New update available" />
 * <Banner status="error" title="Something went wrong" description="Please try again." isDismissable />
 */
export function Banner({
  status,
  title,
  description,
  icon,
  isDismissable = false,
  onDismiss,
  endContent,
  container = "card",
  defaultIsExpanded = false,
  children,
  className,
  ...rest
}: BannerProps) {
  const [isDismissed, setIsDismissed] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(defaultIsExpanded);

  if (isDismissed) return null;

  const { bg, iconColor, role, DefaultIcon } = STATUS_CONFIG[status];
  const hasChildren = children != null;
  const hasActions = endContent != null || isDismissable;
  const showEndArea = hasActions || hasChildren;
  const isSingleLine = description == null && hasActions;
  const showContent = hasChildren && isExpanded;
  const isCard = container === "card";

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  return (
    <div role={role} className={cn("flex flex-col", className)} {...rest}>
      {/* Header — 상태 컬러 배경 */}
      <div
        className={cn(
          "flex gap-s py-ms px-m", // gap 8px / py 12px / px 16px
          isSingleLine ? "items-center" : "items-start",
          bg,
          isCard && (showContent ? "rounded-t-fai-s" : "rounded-fai-s")
        )}
      >
        <span
          aria-hidden="true"
          className={cn("flex items-center shrink-0", iconColor)}
        >
          {icon ?? <DefaultIcon size={20} />}
        </span>

        <div className="flex flex-1 min-w-0 flex-col">
          <div className="text-body-s font-semibold text-[var(--color-text-basic-primary)]">
            {title}
          </div>
          {description != null && (
            <div className="text-caption-m font-normal text-[var(--color-text-basic-secondary)]">
              {description}
            </div>
          )}
        </div>

        {showEndArea && (
          <div className="flex items-center gap-2xs shrink-0 ms-auto">
            {endContent}
            {hasChildren && (
              <GhostIconButton
                label={isExpanded ? "Collapse" : "Expand"}
                expanded={isExpanded}
                onClick={() => setIsExpanded((prev) => !prev)}
              >
                <ChevronDown
                  size={16}
                  className={cn(
                    "transition-transform duration-[var(--duration-instant,150ms)]",
                    isExpanded && "rotate-180"
                  )}
                />
              </GhostIconButton>
            )}
            {isDismissable && (
              <GhostIconButton label="Dismiss" onClick={handleDismiss}>
                <X size={16} />
              </GhostIconButton>
            )}
          </div>
        )}
      </div>

      {/* Content — 접이식 카드 배경 */}
      {showContent && (
        <div
          className={cn(
            "py-ms px-m",
            "bg-[var(--color-bg-100)]",
            "border-x border-b border-[var(--color-border-tertiary)]",
            isCard && "rounded-b-fai-s"
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export default Banner;
