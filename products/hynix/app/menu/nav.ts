import type { NavGroup } from "@/app/components/ui/sidebar/Sidebar";

/** hynix 사이드바 메뉴 + 라우팅 매핑 (두 페이지 공통) */
export const NAV: NavGroup[] = [
  { items: [
    { id: "realtime", label: "실시간 대시보드" },
    { id: "operation", label: "운영 대시보드" },
    { id: "system", label: "시스템 설정" },
  ]},
  { title: "현장 운영", items: [
    { id: "meal-perm", label: "식수권한", children: [
      { id: "meal-history", label: "식수 내역" },
      { id: "meal-perm-mgmt", label: "식수 권한 관리" },
      { id: "qr", label: "QR" },
    ]},
    { id: "site", label: "현장", children: [
      { id: "corner", label: "식당 코너 관리" },
      { id: "reader", label: "리더기 관리" },
      { id: "site-report", label: "현장 운영 리포트" },
    ]},
    { id: "cx", label: "CX", children: [
      { id: "voc", label: "VoC" },
      { id: "board", label: "게시판 관리" },
    ]},
  ]},
  { title: "식단 운영", items: [
    { id: "menu-meal", label: "메뉴 식단", children: [
      { id: "menu-mgmt", label: "메뉴 관리" },
      { id: "diet-mgmt", label: "식단 관리" },
    ]},
    { id: "settlement", label: "정산 계약" },
  ]},
];

/** nav id → 라우트 경로. 아직 없는 화면은 "#"(플레이스홀더) */
export const NAV_ROUTES: Record<string, string> = {
  "menu-mgmt": "/menu",
  // 나머지는 화면 생기면 채움
};

export function routeFor(id: string): string {
  return NAV_ROUTES[id] ?? "#";
}
