import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
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

  it("세 로케일 모두 우편번호를 노출한다", () => {
    // ja만 우편번호가 빠져 있었다. 일본어에서 한국 주소의 우편번호를 생략하는 관례는 없고
    // (한국은 2015-08부터 5자리), ko·en은 이미 06628을 싣고 있어 ja만 정보가 누락된 상태였다.
    for (const locale of ["ko", "en", "ja"] as const) {
      expect(renderAt(locale).container.textContent, `${locale}: 우편번호 누락`).toContain("06628");
    }
  });

  it("ja 주소의 '길'은 표준 표기 キル를 쓴다 (ギル 아님)", () => {
    // 도로명주소 신청지원센터의 번역 규정이 카타카나 「キル」로 정했고 일본어권 번역·지도 서비스
    // (코네스트 등)도 「江南大路98キル 25」처럼 キル + 건물번호 앞 공백으로 표기한다.
    const ja = renderAt("ja").container.textContent ?? "";
    expect(ja).toContain("江南大路51キル 1");
    expect(ja).not.toContain("ギル");
  });

  // ── 개인정보 처리방침 개정 안내 모달 (HOM-66) ────────────────────────────
  //
  // 날짜는 공식 PDF(public/contact-us/FaindersAI_개인정보처리방침_2026-1.pdf)와 반드시 일치해야 한다.
  // 공고일 2026-08-21 / 시행일 2026-08-28. 개정 시 최소 7일 전 사전고지 요건 때문에 간격이 7일이다.
  // 초기 구현에 8월 12일(8/6 초안값)이 박혀 있었고 본문 안에서 "8. 13. 시행"과도 어긋났다 —
  // 실서비스에 나가면 법정 고지 오류이므로 날짜를 테스트로 못박는다.
  describe("개정 안내 모달", () => {
    function openModal(locale: keyof typeof MESSAGES) {
      const view = renderAt(locale);
      const buttons = view.container.querySelectorAll("button");
      const trigger = Array.from(buttons).find((b) =>
        /개인정보 처리방침|Privacy Policy|プライバシーポリシー/.test(b.textContent ?? ""),
      );
      expect(trigger, `${locale}: 개정 안내 모달 트리거 버튼을 찾지 못했다`).toBeTruthy();
      fireEvent.click(trigger!);
      return view;
    }

    it("시행일은 2026년 8월 28일, 공고일은 2026년 8월 21일이다", () => {
      const text = openModal("ko").container.textContent ?? "";
      expect(text).toContain("■ 시행일자 : 2026년 8월 28일");
      expect(text).toContain("개정된 처리방침은 2026년 8월 28일부터 적용되며");
      expect(text).toContain("▶ 개인정보 처리방침 (2026. 8. 28. 시행)");
      expect(text).toContain("2026년 8월 21일");
    });

    it("폐기된 날짜(8월 12일·8. 13.·8월 6일)가 남아 있지 않다", () => {
      const text = openModal("ko").container.textContent ?? "";
      for (const stale of ["8월 12일", "8. 13. 시행", "2026년 8월 6일"]) {
        expect(text, `폐기된 날짜 '${stale}'가 남아 있다`).not.toContain(stale);
      }
    });

    it("문의 연락처는 공식 PDF와 같은 contact@fainders.ai를 쓴다", () => {
      // 초안의 sbhong@는 2026-08-06 검토에서 contact@로 정정됐고 PDF에도 그렇게 반영됐다.
      const text = openModal("ko").container.textContent ?? "";
      expect(text).toContain("contact@fainders.ai");
      expect(text).not.toContain("sbhong@");
    });

    it("en·ja로 전환해도 개정 안내는 한국어로만 노출한다", () => {
      // 2026-08-25 김진영(개인정보 담당) — "개정 안내는 한국어로만 진행해주시면 됩니다".
      // 개정 고지는 한국 개인정보보호법상 의무이고 en/ja는 대상이 아니다.
      for (const locale of ["en", "ja"] as const) {
        const text = openModal(locale).container.textContent ?? "";
        expect(text).toContain("■ 시행일자 : 2026년 8월 28일");
        expect(text).not.toContain("Effective Date");
        expect(text).not.toContain("施行日：");
      }
    });
  });

  it("영상정보처리기기 방침 링크는 어느 로케일에도 남아 있지 않다 (HOM-61 회귀)", () => {
    for (const locale of ["ko", "en", "ja"] as const) {
      const { container } = renderAt(locale);
      expect(container.innerHTML).not.toContain("cctv");
    }
  });
});
