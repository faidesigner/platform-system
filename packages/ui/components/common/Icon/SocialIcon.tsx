import LinkedinBrandSvg from "../../../../../root/assets/icon/linkedin-brand.svg";
import InstagramBrandSvg from "../../../../../root/assets/icon/instagram-brand.svg";

export type SocialIconKey = "linkedin" | "instagram";

interface SocialIconProps {
  name: SocialIconKey;
  className?: string;
}

export default function SocialIcon({ name, className }: SocialIconProps) {
  switch (name) {
    case "linkedin":
      return <LinkedinBrandSvg className={className} />;
    case "instagram":
      return <InstagramBrandSvg className={className} />;
    default:
      return null;
  }
}
