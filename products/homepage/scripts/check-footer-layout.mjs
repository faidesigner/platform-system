#!/usr/bin/env node
/**
 * 데스크톱 footer 레이아웃 배포 게이트 (HOM-94 재발 방지).
 *
 * 정적 export(out/)를 로컬 서빙하고, 로케일 × 데스크톱 폭 조합으로 홈을 로드해
 * footer의 두 가지 불변식을 검사한다.
 *
 *   ① 로고 폭 로케일 불변  — 같은 뷰포트 폭에서 로고 크기는 ko·en·ja가 동일해야 한다.
 *   ② 로고~회사명 최소 여백 — 두 요소가 붙거나 겹치면 안 된다.
 *
 * 왜 필요한가(HOM-94): logoArea에 shrink-0가 없어, en/ja처럼 라벨이 긴 로케일에서
 * contentsArea가 요구 폭을 키우면 **축소 압력이 로고 컬럼으로 전가**됐다.
 * 그 결과 1440·1600에서 로고가 203px → 165px로 찌그러지고 회사명이 로고에 간격 0px로
 * 접촉했다. 1920에서는 여유 폭이 있어 정상으로 보여 개발·코드리뷰에서 놓쳤다 —
 * **폭을 바꿔가며 재보지 않으면 드러나지 않는 종류의 회귀**라 게이트로 고정한다.
 *
 * jsdom(vitest)은 레이아웃을 계산하지 않아 getBoundingClientRect가 0을 돌려준다.
 * 그래서 이 검사는 단위 테스트가 아니라 실제 렌더 엔진이 필요하다.
 *
 * 실행: node scripts/check-footer-layout.mjs   (deploy.sh 빌드 직후 자동 호출)
 * 사전조건: out/ 존재, 시스템 Chrome(또는 PUPPETEER_EXECUTABLE_PATH). Chrome 없으면 경고 후 skip.
 */
import { withPreview, measurePage } from "./lib/staticPreview.mjs";

const PORT = 43221;
const LOCALES = ["ko", "en", "ja"];
/** 데스크톱 레이아웃(fai-footer__desktop)이 적용되는 구간만 본다. ≤960px는 compact 레이아웃이라 별개다. */
const WIDTHS = [1440, 1600, 1920];
/**
 * 로고와 회사명 사이 최소 여백(px).
 * 기준: ko@1440이 86px, PRD(회귀 이전) en@1440이 196px였다. 24px는 "붙어 보이지 않는다"의
 * 하한선이며 디자인 값을 고정하려는 수치가 아니다 — 접촉(0px) 회귀만 확실히 잡는다.
 */
const MIN_GAP = 24;

/**
 * 브라우저 컨텍스트에서 실행 — footer 로고 박스와 회사명 텍스트의 실제 잉크 좌측을 잰다.
 * 회사명은 부모 <p>가 컨테이너 폭 전체를 차지하므로 Range로 텍스트 자체의 폭을 재야 한다.
 */
function measure() {
  const footer = document.querySelector("footer");
  if (!footer) return { error: "footer 없음" };
  const desktop = footer.querySelector(".fai-footer__desktop");
  if (!desktop || getComputedStyle(desktop).display === "none") return { skip: "desktop 레이아웃 비활성" };

  const box = (el) => { const b = el.getBoundingClientRect(); return { l: Math.round(b.left), r: Math.round(b.right), w: Math.round(b.width) }; };

  const logo = [...desktop.querySelectorAll("img")]
    .map(box).filter((o) => o.w >= 50).sort((a, b) => a.l - b.l)[0];
  if (!logo) return { error: "로고 img를 찾지 못함" };

  // 회사명 = 자식 없는 요소 중 회사명 텍스트를 가진 것
  const nameEl = [...desktop.querySelectorAll("*")].find(
    (e) => e.children.length === 0 && /파인더스에이아이|Fainders\.ai Inc\.|株式会社|ファインダーズ/.test(e.textContent),
  );
  if (!nameEl) return { error: "회사명 요소를 찾지 못함" };
  const rg = document.createRange();
  rg.selectNodeContents(nameEl);
  const ink = rg.getBoundingClientRect();

  // ③ 코드성 값(전화번호)은 한 줄로 렌더돼야 한다.
  //    `+82-2-6191-` / `0049` 처럼 숫자 중간에서 끊기면 읽을 수 없다.
  let telWrapped = null;
  const telEl = [...desktop.querySelectorAll("span")].find((e) =>
    e.children.length === 0 && /^\+?[\d][\d\-\s]{7,}$/.test(e.textContent.trim()),
  );
  if (telEl) {
    const b = telEl.getBoundingClientRect();
    const lh = parseFloat(getComputedStyle(telEl).lineHeight) || 20;
    telWrapped = { txt: telEl.textContent.trim(), lines: Math.round(b.height / lh), h: Math.round(b.height), lh: Math.round(lh) };
  }

  return { logo, nameLeft: Math.round(ink.left), gap: Math.round(ink.left) - logo.r, tel: telWrapped };
}

await withPreview({ port: PORT, what: "footer 레이아웃 검사" }, async ({ browser, origin }) => {
  const failures = [];
  const results = [];

  for (const width of WIDTHS) {
    for (const loc of LOCALES) {
      const m = await measurePage(browser, `${origin}/${loc}/`, { width }, measure);

      if (m.error) { failures.push({ width, loc, msg: m.error }); continue; }
      if (m.skip) continue;
      results.push({ width, loc, ...m });

      if (m.gap < MIN_GAP) {
        failures.push({ width, loc, msg: `로고~회사명 여백 ${m.gap}px < ${MIN_GAP}px (로고 우측 ${m.logo.r} / 회사명 좌측 ${m.nameLeft})` });
      }
      if (m.tel && m.tel.lines > 1) {
        failures.push({ width, loc, msg: `전화번호 "${m.tel.txt}" 가 ${m.tel.lines}줄로 끊김 — 코드성 값은 한 줄이어야 한다` });
      }
    }

    // ② 같은 폭에서 로고 크기는 로케일과 무관해야 한다 (ko를 기준으로 삼는다)
    const atWidth = results.filter((r) => r.width === width);
    const ref = atWidth.find((r) => r.loc === "ko");
    if (ref) {
      for (const r of atWidth) {
        if (r.loc !== "ko" && r.logo.w !== ref.logo.w) {
          failures.push({ width, loc: r.loc, msg: `로고 폭 ${r.logo.w}px ≠ ko ${ref.logo.w}px — 로케일에 따라 로고가 축소되고 있다` });
        }
      }
    }
  }

  for (const r of results) {
    const bad = r.gap < MIN_GAP;
    const telInfo = r.tel ? ` · 전화 ${r.tel.lines}줄` : "";
    console.log(`${bad || (r.tel && r.tel.lines > 1) ? "✗" : "✓"} ${String(r.width).padStart(4)}px /${r.loc}/  로고 ${String(r.logo.w).padStart(3)}px · 여백 ${String(r.gap).padStart(4)}px${telInfo}`);
  }

  if (failures.length) {
    console.error(`\n✗ footer 레이아웃 위반 ${failures.length}건 (HOM-94):`);
    failures.forEach((f) => console.error(`  ${f.width}px /${f.loc}/ — ${f.msg}`));
    process.exit(1);
  }
  console.log(`\n✓ footer 레이아웃 정상 — ${WIDTHS.length}×${LOCALES.length}개 조합 통과.`);
});
