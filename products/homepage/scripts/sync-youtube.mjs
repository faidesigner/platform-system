#!/usr/bin/env node
/**
 * 유튜브 쇼케이스 데이터 동기화 (수동 실행, API 키 불필요).
 *
 * @faindersAI 채널의 공개 RSS 피드에서 최신 영상을 읽고, 큐레이션 규칙을 적용해
 * config/youtube-showcase.json 으로 저장한다. ShowcaseSection이 이 JSON을 사용한다.
 *
 * 기본 동작: 채널 최신 영상 "전체"를 최신순으로 노출.
 * 큐레이션: config/youtube-curation.json 으로 노출/제외/고정/개수 제어(아래 참고).
 *
 * 쓰는 법:
 *   node scripts/sync-youtube.mjs
 * 그 뒤 변경된 JSON을 커밋하고 빌드/배포하면 반영된다.
 */
import { writeFile, readFile } from "node:fs/promises";
import path from "node:path";

const CHANNEL_ID = "UCZpwr96t6EkDKMurSPL11bQ"; // @faindersAI
const RSS = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
const OUT = path.resolve(process.cwd(), "config/youtube-showcase.json");
const CURATION_FILE = path.resolve(process.cwd(), "config/youtube-curation.json");

function decode(s) {
  return (s ?? "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n));
}
const pick = (block, re) => {
  const m = block.match(re);
  return m ? decode(m[1].trim()) : "";
};
const watchHref = (id) => `https://www.youtube.com/watch?v=${id}`;

async function loadCuration() {
  const base = { exclude: [], pinned: [], manual: [], limit: null };
  try {
    return { ...base, ...JSON.parse(await readFile(CURATION_FILE, "utf8")) };
  } catch {
    return base; // 큐레이션 파일 없거나 비어도 OK → 기본(전체 최신순)
  }
}

async function run() {
  const curation = await loadCuration();

  const res = await fetch(RSS, { headers: { "User-Agent": "fai-homepage-sync" } });
  if (!res.ok) throw new Error(`RSS fetch 실패: ${res.status} ${res.statusText}`);
  const xml = await res.text();

  // RSS 최신순 파싱
  const rss = xml
    .split("<entry>")
    .slice(1)
    .map((block) => {
      const videoId = pick(block, /<yt:videoId>([^<]+)<\/yt:videoId>/);
      const title = pick(block, /<title>([\s\S]*?)<\/title>/);
      const description = pick(block, /<media:description>([\s\S]*?)<\/media:description>/);
      return { videoId, title, description, thumbnailAlt: title, href: watchHref(videoId) };
    })
    .filter((v) => v.videoId);

  if (!rss.length) throw new Error("파싱된 영상이 없음 — RSS 구조 변경 가능성 확인");

  // 풀 구성: RSS + manual(옛 영상 수동 추가). 같은 videoId면 manual 필드 우선.
  const byId = new Map(rss.map((v) => [v.videoId, v]));
  for (const m of curation.manual) {
    if (!m.videoId) continue;
    const prev = byId.get(m.videoId) ?? {};
    byId.set(m.videoId, {
      ...prev,
      ...m,
      thumbnailAlt: m.thumbnailAlt || m.title || prev.title || "",
      href: m.href || watchHref(m.videoId),
    });
  }

  // 순서: RSS 최신순 → manual 전용(RSS에 없는 것) 뒤에 추가
  let order = rss.map((v) => v.videoId);
  for (const m of curation.manual) if (m.videoId && !order.includes(m.videoId)) order.push(m.videoId);

  // 제외(나오지 말아야 하는 영상)
  const ex = new Set(curation.exclude);
  order = order.filter((id) => !ex.has(id));

  // 고정(나와야 하는 영상을 앞으로, 지정 순서대로)
  const pin = curation.pinned.filter((id) => byId.has(id) && !ex.has(id));
  order = [...pin, ...order.filter((id) => !pin.includes(id))];

  // 개수 제한(옵션)
  let videos = order.map((id) => byId.get(id)).filter(Boolean);
  if (curation.limit && Number.isFinite(curation.limit)) videos = videos.slice(0, curation.limit);

  await writeFile(
    OUT,
    JSON.stringify({ channelId: CHANNEL_ID, fetchedAt: new Date().toISOString(), videos }, null, 2) + "\n",
  );

  console.log(`✓ ${videos.length}개 영상 → ${path.relative(process.cwd(), OUT)}`);
  console.log(`  (RSS ${rss.length}개, 제외 ${ex.size}개, 고정 ${pin.length}개)`);
  videos.forEach((v, i) => console.log(`  ${i + 1}. ${v.title}  (${v.videoId})`));
  console.log("\n다음: 변경된 JSON 커밋 후 빌드/배포하면 반영됩니다.");
}

run().catch((e) => {
  console.error("동기화 실패:", e.message || e);
  process.exit(1);
});
