"use client";
import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Sidebar } from "@/app/components/ui/sidebar/Sidebar";
import { NAV, routeFor } from "@/app/menu/nav";
import { Breadcrumbs } from "@/app/components/ui/breadcrumbs/Breadcrumbs";
import { Button } from "@/app/components/ui/button/Button";
import { Input } from "@/app/components/ui/input/Input";
import { Textarea } from "@/app/components/ui/textarea/Textarea";
import { Select } from "@/app/components/ui/select/Select";
import { Radio } from "@/app/components/ui/radio/Radio";
import { Checkbox } from "@/app/components/ui/checkbox/Checkbox";
import { Toggle } from "@/app/components/ui/toggle/Toggle";
import { TagChip } from "@/app/components/ui/tag-chip/TagChip";

/**
 * SCR-41-C  메뉴 등록  (/menu/new)          — 빈 폼
 * SCR-41-UD 메뉴 수정·삭제 (/menu/new?id=N)  — 데이터 채움 + KPI + 삭제 버튼
 * 두 화면은 같은 컴포넌트, isDetail(=?id 유무)로 분기.
 * 피그마: 등록 120:6824 / 상세 67:8636
 */


const C = {
  border: "var(--color-gray-100,#C6CAD2)", aiBorder: "#99D7D3", teal: "var(--color-hynix-teal-400,#009A93)",
  teal50: "var(--color-hynix-teal-50,#E6F5F4)", teal500: "var(--color-hynix-teal-500,#00827C)",
  ink: "#17191C", ink2: "#292C33", gray800: "#3A3D40", sub: "#8890A0", sub2: "#5B6271", line: "#F7F7F8",
};

function Field({ label, required, hint, children, style }: { label?: React.ReactNode; required?: boolean; hint?: React.ReactNode; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, ...style }}>
      {label != null && (
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 2, fontFamily: "'Pretendard',sans-serif", fontWeight: 700, fontSize: 16, lineHeight: "24px", color: C.gray800 }}>
            {label}{required && <span style={{ color: C.teal }}>*</span>}
          </label>
          {hint && <span style={{ fontFamily: "'Pretendard',sans-serif", fontWeight: 400, fontSize: 13, lineHeight: "20px", color: C.sub2 }}>{hint}</span>}
        </div>
      )}
      {children}
    </div>
  );
}

function AiBadge({ children = "AI 자동 입력" }: { children?: React.ReactNode }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, height: 24, padding: "2px 8px 2px 4px", borderRadius: 8, background: C.teal50, color: C.teal500, fontFamily: "'Pretendard',sans-serif", fontWeight: 700, fontSize: 12, lineHeight: "18px", letterSpacing: "-.0083em", flex: "none" }}>
      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden><path d="M7 1.5l1.2 3.3 3.3 1.2-3.3 1.2L7 10.5 5.8 7.2 2.5 6l3.3-1.2z" fill="currentColor"/></svg>
      {children}
    </span>
  );
}

/** AI 섹션 (teal 실선 테두리, 제목 + AI 배지) */
function AiSection({ title, children }: { title: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "20px 24px 24px", background: "#fff", border: `1px solid ${C.aiBorder}`, borderRadius: 8, boxSizing: "border-box" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontFamily: "'Pretendard',sans-serif", fontWeight: 700, fontSize: 16, lineHeight: "24px", color: C.teal }}>{title}</span>
        <AiBadge />
      </div>
      {children}
    </div>
  );
}

function Section({ title, kpi, children }: { title: React.ReactNode; kpi?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 24, padding: "24px 24px 36px", background: "#fff", border: "1px solid #E4E4E7", borderRadius: 12 }}>
      <div style={{ width: 160, flex: "none" }}>
        <span style={{ fontFamily: "'Pretendard',sans-serif", fontWeight: 700, fontSize: 24, lineHeight: "36px", letterSpacing: ".0125em", color: C.gray800 }}>{title}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24, flex: 1, minWidth: 0, maxWidth: 944 }}>
        {kpi}
        {children}
      </div>
    </div>
  );
}

/** 상세 화면 KPI (누적 식수 / 만족도) — 피그마 SCR-41-상세 */
function DetailKpi() {
  return (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      <div style={{ minWidth: 200, display: "flex", flexDirection: "column", gap: 8, padding: "16px 24px", background: "var(--color-bluegray-30,#F7F7F8)", borderRadius: 12 }}>
        <span style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span style={{ fontFamily: "'Pretendard',sans-serif", fontWeight: 700, fontSize: 14, color: "#292C33" }}>누적 식수</span>
          <span style={{ fontFamily: "'Pretendard',sans-serif", fontWeight: 500, fontSize: 12, color: "#8890A0" }}>이용데이터</span>
        </span>
        <span style={{ fontFamily: "'Pretendard',sans-serif", fontWeight: 700, fontSize: 24, color: "#17191C" }}>12,304</span>
      </div>
      <div style={{ minWidth: 280, display: "flex", flexDirection: "column", gap: 8, padding: "16px 24px", background: "var(--color-bluegray-30,#F7F7F8)", borderRadius: 12 }}>
        <span style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span style={{ fontFamily: "'Pretendard',sans-serif", fontWeight: 700, fontSize: 14, color: "#292C33" }}>만족도</span>
          <span style={{ fontFamily: "'Pretendard',sans-serif", fontWeight: 500, fontSize: 12, color: "#8890A0" }}>별점 평균</span>
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ display: "flex", alignItems: "flex-end" }}>
            <span style={{ fontFamily: "'Pretendard',sans-serif", fontWeight: 700, fontSize: 24, color: "#17191C" }}>4.3</span>
            <span style={{ fontFamily: "'Pretendard',sans-serif", fontWeight: 600, fontSize: 16, color: "#8890A0" }}>/5</span>
          </span>
          <span style={{ display: "flex", gap: 0 }}>
            {[100, 100, 100, 100, 30].map((f, i) => {
              const gid = `st${i}`;
              return (
                <svg key={i} width={20} height={20} viewBox="0 0 24 24"><defs><linearGradient id={gid}><stop offset={`${f}%`} stopColor="#FFB020" /><stop offset={`${f}%`} stopColor="#E4E4E7" /></linearGradient></defs>
                  <path d="M12 2.5l2.9 5.9 6.5.95-4.7 4.6 1.1 6.5L12 17.9l-5.8 3.05 1.1-6.5-4.7-4.6 6.5-.95z" fill={`url(#${gid})`} /></svg>
              );
            })}
          </span>
        </span>
      </div>
    </div>
  );
}

function ThreeCol({ items }: { items: { label?: string; ph?: string; el?: React.ReactNode }[] }) {
  // 좁아지면 각 열이 최소 160px 유지하며 줄바꿈 (인풋 잘림 방지)
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
      {items.map((it, i) => (
        <div key={i} style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 8 }}>
          {it.label && <span style={{ fontFamily: "'Pretendard',sans-serif", fontWeight: 700, fontSize: 14, color: C.gray800 }}>{it.label}</span>}
          {it.el ?? <Input size="m" placeholder={it.ph} />}
        </div>
      ))}
    </div>
  );
}

const ROLE_OPTS = [{ value: "main", label: "주찬감" }, { value: "side", label: "부찬감" }, { value: "common", label: "공용" }];
const CAMPUS = [{ value: "icheon", label: "이천 캠퍼스" }, { value: "cheongju", label: "청주 캠퍼스" }];
const CAT_BIG = [{ value: "meat", label: "고기" }, { value: "veg", label: "채소" }, { value: "seafood", label: "수산" }];
const CAT_MID = [{ value: "m1", label: "중분류" }, { value: "m2", label: "육류" }];
// 재료 후보 (주재료·부재료 공통 풀). 선택 = teal 태그(제거 가능), 미선택 = neutral 태그(클릭 시 추가)
const INGREDIENT_POOL = ["돼지고기", "닭고기", "소고기", "생선", "두부", "계란", "대파", "마늘", "양파", "고춧가루"];
const ALLERGY = ["돼지고기", "이황산류", "조개류", "오징어", "복숭아", "쇠고기", "label", "label"];

/** 태그 선택기 — 선택된 것은 teal(X로 제거), 후보는 neutral(클릭 시 추가) */
function TagPicker({ pool, selected, onToggle }: { pool: string[]; selected: string[]; onToggle: (v: string) => void }) {
  const rest = pool.filter((p) => !selected.includes(p));
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", minHeight: 40 }}>
      {selected.map((s) => (
        <TagChip key={s} tone="teal" onRemove={() => onToggle(s)}>{s}</TagChip>
      ))}
      {rest.map((s) => (
        <span key={s} onClick={() => onToggle(s)} style={{ cursor: "pointer" }}>
          <TagChip tone="neutral">{s}</TagChip>
        </span>
      ))}
    </div>
  );
}

function MenuNewInner() {
  const [mealType, setMealType] = React.useState("normal");
  const [role, setRole] = React.useState("main");
  const [cat1, setCat1] = React.useState("");
  const [cat2, setCat2] = React.useState("");
  const [use, setUse] = React.useState(true);
  const [soldout, setSoldout] = React.useState(true);
  const [meals, setMeals] = React.useState<Record<string, boolean>>({ 아침: true, 점심: false, 저녁: false, 야식: false });
  // 주재료 / 부재료 (선택된 태그 목록)
  const [mainIng, setMainIng] = React.useState<string[]>(["돼지고기", "소고기"]);
  const [subIng, setSubIng] = React.useState<string[]>([]);
  const toggleMain = (v: string) => setMainIng((s) => s.includes(v) ? s.filter((x) => x !== v) : [...s, v]);
  const toggleSub = (v: string) => setSubIng((s) => s.includes(v) ? s.filter((x) => x !== v) : [...s, v]);
  // 알레르기 (3행 × 8열, 각 셀 독립 체크). key = "row-col"
  const [allergy, setAllergy] = React.useState<Record<string, boolean>>({ "0-0": true, "1-0": true, "2-0": true });
  const toggleAllergy = (k: string) => setAllergy((s) => ({ ...s, [k]: !s[k] }));
  const router = useRouter();
  const params = useSearchParams();
  const isDetail = !!params.get("id");   // ?id 있으면 상세(이미 등록된 메뉴), 없으면 등록
  React.useEffect(() => { if (isDetail) { setCat1("meat"); } }, [isDetail]);
  const fileRef = React.useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = React.useState<string>("");

  const onNavigate = (id: string) => { const to = routeFor(id); if (to !== "#") router.push(to); };
  const onSave = () => { alert(isDetail ? "수정되었습니다." : "저장되었습니다."); router.push("/menu"); };
  const onCancel = () => router.push("/menu");
  const onDelete = () => { if (confirm("이 메뉴를 삭제하시겠습니까?")) { alert("삭제되었습니다."); router.push("/menu"); } };

  return (
    <div data-brand="hynix" style={{ display: "flex", minHeight: "100vh", background: "#fff", fontFamily: "'Pretendard',sans-serif" }}>
      <Sidebar groups={NAV} brand="SK hynix Admin" activeId="menu-mgmt" defaultOpenIds={["menu-meal"]}
        user={{ name: "login id", authority: "authority" }} onNavigate={onNavigate} style={{ position: "sticky", top: 0, height: "100vh", flex: "none" }} />

      <main style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", background: "#fff" }}>
        <div style={{ padding: "24px 24px 12px" }}>
          <Breadcrumbs items={[{ label: "메뉴 식단", href: "#" }, { label: "메뉴 관리", href: "/menu" }, { label: isDetail ? "메뉴 상세" : "메뉴 등록" }]} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24, padding: 24 }}>

          {/* ═══ 기본 정보 ═══ */}
          <Section title="기본 정보" kpi={isDetail ? <DetailKpi /> : undefined}>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              <Field label="메뉴(단품)명" required style={{ flex: 1, minWidth: 0 }}><Input size="m" defaultValue={isDetail ? "매콤제육볶음" : undefined} placeholder="메뉴(단품)명을 입력하세요 (예: 매콤 제육볶음)" /></Field>
              <Field label="표준 메뉴명" style={{ flex: 1, minWidth: 0 }}><Input size="m" defaultValue={isDetail ? "매콤 제육볶음" : undefined} placeholder="표준 메뉴명을 입력하세요 (예: 매콤 제육볶음(대))" /></Field>
            </div>

            <AiSection title="메뉴명">
              <ThreeCol items={[
                { label: "영문", ph: "English Name" },
                { label: "중문", ph: "中文名稱" },
                { label: "일문", ph: "日本語名" },
              ]} />
            </AiSection>

            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              <Field label="식사유형" required style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", gap: 36, alignItems: "center", height: 40 }}>
                  <Radio size="m" name="mealType" label="일반식" checked={mealType === "normal"} onChange={() => setMealType("normal")} />
                  <Radio size="m" name="mealType" label="특식" checked={mealType === "special"} onChange={() => setMealType("special")} />
                </div>
              </Field>
              <Field label="기본 역할" style={{ flex: 1, minWidth: 0 }}>
                <Select size="m" options={ROLE_OPTS} value={role} onChange={setRole} />
              </Field>
            </div>

            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              <Field label="적합 끼니" hint="다중 선택 가능" style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", gap: 36, alignItems: "center", height: 40 }}>
                  {["아침", "점심", "저녁", "야식"].map((m) => (
                    <Checkbox key={m} size="m" label={m} checked={meals[m]} onChange={() => setMeals((s) => ({ ...s, [m]: !s[m] }))} />
                  ))}
                </div>
              </Field>
              <Field label="주재료" style={{ flex: 1, minWidth: 0 }}>
                <TagPicker pool={INGREDIENT_POOL} selected={mainIng} onToggle={toggleMain} />
              </Field>
            </div>

            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              <Field label="부재료" style={{ flex: 1, minWidth: 0 }}>
                <TagPicker pool={INGREDIENT_POOL} selected={subIng} onToggle={toggleSub} />
              </Field>
            </div>

            <AiSection title="메뉴 분류">
              <ThreeCol items={[
                { label: "대분류", el: <Select size="m" options={CAT_BIG} value={cat1} onChange={setCat1} /> },
                { label: "중분류", el: <Select size="m" options={CAT_MID} value={cat2} onChange={setCat2} placeholder="중분류" /> },
                { label: "소분류", ph: "소분류" },
              ]} />
            </AiSection>

            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              <Field label="조리법 메모" style={{ flex: 1, minWidth: 0 }}>
                <Textarea placeholder="조리 시 주의사항이나 팁을 기재해 주세요" style={{ height: 80, minHeight: 80, resize: "none" }} />
              </Field>
              <Field label="비고" style={{ flex: 1, minWidth: 0 }}>
                <Textarea placeholder="특이사항 및 메모를 남겨보세요" style={{ height: 80, minHeight: 80, resize: "none" }} />
              </Field>
            </div>
          </Section>

          {/* ═══ 영양 · 알레르기 ═══ */}
          <Section title="영양 · 알레르기">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <AiBadge>AI 추천 적용 가능</AiBadge>
              <span style={{ fontFamily: "'Pretendard',sans-serif", fontWeight: 400, fontSize: 13, lineHeight: "20px", color: C.ink2 }}>해당 메뉴에 포함된 알레르기 유발 물질을 선택하세요.</span>
            </div>

            <AiSection title={<span>알레르기<span style={{ color: C.teal }}>*</span></span>}>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[0, 1, 2].map((row) => (
                  <div key={row} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(96px, 1fr))", gap: 12 }}>
                    {ALLERGY.map((a, i) => {
                      const k = `${row}-${i}`;
                      return <Checkbox key={i} size="m" label={a} checked={!!allergy[k]} onChange={() => toggleAllergy(k)} />;
                    })}
                  </div>
                ))}
              </div>
            </AiSection>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 24 }}>
              <Field label="1회 제공 기준량(g)" required><Input size="m" defaultValue={isDetail ? "345" : undefined} placeholder="00" /></Field>
              <Field label="칼로리(kcal)"><Input size="m" defaultValue={isDetail ? "130" : undefined} placeholder="00" /></Field>
              <Field label="단백질(g)"><Input size="m" defaultValue={isDetail ? "2" : undefined} placeholder="00" /></Field>
              <Field label="탄수화물(g)"><Input size="m" defaultValue={isDetail ? "100" : undefined} placeholder="00" /></Field>
              <Field label="지방(g)"><Input size="m" defaultValue={isDetail ? "12" : undefined} placeholder="00" /></Field>
              <Field label="나트륨(mg)"><Input size="m" defaultValue={isDetail ? "16" : undefined} placeholder="00" /></Field>
            </div>
          </Section>

          {/* ═══ 노출 정보 ═══ */}
          <Section title="노출 정보">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: "'Pretendard',sans-serif", fontWeight: 400, fontSize: 13, lineHeight: "20px", color: C.ink2 }}>모바일, 키오스크에서 노출하는 정보입니다.</span>
            </div>

            <Field label="메뉴 사진" hint="5MB 이하의 JPG, PNG 파일만 업로드 가능합니다 (권장 비율 4:3)">
              <div style={{ width: 160, height: 160, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 12, background: "#F9FAFB", border: "1px dashed #E4E4E7", borderRadius: 8 }}>
                <span style={{ width: 32, height: 32, display: "inline-flex", alignItems: "center", justifyContent: "center", color: C.sub }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden><path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinejoin="round"/><circle cx="12" cy="13" r="3.2" stroke="currentColor" strokeWidth="1.6" fill="none"/></svg>
                </span>
                <Button hierarchy="neutralLine" size="s">파일 올리기</Button>
              </div>
            </Field>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <span style={{ fontFamily: "'Pretendard',sans-serif", fontWeight: 700, fontSize: 16, lineHeight: "24px", color: C.gray800 }}>사용 설정</span>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <ToggleRow title="사용 여부" desc="해당 메뉴를 식단 수립 및 판매에 노출하도록 설정합니다" checked={use} onChange={() => setUse((v) => !v)} />
                <ToggleRow title="품절 여부" desc="품절 처리 시 모바일 앱 및 키오스크에서 일시적으로 판매 불가능으로 처리됩니다" checked={soldout} onChange={() => setSoldout((v) => !v)} />
              </div>
            </div>
          </Section>

          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0, flexWrap: "wrap", fontFamily: "'Pretendard',sans-serif", fontSize: 13, lineHeight: "20px", color: C.sub2 }}>
              <span>등록자: 김관리 영양사</span><span style={{ color: C.sub }}>|</span>
              <span>생성일시: 2025-07-28 14:30</span><span style={{ color: C.sub }}>|</span>
              <span>수정일시: 2025-07-30 09:15</span>
            </div>
            {isDetail && (
              <button type="button" onClick={onDelete}
                style={{ height: 48, padding: "10px 24px", borderRadius: 8, border: "1px solid #EA3B2A", background: "#fff", color: "#EA3B2A", fontFamily: "'Pretendard',sans-serif", fontWeight: 600, fontSize: 15, cursor: "pointer" }}>
                삭제
              </button>
            )}
            <Button hierarchy="neutralLine" size="L" onClick={onCancel}>취소</Button>
            <Button hierarchy="fill" size="L" onClick={onSave}>{isDetail ? "수정" : "저장"}</Button>
          </div>
        </div>
      </main>
    </div>
  );
}

function ToggleRow({ title, desc, checked, onChange }: { title: string; desc: string; checked: boolean; onChange: () => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 24, padding: "8px 0" }}>
      <Toggle checked={checked} onChange={onChange} />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontFamily: "'Pretendard',sans-serif", fontWeight: 600, fontSize: 14, lineHeight: "21px", color: "#292C33" }}>{title}</span>
        <span style={{ fontFamily: "'Pretendard',sans-serif", fontWeight: 400, fontSize: 13, lineHeight: "20px", color: "#8890A0" }}>{desc}</span>
      </div>
    </div>
  );
}

export default function MenuNewPage() {
  return (
    <React.Suspense fallback={null}>
      <MenuNewInner />
    </React.Suspense>
  );
}
