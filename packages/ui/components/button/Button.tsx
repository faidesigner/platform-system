"use client";

import * as React from "react";

type ButtonSize = "xl" | "l" | "m" | "s";
type ButtonTone =
  | "primary"
  | "secondary"
  | "tertiary"
  | "assistive"
  | "brandAssistive"
  | "warning";
type ButtonShape = "square" | "round";

export type ButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  never
> & {
  tone?: ButtonTone;
  size?: ButtonSize;
  shape?: ButtonShape;
  /** Force "impact" visual (e.g. high-attention CTA) */
  impact?: boolean;
  /** Shows spinner + disables interactions */
  loading?: boolean;
  /** Optional leading icon */
  icon?: React.ReactNode;
  /**
   * 접근성 라벨. children이 없으면 보이는 텍스트로 렌더되고,
   * iconOnly일 때는 aria-label로만 사용된다.
   */
  label?: string;
  /**
   * 정사각 아이콘 전용 버튼. icon 필수, label이 aria-label로 사용됨.
   * endContent는 무시된다.
   * @default false
   */
  iconOnly?: boolean;
  /**
   * 라벨 뒤 트레일링 콘텐츠 (배지, 셰브론 등).
   * 버튼 텍스트 컬러를 상속하는 래퍼로 감싸진다.
   */
  endContent?: React.ReactNode;
  /**
   * 비동기 클릭 액션. pending 동안 자동으로 로딩 상태(스피너 + disabled)가 되고,
   * in-flight 중 재클릭은 무시된다(fire-once). 동기 클릭은 onClick 사용.
   */
  clickAction?: (
    e: React.MouseEvent<HTMLButtonElement>
  ) => void | Promise<void>;
  /** hover 툴팁 (title 속성으로 렌더) */
  tooltip?: string;
  /**
   * 제공 시 링크(<a> 또는 as 컴포넌트)로 렌더.
   * disabled/loading 상태에서는 접근성상 <button>으로 유지된다
   * (disabled 링크는 안티패턴).
   */
  href?: string;
  /** href 렌더에 사용할 링크 컴포넌트 (Next.js Link 등) @default 'a' */
  as?: React.ElementType;
  /** 링크 target — href 제공 시에만 적용 */
  target?: string;
  /** 링크 rel — href 제공 시에만 적용 */
  rel?: string;
};

function cn(...values: Array<string | undefined | null | false>) {
  return values.filter(Boolean).join(" ");
}

function getSizeClasses(size: ButtonSize, tone: ButtonTone) {
  switch (size) {
    case "xl":
      // default XL spec comes from icoTxt/square/tertiary
      // assistive XL spec differs in horizontal padding (20px)
      return cn(
        "py-m",
        tone === "assistive" || tone === "brandAssistive" ? "px-l" : "px-xl",
        "text-body"
      );
    case "l":
      return cn(
        "h-3xl",
        "px-l",
        "text-body-s"
      );
    case "m":
      return cn(
        "py-s",
        "px-m",
        "text-body-xs"
      );
    case "s":
      // 26px target: line-height(18px) + py(4px*2) = 26px
      return cn(
        "py-2xs",
        "px-ms",
        "text-caption-m"
      );
  }
}

function getToneClasses(tone: ButtonTone, impact: boolean) {
  if (impact) {
    return cn(
      "bg-brand text-on-brand border border-border-brand",
      "hover:bg-brand-subtle hover:text-brand-text hover:border-border-brand-sub",
      "active:bg-brand-subtle active:text-brand-text active:border-border-brand-sub"
    );
  }

  switch (tone) {
    case "primary":
      return cn(
        // outline 없음 — 치수 유지를 위해 transparent border 사용
        "bg-[var(--color-filled-optional-brand-primaryBtn)] text-inverse border border-transparent",
        "hover:bg-fill",
        "active:bg-fill-soft active:text-primary"
      );
    case "warning":
      // 파괴적/경고 액션 전용 톤 (디자이너 확정: 색상 negative/red 계열,
      // 오버레이 강도: hover/focus는 interaction.normal, pressed는 interaction.strong — light는 변화가 약해 상향)
      return cn(
        "bg-[var(--color-filled-basic-negative)] text-inverse border border-transparent",
        "hover:[background-image:linear-gradient(0deg,var(--color-interaction-normal-white-hover),var(--color-interaction-normal-white-hover))]",
        "focus-visible:[background-image:linear-gradient(0deg,var(--color-interaction-normal-white-focus),var(--color-interaction-normal-white-focus))]",
        "active:[background-image:linear-gradient(0deg,var(--color-interaction-strong-white-pressed),var(--color-interaction-strong-white-pressed))]"
      );
    case "secondary":
      return cn(
        "bg-surface text-primary border border-border-subtle",
        "hover:bg-fill-faint hover:border-border",
        "active:bg-surface-sunken active:border-border-subtle"
      );
    case "tertiary":
      return cn(
        "bg-surface text-secondary border border-border-faint",
        "hover:bg-surface-alt hover:text-primary hover:border-border-subtle",
        "active:bg-surface-sunken active:text-primary active:border-border-subtle",
        "focus-visible:border-border-brand"
      );
    case "assistive":
      return cn(
        "bg-fill-soft text-secondary border border-border-faint",
        "hover:bg-surface-alt hover:text-primary hover:border-border-subtle",
        "active:bg-surface-sunken active:text-primary active:border-border-subtle",
        "focus-visible:border-border"
      );
    case "brandAssistive":
      return cn(
        "bg-brand-subtle text-brand-text border border-border-brand-sub",
        "hover:bg-brand-subtle hover:border-border-brand",
        "active:bg-brand-subtle active:border-border-brand",
        "focus-visible:border-border-brand"
      );
  }
}

export function Button({
  tone = "primary",
  size = "m",
  shape = "square",
  impact = false,
  loading = false,
  icon,
  label,
  iconOnly = false,
  endContent,
  clickAction,
  tooltip,
  href,
  as: LinkComponent = "a",
  target,
  rel,
  className,
  children,
  type,
  onClick,
  ...props
}: ButtonProps) {
  const [isPending, setIsPending] = React.useState(false);
  const actionInFlightRef = React.useRef(false);
  const mountedRef = React.useRef(true);

  React.useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const effectiveLoading = loading || isPending;
  const ariaDisabled = props["aria-disabled"] === "true";
  const trulyDisabled = Boolean(
    props.disabled || ariaDisabled || effectiveLoading
  );

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // fire-once: in-flight 중 재클릭 무시
    if (trulyDisabled || actionInFlightRef.current) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
    if (clickAction && !e.defaultPrevented) {
      const result = clickAction(e);
      if (result instanceof Promise) {
        actionInFlightRef.current = true;
        setIsPending(true);
        result.finally(() => {
          actionInFlightRef.current = false;
          if (mountedRef.current) setIsPending(false);
        });
      }
    }
  };

  const classes = cn(
    "flex flex-col justify-center items-center gap-0",
    shape === "round" ? "rounded-fai-circle" : "rounded-fai-s",
    "whitespace-nowrap",
    "transition-colors",
    // assistive specs: flex-direction column, gap none (omit gap classes)
    tone === "assistive" || tone === "brandAssistive" ? "flex-col" : undefined,
    // focus: avoid numeric ring utilities; rely on semantic border token
    "focus-visible:outline-none focus-visible:border-border-brand",
    trulyDisabled
      ? "bg-fill-disabled text-disabled border border-border-disabled cursor-not-allowed"
      : getToneClasses(tone, impact),
    getSizeClasses(size, tone),
    // iconOnly: 정사각 유지 (py 기반 높이 + aspect-ratio, 좌우 패딩 제거)
    iconOnly && "aspect-square !px-0",
    className
  );

  const visibleLabel = children ?? label;

  const content = effectiveLoading ? (
    <span className="inline-flex items-center gap-2xs">
      <span
        className={cn(
          "inline-block",
          "w-ms h-ms",
          "rounded-fai-circle",
          "border border-current border-t-transparent",
          "animate-spin"
        )}
        aria-hidden="true"
      />
      {!iconOnly && <span>{visibleLabel}</span>}
    </span>
  ) : (
    <>
      {icon ? <span className="inline-flex">{icon}</span> : null}
      {!iconOnly && visibleLabel}
      {!iconOnly && endContent != null && (
        <span className="inline-flex items-center text-inherit">
          {endContent}
        </span>
      )}
    </>
  );

  // href 제공 + 인터랙션 가능 → 링크로 렌더 (disabled 링크는 안티패턴이라 button 유지)
  if (href != null && !trulyDisabled) {
    return (
      <LinkComponent
        href={href}
        target={target}
        rel={rel}
        title={tooltip}
        aria-label={iconOnly ? label : undefined}
        onClick={onClick as React.MouseEventHandler<HTMLElement> | undefined}
        className={cn(classes, "no-underline cursor-pointer")}
      >
        {content}
      </LinkComponent>
    );
  }

  return (
    <button
      {...props}
      type={type ?? "button"}
      disabled={trulyDisabled}
      aria-busy={effectiveLoading || undefined}
      aria-label={iconOnly ? label : undefined}
      title={tooltip}
      onClick={handleClick}
      className={classes}
    >
      {content}
    </button>
  );
}
