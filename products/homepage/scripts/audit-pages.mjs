#!/usr/bin/env node
/**
 * 번역 시트 ↔ **실제 렌더 화면** 전수 대조 (HOM-75).
 *
 * `sync-messages.mjs`가 시트 ↔ **코드(messages/*.json)** 를 본다면, 이 도구는 시트 ↔ **화면**을 본다.
 * 둘은 다르다. 코드에 값이 있어도 화면에 안 나올 수 있고(키가 렌더에 연결 안 됨, 조건부 렌더,
 * site.ts 값이 번역을 덮어씀), 반대로 화면 문구가 코드 어느 키인지 몰라도 대조는 가능하다.
 *
 * 왜 필요한가(2026-08-31): 케이스 스터디 날짜가 messages에 없고 site.ts 값이 그대로 흘러
 * **전 로케일에 한국식 `'23.10`** 이 나갔다. 코드 대조로는 "키가 없으니 이격도 없다"가 되어
 * 영원히 안 잡힌다. 화면을 봐야 잡힌다.
 *
 * 탭·캐러셀로 숨은 콘텐츠까지 보려고 STANDARD/MICRO 탭과 케이스 항목을 **하나씩 순차 클릭**한다.
 * 한꺼번에 클릭하면 마지막 것만 활성화돼 앞 항목이 "미반영"으로 오탐된다.
 *
 * 실행: node scripts/audit-pages.mjs [--fixture <dir>]
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { withPreview } from "./lib/staticPreview.mjs";
import { parseCsvRecords } from "./lib/csv.mjs";

const PORT = 43501;
const LOCALES = ["ko", "en", "ja"];
const SHEET_ID = "1E5HQJB_vSgdDEJ2je11AXMVdNGAvtW7wkf42-nIL5eU";

/** 시트 탭 → 그 문구가 나타나는 라우트. nav·footer는 전 페이지 공통이라 홈에서 본다. */
const TABS = [
  { gid: "1826354096", name: "nav",           routes: [""] },
  { gid: "110684577",  name: "footer",        routes: [""] },
  { gid: "0",          name: "main",          routes: [""] },
  { gid: "756952403",  name: "product-vco",   routes: ["products/vision-check-out"] },
  { gid: "758513153",  name: "product-store", routes: ["products/unmanned-store"] },
  { gid: "800210217",  name: "aboutUs",       routes: ["about"] },
  { gid: "2084621727", name: "media",         routes: ["media"] },
  { gid: "3671350",    name: "contactUs",     routes: ["contact"] },
  // ⚠️ contents 탭(gid 2103530687)은 여기 넣지 않는다. 유튜브·뉴스·레터는 캐러셀/목록에서
  //    **현재 선택된 항목만** 렌더되므로 화면 기준으로는 대부분이 "미반영"으로 잡힌다(227건 오탐).
  //    그 탭은 코드 기준으로 대조하는 scripts/audit-contents.mjs가 담당한다.
];

const fixtureDir = process.argv.includes("--fixture")
  ? process.argv[process.argv.indexOf("--fixture") + 1]
  : null;

async function loadTab(gid) {
  if (fixtureDir) return readFile(path.join(fixtureDir, `csv_${gid}.csv`), "utf8");
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${gid}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`시트 탭 ${gid} 취득 실패: HTTP ${res.status}`);
  return res.text();
}

/** 시트 표기 정규화 — '/'+개행 줄바꿈 규약, 공백/제로폭 문자 정리. */
function norm(s) {
  return String(s ?? "")
    .replace(/​/g, "")
    .replace(/ /g, " ")
    .replace(/\s*\/\s*\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n+/g, "\n")
    .trim();
}

/** 화면 텍스트와 비교하기 위해 줄바꿈까지 공백으로 눕힌다. */
const flat = (s) => norm(s).replace(/\s+/g, " ");

/**
 * 대조 대상이 아닌 셀.
 *  - 지시문 셀: "*일본어 번역시에만 노출" 같은 작업 지시. 반영하면 화면에 한국어가 노출된다.
 *  - 플레이스홀더: {유튜브 타이틀} 처럼 콘텐츠 시트를 참조하라는 표시.
 *  - 너무 짧은 값: 'ㅣ', '15%' 등은 우연 일치가 많아 신호가 되지 못한다.
 */
/**
 * 정적 크롤로는 도달할 수 없는 화면 상태. **문구가 없다는 뜻이 아니라 이 도구로 못 본다**는 뜻이다.
 * 예외로 두는 대신 무엇을 못 봤는지 요약에 찍어, 사람이 눈으로 확인할 목록이 되게 한다.
 */
/**
 * 시트가 옛값이라 **화면과 달라야 정상**인 문구. sheet-decisions.json은 키 기준이라
 * 화면 텍스트만 보는 이 도구가 참조할 수 없어 따로 적는다. 근거를 반드시 남길 것.
 */
const SHEET_STALE = [
  { match: /14대의 AI 카메라/, why: "카메라 대수는 3로케일 7대 통일 확정 (en·ja는 시트도 정정됨, ko 셀만 옛값)" },
  { match: /Sukbom/, why: "로마자 표기 `Sukbum` 확정 — 시트가 옛값" },
  { match: /훗카이도/, why: "표준 표기 `홋카이도` — 시트 오타" },
  { match: /경험을 해보세요/, why: "`경험해 보세요`가 맞다 — 시트 오타" },
  { match: /영상情?報|영상정보처리기기|映像情報処理機器|이 부분은 제거/, why: "CCTV 방침은 HOM-61에서 푸터에서 제거됨" },
  { match: /メールでのお問い合わせ|contact_jp@fainders\.ai/, why: "ja 메일 행은 HOM-101에서 미노출 처리 (JP-BD 요청)" },
  { match: /2026년 8월 12일 시행|안녕하세요, ㈜파인더스에이아이입니다/, why: "개정 안내 모달은 ko 전용이고 시행일은 8월 28일로 정정됨 — 시트가 옛값" },
  { match: /^(일본법인명|03-6821-7191)$/, why: "시트 ko 셀은 항목 설명용 라벨 (ja에만 실제 값이 있다)" },
  { match: /ISSUE NO\.\{NN\}/, why: "레터 이슈 번호 라벨은 HOM-85에서 제거됨" },
];

function sheetStaleReason(value) {
  const v = norm(value);
  return SHEET_STALE.find((s) => s.match.test(v))?.why ?? null;
}

const UNREACHABLE = [
  { match: /문의 주셔서|Thanks for reaching out|お問い合わせいただき|내용을 확인하고|We'll review your message|内容を確認のうえ|계속 둘러보기|Keep Exploring|トップページへ戻る/,
    why: "문의 폼 제출 완료 화면 (실제 전송이 필요)" },
  { match: /귀하의 문의에 답변하기 위해|I agree to the Privacy Policy|お問い合わせにおける個人情報/,
    why: "개인정보 동의 체크박스 라벨 (폼 하단, 조건부 렌더)" },
  { match: /^(목적|Purpose|利用目的)/,
    why: "동의 상세 안내 (펼침 상태에서만 노출)" },
];

function unreachableReason(value) {
  const v = norm(value);
  return UNREACHABLE.find((u) => u.match.test(v))?.why ?? null;
}

function skipReason(value) {
  const v = norm(value);
  if (!v) return "빈 셀";
  if (v === "번역x") return "번역x";
  if (/^\*/.test(v)) return "지시문 셀";
  if (/^\{.*\}$/.test(v)) return "플레이스홀더";
  if (/노출|미노출|참고|시트/.test(v) && v.length < 30 && !/[.!?]/.test(v)) return "지시문 셀";
  if (v.replace(/\s/g, "").length < 4) return "너무 짧음";
  return null;
}

/** 탭·캐러셀을 순차로 눌러 숨은 콘텐츠까지 화면 텍스트에 누적한다. */
async function collectPageText(browser, url) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000 });
  await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 }).catch(() => {});
  await new Promise((r) => setTimeout(r, 600));

  /** innerText는 input placeholder·aria-label을 담지 않는다 — 폼 문구가 통째로 "미반영"이 된다. */
  const snapshot = () =>
    page.evaluate(() => {
      const attrs = [...document.querySelectorAll("[placeholder],[aria-label],[title],[alt]")]
        .flatMap((e) => [e.getAttribute("placeholder"), e.getAttribute("aria-label"), e.getAttribute("title"), e.getAttribute("alt")])
        .filter(Boolean);
      return document.body.innerText + "\n" + attrs.join("\n");
    });

  const chunks = [await snapshot()];

  const clickOne = (needle) =>
    page.evaluate((n) => {
      const el = [...document.querySelectorAll("button,span,li,a,[role='tab']")]
        .filter((e) => e.offsetParent !== null && e.children.length === 0)
        .find((e) => (e.textContent || "").includes(n));
      if (!el) return false;
      let t = el;
      for (let i = 0; i < 4 && t; i++) { t.click(); t = t.parentElement; }
      return true;
    }, needle);

  // 내비게이션 드롭다운 — 호버해야 제품 하위 메뉴가 뜬다.
  // 라벨 텍스트로 찾던 방식은 로케일마다 라벨이 달라 실패했다(en/ja 9건 오탐).
  // 상단 내비의 앞쪽 요소에 일괄 호버하는 편이 확실하다.
  await page.evaluate(() => {
    const cands = [...document.querySelectorAll("header button, header a, nav button, nav a")]
      .filter((e) => e.offsetParent !== null);
    for (const el of cands.slice(0, 5)) {
      for (const type of ["pointerenter", "pointerover", "mouseenter", "mouseover", "focus"]) {
        el.dispatchEvent(new Event(type, { bubbles: true }));
      }
    }
  });
  await new Promise((r) => setTimeout(r, 800));
  chunks.push(await snapshot());

  // 카운트업 통계는 뷰포트에 들어와야 애니메이션이 끝난다 — 스크롤하지 않으면 `0`으로 읽힌다.
  for (const frac of [0.3, 0.5, 0.7]) {
    await page.evaluate((f) => window.scrollTo(0, document.body.scrollHeight * f), frac);
    await new Promise((r) => setTimeout(r, 600));
  }
  await new Promise((r) => setTimeout(r, 1500));
  chunks.push(await snapshot());
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise((r) => setTimeout(r, 300));

  // 스토어 타입 탭 → 각 탭 안의 케이스 항목을 하나씩
  for (const tab of ["STANDARD", "MICRO"]) {
    if (!(await clickOne(tab))) continue;
    await new Promise((r) => setTimeout(r, 700));
    chunks.push(await snapshot());
    for (const c of ["GS25", "Super Swift", "나주", "판교", "Naju", "Pangyo", "羅州", "パンギョ", "PX24"]) {
      if (!(await clickOne(c))) continue;
      await new Promise((r) => setTimeout(r, 450));
      chunks.push(await snapshot());
    }
  }
  await page.close();
  return chunks.join("\n").replace(/\s+/g, " ");
}

async function run() {
  const sheets = [];
  for (const tab of TABS) {
    const rows = parseCsvRecords(await loadTab(tab.gid));
    sheets.push({ ...tab, rows });
  }

  await withPreview({ port: PORT, what: "시트↔화면 전수 대조" }, async ({ browser, origin }) => {
    // 라우트별 화면 텍스트를 한 번씩만 수집한다.
    const routes = [...new Set(sheets.flatMap((s) => s.routes))];
    /** @type {Record<string, Record<string, string>>} */
    const pageText = {};
    for (const loc of LOCALES) {
      pageText[loc] = {};
      for (const route of routes) {
        pageText[loc][route] = await collectPageText(browser, `${origin}/${loc}/${route ? route + "/" : ""}`);
      }
    }

    // 코드가 정답으로 확정된 항목(sheet-decisions.json)은 시트가 옛값이라 화면과 달라야 정상이다.
    const decided = new Set();
    try {
      const raw = JSON.parse(await readFile(path.resolve("i18n/sheet-decisions.json"), "utf8"));
      for (const d of raw.decisions ?? []) decided.add(flat(d.codeValue));
    } catch { /* 선언 파일이 없으면 그냥 전부 검사한다 */ }

    const missing = [];
    const partial = [];
    const unreachable = [];
    const staleSkipped = [];
    let checked = 0, skipped = 0;

    for (const sheet of sheets) {
      for (const row of sheet.rows) {
        for (const loc of LOCALES) {
          // 스키마에 따라 로케일 값을 꺼내는 방법이 다르다.
          // 기본: `ko`/`en`/`ja` 컬럼. contents 탭: `ko_타이틀`·`ko_디스크립션` 두 컬럼.
          const cells =
            sheet.schema === "perColumnLocale"
              ? [row[`${loc}_타이틀`], row[`${loc}_디스크립션`]]
              : [row[loc]];
          for (const raw of cells) {
          const reason = skipReason(raw);
          if (reason) { if (norm(raw)) skipped++; continue; }
          const stale = sheetStaleReason(raw);
          if (stale) { staleSkipped.push({ rowId: `${sheet.name}/${row.key ?? ""}`, loc, why: stale }); continue; }
          const blocked = unreachableReason(raw);
          if (blocked) { unreachable.push({ rowId: `${sheet.name}/${row.key ?? ""}`, loc, why: blocked, want: flat(raw).slice(0, 60) }); continue; }
          checked++;
          const want = flat(raw);
          if (decided.has(want)) { skipped++; checked--; continue; }  // 코드 확정안 — 시트가 옛값
          const found = sheet.routes.some((r) => (pageText[loc][r] ?? "").includes(want));
          if (found) continue;

          // 전체가 안 맞으면 줄 단위로 쪼개 어디까지 맞는지 본다.
          // 한 셀이 여러 키로 나뉜 경우(brand+store, subtitle+description)는 줄 단위로는 맞는다.
          const lines = norm(raw).split("\n").map((l) => l.trim()).filter((l) => l.replace(/\s/g, "").length >= 4);
          const hit = lines.filter((l) => sheet.routes.some((r) => (pageText[loc][r] ?? "").includes(l.replace(/\s+/g, " "))));
          const rowId = `${sheet.name}/${row.key ?? row.contents ?? ""}`;
          if (lines.length > 1 && hit.length === lines.length) { partial.push({ rowId, loc, note: "줄 단위로는 전부 일치(여러 키로 분할된 셀)" }); continue; }
          // 한 줄 셀이 여러 키로 쪼개지는 경우 — `PX24 화곡점`(brand + store),
          // `판교 Alphadom "Worker Shop"`, hero title1/title2 등. 화면에서는 두 조각이 서로 떨어져
          // 렌더되고 사이에 날짜 같은 다른 텍스트가 끼어, 셀 전체로도 압축 비교로도 잡히지 않는다.
          // 조각이 **각각** 화면에 있으면 분할 렌더로 본다(2자 미만 조각은 우연 일치가 많아 제외).
          if (lines.length === 1) {
            const parts = want.split(/\s+/).filter((w) => w.replace(/["'"'「」]/g, "").length >= 2);
            if (parts.length >= 2 && parts.every((w) => sheet.routes.some((r) => (pageText[loc][r] ?? "").includes(w)))) {
              partial.push({ rowId: `${sheet.name}/${row.key ?? ""}`, loc, note: "조각이 각각 화면에 존재(여러 키로 분할)" });
              continue;
            }
          }
          // 공백·구두점을 지우고 한 번 더 본다 — brand+store 처럼 두 키가 화면에서 붙어 렌더되는 경우.
          const squash = (s) => s.replace(/[\s.,·ㆍ"'"'「」（）()]/g, "");
          if (sheet.routes.some((r) => squash(pageText[loc][r] ?? "").includes(squash(want)))) {
            partial.push({ rowId, loc, note: "공백·구두점 차이만 있고 화면에 존재" });
            continue;
          }
          missing.push({ rowId, loc, want: flat(raw).slice(0, 110), hit: hit.length, total: lines.length });
          }
        }
      }
    }

    console.log(`\n검사 ${checked}건 / 건너뜀 ${skipped}건 (지시문·플레이스홀더·짧은 값)`);
    if (staleSkipped.length) {
      const byWhy = new Map();
      for (const s of staleSkipped) byWhy.set(s.why, (byWhy.get(s.why) ?? 0) + 1);
      console.log(`\n◻ 시트가 옛값(코드가 정답) ${staleSkipped.length}건:`);
      for (const [why, n] of byWhy) console.log(`   · ${why} — ${n}건`);
    }
    if (unreachable.length) {
      console.log(`\n◻ 이 도구로 도달 불가 ${unreachable.length}건 — 눈으로 확인할 목록:`);
      const byWhy = new Map();
      for (const u of unreachable) byWhy.set(u.why, [...(byWhy.get(u.why) ?? []), `${u.loc} ${u.rowId}`]);
      for (const [why, list] of byWhy) console.log(`   · ${why} — ${list.length}건 (${list.slice(0, 3).join(", ")}${list.length > 3 ? " …" : ""})`);
    }
    if (partial.length) {
      console.log(`\n△ 셀 분할로 일치 ${partial.length}건 (정상)`);
    }
    if (missing.length) {
      console.error(`\n✗ 화면에서 찾지 못함 ${missing.length}건:`);
      for (const m of missing) {
        console.error(`  [${m.loc}] ${m.rowId}  (줄 일치 ${m.hit}/${m.total})`);
        console.error(`      ${m.want}`);
      }
      process.exit(1);
    }
    console.log(`\n✓ 시트 문구가 3개 로케일 화면에 모두 반영돼 있음 — ${checked}건 확인.`);
  });
}

run().catch((e) => { console.error("검사 실패:", e.message || e); process.exit(1); });
