import { forwardRef, useId } from 'react';
import { ChevronDown } from 'lucide-react';

const Select = forwardRef(function Select(
  { label, options = [], className = '', id, ...props },
  ref
) {
  const autoId = useId();
  const selectId = id || autoId;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          className={`h-10 w-full appearance-none rounded-[var(--radius-control)] border border-neutral-200
            bg-surface pl-3 pr-9 text-sm text-ink outline-none transition-colors
            focus:border-accent ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600"
        />
      </div>
    </div>
  );
});

export default Select;
