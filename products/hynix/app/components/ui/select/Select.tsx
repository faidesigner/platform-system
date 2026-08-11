"use client";
import * as React from "react";
/** hynix Select — 피그마 w/Select Dropdown (13:848).
 *  트리거 m(40)/L(48) radius8, focus=teal 테두리. 패널 흰배경+그림자.
 *  옵션 selected=배경 teal-50 + 글자 teal-500 + 체크. 아이콘(chevron/check)은 나중에 Icon으로 교체. */
export type SelectSize = "m" | "L";
export type SelectOption = { value: string; label: React.ReactNode };
export type SelectProps = {
  options: SelectOption[]; value?: string; onChange?: (v: string) => void;
  size?: SelectSize; placeholder?: React.ReactNode; disabled?: boolean;
  className?: string; style?: React.CSSProperties;
};
const DIM = { m: { h: 40, font: 14 }, L: { h: 48, font: 15 } } as const;
export function Select({ options, value, onChange, size = "m", placeholder = "선택하세요", disabled, className, style }: SelectProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const d = DIM[size];
  const selected = options.find((o) => o.value === value);
  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);
  return (
    <div ref={ref} className={className} style={{ position: "relative", width: "100%", ...style }}>
      <button type="button" disabled={disabled} onClick={() => setOpen((o) => !o)}
        style={{ boxSizing: "border-box", width: "100%", height: d.h, padding: open ? "8px 16px" : "12px 16px",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 36, borderRadius: 8,
          background: disabled ? "var(--color-bluegray-30,#F7F7F8)" : "var(--color-white,#fff)",
          border: `1px solid ${open ? "var(--color-hynix-teal-400,#009A93)" : "var(--color-gray-100,#C6CAD2)"}`,
          fontFamily: "'Pretendard',sans-serif", fontWeight: 500, fontSize: d.font, cursor: disabled ? "not-allowed" : "pointer",
          color: selected ? "var(--color-gray-900,#17191C)" : "var(--color-text-sub,#8890A0)", transition: "border-color .15s" }}>
        <span style={{ flex: 1, textAlign: "left", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {selected ? selected.label : placeholder}
        </span>
        {/* TODO: <Icon name={open ? "chevron-up" : "chevron-down"} /> */}
        <span aria-hidden style={{ width: 14, height: 14, flex: "none", color: "var(--color-text-sub,#8890A0)", transform: open ? "rotate(180deg)" : "none", transition: "transform .15s" }}>
          <svg width="14" height="14" viewBox="0 0 14 14"><path d="M3.5 5 L7 8.5 L10.5 5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </span>
      </button>
      {open && !disabled && (
        <div role="listbox" style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 50,
          padding: 4, background: "var(--color-white,#fff)", border: "1px solid #D2D3D5", borderRadius: 8,
          boxShadow: "0 10px 15px rgba(0,0,0,.05)", maxHeight: 260, overflow: "auto" }}>
          {options.map((o) => {
            const on = o.value === value;
            return (
              <div key={o.value} role="option" aria-selected={on} onClick={() => { onChange?.(o.value); setOpen(false); }}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
                  padding: "10px 16px", borderRadius: 6, cursor: "pointer",
                  background: on ? "var(--color-hynix-teal-50,#E6F5F4)" : "transparent",
                  color: on ? "var(--color-hynix-teal-500,#00827C)" : "#292C33",
                  fontFamily: "'Pretendard',sans-serif", fontWeight: on ? 700 : 400, fontSize: 14, lineHeight: "21px" }}>
                <span>{o.label}</span>
                {on && (
                  /* TODO: <Icon name="check" size={12} /> */
                  <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2.5 6.2 L4.8 8.5 L9.5 3.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
export default Select;
