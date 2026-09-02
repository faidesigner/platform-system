/**
 * main 화면 Key Numbers 섹션의 **숫자**. 라벨·설명은 messages(`home.efficiency.stats.N`)에 있다.
 *
 * 왜 별도 모듈인가 — 이 숫자들은 messages가 아니라 코드에 있어서 **번역 시트 대조 도구
 * (scripts/sync-messages.mjs)의 사정권 밖**이다. 시트가 틀려도, 코드가 틀려도 아무것도
 * 안 잡힌다. 그래서 표시 문자열을 테스트로 고정할 수 있게 컴포넌트에서 떼어냈다.
 * (EfficiencySection은 async 서버 컴포넌트라 vitest에서 그대로 import하기 어렵다.)
 *
 * ⚠️ `decimals`를 시트 표기만 보고 늘리지 마라. 시트 main 22행은 ko·ja가 `99.70%`,
 *    en이 `99.7%`로 **서로 다른데**, 이건 스프레드시트가 소수점 자리를 자동으로 늘려
 *    생긴 서식 artifact다(2026-09-02 확인). 표기는 3개 로케일 모두 `99.7%`가 맞다.
 *    이전 코드는 `decimals: 2`에 "시트 표기가 99.70%"라는 주석을 달아 그 artifact를
 *    근거로 삼고 있었다 — 그래서 화면에 `99.70%`가 나갔다.
 */

export interface StatConfig {
  target: number;
  decimals?: number;
  suffix?: string;
}

export const STAT_CONFIGS: readonly StatConfig[] = [
  { target: 99.7, decimals: 1, suffix: '%' },
  { target: 75, suffix: '%' },
  { target: 15, suffix: '%' },
];

/** 화면에 실제로 찍히는 문자열. AnimatedStat의 최종 표시와 같은 규칙을 쓴다. */
export function formatStat({ target, decimals = 0, suffix = '', prefix = '' }: StatConfig & { prefix?: string }): string {
  return `${prefix}${target.toFixed(decimals)}${suffix}`;
}
