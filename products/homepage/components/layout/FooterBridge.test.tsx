import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import koMessages from "@/messages/ko.json";
import enMessages from "@/messages/en.json";
import jaMessages from "@/messages/ja.json";

/**
 * HOM-67 회귀 방지 — 푸터의 로케일별 노출·실데이터.
 *
 * 번역 시트("Homepage text source") 기준:
 * - 사업자등록번호: 한국 사업자번호라 ja 미노출
 * - 전화: ko는 국내 표기(02-…), en·ja는 국가코드 포함(+82-2-…)
 * - 이메일: ja는 일본팀 주소(contact_jp@)
 * - 일본 법인 정보(법인명·대표·전화): ja 전용 추가 노출
 *
 * 전화·이메일은 과거 로케일 무관 하드코딩이라 en·ja에도 한국 국내 표기가 나갔다 — 그 회귀를 막는다.
 */

vi.mock("@/lib/analytics/track", () => ({ trackEvent: vi.fn() }));

import FooterBridge from "./FooterBridge";

const MESSAGES = { ko: koMessages, en: enMessages, ja: jaMessages } as const;

function renderAt(locale: keyof typeof MESSAGES) {
  return render(
    <NextIntlClientProvider locale={locale} messages={MESSAGES[locale]}>
      <FooterBridge />
    </NextIntlClientProvider>,
  );
}

describe("FooterBridge 로케일 대응 (HOM-67)", () => {
  it("사업자등록번호는 ko·en에만 노출하고 ja에서는 감춘다", () => {
    expect(renderAt("ko").container.textContent).toContain("809-86-01657");
    expect(renderAt("en").container.textContent).toContain("809-86-01657");
    expect(renderAt("ja").container.textContent).not.toContain("809-86-01657");
  });

  it("전화번호는 ko만 국내 표기, en·ja는 국가코드를 포함한다", () => {
    expect(renderAt("ko").container.textContent).toContain("02-6191-0049");
    for (const locale of ["en", "ja"] as const) {
      const text = renderAt(locale).container.textContent ?? "";
      expect(text).toContain("+82-2-6191-0049");
    }
  });

  it("ja 이메일은 일본팀 주소를 쓴다", () => {
    expect(renderAt("ja").container.textContent).toContain("contact_jp@fainders.ai");
    expect(renderAt("ko").container.textContent).toContain("contact@fainders.ai");
  });

  it("일본 법인 정보는 ja에서만 노출한다", () => {
    const ja = renderAt("ja").container.textContent ?? "";
    expect(ja).toContain("株式会社ファインダーズＡＩジャパン");
    expect(ja).toContain("03-6821-7191");

    for (const locale of ["ko", "en"] as const) {
      const text = renderAt(locale).container.textContent ?? "";
      expect(text).not.toContain("株式会社ファインダーズＡＩジャパン");
      expect(text).not.toContain("03-6821-7191");
    }
  });

  it("en 회사명은 등기부 영문 표기로 통일한다", () => {
    const en = renderAt("en").container.textContent ?? "";
    expect(en).toContain("Fainders.ai Inc.");
    expect(en).not.toContain("Co., Ltd.");
  });

  it("ja 주소의 '길'은 표준 표기 キル를 쓴다 (ギル 아님)", () => {
    // 도로명주소 신청지원센터의 번역 규정이 카타카나 「キル」로 정했고 일본어권 번역·지도 서비스
    // (코네스트 등)도 「江南大路98キル 25」처럼 キル + 건물번호 앞 공백으로 표기한다.
    const ja = renderAt("ja").container.textContent ?? "";
    expect(ja).toContain("江南大路51キル 1");
    expect(ja).not.toContain("ギル");
  });

  it("영상정보처리기기 방침 링크는 어느 로케일에도 남아 있지 않다 (HOM-61 회귀)", () => {
    for (const locale of ["ko", "en", "ja"] as const) {
      const { container } = renderAt(locale);
      expect(container.innerHTML).not.toContain("cctv");
    }
  });
});
