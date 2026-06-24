import StaffingSvg from "../../../../../root/assets/graphics/staffing.svg";
import CheckoutFlowSvg from "../../../../../root/assets/graphics/checkout-flow.svg";
import ProfitabilitySvg from "../../../../../root/assets/graphics/profitability.svg";

export type BenefitIconKey = "staffing" | "checkout-flow" | "profitability";

interface BenefitGraphicProps {
  name: BenefitIconKey;
  className?: string;
}

export default function BenefitGraphic({ name, className }: BenefitGraphicProps) {
  switch (name) {
    case "staffing":
      return <StaffingSvg className={className} />;
    case "checkout-flow":
      return <CheckoutFlowSvg className={className} />;
    case "profitability":
      return <ProfitabilitySvg className={className} />;
    default:
      return null;
  }
}
