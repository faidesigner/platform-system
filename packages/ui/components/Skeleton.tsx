import * as React from 'react';

export type SkeletonVariant = 'text' | 'circle' | 'rect';

export interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  /** 반복 개수 (text 줄 등) @default 1 */
  count?: number;
  className?: string;
}

const radiusClass: Record<SkeletonVariant, string> = {
  text: 'rounded-fai-s',
  rect: 'rounded-fai-s',
  circle: 'rounded-fai-circle',
};

export function Skeleton({
  variant = 'text',
  width,
  height,
  count = 1,
  className = '',
}: SkeletonProps) {
  const base = [
    'block bg-quaternary animate-pulse motion-reduce:animate-none',
    radiusClass[variant],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const style: React.CSSProperties = {
    width: width ?? (variant === 'text' ? '100%' : undefined),
    height: height ?? (variant === 'text' ? '1em' : variant === 'circle' ? width : undefined),
  };

  if (count <= 1) {
    return <span aria-hidden className={base} style={style} />;
  }

  return (
    <span aria-hidden className="flex flex-col gap-2xs">
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className={base}
          style={{
            ...style,
            /* 마지막 줄은 짧게 (자연스러운 텍스트 흉내) */
            width: variant === 'text' && i === count - 1 ? '60%' : style.width,
          }}
        />
      ))}
    </span>
  );
}
