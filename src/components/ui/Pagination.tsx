'use client';

import { getPageItems } from '@/lib/pagination';

interface Props {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: Props) {
  const items = getPageItems(page, totalPages);

  return (
    <nav aria-label="Pagination" className="flex flex-wrap items-center gap-1">
      <button
        type="button"
        className="btn-secondary btn-sm"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </button>

      {items.map((item, index) =>
        item === '…' ? (
          <span key={`gap-${index}`} className="px-1 text-stone-400" aria-hidden="true">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            aria-current={item === page ? 'page' : undefined}
            onClick={() => onPageChange(item)}
            className={
              item === page
                ? 'btn-primary btn-sm min-w-8'
                : 'btn-secondary btn-sm min-w-8'
            }
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        className="btn-secondary btn-sm"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </nav>
  );
}
