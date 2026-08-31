/**
 * 언어 스위처가 노출하는 로케일 목록 — **단일 출처**.
 *
 * 이전에는 세 컴포넌트가 각자 배열을 들고 있었고(NavigationBar 폴백 / navigation/LanguageSwitcher /
 * homepage의 데스크톱 스위처) 라벨이 `KO·KR`, `JA·JP`로 갈렸다. 한 곳만 고치면 나머지가 남는다.
 *
 * 라벨은 **ISO 639-1 언어코드의 대문자 표기**다(국가코드 아님).
 * - 스위처가 고르는 대상은 국가가 아니라 언어다 — `KR`/`JP`는 ISO 3166-1 국가코드다.
 * - 라우팅 locale(`/ko`, `/en`, `/ja`)·메시지 파일·`<html lang>`이 모두 언어코드라 표기가 일치한다.
 * - `lang` 속성에 `kr`/`jp`를 넣으면 BCP-47상 유효하지 않은 서브태그가 된다.
 */
export const LOCALE_OPTIONS = [
  { code: 'ko', label: 'KO' },
  { code: 'en', label: 'EN' },
  { code: 'ja', label: 'JA' },
] as const;

export type LocaleOption = (typeof LOCALE_OPTIONS)[number];
export type LocaleCode = LocaleOption['code'];

/** 코드 → 표시 라벨. 미등록 코드는 대문자 폴백(라우팅이 늘 언어코드라 안전하다). */
export function localeLabel(code: string): string {
  return LOCALE_OPTIONS.find((l) => l.code === code)?.label ?? code.toUpperCase();
}
