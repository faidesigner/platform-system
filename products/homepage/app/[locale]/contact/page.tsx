import { ContactUsSection } from "@/components/sections/contact/ContactUsSection";

export const metadata = {
  title: "문의하기 | FAI",
  description: "도입 고민부터 커스텀 솔루션 제안까지 전문가가 직접 답변해드립니다.",
};

export default function ContactPage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-[var(--color-bg-100,#ffffff)]">
      <ContactUsSection />
    </main>
  );
}
