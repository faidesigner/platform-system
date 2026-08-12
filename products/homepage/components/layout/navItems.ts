import type { ReactNode } from "react";
import type { NavItem } from "@fai/ui";

/** 한국 채용 페이지(greetinghr). 한국어 전용 사이트라 ko에서만 링크한다(HOM-68). */
export const CAREERS_URL = "https://faindersai.career.greetinghr.com/ko/home";

export interface NavLabels {
  products: string;
  about: string;
  media: string;
  careers: string;
}

export interface BuildNavItemsOptions {
  /** 채용 메뉴 노출 여부 — config/locale-policy.ts의 showCareers를 그대로 전달한다. */
  showCareers: boolean;
  /** 제품 항목에 붙는 메가메뉴 패널. */
  megaMenuPanel?: ReactNode;
}

/**
 * 데스크톱 네비게이션 항목 구성(HOM-68).
 *
 * 순수 함수로 분리한 이유: 로케일별 노출 규칙을 렌더 트리 밖에서 테스트로 고정하기 위함.
 * 태블릿·모바일 드로어는 이 목록을 쓰지 않고 TabletDrawerMenu가 자체 렌더하므로,
 * 같은 규칙을 showCareers prop으로 따로 전달해야 한다(두 경로 모두 테스트로 고정됨).
 */
export function buildNavItems(
  labels: NavLabels,
  { showCareers, megaMenuPanel }: BuildNavItemsOptions,
): NavItem[] {
  return [
    {
      label: labels.products,
      href: "/products",
      dropdown: true,
      megaMenuPanel,
    },
    { label: labels.about, href: "/about" },
    { label: labels.media, href: "/media" },
    ...(showCareers
      ? [
          {
            label: labels.careers,
            href: CAREERS_URL,
            external: true,
            ariaLabel: "파인더스에이아이 채용 홈 바로가기(새창)",
          },
        ]
      : []),
  ];
}
