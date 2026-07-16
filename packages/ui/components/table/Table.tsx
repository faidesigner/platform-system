'use client';

import * as React from 'react';

export type TableDensity = 'compact' | 'default' | 'comfortable';
export type CellAlign = 'left' | 'center' | 'right';

interface TableCtx {
  density: TableDensity;
  dividers: boolean;
  hover: boolean;
  striped: boolean;
}
const TableContext = React.createContext<TableCtx>({
  density: 'default',
  dividers: true,
  hover: false,
  striped: false,
});

export interface TableProps {
  density?: TableDensity;
  dividers?: boolean;
  hover?: boolean;
  striped?: boolean;
  children: React.ReactNode;
  className?: string;
}

export interface TableRowProps {
  children: React.ReactNode;
  selected?: boolean;
}

export interface TableCellProps {
  children?: React.ReactNode;
  align?: CellAlign;
}

export interface TableHeaderCellProps extends TableCellProps {
  sortable?: boolean;
}

const densityPad: Record<TableDensity, string> = {
  compact: 'py-2xs',
  default: 'py-s',
  comfortable: 'py-m',
};

const alignClass: Record<CellAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

export function Table({
  density = 'default',
  dividers = true,
  hover = false,
  striped = false,
  children,
  className = '',
}: TableProps) {
  return (
    <TableContext.Provider value={{ density, dividers, hover, striped }}>
      <table className={`w-full border-collapse text-body-s ${className}`}>{children}</table>
    </TableContext.Provider>
  );
}

export function TableRow({ children, selected = false }: TableRowProps) {
  const { dividers, hover } = React.useContext(TableContext);
  const cls = [
    dividers ? 'border-b border-border-tertiary' : '',
    hover ? 'hover:bg-interaction-light-black-hover' : '',
    selected ? 'bg-filled-basic-secondary' : '',
    /* striped는 CSS nth-child로 처리하기 어려워 tbody에서 처리하거나 생략; 여기선 hover/divider 위주 */
  ]
    .filter(Boolean)
    .join(' ');
  return <tr className={cls}>{children}</tr>;
}

export function TableCell({ children, align = 'left' }: TableCellProps) {
  const { density } = React.useContext(TableContext);
  return (
    <td className={`px-m ${densityPad[density]} ${alignClass[align]} text-basic-primary`}>
      {children}
    </td>
  );
}

export function TableHeaderCell({
  children,
  align = 'left',
  sortable = false,
}: TableHeaderCellProps) {
  const { density } = React.useContext(TableContext);
  return (
    <th
      scope="col"
      className={`border-b border-border-tertiary bg-bg-100 px-m ${densityPad[density]} ${alignClass[align]} font-medium text-basic-secondary`}
    >
      <span className="inline-flex items-center gap-2xs">
        {children}
        {sortable && <span aria-hidden className="text-tertiary">↕</span>}
      </span>
    </th>
  );
}
