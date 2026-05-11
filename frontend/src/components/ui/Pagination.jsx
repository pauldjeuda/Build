import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, total, perPage = 10, onChange }) {
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return null;

  const from = (page - 1) * perPage + 1;
  const to   = Math.min(page * perPage, total);

  const pages = [];
  const delta = 1;
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '…') {
      pages.push('…');
    }
  }

  return (
    <div className="flex items-center justify-between px-5 py-3.5 border-t border-[#E8E2D9]">
      <p className="text-xs font-sans text-obsidian-400">
        <span className="font-medium text-obsidian-700">{from}–{to}</span>
        <span className="mx-1 text-obsidian-200">/</span>
        {total}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page <= 1}
          className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg hover:bg-[#F4F1EB] disabled:opacity-30 disabled:cursor-not-allowed text-obsidian-500 transition-colors border border-transparent hover:border-[#E8E2D9]"
          aria-label="Page précédente"
        >
          <ChevronLeft size={15} />
        </button>
        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`el-${i}`} className="px-1.5 text-xs text-obsidian-300 font-sans select-none">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onChange(p)}
              className={[
                'min-w-[36px] min-h-[36px] rounded-lg text-xs font-display font-semibold transition-all',
                p === page
                  ? 'bg-obsidian-900 text-white shadow-sm'
                  : 'hover:bg-[#F4F1EB] text-obsidian-600 border border-transparent hover:border-[#E8E2D9]',
              ].join(' ')}
              aria-current={p === page ? 'page' : undefined}
            >
              {p}
            </button>
          )
        )}
        <button
          onClick={() => onChange(page + 1)}
          disabled={page >= totalPages}
          className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg hover:bg-[#F4F1EB] disabled:opacity-30 disabled:cursor-not-allowed text-obsidian-500 transition-colors border border-transparent hover:border-[#E8E2D9]"
          aria-label="Page suivante"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
