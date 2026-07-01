import "@testing-library/jest-dom/vitest";

// jsdom은 scrollIntoView/scrollTo를 구현하지 않는다. 컴포넌트 테스트 공용 no-op 폴리필
// (없으면 스크롤 경로에서 "Not implemented" 예외로 프로세스가 exit 1).
if (typeof Element !== "undefined") {
  Element.prototype.scrollIntoView = () => {};
}
if (typeof window !== "undefined") {
  window.scrollTo = (() => {}) as typeof window.scrollTo;
}
