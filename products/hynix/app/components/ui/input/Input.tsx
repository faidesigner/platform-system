"use client";
import * as React from "react";
/** hynix Input — 피그마 w/basic Input (31:1965).
 *  size: m(40) / L(48). state: default/active/focus. icon 유무. radius8, 테두리 gray-100.
 *  focus = 래퍼에 :focus-within → teal 테두리 (CSS로 처리, 리렌더 없음). */
export type InputSize = "m" | "L";
export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> & {
  size?: InputSize; icon?: React.ReactNode; wrapperClassName?: string;
};
const DIM = { m: { h: 40, font: 14, lh: "21px", padY: 8 }, L: { h: 48, font: 15, lh: "22px", padY: 12 } } as const;

// focus 스타일은 CSS(:focus-within)로. 컴포넌트 첫 렌더 시 1회 주입.
const STYLE_ID = "hynix-input-style";
const CSS = `
.hynix-input{box-sizing:border-box;display:flex;align-items:center;gap:8px;border-radius:8px;min-width:0;width:100%;
  background:var(--color-white,#fff);border:1px solid var(--color-gray-100,#C6CAD2);
  transition:border-color .15s;}
.hynix-input:focus-within{border-color:var(--color-hynix-teal-400,#009A93);}
.hynix-input[data-disabled="true"]{background:var(--color-bluegray-30,#F7F7F8);}
.hynix-input__field{flex:1;min-width:0;border:none;outline:none;background:transparent;
  font-family:'Pretendard',sans-serif;color:var(--color-gray-900,#17191C);}
.hynix-input__field::placeholder{color:var(--color-text-sub,#8890A0);}
.hynix-input__icon{display:inline-flex;flex:none;color:var(--color-text-sub,#8890A0);}
`;
function useInjectStyle(id: string, css: string) {
  React.useEffect(() => {
    if (typeof document === "undefined" || document.getElementById(id)) return;
    const el = document.createElement("style");
    el.id = id; el.textContent = css;
    document.head.appendChild(el);
  }, [id, css]);
}

function cn(...v: Array<string | false | null | undefined>) { return v.filter(Boolean).join(" "); }

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { size = "m", icon, disabled, className, wrapperClassName, style, ...props }, ref) {
  useInjectStyle(STYLE_ID, CSS);
  const d = DIM[size];
  return (
    <div className={cn("hynix-input", wrapperClassName)} data-disabled={disabled ? "true" : undefined}
      style={{ height: d.h, padding: `${d.padY}px 16px`, ...style }}>
      {icon != null && <span className="hynix-input__icon">{icon}</span>}
      <input ref={ref} disabled={disabled} className={cn("hynix-input__field", className)}
        style={{ fontWeight: 500, fontSize: d.font, lineHeight: d.lh }} {...props} />
    </div>
  );
});
export default Input;
