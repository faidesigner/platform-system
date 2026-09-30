import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  PRIVACY_COOKIE_LOCALES,
  PRIVACY_COOKIE_SPECS,
  checkLanding,
  pdfPageHasClause,
  pdfUrl,
  POSITION_WORDS,
  renderPrivacyCookiePage,
  // @ts-expect-error — 생성기와 **같은 모듈**을 쓴다. 여기서 TS 사본을 만들면 드리프트를 못 잡는다.
} from "@/scripts/lib/privacyCookiePages.mjs";

const PUBLIC_DIR = path.resolve(__dirname, "..", "public", "privacy-cookie");
const PUBLIC_ROOT = path.resolve(__dirname, "..", "public");

const hasPdfToText = (() => {
  try {
    execFileSync("pdftotext", ["-v"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
})();
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
        const targets = [...html().matchAll(/\/contact-us\/[^"#]*#page=\d+(?:&zoom=[\d,]+)?/g)].map((m) => m[0]);
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

  describe("쪽 안 착지 위치 (zoom 세로 위치 + 안내문 fallback)", () => {
    for (const locale of PRIVACY_COOKIE_LOCALES) {
      const spec = PRIVACY_COOKIE_SPECS[locale];
      it(`${locale}: 링크가 page와 세로 위치를 함께 싣는다`, () => {
        // Adobe PDF Open Parameters `zoom=scale,left,top` — Chrome·Firefox(pdf.js)가 모두 해석한다.
        expect(pdfUrl(spec, { withPage: true })).toMatch(new RegExp(`#page=${spec.page}&zoom=100,0,${spec.viewTop}$`));
      });

      it(`${locale}: 세로 위치를 무시하는 브라우저용 안내문이 쪽 번호와 위치어를 담는다`, () => {
        // Safari 등은 zoom을 무시하고 해당 쪽 맨 위에 머문다 — 그때 어디를 보면 되는지 글로 알려 준다.
        expect(spec.hint).toContain(String(spec.page));
        expect(spec.hint).toContain(POSITION_WORDS[locale][spec.position]);
        expect(read(locale)).toContain(spec.hint);
      });
    }

    const bbox = (h: number, lines: [number, string][]) =>
      `<page width="595" height="${h}">` +
      lines.map(([y, t]) => `<line xMin="72" yMin="${y}" xMax="500" yMax="${y + 12}"><word>${t}</word></line>`).join("") +
      `</page>`;
    const spec = { page: 5, viewTop: 324, position: "bottom", clauseNeedle: "第8条 個人関連情報" };

    it("조항이 세로 위치 바로 아래에 있고 위치어가 맞으면 통과한다", () => {
      expect(checkLanding(bbox(842, [[180, "物理的"], [542, "第 8 条 個人関連情報（Cookie 等）"]]), spec)).toEqual([]);
    });

    it("PDF 교체로 조항이 올라가면 세로 위치 어긋남을 잡는다", () => {
      // 조항이 300pt로 올라가면 viewTop 324(= 위에서 518pt)가 조항 아래를 가리켜 제목이 화면 밖으로 밀린다.
      const errs = checkLanding(bbox(842, [[300, "第8条 個人関連情報"]]), { ...spec, position: "middle" });
      expect(errs.join()).toMatch(/viewTop/);
    });

    it("위치어가 실측과 다르면 잡는다 — 안내문이 거짓말을 하게 두지 않는다", () => {
      const errs = checkLanding(bbox(842, [[542, "第8条 個人関連情報"]]), { ...spec, position: "middle" });
      expect(errs.join()).toMatch(/position/);
    });

    it("조항 문자열이 없으면 잡는다", () => {
      expect(checkLanding(bbox(842, [[100, "第3条"]]), spec).join()).toMatch(/없습니다/);
    });
  });

  describe("pdfPageHasClause", () => {
    it("추출기가 CJK와 숫자 사이에 넣는 공백을 무시한다", () => {
      // Word 출력 PDF는 pdftotext가 `第 8 条`로 뽑는다(HOM-107, 2026-09-30).
      // 공백을 한 칸으로 줄이기만 하던 비교는 정상 PDF를 "조항 없음"으로 막았다.
      expect(pdfPageHasClause("第 8 条 個人関連情報（Cookie 等）の取扱い", "第8条 個人関連情報")).toBe(true);
      expect(pdfPageHasClause("第8条\n個人関連情報", "第8条 個人関連情報")).toBe(true);
    });

    it("다른 조항 페이지는 통과시키지 않는다", () => {
      expect(pdfPageHasClause("第 3 条 個人情報の取得", "第8条 個人関連情報")).toBe(false);
    });
  });

  /**
   * 체크인된 PDF 실물의 `page`쪽에 조항이 있는지 본다. deploy.sh의 게이트와 같은 검사를
   * `pnpm test`로 당겨 온 것 — PDF 교체로 쪽수가 바뀌면(2026-08-25 ja 7→5, 09-15 en 10→9,
   * 09-30 ja 5→8) 배포 직전이 아니라 커밋 전에 걸린다.
   */
  describe.skipIf(!hasPdfToText)("PDF 실물의 조항 착지", () => {
    for (const locale of PRIVACY_COOKIE_LOCALES) {
      const spec = PRIVACY_COOKIE_SPECS[locale];
      it(`${locale}: ${spec.page}쪽에 "${spec.clauseNeedle}"가 있다`, () => {
        const pdfPath = path.join(PUBLIC_ROOT, decodeURIComponent(pdfUrl(spec)));
        const text = execFileSync(
          "pdftotext",
          ["-enc", "UTF-8", "-f", String(spec.page), "-l", String(spec.page), pdfPath, "-"],
          { encoding: "utf8" },
        );
        expect(pdfPageHasClause(text, spec.clauseNeedle), "scripts/lib/privacyCookiePages.mjs 의 page를 맞추세요").toBe(true);
      });

      it(`${locale}: 세로 위치(viewTop ${spec.viewTop})·위치어(${spec.position})가 실측과 맞다`, () => {
        const pdfPath = path.join(PUBLIC_ROOT, decodeURIComponent(pdfUrl(spec)));
        const html = execFileSync(
          "pdftotext",
          ["-bbox-layout", "-f", String(spec.page), "-l", String(spec.page), pdfPath, "-"],
          { encoding: "utf8" },
        );
        expect(checkLanding(html, spec)).toEqual([]);
      });
    }
  });
});
