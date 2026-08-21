/**
 * 번역 시트 ↔ messages 대조 로직 (HOM-75). 순수 함수만 — 네트워크·파일 IO 없음.
 *
 * 설계 전제: **시트는 단일 진실원천이 아니다.**
 * - 코드 쪽이 마케팅 확정안인 항목이 있다(i18n/sheet-decisions.json).
 * - 시트에는 번역값이 아닌 지시문 셀이 섞여 있다("언어 전환시 미노출" 등).
 * - ja는 ko의 번역이 아니라 일본 시장용 변형을 포함한다.
 * 따라서 이 모듈은 **판정하지 않고 분류만 한다.** 반영 여부는 사람이 정한다.
 */

/** 시트·코드 사이에서 표기만 갈리는 문자쌍. 의미 차이가 아니므로 비교 전에 통일한다. */
const EQUIVALENT_CHARS = [
  ["‘", "'"], // ‘
  ["’", "'"], // ’
  ["“", '"'], // “
  ["”", '"'], // ”
  [" ", " "], // NBSP
];

/** 비교용 정규화: NFC + 표기 통일 + 공백 축약 + trim. 셀 안 줄바꿈은 공백으로 흡수한다. */
export function normalize(value) {
  let s = String(value ?? "").normalize("NFC");
  for (const [from, to] of EQUIVALENT_CHARS) s = s.split(from).join(to);
  return s.replace(/\s+/g, " ").trim();
}

/**
 * 줄바꿈·공백 차이를 무시한 동일성.
 * 시트가 지정한 줄바꿈이 코드에 빠졌을 뿐인 건("공백만 차이")을 문구 변경과 분리하는 데 쓴다.
 */
export function sameIgnoringWhitespace(a, b) {
  const strip = (v) => String(v ?? "").normalize("NFC").replace(/\s+/g, "");
  return strip(a) === strip(b);
}

/** 중첩 messages 트리를 `a.b.0.c` → 값 형태의 flat map으로 펼친다. 배열은 인덱스를 세그먼트로 쓴다. */
export function flattenMessages(tree, prefix = "") {
  /** @type {Record<string, string>} */
  const out = {};
  const entries = Array.isArray(tree) ? tree.map((v, i) => [String(i), v]) : Object.entries(tree ?? {});
  for (const [key, value] of entries) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === "object") Object.assign(out, flattenMessages(value, path));
    else out[path] = value;
  }
  return out;
}

/**
 * 정규화된 ko 원문 → 그 원문을 쓰는 키 배열.
 * 배열 길이가 2 이상이면 시트 행 하나가 여러 키에 걸린다는 뜻이고,
 * 그 상태로 반영하면 다른 키의 번역이 잘못 복사된다(실제 사고: 3f4ed65).
 * @returns {Map<string, string[]>}
 */
export function buildKoIndex(koFlat) {
  /** @type {Map<string, string[]>} */
  const index = new Map();
  for (const [key, value] of Object.entries(koFlat ?? {})) {
    const k = normalize(value);
    index.set(k, [...(index.get(k) ?? []), key]);
  }
  return index;
}
