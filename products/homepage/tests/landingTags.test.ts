import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

/**
 * 랜딩 페이지는 Next 라우트가 아닌 public/ 정적 HTML이라 컴포넌트 테스트 범위 밖이다.
 * 파일을 다시 생성·덮어쓸 때 측정 태그가 조용히 유실되면 광고 성과 집계가 그대로 끊기므로,
 * 필수 태그 존재를 문자열로 고정한다.
 *
 * (테스트 파일을 public/ 안에 두면 배포 산출물 out/ 로 그대로 복사돼 외부에 노출되므로 tests/ 에 둔다.)
 */
const LANDING_DIR = join(__dirname, "..", "public");
const read = (file: string) => readFileSync(join(LANDING_DIR, file), "utf-8");

const GA_MEASUREMENT_ID = "G-GCQKJ5TF6R";
const META_PIXEL_ID = "1050256220905747";

describe("랜딩 페이지 측정 태그", () => {
  for (const file of ["contact-bakery-vco.html", "contact-van-vco.html"]) {
    it(`${file}: GA4 태그가 살아 있다`, () => {
      const html = read(file);
      expect(html).toContain(`gtag/js?id=${GA_MEASUREMENT_ID}`);
      expect(html).toContain(`gtag('config', '${GA_MEASUREMENT_ID}')`);
      expect(html).toContain("gtag('event', 'form_submitted'");
    });
  }

  // Meta 픽셀은 베이커리 랜딩 1개 페이지 한정 요청(Slack #prj_homepage 2026-08-04, 김진영).
  // van 랜딩까지 확대되면 아래 van 케이스를 픽셀 검증으로 승격하고 태그를 공용 스크립트로 분리한다.
  describe("Meta 픽셀 (contact-bakery-vco.html 한정)", () => {
    const html = read("contact-bakery-vco.html");

    it("픽셀 기본 코드와 PageView가 설치돼 있다", () => {
      expect(html).toContain("connect.facebook.net/en_US/fbevents.js");
      expect(html).toContain(`fbq('init', '${META_PIXEL_ID}')`);
      expect(html).toContain("fbq('track', 'PageView')");
    });

    it("폼 제출 성공 시점에 Lead 이벤트가 발생한다", () => {
      expect(html).toContain("fbq('track', 'Lead')");
      // Lead는 Zapier 전송 성공 후(GA form_submitted와 동일 시점)에만 발생해야 한다.
      // catch 블록이나 감사화면 전환부로 옮겨지면 전송 실패 리드까지 전환으로 집계된다.
      const leadIndex = html.indexOf("fbq('track', 'Lead')");
      const gaIndex = html.indexOf("gtag('event', 'form_submitted'");
      const catchIndex = html.indexOf("} catch (err)");
      expect(leadIndex).toBeGreaterThan(gaIndex);
      expect(leadIndex).toBeLessThan(catchIndex);
    });

    it("noscript 폴백은 head가 아니라 body 안에 있다", () => {
      // head 내 noscript는 link/style/meta만 허용된다(HTML 스펙). img를 넣으면 파서가 head를
      // 강제 종료해 이후 태그 파싱 순서가 의도와 달라진다.
      const headEnd = html.indexOf("</head>");
      const noscriptIndex = html.indexOf("facebook.com/tr?id=");
      expect(noscriptIndex).toBeGreaterThan(headEnd);
    });

    it("픽셀이 중복 설치되지 않았다", () => {
      const initCount = html.split("fbq('init'").length - 1;
      expect(initCount).toBe(1);
    });
  });

  it("van 랜딩에는 Meta 픽셀이 설치되지 않았다(요청 범위 밖)", () => {
    expect(read("contact-van-vco.html")).not.toContain("fbq(");
  });
});
