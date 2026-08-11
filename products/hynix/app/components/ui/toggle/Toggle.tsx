"use client";
import * as React from "react";
/** hynix Toggle — 피그마 w/toggle (65:5676). 44×24, radius12. off=#E4E4E7 / on=teal-400 */
export type ToggleProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> & {
  label?: React.ReactNode;
};
export function Toggle({ checked, disabled, label, className, style, id, ...props }: ToggleProps) {
  const rid = id || React.useId();
  const track = disabled ? "var(--color-line,#E4E4E7)" : checked ? "var(--color-hynix-teal-400,#009A93)" : "var(--color-line,#E4E4E7)";
  return (
    <label htmlFor={rid} className={className}
      style={{ display: "inline-flex", alignItems: "center", gap: 10, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? .5 : 1, ...style }}>
      <input id={rid} type="checkbox" role="switch" checked={checked} disabled={disabled} {...props}
        style={{ position: "absolute", opacity: 0, width: 0, height: 0 }} />
      <span aria-hidden style={{ boxSizing: "border-box", width: 44, height: 24, borderRadius: 12, background: track,
        padding: 2, display: "inline-flex", alignItems: "center", justifyContent: checked ? "flex-end" : "flex-start",
        transition: "background .18s", flex: "none" }}>
        <span style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--color-white,#fff)",
          boxShadow: "0 1px 2px rgba(0,0,0,.15)", transition: "all .18s" }} />
      </span>
      {label != null && <span style={{ fontFamily: "'Pretendard',sans-serif", fontWeight: 500, fontSize: 14, color: "var(--color-gray-900,#292C33)" }}>{label}</span>}
    </label>
  );
}
export default Toggle;
