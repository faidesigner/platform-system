/**
 * 유튜브 쇼케이스 목록 조립 (순수 함수 — 네트워크·파일 I/O 없음).
 *
 * sync-youtube.mjs 가 RSS·큐레이션·직전 결과를 읽어 여기에 넘긴다.
 * 규칙을 I/O 와 분리해 둔 이유: "재싱크로 영상이 조용히 빠진다"가 두 번 났고(HOM-25, 2026-11-19),
 * 스크립트 안에 묻혀 있으면 테스트로 고정할 수 없었다.
 */

const watchHref = (id) => `https://www.youtube.com/watch?v=${id}`;

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

/**
 * 채널 RSS(XML)에서 영상 목록을 읽는다(최신순 그대로).
 * Shorts는 RSS에서 <link href=".../shorts/<id>"> 로만 구분된다 → isShort 로 표시해 둔다.
 * isShort 는 buildShowcase 가 쓰는 내부 표시이고 결과 JSON 에는 남지 않는다.
 */
export function parseRssEntries(xml) {
  return xml
    .split("<entry>")
    .slice(1)
    .map((block) => {
      const videoId = pick(block, /<yt:videoId>([^<]+)<\/yt:videoId>/);
      const title = pick(block, /<title>([\s\S]*?)<\/title>/);
      const description = pick(block, /<media:description>([\s\S]*?)<\/media:description>/);
      const isShort = /<link[^>]+href="[^"]*\/shorts\//.test(block);
      return { videoId, title, description, thumbnailAlt: title, href: watchHref(videoId), isShort };
    })
    .filter((v) => v.videoId);
}

/**
 * @param {object}   input
 * @param {object[]} input.rss       RSS에서 읽은 영상(최신순)
 * @param {object}   input.curation  youtube-curation.json (exclude/pinned/hideInLocales/manual/limit)
 * @param {object[]} input.previous  직전 youtube-showcase.json 의 videos (순서 유지)
 * @returns {{ videos: object[], carried: string[], skippedShorts: string[] }}
 *   carried = RSS·manual 어디에도 없어 직전 데이터로 유지한 videoId
 *   skippedShorts = curation.excludeShorts 로 걸러낸 Shorts videoId
 */
export function buildShowcase({ rss, curation, previous }) {
  const exclude = new Set(curation.exclude ?? []);
  const manual = (curation.manual ?? []).filter((m) => m.videoId);
  const manualIds = new Set(manual.map((m) => m.videoId));

  // Shorts 제외(curation.excludeShorts). id 를 exclude 에 하나씩 적으면 채널에 Shorts 가 올라올 때마다
  // 다시 들어오므로 종류로 거른다. manual 에 직접 적은 것은 의도한 노출이라 남긴다.
  // 직전 결과에 이미 들어가 있던 Shorts 도 같은 exclude 경로로 빠진다.
  const skippedShorts = curation.excludeShorts
    ? rss.filter((v) => v.isShort && !manualIds.has(v.videoId)).map((v) => v.videoId)
    : [];
  skippedShorts.forEach((id) => exclude.add(id));

  // 풀: 직전 결과 → RSS → manual 순으로 덮어쓴다(뒤가 우선). 같은 videoId면 manual 필드가 이긴다.
  const byId = new Map();
  for (const v of previous) if (v.videoId) byId.set(v.videoId, v);
  for (const v of rss) byId.set(v.videoId, v);
  const rssIds = new Set(rss.map((v) => v.videoId));
  for (const m of manual) {
    const base = rssIds.has(m.videoId) ? byId.get(m.videoId) : {};
    byId.set(m.videoId, {
      ...base,
      ...m,
      thumbnailAlt: m.thumbnailAlt || m.title || base.title || "",
      href: m.href || watchHref(m.videoId),
    });
  }

  // 순서: RSS 최신순 → 직전 결과의 나머지(직전 순서 그대로) → 직전에 없던 manual.
  // RSS는 최신 15개만 주므로 창 밖으로 밀린 영상은 "삭제"가 아니라 "오래됨"이다.
  // 빼려면 exclude에 적는다 — 암묵적 탈락은 없다.
  const order = [];
  const seen = new Set();
  const push = (id) => {
    if (!id || seen.has(id) || exclude.has(id) || !byId.has(id)) return;
    seen.add(id);
    order.push(id);
  };
  const carried = [];
  rss.forEach((v) => push(v.videoId));
  for (const v of previous) {
    const before = order.length;
    push(v.videoId);
    if (order.length > before && !manualIds.has(v.videoId)) carried.push(v.videoId);
  }
  manual.forEach((m) => push(m.videoId));

  // 고정: 지정 순서대로 맨 앞
  const pinned = (curation.pinned ?? []).filter((id) => seen.has(id));
  const pinnedSet = new Set(pinned);
  const ordered = [...new Set(pinned), ...order.filter((id) => !pinnedSet.has(id))];

  let videos = ordered.map((id) => byId.get(id));
  if (curation.limit && Number.isFinite(curation.limit)) videos = videos.slice(0, curation.limit);

  // 언어별 노출 제외 규칙을 영상에 구워 넣는다(videoId → 숨길 로케일 배열).
  // 직전 결과에 구워져 있던 값은 버리고 curation 을 SSoT 로 다시 계산한다.
  const hide = curation.hideInLocales ?? {};
  videos = videos.map(({ hideInLocales: _stale, isShort: _internal, ...v }) =>
    hide[v.videoId]?.length ? { ...v, hideInLocales: hide[v.videoId] } : v,
  );

  return { videos, carried, skippedShorts };
}
