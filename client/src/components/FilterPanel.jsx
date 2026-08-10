import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import Dropdown from './ui/Dropdown';
import Button from './ui/Button';
import Input from './ui/Input';

/**
 * `filters` shape: { category: string, minPrice: string, maxPrice: string }
 * `onApply(filters)` is called when the user hits Apply.
 */
export default function FilterPanel({ categories = [], filters, onApply }) {
  const [draft, setDraft] = useState(filters);

  const activeCount = [filters.category, filters.minPrice, filters.maxPrice].filter(
    Boolean
  ).length;

  function handleApply(close) {
    onApply(draft);
    close();
  }

  function handleClear(close) {
    const cleared = { category: '', minPrice: '', maxPrice: '' };
    setDraft(cleared);
    onApply(cleared);
    close();
  }

  return (
    <Dropdown
      trigger={({ open }) => (
        <Button variant="secondary" size="md" className={open ? 'border-accent' : ''}>
          <SlidersHorizontal size={16} />
          Filters
          {activeCount > 0 && (
            <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-semibold text-white">
              {activeCount}
            </span>
          )}
        </Button>
      )}
    >
      {({ close }) => (
        <div className="flex w-72 flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">Category</label>
            <select
              value={draft.category}
              onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}
              className="h-10 w-full rounded-[var(--radius-control)] border border-neutral-200 bg-surface
                px-3 text-sm text-ink outline-none focus:border-accent"
            >
              <option value="">All categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">Price range (PKR)</label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="0"
                placeholder="Min"
                value={draft.minPrice}
                onChange={(e) => setDraft((d) => ({ ...d, minPrice: e.target.value }))}
                className="w-full"
              />
              <span className="text-neutral-400">–</span>
              <Input
                type="number"
                min="0"
                placeholder="Max"
                value={draft.maxPrice}
                onChange={(e) => setDraft((d) => ({ ...d, maxPrice: e.target.value }))}
                className="w-full"
              />
            </div>
          </div>

          <div className="flex justify-between gap-2 border-t border-neutral-200 pt-3">
            <Button variant="ghost" size="sm" onClick={() => handleClear(close)}>
              Clear
            </Button>
            <Button variant="primary" size="sm" onClick={() => handleApply(close)}>
              Apply
            </Button>
          </div>
        </div>
      )}
    </Dropdown>
  );
}
