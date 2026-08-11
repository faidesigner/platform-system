"use client";
import * as React from "react";
/** hynix Icon 래퍼 (자리만 — SVG는 나중에 svg/ 에 넣고 REGISTRY 에 등록) */
export type IconName =
  | "check" | "x-circle" | "alert-circle" | "alert-triangle" | "info" | "chevron-down" | "search";

// TODO: svg/ 에 아이콘 넣은 뒤 여기에 등록. 값은 React 컴포넌트(SVG) 또는 경로.
const REGISTRY: Partial<Record<IconName, React.FC<React.SVGProps<SVGSVGElement>>>> = {};

export type IconProps = React.SVGProps<SVGSVGElement> & { name: IconName; size?: number };
export function Icon({ name, size = 16, ...props }: IconProps) {
  const Cmp = REGISTRY[name];
  if (!Cmp) {
    // 아직 미등록: 자리표시 (개발 중 눈에 띄게)
    return <span aria-hidden style={{ display: "inline-block", width: size, height: size }} data-icon-missing={name} />;
  }
  return <Cmp width={size} height={size} {...props} />;
}
export default Icon;
