"use client";
import * as React from "react";
/** hynix Table — 피그마 table-card (25:880). 카드 radius12, 헤더 #F7F7F8 semibold12, 셀 pad12/16, 푸터. */
export type TableColumn<T> = {
  key: string; header: React.ReactNode; width?: number | string;
  align?: "left" | "center" | "right"; render?: (row: T) => React.ReactNode;
};
export type TableProps<T> = {
  columns: TableColumn<T>[]; rows: T[]; footer?: React.ReactNode; className?: string; style?: React.CSSProperties;
};
export function Table<T extends Record<string, any>>({ columns, rows, footer, className, style }: TableProps<T>) {
  const th: React.CSSProperties = { padding: "12px 16px", fontFamily: "'Pretendard',sans-serif", fontWeight: 600, fontSize: 12,
    color: "var(--color-bluegray-500,#5B6271)", background: "var(--color-bluegray-30,#F7F7F8)", borderBottom: "1px solid var(--color-bluegray-30,#F7F7F8)" };
  const td: React.CSSProperties = { padding: "12px 16px", fontFamily: "'Pretendard',sans-serif", fontSize: 14,
    color: "var(--color-gray-900,#17191C)", borderBottom: "1px solid var(--color-bluegray-30,#F7F7F8)" };
  return (
    <div className={className} style={{ borderRadius: 12, border: "1px solid var(--color-bluegray-30,#F7F7F8)", overflow: "hidden", background: "var(--color-white,#fff)", ...style }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead><tr>{columns.map((c) => (
          <th key={c.key} style={{ ...th, width: c.width, textAlign: c.align ?? "left" }}>{c.header}</th>
        ))}</tr></thead>
        <tbody>{rows.map((r, i) => (
          <tr key={i}>{columns.map((c) => (
            <td key={c.key} style={{ ...td, textAlign: c.align ?? "left" }}>{c.render ? c.render(r) : r[c.key]}</td>
          ))}</tr>
        ))}</tbody>
      </table>
      {footer && <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16, background: "var(--color-bluegray-30,#F7F7F8)", fontFamily: "'Pretendard',sans-serif", fontSize: 13, color: "var(--color-bluegray-500,#5B6271)" }}>{footer}</div>}
    </div>
  );
}
export default Table;
