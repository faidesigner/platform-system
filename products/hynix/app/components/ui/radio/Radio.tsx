"use client";
import * as React from "react";
/** hynix Radio — 피그마 w/radio (58:3959) + w/radio-option (58:3973)
 *  size: m(16) / L(20). checked=teal 테두리+teal 점 / default=gray 테두리 / disabled=옅은 회색 */
export type RadioSize = "m" | "L";
export type RadioProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type"> & {
  size?: RadioSize; label?: React.ReactNode;
};
const DIM = { m: { box: 16, dot: 8, font: 14, lh: "21px", gap: 6 }, L: { box: 20, dot: 10, font: 15, lh: "22px", gap: 8 } } as const;
export function Radio({ size = "m", label, checked, disabled, className, style, id, ...props }: RadioProps) {
  const d = DIM[size];
  const rid = id || React.useId();
  const ring = disabled ? "var(--color-bluegray-50, #EEEFF1)" : checked ? "var(--color-hynix-teal-400, #009A93)" : "var(--color-gray-100, #C6CAD2)";
  const dot = disabled ? "var(--color-bluegray-50, #EEEFF1)" : "var(--color-hynix-teal-400, #009A93)";
  return (
    <label htmlFor={rid} className={className}
      style={{ display: "inline-flex", alignItems: "center", gap: d.gap, cursor: disabled ? "not-allowed" : "pointer", ...style }}>
      <input id={rid} type="radio" checked={checked} disabled={disabled} {...props}
        style={{ position: "absolute", opacity: 0, width: 0, height: 0 }} />
      <span aria-hidden style={{ boxSizing: "border-box", width: d.box, height: d.box, borderRadius: "50%",
        background: "var(--color-white, #fff)", border: `2px solid ${ring}`, display: "inline-flex",
        alignItems: "center", justifyContent: "center", flex: "none", transition: "border-color .15s" }}>
        {checked && <span style={{ width: d.dot, height: d.dot, borderRadius: "50%", background: dot }} />}
      </span>
      {label != null && <span style={{ fontFamily: "'Pretendard',sans-serif", fontWeight: 500, fontSize: d.font,
        lineHeight: d.lh, color: disabled ? "var(--color-gray-100,#C6CAD2)" : "var(--color-gray-900,#292C33)" }}>{label}</span>}
    </label>
  );
}
export default Radio;
