import { forwardRef, useId } from 'react';

const Input = forwardRef(function Input(
  { label, error, className = '', id, ...props },
  ref
) {
  const autoId = useId();
  const inputId = id || autoId;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={`h-10 rounded-[var(--radius-control)] border bg-surface px-3 text-sm text-ink
          placeholder:text-neutral-400 outline-none transition-colors
          ${error ? 'border-danger' : 'border-neutral-200 focus:border-accent'}
          ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  );
});

export default Input;
