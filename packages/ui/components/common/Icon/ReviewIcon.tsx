import BakerySvg from "../../../../../root/assets/icon/bakery.svg";
import CafeteriaSvg from "../../../../../root/assets/icon/cafeteria.svg";
import ResortSvg from "../../../../../root/assets/icon/resort.svg";

export type ReviewIconKey = "bakery" | "cafeteria" | "resort";

interface ReviewIconProps {
  name: ReviewIconKey;
  className?: string;
}

export default function ReviewIcon({ name, className }: ReviewIconProps) {
  switch (name) {
    case "bakery":
      return <BakerySvg className={className} />;
    case "cafeteria":
      return <CafeteriaSvg className={className} />;
    case "resort":
      return <ResortSvg className={className} />;
    default:
      return null;
  }
}
