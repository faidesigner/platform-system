"use client";

import * as React from "react";

export type CarouselGap = "none" | "2xs" | "s" | "m" | "l";

export interface CarouselProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** 캐러셀 아이템들 — 가로 스크롤 컨테이너에 렌더 */
  children: React.ReactNode;
  /** 아이템 간격 @default 's' */
  gap?: CarouselGap;
  /** 스크롤 가능할 때 좌우 내비게이션 버튼 표시 @default true */
  hasButtons?: boolean;
  /** 가장자리 페이드 — 더 많은 아이템이 있음을 시각적으로 암시 @default true */
  hasEdgeFade?: boolean;
  /** 아이템 단위 스크롤 스냅 @default false */
  hasSnap?: boolean;
  /** 접근성 라벨 @default '캐러셀' */
  "aria-label"?: string;
}

function cn(...values: Array<string | undefined | null | false>) {
  return values.filter(Boolean).join(" ");
}

const GAP_CLASSES: Record<CarouselGap, string> = {
  none: "gap-0",
  "2xs": "gap-2xs", // 4px
  s: "gap-s", //       8px
  m: "gap-m", //       16px
  l: "gap-xl", //      24px
};

const ARROW = {
  prev: <path d="m15 18-6-6 6-6" />,
  next: <path d="m9 18 6-6-6-6" />,
};

function NavButton({
  dir,
  onClick,
  hidden,
}: {
  dir: "prev" | "next";
  onClick: () => void;
  hidden: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={dir === "prev" ? "이전 항목" : "다음 항목"}
      aria-hidden={hidden || undefined}
      tabIndex={hidden ? -1 : 0}
      onClick={onClick}
      className={cn(
        "absolute top-1/2 -translate-y-1/2 z-10",
        dir === "prev" ? "left-2xs" : "right-2xs",
        "inline-flex items-center justify-center w-2xl h-2xl",
        "rounded-fai-circle",
        "bg-[var(--color-bg-100)] text-[var(--color-icon-basic-primary)]",
        "border border-border-secondary shadow-S",
        "transition-opacity duration-[var(--duration-fast,175ms)]",
        "hover:bg-fill-faint cursor-pointer",
        hidden ? "opacity-0 pointer-events-none" : "opacity-100"
      )}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {ARROW[dir]}
      </svg>
    </button>
  );
}

/**
 * 가로 스크롤 캐러셀. 콘텐츠가 넘칠 때만 좌우 버튼과 가장자리 페이드가
 * 나타나며, 버튼 클릭 시 뷰포트의 80%씩 스크롤한다.
 * 스펙: root/components/web/ui/carousel.md
 *
 * @example
 * <Carousel aria-label="추천 상품">
 *   {items.map((item) => <ProductCard key={item.id} {...item} />)}
 * </Carousel>
 */
export function Carousel({
  children,
  gap = "s",
  hasButtons = true,
  hasEdgeFade = true,
  hasSnap = false,
  className,
  "aria-label": ariaLabel = "캐러셀",
  ...rest
}: CarouselProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = React.useState(false);
  const [canNext, setCanNext] = React.useState(false);

  const updateScrollState = React.useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 1);
    setCanNext(el.scrollLeft < maxScroll - 1);
  }, []);

  React.useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(el);
    return () => observer.disconnect();
  }, [updateScrollState]);

  const scrollBy = (direction: -1 | 1) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: "smooth" });
  };

  const isScrollable = canPrev || canNext;

  return (
    <div
      role="region"
      aria-label={ariaLabel}
      className={cn("relative", className)}
      {...rest}
    >
      <div
        ref={scrollRef}
        onScroll={updateScrollState}
        className={cn(
          "flex overflow-x-auto",
          GAP_CLASSES[gap],
          hasSnap && "snap-x snap-mandatory [&>*]:snap-start",
          // 스크롤바 숨김 (기능은 유지)
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          // 가장자리 페이드 — 스크롤 가능한 쪽에만
          hasEdgeFade &&
            isScrollable &&
            "[mask-image:linear-gradient(to_right,transparent,black_var(--carousel-fade-l,0px),black_calc(100%-var(--carousel-fade-r,0px)),transparent)]"
        )}
        style={
          hasEdgeFade
            ? ({
                "--carousel-fade-l": canPrev ? "2rem" : "0px",
                "--carousel-fade-r": canNext ? "2rem" : "0px",
              } as React.CSSProperties)
            : undefined
        }
      >
        {children}
      </div>

      {hasButtons && (
        <>
          <NavButton dir="prev" onClick={() => scrollBy(-1)} hidden={!canPrev} />
          <NavButton dir="next" onClick={() => scrollBy(1)} hidden={!canNext} />
        </>
      )}
    </div>
  );
}

export default Carousel;
