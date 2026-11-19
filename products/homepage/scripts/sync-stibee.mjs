#!/usr/bin/env node
/**
 * Retail Tech Letter(Stibee) 콘텐츠 목록 동기화 (수동 실행, 키 불필요).
 *
 * Stibee 공개 API에서 레터 목록을 받아 config/retail-tech-letter.json 으로 저장한다.
 * RetailTechLetterSection이 이 JSON을 읽어 카드 목록으로 렌더하고, 클릭 시 새 탭으로 글을 연다.
 * (Stibee가 iframe 임베드를 차단하므로 네이티브 목록 + 링크아웃 방식)
 *
 * 쓰는 법:
 *   node scripts/sync-stibee.mjs
 * 그 뒤 변경된 JSON을 커밋하고 빌드/배포하면 반영.
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { buildLetters } from "./lib/stibeeLetters.mjs";

const LIST_ID = "285432"; // 리테일 테크 레터 발행 목록
const PUBLICATION = "https://faindersai.stibee.com";
const API = `https://page.stibee.com/api/v1.0/lists/${LIST_ID}/contents`;
const OUT = path.resolve(process.cwd(), "config/retail-tech-letter.json");
const LIMIT = null; // 노출 개수 제한(숫자). null이면 전체

async function readPreviousLetters(file) {
  try {
    return JSON.parse(await readFile(file, "utf8")).letters ?? [];
  } catch {
    return []; // 파일 없음/파싱 실패 → 이어받을 썸네일 없음
  }
}

async function run() {
  const res = await fetch(API, { headers: { "User-Agent": "fai-homepage-sync" } });
  if (!res.ok) throw new Error(`Stibee API 실패: ${res.status} ${res.statusText}`);
  const data = await res.json();
  const items = Array.isArray(data) ? data : [];
  if (!items.length) throw new Error("콘텐츠가 없음 — API 응답 구조 확인 필요");

  // 정렬·썸네일 보존·새 레터 기본 썸네일 규칙은 lib/stibeeLetters.mjs 에 있다(테스트로 고정).
  const { letters, defaulted, missingThumb } = buildLetters({
    items,
    previous: await readPreviousLetters(OUT),
    publication: PUBLICATION,
    limit: LIMIT,
  });

  await writeFile(
    OUT,
    JSON.stringify({ listId: LIST_ID, fetchedAt: new Date().toISOString(), letters }, null, 2) + "\n",
  );

  console.log(`✓ ${letters.length}개 레터 → ${path.relative(process.cwd(), OUT)}`);
  letters.slice(0, 5).forEach((l, i) => console.log(`  ${i + 1}. ${l.title}  (${l.url})`));
  if (letters.length > 5) console.log(`  …외 ${letters.length - 5}개`);
  if (defaulted.length) {
    console.log(`ℹ️  새 레터 ${defaulted.length}개(id ${defaulted.join(", ")})는 직전 최신 레터의 썸네일을 물려받았습니다.`);
    console.log("   → 전용 썸네일이 있으면 config/retail-tech-letter.json 의 thumbnailUrl 을 고치세요(재싱크에도 보존됩니다).");
  }
  if (missingThumb.length) console.warn(`⚠️  썸네일 없는 레터: id ${missingThumb.join(", ")}`);
  console.log("\n다음: 변경된 JSON 커밋 후 빌드/배포하면 반영됩니다.");
}

run().catch((e) => {
  console.error("동기화 실패:", e.message || e);
  process.exit(1);
});
