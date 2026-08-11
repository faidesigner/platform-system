"use client";
import * as React from "react";
/** hynix Toast — 피그마 w/toast-notifications (84:7766). 4종: success/error/warning/info.
 *  radius12, pad16, 흰배경+그림자, 왼쪽 accent 라인, 아이콘 원, 타이틀+내용, 닫기 */
export type ToastType = "success" | "error" | "warning" | "info";
const CFG: Record<ToastType, { accent: string; iconBg: string; icon: React.ReactNode }> = {
  success: { accent: "#17CF81", iconBg: "#EDFDF6", icon: <path d="M5 10.5 L8.5 14 L15 6" stroke="#17CF81" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/> },
  error:   { accent: "#EA3B2A", iconBg: "#FEF6F6", icon: <><circle cx="10" cy="10" r="7" stroke="#EA3B2A" strokeWidth="1.6" fill="none"/><path d="M10 6 V10.5 M10 13.5 h.01" stroke="#EA3B2A" strokeWidth="1.6" strokeLinecap="round"/></> },
  warning: { accent: "#FC7A03", iconBg: "#FFF7F0", icon: <><path d="M10 4 L17 16 H3 Z" stroke="#FC7A03" strokeWidth="1.6" fill="none" strokeLinejoin="round"/><path d="M10 9 V12 M10 14.2 h.01" stroke="#FC7A03" strokeWidth="1.6" strokeLinecap="round"/></> },
  info:    { accent: "#2388F6", iconBg: "#F0F7FE", icon: <><circle cx="10" cy="10" r="7" stroke="#2388F6" strokeWidth="1.6" fill="none"/><path d="M10 9 V14 M10 6.5 h.01" stroke="#2388F6" strokeWidth="1.6" strokeLinecap="round"/></> },
};
export type ToastProps = {
  type?: ToastType; title?: React.ReactNode; description?: React.ReactNode; onClose?: () => void; className?: string; style?: React.CSSProperties;
};
export function Toast({ type = "success", title = "타이틀", description = "내용", onClose, className, style }: ToastProps) {
  const c = CFG[type];
  return (
    <div role="status" className={className} style={{ display: "flex", alignItems: "center", gap: 16, width: 356,
      padding: 16, borderRadius: 12, background: "var(--color-white,#fff)", border: "1px solid var(--color-gray-100,#C6CAD2)",
      boxShadow: "0 4px 12px rgba(0,0,0,.03)", boxSizing: "border-box", position: "relative", overflow: "hidden", ...style }}>
      <span style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 4, height: 36, borderRadius: 2, background: c.accent }} />
      <span style={{ width: 36, height: 36, borderRadius: 18, background: c.iconBg, display: "inline-flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
        <svg width="20" height="20" viewBox="0 0 20 20">{c.icon}</svg>
      </span>
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ fontFamily: "'Pretendard',sans-serif", fontWeight: 600, fontSize: 14, lineHeight: "21px", color: "#17191C" }}>{title}</span>
        <span style={{ fontFamily: "'Pretendard',sans-serif", fontWeight: 400, fontSize: 13, lineHeight: "20px", color: "var(--color-bluegray-500,#5B6271)" }}>{description}</span>
      </div>
      {onClose && (
        <button type="button" onClick={onClose} aria-label="닫기" style={{ width: 24, height: 24, borderRadius: 6, border: "none", background: "transparent", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", flex: "none", color: "#8890A0" }}>
          <svg width="14" height="14" viewBox="0 0 14 14"><path d="M4 4 L10 10 M10 4 L4 10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
        </button>
      )}
    </div>
  );
}
export default Toast;
