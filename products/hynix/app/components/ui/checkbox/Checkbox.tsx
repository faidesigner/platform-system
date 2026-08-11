"use client";
import * as React from "react";
/** hynix Checkbox — 피그마 w/checkbox (58:4090) + option (58:4152)
 *  size: m(16, radius4) / L(20, radius5). checked=teal 채움+흰 체크 / none=gray 테두리 */
export type CheckboxSize = "m" | "L";
export type CheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type"> & {
  size?: CheckboxSize; label?: React.ReactNode;
};
const DIM = { m: { box: 16, r: 4, ic: 12, font: 14, lh: "21px", gap: 6 }, L: { box: 20, r: 5, ic: 16, font: 15, lh: "22px", gap: 8 } } as const;
export function Checkbox({ size = "m", label, checked, disabled, className, style, id, ...props }: CheckboxProps) {
  const d = DIM[size];
  const rid = id || React.useId();
  const border = checked ? "var(--color-hynix-teal-400, #009A93)" : "var(--color-line, #E4E4E7)";
  const bg = checked ? "var(--color-hynix-teal-400, #009A93)" : "var(--color-white, #fff)";
  return (
    <label htmlFor={rid} className={className}
      style={{ display: "inline-flex", alignItems: "center", gap: d.gap, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? .5 : 1, ...style }}>
      <input id={rid} type="checkbox" checked={checked} disabled={disabled} {...props}
        style={{ position: "absolute", opacity: 0, width: 0, height: 0 }} />
      <span aria-hidden style={{ boxSizing: "border-box", width: d.box, height: d.box, borderRadius: d.r,
        background: bg, border: `1px solid ${border}`, display: "inline-flex", alignItems: "center",
        justifyContent: "center", flex: "none", transition: "background .15s,border-color .15s" }}>
        {checked && (
          <svg width={d.ic} height={d.ic} viewBox="0 0 12 12" fill="none">
            <path d="M2.5 6.2 L4.8 8.5 L9.5 3.5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      {label != null && <span style={{ fontFamily: "'Pretendard',sans-serif", fontWeight: 500, fontSize: d.font,
        lineHeight: d.lh, color: "var(--color-gray-900,#292C33)" }}>{label}</span>}
    </label>
  );
}
export default Checkbox;
