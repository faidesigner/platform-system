"use client";

import * as React from "react";

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary" | "assistive";
  size?: "XL" | "L" | "M" | "S";
  shape?: "square" | "circle";
  isImpact?: boolean;
  icon: "arrowshapeLeft" | "arrowshapeRight" | "arrowshapeUp" | React.ReactNode;
  /**
   * 접근성 라벨 (aria-label). 아이콘 전용 버튼은 보이는 텍스트가 없으므로
   * 스크린리더를 위해 반드시 지정할 것. 구체적으로: "삭제"보다 "대화 삭제".
   */
  label?: string;
  /** hover 툴팁 (title 속성). 아이콘만으로 의미가 애매할 때 권장 */
  tooltip?: string;
  /** 스피너 표시 + disabled + aria-busy @default false */
  loading?: boolean;
  /**
   * 비동기 클릭 액션 — pending 동안 자동 로딩, fire-once (재클릭 무시).
   * 동기 클릭은 onClick 사용.
   */
  clickAction?: (
    e: React.MouseEvent<HTMLButtonElement>
  ) => void | Promise<void>;
  /** 제공 시 링크로 렌더. disabled/loading이면 button 유지 */
  href?: string;
  /** href 렌더 컴포넌트 (Next.js Link 등) @default 'a' */
  as?: React.ElementType;
  /** 링크 target — href 제공 시에만 적용 */
  target?: string;
  /** 링크 rel — href 제공 시에만 적용 */
  rel?: string;
}

/* ── 공통 베이스 (radius 제외) ── */
const BASE =
  "group inline-flex flex-col justify-center items-center transition-all duration-200 cursor-pointer disabled:cursor-not-allowed shrink-0 " +
  "relative overflow-hidden " +
  "after:absolute after:inset-0 after:transition-colors after:pointer-events-none";

/* ── Variant 클래스 ── */
const PRIMARY =
  "bg-[var(--color-filled-optional-brand-primaryBtn)] text-white " +
  "after:bg-transparent " +
  "hover:after:bg-[var(--color-interaction-light-white-hover)] " +
  "focus:after:bg-[var(--color-interaction-light-white-focus)] " +
  "active:after:bg-[var(--color-interaction-light-white-pressed)] " +
  "disabled:bg-fill-disabled disabled:after:hidden " +
  "data-[impact=true]:border data-[impact=true]:border-solid data-[impact=true]:border-[var(--gradient-basic-light-accent-primary)]";

const SECONDARY =
  "bg-filled-optional-brand-secondaryBtn text-text-basic-primary " +
  "after:bg-transparent " +
  "hover:after:bg-[var(--color-interaction-light-black-hover,rgba(0,0,0,0.06))] " +
  "focus:after:bg-[var(--color-interaction-light-black-focus,rgba(0,0,0,0.08))] " +
  "active:after:bg-[var(--color-interaction-light-black-pressed,rgba(0,0,0,0.12))] " +
  "disabled:opacity-40 disabled:after:hidden";

const TERTIARY =
  "border border-solid border-border-faint bg-transparent " +
  "text-primary " +
  "after:bg-transparent " +
  "hover:after:bg-[var(--color-interaction-light-black-hover)] " +
  "focus:after:bg-[var(--color-interaction-light-black-focus)] " +
  "active:after:bg-[var(--color-interaction-light-black-pressed)] " +
  "disabled:border-border-disabled disabled:bg-fill-disabled/40 disabled:after:hidden " +
  "data-[impact=true]:border-[var(--gradient-basic-light-accent-primary)]";

const ASSISTIVE =
  "bg-transparent text-primary " +
  "after:bg-transparent " +
  "hover:after:bg-[var(--color-interaction-light-black-hover,rgba(0,0,0,0.06))] " +
  "focus:after:bg-[var(--color-interaction-light-black-hover,rgba(0,0,0,0.06))] focus:after:opacity-[var(--opacity-35,0.35)] " +
  "active:after:bg-[var(--color-interaction-light-black-pressed,rgba(0,0,0,0.08))] active:after:opacity-100 " +
  "disabled:opacity-40 disabled:after:hidden";

const VARIANT_CLASS: Record<"primary" | "secondary" | "tertiary" | "assistive", string> = {
  primary:   PRIMARY,
  secondary: SECONDARY,
  tertiary:  TERTIARY,
  assistive: ASSISTIVE,
};

/* ── 사이즈 매트릭스 ── */
const paddingMap: Record<"XL" | "L" | "M" | "S", string> = {
  XL: "p-[var(--padding-M,16px)]",
  L:  "p-[var(--padding-MS,12px)]",
  M:  "p-[var(--padding-XS,6px)]",
  S:  "p-[var(--padding-XS,6px)]",
};

const iconSizeMap: Record<"XL" | "L" | "M" | "S", string> = {
  XL: "w-[24px] h-[24px]",
  L:  "w-[24px] h-[24px]",
  M:  "w-[20px] h-[20px]",
  S:  "w-[16px] h-[16px]",
};

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      variant = "tertiary",
      size = "L",
      shape = "circle",
      isImpact = false,
      icon,
      label,
      tooltip,
      loading = false,
      clickAction,
      href,
      as: LinkComponent = "a",
      target,
      rel,
      className,
      type,
      onClick,
      ...props
    },
    ref
  ) => {
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
    const trulyDisabled = Boolean(props.disabled || effectiveLoading);

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

    const radiusClasses = shape === "square"
      ? "rounded-[var(--cornerRadius-S,8px)] after:rounded-[var(--cornerRadius-S,8px)]"
      : "rounded-[var(--cornerRadius-circle,999px)] after:rounded-[var(--cornerRadius-circle,999px)]";

    const iconSize = iconSizeMap[size];

    const classes = [
      BASE,
      radiusClasses,
      VARIANT_CLASS[variant],
      paddingMap[size],
      className ?? "",
    ]
      .filter(Boolean)
      .join(" ");

    const spinner = (
      <span
        aria-hidden="true"
        className="inline-block w-[60%] h-[60%] rounded-[var(--cornerRadius-circle,999px)] border border-current border-t-transparent animate-spin"
      />
    );

    // href 제공 + 인터랙션 가능 → 링크로 렌더 (disabled 링크는 안티패턴이라 button 유지)
    if (href != null && !trulyDisabled) {
      return (
        <LinkComponent
          href={href}
          target={target}
          rel={rel}
          title={tooltip}
          aria-label={label}
          onClick={onClick as React.MouseEventHandler<HTMLElement> | undefined}
          className={`${classes} no-underline`}
          data-impact={isImpact}
        >
          <IconSlot icon={icon} iconSize={iconSize} />
        </LinkComponent>
      );
    }

    return (
      <button
        ref={ref}
        className={classes}
        data-impact={isImpact}
        type={type ?? "button"}
        disabled={trulyDisabled}
        aria-busy={effectiveLoading || undefined}
        aria-label={label}
        title={tooltip}
        onClick={handleClick}
        {...props}
      >
        {effectiveLoading ? (
          <div className={`relative flex items-center justify-center ${iconSize}`}>
            {spinner}
          </div>
        ) : (
          <IconSlot icon={icon} iconSize={iconSize} />
        )}
      </button>
    );
  },
);
IconButton.displayName = "IconButton";

/* ── 아이콘 슬롯 (기존 렌더 로직 그대로 분리) ── */
function IconSlot({
  icon,
  iconSize,
}: {
  icon: IconButtonProps["icon"];
  iconSize: string;
}) {
  return (
      <>
        <div className={`relative flex items-center justify-center ${iconSize}`}>
          {typeof icon !== "string" ? (
            icon
          ) : (<>

          {/* arrowshapeLeft */}
          {icon === "arrowshapeLeft" && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              className={iconSize}
            >
              <mask
                id="mask_arrow_left"
                style={{ maskType: "alpha" }}
                maskUnits="userSpaceOnUse"
                x="2" y="3" width="19" height="18"
              >
                <path
                  d="M11.4336 3.43337C11.746 3.12128 12.2521 3.12106 12.5645 3.43337C12.8765 3.7457 12.8765 4.25186 12.5645 4.56423L5.92969 11.199H19.999C20.4406 11.1992 20.7987 11.5572 20.7988 11.9988C20.7987 12.4404 20.4406 12.7984 19.999 12.7986H5.92969L12.5645 19.4334C12.8765 19.7457 12.8765 20.2519 12.5645 20.5642C12.2521 20.8765 11.746 20.8764 11.4336 20.5642L3.43359 12.5642L2.86719 11.9988L3.43359 11.4334L11.4336 3.43337Z"
                  fill="black"
                />
              </mask>
              <g mask="url(#mask_arrow_left)">
                <rect width="24" height="24" fill="currentColor" />
              </g>
            </svg>
          )}

          {/* arrowshapeRight */}
          {icon === "arrowshapeRight" && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              className={iconSize}
            >
              <mask
                id="mask_arrow_right"
                style={{ maskType: "alpha" }}
                maskUnits="userSpaceOnUse"
                x="2" y="3" width="19" height="18"
              >
                <path
                  d="M12.2773 20.5666C11.9649 20.8787 11.4588 20.8789 11.1465 20.5666C10.8343 20.2543 10.8344 19.7482 11.1465 19.4358L17.7813 12.801L3.71191 12.801C3.27037 12.8008 2.91222 12.4428 2.91211 12.0012C2.91211 11.5595 3.2703 11.2016 3.71191 11.2014L17.7813 11.2014L11.1465 4.56663C10.8343 4.25431 10.8344 3.74817 11.1465 3.43577C11.4589 3.1234 11.9649 3.12349 12.2773 3.43577L20.2773 11.4358L20.8438 12.0012L20.2773 12.5666L12.2773 20.5666Z"
                  fill="black"
                />
              </mask>
              <g mask="url(#mask_arrow_right)">
                <rect width="24" height="24" fill="currentColor" />
              </g>
            </svg>
          )}

          {/* arrowshapeUp — CSS group 롤링 교체 모션 */}
          {icon === "arrowshapeUp" && (
            <div className={`relative flex items-center justify-center overflow-hidden ${iconSize}`}>

              {/* 첫 번째 아이콘: 중앙 → 위로 사라짐 */}
              <div className={`flex items-center justify-center transition-transform duration-[400ms] ease-in-out group-hover:-translate-y-full ${iconSize}`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  className={iconSize}
                >
                  <mask id="mask_arrow_up_a" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="3" y="3" width="18" height="19">
                    <path d="M20.5627 11.7246C20.8748 12.0371 20.875 12.5432 20.5627 12.8555C20.2504 13.1676 19.7443 13.1675 19.4319 12.8555L12.7971 6.2207L12.7971 20.29C12.7968 20.7316 12.4389 21.0897 11.9973 21.0898C11.5556 21.0898 11.1977 20.7317 11.1975 20.29L11.1975 6.2207L4.56273 12.8555C4.25041 13.1676 3.74427 13.1675 3.43187 12.8555C3.11949 12.5431 3.11958 12.037 3.43187 11.7246L11.4319 3.72461L11.9973 3.1582L12.5627 3.72461L20.5627 11.7246Z" fill="black" />
                  </mask>
                  <g mask="url(#mask_arrow_up_a)">
                    <rect x="1.04908e-06" y="24" width="24" height="24" transform="rotate(-90 1.04908e-06 24)" fill="white" />
                  </g>
                </svg>
              </div>

              {/* 두 번째 아이콘: 150% 아래 대기 → 중앙으로 올라옴 */}
              <div className={`absolute inset-0 flex items-center justify-center translate-y-full transition-transform duration-[400ms] ease-in-out group-hover:translate-y-0 ${iconSize}`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  className={iconSize}
                >
                  <mask id="mask_arrow_up_b" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="3" y="3" width="18" height="19">
                    <path d="M20.5627 11.7246C20.8748 12.0371 20.875 12.5432 20.5627 12.8555C20.2504 13.1676 19.7443 13.1675 19.4319 12.8555L12.7971 6.2207L12.7971 20.29C12.7968 20.7316 12.4389 21.0897 11.9973 21.0898C11.5556 21.0898 11.1977 20.7317 11.1975 20.29L11.1975 6.2207L4.56273 12.8555C4.25041 13.1676 3.74427 13.1675 3.43187 12.8555C3.11949 12.5431 3.11958 12.037 3.43187 11.7246L11.4319 3.72461L11.9973 3.1582L12.5627 3.72461L20.5627 11.7246Z" fill="black" />
                  </mask>
                  <g mask="url(#mask_arrow_up_b)">
                    <rect x="1.04908e-06" y="24" width="24" height="24" transform="rotate(-90 1.04908e-06 24)" fill="white" />
                  </g>
                </svg>
              </div>

            </div>
          )}

          </>)}
        </div>
      </>
  );
}
