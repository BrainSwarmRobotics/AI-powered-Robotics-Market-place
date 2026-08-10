import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onSearch }) {
  const [text, setText] = useState(value || '');

  useEffect(() => {
    setText(value || '');
  }, [value]);

  function handleSubmit(e) {
    e.preventDefault();
    onSearch(text.trim());
  }

  function handleClear() {
    setText('');
    onSearch('');
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md">
      <input
        type="search"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Search robots, kits, components..."
        className="h-10 w-full rounded-[var(--radius-control)] border border-neutral-200 bg-surface
          pl-9 pr-9 text-sm text-ink placeholder:text-neutral-400 outline-none
          transition-colors focus:border-accent"
      />
      <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600" />
      {text && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-ink"
        >
          <X size={14} />
        </button>
      )}
    </form>
  );
}
