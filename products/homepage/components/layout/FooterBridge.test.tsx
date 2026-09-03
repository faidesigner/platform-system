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
 * - 이메일: ko·en은 본사(contact@), ja는 **일본 법인 블록 안**에 일본팀 주소(contact_jp@)
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

  // 규칙 이력 — 세 번 바뀌었다. 방어 대상(로케일 무관 하드코딩 회귀)은 계속 같다.
  //   ① 최초: ja 이메일 = 일본팀 주소(contact_jp@)
  //   ② 2026-08-28 HOM-101(JP-BD, Hyeyoung Shin): **ja는 이메일 행 자체를 미노출**
  //      — 본사 주소가 일본 법인 정보 위에 놓여 위계가 어색했다.
  //   ③ 2026-09-03(같은 요청자): **일본 법인 블록 안**에 일본 법인 전용 주소를 다시 노출.
  //      ②의 위계 문제는 배치로 해소되고, 노출되는 주소도 본사가 아닌 contact_jp@다.
  // 지금 지켜야 하는 것: **본사 주소(contact@)는 ja에 나오면 안 된다** — ②가 아직 유효한 부분.
  it("이메일은 ko·en이 본사 주소, ja는 일본 법인 주소만 노출한다", () => {
    expect(renderAt("ko").container.textContent).toContain("contact@fainders.ai");
    expect(renderAt("en").container.textContent).toContain("contact@fainders.ai");
    const ja = renderAt("ja").container.textContent ?? "";
    expect(ja, "ja에 일본 법인 주소가 보여야 한다").toContain("contact_jp@fainders.ai");
    expect(ja, "ja에 본사 주소가 새어나오면 안 된다").not.toContain("contact@fainders.ai");
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

    it("en·ja에는 개정 안내를 아예 띄우지 않는다 (HOM-101로 규칙 변경)", () => {
      // 이전 규칙(2026-08-25 김진영): "개정 안내는 한국어로만 진행" → en·ja에도 **한국어 모달**이 떴다.
      // 변경 규칙(2026-08-28 김진영, HOM-101): "영어·일본어는 한국어 공지 삭제 후 바로
      //   개인정보 처리방침 페이지로 이동".
      // 이유는 같다 — 개정 고지는 한국 개인정보보호법상 의무이고 en·ja는 대상이 아니다.
      // 다만 읽을 수 없는 한국어 안내를 띄우느니 문서로 직행시키는 편이 낫다는 판단이다.
      // 번역본을 만들지 않는다는 원칙은 그대로다(법무 미검토 문구 노출·시행일 정정 지점 증가 방지).
      for (const locale of ["en", "ja"] as const) {
        const { container } = renderAt(locale);
        expect(container.textContent, `${locale}`).not.toContain("개정 안내");
        expect(container.textContent, `${locale}`).not.toContain("■ 시행일자");
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

/**
 * HOM-101 — JP-BD 요청사항 (2026-08-28 Slack #prj_homepage, Hyeyoung Shin / 김진영 확정).
 *
 * ❶ 개인정보 처리방침 노출 — 김진영(개인정보 담당) 2026-08-28 12:01 확정:
 *      "한국어 — 개정 공지 유지 / 영어, 일본어 — 한국어 공지 삭제 후 바로 개인정보 처리방침 페이지로 이동"
 *    개정 고지는 한국 개인정보보호법상 의무이고 en·ja는 대상이 아니다. 다만 en·ja 사용자가
 *    한국어 공지 모달을 보게 되는 것은 막아야 하므로, 그 로케일에서는 **로케일별 처리방침 문서로 직행**한다.
 *
 *    ⚠️ 모달만 없애면 안 된다 — 그러면 하드코딩된 한국어 PDF 폴백으로 떨어진다.
 *    Hyeyoung Shin이 지적한 문제가 정확히 그것이다("[개인정보 처리방침] 페이지가 한국어로만 나와서").
 *    로케일별 문서 경로를 함께 주입해야 한다.
 *
 * ❷ footer 일본법인 정보 — Hyeyoung Shin 2026-08-28 11:30:
 *      "메일주소를 삭제하고 법인명(日本法人도 삭제)을 한국 법인과 동일하게 볼드처리하고
 *       같은 내용으로 같은 위치에 정렬하는 편이 일관성 있고 깔끔해 보일 것 같습니다."
 *    요청 원문 형태:
 *      株式会社ファインダーズＡＩジャパン   ← 볼드, 라벨 없음
 *      代表取締役 Jimin Lee（イ・ジミン）
 *      電話 03-6821-7191
 *      所在地 〒135-0061 東京都江東区豊洲2-1-9 豊洲セイルパークビル2階
 */
describe("FooterBridge — JP-BD 요청 (HOM-101)", () => {
  describe("❶ 개인정보 처리방침 노출", () => {
    it("ko는 개정 안내 모달을 띄운다", () => {
      const { container } = renderAt("ko");
      const trigger = [...container.querySelectorAll("button, a")].find((el) =>
        /개인정보\s*처리방침/.test(el.textContent ?? ""),
      );
      expect(trigger, "ko 개인정보 처리방침 트리거").toBeTruthy();
      expect(trigger!.tagName).toBe("BUTTON"); // 링크가 아니라 모달 트리거
      fireEvent.click(trigger!);
      expect(container.textContent).toContain("개인정보 처리방침 개정 안내");
    });

    it("en·ja는 모달 없이 처리방침 문서로 직행한다", () => {
      for (const locale of ["en", "ja"] as const) {
        const { container } = renderAt(locale);
        const trigger = [...container.querySelectorAll("button, a")].find((el) =>
          /Privacy Policy|プライバシーポリシー/.test(el.textContent ?? ""),
        );
        expect(trigger, `${locale} 처리방침 트리거`).toBeTruthy();
        expect(trigger!.tagName, `${locale}는 모달이 아니라 링크여야 한다`).toBe("A");
        // 한국어 개정 공지가 노출되면 안 된다
        expect(container.textContent).not.toContain("개정 안내");
      }
    });

    it("en·ja 처리방침 링크는 해당 로케일 문서를 가리킨다 (한국어 PDF 폴백 금지)", () => {
      const EXPECTED: Record<string, string> = {
        en: "Privacy%20Policy_2026-1.pdf",
        ja: "%E5%80%8B%E4%BA%BA%E6%83%85%E5%A0%B1%E4%BF%9D%E8%AD%B7%E6%96%B9%E9%87%9D_2026-1.pdf",
      };
      for (const locale of ["en", "ja"] as const) {
        const { container } = renderAt(locale);
        const link = [...container.querySelectorAll("a")].find((el) =>
          /Privacy Policy|プライバシーポリシー/.test(el.textContent ?? ""),
        );
        const href = decodeURI(link?.getAttribute("href") ?? "");
        expect(href, `${locale} 처리방침 href`).toContain(decodeURI(EXPECTED[locale]));
        // 구버전 한국어 PDF 하드코딩 폴백으로 떨어지면 안 된다
        expect(href).not.toContain("/document/privacy-policy.pdf");
      }
    });

    it("처리방침 링크는 URL 인코딩되어 있다 (CloudFront가 raw 공백을 거부한다)", () => {
      // en 파일명에 공백이 있다. 로컬 정적 서버는 raw 공백도 200을 주지만 CloudFront는 거부한다
      // (실측: 공백 그대로 HTTP 000 / %20 HTTP 200). 로컬만 보면 통과하고 배포에서만 깨진다.
      for (const locale of ["en", "ja"] as const) {
        const { container } = renderAt(locale);
        const link = [...container.querySelectorAll("a")].find((el) =>
          /Privacy Policy|プライバシーポリシー/.test(el.textContent ?? ""),
        );
        const href = link?.getAttribute("href") ?? "";
        expect(href, `${locale} href에 raw 공백이 있으면 CloudFront에서 404`).not.toMatch(/ /);
        expect(href, `${locale} href`).toMatch(/^\/contact-us\/[^\s]+\.pdf$/);
      }
    });

    it("처리방침 링크는 첫 페이지부터 연다 (#page 지정 금지)", () => {
      // Hyeyoung Shin: "개인정보 처리방침 페이지가 열렸을 때 1페이지부터 표시되면 좋겠다(현재 4페이지)".
      // #page=N 은 '맞춤형 광고 설정'(해당 조항으로 점프) 전용이다.
      for (const locale of ["en", "ja"] as const) {
        const { container } = renderAt(locale);
        const link = [...container.querySelectorAll("a")].find((el) =>
          /Privacy Policy|プライバシーポリシー/.test(el.textContent ?? ""),
        );
        expect(link?.getAttribute("href") ?? "", `${locale}`).not.toContain("#page=");
      }
    });
  });

  describe("❷ footer 일본법인 정보", () => {
    it("일본 법인명을 라벨 없이 볼드로 노출한다 (日本法人 라벨 제거)", () => {
      const { container } = renderAt("ja");
      const name = "株式会社ファインダーズＡＩジャパン";
      expect(container.textContent).toContain(name);
      expect(container.textContent, "日本法人 라벨은 제거한다").not.toContain("日本法人");

      // 한국 법인명과 동일한 렌더(볼드 헤더)여야 한다 — 같은 클래스를 쓰는지로 확인
      const krName = [...container.querySelectorAll("p")].find(
        (p) => p.textContent?.trim() === "Fainders.ai Inc.",
      );
      const jpName = [...container.querySelectorAll("p")].find((p) => p.textContent?.trim() === name);
      expect(krName, "한국 법인명 헤더").toBeTruthy();
      expect(jpName, "일본 법인명 헤더").toBeTruthy();
      expect(jpName!.className).toContain("font-bold");
      expect(jpName!.className).toBe(krName!.className);
    });

    it("일본 법인 소재지를 노출한다", () => {
      const text = renderAt("ja").container.textContent ?? "";
      expect(text).toContain("所在地");
      expect(text).toContain("〒135-0061 東京都江東区豊洲2-1-9 豊洲セイルパークビル2階");
    });

    it("ja 번들에 본사 주소는 없고 일본 법인 주소만 있다", () => {
      // next-intl은 메시지 번들을 HTML script 페이로드로 직렬화하므로, 번들에 남은 키는
      // **페이지 소스에 그대로 실린다**(스팸 크롤러는 렌더 결과가 아니라 소스를 긁는다).
      // 2026-08-28에는 그래서 ja에서 메일을 통째로 뺐다.
      // 2026-09-03 요청으로 **일본 법인 전용 주소만** 되살렸다 — 소스 노출은 그 결정의
      // 알려진 대가이고, 사용자가 감수하기로 확인했다. 되돌릴 때는 이 맥락을 함께 볼 것.
      // 본사 주소(footer.emailValue)는 계속 빠져 있어야 한다.
      const footer = jaMessages.footer as Record<string, unknown>;
      expect(footer.emailValue, "ja footer.emailValue(본사)는 계속 미노출").toBeUndefined();
      expect(JSON.stringify(jaMessages), "본사 주소 유입").not.toContain("contact@fainders.ai");
      expect(JSON.stringify(jaMessages), "일본 법인 주소 누락").toContain("contact_jp@fainders.ai");
    });

    it("일본 법인 메일은 소재지 **아래**, 같은 블록 안에 온다", () => {
      // 배치가 규칙의 핵심이다 — 본사 정보 위/아래가 아니라 일본 법인 블록 안이어야
      // 2026-08-28에 지적된 위계 문제가 재발하지 않는다.
      const text = renderAt("ja").container.textContent ?? "";
      expect(text).toContain("メールでのお問い合わせ");
      expect(text).toContain("contact_jp@fainders.ai");
      const addrAt = text.indexOf("〒135-0061");
      const mailAt = text.indexOf("contact_jp@fainders.ai");
      expect(addrAt, "일본 법인 소재지를 찾지 못했다").toBeGreaterThan(-1);
      expect(mailAt, "메일이 소재지보다 앞에 온다").toBeGreaterThan(addrAt);
      // ko·en은 그대로 유지된다
      expect(renderAt("ko").container.textContent).toContain("@fainders.ai");
      expect(renderAt("en").container.textContent).toContain("@fainders.ai");
    });

    it("일본 법인 대표·전화는 유지한다", () => {
      const text = renderAt("ja").container.textContent ?? "";
      expect(text).toContain("Jimin Lee（イ・ジミン）");
      expect(text).toContain("03-6821-7191");
    });
  });
});
