'use client';

import * as React from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { DropdownMenu } from '../dropdown-menu/DropdownMenu';
import { DropdownMenuWithItem } from '../dropdown-menu/DropdownMenuWithItem';

export type TabListSize = 'sm' | 'md' | 'lg';
export type TabListLayout = 'hug' | 'fill';
export type TabListOrientation = 'horizontal' | 'vertical';

interface TabListContextValue {
  value: string;
  onChange: (value: string) => void;
  size: TabListSize;
  layout: TabListLayout;
  orientation: TabListOrientation;
}

const TabListContext = React.createContext<TabListContextValue | null>(null);

function useTabListContext() {
  const context = React.useContext(TabListContext);
  if (context == null) {
    throw new Error('Tab and TabMenu must be rendered inside TabList.');
  }
  return context;
}

const sizeClass: Record<TabListSize, string> = {
  sm: 'h-element-sm',
  md: 'h-element-md',
  lg: 'h-element-lg',
};

export interface TabListProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  size?: TabListSize;
  layout?: TabListLayout;
  hasDivider?: boolean;
  orientation?: TabListOrientation;
  children: React.ReactNode;
}

export function TabList({
  value,
  onChange,
  size = 'md',
  layout = 'hug',
  hasDivider = false,
  orientation = 'horizontal',
  children,
  className = '',
  onKeyDown,
  'aria-label': ariaLabel = 'Tabs',
  ...restProps
}: TabListProps) {
  const contextValue = React.useMemo(
    () => ({ value, onChange, size, layout, orientation }),
    [value, onChange, size, layout, orientation]
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;

    const items = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>(
        '[data-tab-value]:not([aria-disabled="true"]),[data-tab-menu]:not([aria-disabled="true"])'
      )
    );
    if (items.length === 0) return;

    const currentIndex = items.indexOf(document.activeElement as HTMLElement);
    let nextIndex = currentIndex < 0 ? 0 : currentIndex;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = items.length - 1;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (nextIndex + 1) % items.length;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (nextIndex - 1 + items.length) % items.length;

    event.preventDefault();
    items[nextIndex]?.focus();
  };

  return (
    <TabListContext.Provider value={contextValue}>
      <nav
        aria-label={ariaLabel}
        data-orientation={orientation}
        onKeyDown={handleKeyDown}
        className={[
          'flex min-w-0 max-w-full items-stretch gap-3xs',
          orientation === 'vertical' ? 'flex-col' : '',
          layout === 'fill' ? 'w-full' : '',
          hasDivider
            ? orientation === 'vertical'
              ? 'border-r border-border-subtle'
              : 'border-b border-border-subtle'
            : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...restProps}
      >
        {children}
      </nav>
    </TabListContext.Provider>
  );
}

export interface TabProps {
  value: string;
  label: string;
  isLabelHidden?: boolean;
  href?: string;
  icon?: React.ReactNode;
  selectedIcon?: React.ReactNode;
  endContent?: React.ReactNode;
  className?: string;
}

export function Tab({
  value,
  label,
  isLabelHidden = false,
  href,
  icon,
  selectedIcon,
  endContent,
  className = '',
}: TabProps) {
  const context = useTabListContext();
  const isSelected = context.value === value;
  const displayIcon = isSelected && selectedIcon != null ? selectedIcon : icon;
  const sharedClassName = [
    'relative inline-flex items-center justify-center gap-2xs whitespace-nowrap rounded-fai-s px-ms text-body-s no-underline outline-none transition-colors',
    sizeClass[context.size],
    context.layout === 'fill' ? 'flex-1' : '',
    isSelected ? 'font-semibold text-primary' : 'font-normal text-secondary hover:bg-fill-faint',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-brand',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      {displayIcon != null && <span className="flex size-m shrink-0 items-center justify-center">{displayIcon}</span>}
      <span className={isLabelHidden ? 'sr-only' : ''}>{label}</span>
      {endContent != null && <span className="flex shrink-0 items-center">{endContent}</span>}
      <span
        aria-hidden="true"
        className={[
          'absolute rounded-fai-circle bg-brand transition-opacity',
          context.orientation === 'vertical' ? 'inset-y-2xs right-0 w-3xs' : 'inset-x-ms bottom-0 h-3xs',
          isSelected ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
        style={{ transitionDuration: 'var(--duration-fast)' }}
      />
    </>
  );

  const sharedProps = {
    'data-tab-value': value,
    'aria-current': isSelected ? ('page' as const) : undefined,
    tabIndex: isSelected ? 0 : -1,
    className: sharedClassName,
    onClick: () => context.onChange(value),
  };

  if (href != null) {
    return (
      <a href={href} aria-label={isLabelHidden ? label : undefined} {...sharedProps}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" aria-label={isLabelHidden ? label : undefined} {...sharedProps}>
      {content}
    </button>
  );
}

export interface TabMenuOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface TabMenuProps {
  label: string;
  options: readonly TabMenuOption[];
  className?: string;
}

export function TabMenu({ label, options, className = '' }: TabMenuProps) {
  const context = useTabListContext();
  const selectedOption = options.find((option) => option.value === context.value);
  const isSelected = selectedOption != null;
  const triggerLabel = selectedOption?.label ?? label;

  return (
    <DropdownMenu
      label={label}
      placement="bottom-start"
      size="m"
      className={context.layout === 'fill' ? 'flex-1' : ''}
      trigger={(open, toggle) => (
        <button
          type="button"
          data-tab-menu=""
          aria-haspopup="menu"
          aria-expanded={open}
          aria-current={isSelected ? 'page' : undefined}
          tabIndex={isSelected ? 0 : -1}
          onClick={toggle}
          className={[
            'relative inline-flex w-full items-center justify-center gap-2xs whitespace-nowrap rounded-fai-s px-ms text-body-s outline-none transition-colors',
            sizeClass[context.size],
            isSelected ? 'font-semibold text-primary' : 'text-secondary hover:bg-fill-faint',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-brand',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <span>{triggerLabel}</span>
          <ChevronDown aria-hidden="true" className={`size-m transition-transform ${open ? 'rotate-180' : ''}`} />
          <span
            aria-hidden="true"
            className={`absolute inset-x-ms bottom-0 h-3xs rounded-fai-circle bg-brand ${isSelected ? 'opacity-100' : 'opacity-0'}`}
          />
        </button>
      )}
    >
      <div role="presentation" className="px-ms py-s text-caption-m font-semibold text-tertiary">
        {label}
      </div>
      {options.map((option) => {
        const optionSelected = option.value === context.value;
        return (
          <DropdownMenuWithItem
            key={option.value}
            label={option.label}
            icon={option.icon}
            endContent={optionSelected ? <Check aria-hidden="true" className="size-m text-brand-text" /> : undefined}
            onClick={() => context.onChange(option.value)}
          />
        );
      })}
    </DropdownMenu>
  );
}

