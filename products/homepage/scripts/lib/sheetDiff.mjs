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

/**
 * 번역값이 아니라 "이 로케일에서는 숨겨라" 같은 지시가 적힌 셀.
 * 그대로 반영하면 화면에 한국어 지시문이 노출된다.
 * 실제 사례: nav.careers("언어 전환시 미노출"), contact.toast.text("*영어로 언어 전환시 토스트 제거").
 */
const INSTRUCTION_PATTERNS = [/미노출/, /제거/, /노출되는 영역/, /^번역x$/, /^\*/];

export function isInstructionCell(value) {
  const v = normalize(value);
  if (!v) return false;
  return INSTRUCTION_PATTERNS.some((re) => re.test(v));
}

/** sheet-decisions.json의 decisions 배열 → `"<key> <locale>"` 조회용 Set */
export function loadDecisionSet(decisions) {
  return new Set((decisions ?? []).map((d) => `${d.key} ${d.locale}`));
}

/**
 * 불일치 1건을 처리 버킷으로 분류한다. 우선순위가 곧 안전 순서다.
 *
 * 1. INSTRUCTION — 번역값이 아니므로 어떤 경우에도 반영 금지(최우선)
 * 2. DECIDED     — 코드가 확정안. 시트가 옛 값이므로 반영 금지
 * 3. WHITESPACE  — 문구는 같고 줄바꿈만 다름(디자인 확인 후 반영)
 * 4. AMBIGUOUS   — ko 원문이 여러 키에 걸림. 오배치 위험이 있어 수동 확인
 * 5. CONTENT     — 실제 문구 차이. 반영 검토 대상
 *
 * @returns {"INSTRUCTION"|"DECIDED"|"WHITESPACE"|"AMBIGUOUS"|"CONTENT"}
 */
export function classify({ key, locale, codeValue, sheetValue, ambiguous, decisions }) {
  if (isInstructionCell(sheetValue)) return "INSTRUCTION";
  if (decisions?.has(`${key} ${locale}`)) return "DECIDED";
  if (sameIgnoringWhitespace(codeValue, sheetValue)) return "WHITESPACE";
  if (ambiguous) return "AMBIGUOUS";
  return "CONTENT";
}
