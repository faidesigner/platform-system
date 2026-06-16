"use client";

import { type ReactNode } from "react";

interface DrawerProps {
  isOpen: boolean;
  children: ReactNode;
}

/**
 * 모바일 메뉴 오버레이 껍데기.
 * 열림/닫힘 제어는 부모(NavigationBar)에 위임한다.
 */
export function Drawer({ isOpen, children }: DrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 top-16 z-40 bg-surface overflow-y-auto">
      {children}
    </div>
  );
}
