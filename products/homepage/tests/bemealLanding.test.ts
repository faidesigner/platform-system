import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

/**
 * 비밀베이커리 점주 전용 안내 페이지 — https://www.fainders.ai/bemeal
 *
 * Next 라우트가 아니라 public/bemeal/ 정적 파일이다. 다음 두 가지가 조용히 깨지는 것을 막는다.
 *  1. 파일 자체 유실(덮어쓰기·정리 중 삭제) → 링크가 403으로 죽는다.
 *  2. OG 태그가 다른 호스트를 가리킴 → 카카오톡 미리보기 이미지가 안 뜬다.
 *     원본 HTML은 bemeal.fainders.ai 서브도메인 기준으로 만들어져 왔다(2026-11-27).
 *     시안을 다시 받아 덮어쓰면 그 값으로 되돌아가므로 여기서 고정한다.
 *
 * 경로 구조가 dir/index.html 인 이유: PRD는 CF 함수가 /bemeal·/bemeal/ → /bemeal.html 로 바꾸고
 * deploy.sh(FLAT_HTML)가 bemeal/index.html → bemeal.html 을 만든다. DEV는 S3 website 엔드포인트가
 * 디렉토리 index.html 을 서빙한다. 둘 다 같은 소스로 동작하는 구조는 이것뿐이다.
 */
const DIR = join(__dirname, "..", "public", "bemeal");
const PAGE_URL = "https://www.fainders.ai/bemeal";
const OG_IMAGE_PATH = join(DIR, "og.jpg");

const html = () => readFileSync(join(DIR, "index.html"), "utf-8");
const meta = (property: string) =>
  html().match(new RegExp(`<meta property="${property}" content="([^"]+)"`))?.[1];

/** JPEG SOF 마커에서 실제 픽셀 크기를 읽는다(카카오 권장 1200x630 고정용). */
function jpegSize(buf: Buffer): { width: number; height: number } {
  let i = 2;
  while (i < buf.length) {
    const marker = buf[i + 1];
    const len = buf.readUInt16BE(i + 2);
    if (marker >= 0xc0 && marker <= 0xc3) {
      return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
    }
    i += 2 + len;
  }
  throw new Error("SOF 마커 없음");
}

describe("bemeal 랜딩 (public/bemeal)", () => {
  it("진입 파일 index.html 과 og.jpg 가 있다", () => {
    expect(existsSync(join(DIR, "index.html"))).toBe(true);
    expect(existsSync(OG_IMAGE_PATH)).toBe(true);
  });

  it("og:url 이 www.fainders.ai/bemeal 이다", () => {
    expect(meta("og:url")).toBe(PAGE_URL);
  });

  it("og:image 는 같은 디렉토리 og.jpg 의 절대 URL 이다", () => {
    // 카카오 스크래퍼는 상대경로를 못 읽는다 → 반드시 https 절대 URL.
    expect(meta("og:image")).toMatch(new RegExp(`^${PAGE_URL}/og\\.jpg(\\?v=\\d+)?$`));
  });

  it("다른 호스트(bemeal.fainders.ai 등)를 가리키는 URL 이 없다", () => {
    expect(html()).not.toContain("bemeal.fainders.ai");
  });

  it("og:image:width/height 선언이 실제 이미지 크기와 같다", () => {
    const { width, height } = jpegSize(readFileSync(OG_IMAGE_PATH));
    expect({ width, height }).toEqual({ width: 1200, height: 630 });
    expect(meta("og:image:width")).toBe(String(width));
    expect(meta("og:image:height")).toBe(String(height));
  });

  /**
   * GA4 — 다른 랜딩(contact-bakery-vco·contact-van-vco)과 같은 측정 ID·이벤트 체계(2026-11-27 요청).
   * 받은 원본에는 태그가 없었다. 시안을 다시 받아 덮어쓰면 통째로 사라지므로 고정한다.
   */
  describe("GA4 측정", () => {
    const GA_ID = "G-GCQKJ5TF6R";
    const head = () => html().slice(0, html().indexOf("</head>"));
    /** 클릭 핸들러 블록: 해당 id 요소를 찾는 줄부터 다음 id 조회 전까지. */
    const handlerFor = (id: string) => {
      const h = html();
      const start = h.indexOf(`getElementById('${id}')`);
      return start < 0 ? "" : h.slice(start, start + 1200);
    };

    it("gtag 로더와 config 가 head 안에 한 번만 있다", () => {
      expect(head()).toContain(`gtag/js?id=${GA_ID}`);
      expect(head()).toContain(`gtag('config', '${GA_ID}')`);
      expect(html().split(`gtag('config'`).length - 1).toBe(1);
    });

    it("첫 진입 UTM 을 sessionStorage 에 보존한다(랜딩 공통 방식)", () => {
      expect(head()).toContain("sessionStorage.setItem(k, v)");
      expect(head()).toContain("function getUTM()");
    });

    it("카톡 상담 버튼: kakao_inquiry_click(form_id bemeal) + kakao_contact_click", () => {
      expect(html()).toMatch(/id="kakaoInquiryBtn"[^>]*href="https:\/\/pf\.kakao\.com\//);
      const h = handlerFor("kakaoInquiryBtn");
      expect(h).toContain("gtag('event', 'kakao_inquiry_click'");
      expect(h).toContain("form_id:  'bemeal'");
      expect(h).toContain("gtag('event', 'kakao_contact_click'");
    });

    it("상담 신청서 버튼: lead_acquisition_click(location landing_bemeal)", () => {
      expect(html()).toMatch(/id="inquiryFormBtn"[^>]*href="https:\/\/www\.fainders\.ai\/contact-bakery-vco#inquiry"/);
      const h = handlerFor("inquiryFormBtn");
      expect(h).toContain("gtag('event', 'lead_acquisition_click'");
      expect(h).toContain("location: 'landing_bemeal'");
    });

    it("Meta 픽셀은 넣지 않는다(베이커리 랜딩 한정 결정)", () => {
      expect(html()).not.toContain("fbq(");
    });
  });

  it("og:title·og:description 이 비어 있지 않다", () => {
    expect(meta("og:title")?.trim()).toBeTruthy();
    expect(meta("og:description")?.trim()).toBeTruthy();
  });
});
