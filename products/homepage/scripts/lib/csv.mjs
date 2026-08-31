/**
 * RFC4180 CSV 파서 (HOM-75).
 *
 * 구글 시트 CSV export는 셀 안의 줄바꿈을 인용 필드로 내보낸다.
 * 예: `"리테일의 미래를/\n한발 먼저 시작하세요"`
 * 그래서 `split(",")` / `split("\n")` 으로 자르면 행이 어긋난다 — 반드시 이 파서를 쓸 것.
 */

/** @returns {string[][]} 행 배열. 셀 안 개행은 `\n`으로 보존된다. */
export function parseCsv(text) {
  const src = String(text ?? "").replace(/^﻿/, ""); // BOM 제거
  /** @type {string[][]} */
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  const endField = () => {
    row.push(field);
    field = "";
  };
  const endRow = () => {
    endField();
    rows.push(row);
    row = [];
  };

  for (let i = 0; i < src.length; i += 1) {
    const ch = src[i];

    if (quoted) {
      if (ch === '"') {
        // 인용 필드 안의 `""` 는 리터럴 따옴표
        if (src[i + 1] === '"') {
          field += '"';
          i += 1;
          continue;
        }
        quoted = false;
        continue;
      }
      // 인용 필드 안의 CRLF는 LF로 정규화한다(셀 안 줄바꿈 비교를 안정화).
      if (ch === "\r") {
        if (src[i + 1] === "\n") i += 1;
        field += "\n";
        continue;
      }
      field += ch;
      continue;
    }

    if (ch === '"') {
      quoted = true;
      continue;
    }
    if (ch === ",") {
      endField();
      continue;
    }
    if (ch === "\r") continue; // 인용 밖 CR은 버린다(CRLF 개행)
    if (ch === "\n") {
      endRow();
      continue;
    }
    field += ch;
  }

  // 마지막 개행이 없는 경우의 잔여 행
  if (field !== "" || row.length) endRow();
  return rows;
}

/**
 * 1행을 헤더로 삼아 레코드 배열로 바꾼다.
 * 헤더보다 짧은 행은 빈 문자열로 채운다(시트 우측 빈 열이 잘려 오는 경우가 있다).
 * @returns {Record<string, string>[]}
 */
export function parseCsvRecords(text) {
  const [header, ...rest] = parseCsv(text);
  if (!header) return [];
  return rest.map((cells) => Object.fromEntries(header.map((h, i) => [h, cells[i] ?? ""])));
}
