import LaborCostSvg from "../../../../../root/assets/graphics/labor-cost.svg";
import PaymentSvg from "../../../../../root/assets/graphics/payment.svg";
import RemoteSvg from "../../../../../root/assets/graphics/remote.svg";

export type EffectIconKey = "인건비 절감" | "결제 무인화" | "원격 운영 가능";

interface EffectGraphicProps {
  name: EffectIconKey;
  className?: string;
}

export default function EffectGraphic({ name, className }: EffectGraphicProps) {
  switch (name) {
    case "인건비 절감":
      return <LaborCostSvg className={className} />;
    case "결제 무인화":
      return <PaymentSvg className={className} />;
    case "원격 운영 가능":
      return <RemoteSvg className={className} />;
    default:
      return null;
  }
}
