#!/usr/bin/env node
/**
 * About 인물 카드 레이아웃 배포 게이트 (HOM-98 · HOM-99 재발 방지).
 *
 * 세 가지 불변식을 실제 렌더 엔진으로 검사한다.
 *
 *   ① 라벨 우측 정렬 (HOM-99) — 초록 라벨(bg-mint-400)의 **카드 우측 여백**이 네 카드 모두 같아야 한다.
 *      라벨을 텍스트 인라인 흐름에 두면 앞 문구 길이만큼 밀려 사람마다 위치가 달라진다.
 *   ② 카드 화면 이탈 금지 (HOM-98) — 카드 폭이 뷰포트를 넘지 않아야 한다.
 *   ③ 이미지 비율 유지 — 폭이 줄면 높이도 같이 줄어야 한다(9:5 고정). 고정 폭이면 잘린다.
 *
 * 왜 게이트인가: 두 건 모두 **실제로 회귀했다.**
 *   - HOM-99는 2026-08-27 수정 → PR #11(2026-08-28)에서 라벨을 `<p>` 인라인으로 합치며 되돌아갔다.
 *     ja@1440 라벨 좌측 x가 379/408/534/307로 편차 227px였고, vitest 212개는 전부 통과했다.
 *   - jsdom은 getBoundingClientRect가 0이라 이 종류를 원리적으로 못 잡는다.
 *
 * ①을 **좌측 x가 아니라 우측 여백**으로 재는 이유: 라벨 텍스트 길이가 사람마다 달라
 * 우측 정렬이 맞아도 좌측 x는 자연히 다르다. 불변식은 "우측이 맞춰졌는가"다.
 *
 * 실행: node scripts/check-about-layout.mjs   (deploy.sh 빌드 직후 자동 호출)
 */
import { withPreview, measurePage } from "./lib/staticPreview.mjs";

const PORT = 43223;
const LOCALES = ["ko", "en", "ja"];
/** 데스크톱(라벨 정렬) + HOM-98이 터졌던 422~703px 구간 + 모바일 하한 */
const WIDTHS = [1920, 1440, 1280, 1000, 703, 430, 390];
/** 서브픽셀 반올림 허용치(px). 0을 요구하면 폰트 렌더링 잔차로 튄다. */
const TOLERANCE = 1;
/** 이미지 설계 비율 9:5 = 1.8 */
const ASPECT = 9 / 5;
const ASPECT_TOLERANCE = 0.05;

/** 브라우저 컨텍스트: 인물 카드 4장의 카드/라벨/이미지 기하를 잰다. */
function measure() {
  const labels = [...document.querySelectorAll("span.bg-mint-400")];
  const cards = [];
  for (const label of labels) {
    const card = label.closest("article");
    if (!card) continue;
    const img = card.querySelector("img");
    const cb = card.getBoundingClientRect();
    const lb = label.getBoundingClientRect();
    const ib = img ? img.getBoundingClientRect() : null;
    cards.push({
      label: label.textContent.trim().slice(0, 16),
      cardW: Math.round(cb.width),
      cardRight: Math.round(cb.right),
      // 라벨 우측이 카드 우측에서 얼마나 떨어져 있는가 — 이 값이 네 카드 모두 같아야 한다.
      rightInset: Math.round(cb.right - lb.right),
      imgW: ib ? Math.round(ib.width) : null,
      imgH: ib ? Math.round(ib.height) : null,
      aspect: ib && ib.height ? +(ib.width / ib.height).toFixed(3) : null,
    });
  }
  // ── Management(임원) 카드 — People 카드와 **별개 컴포넌트**다.
  // 위 셀렉터(span.bg-mint-400/article)는 People만 잡아서 Management는 그동안 무검사였고,
  // 실제로 2026-09-02에 "인물마다 초록 배경·사진 위치가 다르다"가 이 구간에서 터졌다.
  // 원인은 썸네일 컨테이너 폭이 라벨 텍스트 길이로 결정된 것 — 절대배치된 네임박스(left-0)와
  // 사진(right-0)이 그 폭에 매달려 있어 인물마다 간격이 달라졌다.
  const mgmt = [];
  for (const nameBox of document.querySelectorAll('div[style*="linear-gradient(91deg"]')) {
    const thumb = nameBox.parentElement;
    const card = thumb && thumb.parentElement;
    const imgBox = thumb && thumb.querySelector("div.absolute.right-0");
    if (!thumb || !card || !imgBox) continue;
    const t = thumb.getBoundingClientRect();
    mgmt.push({
      who: (nameBox.textContent || "").replace(/\s+/g, " ").trim().slice(0, 20),
      cardLeft: Math.round(card.getBoundingClientRect().left),
      thumbW: Math.round(t.width),
      // 썸네일 좌변 기준 오프셋 — 네 카드 모두 같아야 한다.
      nameOff: Math.round(nameBox.getBoundingClientRect().left - t.left),
      imgOff: Math.round(imgBox.getBoundingClientRect().left - t.left),
    });
  }

  return { cards, mgmt, viewportW: window.innerWidth, docW: document.documentElement.scrollWidth };
}

await withPreview({ port: PORT, what: "About 레이아웃 검사" }, async ({ browser, origin }) => {
  const failures = [];
  let checked = 0;

  for (const width of WIDTHS) {
    for (const loc of LOCALES) {
      const m = await measurePage(browser, `${origin}/${loc}/about/`, { width }, measure);
      const cards = m.cards;
      if (cards.length < 4) {
        failures.push({ width, loc, msg: `인물 카드를 ${cards.length}장만 찾았다 — 셀렉터(span.bg-mint-400 / article)가 깨졌는지 확인할 것` });
        continue;
      }
      checked++;

      // ① 라벨 우측 정렬
      const insets = cards.map((c) => c.rightInset);
      const dev = Math.max(...insets) - Math.min(...insets);
      if (dev > TOLERANCE) {
        failures.push({
          width, loc,
          msg: `라벨 우측 여백 편차 ${dev}px > ${TOLERANCE}px (HOM-99) — ${cards.map((c) => `${c.label}:${c.rightInset}`).join(" / ")}`,
        });
      }

      // ② 카드가 화면을 넘지 않는다
      for (const c of cards) {
        if (c.cardW > m.viewportW) {
          failures.push({ width, loc, msg: `카드 폭 ${c.cardW}px > 뷰포트 ${m.viewportW}px (HOM-98) — ${c.label}` });
        }
      }

      // ③ 이미지 비율
      for (const c of cards) {
        if (c.aspect == null) {
          failures.push({ width, loc, msg: `${c.label} 카드에서 이미지를 찾지 못함` });
        } else if (Math.abs(c.aspect - ASPECT) > ASPECT_TOLERANCE) {
          failures.push({ width, loc, msg: `이미지 비율 ${c.aspect} ≠ ${ASPECT.toFixed(3)} (±${ASPECT_TOLERANCE}) — ${c.label} ${c.imgW}×${c.imgH}` });
        }
      }

      // ④ Management 카드 — 네 장의 기하가 **완전히 동일**해야 한다(2026-09-02 회귀).
      //    카드 폭이 라벨 텍스트 길이로 결정되면 여기서 값이 갈린다.
      const mgmt = m.mgmt || [];
      let mgmtDev = 0;
      if (mgmt.length < 4) {
        failures.push({ width, loc, msg: `Management 카드를 ${mgmt.length}장만 찾았다 — 셀렉터(네임박스 gradient / div.absolute.right-0)가 깨졌는지 확인할 것` });
      } else {
        // 2열로 갈리는 구간에서는 cardLeft가 열마다 다른 것이 정상이므로 폭·오프셋만 본다.
        for (const key of ["thumbW", "nameOff", "imgOff"]) {
          const vals = mgmt.map((c) => c[key]);
          const d = Math.max(...vals) - Math.min(...vals);
          mgmtDev = Math.max(mgmtDev, d);
          if (d > TOLERANCE) {
            failures.push({
              width, loc,
              msg: `Management ${key} 편차 ${d}px > ${TOLERANCE}px — 인물마다 초록 배경·사진 위치가 달라진다: ${mgmt.map((c) => `${c.who}:${c[key]}`).join(" / ")}`,
            });
          }
        }
      }

      const ok = dev <= TOLERANCE && mgmtDev <= TOLERANCE && cards.every((c) => c.cardW <= m.viewportW && c.aspect != null && Math.abs(c.aspect - ASPECT) <= ASPECT_TOLERANCE);
      console.log(
        `${ok ? "✓" : "✗"} ${String(width).padStart(4)}px /${loc}/  카드 ${String(cards[0].cardW).padStart(4)}px · 라벨 우측여백 편차 ${String(dev).padStart(3)}px · 비율 ${cards[0].aspect} · 임원카드 편차 ${String(mgmtDev).padStart(3)}px`,
      );
    }
  }

  if (failures.length) {
    console.error(`\n✗ About 레이아웃 위반 ${failures.length}건:`);
    failures.forEach((f) => console.error(`  ${f.width}px /${f.loc}/ — ${f.msg}`));
    process.exit(1);
  }
  console.log(`\n✓ About 레이아웃 정상 — ${checked}개 조합 통과 (인물 카드: 라벨 우측 정렬 · 화면 이탈 · 이미지 비율 / 임원 카드: 네 장 기하 일치).`);
});
