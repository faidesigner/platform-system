/**
 * `/privacy-cookie/{ko,en,ja}.html` 의 **단일 출처**.
 *
 * 이 페이지들은 footer '맞춤형 광고 설정' 링크의 도착지다. 개인정보 처리방침 PDF의
 * 쿠키·맞춤형 광고 조항 페이지로 바로 보내는 것이 목적이며, 그 방식이 두 번 문제를 냈다.
 *
 *   ① `<a href="....pdf#page=N" target="_blank">` 직접 링크
 *      → Chrome 내장 PDF 뷰어가 `#page=N` fragment를 무시해 항상 1페이지에서 열렸다.
 *      그래서 `<embed>` 렌더링 경로를 쓰는 중간 HTML로 우회했다.
 *
 *   ② `<embed type="application/pdf">` 단독
 *      → **인라인 PDF 뷰어가 없는 브라우저에서는 아무것도 그리지 않는다.**
 *      HTML 표준상 embed/object의 PDF 표시 여부는 `navigator.pdfViewerEnabled`가 그대로
 *      드러내는 UA 능력이고, iOS의 모든 브라우저와 Chrome for Android는 이 값이 false다.
 *      결과적으로 **데스크톱에서는 조항이 열리고 모바일에서는 빈 화면**이 됐다
 *      (2026-09-02 김성태 "광고설정 링크 모바일일 때랑 데스크톱일 때랑 다르다").
 *
 * 그래서 이 렌더러는 두 경로를 모두 보장한다.
 *   - 인라인 PDF가 가능한 UA: 기존대로 `<embed ...#page=N>`로 조항 페이지를 그린다.
 *   - 불가능한 UA: 즉시 PDF 원문으로 `location.replace` — 빈 화면 대신 문서를 준다.
 *   - JS가 꺼졌거나 위 판별이 틀린 경우: 상단 바의 '원문 열기' 링크가 **항상** 살아 있다.
 *     탐지에 실패해도 막다른 길이 되지 않게 하는 것이 이 바의 존재 이유다.
 *
 * ⚠️ `page`는 PDF 페이지네이션에 직접 결합돼 있다. PDF를 재생성·교체하면 페이지 수가 바뀌어
 *    앵커가 엉뚱한 조항에 착지한다(실제 사고: 2026-08-25 ja PDF를 7→5페이지로 재생성했더니
 *    #page=5가 第10条 お問い合わせ窓口로 갔다). `clauseNeedle`은 그 착지 지점을 기계로
 *    검증하기 위한 것이다 — `scripts/check-privacy-cookie.mjs`가 배포 전에 실제 PDF의
 *    해당 페이지 텍스트에서 이 문자열을 찾는다.
 *
 * ⚠️ 조항 번호는 로케일별로 다르다 — ko/en은 2조, ja는 8조다. 복붙하지 말 것.
 */

/** @typedef {{ lang: string, pdf: string, page: number, title: string, openLabel: string, clauseNeedle: string }} PrivacyCookieSpec */

/** @type {Record<string, PrivacyCookieSpec>} */
export const PRIVACY_COOKIE_SPECS = {
  ko: {
    lang: "ko",
    pdf: "/contact-us/FaindersAI_개인정보처리방침_2026-1.pdf",
    page: 3,
    title: "개인정보 처리방침 — 쿠키 및 행태정보 (제2조)",
    openLabel: "원문 PDF 열기",
    clauseNeedle: "맞춤형 광고 수신 거부",
  },
  en: {
    lang: "en",
    pdf: "/contact-us/FaindersAI_Privacy Policy_2026-1.pdf",
    page: 4,
    title: "Privacy Policy — Cookies & Behavioral Information (Article 2)",
    openLabel: "Open the full PDF",
    clauseNeedle: "opt out of personalized advertising",
  },
  ja: {
    lang: "ja",
    pdf: "/contact-us/FaindersAI_プライバシーポリシー_個人情報保護方針_2026-1.pdf",
    page: 4,
    title: "プライバシーポリシー — 個人関連情報（Cookie等）の取扱い（第8条）",
    openLabel: "PDF 全文を開く",
    clauseNeedle: "第8条 個人関連情報",
  },
};

export const PRIVACY_COOKIE_LOCALES = Object.freeze(Object.keys(PRIVACY_COOKIE_SPECS));

/**
 * PDF 경로를 URL로 인코딩한다.
 *
 * ⚠️ 필수: en 파일명에 **공백**이 있다. 로컬 정적 서버는 관대해서 raw 공백도 열리지만
 *    CloudFront는 거부한다(실측: 공백 그대로 HTTP 000 / %20 HTTP 200).
 *    즉 로컬·테스트만 보면 통과하고 배포에서만 깨지는 종류다.
 */
export function pdfUrl(spec, { withPage = false } = {}) {
  return encodeURI(spec.pdf) + (withPage ? `#page=${spec.page}` : "");
}

const escapeHtml = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** 로케일 spec → 완성된 HTML 문자열. 생성기와 테스트가 같은 함수를 쓴다. */
export function renderPrivacyCookiePage(spec) {
  const href = pdfUrl(spec, { withPage: true });
  const title = escapeHtml(spec.title);
  const openLabel = escapeHtml(spec.openLabel);

  return `<!DOCTYPE html>
<!--
  ⚠️ 이 파일은 생성물이다. 직접 고치지 말 것.
     출처: scripts/lib/privacyCookiePages.mjs
     재생성: node scripts/gen-privacy-cookie.mjs
     체크인된 파일과 생성 결과가 다르면 privacyCookiePages.test.ts가 실패한다.
-->
<html lang="${spec.lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex,nofollow">
  <title>${title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; overflow: hidden; }
    body { display: flex; flex-direction: column; background: #fff;
           font: 400 13px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
                 "Helvetica Neue", "Apple SD Gothic Neo", "Noto Sans KR", sans-serif; }
    /* 상단 바는 조건 없이 항상 렌더한다 — 인라인 PDF 판별이 틀려도 원문으로 갈 길을 남긴다. */
    .bar { display: flex; align-items: center; justify-content: space-between; gap: 16px;
           flex: 0 0 auto; padding: 12px 16px; background: #f4f4f2;
           border-bottom: 1px solid #e2e2de; color: #55554f; }
    .bar strong { font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .bar a { flex: 0 0 auto; color: #1b1b19; text-decoration: underline; }
    embed { display: block; flex: 1 1 auto; width: 100%; }
  </style>
</head>
<body>
  <div class="bar">
    <strong>${title}</strong>
    <a href="${href}" target="_blank" rel="noopener noreferrer">${openLabel}</a>
  </div>
  <embed src="${href}" type="application/pdf">
  <script>
    /* 인라인 PDF 뷰어가 없으면 embed는 빈 화면이 된다(iOS 전 브라우저·Chrome for Android).
       그런 UA는 조항 페이지를 포기하고 원문으로 직행시킨다 — 빈 화면보다 낫다.
       replace()라서 뒤로 가기 시 이 중간 페이지가 끼지 않는다. */
    (function () {
      var canInline = typeof navigator.pdfViewerEnabled === "boolean"
        ? navigator.pdfViewerEnabled
        : !!(navigator.mimeTypes && navigator.mimeTypes["application/pdf"]);
      if (!canInline) location.replace(${JSON.stringify(href)});
    })();
  </script>
</body>
</html>
`;
}
