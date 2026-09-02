import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  PRIVACY_COOKIE_LOCALES,
  PRIVACY_COOKIE_SPECS,
  pdfUrl,
  renderPrivacyCookiePage,
  // @ts-expect-error — 생성기와 **같은 모듈**을 쓴다. 여기서 TS 사본을 만들면 드리프트를 못 잡는다.
} from "@/scripts/lib/privacyCookiePages.mjs";

const PUBLIC_DIR = path.resolve(__dirname, "..", "public", "privacy-cookie");
const read = (locale: string) =>
  readFileSync(path.join(PUBLIC_DIR, `${locale}.html`), "utf8");

describe("privacy-cookie 중간 페이지", () => {
  it("체크인된 HTML이 생성기 출력과 일치한다", () => {
    // 손으로 고치면 세 파일이 조용히 갈라진다(실제 사고: ja 페이지 번호 오착지).
    for (const locale of PRIVACY_COOKIE_LOCALES) {
      expect(read(locale), `${locale}.html — node scripts/gen-privacy-cookie.mjs 를 다시 실행할 것`)
        .toBe(renderPrivacyCookiePage(PRIVACY_COOKIE_SPECS[locale]));
    }
  });

  for (const locale of PRIVACY_COOKIE_LOCALES) {
    const spec = PRIVACY_COOKIE_SPECS[locale];
    const html = () => read(locale);

    describe(locale, () => {
      /**
       * 이 페이지의 회귀 본체다. `<embed>`만 있으면 인라인 PDF 뷰어가 없는 UA
       * (iOS 전 브라우저·Chrome for Android)에서 **빈 화면**이 된다 —
       * 데스크톱만 보고 통과시킨 것이 2026-09-02 모바일/데스크톱 불일치의 원인이었다.
       */
      it("인라인 PDF 없이도 원문에 닿는 경로가 있다", () => {
        const h = html();
        // ① JS 없이도 보이는 링크
        expect(h).toContain(`<a href="${pdfUrl(spec, { withPage: true })}"`);
        // ② 인라인 PDF 미지원 UA는 원문으로 직행
        expect(h).toContain("navigator.pdfViewerEnabled");
        expect(h).toContain("location.replace(");
      });

      it("embed·폴백 링크·리다이렉트가 모두 같은 PDF를 가리킨다", () => {
        const href = pdfUrl(spec, { withPage: true });
        const targets = [...html().matchAll(/\/contact-us\/[^"#]*#page=\d+/g)].map((m) => m[0]);
        expect(targets.length).toBeGreaterThanOrEqual(3);
        expect(new Set(targets)).toEqual(new Set([href]));
      });

      it("PDF 경로가 URL 인코딩돼 있다", () => {
        // CloudFront는 raw 공백 URL을 거부한다(en 파일명에 공백이 있다).
        // 로컬 정적 서버는 관대해서 여기서 안 막으면 배포에서만 깨진다.
        expect(html()).not.toMatch(/src="\/contact-us\/[^"]* [^"]*"/);
        expect(pdfUrl(spec)).not.toContain(" ");
      });
    });
  }

  it("조항 번호가 로케일별로 서로 다르다는 사실을 고정한다", () => {
    // ko/en은 2조, ja는 8조다. 한 로케일 spec을 다른 곳에 복붙하면 여기서 걸린다.
    expect(PRIVACY_COOKIE_SPECS.ja.clauseNeedle).toContain("第8条");
    expect(PRIVACY_COOKIE_SPECS.ja.pdf).not.toBe(PRIVACY_COOKIE_SPECS.ko.pdf);
    expect(new Set(PRIVACY_COOKIE_LOCALES.map((l: string) => PRIVACY_COOKIE_SPECS[l].pdf)).size).toBe(
      PRIVACY_COOKIE_LOCALES.length,
    );
  });
});
