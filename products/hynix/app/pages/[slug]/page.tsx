import Link from "next/link";
import { notFound } from "next/navigation";
import { PAGES, getPage } from "../../pages-registry";
import CodePanel from "../../components/CodePanel";

export function generateStaticParams() {
  return PAGES.map((p) => ({ slug: p.slug }));
}

export default async function PageDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getPage(slug);
  if (!page) notFound();

  const { Component, title, no, description, code } = page;

  return (
    <main className="min-h-screen bg-white text-neutral-900">
      {/* 상단 바 */}
      <div className="sticky top-0 z-10 border-b border-neutral-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-6 py-3">
          <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-900">
            ← 목록
          </Link>
          <span className="text-sm font-semibold tabular-nums text-neutral-300">{no}</span>
          <h1 className="min-w-0 flex-1 truncate text-sm font-semibold">{title}</h1>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-8">
        {description && (
          <p className="mb-6 text-sm text-neutral-500">{description}</p>
        )}

        {/* 완성 페이지 렌더 영역 */}
        <section className="mb-8 overflow-hidden rounded-xl border border-neutral-200">
          <Component />
        </section>

        {/* 개발 코드 복사 */}
        <CodePanel code={code} />
      </div>
    </main>
  );
}
