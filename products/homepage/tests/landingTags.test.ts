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

/**
 * Meta 도메인 인증 — 이 태그가 사라지면 인증이 풀려 iOS 사용자 전환이 광고 성과에서
 * 누락된다(Slack #prj_homepage 2026-08-05 김진영). 홈페이지 리뉴얼·수정 시에도 유지돼야 하므로
 * 테스트로 고정한다. Meta는 루트 도메인의 메인 페이지를 읽으므로 `/`가 서빙하는
 * public/index.html 이 1차 대상이고, 로케일 페이지에도 metadata로 함께 심는다.
 */
describe("Meta 도메인 인증 태그", () => {
  const DOMAIN_VERIFICATION = "tulmodqt0xe5lzjhkn95q89kd6cuqv";

  it("루트 페이지(public/index.html) head에 있다", () => {
    const html = read("index.html");
    expect(html).toContain(
      `<meta name="facebook-domain-verification" content="${DOMAIN_VERIFICATION}" />`,
    );
    expect(html.indexOf("facebook-domain-verification")).toBeLessThan(html.indexOf("</head>"));
  });

  it("로케일 레이아웃 metadata에도 선언돼 있다", () => {
    const layout = readFileSync(
      join(__dirname, "..", "app", "[locale]", "layout.tsx"),
      "utf-8",
    );
    expect(layout).toContain("facebook-domain-verification");
    expect(layout).toContain(DOMAIN_VERIFICATION);
  });
});

/**
 * 랜딩 폼 제출 안정성 (Slack #prj_homepage 2026-08-05 김진영 요청 2·3번)
 * - 중복 제출: 버튼을 await 전에 동기적으로 disabled 처리해야 연타가 막힌다.
 * - 전송 실패: res.ok 미확인 시 Zapier가 4xx/5xx를 줘도 성공으로 처리돼 문의가 조용히 유실된다.
 */
describe("랜딩 폼 제출 안정성", () => {
  for (const file of ["contact-bakery-vco.html", "contact-van-vco.html"]) {
    describe(file, () => {
      const html = read(file);

      it("await 이전에 버튼을 disabled 처리한다(연타 차단)", () => {
        const disableIndex = html.indexOf("btn.disabled = true");
        const fetchIndex = html.indexOf("await fetch(ZAPIER_URL");
        expect(disableIndex).toBeGreaterThan(-1);
        expect(disableIndex).toBeLessThan(fetchIndex);
      });

      it("HTTP 응답 상태를 확인해 실패를 throw 한다", () => {
        expect(html).toContain("if (!res.ok)");
      });

      it("전송 실패 시 버튼을 복구하고 실패 안내를 노출한다", () => {
        expect(html).toContain("submitError");
        const catchIndex = html.indexOf("} catch (err)");
        const restoreIndex = html.indexOf("btn.disabled = false");
        expect(restoreIndex).toBeGreaterThan(catchIndex);
      });

      it("감사 화면은 전송 성공 시에만 노출한다", () => {
        // 실패해도 감사 화면을 띄우던 기존 동작이 되살아나면 실패한다.
        expect(html).not.toContain("전송 성공/실패와 무관하게");
        const catchIndex = html.indexOf("} catch (err)");
        const thankIndex = html.indexOf(
          file.includes("bakery") ? "thankView').style.display = ''" : "success-view').style.display = 'block'",
        );
        expect(thankIndex).toBeGreaterThan(-1);
        expect(thankIndex).toBeLessThan(catchIndex);
      });
    });
  }
});
