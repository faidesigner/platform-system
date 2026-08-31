#!/usr/bin/env node
/**
 * contents 탭(유튜브·뉴스·리테일테크레터) 전수 대조 — **코드 기준** (HOM-75).
 *
 * 왜 화면 기준(audit-pages.mjs)이 아닌가: 이 콘텐츠는 캐러셀·목록에서 **현재 선택된 항목만**
 * 렌더된다. 화면 텍스트와 대조하면 노출되지 않은 항목이 전부 "미반영"으로 잡힌다(실측 227건).
 * 그래서 이 탭만은 messages와 직접 대조한다.
 *
 * 스키마가 다르다 — 로케일이 컬럼명에 붙는다(`ko_타이틀` / `ko_디스크립션`).
 * 그리고 조인 키가 될 만한 id 컬럼이 없어 **ko 타이틀**로 맞춘다.
 *
 * ⚠️ 공백을 무시한 비교는 마지막 수단으로만 쓴다. 시트에 `AI 무인 매장 Super Swift`와
 *    `AI 무인매장 Super Swift`처럼 **공백만 다른 별개 영상**이 있어, 공백을 지우면 두 행이
 *    같아지고 엉뚱한 이격이 보고된다(2026-08-31에 실제로 오탐 3건 발생).
 *
 * 검출 항목
 *   ① 시트에 있는데 코드에 없는 콘텐츠 (신규 콘텐츠 누락)
 *   ② 시트와 코드의 값 이격
 *   ③ 번역 공백 — en·ja가 비어 있거나 ko와 같은 값(미번역)
 *
 * 실행: node scripts/audit-contents.mjs [--fixture <dir>]
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { parseCsvRecords } from "./lib/csv.mjs";

const SHEET_ID = "1E5HQJB_vSgdDEJ2je11AXMVdNGAvtW7wkf42-nIL5eU";
const GID = "2103530687";
const LOCALES = ["ko", "en", "ja"];
/** 시트 `contents` 열의 구분값 → 코드 컨테이너 */
const KINDS = { "유튜브": "youtube", "뉴스": "news", "리테일테크레터": "letter" };
/** 링크 안내용 행 — 콘텐츠가 아니다 */
const NON_CONTENT = new Set(["번역x", "유튜브 링크", "뉴스 리스트 원본 링크", "리테일 테크 레터 링크"]);

const fixtureDir = process.argv.includes("--fixture")
  ? process.argv[process.argv.indexOf("--fixture") + 1]
  : null;

async function loadTab() {
  if (fixtureDir) return readFile(path.join(fixtureDir, `csv_${GID}.csv`), "utf8");
  const res = await fetch(
    `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}`,
  );
  if (!res.ok) throw new Error(`contents 탭 취득 실패: HTTP ${res.status}`);
  return res.text();
}

/**
 * 표시상 같은 문자를 하나로 모은다 — 굽은 따옴표/직선 따옴표, 전각/반각 괄호 등.
 * 뉴스 제목은 언론사 원문을 옮기다 보니 같은 제목이 매체마다 다른 따옴표를 쓴다.
 * 이걸 정규화하지 않으면 "코드에 없는 콘텐츠"로 잡히는데, 실제로는 같은 항목이다.
 */
const unifyPunct = (s) =>
  String(s ?? "")
    .replace(/[\u2018\u2019\u02bc\u055a]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/[\u3008\u3009\u2039\u203a]/g, "")
    .replace(/[\uff08]/g, "(")
    .replace(/[\uff09]/g, ")")
    .replace(/[\u2013\u2014\u2015]/g, "-");

const norm = (s) =>
  unifyPunct(String(s ?? "").replace(/​/g, "").replace(/⁠/g, "").replace(/ /g, " "))
    .replace(/\s+/g, " ")
    .trim();
/** 최후 비교용 — 공백만 다른 별개 항목을 뭉개므로 정확 비교가 실패했을 때만 쓴다. */
const squash = (s) => norm(s).replace(/\s/g, "");

const entries = (o) => (Array.isArray(o) ? o.map((v, i) => [String(i), v]) : Object.entries(o ?? {}));

function containers(messages) {
  const m = messages.media ?? {};
  return {
    youtube: entries(m.showcase?.videoOverrides),
    news: entries(m.news?.items),
    letter: entries(m.retailTechLetter?.letterTitles),
  };
}

/** 코드에서 ko 타이틀로 항목 id를 찾는다. 정확 일치 우선, 없으면 공백 무시로 한 번 더. */
function findId(list, kind, koTitle) {
    const value = (v) => (kind === "letter" ? v : v?.title);
    const exact = list.find(([, v]) => norm(value(v)) === norm(koTitle));
    if (exact) return exact[0];
    const loose = list.filter(([, v]) => squash(value(v)) === squash(koTitle));
    return loose.length === 1 ? loose[0][0] : null; // 여럿이면 판단 불가 — 오탐 방지
}

async function run() {
  const rows = parseCsvRecords(await loadTab());
  const M = {};
  for (const loc of LOCALES) {
    M[loc] = JSON.parse(await readFile(path.resolve(process.cwd(), `messages/${loc}.json`), "utf8"));
  }
  const C = Object.fromEntries(LOCALES.map((l) => [l, containers(M[l])]));

  const notInCode = [];
  const titleDiffs = [];
  const mismatches = [];
  const untranslated = [];
  let checked = 0;

  for (const row of rows) {
    const kind = KINDS[String(row.contents ?? "").trim()];
    if (!kind) continue;
    const koTitle = norm(row["ko_타이틀"]);
    if (!koTitle || NON_CONTENT.has(koTitle)) continue;

    let id = findId(C.ko[kind], kind, koTitle);
    let titleDiff = null;
    if (id === null) {
      // 시트 ko 제목이 코드와 다를 수 있다 — 접두어 누락(`VCO `), 지점명 축약, 오타(`024년`).
      // en·ja 제목으로 항목을 찾아내면 콘텐츠 자체는 있는 것이므로 '제목 표기 차이'로 분류한다.
      for (const alt of ["ja", "en"]) {
        const altTitle = norm(row[`${alt}_타이틀`]);
        if (!altTitle || altTitle === "번역x") continue;
        const found = findId(C[alt][kind], kind, altTitle);
        if (found !== null) { id = found; break; }
      }
      if (id === null) { notInCode.push({ kind, koTitle }); continue; }
      const codeKo = kind === "letter"
        ? norm(C.ko[kind].find(([k]) => k === id)?.[1])
        : norm(C.ko[kind].find(([k]) => k === id)?.[1]?.title);
      titleDiff = { kind, id, sheet: koTitle, code: codeKo };
      titleDiffs.push(titleDiff);
    }
    const pick = (loc, field) => {
      const found = C[loc][kind].find(([k]) => k === id);
      const v = found?.[1];
      return kind === "letter" ? v : v?.[field];
    };

    for (const loc of ["en", "ja"]) {
      for (const [field, col] of kind === "letter"
        ? [["title", `${loc}_타이틀`]]
        : [["title", `${loc}_타이틀`], ["description", `${loc}_디스크립션`]]) {
        const sheet = norm(row[col]);
        const code = norm(pick(loc, field));
        const koVal = norm(pick("ko", field));

        // ③ 번역 공백 — 시트에 번역이 없고 코드도 비었거나 ko와 같다
        if (!sheet || sheet === "번역x") {
          if (!code || (koVal && code === koVal)) {
            untranslated.push({ kind, id, loc, field, koTitle, code });
          }
          continue;
        }
        checked++;
        if (sheet !== code && squash(sheet) !== squash(code)) {
          mismatches.push({ kind, id, loc, field, koTitle, sheet, code });
        }
      }
    }
  }

  console.log(`  대조 ${checked}건 (유튜브·뉴스·레터 × en·ja)`);
  if (notInCode.length) {
    console.error(`\n✗ 시트에 있는데 코드에 없는 콘텐츠 ${notInCode.length}건:`);
    for (const n of notInCode) console.error(`  [${n.kind}] ${n.koTitle.slice(0, 70)}`);
  }
  if (titleDiffs.length) {
    console.log(`\n◻ ko 제목 표기 차이 ${titleDiffs.length}건 (콘텐츠는 코드에 있다 — 시트 제목이 축약·오타):`);
    for (const d of titleDiffs) {
      console.log(`   [${d.kind} ${d.id}]`);
      console.log(`      시트: ${d.sheet}`);
      console.log(`      코드: ${d.code}`);
    }
  }
  if (untranslated.length) {
    console.error(`\n✗ 번역 공백 ${untranslated.length}건 (시트에도 없고 코드도 미번역):`);
    for (const u of untranslated) {
      console.error(`  [${u.kind} ${u.id}] ${u.loc}.${u.field} — ${u.koTitle.slice(0, 50)}`);
    }
  }
  if (mismatches.length) {
    console.error(`\n✗ 값 이격 ${mismatches.length}건:`);
    for (const m of mismatches) {
      console.error(`  [${m.kind} ${m.id}] ${m.loc}.${m.field} — ${m.koTitle.slice(0, 40)}`);
      console.error(`      시트: ${m.sheet.slice(0, 100)}`);
      console.error(`      코드: ${m.code.slice(0, 100)}`);
    }
  }
  const total = notInCode.length + untranslated.length + mismatches.length;
  if (total) process.exit(1);
  console.log("\n✓ contents 탭이 코드와 정합 — 누락·이격·번역 공백 없음.");
}

run().catch((e) => { console.error("검사 실패:", e.message || e); process.exit(1); });
