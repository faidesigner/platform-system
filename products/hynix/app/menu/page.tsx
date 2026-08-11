"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/app/components/ui/sidebar/Sidebar";
import { Breadcrumbs } from "@/app/components/ui/breadcrumbs/Breadcrumbs";
import { Button } from "@/app/components/ui/button/Button";
import { Input } from "@/app/components/ui/input/Input";
import { Badge, type BadgeVariant } from "@/app/components/ui/badge/Badge";
import { NAV, routeFor } from "@/app/menu/nav";

/**
 * SCR-41 메뉴 관리 (/menu) — 목록
 * 인터랙션: 사이드바 라우팅 · 필터 조회 · 검색 · 10개 묶음 페이지네이션 · 행클릭→상세
 * 피그마: 67:8635
 */

function Star({ fill }: { fill: number }) {
  const id = React.useId();
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" style={{ flex: "none" }}>
      <defs><linearGradient id={id}><stop offset={`${fill}%`} stopColor="#FFB020" /><stop offset={`${fill}%`} stopColor="#E4E4E7" /></linearGradient></defs>
      <path d="M12 2.5l2.9 5.9 6.5.95-4.7 4.6 1.1 6.5L12 17.9l-5.8 3.05 1.1-6.5-4.7-4.6 6.5-.95z" fill={`url(#${id})`} />
    </svg>
  );
}
function StarRating({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <span style={{ display: "flex", gap: 0 }}>
      {Array.from({ length: max }).map((_, i) => <Star key={i} fill={Math.max(0, Math.min(100, (value - i) * 100))} />)}
    </span>
  );
}

type MenuRow = {
  id: number; name: string; category: string; roleLabel: string; roleVariant: BadgeVariant;
  score: string; count: string; statusLabel: string; statusVariant: BadgeVariant;
};
const BASE: Omit<MenuRow, "id">[] = [
  { name: "매콤 제육볶음 정식", category: "한식", roleLabel: "주찬감", roleVariant: "gray", score: "4.8", count: "1240건", statusLabel: "운영중", statusVariant: "mint" },
  { name: "부드러운 계란찜", category: "한식", roleLabel: "부찬감", roleVariant: "red", score: "4.5", count: "980건", statusLabel: "운영중", statusVariant: "mint" },
  { name: "잡곡밥", category: "한식", roleLabel: "공용", roleVariant: "blue", score: "4.2", count: "1530건", statusLabel: "운영중", statusVariant: "mint" },
  { name: "치킨 데리야끼", category: "일식", roleLabel: "주찬감", roleVariant: "gray", score: "4.6", count: "1120건", statusLabel: "운영중", statusVariant: "mint" },
  { name: "시금치 나물", category: "한식", roleLabel: "부찬감", roleVariant: "red", score: "4.0", count: "740건", statusLabel: "운영중", statusVariant: "mint" },
  { name: "미소된장국", category: "일식", roleLabel: "공용", roleVariant: "blue", score: "4.1", count: "890건", statusLabel: "운영중", statusVariant: "mint" },
  { name: "돈까스", category: "일식", roleLabel: "주찬감", roleVariant: "gray", score: "4.7", count: "1310건", statusLabel: "운영중", statusVariant: "mint" },
  { name: "콘샐러드", category: "양식", roleLabel: "공용", roleVariant: "blue", score: "3.9", count: "510건", statusLabel: "품절", statusVariant: "gray" },
  { name: "김치찌개", category: "한식", roleLabel: "주찬감", roleVariant: "gray", score: "4.4", count: "1620건", statusLabel: "운영중", statusVariant: "mint" },
  { name: "제육덮밥", category: "한식", roleLabel: "주찬감", roleVariant: "gray", score: "4.3", count: "1080건", statusLabel: "운영중", statusVariant: "mint" },
];
// 페이지네이션 확인용으로 충분한 행 생성 (실데이터 연동 시 교체)
const ROWS: MenuRow[] = Array.from({ length: 118 }).map((_, i) => {
  const b = BASE[i % BASE.length];
  return { ...b, id: i + 1, name: i < BASE.length ? b.name : `${b.name} ${Math.floor(i / BASE.length) + 1}` };
});


const CAMPUS = [{ value: "all", label: "전체" }, { value: "icheon", label: "이천 캠퍼스" }, { value: "cheongju", label: "청주 캠퍼스" }];
const LOCATION = [{ value: "all", label: "전체" }, { value: "b1", label: "본관 1식당" }, { value: "b2", label: "별관 2식당" }];
const CORNER = [{ value: "all", label: "전체" }, { value: "korean", label: "한식 코너" }, { value: "western", label: "양식 코너" }];

const C = { border: "var(--color-gray-100,#C6CAD2)", kpiBg: "var(--color-bluegray-30,#F7F7F8)", sub: "#8890A0", ink: "#17191C", ink2: "#292C33", line: "var(--color-bluegray-30,#F7F7F8)", teal: "var(--color-hynix-teal-400,#009A93)" };

const PAGE_SIZE = 10;
const PAGE_GROUP = 10; // 페이지 번호 묶음 크기

export default function MenuManagePage() {
  const router = useRouter();
  const [campus, setCampus] = React.useState("all");
  const [loc, setLoc] = React.useState("all");
  const [corner, setCorner] = React.useState("all");
  const [query, setQuery] = React.useState("");
  const [page, setPage] = React.useState(1);
  // 조회 눌렀을 때만 적용되는 필터 (아래 단품 메뉴 조회 영역 갱신)
  const [applied, setApplied] = React.useState({ campus: "all", loc: "all", corner: "all" });

  const onSearch = () => { setApplied({ campus, loc, corner }); setPage(1); };

  // 사이드바 네비 → 라우팅
  const onNavigate = (id: string) => {
    const to = routeFor(id);
    if (to !== "#") router.push(to);
  };

  // 검색 필터 (엔터/입력 즉시)
  // 적용된 필터(applied) + 검색어로 조회 영역 산출
  const filtered = ROWS.filter((r) => {
    if (!r.name.includes(query.trim())) return false;
    if (applied.corner === "korean" && r.category !== "한식") return false;
    if (applied.corner === "western" && r.category !== "양식") return false;
    return true;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  React.useEffect(() => { setPage(1); }, [query]);

  const th: React.CSSProperties = { padding: "12px 16px", fontFamily: "Inter,'Pretendard',sans-serif", fontWeight: 600, fontSize: 12, color: "#5B6271", background: C.kpiBg, borderBottom: `1px solid ${C.line}` };
  const td: React.CSSProperties = { padding: "12px 16px", fontFamily: "Inter,'Pretendard',sans-serif", fontSize: 13, color: "#5B6271", borderBottom: `1px solid ${C.line}` };

  return (
    <div data-brand="hynix" style={{ display: "flex", minHeight: "100vh", background: "var(--color-white,#fff)", fontFamily: "'Pretendard',sans-serif" }}>
      <Sidebar groups={NAV} brand="SK hynix Admin" activeId="menu-mgmt" defaultOpenIds={["menu-meal"]}
        user={{ name: "nutritionist01", authority: "영양사" }} onNavigate={onNavigate}
        style={{ position: "sticky", top: 0, height: "100vh", flex: "none" }} />

      <main style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", background: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 24px 12px" }}>
          <Breadcrumbs items={[{ label: "메뉴 식단", href: "#" }, { label: "메뉴 관리" }]} />
        </div>

        <div style={{ padding: "24px 24px 0" }}>
          <div style={{ padding: "0 0 12px" }}>
            <h1 style={{ margin: 0, fontWeight: 700, fontSize: 28, lineHeight: "39px", letterSpacing: ".0107em", color: C.ink2 }}>메뉴 관리</h1>
          </div>
        </div>

        <div style={{ padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 36, padding: 24, background: "#fff", border: `1px solid ${C.border}`, borderRadius: 12, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, flex: 1, minWidth: 0, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 160, maxWidth: 240 }}><FilterSelect label="캠퍼스" options={CAMPUS} value={campus} onChange={setCampus} /></div>
              <div style={{ flex: 1, minWidth: 160, maxWidth: 240 }}><FilterSelect label="식당 위치" options={LOCATION} value={loc} onChange={setLoc} /></div>
              <div style={{ flex: 1, minWidth: 160, maxWidth: 240 }}><FilterSelect label="운영 코너" options={CORNER} value={corner} onChange={setCorner} /></div>
            </div>
            <Button hierarchy="fill" size="m" onClick={onSearch}>조회</Button>
          </div>
        </div>

        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ padding: "24px 0 0" }}>
            <span style={{ fontWeight: 700, fontSize: 20, lineHeight: "30px", color: C.ink2 }}>단품 메뉴 조회</span>
          </div>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 320, display: "flex", padding: 24, gap: 12, background: C.kpiBg, borderRadius: 12 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
                <span style={{ fontWeight: 700, fontSize: 14, color: C.ink2 }}>현재 활성화 메뉴</span>
                <span style={{ fontWeight: 700, fontSize: 28, color: C.ink }}>{filtered.length}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: 12, flex: 1 }}>
                {[["주찬감", "3", C.ink], ["부찬감", "4", C.ink], ["공용", "10", C.ink], ["품절", "1", "#FC7A03"]].map(([k, v, col]) => (
                  <div key={k} style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
                    <span style={{ fontWeight: 500, fontSize: 13, color: C.sub }}>{k}</span>
                    <span style={{ fontWeight: 700, fontSize: 28, lineHeight: "39px", color: col as string }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", padding: 24, gap: 12, background: C.kpiBg, borderRadius: 12 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                  <span style={{ fontWeight: 700, fontSize: 14, color: C.ink2 }}>만족도</span>
                  <span style={{ fontWeight: 500, fontSize: 13, color: C.sub }}>전체 활성화 메뉴 기준</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
                  <span style={{ display: "flex", alignItems: "flex-end" }}>
                    <span style={{ fontWeight: 700, fontSize: 28, color: C.ink }}>4.3</span>
                    <span style={{ fontWeight: 700, fontSize: 28, color: C.ink }}>/</span>
                    <span style={{ fontWeight: 600, fontSize: 20, color: C.sub }}>5</span>
                  </span>
                  <StarRating value={4.3} />
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 240, maxWidth: 400 }}>
              <Input size="m" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="메뉴명을 입력하세요"
                icon={<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden><circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4" fill="none" /><path d="M11 11 L14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Button hierarchy="fill" size="m" onClick={() => router.push("/menu/new")}>단품 등록</Button>
              <Button hierarchy="neutralLine" size="m" onClick={() => alert("엑셀 다운로드 (준비 중)")}>엑셀 다운로드</Button>
            </div>
          </div>

          <div style={{ borderRadius: 12, border: `1px solid ${C.line}`, overflow: "hidden", background: "#fff" }}>
            <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 720 }}>
              <thead><tr>
                <th style={{ ...th, textAlign: "left" }}>메뉴명</th>
                <th style={{ ...th, width: 100, textAlign: "left" }}>대분류</th>
                <th style={{ ...th, width: 100, textAlign: "left" }}>기본 역할</th>
                <th style={{ ...th, width: 100, textAlign: "center" }}>만족도</th>
                <th style={{ ...th, width: 100, textAlign: "right" }}>누적 식수</th>
                <th style={{ ...th, width: 100, textAlign: "center" }}>상태</th>
              </tr></thead>
              <tbody>
                {pageRows.length === 0 ? (
                  <tr><td colSpan={6} style={{ ...td, textAlign: "center", padding: 40, color: C.sub }}>검색 결과가 없습니다.</td></tr>
                ) : pageRows.map((r) => (
                  <tr key={r.id} onClick={() => router.push(`/menu/new?id=${r.id}`)}
                    style={{ cursor: "pointer" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFBFC")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                    <td style={{ ...td, color: C.ink }}>{r.name}</td>
                    <td style={td}>{r.category}</td>
                    <td style={td}><Badge variant={r.roleVariant}>{r.roleLabel}</Badge></td>
                    <td style={{ ...td, textAlign: "center" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, justifyContent: "center" }}>
                        <span style={{ color: "#FFB020" }}>★</span>{r.score}
                      </span>
                    </td>
                    <td style={{ ...td, textAlign: "right" }}>{r.count}</td>
                    <td style={{ ...td, textAlign: "center" }}><Badge variant={r.statusVariant}>{r.statusLabel}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16, background: C.kpiBg }}>
              <span style={{ fontFamily: "Inter,'Pretendard',sans-serif", fontSize: 13, color: "#5B6271" }}>
                총 {filtered.length}개 메뉴 중 {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, filtered.length)} 표시 중
              </span>
              <Pagination page={page} totalPages={totalPages} onChange={setPage} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function FilterSelect({ label, options, value, onChange }: { label: string; options: { value: string; label: string }[]; value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const sel = options.find((o) => o.value === value);
  React.useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h);
  }, [open]);
  return (
    <div ref={ref} style={{ position: "relative", width: "100%" }}>
      <button type="button" onClick={() => setOpen((o) => !o)}
        style={{ width: "100%", height: 40, padding: "8px 16px", display: "flex", alignItems: "center", gap: 36, justifyContent: "space-between",
          background: "#fff", border: `1px solid ${open ? "var(--color-hynix-teal-400,#009A93)" : "var(--color-gray-100,#C6CAD2)"}`, borderRadius: 8, cursor: "pointer" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontFamily: "'Pretendard',sans-serif", fontWeight: 500, fontSize: 14, color: "#17191C" }}>{label}</span>
            <span style={{ color: "#8890A0", fontSize: 14 }}>|</span>
          </span>
          <span style={{ fontFamily: "'Pretendard',sans-serif", fontWeight: 500, fontSize: 14, color: "#8890A0", flex: 1, textAlign: "left", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{sel?.label ?? "전체"}</span>
        </span>
        <span aria-hidden style={{ width: 14, height: 14, flex: "none", color: "#8890A0", transform: open ? "rotate(180deg)" : "none", transition: "transform .15s" }}>
          <svg width="14" height="14" viewBox="0 0 14 14"><path d="M3.5 5 L7 8.5 L10.5 5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </span>
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 50, padding: 4, background: "#fff", border: "1px solid #D2D3D5", borderRadius: 8, boxShadow: "0 10px 15px rgba(0,0,0,.05)" }}>
          {options.map((o) => {
            const on = o.value === value;
            return (
              <div key={o.value} onClick={() => { onChange(o.value); setOpen(false); }}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px", borderRadius: 6, cursor: "pointer",
                  background: on ? "var(--color-hynix-teal-50,#E6F5F4)" : "transparent", color: on ? "var(--color-hynix-teal-500,#00827C)" : "#292C33",
                  fontFamily: "'Pretendard',sans-serif", fontWeight: on ? 700 : 400, fontSize: 14 }}
                onMouseEnter={(e) => { if (!on) e.currentTarget.style.background = "#F5F5F5"; }}
                onMouseLeave={(e) => { if (!on) e.currentTarget.style.background = "transparent"; }}>
                <span>{o.label}</span>
                {on && <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2.5 6.2 L4.8 8.5 L9.5 3.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


/** 페이지네이션 — 10개 묶음. 묶음이 여러 개일 때만 ‹ › 노출 (10페이지 이하면 화살표 없음) */
function Pagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (p: number) => void }) {
  const groupIndex = Math.floor((page - 1) / PAGE_GROUP);      // 현재 묶음 (0-based)
  const groupStart = groupIndex * PAGE_GROUP + 1;
  const groupEnd = Math.min(groupStart + PAGE_GROUP - 1, totalPages);
  const hasPrevGroup = groupStart > 1;
  const hasNextGroup = groupEnd < totalPages;
  const nums: number[] = [];
  for (let p = groupStart; p <= groupEnd; p++) nums.push(p);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      {hasPrevGroup && <PageBtn onClick={() => onChange(groupStart - 1)}>‹</PageBtn>}
      {nums.map((p) => <PageBtn key={p} active={page === p} onClick={() => onChange(p)}>{p}</PageBtn>)}
      {hasNextGroup && <PageBtn onClick={() => onChange(groupEnd + 1)}>›</PageBtn>}
    </div>
  );
}

function PageBtn({ children, active, onClick, disabled }: { children: React.ReactNode; active?: boolean; onClick?: () => void; disabled?: boolean }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled}
      style={{ width: 32, height: 32, borderRadius: 8, border: "none", cursor: disabled ? "not-allowed" : "pointer",
        background: active ? "#E4E6E7" : "transparent", color: disabled ? "#C6CAD2" : "#1F2023", fontFamily: "Pretendard,sans-serif", fontSize: 13,
        display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{children}</button>
  );
}
