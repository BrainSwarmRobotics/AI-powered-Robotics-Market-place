import { Link } from 'react-router-dom';
import { Bot } from 'lucide-react';

export default function Categories({ categories = [], loading }) {
  if (!loading && categories.length === 0) return null;

  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold text-ink">Shop by Category</h2>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-28 w-40 shrink-0 animate-pulse rounded-[var(--radius-panel)] bg-neutral-100"
              />
            ))
          : categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                className="flex h-28 w-40 shrink-0 flex-col items-center justify-center gap-2
                  rounded-[var(--radius-panel)] border border-neutral-200 bg-surface-alt
                  transition-colors hover:border-accent"
              >
                <Bot size={22} className="text-accent" strokeWidth={1.5} />
                <span className="text-sm font-medium text-ink">{cat.name}</span>
              </Link>
            ))}
      </div>
    </section>
  );
}
