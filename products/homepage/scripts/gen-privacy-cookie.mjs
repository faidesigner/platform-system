#!/usr/bin/env node
/**
 * `public/privacy-cookie/{ko,en,ja}.html` 생성기.
 *
 * 세 파일은 조항 번호·PDF 파일명·페이지 번호만 다르고 나머지는 같다. 손으로 관리하던 시절
 * "복붙하지 말 것"이라는 주석에 의존했고, 실제로 ja 페이지 번호가 틀어진 사고가 있었다.
 * 단일 spec에서 찍어내고, `privacyCookiePages.test.ts`가 체크인된 파일과의 드리프트를 막는다.
 *
 * 실행: node scripts/gen-privacy-cookie.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

import {
  PRIVACY_COOKIE_SPECS,
  renderPrivacyCookiePage,
} from "./lib/privacyCookiePages.mjs";

const OUT_DIR = path.resolve(process.cwd(), "public/privacy-cookie");
mkdirSync(OUT_DIR, { recursive: true });

for (const [locale, spec] of Object.entries(PRIVACY_COOKIE_SPECS)) {
  const file = path.join(OUT_DIR, `${locale}.html`);
  writeFileSync(file, renderPrivacyCookiePage(spec), "utf8");
  console.log(`✓ ${path.relative(process.cwd(), file)}  (#page=${spec.page})`);
}
