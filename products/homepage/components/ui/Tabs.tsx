"use client";

interface TabItem {
  id: string;
  label: string;
}

interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export default function Tabs({ items, activeId, onChange, className }: TabsProps) {
  return (
    <div className={`flex justify-center items-center gap-[32px] w-full ${className ?? ""}`}>
      {items.map((item) => {
        const isActive = activeId === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={[
              "h-[80px] desktop:h-[120px] flex flex-col items-center justify-center gap-[8px] px-[24px] border-b-[5px] text-title-l desktop:text-title-xl font-bold tracking-[0.3px] transition-colors cursor-pointer",
              isActive
                ? "text-brand-text border-border-brand"
                : "text-quaternary border-border-faint",
            ].join(" ")}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
