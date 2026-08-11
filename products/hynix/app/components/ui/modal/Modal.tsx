"use client";
import * as React from "react";
/** hynix Modal — 피그마 Modal (90:9609). size: S(400)/M(560)/L(800)/XL(1040). radius12, 흰배경+그림자.
 *  header(title+close) + body(children) + footer(actions) 슬롯 구조 */
export type ModalSize = "S" | "M" | "L" | "XL";
const WIDTH: Record<ModalSize, number> = { S: 400, M: 560, L: 800, XL: 1040 };
export type ModalProps = {
  open?: boolean; size?: ModalSize; title?: React.ReactNode; onClose?: () => void;
  children?: React.ReactNode; footer?: React.ReactNode; className?: string;
};
export function Modal({ open = true, size = "M", title, onClose, children, footer, className }: ModalProps) {
  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" style={{ position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(23,25,28,.45)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
      onClick={onClose}>
      <div className={className} onClick={(e) => e.stopPropagation()}
        style={{ width: WIDTH[size], maxWidth: "100%", maxHeight: "90vh", overflow: "auto", background: "var(--color-white,#fff)",
          borderRadius: 12, boxShadow: "0 12px 40px rgba(0,0,0,.16)", display: "flex", flexDirection: "column", boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", gap: 12 }}>
          <span style={{ fontFamily: "'Pretendard',sans-serif", fontWeight: 600, fontSize: 18, color: "#17191C" }}>{title}</span>
          {onClose && (
            <button type="button" onClick={onClose} aria-label="닫기" style={{ width: 28, height: 28, borderRadius: 6, border: "none", background: "transparent", cursor: "pointer", color: "#8890A0", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="16" height="16" viewBox="0 0 16 16"><path d="M4 4 L12 12 M12 4 L4 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
            </button>
          )}
        </div>
        <div style={{ padding: "0 24px 20px", fontFamily: "'Pretendard',sans-serif", fontSize: 14, lineHeight: "22px", color: "var(--color-bluegray-500,#5B6271)" }}>{children}</div>
        {footer && <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, padding: "16px 24px", borderTop: "1px solid var(--color-bluegray-30,#F7F7F8)" }}>{footer}</div>}
      </div>
    </div>
  );
}
export default Modal;
