"use client";
import * as React from "react";
/** hynix TagChip — 피그마 w/tag-chip (58:4394). pad 6/12 h28, radius20, semibold 13.
 *  tone: teal(selected) / purple / magenta / blue / neutral(none). onRemove 있으면 x 아이콘 표시 */
export type TagTone = "teal" | "purple" | "magenta" | "blue" | "neutral";
const TONE: Record<TagTone, { bg: string; border: string; text: string }> = {
  teal:    { bg: "var(--color-hynix-teal-50,#E6F5F4)", border: "var(--color-hynix-teal-400,#009A93)", text: "var(--color-hynix-teal-500,#00827C)" },
  purple:  { bg: "#F4F1FD", border: "#693EEA", text: "#693EEA" },
  magenta: { bg: "#FBF1FD", border: "#C32CE8", text: "#CF59EC" },
  blue:    { bg: "#F0F7FE", border: "#2388F6", text: "#2388F6" },
  neutral: { bg: "var(--color-white,#fff)", border: "var(--color-gray-100,#C6CAD2)", text: "var(--color-text-sub,#8890A0)" },
};
export type TagChipProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: TagTone; onRemove?: () => void; children?: React.ReactNode;
};
export function TagChip({ tone = "neutral", onRemove, children, className, style, ...props }: TagChipProps) {
  const t = TONE[tone];
  return (
    <span className={className} style={{ display: "inline-flex", alignItems: "center", gap: 4, height: 28,
      padding: "6px 12px", borderRadius: 20, background: t.bg, border: `1px solid ${t.border}`,
      fontFamily: "'Pretendard',sans-serif", fontWeight: 600, fontSize: 13, lineHeight: "20px", color: t.text,
      boxSizing: "border-box", ...style }} {...props}>
      {children}
      {onRemove && (
        <button type="button" onClick={onRemove} aria-label="제거"
          style={{ display: "inline-flex", padding: 0, border: "none", background: "transparent", cursor: "pointer", color: t.text, lineHeight: 0 }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <circle cx="6" cy="6" r="5.5" stroke="currentColor" opacity=".5"/>
            <path d="M4.2 4.2 L7.8 7.8 M7.8 4.2 L4.2 7.8" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
          </svg>
        </button>
      )}
    </span>
  );
}
export default TagChip;
