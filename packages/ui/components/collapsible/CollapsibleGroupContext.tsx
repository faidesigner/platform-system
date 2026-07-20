"use client";

import * as React from "react";

/** @internal Collapsible/useCollapsible이 그룹 모드 감지에 사용 */
export interface CollapsibleGroupContextValue {
  openValues: Set<string>;
  toggle: (value: string) => void;
}

export const CollapsibleGroupContext =
  React.createContext<CollapsibleGroupContextValue | null>(null);
