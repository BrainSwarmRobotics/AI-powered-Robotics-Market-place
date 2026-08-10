import { ChevronLeft, ChevronRight } from 'lucide-react';

function getPageNumbers(current, total) {
  // Always show first, last, current, and one neighbor each side; collapse the rest.
  const pages = new Set([1, total, current, current - 1, current + 1]);
  return [...pages]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);
}

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <nav className="flex items-center justify-center gap-1" aria-label="Pagination">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Previous page"
        className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-control)]
          border border-neutral-200 text-ink disabled:cursor-not-allowed disabled:text-neutral-400
          disabled:border-neutral-100 hover:border-accent"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((page, i) => {
        const prev = pages[i - 1];
        const showEllipsis = prev !== undefined && page - prev > 1;
        return (
          <span key={page} className="flex items-center gap-1">
            {showEllipsis && <span className="px-1 text-neutral-400">…</span>}
            <button
              type="button"
              onClick={() => onPageChange(page)}
              aria-current={page === currentPage ? 'page' : undefined}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-control)] text-sm font-medium
                ${page === currentPage ? 'bg-accent text-white' : 'text-ink hover:bg-neutral-100'}`}
            >
              {page}
            </button>
          </span>
        );
      })}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Next page"
        className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-control)]
          border border-neutral-200 text-ink disabled:cursor-not-allowed disabled:text-neutral-400
          disabled:border-neutral-100 hover:border-accent"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
