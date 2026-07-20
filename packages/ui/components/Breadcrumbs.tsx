"use client";

import * as React from "react";

export type BreadcrumbsVariant = "default" | "supporting";

interface BreadcrumbContextValue {
  variant: BreadcrumbsVariant;
  separator: React.ReactNode;
}

const BreadcrumbContext = React.createContext<BreadcrumbContextValue>({
  variant: "default",
  separator: "/",
});

function cn(...values: Array<string | undefined | null | false>) {
  return values.filter(Boolean).join(" ");
}

/* ── Breadcrumbs (컨테이너) ─────────────────────────────── */

export interface BreadcrumbsProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "children"> {
  /** BreadcrumbItem 목록 */
  children: React.ReactNode;
  /** 항목 사이 구분자 (장식용, aria-hidden) @default '/' */
  separator?: React.ReactNode;
  /** 트레일 전체 스타일 @default 'default' */
  variant?: BreadcrumbsVariant;
  /** nav 랜드마크 접근성 라벨 @default 'Breadcrumb' */
  label?: string;
}

/**
 * 현재 페이지의 계층 위치를 보여주는 보조 내비게이션 트레일.
 * 어떤 항목에도 isCurrent가 없으면 마지막 항목을 현재 페이지로 자동 처리.
 * 스펙: root/components/web/ui/breadcrumbs.md
 *
 * @example
 * <Breadcrumbs>
 *   <BreadcrumbItem href="/">Home</BreadcrumbItem>
 *   <BreadcrumbItem href="/projects">Projects</BreadcrumbItem>
 *   <BreadcrumbItem isCurrent>My Project</BreadcrumbItem>
 * </Breadcrumbs>
 */
export function Breadcrumbs({
  children,
  separator = "/",
  variant = "default",
  label = "Breadcrumb",
  className,
  ...rest
}: BreadcrumbsProps) {
  const ctxValue = React.useMemo(
    () => ({ variant, separator }),
    [variant, separator]
  );

  const items = React.Children.toArray(children).filter(
    React.isValidElement
  ) as React.ReactElement<BreadcrumbItemProps & InternalItemProps>[];

  const hasExplicitCurrent = items.some(
    (item) => item.props.isCurrent === true
  );

  return (
    <BreadcrumbContext.Provider value={ctxValue}>
      <nav aria-label={label} className={cn("block", className)} {...rest}>
        <ol className="flex flex-wrap items-center gap-2xs list-none m-0 p-0">
          {items.map((item, index) =>
            React.cloneElement(item, {
              key: item.key ?? index,
              __isFirst: index === 0,
              /* 마지막 항목 auto-current (명시된 isCurrent가 없을 때만) */
              isCurrent:
                item.props.isCurrent ??
                (!hasExplicitCurrent && index === items.length - 1),
            })
          )}
        </ol>
      </nav>
    </BreadcrumbContext.Provider>
  );
}

/* ── BreadcrumbItem (개별 항목) ─────────────────────────── */

interface InternalItemProps {
  /** @internal Breadcrumbs가 주입 — 첫 항목은 separator 숨김 */
  __isFirst?: boolean;
}

export interface BreadcrumbItemProps
  extends Omit<React.LiHTMLAttributes<HTMLLIElement>, "onClick"> {
  /** 항목 라벨 */
  children: React.ReactNode;
  /** 링크 URL — 현재 페이지면 생략 */
  href?: string;
  /** 클릭 핸들러 (href 유무 무관) */
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  /** 현재 페이지 표시 — span + aria-current 렌더 @default false */
  isCurrent?: boolean;
  /** 라벨 앞 아이콘 */
  startIcon?: React.ReactNode;
  /** 링크 렌더 컴포넌트 교체 (라우터 Link 등) @default 'a' */
  as?: React.ElementType;
}

export function BreadcrumbItem({
  children,
  href,
  onClick,
  isCurrent = false,
  startIcon,
  as: LinkComponent = "a",
  className,
  ...rest
}: BreadcrumbItemProps & InternalItemProps) {
  const { variant, separator } = React.useContext(BreadcrumbContext);
  const { __isFirst, ...liProps } = rest as InternalItemProps &
    React.LiHTMLAttributes<HTMLLIElement>;

  const isSupporting = variant === "supporting";
  const sizeClass = isSupporting ? "text-caption-m" : "text-body-s";
  const linkColorClass = "text-[var(--color-text-basic-secondary)]";
  const currentColorClass = isSupporting
    ? "text-[var(--color-text-basic-secondary)]"
    : "text-[var(--color-text-basic-primary)]";

  const content = (
    <>
      {startIcon && (
        <span className="flex items-center shrink-0">{startIcon}</span>
      )}
      {children}
    </>
  );

  return (
    <li
      className={cn("flex items-center gap-2xs m-0", sizeClass, className)}
      {...liProps}
    >
      {/* leading separator — 첫 항목은 숨김 */}
      {!__isFirst && (
        <span
          aria-hidden="true"
          className="flex items-center py-2xs select-none text-[var(--color-text-basic-secondary)]"
        >
          {separator}
        </span>
      )}

      {isCurrent ? (
        <span
          aria-current="page"
          className={cn("flex items-center gap-2xs", currentColorClass)}
        >
          {content}
        </span>
      ) : href != null ? (
        <LinkComponent
          href={href}
          onClick={onClick}
          className={cn(
            "flex items-center gap-2xs py-2xs no-underline hover:underline cursor-pointer",
            linkColorClass
          )}
        >
          {content}
        </LinkComponent>
      ) : onClick != null ? (
        <button
          type="button"
          onClick={onClick}
          className={cn(
            "flex items-center gap-2xs py-2xs bg-transparent border-none p-0 m-0 font-[inherit]",
            "no-underline hover:underline cursor-pointer",
            linkColorClass
          )}
        >
          {content}
        </button>
      ) : (
        <span className={cn("flex items-center gap-2xs", linkColorClass)}>
          {content}
        </span>
      )}
    </li>
  );
}

export default Breadcrumbs;
