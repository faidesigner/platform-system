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
import { writeFile } from "node:fs/promises";
import path from "node:path";

const LIST_ID = "285432"; // 리테일 테크 레터 발행 목록
const PUBLICATION = "https://faindersai.stibee.com";
const API = `https://page.stibee.com/api/v1.0/lists/${LIST_ID}/contents`;
const OUT = path.resolve(process.cwd(), "config/retail-tech-letter.json");
const LIMIT = null; // 노출 개수 제한(숫자). null이면 전체

async function run() {
  const res = await fetch(API, { headers: { "User-Agent": "fai-homepage-sync" } });
  if (!res.ok) throw new Error(`Stibee API 실패: ${res.status} ${res.statusText}`);
  const data = await res.json();
  const items = Array.isArray(data) ? data : [];
  if (!items.length) throw new Error("콘텐츠가 없음 — API 응답 구조 확인 필요");

  // publishedAt 최신순 정렬
  let letters = items
    .filter((it) => it.id && it.title)
    .map((it) => ({
      id: String(it.id),
      title: String(it.title).trim(),
      previewText: (it.previewText || "").trim(),
      publishedAt: it.publishedAt || "",
      url: `${PUBLICATION}/p/${it.id}`,
    }))
    .sort((a, b) => (b.publishedAt || "").localeCompare(a.publishedAt || ""));

  if (LIMIT && Number.isFinite(LIMIT)) letters = letters.slice(0, LIMIT);

  await writeFile(
    OUT,
    JSON.stringify({ listId: LIST_ID, fetchedAt: new Date().toISOString(), letters }, null, 2) + "\n",
  );

  console.log(`✓ ${letters.length}개 레터 → ${path.relative(process.cwd(), OUT)}`);
  letters.slice(0, 5).forEach((l, i) => console.log(`  ${i + 1}. ${l.title}  (${l.url})`));
  if (letters.length > 5) console.log(`  …외 ${letters.length - 5}개`);
  console.log("\n다음: 변경된 JSON 커밋 후 빌드/배포하면 반영됩니다.");
}

run().catch((e) => {
  console.error("동기화 실패:", e.message || e);
  process.exit(1);
});
