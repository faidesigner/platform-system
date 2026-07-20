"use client";

import { type ReactNode, useEffect, useState } from "react";
import { Scrollbar } from "../Scrollbar";

interface DrawerProps {
  isOpen:   boolean;
  onClose:  () => void;
  children: ReactNode;
  scope?: "viewport" | "container";
}

const DURATION = 300; // ms — transition-duration과 동기화

/**
 * 모바일: 풀스크린 슬라이드 다운
 * 태블릿(≥768px): 컨텐츠 높이 자동 + 딤 오버레이 페이드인
 *
 * - isOpen true  → mounted → rAF 후 visible true (enter 트랜지션)
 * - isOpen false → visible false (leave 트랜지션) → DURATION 후 unmount
 *   → 닫힘 애니메이션 완료 후 DOM 제거, 겹침 현상 방지
 */
export function Drawer({ isOpen, onClose, children, scope = "viewport" }: DrawerProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      // DOM 마운트 후 다음 프레임에 visible → enter 트랜지션 시작
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
      return () => cancelAnimationFrame(raf);
    } else {
      // leave 트랜지션 시작
      setVisible(false);
      // 트랜지션이 끝난 뒤 DOM 제거
      const timer = setTimeout(() => setMounted(false), DURATION);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!mounted) return null;

  const isContainer = scope === "container";

  return (
    <>
      {/* 딤 오버레이 — 태블릿에서만 표시 */}
      <div
        className={[
          isContainer
            ? "absolute inset-0 z-40"
            : "fixed inset-0 top-16 z-40 hidden tablet:block",
          "transition-opacity ease-in-out",
          visible ? "opacity-100" : "opacity-0",
        ].join(" ")}
        style={{
          transitionDuration: `${DURATION}ms`,
          background: "var(--color-bg-scrim, rgba(0, 0, 0, 0.35))",
        }}
        onClick={onClose}
        aria-hidden
      />

      {/* 드로어 패널
          origin-top + scaleY: top-16 선에서 아래로만 접힘 → 헤더 영역 침범 없음 */}
      <Scrollbar
        className={[
          isContainer
            ? "absolute left-0 right-0 top-0 z-50 bg-surface"
            : "fixed top-16 left-0 right-0 z-50 bg-surface",
          isContainer ? "bottom-auto" : "bottom-0 tablet:bottom-auto",
          isContainer ? "overflow-y-visible" : "overflow-y-auto tablet:overflow-y-visible",
          "origin-top transition-[transform,opacity] ease-in-out",
          visible ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0",
        ].join(" ")}
        style={{ transitionDuration: `${DURATION}ms` }}
      >
        {children}
      </Scrollbar>
    </>
  );
}
