import { describe, expect, it } from "vitest";

import decisionsFile from "@/i18n/sheet-decisions.json";
import en from "@/messages/en.json";
import ja from "@/messages/ja.json";
import ko from "@/messages/ko.json";
import { flattenMessages } from "@/scripts/lib/sheetDiff.mjs";

/**
 * 대조 도구(scripts/sync-messages.mjs)와 **같은 flatten 구현**을 쓴다.
 * 여기서 별도 flatten을 두면 도구와 가드가 서로 다른 키 경로를 보게 되어,
 * 가드가 통과해도 도구는 여전히 실제 이격을 숨길 수 있다.
 */
const MESSAGES: Record<string, Record<string, string>> = {
  ko: flattenMessages(ko),
  en: flattenMessages(en),
  ja: flattenMessages(ja),
};

const LOCALES = Object.keys(MESSAGES);

const { decisions } = decisionsFile;

describe("sheet-decisions.json", () => {
  it("모든 선언의 locale이 지원 로케일이다", () => {
    // 오타 locale은 loadDecisionSet의 조회 키가 영원히 안 맞아 선언이 조용히 무효화된다.
    const unknown = decisions
      .filter((d) => !LOCALES.includes(d.locale))
      .map((d) => `${d.key}(${d.locale})`);
    expect(unknown).toEqual([]);
  });

  it("선언된 key가 messages에 존재한다", () => {
    // 키가 사라졌는데 선언만 남으면 시트 행이 영구히 DECIDED로 묻힌다.
    const missing = decisions
      .filter((d) => LOCALES.includes(d.locale) && MESSAGES[d.locale][d.key] === undefined)
      .map((d) => `${d.key}(${d.locale})`);
    expect(missing).toEqual([]);
  });

  // 선언된 codeValue가 실제 messages와 어긋나면, 대조 도구가 실제 이격을 DECIDED로 숨긴다.
  it("모든 선언의 codeValue가 현재 messages 값과 일치한다", () => {
    const stale = decisions
      .filter((d) => MESSAGES[d.locale]?.[d.key] !== d.codeValue)
      .map((d) => `${d.key}(${d.locale}): 선언=${d.codeValue} / 실제=${MESSAGES[d.locale]?.[d.key]}`);
    expect(stale).toEqual([]);
  });

  it("모든 선언에 reason과 decidedAt이 있다", () => {
    const invalid = decisions
      .filter((d) => !d.reason?.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(d.decidedAt ?? ""))
      .map((d) => `${d.key}(${d.locale})`);
    expect(invalid).toEqual([]);
  });

  it("같은 (key, locale)을 중복 선언하지 않는다", () => {
    const seen = decisions.map((d) => `${d.key}|${d.locale}`);
    expect(seen.length).toBe(new Set(seen).size);
  });
});
