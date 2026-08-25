#!/usr/bin/env node
/**
 * 번역 시트 ↔ messages 대조 리포트 생성 (HOM-75).
 *
 * 시트 `Homepage text source`는 링크 공개 상태라 인증 없이 CSV export가 된다.
 *   node scripts/sync-messages.mjs                    # 시트에서 받아 대조
 *   node scripts/sync-messages.mjs --fixture <dir>    # 로컬 CSV(csv_<gid>.csv)로 대조(오프라인)
 *   node scripts/sync-messages.mjs --save-fixture <dir>  # 받은 CSV를 <dir>에 저장
 *
 * 이 스크립트는 messages를 **수정하지 않는다.** 리포트만 만든다 —
 * 시트가 단일 진실원천이 아니기 때문이다(코드 확정안·지시문 셀·ja 콘텐츠 변형).
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { parseCsvRecords } from "./lib/csv.mjs";
import {
  diffIaRows,
  diffMediaRows,
  flattenMessages,
  loadDecisionSet,
  normalize,
  summarize,
} from "./lib/sheetDiff.mjs";

const SHEET_ID = "1E5HQJB_vSgdDEJ2je11AXMVdNGAvtW7wkf42-nIL5eU";

/** 실측으로 확인한 탭 목록(2026-08-19). config·인덱스 탭은 번역 대상이 아니라 제외. */
const TABS = [
  { gid: "1826354096", name: "nav", kind: "ia" },
  { gid: "110684577", name: "footer", kind: "ia" },
  { gid: "0", name: "main", kind: "ia" },
  { gid: "756952403", name: "product-vco", kind: "ia" },
  { gid: "758513153", name: "product-store", kind: "ia" },
  { gid: "800210217", name: "aboutUs", kind: "ia" },
  { gid: "2084621727", name: "media", kind: "ia" },
  { gid: "3671350", name: "contactUs", kind: "ia" },
  { gid: "2103530687", name: "youtube-news-letter", kind: "media" },
];

const BUCKET_LABEL = {
  CONTENT: "A. 문구 반영 검토 대상",
  AMBIGUOUS: "B. ko 원문 중복매칭 — 키 확인 필요",
  DECIDED: "C. 코드 확정안 (반영 금지)",
  INSTRUCTION: "D. 지시문 셀 (번역값 아님)",
  WHITESPACE: "E. 줄바꿈·공백만 차이",
};

const argOf = (flag) => {
  const i = process.argv.indexOf(flag);
  return i > -1 ? process.argv[i + 1] : null;
};
const fixtureDir = argOf("--fixture");
const saveFixtureDir = argOf("--save-fixture");

async function loadTab({ gid }) {
  if (fixtureDir) return readFile(path.join(fixtureDir, `csv_${gid}.csv`), "utf8");
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${gid}`;
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`시트 탭 ${gid} 취득 실패: HTTP ${res.status}`);
  const text = await res.text();
  if (saveFixtureDir) {
    await mkdir(saveFixtureDir, { recursive: true });
    await writeFile(path.join(saveFixtureDir, `csv_${gid}.csv`), text);
  }
  return text;
}

async function loadMessages() {
  const read = async (locale) =>
    flattenMessages(JSON.parse(await readFile(path.resolve("messages", `${locale}.json`), "utf8")));
  return { ko: await read("ko"), en: await read("en"), ja: await read("ja") };
}

const cell = (v) => String(v ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ⏎ ");

/**
 * 같은 (key, locale)이 여러 시트 행에서 걸릴 수 있다(ko 원문 중복·탭 간 중복).
 * 원시 행수만 보면 작업량을 과대평가하므로 고유 건수를 함께 낸다.
 */
const uniqueCount = (diffs) => new Set(diffs.map((d) => `${d.key}|${d.locale}`)).size;

function renderReport({ diffs, unmatched, stamp }) {
  const counts = summarize(diffs);
  const lines = [
    `# 번역 시트 ↔ messages 대조 리포트 — ${stamp}`,
    "",
    "> `node scripts/sync-messages.mjs` 산출물. **시트는 단일 진실원천이 아니다** — 버킷 C·D는 반영 대상이 아니다.",
    "",
    `총 ${diffs.length}행 / 고유 (key, locale) **${uniqueCount(diffs)}건**. 차이는 ko 원문이 중복되거나 같은 키가 여러 탭에 나오는 경우다.`,
    "",
    "| 버킷 | 행 수 | 고유 |",
    "|---|---|---|",
    ...Object.keys(BUCKET_LABEL).map((b) => {
      const rows = diffs.filter((d) => d.bucket === b);
      return `| ${BUCKET_LABEL[b]} | ${counts[b] ?? 0} | ${uniqueCount(rows)} |`;
    }),
    `| ko 미매칭 행 | ${unmatched.length} | — |`,
    "",
  ];

  for (const bucket of Object.keys(BUCKET_LABEL)) {
    const rows = diffs.filter((d) => d.bucket === bucket);
    if (!rows.length) continue;
    lines.push(`## ${BUCKET_LABEL[bucket]} — ${rows.length}건`, "");
    lines.push("| loc | key | 코드 | 시트 | 행 |", "|---|---|---|---|---|");
    for (const d of [...rows].sort((a, b) => a.key.localeCompare(b.key) || a.locale.localeCompare(b.locale))) {
      lines.push(`| ${d.locale} | \`${d.key}\` | ${cell(d.codeValue)} | ${cell(d.sheetValue)} | ${d.rowId} |`);
    }
    lines.push("");
  }

  lines.push(`## ko 미매칭 행 — ${unmatched.length}건`, "");
  lines.push(
    "> 고유명사·숫자·시트 전용 지시행이거나, 코드가 키를 쪼개 쓰는 행(시트의 `/` 줄바꿈 표기)이다.",
    "",
  );
  lines.push("| 탭 | 행 | ko |", "|---|---|---|");
  for (const u of unmatched) lines.push(`| ${u.tab} | ${u.rowId} | ${cell(u.ko)} |`);

  return `${lines.join("\n")}\n`;
}

async function run() {
  const messages = await loadMessages();
  const decisionsFile = JSON.parse(await readFile(path.resolve("i18n/sheet-decisions.json"), "utf8"));
  const decisions = loadDecisionSet(decisionsFile.decisions);
  const koSet = new Set(Object.values(messages.ko).map((v) => normalize(v)));

  const diffs = [];
  const unmatched = [];

  for (const tab of TABS) {
    const rows = parseCsvRecords(await loadTab(tab));
    if (tab.kind === "media") {
      diffs.push(...diffMediaRows({ rows, messages, decisions }));
      continue;
    }
    diffs.push(...diffIaRows({ rows, messages, decisions, tab: tab.name }));
    for (const row of rows) {
      const ko = normalize(row.ko);
      if (!ko || ko === "번역x" || koSet.has(ko)) continue;
      unmatched.push({
        tab: tab.name,
        rowId: `${row.IA ?? ""}/${row.screen ?? ""}/${row.property ?? ""}/${row.key ?? ""}`,
        ko: row.ko,
      });
    }
  }

  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const out = path.resolve("docs", `HOM75_diff_${stamp}.md`);
  await mkdir(path.dirname(out), { recursive: true });
  await writeFile(out, renderReport({ diffs, unmatched, stamp }));

  console.log(`✓ ${diffs.length}건 diff → ${path.relative(process.cwd(), out)}`);
  console.table(summarize(diffs));
  console.log(`  ko 미매칭 행 ${unmatched.length}건`);
  console.log("\n다음: 버킷 A·B·E를 트리아지하고, 코드가 정답인 항목은 i18n/sheet-decisions.json에 추가하세요.");
}

run().catch((e) => {
  console.error("대조 실패:", e.message || e);
  process.exit(1);
});
