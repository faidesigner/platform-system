#!/usr/bin/env node
/**
 * '맞춤형 광고 설정' 도착지 배포 게이트.
 *
 * 이 링크는 개인정보 처리방침 PDF의 **쿠키·맞춤형 광고 조항 페이지**로 보내는 것이 목적인데,
 * 조용히 깨지는 경로가 세 가지 있었다.
 *
 *   ① PDF 재생성으로 페이지 수가 바뀜 → `#page=N`이 엉뚱한 조항에 착지
 *      (실제 사고: 2026-08-25 ja PDF를 7→5페이지로 재생성했더니 #page=5가 第10条로 갔다)
 *   ② PDF 파일명 변경·유실 → 링크가 404. 산출물에서만 드러난다
 *   ③ 인라인 PDF 뷰어 없는 UA에서 `<embed>`가 빈 화면
 *      (2026-09-02: 데스크톱은 열리고 모바일은 백지)
 *
 * ①②는 소스만 봐서는 못 잡는다 — **실제 배포 산출물(out/)**과 그 안의 PDF를 본다.
 * ③은 `i18n/privacyCookiePages.test.ts`가 소스 단에서 막고, 여기서 산출물로 한 번 더 확인한다.
 *
 * 실행: node scripts/check-privacy-cookie.mjs   (deploy.sh 빌드 직후 자동 호출)
 * pdftotext(poppler)가 없으면 조항 대조를 할 수 없어 실패한다. 정말 건너뛰어야 하면
 * `SKIP_PDF_TEXT_CHECK=1`을 주되, 그 배포는 ①을 검사하지 않은 배포다.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import {
  PRIVACY_COOKIE_SPECS,
  pdfUrl,
  renderPrivacyCookiePage,
} from "./lib/privacyCookiePages.mjs";

const OUT = path.resolve(process.cwd(), "out");
const errors = [];

const hasPdfToText = (() => {
  if (process.env.SKIP_PDF_TEXT_CHECK === "1") return false;
  try {
    execFileSync("pdftotext", ["-v"], { stdio: "ignore" });
    return true;
  } catch {
    return null; // 설치돼 있지 않다 — 건너뛴 게 아니라 검사 불가다.
  }
})();

if (hasPdfToText === null) {
  console.error(
    "✗ pdftotext(poppler)가 없어 조항 착지를 검증할 수 없습니다.\n" +
      "  설치: brew install poppler\n" +
      "  (검사 없이 배포하려면 SKIP_PDF_TEXT_CHECK=1 — 권장하지 않음)",
  );
  process.exit(1);
}

for (const [locale, spec] of Object.entries(PRIVACY_COOKIE_SPECS)) {
  const label = `privacy-cookie/${locale}.html`;
  const htmlPath = path.join(OUT, "privacy-cookie", `${locale}.html`);

  if (!existsSync(htmlPath)) {
    errors.push(`${label}: 산출물에 없습니다 (${htmlPath})`);
    continue;
  }

  const html = readFileSync(htmlPath, "utf8");

  // deploy.sh가 noindex 메타를 주입하는 등 산출물이 소스와 완전히 같지 않을 수 있어,
  // 전체 일치 대신 **깨지면 안 되는 것**만 본다.
  const href = pdfUrl(spec, { withPage: true });
  if (!html.includes(`<embed src="${href}"`)) {
    errors.push(`${label}: embed가 ${href} 를 가리키지 않습니다`);
  }
  // 인라인 PDF 없는 UA(모바일)를 위한 두 경로가 살아 있어야 한다.
  if (!html.includes(`<a href="${href}"`)) {
    errors.push(`${label}: JS 없이 보이는 원문 링크가 없습니다 — 모바일에서 막다른 길이 됩니다`);
  }
  if (!html.includes("navigator.pdfViewerEnabled") || !html.includes("location.replace(")) {
    errors.push(`${label}: 인라인 PDF 미지원 UA 폴백(location.replace)이 없습니다`);
  }
  // 생성기를 거치지 않고 손으로 고친 흔적 — 세 파일이 갈라지는 경로다.
  if (!renderPrivacyCookiePage(spec).includes(`<embed src="${href}"`)) {
    errors.push(`${label}: spec과 렌더러가 어긋났습니다 (gen-privacy-cookie.mjs 재실행 필요)`);
  }

  // PDF 실물 확인 — URL을 파일시스템 경로로 되돌린다(en 파일명에 %20 공백이 있다).
  const pdfPath = path.join(OUT, decodeURIComponent(pdfUrl(spec)));
  if (!existsSync(pdfPath)) {
    errors.push(`${label}: 링크 대상 PDF가 산출물에 없습니다 (${spec.pdf})`);
    continue;
  }

  if (!hasPdfToText) continue;

  let text = "";
  try {
    text = execFileSync(
      "pdftotext",
      ["-enc", "UTF-8", "-f", String(spec.page), "-l", String(spec.page), pdfPath, "-"],
      { encoding: "utf8" },
    );
  } catch (e) {
    errors.push(`${label}: pdftotext 실패 — ${e.message}`);
    continue;
  }

  // 공백/줄바꿈은 추출기마다 달라지므로 정규화 후 비교한다.
  const flat = text.replace(/\s+/g, " ");
  if (!flat.includes(spec.clauseNeedle.replace(/\s+/g, " "))) {
    errors.push(
      `${label}: PDF ${spec.page}쪽에 "${spec.clauseNeedle}" 가 없습니다 — ` +
        `PDF가 교체돼 #page=${spec.page} 가 다른 조항에 착지합니다. ` +
        `scripts/lib/privacyCookiePages.mjs 의 page를 맞추세요.`,
    );
  }
}

if (errors.length > 0) {
  console.error("✗ 맞춤형 광고 설정 링크 게이트 실패\n" + errors.map((e) => `  - ${e}`).join("\n"));
  process.exit(1);
}

console.log(
  `✓ 맞춤형 광고 설정 링크 정상 — ${Object.entries(PRIVACY_COOKIE_SPECS)
    .map(([l, s]) => `${l}:p${s.page}`)
    .join(" / ")}${hasPdfToText ? "" : " (조항 대조 건너뜀)"}`,
);
