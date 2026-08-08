import Link from "next/link";
import { PAGES } from "./pages-registry";

const STATUS_LABEL: Record<string, string> = {
  draft: "Draft",
  review: "Review",
  final: "Final",
};

export default function IndexPage() {
  return (
    <main className="min-h-screen bg-white text-neutral-900">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <header className="mb-12 border-b border-neutral-200 pb-8">
          <p className="text-sm font-medium tracking-wide text-neutral-400">
            SK hynix · Design Handoff
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            완성 페이지 갤러리
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-neutral-500">
            아래 페이지를 클릭하면 완성된 화면을 그대로 확인하고,
            개발용 코드를 복사할 수 있습니다.
          </p>
        </header>

        <ol className="divide-y divide-neutral-100">
          {PAGES.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/pages/${p.slug}`}
                className="group flex items-center gap-5 py-5 transition-colors hover:bg-neutral-50"
              >
                <span className="w-10 shrink-0 text-lg font-semibold tabular-nums text-neutral-300 group-hover:text-neutral-900">
                  {p.no}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">{p.title}</span>
                  {p.description && (
                    <span className="mt-0.5 block truncate text-sm text-neutral-500">
                      {p.description}
                    </span>
                  )}
                </span>
                {p.status && (
                  <span className="shrink-0 rounded-full border border-neutral-200 px-2.5 py-0.5 text-xs text-neutral-500">
                    {STATUS_LABEL[p.status]}
                  </span>
                )}
                <span className="shrink-0 text-neutral-300 group-hover:translate-x-0.5 group-hover:text-neutral-900 transition-transform">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ol>

        {PAGES.length === 0 && (
          <p className="py-16 text-center text-sm text-neutral-400">
            아직 등록된 페이지가 없습니다.
          </p>
        )}
      </div>
    </main>
  );
}
