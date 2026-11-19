/**
 * Retail Tech Letter 목록 조립 (순수 함수 — 네트워크·파일 I/O 없음).
 *
 * Stibee 공개 API 는 썸네일을 주지 않는다. 썸네일은 config JSON 에 수동으로 들어 있고,
 * 재싱크 때 id 로 이어붙여 보존한다. 새 레터는 가장 최근 기존 레터의 배너를 물려받는다
 * (2026-11-19: 32~35호가 썸네일 없이 들어와 카드 4장만 이미지가 비는 상태로 나갈 뻔했다).
 */

/**
 * @param {object}   input
 * @param {object[]} input.items        Stibee API 응답(레터 배열)
 * @param {object[]} input.previous     직전 retail-tech-letter.json 의 letters
 * @param {string}   input.publication  발행 페이지 origin (예: https://faindersai.stibee.com)
 * @param {number|null} [input.limit]   노출 개수 제한
 * @returns {{ letters: object[], defaulted: string[], missingThumb: string[] }}
 *   defaulted = 기본 썸네일을 물려받은 새 레터 id / missingThumb = 끝내 썸네일이 없는 id
 */
export function buildLetters({ items, previous, publication, limit = null }) {
  let letters = items
    .filter((it) => it.id && it.title)
    .map((it) => ({
      id: String(it.id),
      title: String(it.title).trim(),
      previewText: (it.previewText || "").trim(),
      publishedAt: it.publishedAt || "",
      url: `${publication}/p/${it.id}`,
    }))
    .sort((a, b) => (b.publishedAt || "").localeCompare(a.publishedAt || ""));

  if (limit && Number.isFinite(limit)) letters = letters.slice(0, limit);

  const withThumb = previous.filter((l) => l.thumbnailUrl);
  const thumbById = new Map(withThumb.map((l) => [String(l.id), l.thumbnailUrl]));
  const fallback = [...withThumb].sort((a, b) =>
    (b.publishedAt || "").localeCompare(a.publishedAt || ""),
  )[0]?.thumbnailUrl;

  const defaulted = [];
  const missingThumb = [];
  letters = letters.map((l) => {
    const own = thumbById.get(l.id);
    if (own) return { ...l, thumbnailUrl: own };
    if (fallback) {
      defaulted.push(l.id);
      return { ...l, thumbnailUrl: fallback };
    }
    missingThumb.push(l.id);
    return l;
  });

  return { letters, defaulted, missingThumb };
}
