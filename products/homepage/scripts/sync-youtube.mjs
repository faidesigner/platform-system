#!/usr/bin/env node
/**
 * 유튜브 쇼케이스 데이터 동기화 (수동 실행, API 키 불필요).
 *
 * @faindersAI 채널의 공개 RSS 피드에서 최신 영상을 읽고, 큐레이션 규칙을 적용해
 * config/youtube-showcase.json 으로 저장한다. ShowcaseSection이 이 JSON을 사용한다.
 *
 * 기본 동작: 채널 최신 영상 "전체"를 최신순으로 노출하고, 이미 노출 중이던 영상은 그대로 유지한다.
 * 큐레이션: config/youtube-curation.json 으로 노출/제외/고정/개수 제어.
 * RSS는 최신 15개만 주므로, 창 밖으로 밀린 영상은 직전 결과에서 이어받는다. 빼려면 exclude에 적는다.
 * 규칙 본체와 테스트: scripts/lib/youtubeShowcase.mjs
 *
 * 쓰는 법:
 *   node scripts/sync-youtube.mjs
 * 그 뒤 변경된 JSON을 커밋하고 빌드/배포하면 반영된다.
 */
import { writeFile, readFile } from "node:fs/promises";
import path from "node:path";

import { buildShowcase, parseRssEntries } from "./lib/youtubeShowcase.mjs";

const CHANNEL_ID = "UCZpwr96t6EkDKMurSPL11bQ"; // @faindersAI
const RSS = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
const OUT = path.resolve(process.cwd(), "config/youtube-showcase.json");
const CURATION_FILE = path.resolve(process.cwd(), "config/youtube-curation.json");

async function loadCuration() {
  const base = { exclude: [], pinned: [], hideInLocales: {}, manual: [], limit: null, excludeShorts: false };
  try {
    return { ...base, ...JSON.parse(await readFile(CURATION_FILE, "utf8")) };
  } catch {
    return base; // 큐레이션 파일 없거나 비어도 OK → 기본(전체 최신순)
  }
}

async function loadPreviousVideos() {
  try {
    return JSON.parse(await readFile(OUT, "utf8")).videos ?? [];
  } catch {
    return [];
  }
}

async function run() {
  const curation = await loadCuration();
  const previous = await loadPreviousVideos();

  const res = await fetch(RSS, { headers: { "User-Agent": "fai-homepage-sync" } });
  if (!res.ok) throw new Error(`RSS fetch 실패: ${res.status} ${res.statusText}`);
  const xml = await res.text();

  const rss = parseRssEntries(xml);

  if (!rss.length) throw new Error("파싱된 영상이 없음 — RSS 구조 변경 가능성 확인");

  // 노출 규칙(순서·제외·고정·유지·언어별 숨김)은 lib/youtubeShowcase.mjs 에 있다(테스트로 고정).
  const { videos, carried, skippedShorts } = buildShowcase({ rss, curation, previous });

  await writeFile(
    OUT,
    JSON.stringify({ channelId: CHANNEL_ID, fetchedAt: new Date().toISOString(), videos }, null, 2) + "\n",
  );

  if (carried.length) {
    console.log(
      `ℹ️  RSS 최신 창 밖으로 밀려 직전 데이터로 유지한 영상 ${carried.length}개: ${carried.join(", ")}`,
    );
    console.log("   → 빼려면 youtube-curation.json 의 exclude 에 적으세요(자동으로 빠지지 않습니다).");
  }

  if (skippedShorts.length) {
    console.log(`ℹ️  Shorts ${skippedShorts.length}개 제외(excludeShorts): ${skippedShorts.join(", ")}`);
  }

  console.log(`✓ ${videos.length}개 영상 → ${path.relative(process.cwd(), OUT)}`);
  console.log(`  (RSS ${rss.length}개, 유지 ${carried.length}개, 제외 규칙 ${curation.exclude.length}개)`);
  videos.forEach((v, i) => console.log(`  ${i + 1}. ${v.title}  (${v.videoId})`));
  console.log("\n다음: 변경된 JSON 커밋 후 빌드/배포하면 반영됩니다.");
}

run().catch((e) => {
  console.error("동기화 실패:", e.message || e);
  process.exit(1);
});
