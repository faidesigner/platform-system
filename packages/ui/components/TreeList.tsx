'use client';

import * as React from 'react';
import { useState } from 'react';

export interface TreeNode {
  id: string;
  label: string;
  icon?: React.ReactNode;
  endContent?: React.ReactNode;
  children?: TreeNode[];
  href?: string;
}

export interface TreeListProps {
  nodes: readonly TreeNode[];
  defaultExpanded?: readonly string[];
  selectedId?: string;
  onSelect?: (id: string) => void;
}

export function TreeList({ nodes, defaultExpanded = [], selectedId, onSelect }: TreeListProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(defaultExpanded));

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const renderNode = (node: TreeNode, depth: number): React.ReactNode => {
    const hasChildren = !!node.children?.length;
    const isOpen = expanded.has(node.id);
    const isSelected = selectedId === node.id;

    return (
      <li key={node.id} role="treeitem" aria-expanded={hasChildren ? isOpen : undefined} aria-selected={isSelected}>
        <div
          onClick={() => {
            if (hasChildren) toggle(node.id);
            onSelect?.(node.id);
          }}
          style={{ paddingLeft: `${depth * 16 + 12}px` }}
          className={[
            'flex cursor-pointer items-center gap-s py-2xs pr-m rounded-fai-s text-body-s text-basic-primary',
            'hover:bg-interaction-light-black-hover',
            isSelected ? 'bg-filled-basic-secondary font-medium' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <span
            aria-hidden
            className="flex w-l shrink-0 items-center justify-center text-tertiary"
            style={{ visibility: hasChildren ? 'visible' : 'hidden', transform: isOpen ? 'rotate(90deg)' : 'none' }}
          >
            ›
          </span>
          {node.icon && <span className="flex shrink-0 items-center">{node.icon}</span>}
          <span className="min-w-0 flex-1 truncate">{node.label}</span>
          {node.endContent && <span className="ml-auto shrink-0">{node.endContent}</span>}
        </div>
        {hasChildren && isOpen && (
          <ul role="group" className="border-l border-border-tertiary" style={{ marginLeft: `${depth * 16 + 20}px` }}>
            {node.children!.map((child) => renderNode(child, depth + 1))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <ul role="tree" className="flex flex-col">
      {nodes.map((n) => renderNode(n, 0))}
    </ul>
  );
}
