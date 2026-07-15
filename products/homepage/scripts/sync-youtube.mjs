#!/usr/bin/env node
/**
 * 유튜브 쇼케이스 데이터 동기화 (수동 실행, API 키 불필요).
 *
 * @faindersAI 채널의 공개 RSS 피드에서 최신 영상을 읽고, 큐레이션 규칙을 적용해
 * config/youtube-showcase.json 으로 저장한다. ShowcaseSection이 이 JSON을 사용한다.
 *
 * 기본 동작: 채널 최신 영상 "전체"를 최신순으로 노출.
 * 큐레이션: config/youtube-curation.json 으로 노출/제외/고정/개수 제어(아래 참고).
 * 안전망: hideInLocales가 걸린 videoId는 RSS 창 밖으로 밀려나도 직전 결과에서 되살아난다(HOM-25).
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
  const base = { exclude: [], pinned: [], hideInLocales: {}, manual: [], limit: null };
  try {
    return { ...base, ...JSON.parse(await readFile(CURATION_FILE, "utf8")) };
  } catch {
    return base; // 큐레이션 파일 없거나 비어도 OK → 기본(전체 최신순)
  }
}

async function loadPreviousVideos() {
  try {
    const prev = JSON.parse(await readFile(OUT, "utf8"));
    return new Map((prev.videos ?? []).map((v) => [v.videoId, v]));
  } catch {
    return new Map();
  }
}

async function run() {
  const curation = await loadCuration();
  const previous = await loadPreviousVideos();

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

  // 안전망: hideInLocales(언어별 노출 규칙)가 걸린 videoId는 RSS 15개 창 밖으로 밀려나거나
  // manual에서 빠지면 이 영상을 보여줘야 하는 로케일에서도 통째로 사라진다(HOM-25 재발 사례,
  // fSzG6pXZx-w가 새 영상 게시로 RSS 창 밖으로 밀려나며 발생). exclude로 명시 제외된 게 아니라면
  // 직전 실행 결과(previous)에서 되살려 노출을 유지하고, 재큐레이션(manual 승격 등)이 필요함을 알린다.
  const rescued = [];
  for (const id of Object.keys(curation.hideInLocales ?? {})) {
    if (byId.has(id) || ex.has(id) || !previous.has(id)) continue;
    byId.set(id, previous.get(id));
    order.push(id);
    rescued.push(id);
  }

  // 개수 제한(옵션)
  let videos = order.map((id) => byId.get(id)).filter(Boolean);
  if (curation.limit && Number.isFinite(curation.limit)) videos = videos.slice(0, curation.limit);

  // 언어별 노출 제외 규칙을 각 영상에 구워 넣는다(videoId → 숨길 로케일 배열).
  // 렌더 시점(media/page.tsx)이 이 필드로 현재 로케일 영상만 남긴다. lib/showcaseVisibility.ts 참고.
  const hide = curation.hideInLocales ?? {};
  videos = videos.map((v) =>
    hide[v.videoId]?.length ? { ...v, hideInLocales: hide[v.videoId] } : v,
  );

  await writeFile(
    OUT,
    JSON.stringify({ channelId: CHANNEL_ID, fetchedAt: new Date().toISOString(), videos }, null, 2) + "\n",
  );

  if (rescued.length) {
    console.warn(
      `⚠️  ${rescued.length}개 영상이 RSS 최신 창/manual 밖으로 밀려났으나 hideInLocales 규칙이 있어 이전 데이터로 유지됨: ${rescued.join(", ")}`,
    );
    console.warn("   → youtube-curation.json의 manual에 고정 등록해 재발을 막으세요.");
  }

  console.log(`✓ ${videos.length}개 영상 → ${path.relative(process.cwd(), OUT)}`);
  console.log(`  (RSS ${rss.length}개, 제외 ${ex.size}개, 고정 ${pin.length}개)`);
  videos.forEach((v, i) => console.log(`  ${i + 1}. ${v.title}  (${v.videoId})`));
  console.log("\n다음: 변경된 JSON 커밋 후 빌드/배포하면 반영됩니다.");
}

run().catch((e) => {
  console.error("동기화 실패:", e.message || e);
  process.exit(1);
});
