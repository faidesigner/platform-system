// 스크롤 복원(뒤로/앞으로) 순수 로직 — DOM·라우팅과 분리해 단위 테스트 100%를 보장한다. (HOM-37)
// SmoothScroll이 이 모듈의 함수만 조합해 부수효과를 실행한다.

const KEY = "fai:scrollPositions";
/** URL별 스크롤 위치 보관 상한. 초과 시 오래된 항목부터 제거. */
export const SCROLL_CAP = 30;

type PositionMap = Record<string, number>;

function readMap(): PositionMap {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as PositionMap) : {};
  } catch {
    return {};
  }
}

/**
 * `sessionStorage`에 URL→scrollY 를 기록한다.
 * - 기존 url은 삭제 후 재삽입해 "최신"으로 이동(상한 제거에서 살아남도록).
 * - 항목 수가 상한을 넘으면 가장 오래된 것부터 제거.
 * - storage 비활성(프라이빗 모드) 등 예외는 조용히 무시(복원 포기 = 최상단 폴백).
 */
export function saveScrollPosition(url: string, y: number): void {
  try {
    const map = readMap();
    delete map[url]; // 재삽입으로 최신화
    map[url] = y;
    const keys = Object.keys(map);
    for (let i = 0; i < keys.length - SCROLL_CAP; i++) {
      delete map[keys[i]]; // 오래된 것부터 제거(삽입 순서 = 키 순서)
    }
    sessionStorage.setItem(KEY, JSON.stringify(map));
  } catch {
    // no-op
  }
}

/** 저장된 스크롤 위치. 없거나 무효(NaN)면 null. */
export function readScrollPosition(url: string): number | null {
  const v = readMap()[url];
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}

/** 두 URL의 pathname(해시·search 제외)이 같은지. 해시 전용 pop 판별에 사용. */
export function samePath(a: string, b: string): boolean {
  const strip = (u: string) => u.split("#")[0].split("?")[0];
  return strip(a) === strip(b);
}

/** pop이 해시 전용인지(pathname 불변) 아니면 경로 변경인지 분류. */
export function classifyPop(target: string, handledUrl: string): "hash-only" | "path-change" {
  return samePath(target, handledUrl) ? "hash-only" : "path-change";
}

export type ScrollAction =
  | { type: "restore"; y: number }
  | { type: "top" }
  | { type: "anchor"; hash: string };

/**
 * `[pathname]` 스크롤 이펙트가 수행할 동작을 순수 함수로 판정한다.
 * 우선순위: ① 첫 마운트 back/forward 복원 → ② 경로변경 pop 복원 → ③ 언어전환 복원 →
 * ④ 해시 앵커 → ⑤ 최상단.
 * boolean 플래그 대신 URL 일치(pendingPopMatches)로 판정해 PR#7 stale-flag 버그를 구조적으로 제거.
 */
export function decideScrollAction(input: {
  isFirstRun: boolean;
  navType: string | undefined;
  pendingPopMatches: boolean;
  localeY: number | null;
  hash: string;
  savedY: number | null;
}): ScrollAction {
  const { isFirstRun, navType, pendingPopMatches, localeY, hash, savedY } = input;
  if (isFirstRun && navType === "back_forward") return { type: "restore", y: savedY ?? 0 };
  if (pendingPopMatches) return { type: "restore", y: savedY ?? 0 };
  if (localeY !== null) return { type: "restore", y: localeY };
  if (hash) return { type: "anchor", hash };
  return { type: "top" };
}

/** 목표 y를 [0, maxY] 범위로 클램프(음수 maxY는 0으로). */
export function clampScrollY(y: number, maxY: number): number {
  return Math.min(Math.max(0, y), Math.max(0, maxY));
}

/** rAF 재시도 종료 조건: 콘텐츠 높이가 목표에 도달했거나 재시도 상한 도달. */
export function retryDone(maxY: number, targetY: number, tries: number, max: number): boolean {
  return maxY >= targetY || tries >= max;
}

/** Lenis가 있으면 그쪽으로, 없으면 window로 스크롤(폴백). */
export function applyScroll(
  y: number,
  lenis: { resize: () => void; scrollTo: (y: number, opts: { immediate: boolean }) => void } | null,
  win: { scrollTo: (x: number, y: number) => void },
): void {
  if (lenis) {
    lenis.resize();
    lenis.scrollTo(y, { immediate: true });
  } else {
    win.scrollTo(0, y);
  }
}
