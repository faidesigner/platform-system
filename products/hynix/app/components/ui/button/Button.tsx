"use client";

import * as React from "react";

/**
 * hynix Button (로컬 · 승격 대기)
 *
 * 피그마 SSOT: w/button (node 18:3873)
 * - hierarchy 3종: fill(Default) / brandLine(Variant2) / neutralLine(Variant3)
 * - size 4종: L(48) / m(40) / s(32) / xs(28)  — 전부 radius 8px
 * - disable 상태 포함
 *
 * 색/타이포/스페이싱은 전부 root/foundation 토큰(CSS 변수)을 참조한다.
 * 하드코딩 금지 — 브랜드 전환(hynix data-brand) 시 자동으로 값이 바뀌도록.
 */

export type ButtonHierarchy = "fill" | "brandLine" | "neutralLine";
export type ButtonSize = "L" | "m" | "s" | "xs";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  /** 피그마 hierarchy. fill=채움, brandLine=teal 아웃라인, neutralLine=뉴트럴 아웃라인 */
  hierarchy?: ButtonHierarchy;
  /** 피그마 size. L=48 / m=40 / s=32 / xs=28 */
  size?: ButtonSize;
  /** 라벨 앞 아이콘 (선택) */
  icon?: React.ReactNode;
  children?: React.ReactNode;
};

function cn(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(" ");
}

/* 피그마 실측 → 토큰 매핑
   L : h48 · pad 10/24 · text 15/22 (w/text/MS/semibold)
   m : h40 · pad 10/24 · text 14/21 (w/text/S/semibold)
   s : h32 · pad 10/12 · text 13/20 (w/text/XS/semibold)
   xs: h28 · pad 10/12 · text 13/20 (w/text/XS/semibold)
*/
const SIZE: Record<ButtonSize, React.CSSProperties> = {
  L: { height: 48, padding: "10px 24px", fontSize: 15, lineHeight: "22px" },
  m: { height: 40, padding: "10px 24px", fontSize: 14, lineHeight: "21px" },
  s: { height: 32, padding: "10px 12px", fontSize: 13, lineHeight: "20px" },
  xs: { height: 28, padding: "10px 12px", fontSize: 13, lineHeight: "20px" },
};

/* 피그마 hierarchy → 색 토큰
   fill        : bg teal-400 / text white              (disable: bg bluegray-50, text gray-100)
   brandLine   : bg white / border teal-400 / text teal-400
   neutralLine : bg white / border gray-100 / text bluegray-500
   disable(공통 아웃라인): bg #f7f7f8 / border bluegray-50 / text gray-100
*/
function hierarchyStyle(
  h: ButtonHierarchy,
  disabled: boolean
): React.CSSProperties {
  if (disabled) {
    if (h === "fill") {
      return {
        background: "var(--color-bluegray-50, #EEEFF1)",
        color: "var(--color-gray-100, #C6CAD2)",
        border: "1px solid transparent",
      };
    }
    return {
      background: "var(--color-bluegray-30, #F7F7F8)",
      color: "var(--color-gray-100, #C6CAD2)",
      border: "1px solid var(--color-bluegray-50, #EEEFF1)",
    };
  }
  switch (h) {
    case "fill":
      return {
        background: "var(--color-hynix-teal-400, #009A93)",
        color: "var(--color-white, #FFFFFF)",
        border: "1px solid transparent",
      };
    case "brandLine":
      return {
        background: "var(--color-white, #FFFFFF)",
        color: "var(--color-hynix-teal-400, #009A93)",
        border: "1px solid var(--color-hynix-teal-400, #009A93)",
      };
    case "neutralLine":
      return {
        background: "var(--color-white, #FFFFFF)",
        color: "var(--color-bluegray-500, #5B6271)",
        border: "1px solid var(--color-gray-100, #C6CAD2)",
      };
  }
}

export function Button({
  hierarchy = "fill",
  size = "m",
  icon,
  children,
  disabled = false,
  className,
  style,
  type = "button",
  ...props
}: ButtonProps) {
  const merged: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 8,
    fontFamily: "'Pretendard', system-ui, sans-serif",
    fontWeight: 600,
    whiteSpace: "nowrap",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "background-color .15s, border-color .15s, color .15s",
    boxSizing: "border-box",
    ...SIZE[size],
    ...hierarchyStyle(hierarchy, disabled),
    ...style,
  };

  return (
    <button
      type={type}
      disabled={disabled}
      aria-disabled={disabled || undefined}
      className={cn("hynix-btn", className)}
      style={merged}
      {...props}
    >
      {icon != null && <span className="hynix-btn__icon">{icon}</span>}
      {children}
    </button>
  );
}

export default Button;
