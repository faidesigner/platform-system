import { AboutHero } from "@/components/sections/about/AboutHero";
import { AboutPartners } from "@/components/sections/about/AboutPartners";
import { AboutLogos } from "@/components/sections/about/AboutLogos";
import { AboutManagement } from "@/components/sections/about/AboutManagement";
import { AboutPeople } from "@/components/sections/about/AboutPeople";

export default function AboutPage() {
  return (
    <main>
      <AboutHero />
      <AboutPartners />
      <AboutLogos />
      <AboutManagement />
      <AboutPeople />
    </main>
  );
}
