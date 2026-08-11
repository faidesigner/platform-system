"use client";
import * as React from "react";
/** hynix Sidebar — 피그마 page_nav_sidebar (119:5515).
 *  open(264) / collapsed(72) 2상태. nav-list-item 5종: title/main/sub × none/selected.
 *  - main:  pad 10/12, medium 14, 아이콘18 + chevron(하위 있을 때). selected=teal-500 글자
 *  - sub:   pad 10/12/10/42(들여쓰기), regular 14. selected=배경 teal-50
 *  - title: 섹션 헤더, semibold 12, pad 4/12
 *  아이콘은 나중에 Icon 컴포넌트로 교체 (여기선 icon prop 슬롯). */

export type NavSubItem = { id: string; label: React.ReactNode; href?: string };
export type NavItem = {
  id: string; label: React.ReactNode; icon?: React.ReactNode; href?: string;
  children?: NavSubItem[];
};
export type NavGroup = { title?: React.ReactNode; items: NavItem[] };

export type SidebarProps = {
  groups: NavGroup[];
  logo?: React.ReactNode;            // 접힘 시 아이콘만
  brand?: React.ReactNode;           // "SK hynix Admin"
  user?: { name: React.ReactNode; authority?: React.ReactNode; avatar?: React.ReactNode };
  activeId?: string;                 // 현재 선택된 item/subitem id
  collapsed?: boolean;
  defaultOpenIds?: string[];         // 펼쳐둘 main id
  as?: React.ElementType;            // 링크 컴포넌트 (Next Link 등)
  onNavigate?: (id: string) => void;
  className?: string; style?: React.CSSProperties;
};

const C = {
  text: "var(--color-text-title,#61646B)",
  brand: "var(--color-hynix-teal-500,#00827C)",
  brandBg: "var(--color-hynix-teal-50,#E6F5F4)",
  logoBg: "var(--color-hynix-teal-400,#009A93)",
  border: "var(--color-gray-100,#C6CAD2)",
  line: "var(--color-line,#E4E4E7)",
};

export function Sidebar({
  groups, logo, brand = "SK hynix Admin", user, activeId,
  collapsed = false, defaultOpenIds = [], as: Link = "a", onNavigate, className, style,
}: SidebarProps) {
  const [open, setOpen] = React.useState<Set<string>>(new Set(defaultOpenIds));
  const toggle = (id: string) => setOpen((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  if (collapsed) {
    return (
      <nav className={className} aria-label="사이드 내비게이션"
        style={{ width: 72, padding: "24px 14px", display: "flex", flexDirection: "column", alignItems: "center",
          gap: 24, background: "var(--color-white,#fff)", borderRight: `1px solid ${C.border}`,
          fontFamily: "'Pretendard',sans-serif", boxSizing: "border-box", ...style }}>
        <span style={{ width: 44, height: 44, borderRadius: 10, background: C.logoBg, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{logo}</span>
        {user && <span style={{ width: 44, height: 44, borderRadius: 22, border: `1px solid ${C.line}`, display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: 14, color: "#292C33" }}>
          {typeof user.name === "string" ? user.name.charAt(0) : user.avatar}
        </span>}
        {groups.map((g, gi) => (
          <React.Fragment key={gi}>
            {gi > 0 && <span style={{ width: 40, height: 1, background: C.border }} />}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              {g.items.map((it) => {
                const on = it.id === activeId;
                return (
                  <button key={it.id} type="button" title={typeof it.label === "string" ? it.label : undefined}
                    onClick={() => onNavigate?.(it.id)}
                    style={{ width: 44, height: 44, borderRadius: 8, border: "none", cursor: "pointer",
                      background: on ? C.brandBg : "transparent", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                    {it.icon}
                  </button>
                );
              })}
            </div>
          </React.Fragment>
        ))}
      </nav>
    );
  }

  return (
    <nav className={className} aria-label="사이드 내비게이션"
      style={{ width: 264, padding: 24, display: "flex", flexDirection: "column", gap: 20,
        background: "var(--color-white,#fff)", borderRight: `1px solid ${C.border}`,
        fontFamily: "'Pretendard',sans-serif", boxSizing: "border-box", ...style }}>
      {/* 로고 */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, width: 216 }}>
        <span style={{ width: 32, height: 32, borderRadius: 8, background: C.logoBg, display: "inline-flex", alignItems: "center", justifyContent: "center", flex: "none" }}>{logo}</span>
        <span style={{ fontWeight: 700, fontSize: 18, color: "#18181B" }}>{brand}</span>
      </div>
      {/* 유저 배지 */}
      {user && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, width: 216, height: 56, padding: "0 12px",
          border: `1px solid ${C.line}`, borderRadius: 20, boxSizing: "border-box" }}>
          <span style={{ width: 36, height: 36, borderRadius: 18, background: "#fff", border: `1px solid ${C.line}`, flex: "none", overflow: "hidden", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{user.avatar}</span>
          <span style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
            <span style={{ fontWeight: 600, fontSize: 13, color: "#18181B", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</span>
            {user.authority && <span style={{ fontWeight: 500, fontSize: 11, color: "#71717A" }}>{user.authority}</span>}
          </span>
        </div>
      )}
      {/* nav groups */}
      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        {groups.map((g, gi) => (
          <div key={gi} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {g.title && <div style={{ padding: "4px 12px", fontWeight: 600, fontSize: 12, color: C.text }}>{g.title}</div>}
            {g.items.map((it) => {
              const hasChildren = !!it.children?.length;
              const isOpen = open.has(it.id);
              const on = it.id === activeId;
              return (
                <div key={it.id}>
                  <button type="button"
                    onClick={() => { hasChildren ? toggle(it.id) : onNavigate?.(it.id); }}
                    style={{ width: 216, padding: "10px 12px", display: "flex", alignItems: "center", gap: 12,
                      borderRadius: 8, border: "none", cursor: "pointer", background: "transparent", textAlign: "left" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
                      {it.icon != null && <span style={{ width: 18, height: 18, flex: "none", display: "inline-flex" }}>{it.icon}</span>}
                      <span style={{ fontWeight: on ? 600 : 500, fontSize: 14, color: on ? C.brand : C.text, whiteSpace: "nowrap" }}>{it.label}</span>
                    </span>
                    {hasChildren && (
                      <span aria-hidden style={{ width: 14, height: 14, flex: "none", color: C.text, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform .15s" }}>
                        {/* TODO: <Icon name="chevron-down" size={14} /> */}
                        <svg width="14" height="14" viewBox="0 0 14 14"><path d="M3.5 5 L7 8.5 L10.5 5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </span>
                    )}
                  </button>
                  {hasChildren && isOpen && it.children!.map((sub) => {
                    const subOn = sub.id === activeId;
                    return (
                      <button key={sub.id} type="button" onClick={() => onNavigate?.(sub.id)}
                        style={{ width: 216, padding: "10px 12px 10px 42px", display: "flex", alignItems: "center",
                          borderRadius: 8, border: "none", cursor: "pointer", textAlign: "left",
                          background: subOn ? C.brandBg : "transparent" }}>
                        <span style={{ fontWeight: subOn ? 600 : 400, fontSize: 14, color: subOn ? C.brand : C.text, whiteSpace: "nowrap" }}>{sub.label}</span>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </nav>
  );
}
export default Sidebar;
