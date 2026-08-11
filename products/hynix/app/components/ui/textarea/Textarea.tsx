"use client";
import * as React from "react";
/** hynix Textarea — 피그마 w/textarea (65:4859). pad12, radius8, 테두리 gray-100.
 *  focus = :focus → teal 테두리 (CSS 처리, 리렌더 없음). placeholder #8890A0 */
export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const STYLE_ID = "hynix-textarea-style";
const CSS = `
.hynix-textarea{box-sizing:border-box;width:100%;min-height:80px;padding:12px;border-radius:8px;
  background:var(--color-white,#fff);border:1px solid var(--color-gray-100,#C6CAD2);
  font-family:'Pretendard',sans-serif;font-weight:400;font-size:14px;line-height:21px;
  color:var(--color-gray-900,#17191C);outline:none;resize:vertical;transition:border-color .15s;}
.hynix-textarea:focus{border-color:var(--color-hynix-teal-400,#009A93);}
.hynix-textarea:disabled{background:var(--color-bluegray-30,#F7F7F8);}
.hynix-textarea::placeholder{color:var(--color-text-sub,#8890A0);}
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

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, style, ...props }, ref) {
  useInjectStyle(STYLE_ID, CSS);
  return <textarea ref={ref} className={cn("hynix-textarea", className)} style={style} {...props} />;
});
export default Textarea;
