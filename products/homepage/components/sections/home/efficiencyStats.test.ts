import { describe, expect, it } from "vitest";

import { STAT_CONFIGS, formatStat } from "./efficiencyStats";

/**
 * main Key Numbers의 숫자는 messages가 아니라 코드에 있어서 **번역 시트 대조 도구의
 * 사정권 밖**이다(scripts/sync-messages.mjs는 messages 키만 본다). 즉 여기가 틀어지면
 * 잡아주는 게 아무것도 없었다 — 실제로 `decimals: 2`가 들어가 화면에 `99.70%`가 나갔다
 * (2026-09-02 QA. 시트가 소수점을 자동으로 늘린 서식 artifact를 근거로 삼은 결과).
 *
 * 숫자는 로케일과 무관하게 이 한 곳에서 나오므로, 이 테스트가 3개 언어를 동시에 지킨다.
 */
describe("main Key Numbers 숫자 표기", () => {
  it("화면에 찍히는 문자열이 확정 표기와 일치한다", () => {
    expect(STAT_CONFIGS.map((c) => formatStat(c))).toEqual(["99.7%", "75%", "15%"]);
  });

  it("결제 정확도는 소수점 한 자리다", () => {
    // 시트 main 22행은 ko·ja `99.70%` / en `99.7%`로 서로 다르지만, 그건 스프레드시트
    // 자동 서식이 만든 것이고 확정 표기는 3개 로케일 모두 `99.7%`다.
    expect(STAT_CONFIGS[0]).toMatchObject({ target: 99.7, decimals: 1, suffix: "%" });
    expect(formatStat(STAT_CONFIGS[0])).not.toBe("99.70%");
  });

  it("정수 스탯에는 소수점을 붙이지 않는다", () => {
    for (const c of STAT_CONFIGS.slice(1)) {
      expect(formatStat(c)).not.toContain(".");
    }
  });
});
