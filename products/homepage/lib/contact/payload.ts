import { siteConfig } from "@/config/site";

/**
 * 라이브 contact-us와 동일한 Zapier catch hook.
 * 다운스트림 Zap이 이 URL 경로·필드 포맷 기준으로 매핑돼 있어 **경로와 payload 필드는
 * 임의로 변경하면 안 된다.** 로케일에 따라 달라지는 것은 `lang` 쿼리뿐이다.
 */
const ZAPIER_HOOK = "https://hooks.zapier.com/hooks/catch/21523474/2fqxxmt/";

/** `lang` 쿼리에 쓸 수 있는 값 — 사이트가 지원하는 로케일. */
const LANGS = ["ko", "en", "ja"] as const;
const DEFAULT_LANG = "ko";

/**
 * 제출 로케일을 담은 웹훅 URL.
 *
 * ⚠️ 예전에는 `?lang=ko`가 상수에 박혀 있어 **en·ja에서 제출해도 ko로 전송**됐다.
 *    전송 자체는 성공하고(요청 200 · 완료 화면 도달) 오류도 로그도 남지 않아,
 *    다운스트림에서 로케일별로 분기하면 en·ja 리드가 ko 쪽으로 조용히 흘러간다.
 *    "영문으로 제출했는데 도달하지 않았다"로 나타났다 (2026-08-31 실측 확인).
 *
 * 알 수 없는 로케일은 ko로 떨어뜨린다 — 리드를 잃는 것보다 낫다.
 */
export function zapierContactUrl(locale?: string): string {
  const lang = LANGS.includes(locale as (typeof LANGS)[number])
    ? (locale as (typeof LANGS)[number])
    : DEFAULT_LANG;
  return `${ZAPIER_HOOK}?lang=${lang}`;
}

export interface ContactFormValues {
  company?: string;
  name?: string;
  email?: string;
  phone?: string;
}

export interface UtmParams {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
}

export interface ContactPayload extends UtmParams {
  company: string;
  name: string;
  email: string;
  phone: string;
  solution: string[];
  option: string[];
  content: string;
  referrer: string;
}

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

/**
 * Zap 계약: 관심사 value → solution 문자열(정확 문자열, 변경 금지).
 * VCO 그룹의 세부 항목은 모두 "vision checkout"으로 수렴하고,
 * 세부 라벨(베이커리/급식 등)은 content 문자열에 담는다.
 */
const SOLUTION_BY_INTEREST: Record<string, string> = {
  bakery: "vision checkout",
  catering: "vision checkout",
  "special-venue": "vision checkout",
  etc: "vision checkout",
  "standard-store": "standard store",
  "micro-store": "micro store",
};

/** solution 문자열 → content 표시용 제품명. */
const SOLUTION_DISPLAY: Record<string, string> = {
  "vision checkout": "VISION CHECK-OUT",
  "standard store": "STANDARD STORE",
  "micro store": "MICRO STORE",
};

/** solution[] 및 content 세그먼트의 고정 출력 순서(결정론적 보장). */
const SOLUTION_ORDER = ["vision checkout", "standard store", "micro store"];

/** 관심사 value → 사용자 노출 라벨. siteConfig에서 파생해 라벨 드리프트 방지. */
const LABEL_BY_INTEREST: Record<string, string> = Object.fromEntries(
  siteConfig.contact.interests.flatMap((group) =>
    group.options.map((opt) => [opt.value, opt.label]),
  ),
);

/** URL 쿼리스트링에서 utm_* 파라미터 추출(없으면 빈 문자열). */
export function parseUtm(search: string): UtmParams {
  const params = new URLSearchParams(search);
  return UTM_KEYS.reduce((acc, key) => {
    acc[key] = params.get(key) ?? "";
    return acc;
  }, {} as UtmParams);
}

interface BuildInput {
  values: ContactFormValues;
  /** 관심사 value → 체크 여부 */
  interests: Record<string, boolean>;
  utm?: Partial<UtmParams>;
  referrer?: string;
}

/**
 * 폼 입력을 라이브 contact-us와 동일한 Zapier payload로 조립하는 순수 함수.
 * - solution[]: 선택된 관심사를 상위 제품 라인으로 매핑(고정 순서, 중복 제거)
 * - content: 선택 세부 항목을 사람이 읽는 문자열로 자동 생성
 */
export function buildContactPayload(input: BuildInput): ContactPayload {
  const { values, interests } = input;
  const selected = Object.entries(interests)
    .filter(([, checked]) => checked)
    .map(([value]) => value);

  // solution 라인 → 선택된 세부 라벨 목록
  const labelsBySolution = new Map<string, string[]>();
  for (const value of selected) {
    const solution = SOLUTION_BY_INTEREST[value];
    if (!solution) continue; // 알 수 없는 관심사는 solution에서 제외(계약 밖)
    const labels = labelsBySolution.get(solution) ?? [];
    labels.push(LABEL_BY_INTEREST[value] ?? value);
    labelsBySolution.set(solution, labels);
  }

  const solution = SOLUTION_ORDER.filter((s) => labelsBySolution.has(s));

  const content = solution.length
    ? "관심 제품: " +
      solution
        .map((s) => {
          const display = SOLUTION_DISPLAY[s] ?? s;
          const labels = labelsBySolution.get(s) ?? [];
          // VCO는 세부 버티컬을 괄호로 첨부. 스토어 라인은 라벨이 곧 제품명이라 생략.
          return s === "vision checkout" && labels.length
            ? `${display}(${labels.join(", ")})`
            : display;
        })
        .join(", ")
    : "";

  const utm = { ...parseUtm(""), ...input.utm };

  return {
    company: values.company ?? "",
    name: values.name ?? "",
    email: values.email ?? "",
    phone: values.phone ?? "",
    solution,
    option: [],
    content,
    utm_source: utm.utm_source,
    utm_medium: utm.utm_medium,
    utm_campaign: utm.utm_campaign,
    utm_content: utm.utm_content,
    utm_term: utm.utm_term,
    referrer: input.referrer ?? "",
  };
}
