"use client";
import * as React from "react";
/** hynix Badge — 피그마 Badge (1:173). pad 0/8 h20, radius 999, medium 12.
 *  variant: gray/mint/red/blue. (주찬감=gray, 부찬감=red, 공용=blue, 상태=mint 등) */
export type BadgeVariant = "gray" | "mint" | "red" | "blue";
const V: Record<BadgeVariant, { bg: string; text: string }> = {
  gray: { bg: "#F5F5F5", text: "#61646B" },
  mint: { bg: "#E3FCF1", text: "#0E9F6E" },
  red:  { bg: "#FEF6F6", text: "#EA3B2A" },
  blue: { bg: "#F0F7FE", text: "#2388F6" },
};
export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant };
export function Badge({ variant = "gray", children, className, style, ...props }: BadgeProps) {
  const v = V[variant];
  return (
    <span className={className} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center",
      height: 20, padding: "0 8px", borderRadius: 999, background: v.bg, color: v.text,
      fontFamily: "'Pretendard',sans-serif", fontWeight: 500, fontSize: 12, lineHeight: "18px",
      whiteSpace: "nowrap", boxSizing: "border-box", ...style }} {...props}>{children}</span>
  );
}
export default Badge;
