"use client";

import { useState } from "react";

export default function CodePanel({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard 불가 환경 무시 */
    }
  };

  return (
    <div className="rounded-xl border border-neutral-200 bg-neutral-50">
      <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-2.5">
        <button
          onClick={() => setOpen((v) => !v)}
          className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
        >
          {open ? "▾ 코드 접기" : "▸ 개발 코드 보기"}
        </button>
        <button
          onClick={copy}
          className="rounded-md bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-neutral-700"
        >
          {copied ? "복사됨 ✓" : "코드 복사"}
        </button>
      </div>
      {open && (
        <pre className="max-h-[480px] overflow-auto p-4 text-xs leading-relaxed">
          <code>{code}</code>
        </pre>
      )}
    </div>
  );
}
