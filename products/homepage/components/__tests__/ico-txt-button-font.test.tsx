import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { IcoTxtButton } from "@fai/ui/components/button/IcoTxtButton";

/**
 * HOM-32 회귀 방지 — IcoTxtButton 텍스트 폰트 폴백.
 *
 * 근본 원인: 사이트는 CDN에서 "Pretendard Variable"만 로드하고 plain 계열(패밀리명만 지정,
 * 폴백 없음)은 로드하지 않는다. 폴백 없는 plain Pretendard 폰트 클래스는 Pretendard가 로컬에
 * 설치되지 않은 모바일 환경에서 매칭에 실패해 브라우저 기본 세리프(Times)로 폴백된다
 * ("영어 세리프 서체").
 *
 * 폰트 스택은 `--font-family-Pretendard` 토큰("Pretendard Variable" 우선 + sans-serif 폴백)을
 * 단일 소스로 참조해야 하며, 어떤 경우에도 세리프로 폴백되어선 안 된다.
 *
 * 주의: 아래 BARE_PLAIN은 문자열을 분할 조립한다. Tailwind 스캐너가 이 테스트 파일의 리터럴을
 * 실제 클래스로 오인 추출해 죽은 규칙을 프로덕션 CSS에 심는 것을 방지하기 위함.
 */
const BARE_PLAIN = "font-" + "['Pretendard']";

describe("IcoTxtButton 폰트 폴백 (HOM-32)", () => {
  const SIZES = ["XL", "L", "M", "S"] as const;

  it.each(SIZES)(
    "size=%s: 폴백 없는 plain 폰트 클래스를 쓰지 않는다",
    (size) => {
      render(<IcoTxtButton size={size}>Learn More</IcoTxtButton>);
      const label = screen.getByText("Learn More");
      expect(label.className).not.toContain(BARE_PLAIN);
    },
  );

  // XL은 폰트 패밀리를 지정하지 않고 body(--w-font-family)를 상속한다(세리프 아님).
  // Pretendard로 고정된 L/M/S만 토큰 참조로 교정 대상.
  it.each(["L", "M", "S"] as const)(
    "size=%s: Pretendard 토큰 변수를 참조한다",
    (size) => {
      render(<IcoTxtButton size={size}>Learn More</IcoTxtButton>);
      const label = screen.getByText("Learn More");
      expect(label.className).toContain("--font-family-Pretendard");
    },
  );
});
