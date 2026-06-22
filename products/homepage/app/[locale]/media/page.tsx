import MediaNewsSection from "@/components/sections/media/NewsSection";
import MediaShowcaseSection from "@/components/sections/media/ShowcaseSection";
import RetailTechLetterSection from "@/components/sections/media/RetailTechLetterSection";

export default function MediaPage() {
  return (
    <main>
      <MediaShowcaseSection />
      <MediaNewsSection />
      <RetailTechLetterSection />
    </main>
  );
}
