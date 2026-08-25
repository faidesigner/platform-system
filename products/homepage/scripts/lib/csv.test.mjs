import { describe, expect, it } from "vitest";

import { parseCsv, parseCsvRecords } from "./csv.mjs";

describe("parseCsv", () => {
  it("인용 필드 안의 개행과 콤마를 보존한다", () => {
    const text = 'a,b\n"1행\n2행","x,y"\n';
    expect(parseCsv(text)).toEqual([
      ["a", "b"],
      ["1행\n2행", "x,y"],
    ]);
  });

  it("두 개의 연속된 따옴표를 리터럴 따옴표로 읽는다", () => {
    expect(parseCsv('a\n"그는 ""좋다"" 했다"\n')).toEqual([["a"], ['그는 "좋다" 했다']]);
  });

  it("CRLF와 마지막 개행 없음을 모두 처리한다", () => {
    expect(parseCsv("a,b\r\n1,2")).toEqual([
      ["a", "b"],
      ["1", "2"],
    ]);
  });

  it("인용 필드 안의 CRLF는 LF로 정규화해 보존한다", () => {
    expect(parseCsv('a\n"1행\r\n2행"\n')).toEqual([["a"], ["1행\n2행"]]);
  });

  it("빈 셀을 빈 문자열로 유지한다", () => {
    expect(parseCsv("a,b,c\n1,,3\n")).toEqual([
      ["a", "b", "c"],
      ["1", "", "3"],
    ]);
  });

  it("BOM을 제거한다", () => {
    expect(parseCsv("﻿a,b\n1,2\n")).toEqual([
      ["a", "b"],
      ["1", "2"],
    ]);
  });

  it("빈 입력은 빈 배열이다", () => {
    expect(parseCsv("")).toEqual([]);
  });
});

describe("parseCsvRecords", () => {
  it("헤더를 키로 쓴 객체 배열을 만든다", () => {
    expect(parseCsvRecords("IA,ko\nMA01,제품\n")).toEqual([{ IA: "MA01", ko: "제품" }]);
  });

  it("헤더보다 짧은 행은 빈 문자열로 채운다", () => {
    expect(parseCsvRecords("a,b,c\n1\n")).toEqual([{ a: "1", b: "", c: "" }]);
  });

  it("헤더만 있으면 빈 배열이다", () => {
    expect(parseCsvRecords("a,b\n")).toEqual([]);
  });
});
