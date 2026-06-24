import ChevronDownSvg from "../../../../../root/assets/icon/chevron-down.svg";

interface ChevronIconProps {
  open: boolean;
}

export default function ChevronIcon({ open }: ChevronIconProps) {
  return (
    <ChevronDownSvg
      className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    />
  );
}
