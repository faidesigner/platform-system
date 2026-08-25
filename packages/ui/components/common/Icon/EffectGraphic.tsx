import LaborCostSvg from "../../../../../root/assets/graphics/labor-cost.svg";
import PaymentSvg from "../../../../../root/assets/graphics/payment-3.svg";
import RemoteSvg from "../../../../../root/assets/graphics/remote-2.svg";

export type EffectIconKey = "인건비 절감" | "AI 자동 결제" | "원격 운영 가능";

interface EffectGraphicProps {
  name: EffectIconKey;
  className?: string;
}

export default function EffectGraphic({ name, className }: EffectGraphicProps) {
  switch (name) {
    case "인건비 절감":
      return <LaborCostSvg className={className} />;
    case "AI 자동 결제":
      return <PaymentSvg className={className} />;
    case "원격 운영 가능":
      return <RemoteSvg className={className} />;
    default:
      return null;
  }
}
