import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";

/**
 * 언어 스위처 라벨 회귀 방지 (QA 2026-08-31).
 *
 * 데스크톱 드롭다운(homepage)과 모바일 드로어(@fai/ui)가 **각자 상수 배열을 들고 있어**
 * `KO / EN / JP` ↔ `KR / EN / JP`로 갈렸다. 한쪽만 고치면 다른 쪽이 그대로 남는다.
 * 그래서 라벨은 `@fai/ui`의 LOCALE_OPTIONS 하나로 모으고, 이 테스트가
 * ① 단일 출처의 값과 ② 두 스위처의 실제 렌더 결과가 같은지를 함께 강제한다.
 */

vi.mock("@/i18n/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push: vi.fn() }),
}));
vi.mock("@/lib/localeScroll", () => ({ markLocaleSwitchScroll: vi.fn() }));
// jsdom은 svg 에셋 import를 URL 문자열로 받아 태그명으로 쓰다 깨진다 — 렌더 대상이 아니라 no-op.
vi.mock("@fai/ui/components/common/Icon/GlobeIcon", () => ({ default: () => null }));
vi.mock("@fai/ui/components/common/Icon/ChevronIcon", () => ({ default: () => null }));

import { LOCALE_OPTIONS } from "@fai/ui";
import { LanguageSwitcher as DrawerLanguageSwitcher } from "@fai/ui";
import DesktopLanguageSwitcher from "./LanguageSwitcher";

const EXPECTED = [
  { code: "ko", label: "KO" },
  { code: "en", label: "EN" },
  { code: "ja", label: "JA" },
];

function renderWithLocale(ui: React.ReactElement, locale = "ko") {
  return render(
    <NextIntlClientProvider locale={locale} messages={{}}>
      {ui}
    </NextIntlClientProvider>,
  );
}

describe("언어 스위처 라벨 단일 출처", () => {
  it("LOCALE_OPTIONS는 ISO 639-1 언어코드 KO/EN/JA를 쓴다", () => {
    expect(LOCALE_OPTIONS.map((l) => ({ code: l.code, label: l.label }))).toEqual(EXPECTED);
  });

  it("모바일 드로어 스위처가 세 라벨을 그대로 렌더한다", () => {
    renderWithLocale(<DrawerLanguageSwitcher isDarkMode={false} onLocaleChange={vi.fn()} />);
    for (const { label } of EXPECTED) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
    expect(screen.queryByText("KR")).not.toBeInTheDocument();
    expect(screen.queryByText("JP")).not.toBeInTheDocument();
  });

  it("데스크톱 드롭다운 스위처가 세 라벨을 그대로 렌더한다", () => {
    const { container } = renderWithLocale(<DesktopLanguageSwitcher isTransparent={false} />);
    // 드롭다운은 hover로 열린다 — 닫힌 상태에선 현재 라벨만 있어 목록을 검증할 수 없다.
    fireEvent.mouseEnter(container.firstElementChild as HTMLElement);
    const menu = screen.getByRole("menu");
    expect(
      within(menu)
        .getAllByRole("menuitem")
        .map((el) => el.textContent?.trim()),
    ).toEqual(EXPECTED.map((l) => l.label));
    expect(screen.queryByText("KR")).not.toBeInTheDocument();
    expect(screen.queryByText("JP")).not.toBeInTheDocument();
  });
});
